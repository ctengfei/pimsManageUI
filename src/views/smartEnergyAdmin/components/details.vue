<template>
  <div >
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="12">
          <el-date-picker
            v-model="time"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="daterange"
            style="width: 240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <div @click="onCancel" class="backtext">
            <svg aria-hidden="true" class="svg-icon">
              <use href="#icon-icon-goback" />
            </svg>
            <span>返回上一页</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column show-overflow-tooltip label="商铺号" prop="RoomID">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="电表编号" prop="MeterID">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="用户名" prop="UserName">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="日期" prop="CreateTime">
        </el-table-column>
        <el-table-column label="变比" show-overflow-tooltip prop="CT">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="用电量"
          prop="powerIncrement"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="当天为抄表"
          prop="powerEnd"
        >
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
  </div>
</template>

<script>
import { getObjByKey, getStringByKey } from "@/utils/voice.js";

import { getDetail } from "@/api/smartEnergyAdmin/electricityMeter.js";
import pagination from "@/components/comPagination";
export default {
  components: {
    pagination
  },
  name: "details",
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 1,
      time: [],
      tableData: [],
    };
  },

  mounted() {
    // this.getstartdate(7);
    this.getTableData();
  },
  methods: {
    handleCurrentChange() {
      this.getTableData();
    },
    // 默认的时间处理
    // getstartdate(day) {
    //   var beginDate;
    //   var curr_time = new Date();
    //   var week_time = new Date(curr_time.getTime() - 1000 * 60 * 60 * 24 * day);
    //   var curyear = week_time.getFullYear();
    //   var curmonth = week_time.getMonth() + 1;
    //   curmonth = curmonth > 9 ? curmonth.toString() : "0" + curmonth.toString();
    //   var curday = week_time.getDate();
    //   curday = curday > 9 ? curday.toString() : "0" + curday.toString();
    //   beginDate = curyear + "-" + curmonth + "-" + curday;
    //   var currentyear = curr_time.getFullYear();
    //   var currentmonth = curr_time.getMonth() + 1;
    //   var currentday = curr_time.getDate();
    //   this.time[1] = currentyear + "-" + currentmonth + "-" + currentday;
    //   this.time[0] = beginDate;
    //   this.$forceUpdate()
    // },
    getTableData() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        str: this.rowData.MeterID,
        stratData: this.time[0] ? this.time[0] : "",
        endData: this.time[1] ? this.time[1] : "",
      };
      if (data.stratData == "") {
        delete data.stratData;
      }
      if (data.endData == "") {
        delete data.endData;
      }
      let obj = {
        url: '/pm/pay/remoteGly/PowerUse',
        method: 'GET'
      }
      getDetail(obj.url, obj.method, data).then((res) => {
        if (res.meta.status === 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    onCancel() {
      this.time=[];
      this.$emit("DetailVisibleShow", true);
    },
    onSearch() {
      this.getTableData()
    },
  },
};
</script>


<style lang="scss" scoped>
.backtext {
  color: #afb9d0;
  font-size: 14px;
  cursor: pointer;
}
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
}
::v-deep.pagination-container {
  margin-top: 0px;
}
</style>
