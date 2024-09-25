<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-row :gutter="20">
          <el-col :span="4"
                  class="left">
            <carousel ref="carousel"
                      :floorId="floorId"></carousel>
          </el-col>
          <el-col :span="20"
                  class="right">
            <p class="title">
              {{ info.title }}
            </p>
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="backToYthcj"
                       style="position: absolute; top: 0; right: 20px"
                       icon="el-icon-back">返回</el-button>
            <p class="info">
              共居住<span>{{ total }}</span>人，其中户籍人口<span>{{ hjrk }}</span>人，流动人口<span>{{ ldrk }}</span>人
            </p>
            <div class="form">
              <el-form ref="form">
                <el-form-item label="人口类型："
                              style="margin-bottom: 0px display: flex;"
                              class="type">
                  <el-checkbox-group v-model="types">
                    <el-checkbox v-for="item in peopleTypeOptions"
                                 :label="item.value"
                                 :key="item.value"
                                 @change="checkState(item.value)">{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
                  <!-- <el-radio-group v-model="type" @change="handleCheck">
                    <el-radio
                      v-for="item in peopleTypeOptions"
                      :label="item.value"
                      :key="item.value"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group> -->
                  <!-- <el-checkbox
                    class="ml-30px"
                    :indeterminate="isIndeterminate"
                    v-model="checkAll"
                    @change="handleCheckAllChange"
                    >全选</el-checkbox
                  > -->
                </el-form-item>
                <el-form-item label="房屋状态："
                              style="margin-bottom: 0px">
                  <el-checkbox-group v-model="types">
                    <el-checkbox v-for="item in houseTypeOptions"
                                 :label="item.value"
                                 :key="item.value"
                                 @change="checkState(item.value)">{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
                  <!-- <el-radio-group v-model="type" @change="handleCheck">
                    <el-radio
                      v-for="item in houseTypeOptions"
                      :label="item.value"
                      :key="item.value"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group> -->
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="mt-20px">
      <el-col :span="24"
              class="tuli">
        图例:
        <img src="@/assets/images/tuli/huji.svg"
             alt="" />户籍人口
        <img src="@/assets/images/tuli/liudong.svg"
             alt="" />流动人口
        <img src="@/assets/images/tuli/guanai.svg"
             alt="" />关爱人员
        <img src="@/assets/images/tuli/teshu.svg"
             alt="" />特殊群体
        <img src="@/assets/images/tuli/zdqsn.svg"
             alt="" />重点青少年
        <!-- <img src="@/assets/images/tuli/biaoqian.svg" alt="" />标签人员 -->
        <img src="@/assets/images/tuli/kongfang.svg"
             alt="" />空置房屋
        <img src="@/assets/images/tuli/chuzu.svg"
             alt="" />出租房屋
        <img src="@/assets/images/tuli/weicaiji.svg"
             alt="" />未采集房主信息
      </el-col>
    </el-row>

    <!-- <div class="floor-info" v-loading="loading"> -->
    <div class="floor-info"
         v-if="hasFloor"
         id="mainBox">
      <!-- 地上 -->
      <div style="position: relative; display: flex"
           v-if="dsdys">
        <div class="floor-title">地上</div>
        <div style="display: flex; align-items: end">
          <div class="danyuan-box ds"
               v-for="item in this.dsData"
               :key="item.id">
            <div class="danyuan-title">{{ item.filed1 }}</div>
            <div class="dayuan-line"></div>
            <div class="table-box">
              <div style="
                  border: 2px solid #1890ff;
                  margin: 0 auto;
                  border-top: 0px;
                ">
                <table class="contain"></table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 门脸房 -->
      <div style="margin-top: 10px; position: relative"
           v-if="mlflcs">
        <div class="floor-title mlf">商铺</div>
        <div class="flex">
          <div v-for="item in boxNum"
               :key="item"
               class="flex"
               style="display:none"
               >
            <div style="display: none;">
              <div class="line1"></div>
              <div class="line2"></div>
            </div>
            <div>
              <div style="
                  width: 21px;
                  height: 8px;
                  background: #a2d2ff;
                  position: relative;
                  z-index: 10;
                  border-radius: 0 0 3px 3px;
                "></div>
              <div style="
                  width: 21px;
                  height: 10px;
                  background: #5ea2e1;
                  position: relative;
                  z-index: 5;
                  top: -5px;
                  border-radius: 0px 0px 10px 10px;
                "></div>
            </div>
          </div>
        </div>
        <div style="padding: 0 15px; position: relative; top: -10px"
             class="table-div"
             id="mlf">
          <div style="border: 2px solid #1890ff;width: 212px; border: none">
            <table id="spNum"
                   class="contain-mlf"
                   cellspacing="9"
                   cellpadding="12"
                   border="1"></table>
          </div>
        </div>
      </div>
      <!-- 地下 -->
      <div style="position: relative; margin-top: 10px"
           v-if="dxdys">
        <div class="floor-title mlf">地下</div>
        <div style="display: flex">
          <div class="danyuan-box dx"
               v-for="item in this.dxData"
               :key="item.id">
            <div class="table-box">
              <div style="
                  border: 2px solid #1890ff;
                  margin: 0 auto;
                  border-top: 0px;
                ">
                <table class="contain-dx"></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="noFloor"
         v-else>
      <li class="nodata">
        <img src="@/assets/images/work-place/nodaiban.svg" />
        <span>未创建层户结构</span>
      </li>
    </div>
  </div>
</template>

<script>
import { getZhzzJcywBzdzYthcjTreeById } from '@/api/jcyw/bzdz/ythcj'
import {
  getZhzzJcywBzdzYthcjLdxqCountById,
  getZhzzJcywBzdzYthcjLdxqById,
  getEveryJzrsCountById
} from '@/api/jcyw/bzdz/ldxq'
import { query } from '@/api/jcyw/syfw/fwgl'
import carousel from '@/components/Carousel'
export default {
  name: 'Sygl',
  components: { carousel },
  dicts: [],
  data () {
    return {
      loading: true,
      peopleTypeOptions: [
        {
          label: '户籍人口',
          value: '1'
        },
        {
          label: '流动人口',
          value: '2'
        },
        {
          label: '关爱人员',
          value: '3'
        },
        {
          label: '特殊人群',
          value: '4'
        },
        {
          label: '重点青少年',
          value: '5'
        }
        // {
        //   label: '标签人员',
        //   value: '6'
        // }
      ],
      houseTypeOptions: [
        {
          label: '空置房屋',
          value: '7'
        },
        {
          label: '出租房屋',
          value: '8'
        },
        {
          label: '未采集房主信息',
          value: '9'
        }
      ],
      rklx: ['1'],
      types: ['1', '2', '7', '8'],
      currentSelection: '1',
      currentSelectionState: true,
      isIndeterminate: true,
      checkAll: false,
      buildData: [],
      dsdys: 0,
      dslcs: 0,
      dsdchs: 0,
      mlflcs: 0,
      mlfdyhs: 0,
      dxdys: 0,
      dxlcs: 0,
      dxdchs: 0,
      boxNum: null,
      dsData: [],
      mlfData: [],
      dxData: [],
      total: 0,
      hjrk: 0,
      ldrk: 0,
      everyHouseData: [],
      statusForType: [],
      type: '1',
      floorId: '',
      // floorId: 'be600c0d-e748-11ec-8928-000c2955cf1c',
      hasFloor: true,
      info: '',
      show: false
    }
  },
  // watch: {
  //   '$route.path': {
  //     handler (to, from) {
  //       console.log('当前路由', to)
  //       console.log('上一个路由', from)
  //     },
  //     deep: true,
  //     immediate: true,
  //   }
  // },
  // mounted() {
  // this.floorId = this.$route.params.id
  // this.title = this.$route.params.qc
  // // this.getTotal(this.floorId)
  // this.getZhzzJcywBzdzYthcjTreeById(this.floorId)
  // },
  mounted () {
    if (JSON.stringify(this.$route.params) != '{}') {
      localStorage.setItem('jzwinfo', JSON.stringify(this.$route.params))
      this.info = this.$route.params
      this.floorId = this.$route.params.id
    } else {
      let info = JSON.parse(localStorage.getItem('jzwinfo'))
      this.info = info
      this.floorId = info.id
    }
    this.getZhzzJcywBzdzYthcjTreeById(this.floorId)
  },
  methods: {
    handleCheck (val) {
      this.getStatusForType(this.floorId, val)
    },
    // 获取总数
    getTotal (floorId) {
      getZhzzJcywBzdzYthcjLdxqCountById(floorId).then((res) => {
        this.hjrk = res.data.hjrkCount
        this.total = res.data.ldGjzCount
        this.ldrk = res.data.ldrkCount
      })
    },
    getEveryHouse (floorId) {
      getEveryJzrsCountById(floorId).then((res) => {
        this.everyHouseData = res.data
        this.showDefaultIcon()
      })
    },
    // 默认显示的图标
    showDefaultIcon () {
      let that = this
      getZhzzJcywBzdzYthcjLdxqById(this.floorId, '1').then((res1) => {
        that.statusForType = res1.data
        that.$nextTick(() => {
          that.currentSelection = '1'
          that.createFloor()
          getZhzzJcywBzdzYthcjLdxqById(this.floorId, '2').then((res2) => {
            that.statusForType = res2.data
            that.$nextTick(() => {
              that.currentSelection = '2'
              that.createFloor()
              getZhzzJcywBzdzYthcjLdxqById(this.floorId, '7').then((res3) => {
                that.statusForType = res3.data
                that.$nextTick(() => {
                  that.currentSelection = '7'
                  that.createFloor()
                  getZhzzJcywBzdzYthcjLdxqById(this.floorId, '8').then(
                    (res4) => {
                      that.statusForType = res4.data
                      that.$nextTick(() => {
                        that.currentSelection = '8'
                        that.createFloor()
                        that.defaultSelectedDom()
                      })
                    }
                  )
                })
              })
            })
          })
        })
      })
    },
    defaultSelectedDom () {
      if (this.info.fwdzid) {
        let dom = document.getElementById(this.info.fwdzid)
        dom.style.background = '#eb5757bd'
      }
    },
    // 根据类型获取状态
    getStatusForType (floorId, type) {
      let that = this
      that.loading = true
      getZhzzJcywBzdzYthcjLdxqById(floorId, type)
        .then((res) => {
          that.statusForType = res.data
          that.formatNum()
          that.$nextTick(() => {
            that.createFloor()
            that.loading = false
          })
        })
        .catch(() => {
          that.loading = false
        })
    },
    // 获取层户结构
    getZhzzJcywBzdzYthcjTreeById (floorId) {
      getZhzzJcywBzdzYthcjTreeById(floorId)
        .then((res) => {
          if (res.data && res.data.length) {
            this.hasFloor = true
            this.getTotal(this.floorId)
            this.buildData = res.data
            this.formatNum()
            this.$nextTick(() => {
              this.createFloor()
              this.addBoxNum()
            })
            this.getEveryHouse(floorId)
          } else {
            this.hasFloor = false
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    checkState (val) {
      this.currentSelection = val
      if (this.types.indexOf(val) != -1) {
        this.currentSelectionState = true
        this.getStatusForType(this.floorId, val)
      } else {
        this.currentSelectionState = false
        this.typeUncheck()
      }
    },
    // 删除取消勾选的图标
    typeUncheck () {
      let flag = ''
      switch (this.currentSelection) {
        case '1':
          this.removeIcon('huji')
          flag = 'hjFlag'
          break
        case '2':
          this.removeIcon('liudong')
          flag = 'ldFlag'
          break
        case '3':
          this.removeIcon('guanai')
          flag = 'garyFlag'
          break
        case '4':
          this.removeIcon('teshu')
          flag = 'tsFlag'
          break
        case '5':
          this.removeIcon('zdqsn')
          flag = 'zdqsnFlag'
          break
        case '6':
          this.removeIcon('biaoqian')
          flag = 'bqryFlag'
          break
        case '7':
          this.removeIcon('kongfang')
          flag = 'kfFlag'
          break
        case '8':
          this.removeIcon('chuzu')
          flag = 'czFlag'
          break
        case '9':
          this.removeIcon('zizhu')
          flag = 'wcjfzxxFlag'
          break
      }
      if (this.dsData.length) {
        this.changeDsParam(flag)
      }
      if (
        this.mlfData &&
        this.mlfData[0] &&
        this.mlfData[0].children &&
        this.mlfData[0].children.length
      ) {
        this.changeMlfParam(flag)
      }
      if (this.dxData.length) {
        this.changeDxParam(flag)
      }
    },
    removeIcon (className) {
      const arr = document.getElementsByClassName(className)
      const l = arr.length
      for (let i = l - 1; i >= 0; i--) {
        if (arr[i] != null) {
          arr[i].parentNode.removeChild(arr[i])
        }
      }
    },
    changeDsParam (flag) {
      for (let n = 0; n < this.dsData.length; n++) {
        for (let i = this.dsData[n].children.length - 1; i >= 0; i--) {
          for (let j = 0; j < this.dsData[n].children[i].children.length; j++) {
            this.dsData[n].children[i].children[j][flag] = false
          }
        }
      }
    },
    changeMlfParam (flag) {
      for (let i = 0; i < this.mlfData[0].children.length; i++) {
        for (let j = 0; j < this.mlfData[0].children[i].children.length; j++) {
          this.mlfData[0].children[i].children[j][flag] = false
        }
      }
    },
    changeDxParam (flag) {
      for (let n = 0; n < this.dxData.length; n++) {
        for (let i = 0; i < this.dxData[n].children.length; i++) {
          for (let j = 0; j < this.dxData[n].children[i].children.length; j++) {
            this.dxData[n].children[i].children[j][flag] = false
          }
        }
      }
    },
    callbackIcon () {
      const icons = {
        huji: `<img class="huji" src="${require('../../../assets/images/tuli/huji.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`,
        liudong: `<img class="liudong" src="${require('../../../assets/images/tuli/liudong.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`,
        guanai: `<img class="guanai" src="${require('../../../assets/images/tuli/guanai.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`,
        teshu: `<img class="teshu" src="${require('../../../assets/images/tuli/teshu.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`,
        zdqsn: `<img class="zdqsn" src="${require('../../../assets/images/tuli/zdqsn.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`,
        biaoqian: `<img class="biaoqian" src="${require('../../../assets/images/tuli/biaoqian.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`,
        kongfang: `<img class="kongfang" src="${require('../../../assets/images/tuli/kongfang.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`,
        chuzu: `<img class="chuzu" src="${require('../../../assets/images/tuli/chuzu.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`,
        weicaiji: `<img class="zizhu" src="${require('../../../assets/images/tuli/weicaiji.svg')}" alt="" style="width: 15px;margin-left: 3px;"/>`
      }
      return icons
    },
    handleCheckAllChange (val) {
      if (val) {
        let arr = []
        for (let i = 0; i < this.peopleTypeOptions.length; i++) {
          arr.push(this.peopleTypeOptions[i].value)
        }
        this.rklx = arr
      } else {
        this.rklx = []
      }
      this.isIndeterminate = false
    },
    formatNum () {
      this.dsData = []
      this.mlfData = []
      this.dxData = []
      for (let n = 0; n < this.buildData.length; n++) {
        if (this.buildData[n].filed1.includes('B')) {
          this.dxData.push(this.buildData[n])
          this.dxdys++
          if (this.buildData[n].children && this.buildData[n].children.length) {
            this.dxlcs = this.buildData[n].children.length
            this.dxdchs = this.buildData[n].children[0].children.length
          }
        } else if (this.buildData[n].filed1.length == 0) {
          this.mlfData.push(this.buildData[n])
          if (this.buildData[n].children && this.buildData[n].children.length) {
            this.mlflcs = this.buildData[n].children.length
            this.mlfdyhs = this.buildData[n].children[0].children.length
          }
        } else {
          this.dsData.push(this.buildData[n])
          this.dsdys++
          if (this.buildData[n].children && this.buildData[n].children.length) {
            this.dslcs = this.buildData[n].children.length
            this.dsdchs = this.buildData[n].children[0].children.length
          }
        }
      }

      this.dsData.forEach((dan) => {
        let arr = dan.children.sort(this.compare('filed4'))
        dan.children = arr
        dan.children.reverse()
      })

      this.mlfData.forEach((dan) => {
        let arr = dan.children.sort(this.compare('filed4'))
        dan.children = arr
        dan.children.reverse()
      })
    },
    compare (key) {
      return function (value1, value2) {
        var val1 = value1[key]
        var val2 = value2[key]
        return val1 - val2
      }
    },
    createFloor () {
      if (this.dsdys) {
        this.createDsFloor()
      }
      if (this.mlflcs) {
        this.createMlfFloor()
      }
      if (this.dxdys) {
        this.createDxFloor()
      }
      this.defaultSelectedDom()
    },
    createDsFloor () {
      let doms = document.querySelectorAll('.contain')
      for (let n = 0; n < this.dsData.length; n++) {
        let str = ''
        // this.dsData[n].children.reverse()
        // for (let i = this.dsData[n].children.length - 1; i >= 0; i--) {
        for (let i = 0; i < this.dsData[n].children.length; i++) {
          str += '<tr>'
          str += `<td>${this.dsData[n].children[i].filed1}</td>`
          for (let j = 0; j < this.dsData[n].children[i].children.length; j++) {
            let num = 0
            for (let s = 0; s < this.everyHouseData.length; s++) {
              if (
                this.dsData[n].children[i].children[j].id ==
                this.everyHouseData[s].id
              ) {
                num = this.everyHouseData[s].gjzCount
                break
              }
            }
            if (!this.statusForType.length) {
              if (this.currentSelection == '7') {
                this.dsData[n].children[i].children[j].kfFlag = true
              }
              if (this.currentSelection == '9') {
                this.dsData[n].children[i].children[j].wcjfzxxFlag = true
              }
            }
            for (let s = 0; s < this.statusForType.length; s++) {
              if (this.currentSelection == '7') {
                this.dsData[n].children[i].children[j].kfFlag =
                  this.statusForType.indexOf(
                    this.dsData[n].children[i].children[j].id
                  ) > -1
                    ? false
                    : true
              } else if (this.currentSelection == '9') {
                this.dsData[n].children[i].children[j].wcjfzxxFlag =
                  this.statusForType.indexOf(
                    this.dsData[n].children[i].children[j].id
                  ) > -1
                    ? false
                    : true
              } else {
                if (
                  this.dsData[n].children[i].children[j].id ==
                  this.statusForType[s]
                ) {
                  switch (this.currentSelection) {
                    case '1':
                      this.dsData[n].children[i].children[j].hjFlag = true
                      break
                    case '2':
                      this.dsData[n].children[i].children[j].ldFlag = true
                      break
                    case '3':
                      this.dsData[n].children[i].children[j].garyFlag = true
                      break
                    case '4':
                      this.dsData[n].children[i].children[j].tsFlag = true
                      break
                    case '5':
                      this.dsData[n].children[i].children[j].zdqsnFlag = true
                      break
                    case '6':
                      this.dsData[n].children[i].children[j].bqryFlag = true
                      break
                    case '8':
                      this.dsData[n].children[i].children[j].czFlag = true
                      break
                  }
                  break
                }
              }
            }

            const icons = this.callbackIcon()
            str += `<td><div style="width:130px;height: 60px;position: relative" class='house-hover' id="${this.dsData[n].children[i].children[j].id
              }">
                        <p style="pointer-events: none;font-size: 12px;color: #000000;line-height: 14px;position: absolute;left: 3px;top:3px">${this.dsData[n].children[i].children[j].filed1
              }
                        </p>
                        <p style="pointer-events: none;font-size: 12px;color: #000000;line-height: 14px;position: absolute;right: 3px;top:3px">居住人数:<span style="color: #388cff;">${num ? num : 0
              }</span>/人</p>
                        <p style="pointer-events: none;display:flex;;position: absolute;bottom: 3px;left: 3px;">
                        ${this.dsData[n].children[i].children[j].hjFlag
                ? icons.huji
                : ''
              }
                        ${this.dsData[n].children[i].children[j].ldFlag
                ? icons.liudong
                : ''
              }
                        ${this.dsData[n].children[i].children[j].garyFlag
                ? icons.guanai
                : ''
              }
                        ${this.dsData[n].children[i].children[j].tsFlag
                ? icons.teshu
                : ''
              }
                        ${this.dsData[n].children[i].children[j].zdqsnFlag
                ? icons.zdqsn
                : ''
              }
                        ${this.dsData[n].children[i].children[j].bqryFlag
                ? icons.biaoqian
                : ''
              }
                        ${this.dsData[n].children[i].children[j].kfFlag
                ? icons.kongfang
                : ''
              }
                        ${this.dsData[n].children[i].children[j].czFlag
                ? icons.chuzu
                : ''
              }
                        ${this.dsData[n].children[i].children[j].wcjfzxxFlag
                ? icons.weicaiji
                : ''
              }
                        </p>
                    </div></td>`
          }
          str += '</tr>'
        }
        doms[n].innerHTML = str
        let that = this
        doms[n].onclick = function (e) {
          that.queryHouseInfo(e)
        }
      }
    },
    createMlfFloor () {
      let str = ''
      for (let i = 0; i < this.mlfData[0].children.length; i++) {
        str += '<tr>'
        str += `<td>${this.mlfData[0].children[i].filed1}</td>`
        // this.mlfData[0].children[i].children.reverse()
        for (let j = 0; j < this.mlfData[0].children[i].children.length; j++) {
          let num = 0
          for (let s = 0; s < this.everyHouseData.length; s++) {
            if (
              this.mlfData[0].children[i].children[j].id ==
              this.everyHouseData[s].id
            ) {
              num = this.everyHouseData[s].gjzCount
              break
            }
          }
          if (!this.statusForType.length) {
            if (this.currentSelection == '7') {
              this.mlfData[0].children[i].children[j].kfFlag = true
            }
            if (this.currentSelection == '9') {
              this.mlfData[0].children[i].children[j].wcjfzxxFlag = true
            }
          }
          for (let s = 0; s < this.statusForType.length; s++) {
            if (this.currentSelection == '7') {
              this.mlfData[0].children[i].children[j].kfFlag =
                this.statusForType.indexOf(
                  this.mlfData[0].children[i].children[j].id
                ) > -1
                  ? false
                  : true
            } else if (this.currentSelection == '9') {
              this.mlfData[0].children[i].children[j].wcjfzxxFlag =
                this.statusForType.indexOf(
                  this.mlfData[0].children[i].children[j].id
                ) > -1
                  ? false
                  : true
            } else {
              if (
                this.mlfData[0].children[i].children[j].id ==
                this.statusForType[s]
              ) {
                switch (this.currentSelection) {
                  case '1':
                    this.mlfData[0].children[i].children[j].hjFlag = true
                    break
                  case '2':
                    this.mlfData[0].children[i].children[j].ldFlag = true
                    break
                  case '3':
                    this.mlfData[0].children[i].children[j].garyFlag = true
                    break
                  case '4':
                    this.mlfData[0].children[i].children[j].tsFlag = true
                    break
                  case '5':
                    this.mlfData[0].children[i].children[j].zdqsnFlag = true
                    break
                  case '6':
                    this.mlfData[0].children[i].children[j].bqryFlag = true
                    break
                  case '8':
                    this.mlfData[0].children[i].children[j].czFlag = true
                    break
                }
                break
              }
            }
          }
          const icons = this.callbackIcon()
          str += `<td><div style="width:130px;height: 60px;position: relative" id="${this.mlfData[0].children[i].children[j].id
            }" class='house-hover'>
                        <p style="pointer-events: none;font-size: 12px;color: #000000;line-height: 14px;position: absolute;left: 3px;top:3px">${this.mlfData[0].children[i].children[j].filed1
            }
                        </p>
                        <p style="pointer-events: none;font-size: 12px;color: #000000;line-height: 14px;position: absolute;right: 3px;top:3px">
                        <p style="pointer-events: none;display:flex;;position: absolute;bottom: 3px;left: 3px;">
                        ${this.mlfData[0].children[i].children[j].hjFlag
              ? icons.huji
              : ''
            }
                        ${this.mlfData[0].children[i].children[j].ldFlag
              ? icons.liudong
              : ''
            }
                        ${this.mlfData[0].children[i].children[j].garyFlag
              ? icons.guanai
              : ''
            }
                        ${this.mlfData[0].children[i].children[j].tsFlag
              ? icons.teshu
              : ''
            }
                        ${this.mlfData[0].children[i].children[j].zdqsnFlag
              ? icons.zdqsn
              : ''
            }
                        ${this.mlfData[0].children[i].children[j].bqryFlag
              ? icons.biaoqian
              : ''
            }
                        ${this.mlfData[0].children[i].children[j].kfFlag
              ? icons.kongfang
              : ''
            }
                        ${this.mlfData[0].children[i].children[j].czFlag
              ? icons.chuzu
              : ''
            }
                        ${this.mlfData[0].children[i].children[j].wcjfzxxFlag
              ? icons.weicaiji
              : ''
            }
                        </p>
                    </div></td>`
        }
        str += '</tr>'
      }
      document.querySelector('.contain-mlf').innerHTML = str
      let that = this
      document.querySelector('.contain-mlf').onclick = function (e) {
        that.queryHouseInfo(e)
      }
    },
    createDxFloor () {
      let doms = document.querySelectorAll('.contain-dx')
      for (let n = 0; n < this.dxData.length; n++) {
        let str = ''
        for (let i = 0; i < this.dxData[n].children.length; i++) {
          str += '<tr>'
          str += `<td>${this.dxData[n].children[i].filed1}</td>`
          for (let j = 0; j < this.dxData[n].children[i].children.length; j++) {
            let num = 0
            for (let s = 0; s < this.everyHouseData.length; s++) {
              if (
                this.dxData[n].children[i].children[j].id ==
                this.everyHouseData[s].id
              ) {
                num = this.everyHouseData[s].gjzCount
                break
              }
            }
            if (!this.statusForType.length) {
              if (this.currentSelection == '7') {
                this.dxData[n].children[i].children[j].kfFlag = true
              }
              if (this.currentSelection == '9') {
                this.dxData[n].children[i].children[j].wcjfzxxFlag = true
              }
            }
            for (let s = 0; s < this.statusForType.length; s++) {
              if (this.currentSelection == '7') {
                this.dxData[n].children[i].children[j].kfFlag =
                  this.statusForType.indexOf(
                    this.dxData[n].children[i].children[j].id
                  ) > -1
                    ? false
                    : true
              } else if (this.currentSelection == '9') {
                this.dxData[n].children[i].children[j].wcjfzxxFlag =
                  this.statusForType.indexOf(
                    this.dxData[n].children[i].children[j].id
                  ) > -1
                    ? false
                    : true
              } else {
                if (
                  this.dxData[n].children[i].children[j].id ==
                  this.statusForType[s]
                ) {
                  switch (this.currentSelection) {
                    case '1':
                      this.dxData[n].children[i].children[j].hjFlag = true
                      break
                    case '2':
                      this.dxData[n].children[i].children[j].ldFlag = true
                      break
                    case '3':
                      this.dxData[n].children[i].children[j].garyFlag = true
                      break
                    case '4':
                      this.dxData[n].children[i].children[j].tsFlag = true
                      break
                    case '5':
                      this.dxData[n].children[i].children[j].zdqsnFlag = true
                      break
                    case '6':
                      this.dxData[n].children[i].children[j].bqryFlag = true
                      break
                    case '8':
                      this.dxData[n].children[i].children[j].czFlag = true
                      break
                  }
                  break
                }
              }
            }
            const icons = this.callbackIcon()
            str += `<td><div style="width:130px;height: 60px;position: relative" id="${this.dxData[n].children[i].children[j].id
              }" class='house-hover'>
                        <p style="pointer-events: none;font-size: 12px;color: #000000;line-height: 14px;position: absolute;left: 3px;top:3px">${this.dxData[n].children[i].children[j].filed1
              }
                        </p>
                        <p style="pointer-events: none;font-size: 12px;color: #000000;line-height: 14px;position: absolute;right: 3px;top:3px">居住人数:<span style="color: #388cff;">${num ? num : 0
              }</span>/人</p>
                        <p style="pointer-events: none;display:flex;;position: absolute;bottom: 3px;left: 3px;">
                        ${this.dxData[n].children[i].children[j].hjFlag
                ? icons.huji
                : ''
              }
                        ${this.dxData[n].children[i].children[j].ldFlag
                ? icons.liudong
                : ''
              }
                        ${this.dxData[n].children[i].children[j].garyFlag
                ? icons.guanai
                : ''
              }
                        ${this.dxData[n].children[i].children[j].tsFlag
                ? icons.teshu
                : ''
              }
                        ${this.dxData[n].children[i].children[j].zdqsnFlag
                ? icons.zdqsn
                : ''
              }
                        ${this.dxData[n].children[i].children[j].bqryFlag
                ? icons.biaoqian
                : ''
              }
                        ${this.dxData[n].children[i].children[j].kfFlag
                ? icons.kongfang
                : ''
              }
                        ${this.dxData[n].children[i].children[j].czFlag
                ? icons.chuzu
                : ''
              }
                        ${this.dxData[n].children[i].children[j].wcjfzxxFlag
                ? icons.weicaiji
                : ''
              }
                        </p>
                    </div></td>`
          }
          str += '</tr>'
        }
        doms[n].innerHTML = str
        let that = this
        doms[n].onclick = function (e) {
          that.queryHouseInfo(e)
        }
      }
    },
    addBoxNum () {
      let dsDomWidth = 0
      let mlfDomWidth = 0
      let dxDomWidth = 0
      let dsDom = document.querySelectorAll('.ds')
      let dxDom = document.querySelectorAll('.dx')
      if (this.dsdys) {
        for (let i = 0; i < dsDom.length; i++) {
          dsDomWidth = dsDomWidth + dsDom[i].offsetWidth
        }
      }
      if (this.mlflcs) {
        mlfDomWidth = document.getElementById('spNum').offsetWidth
      }
      if (this.dxdys) {
        for (let i = 0; i < dxDom.length; i++) {
          dxDomWidth = dxDomWidth + dxDom[i].offsetWidth
        }
      }

      let arr = [dsDomWidth, mlfDomWidth, dxDomWidth]
      let maxWidth = arr[0]
      for (var i = 1; i < arr.length; i++) {
        if (maxWidth < arr[i]) {
          maxWidth = arr[i]
        }
      }
      this.boxNum = Math.ceil(maxWidth / 42)
      // if (this.dsdys) {
      //   for (let i = 0; i < dsDom.length; i++) {
      //     dsDom[i].style.width = `${maxWidth / dsDom.length}px`
      //   }
      // }
      // if (this.mlflcs) {
      //   // let mlf = document.getElementById('mlf').offsetWidth
      //   // mlf.style.width = `${maxWidth}px`
      // }
      // if (this.dxdys) {
      //   for (let j = 0; j < dxDom.length; j++) {
      //     dxDom[j].style.width = `${maxWidth / dxDom.length}px`
      //   }
      // }
    },
    backToYthcj () {
      // let route = this.$store.state.app.vuex_route
      // this.$router.push({
      //   path: route,
      //   query: {
      //     id: this.floorId
      //   }
      // })
      // window.history.go(-1)
      this.$router.back()
    },
    queryHouseInfo (e) {
      let that = this
      query({ fwdzid: e.target.id }).then((res) => {
        if (res.rows && res.rows.length) {
          let info = res.rows[0]
          that.$router.push({
            name: 'Fwda',
            params: info
          })
        } else {
          that.$modal.msgSuccess('请先前往维护房屋信息')
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
// 滚动条样式
div::-webkit-scrollbar {
  width: 5px;
  height: 8px;
}
div::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 5px;
}
div::-webkit-scrollbar-thumb {
  background: #d8d8d8;
  border-radius: 5px;
}
.app-container {
  overflow-y: scroll;
  height: calc(100% - 39px);
  padding: 10px;
}
.left {
  height: 140px;
  img {
    width: 100%;
    height: 100%;
  }
}
.right {
  position: relative;
  .title {
    font-size: 20px;

    font-weight: 600;
    color: #1f2552;
    line-height: 28px;
  }
  .info {
    font-size: 14px;

    font-weight: 400;
    color: #252525;
    line-height: 20px;
    span {
      color: #2283ff;
    }
  }
  .form {
    width: 95%;
    height: 78px;
    background: #fafbfc;
    margin-top: 8px;
  }
}
.tuli {
  font-size: 14px;

  font-weight: 400;
  color: #000000;
  line-height: 20px;
  img {
    display: inline;
    width: 15px;
    height: 15px;
    margin-left: 15px;
    margin-right: 5px;
  }
}
.type {
  /deep/.el-form-item__content {
    display: flex;
  }
}
.el-form-item {
  margin-bottom: 0px;
}
.danyuan-box {
  margin-right: 15px;
}
.floor-title {
  width: 20px;
  line-height: 22px;
  font-size: 18px;
  position: absolute;
  bottom: 60px;
  left: -7px;

  font-weight: 500;
  color: #3289ff;
}
.mlf {
  top: 20px;
}
.table-box {
  border-top: 15px solid #1890ff;
  padding: 0px 15px;
  box-sizing: border-box;
}
.danyuan-title {
  width: 40%;
  height: 26px;
  margin: 0 auto;
  text-align: center;
  background: #e0e7ef;
  font-size: 16px;
  line-height: 26px;

  font-weight: 500;
  color: #388cff;
}
.dayuan-line {
  width: 30%;
  height: 10px;
  margin: 0 auto;
  border-left: 15px solid #e0e7ef;
  border-right: 15px solid #e0e7ef;
}
.floor-box {
  background: #fafbfc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: auto;
  display: flex;
}
.line1 {
  width: 21px;
  height: 8px;
  background: #4ca9ff;
  position: relative;
  z-index: 10;
  border-radius: 0 0 3px 3px;
}
.line2 {
  width: 21px;
  height: 10px;
  background: #1890ff;
  position: relative;
  z-index: 5;
  top: -5px;
  border-radius: 0px 0px 10px 10px;
}
.floor-info {
  margin-top: 30px;
  width: 100%;
  min-height: 400px;
  overflow-x: auto;
  overflow-y: scroll;
  padding: 10px;
}
.el-radio-group {
  display: inline-block;
  line-height: 36px;
  vertical-align: middle;
  font-size: 14px;
}
.noFloor {
  margin-top: 30px;
  width: 100%;
  height: 500px;
  padding: 10px;
}
.nodata {
  width: 100%;
  text-align: center;
  list-style: none;
  img {
    width: 400px;
    height: 400px;
    margin: 0% auto auto auto;
  }
  span {
    width: 108px;
    height: 25px;
    font-size: 20px;

    font-weight: 400;
    color: #b4b6c6;
    line-height: 25px;
  }
}
</style>
<style lang="less" >
.contain,
.contain-mlf,
.contain-dx {
  td,
  th {
    padding: 8px;
    border: 1px solid;
    font-size: 12px;
  }
}
.contain td,
.contain-mlf td,
.contain-dx td,
.contain th,
.contain-mlf th,
.contain-dx th {
  padding: 8px;
  border: 0px;
  font-size: 12px;
  white-space: nowrap;
  input,
  div,
  button {
    color: #1890ff;
    border: 1px solid;
  }
}
.contain tr,
.contain-mlf tr,
.contain-dx tr,
.contain tr,
.contain-mlf tr,
.contain-dx tr {
  background: #f7f7f7;
  border: 5px solid white;
  box-sizing: border-box;
}
.house-hover:hover {
  background: #fbfb9f;
  cursor: pointer;
}
</style>
