<template>
  <div class="app-container">
    <div v-if="homepage">
      <el-form :inline="true" ref="parameter" :model="parameter" v-show="showSearch">
        <el-form-item label="商铺号" prop="RoomID">
          <el-input v-model="parameter.RoomID" placeholder="请输入商铺号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  @click="onSearch" type="primary" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getTableData"></right-toolbar>
        </el-row>
      <el-table :data="tableData">
        <el-table-column show-overflow-tooltip label="商铺号" prop="RoomID">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="电表编号" prop="MeterID">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="电表型号" prop="Model">
        </el-table-column
        ><el-table-column
          show-overflow-tooltip
          label="剩余金额"
          prop="PowerRemain"
        >
        </el-table-column
        ><el-table-column
          show-overflow-tooltip
          label="总用电量"
          prop="PowerTatol"
        >
        </el-table-column
        ><el-table-column
          show-overflow-tooltip
          label="是否欠费"
          prop="OweMoney"
        >
          <template slot-scope="scope">
            {{ scope.row.OweMoney ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              @click="searchRecord(scope.row)"
              type="text"
             
              style="color: #f05656"
              >查看用电记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="tableData && tableData.length > 0"
        @pagination="handleCurrentChange"
        :page.sync="pageNum"
        :pageSizes="[10, 20, 40]"
        :limit.sync="pageSize"
        :total="total"
      />
    </div>
    <Details
      v-else
      :rowData="rowData"
      @DetailVisibleShow="DetailVisibleShow"
    ></Details>
  </div>
</template>

<script>
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import {
  getDetail,
  getTable
} from "@/api/smartEnergyAdmin/electricityMeter.js";
import Details from "../components/details";

import pagination from "@/components/comPagination";
export default {
  name: 'ElectricityMeter',
  components: {
    Details,
    pagination
  },
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 1,
      homepage: true,
      parameter: {
        RoomID:"",
      },
      rowData: {},
      showSearch: true
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    onSearch() {
      this.pageNum = 1
      this.getTableData()
    },
    resetQuery(){
      this.resetForm('parameter')
      this.onSearch()
    },
    handleCurrentChange() {
      this.getTableData()

    },
    getTableData() {
      let obj = {
        url: '/pm/pay/remoteGly/meterAll',
        method: 'GET'
      }
      let data = {
        RoomID: this.parameter.RoomID,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getTable(obj.url, obj.method, data).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    searchRecord(data) {
      this.rowData = data;
      this.homepage = false;
    },
    DetailVisibleShow(data) {
      this.homepage = data;
    }
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep.el-table.el-table--fit{
    overflow: hidden;
  }
  ::v-deep.pagination-container {
    margin-top: 0px;
  }
</style>
