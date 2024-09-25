<!--
 * @version: 1.0.0
 * @description: 地图组件入口
 * @Author: sscaij
 * @Date: 2021-08-26 11:06:20
 * @LastEditTime: 2023-04-14 15:21:50
 * @LastEditors: renjianwu jwrenx@isstech.com
-->
<template>
  <div id="iGisMap" :class="{ showMap: showMap }">
    <!-- <div id="igisMarker" class="markerPop"></div> -->
    <!-- <el-button type="text" plain icon="el-icon-plus" @click="addIcon()"></el-button>
    <el-button type="text" plain icon="el-icon-delete"  @click="deleteIcon()"></el-button>-->
    <div class="map-floor-bar" :style="{ right: getRight + 'px' }" v-if="isIndoor">
      <p
        class="buildingName text-ellipse"
        :class="buildname.length <= 3 ? 'justify-center' : 'justify-left'"
        :title="buildname"
      >{{ buildname }}</p>
      <ul v-if="indoorData.length">
        <li class="map-prev" @click="handlePrev">
          <i class="el-icon-arrow-up"></i>
        </li>
        <li
          v-for="(item, index) in indoorData"
          :key="index"
          :class="{ active: item === currentFloor }"
        >
          <div @click="openBuildingFloor(currentBuild, item)">
            <div class="left-arrow" v-if="item === currentFloor"></div>
            <div class="right-arrow" v-if="item === currentFloor"></div>
            {{ item }}
          </div>
        </li>
        <li class="map-next" @click="handleNext">
          <i class="el-icon-arrow-down"></i>
        </li>
        <li class="last" @click="closeshinei">
          <p>
            <i class="el-icon-sort"></i>
          </p>
          <p>室外</p>
        </li>
        <li class="last" v-for="item in indoorDataB12" :key="item">
          <p @click="handleSwitchFloor(currentBuild, item.floorId)">{{ item }}</p>
        </li>
      </ul>
    </div>
    <!-- 气泡弹窗 -->
    <div id="popup" class="ol-popup" v-show="showPop">
      <el-row>
        <!-- <el-col :span="18">{{ popData.name }}</el-col> -->
        <el-col :span="18">设备描述：</el-col>
        <el-col :span="6">
          <a href="#" id="popup-close" class="ol-popup-closer"></a>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row class="font">
        <table>
          <tr>
            <td style="vertical-align: top">设备名称：</td>
            <td>5号楼东南西照</td>
          </tr>
          <tr>
            <td style="vertical-align: top">所在位置：</td>
            <td>5号楼东南西照</td>
          </tr>
          <tr>
            <td style="vertical-align: top">设备编号：</td>
            <td>08720643742408730101</td>
          </tr>
          <tr>
            <td style="vertical-align: top">设备状态：</td>
            <td>离线</td>
          </tr>
        </table>
      </el-row>
      <!-- <el-row type="flex" justify="end">
        <el-button type="primary" plain size="mini" @click="openEventDrawer"
          >查看详情</el-button
        >
      </el-row>-->
    </div>
    <!-- 视频弹窗 -->
    <el-dialog
      :visible.sync="videoShow"
      width="60%"
      lock-scroll
      center
      append-to-body
      class=""
      :destroy-on-close="true"
      >
        <div style="width: 57vw; height: 60vh">
            <VideoPlayerGroup 
                ref="videoPlayerGroup"
            />
          </div>
    </el-dialog>
  </div>
</template>

<script>
import { BuildInfo, getFloorDataByBuildId, getdeviceByFloor } from "./api";
import floorPositions from "../../../utils/map/floorCoord";
import $smartBuild from "@/api/smartBuild";
import { XYZ as XYZSource, Vector as VectorSource } from "ol/source";
import Vector from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox } from "ol/loadingstrategy.js";
import "ol/ol.css";
import { Map, View } from "ol";
// import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import { TileSuperMapRest, GetFeaturesByGeometryParameters, FeatureService } from "@supermap/iclient-ol";
import Feature from "ol/Feature";
import { Style,Stroke, Icon } from "ol/style";
import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";
import { Point, LineString, Polygon } from 'ol/geom'
export default {
  name: "appMap",
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    center: {
      type: Array,
      default: () => []
    },
    zoom: {
      type: Number,
      default: () => 18
    },
    options: {
      type: Object,
      default: () => {}
    },
    // area新加代码 发送给子组件
    getMouseLOcation: {
      type: Function,
      default: () => {}
    },
    allowShowLocationByClick: {
      type: Object,
      default: () => {}
    },
    showScaleLine: {
      type: Boolean,
      default: () => {}
    }
    // -----------------重写后的地图代码------------------
  },
  data() {
    return {
      lineSource:null,
      videoShow:false,
      lineLayer:null,
      map: null,
      deviceMap: null,
      pointSource: null,
      pointLayer: null,
      pointLayers: null,
      feature: null,
      featureStyle: null,
      popupLayer: null,
      showPop: false,
      //之前map对象
      mapObj: null,
      mapOption: null,
      // 地图级别
      mapLevel: 18,
      // 弹窗对象
      markerTips: null,
      // 图层集合
      layerObj: {},
      showMap: false,
      iconDataObj: [],
      layerIcons: {},
      // 创建线的数据
      lineCoord: [],
      // 创建线的对象
      bglingObj: {},
      beelineObj: null,
      beelinedata: null,
      indoorService: null,
      isIndoor: false,
      currentFloor: null,
      currentBuild: "",
      wfsFloor: null,
      wfsPoi: null,
      rightDistance: 8,
      buildname: "",
      // 巡更计划页面页签在新建巡更点位的时候才可以点击添加点位 标记位
      code: "",
      // 存储点位信息
      codeArr: [],
      codeId: 0,
      animation: null,
      flickerAnimation: [],
      radius: 1 / 5000000,
      steps: 100,
      refreshAlarmLayerTimer: null,
      indoorData: [],
      indoorDataB12: [],
      //feature:undefined,
      //addPointsSource:undefined,
      typeArr: {
        elevator: [],
        disabledHealthAlarm: [],
        freshAirSystem: [],
        nightlighting: [],
        barrierGate: [],
        entranceControl: [],
        boiler: [],
        lighting: [],
        airConditioning: [],
        camera: []
      },
      coordinates: [
        { x: "116.21698697595", y: "39.8664607002397" },
        { x: "116.21632637589", y: "39.8666447002391" }
      ],
			speed: 0.3,
			templayer: undefined,
      deviceLayers:[]
    };
  },
  created() {
    this.MapFontLayers = [];
    const vectorSource = new Vector({
      format: new GeoJSON(),
      loader: function(extent, resolution, projection, success, failure) {
        const proj = projection.getCode();
        const url =
          "https://ahocevar.com/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=osm:water_areas&" +
          "outputFormat=application/json&srsname=" +
          proj +
          "&" +
          "bbox=" +
          extent.join(",") +
          "," +
          proj;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        const onError = function() {
          vectorSource.removeLoadedExtent(extent);
          failure();
        };
        xhr.onerror = onError;
        xhr.onload = function() {
          if (xhr.status == 200) {
            const features = vectorSource
              .getFormat()
              .readFeatures(xhr.responseText);
            vectorSource.addFeatures(features);
            success(features);
          } else {
            onError();
          }
        };
        xhr.send();
      },
      strategy: bbox
    });
  },
  beforeDestroy() {
    if (this.isIndoor) {
      this.openOutDoorMap();
    }
    // this.mapObj.removeLayer()
    this.mapObj.destroyMap(false);
    this.mapObj = null;
    this.beelineObj = null;
    this.MapFontLayers = null;
  },
  watch: {
    // isIndoor(newVal) {
    // 	if (newVal) {
    // 		document.getElementById('floorInfo').style.right = '-100px'
    // 	}
    // },
    allowShowLocationByClick: {
      handler(val, oldval) {
        if (val && val.delMap) {
          if (this.layerObj["locationPoint"]) {
            this.clearPoint("locationPoint");
          }
        }
        if (val && !val.delMap) {
          if (val.e[0] != "") {
            setTimeout(() => {
              let e = [Number(val.e[0]), Number(val.e[1])];
              let iconDataObj = [
                {
                  id: Math.random() * 1000000,
                  src: "/images/theme/dark/map/position_red.png",
                  label: "111",
                  coord: e
                }
              ];
              this.addMarket(iconDataObj, "locationPoint");
            }, 500);
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    getRight() {
      const _rightDistance = this.$store.getters.getRightStyle
        ? this.$store.getters.getRightStyle
        : 0;
      return _rightDistance + this.rightDistance;
    },
    getIsManualClick() {
      return this.$store.getters.getIsManualClick;
      // return true
    }
  },
  mounted() {
    this.getDevice();
    // localStorage.setItem('wxsServerAddress', window.systemConfig.MAP_BASE_URL)
    // localStorage.setItem('wxsServerAddress', "/gisMapApi/com.cloud.isoft.wxs.service")
    // this.initGisMap()
    this.initMap();
    // this.addWFSServer();
  },
  methods: {
    /**
     * 初始化地图函数（严格来讲，此方法最好形成为单例模式）
     * @param
     *
     **/
    //温泉超图
    initMap() {
      let url = process.env.VUE_APP_GIS_CT + "/iserver/services/map-WQKJY002-2/rest/maps/Black_outdoor_map_cn";
      // 初始化地图信息
      this.mapObj = new window.iGis.GisMap();
      this.map = new Map({
        target: "iGisMap", //对应div容器的id
        view: new View({
          center: [116.20212412857583, 40.05089161432351], //地图中心点
          zoom: 18.6, //缩放层级
          projection: "EPSG:4326" //坐标系
        })
      });

      // 添加图层
      let layer = new TileLayer({
        source: new TileSuperMapRest({
          url: url, //地图服务地址
          wrapX: true //是否在地图水平坐标轴上重复
        }),
        projection: "EPSG:4326" //坐标系
      });

      this.map.addLayer(layer); //添加图层到地图
      setTimeout(() => {
        this.map.updateSize(); //地图适配div容器
      }, 100);
      var container = document.getElementById("popup");
      this.popupLayer = new Overlay({
        element: container,
        autuPan: true
      });
      this.popupLayer.setPosition(undefined);
      // 将popupLayer层添加到map当中
      this.map.addOverlay(this.popupLayer);

      //定义一个数据来源，用于添加Feature
      this.pointSource = new VectorSource({
        wrapX: false,
        features: []
      });
      this.pointLayer = new VectorLayer({
        source: this.pointSource
      });
			this.map.addLayer(this.pointLayer); //添加图层到地图

			// 数据服务地址
      // let dataUrl = process.env.VUE_APP_GIS_CT + "/iserver/services/data-areaJ/rest/data"
      // http://125.69.0.17:8091/iserver/manager/services/data-WQKJY002/rest/data
      let dataUrl = process.env.VUE_APP_GIS_CT + "/iserver/services/data-WQKJY002-2/rest/data"

			//地图点击事件，获取点击处的经纬度进行空间查询，查询数据集中与当前点击处点存在包含关系的要素
      this.map.on("click", (evt) => {
				console.log(evt,'evt')
        let x = evt.coordinate[0];//获取点击处的经度
        let y = evt.coordinate[1];//获取点击处的纬度
        var point = new Point([x,y]);//构造点几何图形
        var geometryParam = new GetFeaturesByGeometryParameters({
            datasetNames: ["outdoor_data:MainBuildings"],//查询的数据源：数据集（固定，无需修改）
            geometry: point,//查询几何
            spatialQueryMode: "WITHIN"//查询条件
        });
        new FeatureService(dataUrl).getFeaturesByGeometry(geometryParam, (serviceResult) => {
          if(serviceResult.result.features.features.length>0){
            this.isIndoor = true;
            let feature = serviceResult.result.features.features[0]
            this.buildname = feature.properties.C_NAME
            this.currentBuild = feature.properties.BUILDINGID.replace(/Z/g, "")
            this.indoorData = feature.properties.FLOORLIST.split(",").reverse()//获取楼层列表
            this.currentFloor = this.currentFloor ? this.currentFloor : this.indoorData[this.indoorData.length - 1]
            this.openBuildingFloor(this.currentBuild,this.currentFloor)
          }else{
            this.isIndoor = false
            this.currentFloor = null
            this.buildname = ''
            this.indoorData = []
          }
        });
      })
		},

		/**
		 * 打开室内地图
		 */
		openBuildingFloor(buildingId,floorId){
			if(this.templayer){
				this.map.removeLayer(this.templayer)//移除上一个室内地图图层
			}
			//室内地图服务地址，地图名称为Black_floor_map_{楼层id}_{楼栋id}_cn
			let url2 = `${process.env.VUE_APP_GIS_CT}/iserver/services/map-WQKJY002-4/rest/maps/Black_floor_map_${buildingId}_${floorId}_cn`
			// 添加室内地图图层
			this.templayer = new TileLayer({
					source: new TileSuperMapRest({
							url: url2,//室内地图服务地址
							wrapX: true//是否在地图水平坐标轴上重复
					}),
					projection: 'EPSG:4326'//坐标系
      });
      this.currentFloor = floorId
			this.map.addLayer(this.templayer);//添加室内地图图层到地图
    },
    
    /**
     * 向上切换楼层信息
     */
    handlePrev() {
      let _tempFloorNum = 0;
      this.indoorData.forEach((item, index) => {
        if (item === this.currentFloor) {
          _tempFloorNum = index;
        }
      });
      if (_tempFloorNum - 1 >= 0) {
        const prevFloor = this.indoorData[_tempFloorNum - 1];
        this.openBuildingFloor(this.currentBuild, prevFloor);
      }
    },
    /**
     * 向下切换楼层信息
     */
    handleNext() {
      let _tempFloorNum = 0;
      this.indoorData.forEach((item, index) => {
        if (item === this.currentFloor) {
          _tempFloorNum = index;
        }
      });
      if (_tempFloorNum + 1 < this.indoorData.length) {
        const nextFloor = this.indoorData[_tempFloorNum + 1];
        this.openBuildingFloor(this.currentBuild, nextFloor);
      }
    },

		/**
		 * 关闭室内地图
		 */
		closeshinei(){
			if(this.templayer){
        this.map.removeLayer(this.templayer)//移除室内地图
        this.isIndoor = false
        this.currentFloor = null
        this.buildname = ''
        this.indoorData = []
			}
    },
    
    
	//  挂在设备打点
		addDeviceInfo(arr){
      //debugger
      let that = this;
      // var urls = process.env.VUE_APP_GIS_CT + "/iserver/services/map-WQKJY002-2/rest/maps/Black_outdoor_map_cn";
      // // 初始化地图信息
      // that.deviceMap = new Map({
      //   target: "iGisMap", //对应div容器的id
      //   view: new View({
      //     center: [116.20212412857583, 40.05089161432351], //地图中心点
      //     zoom: 18.6, //缩放层级
      //     projection: "EPSG:4326" //坐标系
      //   })
      // });

      // 添加图层
      // var layer = new TileLayer({
      //   source: new TileSuperMapRest({
      //     url: urls, //地图服务地址
      //     wrapX: true //是否在地图水平坐标轴上重复
      //   }),
      //   projection: "EPSG:4326" //坐标系
      // });

      // that.deviceMap.addLayer(layer); //添加图层到地图
      // setTimeout(() => {
      //   that.deviceMap.updateSize(); //地图适配div容器
      // }, 100);
      if(!arr.length){
        that.clearDeviceLayer();
        return false
      }
			//创建一个点Feature
			var feature;
			let featureStyle = new Style({
				image: new Icon(({
					src: require("@/assets/images/mapImg/sxt.png"),//设置点图标的图片
					scale: 1.0,//缩放比例
					anchor:[0.5,1],//图片中心
				}))
			});
			arr.forEach(item=>{
				//定义一个数据来源，用于添加Feature
				that.pointSource = new VectorSource({
					wrapX: true,
					features: []
				})
				that.pointLayers = new VectorLayer({
					source: that.pointSource
				})
				//创建一个点Feature
				feature = new Feature({
					geometry: new Point([Number(item.longitude),Number(item.latitude)]),
					deviceName: item.deviceName,
					cameraType: item.cameraType,
					deviceTypeStr: item.deviceTypeStr,
					deviceAddress: item.deviceAddress,
					code: item.code,
          deviceCode:item.deviceCode,
          beginTime: item.beginTime,
          endTime: item.endTime,
          cameraId: item.cameraId,
          name: item.name
				})
        // console.log(typeof that.pointLayers,"that.pointLayers")
        that.deviceLayers.push(that.pointLayers)
				that.map.addLayer(that.pointLayers);//添加图层到地图
				feature.setStyle(featureStyle);//设置点的样式
				that.pointSource.addFeature(feature);//将Feature加到source内  
			})
      that.map.on('pointermove', function(e){
        // e.stopPropagation();
        const clickedCoordinate = e.coordinate;
        let features = that.map.forEachFeatureAtPixel(e.pixel, feature => feature);
        if (features.get('deviceName')) {
          var container = document.getElementById('popup')
          that.popupLayer = new Overlay({
            element: container,
            autuPan: true,
            positioning: 'bottom', // 弹窗在要素下方居中显示
            stopEvent: true, // 允许点击弹窗
            offset: [0, 0] // 弹窗的偏移量，可根据需要调整
          })
          that.showPop = true;
          const deviceInfo = `
            <div><a href="#" id="popup-close" class="ol-popup-closer"></a></div>
            <div style='padding:10px 0'></div>
            <p>设备名称：${features.get('deviceName')}</p>
            <p>设备编码：${features.get('code')}</p>
            <p>设备地址：${features.get('deviceAddress')}</p>
            <p>设备类型：${features.get('deviceTypeStr')}</p>
            <p>摄像头主次：${features.get('name')}</p>
            <div style="text-align: center;">
              <button class="el-button el-button--primary el-button--small preview">查看视频</button>
            </div>
          `;
          that.popupLayer.setPosition(clickedCoordinate);
          // 将popupLayer层添加到map当中
          that.map.addOverlay(that.popupLayer)
          that.popupLayer.getElement().innerHTML = deviceInfo;
          let popupCloser = document.getElementById('popup-close')
          // 关闭弹窗
          popupCloser.addEventListener('click', () => {
            that.popupLayer.setPosition(undefined)
          })
          document.getElementsByClassName("preview")[0].addEventListener("click", (e) => {
            that.videoShow = true;
            let cameraInfo = {
              cameraId: features.get('deviceCode'),
              cameraName: features.get('deviceName'),
              isPTZControlVisible: false,
              beginTime: features.get('beginTime'),
              endTime: features.get('endTime'),
            }
            if(features.get('beginTime')){
              setTimeout(()=>{
                that.$refs['videoPlayerGroup'].playVideoBack(cameraInfo)
              },500)
            }else{
              setTimeout(()=>{
                that.$refs['videoPlayerGroup'].playRealVideo(cameraInfo)
              },500)
            }
          })
        }
      });
		},
		
    // 展示楼层信息
    showFloorName() {
      let textMarks = [];
      floorPositions.map(position => {
        textMarks.push({
          id: position.id,
          coord: [+position.longitude, +position.latitude],
          fillColor: "red",
          labRotation: -38,
          glyph: "",
          lalFontSize: "12px",
          label: position.label,
          options: position
        });
      });
      this.addTextLayer("floor-name", textMarks);
    },
    /***
     *
     * 只添加文字图层
     * @param rotation 字体图层旋转
     * @param labRotation 字体图层旋转角度
     */
    addTextLayer(
      layerId = "basefont-layer",
      marker = [],
      click,
      minShowZoom = 6) {
      if (this.MapFontLayers[layerId]) {
        this.removeFontLayer(layerId);
      }
      if (!marker.length) {
        return;
      }
      const option = {
        gisMapObj: this.mapObj,
        callBackFun: function(param) {
          param.currObj.setData(marker, param.seq);
        },
        layerOptions: {
          radius: 50,
          rotation: 100,
          minShowZoom: minShowZoom,
          // lalFontSize: '18px',
          // fillColor: "#000",
          labRotation: 100,
          labFillColor: "#000"
        }
      };
      let fontLayerObj = new iGis.layers.FontLayer(option);
      this.MapFontLayers[layerId] = fontLayerObj;
      fontLayerObj.setZIndex(99);
      // console.log(fontLayerObj, 'fontLayerObj')
      if (click && typeof click === "function") {
        // 鼠标点击事件
        fontLayerObj.addClickEvent(function(e) {
          const _marker = e.feature.values_.property;
          click({ layerId: layerId, marker: _marker });
        });
      }
    },
    // 移出字体图层
    removeFontLayer(layerId) {
      if (this.MapFontLayers[layerId]) {
        this.MapFontLayers[layerId].cleanSource();
        this.mapObj.removeLayer(this.MapFontLayers[layerId]);
        this.MapFontLayers[layerId] = null;
        delete this.MapFontLayers[layerId];
      }
    },
    //画轨迹的事件
    addLineFeature(Array){
			let pointsData = Array;
			//定义一个数据来源，用于添加Feature
			this.lineSource = new VectorSource({
				wrapX: false,
				features: []
			})
			this.lineLayer = new VectorLayer({
				source: this.lineSource
			})
			this.map.addLayer(this.lineLayer);//添加图层到地图
			//构造一个线feature
			var feature = new Feature({
				type: "lineStyle",
				geometry: new LineString(
					pointsData // 自定义的点串
				),
			});
			//创建一个线样式
			let lineStyle = new Style({
				stroke: new Stroke({
					color: 'red',
					width: 4,
				}),
			});
			feature.setStyle(lineStyle);//设置线的样式      
			this.lineSource.addFeature(feature);// 添加线的fature
			this.$emit("addLineFeature")
		},
    // 设置地图级别
    setMapLevel(level) {
      this.mapObj.setMapZoom(level);
    },
    versionSwitch() {
      this.mapObj.createMap(this.mapOption);
    },
    // 图层隐藏显示方法 true：显示、false：隐藏
    showLayer(layerName, bool) {
      this.layerObj[layerName] && this.layerObj[layerName].setVisible(bool);
    },
    hideLayer(layerName, bool) {
      this.layerObj[layerName] && this.layerObj[layerName].setVisible(bool);
    },
    // 移除设备打点
    clearDeviceLayer(){
      this.deviceLayers.forEach(item=>{
        this.map.removeLayer(item);
      })
    },
    clearLayer() {
			 //移除图层
       this.map.removeLayer(this.pointLayer)
      // this.deleteLine();
      // if (type && id) {
      //   this.typeArr[type].forEach((item, index) => {
      //     if (item.id === id) {
      //       this.typeArr[type].splice(index, 1);
      //     }
      //   });
      //   Object.keys(this.typeArr).map(layerName => {
      //     this.clearPoint(layerName);
      //     this.addMarket(this.typeArr[layerName], layerName);
      //   });
      // } else {
      //   Object.keys(this.layerObj).map(layerName => {
      //     this.clearPoint(layerName);
      //   });
      // }
    },
    allClearLayer() {
      this.typeArr = {
        elevator: [],
        disabledHealthAlarm: [],
        freshAirSystem: [],
        nightlighting: [],
        barrierGate: [],
        entranceControl: [],
        boiler: [],
        lighting: [],
        airConditioning: [],
        camera: []
      };
      Object.keys(this.layerObj).map(layerName => {
        this.clearPoint(layerName);
      });
    },
    /**
     * 移除图层
     * @param {layerName}图层名称（ID)
     * **/
    clearPoint(layerName) {
      if (this.layerObj[layerName]) {
        this.layerObj[layerName].cleanSource();
        this.mapObj.removeLayer(this.layerObj[layerName]);
        this.layerObj[layerName] = null;
        delete this.layerObj[layerName];
      }
    },
    // 居中方法
    location(point) {
      this.mapObj.setMapCenter(point);
    },
    // 清除线条
    deleteLine() {
      if (this.beelineObj) {
        this.lineCoord = [];
        // this.beelineObj.removeFeatureById('line1')
        this.beelineObj.removeFeatureById("line1", true);
        this.beelineObj = null;
      }
      // this.lineCoord = []
      // this.beelineObj.refreshLayerByData();
    },
    /****
     * 地图划线
     * @param {strokeWidth：String}线宽
     * @param {arrowType：Sting}0(无箭头), 1(空心箭头), 其他数字(实心箭头)
     * @param {lineDash：String}虚线间隔
     * @param {strokeWidth：String}线宽
     * ***/
    creatPointObj({
      strokeWidth = 6,
      arrowType = 2,
      lineDash = [],
      strokeColor = "#0090ff"} = {}) {
      var beelinedata = [
        {
          id: "line1",
          strokeWidth: strokeWidth,
          lineDash: lineDash,
          arrowType: arrowType,
          strokeColor: strokeColor,
          coord: this.lineCoord
        }
      ];
      //创建线的对象
      this.beelineObj = new iGis.layers.LineLayer({
        gisMapObj: this.mapObj,
        callBackFun: param => {
          param.currObj.setData(beelinedata, param.seq);
        },
        layerOptions: {
          isDirect: true,
          strokeWidth: 10,
          lalFontSize: "14px",
          labFillColor: "#0090ff",
          labStrokeWidth: 10,
          labStrokeColor: "#0090ff"
        }
      });
    },

    createLineObj({
      id = "",
      strokeWidth = 6,
      arrowType = 2,
      lineDash = [],
      strokeColor = "#0090ff",
      layerName = "default",
      opacity = 1} = {}) {
      var beelinedata = [
        {
          id: id,
          strokeWidth: strokeWidth,
          lineDash: lineDash,
          arrowType: arrowType,
          strokeColor: strokeColor,
          coord: this.lineCoord
        }
      ];
      //创建线的对象
      this.bglingObj[layerName] = new iGis.layers.LineLayer({
        gisMapObj: this.mapObj,
        callBackFun: param => {
          param.currObj.setData(beelinedata, param.seq);
        },
        layerOptions: {
          isDirect: true,
          strokeWidth: 10,
          lalFontSize: "14px",
          labFillColor: "#0090ff",
          labStrokeWidth: 10,
          labStrokeColor: "#0090ff"
        }
      });
      this.bglingObj[layerName].setOpacity(opacity);
    },
    connectionPoint2(info, layerName) {
      if (info.length > 1) {
        info.forEach((item, index) => {
          this.lineCoord[index] = item;
        });
        this.bglingObj[layerName].refreshLayerByData();
      }
    },
    deleteLineByLayerNames(data) {
      data.forEach(item => {
        if (this.bglingObj[item.layerName]) {
          this.lineCoord = [];
          // this.beelineObj.removeFeatureById('line1')
          this.bglingObj[item.layerName].removeFeatureById(item.id, true);
          this.bglingObj[item.layerName] = null;
        }
      });
    },
    // 点与点连线的方法
    connectionPoint(info) {
      if (info.length > 1) {
        info.forEach((item, index) => {
          this.lineCoord.push(item);
        });
        this.beelineObj.refreshLayerByData();
      }
    },
    // 设置线的层级level 数字
    setLineIndex(level) {
      if (this.beelineObj) {
        this.beelineObj.setZIndex(level);
      }
    },
    // 设置图标的层级level 数字
    setIconIndex(layerName, level) {
      if (this.layerObj && this.layerObj[layerName]) {
        this.layerObj[layerName].setZIndex(level);
      }
    },
    /**
     * 添加图标
     * @param fontSize 字体大小
     * @param fontColor 字体颜色
     * @param labOffsetX 字体X偏移
     * @param labOffsetY 字体Y偏移
     * @param isEmit 是否向外抛出点击事件
     *
     * **/

    addMarket(
      iconList,
      layerName,
      {
        fontSize = "14px",
        fontColor = "#fff",
        labOffsetX = 0,
        labOffsetY = 0,
        isEmit = true,
        zIndex = 0,
        eventName = ""
      } = {}) {
      // 点位信息、图层名称
      this.iconDataObj = iconList;
      this.layerIcons[layerName] = this.iconDataObj;
      if (this.layerObj[layerName]) {
        this.layerObj[layerName].refreshLayerByData();
      } else {
        this.layerObj[layerName] = new window.iGis.layers.IconLayer({
          gisMapObj: this.mapObj,
          isRef: true,
          isHover: false,
          layerOptions: {
            isBox: false,
            selSrc: "",
            anchor: [30, 24]
          }
        });
        this.layerObj[layerName].setData(this.layerIcons[layerName], 0);
        this.layerObj[layerName].refreshLayerByData();
      }
      // || (layerName === 'airConditioning' && accessPartyCode === "IOT")
      if (
        layerName === "elevator" ||
        layerName === "disabledHealthAlarm" ||
        layerName === "boiler" ||
        layerName === "airConditioning"
      ) {
        // 车辆道闸
        this.layerObj[layerName].addClickEvent(e => {
          this.$emit("deviceInfo", e.feature.getProperties().property);
          if (e.feature.getProperties().property.deviceId) {
            if (e.feature.getProperties().property.accessPartyCode == "IBMS") {
              let content = `<div title="${
                e.feature.getProperties().property.deviceName
              }">设备名称：${
                e.feature.getProperties().property.deviceName
              }</div>
							<div title="${e.feature.getProperties().property.deviceAddress ||
                e.feature.getProperties().property.deviceAddress
                  .address}">所在位置：${e.feature.getProperties().property
                .deviceAddress ||
                e.feature.getProperties().property.deviceAddress.address}</div>
							<div title="${e.feature.getProperties().property.deviceCode}">设备编号：${
                e.feature.getProperties().property.deviceCode
              }</div>
							<div style="text-align: center;">
								<button class="el-button el-button--primary el-button--small preview">开启</button>
								<button class="el-button el-button--primary el-button--small preview1">关闭</button>
								<button class="el-button el-button--primary el-button--small device">设备画像</button>
							</div>`;
              this.addPopup([], e.feature.getProperties().property, content);
            } else {
              let content = `<div title="${
                e.feature.getProperties().property.deviceName
              }">设备名称：${
                e.feature.getProperties().property.deviceName
              }</div>
							<div title="${e.feature.getProperties().property.deviceAddress ||
                e.feature.getProperties().property.deviceAddress
                  .address}">所在位置：${e.feature.getProperties().property
                .deviceAddress ||
                e.feature.getProperties().property.deviceAddress.address}</div>
							<div title="${e.feature.getProperties().property.deviceCode}">设备编号：${
                e.feature.getProperties().property.deviceCode
              }</div>
							<div style="text-align: center;">
								<button class="el-button el-button--primary el-button--small device">设备画像</button>
							</div>`;
              this.addPopup([], e.feature.getProperties().property, content);
            }
          }
        });
      } else if (layerName === "camera") {
        // 为camera图标增加点击事件
        this.layerObj[layerName].addClickEvent(e => {
          this.$emit("deviceInfo", e.feature.getProperties().property);
          if (e.feature.getProperties().property.deviceId) {
            let content = `<div title="${
              e.feature.getProperties().property.deviceName
            }">设备名称：${e.feature.getProperties().property.deviceName}</div>
						<div title="${e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property
                .address}">所在位置：${e.feature.getProperties().property
              .deviceAddress ||
              e.feature.getProperties().property.address}</div>
						<div title="${e.feature.getProperties().property.deviceCode}">设备编号：${
              e.feature.getProperties().property.deviceCode
            }</div>
						<div>设备状态：${
              e.feature.getProperties().property.onlineStatus
                ? "在线"
                : e.feature.getProperties().property.onlineStatus == undefined
                ? "告警 "
                : "离线"
            }</div>`;

            if (e.feature.getProperties().property.onlineStatus !== undefined) {
              if (e.feature.getProperties().property.deviceType === "camera") {
                content += `<div style="text-align: center;">
									<button class="el-button el-button--primary el-button--small preview">实时预览</button>
									<button class="el-button el-button--primary el-button--small device">设备画像</button>
								</div>`;
              } else {
                content += `<div style="text-align: center;">
									<button class="el-button el-button--primary el-button--small preview">设备控制</button>
									<button class="el-button el-button--primary el-button--small device">设备画像</button>
								</div>`;
              }
            }

            this.addPopup([], e.feature.getProperties().property, content);
          }
        });
      } else if (layerName === "barrierGate") {
        this.layerObj[layerName].addClickEvent(e => {
          this.$emit("deviceInfo", e.feature.getProperties().property);
          if (e.feature.getProperties().property.deviceId) {
            let content = `<div title="${
              e.feature.getProperties().property.deviceName
            }">设备名称：${e.feature.getProperties().property.deviceName}</div>
						<div title="${e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.deviceAddress
                .address}">所在位置：${e.feature.getProperties().property
              .deviceAddress ||
              e.feature.getProperties().property.deviceAddress.address}</div>
						<div title="${e.feature.getProperties().property.deviceCode}">设备编号：${
              e.feature.getProperties().property.deviceCode
            }</div>
						<div style="text-align: center;">
							<button class="el-button el-button--primary el-button--small preview">抬杆</button>
							<button class="el-button el-button--primary el-button--small device">设备画像</button>
						</div>`;

            this.addPopup([], e.feature.getProperties().property, content);
          }
        });
      } else if (layerName === "entranceControl") {
        this.layerObj[layerName].addClickEvent(e => {
          this.$emit("deviceInfo", e.feature.getProperties().property);
          if (e.feature.getProperties().property.deviceId) {
            let content = `<div title="${
              e.feature.getProperties().property.deviceName
            }">设备名称：${e.feature.getProperties().property.deviceName}</div>
						<div title="${e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.deviceAddress
                .address}">所在位置：${e.feature.getProperties().property
              .deviceAddress ||
              e.feature.getProperties().property.deviceAddress.address}</div>
						<div title="${e.feature.getProperties().property.deviceCode}">设备编号：${
              e.feature.getProperties().property.deviceCode
            }</div>
						<div style="text-align: center;">
							<button class="el-button el-button--primary el-button--small preview">开启</button>
							<button class="el-button el-button--primary el-button--small device">设备画像</button>
						</div>`;

            this.addPopup([], e.feature.getProperties().property, content);
          }
        });
      } else {
        this.layerObj[layerName].addClickEvent(e => {
          this.$emit("deviceInfo", e.feature.getProperties().property);
          if (e.feature.getProperties().property.deviceId) {
            let content = `<div title="${
              e.feature.getProperties().property.deviceName
            }">设备名称：${e.feature.getProperties().property.deviceName}</div>
						<div title="${e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.deviceAddress
                .address}">所在位置：${e.feature.getProperties().property
              .deviceAddress ||
              e.feature.getProperties().property.deviceAddress.address}</div>
						<div title="${e.feature.getProperties().property.deviceCode}">设备编号：${
              e.feature.getProperties().property.deviceCode
            }</div>
						<div style="text-align: center;">
							<button class="el-button el-button--primary el-button--small preview">开启</button>
							<button class="el-button el-button--primary el-button--small preview1">关闭</button>
							<button class="el-button el-button--primary el-button--small device">设备画像</button>
						</div>`;

            this.addPopup([], e.feature.getProperties().property, content);
          }
        });
      }
    },
    // 地图设备控制
    getDeviceControl(obj, objData, isClose) {
      $smartBuild.getDeviceControl(obj, objData).then(res => {
        if (isClose) {
          this.$message.success("开启成功");
        } else {
          this.$message.success("关闭成功");
        }
      });
    },
    /**
     * 添加提示框
     * @param offset 偏移量
     * @param position 位置
     * @param content html元素
     */
    addPopup(offset, deviceInfo, content) {
      this.removePopup();
      let popupOuter = document.createElement("div");
      popupOuter.className = "markerPop";
      popupOuter.innerHTML = content;
      this.markerTips = new iGis.maptools.MapTips({
        gisMapObj: this.mapObj,
        element: popupOuter,
        // offset: offset,
        positioning: "center"
      });
      this.markerTips.setPosition(deviceInfo.coord);
      let obj = {
        url: "/pm/ibms/device/control",
        method: "POST"
      };
      // 设备控制
      if (document.getElementsByClassName("preview")[0]) {
        document
          .getElementsByClassName("preview")[0]
          .addEventListener("click", () => {
            if (deviceInfo.deviceType === "camera") {
              this.$router.push({ name: "GIS", query: deviceInfo });
            } else if (deviceInfo.deviceType === "freshAirSystem") {
              // this.$router.push('/newTrend')
              let objData = [
                {
                  id: deviceInfo.tagId,
                  systemType: "FRESHAIRSYSTEM",
                  type: 0,
                  value: true
                }
              ];
              this.getDeviceControl(obj, objData, true);
            } else if (deviceInfo.deviceType === "nightlighting") {
              // this.$router.push('/nightlighting')
              let objData = [{ deviceCode: deviceInfo.code, type: 1 }];
              // this.getDeviceControl(obj,objData,true)
              $smartBuild.contralNightloght(objData).then(res => {
                this.$message.success("开启成功");
              });
            } else if (deviceInfo.deviceType === "barrierGate") {
              // this.$router.push('/cardControl')
              let objData = { channelId: deviceInfo.code, controlType: "3" };
              $smartBuild.getDeviceControls(objData).then(res => {
                this.$message.success("抬杆成功");
              });
              // this.getDeviceControl(obj,objData,true)
            } else if (deviceInfo.deviceType === "entranceControl") {
              // this.$router.push('/acsControl')
              let datas = {
                channelId: deviceInfo.channelId,
                controlStatus: "OPEN",
                stationNo: data.stationNo
              };
              $smartBuild.openDoor(datas).then(res => {
                this.$message.success("开门成功");
              });
            } else if (deviceInfo.deviceType === "lighting") {
              // this.$router.push('/intellectLight')
              let objData = [
                {
                  id: deviceInfo.tagId,
                  systemType: "LIGHTING",
                  type: 0,
                  value: true
                }
              ];
              this.getDeviceControl(obj, objData, true);
            } else if (deviceInfo.deviceType === "airConditioning") {
              // this.$router.push('/intellectCondite')
              let objData = [
                {
                  id: deviceInfo.tagId,
                  systemType: "AIRCONDITIONING",
                  type: 0,
                  value: true
                }
              ];
              this.getDeviceControl(obj, objData, true);
            }
          });
      }
      if (document.getElementsByClassName("preview1")[0]) {
        document
          .getElementsByClassName("preview1")[0]
          .addEventListener("click", () => {
            if (deviceInfo.deviceType === "camera") {
              this.$router.push({ name: "GIS", query: deviceInfo });
            } else if (deviceInfo.deviceType === "freshAirSystem") {
              // this.$router.push('/newTrend')
              let objData = [
                {
                  id: deviceInfo.tagId,
                  systemType: "FRESHAIRSYSTEM",
                  type: 0,
                  value: false
                }
              ];
              this.getDeviceControl(obj, objData, false);
            } else if (deviceInfo.deviceType === "nightlighting") {
              // this.$router.push('/nightlighting')
              let objData = [{ deviceCode: deviceInfo.code, type: 0 }];
              $smartBuild.contralNightloght(objData).then(res => {
                this.$message.success("开启成功");
              });
            }
            // if(deviceInfo.deviceType === 'barrierGate'){
            // 	this.$router.push('/cardControl')
            // }else
            else if (deviceInfo.deviceType === "entranceControl") {
              // this.$router.push('/acsControl')
              let datas = {
                channelId: deviceInfo.channelId,
                controlStatus: "CLOSE",
                stationNo: deviceInfo.stationNo
              };
              $smartBuild.openDoor(datas).then(res => {
                this.$message.success("关门成功");
              });
            } else if (deviceInfo.deviceType === "lighting") {
              // this.$router.push('/intellectLight')
              let objData = [
                {
                  id: deviceInfo.tagId,
                  systemType: "LIGHTING",
                  type: 0,
                  value: false
                }
              ];
              this.getDeviceControl(obj, objData, false);
            } else if (deviceInfo.deviceType === "airConditioning") {
              // this.$router.push('/intellectCondite')
              let objData = [
                {
                  id: deviceInfo.tagId,
                  systemType: "AIRCONDITIONING",
                  type: 0,
                  value: false
                }
              ];
              this.getDeviceControl(obj, objData, false);
            }
          });
      }
      // 设备画像
      if (document.getElementsByClassName("device")[0]) {
        document
          .getElementsByClassName("device")[0]
          .addEventListener("click", () => {
            this.$router.push(
              "/information/deviceDraw/index/" + deviceInfo.deviceId
            );
          });
      }
      // 删除
      // if(document.getElementsByClassName('del')[0]){
      // 	document.getElementsByClassName('del')[0].addEventListener('click', ()=>{
      // 		this.clearLayer(deviceInfo.deviceType,deviceInfo.deviceId)
      // 	})
      // }
    },
    /**
     * 删除提示框
     */
    removePopup() {
      if (this.markerTips) {
        // debugger
        this.markerTips.removeMapTips();
        // this.markerTips = null
      }
    },
    // 设置波纹动画
    setFlickerBurst(pointDataObj, center, radius, steps, target) {
      if (!this.animation) {
        return null;
      }
      const arrChange = [];
      var incioudAgain = [];
      var setSpreadObj = this.animation.startSpreadAnimation(center, radius);
      arrChange.push(setSpreadObj);
      var circle = iGis.util.GisUtil.circle(center, radius, steps);
      var incloud = iGis.util.GisUtil.pointsWithinPolygon(pointDataObj, circle);
      for (var i = 0; i < incloud.length; i++) {
        incioudAgain.push(incloud[i].id);
      }
      target.startTwinkleFea(incioudAgain);
      return incioudAgain;
    },

    /**
     * 单独Function(非实时告警需求，勿动此方法)
     * 添加实时告警图层
     */
    addAlarmLayer(alarmList = []) {
      if (alarmList.length <= 0) {
        return;
      }
      this.layerIcons.alarmList = alarmList.map(i => {
        return {
          ...i,
          coord: [i.lng * 1, i.lat * 1],
          src: `/images/alarm/${i.alarmLevelColor}_00001(1).png`
        };
      });
      if (!this.layerObj.alarmList) {
        this.layerObj.alarmList = new window.iGis.layers.IconLayer({
          gisMapObj: this.mapObj,
          isRef: true,
          isHover: false,
          callBackFun: param => {
            param.currObj.setData(this.layerIcons.alarmList, param.seq);
          },
          layerOptions: {
            isBox: false,
            selSrc: "",
            anchor: [0, 0],
            labOffsetX: 10,
            labOffsetY: 10
          }
        });
      }

      this.layerObj.alarmList.refreshLayerByData();
      this.layerObj.alarmList.setZIndex(9);
      this.$nextTick(() => {
        let index = 2;
        if (this.refreshAlarmLayerTimer) {
          clearInterval(this.refreshAlarmLayerTimer);
          this.refreshAlarmLayerTimer = null;
        }
        this.refreshAlarmLayerTimer = setInterval(() => {
          const refreshAlarmList = alarmList.map(i => {
            return {
              ...i,
              coord: [i.lng * 1, i.lat * 1],
              src: `/images/alarm/${i.alarmLevelColor}_00001(${index}).png`
            };
          });
          this.refreshAlarmLayer(refreshAlarmList);
          if (index === 38) {
            index = 1;
          } else {
            index += 1;
          }
        }, 46);
        this.$once("hook:beforeDestroy", () => {
          clearInterval(this.refreshAlarmLayerTimer);
        });
      });
    },
    /**
     * 单独Function(非实时告警需求，勿动此方法)
     * 刷新实时告警图层
     */
    refreshAlarmLayer(alarmList = []) {
      if (alarmList.length <= 0) {
        return;
      }
      this.layerIcons.alarmList = alarmList;
      this.layerObj.alarmList.refreshLayerByData();
    },
    /**
     * 单独Function(非实时告警需求，勿动此方法)
     * 移除实时告警图层(添加之前应该执行一次次方法)
     */
    removeAlarmLayer() {
      if (
        this.layerIcons.alarmList &&
        this.layerIcons.alarmList.length > 0 &&
        this.layerObj.alarmList
      ) {
        this.layerIcons.alarmList = [];
        this.layerObj.alarmList.refreshLayerByData();
        clearInterval(this.refreshAlarmLayerTimer);
        this.refreshAlarmLayerTimer = null;
      }
    },

    // 改变点位图片
    changeUrl(id, layerName, iconObj) {
      for (let i = 0; i < this.iconDataObj.length; i++) {
        if (this.iconDataObj[i].id === id) {
          if (this.iconDataObj[i].src === "/images/theme/dark/map/camera.png") {
            iconObj.selected = true;
            this.iconDataObj[i].src = "/images/map/camera/camera_red.png";
            // this.iconDataObj[i].src = '/images/theme/dark/map/camera_select.png'
          } else {
            iconObj.selected = false;
            this.iconDataObj[i].src = "/images/theme/dark/map/camera.png";
          }

          // 巡更计划根据是否选中展示巡更摄像机列表
          if (layerName === "camera") {
            this.$emit("clickEquit", iconObj);
          }
          this.layerObj[layerName].refreshLayerByData();
          return this.iconDataObj[i].coord;
        }
      }
    },
    // 点与点之间线连接
    changeLine(res) {
      let flg = false;
      if (this.lineCoord.length > 0) {
        for (let i = 0; i < this.lineCoord.length; i++) {
          if (this.lineCoord[i].toString() === res.toString()) {
            this.lineCoord.splice(i, 1);
            flg = true;
          }
        }
      }
      if (!flg) {
        this.lineCoord.push(res);
      }
      if (this.lineCoord.length > 0) {
        if (this.beelineObj) {
          this.beelineObj.refreshLayerByData();
        }
      }
    },
    // 高亮摄像机
    heightLightCamra(id, layerName) {
      for (let i = 0; i < this.iconDataObj.length; i++) {
        if (this.iconDataObj[i].id === id) {
          this.iconDataObj[i].src = "/images/map/camera/camera_red.png";

          // this.iconDataObj[i].src = '/images/theme/dark/map/camera_select.png'
          this.layerObj[layerName].refreshLayerByData();
        }
      }
    },
    showMap2D() {
      this.showMap = true;
      this.setMapLevel(10);
      this.location([4.648259421447995, 2.31608481083271]);
    },
    hideMap2D() {
      this.showMap = false;
      this.removePopup();
      this.deleteLine();
      Object.keys(this.layerObj).map(layerName => {
        this.clearPoint(layerName);
      });

      if (this.isIndoor) {
        this.openOutDoorMap();
      }
    },

    mapDestroy() {
      if (this.mapObj) {
        this.mapObj.destroyMap(false);
        this.mapObj = null;
      }
    },

    /**
     * 添加wfs图层
     */
    addWFSServer() {
      // this.mapDestroy()
      if (this.wfsFloor) {
        this.wfsFloor.cleanSource();
      }
      if (this.wfsPoi) {
        this.wfsPoi.cleanSource();
      }
      let _this = this;
      const _data = {
        id: 162,
        parkname: "daxing",
        parkusername: "大兴",
        indoorservice: {
          parkName: "daxing_indoor",
          buildinfo: [
            {
              buildId: "",
              buildName: "",
              center: [],
              floorId: [],
              floorName: [],
              floorCode: []
            }
          ],
          wmsServiceName: "daxingPublic",
          wfsServiceName: "daxingPublic_indoor"
        },
        outdoorwfsservice:
          '{"layersName":"layer_region,","serviceURL":"/WFSServices/loadService?serviceName=yulinxiaobaodang_WFS"}',
        lon: 109.890737,
        lat: 38.75319
      };
      const parkName = _data.parkname;
      this.indoorService = _data.indoorservice;

      if (!_data.outdoorwfsservice) {
        return;
      }
      // var WFSurl = 'http://127.0.0.1:8080/geoserver/daxingPublic/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=daxingPublic:park&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326'
      var WFSurl =
        process.env.VUE_APP_GIS +
        "/iserver/services/map-DongQu336/rest/maps/%E4%B8%9C%E5%8C%BA336?prjCoordSys=%7B%22epsgCode%22:4326%7D";
      this.wfsFloor = new iGis.layers.DataServerLayer({
        gisMapObj: this.mapObj,
        isHover: true,
        //serverType: 'GEOSERVER',
        url: WFSurl,
        //featureNS: 'http://125.69.0.17:8091/iserver/services/map-DongQu336/rest/maps/%E4%B8%9C%E5%8C%BA336',
        //featureType: ['daxingPublic:park'],//图层名称
        dataProjection: "EPSG:4326",
        center: [116.21610617587, 39.8666427002389],
        layerOptions: {
          strokeColor: "#000",
          // strokeWidth: 1.5,
          strokeWidth: 0.3,
          fillColor: "rgba(255,255,255,0)",
          selFillColor: "transparent",
          // selStrokeColor: '#686868',
          selStrokeColor: "rgba(0,252,255,0.8)",
          selStrokeWidth: 4
        },
        isRef: true
      });
      this.wfsFloor.addClickEvent(function(e) {
        //点击事件地图点位信息
        // 移出地图弹窗
        _this.removePopup();
        _this.$emit("map-location", e.clickCoord);
        if (_this.isIndoor && _this.getIsManualClick) {
          const _position = JSON.stringify(e.clickCoord);
          _this.$store.commit("setIndoorClickPosition", _position);
          return;
        }
        const _buildId = e.feature.values_.RefName;

        // console.log('建筑物编号：', _buildId)
        if (_this.isIndoor && _buildId === _this.currentBuild) {
          return;
        }
        BuildInfo([_buildId])
          .then(res => {
            _this.indoorService.buildinfo[0].buildId = res.data[0].code;
            _this.indoorService.buildinfo[0].buildName = res.data[0].name;
            _this.indoorService.buildinfo[0].center = [
              res.data[0].longitude,
              res.data[0].latitude
            ];
          })
          .then(() => {
            getFloorDataByBuildId({ code: _buildId }).then(rs => {
              if (rs.data.length) {
                _this.indoorService.buildinfo[0].floorId = [];
                _this.indoorService.buildinfo[0].floorName = [];
                _this.indoorService.buildinfo[0].floorCode = [];
                rs.data.forEach((item, index) => {
                  _this.indoorService.buildinfo[0].floorId.push(item.id);
                  _this.indoorService.buildinfo[0].floorName.push(item.name);
                  _this.indoorService.buildinfo[0].floorCode.push(
                    item.gisLayerCode
                  );
                });
                _this.openIndoorMap(_buildId);
              }
            });
          });
      });
    },
    /**
     * 获取设备
     */
    getDevice(deviceType) {
      let params = {};
      if (this.currentFloor) {
        params.code = this.currentFloor;
        params.queryType = "byId";
      } else if (deviceType) {
        params.deviceType = deviceType;
      } else {
        params.queryType = "common";
      }
      getdeviceByFloor(params).then(res => {
        this.clearLayer();
        this.typeArr.camera = this.typeArr.camera.concat(res.data.filter(i => i.deviceType === 'camera'))
        // this.addDeviceInfo(this.typeArr.camera)
        // this.handlerDeviceInfo(res.data);
        // console.log(res, "设备信息");
      });
    },
    // handlerDeviceInfo(arr) {
    //   console.log(arr, "222222222222222222");
    //   this.typeArr.elevator = this.typeArr.elevator.concat(
    //     arr.filter(i => i.deviceType === "elevator")
    //   );
    //   if (this.typeArr.elevator.length) {
    //     this.typeArr.elevator.forEach(item => {
    //       item.src = item.alarmLevel
    //         ? require("@/assets/images/mapImg/ddt.png")
    //         : require("@/assets/images/mapImg/dt.png");
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.elevator, "elevator");
    //   }
    //   this.typeArr.disabledHealthAlarm = this.typeArr.disabledHealthAlarm.concat(
    //     arr.filter(i => i.deviceType === "disabledHealthAlarm")
    //   );
    //   if (this.typeArr.disabledHealthAlarm.length) {
    //     this.typeArr.disabledHealthAlarm.forEach(item => {
    //       item.src = item.alarmLevel
    //         ? require("@/assets/images/mapImg/dcwbj.png")
    //         : require("@/assets/images/mapImg/cwbj.png");
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.disabledHealthAlarm, "disabledHealthAlarm");
    //   }
    //   this.typeArr.freshAirSystem = this.typeArr.freshAirSystem.concat(
    //     arr.filter(i => i.deviceType === "freshAirSystem")
    //   );
    //   if (this.typeArr.freshAirSystem.length) {
    //     this.typeArr.freshAirSystem.forEach(item => {
    //       item.src = item.alarmLevel
    //         ? require("@/assets/images/mapImg/dxfxt.png")
    //         : require("@/assets/images/mapImg/xfxt.png");
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.freshAirSystem, "freshAirSystem");
    //   }
    //   this.typeArr.nightlighting = this.typeArr.nightlighting.concat(
    //     arr.filter(i => i.deviceType === "nightlighting")
    //   );
    //   if (this.typeArr.nightlighting.length) {
    //     this.typeArr.nightlighting.forEach(item => {
    //       if (item.alarmLevel) {
    //         item.src = require("@/assets/images/mapImg/dyjzm.png");
    //       } else {
    //         item.src = item.onlineStatus
    //           ? require("@/assets/images/mapImg/yjzm.png")
    //           : require("@/assets/images/mapImg/nyjzm.png");
    //       }
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.nightlighting, "nightlighting");
    //   }
    //   this.typeArr.barrierGate = this.typeArr.barrierGate.concat(
    //     arr.filter(i => i.deviceType === "barrierGate")
    //   );
    //   if (this.typeArr.barrierGate.length) {
    //     this.typeArr.barrierGate.forEach(item => {
    //       item.src = item.alarmLevel
    //         ? require("@/assets/images/mapImg/dcldz.png")
    //         : require("@/assets/images/mapImg/cldz.png");
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.barrierGate, "barrierGate");
    //   }
    //   this.typeArr.entranceControl = this.typeArr.entranceControl.concat(
    //     arr.filter(i => i.deviceType === "entranceControl")
    //   );
    //   if (this.typeArr.entranceControl.length) {
    //     this.typeArr.entranceControl.forEach(item => {
    //       item.src = item.alarmLevel
    //         ? require("@/assets/images/mapImg/dmj.png")
    //         : require("@/assets/images/mapImg/mj.png");
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.entranceControl, "entranceControl");
    //   }
    //   this.typeArr.boiler = this.typeArr.boiler.concat(
    //     arr.filter(i => i.deviceType === "boiler")
    //   );
    //   if (this.typeArr.boiler.length) {
    //     this.typeArr.boiler.forEach(item => {
    //       item.src = item.alarmLevel
    //         ? require("@/assets/images/mapImg/dglf.png")
    //         : require("@/assets/images/mapImg/glf.png");
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.boiler, "boiler");
    //   }
    //   this.typeArr.lighting = this.typeArr.lighting.concat(
    //     arr.filter(i => i.deviceType === "lighting")
    //   );
    //   if (this.typeArr.lighting.length) {
    //     this.typeArr.lighting.forEach(item => {
    //       item.src = item.alarmLevel
    //         ? require("@/assets/images/mapImg/dznzm.png")
    //         : require("@/assets/images/mapImg/znzm.png");
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.lighting, "lighting");
    //   }
    //   this.typeArr.airConditioning = this.typeArr.airConditioning.concat(
    //     arr.filter(i => i.deviceType === "airConditioning")
    //   );
    //   if (this.typeArr.airConditioning.length) {
    //     this.typeArr.airConditioning.forEach(item => {
    //       item.src = item.alarmLevel
    //         ? require("@/assets/images/mapImg/dntkt.png")
    //         : require("@/assets/images/mapImg/ntkt.png");
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.airConditioning, "airConditioning");
    //   }
    //   this.typeArr.camera = this.typeArr.camera.concat(
    //     arr.filter(i => i.deviceType === "camera")
    //   );
    //   if (this.typeArr.camera.length) {
    //     this.typeArr.camera.forEach(item => {
    //       if (item.cameraType === "固定枪机") {
    //         if (item.alarmLevel) {
    //           item.src = require("@/assets/images/mapImg/dsxt.png");
    //         } else {
    //           item.src = item.onlineStatus
    //             ? require("@/assets/images/mapImg/sxt.png")
    //             : require("@/assets/images/mapImg/nsxt.png");
    //         }
    //       } else {
    //         if (item.alarmLevel) {
    //           item.src = require("@/assets/images/mapImg/dsxtqj.png");
    //         } else {
    //           item.src = item.onlineStatus
    //             ? require("@/assets/images/mapImg/sxtqj.png")
    //             : require("@/assets/images/mapImg/nsxtqj.png");
    //         }
    //       }
    //       item.coord = [Number(item.longitude), Number(item.latitude)];
    //     });
    //     this.addMarket(this.typeArr.camera, "camera");
    //   }
    // },
    /**
     * @name: 打开楼层图层
     * @Author: sscaij
     * @msg:
     * @param {*} _buildId 楼号id(code)
     * @return {*}
     */
    openIndoorMap(_buildId, floorId) {
      if (!_buildId) {
        return;
      }
      this.isIndoor = true;
      const _buildInfo = this.getBuildInfo(_buildId);
      this.buildname = _buildInfo.buildName ? _buildInfo.buildName : "";
      this.currentFloor =
        floorId || _buildInfo.floorId[_buildInfo.floorId.length - 1];
      const point = _buildInfo.center;
      const _center = [+point[0], +point[1]];
      this.mapCenter = _center;
      const floorInfo = _buildInfo.floorId;
      if (_buildId !== this.currentBuild) {
        //这里有个需求是要把7号楼的B01B02按钮挪到室外按钮的下面, 但是这样写没生效

        const arr = floorInfo
          .filter((item,index) => {
            return (
              this.buildname == "7号楼"&&["B01", "B02"].indexof(_buildInfo.floorName[index]) < 0 
            );
          })
          .map((item,index) => {
            return {
              floorId: item,
              floorName: _buildInfo.floorName[index],
              floorCode: _buildInfo.floorCode[index],
              number: +_buildInfo.floorName[index].split("")[0],
            };
          });
        this.indoorData = arr.sort(this.ArrayCompare("number")).reverse();
        if (this.buildname == "7号楼") {
          this.indoorDataB12 = floorInfo
            .filter((item,index) => {
              return ["B01", "B02"].indexof(_buildInfo.floorName[index]) > -1;
            })
            .map((item,index) => {
              return {
                floorId: item,
                floorName: _buildInfo.floorName[index],
                floorCode: _buildInfo.floorCode[index],
                number: +_buildInfo.floorName[index].split("")[0],
              };
            });
        }
      }
      this.currentBuild = _buildInfo.buildId;
      // let emsUrl = 'http://127.0.0.1:8080/geoserver/daxingPublic/wms?service=WMS'
      let emsUrl =
        process.env.VUE_APP_GIS + "/geoserver/daxingPublic/wms?service=WMS";
      let layers = ["daxingPublic:daxinggis"];
      if (
        this.indoorData.find(i => i.floorId === this.currentFloor).floorCode
      ) {
        layers.push(
          `daxingPublic:${
            this.indoorData.find(i => i.floorId === this.currentFloor).floorCode
          }`
        );
      }
      const options = {
        mapType: iGis.MapType.WMS_MAP,
        url: emsUrl,
        divId: "iGisMap",
        layerParams: {
          VERSION: "1.1.1",
          LAYERS: layers, //此次根据部署图层时的命名修改
          TILED: true
        },
        zoom: 18,
        center: _center,
        // zoomType: 'big',
        projection: "EPSG:4326",
        isScaleLine: true,
        isMousePosition: true,
        isZoomLevel: true,
        units: "metric",
        wrapX: false,
        maxZoom: 23,
        minZoom: 18,
        isIndoor: true,
        indoorData: {
          parkName: this.indoorService.parkName,
          isDoor: true,
          buildinfo: [_buildInfo],
          wmsServiceName: this.indoorService.wmsServiceName, // http://localhost:63345/com.cloud.isoft.wxs.service
          wfsServiceName: this.indoorService.wfsServiceName,
          currBuildId: this.currentBuild, // 默认加载某一栋楼
          currFloorId: this.currentFloor, // 默认加载某一栋楼的某一层
          switchFloorFunc: param => {
            // 切换楼层后的回调函数
            // this.typeArr = {
            // 	elevator: [],disabledHealthAlarm: [],freshAirSystem: [],nightlighting: [],barrierGate: [],
            // 	entranceControl: [],boiler: [],lighting: [],airConditioning: [],camera: []
            // }
            this.allClearLayer();
            this.currentFloor = param.floorId;
            this.getDevice();

            // this.$store.commit(
            // 	'setMapInfo',
            // 	JSON.stringify({
            // 		isIndoor: this.isIndoor,
            // 		buildId: this.currentBuild,
            // 		floorId: this.currentFloor
            // 	})
            // )
          }
        }
      };
      this.mapObj.createMap(options);
      this.setMapCenter({ center: _center });
    },

    getBuildInfo(buildId) {
      const curB = this.indoorService.buildinfo.filter(
        item => item && item.buildId === buildId
      );
      if (curB.length > 0) {
        return curB[0];
      }
    },

    /**
     * 切换到室外
     */
    openOutDoorMap() {
      this.isIndoor = false;
      if (this.mapObj.getIndoorMapObj()) {
        let emsUrl =
          process.env.VUE_APP_GIS + "/geoserver/daxingPublic/wms?service=WMS";
        const options = {
          mapType: iGis.MapType.WMS_MAP,
          url: emsUrl,
          divId: "iGisMap",
          layerParams: {
            VERSION: "1.1.1",
            LAYERS: "daxingPublic:daxinggis", //此次根据部署图层时的命名修改
            TILED: true
          },
          zoom: 18,
          projection: "EPSG:4326",
          maxZoom: 23,
          minZoom: 18
        };
        this.mapObj.createMap(options);
        this.setMapCenter({ center: this.mapCenter });
        // this.typeArr = {
        // 	elevator: [],disabledHealthAlarm: [],freshAirSystem: [],nightlighting: [],barrierGate: [],
        // 	entranceControl: [],boiler: [],lighting: [],airConditioning: [],camera: []
        // }
        this.allClearLayer();
        this.currentFloor = "";
        this.getDevice();
      }
    },

    /**
     * 设置地图中心位置
     * @param center 中心点坐标
     * @param buildingId 室内地图时传入
     * @param floorId 室内地图时传入
     */
    setMapCenter({ center = [], buildingId = "", floorId = "" } = {}) {
      if (!this.mapObj) {
        return;
      }
      this.mapObj.setMapCenter(center, buildingId, floorId);
    },

    /**
     * 排序规则
     */
    ArrayCompare(property) {
      return function(a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.map_warp {
  width: 190%;
  height: 96%;
}

#iGisMap {
  width: 70%;
  margin-left: 30%;
  height: calc(100vh - 60px - 3px);
  // padding: 12px 12px;
  // position: absolute !important;
  // top: 30px;
  // left: 36px;
  &.showMap {
    left: 0px;
  }
}

.map-floor-bar {
  width: 80px;
  position: absolute;
  z-index: 99;
  right: 33px;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: right 0.5s;
  .buildingName {
    color: #fff;
    width: 60px;
    height: 34px;
    display: flex;
    align-items: center;
    background: #202945;
    overflow: hidden;
    &.justify-center {
      justify-content: center;
    }
    &.justify-left {
      justify-content: flex-start;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;

    li {
      height: 34px;
      background: rgba(#202945, 0.85);
      line-height: 34px;
      text-align: center;
      color: rgba(#fff, 0.5);
      cursor: pointer;
      position: relative;
      font-size: 12px;
      width: 34px;
      .left-arrow {
        width: 0;
        height: 0;
        border: 3px solid transparent;
        border-left-color: #407aee;
        position: absolute;
        content: "";
        top: 9px;
      }

      .right-arrow {
        width: 0;
        height: 0;
        border: 3px solid transparent;
        border-right-color: #407aee;
        position: absolute;
        content: "";
        top: 9px;
        right: 0;
      }

      &.active {
        color: #fff;
        border-left: #407aee solid 2px;
        border-right: #407aee solid 2px;
      }

      &.map-prev,
      &.map-next {
        height: 20px;
        background: #202945;
        line-height: 20px;
        color: #fff;
      }

      &.map-prev {
        margin-bottom: 3px;
      }

      &.last-out {
        height: 35px;
        line-height: 35px;
        background: #3e4766;
        color: #fff;
      }

      &.last {
        margin-top: 3px;
        height: 30px;
        line-height: 15px;
        color: #fff;
        display: flex;
        font-size: 12px;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        p {
          margin: 0;
          padding: 0;
        }

        i {
          transform: rotate(270deg);
          -ms-transform: rotate(270deg); /* IE 9 */
          -moz-transform: rotate(270deg); /* Firefox */
          -webkit-transform: rotate(270deg); /* Safari 和 Chrome */
          -o-transform: rotate(270deg);
        }
      }
    }
  }
}
</style>

<style lang="scss">
#iGisMap {
  .markerPop {
    padding: 10px 14px;
    color: #afb9d0;
    font-size: 14px;
    line-height: 40px;
    border-radius: 4px;
    //background-color: rgba(32,34,48,.9);
    //box-shadow: 0 0 2px #202230;
    border: 1px solid rgba(255, 255, 255, 0.2);
    .el-button {
      margin-top: 12px;
    }
    div {
      width: 280px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.ol-zoom {
  top: 0.5em;
  left: 105.5em;
  position: absolute;
}
.ol-attribution ul,
.ol-attribution button {
  display: none;
}
.ol-popup {
  padding: 10px 14px;
  color: #afb9d0;
  font-size: 14px;
  line-height: 40px;
  border-radius: 4px;
  background-color: rgba(32, 34, 48, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  p{
    line-height:10px;
  }
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>