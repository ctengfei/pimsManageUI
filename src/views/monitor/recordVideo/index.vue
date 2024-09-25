<template>
  <div class="app-container">
    <div v-if="tableShow">
      <el-row :gutter="20">
        <el-col :xl="4" :lg="6" :sm="7" :xs="24" style="background-color:#f5f7fa;">
          <div class="treeBox">
            <OrgizeTree
            :nodeType='nodeType'
            :isCheck="isCheck"
            :permissionData="{}"
            @getTableData="getTableData" />
          </div>
        </el-col>
        <el-col :xl="20" :lg="18" :sm="17" :xs="24">
          <el-form inline>
            <el-form-item label="录像日期">
              <el-date-picker
                v-model="searchform.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="ml5"
                icon="el-icon-search"
                @click="searchButton()"
                >搜索</el-button
              >
              <el-button
                plain
                icon="el-icon-refresh-left"
                @click="resetList()"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="600"
            @selection-change="SelectionChange"
          >
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column
              prop="deviceId"
              label="设备编号"
              show-overflow-tooltip
              width="180px"
            />
            <el-table-column
              prop="deviceName"
              label="设备名称"
              show-overflow-tooltip
            />
            <el-table-column
              prop="startTime"
              label="开始时间"
              sortable
              show-overflow-tooltip
            />
            <el-table-column
              prop="endTime"
              label="结束时间"
              sortable
              show-overflow-tooltip
            />
            <el-table-column
              prop="creator"
              label="创建者"
              show-overflow-tooltip
            />
            <el-table-column label="操作" width="140" align="left">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #206aff"
                  @click="goPlayer(scope.$index, scope.row)"
                  >播放</el-button
                >
                <!-- <el-button
                  type="text"
                  style="color: #206aff"
                  @click="download(scope.$index, scope.row)"
                  >下载</el-button
                > -->
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="tableData && tableData.length > 0"
            :page.sync="Interface.pageNum"
            :total="pageTotal"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="Interface.pageSize"
            @pagination="fetchRecordList"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 播放器 -->
    <PlayVideo
      :equipment="playerItem"
      :lengths = "1"
      v-if="playerShow"
      ref="videoPlayer"
      @goBack="goBack"
    >
    <div ref="videoShow" class="video-show">
      <VideoPlayer
        ref="videoPlayer"
        class="videoPlayer"
        aspect='fullscreen'
        :isLive ='false'
        :class="{'col-1': playerLength == 1,'col-2': playerLength == 4,'col-3': playerLength == 9,'col-4': playerLength == 16,'col-5': playerLength == 25}"
      />
    </div>
    </PlayVideo>
    <!-- 书签列表 -->
    <!-- 倍速下载 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="320px">
      <el-radio-group v-model="radio" @change="multipleDownload">
        <el-radio :label="1">一倍速</el-radio>
        <el-radio :label="2">二倍速</el-radio>
        <el-radio :label="3">三倍速</el-radio>
      </el-radio-group>
      <span slot="footer">
        <el-button type="primary" @click="confirmDownload">确定</el-button>
        <el-button plain @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reCollectDevice, reQueryDeviceByCollect } from "@/api/mutiTree";
import VideoPlayer from '@/components/videoPlayer/index.vue'
import PlayVideo from "./playVideo";
import { downloadFile, downloadFileBypath } from "@/utils";
import { validateString } from "@/utils/validate";
import { treeData, getIvsPlayer } from "@/api/system/organization";
import { parseTime } from "@/utils/index.js";
import OrgizeTree from '@/components/orgnizeTree'
import {
  getRecordVideo,
  getFuzzyList,
  deleteVideoList,
  deleteSnapVideoAll,
  playRecordVideo,
  videoRetrieval,
  treeClick,
} from "@/api/videoMange/recordVideo";
import pagination from '@/components/comPagination'
import { reQueryTags } from "@/api/monitor/tagsManage";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import {
  reQueryCollect,
  reAddCollect,
  reUpdateCollect,
  reDeleteCollect,
} from "@/api/monitor/collect";
import { getCarInformation } from '@/api/monitor/timemonitor'

export default {
  name:"RecordVideo",
  components: {
    PlayVideo,
    OrgizeTree,
    pagination
  },
  data() {
    return {
      input: "",
      value2: "",
      options: [
        {
          value: "plan",
          label: "计划录像",
        },
        {
          value: "manual",
          label: "手动录像",
        },
        {
          value: "alarm",
          label: "告警联动录像",
        },
      ],
      // 标签页
      tabList: [
        { label: "组织树", name: "first" },
        { label: "收藏", name: "second" },
      ],
      prop: {
        // 树组件相关属性
        children: "children",
        label: "name",
        value: "id",
      },
      timer: null,
      tagNode: {},
      confirmTitle: "",
      type: "",
      isCheck: "",
      isShow: true,
      treeValue: {
        id: "",
        pid: "",
        name: "",
        pname: "",
        PId: "",
      },
      valuef: "",
      // 树列表
      value1: [],
      // 视频类型列表
      value: "",
      // 搜索框的数据 获取到并搜索
      searchform: {
        content: "",
        time: "",
      },
      // 时间搜索
      lockform: {
        time: "",
        author: "",
      },
      // 标签页
      tabData: [
        // tab数据
        { label: "组织树", name: "first" },
      ],
      data: [], // 树组件渲染数据
      obj: {
        // 树组件相关属性
        children: "children",
        label: "name",
        value: "id",
      },
      nodekey: "id", // 树节点标识
      // 控制锁定弹出层
      dialogLock: false,
      // 总页数
      pageTotal: 0,
      // 搜索栏下边的多选框
      checkList: [],
      // 数据的选中，执行删除和下载
      checkedAll: [],
      // 数据的选中的id，执行删除和下载
      checkedAllId: [],
      // 表格的展示
      tableShow: true,
      // 控制播放器的展示
      playerShow: false,
      //  播放的url地址
      playerUrl: "",
      // 播放的item数据
      playerItem: null,
      // 点击tree的设备id
      deviceId: "",
      // 列表数据
      tableData: [{}],
      dialogVisible: false,
      time1: "",
      time2: "",
      // 倍速
      radio: 3,
      // 倍速的值
      doubleSpeed: 3,
      // 录像地址
      myFilePath: "",
      data: [],
      Interface: {
        pageNum: 1,
        pageSize: 10,
        endTime: "",
        startTime: "",
        content: "",
      },
      checkdisabled: true,
      statusTab: 0,
      permissionData: {},
      nodeType:"camera",
      carInformation:"",
      playerLength:1,
      rtspUrl:"",
      widowWidth: document.documentElement.clientWidth,
      widowHeight: document.documentElement.clientHeight
    };
  },
  created() {
    // 树数据
    this.isCheck = "";
    this.fetchRecordList();
  },
  mounted() {
     // 初始化表格的数据
    this.searchButton();
    let _this = this;
    _this.pageResize()
    window.addEventListener('beforeunload', e => {
      localStorage.removeItem('splitscreenData')
    })
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
    $route(to, from){
      console.log('当前页面路由：' + to);
      console.log('上一个路由：' + from);
    },
  },
  updated() {
    const _this = this
    window.onresize = () => {
      // _this.pageResize()
    }
  },
  beforeDestroy(){
    // this.$refs.videoPlayer.closVideo();
  },
  methods: {
    handleScrollx(){
       console.log('滚动高度',window.pageYOffset);
       console.log('距离顶部高度',this.$refs.videoShow.getBoundingClientRect().top);
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
    // 分页
    fetchRecordList(){
      
      const obj = {
        startTime: "",
        endTime: "",
        nodeId: "",
        cameraCode: this.carInformation.split("#")[0],
        domainCode: this.carInformation.split("#")[1],
        pageNum: this.Interface.pageNum,
        pageSize: this.Interface.pageSize,
        content: 'manual',
        url: '/sm/ivs/record/list',
        method: 'GET',
      };
      if(!this.carInformation){
        obj.cameraCode = ""
        obj.domainCode = ""
      }
      if (this.searchform.time || this.searchform.content) {
        if (this.searchform.time && !validateString(this.searchform.time)) {
          obj.startTime = this.searchform.time[0];
          obj.endTime = this.searchform.time[1];
        }
        this.FuzzyList(obj);
        return;
      }
      this.FuzzyList(obj);
    },
    // 获取设备编码
    getCarInformation(code){
      getCarInformation(code).then(res=>{
        this.carInformation = res.data.code
        const obj = {
          startTime: "",
          endTime: "",
          cameraCode: this.carInformation.split("#")[0],
          domainCode: this.carInformation.split("#")[1],
          pageNum: this.Interface.pageNum,
          pageSize: this.Interface.pageSize,
          url: '/sm/ivs/record/list',
          method: 'GET',
        };
        this.FuzzyList(obj)
      })
    },
    // 树节点的点击
    getTableData(data, activeName) {
      this.tagNode = data;
      this.searchform.content = "";
      this.searchform.time = " ";
      this.Interface.pageNum = 1;
      const obj = {
        startTime: "",
        endTime: "",
        nodeId: "",
        cameraCode: "",
        domainCode: "",
        pageNum: this.Interface.pageNum,
        pageSize: this.Interface.pageSize,
        content: 'manual',
        url: '/sm/ivs/record/list',
        method: 'GET',
      };
      if (activeName === 'second') {
        obj.deviceId = data.id;
      } else {
        obj.nodeId = data.id;
      }
      if(data.referenceId){
        this.getCarInformation(data.referenceId)
      }
    },
    nodeCheck(data) {
      console.log(22, data);
      this.TreeData = data;
    },
    // 数据中的多选框的随时赋值
    SelectionChange(v) {
      this.checkedAll = v;
      const arr = [];
      v.map((item) => {
        arr.push(item.id);
      });
      this.checkedAllId = arr;
      if (arr.length > 0) {
        this.checkdisabled = false;
      } else {
        this.checkdisabled = true;
      }
    },
    // 锁定
    lock(index, item) {
      this.input = item.id;
      if (item.updater) {
        item.updater = false;
      } else {
        this.dialogLock = true;
      }
    },
    // 锁定dialog的取消
    dialogLockF() {
      this.dialogLock = false;
    },
    // 播放录像
    goPlayer(index, data) {
      this.playerItem = data;
      this.data = data;
      this.tableShow = false;
      this.playerShow = true;
    },
    // 列表里的录像下载
    download(index, data) {
      this.myFilePath = data;
      // this.dialogVisible = !this.dialogVisible;
      let obj = {
        "cameraCode": this.myFilePath.deviceId,
        "mediaURLParam": {
          "broadCastType": 0,
          "packProtocolType": 1,
          "protocolType": 2,
          "serviceType": 3,
          "streamType": 2,
          "transMode": 0,
          "timeSpan":{
              "startTime": this.myFilePath.startTime,
              "endTime": this.myFilePath.endTime
          }
        }
      }
      getIvsPlayer('/sm/ivs/player/play','POST',obj)
        .then(res => {
          let str1 = {"cmd":"set_his_download_path","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1","type":"his","file_path":"c://save/"}
          this.$store.state.socket.Csock.send(JSON.stringify(str1))
          let str2 = {"cmd":"get_his_download_path","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1","type":"his"}
          this.$store.state.socket.Csock.send(JSON.stringify(str2))
          this.rtspUrl = res.data.rtspURL
          let str3 = {"cmd":"his_download","id":"001","time":"2020-08-17 00:00:00.000","start_time":"", "end_time":"","cmd_id":"001_1", "camera_id":"", "url":this.rtspUrl,"file_name":`${data.deviceName}`,"type":"his"}
          this.$store.state.socket.Csock.send(JSON.stringify(str3))
        })
    },
    // 倍速下载
    multipleDownload(val) {
      this.doubleSpeed = val;
    },
    confirmDownload() {
      this.dialogVisible = false;
      const data = {
        filePath: this.myFilePath + `?limit=${this.doubleSpeed}`,
      };
      let startTime = this.myFilePath.startTime.split(" ")[0]
      let startTime1 = this.myFilePath.startTime.split(" ")[1]
      let endTime = this.myFilePath.endTime.split(" ")[0]
      let endTime1 = this.myFilePath.endTime.split(" ")[1]
      console.log()
      
    },
    // 从播放器页面回来后
    goBack() {
      this.playerShow = false;
      this.tableShow = true;
      
    },
    // 重置按钮
    resetList() {
      this.searchform.content = "";
      this.searchform.time = " ";
      this.Interface.pageNum = 1;
      this.Interface.pageSize = 10;
      const obj = {
        cameraCode: "",
        domainCode: "",
        startTime:"",
        endTime:"",
        pageNum: 1,
        pageSize: this.Interface.pageSize,
        url: '/sm/ivs/record/list',
        method: 'GET',
      };
      this.FuzzyList(obj)
    },
    // 录像检索
    downloadss(val) {
      this.typeId = val;
      let obj = {
        url: '/sm/ivs/record/list',
        method: 'GET'
      };
      let tempObj = JSON.parse(JSON.stringify(obj));
      tempObj.id = this.typeId;
      videoRetrieval(tempObj).then((res) => {
        this.tableData = res.data.data;
        this.pageTotal = res.data.total;
      });
    },
    
    // 搜索按钮
    searchButton() {
      const obj = {
        startTime:"",
        endTime:"",
        nodeId: "",
        cameraCode: "",
        domainCode: "",
        pageNum: 1,
        pageSize: this.Interface.pageSize,
        content: 'manual',
        url: '/sm/ivs/record/list',
        method: 'GET',
      };
      if(this.carInformation){
        obj.cameraCode=this.carInformation.split("#")[0]
        obj.domainCode=this.carInformation.split("#")[1]
      }
      if (this.searchform.time && !validateString(this.searchform.time)) {
        obj.startTime = this.searchform.time[0];
        obj.endTime = this.searchform.time[1];
      }
      this.FuzzyList(obj)
    },
    handleSizeChange(val) {
      this.Interface.pageSize = val;
      const obj = {
        startTime: "",
        endTime: "",
        nodeId: "",
        deviceId: "",
        pageNum: this.Interface.pageNum,
        pageSize: this.Interface.pageSize,
        content: 'manual',
        url: '/sm/ivs/record/list',
        method: 'GET',
      };
      if (this.searchform.time || this.searchform.content) {
        if (this.searchform.time && !validateString(this.searchform.time)) {
          obj.startTime = this.searchform.time[0];
          obj.endTime = this.searchform.time[1];
        }
      }
      this.FuzzyList(obj);
    },
    FuzzyList(obj) {
      getFuzzyList(obj).then((res) => {
        this.tableData = res.data.data;
        this.pageTotal = res.data.total;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/variables";
.treeBox{
  height: 800px;
  overflow-y: auto;
  background-color:#f5f7fa;
}
.app-container {
  // height: $main-height;
  .tableShow {
    width: 100%;
    height: 100%;
    display: flex;
    padding-right: 20px;
  }
  .myTree {
    width: 20%;
    margin: 20px 20px;
  }
  .center {
    display: block;
    .search {
      margin: 0 0 20px;
      .deleteImg {
        position: relative;
        right: -400px;
      }
      span {
        padding-right: $space-size-mini;
      }
    }
    .checked {
      display: flex;
      margin-bottom: 15px;
    }
    .headerButton {
      border-top: solid 1px #d3dbeb;
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      div {
        button {
          height: 32px;
          width: 83px;
          margin: 0 5px;
        }
      }
    }
    .table {
      height: 550px;
      overflow: auto;
      button {
        margin-right: 10px;
      }
      ::v-deep .el-dialog {
        width: 400px;
      }
    }
    //分页的样式
    .pagination {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
}
</style>
