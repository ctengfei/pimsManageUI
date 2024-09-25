<template>
  <div class="fwda app-container">
    <el-row type="flex">
      <el-col>
        <span></span>
        <p>房屋档案</p>
        <div class="fz">
          <carousel ref="carousel" :fwzpUrl="fwzpUrl"></carousel>
          <!-- <img :src="fwzpUrl"/> -->
          <div class="pt-10px">房主 {{ info.fzxm }}</div>
        </div>
        <ul>
          <li
            @click="toAnchor(index)"
            :class="index == activeIndex ? 'activeStyle' : ''"
            v-for="(item, index) in sideMenus"
            :key="index"
          >
            <!-- <a :href="item.href"> -->
            <span v-show="index == activeIndex"></span>
            {{ item.name }}
            <!-- </a> -->
          </li>
        </ul>
      </el-col>
      <el-col id="diercol">
        <div class="content" id="element0">
          <div class="title">
            <span></span>
            <p>基本信息</p>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="goBack"
              style="float: right"
              icon="el-icon-back"
              >返回</el-button
            >
          </div>
          <div>
            <table>
              <tr>
                <td>房屋地址</td>
                <td @click="toBuildingArchives">
                  <el-link type="primary">{{ info.address }}</el-link>
                </td>
                <td>产权性质</td>
                <td>{{ fwcqLable[0] ? fwcqLable[0].label : '无' }}</td>
                <!-- <td>隐患类型</td>
                <td>{{ yhlxLable[0] ? yhlxLable[0].label : '无' }}</td> -->
              </tr>
              <tr>
                <td>联系方式</td>
                <td>{{ info.fzlxfs }}</td>
                <td>房屋面积</td>
                <td>{{ info.fwmj }}</td>
                <td>房屋间数</td>
                <td>{{ info.fwjs }}</td>
              </tr>
              <tr>
                <td>房屋类别</td>
                <td>{{ fwlbLable[0] ? fwlbLable[0].label : '无' }}</td>
                <td>产权证号:</td>
                <td>{{ info.fwcqzh }}</td>
                <td>是否出租房</td>
                <td>{{ yesnoLable[0] ? yesnoLable[0].label : '无' }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="content" id="element1" v-if="info.sfczfw == 'Y'">
          <div class="title">
            <span></span>
            <p>出租信息</p>
          </div>
          <div>
            <table>
              <tr>
                <td>姓名</td>
                <td>{{ info.czrxm }}</td>
                <td>性别</td>
                <td>{{ gender }}</td>
                <td>证件类型</td>
                <td>{{ zjzlLabel[0] ? zjzlLabel[0].label : '无' }}</td>
              </tr>
              <tr>
                <td>证件号码</td>
                <td>{{ info.czrzjhm }}</td>
                <td>联系方式</td>
                <td>{{ info.czrlxfs }}</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="content" id="element2">
          <div class="title">
            <span></span>
            <p>同住人员</p>
          </div>
          <div class="tinfo">
            <div
              class="tinfo-item"
              v-for="(item, index) in jcywSyrkTjzryVoList"
              :key="index"
            >
              <img :src="item.zp" />
              <p style="cursor: pointer" @click="toRyda(item)">
                姓名:{{ item.NAME }}
              </p>
              <p>身份证号码:{{ item.idCard }}</p>
            </div>
          </div>
        </div>
        <div class="content" id="element3">
          <div class="title">
            <span></span>
            <p>同户籍人员</p>
          </div>
          <div class="tinfo">
            <div
              class="tinfo-item"
              v-for="(item, index) in zhzzJcywSyrkHjrkVoList"
              :key="index"
            >
              <img src="@/assets/images/wutouxiang.svg" />
              <p>姓名:{{ item.name }}</p>
              <p>身份证号码:{{ item.idCard }}</p>
            </div>
          </div>
        </div>
        <div class="content" id="element4">
          <div class="title">
            <span></span>
            <p>房屋标签</p>
          </div>
          <div class="bqinfo">
            <el-tag
              style="margin-right: 25px; margin-bottom: 7px"
              closable
              :key="tag.id"
              v-for="(tag, inde) in zhzzJcywBqglList"
              :disable-transitions="false"
              @close="handleClose(tag, inde)"
            >
              <template v-for="item in tagList">
                {{ tag.bqId == item.dictCode ? item.dictLabel : '' }}
              </template>
            </el-tag>
            <el-button
              class="button-new-tag"
              size="small"
              @click="showTagDialog"
              v-hasPermi='bqqxzf'
              >+ 标签</el-button
            >
          </div>
        </div>
        <div class="content" id="element5">
          <div class="title">
            <span></span>
            <p>地图位置</p>
          </div>
          <div class="dtinfo">
            <div
              id="map"
              ref="rootmap"
              class="map-container"
              style="width: 100%; height: 509px; position: relative"
              v-loading="loading"
            >
              <switch-layers
                class="layers-box"
                @getChecking="getChecking"
              ></switch-layers>
              <div class="measure-button">
                <div class="measure-box">
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
                <div class="measure-box">
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
                  <!-- <el-divider></el-divider> -->
                  <el-popover
                    placement="right-start"
                    title="选择图层"
                    width="70"
                    trigger="hover"
                    v-show="false"
                  >
                    <el-radio-group
                      v-model="mapView"
                      size="mini"
                      @change="checkMapView"
                    >
                      <el-radio
                        v-for="item in this.mapOptions"
                        :label="item.dictValue"
                        :key="item.index"
                        >{{ item.dictLabel }}</el-radio
                      >
                    </el-radio-group>
                    <div slot="reference">
                      <img src="@/assets/images/tuceng.svg" alt="light" />
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-show="showPop" id="popup" class="ol-popup">
      <el-row>
        <el-col :span="18">{{ mapInfo.dzysqc }}</el-col>
        <el-col :span="6">
          <p
            @click="showPop = false"
            id="popup-close"
            class="ol-popup-closer"
          ></p>
        </el-col>
      </el-row>
    </div>
    <!-- 添加或删除标签对话框 -->
    <el-dialog title="添加房屋标签" :visible.sync="showHouseTag" width="50%">
      <el-row>
        <el-col
          class="padding-10"
          :span="6"
          v-for="item in tagList"
          :key="item.dictValue"
        >
          <i
            @click="addUserMenuBtn(item)"
            :class="
              item.added ? 'el-icon-check color-blue' : 'el-icon-plus  bgc-c'
            "
            class="margin-right-10"
          ></i>
          <span class="font-14">{{ item.dictLabel }}</span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import Polygon from 'ol/geom/Polygon'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'
import { getArea, getLength } from 'ol/sphere'
import { defaults } from 'ol/control'
import Point from 'ol/geom/Point'
import { Style, Fill, Stroke, Text, Circle, Icon } from 'ol/style'
import { ImageStatic, Vector as VectorSource } from 'ol/source'
import { getCenter, boundingExtent } from 'ol/extent'
import TileLayer from 'ol/layer/Tile'
import { Logo, TileSuperMapRest } from '@supermap/iclient-ol'
import '@supermap/iclient-ol/dist/iclient-openlayers.min.css'
import XYZ from 'ol/source/XYZ'
import switchLayers from '@/views/wggl/components/switchLayers.vue'
import carousel from './components/Carousel'
import mapconfig from '@/views/wggl/mapconfig'
import { getDicts } from '@/api/system/dict/data'
import { getFwbq } from '@/api/system/dept'
import {
  addPersonTag,
  deletePersonTag,
  populationFile,
  getMapInfo,
  getBuildId
} from '@/api/jcyw/syfw/fwda'
import { listLdrk } from '@/api/jcyw/syrk/ldrk'
import { listHjrk } from '@/api/jcyw/syrk/hjrk'
import { removeWatermark, setWaterMark } from '@/utils/watermark'
import { mapState } from 'vuex'
export default {
  name: '',
  dicts: ['ga_fwlb', 'ga_fwcq', 'sys_yes_no', 'gb_yhlx', 'ga_zjzl'],
  components: {
    switchLayers,
    carousel
  },
  data() {
    return {
      // 楼栋idFwda
      ldId: '',
      // 楼栋名称
      ldMc: '',
      mapDataSource: '',
      showPop: false,
      mapInfo: '',
      loading: true,
      showHouseTag: false,
      jcywSyrkTjzryVoList: [],
      zhzzJcywSyrkHjrkVoList: [],
      zhzzJcywBqglList: [],
      tagList: [],
      gender: '',
      activeIndex: 0,
      fwzpUrl: [],
      info: '',
      sideMenus: [
        { name: '基本信息', href: '#element0' },
        { name: '出租信息', href: '#element1' },
        { name: '同住人员', href: '#element2' },
        { name: '同户籍人员', href: '#element3' },
        { name: '房屋标签', href: '#element4' },
        { name: '地图位置', href: '#element5' }
      ],
      pointSource: null,
      newSpurce: null,
      pointLayer: null,
      newLayer: null,
      // pointSource: null,
      // pointLayer: null,
      mapLayerArr: [],
      mapOptions: [],
      overlayer: null,
      map: null,
      viewCommunityBtn: false,
      viewGridBtn: false,
      mapView: null,
      bqqxzf: JSON.parse(localStorage.getItem('fwbqqxzf'))
    }
  },
  computed: {
    ...mapState(['user']),
    fwlbLable: function () {
      return this.dict?.type?.ga_fwlb.filter((item) => {
        return item.value == this.info.fwlx
      })
    },
    zjzlLabel: function () {
      return this.dict?.type?.ga_zjzl.filter((item) => {
        return item.value == this.info.czrzjdm
      })
    },
    fwcqLable: function () {
      return this.dict?.type?.ga_fwcq.filter((item) => {
        return item.value == this.info.fwcqxz
      })
    },
    yesnoLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.info.sfczfw
      })
    },
    yhlxLable: function () {
      return this.dict?.type?.gb_yhlx.filter((item) => {
        return item.value == this.info.yhlx
      })
    }
  },
  methods: {
    async filterTableData(table) {
      let data = await table
      if (data.rows.length < 1)
        return {
          total: 0,
          rows: [],
          code: 200,
          msg: '查询成功'
        }
      data.rows.filter((item) => {
        if (item.zhzzJcywSyrkJbxx) {
          for (let k in item.zhzzJcywSyrkJbxx) {
            if (!item[k]) {
              item[k] = item.zhzzJcywSyrkJbxx[k]
            }
          }
        }
      })
      return data
    },
    toRyda(item) {
      if (item.type == 0) {
        //流动人口
        this.filterTableData(listLdrk({ id: item.id }, 1, 10)).then((res) => {
          this.$router.push({
            name: 'Ryda',
            params: { row: res.rows[0], type: item.type }
          })
        })
      } else {
        // 户籍人口
        this.filterTableData(listHjrk({ id: item.id }, 1, 10)).then((res) => {
          this.$router.push({
            name: 'Ryda',
            params: { row: res.rows[0], type: item.type }
          })
        })
      }
    },
    getBuildingId() {
      getBuildId({ id: this.info.fwdzid }).then((res) => {
        if (res.data) {
          // console.log(res)
          this.ldId = res.data[0].id
          this.ldMc = res.data[0].dzysqc
        }
      })
    },
    goBack() {
      // this.$router.push({
      //   name: 'Fwgl'
      // })
      this.$router.back()
    },
    toBuildingArchives() {
      if (this.ldId) {
        this.$router.push({
          name: 'Sygl',
          params: {
            id: this.ldId,
            title: this.ldMc,
            fwdzid: this.info.fwdzid
          }
        })
      }
    },
    handleScroll() {
      let idx = null
      let contents = document.querySelectorAll('.content')
      let scrollTop = document.getElementById('diercol').scrollTop
      let scrollHeight = document.getElementById('diercol').offsetHeight
      let scrollHeight1 = document.getElementById('diercol').scrollHeight
      let firstTop = contents[0].offsetTop // 第一个章节的顶部位置
      for (let i = 0; i < contents.length; i++) {
        let ih = contents[i].offsetTop
        let distance = ih - firstTop
        if (scrollTop < distance) {
          idx = Math.max(0, i - 1)
          this.activeIndex = idx
          // 滚动到最后一章（该章节高度超过正文容器）时，滚动条的滚动距离超过所有章节需要的滚动距离
          this.activeIndex = idx === null ? contents.length - 1 : idx
          if (scrollTop + scrollHeight === scrollHeight1) {
            // 滚动条触底，处于最后一章（消除该章节高度低于正文容器时始终定位在倒数第二章的情况）
            this.activeIndex = contents.length - 1
          }
          return false
        }
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
        that.measuring = true
        that.newSpurce.clear()
        that.overlayer.setPosition(undefined)
        that.draw = new Draw({
          source: that.newSpurce,
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
        that.newSpurce.clear()
        that.overlayer.setPosition(undefined)
        that.draw = new Draw({
          source: that.newSpurce,
          type: 'Polygon'
        })
        that.map.addInteraction(that.draw)
        that.draw.on('drawend', function (evt) {
          that.drawingEnd(evt)
        })
      }
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
      // this.map.getView().setZoom(this.map.getView().getZoom() - 1) // 没有动画
      this.map.getView().animate({ zoom: this.map.getView().getZoom() - 1 }) // 有动画
    },
    // 放大
    addZoom() {
      this.map.getView().animate({ zoom: this.map.getView().getZoom() + 1 }) // 有动画
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
    getChecking(val) {
      this.checkMapView(val)
    },
    getMapDataSourceUrl() {
      let type = process.env.VUE_APP_MAP_URL_DICT + '_zy'
      getDicts(type).then((res) => {
        this.mapDataSource = res.data[0].remark
      })
      console.log(type,'11111111111111111111111111111111111111111111111111111111111111')
    },
    initMap() {
      this.pointSource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.newSpurce = new VectorSource({
        wrapX: false,
        features: []
      })
      this.pointLayer = new VectorLayer({
        source: this.pointSource
      })
      this.newLayer = new VectorLayer({
        source: this.newSpurce,
        style: [
          new Style({
            stroke: new Stroke({
              color: 'rgba(255,0,0,0.6)',
              width: 2
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.4)'
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
      var mapcontainer = this.$refs.rootmap
      this.map = new Map({
        target: mapcontainer,
        layers: this.mapLayerArr,
        view: new View({
          projection: 'EPSG:4326', //使用这个坐标系
          center: [
            Number(this.mapInfo.jd) ? Number(this.mapInfo.jd) : mapconfig.x,
            Number(this.mapInfo.wd) ? Number(this.mapInfo.wd) : mapconfig.y
          ],
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
      this.overlayer = new Overlay({
        element: container,
        autoPan: false
      })
      this.overlayer.setPosition(undefined)
      // 将overlayer层添加到map当中
      this.map.addOverlay(this.overlayer)
      this.addClick()
      for (let i = 0; i < this.mapOptions.length; i++) {
        if (this.mapOptions[i].isDefault === 'Y') {
          this.mapView = this.mapOptions[i].dictValue
          this.checkMapView(this.mapOptions[i].dictValue)
        }
      }
      this.loading = false
    },
    // 判断点击是否在网格上
    addClick() {
      let that = this
      that.mapClick = that.map.on(
        'click',
        function (e) {
          var pixel = that.map.getEventPixel(e.originalEvent) //获取鼠标当前像素点
          // var coordinate = e.coordinate //获取鼠标当前位置
          var hit = that.map.hasFeatureAtPixel(pixel) //通过像素点判断当前鼠标上是否有图形
          // let feature = that.map.forEachFeatureAtPixel(
          //   e.pixel,
          //   (feature) => feature
          // )
          if (hit) {
            that.showPop = true
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
            that.showPop = false
            that.overlayer.setPosition(undefined)
          }
        }.bind(this)
      )
    },
    getFwMapInfo() {
      getMapInfo(this.info.fwdzid).then((res) => {
        if (!this.map) {
          this.initMap()
        }
        if (res.code == 200 && res.data) {
          this.mapInfo = res.data
          // console.log(this.mapInfo)
          if (this.mapInfo.jd && this.mapInfo.wd) {
            this.addPointLayer()
          }
        }
      })
    },
    addPointLayer() {
      let feature = new Feature({
        geometry: new Point([Number(this.mapInfo.jd), Number(this.mapInfo.wd)]) // 地理几何图形选用点几何
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
    },
    getFwTagList() {
      getFwbq().then((res) => {
        if (res.data) {
          this.tagList = res.data
          for (let i = 0; i < this.tagList.length; i++) {
            this.$set(this.tagList[i], 'added', false)
            for (let j = 0; j < this.zhzzJcywBqglList.length; j++) {
              if (this.zhzzJcywBqglList[j].bqId == this.tagList[i].dictCode) {
                this.tagList[i].added = true
              }
            }
          }
        }
      })
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
      this.showHouseTag = true
      this.getFwTagList()
    },
    async addUserMenuBtn(item) {
      if (item.added) {
      } else {
        let res = await addPersonTag({
          bqId: item.dictCode,
          glId: this.info.fwdzid
        })
        if (!res) return
        this.getInfo()
        this.$modal.msgSuccess('新增成功')
      }
    },
    getInfo() {
      populationFile(this.info.fwdzid).then((res) => {
        if (res.code === 200) {
          this.zhzzJcywSyrkHjrkVoList = res.data.zhzzJcywSyrkHjrkVoList //同户籍人口
          this.jcywSyrkTjzryVoList = res.data.jcywSyrkTjzryVoList //同居住人口
          this.zhzzJcywBqglList = res.data.zhzzJcywBqglList //标签
          for (let i = 0; i < this.jcywSyrkTjzryVoList.length; i++) {
            if (this.jcywSyrkTjzryVoList[i].zp) {
              this.jcywSyrkTjzryVoList[i].zp =
                process.env.VUE_APP_BASE_FILE_VIEW +
                this.jcywSyrkTjzryVoList[i].zp
            } else {
              this.jcywSyrkTjzryVoList[
                i
              ].zp = require('@/assets/images/wutouxiang.svg')
            }
          }
          this.getFwTagList()
        }
      })
    },
    toAnchor(i) {
      this.activeIndex = i
      let jump = document.querySelectorAll('.content') //右侧每一模块的类名
      let offsetTop = jump[i].offsetTop
      let scrollBox = document.getElementById('diercol')
      scrollBox.scrollTop = offsetTop //跳到对应位置
    },
    cardToSex() {
      if (this.info.czrzjhm) {
        if (Number(this.info.czrzjhm[this.info.czrzjhm.length - 2]) % 2 == 0) {
          this.gender = '女'
        } else if (
          Number(this.info.czrzjhm[this.info.czrzjhm.length - 2]) % 2 !=
          0
        ) {
          this.gender = '男'
        } else {
          this.gender = '未知'
        }
      }
    }
  },
  mounted() {
    this.mapOptions =
      mapconfig.url || JSON.parse(localStorage.getItem('mapSource'))
    this.initMap()
    for (let i = 0; i < this.mapOptions.length; i++) {
      if (this.mapOptions[i].dictValue === '2') {
        this.mapView = this.mapOptions[i].dictValue
        this.checkMapView(this.mapOptions[i].dictValue)
      }
    }
    this.getMapDataSourceUrl()
    this.sideMenus = [
      { name: '基本信息', href: '#element0' },
      { name: '出租信息', href: '#element1' },
      { name: '同住人员', href: '#element2' },
      { name: '同户籍人员', href: '#element3' },
      { name: '房屋标签', href: '#element4' },
      { name: '地图位置', href: '#element5' }
    ]
    if (JSON.stringify(this.$route.params) != '{}') {
      localStorage.setItem('fwinfo', JSON.stringify(this.$route.params))
      this.info = this.$route.params
    } else {
      let info = JSON.parse(localStorage.getItem('fwinfo'))
      this.info = info
    }
    //如果不是出租房去掉出租信息
    if (this.info.sfczfw != 'Y') {
      this.sideMenus.splice(1, 1)
    }
    if (this.info.fwzp) {
      // this.fwzpUrl = process.env.VUE_APP_BASE_FILE_VIEW + this.info.fwzp
      let urllist = this.info.fwzp.split(',')
      for (let j = 0; j < urllist.length; j++) {
        this.fwzpUrl.push(process.env.VUE_APP_BASE_FILE_VIEW + urllist[j])
      }
    } else {
      this.fwzpUrl.push(require('@/assets/images/wutouxiang.svg'))
    }
    //水印
    //setWaterMark(this.user.name, this.user.nickName, this.user.deptName)
    this.mapOptions =
      mapconfig.url || JSON.parse(localStorage.getItem('mapSource'))
    this.cardToSex()
    this.getInfo()
    this.getFwMapInfo()
    this.getBuildingId()
    document
      .getElementById('diercol')
      .addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    // localStorage.removeItem('fwinfo')
    // 销毁监听
    document
      .getElementById('diercol')
      .removeEventListener('scroll', this.handleScroll)
    //清除水印
    removeWatermark()
  },
  beforeRouteLeave(to, from, next) {
    //清除水印
    removeWatermark()
    next()
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/mapCommonStyle.scss';
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
.layers-box {
  position: absolute;
  z-index: 50;
  right: 20px;
  bottom: 20px;
}
.font-14 {
  font-size: 14px;

  font-weight: 400;
  color: #1f2552;
}
.padding-10 {
  padding: 10px;
}
.padding-10:hover .bgc-c {
  background-color: #388cff;
  color: #fff;
}
.color-blue {
  color: #388cff;
}
.fwda {
  // height: calc(100% - 39px);
  // width: 100%;
  & > .el-row {
    height: 100%;
    .el-col {
      height: 100%;
      background-color: #fff;
      &:first-child {
        width: 206px;
        padding-top: 18px;
        //overflow-y: scroll;
        & > span {
          vertical-align: middle;
          display: inline-block;
          margin-left: 6px;
          width: 2px;
          height: 16px;
          background: #388cff;
        }
        & > p {
          vertical-align: middle;
          padding-left: 6px;
          display: inline-block;
          font-size: 16px;

          font-weight: 600;
          color: #505d69;
        }
        .fz {
          padding: 0px 5px 10px 10px;
          margin: 10px 0 10px;
          img {
            width: 100%;
            height: 145px;
          }
          div {
            font-size: 16px;

            font-weight: 600;
            color: #1f2552;
          }
        }
        ul {
          li {
            cursor: pointer;
            position: relative;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 16px;

            font-weight: 400;
            color: #1f2552;
            span {
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 50px;
              background: #388cff;
            }
            a {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
          .activeStyle {
            background: #f3f7ff;
          }
        }
      }
      &:last-child {
        //overflow-y: scroll;
        padding: 0 15px 21px;
        flex: 1;
        margin-left: 11px;
        .title {
          margin-top: 16px;
          margin-bottom: 16px;
          text-align: left;
          & > span {
            vertical-align: middle;
            display: inline-block;
            width: 2px;
            height: 16px;
            background: #323762;
          }
          & > p {
            margin-left: 7px;
            font-size: 16px;

            font-weight: 400;
            color: #222755;
            vertical-align: middle;
            display: inline-block;
          }
        }
        table {
          width: 100%;
          table-layout: fixed;
          background-color: #fafbfc;
          tr {
            td {
              word-break: break-all;
              border: 1px solid #dcdbdb;
              padding: 16px;
              font-size: 14px;

              font-weight: 400;
              color: #1f2552;
              &:nth-child(odd) {
                width: 109px;
              }
              &:nth-child(2) {
                // width: 412px;
              }
              &:nth-child(4) {
                // width: 356px;
              }
            }
          }
        }
        .tinfo {
          padding: 28px 30px;
          border: 1px solid #dcdbdb;
          display: flex;
          flex-wrap: wrap;
          & > .tinfo-item {
            width: 25%;
            display: flex;
            flex-direction: column;
            & > img {
              width: 115px;
              height: 149px;
            }
            & > p {
              font-size: 14px;

              font-weight: 400;
              color: #1f2552;
              margin-top: 13px;
              &:last-child {
                margin-bottom: 13px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
