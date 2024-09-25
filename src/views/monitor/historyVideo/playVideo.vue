<template>
  <div class="main">
    <div class="flex">
      <div class="left-masks">
        <div class="video-web-form-box video-web-flex">
          <el-button
            type="text"
            @click="goBack"
          ><i class="el-icon-d-arrow-left" /> 返 回</el-button>
         
        </div>
        <main>
          <div id="vedioBoxs">
            <div class="functionMenu">
              <div>
                <div class="video-web-content-title" style="height:40px;text-align: center;">{{ $props.equipment.name }}<span style="margin-left: 40px;">{{ playTimeYYR }}历史回看</span> </div>
              </div>
              <div style="width: 87vw; height: 75vh">
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
    // equipment(n) {
    //   this.intoPage(new Date(new Date(new Date().toLocaleDateString()).getTime() - 86400000))
    // },
    playerStartTime(time) {
      if(this.TimeInterval) window.clearInterval(this.TimeInterval)
      // 当日的最后一段的结束时间
      let EndSj = new Date(this.videoList[0].endTime).getTime()
      let EndSj24 = new Date(`${this.playTimeYYR} 24:00:00`).getTime() + 3000

      let nowEndTime = new Date(this.playerNowTimeSlot.endTime).getTime()

      let s = time
      this.TimeInterval = setInterval(() => {
        s += 1000
        this.playerNowTime = s
        this.sliderValue = this.formatSecond(new Date(this.playerNowTime)) / 3600
        let nowTime = this.playerNowTime
        // 当前播放时间超过最后一段时间的结束段或者24小时，就跳到第二天播放
        if(nowTime >= EndSj || nowTime >= EndSj24){
          console.log('最后一段播完了');
          let lastDay = new Date( new Date(`${this.playTimeYYR} 00:00:00`).getTime() + 86400000)
          console.log(lastDay,"lastDaylastDaylastDay")
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
  },
  mounted() {
    let tempYYR = new Date(new Date(new Date().toLocaleDateString()).getTime() - 86400000);
    this.playTimeYYR = Moment(tempYYR).format('YYYY-MM-DD')
    let obj={
        startTime:`${this.playTimeYYR} 00:00:01`,
        endTime:`${this.playTimeYYR} 23:59:59`,
      }
    // this.intoPage() // 初始化数据
    setTimeout(()=>{
      this.goPlayer(obj)
    },1000)
  },
    //离开页面时一定要销毁不然会出问题
  beforeDestroy(){
    this.$refs['videoPlayerGroup'].release()
  },
  methods: {
    // 播放录像
    goPlayer(obj) {
      let cameraInfo = {
          cameraId: this.equipment.code,
          cameraName: this.equipment.name,
          isPTZControlVisible: false,
          beginTime: obj.startTime,
          endTime: obj.endTime,
      }
      this.$refs['videoPlayerGroup'].playVideoBack(cameraInfo)
    },
    intoPage(sj) {
      this.stopPlayer()
      this.myId.deviceId = this.equipment.code;
      this.myId.channelId = this.equipment.id;
      // 保存一份当前播放的日期
      
      // 录像检索
      let obj={
        startTime:`${this.playTimeYYR} 00:00:00`,
        endTime:`${this.playTimeYYR} 23:59:59`,
      }
      let videoList = [{
        startTime:`${this.playTimeYYR} 00:00:00`,
        endTime:`${this.playTimeYYR} 23:59:59`,
      }]
      this.videoList = videoList;
      if(this.formatSecond(new Date(obj.startTime))>(22*3600+40*60)){
        this.playItem(obj, 0, 24*3600 - this.formatSecond(new Date(obj.startTime)))
      }else{
        this.playItem(obj, 0)
      }
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
      let str = {"cmd":"pause","pause":false,"wnd_index":0,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1 ","id":"001"}
      this.$store.state.socket.Csock.send(JSON.stringify(str))
      this.playButton = true
      this.multipleValue= 1
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

    escLoading() {
      if(this.loading) this.loading.close()
      this.dialogArr = []
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
.main main .footer{
  position: absolute;
  bottom: 0;
}
</style>
