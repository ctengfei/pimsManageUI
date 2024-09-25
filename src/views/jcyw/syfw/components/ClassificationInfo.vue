<template>
  <div class="classification_wrap" ref="classification_wrap">
    <div class="tabWrap" ref="tabWrap">
      <el-divider></el-divider>
      <div class="tabWrapDiv" ref="tabWrapDiv">
         <a
        @click="toAnchor(index)"
        :class="index == activeIndex ? 'activeStyle' : ''"
        :href="item.anchorpoint"
        v-for="(item, index) in tabMenuList"
        :key="index"
        >{{ item.name }}</a
      >
      </div>

    </div>
    <div class="classificationInfo">
      <div v-if="routeParams.sfczfw != 'N'" id="hj" ref="hj">
        <div class="type_title">
          <!-- <div class="line"></div> -->
          <div class="centerContent">出租信息</div>
          <!-- <div class="line"></div> -->
        </div>
        <div class="hjinfo">
          <el-row type="flex" justify="center">
            <el-col :span="8">姓名:{{ routeParams.czrxm }}</el-col
            ><el-col :span="8">性别:{{ gender }}</el-col>
            <el-col :span="8"
              >证件类型:{{ zjzlLabel[0] ? zjzlLabel[0].label : '' }}</el-col
            >
          </el-row>
          <el-row type="flex">
            <el-col :span="8">证件号码:{{ routeParams.czrzjhm }}</el-col>
            <el-col :span="8">联系方式:{{ routeParams.czrlxfs }}</el-col>
          </el-row>
        </div>
      </div>
      <div id="tj" ref="tj" >
        <div class="type_title" ref="type_title">
          <!-- <div class="line"></div> -->
          <div class="centerContent">同居住人员</div>
          <!-- <div class="line"></div> -->
        </div>
        <div class="tinfo">
          <div
            class="tinfo-item"
            v-for="(item, index) in jcywSyrkTjzryVoList"
            :key="index"
          >
            <img src="@/assets/images/wutouxiang.svg" alt="" />
            <p>姓名:{{ item.name }}</p>
            <p>身份证号码:{{ item.idCard }}</p>
          </div>
        </div>
      </div>
      <div id="th" ref="th">
        <div class="type_title">
          <!-- <div class="line"></div> -->
          <div class="centerContent">同户籍人员</div>
          <!-- <div class="line"></div> -->
        </div>
        <div class="tinfo">
          <div
            class="tinfo-item"
            v-for="(item, index) in zhzzJcywSyrkHjrkVoList"
            :key="index"
          >
            <img src="@/assets/images/wutouxiang.svg" alt="" />
            <p>姓名:{{ item.name }}</p>
            <p>身份证号码:{{ item.idCard }}</p>
          </div>
        </div>
      </div>
      <div id="ry" ref="ry">
        <div class="type_title">
          <!-- <div class="line"></div> -->
          <div class="centerContent">房屋标签</div>
          <!-- <div class="line"></div> -->
        </div>
        <div class="ryinfo">
          <el-tag
            closable
            :key="inde"
            v-for="(tag, inde) in zhzzJcywBqglList"
            :disable-transitions="false"
            @close="handleClose(tag, inde)"
          >
            <span v-for="(item, index) in tagList" :key="index">
              {{ tag.bqId == item.raw.dictCode ? item.raw.dictLabel : '' }}
            </span>
          </el-tag>
          <el-button class="button-new-tag" size="small" @click="showTagDialog"
            >+ 标签</el-button
          >
        </div>
      </div>
      <div id="dt" ref="dt">
        <div class="type_title">
          <!-- <div class="line"></div> -->
          <div class="centerContent">地图位置</div>
          <!-- <div class="line"></div> -->
        </div>
        <div class="dtinfo">
          <div
            id="map"
            ref="rootmap"
            class="map-container"
            style="width: 660px; height: 426px; margin: 0 auto"
            v-loading="loading"
          ></div>
        </div>
      </div>
    </div>
    <div id="popup" class="ol-popup">{{ mapInfo.dzysqc }}</div>
    <!-- 添加或删除标签对话框 -->
    <el-dialog
      title="添加房屋标签"
      :visible.sync="showPersonTag"
      width="50%"
      append-to-body
    >
      <el-row>
        <el-col
          class="padding-10"
          :span="6"
          v-for="(item, index) in tagList"
          :key="index"
        >
          <i
            @click="addUserMenuBtn(item)"
            :class="
              item.added ? 'el-icon-check color-blue' : 'el-icon-plus  bgc-c '
            "
            class="margin-right-10"
          ></i>
          <span class="font-14">{{ item.label }}</span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  addPersonTag,
  deletePersonTag,
  populationFile,
  getMapInfo
} from '@/api/jcyw/syfw/fwda'
import 'ol/ol.css'
import { Map, View } from 'ol'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import Polygon from 'ol/geom/Polygon'
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'
import { getArea, getLength } from 'ol/sphere'
import { defaults } from 'ol/control'
import { Style, Fill, Stroke, Text, Circle } from 'ol/style'
import { ImageStatic, Vector as VectorSource } from 'ol/source'
import mapconfig from '@/views/wggl/mapconfig'
import { getCenter, boundingExtent } from 'ol/extent'
import TileLayer from 'ol/layer/Tile'
import { Logo, TileSuperMapRest } from '@supermap/iclient-ol'
import '@supermap/iclient-ol/dist/iclient-openlayers.min.css'
import XYZ from 'ol/source/XYZ'
export default {
  dicts: ['bq_fwbq', 'ga_zjzl'],
  data() {
    return {
      zjzlDicts: [],
      gender: '',
      routeParams: '',
      zhzzJcywSyrkHjrkVoList: [],
      jcywSyrkTjzryVoList: [],
      zhzzJcywBqglList: [],
      tagList: [],
      mapInfo: '',
      map: null,
      pointSource: null,
      pointLayer: null,
      overlayer: null,
      mapClick: null,
      tabMenuList: [
        { name: '出租信息', anchorpoint: '#hj' },
        { name: '同居住人员', anchorpoint: '#tj' },
        { name: '同户籍人员', anchorpoint: '#th' },
        { name: '房屋标签', anchorpoint: '#ry' },
        { name: '地图位置', anchorpoint: '#dt' }
      ],
      activeIndex: 0,
      showPersonTag: false,
      loading: true,
      mapLayerArr: [],
      mapUrl: {},
      mapOptions: []
    }
  },
  computed: {
    zjzlLabel: function () {
      return this.zjzlDicts.filter((item) => {
        return item.value == this.routeParams.czrzjdm
      })
    }
  },
  mounted() {
    this.biaoQian()
    this.handleScroll()
    this.routeParams = this.$route.params
    this.mapOptions = mapconfig.url
    for (let i = 0; i < this.mapOptions.length; i++) {
      if (this.mapOptions[i].isDefault === 'Y') {
        this.$set(this.mapUrl, 'url', this.mapOptions[i].remark)
        this.$set(this.mapUrl, 'type', this.mapOptions[i].dictValue)
      }
    }

    this.zjzlDicts = this.dict?.type?.ga_zjzl
    this.cardToSex()
    this.$nextTick(() => {
      this.initMap()
    })
    this.getInfo()
    this.getPersonMapInfo()
  },
  methods: {
    //监听滚动条
    handleScroll() {
      this.$store.watch(
        state => state.app.vuex_fwScrollTop,
        (newVal, val) => {
          let scrollTop = newVal
          let hj = this.$refs.hj.clientHeight + 300
          let tj = this.$refs.tj.clientHeight + hj
          let th = this.$refs.th.clientHeight + tj
          let ry = this.$refs.ry.clientHeight + th
          let dt = this.$refs.dt.clientHeight + ry

          if (scrollTop > 0 && scrollTop < 301) {
            this.$refs.tabWrap.style.top = 380 - scrollTop + 'px'
            this.activeIndex = 0
          } else if (scrollTop > 300) {
            this.$refs.tabWrap.style.top = 80 + 'px'
            if (scrollTop < hj) {
              this.activeIndex = 0
            } else if (scrollTop > hj && scrollTop < tj) {
              this.activeIndex = 1
            } else if (scrollTop > tj && scrollTop < th) {
              this.activeIndex = 2
            } else if (scrollTop > th && scrollTop < ry) {
              this.activeIndex = 3
            } else if (scrollTop > ry && scrollTop < dt) {
              this.activeIndex = 4
            }
          }
        }
      )

    },
    biaoQian() {
      let height = this.$store.state.app.vuex_fwHeight
      console.log('heightsss',height)
      let width = this.$refs.type_title.clientWidth
      // console.log('height的读取',height)
      let tabWrapHeight = this.$refs.tabWrap.clientHeight
      // console.log(tabWrapHeight)
      this.$refs.classification_wrap.style.paddingTop = tabWrapHeight + 24 + 'px'
      this.$refs.tabWrap.style.top = height + 125 + 'px'
      this.$refs.tabWrap.style.width = width + 'px'
      this.$refs.tabWrapDiv.style.width = width + 'px'
    },
    cardToSex() {
      if (this.routeParams.czrzjhm) {
        if (
          Number(
            this.routeParams.czrzjhm[this.routeParams.czrzjhm.length - 2]
          ) %
            2 ==
          0
        ) {
          this.gender = '女'
        } else if (
          Number(
            this.routeParams.czrzjhm[this.routeParams.czrzjhm.length - 2]
          ) %
            2 !=
          0
        ) {
          this.gender = '男'
        } else {
          this.gender = '未知'
        }
      }
    },
    getPersonMapInfo() {
      getMapInfo(this.routeParams.fwdzid).then((res) => {
        if (res.code == 200 && res.data) {
          this.mapInfo = res.data
          if (this.mapInfo.jd && this.mapInfo.wd) {
            this.addPointLayer()
          }
        }
      })
    },
    getInfo() {
      populationFile(this.routeParams.fwdzid).then((res) => {
        if (res.code === 200) {
          this.zhzzJcywSyrkHjrkVoList = res.data.zhzzJcywSyrkHjrkVoList //同户籍人口
          this.jcywSyrkTjzryVoList = res.data.jcywSyrkTjzryVoList //同居住人口
          this.zhzzJcywBqglList = res.data.zhzzJcywBqglList //人员标签
          this.initParams()
        }
      })
    },
    initParams() {
      this.tagList = this.dict?.type?.bq_fwbq
      for (let i = 0; i < this.tagList.length; i++) {
        this.$set(this.tagList[i], 'added', false)
        for (let j = 0; j < this.zhzzJcywBqglList.length; j++) {
          if (this.zhzzJcywBqglList[j].bqId == this.tagList[i].raw.dictCode) {
            this.tagList[i].added = true
          }
        }
      }
    },
    addPointLayer() {
      if (this.mapInfo.jd) {
        let feature = new Feature({
          geometry: new Point([
            Number(this.mapInfo.jd),
            Number(this.mapInfo.wd)
          ]) // 地理几何图形选用点几何
        })
        feature.set('data', this.mapInfo)
        let styles = [
          new Style({
            image: new Icon({
              // anchor: [0.5, 1], // 显示位置
              // size: [18, 28], // 尺寸
              scale: 1,
              src: require('@/assets/images/zuobiao.png') // 图片url'
            })
          })
        ]
        feature.setStyle(styles)
        this.pointLayer.getSource().addFeature(feature)
        this.map.getView().animate({
          // 只设置需要的属性即可
          center: [Number(this.mapInfo.jd), Number(this.mapInfo.wd)], // 中心点
          // zoom: 15, // 缩放级别
          // rotation: undefined, // 缩放完成view视图旋转弧度
          duration: 1000 // 缩放持续时间，默认不需要设置
        })
      }
    },
    initMap() {
      this.pointSource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.pointLayer = new VectorLayer({
        source: this.pointSource
      })
      if (this.mapUrl.type == '5') {
        var maplayer = new TileLayer({
          source: new XYZ({
            url: this.mapUrl.url,
            wrapX: true
          })
        })
      } else {
        var maplayer = new TileLayer({
          source: new TileSuperMapRest({
            url: this.mapUrl.url,
            wrapX: true
          })
        })
      }
      var mapcontainer = this.$refs.rootmap
      this.map = new Map({
        target: mapcontainer,
        // layers: this.mapLayerArr,
        layers: [maplayer, this.pointLayer],
        view: new View({
          projection: 'EPSG:4326', //使用这个坐标系
          center: [
            Number(this.mapInfo.jd) ? Number(this.mapInfo.jd) : mapconfig.x,
            Number(this.mapInfo.wd) ? Number(this.mapInfo.wd) : mapconfig.y
          ],
          zoom: mapconfig.zoom,
          maxZoom: mapconfig.maxZoom
          // extent: [-50000 ,50000,50000,50000],
        }),
        controls: defaults({
          zoom: false,
          rotate: false,
          attribution: false
        })
      })
      var container = document.getElementById('popup')
      this.overlayer = new Overlay({
        element: container,
        autuPan: true
      })
      this.overlayer.setPosition(undefined)
      // 将overlayer层添加到map当中
      // this.map.addOverlay(this.overlayer)
      this.overlayer.setPosition(undefined)
      this.map.addOverlay(this.overlayer)
      this.addClick()
      this.loading = false
    },
    // 判断点击是否在网格上
    addClick() {
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
            that.overlayer.setPosition([
              Number(this.mapInfo.jd),
              Number(this.mapInfo.wd)
            ])
            // 如果点击在feature
            // let id = feature.getId()
            // if (id) {
            //   that.popTitle = feature.getProperties().title
            //   that.getInfoForCommunityOrGrid(id, coordinate)
            // } else {
            //   that.overlayer.setPosition(undefined)
            // }
          } else {
            that.overlayer.setPosition(undefined)
          }
        }.bind(this)
      )
    },
    toAnchor(i) {
      this.activeIndex = i
      let hj = this.$refs.hj.clientHeight + 300
      let tj = this.$refs.tj.clientHeight + hj
      let th = this.$refs.th.clientHeight + tj
      let ry =  th
      let dt = this.$refs.dt.clientHeight + ry
      if (i == 0) {
        // 数值
        // this.hj=true
        this.$store.commit("app/gefwtScrollTo", 300)
      } else if (i == 1) {
        this.$store.commit("app/gefwtScrollTo", hj+1)
      } else if (i == 2) {
        this.$store.commit("app/gefwtScrollTo", tj+1)
      } else if (i == 3) {
        this.$store.commit("app/gefwtScrollTo", ry+1)
      } else if (i == 4) {
        this.$store.commit("app/gefwtScrollTo", dt)
      }
    },
    handleClose(item, i) {
      this.zhzzJcywBqglList.splice(i, 1)
      deletePersonTag(item.id).then((res) => {
        if (res.code == 200) {
          this.$modal.msgSuccess('删除成功')
        }
      })
    },
    showTagDialog() {
      this.showPersonTag = true
      this.initParams()
    },
    async addUserMenuBtn(item) {
      if (item.added) {
      } else {
        let res = await addPersonTag({
          bqId: item.raw.dictCode,
          glId: this.routeParams.fwdzid
        })
        if (!res) return
        this.getInfo()
        this.$modal.msgSuccess('新增成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.classification_wrap {
  padding: 0 39px 0 18px;
  .tabWrapDiv{
    width: 83%;
    background: #fff;
  }
  .tabWrap {
    width: 83%;
    // background: white;
    text-align: center;
    // margin-bottom: 8px;
    position: fixed;
    z-index: 999;
    top: 0;
    & > .el-divider--horizontal {
      height: 2px;
      margin-bottom: 0;
      background-color: #e8eaec;
    }
    a {
      display: inline-block;
      padding: 8px 37px 14px;
      font-size: 20px;
    }
  }
  .activeStyle {
    font-weight: bold;
    font-size: 20px;
    color: #3289ff;
    background-color: #f3f7ff;
  }
  .classificationInfo {
    .type_title {
      height: 63px;
      background: rgba(233, 239, 243, 0.21);
      border: 1px solid #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: center;
      .line {
        width: 195px;
        height: 1px;
        border: 1px solid #2b86ff;
      }
      .centerContent {
        padding: 0 58px;
        font-size: 20px;

        font-weight: 600;
        color: #2f345f;
      }
    }
    .hjinfo {
      padding: 0 300px;
      & > div > div {
        padding: 28px 0;
        &:nth-child(2) {
          text-align: center;
        }
        &:nth-child(3) {
          text-align: right;
        }
      }
    }
    .tinfo {
      padding: 55px 0 33px 0;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .tinfo-item {
        width: 20%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 147px;
          height: auto;
        }
        p {
          font-size: 14px;
          color: #1f2552;
          line-height: 20px;
          margin-top: 13px;
        }
      }
    }
    .ryinfo {
      padding: 46px 0;
      display: flex;
      justify-content: center;
      .el-tag + .el-tag {
        margin-left: 10px;
      }
      .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
    }
    .dtinfo {
      margin-bottom: 75px;
    }
  }
}
.padding-10 {
  padding: 10px;
}
.padding-10:hover .bgc-c {
  background-color: #388cff;
  color: #fff;
}
.font-14 {
  font-size: 14px;

  font-weight: 400;
  color: #1f2552;
}
.color-blue {
  color: #388cff;
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
