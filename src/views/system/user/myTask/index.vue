<template>
  <div class="app-container">
    <div>
        <!-- <Tabs @btnclick="btnclick($event)" :btnGroup="btnGroup" :btnChoose="btnChooseIndex" :singleWidth="94" /> -->
          <el-form ref="formSearch" inline v-model="formSearch">
            <el-form-item prop="workNumber" label="任务名称">
              <el-input placeholder="请输入任务名称" clearable v-model="formSearch.title"></el-input>
            </el-form-item>
            <el-form-item label="优先级">
              <el-select v-model="formSearch.level" placeholder="请选择优先级">
                <el-option
                  v-for="item in levelArr"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status" label="任务状态">
            <el-select v-model="formSearch.status">
              <el-option
                v-for="(item,index) in btnGroup"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="日期">
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
              <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
              <el-button plain icon="el-icon-refresh" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-form>
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="title" label="任务名称" showOverflowTooltip></el-table-column>
          <el-table-column prop="alarmCode" label="告警编号" showOverflowTooltip></el-table-column>
          <el-table-column prop="priority" label="任务优先级" showOverflowTooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.priority == 'NORMAL'">普通</span>
              <span v-else-if="scope.row.priority == 'EMERGENCY'">紧急</span>
              <span v-else-if="scope.row.priority == 'VERY_EMERGENCY'">非常紧急</span>
            </template>
          </el-table-column>
          <el-table-column prop="acceptTime" label="任务完成时间" showOverflowTooltip></el-table-column>
          <el-table-column prop="processor" label="执行人" showOverflowTooltip></el-table-column>
          <el-table-column prop="processorPhone" label="联系电话" showOverflowTooltip></el-table-column>
          <el-table-column prop="createTime" label="任务创建时间" showOverflowTooltip></el-table-column>
          <el-table-column prop="status" label="任务状态" showOverflowTooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'todo'">待处理</span>
              <span v-else-if="scope.row.status == 'cancel'">取消</span>
              <span v-else-if="scope.row.status == 'doing'">处理中</span>
              <span v-else-if="scope.row.status == 'done'">已完成</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div style="text-align: right;width: 130px">
                <span v-if="scope.row.status == 'todo'">
                  <el-button @click="onSend(scope.row)" type="text">指派</el-button>
                  <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                </span>
                <span v-else-if="scope.row.status == 'cancel'">
                  <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                </span>
                <span v-else-if="scope.row.status == 'doing'">
                  <el-button @click="onReassignment(scope.row)" type="text">转派</el-button>
                  <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                </span>
                <span v-else-if="scope.row.status == 'done'">
                  <!-- <el-button @click="onAppraise(scope.row)" type="text">评价</el-button> -->
                  <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="tableData && tableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="formSearch.pageNum"
          :pageSizes="[10, 20, 40, 100]"
          :limit.sync="formSearch.pageSize"
          :total="total"
        />
    </div>
    <!-- <div v-else-if="createWorkShow" style="height: 100%">
      <creatework ref='createWork' :rowData="rowData" @createWorkVisibleShow='createWorkVisibleShow'
                  @bgshow="bgshow"></creatework>
    </div>
    <div v-else-if="workDetailShow" style="height: 100%">
      <TaskDetail ref='workDetail' :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow' /> 
    </div> -->
    <el-dialog title="任务详情" :visible.sync="workDetailShow" width="600px">
      <TaskDetail ref='workDetail' :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow' v-if="workDetailShow" /> 
    </el-dialog>
    <!--转派，派单dialog-->
    <div class="heights">
    <el-dialog
      :title="title"
      :visible.sync="sendShow"
      width="600px">
      <el-row>
        <el-form label-width="80px">
          <el-col :span="24">
            <el-form-item label="任务名称">
              <el-input v-model="sendWork.title" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务编号">
              <el-input v-model="sendWork.alarmCode" disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态">
              <!-- <el-input v-model="sendWork.status" disabled>
              </el-input> -->
              <el-select v-model="sendWork.status" disabled>
                <el-option
                v-for="item in btnGroup"
                :key="item.value"
                :value="item.value"
                :label="item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级">
              <!-- <el-input v-model="sendWork.priority" disabled/> -->
              <el-select v-model="sendWork.priority" disabled>
                <el-option
                  v-for="item in levelArr"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间">
              <el-input v-model="sendWork.acceptTime" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置信息">
              <el-input v-model="sendWork.location" disabled/>
            </el-form-item>
          </el-col>
          <el-col v-if="refuseshow?'':'display:none'">
            <el-form-item label="执行人员">
              <!-- <tree-transfer :title="titles" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}"
                             @add-btn='add' @left-check-change="leftChange" @remove-btn='remove' :mode='mode' height='320px' filter openAll>
              </tree-transfer> -->
              <!-- <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/> -->
              <div style="display: flex;justify-content: space-between;">
                <p :style="[{color:userName ? '#b4b6bb' : '#606266'},{margin: 0}]">{{ userName?userName:'尚未选择用户'}}</p>
                <el-button type="primary" @click="addDialog" :disabled="addPersonDis">选择人员</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col v-else>
            <el-form-item label="拒绝理由">
              <el-input type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit()">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
    </div>
    <!--评价dialog-->
    <el-dialog
      title="评价"
      :visible.sync="appraiseShow"
      width="320px"
    >
      <el-row>
        <el-form v-model="appraise" labelWidth="80px">
          <el-col :span="12">
            <el-form-item label="任务编号">
              <el-input v-model="appraise.workNum" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="评价星级">
              <el-rate v-model="appraise.appraiseLevel"></el-rate>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="评价内容">
              <el-input type="textarea" :rows="3" v-model="appraise.appraiseContent"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择人员"
      :visible.sync="sendialogShow"
      width="850px"
      :before-close="cancel1"
    >
      <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/>
      <div slot="footer">
        <el-button type="primary"  @click="onSubmit1()">确定</el-button>
        <el-button plain @click="cancel1()">取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import pagination from '@/components/comPagination'
  import creatework from './../components/creatework'
  import workdetail from './../components/workdetail'
  import TaskDetail from './../components/taskDetail'
  import {TableData, getAllWarning, download} from '@/api/alarmCenter/warningTask'
  import Tabs from '@/components/commonTabsUser'
    import {
    getUserinfos,
    assignOrder,
  } from '@/api/smartProperty/workManagement'
  import {redefineTransfer} from '@/utils/index';
  import messApi from "@/api/needMess"
  import ComDeptUser from "@/components/comDeptUser"
  import { getUser } from "@/api/system/user";

  export default {
    name: 'task',
    components: {
      pagination,
      creatework,
      workdetail,
      ComDeptUser,
      Tabs,
      TaskDetail
    },
    props:["progess"],
    data() {
      return {
//        转单派单拒绝dialog
        sendShow: false,
//        评价dialog
        appraiseShow: false,
//        主页展示
        workPageShow: true,
//        创建工单组件展示
        createWorkShow: false,
//        查看详情组件展示
        workDetailShow: false,
        allWork: [],
        levelArr: [{id: 'NORMAL', value: '普通'},{id:'EMERGENCY',value:'紧急'},{id:'VERY_EMERGENCY',value:'非常紧急'}],
        btnGroup: [
          {
            value: 'ALL',
            label: "全部"
          },
          {
            value: 'DOING',
            label: "处理中"
          },

          {
            value: 'DONE',
            label: "已完成"
          },
        ],
        time:[],
        formSearch: {
          title: "",
          endTime: "",
          startTime: "",
          pageNum: 1,
          pageSize: 8,
          level: '',
          status: 'ALL'
        },
        total: 6,
        tableData: [],
//        转单or派单
        title: "",
//        全部人员名单
        people: [],
        sendWork: {
//        选择人员名单
          workPeople: [],
          workNum: ''
        },
        appraise: {
          workNum: '',
          appraiseLevel: 0,
          appraiseContent: '',
        },
        // tableData每个row的值
        rowData: {},
        titles: ["源列表", "目标列表"],
        mode: "transfer", // transfer addressList
        fromData: [],
        toData: [],
        refuseshow: false,
        withParameters: false,
        btnChooseIndex: 0,
        userName:"",
        addPersonDis:false,
        sendialogShow:false,
        personId: "",
      }
    },
    mounted() {
      // this.username = this.$store.state.user.name;
      this.formSearch.processor = this.$store.state.user.name;
      // this.getUserInfo()
      this.getAllWork()
      this.getTableData()
    },
    methods: {
      addDialog(){
        this.sendialogShow = true
        this.addPersonDis = false
        if(this.$refs.comDeptUsers){
          this.$refs.comDeptUsers.init()
        }
      },
      // 添加人员
      onSubmit1() {
        getUser(this.personId).then(res => {
            this.userName = res.data.userName
            this.cancel1()
          });
      },
      cancel1() {
        this.sendialogShow = false;
      },
      setItemProgress(data) {
        if(data.num && this.allWork[0].num){
          return parseInt((data.num / this.allWork[0].num).toFixed(1) * 100)
        }else {
          return 0
        }
      },
      selectClick($e){
        this.personId = $e[0]
      },
      setItemText(row) {
        return () => {
          return row.num.toFixed()
        }
      },
      getAllWork() {
        messApi.getAlermOrder().then(res=>{
          let obj = res.data
          let temp = []
          for(let key in obj){
            if(key === "totalAmount"){
              temp.push({label:"全部任务", num:obj[key]})
            }else if(key === "dongingAmount"){
              temp.push({label:"处理中", num:obj[key]})
            }else if(key === "doneAmount"){
              temp.push({label:"已完成", num:obj[key]})
            }
          }
          this.allWork = temp;
        })
      },
      // btnclick(item) {
      //   this.btnChooseIndex = item.index;
      //   this.formSearch.status = this.switchStatus(item.item.value)
      //   this.getTableData()
      // },
      // switchStatus(value){
      //   switch(value){
      //     case 1: return " "
      //     case 2: return "DOING"
      //     case 3: return "DONE"
      //   }
      // },
      getTableData() {
        if(this.time.length > 0){
          this.formSearch.startTime = this.time[0]+' 00:00:00';
          this.formSearch.endTime = this.time[1]+' 23:59:59';
        }else {
          this.formSearch.startTime = '';
 	        this.formSearch.endTime = '';
        }
        // if(this.formSearch.status){
        //   this.formSearch.status = this.formSearch.status.toString()
        // }
        let data = JSON.parse(JSON.stringify(this.formSearch));
        data.status = data.status === "ALL" ? '' : data.status
        let obj = {url: "/pm/alarm/order/query/criteria", method: "GET"};
        TableData(obj.url, obj.method, data).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.total;
          }
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
//      派单
      onSend(data) {
        this.title = "派单";
        this.sendShow = true;
        this.sendWork = JSON.parse(JSON.stringify(data));
        this.sendWork.status = this.sendWork.status.toUpperCase()
        this.sendWork.workNum = data.workNum;
      },
//      转派
      onReassignment(data) {
        this.title = "转单";
        this.sendShow = true;
        this.sendWork = JSON.parse(JSON.stringify(data));
        this.sendWork.status = this.sendWork.status.toUpperCase()
        this.sendWork.workNum = data.workNum;
        // this.$refs.comDeptUsers.init()
      },
//      评价
      onAppraise(data) {
        this.appraiseShow = true;
        this.appraise.workNum = data.workNum;
      },
//      拒绝工单
      onRemove(data) {
        this.title = "拒绝工单";
        this.sendShow = true;
        this.sendWork.workNum = data.workNum;
        this.refuseshow = true;
      },
//      详情
      onDetail(data) {
        this.workPageShow = false;
        this.createWorkShow = false;
        this.workDetailShow = true;
        this.rowData = data;
        this.rowData.toData = this.toData;
        // this.$emit('update:progess', false)
      },
//      编辑
      onEdit(data) {
        this.workPageShow = false;
        this.createWorkShow = true;
        this.rowData = data;
        this.rowData.toData = this.toData;
//        this.withParameters = true;
      },
      handleCurrentChange() {

      },
//      搜索
      onSearch() {
        this.getTableData()
      },
//      创建工单
      createWork() {
        this.workPageShow = false;
        this.createWorkShow = true;
        this.rowData = {};
      },
      onReset() {
        this.formSearch.title = ''
        this.formSearch.level = ''
        this.time = []
        this.getTableData();
      },
      workDetailVisibleShow(data) {
        this.workPageShow = data;
        this.createWorkShow = !data;
        this.workDetailShow = !data;
        // this.$emit('update:progess', data)
      },
      cancel() {
        if (this.sendShow) {
          // if (this.title == "派单") {
            // this.toData = [];
          // }
          this.userName = ''
          this.sendShow = false;
          this.refuseshow = false;

        } else if (this.appraiseShow) {
          this.appraiseShow = false;
          this.appraise.appraiseLevel = 0;
          this.appraise.appraiseContent = '';
        }
      },
      onSubmit() {
        if (this.userName) {
          // let chooseusername = this.toData[0]
          let data = {
            id: this.sendWork.id,
            username : this.userName
          };
          messApi.transferOrder(data).then(res => {
            this.$message.success("转派成功");
            this.sendShow = false;
            this.cancel();
            this.getTableData();
          })
        }
        else {
          this.$message.error("至少指定一个人");
        }
      },
    }


  }
</script>


<style lang="scss" scoped>
//  ::v-deep .heights > .el-dialog__wrapper .el-dialog .el-dialog__body {
//     height: 60vh !important;
//     overflow: auto !important;
//     margin-bottom:20px;
//   }
.transparent {
    background-color: transparent;
    padding: 0;
    overflow: hidden;
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
    background-color: #202230;
    border-radius: 8px;
    padding: 20px 150px;
    p {
      text-align: center;
      color: #fff;
    }
    div {
      display: inline-block;
    }
  }

  .workInfo {
    background-color: #202230;
    border-radius: 8px;
    padding: 20px;
    margin-top: 10px;
    height: calc(100% - 10px - 150px);
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
    background-color: #202230;
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

  ::v-deep svg path:first-child {
    stroke: #31364a;
  }
  ::v-deep .el-table.el-table--fit{
  overflow: hidden;
}
 ::v-deep.wl-transfer .transfer-title {
    background-color: inherit;
    
    font-size: 14px;
    border-bottom: 2px solid rgba(255, 255, 255, .04);
  }
  
  ::v-deep .wl-transfer .transfer-left {
    border: 2px solid rgba(255, 255, 255, .04);
  }

  ::v-deep .wl-transfer .transfer-right {
    border: 2px solid rgba(255, 255, 255, .04);
  }
</style>
