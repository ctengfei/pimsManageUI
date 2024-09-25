<template>
  <div class="video-player-group">
    <div class="plugin" v-if="!downloadVisible">
      <div
        v-for="(v, i) in playerLocations"
        class="video-player palace"
        :class="[{ palace_current: i === selectPlayerIndex }]"
        :key="i"
        :style="[
          { left: v.left + 'px' },
          { top: v.top + 'px' },
          { width: v.width + 'px' },
          { height: v.height + 'px' },
        ]"
        @click="handleClick(v, i)"
      >
        <video-players
          :client="client"
          :webUid="webUid"
          :windowIndex="i"
          :locationInfo="v"
          :ref="`dialogId${i}`"
          :dialogId="`dialogId${i}`"
          :screenTop="screenTop"
          :screenLeft="screenLeft"
          @dialog-close="dialogClose"
        ></video-players>
      </div>
    </div>
    <div class="plugin-warn" v-if="downloadVisible">
      <div class="title1">插件未安装或未运行</div>
      <div class="title2">安装播放插件才能正常播放实时浏览</div>
      <div class="title2">若您尚未安装插件,<a :href="urlVideo" download>请点击下载插件</a>,安装后点击刷新</div>
    </div>
    <!-- <promptDialog :webUid="webUid" :client="client"></promptDialog> -->
    <!-- <download-dialog @confirm="downloadConfirm"></download-dialog> -->
  </div>
</template><!--  -->

<script>
import {
  WindowMode,
  WindowModeScreenNum,
  updateCommonWindow,
} from "./windowMode";
import { VideoMode } from '@/components/videoplayers/common.js'
import VideoPlayers from '@/components/videoplayers'
// import promptDialog from "@/components/promptDialog";
import { loginForm } from './loginForm'
import DownloadDialog from './downloadDialog.vue';
export default {
  data() {
    return {
      client: null,
      webUid: null,
      screenTop: null,
      screenLeft: null,
      ws_url: "localhost:50015",
      loginForm: loginForm,
      limitNums: 3,                   // 限制路数
      requestId: null,
      selectPlayerIndex: 0,          
      currentWindowMode: 1,
      statusList:[],
      playerLocations: [],
      dialogIds: [],
      isFullScreen: false,
      promptDialogVisible: false,
      downloadVisible: false,         // 下载弹窗
      promptContent: "",
      promptContentLink:"",
      videoParamForm: null,
      captureParamForm: null,
      sendHeartInterval: null,        // 发送心跳
      recvHeartInterval: null,        // 接受心跳
      lastestRecvtime: new Date().getTime(),
      timeout: null,
      urlVideo: process.env.VUE_APP_VIDEO,
    };
  },
  components: {
    VideoPlayers,
    // promptDialog,
    DownloadDialog
  },
  created() {
    this.getParamConfig()
  },
  mounted() {
    this.getLoginForm()
    this.initPlayerLocations();
    this.initWindowMode();
    this.$nextTick(() => {
      this.updatePlayerLocations()
    })
    
    window.addEventListener("resize", this.updatePlayerLocations);
  },
  beforeDestroy() {
    this.release();
    window.cancelAnimationFrame(this.requestId)
    window.removeEventListener("resize", this.updatePlayerLocations);
  },
  methods: {
    downloadConfirm() {
      this.checkVersionAndDownload()
    },
    checkVersionAndDownload() {
      window.location.href = res.versionUrl
      this.$api.checkVersion({
        appID: '0803020102'
      }).then(res => {
        if (res.resultCode === 0) {
          if (res.versionUrl) {
            window.location.href = res.versionUrl
          } else {
            this.$message.warning('获取插件url为空')
          }
        }
      })
    },
    // 获取参数配置
    getParamConfig() {
      this.captureParamForm = JSON.parse(localStorage.getItem("avs_capture_param"))
      this.videoParamForm = JSON.parse(localStorage.getItem("avs_video_param"))
    },
    getLoginForm() {
      // this.setLoginFormIp()
      this.initClient()
    },
    setLoginFormIp() {
      // 判断是否是生产环境, 是生产环境就用生产环境的ip
      const env = process.env.NODE_ENV
      if (env === 'production') {
        const ip = window.location.hostname
        this.loginForm.ip = ip
      }
    },
    initClient() {
      this.initWebsocket();
      this.requestAnimationFrame()
    },
    // 获取当前选中的cameraInfo
    getCurSelectCameraInfo() {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].getCameraInfo()
      }
      return null
    },

    getCameraInfoByIndex(index) {
      const uuid = this.getDialogUUid(index)
      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].getCameraInfo()
      }
      return null
    },

    // 获取当前展示窗口的所有cameraInfo
    getAllCameraInfo() {
      const list = []
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          const cameraInfo = this.$refs[uuid][0].getCameraInfo()
          list.push(cameraInfo)
        }
      }
      return list
    },
    // 获取当前窗口模式
    getCurrentWindowMode() {
      return this.currentWindowMode
    },
    // 获取窗口数量
    getWindowNums() {
      return WindowModeScreenNum[this.currentWindowMode]
    },
    requestAnimationFrame() {
      if (this.requestId) {
        window.cancelAnimationFrame(this.requestId)
      }
    
      const step = () => {
        // console.log('devicePixelRatio', window.devicePixelRatio)
        if (this.isFullScreen) {
          this.screenLeft = 0
          this.screenTop = 0
        } else {
          const dom = document.querySelector(".video-player-group")
          const left = dom.getBoundingClientRect().left * window.devicePixelRatio
          const top = dom.getBoundingClientRect().top * window.devicePixelRatio

          let leftPos, topPos

          // F11全屏时的偏差值
          let fullDeviationValue = this.getFullScreenDeviationValue()

          // 浏览器全屏时window.screenLeft, window.screenTop偏差值
          let deviationValue = this.getDeviationValue() 

          leftPos = window.screenLeft === deviationValue ? 0 : window.screenLeft * window.devicePixelRatio
          topPos = window.screenTop === deviationValue ? 0 : window.screenTop * window.devicePixelRatio

          // f11全屏浏览器window.screenLeft, window.screenTop偏差值
          if (
            window.screenLeft == fullDeviationValue && 
            window.screenTop == fullDeviationValue
          ) {
            leftPos = 0
            topPos = 0
          } 
 
          this.screenLeft = leftPos + left

          let barHeight
          if (window.screenTop !== fullDeviationValue) {
            if (window.screenTop === deviationValue) {
              // 浏览器铺满屏幕,菜单栏的高度
              barHeight = this.getBarHeight(deviationValue)
            } else {
              // 拖拽时浏览器,菜单栏的高度
              barHeight = (window.outerHeight - window.innerHeight) * window.devicePixelRatio
            }
          } else {
            barHeight = 0
          }
          
          this.screenTop = topPos + barHeight + top

          // 适配拖拽的浏览器
          const [leftDeviationValue, topDeviationValue] = this.getScreenDeviationValue()

          if (
            window.screenLeft !== deviationValue &&
            (window.screenLeft != fullDeviationValue && 
            window.screenTop != fullDeviationValue)
          ) {
            this.screenLeft += leftDeviationValue
            this.screenTop -= topDeviationValue
          }
        }
        
        this.requestId = window.requestAnimationFrame(step)
      }
      this.requestId = window.requestAnimationFrame(step)
    },

    // 获取浏览器菜单栏的高度
    getBarHeight(deviationValue) {
      if ((window.outerHeight - window.innerHeight) == -16) {
        return 0
      }

      let barHeight = (window.outerHeight - window.innerHeight + (deviationValue)) * window.devicePixelRatio

      if (window.devicePixelRatio == 1.5) {
        barHeight -= 2
      } 

      if (window.devicePixelRatio == 1.75) {
        barHeight -= 5
      }

      if (window.devicePixelRatio == 2) {
        barHeight -= 5
      }

      return barHeight
    },

    // 获取f11全屏100%, 125%, 150%, 175%, 200%, 225%偏差值
    getFullScreenDeviationValue() {
      let fullDeviationType = {
        '1': 8,
        '1.25': 6,
        '1.5': 5,
        '1.75': 4,
        '2': 3,
        '2.25': 3,
      }
      return fullDeviationType[window.devicePixelRatio]
    },

    getDeviationValue() {
      let deviationType = {
        '1': 0,
        '1.25': -1,
        '1.5': -2,
        '1.75': -3,
        '2': -4,
      }

      return deviationType[window.devicePixelRatio]
    },

    getScreenDeviationValue() {
      let leftDeviationValue, topDeviationValue
      switch(window.devicePixelRatio) {
        case 1:
          leftDeviationValue = 7
          topDeviationValue = 8
          break
        case 1.25:
          leftDeviationValue = 10
          topDeviationValue = 9
          break
        case 1.5:
          leftDeviationValue = 12
          topDeviationValue = 10
          break
        case 1.75:
          leftDeviationValue = 13
          topDeviationValue = 10
          break
        case 2:
          leftDeviationValue = 14
          topDeviationValue = 10
        default:
          leftDeviationValue = 7
          topDeviationValue = 8
          break
      }

      return [leftDeviationValue, topDeviationValue]

    },

    initWebsocket() {
      if (!("WebSocket" in window)) {
        //不支持WebSocket
        return;
      }
      if (this.client === null) {
        this.client = new WebSocket("ws://" + this.ws_url);

        this.client.onopen = this.wsOnOpen()

        this.client.onmessage = (event) => {
          this.lastestRecvtime = new Date().getTime()
          let msg = JSON.parse(event.data).msg;
          this.webUid = msg.webUid;
          this.msgHandler(msg);
        };

        this.client.onerror = this.wsOnError
        this.$emit('client', this.client)
      } else {
        this.release();
        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        this.timeout = setTimeout(this.initClient(), 1000);
      }
    },
    wsOnOpen() {
      this.sendHeart()
      this.recvHeart()
    },
    // 发送心跳
    sendHeart() {
      if (this.sendHeartInterval) {
        clearInterval(this.sendHeartInterval)
        this.sendHeartInterval = null
      }

      this.sendHeartInterval = setInterval(() => {
        let request = {
          webUid: this.webUid
        }
        this.sendMessage('web_notifyWindow_ping', request)
      }, 8000)
    },
    // 接受心跳
    recvHeart() {
      if (this.recvHeartInterval) {
        clearInterval(this.recvHeartInterval)
        this.recvHeartInterval = null
      }
      this.recvHeartInterval = setInterval(() => {
        let currentTime = new Date().getTime()
        if (currentTime - this.lastestRecvtime > 10000) {
          // 超过10秒, 没有接受到消息, 重新建立连接
          this.release()
          if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
          }
          this.timeout = setTimeout(this.initClient(), 1000);
        }
      }, 10000)
    },
    wsOnError() {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.timeout = setTimeout(this.initClient(), 1000);
      this.downloadVisible = true
    },
    getDialogUUid(i) {
      return `dialogId${i}`
    },
    login() {
      // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const vpn = JSON.parse(localStorage.getItem('AVS-VPN'))

      // console.log('userInfo', userInfo, vpn, userInfo.username, userInfo.password)
      // 使用token登录hostSdk
      if (this.loginForm) {
        let request = {
            webUid: String(this.webUid),
            loginType: 0,
            ip: this.loginForm.ip,
            port: this.toNumber(this.loginForm.port),
            token: sessionStorage.getItem("token"),
            agentType: Number(!vpn),
        }
        this.sendMessage("web_login", request)
      }
    },
    msgHandler(msg) {
      let notifyType = msg.notifyType;
      switch (notifyType) {
        case 0:
          // this.alertMessage("初始化成功");
          this.login()
          break;
        case 1:
          if (msg.dialogId != null && msg.result === 0) {
            this.dialogIds.push(msg.dialogId);
          }

          this.createDialogSuccess(msg)
          break;
        case 2:
          if (msg.dialogId != null && msg.result === 0) {
            this.dialogIds = this.dialogIds.filter(item => item !== msg.dialogId)
          }
          this.videoClose(msg)
          break;
        case 4:
          // console.log('msg4', msg.statusInfo.statusType)
          // 窗口手动关闭
          if (msg.statusInfo && msg.statusInfo.statusType == 3) {
            this.destroyDialog(msg.dialogId)
          }

          if (msg.statusInfo && msg.statusInfo.statusType === 2) {
            this.videoPlayPauseOrEnd(msg)
          }
          break 
        case 5:
          if (msg.result === 0) {
            this.promptContent = "截取图片成功,图片保存地址为: "
            this.promptContentLink = msg.captureInfo.saveDirectory
            this.promptDialogVisible = true
          } else {
            this.alertMessage("截取图片失败");
          }
          break;
        case 8:
          this.onTimestampChange(msg.recordReplayInfo, msg)
          break
        case 9:
          if (msg.result === 0) {
            this.dialogClick(msg.dialogId)
          }
          break

        case 11:
          if (msg.result === 0) {
            this.downloadVisible = false
            // this.alertMessage("登录成功");
          } else {
            // this.alertMessage("登录失败");
          }
          break;
        case 15:
          if (msg.result === 0) {
            const saveDirectory = msg.localRecordInfo.saveDirectory
            const index = saveDirectory.indexOf("：") + 1
            this.promptContent =  saveDirectory.slice(0, index)
            this.promptContentLink =saveDirectory.slice(index, saveDirectory.length - 4)
            this.promptDialogVisible = true
          } else {
            this.alertMessage("本地录像失败");
          }
          break;
        case 18:
          // 鉴权失败, 重新进入登录页面
          // this.login()
          // let request = {
          //   webUid: String(this.webUid),
          // }
          // this.sendMessage("web_notifyLogin_sucess", request)
          // break
        case 19:
          this.handleRecordCloseTip(msg)
          break
        case 20:
          // hostSdk监听到最大化还原
          this.exitFullScreen()
          this.
          break
        case 21:
          // 监听双击放大
          console.log('dblclick 21')
          break
        default:
          break;
      }
    },
    // 视频关闭出现错误提示
    handleRecordCloseTip(msg) {
      if (
        msg.localRecordCloseTip && 
        msg.localRecordCloseTip.tips
      ) {
        this.promptContent = msg.localRecordCloseTip.tips
        this.promptDialogVisible = true
      }
    },
    // 创建窗口成功回调函数
    dialogBeginPlay(msg) {
      if (this.$refs[msg.dialogId]) {
        const cameraInfo = this.$refs[msg.dialogId][0].getCameraInfo()
        // 进行回放跳转播放
        if (cameraInfo.playTime) {
          this.$refs[msg.dialogId][0].jumpToPlayTime(cameraInfo)
        }
      }
    },
    // 创建弹窗成功
    createDialogSuccess(msg) {
      if (this.$refs[msg.dialogId]) {
        const cameraInfo = this.$refs[msg.dialogId][0].getCameraInfo()
        this.$emit('create-success', cameraInfo, cameraInfo.index)
      }
    },
    // 视频关闭
    videoClose(msg) {
      if (this.$refs[msg.dialogId]) {
        const cameraInfo = this.$refs[msg.dialogId][0].getCameraInfo()
        this.$emit('video-close', cameraInfo, cameraInfo.index)
      }
    },
    // 视频播放停止或者结束
    videoPlayPauseOrEnd(msg) {
      if (this.$refs[msg.dialogId]) {
        const cameraInfo = this.$refs[msg.dialogId][0].getCameraInfo()
        // 如果视频正在播放, 表示视频不是停止, 是视频播放结束，需要播放下一段
        // 并且当前是录像回放模式
        if (
          cameraInfo.isPlaying &&
          cameraInfo.currentWindowMode === VideoMode.BACKPLAY
        ) {
          console.log('play-next-segment')
          this.$emit('play-next-segment', cameraInfo.windowIndex)
        }
      }
    },
    // 回放时间戳
    onTimestampChange(recordReplayInfo, msg) {
      if (this.$refs[msg.dialogId]) {
        const cameraInfo = this.$refs[msg.dialogId][0].getCameraInfo()
        this.$emit('timestamp-change', recordReplayInfo, cameraInfo.windowIndex, cameraInfo)
      }
    },
    alertMessage(message) {
      this.$message({
        showClose: true,
        message: message,
        type: "",
        duration: 1000,
      });
    },
    release() {
      if (this.sendHeartInterval) {
        clearInterval(this.sendHeartInterval)
        this.sendHeartInterval = null
      }
      if (this.recvHeartInterval) {
        clearInterval(this.recvHeartInterval)
        this.recvHeartInterval = null
      }

      if (this.client) {
        this.destroyAllDialog()
        this.client.close();
        this.client = null;
        this.$emit('client', this.client)
        this.webUid = null;
        // this.alertMessage("资源已释放");
      }
    },
    toNumber(num) {
      return num == null ? null : num === '' ? 0 : Number(num);
    },
    dialogClick(dialogId) {
      if (this.$refs[dialogId]) {
        const cameraInfo = this.$refs[dialogId][0].getCameraInfo()
        this.selectPlayerIndex = cameraInfo.windowIndex
        this.$emit('dialog-click', cameraInfo, cameraInfo.windowIndex)
      }
    },
    handleClick(playerLocation, i) {
      this.selectPlayerIndex = i;

      const dialogId = this.getDialogUUid(i)
      if (this.$refs[dialogId]) {
        const cameraInfo = this.$refs[dialogId][0].getCameraInfo()
        this.$emit('dialog-click', cameraInfo, cameraInfo.windowIndex)
      }
    },

    // 改变窗口索引
    changeCurSelectIndex(i) {
      this.selectPlayerIndex = i

      const dialogId = this.getDialogUUid(i)
      if (this.$refs[dialogId]) {
        const cameraInfo = this.$refs[dialogId][0].getCameraInfo()
        this.$emit('dialog-click', cameraInfo, cameraInfo.windowIndex)
      }
    },

    initPlayerLocations() {
      this.playerLocations = [];
      for (let i = 0; i < 25; i++) {
        this.playerLocations.push({
          show: false,
          position: i,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
        });
      }
    },
    changeWindowMode(windowMode) {
      this.currentWindowMode = windowMode;
      this.updatePlayerLocations();
    },
    initWindowMode() {
      this.updatePlayerLocations();
    },
    updatePlayerLocations(e) {
      
      this.checkFullScreen()
      
      switch (this.currentWindowMode) {
        case WindowMode.One:
        case WindowMode.Four:
        case WindowMode.NINE:
          updateCommonWindow(this.currentWindowMode, this.playerLocations);
          break;
        default:
          break;
      }
      this.hiddenOrRestoreDialog()
      this.changeChildrenWindowLocation()
    },

    // 某一个窗口单分屏
    oneScreenByIndex(index) {
      this.currentWindowMode = WindowMode.One
      this.selectPlayerIndex = index

      const wrap = document.querySelector(".video-player-group")
      let width  = wrap.clientWidth
      let height = wrap.clientHeight
      for (let i = 0; i < this.playerLocations.length; i++) {
        const player = this.playerLocations[i]
        if (i === this.selectPlayerIndex) {
          player.top = 0
          player.left = 0
          player.width = width
          player.height = height
        } else {
          player.top = 0
          player.left = 0
          player.width = 0
          player.height = 0
        }
      }
    },


    checkFullScreen() {
      const isFull = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
      this.isFullScreen = isFull
      return isFull
    },


    hiddenOrRestoreDialog() {
      const activeDialogNum = WindowModeScreenNum[this.currentWindowMode]
      for (let i = 0; i < activeDialogNum; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          this.$refs[uuid][0].videoRestore()
        }
      }
      for (let i = activeDialogNum; i < 25; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          this.$refs[uuid][0].videoHidden()
        }
      }
    },

    closeDisActiveDialog() {
      const activeDialogNum = WindowModeScreenNum[this.currentWindowMode]
      for (let i = activeDialogNum; i < 25; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          this.$refs[uuid][0].destroy()
        }
      }
    },

  
    changeChildrenWindowLocation() {
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          this.$refs[uuid][0].updateWindowLocation()
        }
      }
    },

    allDialogHidden() {
      for (let i = 0; i < 25; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          this.$refs[uuid][0].videoHidden()
        }
      }
    },

    allDialogRestore() {
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          this.$refs[uuid][0].videoRestore()
        }
      }
    },

    getShowDialogStatus() {
      const statusList = []
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          const status = this.$refs[uuid][0].getCameraInfo()
          statusList.push(status)
        }
      }
      return statusList
    },

    playRealVideo(rawCameraInfo, rawStreamType) {
      let cameraInfo = {
        cameraId: rawCameraInfo.id,
        cameraName: rawCameraInfo.label,
        ...rawCameraInfo
      }

      const index = this.getNextScreenIndex(this.selectPlayerIndex)

      let streamType 

      // 控制码流类型
      if (rawStreamType) {
        streamType = rawStreamType
      } else {
        if (this.videoParamForm) {
          streamType = this.videoParamForm.streamType
        } else {
          streamType = 1
        }
      }

      if (this.videoParamForm) {
        if (this.videoParamForm.type === 1) {
          // 播放路数
          if (this.dialogIds.length >= parseInt(this.videoParamForm.limitNums)) {
            streamType = 2
          }
        } else {
          // 分屏数
          if (WindowModeScreenNum[this.currentWindowMode] >= parseInt(this.videoParamForm.limitNums)) {
            streamType = 2
          }
        }
      } else {
        // 超过一定路数, 限制为子码流
        if (this.dialogIds.length >= this.limitNums) {
          streamType = 2
        }
      }

      const uuid = this.getDialogUUid(index)
      if (this.$refs[uuid]) {
        // 播放窗口不一致, 更新selctPlayerIndex
        this.selectPlayerIndex = index

        if (this.$refs[uuid][0].hasCameraInfo) {
          this.$refs[uuid][0].destroy()
        }
        
        setTimeout(() => {
          this.$refs[uuid][0].realTimePlay(cameraInfo, streamType)
        }, 200)
      }
    },

    /**
     * 进行指定窗口进行实时播放
     * @param  rawCameraInfo camera信息
     * @param  rawStreamType 流媒体类型
     * @param  index         窗口索引
     */
    playRealVideoByIndex(rawCameraInfo, rawStreamType, index) {
      let cameraInfo = {
        cameraId: rawCameraInfo.id,
        cameraName: rawCameraInfo.label,
        ...rawCameraInfo
      }


      let streamType = rawStreamType || 1

      if (this.dialogIds.length >= this.limitNums) {
        streamType = 2
      }

      const uuid = this.getDialogUUid(index)

      if (this.$refs[uuid]) {
        this.selectPlayerIndex = index

        if (this.$refs[uuid][0].hasCameraInfo) {
          this.$refs[uuid][0].destroy()
        }

        setTimeout(() => {
          this.$refs[uuid][0].realTimePlay(cameraInfo, streamType)
        }, 200)
      }
    },

    // 播放录像回放
    playVideoBack(rawCameraInfo, windowIndex = 0) {
      const index = windowIndex
      const uuid = this.getDialogUUid(index)

      let streamType = 1

      // 超过一定路数, 限制为子码流
      if (this.dialogIds.length >= this.limitNums) {
        streamType = 2
      }

      if (this.$refs[uuid]) {
        if (this.$refs[uuid][0].hasCameraInfo) {
          const cameraInfo = this.$refs[uuid][0].getCameraInfo()
          if (
            cameraInfo.beginTimeValue <= rawCameraInfo.playTimeValue && 
            cameraInfo.endTimeValue >= rawCameraInfo.playTimeValue
          ) {
            // 直接跳转
            this.$refs[uuid][0].jumpToPlayTime(rawCameraInfo)
            return
          } else {
            this.$refs[uuid][0].destroy()
          }
        }

        setTimeout(() => {
          this.$refs[uuid][0].videoBackPlay(rawCameraInfo, streamType)
        }, 200)
      }
    },
    
    // 加速
    accelerate() {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      console.log('accelerate',this.$refs[uuid], this.$refs[uuid][0].hasCameraInfo)
      if (
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return null
      }

      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].accelerate()
      }
    },
    
    // 加速所有正在回放的
    accelerateAll() {
      let cameraInfo
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid][0].hasCameraInfo) {
          if (cameraInfo) {
            this.$refs[uuid][0].accelerate()
          } else {
            cameraInfo = this.$refs[uuid][0].accelerate()
          }
        }
      }
      return cameraInfo
    },

    // 减速
    decelerate() {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      console.log('decelerate',this.$refs[uuid], this.$refs[uuid][0].hasCameraInfo)
      if (
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return null
      }

      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].decelerate()
      }
    },

    // 更改当前窗口的播放倍数
    updateCurSpeed(value) {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      if (
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return null
      }

      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].updateCurSpeed(value)
      }
    },

    // 减速所有正在回放的
    decelerateAll() {
      let cameraInfo
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid][0].hasCameraInfo) {
          if (cameraInfo) {
            this.$refs[uuid][0].decelerate()
          } else {
            cameraInfo = this.$refs[uuid][0].decelerate()
          }
        }
      }
      return cameraInfo
    },


    // 快进秒
    accelerateSeconds() {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      if (
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return null
      }

      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].accelerateSeconds()
      }
    },

    // 后退秒
    slowSeconds() {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      if (
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return null
      }

      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].slowSeconds()
      }
    },

    // 所有正在播放的快进
    accelerateAllSeconds() {
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid][0].hasCameraInfo) {
          this.$refs[uuid][0].accelerateSeconds()
        }
      }
    },

    // 所有正在播放的后退
    slowAllSeconds() {
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid][0].hasCameraInfo) {
          this.$refs[uuid][0].slowSeconds()
        }
      }
    },

    // 上一帧
    preFrame() {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      if (
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return null
      }

      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].preFrame()
      }
    },

    preAllFrame() {
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid][0].hasCameraInfo) {
          this.$refs[uuid][0].preFrame()
        }
      }
    },

    // 下一帧
    nextFrame() {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      if (
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return null
      }

      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].nextFrame()
      }
    },

    nextAllFrame() {
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid][0].hasCameraInfo) {
          this.$refs[uuid][0].nextFrame()
        }
      }
    },


    // 暂停或者播放, 不是暂停就是播放
    pauseOrPlay() {
      const uuid = this.getDialogUUid(this.selectPlayerIndex)
      if (
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return
      }

      if (this.$refs[uuid]) {
        return this.$refs[uuid][0].pauseOrPlay()
      }
    },

    allPauseOrPlay() {
      let cameraInfo
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid][0].hasCameraInfo) {
          if (cameraInfo) {
            this.$refs[uuid][0].pauseOrPlay()
          } else {
            cameraInfo = this.$refs[uuid][0].pauseOrPlay()
          }
        }
      }
      return cameraInfo
    },

    // 判断是否有正在播放的
    isPlaying() {
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid][0].hasCameraInfo) {
          return true
        }
      }
      return false
    },


    getNextScreenIndex(index) {
      let i = index
      const screenNums = WindowModeScreenNum[this.currentWindowMode]
      const uuid = this.getDialogUUid(i)

      if (
        index < screenNums &&
        this.$refs[uuid] && 
        !this.$refs[uuid][0].hasCameraInfo
      ) {
        return i
      }
      
      for (let j = 1; j <= screenNums; j++) {
        const windIndex = (i + j) % screenNums
        const uuid = this.getDialogUUid(windIndex)
         if (
          this.$refs[uuid] && 
          !this.$refs[uuid][0].hasCameraInfo
        ) {
          return windIndex
        }
      }

      return 0
    },
    dialogClose(cameraInfo) {
      this.$emit('dialog-close', cameraInfo)
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
    fullScreen(e) {
      let elem = document.querySelector('.video-player-group');
      if (
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEanbled
      ) {
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          this.isFullScreen = false
        } else {
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
          } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
          } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
          }
          this.isFullScreen = true
        }
      } else {
        console.log("Fullscreen is not ssupported on your browser");
      }
      
    },
    exitFullScreen() {
      if (
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEanbled
      ) {
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          this.isFullScreen = false
        }
      }
      
    },

    // 改变所有弹窗的码流类型
    changeAllDialogStreamType(streamType) {
      const dialogList = []
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (
          this.$refs[uuid] && 
          this.$refs[uuid][0].hasCameraInfo
        ) {
          const cameraInfo = this.$refs[uuid][0].getCameraInfo()
          dialogList.push(cameraInfo.dialogId)
        }        
      }

      if (dialogList && dialogList.length) {
        let request = {
          webUid: this.webUid,
          dialogIdList: dialogList.join(','),
          streamType
        }

        this.sendMessage("web_notify_batchSwitchStream", request)
      }
    },

    // 销毁指定的弹窗
    destroyDialogByWindowIndex(windowIndex) {
      const uuid = this.getDialogUUid(windowIndex)
      if (this.$refs[uuid]) {
        this.$refs[uuid][0].destroy()
      }
    },

    destroyDialog(dialogId) {
      if (this.$refs[dialogId]) {
        this.$refs[dialogId][0].destroy()
      }
    },
    // 销毁所有的弹窗
    destroyAllDialog() {
      for (let i = 0; i < WindowModeScreenNum[this.currentWindowMode]; i++) {
        const uuid = this.getDialogUUid(i)
        if (this.$refs[uuid]) {
          this.$refs[uuid][0].destroy()
        }
      }
    },
  },
};
</script>

<style lang="less">
.video-player-group {
  position: relative;
  width: 100%;
  height: 100%;
  background: #18242C;

  .plugin {
    width: 100%;
    height: 100%;
  }

  .plugin-warn {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    .title1 {
      font-size: 32px;
      font-weight: 400;
      color: #FEFFFF;
      line-height: 30px;
      margin-bottom: 62px;
    }

    .title2 {
      font-size: 22px;
      font-weight: 400;
      color: #FEFFFF;
      line-height: 30px;
      margin-bottom: 32px;

      a {
        color: #17A1FF;
      }
    }
  }

}
.video-player {
  position: absolute;
  box-sizing: border-box;
}
.palace {
  box-sizing: border-box;
  border: 1px solid #626262 ;
}

.palace_current {
  box-sizing: border-box;
  border: 1px solid #0DA5FE;
}
</style>