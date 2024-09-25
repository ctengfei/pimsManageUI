<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true"  label-width="68px">
      <el-form-item label="企业名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入企业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属行业" prop="companyField">
        <!-- <el-select v-model="queryParams.status" placeholder="所属行业" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select> -->
        <el-input
          v-model="queryParams.companyField"
          placeholder="请输入所属行业"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="时间维度" prop="timeType">
        <el-select v-model="queryParams.timeType" placeholder="时间维度">
          <el-option label="月" value="month" />
          <el-option label="年" value="year" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="dateTime">
        <el-date-picker v-model="queryParams.dateTime" :type="queryParams.timeType" placeholder="时间" :clearable="false"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="postList">
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="企业名称" align="center" prop="companyName" />
      <el-table-column label="所属园区" align="center" prop="area" />
      <el-table-column label="所属行业" align="center" prop="companyField" />
      <!-- <el-table-column label="碳排放总量" align="center" prop="postSort" /> -->
      <el-table-column label="用电碳排放量" align="center" prop="carbonEmission" />
      <!-- <el-table-column label="时间" align="center" prop="postId" /> -->
      <!-- <el-table-column label="用水碳排放量" align="center" prop="postSort" />
      <el-table-column label="用热碳排放量" align="center" prop="postSort" /> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Moment from "moment";
import $environMonitor from "@/api/environMonitor";

export default {
  name: "EnergyLowCarbon",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        timeType: 'month',
        dateTime: new Date(),
        companyName: undefined,
        companyField: undefined
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = false;
      let params = {
        companyField: this.queryParams.companyField,
        companyName: this.queryParams.companyName,
        dateTime: this.queryParams.timeType == 'year' ? Moment(new Date(this.queryParams.dateTime)).format('YYYY') : Moment(new Date(this.queryParams.dateTime)).format('YYYY-M'),
        timeType: this.queryParams.timeType.toUpperCase()
        // nodeId: "1592721639844859906",
        // dateTime: Moment(new Date(this.monitorSite.timeArr)).format('yyyyWW')
        // dateTime: "202301"
      };
      $environMonitor.getCarbonEmission(params).then(response => {
        this.postList = response.data;
        // this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  }
};
</script>