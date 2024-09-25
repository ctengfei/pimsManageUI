<template>
  <div :class="workPageShow?'app-container':'app-container-bow'">
    <div v-if="workPageShow">
    <!--
      <Tabs @btnclick="btnclick($event)" :btnGroup="btnGroup" :btnChoose="btnChoose" :singleWidth="94"/>
    -->

    <div>
      <el-form ref="formSearch" inline v-model="formSearch">
        <el-form-item prop="companyName" label="合同编号">
          <el-input placeholder="请输入合同编号" clearable v-model="formSearch.serialNumber"></el-input>
        </el-form-item>
        <el-form-item prop="industryType" label="公司名称">
          <el-input placeholder="请输入公司名称" clearable v-model="formSearch.companyName"></el-input>
        </el-form-item>
        <el-form-item label="日期选择">
          <el-date-picker
            @change="timeChange"
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            style="width: 240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同状态" prop="status">
          <el-select
            placeholder="请选择合同状态"
            clearable
            v-model="formSearch.status"
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
          <el-button  icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
          <el-button  icon="el-icon-refresh" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="area" label="位置区域"></el-table-column>
        <el-table-column prop="serialNumber" label="合同编号"></el-table-column>
        <el-table-column label="合同周期">
          <template slot-scope="scope">
            <span>{{scope.row.startDate}}~{{scope.row.endDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="scope.row.status == 'VALID' ? 'valid' : ' invalid'">{{scope.row.status == 'VALID' ? '生效中' : ' 已失效'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="surplusDays" label="合同截止日期"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'VALID'">
              <el-button @click="onRenew(scope.row)" type="text">续签</el-button>
              <el-button @click="onChange(scope.row)" type="text">变更</el-button>
              <el-button @click="onDetail(scope.row.id)" type="text">详情</el-button>
            </span>
            <span v-else>
              <el-button @click="onDetail(scope.row.id)" type="text">详情</el-button>
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
    <div v-if="detailShow" style="height: 100%">
      <el-dialog
      title="详情"
      :visible.sync="detailShow"
       width="600px"
      :before-close="handleClose">
      <Detail 
         ref="editDtail" 
         :rowData="rowData" 
         @detailVisibleShow='detailVisibleShow' 
         :iscreate='iscreate'
         />
      </el-dialog>
    </div>
    <div v-else-if="RenewShow" style="height: 100%">
      <el-dialog
       :title="titlerenew"
       :visible.sync="RenewShow"
       width="600px"
       :before-close="handleClose">
      <Renew 
        ref="Renew" 
        :rowData="rowData" 
        @RenewVisibleShow='RenewVisibleShow' 
        :renew='renew'
        />
      </el-dialog>
    </div>
  </div>
  
</template>

<script>
  import pagination from '@/components/comPagination'
  import Tabs from '@/components/commonTabs'
  import {searchRemind} from '@/api/spaceManagement/remindManagement.js'
  import Detail from "../../contractManagement/components/detail"
  import Renew from "../../contractManagement/components/renew"
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
  export default {
    name:'RemindManagement',
    components: {
      pagination,
      Tabs,
      Renew,
      Detail
    },
    data() {
      return {
        test: true,
        btnGroup: [
          {
            label: "全部",
            value: 'all'
          },
          {
            label: "生效中",
            value: 'VALID'
          },
          {
            label: "已失效",
            value: 'INVALID'
          }
        ],
        btnChoose: 0,
        formSearch: {
          pageNum: 1,
          pageSize: 10,
          serialNumber: '',
          companyName: '',
          endTime:'',
          startTime:'',
          status:'',
          querySoonExpire:true
        },
        time:[],
        total: 0,
        tableData: [],
        // permission:{
        //   search: 'spaceManagement::remindManagement::search'
        // },
        RenewShow: false,
        titlerenew:"续签",
        renew:false,
        workPageShow: true,
        detailShow: false,
      }
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      timeChange() {
        if (!this.time) {
          this.time = [];
          this.getTableData();
        }
      },
      getTableData() {
        if (this.time) {
        this.formSearch.startTime = this.time[0];
        this.formSearch.endTime = this.time[1];
      } else {
        this.formSearch.startTime = "";
        this.formSearch.endTime = "";
      }
        //let obj = getObjByKey(this.permission.search);
        let data = {
          pageNum: this.formSearch.pageNum,
          pageSize: this.formSearch.pageSize,
          serialNumber: this.formSearch.serialNumber,
          companyName: this.formSearch.companyName,
          endTime:this.time.length>0?this.time[1]:'',
          startTime:this.time.length>0?this.time[0]:'',
          status:this.formSearch.status==="all"?'':this.formSearch.status,
          querySoonExpire:true
        }
        searchRemind('/pm/contract/soonExpireOrOverdue','get',data).then(res=>{
          if(res.code === 200){
            console.log(res);
            this.tableData = res.data.data;
            this.total = res.data.total;
          }
        })
      },
      btnclick(e) {
        this.formSearch.status = e.item.value;
        this.btnChoose = e.index;
        this.getTableData();
      },

      handleCurrent() {

      },
      onSearch(){
        this.getTableData();
      },
      onReset() {
        this.formSearch = {
           pageNum: 1,
          pageSize: 10,
          serialNumber: '',
          companyName: '',
          endTime:'',
          startTime:'',
          status:'',
          querySoonExpire:true
        };
        this.time = [];
        this.getTableData();
      },

      handleCurrentChange() {
        this.getTableData();
      },
      onChange(data) {
        this.workPageShow = true;
        this.RenewShow = true;
        this.titlerenew = "变更";
        this.detailShow = false;
        this.renew = false
        this.rowData = data;
      },
      onRenew(data) {
        this.workPageShow = true;
        this.RenewShow = true;
        this.detailShow = false;
        this.titlerenew = "续签";
        this.renew = true
        this.rowData = data;
      },
       onDetail(data) {
        this.workPageShow = true;
        this.detailShow = true;
        this.iscreate = false
        this.rowData = data;
      },
          // 详情和编辑
      detailVisibleShow(data) {
        this.workPageShow = data;
        this.detailShow = !data;
      },
      RenewVisibleShow(data){
        this.workPageShow = data;
        this.RenewShow = !data;
      },
    
    }
  }
</script>

<style lang="scss" scoped>
  .btnGroups {
    cursor: pointer;
    background-color: #f5f7fa;
    border-radius: 30px;
    width: 280px;
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
      
      font-size: 14px;
    }
    .divActive {
      background-color: #1890ff !important;
      color: #fff;
    }
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

  ::v-deep .el-divider--horizontal {
    background-color: #afb9d0;
    opacity: 0.15;
    margin: 2px 0;
  }
  .valid{
    color: #206aff;
  }
  .invalid{
    color: #ff403d;
  }
  ::v-deep.el-table.el-table--fit {
  overflow: hidden;
}
</style>
