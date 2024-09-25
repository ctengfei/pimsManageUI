<template>
  <div :class="homePageShow ? 'app-container' : 'app-container-bow'">
    <div v-if="homePageShow">
      <el-form inline :model="formSearch" ref="formSearch">
        <el-form-item prop="serialNumber" label="合同编号">
          <el-input
            placeholder="请输入合同编号"
            v-model="formSearch.serialNumber"
          ></el-input>
        </el-form-item>
        <el-form-item prop="companyName" label="公司名称">
          <el-input
            placeholder="请输入公司名称"
            v-model="formSearch.companyName"
          ></el-input>
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
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="onSearch()"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            @click="onReset()"
            >重置</el-button
          >
        </el-form-item>
        <!--
          <el-form-item style="float: right">
          <el-button type="primary" @click="registerRenewal()"
            ></el-button
          >
        </el-form-item>
        -->
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="registerRenewal()"
          >变更申请</el-button>
        </el-col>
      </el-row>
      <div>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
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
            <!-- <template slot-scope="scope"> -->
              <!-- <el-button
                @click="onEdit(scope.row)"
                type="text"
               
                style="color: #206aff"
                >编辑</el-button
              >
              <el-button
                @click="onRemove(scope.row)"
                type="text"
               
                style="color: #ff403d"
                >撤销</el-button
              > -->
            <!-- </template> -->
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
      <el-dialog title="变更申请" width="25%" :visible.sync="renewalDialogShow">
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
            @click="onChange()"
            :disabled="companydisabled"
            >确定</el-button
          >
          <el-button @click="cancel()"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
    <div v-else-if="RenewShow" style="height: 100%">
      <Renew
        ref="Renew"
        :rowData="rowData"
        @RenewVisibleShow="RenewVisibleShow"
        :renew="renew"
      />
    </div>
    <div v-else-if="EditShow" style="height: 100%">
      <Edit
        ref="Edit"
        :rowData="rowData"
        @EditVisibleShow="EditVisibleShow"
        :renew="renew"
      />
    </div>
  </div>
  
</template>

<script>
import pagination from "@/components/comPagination";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import Renew from "../../contractManagement/components/renew";
import Edit from "../../contractManagement/components/edit";
import { getControlTree } from "@/api/spaceManagement/controlManagement";
import { searchChange } from "@/api/spaceManagement/changeManagement.js";
import $contract from "@/api/spaceManagement/contractManagement.js";

export default {
  name:'ChangeManagement',
  components: {
    pagination,
    Renew,
    Edit
  },
  data() {
    return {
      // permission: {
      //   search: "spaceManagement::changeManagement::search",
      //   edit: "spaceManagement::changeManagement::edit",
      //   searchID: "spaceManagement::contractManagement::search",
      //   searchDetail: "spaceManagement::changeManagement::searchDetail",
      //   addCompany: "facility::contractManagement::addCompany",
      //   searchCompany: "spaceManagement::contractManagement::searchCompany",
      // },
      formSearch: {
        serialNumber: "",
        companyName: "",
        operateType:'CHANGE',
        endTime: "",
        startTime: "",
        pageNum: 1,
        pageSize: 10
      },
      formSearchID: {
        companyName: "",
        status: "VALID"
      },
      time: [],
      tableData: [],
      rowData: {},
      total: 0,
      chooseCompanyName: "",
      homePageShow: true,
      RenewShow: false,
      EditShow: false,
      renewalDialogShow: false,
      companyName: [],
      companyId: "",
      companyList: [],
      companyArr: [],
      renew: false,
      checkAll: [],
      companydisabled: true,
      edit: true
    };
  },
  mounted() {
    this.getTableData();
    this.getCompany();
  },
  methods: {
      timeChange() {
      if (!this.time) {
        this.time = [];
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      // let arr = val;
      // // this.checkAll = [...new Set(arr)]
      // console.log(arr, "222222");
    },
    onChange() {
      if (this.formSearchID.companyName) {
        this.homePageShow = false;
        this.RenewShow = true;
        this.renew = false;
        this.renewalDialogShow = false;
        this.formSearchID.companyName = "";
      } else {
        this.$message.warning("请选择企业");
      }
    },
    getCompany() {
      this.companyId = "";
      //let obj = getObjByKey(this.permission.searchCompany);
      let parmas = {
        name: this.formSearchID.companyName ? this.formSearchID.companyName : "",
        pageSize:1000,
        pageNum:1,
      };
      getControlTree('/pm/company_enter/entered/page', 'get', parmas).then(res => {
        if (res.code === 200) {
          this.companyList = [];
          this.companyArr = [];
          this.companyList = res.data.data;
          for (let item of this.companyList) {
            this.companyArr.push({
              value: item.companyName, //这里一定是value: '值'
              id: item.companyId
            });
          }
        }
      });
    },
    choosecompany() {
      //let data = getObjByKey(this.permission.searchID);
      $contract
        .searchForm('/pm/contract/all', 'get', this.formSearchID)
        .then(res => {
          if (res.code === 200) {
            if (res.data.data) {
              if (res.data.data.length) {
                this.rowData = res.data.data[0];
                this.companydisabled = false;
              } else {
                this.$message.error("当前公司暂无生效中合同");
              }
            }
          } else {
            this.$message.error(res.meta.message);
          }
        });
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
      console.log(data,'213');
      //let obj = getObjByKey(this.permission.search);
      searchChange('/pm/contract/operate/record', 'get', data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    onSearch() {
      this.getTableData();
    },
    //      撤销
    onRemove(id) {
      let data = getObjByKey(this.permission.remove);
      this.$confirm(
        `确定撤销【${id.companyName}/${
          id.serialNumber
        }】的合同内容吗？撤销后，数据将恢复之前的状态！`,
        "提示",
        {
          confirmButtonText: "确定",
          confirmButtonClass: "el-icon-check",
          cancelButtonText: "取消",
          cancelButtonClass: "el-icon-close",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          $contract.removes(data.url, data.method, id.newSerialNumber).then(res => {
            if (res.code === 200) {
              this.$message.success("撤销成功");
              this.formSearch.status = "";
              this.formSearch.pageSize = 10;
              this.getList(this.formSearch);
            } else {
              this.$message.error(res.meta.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleCurrentChange() {
      this.getTableData();
    },
    onReset() {
      this.$refs.formSearch.resetFields();
      this.time = [];
      this.formSearch.startTime = "";
      this.formSearch.endTime ="";
      this.getTableData();
    },
    registerRenewal() {
      this.renewalDialogShow = true;
    },
    onEdit(data) {
      this.rowData = data;
      this.homePageShow = false;
      this.EditShow = true;
    },
    cancel() {
      this.formSearchID.companyName = "";
      this.renewalDialogShow = false;
    },

    RenewVisibleShow(data) {
      this.homePageShow = data;
      this.RenewShow = !data;
    },
    EditVisibleShow(data) {
      this.homePageShow = data;
      this.EditShow = !data;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form .el-select {
  width: 100%;
}

// ::v-deep.el-range-editor--small .el-range-separator {
//   line-height: 34px;
// }
</style>
