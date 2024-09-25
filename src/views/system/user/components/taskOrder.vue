<template>
  <div>
    <div style="height: 100%">
      <div>
        <div style="margin-top:20px">
          <el-form ref="formSearch" inline v-model="formSearch">
            <el-form-item prop="workNumber" label="任务名称">
              <el-input placeholder="请输入任务名称" clearable v-model="formSearch.title"></el-input>
            </el-form-item>
            <el-form-item label="优先级">
              <el-select v-model="formSearch.level" placeholder="请选择优先级">
                <el-option
                  clearable
                  v-for="item in levelArr"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
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
        </div>
      <div style="height:calc(100vh - 465px)">
        <el-table :data="tableData">
          <el-table-column prop="title" label="任务名称" showOverflowTooltip></el-table-column>
          <el-table-column prop="alarmCode" label="告警编号" showOverflowTooltip></el-table-column>
          <el-table-column prop="priority" label="任务优先级" showOverflowTooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.priority == 'NORMAL'">普通</span>
              <span v-else-if="scope.row.priority == 'EMERGENCY'">紧急</span>
              <span v-else-if="scope.row.priority == 'VERY_EMERGENCY'">非常紧急</span>
            </template>
          </el-table-column>
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
                <span >
                  <el-button @click="onReassignment(scope.row)" type="text">转派</el-button>
                  <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
         style="margin-top:0"
          v-show="tableData && tableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="formSearch.pageNum"
          :pageSizes="[10, 20, 40, 100]"
          :limit.sync="formSearch.pageSize"
          :total="total"
        />
        </div>
      </div>
    </div>
    <!-- <div v-else-if="createWorkShow" style="height: 100%">
      <creatework ref='createWork' :rowData="rowData" @createWorkVisibleShow='createWorkVisibleShow'
                  @bgshow="bgshow"></creatework>
    </div> -->
    <!-- <div v-else-if="workDetailShow" style="height: 100%">
      <TaskDetail ref='workDetail' :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow' /> 
    </div> -->
    <el-dialog title="任务详情" :visible.sync="workDetailShow" width="600px">
      <TaskDetail ref='workDetail' v-if="workDetailShow" :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow' /> 
    </el-dialog>
    <!--转派，派单dialog-->
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
              <el-input v-model="sendWork.alarmCode" disabled/>
              <!-- <el-select v-model="sendWork.alarmCode" disabled>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态">
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
              <el-select v-model="sendWork.priority" disabled>
                <el-option
                  v-for="item in levelArr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间">
              <el-input v-model="sendWork.submitTime" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置信息">
              <el-input v-model="sendWork.location" disabled/>
            </el-form-item>
          </el-col>
          <el-col v-if="refuseshow?'':'display:none'">
            <el-form-item label="执行人员">
              <div style="display: flex;justify-content: space-between;">
                <p style="margin: 0;">{{ username?username:'尚未选择用户'}}</p>
                <el-button type="primary" @click="addDialog" :disabled="addPersonDis">选择用户</el-button>
              </div>
              <!-- <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/> -->
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
   
    <el-dialog
      title="选择用户"
      :visible.sync="sendialogShow"
      width="850px"
      :before-close="cancel1">
      <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/>
      <div slot="footer" style="text-align:right;">
        <el-button type="primary"  @click="onSubmit1()">确定</el-button>
        <el-button plain @click="cancel1()">取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import pagination from '@/components/comPagination'
  import creatework from './creatework'
  import workdetail from './workdetail'
  import TaskDetail from './taskDetail'
  import treeTransfer from 'el-tree-transfer'
  import {TableData, getAllWarning, download} from '@/api/alarmCenter/warningTask'
  import {
    getUserinfos,
    assignOrder,
  } from '@/api/smartProperty/workManagement'
  import {redefineTransfer} from '@/utils/index';
  import messApi from "@/api/needMess"
  import ComDeptUser from "@/components/comDeptUser"
  import { getUser } from "@/api/system/user";

  export default {
    components: {
      pagination,
      creatework,
      workdetail,
      treeTransfer,
      ComDeptUser,
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
        btnGroup: [
          {
            value: 'todo',
            label: "待处理"
          },
          {
            value: 'cancel',
            label: "取消"
          },
          {
            value: 'doing',
            label: "处理中"
          },
          {
            value: 'done',
            label: "已完成"
          },
        ],
        levelArr: [{id: 'NORMAL', value: '普通'},{id:'EMERGENCY',value:'紧急'},{id:'VERY_EMERGENCY',value:'非常紧急'}],
        time:[],
        formSearch: {
          title: "",
          endTime: "",
          startTime: "",
          pageNum: 1,
          pageSize: 10,
          status: 'DOING',
          level: ''
        },
        total: 6,
        tableData: [],
//        转单or派单
        title: "",
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
        refuseshow: false,
        withParameters: false,
        username: "",
        addPersonDis:false,
        sendialogShow:false,
      }
    },
    mounted() {
      // this.username = this.$store.state.user.name;
      this.formSearch.processor = this.$store.state.user.name;
      this.getTableData()
    },
    methods: {
      addDialog(){
        this.sendialogShow = true
        this.$refs.comDeptUsers.init()
        this.addPersonDis = false
      },
      // 添加人员
      onSubmit1() {
        getUser(this.personId).then(res => {
            this.username = res.data.userName
            this.cancel1()
          });
      },
      cancel1() {
        this.sendialogShow = false;
      },
      getTableData() {
        if(this.time.length){
          this.formSearch.startTime = this.time[0]+' 00:00:00';
          this.formSearch.endTime = this.time[1]+' 23:59:59';
        }else {
          this.formSearch.startTime = '';
 	        this.formSearch.endTime = '';
        }
        let data = this.formSearch
        let obj = {url: "/pm/alarm/order/query/criteria", method: "GET"};
        TableData(obj.url, obj.method, data).then(res => {
          
            this.tableData = res.data.data;
            this.total = res.data.total;
          
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      onSubmit() {
        if (this.username) {
          let data = {
            id: this.sendWork.id,
            username : this.username
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
//      转派
      onReassignment(data) {
        this.title = "转派";
        this.sendShow = true;
        this.sendWork = data;
        if(this.$refs.comDeptUsers){
          this.$refs.comDeptUsers.init()
        }
      },
//      详情
      onDetail(data) {
        this.workPageShow = false;
        this.createWorkShow = false;
        this.workDetailShow = true;
        this.rowData = data;
        this.username = ''
      },
      // 分页
      handleCurrentChange() {
        this.getTableData()
      },
//      搜索
      onSearch() {
        this.getTableData()
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
          if (this.title == "派单") {
            this.username = ''
          }
          this.sendShow = false;
          this.refuseshow = false;

        } else if (this.appraiseShow) {
          this.appraiseShow = false;
          this.appraise.appraiseLevel = 0;
          this.appraise.appraiseContent = '';
        }
      },
      
      selectClick($e){
        this.personId = $e[0]
        this.userId = $e[0]
      },
    }


  }
</script>


<style lang="scss" scoped>
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

</style>
