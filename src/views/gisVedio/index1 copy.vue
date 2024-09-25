<template>
  <div class="app-container-bow main"> 
    <div class='goBackBtn gobackCls' @click="goBack">
                <svg-icon icon-class="icon-goback" style="height: 30px;width: 16px;" />
                <div class="icon-name">返回</div>
            </div>
  </div>
</template>

<script>
import { getIvsPlayer } from '@/api/system/organization'
import '@/assets/styles/variables.scss';

export default {
  data() {
    return {
      rtspUrl: '',
      widowWidth: document.documentElement.clientWidth,
      widowHeight: document.documentElement.clientHeight,
      fromPath:'',
      toPath:''
    }
  },

  watch: {
    widowWidth (val) {
      let that = this;
      console.log('实时屏幕宽度', val, that.widowWidth)
    },
    widowHeight (val) {
      let that = this;
      console.log('实时屏幕高度', val, that.widowHeight)
    },
  },

  computed: {
    scrollTop() {
      return this.$store.getters.scrollTop
    }
  },

  created() {
  },
  mounted() {
    let _this = this;
    _this.deviceCode = _this.$route.query.deviceCode
    window.addEventListener('beforeunload', e => {
      localStorage.removeItem('splitscreenData')
    })
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        window.fullWidth = document.documentElement.clientWidth;
        _this.windowHeight = window.fullHeight;
        _this.windowWidth = window.fullWidth;
        console.log('屏幕宽度', this.widowWidth)
        console.log('屏幕高度', this.widowHeight)

        let str0 = {"cmd":"create_control","html_x": window.screenLeft,"html_y": window.screenTop,"html_w":_this.widowWidth,"html_h":_this.widowHeight,"e_type":"Chrome","title":document.title,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
        _this.$store.state.socket.Csock.send(JSON.stringify(str0))
        console.log("播放器显示位置",  _this.widowWidth - 525, _this.widowHeight - 158)
        let str2 = {"cmd":"set_pos","x":_this.widowWidth * 0.256,"y":_this.widowHeight * 0.225,"w":_this.widowWidth - (_this.widowWidth * 0.272),"h": _this.widowHeight - (_this.widowHeight * 0.13),"id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
        _this.$store.state.socket.Csock.send(JSON.stringify(str2))
      })
    }
    console.log('屏幕宽度', this.widowWidth)
    console.log('屏幕高度', this.widowHeight)
    let str0 = {"cmd":"create_control","html_x": window.screenLeft,"html_y": window.screenTop,"html_w":_this.widowWidth,"html_h":_this.widowHeight,"e_type":"Chrome","title":document.title,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
    _this.$store.state.socket.Csock.send(JSON.stringify(str0))
    console.log("播放器显示位置",  _this.widowWidth - 525, _this.widowHeight - 158)
    let str2 = {"cmd":"set_pos","x":_this.widowWidth * 0.256,"y":_this.widowHeight * 0.225,"w":_this.widowWidth - (_this.widowWidth * 0.272),"h": _this.widowHeight - (_this.widowHeight * 0.13),"id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
    _this.$store.state.socket.Csock.send(JSON.stringify(str2))
    setTimeout(function(){
      let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      _this.$store.state.socket.Csock.send(str1)
    },1500)
    _this.getCarInformation()
    
  },
  updated() {
    const _this = this
  },
    //离开页面时一定要销毁不然会出问题
  beforeDestroy(){
      window.removeEventListener("scroll",this.handleScrollx)
      let str1 = `{"cmd":"destroy","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      this.$store.state.socket.Csock.send(str1)
      let str = {"cmd":"stop_all","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      this.$store.state.socket.Csock.send(JSON.stringify(str))
  },
  beforeRouteEnter(to,from,next){
    next(vm=>{
      vm.fromPath = from.path
    })
  },
  methods: {
    getCarInformation() {
      let _this = this
      console.log(_this.deviceCode)
      let data = {
        "cameraCode": _this.deviceCode,
        "mediaURLParam": {
          "broadCastType": 0,
          "packProtocolType": 1,
          "protocolType": 2,
          "serviceType": 1,
          "streamType": 2,
          "transMode": 0
        }
      }
      getIvsPlayer('/yun/sm/ivs/player/play','POST',data).then(res => {
        if(res.meta.status == 200){
          _this.rtspUrl = res.data.rtspURL
          if(res.data.description == "成功"){
            let str3 = {"cmd":"play_real","id":"001","time":"2020-08-17 00:00:00.000","camera_id": _this.rtspUrl,"camera_name":"摄像头","wnd_index":0,"cmd_id":"001_1 "}
            _this.$store.state.socket.Csock.send(JSON.stringify(str3))
          }else{
            this.$message.info(res.data.description)
            let str3 = {"cmd":"stop_real","id":"001","time":"2020-08-17 00:00:00.000","wnd_index":0,"cmd_id":"001_1 "}
            _this.$store.state.socket.Csock.send(JSON.stringify(str3))
          }
          
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 从播放器页面回来后
    goBack() {
      this.$router.push({path:this.fromPath})
    },
  }
}
</script>
<style scoped lang="scss">
  .goBackBtn{
    display: flex;
    flex-direction: row;
    align-items: center;
    clear: both;
    height:80px;
    position: relative;
    top: 10px;
    left: 1%;
  }
  .gobackCls{
    height:27px;
    position: relative;
    top: 0px;
    cursor: pointer;
  }
  .icon-name{
    margin-left:10px
  }
  ::v-deep .wl-tree-select .no-wrap {
    height: 32px;
  }
  ::v-deep .el-pagination {
  padding: 0 0 10px 0;
  }
  .workspaceDl {
    .controlBtn {
      display: flex;
      justify-content: space-between;
    }
  }
  .all-capture{
    padding-top: 7px;
  }
  .right-area{
    padding: 0px;
  }
  .left-top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    .broadcastBtns {
      display: flex;
    }
    span {
      width: 32px;
      height: 32px;
      margin-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #3377ff;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
  }
  .right {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    display: inline-block;
    .control {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-self: center;
      .control-left {
        display: flex;
        text-align: center;
      }
      .control-right {
        margin-top: 15px;
        margin-right: 40px;
        .fullscreen {
          padding: 0;
          width: 28px;
          height: 28px;
        }
        .el-button{
          width: 28px;
          height: 28px;
          padding: 0;
        }
      }
    }
  }
  .title-area{
    margin-top:-32px;
    margin-bottom:20px;
  }
  .video-show {
    width: 96%;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    .col-1 {
      width: 100%;
      height: 100%;
    }
    .col-2 {
      width: 50%;
      height: 50%;
    }
    .col-3 {
      width: 33.33%;
      height: 33.33%;
    }
    .col-4 {
      width: 25%;
      height: 25%;
    }
    .col-5 {
      width: 20%;
      height: 20%;
    }
    .col-6 {
      width: 16.66%;
      height: 16.66%;
    }
    .col-7 {
      width: 14.28%;
      height: 14.28%;
    }
    .col-8 {
      width: 12.5%;
      height: 12.5%;
    }
    .col-9 {
      width: 11.11%;
      height: 11.11%;
    }
    .col-10 {
      width: 10%;
      height: 10%;
    }
  }

  .turnOff{
    width: 99px;
    height: 42px;
    background-color: #206aff;
    border-radius: 6px;
    border-color: #206aff;
    margin-left: 40px;
    margin-top: 10px;
    span{
      width: 56px;
      height: 19px;
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 19px;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
  .padding-sty{
    padding: 15px 30px;
  }
</style>
