<template>
  <div class="app-container">
    <div v-if="workPageShow" style="height: 100%">
      <div class="topinfo">
        <div v-for="(item,index) in allWork" :key="index">
          <el-progress
            :color= item.color
            type="circle"
            :percentage="setItemProgress(item) || 0"
            :format="setItemText(item)"
            :stroke-width="10"
            :width="80"
          ></el-progress>
          <p style="text-align: center;color: #666666">{{item.label}}</p>
        </div>
      </div>
      <!-- <div class="workInfo"> -->
        <el-form ref="formSearch" inline v-model="formSearch" v-if="showSearch">
          <el-form-item prop="sysChild" label="事件名称">
            <el-select v-model="formSearch.eventCode" placeholder="请选择事件名称" clearable>
              <el-option
                v-for="item in eventArr"
                :key="item.eventCode"
                :label="item.eventName"
                :value="item.eventCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="sysChild" label="业务分类">
            <el-select v-model="formSearch.businessCode" placeholder="请选择业务分类" clearable>
              <el-option
                v-for="item in businessArr"
                :key="item.businessCode"
                :label="item.businessType"
                :value="item.businessCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="businessCode" label="告警级别">
            <el-select v-model="formSearch.level" placeholder="请选择告警级别" clearable>
              <el-option
                v-for="item in levelArr"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警时间">
            <el-date-picker
              v-model="time"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 240px"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button  icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
            <el-button  icon="el-icon-refresh" @click="onReset()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <!-- <el-button
              type="primary"
              plain
              icon="el-icon-close"
              :disabled="!multipleArr.length"
             
              @click="batchClose"
            >批量关闭</el-button> -->
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
             
              @click="exportReport"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getTableData"></right-toolbar>
        </el-row>
        <div style="height:calc(100% - 255px)">
        <el-table :data="tableData" style="width: 100%;" @selection-change="multipleChange">
          <el-table-column type="selection" prop="id" width="55"></el-table-column>
          <el-table-column type="index" label="序号" showOverflowTooltip></el-table-column>
          <el-table-column prop="code" label="告警编号" showOverflowTooltip></el-table-column>
          <el-table-column prop="eventName" label="告警事件" showOverflowTooltip></el-table-column>
          <el-table-column prop="businessName" label="业务分类" showOverflowTooltip></el-table-column>
          <el-table-column prop="location" label="告警位置" showOverflowTooltip></el-table-column>
          <el-table-column prop="triggerTime" label="告警时间" showOverflowTooltip></el-table-column>
          <el-table-column prop="alarmLevel" label="告警级别" showOverflowTooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.alarmLevel == 'normal'">普通告警</span>
              <span v-else-if="scope.row.alarmLevel == 'emergency'">严重告警</span>
              <span v-else-if="scope.row.alarmLevel == 'veryEmergency'">紧急告警</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="告警状态" showOverflowTooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'unprocessed'">待处理</span>
              <span v-else-if="scope.row.status == 'closed'">已关闭</span>
              <span v-else-if="scope.row.status == 'issued'">已下发任务</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="confirmer" label="处理人" showOverflowTooltip></el-table-column>
          <el-table-column prop="confirmerTime" label="处理时间" showOverflowTooltip></el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="onDetail(scope.row)" type="text" icon="el-icon-edit">详情</el-button>
              <el-button @click="delDetail(scope.row.id)" type="text" icon="el-icon-delete">删除</el-button>
              <!-- <el-button @click="onAlarm(scope.row)" v-if="scope.row.status == 'unprocessed'" type="text">告警处理</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="tableData && tableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="formSearch.pageNum"
          :pageSizes="[10, 20, 40]"
          :limit.sync="formSearch.pageSize"
          :total="total"
        />
      </div>
      <!-- </div> -->
    </div>
    <el-dialog
      title="告警处理"
      :visible.sync="alarmClose"
      width="600px"
    >
      <div style="padding:20px 0;">
        <div style="height:calc(100% - 350px)">
          <el-form :model="roundPatrol" ref="roundPatalForm" label-width="80px" label-position="left">
            <el-form-item label="业务分类">
              <el-input v-model="roundPatrol.businessName" disabled></el-input>
            </el-form-item>
            <el-form-item label="告警位置">
              <el-input v-model="roundPatrol.location" disabled></el-input>
            </el-form-item>
            <el-form-item label="告警时间">
              <el-input v-model="roundPatrol.triggerTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="告警级别">
              <el-input :value="roundPatrol.alarmLevel == 'normal' ? '普通告警' : roundPatrol.alarmLevel == 'emergency' ? '严重告警' : '紧急告警'" disabled></el-input>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input v-model="roundPatrol.eventName" disabled></el-input>
            </el-form-item>
            <el-form-item label="告警描述">
              <el-input v-model="roundPatrol.content" disabled></el-input>
            </el-form-item>
            <div class="tableBoxTitle">
              <span>告警处理</span>
            </div>
            <el-form-item label="处理描述" prop="remark" :rules="[{required: true, message: '请输入内容', trigger: 'blur'}]">
              <el-input type="textarea" v-model="roundPatrol.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>  
      <div slot="footer">
      <div class="submitButton">
          <el-button plain @click="roundPatrolCancel"
          >任务下发</el-button
          >
          <el-button type="primary" @click="roundPatrolSubmit"
          >关闭告警</el-button
          >
        </div>  
      </div>
    </el-dialog>
    <el-dialog
      title="告警批量关闭"
      :visible.sync="allClose"
      width="755px"
      :before-close="handleClose"
    >
      <div style="padding:20px 0;">
        <div style="height:calc(100% - 350px)">
          <el-form :model="allroundPatrol" ref="allroundPatrol" label-width="80px" label-position="left">
            <el-form-item label="处理描述" prop="remark" :rules="[{required: true, message: '请输入内容', trigger: 'blur'}]">
              <el-input type="textarea" v-model="allroundPatrol.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="submitButton">
          <el-button type="primary" @click="allPatrolSubmit"
          >关闭告警</el-button
          >
        </div>
      </div>    
    </el-dialog>
    <div v-if="workDetailShow">
      <el-dialog
        title="告警详情"
        :visible.sync="allClosemessage"
        width="600px"
        :before-close="handleClosemessage"
        >
      <alarmDetail ref='alarmDetail' :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow'></alarmDetail>
      <div slot="footer">
        <el-button @click="handleClosemessage"
          >关闭</el-button
          >
      </div>
     </el-dialog>
    </div>
  </div>
</template>

<script>

  import pagination from '@/components/comPagination'
  import alarmDetail from '../components/alarmDetail'
  import { downloadFile } from '@/utils/index'
  import {getTableData, getAllWarning, download, getConfigEvent,Delete} from '@/api/alarmCenter/warningInfo'
  import {getConfigType} from '@/api/alarmCenter/warningeventConfig'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import { alarmAssign, alarmClose, batchAlarmClose } from '@/api/alarmCenter/warningRealtime'

  export default {
    name:'WarningInfo',
    components: {
      pagination,
      alarmDetail,
    },
    data() {
      return {
        // permission: {
        //   download: 'alarmCenter::warningInfo::download',
        //   searchConfigType: 'alarmCenter::warningeventConfig::searchConfigType',
        //   searchAllCount: 'alarmCenter::warningInfo::searchAllCount',
        //   searchTable:'alarmCenter::warningInfo::searchTable',
        // },
        businessArr: [], //业务分类
        levelArr: [{id: 'NORMAL', value: '普通告警'},{id:'VERY_EMERGENCY',value:'紧急告警'},{id:'EMERGENCY',value:'严重告警'}],
        workPageShow: true,
        workDetailShow: false,
        allWork: [
          {
            num: 0,
            color: '#206aff',
            label: "全部告警"
          },
          {
            num: 0,
            color: '#ff0d0d',
            label: "紧急告警"
          },
          {
            num: 0,
            color: '#ffac18',
            label: "严重告警"
          },
          {
            num: 0,
            color: '#8a5d1d',
            label: "普通告警"
          }
        ],
        time: [],
        formSearch: {
          eventCode:'',
          businessCode:'',
          endTime: "",
          startTime: "",
          pageNum: 1,
          pageSize: 10,
        },
        total: 0,
        tableData: [],
        showSearch:true,
        // tableData每个row的值
        rowData: {},
        eventArr:[],
        alarmClose: false,
        roundPatrol:{
          handler:"",
          planName:"",
          actualClockTimesL:"",
          planClockTimes:"",
          remark:"",
          lackClockTimes:""
        },
        allClose: false,
        allClosemessage:false,
        allroundPatrol:{
          remark:""
        },
        multipleArr:[]
      }
    },
    created(){
      this.getAllWork()
    },
    mounted() {
      this.getConfigBusiness()
      this.getTableData()
      this.getConfigEvent()
      if(this.$route.query.id){
        this.formSearch.level = this.$route.query.id
        this.onSearch()
      }
    },
    methods: {
      // 批量关闭
      batchClose(){
        this.allClose = true
      },
      // table多选
      multipleChange(val){
        let temp = val.map(item=>{
          return {alarmCode:item.code,closeReason:""}
        })
        this.multipleArr = temp
      },
      // 批量关闭告警
      allPatrolSubmit(){
        let temp = this.multipleArr.filter(item=>item.closeReason=this.allroundPatrol.remark)
        this.$refs['allroundPatrol'].validate((valid) => {
          if (valid) {
            batchAlarmClose(temp).then(res=>{
              this.allClose = false
              this.$refs.allroundPatrol.resetFields()
              this.$message.success("批量关闭告警成功")
              this.getTableData()
            }).catch(err=>{
              this.$message.error(err.msg)
            })
          }
         })
      },
      // 批量关闭弹窗
      handleClose(){
        this.allClose = false
        this.$refs.allroundPatrol.resetFields()
      },
      handleClosemessage(){
        this.allClosemessage = false;
        this.workPageShow = true;
        this.workDetailShow = false;
      },
      // 告警处理
      onAlarm(row){
        this.alarmClose = true
        this.roundPatrol = row
      },
      // 任务下发
      roundPatrolCancel(){
        this.$refs['roundPatalForm'].validate((valid) => {
          if (valid) {
            alarmAssign({alarmCode:this.roundPatrol.code,content:this.roundPatrol.remark,submit:true}).then(res=>{
              this.alarmClose = false
              this.$refs.roundPatalForm.resetFields()
              this.$message.success("告警任务下发成功")
              this.getTableData()
            }).catch(err=>{
              this.$message.error(err.msg)
            })
          }
        })
      },
      // 关闭告警
      roundPatrolSubmit(){
         this.$refs['roundPatalForm'].validate((valid) => {
          if (valid) {
            alarmClose({alarmCode:this.roundPatrol.code,closeReason:this.roundPatrol.remark}).then(res=>{
              this.alarmClose = false
              this.$refs.roundPatalForm.resetFields()
              this.$message.success("关闭告警成功")
              this.getTableData()
            }).catch(err=>{
              this.$message.error(err.msg)
            })
          }
         })
      },
      setItemProgress(data) {
        if (data) {
          // if(data.num > 100000){
          //   // return `${parseInt((data.num / this.allWork[0].num).toFixed(2) * 100 / 10000) + ' w'}`
          // }else{
          //   debugger
            return parseInt((data.num / this.allWork[0].num).toFixed(2) * 100);
          // }
        } else {
          return 0 + "";
        }
      },
      setItemText(row) {
        if (!row.num) {
          return () => {
            return 0 + "";
          };
        }
        return () => {
          return row.num > 100000 ? (parseInt(row.num/10000) + 'w') : row.num
        }
      },
      getConfigEvent(){
        getConfigEvent().then(res=>{
          this.eventArr = res.data.eventNames;
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      getConfigBusiness(){
        //let obj = getObjByKey(this.permission.searchConfigType);
        getConfigType('/pm/alarm/config/business', 'get').then(res => {
          this.businessArr = res.data;
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      getAllWork() {
        //let obj = getObjByKey(this.permission.searchAllCount);
        getAllWarning('/pm/alarm/count', 'get').then(res => {
          this.allWork[0].num = res.data.totalAmount;
          this.allWork[1].num = res.data.veryEmergencyAmount;
          this.allWork[2].num = res.data.emergencyAmount;
          this.allWork[3].num = res.data.normalAmount;
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      getTableData() {
        if(this.time.length > 0){
          this.formSearch.startTime = this.time[0];
          this.formSearch.endTime = this.time[1];
        }
        let data = this.formSearch
        //let obj = getObjByKey(this.permission.searchTable);
        getTableData('/pm/alarm', 'get', data).then(res => {
          console.log(res,'resss');
          this.tableData = res.data.data;
          this.total = res.data.total;
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
//      详情
      onDetail(row) {
        this.workPageShow = true;
        this.workDetailShow = true;
        this.rowData = row;
        this.allClosemessage = true
      },
      //删除
      delDetail(id){
        this.$confirm(`确认删除本条数据吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          Delete({id:id}).then((res) => {
            this.pageNum = 1;
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      },
      // 导出报表
      exportReport() {
        let url = '/pm/alarm/deviceAlarm/page/export'
        let method = "get"
        download(url, method).then(res => {
          this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
        }).catch(err => {
          console.log(err)
        })
      },
      handleCurrentChange() {
        this.getTableData();
      },
//      搜索
      onSearch() {
        this.formSearch.pageNum = 1
        this.getTableData();
      },
      onReset() {
        this.formSearch = {
          title:'',
          businessCode:'',
          pageNum: 1,
          pageSize: 10,
        }
        this.time = []
        this.getTableData();
      },
      workDetailVisibleShow(data) {
        this.workPageShow = data;
        this.workDetailShow = !data;
      },
    }
  }
</script>


<style lang="scss" scoped>
.app-container{
  padding:6px 20px !important;
}
::v-deep .el-table.el-table--fit{
  overflow: hidden;
}
  .transparent {
    background-color: transparent;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .topinfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 130px;
    //background-color: #202230;
    border-radius: 8px;
    padding: 0 150px 20px;
    p {
      text-align: center;
      color: #fff;
    }
    div {
      display: inline-block;
    }
  }

  .workInfo {
    //background-color: #202230;
    border-radius: 8px;
    padding: 20px;
    margin-top: 10px;
    height: calc(100% - 140px);
    .btnGroups {
      cursor: pointer;
      background-color: #313448;
      border-radius: 30px;
      width: 376px;
      height: 42px;
      text-align: center;
      display: flex;
      justify-content: space-around;
      align-items: center;
      & > div {
        display: inline-block;
      }
      .btn {
        width: 94px;
        height: 42px;
        border-radius: 30px;
        line-height: 42px;
        color: #fff;
      }
      .divActive {
        background-color: #206aff;
      }
    }

  }

  .color {
    color: #206aff;
  }

  ::v-deep .el-transfer-panel {
    width: 300px;
    //background-color: #202230;
    .el-transfer-panel__header {
      background-color: transparent !important;
      .el-checkbox .el-checkbox__label {
        color: #ffffff !important;
      }
    }
    .el-transfer-panel__body {
      .el-checkbox .el-checkbox__label {
        color: #ffffff !important;
      }
    }
    .el-transfer-panel__filter .el-input__inner {
      width: 90%;
      margin-right: 20px;
    }
  }

  ::v-deep .el-rate {
    padding-top: 5px;
  }

  ::v-deep.el-progress--circle .el-progress__text, .el-progress--dashboard .el-progress__text {
    font-size: 20px !important;
  }

  ::v-deep.wl-transfer .el-tree {
    background-color: inherit;
  }

  ::v-deep.wl-transfer .transfer-title {
    background-color: inherit;
    color: #fff;
  }

  .el-form .el-select {
    width: 100%;
  }

  ::v-deep.el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }

  // ::v-deep.el-range-editor--small .el-range-separator {
  //   line-height: 34px;
  // }

  // ::v-deep svg path:first-child {
  //   stroke: #31364a;
  // }
  .submitButton {
    width: 100%;
    // position: absolute;
    bottom: 20px;
    display: flex;
    justify-content: right;
  }
  .tableBoxTitle{
   font-size: 16px;
   font-weight: 700;
   margin-bottom:15px;
  }
</style>
