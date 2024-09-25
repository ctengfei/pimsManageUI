<template>
  <div class="editFloor"
       v-loading="fullscreenLoading"
       @click="xinZeng">
    <!-- 此处为新增使用 -->
    <div class="editFloor_xinzeng"
         @click.stop
         v-if="xinZengShow">
      <!-- floorObj.name -->
      <div class="editFloor_name">地址：{{floorObj.name}}</div>
      <!-- 新增地上 -->
      <el-row class="xinzeng_box">
        <el-col :span="3"
                style="display: flex;">
          <div style="margin-right: 5px"><img src="@/assets/images/loushang.svg"
                 alt="light" /></div>
          <div>地上</div>
        </el-col>
        <el-col :span="7"
                class="tongjiegou">
          <div class="tongjiegou_div">单元数</div>
          <el-input-number v-model="newObj.dsdys"
                           size="mini"
                           :min="xinNum"
                           @change="((val,oldVal)=>{getDs(val,oldVal,'dys')})"
                           label="地上单元数"></el-input-number>
        </el-col>
        <el-col :span="7"
                class="tongjiegou">
          <div class="tongjiegou_div">楼层数</div>
          <el-input-number v-model="newObj.dslcs"
                           size="mini"
                           :min="xinNum"
                           @change="((val,oldVal)=>{getDs(val,oldVal,'lcs')})"
                           label="地上楼层数"></el-input-number>
        </el-col>
        <el-col :span="7"
                class="tongjiegou">
          <div class="tongjiegou_div">单层户数</div>
          <el-input-number v-model="newObj.dsdchs"
                           size="mini"
                           :min="xinNum"
                           @change="((val,oldVal)=>{getDs(val,oldVal,'dchs')})"
                           label="地上单层户数"></el-input-number>
        </el-col>
      </el-row>
      <!-- 新增商铺 -->
      <el-row class="xinzeng_box">
        <el-col :span="3"
                style="display: flex;">
          <div style="margin-right: 5px"><img src="@/assets/images/loushang.svg"
                 alt="light" /></div>
          <div>商铺</div>
        </el-col>
        <el-col :span="7"
                class="tongjiegou">
          <div class="tongjiegou_div">楼层数</div>
          <el-input-number v-model="newObj.splcs"
                           size="mini"
                           :min="xinNum"
                           @change="((val,oldVal)=>{getSp(val,oldVal,'lcs')})"
                           label="商铺楼层数"></el-input-number>
        </el-col>
        <el-col :span="7"
                class="tongjiegou">
          <div class="tongjiegou_div">单层户数</div>
          <el-input-number v-model="newObj.spdchs"
                           size="mini"
                           :min="xinNum"
                           @change="((val,oldVal)=>{getSp(val,oldVal,'dchs')})"
                           label="商铺单层户数"></el-input-number>
        </el-col>

      </el-row>
      <!-- 新增地下 -->
      <el-row class="xinzeng_box">
        <el-col :span="3"
                style="display: flex;">
          <div style="margin-right: 5px"><img src="@/assets/images/loushang.svg"
                 alt="light" /></div>
          <div>地下</div>
        </el-col>
        <el-col :span="7"
                class="tongjiegou">
          <div class="tongjiegou_div">单元数</div>
          <el-input-number v-model="newObj.dxdys"
                           size="mini"
                           :min="xinNum"
                           @change="((val,oldVal)=>{getDx(val,oldVal,'dys')})"
                           label="地上单元数"></el-input-number>
        </el-col>
        <el-col :span="7"
                class="tongjiegou">
          <div class="tongjiegou_div">楼层数</div>
          <el-input-number v-model="newObj.dxlcs"
                           size="mini"
                           :min="xinNum"
                           @change="((val,oldVal)=>{getDx(val,oldVal,'lcs')})"
                           label="地上楼层数"></el-input-number>
        </el-col>
        <el-col :span="7"
                class="tongjiegou">
          <div class="tongjiegou_div">单层户数</div>
          <el-input-number v-model="newObj.dxdchs"
                           size="mini"
                           :min="xinNum"
                           @change="((val,oldVal)=>{getDx(val,oldVal,'dchs')})"
                           label="地上单层户数"></el-input-number>
        </el-col>
      </el-row>
    </div>
    <!-- 单元、层级、户室编辑 -->
    <div class="handle"
         v-if="edintObj.edintShow"
         @click.stop>
      <!-- 当前点击的名称 -->
      <div class="editFloor_name">地址：{{louFangName}}</div>
      <el-row class="handle_box">
        <!-- 右侧显示的名称 -->
        <el-col class="handle_left"
                :span="3">
          <div>
            <img src="@/assets/images/login/loushang.png"
                 alt="" />
          </div>
          <div style="box-sizing: border-box; padding-left: 3px">
            {{ edintObj.edintTitle }}
          </div>
        </el-col>
        <!-- 单元编辑 -->
        <el-col class="handle_right"
                :span="21"
                v-if="edintObj.edintShow == 'danyuan'">
          <!-- 增删改查上层 -->
          <el-row :gutter="10"
                  class="main">
            <el-col :span="8"
                    class="main_box">
              <div class="left">单元名</div>
              <div style="
                  width: 128px;
                  height: 30px;
                  line-height: 30px;
                  text-align: center;
                  border: 1px solid #e0e4ea;
                ">
                {{ danInfor.danName }}
              </div>
            </el-col>
            <el-col :span="8"
                    class="main_box">
              <div class="left">起始层数</div>
              <div>
                <el-input-number v-model="danInfor.qiShiCeng"
                                 :min="1"
                                 @change="setDanQiShiCeng"
                                 size="small"
                                 label="起始层数">
                </el-input-number>
              </div>
            </el-col>
            <el-col :span="8"
                    class="main_box">
              <div class="left">楼层数</div>
              <div>
                <el-input-number v-model="danInfor.louCeng"
                                 :min="1"
                                 @change="setDanLouCeng"
                                 size="small"
                                 label="楼层数">
                </el-input-number>
              </div>
            </el-col>
          </el-row>
          <!-- 增删改查下层 -->
          <el-row :gutter="10"
                  class="main xiaceng">
            <el-col :span="8"
                    class="main_box">
              <div class="left">户号</div>
              <div class="right"
                   style="position: relative;">
                <input type="text"
                       class="huHaoInp"
                       v-model="danHuHao"
                       style="height: 28px; border-radius: 5px;"
                       placeholder="前缀"
                       @input="jiaoyan"
                       size="mini" />
                <div style="position: absolute;top: 28px; font-size: 12px;color: red;"
                     v-if="reg.show">{{reg.title}}</div>
                <!-- <input type="text"

                       class="huHaoInp duo"
                       v-model="huHaoHZName"
                       size="mini" /> -->
                <el-select v-model="huHaoHZ"
                           size="mini"
                           @change="getSelect"
                           style="height: 30px; width: 60px;"
                           placeholder="">
                  <el-option v-for="item in dzysBmhzOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8"
                    class="main_box">
              <div class="left">起始户号</div>
              <div>
                <el-input-number v-model="danInfor.qiShiHuHao"
                                 :min="1"
                                 size="small"
                                 @change="setQishiHuHao"
                                 label="起始户号">
                </el-input-number>
              </div>
            </el-col>
            <el-col :span="8"
                    class="main_box">
              <div class="left">单层户数</div>
              <div>
                <el-input-number v-model="danInfor.danCengHuShu"
                                 :min="1"
                                 size="small"
                                 @change="setDanCengHuShu"
                                 label="单层户数">
                </el-input-number>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- 楼层编辑 -->
        <el-col class="handle_right"
                :span="21"
                v-if="edintObj.edintShow == 'louceng'">
          <!-- 上层 -->
          <el-row :gutter="10"
                  class="main">
            <el-col :span="8"
                    class="main_box">
              <div class="left">楼层名</div>
              <input type="text"
                     @input="setLouMing"
                     class="louCengNameStyle"
                     v-model="cengInfor.louName" />
              <!-- <div style="width: 128px; height: 30px;line-height: 30px;text-align: center;border: 1px solid #E0E4EA;">{{louCengName}}</div> -->
            </el-col>
            <el-col :span="8"
                    class="main_box">
              <div class="left">起始户号</div>
              <div>
                <el-input-number :min="1"
                                 v-model="cengInfor.qiShiHuHao"
                                 size="small"
                                 @change="setLouQiShiHu"
                                 label="起始户号">
                </el-input-number>
              </div>
            </el-col>
            <el-col :span="8"
                    class="main_box">
              <div class="left">户数</div>
              <div>
                <el-input-number :min="1"
                                 v-model="cengInfor.huShu"
                                 size="small"
                                 @change="setLouHuShu"
                                 label="户数">
                </el-input-number>
              </div>
            </el-col>
          </el-row>
          <!-- 下层 -->
          <el-row :gutter="10"
                  class="main xiaceng">
            <el-col :span="8"
                    class="main_box">
              <div class="left">户号</div>
              <div class="right"
                   style="position: relative;">
                <input type="text"
                       v-model="huHaoQZ"
                       style="height: 28px; border-radius: 5px;"
                       class="huHaoInp"
                       @input="cengInput"
                       size="mini" />
                <div style="position: absolute;top: 28px; font-size: 12px;color: red;"
                     v-if="reg.show">{{reg.title}}</div>
                <!-- @input="setLouHuQZ" -->
                <el-select v-model="huHaoHZ"
                           size="mini"
                           @change="getSelect"
                           style="height: 30px; width: 60px;"
                           placeholder="">
                  <el-option v-for="item in dzysBmhzOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- 户室编辑 -->
        <el-col class="handle_right"
                :span="21"
                v-if="edintObj.edintShow == 'hushi'">
          <el-row :gutter="10"
                  class="main">
            <el-col :span="8"
                    class="main_box">
              <div class="left">户号</div>
              <div class="right"
                   style="position: relative;">
                <input type="text"
                       v-model="huInfor.huName"
                       @input="setHuName"
                       class="huHaoInpL"
                       size="mini" />
                <div style="position: absolute;top: 28px; font-size: 12px;color: red;"
                     v-if="reg.show">{{reg.title}}</div>
                <el-select v-model="huHaoHZ"
                           size="mini"
                           @change="getSelect"
                           style="height: 30px; width: 60px;"
                           placeholder="">
                  <el-option v-for="item in dzysBmhzOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 展示数据 -->
    <div class="editFloor_zhanshi">
      <div class="mainBox">
        <!-- 地上 -->
        <div ref="ds"
             style="display: flex;"
             v-if="dsList.length > 0">
          <div class="gy_box dsDaBox">
            <div class="gy_cheng"
                 id="dsWenZi">
              <p>地</p>
              <p>上</p>
            </div>
            <div class="gy_margin dsBox"
                 v-for="(item, itemIndex) in dsList"
                 :key="itemIndex"
                 @click.stop="getDanInfor(dsList,item,itemIndex,'ds')">
              <div class="danyuan_title">{{ item.filed1 }}</div>
              <div class="danyuan_line"></div>
              <div class="table_box dsDanBox"
                   :style="dsStyle">
                <table class="contain">
                  <tr v-for="(ceng, cengIndex) in item.children"
                      :key="cengIndex"
                      @click.stop="getCengInfor(dsList, itemIndex, ceng, cengIndex, 'ds')">
                    <td>{{`${ceng.filed4}${ceng.filed6}`}}</td>
                    <td v-for="(hu, huIndex) in ceng.children"
                        :key="huIndex">
                      <input readonly
                             type="text"
                             @click.stop="getHuInfor(dsList, itemIndex, cengIndex, hu, huIndex, 'ds')"
                             :value="`${hu.filed4}${hu.filed7}${hu.filed6}`"
                             style="width: 50px; text-align: center" />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- 商铺 -->
        <div class="gy_jsjl"
             v-if="spList.length > 0">
          <!-- 商铺上面的条纹 -->
          <div style="height: 15px; overflow: hidden">
            <div v-for="item in spTiaoWen"
                 :key="item">
              <div style="float: left">
                <div class="tu_top gy_tuTop_first"></div>
                <div class="tu_bom gy_tuBom_first"></div>
              </div>
              <div style="float: left">
                <div class="tu_top gy_tuTop_two"></div>
                <div class="tu_bom gy_tuBom_two"></div>
              </div>
            </div>
          </div>
          <!-- 商铺的户 -->
          <div style="display: flex;">
            <div class="gy_box spDaBox">
              <div class="gy_cheng"
                   id="spWenZi">
                <p>商</p>
                <p>铺</p>
              </div>
              <div style="box-sizing: border-box; padding-top: 10px">
                <div class="shangpu_box spDanBox"
                     :style="spStyle"
                     @click.stop="getDanInfor(spList, spList[0], 0, 'sp')">
                  <table class="contain">
                    <tr v-for="(ceng, cengIndex) in spList[0].children"
                        :key="cengIndex"
                        @click.stop="getCengInfor(spList, 0, ceng, cengIndex, 'sp')">
                      <td>{{`${ceng.filed4}${ceng.filed6}`}}</td>
                      <td v-for="(hu, huIndex) in ceng.children"
                          :key="huIndex">
                        <input readonly
                               type="text"
                               :value="`${hu.filed4}${hu.filed7}${hu.filed6}`"
                               @click.stop="getHuInfor(spList, 0, cengIndex, hu, huIndex, 'sp')"
                               style="width: 50px; text-align: center" />
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 地下 -->
        <div style="display: flex;"
             v-if="dxList.length > 0">
          <div class="gy_jsjl gy_DXbox dxDaBox">
            <div class="gy_cheng"
                 id="dxWenZi">
              <p>地</p>
              <p>下</p>
            </div>
            <div class="gy_margin dxBox"
                 v-for="(item, itemIndex) in dxList"
                 :key="itemIndex"
                 @click.stop="getDanInfor(dxList, item, itemIndex, 'dx')">
              <div class="danyuan_title">{{ item.filed1 }}</div>
              <div class="danyuan_line"></div>
              <div class="table_box dxDanBox"
                   :style="dxStyle"
                   ref="dxTableBox">
                <table class="contain">
                  <tr v-for="(ceng, cengIndex) in item.children"
                      @click.stop="getCengInfor(dxList, itemIndex, ceng, cengIndex, 'dx')"
                      :key="cengIndex">
                    <td>{{`${ceng.filed4}${ceng.filed6}`}}</td>
                    <td v-for="(hu, huIndex) in ceng.children"
                        :key="huIndex">
                      <input readonly
                             type="text"
                             :value="`${hu.filed4}${hu.filed7}${hu.filed6}`"
                             @click.stop="getHuInfor(dxList, itemIndex, cengIndex, hu, huIndex, 'dx')"
                             style="width: 50px; text-align: center" />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getZhzzJcywBzdzYthcjTreeById, batchCheck } from '@/api/jcyw/bzdz/ythcj'
export default {
  props: [
    'floorObj',//name为上级地址（name+单元+层+户）;id为上级id
  ],
  dicts: ['df_dzhshz'],
  data () {
    return {
      dzysBmhzOptions: [],//户号后缀的字典
      xinNum: 0,
      // 地上、商铺、地下的数据展示
      newObj: {
        dsdys: 0,
        dslcs: 0,
        dsdchs: 0,
        spdchs: 0,
        splcs: 0,
        dxdys: 0,
        dxlcs: 0,
        dxdchs: 0
      },
      xinzengNum: 1,
      dsList: [],
      spList: [],
      dxList: [],
      xinZengShow: false,//地上、地下、商铺 单元楼层户室新增
      edintObj: { //当前点击的信息
        edintShow: null,//控制单元编辑、层级编辑、户室编辑显示隐藏
        edintInfo: null,//控制当前是地上--ds、地下--dx、商铺--sp
        edintTitle: null,//显示当前操作的名称
      },
      indexObj: {
        danIndex: null,
        cengIndex: null,
        huIndex: null,
      },
      edintList: null,
      danInfor: {//单元编辑的信息
        danName: null,
        qiShiCeng: null,
        qiShiHuHao: null,
        danCengHuShu: null,
      },
      cengInfor: {//楼层编辑的信息
        louName: null,
        qiShiHuHao: null,
        huShu: null,
      },
      huInfor: {//户室编辑的信息
        huQZ: null,
        huHZ: null,
        huName: null,
      },
      huHaoHZName: null,
      huHaoQZ: null,
      huHaoHZ: null,
      louFangName: null,
      delList: [],//删除的数组
      delShow: null,
      yuanZHi: null,
      danHuHao: null,
      fullscreenLoading: false,
      reg: {
        show: false,
        title: null,
      },
      dsStyle: {
        boxSizing: 'border-box',
        paddingRight: 0
      },
      spStyle: {
        boxSizing: 'border-box',
        paddingRight: 0
      },
      dxStyle: {
        boxSizing: 'border-box',
        paddingRight: 0
      },
      dsNum: 0,
      spNum: 0,
      dxNum: 0,
      spTiaoWen: 0,

    }
  },

  watch: {
    spList: {
      handler (val) {
        console.log(val)
      }
    },
    dsList: {
      handler (val) {
        console.log(val)
      }
    },
    deep: true
  },
  methods: {
    // 获取三个元素的最大宽度
    getWidth () {
      //单元的盒子 作用padding

      this.$nextTick(() => {
        //判断 地上 地下 商铺的长度不为0的时候  让其的padding 和 margin 为0
        if (this.dsList.length) {
          document.getElementsByClassName('dsDanBox')[0].style.paddingRight = 0 + 'px'

          this.dsList.forEach((item, i) => {
            document.getElementsByClassName('dsBox')[i].style.marginRight = 0 + 'px'
          })

        }

        if (this.spList.length) {
          document.getElementsByClassName('spDanBox')[0].style.paddingRight = 0 + 'px'
        }

        if (this.dxList.length) {
          document.getElementsByClassName('dxDanBox')[0].style.paddingRight = 0 + 'px'

          this.dxList.forEach((item, i) => {
            document.getElementsByClassName('dxBox')[i].style.marginRight = 0 + 'px'

          })


        }

        // 获取 地上 地下 商铺的宽度
        let dsDaBox = document.getElementsByClassName('dsDaBox')[0]
        let spDaBox = document.getElementsByClassName('spDaBox')[0]
        let dxDaBox = document.getElementsByClassName('dxDaBox')[0]

        let dsDaBoxStyle = window.getComputedStyle(dsDaBox, null).width;
        let dsDaBoxNum = (dsDaBoxStyle.substring(0, dsDaBoxStyle.length - 2) * 1).toFixed(0)

        let spDaBoxStyle = window.getComputedStyle(spDaBox, null).width;
        let spDaBoxNum = (spDaBoxStyle.substring(0, spDaBoxStyle.length - 2) * 1).toFixed(0)

        let dxDaBoxStyle = window.getComputedStyle(dxDaBox, null).width;
        let dxDaBoxNum = (dxDaBoxStyle.substring(0, dxDaBoxStyle.length - 2) * 1).toFixed(0)
        // 利用方法  获取最大的宽度  并且返回最大宽度 和 最大宽度的元素
        let obj = this.getStyleMaxNum(dsDaBoxNum * 1, spDaBoxNum * 1, dxDaBoxNum * 1)
        // return
        if (obj.title == "ds") {
          this.dsList.forEach((item, i) => {
            // 最后一个下标 不用设置marging值
            if (i != this.dsList.length - 1) {
              document.getElementsByClassName('dsBox')[i].style.marginRight = 10 + 'px'
            }
          })
          // 上面设置了多少个maring 的总和
          let jiange = (this.dsList.length - 1) * 10
          // 设置商铺的padding值
          document.getElementsByClassName('spDanBox')[0].style.paddingRight = obj.num - spDaBoxNum * 1 + jiange + 'px'

          //设置地下有两种可能 一种是 长度等于1的时候  设置的padding值  大于1的时候设置的maring值
          if (this.dxList.length == 1) {
            document.getElementsByClassName('dxDanBox')[0].style.paddingRight = obj.num - dxDaBoxNum * 1 + jiange + 'px'
          } else if (this.dxList.length > 1) {
            let dxjiange = (obj.num - dxDaBoxNum * 1 + jiange) / (this.dxList.length - 1)
            this.dxList.forEach((item, i) => {
              if (i != this.dxList.length - 1) {
                document.getElementsByClassName('dxBox')[i].style.marginRight = dxjiange + 'px'
              }
            })
          }
        } else if (obj.title == "sp") {
          if (this.dsList.length == 1) {
            document.getElementsByClassName('dsDanBox')[0].style.paddingRight = obj.num - dsDaBoxNum * 1 + 'px'
          } else if (this.dsList.length > 1) {
            this.dsList.forEach((item, i) => {
              if (i != this.dsList.length - 1) {
                let dsjiange = (obj.num - dsDaBoxNum * 1) / (this.dsList.length - 1)
                document.getElementsByClassName('dsBox')[i].style.marginRight = dsjiange + 'px'
              }
            })
          }

          if (this.dxList.length == 1) {
            document.getElementsByClassName('dxDanBox')[0].style.paddingRight = obj.num - dxDaBoxNum * 1 + 'px'
          } else if (this.dxList.length > 1) {
            this.dxList.forEach((item, i) => {
              if (i != this.dxList.length - 1) {
                let dxjiange = (obj.num - dxDaBoxNum * 1) / (this.dxList.length - 1)
                document.getElementsByClassName('dxBox')[i].style.marginRight = dxjiange + 'px'
              }
            })
          }

        } else if (obj.title == "dx") {
          this.dxList.forEach((item, i) => {
            if (i != this.dxList.length - 1) {
              document.getElementsByClassName('dxBox')[i].style.marginRight = 10 + 'px'
            }
          })
          let jiange = (this.dxList.length - 1) * 10

          document.getElementsByClassName('spDanBox')[0].style.paddingRight = obj.num - spDaBoxNum * 1 + jiange + 'px'

          if (this.dsList.length == 1) {
            document.getElementsByClassName('dsDanBox')[0].style.paddingRight = obj.num - dsDaBoxNum * 1 + jiange + 'px'
          } else if (this.dsList.length > 1) {
            let dsjiange = (obj.num - dsDaBoxNum * 1 + jiange) / (this.dsList.length - 1)
            this.dsList.forEach((item, i) => {
              if (i != this.dsList.length - 1) {
                document.getElementsByClassName('dsBox')[i].style.marginRight = dsjiange + 'px'
              }
            })
          }
        }
      })
    },
    getStyleMaxNum (ds, sp, dx) {
      let maxObj = {}
      var max = 0
      if (ds >= max) {
        max = ds
        maxObj = {
          num: max * 1,
          title: 'ds'
        }
      }
      if (sp >= max) {
        max = sp
        maxObj = {
          num: max * 1,
          title: 'sp'
        }
      }
      if (dx >= max) {
        max = dx
        maxObj = {
          num: max * 1,
          title: 'dx'
        }
      }
      return maxObj

    },
    //获取最大值
    getMaxNum (ds, sp, dx) {
      let max = 0
      if (ds >= max) {
        max = ds
      }

      if (sp >= max) {
        max = sp
      }

      if (dx >= max) {
        max = dx
      }

      return max
    },
    jiaoyan () {
      if (this.edintObj.edintInfo == 'dx') {
        let reg = /^[a-zA-Z][^\u4e00-\u9fa5]+$/
        if (!reg.test(this.danHuHao)) {
          this.reg.show = true
          this.reg.title = "*首位必须为字母,不低于两位"
        } else {
          this.reg.show = false
        }
      }
      this.edintList[this.indexObj.danIndex].children.forEach(ceng => {
        ceng.children.forEach(hu => {
          hu.filed4 = this.danHuHao
          hu.filed1 = hu.filed4 + hu.filed7 + hu.filed7
          hu.filed2 = ceng.filed2 + hu.filed1
        })
      })
    },
    //获取选中信息
    getSelect () {
      this.dzysBmhzOptions.forEach(item => {
        if (item.value == this.huHaoHZ) {
          this.huHaoHZName = item.label
        }
      })
      this.setHushi(this.huHaoHZName)
    },
    setHushi (val) {
      if (this.edintObj.edintShow == 'danyuan') {
        this.edintList[this.indexObj.danIndex].children.forEach(ceng => {
          ceng.children.forEach(hu => {
            hu.filed1 = hu.filed4 + hu.label + val
            hu.filed6 = val
            hu.filed2 = ceng.filed2 + hu.filed4 + hu.label + val
          })
        })

      } else if (this.edintObj.edintShow == 'louceng') {
        let list = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex]
        list.children.forEach(hu => {
          hu.filed1 = hu.filed4 + hu.label + val
          hu.filed6 = val
          hu.filed2 = list.filed2 + hu.filed4 + hu.label + val
        })
      } else if (this.edintObj.edintShow == 'hushi') {
        let ceng = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex]
        let hu = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex].children[this.indexObj.huIndex]
        hu.filed1 = hu.filed4 + hu.label + val
        hu.filed6 = val
        hu.filed2 = ceng.filed2 + hu.filed4 + hu.label + val
      }
      this.$emit('getDsList', this.dsList)
      this.$emit('getDxList', this.dxList)
      this.$emit('getSpList', this.spList)
    },
    // 控制新增地上、商铺、地下的显示隐藏
    xinZeng () {
      this.xinZengShow = true
      this.edintObj.edintShow = null
      if (this.xinZengShow) {
        this.setNewObj()
      }
    },
    cengInput () {
      if (this.edintObj.edintInfo == 'dx') {
        let reg = /^[a-zA-Z][^\u4e00-\u9fa5]+$/
        if (!reg.test(this.huHaoQZ)) {
          this.reg.show = true
          this.reg.title = "*首位必须为字母,不低于两位"
        } else {
          this.reg.show = false
        }
      }
      this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex].children.forEach(hu => {
        hu.filed4 = this.huHaoQZ
        hu.filed1 = hu.filed4 + hu.filed7 + hu.filed6
        hu.filed2 = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex].filed2 + hu.filed1
      })
    },
    setHuName () {
      // data.filed4 = this.huInfor.huName
      // data.filed1 = hu.filed4 + hu.filed7 + hu.filed6
      // data.filed2 = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex].filed2 + hu.filed1
      let length = this.huInfor.huName.length
      if (this.edintObj.edintInfo != 'dx') {
        if (length < 3) {
          this.reg.show = true
          this.reg.title = "至少输入三位，最后两位为数字"
        } else {
          let reg = /^\d+$|^\d+[.]?\d+$/
          let text = this.huInfor.huName.substring(this.huInfor.huName.length - 2, this.huInfor.huName.length)
          if (reg.test(text)) {
            this.reg.show = false
            this.setHuNameFn()
          } else {
            this.reg.show = true
            this.reg.title = "至少输入三位，最后两位为数字"
          }
        }
      } else {
        if (length < 4) {
          this.reg.show = true
          this.reg.title = "至少输入四位，首位为字母，最后两位为数字"
        } else {
          let reg = /^[a-zA-Z][^\u4e00-\u9fa5]+$/
          if (reg.test(this.huInfor.huName)) {
            let reg2 = /^\d+$|^\d+[.]?\d+$/
            let text = this.huInfor.huName.substring(this.huInfor.huName.length - 2, this.huInfor.huName.length)
            if (reg2.test(text)) {
              this.reg.show = false
              this.setHuNameFn()
            } else {
              this.reg.show = true
              this.reg.title = "至少输入四位，首位为字母，最后两位为数字"
            }
          } else {
            this.reg.show = true
            this.reg.title = "至少输入四位，首位为字母，最后两位为数字"
          }
        }
      }


    },
    setHuNameFn () {
      let data = this.huInfor.huName
      let houzhui = data.substring(data.length - 2, data.length)
      let qianzhui = data.substring(0, data.length - houzhui.length)
      let cengObj = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex]
      let huObj = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex].children[this.indexObj.huIndex]
      huObj.filed7 = houzhui
      huObj.filed4 = qianzhui
      huObj.filed1 = huObj.filed4 + huObj.filed7 + huObj.filed6
      huObj.filed2 = cengObj.filed2 + huObj.filed1
    },

    //获取点击当前单元的信息
    getDanInfor (list, obj, index, state) {
      let that = this
      // that.reg.reg = state != /dx' ? "/[^\d]/g,''/ : /^[A-Z][\d]*$/
      // that.reg.title = state != 'dx' ? "只可以输入数字" : "请输入第一个字符为字母,其他为数字"
      that.xinZengShow = false
      that.setNewObj()
      that.edintList = list
      that.edintObj.edintInfo = state
      that.edintObj.edintShow = "danyuan"
      that.edintObj.edintTitle = "单元编辑"
      that.indexObj.danIndex = index
      that.louFangName = obj.filed2
      let huHao = []
      let huNum = []
      let val = obj.children[obj.children.length - 1].children[0].filed6
      that.getHuZiDian(val)
      obj.children.forEach(ceng => {
        let hao = ceng.children[0].label * 1 - ceng.label * 100
        huHao.push(hao * 1)
        let num = ceng.children.length
        huNum.push(num * 1)
      })

      this.$nextTick(() => {
        that.danInfor.danName = obj.filed1 || '单元名' //单元名称
        that.danInfor.qiShiHuHao = Math.min(...huHao) //起始户号
        that.danInfor.danCengHuShu = Math.min(...huNum) //单元的单层户数
        that.danInfor.louCeng = obj.children.length //楼层数
        if (state == "dx") {
          that.danInfor.qiShiCeng = obj.children[0].label * 1 //单元的起始层数
        } else {
          that.danInfor.qiShiCeng = obj.children[obj.children.length - 1].label * 1 //单元的起始层数
        }
      })
    },
    // 获取点击当前楼层的信息
    getCengInfor (list, danIndex, obj, index, state) {
      let that = this
      that.xinZengShow = false
      that.setNewObj()
      that.edintList = list
      that.edintObj.edintInfo = state
      that.edintObj.edintShow = "louceng"
      that.edintObj.edintTitle = "楼层编辑"
      that.indexObj.danIndex = danIndex
      that.indexObj.cengIndex = index
      that.louFangName = obj.filed2
      let huHaoHZ = obj.children[0].filed6  //室 号
      that.getHuZiDian(huHaoHZ)
      let huHao = obj.children[0].label.toString()
      that.huHaoQZ = obj.children[0].filed4
      that.yuanZHi = obj.children[0].filed4 + huHao.substring(0, huHao.length - 2)
      this.$nextTick(() => {
        // louName: null,
        // qiShiHuHao: null,
        // huShu: null,
        that.cengInfor.louName = obj.filed4 + obj.filed6
        that.cengInfor.qiShiHuHao = huHao * 1 - obj.label * 100
        that.cengInfor.huShu = obj.children.length
      })
    },
    //获取点击当前户室的信息
    getHuInfor (list, danIndex, cengIndex, obj, index, state) {
      let that = this
      that.xinZengShow = false
      that.setNewObj()
      that.edintList = list
      that.edintObj.edintInfo = state
      that.edintObj.edintShow = "hushi"
      that.edintObj.edintTitle = "户室编辑"
      that.indexObj.danIndex = danIndex
      that.indexObj.cengIndex = cengIndex
      that.indexObj.huIndex = index
      that.louFangName = obj.filed2
      that.getHuZiDian(obj.filed6)

      this.$nextTick(() => {
        that.huInfor.huName = obj.label
      })
    },

    // 单元编辑
    // 单元起始层数
    setDanQiShiCeng (val, oldVal) {
      let that = this
      if (val == 0) {
        return
      }
      let zimu = that.edintList[that.indexObj.danIndex].filed4
      that.edintList[that.indexObj.danIndex].children.forEach(ceng => {
        let num = val - oldVal
        ceng.label = ceng.label * 1 + num
        ceng.filed1 = ceng.filed4 + ceng.label + ceng.filed6
        ceng.filed4 = zimu + ceng.label
        ceng.children.forEach(hu => {
          hu.label = hu.label * 1 + num * 100
          let jieNum = hu.label.toString().length - hu.filed7.toString().length
          hu.filed4 = zimu + hu.label.toString().substring(0, jieNum)
          hu.filed1 = hu.filed4 + hu.filed7 + hu.filed6
        })
      })
      this.$emit('getDsList', this.dsList)
      this.$emit('getDxList', this.dxList)
      this.$emit('getSpList', this.spList)
    },
    //单元的楼层数
    async setDanLouCeng (val, oldVal) {
      let that = this
      if (val > oldVal) {
        let louQData = {}
        let danInfor = null
        danInfor = that.edintList[that.indexObj.danIndex]
        if (that.edintObj.edintInfo == "dx") {
          louQData = that.edintList[that.indexObj.danIndex].children[that.edintList[that.indexObj.danIndex].children.length - 1]

        } else {
          louQData = that.edintList[that.indexObj.danIndex].children[0]
        }
        for (let i = 1; i <= val - oldVal; i++) {
          let list = []
          let cengNum = louQData.label * 1 + i * 1
          louQData.children.forEach(hu => {
            let listLabel = hu.label * 1 + i * 100
            let listFiled4 = listLabel.toString().substring(0, listLabel.toString().length - hu.filed7.toString().length)
            list.push({
              filed1: `${danInfor.filed4}${listFiled4}${hu.filed7}${hu.filed6}`,
              filed2: `${danInfor.filed2}${cengNum}${louQData.filed6}${danInfor.filed4}${listFiled4}${hu.filed7}${hu.filed6}`,
              filed3: hu.filed3,
              filed4: `${danInfor.filed4}${listFiled4}`,
              filed6: hu.filed6,
              filed7: hu.filed7,
              id: null,
              label: hu.label * 1 + i * 100,
              sjdzysid: hu.sjdzysid
            })
          })
          if (that.edintObj.edintInfo == "dx") {
            that.edintList[that.indexObj.danIndex].children.push({
              filed1: `${louQData.filed4}${louQData.filed7}${louQData.filed6}`,
              filed2: `${danInfor.filed2}${louQData.filed4}${cengNum}${louQData.filed6}`,
              filed3: louQData.filed3,
              filed4: `${danInfor.filed4}${cengNum}`,
              filed6: louQData.filed6,
              filed7: louQData.filed7,
              id: null,
              label: cengNum,
              level: null,
              sjdzysid: louQData.sjdzysid,
              children: list
            })
          } else {
            that.edintList[that.indexObj.danIndex].children.unshift({
              filed1: `${danInfor.filed4}${cengNum}${louQData.filed7}${louQData.filed6}`,
              filed2: `${danInfor.filed2}${danInfor.filed4}${cengNum}${louQData.filed7}${louQData.filed6}`,
              filed3: louQData.filed3,
              filed4: `${danInfor.filed4}${cengNum}`,
              filed6: louQData.filed6,
              filed7: louQData.filed7,
              id: null,
              label: cengNum,
              level: null,
              sjdzysid: louQData.sjdzysid,
              children: list
            })
          }
          if (that.edintObj.edintInfo == "sp") {

            that.setNewObj()
            that.getErCiDsList()

          }
        }
      } else {
        let list = []
        list.push(that.edintList[that.indexObj.danIndex])
        let state = await this.setDelLCS(list, oldVal, val, 'ds',)
        that.getErCiDsList()
        if (!state) {
          this.$nextTick(() => {
            that.danInfor.louCeng = oldVal
          })
        }
      }

      this.$emit('getDsList', this.dsList)
      this.$emit('getDxList', this.dxList)
      this.$emit('getSpList', this.spList)

    },
    //单元的起始户号
    setQishiHuHao (val, oldVal) {
      this.edintList[this.indexObj.danIndex].children.forEach((ceng) => {
        let dizhi = ceng.filed2
        ceng.children.forEach((hu, huIndex) => {
          hu.filed7 = val < 10 ? `0${val * 1 + huIndex}` : val
          hu.filed1 = `${hu.filed4}${hu.filed7}${hu.filed6}`
          hu.filed2 = dizhi + hu.filed1
        })
      })
      this.$emit('getDsList', this.dsList)
      this.$emit('getDxList', this.dxList)
      this.$emit('getSpList', this.spList)
    },
    //单元的单层户数
    async setDanCengHuShu (val, oldVal) {
      let that = this
      if (val > oldVal) {
        for (let i = 1; i <= val - oldVal; i++) {
          that.edintList[that.indexObj.danIndex].children.forEach(ceng => {
            let obj = ceng.children[ceng.children.length - 1]
            let num = obj.label * 1 + i
            let filed7 = obj.filed7 < 10 ? `0${obj.filed7 * 1 + i}` : obj.filed7 * 1 + i
            let filed4 = `${that.edintList[that.indexObj.danIndex].filed4}${num.toString().substring(0, num.toString().length - filed7.toString().length)}`
            ceng.children.push({
              filed1: `${obj.filed4}${obj.filed6}${filed7}`,
              filed2: `${that.edintList[that.indexObj.danIndex].filed2}${obj.filed1}${obj.filed4}${obj.filed6}${filed7}`,
              filed3: obj.filed3,
              filed4: filed4,
              filed6: obj.filed6,
              filed7: filed7,
              id: null,
              label: num,
              sjdzysid: obj.sjdzysid,
            })
          })
        }
      } else {
        let list = []
        list.push(that.edintList[that.indexObj.danIndex])
        let state = await this.setDelDCHS(list, oldVal, val)
        if (!state) {
          this.$nextTick(() => {
            this.danInfor.danCengHuShu = oldVal
          })
        }
      }
      this.getWidth()
      this.$emit('getDsList', this.dsList)
      this.$emit('getDxList', this.dxList)
      this.$emit('getSpList', this.spList)
    },


    // 楼层编辑
    //楼层名字更改
    setLouMing () {
      let data = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex]
      let reg = /^[1-9]+[\u4e00-\u9fa5]/
      let state = reg.test(this.cengInfor.louName)
      if (state) {
        let houzhui = this.cengInfor.louName.substring(this.cengInfor.louName.length - 1, this.cengInfor.louName.length)
        let num = this.cengInfor.louName.substring(0, this.cengInfor.louName.length - 1)
        data.filed4 = num
        data.filed6 = houzhui
        data.filed1 = num + houzhui
      }
      // data.filed1 = this.cengInfor.louName
      // data.filed6 = this.cengInfor.louName.substring(this.cengInfor.louName.length - 1, this.cengInfor.louName.length)
      this.$emit('getDsList', this.dsList)
      this.$emit('getDxList', this.dxList)
      this.$emit('getSpList', this.spList)
    },
    //楼层的起始户号
    setLouQiShiHu (val, oldVal) {
      this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex].children.forEach((hu, huIndex) => {
        // let num = hu.label * 1 - oldVal + val
        // hu.filed1 = hu.filed4 + num + hu.filed6
        // hu.label = num
        hu.filed7 = val < 10 ? `0${val * 1 + huIndex}` : val * 1 + huIndex
        hu.filed1 = hu.filed4 + hu.filed7 + hu.filed6
        hu.filed2 = this.edintList[this.indexObj.danIndex].children[this.indexObj.cengIndex].filed2 + hu.filed1
      })
      this.$emit('getDsList', this.dsList)
      this.$emit('getDxList', this.dxList)
      this.$emit('getSpList', this.spList)
    },
    //楼层的户数
    async setLouHuShu (val, oldVal) {
      let that = this
      if (val > oldVal) {
        let listLength = that.edintList[that.indexObj.danIndex].children[that.indexObj.cengIndex].children.length
        for (let i = 1; i <= val - oldVal; i++) {
          let obj = that.edintList[that.indexObj.danIndex].children[that.indexObj.cengIndex].children[listLength - 1]
          let filed7 = obj.filed7 * 1 + i < 10 ? `0${obj.filed7 * 1 + i}` : obj.filed7 * 1 + i
          let num = obj.label * 1 + i
          that.edintList[that.indexObj.danIndex].children[that.indexObj.cengIndex].children.push({
            filed1: `${obj.filed4}${filed7}${obj.filed6}`,
            filed2: `${that.edintList[that.indexObj.danIndex].children[that.indexObj.cengIndex].filed2}${obj.filed4}${filed7}${obj.filed6}`,
            filed3: obj.filed3,
            filed4: obj.filed4,
            filed6: obj.filed6,
            filed7: filed7,
            id: null,
            label: num,
            sjdzysid: obj.sjdzysid,
          })
        }
      } else {
        let list = []
        list.push(that.edintList[that.indexObj.danIndex].children[that.indexObj.cengIndex])
        let state = await that.setDelDCHS(list, oldVal, val, 'ceng')
        if (!state) {
          this.$nextTick(() => {
            this.cengInfor.huShu = oldVal
          })
        }
      }
      this.getWidth()
      this.$emit('getDsList', this.dsList)
      this.$emit('getDxList', this.dxList)
      this.$emit('getSpList', this.spList)

    },



    //地上单元创建获取的单元数、楼层数、单层户数
    async getDs (val, oldVal, state) {
      let list = []
      let length = this.dsList.length
      if (state == "dys") {
        if (this.newObj.dsdys != 0) {
          this.newObj.dslcs = this.newObj.dslcs == 0 ? 1 : this.newObj.dslcs
          this.newObj.dsdchs = this.newObj.dsdchs == 0 ? 1 : this.newObj.dsdchs
        } else {
          this.newObj.dslcs = 0
          this.newObj.dsdchs = 0
        }
        if (val > oldVal) {
          list = this.setDsDanList(val, oldVal)
        } else {
          let state = await this.setDelDYS(this.dsList, oldVal, val, 'ds')
          if (!state) {
            this.$nextTick(() => {
              this.newObj.dsdys = oldVal
            })
          }
        }

      } else if (state == "lcs") {
        if (this.newObj.dslcs != 0) {
          this.newObj.dsdys = this.newObj.dsdys == 0 ? 1 : this.newObj.dsdys
          this.newObj.dsdchs = this.newObj.dsdchs == 0 ? 1 : this.newObj.dsdchs
        } else {
          this.newObj.dsdys = 0
          this.newObj.dsdchs = 0
        }
        if (val > oldVal) {
          if (!this.dsList.length) {
            list = this.setDsDanList(val, oldVal)
          } else {
            this.setDsCengList(val, oldVal)
          }
        } else {

          let state = await this.setDelLCS(this.dsList, oldVal, val, 'ds')
          if (!state) {
            this.$nextTick(() => {
              this.newObj.dslcs = oldVal
            })
          }
        }
      } else if (state == "dchs") {
        if (this.newObj.dsdchs != 0) {
          this.newObj.dsdys = this.newObj.dsdys == 0 ? 1 : this.newObj.dsdys
          this.newObj.dslcs = this.newObj.dslcs == 0 ? 1 : this.newObj.dslcs
        } else {
          this.newObj.dsdys = 0
          this.newObj.dslcs = 0
        }
        if (val > oldVal) {
          if (!this.dsList.length) {
            list = this.setDsDanList(val, oldVal)
          } else {
            this.setDsHuList(val, oldVal)
          }
        } else {
          let state = await this.setDelDCHS(this.dsList, oldVal, val, 'ds')
          if (!state) {
            this.$nextTick(() => {
              this.newObj.sadchs = oldVal
            })
          }
          if (val == 0) {
            this.dsList = []
          }
        }
      }

      this.dsList = [...this.dsList, ...list]
      this.getWidth()
      this.$emit('getDsList', this.dsList)
    },
    // 地上合成树形结构
    setDsDanList (val, oldVal) {
      let that = this
      let num = oldVal + 1
      let arr = []
      for (let d = num; d <= that.newObj.dsdys; d++) {
        let danObj = {
          filed1: `${d * 1}单元`,
          filed2: `${that.floorObj.name + d * 1}单元`,
          filed3: 61,
          filed4: '',
          filed6: '单元',
          filed7: '',
          label: d * 1,
          id: null,
          sjdzysid: that.floorObj.id,
          children: []
        }
        arr[d - num] = danObj
        for (let c = 1; c <= that.newObj.dslcs; c++) {
          let cengObj = {
            filed1: `${(c + that.newObj.splcs) * 1}层`,
            filed2: `${that.floorObj.name + d * 1}单元${(c + that.newObj.splcs) * 1}层`,
            filed3: 62,
            filed4: `${(c + that.newObj.splcs) * 1}`,
            filed6: '层',
            filed7: '',
            label: (c + that.newObj.splcs) * 1,
            id: null,
            sjdzysid: null,
            children: []
          }
          arr[d - num].children[c - 1] = cengObj
          for (let h = 1; h <= that.newObj.dsdchs; h++) {
            let huhao = ((c * 1 + that.newObj.splcs) * 100 + h).toString()
            let houzhui = huhao.substring(cengObj.label.toString().length, huhao.length)
            let huObj = {
              filed1: `${(c + that.newObj.splcs) * 100 + h * 1}室`,
              filed2: `${that.floorObj.name + d * 1}单元${c * 1 + that.newObj.splcs}层${(c * 1 + that.newObj.splcs) * 100 + h * 1}室`,
              filed3: 63,
              filed4: `${cengObj.label}`,
              filed6: '室',
              filed7: houzhui,
              label: (c * 1 + that.newObj.splcs) * 100 + h,
              id: null,
              sjdzysid: null,
            }
            arr[d - num].children[c - 1].children[h - 1] = huObj
          }
        }
      }
      arr.forEach(item => {
        item.children.reverse()
      })
      return arr
    },
    // 地上楼层的新增
    setDsCengList (val, oldVal) {
      let that = this
      that.dsList.forEach(dan => {
        let danDiZHi = dan.filed2
        let cengHao = dan.children[0].label * 1
        let arr = []
        for (let c = 1; c <= val - oldVal; c++) {
          // let cengHao = `${danDiZHi}${cengHao + c}层`
          let cengObj = {
            filed1: `${cengHao + c * 1}层`,
            filed2: `${danDiZHi}${cengHao + c * 1}层`,
            filed3: 62,
            filed4: `${cengHao + c * 1}`,
            filed6: '层',
            filed7: '',
            label: cengHao + c * 1,
            id: null,
            sjdzysid: dan.id,
            children: []
          }

          for (let h = 1; h <= this.newObj.dsdchs; h++) {
            let huhao = (cengObj.label * 100 + h * 1).toString()
            let houzhui = huhao.substring(cengObj.label.toString().length, huhao.length)
            let huObj = {
              filed1: `${cengObj.label * 100 + h * 1}室`,
              filed2: `${cengObj.filed2}${cengObj.label * 100 + h * 1}室`,
              filed3: 63,
              filed4: `${cengObj.label}`,
              filed6: '室',
              filed7: houzhui,
              label: cengObj.label * 100 + h * 1,
              id: null,
              sjdzysid: null,
            }
            cengObj.children[h - 1] = huObj
          }
          dan.children.unshift(cengObj)
        }
      })
    },
    // 地上户室的新增
    setDsHuList (val, oldVal) {
      let that = this
      that.dsList.forEach(dan => {
        dan.children.forEach(ceng => {
          let huNum = ceng.children[ceng.children.length - 1].label * 1
          let sjdzysid = ceng.id
          let cengDizhi = ceng.filed2
          let huObj = {}

          for (let h = 1; h <= val - oldVal; h++) {
            let huhao = (huNum + h).toString()
            let houzhui = huhao.substring(ceng.label.toString().length, huhao.length)
            huObj = {
              filed1: `${huNum + h * 1}室`,
              filed2: `${cengDizhi}${huNum + h * 1}室`,
              filed3: 63,
              filed4: `${ceng.label}`,
              filed6: '室',
              filed7: houzhui,
              label: huNum + h * 1,
              id: null,
              sjdzysid: sjdzysid,
            }
            ceng.children.push(huObj)
          }
        })
      })
    },
    // 地上数据二次发生变化（商铺新增楼层时）
    getErCiDsList () {
      // 层数+商铺的楼层数   开始编译数据的时候加一个上层地址
      this.dsList.forEach(dan => {
        dan.children.reverse()
        let danDizhi = dan.filed2
        let arr = []
        dan.children.forEach((ceng, cengIndex) => {
          let cengObj = {
            filed1: `${(this.newObj.splcs) * 1 + cengIndex + 1}层`,
            filed2: `${danDizhi}${(this.newObj.splcs) * 1 + cengIndex + 1}层`,
            filed3: ceng.filed3,
            filed4: `${(this.newObj.splcs) * 1 + cengIndex + 1}`,
            filed6: ceng.filed6,
            filed7: '',
            label: (this.newObj.splcs) * 1 + cengIndex + 1,
            id: ceng.id,
            sjdzysid: ceng.sjdzysid,
            children: ceng.children,
          }
          arr[cengIndex] = cengObj
          let cengDizhi = cengObj.filed2
          ceng.children.forEach((hu, huIndex) => {
            let huNum = hu.label.toString().substring(hu.label.toString().length - 1, hu.label.toString().length)
            let huhao = (cengObj.label * 100 + huNum * 1).toString()
            let houZhui = huhao.substring(cengObj.label.toString().length, huhao.length)
            let huObj = {
              filed1: `${cengObj.label * 100 + huNum * 1}室`,
              filed2: `${cengDizhi}${cengObj.label * 100 + huNum * 1}室`,
              filed3: hu.filed3,
              filed4: `${cengObj.label}`,
              filed6: hu.filed6,
              filed7: houZhui,
              label: cengObj.label * 100 + huNum * 1,
              id: hu.id,
              sjdzysid: hu.sjdzysid,
            }
            arr[cengIndex].children[huIndex] = huObj
          })
        })
        dan.children = arr
        dan.children.reverse()
      })
    },


    //新增删除单元获取id
    setDelDYS (list, oldVal, val, state) {
      return new Promise((reslove, reject) => {
        let delList = list.slice(list.length - (oldVal - val), list.length)
        let delIdList = []
        delList.forEach(item => {
          if (item.id) {
            delIdList.push(item.id)
          }
        })
        let str = delIdList.toString()
        if (str.length) {
          batchCheck(str).then(res => {
            this.delList = [...this.delList, ...delIdList]
            list.splice(list.length - (oldVal - val), list.length)
            this.$emit('getDelList', this.delList)
            reslove(true)
          }).catch(rej => {
            reslove(false)
          })
        } else {
          list.splice(list.length - (oldVal - val), list.length)
        }
        this.getWidth()

      })
    },
    // 新增删除楼层数
    setDelLCS (list, oldVal, val, state) {
      return new Promise((relove, reject) => {
        let delList = []
        let delIdList = []
        let delShow = true
        if (state != 'dx') {
          list.forEach(dan => {
            delList = [...delList, ...dan.children.slice(0, oldVal - val)]
            // dan.children.splice(0, oldVal - val)
          })
        } else {
          list.forEach(dan => {
            delList = [...delList, ...dan.children.slice(dan.children.length - (oldVal - val), dan.children.length)]
            // dan.children.splice(dan.children.length - (oldVal - val), dan.children.length)
          })
        }
        delList.forEach(item => {
          if (item.id != null) {
            delIdList.push(item.id)
          }
        })
        this.getErCiDsList()
        let str = delIdList.toString()
        if (str.length) {
          batchCheck(str).then(res => {
            this.delList = [...this.delList, ...delIdList]
            if (state != 'dx') {
              list.forEach(dan => {
                dan.children.splice(0, oldVal - val)
              })
              this.getErCiDsList()
            } else {
              list.forEach(dan => {
                dan.children.splice(dan.children.length - (oldVal - val), dan.children.length)
              })

            }

            this.$emit('getDelList', this.delList)
            relove(true)
          }).catch(rej => {
            relove(false)
          })
        } else {
          if (state != 'dx') {
            list.forEach(dan => {
              dan.children.splice(0, oldVal - val)
            })
            this.getErCiDsList()
          } else {
            list.forEach(dan => {
              dan.children.splice(dan.children.length - (oldVal - val), dan.children.length)
            })

          }

        }
        if (val == 0) {
          if (state == 'ds') {
            this.dsList = []
          } else if (state == 'dx') {
            this.dxList = []
          } else if (state == 'sp') {
            this.spList = []
            this.getErCiDsList()
          }
        }


      })

    },
    // 新增删除单层户室
    setDelDCHS (list, oldVal, val, state) {
      return new Promise((relove, reject) => {
        let delList = []
        let delIdList = []
        let delShow = true
        if (state == 'ceng') {
          list.forEach(ceng => {
            delList = [...delList, ...ceng.children.slice(ceng.children.length - (oldVal - val), ceng.children.length)]
          })
        } else {
          list.forEach(dan => {
            dan.children.forEach(ceng => {
              delList = [...delList, ...ceng.children.slice(ceng.children.length - (oldVal - val), ceng.children.length)]
            })
          })
        }
        delList.forEach(item => {
          if (item.id != null) {
            delIdList.push(item.id)
          }
        })
        let str = delIdList.toString()
        if (str.length) {
          batchCheck(str).then(res => {
            this.delList = [...this.delList, ...delIdList]
            if (state == 'ceng') {
              list.forEach(ceng => {
                ceng.children.splice(ceng.children.length - (oldVal - val), ceng.children.length)
              })
            } else {
              list.forEach(dan => {
                dan.children.forEach(ceng => {
                  ceng.children.splice(ceng.children.length - (oldVal - val), ceng.children.length)
                })
              })
            }
            this.$emit('getDelList', this.delList)
            relove(true)
          }).catch(rej => {
            relove(false)
          })
        } else {
          if (state == 'ceng') {
            list.forEach(ceng => {
              ceng.children.splice(ceng.children.length - (oldVal - val), ceng.children.length)
            })
          } else {
            list.forEach(dan => {
              dan.children.forEach(ceng => {
                ceng.children.splice(ceng.children.length - (oldVal - val), ceng.children.length)
              })
            })
          }
        }
        if (val == 0) {
          if (state == 'ds') {
            this.dsList = []
          } else if (state == 'dx') {
            this.dxList = []
          } else if (state == 'sp') {
            this.spList = []
          }
        }
        this.getWidth()
      })
    },



    // 商铺单元创建获取的楼层数、单层户数
    async getSp (val, oldVal, state) {
      let list = []
      if (state == "lcs") {
        if (this.newObj.splcs != 0) {
          this.newObj.spdchs = this.newObj.spdchs == 0 ? 1 : this.newObj.spdchs
        } else {
          this.newObj.spdchs = 0
        }

        if (val > oldVal) {
          list = this.setSpCengList(val, oldVal)
          console.log(list)
        } else {
          let state = await this.setDelLCS(this.spList, oldVal, val, 'sp')
          if (!state) {
            this.$nextTick(() => {
              this.newObj.splcs = oldVal
            })
          }
        }
        this.getWidth()
      } else if (state == "dchs") {

        if (this.newObj.spdchs != 0) {
          this.newObj.splcs = this.newObj.splcs == 0 ? 1 : this.newObj.splcs
        } else {
          this.newObj.splcs = 0
        }
        if (val > oldVal) {
          if (this.spList.length) {
            this.setSpHuList(val, oldVal)
          } else {
            list = this.setSpCengList(val, oldVal)
          }
          this.getWidth()
        } else {
          let state = await this.setDelDCHS(this.spList, oldVal, val, 'sp')
          if (!state) {
            this.$nextTick(() => {
              this.newObj.spdchs = oldVal
            })
          }
          this.getWidth()
        }

      }
      if (list.length) {
        if (this.spList.length) {
          // console.log(list)
          // console.log(this.spList)
          list[0].children = [...list[0].children, ...this.spList[0].children]
          // console.log(list)
          this.$set(this.spList, 0, list[0])
          // console.log(2222)
          // consolle.log(this.spList)
          // let obj = {}
          // for (let k in this.spList[0]) {
          //   obj[k] = this.spList[0][k]
          // }
          // console.log(obj)
          // // this.spList[0].children = [...list[0].children, ...this.spList[0].children]
          // let list = [...list[0].children, ...this.spList[0].children]
          // for(let k in this.spList)
          // this.$set(this.spList, 0, list)
          // list[0].children.forEach(item => {
          //   this.spList[0].children.unshift(item)
          // })

        } else {
          this.spList = list
        }
      }

      this.$emit('getSpList', this.spList)
    },
    // 商铺合成树形结构
    setSpCengList (val, oldVal) {
      let that = this
      let arr = []
      let danObj = {
        filed1: '',
        filed2: that.floorObj.name,
        filed3: 61,
        filed4: '',
        filed6: '',
        filed7: '',
        label: '',
        id: null,
        sjdzysid: that.floorObj.id,
        children: []
      }
      let num = oldVal + 1
      arr[0] = danObj
      for (let c = num; c <= that.newObj.splcs; c++) {
        let cengObj = {
          filed1: `${c}层`,
          filed2: `${that.floorObj.name + c * 1}层`,
          filed3: 62,
          filed4: `${c * 1}`,
          filed6: '层',
          filed7: '',
          label: c * 1,
          id: null,
          sjdzysid: null,
          children: []
        }
        arr[0].children[c - num] = cengObj
        for (let h = 1; h <= that.newObj.spdchs; h++) {
          let huhao = (c * 100 + h * 1).toString()
          let houzhui = huhao.substring(cengObj.label.toString().length, huhao.length)
          let huObj = {
            filed1: `${c * 100 + h * 1}室`,
            filed2: `${that.floorObj.name + c}层${c * 100 + h * 1}室`,
            filed3: 63,
            filed4: `${cengObj.label}`,
            filed6: '室',
            filed7: houzhui,
            label: c * 100 + h * 1,
            id: null,
            sjdzysid: null,
          }
          arr[0].children[c - num].children[h - 1] = huObj
        }
      }
      arr.forEach(item => {
        item.children.reverse()
      })
      this.getErCiDsList()
      return arr
    },
    // 商铺的户新增
    setSpHuList (val, oldVal) {
      let that = this
      this.spList[0].children.forEach(ceng => {
        let cengDizhi = ceng.filed2
        let huNum = ceng.children[ceng.children.length - 1].label * 1
        let huWenZi = ceng.children[ceng.children.length - 1].filed6
        let sjdzysid = ceng.children[ceng.children.length - 1].sjdzysid
        for (let h = 1; h <= val - oldVal; h++) {
          let huhao = (huNum + h * 1).toString()
          let houzhui = huhao.substring(ceng.label.toString().length, huhao.length)
          let huObj = {
            filed1: `${huNum + h * 1}室`,
            filed2: `${cengDizhi}${huNum + h * 1}室`,
            filed3: 63,
            filed4: `${ceng.label}`,
            filed6: huWenZi,
            filed7: houzhui,
            label: huNum + h * 1,
            id: null,
            sjdzysid: sjdzysid,
          }
          ceng.children.push(huObj)
        }
      })
    },



    // 地下单元创建获取的单元数、楼层数、单元户数
    async getDx (val, oldVal, state) {
      let list = []
      if (state == "dys") {
        if (this.newObj.dxdys != 0) {
          this.newObj.dxlcs = this.newObj.dxlcs == 0 ? 1 : this.newObj.dxlcs
          this.newObj.dxdchs = this.newObj.dxdchs == 0 ? 1 : this.newObj.dxdchs
        } else {
          this.newObj.dxlcs = 0
          this.newObj.dxdchs = 0
        }
        if (val > oldVal) {
          list = this.setDxDanList(val, oldVal)
        } else {
          let state = await this.setDelDYS(this.dxList, oldVal, val)
          if (!state) {
            this.$nextTick(() => {
              this.newObj.dxdys = oldVal
            })
          }
        }
      } else if (state == "lcs") {
        if (this.newObj.dxlcs != 0) {
          this.newObj.dxdys = this.newObj.dxdys == 0 ? 1 : this.newObj.dxdys
          this.newObj.dxdchs = this.newObj.dxdchs == 0 ? 1 : this.newObj.dxdchs
        } else {
          this.newObj.dxdys = 0
          this.newObj.dxdchs = 0
        }
        if (val > oldVal) {
          if (this.dxList.length) {
            this.setDxCengList(val, oldVal)
          } else {
            list = this.setDxDanList(val, oldVal)
          }
        } else {
          let state = await this.setDelLCS(this.dxList, oldVal, val, 'dx')
          if (!state) {
            this.$nextTick(() => {
              this.newObj.dxlcs = oldVal
            })
          }
        }
      } else if (state == "dchs") {
        if (this.newObj.dxdchs != 0) {
          this.newObj.dxdys = this.newObj.dxdys == 0 ? 1 : this.newObj.dxdys
          this.newObj.dxlcs = this.newObj.dxlcs == 0 ? 1 : this.newObj.dxlcs
        } else {
          this.newObj.dxdys = 0
          this.newObj.dxlcs = 0
        }
        if (val > oldVal) {
          if (this.dxList.length) {
            this.setDxHuList(val, oldVal)
          } else {
            list = this.setDxDanList(val, oldVal)
          }
        } else {
          let state = await this.setDelDCHS(this.dxList, oldVal, val, 'dx')
          if (!state) {
            this.$nextTick(() => {
              this.newObj.dxdchs = oldVal
            })
          }
        }

      }
      this.dxList = [...this.dxList, ...list]
      this.getWidth()
      this.$emit('getDxList', this.dxList)
    },
    //地下合成数据
    setDxDanList (val, oldVal) {
      let that = this
      let num = oldVal + 1
      let arr = []
      for (let d = num; d <= that.newObj.dxdys; d++) {
        let danObj = {
          filed1: `B${d * 1}单元`,
          filed2: that.floorObj.name + 'B' + d * 1 + '单元',
          filed3: 61,
          filed4: 'B',
          filed6: '单元',
          filed7: '',
          label: d * 1,
          id: null,
          sjdzysid: that.floorObj.id,
          children: []
        }
        arr[d - num] = danObj
        for (let c = 1; c <= that.newObj.dxlcs; c++) {
          let cengObj = {
            filed1: `B${c}层`,
            filed2: that.floorObj.name + 'B' + d * 1 + '单元' + 'B' + c * 1 + '层',
            filed3: 62,
            filed4: `B${c * 1}`,
            filed6: '层',
            filed7: '',
            label: c * 1,
            id: null,
            sjdzysid: null,
            children: []
          }
          arr[d - num].children[c - 1] = cengObj
          for (let h = 1; h <= that.newObj.dxdchs; h++) {
            let huhao = (c * 100 + h * 1).toString()
            let houzhui = huhao.substring(cengObj.label.toString().length, huhao.length)
            let huObj = {
              filed1: `B${c * 100 + h * 1}室`,
              filed2: that.floorObj.name + 'B' + d + '单元' + 'B' + c + '层' + 'B' + (c * 100 + h * 1) + '室',
              filed3: 63,
              filed4: `B${cengObj.label}`,
              filed6: '室',
              filed7: houzhui,
              label: c * 100 + h * 1,
              id: null,
              sjdzysid: null,
            }
            arr[d - num].children[c - 1].children[h - 1] = huObj
          }
        }
      }
      return arr
    },
    // 地下楼层的新增
    setDxCengList (val, oldVal) {
      let that = this
      that.dxList.forEach(dan => {
        let danDiZHi = dan.filed2
        let cengHao = dan.children[0].label * 1
        let arr = []
        for (let c = oldVal; c < val; c++) {
          // let cengHao = `${danDiZHi}${cengHao + c}层`
          let cengObj = {
            filed1: `B${cengHao + c * 1}层`,
            filed2: `${danDiZHi}${cengHao + c * 1}层`,
            filed3: 62,
            filed4: `B${cengHao + c * 1}`,
            filed6: '层',
            filed7: '',
            label: cengHao + c * 1,
            id: null,
            sjdzysid: dan.id,
            children: []
          }
          for (let h = 1; h <= this.newObj.dxdchs; h++) {
            let huhao = (cengObj.label * 100 + h * 1).toString()
            let houzhui = huhao.substring(cengObj.label.toString().length, huhao.length)
            let huObj = {
              filed1: `B${cengObj.label * 100 + h * 1}室`,
              filed2: `${cengObj.filed2}${cengObj.label * 100 + h * 1}室`,
              filed3: 63,
              filed4: `B${cengObj.label}`,
              filed6: '室',
              filed7: houzhui,
              label: cengObj.label * 100 + h * 1,
              id: null,
              sjdzysid: null,
            }
            cengObj.children[h - 1] = huObj
          }
          dan.children.push(cengObj)
        }
      })
    },
    // 地下户室的新增
    setDxHuList (val, oldVal) {
      let that = this
      that.dxList.forEach(dan => {
        dan.children.forEach(ceng => {
          let cengDizhi = ceng.filed2
          let huNum = ceng.children[ceng.children.length - 1].label * 1
          let sjdzysid = ceng.id
          let huObj = {}
          for (let h = 1; h <= val - oldVal; h++) {
            let huhao = (huNum + h * 1).toString()
            let houzhui = huhao.substring(ceng.label.toString().length, huhao.length)
            huObj = {
              filed1: `B${huNum + h * 1}室`,
              filed2: `${cengDizhi}B${huNum + h * 1}室`,
              filed3: 63,
              filed4: `B${ceng.label}`,
              filed6: '室',
              filed7: houzhui,
              label: huNum + h * 1,
              id: null,
              sjdzysid: sjdzysid,
            }
            ceng.children.push(huObj)
          }
        })
      })
    },




    // // 户室后缀字典
    getHuZiDian (val) {
      this.dzysBmhzOptions = this.dict.type.df_dzhshz
      this.huHaoHZName = val
      this.dzysBmhzOptions.forEach(item => {
        if (item.label == val) {
          this.huHaoHZ = item.value
        }
      })
    },
    //获取后台返回的全部的数据
    getZongList () {
      getZhzzJcywBzdzYthcjTreeById(this.floorObj.id).then(res => {
        if (res.code == 200) {
          if (!res.data.length) {
            this.xinZengShow = true
            this.xinNum = 0
            return
          } else {
            this.xinNum = 1
            res.data.forEach(dan => {
              if (!dan.filed1.length) {
                // 此为商铺数据
                // dan.children.reverse()

                this.spList.push(dan)

              } else if (dan.filed1.includes('B')) {
                // 此为地下室数据
                this.dxList.push(dan)

              } else {
                // 此为地上数据
                // dan.children.reverse()
                this.dsList.push(dan)
              }
            })
            this.xinZeng()
            this.getWidth()
          }

        }
      })
    },
    //新增地上、商铺、地下的关联参数赋值方法
    setNewObj () {
      let dxNum = this.getMaxNum(this.dxList)
      let dsNum = this.getMaxNum(this.dsList)
      let spNum = this.getMaxNum(this.spList)
      this.newObj = {
        dsdys: this.dsList.length,
        dslcs: dsNum.cengMaxNum,
        dsdchs: dsNum.huMaxNum,
        spdchs: spNum.huMaxNum,
        splcs: spNum.cengMaxNum,
        dxdys: this.dxList.length,
        dxlcs: dxNum.cengMaxNum,
        dxdchs: dxNum.huMaxNum
      }
    },
    // 最小数
    getMaxNum (data) {
      let maxNum = {
        cengMaxNum: 0,
        huMaxNum: 0
      }
      data.forEach(dan => {
        let cengNum = []
        cengNum.push(dan.children.length)
        maxNum.cengMaxNum = Math.min.apply(null, cengNum)
        dan.children.forEach(ceng => {
          let huNum = []
          huNum.push(ceng.children.length)
          maxNum.huMaxNum = Math.min.apply(null, huNum)
        })
      })
      return maxNum
    }
  },
  mounted () {
    // this.getHuZiDian()
    this.getZongList()

  }
}
</script>

<style lang="scss" scoped>
.dsDanBox {
  box-sizing: border-box;
  padding-right: 0px;
}
.dxDanBox {
  box-sizing: border-box;
  padding-right: 0px;
}
.spDanBox {
  box-sizing: border-box;
  padding-right: 0px;
}
.editFloor {
  width: 100%;
  height: 94%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
  .editFloor_name {
    background: #fafbfc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
  // 此处为新增模块
  .editFloor_xinzeng {
    .xinzeng_box {
      box-sizing: border-box;
      background: #fafbfc;
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 10px;
      .tongjiegou {
        display: flex;
        align-items: center;
        .tongjiegou_div {
          width: 80px;
        }
      }
    }
  }

  // 此处为展示模块
  .editFloor_zhanshi {
    flex: 1;
    width: 100%;
    overflow: auto;
    display: flex;
    // flex-direction: column;
    // 滚动条整体部分
    &::-webkit-scrollbar {
      width: 6px; //对垂直方向滚动条
      height: 10px; //对水平方向滚动条
    }

    //滚动的滑块
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: black; //滚动条的颜色;
    }

    //内层滚动槽
    &::-webkit-scrollbar-track-piece {
      background-color: #ccc;
    }
    .gy_cheng {
      box-sizing: border-box;
      padding-right: 10px;
    }

    .gy_box {
      display: flex;
      // align-content: flex-end;
      align-items: flex-end;
    }

    .gy_DXbox {
      display: flex;
      align-items: flex-start;
    }

    .gy_margin {
      margin-right: 20px;
    }

    .gy_margin:last-child {
      margin: 0;
    }

    .gy_jsjl {
      box-sizing: border-box;
      padding-top: 20px;
    }

    .tu_top {
      width: 21px;
      height: 8px;
      position: relative;
      z-index: 10;
      border-radius: 0 0 3px 3px;
    }

    .tu_bom {
      width: 21px;
      height: 10px;
      position: relative;
      z-index: 5;
      top: -5px;
      border-radius: 0px 0px 10px 10px;
    }

    .gy_tuTop_first {
      background: #4ca9ff;
    }

    .gy_tuBom_first {
      background: #1890ff;
    }

    .gy_tuTop_two {
      background: #a2d2ff;
    }

    .gy_tuBom_two {
      background: #5ea2e1;
    }

    .danyuan_title {
      width: 40%;
      height: 26px;
      box-sizing: border-box;
      // padding: 0 20px;
      // display: block;
      margin: 0 auto;
      text-align: center;
      background: #e0e7ef;
      font-size: 16px;
      line-height: 26px;

      font-weight: 500;
      color: #388cff;
    }

    .danyuan_line {
      width: 30%;
      height: 10px;
      margin: 0 auto;
      border-left: 15px solid #e0e7ef;
      border-right: 15px solid #e0e7ef;
    }

    .table_box {
      border-left: 2px solid #1890ff;
      border-right: 2px solid #1890ff;
      border-bottom: 2px solid #1890ff;
      border-top: 15px solid #1890ff;
    }

    .shangpu_box {
      box-sizing: border-box;
      padding: 10px 0;
      border: 2px solid #1890ff;
    }
  }

  //单元编辑、楼层编辑、户室编辑模块
  .handle {
    width: 100%;
    margin: 0;
    box-sizing: border-box;
    padding-bottom: 50px;

    .handle_box {
      // display: flex;
      // align-items: flex-start;

      .handle_right {
        // .xiaceng {
        //   margin-top: 10px;
        // }
        .main {
          box-sizing: border-box;
          background: #fafbfc;
          border-radius: 0 5px 5px 0;
          padding: 10px;
          margin-bottom: 10px;
        }
        .main_box {
          display: flex;
          align-items: center;
          font-size: 14px;

          .left {
            width: 70px;
            font-size: 14px;
          }

          .louCengNameStyle {
            width: 128px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border: 1px solid #e0e4ea;
          }

          .right {
            display: flex;
            align-items: center;
            width: 130px;
            justify-content: space-between;

            .huHaoInp {
              width: 55px;
              height: 30px;
              text-align: center;
              line-height: 30px;
              border: 1px solid #e0e4ea;
            }

            .huHaoInpL {
              width: 70px;
              height: 28px;
              text-align: center;
              line-height: 28px;
              border-radius: 5px;
              border: 1px solid #e0e4ea;
            }
          }
        }
      }

      .handle_left {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border-radius: 5px 0 0 5px;
        padding: 10px 0 17px 10px;
        background: #fafbfc;
      }
    }
  }
}
</style>
