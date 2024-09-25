<template>
  <div class="video-player">
    <img src="./assets/video.png" v-show="locationInfo.show" />
  </div>
</template>

<script>
import { Logger } from "./error";
import { VideoMode } from './common'
export default {
  props: ["client", "webUid", "dialogId", "locationInfo", "screenLeft", "screenTop", "windowIndex"],
  data() {
    return {
      streamType: 1,
      curSpeed: 0,
      cameraInfo: null,
      isPlaying: false,
      hasCameraInfo: false,
      currentWindowMode: 0,
      logger: new Logger("video-player"),
      captureParamForm: null,
      videoParamForm: null
    };
  },
  watch: {
    screenLeft() {
      this.updateWindowLocation()
    },
    screenTop() {
      this.updateWindowLocation()
    }
  },
  created() {
    this.getParamConfig()
  },
  mounted() {
    document.addEventListener("visibilitychange", this.handelVisibilityChange)
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.handelVisibilityChange)
  },
  methods: {
    // 获取参数配置
    getParamConfig() {
      this.captureParamForm = JSON.parse(localStorage.getItem("avs_capture_param"))
      this.videoParamForm = JSON.parse(localStorage.getItem("avs_video_param"))
    },
    getCameraInfo() {
      return {
        ...this.cameraInfo,
        currentWindowMode: this.currentWindowMode,
        streamType: this.streamType,
        dialogId: this.dialogId,
        webUid: this.webUid,
        isPlaying: this.isPlaying,
        windowIndex: this.windowIndex,
        speed: this.curSpeed
      }
    },
    /**
     * 实时预览
     * @param {Object} cameraInfo 摄像机信息
     * @param {number} streamType 1：主码流 2: 子码流 
     */
    realTimePlay(cameraInfo, streamType = 1) {
      this.hasCameraInfo = true
      this.cameraInfo = cameraInfo
      this.streamType = streamType
      this.currentWindowMode = VideoMode.REALPLAY
      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        cameraId: cameraInfo.cameraId,
        cameraName: cameraInfo.cameraName,
        qualityType: this.videoParamForm 
          ? this.videoParamForm.qualityType : 0,                         // 画质优先还是实时优先
        reconnectCount: this.videoParamForm
         ? this.videoParamForm.connectNums : undefined,                  // 重连次数
        isDoubleClickedEnLarge: true,      
        streamType: streamType,
        isDragable: false,
        isPopWindow: false,
        isScalable: false,
        isScreenDragable: false,
        screenWindowIsNoBord: false,
        leftTopX: parseInt(this.screenLeft + this.locationInfo.left * window.devicePixelRatio),
        leftTopY: parseInt(this.screenTop + this.locationInfo.top * window.devicePixelRatio),
        rightBottomX: parseInt(this.screenLeft + (this.locationInfo.left + this.locationInfo.width) * window.devicePixelRatio),
        rightBottomY: parseInt(this.screenTop + (this.locationInfo.top + this.locationInfo.height) * window.devicePixelRatio),
        customAppearance: {
          mainWindow: {
            isBorderVisible: false,
            isTitleBarVisible: false,
            isActionBarVisible: false,    
            isPTZControlVisible: cameraInfo.isPTZControlVisible ? cameraInfo.isPTZControlVisible : false,        
          },
          screenWindow: {
            // selectedBorderColor: "#f4df47",
            isControlBarVisible: false,
            isVolumeAdjustBtnVisible: false,
            isAudioTalkVisible: false,
          }
        },
      };
      console.log(request,"requestrequest")
      this.isPlaying = true
      this.sendMessage("realtime-play", request);

      this.initConfig()
    },

    /**
     * 录像回放
     * @param {Object} cameraInfo 摄像机信息
     * @param {number} streamType 1：主码流 2: 子码流 
     */
    videoBackPlay(cameraInfo, streamType = 1) {
      this.hasCameraInfo = true
      this.cameraInfo = cameraInfo
      this.streamType = streamType
      this.currentWindowMode = VideoMode.BACKPLAY

      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        cameraId: cameraInfo.cameraId,
        cameraName: cameraInfo.cameraName,
        streamType: streamType,
        qualityType: this.videoParamForm 
          ? this.videoParamForm.qualityType 
          : 0,                                                   // 画质优先还是实时优先
        reconnectCount: this.videoParamForm
          ? this.videoParamForm.connectNums 
          : undefined,                                           // 重连次数
        videoSearchType: cameraInfo.from === "PLATFORM" ?  "0" : "0",
        searchBeginTime: cameraInfo.beginTime,
        searchEndTime: cameraInfo.endTime,
        playTime: cameraInfo.playTime 
          ? cameraInfo.playTime
          : cameraInfo.beginTime,                                // 跳转播放时间
        isDoubleClickedEnLarge: true,
        isDragable: false,
        isPopWindow: false,
        isScalable: false,
        isScreenDragable: false,
        screenWindowIsNoBord: false,
        leftTopX: parseInt(this.screenLeft + this.locationInfo.left * window.devicePixelRatio),
        leftTopY: parseInt(this.screenTop + this.locationInfo.top * window.devicePixelRatio),
        rightBottomX: parseInt(this.screenLeft + (this.locationInfo.left + this.locationInfo.width) * window.devicePixelRatio),
        rightBottomY: parseInt(this.screenTop + (this.locationInfo.top + this.locationInfo.height) * window.devicePixelRatio),
        customAppearance: {
          mainWindow: {
            isBorderVisible: false,
            isTitleBarVisible: false,
            isActionBarVisible: true
          }
        },
      };
      console.log(request,"request")
      this.isPlaying = true
      this.sendMessage("video_replay", request);

      this.initConfig()
    },

    // 初始化配置
    initConfig() {
      // 初始化抓拍配置
      this.initCaptureConfig()
      
    },
    
    // 初始化抓拍配置
    initCaptureConfig() {
      let screenCaptureInfo = {
        cameraId: this.cameraInfo.cameraId,
      }

      if (this.captureParamForm) {
        screenCaptureInfo.Type = this.captureParamForm.captureType
        screenCaptureInfo.PictureFormat = this.captureParamForm.captureFormat
        if (this.captureParamForm.captureType === 2) {
          screenCaptureInfo.Number = parseInt(this.captureParamForm.captureNums)
          screenCaptureInfo.Interval = parseInt(this.captureParamForm.intervals)
        }

        let request = {
          dialogId: this.dialogId,
          webUid: this.webUid,
          operationType: 4,
          screenCaptureInfo: screenCaptureInfo
        };
        this.sendMessage("append_dialog_operation", request);
      }
    },



    // 加速
    accelerate() {
      if (!this.isPlaying) return
      this.curSpeed += 1
      if (this.curSpeed >= 4) {
        this.curSpeed = 4
      }

      this.updateSpeed()
      return this.getCameraInfo()
    },

    // 减速
    decelerate() {
      if (!this.isPlaying) return
      this.curSpeed -= 1
      if (this.curSpeed <= -5) {
        this.curSpeed = -5
      }

      this.updateSpeed()

      return this.getCameraInfo()
    },

    // 更改当前播放倍数
    updateCurSpeed(value) {
      if (!this.isPlaying) return
      this.curSpeed = value
      this.updateSpeed()

      return this.getCameraInfo()
    },

    // 更新速度
    updateSpeed() {
      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        operationType: 5,
        playbackSpeedPlay: {
          cameraId: this.cameraInfo.cameraId,
          speedType: this.curSpeed
        }
      };
      this.sendMessage("append_dialog_operation", request);
    },

    // 快进秒
    accelerateSeconds() {
      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        operationType: 9,
        RecordVCRControl: {
          cameraId: this.cameraInfo.cameraId,
          screenIndex: 0,
          Operation: 4
        }
      };
      this.sendMessage("append_dialog_operation", request);
    },

    // 后退秒
    slowSeconds() {
      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        operationType: 9,
        RecordVCRControl: {
          cameraId: this.cameraInfo.cameraId,
          screenIndex: 0,
          Operation: 2
        }
      };
      this.sendMessage("append_dialog_operation", request);
    },

    // 暂停或者播放
    pauseOrPlay() {
      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        operationType: 9,
        RecordVCRControl: {
          cameraId: this.cameraInfo.cameraId,
          screenIndex: 0,
          Operation: 1
        }
      };
      this.sendMessage("append_dialog_operation", request);
      this.isPlaying = !this.isPlaying
      return this.getCameraInfo()
    },

    // 上一帧
    preFrame() {
      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        operationType: 9,
        RecordVCRControl: {
          cameraId: this.cameraInfo.cameraId,
          screenIndex: 0,
          Operation: 3
        }
      };
      this.sendMessage("append_dialog_operation", request);
    },

    // 下一帧
    nextFrame() {
      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        operationType: 9,
        RecordVCRControl: {
          cameraId: this.cameraInfo.cameraId,
          screenIndex: 0,
          Operation: 5
        }
      };
      this.sendMessage("append_dialog_operation", request);
    },

    // 跳转播放时间
    jumpToPlayTime(cameraInfo) {
      this.cameraInfo = cameraInfo
      let request = {
        dialogId: this.dialogId,
        webUid: this.webUid,
        operationType: 9,
        RecordVCRControl: {
          StartTime: cameraInfo.beginTime,
          PlayTime: cameraInfo.playTime 
            ? cameraInfo.playTime 
            : cameraInfo.beginTime, 
          EndTime: cameraInfo.endTime,
          cameraId: cameraInfo.cameraId,
          screenIndex: 0,
          Operation: 6
        }
      };
      this.sendMessage("append_dialog_operation", request);
    },
  

    updateWindowLocation() {
      if (this.isPlaying) {
        let request = {
          dialogId: this.dialogId,
          webUid: this.webUid,
          operationType: 1,
          geometryInfo: {
            leftTopX: parseInt(this.screenLeft + this.locationInfo.left * window.devicePixelRatio),
            leftTopY: parseInt(this.screenTop + this.locationInfo.top * window.devicePixelRatio),
            rightBottomX: parseInt(this.screenLeft + (this.locationInfo.left + this.locationInfo.width) * window.devicePixelRatio),
            rightBottomY: parseInt(this.screenTop + (this.locationInfo.top + this.locationInfo.height) * window.devicePixelRatio),
          }
        };
        this.sendMessage("append_dialog_operation", request);
      }
    },
    videoHidden() {
      if (this.isPlaying) {
        let request = {
          webUid: this.webUid,
          dialogId: this.dialogId,
          operationType: 6
        }
        this.sendMessage("append_dialog_operation", request)
      }
    },
    videoRestore() {
      if (this.isPlaying && this.locationInfo.show) {
        let request = {
          webUid: this.webUid,
          dialogId: this.dialogId,
          operationType: 7
        }
        this.sendMessage("append_dialog_operation", request)
      }
    },
    sendMessage(method, body) {
      if (this.client) {
        this.client.send(
          JSON.stringify({
            func: method,
            msg: body,
          })
        );
      }
    },
    destroy() {
      if (this.isPlaying) {
        let request = {
          webUid: this.webUid,
          dialogId: this.dialogId,
        }
        this.sendMessage("player_dialog_close", request)
        this.isPlaying = false
        this.curSpeed = 0
        this.hasCameraInfo = false
        this.currentWindowMode = 0
        this.cameraInfo = {}
        const cameraInfo = this.getCameraInfo()
        this.$emit('dialog-close', cameraInfo)
      }
    },
    handelVisibilityChange() {
      if (document.hidden) {
        this.videoHidden()
      } else {
        this.videoRestore()
      }
    }
  },
};
</script>

<style>
.video-player {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>