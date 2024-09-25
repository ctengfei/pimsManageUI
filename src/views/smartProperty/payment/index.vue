<template>
  <div class="app-container" :class="writeOffShow ? 'transparent' : ''">
    <div v-if="homePageShow" style="height: 100%">
      <!--
        <div>
        <Tabs
          @btnclick="btnclick($event)"
          :btnGroup="btnGroup"
          :btnChoose="btnChoose"
          :singleWidth="94"
        />
      </div>
      -->
      <div style="height:100%">
        <el-form inline>
          <el-form-item label="企业名称">
            <el-input
              placeholder="请输入企业名称"
              v-model="formSearch.companyName"
            ></el-input>
          </el-form-item>
          <el-form-item label="日期选择">
            <el-date-picker
              v-model="time"
              type="daterange"
              @change="timeChange"
              value-format="yyyy-MM-dd"
              style="width: 240px"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="是否缴纳" prop="payStaus">
            <el-select
              placeholder="请选择缴纳状态"
              clearable
              v-model="formSearch.payStaus"
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
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="onSearch()"
              >搜索</el-button
            >
            <el-button
              plain
              icon="el-icon-refresh"
              @click="onReset()"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <div style="height: calc(100% - 220px)">
          <el-table :data="tableData">
            <el-table-column
              type="index"
              label="序号"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="companyName"
              label="企业名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="companyAddress"
              label="所在园区位置"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="arrearsDay"
              label="欠费天数(天)"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="receivableAmount"
              label="应收金额(元)"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span style="color: #206aff; cursor: pointer">{{
                  scope.row.receivableAmount
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="actualAmount"
              label="实收金额(元)"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span style="color: #206aff; cursor: pointer">{{
                  scope.row.actualAmount
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="arrearsAmount"
              label="欠费金额(元)"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span style="color: #206aff; cursor: pointer">{{
                  scope.row.arrearsAmount
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="payStausDesc"
              label="是否缴纳"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="billingCycle"
              label="账单周期"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.billStart }}~{{ scope.row.billEnd }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="onWriteOff(scope.row)"
                  type="text"
                 
                  v-if="scope.row.payStaus == 'NO'"
                  >核销
                </el-button>
                <el-button
                  @click="onDetail(scope.row)"
                  type="text"
                 
                  v-else
                  >查看明细
                </el-button>
                <el-button
                  v-if="scope.row.payStaus == 'YES'"
                  @click="onDownload(scope.row)"
                  type="text"
                 
                  >下载</el-button
                >
              </template>
            </el-table-column>
          </el-table>
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
    <div v-else-if="chargeDetailShow">
      <Chargedetail
        ref="chargedetail"
        :rowData="rowData"
        @ChargedetailVisibleShow="ChargedetailVisibleShow"
      ></Chargedetail>
    </div>
    <div v-else-if="writeOffShow">
      <Writeoff
        ref="writeoff"
        :rowData="rowData"
        @WriteoffVisibleShow="WriteoffVisibleShow"
      ></Writeoff>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/comPagination";
import Chargedetail from "./components/chargedetail";
import Writeoff from "./components/writeoff";
import Tabs from "@/components/commonTabs";
import { initTabData, downloads } from "@/api/smartProperty/payment";
import { downloadFile } from "@/utils/index";
export default {
  name: "",
  components: {
    pagination,
    Chargedetail,
    Tabs,
    Writeoff
  },
  data() {
    return {
      homePageShow: true,
      chargeDetailShow: false,
      writeOffShow: false,
      btnGroup: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "已缴纳",
          value: "YES"
        },
        {
          label: "未缴纳",
          value: "NO"
        }
      ],
      btnChoose: 0,
      formSearch: {
        companyName: "",
        payStaus: "",
        startDate: "",
        endDate: "",
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      rowData: {},
      time: []
    };
  },
  watch:{
    $route(to,from){
      console.log(to,'to')
      this.getTableData();
      // if(from.path == '/payment'){
      //   this.getTableData();
      // }
    }
  },
  mounted() {
    console.log(this.$route.params.id,'this.$route.params')
    this.$route.params.id ? (this.formSearch.payStaus = "YES") : (this.formSearch.payStaus = "NO")
    // !this.$route.params.id
    //   ? (this.btnChoose = 0)
    //   : this.$route.params.id == "1"
    //   ? (this.btnChoose = 1)
    //   : (this.btnChoose = 2);
    // if (this.btnChoose == 1) {
    //   this.formSearch.payStaus = "YES";
    // } else if (this.btnChoose == 2) {
    //   this.formSearch.payStaus = "NO";
    // } else {
    //   this.formSearch.payStaus = "";
    // }
    this.getTableData();
  },
  methods: {
    onDetail(data) {
      // this.rowData = data;
      // this.homePageShow = false;
      // this.chargeDetailShow = true;
      let obj = {
        id:data.id,
        companyName:data.companyName,
        companyAddress:data.companyAddress,
        billStart:data.billStart,
        billEnd:data.billEnd
      }
      this.$router.push({
        path: '/smartProperty/chargedetail',
        query: {
          player:encodeURI(JSON.stringify(obj)) ,
        }
      })
    },
    getTableData() {
      if (this.time) {
        this.formSearch.startDate = this.time[0];
        this.formSearch.endDate = this.time[1];
      } else {
        this.formSearch.startDate = "";
        this.formSearch.endDate = "";
      }
      let data = this.formSearch;
      initTabData(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    handleCurrentChange() {
      this.getTableData();
    },
    timeChange() {
      if (!this.time) {
        this.time = [];
        this.formSearch.startDate="";
        this.formSearch.endDate="";
        this.getTableData();
      }
    },
    btnclick(e) {
      this.btnChoose = e.index;
      this.formSearch.payStaus = e.item.value;
      this.getTableData();
    },
    onWriteOff(data) {
      // this.rowData = data;
      // this.homePageShow = false;
      // this.chargeDetailShow = false;
      // this.writeOffShow = true;
      let obj = {
        id:data.id,
        companyName:data.companyName,
        companyAddress:data.companyAddress,
        billStart:data.billStart,
        billEnd:data.billEnd
      }
      this.$router.push({
        path: '/smartProperty/writeoff',
        query: {
          player:encodeURI(JSON.stringify(obj)) ,
        }
      })
    },
    onSearch() {
      this.getTableData();
    },
    onReset() {
      (this.formSearch = {
        companyName: "",
        payStaus: "",
        startDate: "",
        endDate: "",
        pageNum: 1,
        pageSize: 10
      }),
        (this.time = []);
      this.getTableData();
    },
    ChargedetailVisibleShow(data) {
      this.homePageShow = data;
      this.chargeDetailShow = !data;
      this.writeOffShow = !data;
    },
    WriteoffVisibleShow(data) {
      this.homePageShow = data;
      this.chargeDetailShow = !data;
      this.writeOffShow = !data;
    },

    onDownload(data) {
      console.log(data, "4");
      let par = {
        billNo: data.id
      };

      downloads(par)
        .then(res => {
          downloadFile(res, data.companyName, "xlsx");
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.transparent {
  background-color: transparent;
  padding: 0;
  // height: calc(100% - 60px - 20px);
}

.btnGroups {
  cursor: pointer;
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
    background-color: #206aff;
    color: #fff;
  }
}

// ::v-deep.el-range-editor--small .el-range-separator {
//   line-height: 34px;
// }
</style>
