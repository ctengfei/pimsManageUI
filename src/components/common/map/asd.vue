<template>
  <div class="content">
    <div class="aMap-wrapper">
      <el-amap class="amap-box" :zoom="zoom" :center="center" :mapStyle="mapStyle">
        <!--坐标点-->
        <el-amap-marker v-for="marker in markers" :position="marker.position" :key="marker.id" :events="marker.events" :icon="marker.icon"></el-amap-marker>
        <!--信息窗体-->
        <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content" :offset="window.offset"></el-amap-info-window>
        <!-- 划线-->
        <el-amap-polyline :path="polyline.path" strokeColor="red" strokeStyle="solid" strokeWeight="6"></el-amap-polyline>
      </el-amap>
    </div>
  </div>
</template>
<script>
import location from '../../../assets/image/subway.png'
//起点标
import subwaybegin from '../../../assets/image/subwaybegin.png'
//终点标
import subwayend from '../../../assets/image/subwayend.png'
// import dateFunc from '../../../assets/image/exit.svg'
export default {
  data() {
    return {
      center: [121.63081, 31.233768],
      zoom: 12,
      viewMode: '3D', //使用3D视图
      mapStyle: 'amap://styles/blue', //修改地图的背景颜色
      //mapStyle: 'amap://styles/25229f7c1d46f0392397b7dcbf13ab7e',
      markers: [],
      windows: [],
      window: '',
      pointMarkerTemp: [],
      pointMarker: [], //存放gis站点信息
      //划线
      //静态数据
      // polyline:{
      //   path:[
      //     //唐镇
      //     [121.656269, 31.214107],
      //     //广兰路
      //     [121.621072,31.21105],
      //     //金科路
      //     [121.601989,31.204213],
      //     //张江高科
      //     [121.557634,31.203575],
      //     //世纪大道
      //     [121.527213, 31.228682],
      //     //外高桥保税区北站
      //     [121.586926, 31.347802]
      //   ]
      // }
      polyline: {
        path: []
      }
    }
  },
  created() {
    /*this.getStationInfo();*/
    //获取站点信息
    this.point()
  },
  methods: {
    point() {
      //自定义map点坐标图标
      let icon = new AMap.Icon({
        image: location,
        size: new AMap.Size(2, 2),
        imageSize: new AMap.Size(2, 2)
      })
      let markers = []
      let windows = []
      let that = this

      //mock接口数据
      this.$fetchGet('/api/des').then(res => {
        this.pointMarker = res.data
        this.pointMarker.forEach((item, index) => {
          if (index === this.pointMarker.length - 1) {
            markers.push({
              position: [item.lng, item.lat],
              icon: subwayend, //不设置默认蓝色水滴
              events: {
                click() {
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
          } else if (index === 0) {
            markers.push({
              position: [item.lng, item.lat],
              icon: subwaybegin, //不设置默认蓝色水滴
              events: {
                click() {
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
          } else {
            {
              markers.push({
                position: [item.lng, item.lat],
                icon: location, //不设置默认蓝色水滴
                events: {
                  click() {
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
            }
          }
          //窗体信息显示
          windows.push({
            position: [item.lng, item.lat],
            content:
              '' +
              '<div>' +
              '地铁站名称：' +
              item.stationName +
              '</div>' +
              '<div>' +
              '运行时间：' +
              item.earlyTime +
              '</div>' +
              '<div>' +
              '地 址：' +
              item.stationAddress +
              '</div>' +
              '<div>' +
              '线路名称：' +
              "<span style='color: #66A0FF'>" +
              item.subway +
              '</span>' +
              '</div>',
            offset: [5, -15], //窗体偏移
            visible: false //初始是否显示
          })
        })
        //划线
        console.log(this.pointMarker, '点位获取')
        this.pointMarker.forEach((items, index) => {
          var arrTemp = []
          arrTemp.push(items.lng)
          arrTemp.push(items.lat)
          this.polyline.path.push(arrTemp)
        })
        console.log(this.polyline.path, '划线')
      })

      //添加点标注
      this.markers = markers
      //生成弹窗
      this.windows = windows
    }
  }
}
</script>
<style scoped>
.aMap-wrapper {
  width: 100%;
  height: 960px;
}
</style>
