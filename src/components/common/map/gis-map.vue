<template>
  <div class="amapBox">
    <el-amap class="amap-box" vid="amap" :plugin="plugin" :center="mapCenter" :events="events" :zoom="zoom" ref="map" :amap-manager="amapManager">
      <!--坐标点-->
      <el-amap-marker v-for="marker in markers" :position="marker.position" :key="marker.id" :events="marker.events" :icon="marker.icon"></el-amap-marker>
      <!--信息窗体-->
      <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content" :offset="window.offset"></el-amap-info-window>
      <!-- 划线-->
      <el-amap-polyline v-if="polyline.path.length" :path="polyline.path" strokeColor="blue" strokeStyle="solid" strokeWeight="2"></el-amap-polyline>
    </el-amap>
  </div>
</template>
<script>
import { AMapManager } from 'vue-amap'
import { BuildInfo, getFloorDataByBuildId, getdeviceByFloor } from './api'
import cameraImg from '@/assets/images/5555.png'
export default {
  name: 'AMap',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      markers: [],
      windows: [],
      window: '',
      polyline: {
        path: []
      },
      zoom: 100,
      deviceArr: [],

      mapCenter: [113.336893, 23.300765],
      //

      events: {
        init: this.mapInit,
        click(e) {
          console.log('点击', e)
        }
      }, //地图事件
      plugin: [
        'DistrictSearch',
        'Geolocation',
        'Autocomplete',
        'Geocoder',
        {
          pName: 'ToolBar',
          events: {
            init(instance) {
              // console.log(instance, "instance");
            }
          },
          position: [113.31765, 23.3094]
        }
      ], //地图差距
      amapManager: new AMapManager(),
      map: null, //地图实例
      positionstr: ''
    }
  },
  mounted() {},
  methods: {
    // 地图初始化函数
    mapInit(o) {
      this.map = o

      setTimeout(() => {
        this.drawBounds(o)
      }, 200)
      document.getElementsByClassName('amap-logo')[0].style.display = 'none'
    },
    //绘制遮罩，显示某个省
    drawBounds(map) {
      //加载行政区划
      let opts = {
        subdistrict: 2, // 获取边界不需要返回下级行政区
        extensions: 'all', // 返回行政区边界坐标组等具体信息
        level: 'city', // 查询行政级别为 市
        showbiz: false // 是否显示商圈
      }
      let district = new AMap.DistrictSearch(opts)
      let polygons = []
      district.setLevel('白云区')
      district.search('白云区', (status, result) => {
        if (status == 'complete' && result.info == 'OK') {
          map.remove(polygons) //清除上次结果
          polygons = []
          let bounds = result.districtList[0].boundaries
          if (bounds) {
            for (let i = 0, l = bounds.length; i < l; i++) {
              //生成行政区划polygon
              let polygon = new AMap.Polygon({
                path: bounds[i], // 多边形的路径数组
                fillOpacity: 0, // 填充透明度
                fillColor: '#ffffff', // 填充颜色
                strokeOpacity: 0.2, // 线条透明度
                strokeColor: '#0A1A29', // 线条颜色
                strokeWeight: 3 // 线条宽度
              })
              polygons.push(polygon)
            }
          }
          map.add(polygons)
          // map.setFitView(polygons);//视口自适应

          //那遥远的四个点在这
          let outer = [new AMap.LngLat(-360, 90, true), new AMap.LngLat(-360, -90, true), new AMap.LngLat(360, -90, true), new AMap.LngLat(360, 90, true)]
          let holes = result.districtList[0].boundaries

          let pathArray = [outer]
          pathArray.push.apply(pathArray, holes)
          let polygon = new AMap.Polygon({
            //线条颜色，使用16进制颜色代码赋值。默认值为#006600
            strokeColor: 'rgb(20,164,173)',
            strokeColor: '#001826',
            strokeWeight: 1,
            //轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
            strokeOpacity: 0.5,
            //多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
            fillColor: '#ffffff',
            //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
            fillOpacity: 1,
            //轮廓线样式，实线:solid，虚线:dashed
            strokeStyle: 'solid'
          })
          polygon.setPath(pathArray)
          map.add(polygon)
          // map.setZoom(15);
        } else {
          console.error('查询失败:', result.info || '未知错误')
        }
      })
      // this.devicePoint();
      // this.trackLine();
      switch (this.type) {
        case 'peopleControl':
          break
        case 'carControl':
          break
        default:
          this.getDeviceInfo()
      }
    },
    // 路线轨迹
    trackLine() {
      let vm = this
      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }
        var emptyLineStyle = {
          lineWidth: 2,
          fillStyle: null,
          strokeStyle: null,
          borderStyle: null
        }

        var pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          //autoSetFitView:false,
          map: vm.map, //所属的地图实例

          getPath: function (pathData, pathIndex) {
            return pathData.path
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            return null
          },
          renderOptions: {
            //将点、线相关的style全部置emptyLineStyle
            pathLineStyle: emptyLineStyle,
            pathLineSelectedStyle: emptyLineStyle,
            pathLineHoverStyle: emptyLineStyle,
            keyPointStyle: emptyLineStyle,
            startPointStyle: emptyLineStyle,
            endPointStyle: emptyLineStyle,
            keyPointHoverStyle: emptyLineStyle,
            keyPointOnSelectedPathLineStyle: emptyLineStyle
          }
        })
        window.pathSimplifierIns = pathSimplifierIns

        pathSimplifierIns.setData([
          {
            name: '轨迹',
            path: [
              [113.31766, 23.3095],
              [113.31767, 23.3096],
              [113.31768, 23.3097],
              [113.31769, 23.3098],
              [113.3177, 23.3099],
              [113.31778, 23.3102],
              [113.31789, 23.3112]
            ]
          }
        ])
        function onload() {
          pathSimplifierIns.renderLater()
        }

        function onerror(e) {
          alert('图片加载失败！')
        }

        var navg1 = pathSimplifierIns.createPathNavigator(0, {
          loop: false,
          speed: 1000000,
          pathNavigatorStyle: {
            width: 24,
            height: 24,
            //使用图片
            content: PathSimplifier.Render.Canvas.getImageContent(require('@/assets/images/dian.png'), onload, onerror),
            // strokeStyle: 'transparent',
            // fillStyle: {

            // },
            //经过路径的样式
            pathLinePassedStyle: {
              lineWidth: 6,
              strokeStyle: 'black',
              dirArrowStyle: {
                stepSpace: 25,
                strokeStyle: 'red'
              }
            }
          }
        })
        navg1.start()
      })
    },
    // 获取设备信息
    getDeviceInfo() {
      getdeviceByFloor({ queryType: 'common', deviceType: 'camera' }).then(res => {
        if (res.data.length) {
          this.deviceArr = res.data
          // this.devicePoint(this.deviceArr);
          let arr = []
          this.deviceArr.map(item => {
            if (Number(item.latitude) + Number(item.longitude)) {
              arr.push(item)
            }
          })
          this.point(arr)
        }
      })
    },

    // 地图打点
    markerPoint(lonLat) {
      let vm = this
      // marker定位打点
      AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
        new SimpleMarker({
          //显示定位基点
          showPositionPoint: true,
          iconStyle: 'red',
          map: vm.map,
          position: lonLat
        })
      })
    },
    // 设备信息查看
    devicePoint(deviceArr) {
      console.log(deviceArr, '1111')
      let vm = this
      AMapUI.loadUI(['misc/MarkerList', 'overlay/SvgMarker', 'overlay/SimpleInfoWindow'], function (MarkerList, SvgMarker, SimpleInfoWindow) {
        if (!SvgMarker.supportSvg) {
          //当前环境并不支持SVG，此时SvgMarker会回退到父类，即SimpleMarker
          alert('当前环境不支持SVG')
        }
        var markerList = new MarkerList({
          //关联的map对象
          map: vm.map,
          //列表的dom容器的id
          // listContainer: 'my-list',
          //需要监听的列表节点事件
          listElementEvents: ['click', 'mouseenter', 'mouseleave'],
          //需要监听的marker事件
          markerEvents: ['click', 'mouseover', 'mouseout'],
          //需要监听的infoWindow事件
          infoWindowEvents: ['click', 'mouseover', 'mouseout'],
          //返回数据项的Id
          // getDataId: function (dataItem, index) {
          //     //index表示该数据项在数组中的索引位置，从0开始，如果确实没有id，可以返回index代替
          //     return dataItem.name;
          // },
          //返回数据项的位置信息，需要是AMap.LngLat实例，或者是经纬度数组，比如[116.789806, 39.904989]
          getPosition: function (dataItem) {
            return dataItem.position
          },
          //返回数据项对应的Marker
          getMarker: function (dataItem, context, recycledMarker) {
            // getInnerHTML
            var label = dataItem.name
            //存在可回收利用的marker
            if (recycledMarker) {
              //直接更新内容返回
              recycledMarker.setIconLabel(label)
              return recycledMarker
            }
            //返回一个新的Marker
            return new SvgMarker(
              new SvgMarker.Shape.WaterDrop({
                height: 60,
                strokeWidth: 1,
                strokeColor: '#ccc',
                fillColor: '#8beb3b'
              }),
              {
                iconLabel: label,
                containerClassNames: 'my-svg-marker',
                showPositionPoint: true
              }
            )
          },
          getInfoWindow: function (dataItem, context, recycledInfoWindow) {
            if (recycledInfoWindow) {
              //存在可回收利用的infoWindow, 直接更新内容返回
              recycledInfoWindow.setInfoTitle(dataItem.name)
              recycledInfoWindow.setInfoBody(dataItem)
              return recycledInfoWindow
            }
            //返回一个新的InfoWindow
            return new SimpleInfoWindow({
              offset: new AMap.Pixel(0, -57),
              infoTitle: dataItem.name,
              infoBody: dataItem.id
            })
          }
        })
        //监听选中改变
        markerList.on('selectedChanged', function (event, info) {
          console.log(`output->info.selected.data`, info.selected.data)
          info.selected.data.deviceType = 'camera'
          info.selected.data.deviceCode = info.selected.data.code
          info.selected.data.deviceName = info.selected.data.name
          vm.$emit('deviceInfo', info.selected.data)
        })
        //构建一个数据项数组，数据项本身没有格式要求，但需要支持下述的getDataId和getPosition
        let tempData = []
        deviceArr.map(items => {
          if (Number(items.latitude) + Number(items.longitude)) {
            tempData.push({
              id: items.id,
              code: items.deviceCode,
              name: items.name,
              position: [items.longitude, items.latitude],
              address: items.deviceAddress
            })
          }
        })

        //展示该数据
        markerList.render(tempData)
      })
    },

    point(data) {
      let that = this
      let markers = []
      let windows = []

      data.map((item, index) => {
        markers.push({
          id: item.id,
          code: item.deviceCode,
          deviceCode: item.deviceCode,
          deviceName: item.name,
          name: item.name,
          position: [item.longitude, item.latitude],
          address: item.deviceAddress,
          icon: cameraImg,
          deviceType: 'camera',
          events: {
            click(e) {
              that.$emit('deviceInfo', that.markers[index])
              that.windows.forEach(window => {
                window.visible = false //关闭窗体
              })
              that.window = that.windows[index]
              that.$nextTick(() => {
                that.window.visible = true //点击点坐标，出现信息窗体
              })
            }
          }
        })
        windows.push({
          position: [item.longitude, item.latitude],
          content: `
                    <div style="font-size:14px;">
                      <div>类型：${item.cameraType}</div>
                      <div>地址：${item.deviceAddress}</div>
                    </div>
                  `,
          offset: [5, -15], //窗体偏移
          visible: false //初始是否显示
        })
      })

      //添加点标注
      this.markers = markers
      //生成弹窗
      this.windows = windows
    },
    addLineFeature(data) {
      this.polyline.path = []
      //划线
      console.log(data, '点位获取')
      data.forEach((item, index) => {
        var arrTemp = []
        arrTemp.push(item.longitude)
        arrTemp.push(item.latitude)
        this.polyline.path.push(arrTemp)
      })
      console.log(this.polyline.path, '划线')
    }
  },
  beforeDestroy() {
    let vm = this
    // 清理地图事件监听，避免内存泄漏
    if (vm.map) {
      vm.map.off('click')
    }
  }
}
</script>
<style scoped lang="scss">
.amapBox {
  width: 100%;
  height: 100%;
}
</style>
<style>
.amap-marker-label {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  border: none;
  -webkit-box-shadow: 1px 2px 4px #cccccc;
  -moz-box-shadow: 1px 2px 4px #cccccc;
  box-shadow: 1px 2px 4px #cccccc;
}

.my-svg-marker .amap-simple-marker-label {
  width: 100px;
  color: #000;
  top: 10px;
  font-size: 14px;
}
</style>
