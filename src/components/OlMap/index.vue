<template>
  <div id="map" ref="rootmap" class="map-container">
    <!-- 放大缩小居中工具箱 -->
    <div class="measure-button ml-10px">
      <div class="measure-box" v-if="zoomTool">
        <div @click="addZoom" class="icons">
          <i class="el-icon-plus"></i>
        </div>
        <el-divider></el-divider>
        <div @click="setMapCenter">
          <img src="@/assets/images/juzhong.svg" alt="light" />
        </div>
        <el-divider></el-divider>
        <div @click="reduceZoom" class="icons">
          <i class="el-icon-minus"></i>
        </div>
      </div>
      <!-- 测量工具箱 -->
      <div class="measure-box" v-if="measureTool">
        <el-tooltip
          class="item"
          effect="dark"
          content="面积测量"
          placement="right-end"
        >
          <div @click="measuredArea">
            <img src="@/assets/images/cemianji.svg" alt="light" />
          </div>
        </el-tooltip>
        <el-divider></el-divider>
        <el-tooltip
          class="item"
          effect="dark"
          content="距离测量"
          placement="right-end"
        >
          <div @click="measuredDistance">
            <img src="@/assets/images/ceju.svg" alt="light" />
          </div>
        </el-tooltip>
      </div>
    </div>
    <!-- 右上角社区网格按钮 -->
    <div class="detail-button" v-if="communityAndGrid">
      <el-tooltip
        class="item"
        effect="dark"
        :content="viewCommunityText"
        placement="bottom-end"
      >
        <div v-if="viewCommunityBtn" @click="viewCommunity">
          <img src="@/assets/images/wanggehua.svg" />
          <el-button type="text">社区</el-button>
        </div>
      </el-tooltip>
      <el-divider
        direction="vertical"
        v-if="viewCommunityBtn && viewGridBtn"
      ></el-divider>
      <el-tooltip
        class="item"
        effect="dark"
        :content="viewGridText"
        placement="bottom-end"
      >
        <div v-if="viewGridBtn" @click="viewGrid">
          <img src="@/assets/images/menu_wggl.svg" />
          <el-button type="text">网格</el-button>
        </div>
      </el-tooltip>
    </div>
    <!-- 右下角图层切换 -->
    <switch-layers
      class="layers-box"
      @getChecking="getChecking"
    ></switch-layers>
    <!-- 右上角绘制按钮 -->
    <div class="btn" v-if="drawingTool">
      <el-button
        style="font-size: 14px"
        size="mini"
        :type="this.isDraw ? 'primary' : 'danger'"
        @click="drawStart"
      >
        {{ this.buttonText }}
      </el-button>
      <el-button
        style="font-size: 14px"
        size="mini"
        @click="submitPoints"
        v-if="isSavePoints"
      >
        保存
      </el-button>
    </div>
    <!-- 气泡弹窗 -->
    <div id="popup" class="ol-popup" v-show="showPop">
      <div v-if="popType == 'xuexiao'">
        <el-row>
          <el-col :span="18">{{ popData.name }}</el-col>
          <el-col :span="6">
            <a href="#" id="popup-close" class="ol-popup-closer"></a>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row class="font">
          <table>
            <tr>
              <td style="width: 40%; vertical-align: top">学校名称：</td>
              <td style="width: 60%">{{ popData.name }}</td>
            </tr>
            <tr>
              <td style="width: 40%; vertical-align: top">在校学生人数：</td>
              <td style="width: 60%">{{ popData.zxxsrs }}</td>
            </tr>
            <tr>
              <td style="width: 40%; vertical-align: top">学校地址：</td>
              <td style="width: 60%">{{ popData.xxdz }}</td>
            </tr>
            <tr>
              <td style="width: 40%; vertical-align: top">学校办学类型：</td>
              <td style="width: 60%">{{ popData.xxbxlx }}</td>
            </tr>
            <tr>
              <td style="width: 40%; vertical-align: top">所属行政部门：</td>
              <td style="width: 60%">{{ popData.xxsszgjyxzbm }}</td>
            </tr>
            <tr>
              <td style="width: 40%; vertical-align: top">校长姓名：</td>
              <td style="width: 60%">{{ popData.xzxm }}</td>
            </tr>
            <tr>
              <td style="width: 40%; vertical-align: top">校长联系方式：</td>
              <td style="width: 60%">{{ popData.xzlxfs }}</td>
            </tr>
          </table>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="searchNearby"
            v-hasPermi="['jcyw:xxzb:zbgl:list']"
            >周边查询</el-button
          >
        </el-row>
      </div>
      <div v-if="popType == 'renyuan'">
        <el-row>
          <el-col :span="18">{{ popData.xm }}</el-col>
          <el-col :span="6">
            <a href="#" id="popup-close" class="ol-popup-closer"></a>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <people-info :popData="popData"></people-info>
      </div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import Overlay from 'ol/Overlay'
import Feature from 'ol/Feature'
import { Polygon, circular } from 'ol/geom/Polygon'
import Point from 'ol/geom/Point'
import Circle from 'ol/geom/Circle'
import { Style, Fill, Stroke, Text, Icon } from 'ol/style'
import { getCenter, boundingExtent } from 'ol/extent'
import { ImageStatic, Vector as VectorSource } from 'ol/source'
import mapconfig from './mapconfig'
import { getArea, getLength, Sphere } from 'ol/sphere'
import { defaults } from 'ol/control'
import TileLayer from 'ol/layer/Tile'
import {
  TileSuperMapRest,
  QueryBySQLParameters,
  QueryService
} from '@supermap/iclient-ol'
import '@supermap/iclient-ol/dist/iclient-openlayers.min.css'
import XYZ from 'ol/source/XYZ'
import TreeNodeDialogVue from '../../views/tool/build/TreeNodeDialog.vue'
import switchLayers from '@/views/wggl/components/switchLayers.vue'
import peopleInfo from './Popups/peopleInfo.vue'
import * as olTransform from 'ol/transform'

export default {
  name: 'OlMap',
  components: {
    switchLayers,
    peopleInfo
  },
  props: {
    // 是否显示放大缩小居中工具箱
    zoomTool: {
      type: Boolean,
      default: false
    },
    // 是否显示测量工具箱
    measureTool: {
      type: Boolean,
      default: false
    },
    // 是否显示图层切换工具箱
    checkLayerTool: {
      type: Boolean,
      default: false
    },
    // 是否显示绘制按钮
    drawingTool: {
      type: Boolean,
      default: false
    },
    // 是否显示右上角社区网格按钮
    communityAndGrid: {
      type: Boolean,
      default: false
    },
    // 表头配置
    gridData: {
      type: Array,
      default: () => []
    },
    // 画圆的半径
    distance: {
      type: String,
      default: '0.5'
    },
    // 圆形范围内查询到的数据
    pointArr: {
      type: Array,
      default: () => []
    },
    // 地图中心点
    mapCenter: {
      type: Array,
      default: () => []
    },
    // 地图缩放级别
    mapZoom: {
      type: Number,
      default: 18
    },
    // 圆形范围内查询到重点人员的数据
    zdrypointArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: null,
      draw: null,
      pointSource: null,
      pointLayer: null,
      gridSource: null,
      gridLayer: null,
      circleSource: null,
      circleLayer: null,
      zdrySource: null,
      zdryLayer: null,
      mapView: null,
      draw: null,
      mapClick: null,
      popupLayer: null,
      mapOptions: [],
      mapLayerArr: [],
      viewCommunityBtn: false,
      viewGridBtn: false,
      viewCommunityText: '',
      viewGridText: '',
      boxshow: false,
      isDraw: true,
      isSavePoints: false,
      buttonText: '开始绘制',
      measuring: false, // 是否测量绘制中
      showPop: false,
      popData: {},
      selectRadiusBtnStatus: false,
      popType: 'xuexiao'
    }
  },
  watch: {
    gridData(val) {
      this.formatCoordinatesData(val)
    },
    distance(val) {
      this.circleSource.clear()
      this.drawingCircle(this.popData.jd, this.popData.wd, val * 1000)
    },
    pointArr(val) {
      this.drawingPointArr(val)
    },
    selectRadiusBtnStatus(val) {
      this.$emit('getSelectRadiusBtnStatus', val)
      if (!val) {
        this.popupLayer.setPosition(undefined)
      }
    },
    mapCenter(val) {
      this.map.getView().setZoom(this.mapZoom)
      this.map.getView().setCenter(val)
      this.zdrySource.clear()
    },
    mapZoom(val) {
      this.map.getView().setZoom(val)
    },
    zdrypointArr(val) {
      this.zdrySource.clear()
      this.drawingZdryPoint(val)
    }
  },
  methods: {
    initMap() {
      this.pointSource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.pointLayer = new VectorLayer({
        source: this.pointSource
      })
      this.gridSource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.gridLayer = new VectorLayer({
        source: this.gridSource,
        style: [
          new Style({
            stroke: new Stroke({
              color: 'rgba(255,0,0,0.6)',
              width: 2
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.4)'
            }),
            text: new Text({
              font: '18px Microsoft YaHei',
              fill: new Fill({
                color: 'red'
              })
            })
          })
        ]
      })
      this.circleSource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.circleLayer = new VectorLayer({
        source: this.circleSource
      })
      this.zdrySource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.zdryLayer = new VectorLayer({
        source: this.zdrySource
      })
      this.mapLayerArr = []
      for (let i = 0; i < this.mapOptions.length; i++) {
        if (this.mapOptions[i].dictValue == 6) {
          this.mapLayerArr.push(
            new TileLayer({
              source: new XYZ({
                url: this.mapOptions[i].remark,
                wrapX: true
              }),
              visible: false
            })
          )
        } else {
          this.mapLayerArr.push(
            new TileLayer({
              source: new TileSuperMapRest({
                url: this.mapOptions[i].remark,
                wrapX: true
              }),
              visible: false
            })
          )
        }
      }
      this.mapLayerArr.push(this.circleLayer)
      this.mapLayerArr.push(this.gridLayer)
      this.mapLayerArr.push(this.pointLayer)
      this.mapLayerArr.push(this.zdryLayer)

      var mapcontainer = this.$refs.rootmap
      this.map = new Map({
        target: mapcontainer,
        layers: this.mapLayerArr,
        view: new View({
          projection: 'EPSG:4326', //使用这个坐标系
          center: [mapconfig.x, mapconfig.y],
          zoom: mapconfig.zoom,
          maxZoom: mapconfig.maxZoom
        }),
        controls: defaults({
          zoom: false,
          rotate: false,
          attribution: false
        })
      })

      var container = document.getElementById('popup')
      this.popupLayer = new Overlay({
        element: container,
        autuPan: true
      })
      this.setMapCenter()
      this.popupLayer.setPosition(undefined)
      this.map.addOverlay(this.popupLayer)
      this.addPointClick()
    },
    loadMap() {
      this.mapOptions =
        mapconfig.url || JSON.parse(localStorage.getItem('mapSource'))
      this.initMap()
      for (let i = 0; i < this.mapOptions.length; i++) {
        if (this.mapOptions[i].isDefault === 'Y') {
          this.mapView = this.mapOptions[i].dictValue
          this.checkMapView(this.mapOptions[i].dictValue)
        }
        // 暂时默认使用深色地图
        // if (this.mapOptions[i].dictValue === '3') {
        //   this.mapView = this.mapOptions[i].dictValue
        //   this.checkMapView(this.mapOptions[i].dictValue)
        // }
      }
    },
    // 放大
    addZoom() {
      this.map.getView().animate({ zoom: this.map.getView().getZoom() + 1 }) // 有动画
    },
    // 居中
    setMapCenter() {
      this.map
        .getView()
        .animate(
          { zoom: this.map.getView().setZoom(10) },
          { center: [mapconfig.x, mapconfig.y] }
        ) // 有动画
    },
    // 缩小
    reduceZoom() {
      this.map.getView().animate({ zoom: this.map.getView().getZoom() - 1 }) // 有动画
    },
    getChecking(val) {
      this.checkMapView(val)
    },
    // 构建多边形结束
    drawingEnd(evt) {
      const geo = evt.feature.getGeometry()
      const area = getArea(geo, {
        projection: 'EPSG:4326'
      })
      var output
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + '平方千米'
      } else {
        output = Math.round(area * 100) / 100 + ' ' + '平方米'
      }
      this.map.removeInteraction(this.draw) // 移除绘制
      this.$modal.msgSuccess(output)
      this.measuring = false
    },
    // 测面积
    measuredArea() {
      let that = this
      if (that.measuring) {
        that.$message({
          message: '请先完成当前测量绘制',
          type: 'warning'
        })
      } else {
        that.measuring = true

        this.pointSource.clear()
        that.draw = new Draw({
          source: that.pointSource,
          type: 'Polygon'
        })
        that.map.addInteraction(that.draw)
        that.draw.on('drawend', function (evt) {
          that.drawingEnd(evt)
        })
      }
    },
    // 测距离
    measuredDistance() {
      let that = this
      if (that.measuring) {
        that.$message({
          message: '请先完成当前测量绘制',
          type: 'warning'
        })
      } else {
        that.measuring = TreeNodeDialogVue
        this.pointSource.clear()
        that.draw = new Draw({
          source: that.pointSource,
          type: 'LineString'
        })
        that.map.addInteraction(that.draw)
        that.draw.on('drawend', function (evt) {
          const geo = evt.feature.getGeometry()
          const line = getLength(geo, {
            projection: 'EPSG:4326'
          })
          var output
          if (length > 100) {
            output = Math.round((line / 1000) * 100) / 100 + ' ' + 'km'
          } else {
            output = Math.round(line * 100) / 100 + ' ' + 'm'
          }
          that.map.removeInteraction(that.draw) // 移除绘制
          that.$modal.msgSuccess(output)
          that.measuring = false
        })
      }
    },
    // 切换图层单选框
    checkMapView(val) {
      for (let i = 1; i <= this.mapOptions.length; i++) {
        if (val == i) {
          this.map
            .getLayers()
            .item(i - 1)
            .setVisible(true)
        } else {
          this.map
            .getLayers()
            .item(i - 1)
            .setVisible(false)
        }
      }
    },
    // 开始绘制
    drawStart() {
      let that = this
      if (this.isDraw) {
        that.draw = new Draw({
          source: that.gridSource,
          type: this.isDrawPoint ? 'Point' : 'Polygon'
        })
        that.map.addInteraction(that.draw)
        that.draw.on('drawend', function (evt) {
          that.drawingEnd(evt)
        })
        this.buttonText = '清除绘制'
        this.isDraw = false
      } else {
        that.gridSource.clear()
        that.map.removeInteraction(that.draw)
        this.buttonText = '开始绘制'
        this.isDraw = true
      }
      this.isSavePoints = false
    },
    submitPoints() {},
    viewCommunity() {},
    viewGrid() {},
    checkLayer() {},
    // 生成随即色
    randomColor(alpha) {
      var r = Math.floor(Math.random() * (255 + 1))
      var g = Math.floor(Math.random() * (255 + 1))
      var b = Math.floor(Math.random() * (255 + 1))
      return `rgb(${r},${g},${b},${alpha})` //返回rgba(r,g,b,a)格式颜色
    },
    // 格式化坐标数据
    formatCoordinatesData(val) {
      this.gridSource.clear()
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          let deptId = val[i].deptId
          let arr = val[i].jwdzb
          let name = val[i].deptName
          if (arr) {
            let arrParse = JSON.parse(arr)
            this.generategrid(arrParse, name, deptId)
          }
        }
        // if (point) {
        //   let extent = new boundingExtent(point)
        //   this.map.getView().setCenter(center) //设置当前地图的显示中心位置
        //   this.map.getView().fit(extent)
        // }
      } else {
        // this.$message('未查询到相关网格数据')
      }
    },
    // 根据坐标数据生成网格
    generategrid(pointArr, name, id) {
      let that = this
      let strokeColor = that.randomColor('0.8')
      let fillColor = that.randomColor('0.3')
      let fillText = that.randomColor('2')
      for (let i = 0; i < pointArr.length; i++) {
        let feature = new Feature({
          geometry: new Polygon([pointArr[i]])
        })
        let styles = [
          new Style({
            stroke: new Stroke({
              color: strokeColor,
              width: 2
            }),
            fill: new Fill({
              color: fillColor
            }),
            text: new Text({
              font: '18px Microsoft YaHei',
              text: name,
              fill: new Fill({
                color: fillText
              })
            })
          })
        ]
        feature.setStyle(styles)
        feature.setProperties({ title: name, id: id })
        that.gridLayer.getSource().addFeature(feature)
      }
    },
    drawingCircle(jd, wd, bj) {
      let metersPerUnit = this.map.getView().getProjection().getMetersPerUnit()
      let radius = bj / metersPerUnit
      // console.log('banjing', bj)
      // console.log('metersPerUnit', metersPerUnit)
      // console.log('radius', radius)
      var circleFeature = new Feature({
        geometry: new Circle([Number(jd), Number(wd)], radius)
      })
      // let circle = new Circle(
      //   transform([Number(jd), Number(wd)], 'EPSG:4326', 'EPSG:3857'),
      //   radius
      // )
      // var circleFeature = new Feature({
      //   geometry: fromCirclePolygon(circle)
      // })
      // var circleFeature = new Polygon().circular(
      //   new Sphere(6378137),
      //   [Number(jd), Number(wd)],
      //   500,
      //   64
      // )
      let styles = [
        new Style({
          stroke: new Stroke({
            color: '#b0afe494',
            width: 2
          }),
          fill: new Fill({
            color: '#b0afe494'
          })
        })
      ]
      circleFeature.setStyle(styles)
      this.circleLayer.getSource().addFeature(circleFeature)
    },
    drawingPointArr(arr) {
      let imgIcon = require('@/assets/images/school.png')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].jd) {
          let feature = this.drawingPoint(
            arr[i].jd,
            arr[i].wd,
            arr[i].id,
            arr[i].name,
            arr[i],
            imgIcon,
            'xuexiao'
          )
          this.pointLayer.getSource().addFeature(feature)
        }
      }
      this.addPointClick()
    },
    drawingZdryPoint(arr) {
      let imgIcon = require('@/assets/images/zuobiao2.png')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].jd) {
          let feature = this.drawingPoint(
            arr[i].jd,
            arr[i].wd,
            arr[i].sfzhm,
            arr[i].userName,
            arr[i],
            imgIcon,
            'renyuan'
          )
          this.zdryLayer.getSource().addFeature(feature)
        }
      }
      this.map.getView().setCenter([this.popData.jd, this.popData.wd])
      this.addPointClick()
    },
    drawingPoint(jd, wd, id, name, item, imgIcon, type) {
      let feature = new Feature({
        geometry: new Point([jd, wd])
      })
      let styles = [
        new Style({
          image: new Icon({
            anchor: [0.2, 0.9],
            crossOrigin: 'anonymous',
            src: imgIcon,
            scale: 0.7
          }),
          text: new Text({
            font: '12px Microsoft YaHei',
            text: name,
            fill: new Fill({
              // color: 'black'
            }),
            backgroundFill: new Fill({
              color: '#ffffff'
            }),
            offsetX: 5,
            offsetY: -35,
            padding: [3, 3, 3, 3]
          })
        })
      ]
      feature.setStyle(styles)
      feature.setProperties({
        id: id,
        title: name,
        pointType: type,
        info: item
      })
      return feature
    },
    clickXuexiao() {},
    clickRenyuan() {},
    addPointClick() {
      let that = this
      that.mapClick = that.map.on(
        'click',
        function (e) {
          var pixel = that.map.getEventPixel(e.originalEvent) //获取鼠标当前像素点
          var coordinate = e.coordinate //获取鼠标当前位置
          var hit = that.map.hasFeatureAtPixel(pixel) //通过像素点判断当前鼠标上是否有图形
          let feature = that.map.forEachFeatureAtPixel(
            e.pixel,
            (feature) => feature
          )
          if (hit) {
            let id = feature.getProperties().id
            let type = feature.getProperties().pointType
            if (id) {
              this.popType = type
              // this.setPopupInfo(feature, coordinate)
              if (type == 'xuexiao') {
                this.setPopupInfo(feature, coordinate)
              } else {
                // this.setPopupInfo(feature, coordinate)
                this.popData.xm = feature.getProperties().info.xm
                this.popData.lxfs = feature.getProperties().info.lxfs
                this.popData.zzmm = feature.getProperties().info.zzmm
                this.popData.xzdxzAddr = feature.getProperties().info.xzdxzAddr
                this.clickEvent(coordinate)
                // console.log('人员信息：', feature.getProperties().info)
              }
            } else {
              that.popupLayer.setPosition(undefined)
              // that.selectRadiusBtnStatus = false
              that.selectRadiusBtnStatus = type == 'xuexiao' ? false : true
            }
          } else {
            that.popupLayer.setPosition(undefined)
          }
        }.bind(this)
      )
    },
    setPopupInfo(feature, coordinate) {
      this.popData = feature.getProperties().info
      this.clickEvent(coordinate)
    },
    clickEvent(point) {
      let that = this
      that.showPop = true
      that.popupLayer.setPosition(point)
      that.map.addOverlay(that.popupLayer)
      let popupCloser = document.getElementById('popup-close')
      popupCloser.addEventListener('click', function () {
        that.popupLayer.setPosition(undefined)
        // that.selectRadiusBtnStatus = false
        // that.selectRadiusBtnStatus = type == 'xuexiao' ? false : true
      })
      that.map.on('pointermove', function (e) {
        var pixel = that.map.getEventPixel(e.originalEvent)
        var feature = that.map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature
        })
        if (feature == undefined) {
          that.map.getTargetElement().style.cursor = 'auto'
        } else {
          that.map.getTargetElement().style.cursor = 'pointer'
        }
      })
    },
    searchNearby() {
      this.selectRadiusBtnStatus = true
      this.$emit('getSelectRadiusBtnStatus', this.selectRadiusBtnStatus)
      if (this.popType == 'xuexiao') {
        this.$emit('getCenterPoint', [this.popData.jd, this.popData.wd])
      }
      this.popupLayer.setPosition(undefined)
      this.circleSource.clear()
      this.zdrySource.clear()
      this.drawingCircle(this.popData.jd, this.popData.wd, this.distance * 1000)
      this.mapZoom = 15
    }
  },
  mounted() {
    this.loadMap()
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mapCommonStyle.scss';
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.el-button--info {
  opacity: 0.8;
  background-color: #543838;
}
.el-divider--horizontal {
  margin: 5px 0;
}
td {
  padding-top: 3px;
  width: 65px;
}
.icons {
  color: white;
  text-align: center;
  font-size: 14px;
  i {
    cursor: pointer;
  }
}
.detail-button {
  position: absolute;
  z-index: 50;
  right: 20px;
  top: 20px;
  background: #202124;
  border-radius: 3px;
  opacity: 0.81;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 42px;
  box-sizing: border-box;
  padding: 0 8px;
  div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 60px;
  }
  img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .el-button {
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
  }
  .el-divider--vertical {
    width: 1px;
    height: 33px;
    background: #474748;
  }
  .el-tooltip__popper.is-dark {
    background: #202124;
    opacity: 0.8;
  }
}
.btn {
  position: absolute;
  z-index: 50;
  right: 20px;
}
.layers-box {
  position: absolute;
  z-index: 50;
  right: 20px;
  bottom: 20px;
}
.ol-popup {
  position: absolute;
  background-color: #fff;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 320px;
  font-size: 14px;
  .font {
    font-size: 12px;
  }
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: #fff;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: '✖';
}
</style>
