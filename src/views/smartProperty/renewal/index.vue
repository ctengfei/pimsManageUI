<template>
  <div class="app-container">
    <div  style="height: 100%">
      <el-form inline :model="formSearch" ref="formSearch">
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            placeholder="请输入公司名称"
            v-model="formSearch.companyName"
          ></el-input>
        </el-form-item>
        <el-form-item label="新合同编号" prop="serialNumber">
          <el-input
            placeholder="请输入新合同编号"
            v-model="formSearch.serialNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="time"
            type="daterange"
            @change="timeChange()"
            value-format="yyyy-MM-dd"
            style="width: 240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
            @click="onReset('formSearch')"
            >重置</el-button
          >
        </el-form-item>
        
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="registerRenewal()"
          >登记续租</el-button>
        </el-col>
      </el-row>
      <div style="height: calc(100% - 150px)">
        <el-table :data="tableData">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="applyDate" label="申请日期"></el-table-column>
          <el-table-column
            prop="oldSerialNumber"
            label="合同编号(旧)"
          ></el-table-column>
          <el-table-column
            prop="newSerialNumber"
            label="合同编号(新)"
          ></el-table-column>
          <el-table-column
            prop="companyName"
            label="公司名称"
          ></el-table-column>
          <el-table-column prop="address" label="公司地址"></el-table-column>
          <el-table-column prop="operator" label="操作人员"></el-table-column>
          <!-- <el-table-column label="操作"> -->
          <!-- <template slot-scope="scope">
              <el-button
                @click="onRemove(scope.row)"
                type="text"
               
                style="color: #ff403d"
                >撤销</el-button
              >
            </template> -->
          <!-- </el-table-column> -->
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

      <el-dialog title="登记续租" width="25%" :visible.sync="renewalDialogShow">
        <el-row>
          <el-form label-width="100px">
            <el-col>
              <el-form-item label="企业名称">
                <el-select
                  v-model="formSearchID.companyName"
                  clearable
                  placeholder="请选择"
                  @change="choosecompany"
                >
                  <el-option
                    v-for="(item, index) in companyArr"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>

        <div slot="footer" style="text-align: right">
          <el-button
            type="primary"
            @click="renewal()"
            :disabled="companydisabled"
            >确定</el-button
          >
          <el-button plain @click="cancel()"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
    <el-dialog
      title="企业续租"
      :visible.sync="renewalShow"
      width="600px"
      v-if="renewalShow"
      :before-close="handleClose1">
      <div class="sketch_content">
        <Renew
          ref="Renew"
          :rowData="rowData"
          @RenewVisibleShow="RenewVisibleShow"
          :renew="renew"
        />
      </div>
    </el-dialog>
    <!--
      <div v-else-if="renewalShow" style="height: 100%">
      
    </div>
    -->
  </div>
</template>

<script>
import pagination from "@/components/comPagination";
import Renewal from "./components/renewal";
import Renew from "@/views/spaceManagement/contractManagement/components/renew";
import { searchChange } from "@/api/spaceManagement/changeManagement.js";
import { getControlTree } from "@/api/spaceManagement/controlManagement";

import $contract from "@/api/spaceManagement/contractManagement.js";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
export default {
  name: "Renewal",
  components: {
    pagination,
    Renewal,
    Renew,
  },
  data() {
    return {
      permission: {
        search: "spaceManagement::changeManagement::search",
        searchCompany: "spaceManagement::contractManagement::searchCompany",
        searchID: "spaceManagement::contractManagement::search",
        remove: "spaceManagement::contractManagement::remove",
      },
      rooms: [],
      formSearch: {
        serialNumber: "",
        companyName: "",
        operateType: "RENEW",
        endTime: "",
        startTime: "",
        pageNum: 1,
        pageSize: 10,
      },
      time: [],
      tableData: [],
      total: 15,
      chooseCompanyName: "",
      homePageShow: true,
      renewalShow: false,
      renewalDialogShow: false,
      companyName: [],
      rowData: {},
      companyList: [],
      companyArr: [],
      companyId: "",
      formSearchID: {
        companyName: "",
        status: "VALID",
      },
      companydisabled: true,
      renew: true,
    };
  },
  mounted() {
    this.getTableData();
    this.getCompany();
  },
  methods: {
    handleClose1(){
        this.renewalShow = false
      },
    onSearch() {
      this.getTableData();
    },
    getCompany() {
      this.companyId = "";
      // let obj = getObjByKey(this.permission.searchCompany);
      let url = '/pm/company_enter/entered/page'
      let method = 'GET'
      let parmas = {
        name: this.chooseCompanyName ? this.chooseCompanyName : "",
        pageSize:1000,
        pageNum:1,
      };
      getControlTree(url, method, parmas).then((res) => {
        this.companyList = [];
        this.companyArr = [];
        this.companyList = res.data.data;
        for (const item of this.companyList) {
          this.companyArr.push({
            value: item.companyName, //这里一定是value: '值'
            id: item.companyId,
          });
        }
      });
    },
    choosecompany() {
      // let data = getObjByKey(this.permission.searchID);
      let url = '/pm/contract/all'
      let method = 'GET'
      $contract
        .searchForm(url, method, this.formSearchID)
        .then((res) => {
          if (res.data.data) {
            if (res.data.data.length) {
              this.rowData = res.data.data[0];
              this.companydisabled = false;
            } else {
              this.$message.error("当前公司暂无生效中合同");
            }
          }
        });
    },
    renewal() {
      console.log(this.formSearchID.companyName, "222999999999999999999");
      if (this.formSearchID.companyName) {
        this.homePageShow = false;
        this.renewalShow = true;
        this.renewalDialogShow = false;
        this.formSearchID.companyName = "";
      } else {
        this.$message.warning("请选择企业");
      }
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
      // let obj = getObjByKey(this.permission.search);
      let url = '/pm/contract/operate/record'
      let method = 'GET'
      searchChange(url, method, data).then((res) => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    handleCurrentChange() {
      this.getTableData();
    },
    onReset() {
      this.time = [];
      this.$refs["formSearch"].resetFields();
      this.getTableData();
    },
    registerRenewal() {
      this.renewalDialogShow = true;
    },
    cancel() {
      this.addForm = {
        deviceName: "",
        deviceNum: "",
        cycle: "",
        content: "",
        frequency: "",
      };
      this.renewalDialogShow = false;
    },
    RenewVisibleShow(data) {
      this.getTableData();
      this.homePageShow = data;
      this.renewalShow = !data;
    },
    onRemove(id) {
      console.log(id, "123123");
      // let data = getObjByKey(this.permission.remove);
      let url = '/pm/contract'
      let method = 'PUT'
      this.$confirm(
        `确定撤销【${id.companyName}/${id.newSerialNumber}】的合同内容吗？撤销后，数据将恢复之前的状态！`,
        "提示",
        {
          confirmButtonText: "确定",
          confirmButtonClass: "el-icon-check",
          cancelButtonText: "取消",
          cancelButtonClass: "el-icon-close",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          $contract
            .removes(url, method, id.newSerialNumber)
            .then((res) => {
              this.$message.success("撤销成功");
              this.getTableData();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form .el-select {
  width: 100%;
}

// ::v-deep.el-range-editor--small .el-range-separator {
//   line-height: 34px;
// }
::v-deep.el-table.el-table--fit {
  overflow: hidden;
}
</style>
