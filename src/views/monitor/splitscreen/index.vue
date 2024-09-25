<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
              <div class="">
                <!--左侧树-->
                <!-- 多维树组件 -->
                <OrgizeTree
                :currentNodeKey="currentNodeKey"
                :districtList="dominList"
                :isCheck="isCheck"
                :dominShow="dominShow"
                :permissionData="permission"
                :deviceType="nodeType"
                @handleNodeDblclick="handleNodeDblclick"
                @DragEnd="DragEnd"
                :draggable="draggable"
                :nodeType='nodeType'
                @getTableData="getTableData" />
              </div>
      </el-col>
      <!--右侧主体部分-->
      <el-col :xl="20" :lg="18" :sm="17" :xs="24">
          <div class="right" ref="menus">
            <div class="control">
              <div class="control-left">
                <el-button type="primary" @click="closeCurrentWorkspace">
                  一键关流
                </el-button>
              </div>
              <div class="control-right">
                <el-button
                  v-for="item in btnList"
                  :key="item.num"
                  class="video-web-splitscreen-btn"
                  :class="{ 'video-web-splitscreen-btn-active': item.num == playerLength }"
                  @click.prevent="setPlayerLength(item.num)"
                >
                  {{ item.name }}
                </el-button>
                <!-- <el-tooltip effect="dark" content="全屏" placement="top">
                  <el-button type="" class="video-web-splitscreen-btn " @click.prevent="fullscreen">
                      <i class="iconfont iconfull-screen"></i>
                  </el-button>
                </el-tooltip> -->
              </div>

            </div>
            <div id="vedioShow" class="padding-sty">
              
                <div ref="videoShow" class="video-show">
                  
                </div>
            </div>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeData, getDeviceInfoById, getIvsPlayer, getDeviceCriteria } from '@/api/system/organization'
import '@/assets/styles/variables.scss';
import OrgizeTree from '@/components/orgnizeTree'
import pagination from '@/components/comPagination'
import { getCarInformation } from '@/api/monitor/timemonitor'
export default {
  // name:"Splitscreen",
  components: {
    OrgizeTree,
    pagination
  },
  // tree::check：{url: "/pm/tree/node", method: "GET"}
  data() {
    return {
      currentNodeKey:"",
      permission: {
        deviceTree: 'monitor::splitscreen::deviceTree',
        deviceCriteria: 'monitor::splitscreen::deviceCriteria',
        treeCheck: 'tree::check',
        collectDevice: 'collectTag::device',
        collectDelete: 'collectTag::delete',
        collectCheck: 'collecttag::check'
      },
      dominShow: true,
      defaultCode: '08720643745661140101#ff181974255245c3ba5bfc68bb771b2c',
      dominList:[],
      draggable: true,
      districtList: [],
      tagNode: {},
      isCheck: '',
      nodeType:'camera',
      isShow: true,
      btnList: [
        {
          num: 1,
          name: '1'
        },
        {
          num: 2,
          name: '2'
        },
        {
          num: 5,
          name: '3'
        },
        {
          num: 7,
          name: '4'
        }
      ],
      url: '',
      playerLength: 1,
      players: [],
      playerIdx: 0,
      fullscreenFlag: false,
      clientX: null,
      clientY: null,
      distance: [],
      domainCode:'',
      isType: '',
      dragIndex: null,
      isLoading: false,
      workspaceDeviceCounts: 0,
      ssrcs: [],
      rtspUrl: '',
      permissionData: {},
      widowWidth: window.screen.width,
      widowHeight: window.screen.width,
      referenceIdArr: [],
      vedioTop:'',
      vedioLeft:'',
      vedioWidth:'',
      vedioHeight:'',
      deviceZoom:'',
    }
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
    stopIdx: {
      handler(newVal,old){
        this.referenceIdArr.splice(newVal,1)
        console.log(this.referenceIdArr)
      },
      deep: true
    }
  },

  computed: {
    scrollTop() {
      return this.$store.getters.scrollTop
    },
    stopIdx(){
      return this.$store.getters.stopIdx
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/timemonitor') {
      localStorage.setItem('splitscreenData', JSON.stringify({len: this.playerLength, players: [...this.players]}))
    } else {
      localStorage.removeItem('splitscreenData')
    }
    next()
  },
  created() {
    this.permissionData = this.permission
    this.getTreeData()
    
  },
  mounted() {
    
    let _this = this;
    console.log(_this.$browser())
    _this.pageResize()
    window.addEventListener('beforeunload', e => {
      localStorage.removeItem('splitscreenData')
    })
    _this.deviceZoom = window.devicePixelRatio
    var box=document.getElementById('vedioShow'); 
    _this.vedioTop = box.getBoundingClientRect().top + 110;
    _this.vedioLeft = box.getBoundingClientRect().left + 60;
    _this.vedioWidth = box.getBoundingClientRect().width - 50;
    _this.vedioHeight = box.getBoundingClientRect().height - 50;
    window.onresize = ()=>{
      window.fullHeight = window.screen.height;
      window.fullWidth = window.screen.width;
      _this.widowHeight = window.fullHeight;
      _this.widowWidth = window.fullWidth;
    }
    let str0 = {"cmd":"create_control","html_x": window.screenLeft,"html_y": window.screenTop,"html_w":_this.widowWidth,"html_h":_this.widowHeight,"e_type":_this.$browser(),"title":document.title,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
    _this.$store.state.socket.Csock.send(JSON.stringify(str0))
    let str2 = {"cmd":"set_pos","x": _this.vedioLeft * _this.deviceZoom,"y": _this.vedioTop * _this.deviceZoom,"w": _this.vedioWidth * _this.deviceZoom,"h": _this.vedioHeight * _this.deviceZoom,"id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
    _this.$store.state.socket.Csock.send(JSON.stringify(str2))
    let str = {"cmd":"set_layout","id":"001","layout":1,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
    _this.$store.state.socket.Csock.send(JSON.stringify(str))
    let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
    _this.$store.state.socket.Csock.send(str1)
    // this.getIvsPlayer(this.defaultCode)
    // setTimeout(function(){
      // let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      // _this.$store.state.socket.Csock.send(str1)
    // },500)
    
  },
  updated() {
    const _this = this
    console.log("进入updated方法")
    window.onresize = () => {
      
    }
  },
    //离开页面时一定要销毁不然会出问题
  beforeDestroy(){
      let str = {"cmd":"set_layout","id":"001","layout":1,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      this.$store.state.socket.Csock.send(JSON.stringify(str))
      window.removeEventListener("scroll",this.handleScrollx)
      let str1 = `{"cmd":"destroy","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      this.$store.state.socket.Csock.send(str1)
      this.clearVideos()
  },
  methods: {
     handleScrollx(){
       console.log('滚动高度',window.pageYOffset);
       console.log('距离顶部高度',this.$refs.videoShow.getBoundingClientRect().top);
     },
    // 获取树组件数据
    async getTreeData() {
      let url ="/pm/tree/node";
      let method = "get";
      let data = {nodeType:'camera'} || {}
      const res = await treeData(url, method, data)
      if (res.code === 200) {
        let arr = res.data
        this.getTreeLeaf(arr)
      } else {
        this.$message.error('获取区域数据失败')
      }
    },
    getTreeLeaf(treeData) {
        // 判断是否为数组
        if (Array.isArray(treeData)) {
          treeData.every((item,index) => {
            if (item.children && item.children.length > 0) {
              if(item.children[index].children.length == 0 && item.children[index].type =="camera"){
                let tempKey = item.children[index].children.length
                if(!tempKey){
                  this.currentNodeKey = item.children[index].id
                  this.getIvsPlayer(item.children[0].referenceId)
                  return false
                }else{
                  this.getTreeLeaf(item.children)
                }
              }else{
                this.getTreeLeaf(item.children[index+1].children)
              }
            }
          })
        }
    },
    getIvsPlayer(code) {
       let _this = this
//      let url = this.$store.getters.btnpremissAll[this.permission.deviceTree].url
//      let method = this.$store.getters.btnpremissAll[this.permission.deviceTree].method

      getCarInformation(code).then(res=>{
          if(res.code === 200){
            var cameraCode = res.data.code.split("#")[0]
            var domainCode = res.data.code.split("#")[1]
            let data = {
              "cameraCode": res.data.code,
              "mediaURLParam": {
                "broadCastType": 0,
                "packProtocolType": 1,
                "protocolType": 2,
                "serviceType": 1,
                "streamType": 2,
                "transMode": 0
              }
            }
             getIvsPlayer('/sm/ivs/player/play','POST',data)
            .then(res => {
              if(res.code == 200){
                _this.rtspUrl = res.data.rtspURL
                if(this.playerLength == 1){
                  if(res.data.description == "成功"){
                    let str3 = {"cmd":"play_real","id":"001","time":"2020-08-17 00:00:00.000","camera_id": _this.rtspUrl,"camera_name":"摄像头","wnd_index":0,"cmd_id":"001_1 "}
                    _this.$store.state.socket.Csock.send(JSON.stringify(str3))
                  }else{
                    _this.$message.info(res.data.description)
                  }
                }else{
                  if(res.data.description == "成功"){
                    if(_this.stopIdx !== "" && _this.stopIdx >= 0){
                      let str3 = {"cmd":"play_real","id":"001","time":"2020-08-17 00:00:00.000","camera_id": _this.rtspUrl,"camera_name":"摄像头","wnd_index": _this.stopIdx,"cmd_id":"001_1 "}
                      _this.$store.state.socket.Csock.send(JSON.stringify(str3))
                    }else {
                      let str3 = {"cmd":"play_real","id":"001","time":"2020-08-17 00:00:00.000","camera_id": _this.rtspUrl,"camera_name":"摄像头","wnd_index": _this.referenceIdArr.length - 1,"cmd_id":"001_1 "}
                      _this.$store.state.socket.Csock.send(JSON.stringify(str3))
                    }
                    
                  }else{
                    _this.referenceIdArr.pop()
                    _this.$message.info(res.data.description)
                  }
                  
                }
                
               
              }
            })
            // .catch(err => {
            //   debugger
            //   this.$message.error(err)
            // })
          }
      })
    },

    getTableData(data, activeName) {
        this.tagNode = data
        this.isType = 'click'
        if ('type' in data === false) {
          let obj = {...data, type: 'IPC', code: data.deviceId}
          this.getDeviceData(obj)
        }else {
          if(data.referenceId){
            this.getDeviceData(data)
          }
        }
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
    // 从播放器页面回来后
    goBack() {
      this.playVideoShow = false;
      this.biaoGeShow = true;
    },
    // 从多个video返回时
    moreGoBack() {
      this.checkedAll = [];
      this.morePlayVideoShow = false;
      this.biaoGeShow = true;
    },
    // 从多个跳转单个视频播放时
    goItemPlayer(li) {
      this.morePlayVideoShow = false;
      this.biaoGeShow = false;
      this.playVideoShow = true;
    },
    // tabs切换 tree的
    handleClick(tab, event) {
      if (tab.name === "1") {
        this.getTreeData();
      }
    },
    //  获取设备信息
    getDeviceData(data) {
      if (data.children) {
        if (this.isType === 'click'){
          let tempObj = [{
            deviceId:data.id,
            deviceName:data.name,
            referenceId:data.referenceId
          }]
          this.handleleftClick(tempObj)
        }else if (this.isType === 'dbClick'){
          console.log('dbClick',data)
          const player = {
            deviceId: data.id,
            deviceName: data.name,
            referenceId:data.referenceId
          }
          this.goVideoControl(player)
        }
        return
      }
    },
    // 左侧设备树点击
    handleNodeClick(data) {
      this.tagNode = data
      this.isType = 'click'
      if ('type' in data === false) {
        let obj = {...data, type: 'DEVICE', code: data.deviceId}
        this.getDeviceData(obj)
      }
      this.getDeviceData(data)
    },
    // 左侧设备树双击
    handleNodeDblclick(data) {
      this.isType = 'dbClick'
      this.getDeviceData(data)
    },
    // 左侧设备树拖拽
    DragEnd(node, prenode, pis, evt) {
      this.clientX = evt.clientX
      this.clientY = evt.clientY
      this.isType = 'drag'
      for (let i = 0; i < this.distance.length; i++) {
        if (
          this.clientX > this.distance[i].toLeft &&
          this.clientX < this.distance[i].toRight &&
          (this.clientY + this.scrollTop > this.distance[i].toTop &&
            this.clientY + this.scrollTop < this.distance[i].toBottom)
        ) {
          // 调用接口获取视频流
          this.dragIndex = i
          this.getDeviceData(node.data)
        }
      }
    },
    // 跳转至云台控制页面
    goVideoControl(data) {
      this.$router.push({
        path: '/monitor/timemonitor',
        query: {
          player: data,
          domainCode: this.domainCode,
          dominShow: this.dominShow,
          type: 1,
          referenceId: data.referenceId
        }
      })

    },
    // 切换分屏数
    setPlayerLength(len=1) {
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
      this.playerLength = len
      let str = {"cmd":"set_layout","id":"001","layout":len,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      this.$store.state.socket.Csock.send(JSON.stringify(str))
      this.clearVideos()
      this.pageResize()
      this.$forceUpdate()
      localStorage.removeItem('splitscreenData')
    },
    clearVideos() {
      let str = {"cmd":"stop_all","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      this.$store.state.socket.Csock.send(JSON.stringify(str))
      this.referenceIdArr = []
      this.$store.commit('socket/SET_SOCKET_IDX','')
    },
    //  关闭视频
    closeVideo(idx) {
      var player = this.referenceIdArr[idx]
      if (!player) {
        return
      }
      // player.deviceId = ''
      // player.deviceName = ''
      // player.protocol = ''
      // if (this.workspaceDeviceCounts > 0) {
      //   this.workspaceDeviceCounts--
      // }
      // localStorage.removeItem('splitscreenData')
      let str = {"cmd":"stop_video","id":"001","time":"","ocx_notify":1," msg":" "}
    },
    // 全屏展示
    fullscreen() {
      this.$fullscreen.enter(this.$el.querySelector(`.video-show`), {
        wrap: false,
        callback: f => {
          this.fullscreenFlag = f
        }
      })
    },
    //  点击左侧通道树
    handleleftClick(data) {
      const res = data[0]
      if (res) {
        let obj = {url: "/pm/device/criteria", method: "GET"}
        let params={
          mounted:true,
          blurryType:'DEVICE_TREE',
          nodeId:data.deviceId,
          type:this.nodeType,
        }
        // 获取同级设备
        getDeviceCriteria(obj.url,obj.method,params).then(rs=>{
          if(rs.code===200){
            if(this.playerLength==1){
              this.getIvsPlayer(res.referenceId)
            }else{
              if(this.stopIdx){
                this.referenceIdArr.splice(this.stopIdx,0,res.referenceId)
              }else {
                this.referenceIdArr.push(res.referenceId)
              }
              if(this.referenceIdArr.length<=(this.playerLength*this.playerLength)){
                this.getIvsPlayer(res.referenceId)
                this.referenceIdArr = Array.from(new Set([...this.referenceIdArr,res.referenceId]))
              }else{
                this.$message.error(`最多选择${this.playerLength*this.playerLength}个`)
              }
            }
          }else{
            this.$message({
              message: res.meta.message,
              type: 'error'
            })
          }
        })
//        const player = this.players[this.playerIdx]
//        player.deviceId = res.deviceId
//        player.protocol = res.protocol
//        if(res.name){
//          player.deviceName = res.name
//        }else{
//          player.deviceName = res.deviceName
//        }
//        this.setPlayerIdx(this.playerIdx + 1)
      }
    },
    // 通道列表点击选择通道
    handleClickChannel(data, index) {
      console.log('handleClickChannel',data)
        const player = this.players[index]
        player.deviceId = data.deviceId
        player.deviceName = data.name
        player.protocol = data.protocol
        this.workspaceDeviceCounts++
    },
    //  设置下一个未播放窗口下标
    setPlayerIdx(idx) {
      this.playerIdx = idx % this.players.length
    },
    //  一键关流
    closeCurrentWorkspace() {
      this.clearVideos()
    },
  }
}
</script>
<style scoped lang="scss">
@import '../../../assets/styles/variables';
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

  // .turnOff{
  //   width: 99px;
  //   height: 42px;
  //   background-color: #206aff;
  //   border-radius: 6px;
  //   border-color: #206aff;
  //   margin-left: 40px;
  //   margin-top: 10px;
  //   span{
  //     width: 56px;
  //     height: 19px;
  //     font-family: Microsoft YaHei;
  //     font-size: 14px;
  //     font-weight: normal;
  //     font-stretch: normal;
  //     line-height: 19px;
  //     letter-spacing: 0px;
  //     color: #ffffff;
  //   }
  // }
  .padding-sty{
    padding: 15px 30px;
    height: calc(100vh - 120px)
  }
</style>
