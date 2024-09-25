
<template>
  <div id="iGisMaplong" :class="{ showMap: showMap }">
    <!-- <div id="igisMarker" class="markerPop"></div> -->
    <div
      class="map-floor-bar"
      :style="{ right: getRight + 'px' }"
      v-if="isIndoor"
    >
      <p
        class="buildingName text-ellipse"
        :class="buildname.length <= 3 ? 'justify-center' : 'justify-left'"
        :title="buildname"
      >
        {{ buildname }}
      </p>
      <ul v-if="indoorData.length">
        <li class="map-prev" @click="handlePrev">
          <i class="el-icon-arrow-up"></i>
        </li>
        <li
          v-for="(item, index) in indoorData"
          :key="index"
          :class="{ active: item.floorId === currentFloor }"
        >
          <div @click="handleSwitchFloor(currentBuild, item.floorId)">
            <div class="left-arrow" v-if="item.floorId === currentFloor"></div>
            <div class="right-arrow" v-if="item.floorId === currentFloor"></div>
            {{ item.floorName }}
          </div>
        </li>
        <li class="map-next" @click="handleNext">
          <i class="el-icon-arrow-down"></i>
        </li>
        <li class="last" @click="openOutDoorMap">
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
  </div>
</template>

<script>
import { BuildInfo, getFloorDataByBuildId, getdeviceByFloor } from "./api";
import floorPositions from "../../../utils/map/floorCoord";
export default {
  name: "appMap",
  props: {
    layers: {
      type: Array,
      default: () => [],
    },
    center: {
      type: Array,
      default: () => [],
    },
    zoom: {
      type: Number,
      default: () => 18,
    },
    options: {
      type: Object,
      default: () => {},
    },
    // area新加代码 发送给子组件
    getMouseLOcation: {
      type: Function,
      default: () => {},
    },
    allowShowLocationByClick: {
      type: Object,
      default: () => {},
    },
    showScaleLine: {
      type: Boolean,
      default: () => {},
    },
    // -----------------重写后的地图代码------------------
  },
  data() {
    return {
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
      currentFloor: "",
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
        camera: [],
      },
    };
  },
  created() {
    this.MapFontLayers = [];
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
                  coord: e,
                },
              ];
              this.addMarket(iconDataObj, "locationPoint");
            }, 500);
          }
        }
      },
      deep: true,
      immediate: true,
    },
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
    },
  },
  mounted() {
    // localStorage.setItem('wxsServerAddress', window.systemConfig.MAP_BASE_URL)
    // localStorage.setItem('wxsServerAddress', "/gisMapApi/com.cloud.isoft.wxs.service")
    // this.initGisMap()
    this.loadGisMap();
    this.addWFSServer();
    this.getDevice();
  },
  methods: {
    /**
     * 初始化地图函数（严格来讲，此方法最好形成为单例模式）
     * @param
     *
     **/
    //温泉超图
    loadGisMap() {
      let url =
        process.env.VUE_APP_GIS_CT +
        "/iserver/services/map-WQKJY002-4/rest/maps/%E4%B8%9C%E5%8C%BA336?prjCoordSys=%7B%22epsgCode%22:4326%7D";
      // 初始化地图信息
      let map = new ol.Map({
        target: "iGisMap", //对应div容器的id
        view: new ol.View({
          center: [116.21610617587, 39.8666427002389], //地图中心点
          zoom: 18, //缩放层级
          projection: "EPSG:4326", //坐标系
        }),
      });

      // 添加图层
      let layer = new ol.layer.Tile({
        source: new ol.source.TileSuperMapRest({
          url: url, //地图服务地址
          wrapX: true, //是否在地图水平坐标轴上重复
        }),
        projection: "EPSG:4326", //坐标系
      });

      map.addLayer(layer); //添加图层到地图
      setTimeout(() => {
        map.updateSize(); //地图适配div容器
      }, 100);
      console.log(url, "地图路径地址");
      /////////////////////////////////////////////////////
      // //自定义点串连线轨迹
      // let pointsData = [
      //   [116.21610617587,39.8666427002389],
      //   [116.21621627588, 39.8666437002390],
      //   [116.21632637589, 39.8666447002391],
      //   [116.21643647590, 39.8666457002392],
      //   [116.21654657591, 39.8664067002393],
      //   [116.21665667592, 39.8663977002394],
      //   [116.21676677593, 39.8663887002395],
      //   [116.21687687594, 39.8663797002396],
      //   [116.21698697595, 39.8663607002397]
      // ];

      // //定义一个数据来源，用于添加Feature
      // let lineSource = new ol.source.Vector({ wrapX: false });
      // //创建一个矢量图层
      // let lineLayer = new  ol.layer.Vector({
      //     source: lineSource,
      // });
      // map.addLayer(lineLayer);//添加图层到地图
      // //构造一个线feature
      // var feature = new ol.Feature({
      //     type: "lineStyle",
      //     geometry: new ol.geom.LineString(
      //       pointsData // 自定义的点串
      //     ),
      // });
      // //创建一个线样式
      // let lineStyle = new ol.style.Style({
      //     stroke: new ol.style.Stroke({
      //         color: 'red',
      //         width: 4,
      //     }),
      // });
      // feature.setStyle(lineStyle);//设置线的样式
      // lineSource.addFeature(feature);// 添加线的fature

      // ///////////////////////指定一个中心点和半径，构造一个圆，模拟为考勤范围
      // var circle = new ol.geom.Circle([116.21610617587,39.8666427002389], 0.001);
      // var polygon = new ol.geom.Polygon.fromCircle(circle);//转换为polygon，用于地图绘制
      // //构造一个面的Feature
      // var circleFeature = new ol.Feature({
      //     geometry: polygon,
      // });

      // //定义一个数据来源，用于添加Feature
      // let addPolygonSource = new ol.source.Vector({
      //   wrapX: false
      // });
      // //创建一个矢量图层
      // let addPolygonsLayer = new ol.layer.Vector({
      //     source: addPolygonSource,
      //     style: new ol.style.Style({
      //         stroke: new ol.style.Stroke({//设置边框样式
      //             color: 'green',
      //             width: 3
      //         }),
      //         fill: new ol.style.Fill({
      //             color: 'rgba(0, 0, 255, 0.3)'//设置填充色
      //         })
      //     })
      // });

      // map.addLayer(addPolygonsLayer);//添加图层到地图

      // addPolygonSource.addFeature(circleFeature)//添加面的fature
    },

    // initGisMap() {
    // 	//var WMSurl = 'http://118.114.172.7:27903/geoserver/longhuaPark/wms?service=WMS&version=1.1.0&request=GetMap&layers=longhuaPark%3AlonghuaParkdata&bbox=3.744245887046993E7%2C4333447.422973%2C3.74438460757642E7%2C4334408.700876383&width=768&height=532&srs=EPSG%3A3857&styles=&format=application/openlayers'
    // 	var WMSurl = process.env.VUE_APP_GIS_LONG + '/geoserver/longhuaFJXZ/wms?service=WMS'
    // 	this.mapObj = new window.iGis.GisMaplong()
    // 	var options = {
    // 		mapType: iGis.MapType.WMS_MAP,
    // 		url: WMSurl,
    // 		divId: 'iGisMaplong',
    // 		layerParams: {
    // 			VERSION: '1.1.1',
    // 			LAYERS: 'longhuaFJXZ:longhuaFJXZ',
    // 		},
    // 		center: [110.26672,39.10992],
    // 		zoom: this.mapLevel,
    // 		minZoom: 18,
    // 		maxZoom: 23,
    // 		// zoomType: 'small', // [ { big: 显示(+、-) 和 滑动条}， { small: 显示(+、-)}， { 为空： 不显示(+、-) 和 滑动条 } ]
    // 		projection: 'EPSG:4326',
    // 		isScaleLine: this.showScaleLine == false ? false : true,
    // 		isMousePosition: true,
    // 		isZoomLevel: true,
    // 		// isOverview: true,//左下角视图
    // 		units: 'metric',
    // 		wrapX: false
    // 	}
    // 	this.mapOption = options
    // 	this.versionSwitch()
    // 	this.mapObj.addCustomClickEvent((e) => {
    // 		console.log(e, '地图位置信息')
    // 		this.$emit('map-location', e)
    // 		this.getMouseLOcation(e) //把点位信息发给父组件
    // 		// this.mapObj.setMapCenter(e);//点击后重新设置地图中心点
    // 		// if (this.layerObj['locationPoint']) {
    // 		// 	this.clearPoint('locationPoint')
    // 		// 	console.log(this.layerObj)
    // 		// 	return
    // 		// }
    // 		// 移出地图弹窗
    // 		this.removePopup()
    // 		if (this.allowShowLocationByClick && this.allowShowLocationByClick.value) {
    // 			// 点击增加点
    // 			const dataObj = [{ id: Math.random() * 1000000, anchor: [13, 13], src: '/images/theme/dark/map/position_red.png', coord: e }]
    // 			if (this.layerObj['locationPoint']) {
    // 				// this.layerObj.locationPoint.setData(dataObj, 0)
    // 				this.layerIcons.locationPoint = dataObj
    // 				this.layerObj.locationPoint.refreshLayerByData()
    // 			} else {
    // 				this.addMarket(dataObj, 'locationPoint')
    // 			}
    // 		}

    // 		if (this.code === '巡更计划') {
    // 			this.codeId += 1
    // 			this.lineCoord.push(e)
    // 			this.codeArr.push({
    // 				id: this.codeId,
    // 				scale: 0.2,
    // 				src: '/images/theme/custom/map/position_green.png',
    // 				coord: e,
    // 				anchor: [50, 30]
    // 			})
    // 			this.clearPoint('cameraXG')
    // 			this.addMarket(this.codeArr, 'cameraXG')
    // 			if (this.lineCoord.length > 0) {
    // 				this.beelineObj.refreshLayerByData()
    // 			}
    // 		}
    // 	})
    // 	this.showFloorName()
    // 	// this.mapObj.createMap(options)
    // 	this.$emit('mapReady')

    // 	this.animation = new window.iGis.maptools.Animation({
    // 		gisMapObj: this.mapObj
    // 	})
    // },
    // 展示楼层信息
    showFloorName() {
      let textMarks = [];
      floorPositions.map((position) => {
        textMarks.push({
          id: position.id,
          coord: [+position.longitude, +position.latitude],
          fillColor: "red",
          labRotation: -38,
          glyph: "",
          lalFontSize: "12px",
          label: position.label,
          options: position,
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
      minShowZoom = 6
    ) {
      if (this.MapFontLayers[layerId]) {
        this.removeFontLayer(layerId);
      }
      if (!marker.length) {
        return;
      }
      const option = {
        gisMapObj: this.mapObj,
        callBackFun: function (param) {
          param.currObj.setData(marker, param.seq);
        },
        layerOptions: {
          radius: 50,
          rotation: 100,
          minShowZoom: minShowZoom,
          // lalFontSize: '18px',
          // fillColor: "#000",
          labRotation: 100,
          labFillColor: "#000",
        },
      };
      let fontLayerObj = new iGis.layers.FontLayer(option);
      this.MapFontLayers[layerId] = fontLayerObj;
      fontLayerObj.setZIndex(99);
      // console.log(fontLayerObj, 'fontLayerObj')
      if (click && typeof click === "function") {
        // 鼠标点击事件
        fontLayerObj.addClickEvent(function (e) {
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
    // // 清楚图层点位方法
    // clearPoint(layerName) {
    // 	// if (this.layerObj[layerName]) {
    // 	// 	this.iconDataObj = []
    // 	// 	this.layerIcons[layerName] = []
    // 	// 	this.layerObj[layerName].refreshLayerByData()
    // 	// 	this.layerObj[layerName] = null
    // 	// }
    // 	if (this.layerObj[layerName]) {
    // 		this.layerObj[layerName].cleanSource()
    // 		this.mapObj.removeLayer(this.layerObj[layerName])
    // 		this.layerObj[layerName] = null
    // 		delete this.layerObj[layerName]
    // 	}
    // },
    clearLayer(type, id) {
      this.deleteLine();
      if (type && id) {
        this.typeArr[type].forEach((item, index) => {
          if (item.id === id) {
            this.typeArr[type].splice(index, 1);
          }
        });
        Object.keys(this.typeArr).map((layerName) => {
          this.clearPoint(layerName);
          this.addMarket(this.typeArr[layerName], layerName);
        });
      } else {
        Object.keys(this.layerObj).map((layerName) => {
          this.clearPoint(layerName);
        });
      }
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
        camera: [],
      };
      Object.keys(this.layerObj).map((layerName) => {
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
      strokeColor = "#0090ff",
    } = {}) {
      var beelinedata = [
        {
          id: "line1",
          strokeWidth: strokeWidth,
          lineDash: lineDash,
          arrowType: arrowType,
          strokeColor: strokeColor,
          coord: this.lineCoord,
        },
      ];
      //创建线的对象
      this.beelineObj = new iGis.layers.LineLayer({
        gisMapObj: this.mapObj,
        callBackFun: (param) => {
          param.currObj.setData(beelinedata, param.seq);
        },
        layerOptions: {
          isDirect: true,
          strokeWidth: 10,
          lalFontSize: "14px",
          labFillColor: "#0090ff",
          labStrokeWidth: 10,
          labStrokeColor: "#0090ff",
        },
      });
    },

    createLineObj({
      id = "",
      strokeWidth = 6,
      arrowType = 2,
      lineDash = [],
      strokeColor = "#0090ff",
      layerName = "default",
      opacity = 1,
    } = {}) {
      var beelinedata = [
        {
          id: id,
          strokeWidth: strokeWidth,
          lineDash: lineDash,
          arrowType: arrowType,
          strokeColor: strokeColor,
          coord: this.lineCoord,
        },
      ];
      //创建线的对象
      this.bglingObj[layerName] = new iGis.layers.LineLayer({
        gisMapObj: this.mapObj,
        callBackFun: (param) => {
          param.currObj.setData(beelinedata, param.seq);
        },
        layerOptions: {
          isDirect: true,
          strokeWidth: 10,
          lalFontSize: "14px",
          labFillColor: "#0090ff",
          labStrokeWidth: 10,
          labStrokeColor: "#0090ff",
        },
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
      data.forEach((item) => {
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
        eventName = "",
      } = {}
    ) {
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
            anchor: [30, 24],
          },
        });
        this.layerObj[layerName].setData(this.layerIcons[layerName], 0);
        this.layerObj[layerName].refreshLayerByData();
      }
      if (
        layerName === "elevator" ||
        layerName === "disabledHealthAlarm" ||
        layerName === "boiler"
      ) {
        // 车辆道闸
        this.layerObj[layerName].addClickEvent((e) => {
          this.$emit("deviceInfo", e.feature.getProperties().property);
          if (e.feature.getProperties().property.deviceId) {
            let content = `<div title="${
              e.feature.getProperties().property.deviceName
            }">设备名称：${e.feature.getProperties().property.deviceName}</div>
						<div title="${
              e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.address
            }">所在位置：${
              e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.address
            }</div>
						<div title="${e.feature.getProperties().property.deviceCode}">设备编号：${
              e.feature.getProperties().property.deviceCode
            }</div>
						<div style="text-align: center;">
							<button class="el-button el-button--primary el-button--small device">设备画像</button>
						</div>`;

            this.addPopup([], e.feature.getProperties().property, content);
          }
        });
      } else if (layerName === "camera" || layerName === "nightlighting") {
        // 为camera图标增加点击事件
        this.layerObj[layerName].addClickEvent((e) => {
          this.$emit("deviceInfo", e.feature.getProperties().property);
          if (e.feature.getProperties().property.deviceId) {
            let content = `<div title="${
              e.feature.getProperties().property.deviceName
            }">设备名称：${e.feature.getProperties().property.deviceName}</div>
						<div title="${
              e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.address
            }">所在位置：${
              e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.address
            }</div>
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
      } else {
        this.layerObj[layerName].addClickEvent((e) => {
          this.$emit("deviceInfo", e.feature.getProperties().property);
          if (e.feature.getProperties().property.deviceId) {
            let content = `<div title="${
              e.feature.getProperties().property.deviceName
            }">设备名称：${e.feature.getProperties().property.deviceName}</div>
						<div title="${
              e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.deviceAddress.address
            }">所在位置：${
              e.feature.getProperties().property.deviceAddress ||
              e.feature.getProperties().property.deviceAddress.address
            }</div>
						<div title="${e.feature.getProperties().property.deviceCode}">设备编号：${
              e.feature.getProperties().property.deviceCode
            }</div>
						<div style="text-align: center;">
							<button class="el-button el-button--primary el-button--small preview">设备控制</button>
							<button class="el-button el-button--primary el-button--small device">设备画像</button>
						</div>`;

            this.addPopup([], e.feature.getProperties().property, content);
          }
        });
      }
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
        positioning: "center",
      });
      this.markerTips.setPosition(deviceInfo.coord);
      // 设备控制
      if (document.getElementsByClassName("preview")[0]) {
        document
          .getElementsByClassName("preview")[0]
          .addEventListener("click", () => {
            if (deviceInfo.deviceType === "camera") {
              this.$router.push({ name: "GIS", query: deviceInfo });
            } else if (deviceInfo.deviceType === "freshAirSystem") {
              this.$router.push("/newTrend");
            } else if (deviceInfo.deviceType === "nightlighting") {
              this.$router.push("/nightlighting");
            } else if (deviceInfo.deviceType === "barrierGate") {
              this.$router.push("/cardControl");
            } else if (deviceInfo.deviceType === "entranceControl") {
              this.$router.push("/acsControl");
            } else if (deviceInfo.deviceType === "lighting") {
              this.$router.push("/intellectLight");
            } else if (deviceInfo.deviceType === "airConditioning") {
              this.$router.push("/intellectCondite");
            }
          });
      }
      // 设备画像
      if (document.getElementsByClassName("device")[0]) {
        document
          .getElementsByClassName("device")[0]
          .addEventListener("click", () => {
            this.$router.push({ name: "deviceDraw", query: deviceInfo });
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
    // addAlarmLayer(alarmList = []) {
    // 	if (alarmList.length <= 0) {
    // 		return
    // 	}
    // 	this.layerIcons.alarmList = alarmList.map((i) => {
    // 		return {
    // 			...i,
    // 			src: `/images/alarm/${i.alarmLevelColor}1.png`
    // 		}
    // 	})
    // 	if (!this.layerObj.alarmList) {
    // 		this.layerObj.alarmList = new window.iGis.layers.IconLayer({
    // 			gisMapObj: this.mapObj,
    // 			isRef: true,
    // 			isHover: false,
    // 			callBackFun: (param) => {
    // 				param.currObj.setData(this.layerIcons.alarmList, param.seq)
    // 			},
    // 			layerOptions: {
    // 				isBox: false,
    // 				selSrc: '',
    // 				anchor: [0, 0],
    // 				labOffsetX: 10,
    // 				labOffsetY: 10
    // 			}
    // 		})
    // 	}

    // 	this.layerObj.alarmList.refreshLayerByData()
    // 	this.layerObj.alarmList.setZIndex(9)
    // 	this.$nextTick(() => {
    // 		let index = 2
    // 		if (this.refreshAlarmLayerTimer) {
    // 			clearInterval(this.refreshAlarmLayerTimer)
    // 			this.refreshAlarmLayerTimer = null
    // 		}
    // 		this.refreshAlarmLayerTimer = setInterval(() => {
    // 			const refreshAlarmList = alarmList.map((i) => {
    // 				return {
    // 					...i,
    // 					src: `/images/alarm/${i.alarmLevelColor}${index}.png`
    // 				}
    // 			})
    // 			this.refreshAlarmLayer(refreshAlarmList)
    // 			if (index === 44) {
    // 				index = 1
    // 			} else {
    // 				index += 1
    // 			}
    // 		}, 50)
    // 		this.$once('hook:beforeDestroy', () => {
    // 			clearInterval(this.refreshAlarmLayerTimer)
    // 		})
    // 	})
    // },
    /**
     * 单独Function(非实时告警需求，勿动此方法)
     * 刷新实时告警图层
     */
    // refreshAlarmLayer(alarmList = []) {
    // 	if (alarmList.length <= 0) {
    // 		return
    // 	}
    // 	this.layerIcons.alarmList = alarmList
    // 	this.layerObj.alarmList.refreshLayerByData()
    // },
    /**
     * 单独Function(非实时告警需求，勿动此方法)
     * 移除实时告警图层(添加之前应该执行一次次方法)
     */
    // removeAlarmLayer() {
    // 	if (this.layerIcons.alarmList && this.layerIcons.alarmList.length > 0 && this.layerObj.alarmList) {
    // 		this.layerIcons.alarmList = []
    // 		this.layerObj.alarmList.refreshLayerByData()
    // 		clearInterval(this.refreshAlarmLayerTimer)
    // 		this.refreshAlarmLayerTimer = null
    // 	}
    // },

    /**
     * 单独Function(非实时告警需求，勿动此方法)
     * 添加实时告警图层
     */
    addAlarmLayer(alarmList = []) {
      console.log(alarmList);
      if (alarmList.length <= 0) {
        return;
      }
      this.layerIcons.alarmList = alarmList.map((i) => {
        return {
          ...i,
          coord: [i.lng * 1, i.lat * 1],
          src: `/images/alarm/${i.alarmLevelColor}_00001(1).png`,
        };
      });
      if (!this.layerObj.alarmList) {
        this.layerObj.alarmList = new window.iGis.layers.IconLayer({
          gisMapObj: this.mapObj,
          isRef: true,
          isHover: false,
          callBackFun: (param) => {
            param.currObj.setData(this.layerIcons.alarmList, param.seq);
          },
          layerOptions: {
            isBox: false,
            selSrc: "",
            anchor: [0, 0],
            labOffsetX: 10,
            labOffsetY: 10,
          },
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
          const refreshAlarmList = alarmList.map((i) => {
            return {
              ...i,
              coord: [i.lng * 1, i.lat * 1],
              src: `/images/alarm/${i.alarmLevelColor}_00001(${index}).png`,
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
      Object.keys(this.layerObj).map((layerName) => {
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
              floorCode: [],
            },
          ],
          wmsServiceName: "longhua",
          wfsServiceName: "daxingPublic_indoor",
        },
        outdoorwfsservice:
          '{"layersName":"layer_region,","serviceURL":"/WFSServices/loadService?serviceName=yulinxiaobaodang_WFS"}',
        lon: 109.890737,
        lat: 38.75319,
      };
      const parkName = _data.parkname;
      this.indoorService = _data.indoorservice;

      if (!_data.outdoorwfsservice) {
        return;
      }
      // var WFSurl = 'http://127.0.0.1:8080/geoserver/daxingPublic/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=daxingPublic:park&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326'
      var WFSurl =
        process.env.VUE_APP_GIS_LONG +
        "/geoserver/longhuaFJXZ/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=longhua:park&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326";
      this.wfsFloor = new iGis.layers.DataServerLayer({
        gisMapObj: this.mapObj,
        isHover: true,
        serverType: "GEOSERVER",
        url: WFSurl,
        featureNS: "http://mapserver.gis.umn.edu/mapserver",
        featureType: ["longhuaFJXZ:longhuaFJXZ"], //图层名称
        dataProjection: "EPSG:4326",
        layerOptions: {
          strokeColor: "#000",
          // strokeWidth: 1.5,
          strokeWidth: 0.3,
          fillColor: "rgba(255,255,255,0)",
          selFillColor: "transparent",
          // selStrokeColor: '#686868',
          selStrokeColor: "rgba(0,252,255,0.8)",
          selStrokeWidth: 4,
        },
        isRef: true,
      });
      this.wfsFloor.addClickEvent(function (e) {
        //点击事件地图点位信息
        console.log(e.clickCoord, "点击事件地图点位信息2");
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
          .then((res) => {
            if (res.meta.status === 200) {
              _this.indoorService.buildinfo[0].buildId = res.data[0].code;
              _this.indoorService.buildinfo[0].buildName = res.data[0].name;
              _this.indoorService.buildinfo[0].center = [
                res.data[0].longitude,
                res.data[0].latitude,
              ];
            } else {
              this.$message.error(res.meta.message);
            }
          })
          .then(() => {
            getFloorDataByBuildId({ code: _buildId }).then((rs) => {
              if (rs.meta.status === 200) {
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
              } else {
                this.$message.error(rs.meta.message);
              }
            });
          });
      });
    },

    /**
     * 楼层切换
     * @param buildId 建筑物编号
     * @param floorId 楼层编号
     */
    handleSwitchFloor(buildId, floorId) {
      if (buildId && floorId) {
        // let indoorMap = this.mapObj.getIndoorMapObj()
        // indoorMap.switchFloor(buildId, floorId)
        this.openIndoorMap(buildId, floorId);
        this.setMapCenter({ center: this.mapCenter });
      }
    },

    /**
     * 向上切换楼层信息
     */
    handlePrev() {
      let _tempFloorNum = 0;
      this.indoorData.forEach((item, index) => {
        if (item.floorId === this.currentFloor) {
          _tempFloorNum = index;
        }
      });
      if (_tempFloorNum - 1 >= 0) {
        const prevFloor = this.indoorData[_tempFloorNum - 1];
        this.handleSwitchFloor(this.currentBuild, prevFloor.floorId);
      }
    },
    /**
     * 向下切换楼层信息
     */
    handleNext() {
      let _tempFloorNum = 0;
      this.indoorData.forEach((item, index) => {
        if (item.floorId === this.currentFloor) {
          _tempFloorNum = index;
        }
      });
      if (_tempFloorNum + 1 < this.indoorData.length) {
        const nextFloor = this.indoorData[_tempFloorNum + 1];
        this.handleSwitchFloor(this.currentBuild, nextFloor.floorId);
      }
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
      getdeviceByFloor(params).then((res) => {
        if (res.meta.status === 200) {
          this.clearLayer();
          this.handlerDeviceInfo(res.data);
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    handlerDeviceInfo(arr) {
      this.typeArr.elevator = this.typeArr.elevator.concat(
        arr.filter((i) => i.deviceType === "elevator")
      );
      if (this.typeArr.elevator.length) {
        this.typeArr.elevator.forEach((item) => {
          item.src = item.alarmLevel ? "/map/ddt.png" : "/map/dt.png";
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.elevator, "elevator");
      }
      this.typeArr.disabledHealthAlarm =
        this.typeArr.disabledHealthAlarm.concat(
          arr.filter((i) => i.deviceType === "disabledHealthAlarm")
        );
      if (this.typeArr.disabledHealthAlarm.length) {
        this.typeArr.disabledHealthAlarm.forEach((item) => {
          item.src = item.alarmLevel ? "/map/dcwbj.png" : "/map/cwbj.png";
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.disabledHealthAlarm, "disabledHealthAlarm");
      }
      this.typeArr.freshAirSystem = this.typeArr.freshAirSystem.concat(
        arr.filter((i) => i.deviceType === "freshAirSystem")
      );
      if (this.typeArr.freshAirSystem.length) {
        this.typeArr.freshAirSystem.forEach((item) => {
          item.src = item.alarmLevel ? "/map/dxfxt.png" : "/map/xfxt.png";
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.freshAirSystem, "freshAirSystem");
      }
      this.typeArr.nightlighting = this.typeArr.nightlighting.concat(
        arr.filter((i) => i.deviceType === "nightlighting")
      );
      if (this.typeArr.nightlighting.length) {
        this.typeArr.nightlighting.forEach((item) => {
          if (item.alarmLevel) {
            item.src = "/map/dyjzm.png";
          } else {
            item.src = item.onlineStatus ? "/map/yjzm.png" : "/map/nyjzm.png";
          }
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.nightlighting, "nightlighting");
      }
      this.typeArr.barrierGate = this.typeArr.barrierGate.concat(
        arr.filter((i) => i.deviceType === "barrierGate")
      );
      if (this.typeArr.barrierGate.length) {
        this.typeArr.barrierGate.forEach((item) => {
          item.src = item.alarmLevel ? "/map/dcldz.png" : "/map/cldz.png";
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.barrierGate, "barrierGate");
      }
      this.typeArr.entranceControl = this.typeArr.entranceControl.concat(
        arr.filter((i) => i.deviceType === "entranceControl")
      );
      if (this.typeArr.entranceControl.length) {
        this.typeArr.entranceControl.forEach((item) => {
          item.src = item.alarmLevel ? "/map/dmj.png" : "/map/mj.png";
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.entranceControl, "entranceControl");
      }
      this.typeArr.boiler = this.typeArr.boiler.concat(
        arr.filter((i) => i.deviceType === "boiler")
      );
      if (this.typeArr.boiler.length) {
        this.typeArr.boiler.forEach((item) => {
          item.src = item.alarmLevel ? "/map/dglf.png" : "/map/glf.png";
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.boiler, "boiler");
      }
      this.typeArr.lighting = this.typeArr.lighting.concat(
        arr.filter((i) => i.deviceType === "lighting")
      );
      if (this.typeArr.lighting.length) {
        this.typeArr.lighting.forEach((item) => {
          item.src = item.alarmLevel ? "/map/dznzm.png" : "/map/znzm.png";
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.lighting, "lighting");
      }
      this.typeArr.airConditioning = this.typeArr.airConditioning.concat(
        arr.filter((i) => i.deviceType === "airConditioning")
      );
      if (this.typeArr.airConditioning.length) {
        this.typeArr.airConditioning.forEach((item) => {
          item.src = item.alarmLevel ? "/map/dntkt.png" : "/map/ntkt.png";
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.airConditioning, "airConditioning");
      }
      this.typeArr.camera = this.typeArr.camera.concat(
        arr.filter((i) => i.deviceType === "camera")
      );
      if (this.typeArr.camera.length) {
        this.typeArr.camera.forEach((item) => {
          if (item.cameraType === "固定枪机") {
            if (item.alarmLevel) {
              item.src = "/map/dsxt.png";
            } else {
              item.src = item.onlineStatus ? "/map/sxt.png" : "/map/nsxt.png";
            }
          } else {
            if (item.alarmLevel) {
              item.src = "/map/dsxtqj.png";
            } else {
              item.src = item.onlineStatus
                ? "/map/sxtqj.png"
                : "/map/nsxtqj.png";
            }
          }
          item.coord = [Number(item.longitude), Number(item.latitude)];
        });
        this.addMarket(this.typeArr.camera, "camera");
      }
    },
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
        process.env.VUE_APP_GIS_LONG + "/geoserver/longhua/wms?service=WMS";
      console.log(emsUrl, "gis服务+++++++++++++++++++++++++++++++++");
      let layers = ["	longhuaFJXZ:longhuaFJXZ"];
      if (
        this.indoorData.find((i) => i.floorId === this.currentFloor).floorCode
      ) {
        layers.push(
          `daxingPublic:${
            this.indoorData.find((i) => i.floorId === this.currentFloor)
              .floorCode
          }`
        );
      }
      const options = {
        mapType: iGis.MapType.WMS_MAP,
        url: emsUrl,
        divId: "iGisMaplong",
        layerParams: {
          VERSION: "1.1.1",
          LAYERS: layers, //此次根据部署图层时的命名修改
          TILED: true,
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
          switchFloorFunc: (param) => {
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
          },
        },
      };
      this.mapObj.createMap(options);
      this.setMapCenter({ center: _center });
    },

    getBuildInfo(buildId) {
      const curB = this.indoorService.buildinfo.filter(
        (item) => item && item.buildId === buildId
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
          process.env.VUE_APP_GIS_LONG + "/geoserver/longhua/wms?service=WMS";
        const options = {
          mapType: iGis.MapType.WMS_MAP,
          url: emsUrl,
          divId: "iGisMaplong",
          layerParams: {
            VERSION: "1.1.1",
            LAYERS: "	longhuaFJXZ:longhuaFJXZ", //此次根据部署图层时的命名修改
            TILED: true,
          },
          zoom: 18,
          projection: "EPSG:4326",
          maxZoom: 23,
          minZoom: 18,
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
      return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.map_warp {
  width: 100%;
  height: 96%;
}

#iGisMaplong {
  width: 100%;
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
#iGisMaplong {
  .markerPop {
    padding: 10px 14px;
    color: #afb9d0;
    font-size: 14px;
    line-height: 40px;
    border-radius: 4px;
    //background-color: rgba(32,34,48,.9);
    // box-shadow: 0 0 2px #202230;
    border: 1px solid rgba(255, 255, 255, 0.2);
    .el-button--primary.el-button.device {
      background-color: #4ab7bd !important;
    }
    .el-button--primary.el-button {
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
</style>