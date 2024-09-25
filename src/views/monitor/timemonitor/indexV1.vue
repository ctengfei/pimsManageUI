<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 实时监控视频左半部分 -->
      <el-col :span="18">
        <div class="videoArea" id="vedioShow">
          <div class="title">
            <el-button
              class="float-left"
              type="text"
              @click="goBack()"
              ><img src="@/assets/images/back.png" alt="返回" class="backImage" />
            </el-button>
            <span class="video-web-content-title">{{ player.deviceName }}</span>
          </div>
          <div class="video-main">
            
            <div class="monitor-area">
              <div class="monitor-menu" style="margin-top: 10px;">
                <div class="left">
                  <el-button
                    class="historyBtn video-web-plain-btn"
                    @click="historyVideo()"
                  >
                    <i class="el-icon-video-camera"></i> 历史回看
                  </el-button>
                  <el-button
                    class="historyBtn video-web-plain-btn"
                    @click="historyImage()"
                  >
                    <i class="el-icon-camera"></i> 历史图片
                  </el-button>
                </div>
                <div class="right">
                  <el-form :model="takeVideoForm" style="width:200px;">
                    <el-form-item label="录屏时间">
                      <div class="interval-timer" style="color:#fff;display: flex;
      align-items: center;
      justify-content: center">
                        <el-input-number
                          v-model="takeVideoForm.hour"
                          :max="4"
                          :min="0"
                        
                          :controls="false"
                        />:
                        <el-input-number
                          v-model="takeVideoForm.min"
                          :max="59"
                          :min="0"
                          :controls="false"
                        />:
                        <el-input-number
                          v-model="takeVideoForm.sec"
                          :max="59"
                          :min="0"
                        
                          :controls="false"
                        />
                      </div>
                    </el-form-item>
                  </el-form>
                  
                  <el-button
                    v-show="!isTabeVideoOn"
                    :class="{ 'is-disabled': isSsrcPlayerActionDisabled }"
                    class="video-web-plain-btn"
                    :disabled="isSsrcPlayerActionDisabled"
                    @click="takeVideo()"
                    style="font-size:14px;"
                  >开始录像</el-button>
                  <el-button
                    class="video-web-plain-btn"
                    v-show="isTabeVideoOn"
                    :disabled="isSsrcPlayerActionDisabled"
                    @click="stopTakeVideo()"
                    >停止录像</el-button
                  >
                  <el-button
                    class="video-web-plain-btn"
                    :disabled="isSsrcPlayerActionDisabled"
                    @click="snapShotRest"
                    ><i class="el-icon-camera"></i> 服务器抓拍</el-button
                  >
                </div>
                <!-- 历史录像 -->
                <!-- 历史图片 -->
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 实时监控右半部分 -->
      <el-col :span="6">
        <div class="">
          <div class="relatives" v-if="!rightB">
            <img style="width:30px;height:30px" :src="require(`@/assets/images/sxt.png`)"/>
            非球机设备无法操作云台
            </div>
          <div>
              <div class="right-button" :class="!rightB ? 'rightBox' : ''">
                <div class="menu-item">
                  <div class="menu-item-title">
                    <span>云台</span>
                  </div>
                  <!-- 圆盘遥控 -->
                  <div class="remoteControl">
                    <div id="zhuan" style="position: relative">
                      <svg
                        width="200"
                        height="200"
                        viewBox="0 0 200 200"
                        style="position: absolute; top: 50%;left: 50%;transform: translate(-50%, -50%);"
                      >
                        <defs>
                          <radialGradient id="grad1">
                            <stop offset="40%" stop-color="#1a3376" />
                            <stop offset="100%" stop-color="#206aff" />
                          </radialGradient>
                        </defs>
                        <!--包含下面圆弧的圆作为边框-->
                        <circle
                          cx="100"
                          cy="100"
                          r="91"
                          fill="url(#grad1)"
                          stroke="#206aff"
                        />
                        <!--45度圆弧拼成一个圆盘 -->
                        <path
                          d="M100 100 L64 17 A90 90 0 0 1 137 17 Z"
                          fill="#1a3376"
                          @click="clickSpot('4')"
                          @mouseenter="ihover($event)"
                          @mousedown="emit('4')"
                          @mouseup="emitup('4')"
                        />
                        <path
                          d="M100 100 L137 17 A90 90 0 0 1 185 68 Z"
                          fill="#1a3376"
                          @click="clickSpot('6')"
                          @mouseenter="ihover($event)"
                          @mousedown="emit('6')"
                          @mouseup="emitup('6')"
                        />
                        <path
                          d="M100 100 L185 68 A90 90 0 0 1 185 130 Z"
                          fill="#1a3376"
                          @click="clickSpot('1')"
                          @mouseenter="ihover($event)"
                          @mousedown="emit('1')"
                          @mouseup="emitup('1')"
                        />
                        <path
                          d="M100 100 L185 130 A90 90 0 0 1 136 183 Z"
                          fill="#1a3376"
                          @click="clickSpot('5')"
                          @mouseenter="ihover($event)"
                          @mousedown="emit('5')"
                          @mouseup="emitup('5')"
                        />
                        <path
                          d="M100 100 L136 183 A90 90 0 0 1 70 185 Z"
                          fill="#1a3376"
                          @click="clickSpot('3')"
                          @mouseenter="ihover($event)"
                          @mousedown="emit('3')"
                          @mouseup="emitup('3')"
                        />
                        <path
                          d="M100 100 L70 185 A90 90 0 0 1 17 135 Z"
                          fill="#1a3376"
                          @click="clickSpot('7')"
                          @mouseenter="ihover($event)"
                          @mousedown="emit('7')"
                          @mouseup="emitup('7')"
                        />
                        <path
                          d="M100 100 L17 135 A90 90 0 0 1 15 70 Z"
                          fill="#1a3376"
                          @click="clickSpot('2')"
                          @mouseenter="ihover($event)"
                          @mousedown="emit('2')"
                          @mouseup="emitup('2')"
                        />
                        <path
                          d="M100 100 L15 70 A90 90 0 0 1 64 17 Z"
                          fill="#1a3376"
                          @click="clickSpot('8')"
                          @mouseenter="ihover($event)"
                          @mousedown="emit('8')"
                          @mouseup="emitup('8')"
                        />
                        <!-- pointer -->
                        <path
                          d="M99 42 L96 42 A3 3 0 0 1 103 42 A3 3 0 0 1 96 42 Z"
                          stroke="#fff"
                          stroke-width="0.4"
                          fill="#fff"
                        />
                        <path
                          d="M99 158 L96 158 A3 3 0 0 1 103 158 A3 3 0 0 1 96 158 Z"
                          stroke="#fff"
                          stroke-width="0.4"
                          fill="#fff"
                        />
                        <path
                          d="M140 62 L137 62 A3 3 0 0 1 144 62 A3 3 0 0 1 137 62 Z"
                          stroke="#aaa"
                          stroke-width="0.4"
                          fill="#aaa"
                        />
                        <path
                          d="M140 134 L137 134 A3 3 0 0 1 144 134 A3 3 0 0 1 137 134 Z"
                          stroke="#aaa"
                          stroke-width="0.4"
                          fill="#aaa"
                        />
                        <path
                          d="M148 98 L145 98 A3 3 0 0 1 152 98 A3 3 0 0 1 145 98 Z"
                          stroke="#fff"
                          stroke-width="0.4"
                          fill="#fff"
                        />
                        <path
                          d="M60 62 L57 62 A3 3 0 0 1 64 62 A3 3 0 0 1 57 62 Z"
                          stroke="#aaa"
                          stroke-width="0.4"
                          fill="#aaa"
                        />
                        <path
                          d="M46 98 L43 98 A3 3 0 0 1 50 98 A3 3 0 0 1 43 98 Z"
                          stroke="#fff"
                          stroke-width="0.4"
                          fill="#fff"
                        />
                        <path
                          d="M60 134 L57 134 A3 3 0 0 1 64 134 A3 3 0 0 1 57 134 Z"
                          stroke="#aaa"
                          stroke-width="0.4"
                          fill="#aaa"
                        />
                      </svg>
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 116;cursor: pointer;"
                        @click="itoggle()"
                      >
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          stroke="#206aff"
                          fill="#1a3376"
                          stroke-width="3"
                        />
                        <path
                          id="pause"
                          class="hide"
                          d="M19 34 L22 34 L22 18 L19 18 Z M26 34 L29 34 L29 18 L26 18 Z"
                          
                        />
                        <path
                          id="play"
                          class="hide"
                          d="M20 34 L32 26 L20 17.5 Z"
                          
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="steam" ref="zhuan">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="lockTitle"
                      placement="top"
                    >
                      <el-button
                        :disabled="!dominShow"
                        class="video-web-plain-btn"
                        @click="lock"
                      >
                        <i class="iconfont iconsuoding"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="放大"
                      placement="top"
                    >
                      <!-- <span :style="{ background: narrowButton ? '#3377ff' : '' }" @mousedown="narrowOut()" @mouseup="narrowIn()">
                        <i class="el-icon-circle-plus-outline" />
                      </span> -->
                      <!-- 此处需要@mousedown、@mouseup两个事件，element的按钮组件没有开放这两个事件，所以使用原生按钮 -->
                      <button
                        class="video-web-plain-btn el-button"
                        @mousedown="narrowOut()"
                        @mouseup="narrowIn()"
                      >
                        <i class="iconfont iconfangda"></i>
                      </button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="缩小"
                      placement="top"
                    >
                      <!-- <span :style="{ background: enlargeButton ? '#3377ff' : '' }" @mousedown="enlargeOut()" @mouseup="enlargeIn()">
                        <i class="el-icon-remove-outline" />
                      </span> -->
                      <!-- 此处需要@mousedown、@mouseup两个事件，element的按钮组件没有开放这两个事件，所以使用原生按钮 -->
                      <button
                        class="video-web-plain-btn el-button"
                        @mousedown="enlargeOut()"
                        @mouseup="enlargeIn()"
                      >
                        <i class="iconfont iconxingzhuangkaobei"></i>
                      </button>
                    </el-tooltip>
                  </div>
                  <!-- 锁定对话框选择时间 -->
                  <el-dialog
                    :title="topTitle"
                    :visible.sync="dialogVisible"
                    width="30%"
                  >
                    <span>
                      <el-time-picker style="width:55%;" v-model="value3" />
                    </span>
                    <p slot="footer">
                      <el-button
                        class="video-web-main-btn"
                        style="padding: 0 13px;height: 32px;"
                        @click="confirm"
                        >确定</el-button
                      >
                      <el-button
                        class="video-web-plain-btn"
                        style="padding: 0 13px;height: 32px;"
                        @click="dialogVisible = false"
                        >取消</el-button
                      >
                    </p>
                  </el-dialog>
                  <!-- <div style="width: 93%; height: 1px;background-color: #eaeff4;margin-left: -30px;position: absolute;bottom: -4%;" /> -->
                </div>
                <!-- tabs切换功能模块 -->
                <div class="set" style="position:relative">
                  <!-- <div class="myMust" v-if="!lockButton || lockTitle === '抢占'" @click="myMust"></div> -->

                  <div class="menu-item">
                    <div class="menu-item-title">
                      <span>高级功能</span>
                      <span @click="menuHidden"
                        ><i
                          style="margin-right:5px;cursor:pointer"
                          class="iconfont iconbottom2"
                        ></i
                      ></span>
                    </div>
                    <!-- 点击设置，跳出预置位弹框 -->
                    <ReservedSetting
                      :device-obj="player"
                      ref="tabsRef"
                      :setting-num="settingNum"
                      @updateBtnList="updateBtnList"
                    />
                    <!-- 点击设置，跳出预置位弹框 -->
                    <!-- <ReservedSetting ref="tabsRef" :setting-num="settingNum" @updateBtnList="updateBtnList" /> -->
                    <div v-show="!isMenuHidden">
                      <!-- <span>云台移动速度</span> -->
                      <el-slider v-model="value2" :max="maxs" />
                    </div>
                    <div v-show="!isMenuHidden" class="setButton">
                      <el-tooltip
                        v-for="(item, index) in otherSettings"
                        :key="index"
                        effect="dark"
                        :content="item.text"
                        class="item"
                        placement="top"
                      >
                        <!-- <span :style="{background: item.isTag ? '#3377ff' : '#d1d1d1' }" :class="{active: activeIndex === index}" @click="handleSetting(item, index)">

                        </span> -->
                        <el-button
                          class="video-web-plain-btn el-button"
                          :class="{
                            'tag-active': item.isTag,
                            'tag-close': !item.isTag
                          }"
                          :disabled="player.deviceId === ''"
                          @click="handleSetting(item, index)"
                        >
                          <i class="iconfont" :class="item.class"></i>
                        </el-button>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="menu-item">
                    <div class="menu-item-title">
                      <span>预置位</span>
                      <span
                        ><i
                          style="margin-right:5px;cursor:pointer"
                          class="el-icon-setting"
                          @click="openSettingPreset"
                        ></i
                      ></span>
                    </div>
                    <ul
                      class="infinite-list preset-seat"
                      style="overflow:auto;overflow-y: scroll;height: 195px;"
                    >
                      <li
                        v-for="(btn, index) in btnList"
                        :key="index"
                        @click="handleBtn(btn, index)"
                        :style="{
                          background: index === btnActive ? '#373b58' : ''
                        }"
                        class="infinite-list-item"
                      >
                        <span>{{ btn.presetIndex }}</span>
                        <span>{{ btn.presetName }}</span>
                      </li>
                    </ul>
                  </div>
                  <!-- 移动摄像展示 -->
                  <div
                    class="mobileDevices"
                    v-show="mobileDevice == 'shiyuetech'"
                  >
                    <div class="title">
                      <span>定时开关机设置</span>
                    </div>
                    <div class="powerOn">
                      <p>
                        <el-radio v-model="radio" label="1">定时开机</el-radio>
                      </p>
                      <p>
                        <el-radio v-model="radio" label="2">持续开机</el-radio>
                      </p>
                      <p>开机时间段</p>
                      <div class="add">
                        <el-time-picker
                          v-model="form.time"
                          is-range
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          placeholder="选择时间范围"
                          value-format="HH:mm:ss"
                          style="width:90%"
                          class="plan-name"
                        />
                        <span
                          class="el-icon-circle-plus-outline"
                          @click="addTime()"
                        ></span>
                      </div>
                      <div class="timeSlot">
                        <el-form>
                          <el-form-item
                            v-for="(item, index) in timeList"
                            :label="'时间段' + (index + 1)"
                            :key="index"
                          >
                            <span class="no-redirect"
                              >{{ item.startTime }} - {{ item.endTime }}
                              <i
                                class="el-icon-delete"
                                style="margin-left: 4%; font-size: 16px"
                                @click="deleteTime(item)"
                              ></i
                            ></span>
                          </el-form-item>
                        </el-form>
                      </div>
                      <div class="openBtn">
                        <el-button class="video-web-danger-btn"
                          ><i class="el-icon-switch-button"></i
                        ></el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 放大需要用的框体的dom元素
const localStorage = window.localStorage;
// 放大功能框体移动时记录的坐标数据
const rectInfo = {
  midPointX: 0,
  midPointY: 0,
  length: 0,
  width: 0,
  lengthX: 0,
  lengthY: 0
};

import {
  getLockList,
  getLockState,
  getControl,
  getWiperList,
  getLightList,
  getResetList,
  getFocusList,
  getPauseplayList,
  getHorizontalList,
  getStopScann,
  getVerticalList,
  getLocationList,
  getInformation, //查询设备信息
  // changeDefinition,
  changeChoice,
  dragZoom,
  voiceInterCom,
  getCruiseRecordVideo,
  onCallPreset,
  downloadPluginByUrl,
  getCarInformation,
  getLockCtrl
} from "@/api/monitor/timemonitor";
// import {
//   manuallySnapshot
// } from '@/api/imageMange/snapPhoto'
import {
  postSnapPhoto // 平台抓拍
} from "@/api/videoMange/historyVideo";
import {
  startRecord,
  stopRecord
  // hasUuid
} from "@/api/videoMange/recordVideo";
import { getConfigByCode } from "@/api/configure/argumentsConfigure";
import { printScreen, intervalPrintScreen } from "@/utils/dom";
import { tabsList } from "../../../utils/time-monitor";
import ReservedSetting from "./components/reservedSettings";
import PlayVideo from "../../videoMange/recordVideo/playVideo";
import { downloadPlugin } from "@/utils/index";
import { validateString, compareTime } from "@/utils/validate";
import Moment from "moment";
import {
  treeData,
  getDeviceInfoById,
  getIvsPlayer,
  getDeviceCriteria
} from "@/api/system/organization";

export default {
  // name: "Timemonitor",
  components: {
    ReservedSetting,
    PlayVideo
  },
  data() {
    return {
      permission: {
        // preset: "monitor::timemonitor::preset",
        preset: {url: "/sm/ivs/ptz/preset/position/list", method: "GET"},
        checkpreset: {url:"/sm/ivs/ptz/guard/position/list", method: "GET"},
        // setpreset: "monitor::timemonitor::set",
        setpreset: {url: "/sm/ivs/ptz/guard/position", method: "POST"},
        lockState: "monitor::timemonitor::lockState",
        lockList: "monitor::timemonitor::lockList",
        // voiceInterCom: "monitor::timemonitor::voiceInterCom",
        control: {url: "/sm/ivs/ptz/operation", method: "POST"},
        // Light: "monitor::timemonitor::Light",
        // WiperList: "monitor::timemonitor::WiperList",
        startScan: "monitor::timemonitor::startScan",
        stopScan: "monitor::timemonitor::stopScan",
        // irisFocus: "monitor::timemonitor::irisFocus",
        // search: "monitor::timemonitor::search",
        location: "monitor::timemonitor::location",
        postSnapPhoto: "monitor::historyVideo::postSnapPhoto",
        // stopRecord: "videoMange::planningVideo:stopRecord",
        // startRecord: "videoMange::planningVideo:startRecord",
        // deviceInformation: "videoMange::planningVideo:deviceInformation"
      },
      radio: "1", //定时开关机默认
      form: {
        time: ""
      },
      timeList: [
        { startTime: "12:10:00", endTime: "13:30:00" },
        { startTime: "12:10:00", endTime: "13:30:00" },
        { startTime: "12:10:00", endTime: "13:30:00" }
      ],
      mobileDevice: "", //设备信息字段
      tabsList,
      activeIndex: null,
      maxs: 10,
      tabDomRef: "",
      value1: "",
      value2: 2,
      value3: "Sat Jan 01 2000 00:00:00 GMT+0800 (中国标准时间)",
      voiceTitle: "点击开始通话",
      lockTitle: "已锁定",
      topTitle: "",
      // wiperTitle:'开启雨刷',
      yunTaiData: {},
      dialogVisible: false,
      player: {
        deviceId: "",
        deviceName: "",
        referenceId: "3414",
        deviceCamera: ""
      },
      url: "",
      historyV: false,
      historyI: false,
      rightB: true,
      lockButton: false,
      voiceButton: false,
      narrowButton: false,
      enlargeButton: false,
      isTag: false,
      startScan: false,
      recordVal: "",
      st: false, // false--暂停，true--播放
      // btnList: [],
      activeName: "0",
      // 其他设置
      urls: "",
      method: "",
      otherSettings: [
        {
          text: "灯光",
          class: "icondengguang",
          url: getControl,
          isTag: false,
          queryData: {
            cameraCode: "",
            controlPara1: "2",
            controlPara2: "",
            ptzControlModeEnum: "PTZ_AUX_OPEN"
          }
        },
        {
          text: "雨刷",
          class: "iconyushua",
          url: getControl,
          isTag: false,
          queryData: {
            cameraCode: "",
            controlPara1: "1",
            controlPara2: "",
            ptzControlModeEnum: "PTZ_AUX_OPEN"
          }
        },
        // {
        //   text: '调用看守位',
        //   class:"iconshexiangtou-off",
        //   url: getResetList,
        //   isTag: false,
        //   queryData: {
        //     deviceId: '',
        //     ptzControlModeEnum:''
        //   }
        // },
        // {
        //   text: '3D定位',
        //   class:"iconxingzhuangbeifen",
        //   url: getLocationList,
        //   isTag: false,
        //   queryData: {
        //     deviceId: '',
        //     Interval: ''
        //   }
        // },
        {
          text: "水平扫描",
          class: "iconyushua1",
          url: getControl,
          isTag: false,
          queryData: {
            cameraCode: "",
            controlPara1: "",
            controlPara2: "",
            ptzControlModeEnum: "PTZ_HORIZONTAL_SCAN"
          }
        },
        {
          text: "垂直扫描",
          class: "iconyushua2",
          url: getControl,
          isTag: false,
          queryData: {
            cameraCode: "",
            controlPara1: "",
            controlPara2: "",
            ptzControlModeEnum: "PTZ_VERTICAL_SCAN"
          }
        },
        {
          text: "光圈缩小",
          class: "iconguangquansuoxiao",
          url: getControl,
          isTag: false,
          queryData: {
            cameraCode: "",
            controlPara1: "2",
            controlPara2: "",
            ptzControlModeEnum: "PTZ_LENS_APERTURE_CLOSE"
          }
        },
        {
          text: "光圈放大",
          class: "iconguangquanfangda",
          url: getControl,
          isTag: false,
          queryData: {
            cameraCode: "",
            controlPara1: "2",
            controlPara2: "",
            ptzControlModeEnum: "PTZ_LENS_APERTURE_OPEN"
          }
        },
        {
          text: "近焦",
          class: "iconflower3",
          url: getControl,
          isTag: false,
          queryData: {
            cameraCode: "",
            controlPara1: "2",
            controlPara2: "",
            ptzControlModeEnum: "PTZ_LENS_FOCAL_NEAR"
          }
        },
        {
          text: "远焦",
          class: "iconjiaoju",
          url: getControl,
          isTag: false,
          queryData: {
            cameraCode: "",
            controlPara1: "2",
            controlPara2: "",
            ptzControlModeEnum: "PTZ_LENS_FOCAL_FAR"
          }
        }
      ],
      // 右侧高级功能隐藏标识
      isMenuHidden: false,
      // cruiseNum: 0,
      // tracgitoryNum: 0,
      // recordNum: 0,
      settingNum: 0,
      btnActive: null,
      // 播放类型参数
      playType: 0,
      playTypeOptions: [
        {
          value: 0,
          label: "单播"
        },
        {
          value: 1,
          label: "组播"
        }
      ],
      // 视频流切换功能需要的参数
      codeRate: 0,
      dominShow: true,
      domainCode: "",
      players: [],
      codeRateOptions: [
        {
          value: 0,
          label: "高清"
        },
        {
          value: 1,
          label: "标清"
        }
      ],
      codeRateOption: [{ value: 0, label: "高清" }],
      // 本地连拍需要的参数
      shotPopVisible: false,
      screenShotsForm: {
        count: 0,
        hour: 0,
        min: 0,
        sec: 0
      },
      // 手动录像需要的参数
      takeVideoVisible: false,
      isTabeVideoOn: false,
      takeVideoForm: {
        hour: 0,
        min: 5,
        sec: 0,
        validTime: 90,
        uuid: ""
      },
      takeVideoUuid: "",
      isTalking: false,
      // 局部放大功能需要的参数
      dialogArr: [], // 弹出框的数组
      zoomRectFlag: false, // 局部放大功能的开关
      temp: 0,
      // 语音对讲参数
      deviceData: {
        list: []
      },
      ZLServerIp: "",
      backText: "返回",
      playerItem: {},
      playerUrl: "",
      lockOwenr: "",
      lockOwenrName: "",
      styleObj: {},
      settingInfo: {
        VIDEO_VALIDITY: 0,
        DEFAULT_DURATION_OF_VIDEO_RECORDING: 0,
        NUMBER_OF_SNAPSHOTS: 0,
        CAPTURE_INTERVAL: 0
      },
      playerLength: 1,
      widowWidth: window.screen.width,
      widowHeight: window.screen.width,
      workspaceDeviceCounts: 0,
      deviceCamera: "",
      vedioTop:'',
      vedioLeft:'',
      vedioWidth:'',
      vedioHeight:'',
      deviceZoom:''
    };
  },
  watch: {
    widowWidth (val) {
      let that = this;
      console.log('实时屏幕宽度', val, that.widowWidth)
      that.$nextTick(()=>{
        that.windowWidth = val
      })
      
    },
    widowHeight (val) {
      let that = this;
      console.log('实时屏幕高度', val, that.widowHeight)
      that.$nextTick(()=>{
        that.windowWidth = val
      })
    },
    vedioTop (val) {
      let that = this;
      console.log('播放器X', val, that.vedioTop)
      that.$nextTick(()=>{
        that.vedioTop = val
      })
    },
    vedioLeft (val) {
      let that = this;
      console.log('播放器Y', val, that.vedioLeft)
      that.$nextTick(()=>{
        that.vedioLeft = val
      })
    },
    vedioWidth (val) {
      let that = this;
      console.log('播放器高度', val, that.vedioWidth)
      that.$nextTick(()=>{
        that.vedioWidth = val
      })
    },
    vedioHeight (val) {
      let that = this;
      console.log('播放器高度', val, that.vedioHeight)
      that.$nextTick(()=>{
        that.vedioHeight = val
      })
    },
    deviceZoom(val){
      let that = this;
      console.log('放大率', val, that.deviceZoom)
      that.$nextTick(()=>{
        that.deviceZoom = val
        
      })
    },
    $route: {
      handler(to, from) {
        if (to.query.type === 1) {
          this.isBack = true;
        } else {
          this.isBack = false;
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    /* 抓拍、流切换、连拍、录像等视频正在播放时的操作的禁用限制
         无通道时禁用所有上述操作，选择通道后方可解除
      */
    isSsrcPlayerActionDisabled() {
      // return !this.player || !this.player.deviceId || !this.$refs.videoPlayer || !this.$refs.videoPlayer.ssrc
      return !this.player || !this.player.deviceId;
    },
    btnList() {
      return this.$store.getters.presetList;
    },
    cruiseInfoList() {
      return this.$store.state.socket.cruiseInfoList;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== "/timemonitor") {
      localStorage.removeItem("deviceData");
      this.isBack = false;
      this.$store.commit("app/SET_CRUISE_STATUS", {
        showCruiseBtn: false,
        id: ""
      });
    }
    if (to.path === "/splitscreen") {
      localStorage.setItem(
        "timemonitorData",
        JSON.stringify({ len: this.playerLength, players: [...this.players] })
      );
    } else {
      localStorage.removeItem("timemonitorData");
    }
    next();
  },
  created() {
    // this.getConfigInfo();
  },
  updated() {
    const _this = this;
    window.onresize = () => {
      _this.pageResize();
    };
  },
  mounted() {
    if (this.$route.query.player.deviceId) {
      console.log("this.$route.query", this.$route.query);
      this.dominShow = this.$route.query.dominShow;
      this.domainCode = this.$route.query.domainCode;
      this.player.deviceId = this.$route.query.player.deviceId;
      this.player.deviceName = this.$route.query.player.deviceName;
      this.player.protocol = this.$route.query.player.protocol;
      this.player.referenceId = this.$route.query.player.referenceId;
      localStorage.setItem("deviceData", JSON.stringify(this.player));
    } else if (localStorage.getItem("deviceData")) {
      let data = JSON.parse(localStorage.getItem("deviceData"));
      this.player.deviceId = data.deviceId;
      this.player.deviceName = data.deviceName;
      this.player.protocol = data.protocol;
    }
    this.getCarInformation(this.player.referenceId);
    // this._getDevInformation()  //获取设备信息
    // this.rightB = true
    this.getPerSet(); // 预置位列表
    this.itoggle();
    // this.setWiOrHi()
    this.setPlayerLength(1);
    this.otherSettings.map((item, index) => {
      item.queryData.deviceId = this.player.deviceId;
    });
    window.addEventListener("beforeunload", e => {
      // this.stopTalk()
      // localStorage.removeItem('splitscreenData')
    });
    let _this = this;
    _this.deviceZoom = window.devicePixelRatio
    var box=document.getElementById('vedioShow'); 
    _this.vedioTop = box.getBoundingClientRect().top + 140;
    _this.vedioLeft = box.getBoundingClientRect().left + 60;
    _this.vedioWidth = box.getBoundingClientRect().width - 50;
    _this.vedioHeight = box.getBoundingClientRect().height - 140;
    window.onresize = ()=>{
      window.fullHeight = window.screen.height;
      window.fullWidth = window.screen.width;
      _this.widowHeight = window.fullHeight;
      _this.widowWidth = window.fullWidth;
    }
    let str0 = {"cmd":"create_control","html_x": window.screenLeft,"html_y": window.screenTop,"html_w":_this.widowWidth,"html_h":_this.widowHeight,"e_type":"Chrome","title":document.title,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
    _this.$store.state.socket.Csock.send(JSON.stringify(str0))
    let str2 = {"cmd":"set_pos","x": _this.vedioLeft * _this.deviceZoom,"y": _this.vedioTop * _this.deviceZoom,"w": _this.vedioWidth * _this.deviceZoom,"h": _this.vedioHeight * _this.deviceZoom,"id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
    _this.$store.state.socket.Csock.send(JSON.stringify(str2))
    setTimeout(function(){
      let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      _this.$store.state.socket.Csock.send(str1)
    },500)
    _this.getIvsPlayer(this.player.referenceId);
    //      let str3 = `{"cmd":"play_his","id":"001","time":"2020-08-17 00:00:00.000","camera_id":"rtsp://10.61.189.197/live/00000002?my_people","camera_name":"摄像头","wnd_index":0,"cmd_id":"001_1 "}`
    //      _this.$store.state.socket.Csock.send(str3)
    // },1500)
  },
  beforeDestroy() {
    this.cruiseNum = 0;
    this.tracgitoryNum = 0;
    this.recordNum = 0;
    window.removeEventListener("scroll", this.handleScrollx);
    let str1 = `{"cmd":"destroy","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`;
    this.$store.state.socket.Csock.send(str1);
  },
  destroyed() {
    this.stopTalk();
  },
  methods: {
    handleScrollx() {
      console.log("滚动高度", window.pageYOffset);
      console.log(
        "距离顶部高度",
        this.$refs.videoBox.getBoundingClientRect().top
      );
    },
    pageResize() {
      this.$nextTick(_ => {
        const dom = this.$refs.videoPlayer;
        console.log("pageResize", dom);
        if (!dom) return;
        this.distance = [];
        for (let i = 0; i < dom.length; i++) {
          const position = {
            toLeft: dom[i].$el.getBoundingClientRect().left,
            toRight: dom[i].$el.getBoundingClientRect().right,
            toTop: dom[i].$el.getBoundingClientRect().top,
            toBottom: dom[i].$el.getBoundingClientRect().bottom
          };
          this.distance.push(position);
        }
      });
    },
    //  一键关流
    closeCurrentWorkspace() {
      this.clearVideos();
    },
    // 清除视频
    clearVideos() {
      for (var idx in this.players) {
        this.closeVideo(idx);
      }
    },
    //  关闭视频
    closeVideo(idx) {
      var player = this.players[idx];
      if (!player) {
        return;
      }
      player.deviceId = "";
      player.deviceName = "";
      player.protocol = "";
      if (this.workspaceDeviceCounts > 0) {
        this.workspaceDeviceCounts--;
      }
      localStorage.removeItem("timemonitorData");
    },
    // 通道列表点击选择通道
    handleClickChannel(data, index) {
      const player = this.players[index];
      player.deviceId = data.deviceId;
      player.deviceName = data.name;
      player.protocol = data.protocol;
      this.workspaceDeviceCounts++;
    },
    getCarInformation(code) {
      getCarInformation(code).then(res => {
        this.player.deviceCamera = res.data.code;
        this._getDevInformation(); //查询设备信息
        this._getLockState();
      });
    },
    // 视频播放
    getIvsPlayer(code) {
      let _this = this;
      //      let url = this.$store.getters.btnpremissAll[this.permission.deviceTree].url
      //      let method = this.$store.getters.btnpremissAll[this.permission.deviceTree].method
      getCarInformation(code).then(res => {
        if (res.code === 200) {
          var cameraCode = res.data.code.split("#")[0];
          var domainCode = res.data.code.split("#")[1];
          let data = {
            cameraCode: res.data.code,
            mediaURLParam: {
              broadCastType: 0,
              packProtocolType: 1,
              protocolType: 2,
              serviceType: 1,
              streamType: 2,
              transMode: 0
            }
          };
          getIvsPlayer("/sm/ivs/player/play", "POST", data).then(res => {
            if (res.code == 200) {
              _this.rtspUrl = res.data.rtspURL;
              // let str3 = {"cmd":"play_his","id":"001","time":"2020-08-17 00:00:00.000","camera_id": _this.rtspUrl,"camera_name":"摄像头","wnd_index":0,"cmd_id":"001_1 "}
              // console.log("wc播放命令====",str3)
              // _this.$store.state.socket.Csock.send(JSON.stringify(str3))
              if (res.data.description == "成功") {
                let str3 = {
                  cmd: "play_real",
                  id: "001",
                  time: "2020-08-17 00:00:00.000",
                  camera_id: _this.rtspUrl,
                  camera_name: "摄像头",
                  wnd_index: 0,
                  cmd_id: "001_1 "
                };
                _this.$store.state.socket.Csock.send(JSON.stringify(str3));
              } else {
                this.$message.info(res.data.description);
                let str3 = {
                  cmd: "stop_real",
                  id: "001",
                  time: "2020-08-17 00:00:00.000",
                  wnd_index: 0,
                  cmd_id: "001_1 "
                };
                _this.$store.state.socket.Csock.send(JSON.stringify(str3));
              }
            }
          });
          // .catch(err => {
          //   this.$message.error(err)
          // })
        }
      });
    },
    // 切换分屏数
    setPlayerLength(len = 1) {
      //      this.workspaceDeviceCounts = 0
      //      this.players = []
      //      this.playerLength = len
      //      this.playerIdx = 0
      //      for (var i = 0; i < len; i++) {
      //        this.players.push({
      //          deviceId: '',
      //          ref: `videoPalyer${i}`,
      //          len: this.playerLength,
      //          deviceName: '',
      //          protocol: ''
      //        })
      //      }
      let str = {
        cmd: "set_layout",
        id: "001",
        layout: 1,
        time: "2020-08-17 00:00:00.000",
        cmd_id: "001_1"
      };
      this.$store.state.socket.Csock.send(JSON.stringify(str));
      this.pageResize();
      this.$forceUpdate();
      localStorage.removeItem("splitscreenData");
    },
    menuHidden() {
      this.isMenuHidden = !this.isMenuHidden;
    },
    getConfigInfo() {
      let pArr = [];
      for (let key in this.settingInfo) {
        pArr.push(
          getConfigByCode(
            this.$store.getters.btnpremissAll[this.permission.search].url,
            this.$store.getters.btnpremissAll[this.permission.search].method,
            { code: key }
          )
            .then(res => {
              this.settingInfo[key] = parseInt(res.data);
            })
            .catch(err => {
              console.log("getConfigInfo", err);
            })
        );
      }
      Promise.all(pArr).then(res => {
        // 录像有效期
        this.takeVideoForm.validTime = this.settingInfo.VIDEO_VALIDITY;
        // 录像默认时长
        if (this.settingInfo.DEFAULT_DURATION_OF_VIDEO_RECORDING >= 60) {
          this.takeVideoForm.hour = Math.floor(
            this.settingInfo.DEFAULT_DURATION_OF_VIDEO_RECORDING / 60
          );
        }
        this.takeVideoForm.min =
          this.settingInfo.DEFAULT_DURATION_OF_VIDEO_RECORDING % 60;
        // 抓拍张数
        this.screenShotsForm.count = this.settingInfo.NUMBER_OF_SNAPSHOTS;
        // 抓拍间隔
        this.screenShotsForm.sec = this.settingInfo.CAPTURE_INTERVAL;
      });
    },
    setWiOrHi() {
      const dom = this.$refs.videoShow;
      this.styleObj = { height: parseInt(dom.clientHeight) + "px" };
    },

    getPerSet() {
      // 获取摄像头编码
      getCarInformation(this.player.referenceId).then(res => {
        if (res.code === 200) {
          var cameraCode = res.data.code.split("#")[0];
          var domainCode = res.data.code.split("#")[1];
          if (this.player === null || this.player.deviceId === undefined)
            return;
          // let url = this.$store.getters.btnpremissAll[this.permission.preset].url
          // if (url === undefined) return
          // let method = this.$store.getters.btnpremissAll[this.permission.preset].method
          // this.$store.dispatch('app/GetPresetList', this.player)
          // 预置位列表
          if (this.permission.preset.url === undefined)
            return;
          let params = {
            url: this.permission.preset.url,
            method: this.permission.preset.method,
            data: {
              // deviceId: this.player.deviceId
              cameraCode: cameraCode,
              domainCode: domainCode
            }
          };
          this.$store.dispatch("time/GetPresetList", params);

          // 看守位
          let query = {
            url: this.permission.checkpreset.url,
            method: this.permission.checkpreset.method,
            data: {
              // deviceId: this.player.deviceId
              cameraCode: cameraCode,
              domainCode: domainCode
            }
          };
          this.$store.dispatch("time/GetIsPreset", query);
        }
      });
    },
    getUuid() {
      const uuid = JSON.parse(localStorage.getItem("takeVideoUuid"));
      if (!uuid || !this.player.deviceId) {
        return;
      }
      this.takeVideoUuid = uuid;
    },
    zoomRect() {
      this.zoomRectFlag = !this.zoomRectFlag;
    },
    handleDragZoom(rectInfo) {
      const obj = {
        ...rectInfo,
        deviceId: this.player.deviceId
      };
      // 窗口弹出逻辑--luws
      if (this.dialogArr.length < 3) {
        let w_dynameter = (rectInfo.windowLength / rectInfo.lengthX).toFixed(2);
        let h_dynameter = (rectInfo.windowWidth / rectInfo.lengthY).toFixed(2);
        let localVideo = this.$refs.videoPlayer.$el;
        let _localVideoW = localVideo.offsetWidth;
        let _localVideoH = localVideo.offsetHeight;
        // let _localVideoW = parseInt(localVideo.style.width)
        let x =
          -(rectInfo.midPointX - rectInfo.lengthX / 2) *
            (w_dynameter / (rectInfo.windowLength / _localVideoW)) +
          "px";
        let y =
          -(rectInfo.midPointY - rectInfo.lengthY / 2) *
            (w_dynameter / (rectInfo.windowLength / _localVideoW)) +
          "px";
        let width = _localVideoW * w_dynameter + "px";
        let height = _localVideoH * h_dynameter + "px";
        this.dialogArr.push({
          id: this.temp,
          value: this.dialogArr.length,
          x,
          y,
          width,
          height
        });
        this.temp++;
      }
      // dragZoom(obj).then(res => {
      //   this.$message({
      //     message: '请求成功',
      //     type: 'success'
      //   })
      // })
      //   .catch(err => {
      //     this.$message.error(err)
      //   })
    },
    /* 视频弹出窗口点击置顶其迭代层级的逻辑
       因为弹框中有视频组件，z-index的方式实现会有问题，
       本方法思路利用弹框数组的排序改变dom元素的先后顺序，以实现改变层级的效果
        --luws 2021/03/18
      */
    handleFocusVideo(item, index) {
      this.dialogArr.forEach(v => {
        v.value++;
      });
      item.value = 0;
      this.dialogArr.sort((a, b) => {
        return b.value - a.value;
      });
    },
    // 视频窗口关闭事件
    closeDialog(index) {
      this.dialogArr.splice(index, 1);
    },
    // 云台锁定状态
    _getLockState() {
      const obj = {
        cameraCode: this.player.deviceCamera,
        controlPara1: "",
        controlPara2: "",
        ptzControlModeEnum: "PTZ_LOCK",
        withLock: false
      };
      let url = this.permission.control.url;
      let method = this.permission.control.method;
      getControl(url, method, obj)
        .then(res => {
          this.lockTitle = "已锁定";
          this.lockButton = true;
          this.st = false;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 停止扫描
    _StopScann() {
      const data = {
        deviceId: this.player.deviceId,
        scanGroupNum: "1"
      };
      let url = this.$store.getters.btnpremissAll[this.permission.stopScan].url;
      let method = this.$store.getters.btnpremissAll[this.permission.stopScan]
        .method;
      getStopScann(url, method, data)
        .then(res => {})
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 显示录像时间弹窗
    showPoverClick() {
      let that = this;
      const x = that.widowWidth / 2 + 145,
        y = that.widowHeight / 2 + 110;
      const str0 = {
        cmd: "cutting_window",
        x: x,
        y: y,
        w: 295,
        h: 125,
        e_type: "chrome",
        time: "2020-08-17 00:00:00.000",
        cmd_id: "001_1 "
      };
      that.$store.state.socket.Csock.send(JSON.stringify(str0));
    },
    // 隐藏录像时间弹窗
    hidePoverClick() {
      let that = this;
      const x = that.widowWidth / 2 + 145,
        y = that.widowHeight / 2 + 110;
      const str0 = {
        cmd: "repair_window",
        x: x,
        y: y,
        w: 295,
        h: 125,
        e_type: "chrome",
        time: "2020-08-17 00:00:00.000",
        cmd_id: "001_1 "
      };
      that.$store.state.socket.Csock.send(JSON.stringify(str0));
    },
    // 录像方法
    takeVideo() {
      let interval = 0;
      if (this.takeVideoForm.hour) {
        interval += this.takeVideoForm.hour * 60 * 60;
      }
      if (this.takeVideoForm.min) {
        interval += this.takeVideoForm.min * 60;
      }
      if (this.takeVideoForm.sec) {
        interval += this.takeVideoForm.sec;
      }
      if (!this.takeVideoForm.validTime > 0) {
        this.$message.warning("录像有效期必须大于0");
        return;
      }
      if (interval < 300) {
        this.$message.warning("录像时长必须大于等于5分钟");
        return;
      }
      this.takeVideoVisible = true;
      let url = "/sm/ivs/record/platform/start";
      let method = "POST";
      let obj = {
        cameraCode: this.player.deviceCamera.split("#")[0],
        domainCode: this.player.deviceCamera.split("#")[1],
        deviceName: this.player.deviceName,
        recordTime: interval
      };
      startRecord(
        url,
        method,
        obj
      )
        .then(res => {
          setTimeout(() => {
            this.isTabeVideoOn = false;
          }, interval * 1000);
          this.takeVideoUuid = res.data.uuid;
          localStorage.setItem(
            "takeVideoUuid",
            JSON.stringify(this.takeVideoForm.uuid)
          );
          this.isTabeVideoOn = true;
          this.$message.success("已开始录制");
          
        })
        .catch(err => {
          this.$message.error("录制失败", err);
        });
    },
    // 点击设置打开预置位
    openSettingPreset() {
      this.$refs.tabsRef.$refs.presetSetting.dialogVisible = true;
      this.settingNum++;
      let _this = this;
      let str2 = {"cmd":"cutting_window","x":1,"y": 1,"w": _this.vedioWidth * _this.deviceZoom,"h": _this.vedioHeight * _this.deviceZoom,"id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      _this.$store.state.socket.Csock.send(JSON.stringify(str2))
    },
    // 停止录像方法
    stopTakeVideo() {
      let url = "/sm/ivs/record/platform/stop";
      let method = "get";
      stopRecord(url, method, {
        cameraCode: this.player.deviceCamera.split("#")[0],
        domainCode: this.player.deviceCamera.split("#")[1],
        uuid: this.takeVideoUuid
      })
        .then(res => {
          
            this.isTabeVideoOn = false;
            this.$message.success("已停止录制");
            localStorage.removeItem(
              "takeVideoUuid",
              JSON.stringify(this.takeVideoUuid)
            );
          
        })
        .catch(err => {
          this.$message.error("结束录制请求失败", err);
        });
    },
    // 视频码流切换
    definition(val) {
      if (val) {
        // 标清format随意传一个字符串值
        this.$refs.videoPlayer.sendDevicePush("sd", false);
      } else {
        // 高清format不传值
        this.$refs.videoPlayer.sendDevicePush(null, false);
      }
    },
    // 抓拍方法
    snapShot() {
      printScreen(this.$refs.videoPlayer.$el);
    },
    // 平台抓拍
    snapShotRest() {
      let Surl = this.$store.getters.btnpremissAll[
        this.permission.postSnapPhoto
      ].url;
      let Smethod = this.$store.getters.btnpremissAll[
        this.permission.postSnapPhoto
      ].method;
      postSnapPhoto('/sm/ivs/snapshot/platform', 'get', {
        cameraCode: this.player.deviceCamera.split("#")[0],
        domainCode: this.player.deviceCamera.split("#")[1]
      }).then(res => {
        this.$message.success("抓拍成功");
      });
    },
    // 连拍方法
    snapShotArr() {
      let interval = 0;
      if (this.screenShotsForm.hour) {
        interval += this.screenShotsForm.hour * 60 * 60 * 1000;
      }
      if (this.screenShotsForm.min) {
        interval += this.screenShotsForm.min * 60 * 1000;
      }
      if (this.screenShotsForm.sec) {
        interval += this.screenShotsForm.sec * 1000;
      }
      if (this.screenShotsForm.count <= 1) {
        this.$message.error("连拍数量须大于1张");
        return;
      }
      if (this.screenShotsForm.count > 1 && !interval) {
        this.$message.error("请填写时间间隔");
        return;
      }
      this.shotPopVisible = !this.shotPopVisible;
      intervalPrintScreen(
        this.$refs.videoPlayer.$el,
        this.screenShotsForm.count,
        interval
      );
    },
    handleSetting(item, index) {
      this.otherSettings[index].isTag = !this.otherSettings[index].isTag;
      this.otherSettings[index].queryData.cameraCode = this.player.deviceCamera;
      this.otherSettings[index].queryData.withLock = this.lockButton;
      if (item.text === "雨刷") {
        
        this.urls =  this.permission.control.url;
        this.method = this.permission.control.method;
        if (this.otherSettings[index].isTag) {
        } else {
          this.otherSettings[index].queryData.ptzControlModeEnum =
            "PTZ_AUX_STOP";
        }
      }
      if (item.text === "灯光") {
        this.urls =  this.permission.control.url;
        this.method = this.permission.control.method;
        if (this.otherSettings[index].isTag) {
        } else {
          this.otherSettings[index].queryData.ptzControlModeEnum =
            "PTZ_AUX_STOP";
        }
      }
      if (item.text === "3D定位") {
        this.urls = this.$store.getters.btnpremissAll[
          this.permission.location
        ].url;
        this.method = this.$store.getters.btnpremissAll[
          this.permission.location
        ].method;
        if (this.otherSettings[index].isTag) {
          this.otherSettings[index].queryData.Interval = 2;
        } else {
          this.otherSettings[index].queryData.Interval = 1;
        }
      }
      if (item.text === "开始扫描") {
        this.topTitle = "请选择扫描时长";
        this.recordVal = item.text;
        this.dialogVisible = true;
        this.startScan = true;
        item.text = "停止扫描";
        return;
      } else if (item.text === "停止扫描") {
        this.otherSettings[index].isTag = !this.otherSettings[index].isTag;
        item.text = "开始扫描";
        this._StopScann();
        return;
      }
      if (item.text === "水平扫描") {
        this.urls =  this.permission.control.url;
        this.method = this.permission.control.method;
        if (this.otherSettings[index].isTag) {
          this.otherSettings[index].queryData.controlPara2 = "";
        } else {
          this.otherSettings[index].queryData.controlPara2 = "";
          this.otherSettings[index].queryData.ptzControlModeEnum = "PTZ_STOP";
        }
      }
      if (item.text === "垂直扫描") {
        this.urls =  this.permission.control.url;
        this.method = this.permission.control.method;
        if (this.otherSettings[index].isTag) {
          this.otherSettings[index].queryData.controlPara2 = "";
        } else {
          this.otherSettings[index].queryData.controlPara2 = "";
          this.otherSettings[index].queryData.ptzControlModeEnum = "PTZ_STOP";
        }
      }
      if (item.text === "光圈缩小") {
        this.urls =  this.permission.control.url;
        this.method = this.permission.control.method;
        if (this.otherSettings[index].isTag) {
          this.otherSettings[index].queryData.controlPara2 = this.value2;
        } else {
          this.otherSettings[index].queryData.controlPara2 = 0;
        }
      }
      if (item.text === "光圈放大") {
        this.urls =  this.permission.control.url;
        this.method = this.permission.control.method;
        if (this.otherSettings[index].isTag) {
          this.otherSettings[index].queryData.controlPara2 = this.value2;
        } else {
          this.otherSettings[index].queryData.controlPara2 = 0;
        }
      }
      if (item.text === "近焦") {
        this.urls =  this.permission.control.url;
        this.method = this.permission.control.method;
        if (this.otherSettings[index].isTag) {
          this.otherSettings[index].queryData.controlPara2 = this.value2;
        } else {
          this.otherSettings[index].queryData.controlPara2 = 0;
        }
      }
      if (item.text === "远焦") {
        this.urls =  this.permission.control.url;
        this.method = this.permission.control.method;
        if (this.otherSettings[index].isTag) {
          this.otherSettings[index].queryData.controlPara2 = this.value2;
        } else {
          this.otherSettings[index].queryData.controlPara2 = 0;
        }
      }
      item
        .url(this.urls, this.method, item.queryData)
        .then(res => {
          if (res.code === 200) {
          } else {
            this.$message.info(res.meta.message);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 暂停播放
    pauseplay() {
      const data = {
        enlarge: "",
        speed: ""
      };
      getPauseplayList(data)
        .then(res => {
          this.$message({
            message: "请求成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    updateBtnList(data) {
      //   this.btnList = data
    },
    // 预置位设置
    handleBtn(btn, index) {
      // if (this.lockButton && this.lockTitle === "已锁定") {
      //   this.$message({
      //     message: "已被" + this.lockOwenrName + "锁定不能操作",
      //     type: "warning"
      //   });
      //   return;
      // }
      this.btnActive = index;
      if (
        this.permission.control.url ===
        undefined
      )
        return;
      let url = this.permission.control.url;
      let method = this.permission.control.method;
      let obj = {
        cameraCode: this.player.deviceCamera,
        controlPara1: btn.presetIndex,
        controlPara2: "",
        ptzControlModeEnum: "PTZ_PREFAB_BIT_RUN",
        withLock: this.lockButton
      };
      getControl(url, method, obj)
        .then(res => {
          this.$message.success("预置位位置调用成功");
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    itoggle() {
      const pause = document.querySelector("#pause");
      const play = document.querySelector("#play");
      if (this.lockTitle === "已锁定") {
        pause.classList.remove("hide");
        play.classList.add("hide");
        this.st = true;
        return;
      } else {
        if (this.st) {
          // this.pauseplay()
          pause.classList.remove("hide");
          play.classList.add("hide");
          this.st = false;
          let str = {
            cmd: "pause",
            pause: false,
            wnd_index: 0,
            time: "2020-08-17 00:00:00.000",
            cmd_id: "001_1 ",
            id: "001"
          };
          this.$store.state.socket.Csock.send(JSON.stringify(str));
        } else {
          let str = {
            cmd: "pause",
            pause: true,
            wnd_index: 0,
            time: "2020-08-17 00:00:00.000",
            cmd_id: "001_1 ",
            id: "001"
          };
          this.$store.state.socket.Csock.send(JSON.stringify(str));
          play.classList.remove("hide");
          pause.classList.add("hide");
          this.st = true;
        }
      }
    },
    ihover(evt) {
      evt.target.classList.add("co");
    },
    // 点动模式
    clickSpot(index) {
      console.log("clickSpot", index);
    },
    emit(index) {
      if (this.lockTitle === "已锁定") {
        this.$message({
          message: "已被" + this.lockOwenrName + "锁定不能操作",
          type: "warning"
        });
        return;
      } else if (this.player.deviceId === "") {
        this.$message({
          message: "请选择设备"
        });
        return;
      }
      const data = {
        // deviceId: this.player.deviceId,
        // pan: '',
        // panSpeed: this.value2,
        // tilt: '',
        // tiltSpeed: this.value2,
        // zoom: '',
        // zoomSpeed: '',
        cameraCode: this.player.deviceCamera,
        // controlCode: '',
        controlPara1: "1",
        controlPara2: this.value2,
        ptzControlModeEnum: "PTZ_STOP",
        withLock: this.lockButton
      };
      if (index === "4") {
        data.tilt = 1;
        data.ptzControlModeEnum = "PTZ_UP";
      } else if (index === "3") {
        data.tilt = -1;
        data.ptzControlModeEnum = "PTZ_DOWN";
      } else if (index === "2") {
        data.pan = -1;
        data.ptzControlModeEnum = "PTZ_LEFT";
      } else if (index === "1") {
        data.pan = 1;
        data.ptzControlModeEnum = "PTZ_RIGHT";
      } else if (index === "6") {
        data.tilt = -1;
        data.pan = 1;
        data.ptzControlModeEnum = "PTZ_UP_RIGHT";
      } else if (index === "5") {
        data.tilt = 1;
        data.pan = 1;
        data.ptzControlModeEnum = "PTZ_DOWN_RIGHT";
      } else if (index === "8") {
        data.tilt = -1;
        data.pan = -1;
        data.ptzControlModeEnum = "PTZ_UP_LEFT";
      } else if (index === "7") {
        data.tilt = 1;
        data.pan = -1;
        data.ptzControlModeEnum = "PTZ_DOWN_LEFT";
      }
      let url = this.permission.control.url;
      let method = this.permission.control.method;
      getControl(url, method, data)
        .then(res => {
          if (res.code === 200) {
          } else {
            this.$message.info(res.meta.message);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    emitup(index) {
      if (
        (this.lockTitle === "已锁定" &&
          this.lockOwenr !== this.$store.state.user.name) ||
        this.lockTitle === "抢占"
      ) {
        return;
      }
      const data = {
        // deviceId: this.player.deviceId,
        // pan: '',
        // panSpeed: 0,
        // tilt: '',
        // tiltSpeed: 0,
        // zoom: '',
        // zoomSpeed: '',
        cameraCode: this.player.deviceCamera,
        controlPara1: "",
        controlPara2: "",
        ptzControlModeEnum: "PTZ_STOP",
        withLock: this.lockButton
      };
      // if (index === '4') {
      //   data.tilt = 1
      //   data.ptzControlModeEnum="PTZ_UP"
      // } else if (index === '3') {
      //   data.tilt = -1
      //   data.ptzControlModeEnum="PTZ_DOWN"
      // } else if (index === '2') {
      //   data.pan = -1
      //   data.ptzControlModeEnum="PTZ_LEFT"
      // } else if (index === '1') {
      //   data.pan = 1
      //   data.ptzControlModeEnum="PTZ_RIGHT"
      // } else if (index === '6') {
      //   data.tilt = -1
      //   data.pan = 1
      //   data.ptzControlModeEnum="PTZ_UP_RIGHT"
      // } else if (index === '5') {
      //   data.tilt = 1
      //   data.pan = 1
      //   data.ptzControlModeEnum="PTZ_DOWN_RIGHT"
      // } else if (index === '8') {
      //   data.tilt = -1
      //   data.pan = -1
      //   data.ptzControlModeEnum="PTZ_UP_LEFT"
      // } else if (index === '7') {
      //   data.tilt = 1
      //   data.pan = -1
      //   data.ptzControlModeEnum="PTZ_DOWN_LEFT"
      // }
      let url = this.permission.control.url;
      let method = this.permission.control.method;
      getControl(url, method, data)
        .then(res => {
          if (res.code === 200) {
          } else {
            this.$message.info(res.meta.message);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    timeOnitor() {
      this.rightB = true;
      this.historyV = false;
      this.historyI = false;
    },
    historyVideo() {
      this.historyV = true;
      this.historyI = false;
      this.rightB = false;
      this.$router.push({
        path: "/historyVideo",
        query: {
          player: this.player,
          type: 1
        }
      });
    },
    historyImage() {
      this.historyI = true;
      this.historyV = false;
      this.rightB = false;
      this.$router.push({
        path: "/snapPhotoWall",
        query: {
          player: this.player,
          type: 1
        }
      });
    },

    onTimeChange(video) {
      this.video = video;
    },
    goBack() {
      this.$router.back();
    },
    downloadPlugin() {
      downloadPluginByUrl()
        .then(res => {
          downloadPlugin(res, "StreamServiceSetup", "exe");
        })
        .catch(err => {
          this.$message.error(`下载插件失败！${err}`);
        });
    },
    // 云台锁定按钮事件
    lock() {
      // this.recordVal = '已锁定'
      // this.topTitle = '请选择锁屏时长'
      // if (this.player.deviceId === '') {
      //   this.$message({
      //     message: '请选择设备'
      //   })
      //   return
      // }
      // if(this.lockTitle === '抢占'){
      //   this.yunTaiData = {
      //     cameraCode: this.player.deviceCamera,
      //     controlPara1: "",
      //     controlPara2: "",
      //     ptzControlModeEnum: "PTZ_LOCK",
      //     withLock: this.lockButton
      //   }
      //   let url = this.$store.getters.btnpremissAll[this.permission.lockList].url
      //   let method = this.$store.getters.btnpremissAll[this.permission.lockList].method
      //   getLockList(url,method,this.yunTaiData)
      //     .then(res => {
      //       if (res.data.success) {
      //         this.lockTitle = '已解锁'
      //         this.lockButton = true
      //       } else {
      //         this.$message({
      //           message: '已被' + res.data.ptzLock.lockOwnerName + '锁定不能操作',
      //           type: 'warning'
      //         })
      //       }
      //     })
      //     .catch(err => {
      //       this.$message.error(err)
      //     })
      //   return
      // }
      if (this.lockButton) {
        // this.dialogVisible = true
        // this.value3= 'Sat Jan 01 2000 00:00:00 GMT+0800 (中国标准时间)'
        this.yunTaiData = {
          cameraCode: this.player.deviceCamera,
          controlPara1: "",
          controlPara2: "",
          ptzControlModeEnum: "PTZ_UNLOCK",
          withLock: false
        };
        let url = this.permission.control.url;
      let method = this.permission.control.method;
        getControl(url, method, this.yunTaiData)
          .then(res => {
            this.lockTitle = "未锁定";
            this.lockButton = false;
          })
          .catch(err => {
            this.$message.error(err);
          });
      } else {
        this.yunTaiData = {
          cameraCode: this.player.deviceCamera,
          controlPara1: "",
          controlPara2: "",
          ptzControlModeEnum: "PTZ_LOCK",
          withLock: false
        };
        let url = this.permission.control.url;
        let method = this.permission.control.method;
        getControl(url, method, this.yunTaiData)
          .then(res => {
            this.lockTitle = "已锁定";
            this.lockButton = true;
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
    },
    //
    confirm() {
      this.dialogVisible = false;
      this.yunTaiData.time =
        this.value3.getSeconds() +
        this.value3.getMinutes() * 60 +
        this.value3.getHours() * 60 * 60;
      const timer = this.yunTaiData.time * 1000;
      if (this.recordVal === "已解锁") {
        setTimeout(() => {
          this.lockButton = true;
          this.lockTitle = "已解锁";
        }, timer);
        this.yunTaiData = {
          deviceId: this.player.deviceId,
          status: true,
          time: this.yunTaiData.time,
          timeUnit: "",
          ptzControlModeEnum: "PTZ_UNLOCK",
          withLock: this.lockButton
        };
        let url = this.$store.getters.btnpremissAll[this.permission.lockList]
          .url;
        let method = this.$store.getters.btnpremissAll[this.permission.lockList]
          .method;
        getLockList(url, method, this.yunTaiData)
          .then(res => {
            this.lockOwenr = res.data.ptzLock.lockOwner;
            this.lockOwenrName = res.data.ptzLock.lockOwnerName;
            if (res.data.success) {
              this.lockButton = false;
              this.lockTitle = "已锁定";
              this.$message({
                message:
                  "已被" + res.data.ptzLock.lockOwnerName + "锁定不能操作",
                type: "warning"
              });
            } else if (res.data.ptzLock === null) {
              this.$message({ message: "设备不存在", type: "warning" });
            } else {
              this.lockButton = false;
              this.lockTitle = "已锁定";
              this.$message({
                message:
                  "已被" + res.data.ptzLock.lockOwnerName + "锁定不能操作",
                type: "warning"
              });
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
      if (this.recordVal === "开始扫描") {
        this.scanData = {
          deviceId: this.player.deviceId,
          scanGroupNum: "1",
          scanSpeed: this.value2,
          time: this.yunTaiData.time
        };
        let url = this.$store.getters.btnpremissAll[this.permission.startScan]
          .url;
        let method = this.$store.getters.btnpremissAll[
          this.permission.startScan
        ].method;
        getHorizontalList(url, method, this.scanData)
          .then(res => {
            this.otherSettings[4].isTag = !this.otherSettings[4].isTag;
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
    },
    // 开始说话
    talk() {
      if (this.player.deviceId) {
        if (
          (!this.lockButton &&
            this.lockOwenr !== this.$store.state.user.name) ||
          this.lockTitle === "抢占"
        ) {
          this.$message({
            message: "已被" + this.lockOwenrName + "锁定不能操作",
            type: "warning"
          });
          return;
        }
        if (!this.canTalk()) {
          this.$message({
            type: "error",
            message:
              "由于浏览器安全策略, 非 HTTPS 或 非 localhost 访问, 对讲不可用！",
            duration: 5000
          });
          return;
        }
      } else {
        this.$message({
          message: "请选择设备"
        });
        return;
      }

      if (!this.isTalking) {
        if (!this.player.deviceId || !this.player.deviceId) {
          this.$message.warning("请选择设备");
          return;
        }
        window.LiveRecorder.get(
          (rec, err) => {
            if (err) {
              this.$alert("请插入麦克风!", "提示", {
                confirmButtonText: "确定",
                type: "warning",
                callback: action => {
                  this.voiceButton = false;
                  this.voiceTitle = "点击进行通话";
                }
              });
              return;
            }
            this.recorder = rec;
            this.recorder.start();
            const { deviceId } = this.player;
            let canVoiceInterCom = true;
            let url = this.$store.getters.btnpremissAll[
              this.permission.voiceInterCom
            ].url;
            let method = this.$store.getters.btnpremissAll[
              this.permission.voiceInterCom
            ].method;
            voiceInterCom(url, method, { deviceId })
              .then(res => {
                if (res.code === 200) {
                  let obj = {};
                  obj.ssrc = res.data.ssrc;
                  obj.mediaSdp = res.data.mediaSdp;
                  obj.deviceSdp = res.data.deviceSdp;
                  this.deviceData.list.push(obj);
                  this.ZLServerIp = res.data.mediaIp;
                  if (!this.ws) {
                    const talkURL = this.wsTalkURL();
                    if (!talkURL) return;
                    const ws = new WebSocket(talkURL);
                    ws.onopen = evt => {
                      console.log("ws talk open");
                      this.ws = ws;
                      this.voiceButton = true;
                      this.isTalking = true;
                      this.$message.success("连接设备成功，请开始讲话");
                      this.voiceTitle = "通话中...再次点击结束通话";
                      this.ws.send(JSON.stringify(this.deviceData));
                    };
                    ws.onclose = evt => {
                      console.log("ws talk close");
                      this.deviceData = {
                        list: []
                      };
                      this.ws = null;
                    };
                    ws.onerror = evt => {
                      console.log("ws talk error", evt);
                      this.$message.error("连接设备失败！请稍后重试");
                    };
                  }
                } else {
                  this.$message.info("设备繁忙，请稍后再试！");
                  canVoiceInterCom = false;
                }
              })
              .catch(err => {
                console.log(err);
              });
            if (!canVoiceInterCom) return;
            if (this.recorder) {
              this.recorder.start();
              return;
            }
          },
          {
            sampleBits: 16,
            sampleRate: 16000,
            pcmCallback: pcm => {
              const reader = new window.FileReader();
              reader.onloadend = () => {
                const base64 = reader.result.split(",")[1];
                if (this.ws) {
                  this.ws.send(base64);
                }
              };
              reader.readAsDataURL(pcm);
            }
          }
        );
      } else {
        this.$confirm(`您确定要结束通话?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.isTalking = false;
            this.voiceButton = false;
            this.voiceTitle = "通话结束";
            setTimeout(() => {
              this.voiceTitle = "点击进行通话";
            }, 1000);
            this.stopTalk();
          })
          .catch(() => {
            this.$message.info("已取消");
          });
      }
    },
    // 是否支持录音
    canTalk() {
      return (
        window.location.protocol.indexOf("https") === 0 ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      );
    },
    wsTalkURL() {
      let protocal = "ws:";
      let port = "8090";
      let wsUrl = "";
      if (window.location.protocol.startsWith("https")) {
        // wsUrl = `${protocal}//${this.ZLServerIp}:${port}?ssrc=${this.ssrc}&deviceSdp=${this.deviceSdp}&mediaSdp=${this.mediaSdp}&type=pcm&circleTimes=1`
        wsUrl = `${protocal}//${
          this.ZLServerIp
        }:${port}?type=pcm&circleTimes=1`;
      }
      if (window.location.protocol.startsWith("http")) {
        // wsUrl = `${protocal}//media.zmlmedia.com:${port}?ssrc=${this.ssrc}&deviceSdp=${this.deviceSdp}&mediaSdp=${this.mediaSdp}&type=pcm&circleTimes=1`
        wsUrl = `${process.env.VUE_APP_WS_AUDIO_API}?type=pcm&circleTimes=1`;
      }

      return window.encodeURI(wsUrl);
    },
    // 放大按钮事件
    narrowOut() {
      // this.voiceButton = false
      // this.narrowButton = true
      // this.enlargeButton = false
      // if(!this.lockButton && this.lockOwenr !== this.$store.state.user.name || this.lockTitle === '抢占'){
      // if(!this.lockButton && this.lockOwenr !== this.$store.state.user.name || this.lockTitle === '抢占'){
      //   debugger
      //   this.narrowButton = false
      //   this.$message({
      //     message: '已被'+ this.lockOwenrName +'锁定不能操作',
      //     type: 'warning'
      //   })
      //   return
      // }
      if (this.lockButton && this.lockTitle === "已锁定") {
        this.$message({
          message: "已被" + this.lockOwenrName + "锁定不能操作",
          type: "warning"
        });
        return;
      }
      const obj = {
        // deviceId: this.player.deviceId,
        // pan: 0,
        // panSpeed: 0,
        // tilt: 0,
        // tiltSpeed: 0,
        // zoom: 1,
        // zoomSpeed: this.value2,
        cameraCode: this.player.deviceCamera,
        controlPara1: "2",
        controlPara2: this.value2,
        ptzControlModeEnum: "PTZ_LENS_ZOOM_IN",
        withLock: this.lockButton
      };
      let url = this.permission.control.url;
      let method = this.permission.control.method;
      getControl(url, method, obj)
        .then(res => {})
        .catch(err => {
          this.$message.error(err);
        });
    },
    narrowIn() {
      this.voiceButton = false;
      this.narrowButton = false;
      this.enlargeButton = false;
      // if(!this.lockButton && this.lockOwenr !== this.$store.state.user.name || this.lockTitle === '抢占') return
      if (this.lockButton && this.lockTitle === "已锁定") {
        this.$message({
          message: "已被" + this.lockOwenrName + "锁定不能操作",
          type: "warning"
        });
        return;
      }
      const obj = {
        // deviceId: this.player.deviceId,
        // pan: 0,
        // panSpeed: 0,
        // tilt: 0,
        // tiltSpeed: 0,
        // zoom: 0,
        // zoomSpeed: 0,
        cameraCode: this.player.deviceCamera,
        controlPara1: "",
        controlPara2: "",
        ptzControlModeEnum: "PTZ_STOP",
        withLock: this.lockButton
      };
      let url = this.permission.control.url;
      let method = this.permission.control.method;
      getControl(url, method, obj)
        .then(res => {})
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 缩小按钮事件
    enlargeOut() {
      this.voiceButton = false;
      this.narrowButton = false;
      this.enlargeButton = true;
      // if(!this.lockButton && this.lockOwenr !== this.$store.state.user.name || this.lockTitle === '抢占'){
      //   this.enlargeButton = false
      //   this.$message({
      //     message: '已被'+ this.lockOwenrName +'锁定不能操作',
      //     type: 'warning'
      //   })
      //   return
      // }
      if (this.lockButton && this.lockTitle === "已锁定") {
        this.$message({
          message: "已被" + this.lockOwenrName + "锁定不能操作",
          type: "warning"
        });
        return;
      }
      const obj = {
        // deviceId: this.player.deviceId,
        // pan: 0,
        // panSpeed: 0,
        // tilt: 0,
        // tiltSpeed: 0,
        // zoom: -1,
        // zoomSpeed: this.value2,
        cameraCode: this.player.deviceCamera,
        controlPara1: "2",
        controlPara2: this.value2,
        ptzControlModeEnum: "PTZ_LENS_ZOOM_OUT",
        withLock: this.lockButton
      };
      let url = this.permission.control.url;
      let method = this.permission.control.method;
      getControl(url, method, obj)
        .then(res => {})
        .catch(err => {
          this.$message.error(err);
        });
    },
    enlargeIn() {
      this.voiceButton = false;
      this.narrowButton = false;
      this.enlargeButton = false;
      // if(!this.lockButton && this.lockOwenr !== this.$store.state.user.name || this.lockTitle === '抢占') return
      if (this.lockButton && this.lockTitle === "已锁定") {
        this.$message({
          message: "已被" + this.lockOwenrName + "锁定不能操作",
          type: "warning"
        });
        return;
      }
      const obj = {
        // deviceId: this.player.deviceId,
        // pan: 0,
        // panSpeed: 0,
        // tilt: 0,
        // tiltSpeed: 0,
        // zoom: 0,
        // zoomSpeed: 0,
        cameraCode: this.player.deviceCamera,
        controlPara1: "",
        controlPara2: "",
        ptzControlModeEnum: "PTZ_STOP",
        withLock: this.lockButton
      };
      let url = this.permission.control.url;
      let method = this.permission.control.method;
      getControl(url, method, obj)
        .then(res => {})
        .catch(err => {
          this.$message.error(err);
        });
    },
    doChannelSelect(data) {
      console.log(data, "hah");
      // if (data.state === 1) {
      this.player.deviceId = data.deviceId;
      this.player.deviceName = data.name;
      this.player.protocol = data.protocol;
      this._getLockState();
      this._getDevInformation(); //查询设备信息
      // localStorage.removeItem('deviceData')
      // localStorage.setItem('deviceData', JSON.stringify(this.player))
      // if (this.activeName === '0' || this.activeName === '1') {
      this.getPerSet();
      this.getUuid();
      // }
      // }
    },
    closePlay() {
      this.player.deviceId = "";
      this.zoomRectFlag = false;
    },
    stopTalk() {
      if (this.recorder) {
        this.recorder.stop();
      }
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    },
    myMust() {
      if (
        this.player.deviceId &&
        this.lockOwenr !== this.$store.state.user.name
      ) {
        this.$message({
          message: "已被" + this.lockOwenrName + "锁定不能操作",
          type: "warning"
        });
      } else if (this.player.deviceId === "") {
        this.$message({
          message: "请选择设备"
        });
      } else if (this.lockOwenr === this.$store.state.user.name) {
        var myMust = document.getElementsByClassName("myMust");
        myMust[0].style.display = "none";
      }
    },
    // 删除时间段
    deleteTime(ite) {
      this.timeList = this.timeList.filter(item => item != ite);
    },
    // 添加事件段
    addTime() {
      let startTime = "";
      let endTime = "";
      let tempArr = [];
      if (this.form.time && !validateString(this.form.time)) {
        startTime = this.form.time[0];
        endTime = this.form.time[1];
        if (this.timeList.length == 0) {
          this.timeList.push({
            startTime: startTime,
            endTime: endTime
          });
          return;
        }
        tempArr = JSON.parse(JSON.stringify(this.timeList));
        if (
          tempArr.every(item => {
            return (
              compareTime(endTime, item.startTime) ||
              compareTime(item.endTime, startTime)
            );
          })
        ) {
          this.timeList.push({
            startTime: startTime,
            endTime: endTime
          });
        } else {
          this.$message.error("所选时间段不能重复");
        }
      } else {
        this.$message.error("请选择有效的时间段");
      }
    },
    // 查询设备及子设备的信息
    _getDevInformation() {
      // deviceInformation:{url: "/pm/device/camera/{code}", method: "GET"}
      let url = "/pm/device/camera";
      let method = "GET";
      let devData = {
        url: `${url}/${this.player.deviceCamera}`,
        method
      };
      getInformation(devData)
        .then(res => {
          if (res.code === 200) {
            this.mobileDevice = res.data.type;
            if (res.data.type !== "球机") {
              this.rightB = false;
              // this.$message.info("非球机无法操作");
            }
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 改变播放类型
    changePlayType() {
      let obj = { ...this.player };
      this.player = { ...obj };
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/variables";
.video-web-right-box-1 {
  float: left !important;
  position: relative;
}
.video-web-left-box-1 {
  float: right !important;
}
.app-container-bow {
  .title {
    text-align: center;
    height: 34px;
    line-height: 34px;
  }
  .float-left {
    float: left;
    
  }
}
  ::v-deep .el-button{
    vertical-align: middle !important;
  }
.code-rate {
  margin-left: 10px;
  width: 90px;
}
.small-select {
  width: 100px;
}
.center {
  text-align: center;
}
.video-area {
  text-align: center;
}
$video-width: 1350px;
// .video-box {
//   width: $video-width;
//   max-height: 750px;
//   margin: -5px 0 0px -15px;
//   text-align: center;
//   overflow: hidden;
//   display: inline-block;

// }
.monitor-area {
  text-align: center;
  position: absolute;
  bottom: 10px;
  width: 93%;

  .monitor-menu {
    width: 80%;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      margin-left: -10px;
      .historyBtn {
        background-color: #206aff;
        color: #ffffff;
      }
    }
    .right {
      display: flex;
      margin-right: 10px;
      & > .el-button {
        margin-left: 10px;
        color: #ffffff;
        background-color: #206aff;
      }
    }
    // .popover {
    //   height: 36px;
    //   color: $color-font-text-btn;
    //   font-size: $size-font-normal;
    //   background-color: $color-normal;
    //   border-radius: $size-border-radius;
    //   display: flex;
    //   .el-button {
    //     border-radius: 0;
    //     border: 0;
    //     height: 36px;
    //     background-color: $color-normal;
    //     color: $color-font-text-btn;
    //     &.commit-btn {
    //       border-top-left-radius: $size-border-radius;
    //       border-bottom-left-radius: $size-border-radius;
    //       border: 1px solid $color-border-2;
    //     }
    //     &.pop-btn {
    //       border-top-right-radius: $size-border-radius;
    //       border-bottom-right-radius: $size-border-radius;
    //       border: 1px solid $color-border-2;
    //       border-left: 0;
    //     }
    //   }
    //   & .el-button.is-disabled,
    //   & .el-button.is-disabled:focus,
    //   & .el-button.is-disabled:hover {
    //     border-color: transparent !important;
    //     //color: $color-font-disabled !important;
    //     background-color: $color-disabled !important;
    //   }
    // }
  }
}

// .right-button {
//   height: $main-container;
// }
.remoteControl {
  // width: 200px;
  // height: 200px;
  // background-color: #f2f2f2;
  border-radius: 50%;
  /*转盘背景*/
  #zhuan {
    height: 200px;
    // background-color: #fff;
  }
  #zhuan path {
    transition: all 1s ease;
    cursor: pointer;
    cursor: move;
  }
  #zhuan .co:hover {
    fill: transparent;
  }
  #zhuan .hide {
    display: none;
  }
  #zhuan .show {
    display: block;
  }
}
.steam {
  text-align: center;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.right-button {
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  .el-button {
    margin-left: 0;
    margin-right: 10px;
    min-width: 40px;
    height: 40px;
    padding-left: 0;
    padding-right: 0;
    margin-bottom: 10px;
  }
  .menu-item {
    margin-bottom: 20px;
    .menu-item-title {
      // color: $color-font-text-btn;
      // border-bottom: 1px solid $color-border-container;
      padding-bottom: 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      font-weight: 600;
    }
  }
  .mobileDevices {
    // margin-bottom: $space-size-small;
    .title {
      margin-left: 0;
      // color: $color-font-text-btn;
      // border-bottom: 1px solid $color-border-container;
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      font-weight: 600;
    }
    .powerOn {
      .add {
        span {
          cursor: pointer;
        }
      }
      p {
        color: #fff;
        font-size: 10px;
      }
      .el-icon-circle-plus-outline {
        font-size: 20px;
        color: #206aff;
      }
      .el-icon-delete {
        font-size: 15px;
        color: #206aff;
      }
      .timeSlot {
        height: 70px;
        overflow: auto;
        .no-redirect {
          color: #206aff;
          padding-right: 20px;
          font-size: 14px;
        }
        .el-icon-delete {
          cursor: pointer;
        }
        .el-form-item--small.el-form-item {
          margin-bottom: 0;
        }
      }
      .openBtn {
        text-align: center;
        .video-web-danger-btn {
          width: 30%;
          .el-icon-switch-button {
            font-size: 23px;
            font-weight: 600;
          }
        }
      }
    }
  }
  .set {
    position: relative;
    .myMust {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 9990;
    }
    ::v-deep .el-tabs__nav-next {
      margin-top: 13px !important;
    }
    ::v-deep .el-tabs__nav-prev {
      margin-top: 13px !important;
    }
    .call {
      width: 27%;
      // height: 40px;
      border-radius: 4px;
      border: solid 1px #d3dbeb;
      line-height: 25px;
      float: right;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .setButton {
      // width: 100%;
      height: 100%;
      flex-wrap: wrap;
      text-align: left;
      .el-button {
        margin-left: 0;
        margin-right: 10px;
        margin-bottom: 10px;
        min-width: 40px;
        height: 40px;
        padding-left: 0;
        padding-right: 0;
      }

      .tag-close {
        // background:$color-disabled;
        background: #373b58;
      }
      span {
        width: 15%;
        height: 36px;
        margin: 5px;
        display: block;
        background-color: #d1d1d1;
        border-radius: 4px;
        text-align: center;
        line-height: 46px;
        // &.active{
        //   background-color: #3377ff;
        // }
      }
      span:hover {
        cursor: pointer;
      }
    }
    .preset-seat li {
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      padding: 0 80px 0 10px;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      border-radius: 5px;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}

.el-icon-circle-plus-outline,
.el-icon-remove-outline {
  font-size: 23px;
  color: #fff;
}
::v-deep .el-tabs__nav-scroll {
  margin-top: 15px;
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
::v-deep .el-tabs__active-bar {
  display: none;
}

.myAutoButton {
  background: #3377ff;
  color: white;
}
.backImage {
  width: 25px;
  height: 11px;
  margin-left: 30px;
}
.rightBox {
  cursor: not-allowed;
  pointer-events: none;
  height: inherit;
  opacity: 0.2;
}
.relatives {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #afb9d0;
  font-size: 20px;
  z-index: 999;
  font-weight: 700;
      width: min-content
}
.videoArea{
  height: calc(100vh - 100px) !important;
}
</style>
