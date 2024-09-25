<template>
  <div class="app-container-bow">
    <div v-if="tableShow">
      <!-- 树结构 -->
      <div class="video-web-left-box">
        <div class="highlight-height-main  padding-20">
          <template>
            
               <OrgizeTree
                :nodeType='nodeType'
                :isCheck="isCheck"
                :permissionData="permission"
                @getTableData="getTableData" />
            
          </template>
        </div>
      </div>
      <!-- 内容 -->
      <div class="video-web-right-box padding-20">
        <!-- 菜单左侧按钮-->
        <div class="video-web-form-box video-web-flex">
          <div class="video-web-flex">
            <span
              ><el-date-picker
                v-model="searchform.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 240px"
            /></span>
            <span>
              <el-button
                type="primary"
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
            </span>
          </div>
        </div>

        <!-- 表格 -->
        <div class="highlight-height-table9">
          <template>
            <div class="table">
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
                <!-- <el-table-column label="录像类型" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.type == 'plan'">计划录像</span>
                    <span v-if="scope.row.type == 'manual'">手动录像</span>
                    <span v-if="scope.row.type == 'alarm'">告警联动录像</span>
                  </template>
                </el-table-column> 
                <el-table-column
                  prop="resolution"
                  label="码率"
                  width="80"
                  show-overflow-tooltip
                /> -->
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
                <!-- <el-table-column
                  prop="videoTime"
                  label="录像时长(S)"
                  width="100"
                  show-overflow-tooltip
                /> -->
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
                    <el-button
                      type="text"
                      style="color: #206aff"
                      @click="download(scope.$index, scope.row)"
                      >下载</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->

              <pagination
                v-show="tableData && tableData.length > 0"
                :page.sync="Interface.pageNum"
                :total="pageTotal"
                :pageSizes="[10, 20, 30, 40]"
                :limit.sync="Interface.pageSize"
                @pagination="fetchRecordList"
              />

          </template>

        </div>
      </div>

      <!-- 表格 -->
      <!--  -->
    </div>
    <!-- </div> -->
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
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
import PlayVideo from "./playVideo";
import { validateString } from "@/utils/validate";
import { treeData, getIvsPlayer } from "@/api/system/organization";
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
import { getObjByKey, getStringByKey } from "@/utils/voice.js";

export default {
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
      permission: {
        player: "videoMange::recordVideo:player",
        download: "videoMange::recordVideo:download",
        deleteId: "videoMange::recordVideo:deleteId",
        search: "videoMange::recordVideo:search",
        deleteList: "videoMange::recordVideo:deleteList",
        DownloadFile: "videoMange::recordVideo:shardDownloadFile",
        clink: "videoMange::recordVideo:clink",
        treeCheck: "tree::check",
        tagCheck: "tags::check",
        collectCheck: "collecttag::check",
        devicebycollect: "device::by::collecttag",
        historyrecord: "monitor::cuisePlan::recordhistory",
        collectAdd: "collectTag::add",
        collectEdit: "collectTag::edit",
        collectDelete: "collectTag::delete",
        collectDevice: "collectTag::device",
        markUpate: "mark::edit",
      },
      // defaultExpandedKeys: [],
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
    this.permissionData = this.permission;
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
    }
  },
  updated() {
    const _this = this
    window.onresize = () => {
      _this.pageResize()
    }
  },
  methods: {
    // 全屏展示
    // fullscreen() {
    //   this.$fullscreen.enter(this.$el.querySelector(`.video-show`), {
    //     wrap: false,
    //     callback: f => {
    //       this.fullscreenFlag = f
    //     }
    //   })
    // },
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
        url: getStringByKey(this.permission.search, "url"),
        method: getStringByKey(this.permission.search, "method"),
      };
      if(!this.carInformation){
        obj.cameraCode = ""
        obj.domainCode = ""
      }
      // if (this.statusTab > 0 &&  this.tagNode.id) {
      //   obj.deviceId = this.tagNode.id;
      // } else if(this.tagNode.id){
      //   obj.nodeId = this.tagNode.id;
      // }
      if (this.searchform.time || this.searchform.content) {
        if (this.searchform.time && !validateString(this.searchform.time)) {
          obj.startTime = this.searchform.time[0];
          obj.endTime = this.searchform.time[1];
        }
        this.FuzzyList(obj);
        return;
      }
      this.FuzzyList(obj);
      // let url = getStringByKey(this.permission.clink, "url");
      // let method = getStringByKey(this.permission.clink, "method");
      // treeClick(url, method, obj).then((res) => {
      //   if (res.meta.status === 200) {
      //     this.pageTotal = res.data.total;
      //     this.tableData = res.data.data;
      //     console.log('..............',this.pageTotal)
      //   }

      // });
    },
    // 获取设备编码
    getCarInformation(code){
      getCarInformation(code).then(res=>{
        if(res.meta.status === 200){
          this.carInformation = res.data.code
          const obj = {
            startTime: "",
            endTime: "",
            cameraCode: this.carInformation.split("#")[0],
            domainCode: this.carInformation.split("#")[1],
            pageNum: this.Interface.pageNum,
            pageSize: this.Interface.pageSize,
            url: getStringByKey(this.permission.search, "url"),
            method: getStringByKey(this.permission.search, "method"),
          };
          this.FuzzyList(obj)
        }
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
        url: getStringByKey(this.permission.search, "url"),
        method: getStringByKey(this.permission.search, "method"),
      };
      if (activeName === 'second') {
        obj.deviceId = data.id;
      } else {
        obj.nodeId = data.id;
      }
      this.getCarInformation(data.referenceId)
      // let url = getStringByKey(this.permission.clink, "url");
      // let method = getStringByKey(this.permission.clink, "method");
      // treeClick(url, method, obj).then((res) => {
      //   console.log("res===", res);
      //   if (res.meta.status === 200) {
      //     this.pageTotal = res.data.total;
      //     this.tableData = res.data.data;
      //   }
      // });
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
      // let str0 = {"cmd":"create_control","html_x": window.screenLeft,"html_y": window.screenTop,"html_w":this.widowWidth,"html_h":this.widowHeight,"e_type":"Chrome","title":document.title,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      // this.$store.state.socket.Csock.send(JSON.stringify(str0))
      // console.log("播放器显示位置",  this.widowWidth - 525, this.widowHeight - 158)
      // let str2 = {"cmd":"set_pos","x":490,"y":240,"w":this.widowWidth - 525,"h": this.widowHeight - 158,"id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
      // this.$store.state.socket.Csock.send(JSON.stringify(str2))
      // let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
      // this.$store.state.socket.Csock.send(JSON.stringify(str1))
      // let obj = {
      //   "cameraCode": data.deviceId,
      //   "mediaURLParam": {
      //     "broadCastType": 0,
      //     "packProtocolType": 1,
      //     "protocolType": 2,
      //     "serviceType": 4,
      //     "streamType": 1,
      //     "transMode": 0,
      //     "timeSpan":{
      //         "startTime": data.startTime,
      //         "endTime": data.endTime
      //     }
      //   }
      // }
      // getIvsPlayer('/sm/ivs/player/play','POST',obj)
      //   .then(res => {
      //     if(res.meta.status == 200){
      //       this.rtspUrl = res.data.rtspURL
      //       let str3 = {"cmd":"play_his","id":"001","time":"2020-08-17 00:00:00.000","camera_id": this.rtspUrl,"camera_name":"摄像头","wnd_index":0,"cmd_id":"001_1 "}
      //       console.log("wc播放命令====",str3)
      //       this.$store.state.socket.Csock.send(JSON.stringify(str3))
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error(err)
      //   })
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
          if(res.meta.status == 200){
            let str1 = {"cmd":"set_his_download_path","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1","type":"his","file_path":"c://save/"}
            this.$store.state.socket.Csock.send(JSON.stringify(str1))
            let str2 = {"cmd":"get_his_download_path","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1","type":"his"}
            this.$store.state.socket.Csock.send(JSON.stringify(str2))
            this.rtspUrl = res.data.rtspURL
            let str3 = {"cmd":"his_download","id":"001","time":"2020-08-17 00:00:00.000","start_time":"", "end_time":"","cmd_id":"001_1", "camera_id":"", "url":this.rtspUrl,"file_name":`${data.deviceName}`,"type":"his"}
            console.log("wc播放命令====",str3)
            this.$store.state.socket.Csock.send(JSON.stringify(str3))
            
          }
        })
        // .catch(err => {
        //   this.$message.error(err)
        // })
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
      if(this.tableShow){
        let str1 = `{"cmd":"destroy","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
        this.$store.state.socket.Csock.send(JSON.stringify(str1))
      }
      
      
    },
    // 重置按钮
    resetList() {
      this.searchform.content = "";
      this.searchform.time = " ";
      this.Interface.pageNum = 1;
      this.Interface.pageSize = 10;
      this.searchButton()
    },
    // 删除按钮
    handleDelete(index, data) {
      this.$confirm("是否删除此数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let obj = getObjByKey(this.permission.deleteId);
          let tempObj = JSON.parse(JSON.stringify(obj));
          tempObj.url = tempObj.url.replace("{id}", data.id);
          deleteVideoList(tempObj).then((r) => {
            if (r.meta.status === 200) {
              this.$message.success("删除成功");
              this.Interface.pageNum = 1;
              this.searchButton();
            } else {
              this.$message.error(`${r.meta.message}`);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 录像检索
    downloadss(val) {
      this.typeId = val;
      let obj = getObjByKey(this.permission.search);
      let tempObj = JSON.parse(JSON.stringify(obj));
      tempObj.id = this.typeId;
      videoRetrieval(tempObj).then((res) => {
        if (res.meta.status === 200) {
          this.tableData = res.data.data;
          this.pageTotal = res.data.total;
        }
      });
    },
    
    // 搜索按钮
    searchButton() {
      console.log('this.permission.search',this.permission.search)
      
      const obj = {
        startTime:"",
        endTime:"",
        nodeId: "",
        cameraCode: "",
        domainCode: "",
        pageNum: 1,
        pageSize: this.Interface.pageSize,
        content: 'manual',
        url: getStringByKey(this.permission.search, "url"),
        method: getStringByKey(this.permission.search, "method"),
      };
      if(this.carInformation){
        obj.cameraCode=this.carInformation.split("#")[0]
        obj.domainCode=this.carInformation.split("#")[1]
      }
      if (this.searchform.time && !validateString(this.searchform.time)) {
        obj.startTime = this.searchform.time[0];
        obj.endTime = this.searchform.time[1];
      }
      // if (this.statusTab > 0 &&  this.tagNode.id) {
      //   obj.deviceId = this.tagNode.id;
      // } else if(this.tagNode.id){
      //   obj.nodeId = this.tagNode.id;
      // }
      
      getFuzzyList(obj).then((res) => {
        if (res.meta.status === 200) {
          this.tableData = res.data.data;
          this.pageTotal = res.data.total;
        }
      });
    },
    // 批量删除选中
    handleDeleteAll() {
      if (this.checkedAllId.length) {
        this.$confirm("是否删除此数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let obj = getObjByKey(this.permission.deleteList);
            let tempObj = JSON.parse(JSON.stringify(obj));
            tempObj.checked = this.checkedAllId;
            deleteSnapVideoAll(tempObj).then((r) => {
              if (r.meta.status === 200) {
                this.$message.success("删除成功");
                this.Interface.pageNum = 1;
                this.searchButton();
                // let obj = getObjByKey(this.permission.search);
                // getRecordVideo(obj).then((res) => {
                //   this.pageTotal = res.data.total;
                //   this.tableData = res.data.data;
                // });
              } else {
                this.$message.error(`${r.meta.message}`);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message.info("至少要勾选一条数据才可以删除");
      }
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
        url: getStringByKey(this.permission.search, "url"),
        method: getStringByKey(this.permission.search, "method"),
      };
      if (this.searchform.time || this.searchform.content) {
        if (this.searchform.time && !validateString(this.searchform.time)) {
          obj.startTime = this.searchform.time[0];
          obj.endTime = this.searchform.time[1];
        }
      }
      // if (this.statusTab > 0 &&  this.tagNode.id) {
      //   obj.deviceId = this.tagNode.id;
      // } else if(this.tagNode.id){
      //   obj.nodeId = this.tagNode.id;
      // }
      this.FuzzyList(obj);
    },
    FuzzyList(obj) {
      getFuzzyList(obj).then((res) => {
        if (res.meta.status === 200) {
          this.tableData = res.data.data;
          this.pageTotal = res.data.total;
        }
      });
    },
    // 分页切换 切换到第几页 发送请求
    handleCurrentChange(n) {
      this.Interface.pageNum = n;
      const obj = {
        startTime: "",
        endTime: "",
        nodeId: "",
        deviceId: "",
        pageNum: this.Interface.pageNum,
        pageSize: this.Interface.pageSize,
        content: 'manual',
        url: getStringByKey(this.permission.search, "url"),
        method: getStringByKey(this.permission.search, "method"),
      };
      // if (this.statusTab > 0 &&  this.tagNode.id) {
      //   obj.deviceId = this.tagNode.id;
      // } else if(this.tagNode.id){
      //   obj.nodeId = this.tagNode.id;
      // }
      if (this.searchform.time || this.searchform.content) {
        if (this.searchform.time && !validateString(this.searchform.time)) {
          obj.startTime = this.searchform.time[0];
          obj.endTime = this.searchform.time[1];
        }
        this.FuzzyList(obj);
        return;
      }
      let url = getStringByKey(this.permission.clink, "url");
      let method = getStringByKey(this.permission.clink, "method");
      treeClick(url, method, obj).then((res) => {
        if (res.meta.status === 200) {
          this.pageTotal = res.data.total;
          this.tableData = res.data.data;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/variables";
.app-container {
  height: $main-height;
  .video-web-flex {
    span:not(:last-child) {
      margin-right: 10px;
    }
  }
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
    // width: 75%;
    // height: 750px;
    // margin: 20px 0;
    display: block;
    // position: relative;
    .search {
      // display: flex;
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
