<!--
 * @Author: renjianwu jwrenx@isstech.com
 * @Date: 2023-03-10 09:29:58
 * @LastEditors: renjianwu jwrenx@isstech.com
 * @LastEditTime: 2023-03-29 14:24:41
 * @FilePath: \pimsManageUI\src\views\wggl\components\olMap.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    id="map"
    ref="rootmap"
    class="map-container"
    style="width: 100%; height: 100%"
  >
    <div class="search-detail-box">
      <div class="search-control">
        <el-autocomplete
          v-model="searchText"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入地点"
          clearable
          @select="handleSelect"
        >
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-search"
            @click="searchAll"
          ></el-button>
          <template slot-scope="{ item }">
            <div class="search-poi-list">
              <div class="mr-10px">
                <i class="el-icon-search"></i>
              </div>
              <div class="mr-12px poi-name">
                {{ item.values_.NAMEC }}
              </div>
              <div class="mr-10px poi-addr">
                {{ item.values_.ADDRESS2 }}
              </div>
            </div>
          </template>
        </el-autocomplete>
      </div>
      <div class="detail-button">
        <div @click="startDrawing">
          <i class="el-icon-full-screen"></i>
          <el-button type="text">绘制</el-button>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div @click="editDrawing">
          <i class="el-icon-edit"></i>
          <el-button type="text">修改</el-button>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div @click="delDrawing">
          <i class="el-icon-delete"></i>
          <el-button type="text">删除</el-button>
        </div>
      </div>
    </div>

    <switch-layers
      class="layers-box"
      @getChecking="getChecking"
    ></switch-layers>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import Polygon from 'ol/geom/Polygon'
import Feature from 'ol/Feature'
import { Style, Fill, Stroke, Text, Icon } from 'ol/style'
import { ImageStatic, Vector as VectorSource } from 'ol/source'
import { getCenter, boundingExtent } from 'ol/extent'
import mapconfig from '../mapconfig'
import TileLayer from 'ol/layer/Tile'
import { Logo, TileSuperMapRest } from '@supermap/iclient-ol'
import '@supermap/iclient-ol/dist/iclient-openlayers.min.css'
import XYZ from 'ol/source/XYZ'
import Select from 'ol/interaction/Select'
import Modify from 'ol/interaction/Modify'
import { unByKey } from 'ol/Observable'
import { randomColor } from '@/utils'
// import switchLayers from './switchLayers.vue'
import {
  GetFeaturesBySQLParameters,
  FeatureService
} from '@supermap/iclient-ol'
import GeoJSON from 'ol/format/GeoJSON'
import { getDicts } from '@/api/system/dict/data'

export default {
  components: {
    //switchLayers
  },
  props: {
    pointArr: '',
    gridName: '',
    rowData: Object,
    AllPointArr: '',
    isDrawGrid: {
      type: Boolean,
      default: false
    },
    selfData: '',
    superiorScope: ''
  },
  data() {
    return {
      map: null,
      Draw: null,
      source: null,
      vector: null,
      pointLayer: null,
      newLayer: null,
      newSpurce: null,
      treeData: [],
      disableDraw: false,
      rules: {},
      isDrawGrids: this.isDrawGrid, // true:绘制网格；false:绘制边界
      boundaryArr: [], //如果绘制边界，可存多个网格
      buttonText: '绘制网格',
      isDraw: true,
      mapView: null,
      mapOptions: [],
      mapLayerArr: [],
      mapUrl: {},
      delPoint: [],
      allPoint: [],
      boundarySource: null,
      boundaryLayer: null,
      sketch: null,
      select_f: null,
      modify_f: null,
      mapDelClick: null,
      mapEditSelectClick: null,
      searchText: '',
      mapDataSource: '',
      poiQueryResult: [],
      querySource: null,
      queryLayer: null
    }
  },
  watch: {},
  methods: {
    getChecking(val) {
      this.checkMapView(val)
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
    startDrawing() {
      let that = this
      that.$message({
        showClose: true,
        message: '已进入绘制网格模式，请点击地图进行绘制。',
        type: 'success'
      })
      that.endDrawing()
      unByKey(that.mapDelClick) // 移除删除的点击事件
      unByKey(that.mapEditSelectClick) // 移除编辑的点击事件
      that.draw = new Draw({
        source: that.source,
        type: 'Polygon'
      })
      that.map.addInteraction(that.draw)
      that.draw.on('drawend', function (evt) {
        that.drawingEnd(evt)
        setTimeout(function () {
          that.endDrawing()
        }, 1000)
      })
    },
    endDrawing() {
      let that = this
      that.map.removeInteraction(that.draw)
      that.map.removeInteraction(that.select_f)
      that.map.removeInteraction(that.modify_f)
      let feature = that.source.getFeatures()
      let featureArr = []
      feature.forEach((item) => {
        var name = item.getProperties().title
        if (name == that.gridName) {
          let flatCoordinates = item.getGeometry().flatCoordinates
          let newArr = that.formatPoint(flatCoordinates)
          featureArr.push(newArr)
        }
      })
      that.$emit('getDrawingPoint', featureArr)
    },
    editDrawing() {
      let that = this
      that.$message({
        showClose: true,
        message: '已进入修改模式，请点击需要修改的网格。',
        type: 'warning'
      })
      unByKey(that.mapDelClick) // 移除删除的点击事件
      that.addMapEditSelectClick()
      that.select_f = new Select({
        multi: false //取消多选
      })
      that.map.addInteraction(that.select_f)
      that.modify_f = new Modify({
        features: that.select_f.getFeatures() //将选中的要素添加修改功能
      })
      that.select_f.on('select', function (evt) {
        if (evt.selected.length == 1) {
          if (evt.selected[0].values_.title == that.gridName) {
            // let beforeEdit = evt.selected[0].getGeometry().getCoordinates()[0]
            that.map.addInteraction(that.modify_f)
            that.sketch = evt.selected[0]
          } else {
            that.endDrawing()
          }
        }
      })
      //监听要素修改时
      that.modify_f.on('modifyend', function (evt) {
        let new_feature = evt.features.item(0)
        if (new_feature) {
          // let afterEdit = evt.features.item(0).getGeometry().getCoordinates()[0]
          let feature = that.source.getFeatures()
          let featureArr = []
          feature.forEach((item) => {
            var name = item.getProperties().title
            if (name == that.gridName) {
              let flatCoordinates = item.getGeometry().flatCoordinates
              let newArr = that.formatPoint(flatCoordinates)
              featureArr.push(newArr)
            }
          })
          that.$emit('getDrawingPoint', featureArr)
          that.sketch = new_feature
        }
      })
    },
    formatPoint(val) {
      let arr1 = val.filter((item, index) => index % 2 === 0)
      let arr2 = val.filter((item, index) => index % 2 != 0)
      let arr = []
      for (let i = 0; i < arr1.length; i++) {
        arr.push([arr1[i], arr2[i]])
      }
      return arr
    },
    // 构建多边形结束
    drawingEnd(evt) {
      evt.feature.setProperties({ title: this.gridName })
      let styles = [
        new Style({
          stroke: new Stroke({
            color: '#1485f9ab',
            width: 1
          }),
          fill: new Fill({
            color: '#e9477485'
          }),
          text: new Text({
            font: '18px Microsoft YaHei',
            text: this.gridName,
            fill: new Fill({
              color: '#2a41c3'
            })
          })
        })
      ]
      evt.feature.setStyle(styles)
    },
    generateGrid(pointArr, name, deptId) {
      let colors = randomColor()
      let strokeColor = this.isDrawGrids ? colors[0] : '#b0afe494'
      let fillColor = this.isDrawGrids ? colors[1] : '#b0afe494'
      let status =
        deptId == this.selfData[0].deptId && this.isDrawGrids ? true : false
      let feature
      let styles = [
        new Style({
          stroke: new Stroke({
            color: status ? '#f20909bd' : strokeColor,
            width: status ? 3 : 1
          }),
          fill: new Fill({
            color: fillColor
          }),
          text: new Text({
            font: '18px Microsoft YaHei',
            text: name,
            fill: new Fill({
              color: status ? '#f20909bd' : '#2a41c3'
            })
          })
        })
      ]

      if (pointArr.length > 1) {
        for (let j = 0; j < pointArr.length; j++) {
          feature = new Feature({
            geometry: new Polygon([pointArr[j]])
          })
          feature.setStyle(styles)
          feature.setProperties({ title: name, id: deptId })
          this.pointLayer.getSource().addFeature(feature)
        }
      } else {
        feature = new Feature({
          geometry: new Polygon(pointArr)
        })
        feature.setStyle(styles)
        feature.setProperties({ title: name, id: deptId })
        this.pointLayer.getSource().addFeature(feature)
      }
    },
    setCenter(pointArr) {
      let extent = new boundingExtent(pointArr) //获取一个坐标数组的边界，格式为[minx,miny,maxx,maxy]
      let center = new getCenter(extent) //获取边界区域的中心位置
      this.map.getView().setCenter(center) //设置当前地图的显示中心位置
    },
    initMap() {
      this.source = new VectorSource({
        wrapX: false,
        features: []
      })
      this.pointLayer = new VectorLayer({
        source: this.source
      })
      this.newSpurce = new VectorSource({
        wrapX: false,
        features: []
      })
      this.newLayer = new VectorLayer({
        source: this.newSpurce,
        style: [
          new Style({
            stroke: new Stroke({
              color: 'rgba(255,0,0,0.6)',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.4)'
            }),
            text: new Text({
              font: '18px Microsoft YaHei',
              fill: new Fill({
                color: '#2a41c3'
              })
            })
          })
        ]
      })
      this.boundarySource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.boundaryLayer = new VectorLayer({
        source: this.boundarySource
      })
      this.querySource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.queryLayer = new VectorLayer({
        source: this.querySource,
        style: [
          new Style({
            stroke: new Stroke({
              color: '#0099ff',
              width: 5
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.4)'
            }),
            image: new Icon({
              crossOrigin: 'anonymous',
              src: require('@/assets/images/zuobiao2.png')
            })
          })
        ]
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
      this.mapLayerArr.push(this.pointLayer)
      this.mapLayerArr.push(this.newLayer)
      this.mapLayerArr.push(this.boundaryLayer)
      this.mapLayerArr.push(this.queryLayer)
      var mapcontainer = this.$refs.rootmap
      this.map = new Map({
        target: mapcontainer,
        layers: this.mapLayerArr,
        view: new View({
          projection: 'EPSG:4326', //使用这个坐标系
          center: [mapconfig.x, mapconfig.y],
          zoom: mapconfig.zoom,
          maxZoom: mapconfig.maxZoom
        })
      })
    },
    // 绘制上级边界
    setDrawBoundary() {
      let point = JSON.parse(this.superiorScope.jwdzb)
      let feature = new Feature({
        geometry: new Polygon(point)
      })
      let styles = [
        new Style({
          stroke: new Stroke({
            color: '#1485f9ab',
            width: 2
          })
        })
      ]
      feature.setStyle(styles)
      this.boundaryLayer.getSource().addFeature(feature)
    },
    drawing() {
      let sparePoint
      if (this.AllPointArr && this.AllPointArr.length) {
        sparePoint = this.AllPointArr[0].jwdzb
        for (let i = 0; i < this.AllPointArr.length; i++) {
          let deptId = this.AllPointArr[i].deptId
          let arr = this.AllPointArr[i].jwdzb
          let name = this.AllPointArr[i].deptName
          if (arr) {
            let arrParse = JSON.parse(arr)
            this.generateGrid(arrParse, name, deptId)
          }
        }
      }
      if (this.selfData[0] && this.selfData[0].zxdzb) {
        let point1 = JSON.parse(this.selfData[0].jwdzb)
        let extent = new boundingExtent(point1[0])
        let center = new getCenter(extent) // 获取边界区域的中心位置
        this.map.getView().setCenter(center) // 设置当前地图的显示中心位置
        this.map.getView().fit(extent, { padding: [300, 300, 300, 300] })
        this.map.getView().animate({
          center: center, // 中心点
          duration: 1000 // 缩放持续时间，默认不须要设置
        })
      } else {
        let point
        if (this.superiorScope && this.superiorScope.jwdzb) {
          point = JSON.parse(this.superiorScope.jwdzb)
        } else {
          point = JSON.parse(sparePoint)
        }
        let extent = new boundingExtent(point[0])
        let center = new getCenter(extent) // 获取边界区域的中心位置
        this.map.getView().setCenter(center) // 设置当前地图的显示中心位置
        this.map.getView().fit(extent, { padding: [300, 300, 300, 300] })
        this.map.getView().animate({
          center: center, // 中心点
          duration: 1000 // 缩放持续时间，默认不须要设置
        })
      }
      if (this.superiorScope && this.superiorScope.jwdzb) {
        this.setDrawBoundary() // 绘制上级边界
      }
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
      }
    },
    // 删除状态下的地图点击事件
    addMapDelClick() {
      let that = this
      that.mapDelClick = that.map.on(
        'click',
        function (e) {
          var pixel = that.map.getEventPixel(e.originalEvent) //获取鼠标当前像素点
          var hit = that.map.hasFeatureAtPixel(pixel) //通过像素点判断当前鼠标上是否有图形
          let feature = that.map.forEachFeatureAtPixel(
            e.pixel,
            (feature) => feature
          )
          if (hit) {
            let name = feature.getProperties().title
            if (name == this.gridName) {
              that
                .$confirm('确定删除?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                .then(() => {
                  that.pointLayer.getSource().removeFeature(feature)
                  that.endDrawing()
                })
                .catch(() => {})
            }
          } else {
            that.endDrawing()
          }
        }.bind(this)
      )
    },
    // 编辑状态下的地图点击事件
    addMapEditSelectClick() {
      let that = this
      that.mapEditSelectClick = that.map.on(
        'click',
        function (e) {
          var pixel = that.map.getEventPixel(e.originalEvent) //获取鼠标当前像素点
          var hit = that.map.hasFeatureAtPixel(pixel) //通过像素点判断当前鼠标上是否有图形
          if (!hit) {
            unByKey(this.mapEditSelectClick) // 移除编辑的点击事件
            that.endDrawing()
          }
        }.bind(this)
      )
    },
    delDrawing() {
      this.$message({
        showClose: true,
        message: '已进入删除模式，请点击需要删除的网格。',
        type: 'error'
      })
      unByKey(this.mapEditSelectClick) // 移除编辑的点击事件
      this.endDrawing()
      this.addMapDelClick()
    },
    getChecking(val) {
      this.checkMapView(val)
    },
    handleSelect(item) {
      this.searchText = item.values_.NAMEC
      this.querySource.clear()
      this.querySource.addFeatures([item])
      this.map
        .getView()
        .animate(
          { zoom: this.map.getView().setZoom(12) },
          { center: item.values_.geometry.flatCoordinates }
        )
    },
    async querySearchAsync(queryString, callback) {
      this.getFeaturesByPoiName(queryString)
      this.poiQueryResult = await this.getFeaturesByPoiName(queryString)
      callback(this.poiQueryResult)
    },
    getMapDataSourceUrl() {
      let type = process.env.VUE_APP_MAP_URL_DICT + '_zy'
      getDicts(type).then((res) => {
        this.mapDataSource = res.data[0].remark
      })
    },
    getFeaturesByPoiName(queryString) {
      return new Promise((relove, reject) => {
        let that = this
        var featureService = new FeatureService(that.mapDataSource)
        var sqlParam = new GetFeaturesBySQLParameters({
          queryParameter: {
            attributeFilter: `NAMEC like '%${queryString}%'`
          },
          datasetNames: ['shiliang20220701:Poi']
        })
        featureService.getFeaturesBySQL(sqlParam, function (serviceResult) {
          var features = new GeoJSON().readFeatures(
            serviceResult.result.features
          )
          relove(features)
        })
      })
    },
    searchAll() {
      let that = this
      var featureService = new FeatureService(that.mapDataSource)
      var sqlParam = new GetFeaturesBySQLParameters({
        queryParameter: {
          attributeFilter: `NAMEC like '%${that.searchText}%'`
        },
        datasetNames: ['shiliang20220701:Poi']
      })
      featureService.getFeaturesBySQL(sqlParam, function (serviceResult) {
        var features = new GeoJSON().readFeatures(serviceResult.result.features)
        that.querySource.clear()
        that.querySource.addFeatures(features)
      })
    }
  },
  mounted() {
    let that = this
    that.loadMap()
    this.getMapDataSourceUrl()
    setTimeout(function () {
      that.drawing()
      that.endDrawing()
    }, 300)
  }
}
</script>

<style>
#map {
  height: 100%;
}
/*隐藏ol的一些自带元素*/
.ol-attribution,
.ol-zoom {
  display: none;
}
.btn.active,
.btn:active {
  box-shadow: none;
}
</style>
<style lang="scss" scoped>
@import '~@/assets/styles/mapCommonStyle.scss';
.map-container {
  position: relative;
}
.el-divider--horizontal {
  margin: 5px 0;
}
.layers-box {
  position: absolute;
  z-index: 50;
  right: 20px;
  bottom: 80px;
}
</style>
