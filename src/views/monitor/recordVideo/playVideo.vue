<template>
  <div class="main">
    <div class="flex">
      <div class="left-masks">
        <div class="video-web-form-box video-web-flex">
          <el-button
            class="video-web-text-btn"
            type="text"
            @click="goBack"
          ><i class="el-icon-d-arrow-left" /> 返 回</el-button>
         
        </div>
        <main>
          <div id="vedioBoxs">
            <div class="functionMenu">
              <div>
                <div class="video-web-content-title" style="height:40px;text-align: center;">{{ equipment.deviceName }}<span style="margin-left: 40px;">录像回放</span> </div>
              </div>
              <div style="width: 85vw; height: 73vh">
                <VideoPlayerGroup 
                    ref="videoPlayerGroup"
                />
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
</div>
</template>

<script>

import { getToken } from '@/utils/auth'
import { QueryData } from '@/api/configure/argumentsConfigure.js'
import Moment from 'moment'
import { treeData, getDeviceInfoById, getIvsPlayer, getDeviceCriteria } from '@/api/system/organization'
export default {
  components: {
  },
  props: {
    equipment: {
      type: Object,
      default: function() {
        return {}
      }
    },
    lengths: {
      type: Number,
      default:()=>{
        return 1
      }
    }
  },
  data() {
    return {
      dialogArr: [], // 局部放大的数组 最多3个
      videoListShow: false, // 视频列表的展示
      videoList: [], // 视频列表的表格
      uuid: '', // 录像时返回的uuid 结束录像时调用
      playTimeYYR: '', // 当前播放视频的年月日
      playerStartTime: 0, // 保存一份跳转的秒，拉回数据后直接从当前秒开始播放 s
      playerNowTime: '', // 当前播放的时间 s 根据这个变时间轴
      forwardS: 0, // 每一段向前跳转的秒
      playerNowTimeSlot:{}, // 当前播放的时间段
      playerNowTimeIndex: 0, // 当前播放的时间段的index
      playBLoading: false,
      mySsrc: '', // ssrc
      myId:{
        deviceId: '',
        channelId: ''
      },
      ssrc:'',
      streamType:'rtp',
      baseMediaUrl: '', // 流媒体的ip地址
      playButton: true, // 切换播放暂停按钮
      warningSearchForm: { // 搜索框的内容
        time: [new Date(2021, 1, 1, 0, 0, 0), new Date(2021, 1, 1, 23, 59, 59)],
        content: ''
      },
      msrksSize: 0, // 总书签数量
      warningSize: '', // 告警数量
      msrksSpan: [], // 时间轴的书签data
      warningSpan: [],// 告警data
      isTabeVideoOn: true, // 录制的按钮能不能点
      takeVideoVisible: false, // 录像的控制时长的弹框
      takeVideoForm: { // 控制录制时间
        day: 90,
        hour: 0,
        min: 30,
        sec: 0
      },
      dialogMarks: false, // 新增书签的dialog展示
      marksform: { // 书签的表单
        time: '',
        content: ''
      },
      putMarksShow: false, // 修改书签的dialog展示
      putMarksFrom: {
        id: '',
        descption: '',
        updateTime: ''
      },
      popoverShow: false, // 多抓的展示
      snapForm: { // 多抓的时间间隔和抓拍张数
        hour: 0,
        min: 0,
        sec: 0.1,
        size: 10
      },
      playerUrl: '', // 当前播放的url地址
      dateValue: {
        content: "",
        time: "",
      }, // 绑定的日期
      timeValue: new Date(2021, 1, 1, 0, 0, 0), // 绑定的时间
      multipleValue: 1, // 绑定的倍数
      sliderValue: [], // 时间轴
      SJZTHM: '', // 时间轴滑块的位置时间 分秒 01：50
      stepNumber: 1 / 60, // 时间轴的数字
      maxNumber: 24, // 时间轴的最大数字
      noVideoBox:[], // 视频列表里  没有的视频
      loading: null, // loding窗口的控制
      TimeInterval:null, // 定时器
      zoomRectFlag: true,
      widowWidth: window.screen.width,
      widowHeight: window.screen.width,
      vedioTop:'',
      vedioLeft:'',
      vedioWidth:'',
      vedioHeight:'',
      deviceZoom:''
    }
  },
  mounted() {
    // this.intoPage(new Date(new Date(new Date().toLocaleDateString()).getTime() - 86400000)) // 初始化数据
    setTimeout(()=>{
      this.goPlayer()
    },1000)
  },
    //离开页面时一定要销毁不然会出问题
  beforeDestroy(){
    this.$refs['videoPlayerGroup'].release()
  },
  methods: {
    // 播放录像
    goPlayer() {
      let dateTimeStr = "2013-02-23 08:12:23";
      let splitDateTime = dateTimeStr.replace(/[- :]/g, "");
      let cameraInfo = {
          cameraId: this.equipment.deviceId,
          cameraName: this.equipment.deviceName,
          isPTZControlVisible: false,
          beginTime: this.equipment.startTime,
          endTime: this.equipment.endTime,
      }
      console.log(cameraInfo,"cameraInfocameraInfocameraInfo")
      this.$refs['videoPlayerGroup'].playVideoBack(cameraInfo)
    },
    goBack(){
      this.$emit('goBack')
    },
    closVideo(){
      this.$refs['videoPlayerGroup'].release()
    }
    
  },
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles/variables';
$tags-size:15px;
  ::v-deep .el-date-range-picker{
   width: 520px !important;
   min-width: 520px !important;
 }
 #vedioBoxs{
   display: flex;
 }
 .main {
  .goBack {
    position: absolute;
    top: 5px;
    left: 25px;
    font-size: 18px;
    z-index: 1000;
  }
  main {
    width: 100%;
    margin: 0 auto;

    .player {
      margin: 0 auto;
      margin-top: 20px;
      background: rgba(128, 128, 128, 1);
      border: 1px solid #20449c;
      max-height: 575px;
      max-width: 1020px;
      position: relative;

    }
    .functionMenu {
      // position: absolute;
      // line-height: 50px;
      // margin: 0 auto;
      // max-width: 1020px;
      // width: 400px;
      // height: 80px;
      // flex-direction: column;
      // display: flex;
      .allButton1,.allButton2,.allButton6,.allButton7{
        border-radius: 5px;
        overflow: hidden;
        display: flex;
        button{
          float: left;
          margin: 0;
        }
      }
      .allButton6,.allButton7{
        button{
          margin-right: 1px;
        }
      }
      .allButton1,.allButton3,.allButton4{
        margin:0 20px;
      }
      .zhuaPai{
        display: flex;
        border-radius: 5px;
        background: #1a3376;
        border: 1px solid #206aff;
        ::v-deep .el-button {
          width: 22px;
          height: 31px;
          font-size: 18px;
          padding: 2px 2px;
          background-color: #1a3376;
          color:#206aff;
          border: none;
        }
      }
    }
    ::v-deep .el-dialog{
      width: 500px;
    }
  }
  .left-masks{
    width:100%;
    // margin-right: 10px;
    .topButton{
      color: white;
      width: 300px;
      height: 34px;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      button{
        font-size: 16px;
      }
      .tag-num{
        position: relative;
        margin: 1px;
        cursor: pointer;
        width: 130px;
        height: 34px;
        font-size:18px;
        border: 1px solid $color-font-placeholder;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .sum{
          color:$color-font-text-btn;
        }
        .warning{
          color:$color-font-danger;
        }
        em.left-top,
        em.left-bottom {
            position: absolute;
            left: 0;
            &::before,
            &::after {
                content: '';
                position: absolute;
                background: $color-font-text-btn;
            }
            &::before {
                width: $tags-size;
                height: 3px;
                left: 0;
            }
            &::after {
                width: 3px;
                height: $tags-size;
                left: -2px;
            }
        }
        em.right-top,
        em.right-bottom {
            position: absolute;
            right: 0;
            &::before,
            &::after {
                content: '';
                position: absolute;
                background: $color-font-text-btn;
            }
            &::before {
                width: $tags-size;
                height: 3px;
                right: 0;
            }
            &::after {
                width: 3px;
                height: $tags-size;
                right: -2px;
            }
        }
        em.left-top {
            top: 0;
            &::before,
            &::after {
                top: -2px;
            }
        }
        em.right-top {
            top: 0;
            &::before,
            &::after {
                top: -2px;
            }
        }
        em.left-bottom {
            bottom: 0;
            &::before,
            &::after {
                bottom: -2px;
            }
        }
        em.right-bottom {
            bottom: 0;
            &::before,
            &::after {
                bottom: -2px;
            }
        }
      }
    }
  }
  .flex{
    display: flex;
  }
  .video-web-text-btn{
    font-size: 16px;
  }
  .localVideo{
    margin: 0 auto;
    width: 400px;
    height: 250px;
    overflow: hidden;
    position: relative;

    .videocon{
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .video-web-tabs.el-tabs{
    height: 100%;
  }

  .padding-10{
    padding: 10px;
  }

}

</style>
<style>
::v-deep .el-date-range-picker{
   width: 520px !important;
   min-width: 520px !important;
 }
.tempDiv {
  /* border: 1px dashed blue; */
  background: #5a72f8;
  width: 0;
  height: 0;
  position: fixed;
  /* filter: alpha(opacity:10); */
  opacity: 0.7;
}
.main .footer{
  position: absolute;
  bottom: 0;
}
</style>
