<template>
  <div class="app-container">
    <!-- 设备树 -->
    <div v-if="equipmentListShow">
      <el-row :gutter="20">
        <el-col :xl="4" :lg="6" :sm="7" :xs="24">
          <div class="treeBox">
            <OrgizeTree
              :currentNodeKey="currentNodeKey"
              :permissionData="{}"
              :isCheck="isCheck"
              :favourite="favourite"
              :queryParams="queryData"
              :saveData="saveData"
              :groupData="groupData"
              @saveTreeTab="saveTreeTab"
              :nodeType='nodeType'
              @getTableData="getTableData" />
          </div>
      </el-col>
      <el-col :xl="20" :lg="18" :sm="17" :xs="24">
        <!-- table表格组件 -->
        <comTable
          ref="cruisePlan"
          :isHighLight="isHighLight"
          :formObj="formData"
          :treeProps="treeProps"
          :queryData="activeName === '' || activeName === 'first' ? groupData : saveData"
          :tableColumns="tableColumns"
          :queryFormList="queryFormList"
          :queryUrl="queryUrl"
          :query-set="querySet"
          :tableOption="tableOption"
          :urlData="urlData"
          :resetData="resetData"
          @onAdd="goPlayer"
          @onCheck="downPlayer"
        ></comTable>
      </el-col>
      </el-row>
    </div>

    <PlayVideo v-if="playVideoShow" :lengths="lengths" :equipment="equipment" @goBack="goBack" />

    <Download
      v-if="downListShow"
      :equipment="equipment"
      @downloadBack="downloadBack"
    />
  </div>
</template>
  <script>
import ComTable from "@/components/comTable/index.vue";
import { getAllCruiseList } from "@/api/monitor/cruiseplan";
import PlayVideo from './playVideo'
import Download from './download'
import OrgizeTree from '@/components/orgnizeTree'

const permission = {
  getSearchVideo: {url: "/sm/ivs/record/list", method: "GET"},
};
export default {
  name:"",
  components: {
    ComTable,
    PlayVideo,
    Download,
    OrgizeTree
  },
  data() {
    return {
      isCheck:'isCheck',
      favourite:true,
      activeName: '',
      permissionData: {},
      isHighLight: false,
      permission,
      equipmentListShow: true, // 设备列表的展示
      playVideoShow:false,
      downListShow:false,
      morePlayVideoShow:false,
      equipment:null,
      checkedAll:[],
      treeProps: false,
      nodeType:'camera',
      tableColumns: [
        {
          label: "设备名称",
          param: "name",
          width: "auto",
          isTitle: true,
        },
        {
          label: "所在区域",
          param: "areaStr",
          width: "auto",
          isTitle: true,
        },
        {
          label: "设备编号",
          param: "code",
          width: "auto",
          isTitle: false,
          render: (row) => {
            return row.code.split("#")[0];
          },
        },
        {
          label: "设备状态",
          param: "status",
          width: "auto",
          isTitle: false,
          render: (row) => {
            return row.status ===1 ? "在线" : "离线"
          },
        },
        {
          label: "接入类型",
          param: "createTime",
          width: "auto",
          isTitle: false,
        },
        {
          label: "厂商",
          param: "manufacturerId",
          width: "auto",
          isTitle: false,
        },
        {
          label: "设备IP",
          param: "address",
          width: "auto",
          isTitle: true,
        }
      ],
      querySet:{
        isPage: true,
        queryType: 'Object',
        isSelection: false,
        queryString: '',
        typeIndex: true
      },
      groupData: {
        mounted:true,
        blurryType:'DEVICE_TREE',
        nodeId: '',
        type: 'camera'
      },
      // 收藏搜索
       saveData: {
        deviceId: '',
        deviceName: '',
        state: '',
        // deviceIds: null,
        treeNodes: null,
        // treeNodeIds: null,
        queryAll: true
      },
      queryData: this.groupData,
      formData: {
        inline: true,
        labelWidth: "80px",
        border: false,
        isSearchButton: {method:"get",url:"/pm/device/criteria"} ? true : false
      },
      queryUrl: getAllCruiseList,
      tableOption: {
        label: "操作",
        width: "100px",
        options: [
          {
            label: "播放",
            type: "",
            icon: "",
            methods: "add",
            url: "",
            permission: permission.getSearchVideo,
          },
          // {
          //   label: "下载",
          //   type: "",
          //   icon: "",
          //   methods: "check",
          //   url: "",
          //   style: "color: #01bee5",
          //   permission: permission.getSearchVideo,
          // }
        ],
      },
      groupQueryData: [
        {label: '设备编号', prop: 'code', placeholder: '请输入设备编号', isType: 'input', },
        {label: '设备名称', prop: 'name', placeholder: '请输入设备名称', isType: 'input', },
      ],
      saveQueryData:  [
        {label: '设备编号', prop: 'code', placeholder: '请输入设备编号', isType: 'input', },
        {label: '设备名称', prop: 'name', placeholder: '请输入设备名称', isType: 'input', },
      ],
      isCheck: "check",
      urlData: {},
      resetData: {},
      queryFormList: [],
      lengths:1,
      currentNodeKey:"",
      currentNodeKeyObj:{}
    };
  },
  created() {
    this.queryFormList = this.groupQueryData
    this.queryData = this.groupData
    this.isCheck = "check";
    
  },
  mounted() {
    // 从直播云台控制跳转
    if(typeof(this.$route.query.player) == 'object' ) {
      let data = {}
      data.deviceId = this.$route.query.player.deviceId
      data.channelId = this.$route.query.player.channelId
      data.name = this.$route.query.player.deviceName
      this.currentNodeKeyObj.id = this.$route.query.player.deviceId
      this.currentNodeKeyObj.referenceId = this.$route.query.player.referenceId
      this.currentNodeKey = this.$route.query.player.deviceId
      // this.goPlayer(data)
      this.getTableData({id:this.currentNodeKey,type:'camera'})
    } else {
      this.getTableData({id:this.currentNodeKey,type:'camera'})
    }
    
  },
  methods: {
    
    // 列表里的播放按钮
    goPlayer(data) {
      this.lengths = 1
      this.equipment = data;
      this.equipmentListShow = false;
      this.playVideoShow = true;
      
    },

    // 点击头部播放按钮  带参数传参
    goPlayerAll() {
      if (this.$store.state.app.selectList.length > 4) {
        this.$message.info("暂时只支持最多4条设备同时播放！");
        return;
      }
      this.lengths = 2
      this.checkedAll = this.$store.state.app.selectList
      if(this.checkedAll.length === 1) {
        this.equipment = this.checkedAll[0]
        this.equipmentListShow = false;
        this.playVideoShow = true;
        this.lengths = 1
      } else {
        this.equipment = this.checkedAll[0]
        this.equipmentListShow = false;
        this.playVideoShow = true;
      }
    },

    // 列表里的下载按钮
    downPlayer(data) {
      this.equipment = data;
      this.equipmentListShow = false;
      this.downListShow = true;
    },
    // 从播放器页面回来后
    goBack() {
      // if(typeof(this.$route.query.player) == 'object' ) {
      //   this.$router.push({ path: '/timemonitor',query: {
      //     player: this.$route.query.player,
      //     type: 1
      //   } })
      //   return
      // }
      this.playVideoShow = false;
      this.equipmentListShow = true;
      this.getTableData({type:'camera'})
    },
    // 从下载页面回来后
    downloadBack() {
      this.equipmentListShow = true;
      this.downListShow = false;
      this.$nextTick((_) => {
        this.$refs.cruisePlan.getList(this.urlData.url, this.urlData.method);
      });
    },
    // 从多个video返回时
    moreGoBack() {
      this.checkedAll = [];
      this.$store.commit('app/SET_SELECTED_DATA', [])
      this.morePlayVideoShow = false;
      this.equipmentListShow = true;
      this.$nextTick((_) => {
        this.$refs.cruisePlan.getList(this.urlData.url, this.urlData.method);
      });
    },
    // 从多个跳转单个视频播放时
    goItemPlayer(li) {
      this.equipment = li
      this.morePlayVideoShow = false;
      this.equipmentListShow = false;
      this.playVideoShow = true;
    },
    saveTreeTab(name) {
      this.activeName = name
      this.queryData = {}
      // this.queryFormList = this.saveQueryData
    },
    getRecordList(data) {
      let params = {
        "recordMethod":0,
        "cameraCode": data.split("#")[0],
        "domainCode": data.split("#")[1],
        "startTime":"20211018000000",
        "endTime":"20211018235959",
        "fromIndex":1,
        "toIndex":5
      }
      if(!this.carInformation){
        params.cameraCode = ""
        params.domainCode = ""
      }
      this.urlData = {method:"GET",url:"/sm/ivs/record/list" }
      this.$nextTick(_ => {
         this.$refs.cruisePlan.getList(this.urlData.url, this.urlData.method, params)
      })
//      getRecordData(url, method, params).then(res => {
//        console.log(res)
//      })
    },
    getTableData(activeName) {
//      this.queryData = {}
//      this.queryData = searchData
      this.groupData.nodeId = activeName.id
      this.urlData = {method:"get",url:"/pm/device/criteria"}
      if (activeName.type === 'camera') { //点击摄像头
        this.$nextTick(_ => {
           this.$refs.cruisePlan.getList(this.urlData.url, this.urlData.method)
        })
      }else{
        this.$nextTick(_ => {
          this.$refs.cruisePlan.getList(this.urlData.url, this.urlData.method)
        })
      }
    },
}
}
</script>
  <style rel="stylesheet/scss" lang="scss">
  .treeBox{
    height: 800px;
    overflow-y: auto;
    background-color: #f5f7fa;
  }
.cruise-wrapper {
  .viedeo-box {
    height: calc(100vh - 152px);
  }
  .videoBox {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .returnBtn {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .recordVideo {
    width: 75%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .video {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
.allPlayButton{
  position: absolute;
  right: 30px;
  z-index: 1000;
}
</style>
