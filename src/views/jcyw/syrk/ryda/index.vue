<template>
  <div class="fwda app-container">
    <el-row type="flex">
      <el-col>
        <span></span>
        <p>个人档案</p>
        <div class="fz">
          <carousel
            ref="carousel"
            :fwzpUrl="fwzpUrl"
            style="width: 152px; height: 196px"
          ></carousel>
          <!-- <img :src="zpUrl"
               alt="" /> -->
          <div>
            <span>{{ baseInfo.xm }}</span
            ><span>{{ sexLable[0] ? sexLable[0].label : '未知' }}</span>
          </div>
        </div>
        <ul>
          <li
            @click="toAnchor(index)"
            :class="index == activeIndex ? 'activeStyle' : ''"
            v-for="(item, index) in sideMenus"
            :key="index"
          >
            <!-- <a href="javascript:;"> -->
            <span v-show="index == activeIndex"></span>
            {{ item.dictLabel }}
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
                <td>身份证号</td>
                <td>{{ baseInfo.sfzhm }}</td>
                <td>出生日期</td>
                <td>{{ baseInfo.csrq }}</td>
                <td>民族</td>
                <td>{{ mzLabel[0] ? mzLabel[0].label : '无' }}</td>
                <td>联系方式</td>
                <td>{{ baseInfo.lxfs }}</td>
              </tr>
              <tr>
                <td>宗教信仰</td>
                <td>{{ zjxyLable[0] ? zjxyLable[0].label : '无' }}</td>
                <td>文化程度</td>
                <td>{{ xldmLable[0] ? xldmLable[0].label : '无' }}</td>
                <td>政治面貌</td>
                <td>{{ zzmmLable[0] ? zzmmLable[0].label : '无' }}</td>
                <td>婚姻状况</td>
                <td>{{ hyzkLable[0] ? hyzkLable[0].label : '无' }}</td>
              </tr>
              <tr>
                <td>籍贯</td>
                <td>{{ jgLabel }}</td>
                <td>户籍地址</td>
                <td @click="toBuildingArchives(info.hjxz)">
                  <el-link type="primary">{{ info.hjxzAddr }}</el-link>
                </td>
                <td>职业信息</td>
                <td>{{ baseInfo.zyxx }}</td>
                <td>职业类别</td>
                <td>{{ zylbLable[0] ? zylbLable[0].label : '无' }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="content" id="element1">
          <div class="title">
            <span></span>
            <p>{{ type == 1 ? '户籍信息' : '流动信息' }}</p>
          </div>
          <div>
            <table>
              <tr>
                <td>户主姓名</td>
                <td>{{ info.xm }}</td>
                <td>民族</td>
                <td>{{ mzLabel[0] ? mzLabel[0].label : '未知' }}</td>
                <td>出生日期</td>
                <td>{{ info.csrq }}</td>
                <td>政治面貌</td>
                <td>{{ zzmmLable[0] ? zzmmLable[0].label : '未知' }}</td>
              </tr>
              <tr>
                <td>现居地址</td>
                <td @click="toBuildingArchives(info.xzdxz)">
                  <el-link type="primary">{{ info.xzdxzAddr }}</el-link>
                </td>
                <td>是否人户一致</td>
                <td>{{ rhyzbzLable[0] ? rhyzbzLable[0].label : '未知' }}</td>
                <td>与户主关系</td>
                <td>{{ yhzgxLable[0] ? yhzgxLable[0].label : '未知' }}</td>
                <td>所属网格</td>
                <td style="width: 200px">{{ sswgLable }}</td>
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
              <p>姓名:{{ item.NAME }}</p>
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
              <img :src="item.zp" />
              <p>姓名:{{ item.name }}</p>
              <p>身份证号码:{{ item.idCard }}</p>
            </div>
          </div>
        </div>
        <div class="content" id="element4">
          <div class="title">
            <span></span>
            <p>人员标签</p>
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
        <div class="content" id="element6" v-if="xmsfFormsfz">
          <div class="title">
            <span></span>
            <p>刑满释放人员</p>
          </div>
          <div>
            <table>
              <tr>
                <td>是否累犯</td>
                <td>{{ sflfLable[0] ? sflfLable[0].label : '未知' }}</td>
                <td>原罪名</td>
                <td>{{ yzmLable[0] ? yzmLable[0].label : '未知' }}</td>
                <td>原判日期</td>
                <td>{{ xmsfForm.ypxq }}</td>
                <td>服刑场所</td>
                <td>{{ xmsfForm.fxcs }}</td>
              </tr>
              <tr>
                <td>释放日期</td>
                <td>{{ xmsfForm.sfrq }}</td>
                <td>危险性评估类型</td>
                <td>{{ wxxpglxLable[0] ? wxxpglxLable[0].label : '未知' }}</td>
                <td>衔接日期</td>
                <td>{{ xmsfForm.xjrq }}</td>
                <td>衔接情况</td>
                <td>{{ xmsfForm.xjqk }}</td>
              </tr>
              <tr>
                <td>安置日期</td>
                <td>{{ xmsfForm.azrq }}</td>
                <td>安置情况</td>
                <td>{{ azqkLable[0] ? azqkLable[0].label : '未知' }}</td>
                <td>未安置原因</td>
                <td>{{ xmsfForm.wazyy }}</td>
                <td>帮教情况</td>
                <td>{{ xmsfForm.bjqk }}</td>
              </tr>
              <tr>
                <td>是否重新犯罪</td>
                <td>{{ sfcxfzLable[0] ? sfcxfzLable[0].label : '未知' }}</td>
                <td>重新犯罪罪名</td>
                <td>{{ xmsfForm.cxfzzm }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="content" id="element7" v-if="sqjzFormsfz">
          <div class="title">
            <span></span>
            <p>社区矫正人员</p>
          </div>
          <div>
            <table>
              <tr>
                <td>社区矫正人员编号</td>
                <td>{{ sqjzForm.sqjzrybh }}</td>
                <td>原羁押场所</td>
                <td>{{ sqjzForm.yjycs }}</td>
                <td>矫正类别</td>
                <td>{{ jzlbLable[0] ? jzlbLable[0].label : '未知' }}</td>
                <td>案件类别</td>
                <td>{{ sqajlbLable[0] ? sqajlbLable[0].label : '未知' }}</td>
              </tr>
              <tr>
                <td>具体罪名</td>
                <td>{{ sqjzForm.jtzm }}</td>
                <td>原判刑期</td>
                <td>{{ sqjzForm.ypxq }}</td>
                <td>原判刑开始日期</td>
                <td>{{ sqjzForm.ypxksrq }}</td>
                <td>原判刑结束日期</td>
                <td>{{ sqjzForm.ypxjsrq }}</td>
              </tr>
              <tr>
                <td>矫正开始日期</td>
                <td>{{ sqjzForm.jzksrq }}</td>
                <td>矫正结束日期</td>
                <td>{{ sqjzForm.jzjsrq }}</td>
                <td>接收方式</td>
                <td>{{ jsfsLable[0] ? jsfsLable[0].label : '未知' }}</td>
                <td>“四史”情况</td>
                <td>{{ sishiqkLable[0] ? sishiqkLable[0].label : '未知' }}</td>
              </tr>
              <tr>
                <td>是否累惯犯</td>
                <td>{{ sflgfLable[0] ? sflgfLable[0].label : '未知' }}</td>
                <td>三涉情况</td>
                <td>
                  {{ sanshiqkLable[0] ? sanshiqkLable[0].label : '未知' }}
                </td>
                <td>是否建立矫正小组</td>
                <td>
                  {{ sfjljzxzLable[0] ? sfjljzxzLable[0].label : '未知' }}
                </td>
                <td>矫正小组人员组成情况</td>
                <td>
                  {{ jzxzryzcqkLable[0] ? jzxzryzcqkLable[0].label : '未知' }}
                </td>
              </tr>
              <tr>
                <td>矫正接触(终止)类型</td>
                <td>{{ jzjclxLable[0] ? jzjclxLable[0].label : '未知' }}</td>
                <td>是否有脱管</td>
                <td>{{ sfytgLable[0] ? sfytgLable[0].label : '未知' }}</td>
                <td>脱管原因</td>
                <td>{{ sqjzForm.tgyy }}</td>
                <td>检查监督脱管情况</td>
                <td>{{ sqjzForm.jcjdtgqk }}</td>
              </tr>
              <tr>
                <td>脱管纠正情况</td>
                <td>{{ sqjzForm.tgjzqk }}</td>
                <td>是否有漏管</td>
                <td>{{ sfylgLable[0] ? sfylgLable[0].label : '未知' }}</td>
                <td>漏管原因</td>
                <td>{{ sqjzForm.lgyy }}</td>
                <td>检查监督漏管情况</td>
                <td>{{ sqjzForm.jcjdlgqk }}</td>
              </tr>
              <tr>
                <td>漏管纠正情况</td>
                <td>{{ sqjzForm.lgjzqk }}</td>
                <td>奖惩情况</td>
                <td>{{ sqjzForm.jcqk }}</td>
                <td>刑罚变更执行情况</td>
                <td>{{ sqjzForm.xfbgzxqk }}</td>
                <td>是否重新犯罪</td>
                <td>
                  {{ sqjzsfcxfzLable[0] ? sqjzsfcxfzLable[0].label : '未知' }}
                </td>
              </tr>
              <tr>
                <td>重新犯罪名称</td>
                <td>{{ sqjzForm.cxfzmc }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="content" id="element8" v-if="jszaFormsfz">
          <div class="title">
            <span></span>
            <p>精神障碍患者</p>
          </div>
          <div>
            <table>
              <tr>
                <td>家庭经济情况</td>
                <td>{{ jtjjqkLable[0] ? jtjjqkLable[0].label : '未知' }}</td>
                <td>是否纳入低保</td>
                <td>{{ sfnrdbLable[0] ? sfnrdbLable[0].label : '未知' }}</td>
                <td>监护人公民身份号码</td>
                <td>{{ jszaForm.jhrgmsfzhm }}</td>
                <td>监护人姓名</td>
                <td>{{ jszaForm.jhrxm }}</td>
              </tr>
              <tr>
                <td>监护人联系方式</td>
                <td>{{ jszaForm.jhrlxfs }}</td>
                <td>初次发病日期</td>
                <td>{{ jszaForm.ccfbrq }}</td>
                <td>目前诊断类型</td>
                <td>{{ mqzdlxLable[0] ? mqzdlxLable[0].label : '未知' }}</td>
                <td>有无肇事肇祸史</td>
                <td>
                  {{ ywzszhrqLable[0] ? ywzszhrqLable[0].label : '未知' }}
                </td>
              </tr>
              <tr>
                <td>肇事肇祸次数</td>
                <td>{{ jszaForm.zszhcs }}</td>
                <td>上次肇事肇祸日期</td>
                <td>{{ jszaForm.sczszhrq }}</td>
                <td>目前危险性评估等级</td>
                <td>
                  {{ mqwxxpgdjLable[0] ? mqwxxpgdjLable[0].label : '未知' }}
                </td>
                <td>治疗情况</td>
                <td>{{ zlqkLable[0] ? zlqkLable[0].label : '未知' }}</td>
              </tr>
              <tr>
                <td>治疗医院名称</td>
                <td>{{ jszaForm.zlyymc }}</td>
                <td>实施住院医疗原因</td>
                <td>
                  {{ sszyzlyyLable[0] ? sszyzlyyLable[0].label : '未知' }}
                </td>
                <td>接收康复训练机构名称</td>
                <td>{{ jszaForm.jskfxljgmc }}</td>
                <td>参与管理人员</td>
                <td>{{ jszaForm.cyglry }}</td>
              </tr>
              <tr>
                <td>帮扶情况</td>
                <td>{{ bfqkLable[0] ? bfqkLable[0].label : '未知' }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="content" id="element9" v-if="xdFormsfz">
          <div class="title">
            <span></span>
            <p>吸毒人员</p>
          </div>
          <div>
            <table>
              <tr>
                <td>初次发现日期</td>
                <td>{{ xdForm.ccfxrq }}</td>
                <td>管控情况</td>
                <td>{{ gkqkLable[0] ? gkqkLable[0].label : '未知' }}</td>
                <td>管控人姓名</td>
                <td>{{ xdForm.gkrxm }}</td>
                <td>管控人联系方式</td>
                <td>{{ xdForm.gkrlxfs }}</td>
              </tr>
              <tr>
                <td>帮扶情况</td>
                <td>{{ xdbfqkLable[0] ? xdbfqkLable[0].label : '未知' }}</td>
                <td>帮扶人姓名</td>
                <td>{{ xdForm.bfrxm }}</td>
                <td>帮扶人联系方式</td>
                <td>{{ xdForm.bfrlxfs }}</td>
                <td>有无犯罪史</td>
                <td>{{ ywfzsLable[0] ? ywfzsLable[0].label : '未知' }}</td>
              </tr>
              <tr>
                <td>犯罪情况</td>
                <td>{{ xdForm.fzqk }}</td>
                <td>吸毒原因</td>
                <td>{{ xdyyLable[0] ? xdyyLable[0].label : '未知' }}</td>
                <td>吸毒后果</td>
                <td>{{ xdForm.xdhg }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="content" id="element10" v-if="azbFormsfz">
          <div class="title">
            <span></span>
            <p>艾滋病危险人员</p>
          </div>
          <div>
            <table>
              <tr>
                <td>感染途径</td>
                <td>{{ grtjLable[0] ? grtjLable[0].label : '未知' }}</td>
                <td>是否有违法犯罪史</td>
                <td>
                  {{ sfywffzsLable[0] ? sfywffzsLable[0].label : '未知' }}
                </td>
                <td>违法犯罪情况</td>
                <td>{{ azbForm.wffzqk }}</td>
                <td>案件类别</td>
                <td>{{ ajlbLable[0] ? ajlbLable[0].label : '未知' }}</td>
              </tr>
              <tr>
                <td>关注类型</td>
                <td>{{ gzlxLable[0] ? gzlxLable[0].label : '未知' }}</td>
                <td>帮扶情况</td>
                <td>{{ azbfqkLable[0] ? azbfqkLable[0].label : '未知' }}</td>
                <td>帮扶人姓名</td>
                <td>{{ azbForm.bfrxm }}</td>
                <td>帮扶人联系方式</td>
                <td>{{ azbForm.bfrlxfs }}</td>
              </tr>
              <tr>
                <td>收治情况</td>
                <td>{{ szqkLable[0] ? szqkLable[0].label : '未知' }}</td>
                <td>收治机构名称</td>
                <td>{{ azbForm.szjgmc }}</td>
              </tr>
            </table>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-show="showPop" id="popup" class="ol-popup">
      <el-row>
        <el-col style="overflow-y: hidden" :span="18">{{
          mapInfo.dzysqc
        }}</el-col>
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
    <el-dialog title="添加人员标签" :visible.sync="showHouseTag" width="50%">
      <el-row>
        <h4 class="font-16">人员标签</h4>
        <el-col
          class="padding-10"
          :span="6"
          v-for="item in rybqList"
          :key="item.dictCode"
        >
          <i
            @click="addUserMenuBtn(item)"
            :class="
              item.added ? 'el-icon-check color-blue' : 'el-icon-plus  bgc-c '
            "
            class="margin-right-10"
          ></i>
          <span class="font-14">{{ item.dictLabel }}</span>
        </el-col>
      </el-row>
      <el-row>
        <h4 class="font-16">重点青少年标签</h4>
        <el-col
          class="padding-10"
          :span="6"
          v-for="item in zdqsnbqList"
          :key="item.dictCode"
        >
          <i
            @click="addUserMenuBtn(item)"
            :class="
              item.added ? 'el-icon-check color-blue' : 'el-icon-plus  bgc-c '
            "
            class="margin-right-10"
          ></i>
          <span class="font-14">{{ item.dictLabel }}</span>
        </el-col>
      </el-row>
      <el-row>
        <h4 class="font-16">关爱人员标签</h4>
        <el-col
          class="padding-10"
          :span="6"
          v-for="item in garybqList"
          :key="item.dictCode"
        >
          <i
            @click="addUserMenuBtn(item)"
            :class="
              item.added ? 'el-icon-check color-blue' : 'el-icon-plus  bgc-c '
            "
            class="margin-right-10"
          ></i>
          <span class="font-14">{{ item.dictLabel }}</span>
        </el-col>
      </el-row>
      <el-row>
        <h4 class="font-16">特殊人群标签</h4>
        <el-col
          class="padding-10"
          :span="6"
          v-for="item in tsrybqList"
          :key="item.dictCode"
        >
          <i
            @click="addUserMenuBtn(item)"
            :class="
              item.added ? 'el-icon-check color-blue' : 'el-icon-plus  bgc-c '
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
import carousel from '@/views/jcyw/syfw/fwda/components/Carousel'
import mapconfig from '@/views/wggl/mapconfig'
import { getDicts,getRybq,getzdqsnbq,getGarybq,gettsrybq,getWangGe } from '@/api/system/dict/data'
import {
  addPersonTag,
  deletePersonTag,
  populationFile,
  getHJInfo,
  getMapInfo,
  //getWangGe,
  getLDInfo,
  //getRybq,
  //getzdqsnbq,
  //getGarybq,
  //gettsrybq,
  getPersonBase,
  getxzqh
} from '@/api/jcyw/syrk/ryda'
import { getBuildId } from '@/api/jcyw/syfw/fwda'
import { getGaryInfo } from '@/api/jcyw/syrk/tsrq'
import { removeWatermark, setWaterMark } from '@/utils/watermark'
import { mapState } from 'vuex'
export default {
  name: 'Ryda',
  dicts: [
    'gb_mz',
    'gb_zzmm',
    'sys_user_sex',
    'gb_hyzk',
    'gb_zylb',
    'gb_xldm',
    'ga_zjxy',
    'gb_yhzgx',
    'gb_rhyzbz',
    'sys_yes_no',
    'gb_zmfldm',
    'gb_wxxpglx',
    'gb_azjk',
    'gb_jzlb',
    'gb_jsfs',
    'gb_sisqk',
    'gb_sasqk',
    'gb_jzxzzc',
    'gb_jzjczz',
    'gb_jtjjzk',
    'gb_mqzdlx',
    'gb_mqwxxpgdj',
    'gb_zlqk',
    'gb_sszyzlyy',
    'gb_bfqk',
    'zdy_gkxz',
    'ga_xdyy',
    'ga_ajlb',
    'gb_grtj',
    'gb_gzlx',
    'gb_szqk'
  ],
  components: {
    switchLayers,
    carousel
  },
  data() {
    return {
      xmsfForm: {
        id: '',
        sfzhm: '',
        sflf: '',
        yzm: '',
        ypxq: '',
        fxcs: '',
        sfrq: '',
        wxxpglx: '',
        xjrq: '',
        xjqk: '',
        azrq: '',
        azqk: '',
        wazyy: '',
        bjqk: '',
        sfcxfz: '',
        cxfzzm: ''
      },
      sqjzForm: {
        id: '',
        sfzhm: '',
        sqjzrybh: '',
        yjycs: '',
        jzlb: '',
        ajlb: '',
        jtzm: '',
        ypxq: '',
        ypxksrq: '',
        ypxjsrq: '',
        jzksrq: '',
        jzjsrq: '',
        jsfs: '',
        sishiqk: '',
        sflgf: '',
        sanshiqk: '',
        sfjljzxz: '',
        jzxzryzcqk: '',
        jzjclx: '',
        sfytg: '',
        tgyy: '',
        jcjdtgqk: '',
        tgjzqk: '',
        sfylg: '',
        lgyy: '',
        jcjdlgqk: '',
        lgjzqk: '',
        jcqk: '',
        xfbgzxqk: '',
        sfcxfz: '',
        cxfzmc: ''
      },
      jszaForm: {
        id: '',
        sfzhm: '',
        jtjjqk: '',
        sfnrdb: '',
        jhrgmsfzhm: '',
        jhrxm: '',
        jhrlxfs: '',
        ccfbrq: '',
        mqzdlx: '',
        ywzszhrq: '',
        zszhcs: '',
        sczszhrq: '',
        mqwxxpgdj: '',
        zlqk: '',
        zlyymc: '',
        sszyzlyy: '',
        jskfxljgmc: '',
        cyglry: '',
        bfqk: ''
      },
      xdForm: {
        id: '',
        sfzhm: '',
        ccfxrq: '',
        gkqk: '',
        gkrxm: '',
        gkrlxfs: '',
        bfqk: '',
        bfrxm: '',
        bfrlxfs: '',
        ywfzs: '',
        fzqk: '',
        xdyy: '',
        xdhg: ''
      },
      azbForm: {
        id: '',
        sfzhm: '',
        grtj: '',
        sfywffzs: '',
        wffzqk: '',
        ajlb: '',
        gzlx: '',
        bfqk: '',
        bfrxm: '',
        bfrlxfs: '',
        szqk: '',
        szjgmc: ''
      },
      jgLabel: '未知',
      mapDataSource: '',
      xmsfFormsfz: '',
      sqjzFormsfz: '',
      jszaFormsfz: '',
      xdFormsfz: '',
      azbFormsfz: '',
      rybqList: [],
      zdqsnbqList: [],
      garybqList: [],
      tsrybqList: [],
      type: this.$route.params.type,
      sswgLable: '无',
      baseInfo: '',
      showPop: false,
      mapInfo: '',
      loading: true,
      showHouseTag: false,
      jcywSyrkTjzryVoList: [],
      zhzzJcywSyrkHjrkVoList: [],
      zhzzJcywBqglList: [],
      tagList: [],
      activeIndex: 0,
      fwzpUrl: [],
      // zpUrl: require('@/assets/images/wutouxiang.svg'),
      info: '',
      sideMenus: [
        { dictLabel: '基本信息', href: '#element0' },
        { dictLabel: '户籍信息', href: '#element1' },
        { dictLabel: '同住人员', href: '#element2' },
        { dictLabel: '同户籍人员', href: '#element3' },
        { dictLabel: '人员标签', href: '#element4' },
        { dictLabel: '地图位置', href: '#element5' }
      ],
      sideOtherMenus: [],
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
      // 楼栋id
      ldId: '',
      // 楼栋名称
      ldMc: '',
      bqqxzf: JSON.parse(localStorage.getItem('rybqqxzf'))
    }
  },
  computed: {
    ...mapState(['user']),
    sqajlbLable: function () {
      return this.dict?.type?.ga_ajlb.filter((item) => {
        return item.value == this.sqjzForm.ajlb
      })
    },
    szqkLable: function () {
      return this.dict?.type?.gb_szqk.filter((item) => {
        return item.value == this.azbForm.szqk
      })
    },
    azbfqkLable: function () {
      return this.dict?.type?.gb_bfqk.filter((item) => {
        return item.value == this.azbForm.bfqk
      })
    },
    gzlxLable: function () {
      return this.dict?.type?.gb_gzlx.filter((item) => {
        return item.value == this.azbForm.gzlx
      })
    },
    ajlbLable: function () {
      return this.dict?.type?.ga_ajlb.filter((item) => {
        return item.value == this.azbForm.ajlb
      })
    },
    sfywffzsLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.azbForm.sfywffzs
      })
    },
    grtjLable: function () {
      return this.dict?.type?.gb_grtj.filter((item) => {
        return item.value == this.azbForm.grtj
      })
    },
    xdyyLable: function () {
      return this.dict?.type?.ga_xdyy.filter((item) => {
        return item.value == this.xdForm.xdyy
      })
    },
    ywfzsLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.xdForm.ywfzs
      })
    },
    xdbfqkLable: function () {
      return this.dict?.type?.gb_bfqk.filter((item) => {
        return item.value == this.xdForm.bfqk
      })
    },
    gkqkLable: function () {
      return this.dict?.type?.zdy_gkxz.filter((item) => {
        return item.value == this.xdForm.gkqk
      })
    },
    bfqkLable: function () {
      return this.dict?.type?.gb_bfqk.filter((item) => {
        return item.value == this.jszaForm.bfqk
      })
    },
    sszyzlyyLable: function () {
      return this.dict?.type?.gb_sszyzlyy.filter((item) => {
        return item.value == this.jszaForm.sszyzlyy
      })
    },
    zlqkLable: function () {
      return this.dict?.type?.gb_zlqk.filter((item) => {
        return item.value == this.jszaForm.zlqk
      })
    },
    mqwxxpgdjLable: function () {
      return this.dict?.type?.gb_mqwxxpgdj.filter((item) => {
        return item.value == this.jszaForm.mqwxxpgdj
      })
    },
    ywzszhrqLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.jszaForm.ywzszhrq
      })
    },
    mqzdlxLable: function () {
      return this.dict?.type?.gb_mqzdlx.filter((item) => {
        return item.value == this.jszaForm.mqzdlx
      })
    },
    sfnrdbLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.jszaForm.sfnrdb
      })
    },
    jtjjqkLable: function () {
      return this.dict?.type?.gb_jtjjzk.filter((item) => {
        return item.value == this.jszaForm.jtjjqk
      })
    },
    sqjzsfcxfzLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.sqjzForm.sfcxfz
      })
    },
    sfylgLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.sqjzForm.sfylg
      })
    },
    sfytgLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.sqjzForm.sfytg
      })
    },
    jzjclxLable: function () {
      return this.dict?.type?.gb_jzjczz.filter((item) => {
        return item.value == this.sqjzForm.jzjclx
      })
    },
    jzxzryzcqkLable: function () {
      return this.dict?.type?.gb_jzxzzc.filter((item) => {
        return item.value == this.sqjzForm.jzxzryzcqk
      })
    },
    sfjljzxzLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.sqjzForm.sfjljzxz
      })
    },
    sanshiqkLable: function () {
      return this.dict?.type?.gb_sasqk.filter((item) => {
        return item.value == this.sqjzForm.sanshiqk
      })
    },
    sflgfLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.sqjzForm.sflgf
      })
    },
    sishiqkLable: function () {
      return this.dict?.type?.gb_sisqk.filter((item) => {
        return item.value == this.sqjzForm.sishiqk
      })
    },
    jsfsLable: function () {
      return this.dict?.type?.gb_jsfs.filter((item) => {
        return item.value == this.sqjzForm.jsfs
      })
    },
    jzlbLable: function () {
      return this.dict?.type?.gb_jzlb.filter((item) => {
        return item.value == this.sqjzForm.jzlb
      })
    },
    sflfLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.xmsfForm.sflf
      })
    },
    yzmLable: function () {
      return this.dict?.type?.gb_zmfldm.filter((item) => {
        return item.value == this.xmsfForm.yzm
      })
    },
    azqkLable: function () {
      return this.dict?.type?.gb_azjk.filter((item) => {
        return item.value == this.xmsfForm.azqk
      })
    },
    wxxpglxLable: function () {
      return this.dict?.type?.gb_wxxpglx.filter((item) => {
        return item.value == this.xmsfForm.wxxpglx
      })
    },
    sfcxfzLable: function () {
      return this.dict?.type?.sys_yes_no.filter((item) => {
        return item.value == this.xmsfForm.sfcxfz
      })
    },
    sexLable: function () {
      return this.dict?.type?.sys_user_sex.filter((item) => {
        return item.value == this.baseInfo.xb
      })
    },
    hyzkLable: function () {
      return this.dict?.type?.gb_hyzk.filter((item) => {
        return item.value == this.baseInfo.hyzk
      })
    },
    mzLabel: function () {
      return this.dict?.type?.gb_mz.filter((item) => {
        return item.value == this.baseInfo.mz
      })
    },
    xldmLable: function () {
      return this.dict?.type?.gb_xldm.filter((item) => {
        return item.value == this.baseInfo.xl
      })
    },
    zzmmLable: function () {
      return this.dict?.type?.gb_zzmm.filter((item) => {
        return item.value == this.baseInfo.zzmm
      })
    },
    zjxyLable: function () {
      return this.dict?.type?.ga_zjxy.filter((item) => {
        return item.value == this.baseInfo.zjxy
      })
    },
    zylbLable: function () {
      return this.dict?.type?.gb_zylb.filter((item) => {
        return item.value == this.baseInfo.zylb
      })
    },
    yhzgxLable: function () {
      return this.dict?.type?.gb_yhzgx.filter((item) => {
        return item.value == this.info.yhzgx
      })
    },
    rhyzbzLable: function () {
      return this.dict?.type?.gb_rhyzbz.filter((item) => {
        return item.value == this.info.rhyzbz
      })
    }
  },
  methods: {
    // getBuildingId(id) {
    //   getBuildId({ id: id }).then((res) => {
    //     if (res.data) {
    //       this.ldId = res.data[0].id
    //       this.ldMc = res.data[0].dzysqc
    //     }
    //   })
    // },
    goBack() {
      // this.$router.push({
      //   name: 'Hjrk'
      // })
      this.$router.back()
    },
    toBuildingArchives(id) {
      getBuildId({ id: id }).then((res) => {
        if (res.data) {
          this.ldId = res.data[0].id
          this.ldMc = res.data[0].dzysqc
          if (this.ldId) {
            this.$router.push({
              name: 'Sygl',
              params: {
                id: this.ldId,
                title: this.ldMc
              }
            })
          }
        }
      })
    },
    //获取所属网格
    getsswg(deptId) {
      if (deptId == null) {
        this.sswgLable = '未知'
      } else {
        getWangGe(deptId).then((res) => {
          if (res.code === 200) {
            this.sswgLable = res.data.deptName
          }
        })
      }
    },
    //获取基本信息
    getBaseMsg() {
      getPersonBase(this.info.sfzhm).then((res) => {
        if (res.code == 200 && res.rows) {
          this.baseInfo = res.rows[0]
          if (this.baseInfo.zp) {
            let urllist = this.baseInfo.zp.split(',')
            for (let j = 0; j < urllist.length; j++) {
              this.fwzpUrl.push(process.env.VUE_APP_BASE_FILE_VIEW + urllist[j])
            }
          } else {
            this.fwzpUrl.push(require('@/assets/images/wutouxiang.svg'))
          }
          // if (
          //   this.baseInfo.zp
          // ) {
          //   this.zpUrl = process.env.VUE_APP_BASE_FILE_VIEW + this.baseInfo.zp
          // } else {
          //   this.zpUrl = require('@/assets/images/wutouxiang.svg')
          // }
          this.getsswg(this.baseInfo.deptId)
          getxzqh().then((res) => {
            if (res.data) {
              let jgLabel = res.data.filter((item) => {
                return item.countyCode == this.baseInfo.jg
              })
              if (jgLabel.length != 0) {
                this.jgLabel =
                  jgLabel[0].provinceName +
                  '/' +
                  jgLabel[0].cityName +
                  '/' +
                  jgLabel[0].countyName
              }
            }
          })
        }
      })
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
    // initMap() {
    //   this.pointSource = new VectorSource({
    //     wrapX: false,
    //     features: []
    //   })
    //   this.newSpurce = new VectorSource({
    //     wrapX: false,
    //     features: []
    //   })
    //   this.pointLayer = new VectorLayer({
    //     source: this.pointSource
    //   })
    //   this.newLayer = new VectorLayer({
    //     source: this.newSpurce,
    //     style: [
    //       new Style({
    //         stroke: new Stroke({
    //           color: 'rgba(255,0,0,0.6)',
    //           width: 2
    //         }),
    //         fill: new Fill({
    //           color: 'rgba(255,0,0,0.4)'
    //         })
    //       })
    //     ]
    //   })
    //   this.mapLayerArr = []
    //   for (let i = 0; i < this.mapOptions.length; i++) {
    //     if (this.mapOptions[i].dictValue == 6) {
    //       this.mapLayerArr.push(
    //         new TileLayer({
    //           source: new XYZ({
    //             url: this.mapOptions[i].remark,
    //             wrapX: true
    //           }),
    //           visible: false
    //         })
    //       )
    //     } else {
    //       this.mapLayerArr.push(
    //         new TileLayer({
    //           source: new TileSuperMapRest({
    //             url: this.mapOptions[i].remark,
    //             wrapX: true
    //           }),
    //           visible: false
    //         })
    //       )
    //     }
    //   }
    //   this.mapLayerArr.push(this.pointLayer)
    //   this.mapLayerArr.push(this.newLayer)
    //   var mapcontainer = this.$refs.rootmap
    //   this.map = new Map({
    //     target: mapcontainer,
    //     layers: this.mapLayerArr,
    //     view: new View({
    //       projection: 'EPSG:4326', //使用这个坐标系
    //       center: [
    //         Number(this.mapInfo.jd) ? Number(this.mapInfo.jd) : mapconfig.x,
    //         Number(this.mapInfo.wd) ? Number(this.mapInfo.wd) : mapconfig.y
    //       ],
    //       zoom: mapconfig.maxZoom,
    //       maxZoom: mapconfig.maxZoom
    //     }),
    //     controls: defaults({
    //       zoom: false,
    //       rotate: false,
    //       attribution: false
    //     })
    //   })
    //   var container = document.getElementById('popup')
    //   this.overlayer = new Overlay({
    //     element: container,
    //     autoPan: false
    //   })
    //   this.overlayer.setPosition(undefined)
    //   // 将overlayer层添加到map当中
    //   this.map.addOverlay(this.overlayer)
    //   this.addClick()
    //   for (let i = 0; i < this.mapOptions.length; i++) {
    //     if (this.mapOptions[i].isDefault === 'Y') {
    //       this.mapView = this.mapOptions[i].dictValue
    //       this.checkMapView(this.mapOptions[i].dictValue)
    //     }
    //   }
    //   this.loading = false
    // },
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
      getMapInfo(this.info.sfzhm).then((res) => {
        if (!this.map) {
          this.initMap()
        }
        if (res.code == 200 && res.data) {
          this.mapInfo = res.data
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
        //zoom: 18, // 缩放级别
        // rotation: undefined, // 缩放完成view视图旋转弧度
        duration: 1000 // 缩放持续时间，默认不需要设置
      })
    },
    async getFwTagList() {
      this.sideMenus.splice(6, this.sideMenus.length)
      let rybqList = await getRybq()
      let zdqsnbqList = await getzdqsnbq()
      let garybqList = await getGarybq()
      let tsrybqList = await gettsrybq()
      this.rybqList = rybqList.data
      this.zdqsnbqList = zdqsnbqList.data
      this.garybqList = garybqList.data
      this.tsrybqList = tsrybqList.data
      for (let i = 0; i < this.zhzzJcywBqglList.length; i++) {
        for (let j = 0; j < this.tsrybqList.length; j++) {
          if (this.zhzzJcywBqglList[i].bqId == this.tsrybqList[j].dictCode) {
            this.sideMenus.push(JSON.parse(JSON.stringify(this.tsrybqList[j])))
          }
        }
      }
      for (let i = 0; i < this.sideMenus.length; i++) {
        if (this.sideMenus[i].dictLabel == '刑满释放人员') {
          this.$set(this.sideMenus[i], 'href', '#element6')
          let xmsfForm = await getGaryInfo(
            this.info.sfzhm,
            this.sideMenus[i].dictCode
          )
          if (xmsfForm.data.zhzzJcywSyrkTsrqXmsfryList[0]) {
            this.xmsfForm = xmsfForm.data.zhzzJcywSyrkTsrqXmsfryList[0]
          }
          this.xmsfFormsfz = this.info.sfzhm
        } else if (this.sideMenus[i].dictLabel == '社区矫正人员') {
          this.$set(this.sideMenus[i], 'href', '#element7')
          let sqjzForm = await getGaryInfo(
            this.info.sfzhm,
            this.sideMenus[i].dictCode
          )
          if (sqjzForm.data.zhzzJcywSyrkTsrqSqjzryList[0]) {
            this.sqjzForm = sqjzForm.data.zhzzJcywSyrkTsrqSqjzryList[0]
          }
          this.sqjzFormsfz = this.info.sfzhm
        } else if (this.sideMenus[i].dictLabel == '精神障碍患者') {
          this.$set(this.sideMenus[i], 'href', '#element8')
          let jszaForm = await getGaryInfo(
            this.info.sfzhm,
            this.sideMenus[i].dictCode
          )
          if (jszaForm.data.zhzzJcywSyrkTsrqJszahzList[0]) {
            this.jszaForm = jszaForm.data.zhzzJcywSyrkTsrqJszahzList[0]
          }
          this.jszaFormsfz = this.info.sfzhm
        } else if (this.sideMenus[i].dictLabel == '吸毒人员') {
          this.$set(this.sideMenus[i], 'href', '#element9')
          let xdForm = await getGaryInfo(
            this.info.sfzhm,
            this.sideMenus[i].dictCode
          )
          if (xdForm.data.zhzzJcywSyrkTsrqXdryList[0]) {
            this.xdForm = xdForm.data.zhzzJcywSyrkTsrqXdryList[0]
          }
          this.xdFormsfz = this.info.sfzhm
        } else if (this.sideMenus[i].dictLabel == '艾滋病危险人员') {
          this.$set(this.sideMenus[i], 'href', '#element10')
          let azbForm = await getGaryInfo(
            this.info.sfzhm,
            this.sideMenus[i].dictCode
          )
          if (azbForm.data.zhzzJcywSyrkTsrqAzbwxryList[0]) {
            this.azbForm = azbForm.data.zhzzJcywSyrkTsrqAzbwxryList[0]
          }
          this.azbFormsfz = this.info.sfzhm
        }
      }
      // this.sideMenus = [...this.sideMenus, ...this.sideOtherMenus]
      this.tagList = [
        ...this.rybqList,
        ...this.zdqsnbqList,
        ...this.garybqList,
        ...this.tsrybqList
      ]
      for (let i = 0; i < this.tagList.length; i++) {
        this.$set(this.tagList[i], 'added', false)
        for (let j = 0; j < this.zhzzJcywBqglList.length; j++) {
          if (this.zhzzJcywBqglList[j].bqId == this.tagList[i].dictCode) {
            this.tagList[i].added = true
          }
        }
      }
    },
    handleClose(item, i) {
      this.zhzzJcywBqglList.splice(i, 1)
      deletePersonTag(item.id).then((res) => {
        if (res.code == 200) {
          this.$modal.msgSuccess('删除成功')
          this.xmsfFormsfz = ''
          this.sqjzFormsfz = ''
          this.jszaFormsfz = ''
          this.xdFormsfz = ''
          this.azbFormsfz = ''
          this.getFwTagList()
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
          glId: this.baseInfo.id
        })
        if (!res) return
        this.getInfo()
        this.$modal.msgSuccess('新增成功')
      }
    },
    getInfo() {
      populationFile(this.info.sfzhm, this.type).then((res) => {
        if (res.code === 200) {
          this.zhzzJcywSyrkHjrkVoList = res.data.zhzzJcywSyrkHjrkVoList //同户籍人口
          this.jcywSyrkTjzryVoList = res.data.jcywSyrkTjzryVoList //同居住人口
          this.zhzzJcywBqglList = res.data.zhzzJcywBqglList //标签
          for (let i = 0; i < this.zhzzJcywSyrkHjrkVoList.length; i++) {
            if (this.zhzzJcywSyrkHjrkVoList[i].zp) {
              this.zhzzJcywSyrkHjrkVoList[i].zp =
                process.env.VUE_APP_BASE_FILE_VIEW +
                this.zhzzJcywSyrkHjrkVoList[i].zp
            } else {
              this.zhzzJcywSyrkHjrkVoList[
                i
              ].zp = require('@/assets/images/wutouxiang.svg')
            }
          }
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
    }
  },
  mounted() {
    this.mapOptions =
      mapconfig.url || JSON.parse(localStorage.getItem('mapSource'))
    this.initMap()
    for (let i = 0; i < this.mapOptions.length; i++) {
      if (this.mapOptions[i].dictValue === '3') {
        this.mapView = this.mapOptions[i].dictValue
        this.checkMapView(this.mapOptions[i].dictValue)
      }
    }
    this.getMapDataSourceUrl()
    if (JSON.stringify(this.$route.params) != '{}') {
      localStorage.setItem('info', JSON.stringify(this.$route.params))
      this.info = this.$route.params.row
      this.type = this.$route.params.type
    } else {
      let info = JSON.parse(localStorage.getItem('info'))
      this.info = info.row
      this.type = info.type
    }
    if (this.type == 0) {
      this.sideMenus[1].dictLabel = '流动信息'
    }
    //水印
    //setWaterMark(this.user.name, this.user.nickName, this.user.deptName)
    this.getBaseMsg()
    this.mapOptions =
      mapconfig.url || JSON.parse(localStorage.getItem('mapSource'))
    this.getInfo()
    this.getFwMapInfo()
    // 销毁监听
    document
      .getElementById('diercol')
      .addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    // localStorage.removeItem('info')
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
        overflow-y: scroll;
        width: 206px;
        padding-top: 18px;
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
          padding: 0 26px;
          margin: 11px 0 17px;
          // img {
          //   width: 152px;
          //   height: 196px;
          // }
          div {
            font-size: 16px;

            font-weight: 600;
            color: #1f2552;
            display: flex;
            justify-content: space-between;
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
        overflow-y: scroll;
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
          background-color: #fafbfc;
          table-layout: fixed;
          tr {
            td {
              border: 1px solid #dcdbdb;
              padding: 16px;
              font-size: 14px;

              font-weight: 400;
              color: #1f2552;
              word-break: break-all;
              &:nth-child(odd) {
                width: 109px;
              }
              &:nth-child(2) {
                // width: 352px;
              }
              &:nth-child(4) {
                // width: 216px;
              }
              &:nth-child(6) {
                // width: 239px;
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
