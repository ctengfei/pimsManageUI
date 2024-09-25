<template>
  <div class="main" @keyup.esc="escLoading">
    <div class="flex">
      <div class="left-masks">
        <div>
          <el-button
            type="text"
            @click="goBack"
          ><i class="el-icon-d-arrow-left" /> 返 回</el-button>
        </div>
        <main>
              <!-- 左侧按钮 -->
              <div id="vedioBoxs">
                <div class="functionMenu">
                  <div>
                    <span style="margin-left:20px">{{ $props.equipment.deviceName }} 设备 <br/>&nbsp;&nbsp;&nbsp;{{ playTimeYYR }}</span>
                  </div>
                  <div class="allButton1">
                    <div>播放或暂停：</div>
                    <el-button
                      v-if="playButton"
                      type="text"
                      title="暂停"
                      icon="el-icon-video-pause"
                      :disabled="!mySsrc"
                      @click="playerPlay1"
                    />
                    <el-button
                      v-if="!playButton"
                      type="text"
                      title="播放"
                      icon="el-icon-video-play"
                      :disabled="!mySsrc"
                      @click="playerPlay2"
                    />
                  </div>
                  <!-- 倍速选择 -->
                  <div class="allButton3">
                    <div style="float:left">
                      选择倍速：
                    </div>
                    <el-select style="float:left;width: 80px" v-model="multipleValue" placeholder="倍速" title="倍速选择" :disabled="!mySsrc" @visible-change="changeVis($event)" @change="multiple">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <!-- 日期选择 -->
                  <div class="allButton4">
                    <div style="float:left">选择日期：</div>
                    <el-date-picker
                    class="dataPacker"
                      v-model="dateValue.time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      style="width: 300px"
                      @change="dateSelection"
                    />
                  </div>
                </div>
                <div id="vedioShow" style="flex:1; height: 75vh;">

                </div>
              </div>
              <!-- 时间轴 -->
              <footer class="footer">
                <div class="noVideoBox">
                  <div v-for="li in noVideoBox" :key="li.left" class="noPlay" :style="{width:li.width,left:li.left}"></div>
                </div>
                <div class="bookMarks">
                  <div class="inner">
                    <span class="warningSpan" v-for="i in warningSpan" :key="i.id" :style="{left:i.percentage}" :title="i.info" @click="clickWarning(i)" />
                    <span v-for="(li) in msrksSpan" :key="li.id" class="msrksSpan" :style="{left:li.percentage}" :title="li.descption" @click="clickMarks(li)" />
                  </div>
                </div>
                <el-slider
                  v-model="sliderValue"
                  :step="stepNumber"
                  :max="maxNumber"
                  :marks="marks"
                  :format-tooltip="formatTooltip"
                  @change="changeSlider"
                />
              </footer>
          <el-dialog title="新增书签" :visible.sync="dialogMarks" style="margin-top:10%;">
            <el-form :model="marksform">
              <el-form-item label="当前时间" label-width="80px">
                <el-input v-model="marksform.time" disabled />
              </el-form-item>
              <el-form-item label="书签文本" label-width="80px">
                <el-input v-model="marksform.content" />
              </el-form-item>
            </el-form>
            <div slot="footer">
              <el-button type="primary" @click="dialogMarksT">确定</el-button>
              <el-button plain @click="dialogMarksF">取消</el-button>
            </div>
          </el-dialog>

          <el-dialog title="修改书签" :visible.sync="putMarksShow" style="margin-top:10%;">
            <el-form :model="putMarksFrom">
              <el-form-item label="当前时间" label-width="80px">
                <el-input v-model="putMarksFrom.updateTime" disabled />
              </el-form-item>
              <el-form-item label="书签文本" label-width="80px">
                <el-input v-model="putMarksFrom.descption" />
              </el-form-item>
            </el-form>
            <div slot="footer">
              <el-button type="primary" @click="putMarksT">确定</el-button>
              <el-button plain @click="putMarksF">取消</el-button>
            </div>
          </el-dialog>

        </main>
      </div>
    </div>
</div>
</template>

<script>
import {
  startRecording, // 开始录制
  endRecording, // 结束录制
  postSnapPhoto, // 平台抓拍
  playerSpeed, // 倍速
  playerSuspend, // 暂停
  playerPlay, // 播放
  playerStop, // 停止
  playerRange, // 时间轴拖动
  postRecordTag, // 新增书签
  getRecordTag, // 拉取书签
  getQueryAlarm, // 拉取告警
  getSearchMasks, // 搜索书签
  getSearchWarning, // 搜索告警
  deleteRecordTag, // 删除书签
  putRecordTag, // 修改书签
  getHistoryVideo, // 获取历史回放
  getSearchVideo // 录像检索
} from '@/api/videoMange/historyVideo'
import { getToken } from '@/utils/auth'
import { QueryData } from '@/api/configure/argumentsConfigure.js'
import { printScreen, intervalPrintScreen } from '@/utils/dom'
import { getOffsetTop, getOffsetLeft,insertedMousewheel } from '@/utils/dom'
import Moment from 'moment'
import { getObjByKey,getStringByKey } from "@/utils/voice.js"
import { treeData, getDeviceInfoById, getIvsPlayer, getDeviceCriteria } from '@/api/system/organization'

// 控制局部放大的
let rectDom = null
let rectInfo = {}
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
      marsklistShow: true, // 书签列表的展示
      searchForm: { // 搜索框的内容
        time: [new Date(2021, 1, 1, 0, 0, 0), new Date(2021, 1, 1, 23, 59, 59)],
        content: ''
      },
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
      options: [ // 倍速的data
        {
          value: 1,
          label: '1'
        },
        {
          value: 2,
          label: '2'
        },
        {
          value: 4,
          label: '4'
        },{
          value: 8,
          label: '8'
        }
      ],
      dateValue: {
        content: "",
        time: "",
      }, // 绑定的日期
      timeValue: new Date(2021, 1, 1, 0, 0, 0), // 绑定的时间
      multipleValue: 1, // 绑定的倍数
      sliderValue: [], // 时间轴
      SJZTHM: '', // 时间轴滑块的位置时间 分秒 01：50
      marks: {
        0: '00:00',
        1: '01:00',
        2: '02:00',
        3: '03:00',
        4: '04:00',
        5: '05:00',
        6: '06:00',
        7: '07:00',
        8: '08:00',
        9: '09:00',
        10: '10:00',
        11: '11:00',
        12: '12:00',
        13: '13:00',
        14: '14:00',
        15: '15:00',
        16: '16:00',
        17: '17:00',
        18: '18:00',
        19: '19:00',
        20: '20:00',
        21: '21:00',
        22: '22:00',
        23: '23:00'
      },
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

  watch: {
    equipment(n) {
      this.intoPage(new Date(new Date(new Date().toLocaleDateString()).getTime() - 86400000))
    },
    playerStartTime(time) {
      if(this.TimeInterval) window.clearInterval(this.TimeInterval)
      // 当日的最后一段的结束时间
      let EndSj = new Date(this.videoList[0].endTime).getTime()
      let EndSj24 = new Date(`${this.playTimeYYR} 24:00:00`).getTime() + 3000

      let nowEndTime = new Date(this.playerNowTimeSlot.endTime).getTime()

      let s = time
      this.TimeInterval = setInterval(() => {
        console.log("1111111111111111")
        s += 1000
        this.playerNowTime = s
        this.sliderValue = this.formatSecond(new Date(this.playerNowTime)) / 3600
        let nowTime = this.playerNowTime
        // 当前播放时间超过最后一段时间的结束段或者24小时，就跳到第二天播放
        if(nowTime >= EndSj || nowTime >= EndSj24){
          console.log('最后一段播完了');
          let lastDay = new Date(new Date(`${this.playTimeYYR} 00:00:00`).getTime() + 86400000)
          this.dateSelection(lastDay)
          this.$message.success(`已跳转到${lastDay.getMonth() + 1}月${lastDay.getDate()}日`)
          return
        }
        // 当前播放时间超过每一段那就请求下一段
        if(nowTime >= nowEndTime) {
          this.playItem(this.videoList[this.playerNowTimeIndex+1],this.playerNowTimeIndex+1)
        }
      }, (1 / this.multipleValue) *1000)
    },
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
      console.log('播放器宽度', val, that.vedioWidth)
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
  },
  updated() {
    const _this = this
    window.onresize = () => {
      _this.pageResize()
    }
  },
  mounted() {
    // 获取默认抓拍时间
    // this.getQueryData()
    
    // this.getNoVideoData()
    // 局部放大框选
    // this.zoomRect()
    let _this = this;
    _this.deviceZoom = window.devicePixelRatio
    var box=document.getElementById('vedioShow'); 
    console.log(box.getBoundingClientRect(),"box.getBoundingClientRect()")
    _this.vedioTop = box.getBoundingClientRect().top+120;
    _this.vedioLeft = box.getBoundingClientRect().left;
    _this.vedioWidth = box.getBoundingClientRect().width;
    _this.vedioHeight = box.getBoundingClientRect().height - 120;
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
    let str = {"cmd":"set_layout","id":"001","layout":1,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
    _this.$store.state.socket.Csock.send(JSON.stringify(str))
    setTimeout(function(){
      let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      _this.$store.state.socket.Csock.send(str1)
    },500)
    _this.intoPage(new Date(_this.equipment.startTime)) // 初始化数据
  },
    //离开页面时一定要销毁不然会出问题
  beforeDestroy(){
    window.removeEventListener("scroll",this.handleScrollx)
    let str1 = `{"cmd":"destroy","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
    this.$store.state.socket.Csock.send(str1)
  },
  methods: {
    // 播放录像
    goPlayer(data) {
      
      // let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      // this.$store.state.socket.Csock.send(str1)
      // let str0 = {"cmd":"create_control","html_x": window.screenLeft,"html_y": window.screenTop,"html_w":this.widowWidth,"html_h":this.widowHeight,"e_type":"Chrome","title":document.title,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      // this.$store.state.socket.Csock.send(JSON.stringify(str0))
      // console.log("播放器显示位置",  this.widowWidth - 525, this.widowHeight - 158)
      // let str2 = {"cmd":"set_pos","x":490,"y":240,"w":this.widowWidth - 525,"h": this.widowHeight - 158,"id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      // this.$store.state.socket.Csock.send(JSON.stringify(str2))
      // let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      // this.$store.state.socket.Csock.send(str1)
      let date = new Date(new Date(new Date().toLocaleDateString()).getTime() - 86400000)
      let date1 = new Date(new Date(new Date().toLocaleDateString()).getTime())
      // let today = Moment(date).format('YYYY-MM-DD HH:mm:ss')
      // let tomorrow = Moment(date1).format('YYYY-MM-DD HH:mm:ss')
      // if(!this.dateValue.time){
      //   this.dateValue.time = [today,tomorrow]
      // }
      const temp = data
      let obj = {
        "cameraCode": this.equipment.deviceId,
        "mediaURLParam": {
          "broadCastType": 0,
          "packProtocolType": 1,
          "protocolType": 2,
          "serviceType": 4,
          "streamType": 2,
          "transMode": 0,
          "timeSpan":{
              "startTime": temp.startTimestamp,
              "endTime": temp.endTimestamp
          }
        }
      }
      getIvsPlayer('/sm/ivs/player/play','POST',obj)
        .then(res => {
          this.rtspUrl = res.data.rtspURL
          let str3 = {"cmd":"play_his","id":"001","time":"2020-08-17 00:00:00.000","camera_id": this.rtspUrl,"camera_name":"摄像头","wnd_index":0,"cmd_id":"001_1 "}
          this.$store.state.socket.Csock.send(JSON.stringify(str3))
          this.mySsrc=true
          this.playerStartTime = new Date(temp.startTimestamp).getTime()
        })
    },
    pageResize() {
      this.$nextTick(_ => {
        const dom = this.$refs.videoPlayer
        if(!dom) return
        this.distance = []
        for (let i = 0; i < dom.length; i++) {
          const position = {
            toLeft: dom[i].$el.getBoundingClientRect().left,
            toRight: dom[i].$el.getBoundingClientRect().right,
            toTop: dom[i].$el.getBoundingClientRect().top,
            toBottom: dom[i].$el.getBoundingClientRect().bottom
          }
          this.distance.push(position)
        }
      })
    },
    intoPage(sj) {
      this.stopPlayer()
      this.myId.deviceId = this.equipment.deviceId;
      this.myId.channelId = this.equipment.id;
      // 保存一份当前播放的日期
      this.playTimeYYR = Moment(sj).format('YYYY-MM-DD')
      const Vdata = {
        cameraCode: this.equipment.deviceId.split("#")[0],
        domainCode: this.equipment.deviceId.split("#")[1],
        startDate: `${this.playTimeYYR}`,
        endDate: `${this.playTimeYYR}`,
      };
      // 录像检索
      getSearchVideo('/sm/ivs/record/list','GET',Vdata).then(res=>{
        if (!res.data.data.length) {
        this.$message.info(
          this.equipment.deviceName + " 当前日期暂无历史回放！"
          );
          this.noVideoBox = [{left:0,width:'100%'}]
        } else {
          this.videoList = res.data.data;
          this.getNoVideoData(this.videoList)
          if(this.formatSecond(new Date(res.data.data[0].startTime))>(22*3600+40*60)){
            this.playItem(res.data.data[0], 0, 24*3600 - this.formatSecond(new Date(res.data.data[0].startTime)))
          }else{
            this.playItem(res.data.data[0], 0)
          }
        }
      }).catch((err) => {});
    },

    // 根据列表过滤出没有视频的阶段并生成数据
    getNoVideoData(list) {
      let arr = []
      let startTime = new Date(`${this.playTimeYYR} 00:00:00`).getTime()
      let endTime =  new Date(`${this.playTimeYYR} 00:00:00`).getTime() + 86400000
      list.map((item,index)=>{
        if( new Date(item.startTime).getTime() > startTime) {
          let left = this.formatSecond(new Date(startTime)) / (60*60*24) * 100 + '%'
          let width = (new Date(item.startTime).getTime() - startTime )/(60*60*24*1000) * 100 + '%'
          arr.push({left,width})
        }
        startTime =  new Date(item.endTime).getTime()
        if(list.length-1==index){
          if(new Date(item.endTime).getTime() < endTime ){
            let left = this.formatSecond(new Date(item.endTime)) / (60*60*24) * 100 + '%'
            let width = (endTime - new Date(item.endTime).getTime() )/(60*60*24*1000) * 100 + '%'
            arr.push({left,width})
          }
        }
      })
      this.noVideoBox = arr
    },
    // 播放每一个
    playItem(item,index,forwardS) {
      this.getHistoryVideo(item,index,forwardS)
    },
    async getHistoryVideo(equipment,index,forwardS) {
      // 当前播放的时间段和index
      this.playerNowTimeIndex = index
      this.playerNowTimeSlot = equipment
      this.multipleValue = 1
      await this.stopPlayer()
      const videoData = {
        deviceId: this.myId.deviceId,
        startTimestamp: equipment.startTime,
        endTimestamp: equipment.endTime,
      };
      this.goPlayer(videoData)
      // 假如有跳转的时间，那么请求回当前段后再向前一小节
      if(forwardS) {
        setTimeout(() => {
            this.playerStartTime = new Date(equipment.startTime).getTime() + forwardS*1000
        }, 300);

      }
    },
    // 播放器的快退
    playerBack() {
      this.multipleValue= 1
      this.playButton = true
      // let position =new Date(`${this.playTimeYYR} ${this.getTime(this.playerNowTime)}`).getTime()
      let position =this.playerNowTime

      position -= 30*1000
      if(position <= new Date(this.videoList[0].startTime).getTime()) {
        this.jumpPlay(new Date(this.videoList[0].startTime).getTime()+1000)
      }else{
        this.jumpPlay(position)
      }

    },

    // 播放器的 暂停
    playerPlay1() {
      if (this.playButton) {
        if(this.TimeInterval) window.clearInterval(this.TimeInterval)
        let str = {"cmd":"pause","pause":true,"wnd_index":0,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1 ","id":"001"}
        this.$store.state.socket.Csock.send(JSON.stringify(str))
        this.playButton = false
      }
      
    },
    // 播放器的 播放
    playerPlay2() {
      this.playerStartTime = this.playerNowTime
      let str = {"cmd":"pause","pause":false,"wnd_index":0,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1 ","id":"001"}
      this.$store.state.socket.Csock.send(JSON.stringify(str))
      this.playButton = true
      this.multipleValue= 1
    },

    // 播放器的快进 点一次进30秒
    playerQueen() {
      this.multipleValue= 1
      this.playButton = true
      let position =this.playerNowTime
      position += 30*1000
      this.jumpPlay(position)
    },
    // 倍速弹窗显示和隐藏
    changeVis(e){
      let that = this;
      const x = that.widowWidth/2 * 0.001, y = that.widowHeight/2 * 0.855
      if(e){
        const str0 = { "cmd":"cutting_window","x" : x,"y" : y,"w" : 100,"h" : 350,"e_type" : "chrome","time" : "2020-08-17 00:00:00.000","cmd_id" : "001_1 " }
        that.$store.state.socket.Csock.send(JSON.stringify(str0))
      }else{
        const str1 = { "cmd":" repair_window ","x" : x,"y" : y,"w" : 100,"h" : 350,"e_type" : "chrome","time" : "2020-08-17 00:00:00.000","cmd_id" : "001_1 " }
        that.$store.state.socket.Csock.send(JSON.stringify(str1))
      }
    },
    // 倍数的选择
    multiple(n) {
      console.log(n)
      // this.playButton = true
      this.playerStartTime = this.playerNowTime
      let str = {"cmd":"speed","speed":n,"wnd_index":0,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1 ","id":"001"}
      this.$store.state.socket.Csock.send(JSON.stringify(str))
    },
    focusSelect(){
      let that = this;
      const x = that.widowWidth/2 * 0.001, y = that.widowHeight/2 * 0.455
      const str0 = { "cmd":"cutting_window","x" : x,"y" : y,"w" : 300,"h" : 400,"e_type" : "chrome","time" : "2020-08-17 00:00:00.000","cmd_id" : "001_1 " }
      that.$store.state.socket.Csock.send(JSON.stringify(str0))
    },
    blurSelect(){
      let that = this;
      const x = that.widowWidth/2 * 0.001, y = that.widowHeight/2 * 0.455
      const str1 = { "cmd":" repair_window ","x" : x,"y" : y,"w" : 300,"h" : 400,"e_type" : "chrome","time" : "2020-08-17 00:00:00.000","cmd_id" : "001_1 " }
      that.$store.state.socket.Csock.send(JSON.stringify(str1))
      
    },
    // 播放历史录像时日期的选择
    dateSelection(date) {
      if (!date) return
      this.intoPage(date)
    },

    // 播放历史录像时时间的选择
    timeSelection(time) {
      if (!time) return
      this.jumpPlay(new Date(`${this.playTimeYYR} ${Moment(time).format("HH:mm:ss")}`).getTime())
      this.timeValue =  new Date(2021, 1, 1, 0, 0, 0)
    },

    // 点击时间轴上的报警标签时进行跳转
    clickWarning(item) {
      const marksTime = new Date(item.alarmTime)
      this.timeSelection(marksTime)
    },

    // 点击时间轴上的标签时进行跳转
    clickMarks(item) {
      const marksTime = new Date(item.timeStamp)
      this.timeSelection(marksTime)
    },

    // 关于时间的跳转的接口
    // 时间跳转的判断
    // 假如是选择的当前播放时间段内的时间那么直接当前ssrc进行跳转    否则  请求新的流
    jumpPlay(time) {
      if(!this.playerNowTimeSlot.startTime&&!this.mySsrc) return
      this.playerStartTime = time
      let clickTime = time
      let nowPlaySlotstart = new Date(this.playerNowTimeSlot.startTime).getTime()
      let nowPlaySlotEnd = new Date(this.playerNowTimeSlot.endTime).getTime()
      this.forwardS = (clickTime - nowPlaySlotstart) / 1000
      if(clickTime > nowPlaySlotstart && clickTime < nowPlaySlotEnd) {
        this.forwardS = (clickTime - nowPlaySlotstart) / 1000
        let str = {"cmd":"seek","seek":this.forwardS,"wnd_index":0,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1 ","id":"001"}
        this.$store.state.socket.Csock.send(JSON.stringify(str))
      }
      else {
        let obj = {}
        let a = this.videoList.some((item,index)=>{
          if(new Date(item.startTime).getTime() <= clickTime && new Date(item.endTime).getTime() >= clickTime){
            obj.item = item
            obj.index = index
          }
          return new Date(item.startTime).getTime() <= clickTime && new Date(item.endTime).getTime() >= clickTime
        })
        if(a){
          let nowStartTime =  new Date(obj.item.startTime).getTime()
          this.forwardS =  (clickTime - nowStartTime) / 1000
          this.playItem(obj.item,obj.index,this.forwardS)
          obj={}
        }else{
          this.$message.info('当前'+ Moment(time).format('HH:mm:ss') + '时间 无历史回放')
          this.videoList.map((item,index)=>{
            if(new Date(item.startTime).getTime()>=clickTime) {
              this.playItem(item,index)
            }
          })
        }
      }
    },

    // 滑块时间轴的滑动位置
    changeSlider(n) {
      if(this.sliderValue == 24) {
        let lastDay = new Date( new Date(`${this.playTimeYYR}`).getTime())
        this.dateSelection(lastDay)
        this.$message.success(`已跳转到${lastDay.getMonth() + 1}月${lastDay.getDate()}日`)
        return
      }
      let position = `${this.playTimeYYR} ${this.SJZTHM}:00`
      this.multipleValue = 1
      this.jumpPlay(new Date(position).getTime())
    },

    // 播放器的回调，开始结束都会执行
    callbackfun(e ) {},

    escLoading() {
      if(this.loading) this.loading.close()
      this.dialogArr = []
    },

    // 局部放大 改变上下层逻辑
    handleFocusVideo(item,index){
      this.dialogArr.forEach(v=>{
        v.value++
      })
      item.value = 0;
      this.dialogArr.sort((a,b)=>{
         return b.value - a.value
      });

    },

    // 关闭局部放大窗口
    closeDialog(index) {
      this.dialogArr.splice(index, 1)
    },
    // 默认的抓拍时间
    getQueryData(){
      let obj={
        url: '/pm/param/config/page',
        method: 'GET'
      }
      obj.pageNum = 1
      obj.pageSize = 10
      obj.name = ''
      QueryData(obj).then((res)=>{
        res.data.data.map(item=>{
          // 录像时长
          if(item.code === 'DEFAULT_DURATION_OF_VIDEO_RECORDING') {
            if(item.defaultValue >= 60){
              this.takeVideoForm.hour = Math.floor(item.defaultValue / 60)
            }
            this.takeVideoForm.min = item.defaultValue % 60
          }
          // 录像保存天数
          if(item.code === 'VIDEO_VALIDITY') {
            this.takeVideoForm.day = item.defaultValue
          }
          // 抓拍张数
          if(item.code === 'NUMBER_OF_SNAPSHOTS') {
            this.snapForm.size = item.defaultValue
          }
          // 抓拍间隔、
          if(item.code === 'CAPTURE_INTERVAL') {
            this.snapForm.sec = item.defaultValue
          }
        })
      }).catch((err) => {
          this.$message.error(err)
      })
    },

    // ssrc的转换 访问流媒体流
    getVideoUrlBySsrc(ssrc) {
      let hex_ssrc = parseInt(ssrc).toString(16)
      const hex_ssrc_size = 8 - hex_ssrc.length
      for (var i = 0; i < hex_ssrc_size; i++) {
        hex_ssrc = '0' + hex_ssrc
      }
      this.ssrc = hex_ssrc.toLocaleUpperCase()
      const token = getToken()
      let protocal = 'ws:'
      // const videoUrl =
      //   protocal +
      //   '//' +
      //   this.baseMediaUrl +
      //   '/' +
      //   'rtp/' +
      //   this.ssrc +
      //   '.flv?st=' +
      //   new Date().getTime() +
      //   '&token=' +
      //   token
      let videoUrl = ''
        if(window.location.protocol.startsWith('http')) {
          videoUrl =
          protocal +
          '//' +
          this.baseMediaUrl +
          '/' +
          'rtp/' +
          this.ssrc +
          '.flv?st=' +
          new Date().getTime() +
          '&token=' +
          token
        }
        if (window.location.protocol.startsWith('https')) {
          videoUrl =
          process.env.VUE_APP_WS_VIDEO_API +
          'rtp' +
          '/' +
          this.ssrc +
          '.flv?st=' +
          new Date().getTime() +
          '&token=' +
          token
        }
      return videoUrl
    },

    // 返回列表
    goBack() {
      this.$emit('goBack')
    },
    // 转16进制
    getSsrc16(ssrc) {
      let hex_ssrc = parseInt(ssrc).toString(16)
      const hex_ssrc_size = 8 - hex_ssrc.length
      for (var i = 0; i < hex_ssrc_size; i++) {
        hex_ssrc = '0' + hex_ssrc
      }
      return hex_ssrc.toLocaleUpperCase()
    },

    // 录像用
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
        this.baseMediaUrl +
        ':80/' +
        this.streamType +
        '/' +
        this.ssrc +
        '.flv?st=' +
        new Date().getTime()
      return videoUrl
    },

    // 书签检索
    searchMasks(type) {
      const data = {
        deviceId : this.myId.deviceId,
        startTime : `${this.playTimeYYR} ${Moment(this.searchForm.time[0]).format('HH:mm:ss')}`,
        endTime : `${this.playTimeYYR} ${Moment(this.searchForm.time[1]).format('HH:mm:ss')}`,
        blurry :'',
        blurryType:'DESCPTION',
      }
      if(type){
         data.blurry = this.searchForm.content
      }
      let Surl = '/vm/recordTag'
      getSearchMasks(Surl,'GET',data).then(res => {
        this.msrksSpan = res.data.data
      }).catch(err => {
        this.$message.error('搜索失败', err)
      })
    },

    // 修改书签的取消按钮
    putMarksF() {
      this.putMarksShow = false
    },

    // 修改书签的确认按钮
    putMarksT() {
      // this.putMarksShow = false
      // const data = {
      //   descption: this.putMarksFrom.descption,
      //   id: this.putMarksFrom.id,
      //   timeStamp: this.putMarksFrom.updateTime
      // }
      // let Turl = this.$store.getters.btnpremissAll[this.permission.putRecordTag].url
      // let Tmethod = this.$store.getters.btnpremissAll[this.permission.putRecordTag].method
      // putRecordTag(Turl,Tmethod,data).then(res => {
      //   this.searchMasks(false)
      // }).catch(err => {
      //   this.$message.error('修改请求错误', err)
      // })
    },

    // 书签dialog的取消
   dialogMarksF () {
      this.dialogMarks = false
    },

    // 书签dailog的确认
    dialogMarksT() {
      // if (!this.marksform.content) {
      //   this.$message.error('请输入标签内容')
      //   return
      // }
      // this.dialogMarks = false
      // const newTime = new Date(this.marksform.time)
      // const num = (newTime.getHours() * 60 * 60 + newTime.getMinutes() * 60 + newTime.getSeconds()) / (24 * 60 * 60)
      // const data = {
      //   descption: this.marksform.content,
      //   name: '',
      //   percentage: (num * 100).toFixed(4) + '%',
      //   deviceId: this.myId.deviceId,
      //   timeStamp: this.marksform.time
      // }
      // let Purl = this.$store.getters.btnpremissAll[this.permission.postRecordTag].url
      // let Pmethod = this.$store.getters.btnpremissAll[this.permission.postRecordTag].method
      // postRecordTag(Purl,Pmethod,data).then(res => {
      //   this.searchMasks(false)
      // }).catch(err => {
      //   this.$message.error('提交失败，请求错误！', err)
      // })
    },

    // 点击新增标签
    newMarks() {
      this.dialogMarks = true
      this.marksform= {
        time: '',
        content: ''
      }
      // const hfs = this.getTime(Math.floor(this.playerNowTime))
      // this.marksform.time = `${this.playTimeYYR} ${hfs}`
      this.marksform.time = Moment(new Date(this.playerNowTime)).format('YYYY-MM-DD HH:mm:ss')
    },

    // 修改书签
    putMarks(data, index) {
      this.putMarksShow = true
      this.putMarksFrom = {
        id: data.id,
        descption: data.descption,
        updateTime: data.timeStamp
      }
    },

    // 收起书签列表
    closeMarsklist() {
      this.marsklistShow = false
    },

    snapPhoto2() {
      printScreen(this.$refs.VideoPlayer)
    },

    // 恢复默认设置 抓拍多张图片
    clearSnap() {
      this.getQueryData()
    },

    // 取消 抓拍多张图片
    caloff() {
      this.popoverShow = false
    },
    // 立马进行抓拍 默认3 张 每隔0.1秒抓一张
    snapMorePhoto() {
      let interval = 0
      if (this.snapForm.hour) {
        interval += this.snapForm.hour * 60 * 60
      }
      if (this.snapForm.min) {
        interval += this.snapForm.min * 60
      }
      if (this.snapForm.sec) {
        interval += this.snapForm.sec
      }
      if (this.snapForm.size <= 1) {
        this.$message.error('连拍数量须大于1张')
        return
      }
      if (interval < 0.001) {
        this.$message.error('时间必须大于 0.001s')
        return
      }
      intervalPrintScreen(this.$refs.VideoPlayer, this.snapForm.size, interval*1000)
    },
    // 确认 抓拍多张图片
    gitSnapSize() {
      this.popoverShow = false
    },

    // 时间轴的刻度显示
    formatTooltip(val) {
      var arr = []
      if (String(val).indexOf('.') > -1) {
        arr = String(val).split('.')
      } else {
        arr = `${String(val)}.0`.split('.')
      }
      var hour = ''
      var min = ''
      if (Number(arr[0]) < 10) {
        hour = `0${arr[0]}`
      } else {
        hour = arr[0]
      }
      min = `0.${arr[1]}` * 60
      if (min < 10) {
        min = `0${min}`
      }
      this.SJZTHM = `${hour}:${String(min).slice(0, 2)}`
      return `${hour}:${String(min).slice(0, 2)}`
    },
    // 局部放大框选
    zoomRect() {
      let leftDis = this.$refs.VideoPlayer.getBoundingClientRect().left,
          rightDis = this.$refs.VideoPlayer.getBoundingClientRect().right,
          topDis = this.$refs.VideoPlayer.getBoundingClientRect().top,
          bottomDis = this.$refs.VideoPlayer.getBoundingClientRect().bottom

      const dom = this.$refs.VideoPlayer
      // let stateBar = document.getElementById("bottom");
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
        rectInfo = {
            midPointX: 0, // x轴坐标
            midPointY: 0, // y轴坐标
            windowLength: 0, // 宽度
            windowWidth: 0, // 高度
            lengthX: 0, // 圈出来的宽度
            lengthY: 0 // 圈出来的高度
          }
        if (!that.zoomRectFlag) {
          return
        }
        const posx = e.clientX
        const posy = e.clientY
        rectDom = document.createElement('div')
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
          const width = Math.abs(posx - left)
          const height = Math.abs(posy - top)
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

    // 局部放大 的位置计算
    removeChildDom(dom, rectInfo) {
      if(dom) dom.parentNode.removeChild(dom)
      document.onmousemove = null
      document.onmouseup = null
      if(rectInfo.lengthX < 50 || rectInfo.lengthX === undefined ) return
      if(this.dialogArr.length < 3) {
        this.dialogArr.push({
          id:new Date().getTime(),
          value:this.dialogArr.length,
          rectInfo
        })
      }
    },

    // 根据秒转换成 00：00：00格式
    getTime(seconds) {
      const hour = Math.floor(seconds / 3600) >= 10 ? Math.floor(seconds / 3600) : '0' + Math.floor(seconds / 3600)
      seconds -= 3600 * hour
      const min = Math.floor(seconds / 60) >= 10 ? Math.floor(seconds / 60) : '0' + Math.floor(seconds / 60)
      seconds -= 60 * min
      const sec = seconds >= 10 ? seconds : '0' + seconds
      return hour + ':' + min + ':' + sec

    },
    // 停流---清除定时器---去掉播放器
    stopPlayer() {
      if(this.TimeInterval) window.clearInterval(this.TimeInterval)
      this.mySsrc = "";
      let str1 = `{"cmd":"stop_all","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}`
      this.$store.state.socket.Csock.send(str1)
    },
    // 年月日时分秒转换为秒
    formatSecond(time) {
      return time.getHours()*3600 + time.getMinutes()*60 + time.getSeconds()
    }
  },

  // 退出和刷新页面走的生命周期
  destroyed(){
    this.stopPlayer()
  }
}
</script>

<style lang='scss' scoped>
@import '../../../assets/styles/variables';
$tags-size:15px;
 #vedioBoxs{
   display: flex;
 }
.main {
  position: relative;
  height: $main-height;
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
    overflow: hidden;
    position: relative;

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
      line-height: 50px;
      bottom:52px;
      // margin: 0 auto;
      // max-width: 1020px;
      width: 400px;
      // height: 80px;
      flex-direction: column;
      display: flex;
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

    footer {
      width: 99%;
      height: 50px;
      overflow: hidden;
      position: absolute;
      bottom:5px;
      margin: 0 auto;
      ::v-deep .el-slider__runway {
        height: 14px;
        margin: 0 auto;
        background-color: #20449c !important;
      }

     ::v-deep .el-slider__button{
       border-radius: 0;
       width: 2px;
       height: 60px;
       border: 3px solid rgba(8,229,242,0.6);
     }

      ::v-deep .el-slider__bar {
        height: 50px;
      }
      ::v-deep .el-slider__marks-text{
        color: #01bee5;
      }
      ::v-deep .el-slider__button-wrapper {
        top: -11px;
      }
      ::v-deep .el-slider__stop {
        top: 50%;
        width: 1px;
        background-color: rgb(29, 24, 24);
      }

      .noPlay{
        width: 0;
        height: 50px;
        background: rgba(170, 170, 170, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 300;
      }

      .bookMarks{
        width: 100%;
        height: 50px;
        background-color: #20449c !important;
        position: absolute;
        top: 0;
        left: 0;
        .inner{
          width: 100%;
          height: 100%;
          position: relative;
          .msrksSpan{
            width: 5px;
            position: absolute;
            top: 0;
            left: 30px;
            background:rgba(24,220,167,0.6);
            height: 100%;
            cursor: pointer;
            z-index: 200;
          }
          .warningSpan{
            width: 5px;
            position: absolute;
            top: 0;
            left: 30px;
            background: rgba(255,0,0,0.6);
            // background: #776b6b;
            height: 100%;
            cursor: pointer;
            z-index: 200;
          }
        }
      }
    }
  }
  .left-masks{
    width:100%;
    margin-right: 10px;
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
  .right-masks{
    height: 100%;

    ::v-deep .el-tabs__content{
      padding: 15px 0 0 0;
    }
    .searchForm{
      margin-top: 10px;
      margin-bottom: 30px;
      .search{
         .el-input{
          width: 70%;
        }
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
      }
    }
    .video-table{
      width: calc(380px - 15px - 15px);
      overflow: auto;
    }
    .marskstable{
      // height: 50%;
      overflow: auto;
    }
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
  .padding-10{
    padding: 10px;
  }

}

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
  -webkit-touch-callout: none; iOS Safari
  -webkit-user-select: none; Chrome/Safari/Opera
  -khtml-user-select: none; Konqueror
  -moz-user-select: none; Firefox
  -ms-user-select: none; Internet Explorer/Edge
  user-select: none;
  Non-prefixed version, currently not supported by any browser
} */
.main main .footer{
  position: absolute;
  bottom: 0;
}
</style>
