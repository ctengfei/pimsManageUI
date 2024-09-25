<!--
 * @version:
 * @Author: hzdu
 * @Explain: 视频播放器组件
 * @Date: 2021-01-04 19:45:00
 * @LastEditTime: 2021-08-24 10:09:47
 * @LastEditors: sscaij
-->
<template>
  <div>
    <div ref="videoBox" :class="videoBorderClass" @mouseenter="showControlBtn" @mouseleave="hideControlBtn">
      <template v-if="isShowBtns">
        <div v-show="videoUrl && bCloseShow && (isTimeMonitor || isSplitScreen)" class="video-close" @click="closeVideo">
          关闭
        </div>
        <div v-show="cruiseStaus.showCruiseBtn" class="video-close video-control" @click="closeCruiseLine">
          关闭巡航
        </div>
        <div v-show="!videoUrl && bCloseShow && (isTimeMonitor || isSplitScreen)" class="channel-selector" @click="selectChannel">
          选择通道
        </div>
        <div v-show="videoUrl && bCloseShow && isSplitScreen" class="channel-selector video-control" @click="goVideoControl">
          云台控制
        </div>
      </template>
    </div>
    <!--通道列表对话框-->
    <el-dialog :title="channelListDlgTitle" :visible.sync="channelListDlgShow" :before-close="channelDlgClose">
      <div>
        <div>
          <el-input v-model="searchKeyword" style="width:200px;" placeholder="请输入关键字" clearable @blur="searchChannel" />
          <el-button type="primary" icon="el-icon-search" @click="searchChannel">搜索</el-button>
          <el-button
            plain
            icon="el-icon-refresh-left"
            @click="resetchannelList()"
            >重置
          </el-button>
        </div>
      </div>
      <el-table v-loading="isLoading" :data="channelList" element-loading-text="加载中" @row-click="rowSelect" height="580">
        <el-table-column prop="deviceId" label="设备编号" width="200"/>
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="deviceType" label="设备类型" width="80px"/>
        <el-table-column prop="protocol" label="对接类型" width="80px"/>
        <el-table-column prop="manufacturer" label="厂家" />
        <el-table-column label="状态" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1" style="color:#18dca7;">在线</span>
            <span v-else style="color:#f05656;">离线</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="channelList && channelList.length > 0"
        :page.sync="pageNum"
        :total="total"
        :limit.sync="pageSize"
        :pageSizes="[10, 50, 100]"
        @pagination="handleCurrentChange"
      />
    </el-dialog>
    <el-dialog :title="`设备名称：${videoTitle}`" :visible.sync="showZoomPlayDl" width="1200px">
      <div class="video">

      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getChannelList,
  devicePushTream
} from '@/api/monitor/splitscreen'
import { getToken } from '@/utils/auth'
import { getDomainCode } from '@/api/monitor/splitscreen'
import { getOffsetTop, getOffsetLeft,insertedMousewheel } from '@/utils/dom'
import { closeCruiseLine } from '@/api/monitor/timemonitor'
import { setTimeout } from 'timers'
import pagination from '@/components/comPagination'

const rectDom = null
let rectInfo = {}
export default {
  components: {
    pagination
  },
  props: {
    player: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isMuted: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    index: {
      type: Number,
      default: -1
    },
    playType: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
    },
    // 框选功能开关 ture打开 flase关闭 --luws
    // 开关打开时  外部通过rect-up事件获取框选的相关坐标和尺寸数据
    zoomRectFlag: {
      type: Boolean,
      default: false
    },
    // 滚轮功能开关 ture打开 flase关闭 --luws
    // 开关打开时  外部通过scroll-handle事件获取滚轮的相关坐标和尺寸数据
    zoomScrollFlag: {
      type:Boolean,
      default:false,
    },
    // 是否获取新流
    newStream:{
      type:Boolean,
      default: false,
    },
    // 是否显示视频右上角的操作按钮  --luws
    // 默认为true(显示按钮)，传false则隐藏
    isShowBtns:{
      type: Boolean,
      default: true,
    },
    hideSnapshotBtn: {
      type: Boolean,
      default: false
    },
    isLive: {
      type: Boolean,
      default: true
    },
    dominShow: {
      type: Boolean,
      default: true
    },
    domainCode: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      channelListDlgTitle: '',
      channelListDlgShow: false,
      channelList: [],
      bCloseShow: false,
      bLoading: false,
      videoUrl: '',
      videoTitle: '',
      videoHttp: '',
      normalssrc: '',
      ssrc: '',
      deviceId: '',
      searchKeyword: '',
      pageSize: 10,
      pageNum: 1,
      total: 0,
      isLoading: false,
      showZoomPlayDl: false,
      videoClickCount: 0,
      live: this.isLive,
      ZLServerIp: '',
      // 视频流清晰度
      format:null,
      // 码流类型，码流切换时需要改变码流类型，url拼接时会用到
      // 高清时为rtp，标清时为proxy
      streamType:'rtp',
      singleVideoUrl: '',
      zoomPlayBLoading: false,
      // 定时器
      timer: null,
      currentTime: '',
      oldCurrentTime: ''
    }
  },
  computed: {
    cruiseStaus() {
      return this.$store.getters.cruiseStaus
    },
    isSplitScreen() {
      return this.$route.path === '/splitscreen'
    },
    isTimeMonitor() {
      return this.$route.path === '/timemonitor'
    },
    videoBorderClass() {
      let videoWidth = Math.sqrt(this.player.len)
      if((this.index+1) === this.player.len || !this.player.len) {
        return 'video'
      } else {
        if ((this.index+1) > videoWidth * (videoWidth-1)) {
          return 'video-last-row'
        } else if ((this.index+1) % videoWidth === 0) {
          return 'video-last-column'
        } else {
          return 'video-main'
        }
      }
    },
    cruiseInfoList() {
      return this.$store.state.socket.cruiseInfoList
    },
  },
  watch: {
    //   对父组件传入的设备相关参数进行深度监听
    player: {
      handler(newVal) {
        clearTimeout(this.timer)
        this.timer = null
        if(newVal.protocol === 'ONVIF') {
           this.streamType = 'proxy'
        } else {
           this.streamType = 'rtp'
        }
        this.getVideoUrl()
      },
      deep: true,
      immediate: false
    },
    format:{
      handler(newVal){
        if(newVal || this.player.protocol === 'ONVIF'){
          this.streamType = 'proxy'
        }else{
          this.streamType = 'rtp'
        }
      }
    },
    // 对父组件传入的url进行监听
    url() {
      this.getVideoUrl()
    },
    zoomRectFlag: {
      handler(newVal) {
        if (newVal) {
          this.zoomRect()
        } else {
          const dom = this.$refs.videoBox
          dom.onmousedown = null
          document.onmouseup = null
          document.onmousemove = null
        }
      }
    },
    zoomScrollFlag:{
      handler(newVal) {
        if (newVal) {
          this.zoomScroll()
        } else {
          const dom = this.$refs.videoBox
          dom.onmousedown = null
          document.onmouseup = null
          document.onmousemove = null
        }
      }
    },
    videoUrl: {
      handler(newVal) {
        if (newVal) {
          setTimeout(() => {
            if (this.isSplitScreen) {
              this.$el.querySelector('video').addEventListener('click', this.clickVideo)
            } else {
              return
            }
            const poster = this.$el.querySelector('.vjs-poster')
            poster && poster.remove()
          }, 1000)
          //  对播放状态进行监听，如果出现非人为原因停止播放则重新拉流
          if(!this.timer) {
            this.timer = setInterval(() => {
              if(this.oldCurrentTime === this.currentTime) {
                this.reloadVideo()
              }
              this.oldCurrentTime = this.currentTime
            }, 10000)
          }
        } else {
          clearTimeout(this.timer)
          this.timer = null
        }
      }
    }
  },
  mounted() {
    if (this.zoomRectFlag) {
      this.zoomRect()
    }
    if (this.zoomScrollFlag) {
      this.zoomScroll()
    }
    this.getVideoUrl()
  },
  destroyed() {
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    zoomRect() {
      const dom = this.$refs.videoBox
      let bottomDis = this.$refs.videoBox.getBoundingClientRect().bottom
      const mainW = dom.clientWidth
      const mainH = dom.clientHeight
      const maxW = getOffsetLeft(dom) + mainW
      const maxH = getOffsetTop(dom) + mainH
      const minW = getOffsetLeft(dom)
      const minH = getOffsetTop(dom)
      const that = this
      document.onmouseup = function() {
        that.removeChildDom(rectDom, rectInfo)
      }
      dom.onmousedown = function(e) {
        if (!that.zoomRectFlag) {
          return
        }
        const posx = e.clientX
        const posy = e.clientY
        const rectDom = document.createElement('div')
        rectDom.className = 'tempDiv'
        rectDom.style.left = e.clientX + 'px'
        rectDom.style.top = e.clientY + 'px'
        document.body.appendChild(rectDom)
        document.onmouseup = function() {
          that.removeChildDom(rectDom, rectInfo)
        }
        document.onmousemove = function(ev) {
          if (!that.zoomRectFlag) {
            return
          }
          let left = ev.clientX
          let top = ev.clientY
          // 移动边界逻辑处理
          if (left > maxW) {
            left = maxW + 'px'
          } else {
            if (left < minW) {
              left = minW + 'px'
            }
          }
          if (top > maxH) {
            top = maxH + 'px'
          } else {
            if (top < minH) {
              top = minH + 'px'
            }
          }
          if(left.toString().endsWith("px")){
            left = left.toString();
            left = left.substring(0, left.length - 2);
          }
          if(top.toString().endsWith("px")){
            top = top.toString();
            top = top.substring(0, top.length - 2);
          }
          const width = Math.abs(posx - parseInt(left))
          const height = Math.abs(posy - parseInt(left))
          const finalLeft = Math.min(left, posx)
          const finalTop = Math.min(top, posy)
          const x = finalLeft + (width / 2) - getOffsetLeft(dom)
          const y = finalTop + (height / 2) - getOffsetTop(dom)
          rectDom.style.left = Math.min(left, posx) + 'px'
          rectDom.style.top = Math.min(top, posy) + 'px'
          rectDom.style.width = width + 'px'
          rectDom.style.height = width*(mainH/mainW) + 'px'
          // 限制右边
          if(Math.min(left, posx) + width - getOffsetLeft(dom) >= mainW) {
            rectDom.style.width = mainW + getOffsetLeft(dom) - Math.min(left, posx) +'px'
            rectDom.style.height = (mainW + getOffsetLeft(dom) - Math.min(left, posx))*(mainH/mainW) + 'px'
          }
          // if(Math.min(left, posx)<= leftDis) {
          //   rectDom.style.width = Math.abs(posx) - leftDis +'px'
          //   rectDom.style.height = (Math.abs(posx) - leftDis) *(mainH/mainW) + 'px'
          // }
          if(Math.min(top, posy) - getOffsetTop(dom) + width*(mainH/mainW)>= mainH) {
            rectDom.style.height = (bottomDis - posy) + 'px'
            rectDom.style.width = (bottomDis - posy) / (mainH/mainW)  + 'px'
          }
          rectInfo = {
            midPointX: 0,
            midPointY: 0,
            windowLength: 0,
            windowWidth: 0,
            lengthX: 0,
            lengthY: 0
          }
          rectInfo.midPointX = x
          rectInfo.midPointY = y
          rectInfo.windowLength = mainW
          rectInfo.windowWidth = mainH
          rectInfo.lengthX = width
          rectInfo.lengthY = height
          if (left > posx) {
            rectInfo.zoomType = 'IN'
          } else {
            rectInfo.zoomType = 'OUT'
          }
          document.onmouseup = function() {
            that.removeChildDom(rectDom, rectInfo)
          }
        }
      }
    },
    zoomScroll(){
      const dom = this.$refs.videoBox
      insertedMousewheel(dom,(e)=>{
        e = e || window.event;
        let x = e.clientX - getOffsetLeft(dom)
        let y = e.clientY - getOffsetTop(dom)
        const mainW = dom.clientWidth
        const mainH = dom.clientHeight
        const maxW = getOffsetLeft(dom) + mainW
        const maxH = getOffsetTop(dom) + mainH
        const width = 800
        const height = 450
        rectInfo = {
          midPointX: 0,
          midPointY: 0,
          windowLength: 0,
          windowWidth: 0,
          lengthX: 0,
          lengthY: 0
        }
        rectInfo.midPointX = x
        rectInfo.midPointY = y
        rectInfo.windowLength = maxW
        rectInfo.windowWidth = maxH
        rectInfo.lengthX = width
        rectInfo.lengthY = height
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
              rectInfo.zoomType = 'IN'
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
               rectInfo.zoomType = 'OUT'
            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail> 0) { //当滑轮向下滚动时
                rectInfo.zoomType = 'OUT'
            }
            if (e.detail< 0) { //当滑轮向上滚动时
              rectInfo.zoomType = 'IN'
            }
        }
        this.scrollHandle(rectInfo,e)
      })
    },
    zoomRest(info){
      if (!this.zoomRectFlag) {
        return
      }
      this.$emit('rect-up', info)
        rectInfo = {
          midPointX: 0,
          midPointY: 0,
          windowLength: 0,
          windowWidth: 0,
          lengthX: 0,
          lengthY: 0
        }
    },
    scrollHandle(info,e){
      if (!this.zoomScrollFlag) {
        return
      }
      this.$emit('scroll-handle', info,e)
        rectInfo = {
          midPointX: 0,
          midPointY: 0,
          windowLength: 0,
          windowWidth: 0,
          lengthX: 0,
          lengthY: 0
        }
    },
    removeChildDom(dom, info) {
      if (!this.zoomRectFlag) {
        return
      }
      if (!dom) {
        return
      }
      if (!info) {
        return
      }
      dom.parentNode.removeChild(dom)
      document.onmousemove = null
      document.onmouseup = null
      if(!info.lengthX || !info.lengthY){
        return
      }
      if (info.lengthX < (rectInfo.windowLength / 8)|| info.lengthY <(rectInfo.windowWidth / 8)) {
        return
      } else {
        this.$emit('rect-up', info)
        rectInfo = {
          midPointX: 0,
          midPointY: 0,
          windowLength: 0,
          windowWidth: 0,
          lengthX: 0,
          lengthY: 0
        }
      }
    },
    timeupdate(n) {
      this.currentTime = n
      this.$emit('timeChange', n)
    },
    //  关闭视频
    closeVideo() {
      this.bLoading = false
      this.videoUrl = ''
      clearTimeout(this.timer)
      this.timer = null
      this.$emit('close', this.index)
    },
    //   点击选择通道
    selectChannel() {
      this.channelListDlgTitle = this.index > -1 ? `为第 ${this.index + 1} 屏选择通道` : '选择通道'
      this.channelListDlgShow = true
      this.requestChannelData()
    },
    //  请求通道列表
    requestChannelData() {
      const pageNum = this.pageNum
      const pageSize = this.pageSize
      const deviceName = this.searchKeyword
      const deviceId = ''
      this.isLoading = true
      if(!this.dominShow){
          let data = {
            pageSize:10,
            pageNum:1,
            domainCode:this.domainCode
          }
          // let url = this.$store.getters.btnpremissAll[this.permission.domainCode].url
          // let method = this.$store.getters.btnpremissAll[this.permission.domainCode].method
          getDomainCode(url,method,data)
          .then(res => {
            this.channelList = res.data.data
            this.total = res.data.total
            this.isLoading = false
          })
          .catch(err => {
            this.$message.error(err)
          })
          return
      }
      // let url = this.$store.getters.btnpremissAll[this.permission.channelList].url
      // let method = this.$store.getters.btnpremissAll[this.permission.channelList].method
      //  请求通道列表
      getChannelList(url, method, {deviceId, deviceName, pageSize, pageNum }).then(res => {
        this.channelList = res.data.data
        this.total = res.data.total
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.$message.error(err)
      })
    },
    // 重置通道列表
    resetchannelList() {
      this.pageSize = 10
      this.pageNum = 1
      this.searchKeyword = ''
      this.requestChannelData()
    },
    //   控制按钮显示
    showControlBtn() {
      this.bCloseShow = true
    },
    //   控制按钮隐藏
    hideControlBtn() {
      this.bCloseShow = false
    },
    //  获取播放组件url
    getVideoUrl() {
      this.oldCurrentTime = ''
      this.currentTime = ''
      this.videoUrl = ''
      this.videoTitle = this.player.deviceName
      if(this.bLoading) {
        this.bLoading = false
      }
      if (this.url) {
        this.videoUrl = this.url
      } else {
        // this.format = null
        if(this.player.len > 36) {
          this.sendDevicePush('sd', false)
        } else {
          this.sendDevicePush(null, false)
        }
      }
    },
    //  通知设备上传媒体流
    // format---清晰度，null时为高清
    // newStream---是否拉新流
    sendDevicePush(format,newStream = false) {
      const deviceId = this.player.deviceId
      if (!deviceId) {
        this.videoUrl = ''
        return
      }
      if (format) {
        this.format = format
      } else {
        this.format = null
        // this.streamType = 'proxy'
      }
      if(this.format || this.player.protocol === 'ONVIF') {
        this.streamType = 'proxy'
      } else {
        this.streamType = 'rtp'
      }
      this.bLoading = true
      // let url = this.$store.getters.btnpremissAll[this.permission.play].url
      // let method = this.$store.getters.btnpremissAll[this.permission.play].method
      devicePushTream(url, method, { deviceId, format, newStream })
      .then(res => {
        this.normalssrc = res.data.ssrc
        this.ZLServerIp = res.data.mediaIp
        this.play(res.data.ssrc, deviceId)
      })
      .catch(e => {
        this.$message({
          message: `请求推流失败，请稍后重试`,
          type: 'error'
        })
        this.$emit('close', this.index)
        this.bLoading = false
      })
    },
    //  播放
    play(normalssrc, deviceId) {
      this.deviceId = deviceId
      this.ssrc = this.formatSsrc(normalssrc)
      if(this.playType === 1) {
        this.getMulticastUrl()
      } else {
        this.videoUrl = this.getVideoUrlBySsrc()
      }
      this.videoHttp = this.getVideoHttpBySsrc(normalssrc)
      this.bLoading = false
    },
    // 格式化ssrc
    formatSsrc(ssrc) {
      let hex_ssrc = parseInt(ssrc).toString(16)
      const hex_ssrc_size = 8 - hex_ssrc.length
      for (var i = 0; i < hex_ssrc_size; i++) {
        hex_ssrc = '0' + hex_ssrc
      }
      return hex_ssrc.toLocaleUpperCase()
    },
    //  获取videoUrl
    getVideoUrlBySsrc() {
      let protocal = 'ws:'
      let port  = '80'
      const token = getToken()
      let videoUrl = ''
      if(window.location.protocol.startsWith('http')) {
        videoUrl =
        protocal +
        '//' +
        this.ZLServerIp +
        ':' +
        port +
        '/' +
        this.streamType +
        '/' +
        this.ssrc +
        '.flv?st=' +
        new Date().getTime() +
        '&token=' +
        token
      }
      if (window.location.protocol.startsWith('https')) {
        videoUrl =
        process.env.VUE_APP_WS_VIDEO_API +
        this.streamType +
        '/' +
        this.ssrc +
        '.flv?st=' +
        new Date().getTime() +
        '&token=' +
        token
      }
      console.log(videoUrl)
      return videoUrl
    },
    getVideoHttpBySsrc(ssrc) {
      let hex_ssrc = parseInt(ssrc).toString(16)
      const hex_ssrc_size = 8 - hex_ssrc.length
      for (var i = 0; i < hex_ssrc_size; i++) {
        hex_ssrc = '0' + hex_ssrc
      }
      this.ssrc = hex_ssrc.toLocaleUpperCase()
      const videoUrl =
        'http:' +
        '//' +
        this.ZLServerIp +
        ':80/' +
        this.streamType +
        '/' +
        this.ssrc +
        '.flv?st=' +
        new Date().getTime()
      return videoUrl
    },
    //  生成组播url
    getMulticastUrl() {
      let url = ''
      let protocal = 'rtsp:'
      url =  protocal +
        '//' +
        this.ZLServerIp +
        '/' +
        this.streamType +
        '/' +
        this.ssrc
      console.log(url)
      this.$axios({
        method: 'post',
        url: `http://127.0.0.1:8084/api/getConvertUrl?src=${url}`,
        data: {
          code : "h264",
          type : "multicast",
          save : false,
          dir : "",
          time : 0
        }
      }).then(res => {
        if(res.status === 200) {
          this.videoUrl = res.data
          console.log(this.videoUrl)
        } else {
          this.$message({
            type: 'warning',
            message:
              '请点击下载插件并安装（建议使用管理员权限安装），安装成功后刷新页面重试！',
            duration: 5000
          })
        }
      }).catch(err => {
        this.$message({
          type: 'warning',
          message:
            '请点击下载插件并安装（建议使用管理员权限安装），安装成功后刷新页面重试！',
          duration: 5000
        })
      })
    },
    //  根据关键字搜索通道
    searchChannel() {
      this.pageNum = 1
      this.requestChannelData()
    },
    //  通道列表分页查询
    handleCurrentChange(val) {
      // this.pageNum = val
      this.requestChannelData()
    },
    //  改变通道列表每页显示数
    handleSizeChange(val) {
      this.pageSize = val
      this.requestChannelData()
    },
    //  选中通道
    rowSelect(row) {
      this.$emit('channelSelect', row, this.index)
      this.channelListDlgShow = false
    },
    //  通道选择对话框关闭
    channelDlgClose() {
      this.searchKeyword = ''
      this.channelListDlgShow = false
    },
    //  点击按钮跳转至云台控制页面
    goVideoControl() {
      this.$router.push({
        path: '/timemonitor',
        query: {
          player: this.player,
          domainCode:this.domainCode,
          dominShow:this.dominShow,
          type: 1
        }
      })
    },
    clickVideo() {
      this.videoClickCount++
      setTimeout(() => {
        if (this.videoClickCount === 1) {
          // const channelId = this.channelId
          const deviceId = this.deviceId
          const format = null
          const newStream = false
          if(this.format) {
            this.zoomPlayBLoading = true
            // let url = this.$store.getters.btnpremissAll[this.permission.play].url
            // let method = this.$store.getters.btnpremissAll[this.permission.play].method
            devicePushTream(url, method, { deviceId, format, newStream }).then(res => {
              const ssrc = this.formatSsrc(res.data.ssrc)
              let protocal = 'ws:'
              let port  = '80'
              const token = getToken()
              if(window.location.protocol.startsWith('http')) {
                this.singleVideoUrl =
                protocal +
                '//' +
                res.data.mediaIp +
                ':' +
                port +
                '/rtp/' +
                ssrc +
                '.flv?st=' +
                new Date().getTime() +
                '&token=' +
                token
              }
              if (window.location.protocol.startsWith('https')) {
                this.singleVideoUrl =
                process.env.VUE_APP_WS_VIDEO_API +
                this.streamType +
                '/' +
                this.ssrc +
                '.flv?st=' +
                new Date().getTime() +
                '&token=' +
                token
              }
              this.zoomPlayBLoading = false
            }).catch(e => {
              this.zoomPlayBLoading = false
              console.log(e)
            })
          } else {
            this.singleVideoUrl = this.videoUrl
          }
          this.showZoomPlayDl = true
        }
        this.videoClickCount = 0
      }, 200)
    },
    // 关闭正在巡航的路线
    closeCruiseLine() {
      this.$confirm('确定要关闭正在执行的巡航路线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let url = this.$store.getters.btnpremissAll[this.permission.closeLine].url.split('/{')[0]
        // let method = this.$store.getters.btnpremissAll[this.permission.closeLine].method
        closeCruiseLine(url, method, this.cruiseStaus.id).then(res => {
          this.$message.success('关闭巡航路线成功')
          this.$store.commit('app/SET_CRUISE_STATUS', { showCruiseBtn: false, id: '' })
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消关闭巡航'
        })
      })
    },
    messAge(err){
      console.log(' 加载失败时触发通知消息==', err)
    },
    videoEnd() {
      this.reloadVideo()
      console.log('live end!')
    },
    errOr(err) {
      console.log(' 播放器出错回调==', err)
    },
    // 重新拉流
    reloadVideo() {
      this.getVideoUrl()
    }
  }
}
</script>
<style lang="scss" scoped>
$border: 1px solid #5d71ec;
.video {
  position: relative;
  border: $border;
}
.video-main {
  position: relative;
  border-top: $border;
  border-left: $border;
}
.video-last-row {
  position: relative;
  border-top: $border;
  border-left: $border;
  border-bottom: $border;
}
.video-last-column {
  position: relative;
  border-top: $border;
  border-left: $border;
  border-right: $border;
}
.video-close,
.channel-selector {
  position: absolute;
  top: 2px;
  right: 2px;
  color: white;
  font-size: 12px;
  background-color: rgba(128, 128, 128, 0.5);
  padding: 2px 2px;
  cursor: pointer;
  border-radius: 2px;
  width: 55px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  text-overflow: ellipsis;
}
.video-control {
  right: 60px;
}
::v-deep .el-pagination {
  padding: 0 0 10px 0;
}
::v-deep .el-dialog__header {
  text-align: center;
}
::v-deep .video-wrapper .video-js .video-title {
  max-width: min-content;
  font-size: 12px;
  padding: 3px;
  left: 2px;
  top: 2px;
}
// ::v-deep .vjs-control-bar > :first-child {
//   display: none;
// }
</style>
<style>
.tempDiv {
  /* border: 1px dashed blue; */
  background: #5a72f8;
  width: 0;
  height: 0;
  position: fixed;
  /* filter: alpha(opacity:10); */
  opacity: 0.7;
}
/* *{
  -webkit-touch-callout: none; 
  iOS Safari
  -webkit-user-select: none; 
  Chrome/Safari/Opera
  -khtml-user-select: none;
  Konqueror
  -moz-user-select: none; 
  Firefox
  -ms-user-select: none; 
  Internet Explorer/Edge
  user-select: none;
  Non-prefixed version, currently not supported by any browser
} */
</style>
