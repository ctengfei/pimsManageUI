<template>
  <div class="app-container">
    <el-row :gutter="20">
        <el-col :xl="4" :lg="6" :sm="7" :xs="24">
          <div class="treeBox">
            <!--左侧树-->
            <!-- 多维树组件 -->
            <OrgizeTree
            :favourite="favourite"
            :districtList="dominList"
            :isCheck="isCheck"
            :dominShow="dominShow"
            :deviceType="nodeType"
            @handleNodeDblclick="handleNodeDblclick"
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
                  {{ item.num }}
                </el-button>
              </div>

            </div>
            <div id="vedioShow" class="padding-sty">
              <div style="width: 70vw; height: 75vh">
                  <VideoPlayerGroup 
                      ref="videoPlayerGroup"
                  />
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
      favourite:true,
      dominShow: true,
      defaultCode: '08720643745661140101#ff181974255245c3ba5bfc68bb771b2c',
      dominList:[],
      draggable: true,
      districtList: [],
      tagNode: {},
      isCheck: 'isCheck',
      nodeType:'camera',
      isShow: true,
      btnList: [
        {
          num: 1,
          name: '1'
        },
        {
          num: 4,
          name: '2'
        },
        {
          num: 9,
          name: '3'
        },
        // {
        //   num: 7,
        //   name: '4'
        // }
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
    
  },

  computed: {
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
    // this.getTreeData()
    // this.$store.dispatch('sockets/initCSocket')
  },
  mounted() {
    // this.getIvsPlayer(this.defaultCode)
  },
  updated() {
    const _this = this
    console.log("进入updated方法")
    window.onresize = () => {
      
    }
  },
    //离开页面时一定要销毁不然会出问题
  beforeDestroy(){
      
  },
  methods: {
    
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
            let cameraInfo = {
                id: res.data.code,
                label: res.data.name,
                isPTZControlVisible: false,
            }
            this.$refs['videoPlayerGroup'].playRealVideo(cameraInfo)
          }
      })
      
    },

    getTableData(data, activeName) {
        this.tagNode = data
        this.isType = 'click'
        if(data.type !== "DIR"){
          this.getIvsPlayer(data.referenceId)
        }
        // if ('type' in data === false) {
        //   let obj = {...data, type: 'IPC', code: data.deviceId}
        //   this.getDeviceData(obj)
        // }else {
          
        // }
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
    // 从多个跳转单个视频播放时
    goItemPlayer(li) {
      this.morePlayVideoShow = false;
      this.biaoGeShow = false;
      this.playVideoShow = true;
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
    // 左侧设备树双击
    handleNodeDblclick(data) {
      this.isType = 'dbClick'
      this.domainCode = data.code
      if (data.type !== "DIR") {
        this.getDeviceData(data)
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
      this.playerLength = len
      this.$refs['videoPlayerGroup'].changeWindowMode(len)
      // let str = {"cmd":"set_layout","id":"001","layout":len,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      // this.$store.state.socket.Csock.send(JSON.stringify(str))
      // this.clearVideos()
      // this.pageResize()
      // this.$forceUpdate()
      // localStorage.removeItem('splitscreenData')
    },
    clearVideos() {
      this.$refs['videoPlayerGroup'].release()
      this.$refs['videoPlayerGroup'].getLoginForm()
    },
    //  关闭视频
    closeVideo(idx) {
      var player = this.referenceIdArr[idx]
      if (!player) {
        return
      }
      
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
.treeBox{
  height: 800px;
  overflow-y: auto;
  background-color: #f5f7fa
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
    padding: 10px 30px;
  }
</style>
