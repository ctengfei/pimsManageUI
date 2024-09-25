<template>
  <div class="app-container">
    <!--
        <Tabs
        @btnclick="btnclick($event)"
        :btnGroup="btnGroup"
        :btnChoose="btnChoose"
        :singleWidth="94"
      />
    -->

    <div>
      <el-form ref="formSearch" inline v-model="formSearch">
        <el-form-item label="合同编号" prop="companyName">
          <el-input
            placeholder="请输入合同编号"
            clearable
            v-model="formSearch.contractSn"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="industryType">
          <el-input
            placeholder="请输入客户名称"
            clearable
            v-model="formSearch.companyName"
          ></el-input>
        </el-form-item>
        <el-form-item label="退租类型" prop="industryType">
          <el-select
            placeholder="请选择退租类型"
            clearable
            v-model="formSearch.giveupAllFlag"
          >
            <el-option
              v-for="item in giveupAll"
              :label="item.label"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="time"
            type="daterange"
            clearable
            value-format="yyyy-MM-dd"
            style="width: 240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="timeChange()"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="退租状态" prop="giveUpQueryType">
          <el-select
            placeholder="请选择退租状态"
            clearable
            v-model="formSearch.giveUpQueryType"
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
    </div>
    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="applyRent()"
          >退租申请</el-button>
        </el-col>
      </el-row>
    <div style="height: calc(100% - 220px)">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column
          prop="companyName"
          label="客户名称"
          showOverflowTooltip
        ></el-table-column>
        <el-table-column prop="roomNames" label="园区位置" showOverflowTooltip>
          <template slot-scope="scope">
            {{ filterPosition(scope.row.roomNames) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="contractSn"
          label="合同编号"
          showOverflowTooltip
        ></el-table-column>
        <el-table-column prop="giveupAll" label="退租类型" showOverflowTooltip>
          <template slot-scope="scope">
            {{ scope.row.giveupAll ? "整体退租" : "部分退租" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="giveupAhead"
          label="是否提前退租"
          showOverflowTooltip
        >
          <template slot-scope="scope">
            {{ scope.row.giveupAhead ? "提前退租" : "到期退租" }}
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="状态" showOverflowTooltip>
          <template slot-scope="scope">
            {{
              scope.row.auditStatus == "waitingAudit"
                ? "待审核"
                : scope.row.auditStatus == "passed"
                ? "审核通过"
                : "审核拒绝"
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="操作人员"
          showOverflowTooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="操作时间"
          showOverflowTooltip
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus == 'waitingAudit'">
              <el-button
                @click="onExamine(scope.row)"
                type="text"
               
               
                >审核</el-button
              >
            </span>
            <span v-else-if="scope.row.auditStatus == 'passed'">
              <el-button
                @click="onStatement(scope.row)"
                type="text"
               
               
                >查看结算单</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        style="margin-top: 0px"
        v-show="tableData && tableData.length > 0"
        @pagination="handleCurrentChange"
        :page.sync="formSearch.pageNum"
        :pageSizes="[10, 20, 40]"
        :limit.sync="formSearch.pageSize"
        :total="total"
      />
    </div>

    <el-dialog
      title="申请退租"
      :visible.sync="applyRentChooseDialogShow"
      width="25%"
    >
      <el-row>
        <el-form label-width="100px">
          <el-col>
            <el-form-item label="企业名称">
              <el-select v-model="chooseCompanyName" placeholder="请选择企业">
                <el-option
                  v-for="(item, index) in companyArr"
                  :key="index"
                  :label="item.value"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="searchContract()"
          >确定</el-button
        >
        <el-button plain @click="cancel()"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <div class="dialogs">
      <el-dialog
        :title="title"
        :visible.sync="applyRentDialogShow"
        width="600px"
        :show-close="true"
       
      >
        <el-row>
          <el-form label-width="80px" :model="examineForm">
            <el-col>
              <p style="margin-top: -5px;font-weight: 700;font-size: 16px;" >合同编号</p>
            </el-col>
            <el-col>
              <el-form-item label="合同编号">
                <el-input v-model="examineForm.contractSn" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="客户名称">
                <el-input v-model="examineForm.companyName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="合同周期">
                <el-input
                  v-model="examineForm.contractCycle"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="支付方式">
                <el-input v-model="examineForm.paymentMode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-divider></el-divider>
            </el-col>
          </el-form>
          <el-form
            label-width="80px"
            :model="applyForm"
            :rules="rules"
            ref="applyForm"
          >
            <el-col>
              <p style="margin-top: -5px;font-weight: 700;font-size: 16px;">退租信息</p>
            </el-col>
            <el-col>
              <el-form-item label="退租日期" prop="giveupDate">
                <el-date-picker
                  v-model="applyForm.giveupDate"
                  type="date"
                  :disabled="title == '查看结算单' || title == '退租审核'"
                  value-format="yyyy-MM-dd"
                  :class="[datepicker]"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="title == '申请'">
              <el-form-item label="退租位置" prop="roomIds">
                <el-select
                  multiple
                  placeholder="请选择退租位置"
                  v-model="applyForm.roomIds"
                  :disabled="title == '查看结算单' || title == '退租审核'"
                >
                  <el-option
                    v-for="(item, index) in roomList"
                    :key="index"
                    :label="item.roomFullName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-else>
              <el-form-item label="退租位置">
                <el-input
                  placeholder="请选择退租位置"
                  disabled
                  v-model="chooseRooms"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="退租原因" prop="reason">
                <el-input
                  v-model="applyForm.reason"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入退租原因"
                  :disabled="title == '查看结算单' || title == '退租审核'"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer" v-if="title == '申请'">
          <el-button type="primary" @click="rentSubmit()"
            >确定</el-button
          >
          <el-button plain @click="cancels()"
            >取消</el-button
          >
        </div>
        <div
          slot="footer"
         
          v-if="title == '退租审核'"
        >
          <el-button type="primary" @click="agree()"
            >同意</el-button
          >
          <el-button plain @click="refuse()"
            >拒绝</el-button
          >
        </div>
        <div
          slot="footer"
         
          v-if="title == '查看结算单'"
        >
          <el-button type="primary" @click="close()"
            >关闭</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/comPagination";
import Tabs from "@/components/commonTabs";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { initTabData, check, add, allow } from "@/api/smartProperty/rentrelase";
import { getControlTree } from "@/api/spaceManagement/controlManagement";
import ElForm from "../../../../node_modules/element-ui/packages/form/src/form.vue";

export default {
  name: "Rentrelease",
  components: {
    ElForm,
    pagination,
    Tabs
  },
  data() {
    return {
      permission: {
        search: "smartProperty::rentrelease::search",
        searchAllow: "smartProperty::rentrelease::searchAllow",
        check: "smartProperty::rentrelease::check",
        add: "smartProperty::rentrelease::add",
        searchCompany: "spaceManagement::contractManagement::searchCompany"
      },
      btnGroup: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "申请",
          value: "apply"
        },
        {
          label: "已审核",
          value: "audited"
        },
        {
          label: "已退租",
          value: "giveupCompleted"
        }
      ],
      giveupAll: [
        {
          label: "部分退租",
          value: false
        },
        {
          label: "整体退租",
          value: true
        }
      ],
      btnChoose: 0,
      formSearch: {
        contractSn: "",
        giveUpQueryType: "",
        giveupAllFlag: "",
        rentType: "",
        companyName: "",
        startDate: "",
        endDate: "",
        pageNum: 1,
        pageSize: 10
      },
      time: [],
      datepicker: "date-picker",
      total: 0,
      tableData: [],
      applyRentChooseDialogShow: false,
      applyRentDialogShow: false,
      chooseCompanyName: "",
      examineForm: {},
      title: "",
      companyList: [],
      companyArr: [],
      roomList: [],
      applyForm: {
        giveupDate: "",
        reason: "",
        roomIds: [],
        companyId: ""
      },
      chooseRooms: "",
      currentId: "",
      rules: {
        reason: [
          {
            required: true,
            message: "请输入退租原因",
            trigger: ["blur", "change"]
          }
        ],
        giveupDate: [
          {
            required: true,
            message: "请选择退租日期",
            trigger: ["blur", "change"]
          }
        ],
        roomIds: [
          {
            required: true,
            message: "请选择退租房间",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  mounted() {
    if(this.$route.params.value){
      this.formSearch.giveUpQueryType = this.$route.params.value;
      this.btnChoose = 3;
    }
    this.getTableData();
    this.getCompany();
  },
  methods: {
    agree() {
      let data = {
        id: this.currentId,
        pass: true
      };
      allow(data).then(res => {
        this.$message.success("审批通过");
        this.applyRentDialogShow = false;
        this.currentId = "";
        this.getTableData();
        this.cancels();
      });
    },
    refuse() {
      let data = {
        id: this.currentId,
        pass: false
      };
      allow(data).then(res => {
        this.getTableData();
        this.$message.success("拒绝审批");
        this.applyRentDialogShow = false;
        this.currentId = "";
        this.cancels();
        
      });
    },
    close() {
      this.cancels();
      this.applyRentDialogShow = false;
      this.getTableData();
    },
    filterPosition(data) {
      if (data.length > 0) {
        let str = [];
        let datas = data[0].substring(0, data[0].lastIndexOf("-") + 1);
        if (data) {
          data.map(res => {
            str.push(res.substring(res.lastIndexOf("-") + 1));
          });
        }
        str = str.join(";");
        return datas + str;
      } else {
        return "";
      }
    },
    searchContract() {
      let data = {
        companyId: this.chooseCompanyName
      };
      check(data).then(res => {
        this.applyRentDialogShow = true;
        this.applyRentChooseDialogShow = false;
        this.title = "申请";
        this.examineForm = res.data;
        this.examineForm.paymentMode = `押${
          res.data.paymentMode.split("-")[0]
        }付${res.data.paymentMode.split("-")[1]}`;
        this.examineForm.contractCycle =
          res.data.startDate + "~" + res.data.endDate;
        this.applyForm.companyId = res.data.companyId;
        this.applyForm.giveupDate = res.data.suggestGiveupDate;
        this.roomList = res.data.roomList;
        this.chooseCompanyName = "";
      });
    },
    timeChange() {
      if (!this.time) {
        this.time = [];
        this.getTableData();
      }
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
        pageSize: 1000,
        pageNum: 1
      };
      getControlTree(url, method, parmas).then(res => {
        this.companyList = [];
        this.companyArr = [];
        this.companyList = res.data.data;
        for (const item of this.companyList) {
          this.companyArr.push({
            value: item.companyName, //这里一定是value: '值'
            id: item.companyId
          });
        }
      });
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
        console.log(res,'res数据接口')
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    btnclick(e) {
      this.formSearch.giveUpQueryType = e.item.value;
      this.btnChoose = e.index;
      this.getTableData();
    },

    applyRent() {
      this.applyRentChooseDialogShow = true;
      //        申请退租请求
    },
    cancel() {
      this.chooseCompanyName = "";
      this.applyRentChooseDialogShow = false;
      this.applyRentDialogShow = false;
    },
    onExamine(data) {
      this.title = "退租审核";
      this.applyRentDialogShow = true;
      this.$nextTick(() => {
        this.examineForm.contractSn = data.contractSn;
        this.examineForm.companyName = data.companyName;
        this.examineForm.contractCycle =
          data.contractStartDate + "~" + data.contractEndDate;
        this.examineForm.paymentMode = data.paymentModeStr;
        this.applyForm.giveupDate = data.giveupDate;
        this.applyForm.reason = data.reason;
        this.chooseRooms = data.roomNames.join(";");
        this.applyForm.companyId = data.companyId;
        this.currentId = data.id;
      });
    },
    onrent() {
      this.applyRentChooseDialogShow = false;
      this.getTableData();
    },
    cancels() {
      this.applyForm = {
        giveupDate: "",
        reason: "",
        roomIds: "",
        companyId: ""
      };
      this.applyRentDialogShow = false;
      this.$refs.applyForm.resetFields();
    },
    rentSubmit() {
      this.$refs.applyForm.validate(valid => {
        if (valid) {
          let data = this.applyForm;
          add(data).then(res => {
            this.$message.success("提交申请成功");
            this.getTableData();
            this.cancels();
          });
        }
      });
    },
    //      查看结算单
    onStatement(data) {
      this.applyRentDialogShow = true;
      this.title = "查看结算单";
      this.applyRentDialogShow = true;
      this.$nextTick(() => {
        this.examineForm.contractSn = data.contractSn;
        this.examineForm.companyName = data.companyName;
        this.examineForm.contractCycle =
          data.contractStartDate + "~" + data.contractEndDate;
        this.examineForm.paymentMode = data.paymentModeStr;
        this.applyForm.giveupDate = data.giveupDate;
        this.applyForm.reason = data.reason;
        this.chooseRooms = data.roomNames.join(";");
        this.applyForm.companyId = data.companyId;
        this.currentId = data.id;
      });
    },
    onReset() {
      this.formSearch = {
        contractSn: "",
        giveupAllFlag: "",
        giveUpQueryType:this.formSearch.giveUpQueryType,
        rentType: "",
        companyName: "",
        startDate: "",
        endDate: "",
        pageNum: 1,
        pageSize:10,
      };
      this.time = [];
      this.getTableData();
    },

    handleCurrentChange() {
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
// ::v-deep .dialogs > .el-dialog__wrapper .el-dialog .el-dialog__body {
//   height: 52vh !important;
//   overflow: auto !important;
//   margin-bottom: 20px;
// }

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

.date-picker {
  width: 100%;
}
::v-deep.el-table.el-table--fit {
  overflow: hidden;
}
</style>
