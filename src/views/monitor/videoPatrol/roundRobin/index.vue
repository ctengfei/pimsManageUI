
<template>
  <div class="app-container">
    <el-form ref="formSearch" style="width:100%" inline :model="formSearch">
      <el-form-item prop="carNumber" label="轮巡名称">
        <el-input placeholder="请输入轮巡名称" v-model="formSearch.carNumber" clearable></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          :clearable="true"
          v-model="timeInterval"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
        <el-button plain icon="el-icon-refresh" @click="onReset()">重置</el-button>
      </el-form-item>
    </el-form>
   
        <!-- 表格数据 -->
        <div class="tab">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column prop="planName" label="轮巡计划名称" show-overflow-tooltip />
            <el-table-column prop="startTime" label="轮巡日期" show-overflow-tooltip />
            <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip />
            <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip />
            <el-table-column prop="handler" label="责任人" show-overflow-tooltip />
            <el-table-column prop="actualClockTimes,planClockTimes" label="已打卡/全部" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.actualClockTimes}}/{{scope.row.planClockTimes}}
              </template>
            </el-table-column>
            <el-table-column prop="imagePath" label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button @click="seeRepord(scope.row)" type="text">查看报告</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="bottom">
          <pagination
            v-show="tableData && tableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="formSearch.pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="formSearch.pageSize"
            :total="pagination"
          />
        </div>
     
    <!-- 摄像机选择 -->
    <el-dialog
      title="轮巡报告"
      :visible.sync="carmeaShow"
      width="800px"
     
      :before-close="carmeCancel"
    >
      <div>
        <p class="roundtitle">告警明细</p>
        <el-row :gutter="20">
          <el-form label-width="100px" ref="ruleForm" :model="ruleForm">
            <el-col :span="12">
              <el-form-item label="任务名称">
                <el-input v-model="ruleForm.planName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任人">
                <el-input v-model="ruleForm.handler" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间">
                <el-input v-model="ruleForm.startTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间">
                <el-input v-model="ruleForm.endTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划打卡次数">
                <el-input v-model="ruleForm.planClockTimes" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际打卡次数">
                <el-input v-model="ruleForm.actualClockTimes" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="缺少打卡次数">
                <el-input v-model="ruleForm.planClockTimes" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报告备注">
                <el-input type="textarea" v-model="ruleForm.planClockTimes" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <p class="roundtitle">打卡明细</p>
        <el-table
          ref="multipleTable"
          :data="roundRobinClockRecords"
          height="300"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="clockTime" label="打卡时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="startTime" label="打卡人员" show-overflow-tooltip></el-table-column>
        </el-table>
        <p class="roundtitle">告警明细</p>
        <el-table
          ref="multipleTable"
          :data="alarms"
          height="300"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="triggerTime" label="告警时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="trigger" label="告警人员" show-overflow-tooltip></el-table-column>
          <el-table-column prop="businessDesc" label="告警类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="alarmLevel" label="告警级别" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.alarmLevel == "normal" ? "普通" : scope.row.alarmLevel == "emergency" ? "紧急" : "非常紧急"}}
            </template>
          </el-table-column>
          <el-table-column prop="content" label="告警描述" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button plain @click="carmeCancel">关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/components/comPagination'
  import { downloadFile } from '@/utils/index'
  import {getTableData, getAllWarning, download} from '@/api/alarmCenter/warningInfo'
  import roundApi from "@/api/roundPatrol"

  export default {
    name:"RoundRobin",
    components: {
      pagination,
    },
    data() {
      return {
        permission: {
          searchRecord: 'carManage::carPassingRecord::searchRecord',
        },
        pagination: 0,
        tableData: [],
        formSearch: {
          carNumber: '',
          pageNum: 1,
          pageSize: 10,
        },
        timeInterval: [],
        carmeaShow:false,
        ruleForm:{
          handler:"",
          startTime:"",
          endTime:"",
          planClockTimes:"",
          planName:"",
          actualClockTimesL:"",
          lackClockTimes:""
        },
        roundRobinClockRecords:[],
        alarms:[]
      }
    },
    mounted() {
      // this.getDefaultTime();
      this.onSearch();
    },
    methods: {
      getDefaultTime() {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let starthour = "00";
        let startminutes = "00";
        let startsecond = "00";
        let endhour = "23";
        let endminutes = "59";
        let endsecond = "59";
        this.timeInterval = [new Date(year, month, day, starthour, startminutes, startsecond), new Date(year, month, day, endhour, endminutes, endsecond)]
      },
      p(s) {
        return s < 10 ? '0' + s : s
      },
      dates(d) {
        const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
        const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds());
        return `${resDate} ${resTime}`
      },

      handleCurrentChange() {
        this.onSearch();
      },
      onSearch() {
        const obj = {
          startTime:this.timeInterval[0],
          endTime:this.timeInterval[1],
          executionStatus:'DONE',
          planName: this.formSearch.carNumber,
          pageNum:this.formSearch.pageNum,
          pageSize:this.formSearch.pageSize
        }
        roundApi.getRoundList(obj).then(res=>{
          this.tableData = res.data.data;
          this.pagination = res.data.total;
        }).catch(err=>{
          this.$message.error(err)
        })
       
      },
      // 设置弹窗取消按钮
      carmeCancel(){
        this.carmeaShow = false;
        
      },
      // 查看报告
      seeRepord(item){
        this.carmeaShow = true;
        roundApi.searchRound(item.id).then(res=>{
          this.ruleForm = res.data
          this.ruleForm.lackClockTimes = this.ruleForm.planClockTimes - this.ruleForm.actualClockTimesL
          this.alarms = res.data.alarms
          this.roundRobinClockRecords = res.data.roundRobinClockRecords
        }).catch(err=>{
          this.$message.error(err)
        })
      },
      onReset() {
        this.formSearch.carNumber = '';
        this.timeInterval = []
        Object.keys(this.formSearch).forEach((x) => {
          if (x === "pageNum") {
            this.formSearch[x] = 1;
          } else if (x === "pageSize") {
            this.formSearch[x] = 10;
          }
        });
        this.onSearch();
      },
    }
  };
</script>

<style lang="scss" scoped>
.tab{
  height:calc(100% - 130px)
}
  .btnGroups {
    cursor: pointer;
    background-color: #313448;
    border-radius: 30px;
    width: 330px;
    height: 42px;
    text-align: center;
    display: flex;
    justify-content: space-around;
    align-items: center;
    & > div {
      display: inline-block;
    }
    .btn {
      width: 110px;
      height: 42px;
      border-radius: 30px;
      line-height: 42px;
      
      font-size: 14px;
    }
    .divActive {
      background-color: #206aff;
      color: #fff;
    }
  }

  .flex {
    display: flex;
    justify-content: space-between;
    width:100%
  }
  ::v-deep.el-table.el-table--fit {
    overflow: hidden;
  }
  .roundtitle{
   font-size: 16px;
   font-weight: 700;
  }
</style>
