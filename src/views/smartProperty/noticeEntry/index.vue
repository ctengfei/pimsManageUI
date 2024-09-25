<template>
  <div class="app-container">
    <div style="height:100%">
      <!--<Tabs @btnclick="btnclick($event)" :btnGroup="btnGroup" :btnChoose="btnChoose" :singleWidth="94"/>-->
      <div class="margintop20">
        <el-form ref="formSearch" inline v-model="formSearch">
          <el-form-item prop="companyName" label="企业名称">
            <el-input placeholder="请输入企业名称" clearable v-model="formSearch.companyName"></el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="time"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 240px"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
              clearable
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="工单状态" prop="noticeStatus">
              <el-select
                placeholder="请选择工单状态"
                clearable
                v-model="formSearch.noticeStatus"
              >
                <el-option
                  v-for="(item, index) in btnGroup"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  >{{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
            <el-button plain icon="el-icon-refresh" @click="onReset()">重置</el-button>
          </el-form-item>
        </el-form>
       <div style="height: calc(100% - 220px)">
            <el-table :data="tableData">
              <el-table-column label="序号" width="80" type="index"></el-table-column>
              <el-table-column prop="companyName" label="企业名称" showOverflowTooltip></el-table-column>
              <el-table-column prop="address" label="所在园区位置" showOverflowTooltip></el-table-column>
              <el-table-column prop="serialNumber" label="合同编号" showOverflowTooltip></el-table-column>
              <el-table-column label="合同周期">
                <template slot-scope="scope">
                  <span>{{scope.row.startDate && scope.row.endDate && (scope.row.startDate + '~' + scope.row.endDate)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="handleStatus" label="通知书状态" showOverflowTooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.handleStatus == 'NOTICE_HANDLING'" style="color: #ff403d">待处理</span>
                  <span v-else-if="scope.row.handleStatus == 'NOTICE_HANDLED'">已处理</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="enterpriseLegalPerson" label="企业法人" showOverflowTooltip></el-table-column> -->
              <el-table-column prop="creator" label="操作人员" showOverflowTooltip></el-table-column>
              <el-table-column prop="createTime" label="操作时间" showOverflowTooltip>

              </el-table-column>
              <el-table-column label="操作" prop="settledStatus" showOverflowTooltip>
                <template slot-scope="scope">
                      <span v-if="scope.row.handleStatus == 'NOTICE_HANDLING'">
                        <el-button @click="onEntry(scope.row)" type="text" 
                        :disabled="scope.row.contractStatus!='VALID'"
                       >入驻</el-button>
                        <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                      </span>
                  <span v-else-if="scope.row.handleStatus == 'NOTICE_HANDLED'">
                        <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                      </span>
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
         
      </div>
    </div>
    <!--
      <div v-else-if="detailShow" style="height: 100%;overflow-y: auto;overflow-x: hidden">
      <Detail ref='detail' :rowData='rowData' @detailVisibleShow='detailVisibleShow'></Detail>
    </div>
    -->
    <el-dialog
      title="入驻详情"
      :visible.sync="detailShow"
      width="600px"
      :before-close="handleClose">
      <div class="sketch_content">
        <Detail
          ref="detail"
          :rowData="rowData"
          @detailVisibleShow='detailVisibleShow'
        />
      </div>
    </el-dialog>
    <!--
    <div v-else-if="entryRegistration">
      <Settlement ref='settlement' :rowData='rowData' @settlementVisibleShow='settlementVisibleShow'></Settlement>
    </div>
    -->
    <el-dialog
      title="入驻"
      :visible.sync="entryRegistration"
      width="600px"
      :before-close="handleClose1">
      <div class="sketch_content">
        <Settlement
          ref="settlement"
          :rowData="rowData"
          @settlementVisibleShow='settlementVisibleShow'
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Detail from "./components/detail"
  import Settlement from './components/settlement'
  import pagination from '@/components/comPagination'
  import {initTabData, searchInfo, initportraitTabData} from '@/api/smartProperty/notice'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import Tabs from '@/components/commonTabs'
  export default {
    name: "NoticeEntry",
    components: {
      pagination,
      Detail,
      Settlement,
      Tabs
    },
    data() {
      return {
        permission: {
          searchEnter: 'smartProperty::notice::searchEnter',
        },
        homePageShow: true,
        detailShow: false,
//        入驻登记组件展示
        entryRegistration: false,
        btnGroup: [
          {
            label: "全部",
            value: "All"
          },
          {
            label: "待处理",
            value: "NOTICE_HANDLING"
          },
          {
            label: "已处理",
            value: "NOTICE_HANDLED"
          }
        ],
        btnChoose: 0,
        time: [],
        formSearch: {
          companyName: "",
          noticeStatus: "",
          endTime: "",
          startTime: "",
          pageNum: 1,
          pageSize: 10,
        },
        total: 15,
        currentstauts: "",
        tableData: [],
        rowData: {},

      }
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      // 批量关闭弹窗
      handleClose(){
        this.detailShow = false
      },
      handleClose1(){
        this.entryRegistration = false
      },
      timeChange(){
        if(!this.time){
          this.time = [];
          this.getTableData();
        }
      },
      getTableData() {
        if(this.time){
          this.formSearch.startTime = this.time[0];
          this.formSearch.endTime = this.time[1];
        }else {
          this.formSearch.startTime = '';
          this.formSearch.endTime = '';
        }
        let data = this.formSearch;
        if (data.noticeStatus == "All") {
          data.noticeStatus = "";
        }
        // let url = getObjByKey(this.permission.searchEnter).url;
        let url = '/pm/company_enter/entering/page'
        // let method = getObjByKey(this.permission.searchEnter).method;
        let method = 'GET'
        initTabData(url, method, data).then(res => {
          this.tableData = res.data.data;
          this.total = res.data.total;
        });
      },
      onSearch() {
        this.getTableData()
      },
      btnclick(e) {
        this.btnChoose = e.index;
        this.formSearch.noticeStatus = e.item.value;
        this.currentstauts = e.item.value;
        this.getTableData();
      },
      onEntry(data) {
        this.homePageShow = false;
        this.detailShow = false;
        this.entryRegistration = true;
        this.rowData.noticeId = data.noticeId;
        this.rowData = data;
      },
      onDetail(data) {
        this.homePageShow = false;
        this.detailShow = true;
        this.entryRegistration = false;
        this.rowData.id = data.noticeId;
        this.rowData = data;
      },
      handleCurrent() {

      },
      onReset() {
        this.formSearch = {
          companyName: "",
          noticeStatus: this.currentstauts,
          endTime: "",
          startTime: "",
          pageNum: 1,
          pageSize: 10,
        };
        this.time = [];
        // this.btnChoose ='0'
        this.getTableData();
      },
      detailVisibleShow(data) {
        this.homePageShow = data;
        this.detailShow = !data;
        this.entryRegistration = !data;
      },
      settlementVisibleShow(data) {
        this.getTableData();
        this.homePageShow = data;
        this.detailShow = !data;
        this.entryRegistration = !data;
      },
      handleCurrentChange(val) {
        this.formSearch = {
          companyName: "",
          handleStatus: "",
          endTime: "",
          startTime: "",
          pageNum: 1,
          pageSize: 10,
        };
        this.formSearch.pageSize = val.limit;
        this.formSearch.pageNum = val.page;
        this.getTableData();
      },

    }
  }
</script>

<style lang="scss" scoped>

  .transparent {
    background-color: transparent;
    padding: 0;
    height: calc(100% - 60px - 20px);
  }

  .pottraittransparent {
    background-color: transparent;
    padding: 0;
  }

  .margintop20 {
    // margin-top: 20px;
    height: inherit;
  }

  // ::v-deep.el-range-editor--small .el-range-separator {
  //   line-height: 34px;
  // }
  ::v-deep.el-table.el-table--fit{
  overflow: hidden;
}
</style>
