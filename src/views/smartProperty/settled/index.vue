<template>
  <div class="app-container" :class="portraitShow ? 'transparent' : ''">
    <div v-if="homePageShow" style="height:100%">
      <el-form ref="formSearch" inline v-model="formSearch">
        <el-form-item prop="companyName" label="企业名称">
          <el-input
            placeholder="请输入企业名称"
            clearable
            v-model="formSearch.companyName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="companyName" label="行业类型">
          <el-select
            placeholder="请输入行业类型"
            clearable
            v-model="formSearch.industry"
          >
            <el-option
              v-for="(item, index) in industry"
              :label="item.name"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期选择">
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

      <div style="height: calc(100% - 150px)">
        <el-table :data="tableData">
          <el-table-column
            label="序号"
            width="80"
            type="index"
          ></el-table-column>
          <el-table-column
            prop="companyName"
            label="企业名称"
            showOverflowTooltip
          ></el-table-column>
          <el-table-column
            prop="address"
            label="所在园区位置"
            showOverflowTooltip
          >
          </el-table-column>
          <el-table-column
            prop="serialNumber"
            label="合同编号"
            showOverflowTooltip
          ></el-table-column>
          <el-table-column label="合同周期">
            <template slot-scope="scope">
              <span>{{
                scope.row.startDate &&
                  scope.row.endDate &&
                  scope.row.startDate + "~" + scope.row.endDate
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rentStatus" label="状态" showOverflowTooltip>
            <template slot-scope="scope">
              <span style="color: #ff403d">
                {{ scope.row.rentStatus == "OUTPARK:71048" ? "出园" : "在园" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="creator"
            label="操作人员"
            showOverflowTooltip
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="操作时间"
            showOverflowTooltip
          >
          </el-table-column>
          <el-table-column
            label="操作"
            prop="settledStatus"
            showOverflowTooltip
          >
            <template slot-scope="scope">
              <el-button
                @click="onPortrait(scope.row)"
                type="text"
               
               
                >企业画像</el-button
              >
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
    <div v-else-if="portraitShow" style="height: 100%;overflow:auto;">
      <Portrait
        ref="portrait"
        :rowData="rowData"
        @portraitShowVisibleShow="portraitShowVisibleShow"
      ></Portrait>
    </div>
  </div>
</template>

<script>
import Portrait from "./components/portrait";
import pagination from "@/components/comPagination";
import {
  initTabData,
  searchInfo,
  initportraitTabData,
  addenter
} from "@/api/smartProperty/notice";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { get } from "@/api/system/dicttype";

export default {
  name: "Settled",
  components: {
    pagination,
    Portrait
  },
  data() {
    return {
      permission: {
        searchentered: "smartProperty::settled::searchentered",
      },
      homePageShow: true,
      detailShow: false,
      //        入驻登记组件展示
      entryRegistration: false,
      portraitShow: false,

      time: [],
      formSearch: {
        companyName: "",
        rentStatus: "",
        endTime: "",
        startTime: "",
        pageNum: 1,
        pageSize: 10,
        industry: ""
      },
      total: 15,
      tableData: [],
      rowData: {},
      industry: [],
      dictionary: ["industry"]
    };
  },
  watch:{
    $route(to,from){
      console.log(to,'to')
      if(from.path == '/smartProperty/settled'){
        this.getTableData();
      }
    }
  },
  mounted() {
    this.getTableData();
    this.getdict();
  },
  methods: {
    //      获取字典
    getdict() {
      this.dictionary.forEach(item => {
        get(item).then(res => {
          this.$set(this, item, [...res.data]);
        });
      });
    },
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
      let data = this.formSearch;
      if (data.rentStatus == "All") {
        data.rentStatus = "";
      }
      // let url = getObjByKey(this.permission.searchentered).url;
      // let method = getObjByKey(this.permission.searchentered).method;
      let url = '/pm/company_enter/entered/page'
      let method = 'GET'
      initTabData(url, method, data).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    onSearch() {
      this.getTableData();
    },
    btnClick(item) {
      this.formSearch.rentStatus = item.value;
      this.getTableData();
      this.btnChoose = item.label;
    },
    onEntry(data) {
      this.homePageShow = false;
      this.detailShow = false;
      this.entryRegistration = true;
      this.portraitShow = false;
      this.rowData.noticeId = data.noticeId;
      this.rowData = data;
    },
    onPortrait(data) {
      // this.homePageShow = false;
      // this.detailShow = false;
      // this.entryRegistration = false;
      // this.portraitShow = true;
      // this.rowData = data;
      let obj = {
        enteredCompanyId:data.enteredCompanyId,
        companyName:data.companyName,
        address:data.address
      }
      this.$router.push({
        path: '/smartProperty/portrait',
        query: {
          player:encodeURI(JSON.stringify(obj)) ,
        }
      })
      // /pims/smartProperty/settled
    },
    handleCurrent() {},
    onReset() {
      this.formSearch = {
        companyName: "",
        rentStatus: "",
        endTime: "",
        startTime: "",
        pageNum: 1,
        pageSize: 10
      };
      this.time = [];
      this.getTableData();
    },
    detailVisibleShow(data) {
      this.homePageShow = data;
      this.detailShow = !data;
      this.entryRegistration = !data;
      this.portraitShow = !data;
    },
    settlementVisibleShow(data) {
      this.homePageShow = data;
      this.detailShow = !data;
      this.entryRegistration = !data;
      this.portraitShow = !data;
    },
    portraitShowVisibleShow(data) {
      this.homePageShow = data;
      this.detailShow = !data;
      this.entryRegistration = !data;
      this.portraitShow = !data;
    },
    handleCurrentChange(val) {
      this.formSearch = {
        companyName: "",
        time: "",
        pageNum: 1,
        pageSize: 10
      };
      this.formSearch.pageSize = val.limit;
      this.formSearch.pageNum = val.page;
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.color {
  color: #206aff;
}
.transparent {
  background-color: transparent;
  padding: 0;
  /*height: calc(100% - 60px - 20px);*/
}

.pottraittransparent {
  background-color: transparent;
  padding: 0;
}

.btnGroups {
  cursor: pointer;
  background-color: #313448;
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
    color: #fff;
  }
  .divActive {
    background-color: #206aff;
  }
}

// ::v-deep.el-range-editor--small .el-range-separator {
//   line-height: 34px;
// }
::v-deep.el-table.el-table--fit {
  overflow: hidden;
}
</style>
