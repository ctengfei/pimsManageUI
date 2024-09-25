<template>
  <div class="app-container">
    <div style="display:flex;align-items: center;justify-content: space-around;height: 150px;background-color:#fff;border-radius: 8px;">
      <div v-for="(item, index) in allWork" :key="index">
        <el-progress
          stroke-linecap="square"
          color="#206aff"
          type="circle"
          :percentage="setItemProgress(item) || 0"
          :format="setItemText(item)"
          :stroke-width="10"
          :width="80"
        ></el-progress>
        <p style="text-align: center;color: #666666">{{ item.label }}</p>
      </div>
    </div>
    <div class="workInfo">
      <el-form ref="formSearch" inline v-model="formSearch" v-if="showSearch">
        <el-form-item prop="workNumber" label="企业名称">
          <el-input
            placeholder="请输入企业名称"
            clearable
            v-model="formSearch.companyName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="businessName" label="合同编号">
          <el-input
            placeholder="请输入合同编号"
            clearable
            v-model="formSearch.serialNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="formSearch.time"
            type="daterange"
              @change="timeChange"
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
          <el-button
            @click="onSearch()"
            icon="el-icon-search"
            type="primary"
            >搜索</el-button
          >
          <el-button
            @click="onReset()"
            icon="el-icon-refresh"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              icon="el-icon-plus"
              type="primary"
              plain
              @click="createWork()"
            >
              录入
            </el-button>
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              @click="download()"
              >导出</el-button
            >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <div class="tableheight">
        <el-table :data="tableData">
          <el-table-column type="index" label="序号" />
          <el-table-column
            prop="companyName"
            width="200"
            label="企业名称"
            showOverflowTooltip
          />
          <el-table-column
            prop="address"
            label="位置区域"
            showOverflowTooltip
          />
          <el-table-column
            prop="serialNumber"
            width="200"
            label="合同编号"
            showOverflowTooltip
          />
          <el-table-column
            prop="area"
            label="面积(㎡)"
            width="140"
            showOverflowTooltip
          />
          <el-table-column
            prop="startDate,endDate"
            label="合同周期"
            width="180px"
            showOverflowTooltip
          >
            <template slot-scope="scope">
              {{ scope.row.startDate }}~{{ scope.row.endDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            showOverflowTooltip
          >
            <template slot-scope="scope">
              <div v-if="scope.row.status == 'INVALID'">
                已失效
              </div>
              <div v-if="scope.row.status == 'VALID'">
                <span style="color:#206aff">生效中</span>
              </div>
              <div v-if="scope.row.status == 'SIGNED'">
                <span style="color:#ff403d">待生效</span>
              </div>
                <div v-if="scope.row.status == 'UNAUDITED'">
                  <!-- 改这里审核字段 -->
                <span style="color:#ff403d">待审核</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="transactor"
            label="经办人"
            width="80"
            showOverflowTooltip
          />
          <el-table-column
            prop="createTime"
            label="操作时间"
            width="180px"
            showOverflowTooltip
          >
          </el-table-column>
          <el-table-column label="操作" align="left" width="140">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.status == 'INVALID'">
                  <el-button
                    @click="onDetail(scope.row.id)"
                    type="text"
                    
                    
                    >详情</el-button
                  >
                </div>
                <div v-if="scope.row.status == 'VALID'" class="flex">
                  <el-button
                    @click="onRenew(scope.row)"
                    type="text"
                    
                    
                    >续签</el-button
                  >
                  <el-button
                    @click="onChange(scope.row)"
                    type="text"
                    
                    
                    >变更</el-button
                  >
                  <el-button
                    @click="onDetail(scope.row.id)"
                    type="text"
                    
                    
                    >详情</el-button
                  >
                </div>
                <div class="flex" v-if="scope.row.status == 'SIGNED'">
                  <el-button
                    @click="onRemove(scope.row)"
                    type="text"
                    
                    
                    >撤销
                  </el-button>
                  <el-button
                    @click="onDetail(scope.row.id)"
                    type="text"
                    
                    
                    >详情</el-button
                  >
                </div>
                <div class="flex" v-if="scope.row.status == 'UNAUDITED'">
                  <el-button
                  v-show="isAdmin"
                    @click="onCheck(scope.row.id)"
                    type="text"
                    
                    >审核</el-button
                  >
                </div>
              </div>
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
      <!-- 分页 -->
    </div>
    <el-dialog
      :title="titledetail"
      :visible.sync="detailShow"
      width="600px">
      <Detail
        ref="editDtail"
        v-if="detailShow"
        :rowData="rowData"
        @detailVisibleShow="detailVisibleShow"
        :iscreate="iscreate"
        :ischeck="ischeck"
        @tableDataNew="tableDataNew"
      />
    </el-dialog>
    <el-dialog
      :title="titlerenew"
      :visible.sync="RenewShow"
      width="600px">
      <Renew
        ref="Renew"
        v-if="RenewShow"
        :rowData="rowData"
        @RenewVisibleShow="RenewVisibleShow"
        :renew="renew"
        @tableDataNew="tableDataNew"
      />
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/comPagination";
import Detail from "../../contractManagement/components/detail";
import Renew from "../../contractManagement/components/renew";
import { downloadFile } from "@/utils/index";
import treeTransfer from "el-tree-transfer";
import $contract from "@/api/spaceManagement/contractManagement.js";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import Tabs from "@/components/commonTabs";
export default {
  name:'InfoManagement',
  components: {
    pagination,
    // creatework,
    // workdetail,
    treeTransfer,
    Renew,
    Tabs,
    Detail
  },
  data() {
    let self = this;
    return {
      permission: {
        search: "spaceManagement::contractManagement::search",
        add: "spaceManagement::contractManagement::add",
        edit: "spaceManagement::contractManagement::add",
        detail: "spaceManagement::contractManagement::detail",
        remove: "spaceManagement::contractManagement::remove",
        contractDownLoad:
          "spaceManagement::contractManagement::contractDownLoad",
        tongji: "spaceManagement::contractManagement::tongji",
        // 审核
        examine:"spaceManagement::contractManagement::examine"
      },
      // 是否为录入合同
      iscreate: true,
      ischeck: false,
      showSearch:true,
      multipleArr:[],
      // 编辑
      detailEdit: false,
      //        转单派单拒绝dialog
      sendShow: false,
      //        评价dialog
      appraiseShow: false,
      //        主页展示
      workPageShow: true,
      //        创建工单组件展示
      createWorkShow: false,
      //        查看详情组件展示
      detailShow: false,
      titledetail:"合同录入",
      titlerenew:"合同续签",
      allWork: [
        {
          num: 50,
          label: "全部合同"
        },
        {
          num: 5,
          label: "待生效合同"
        },
        {
          num: 10,
          label: "生效合同"
        },
        {
          num: 25,
          label: "失效合同"
        },
        {
          num: 5,
          label: "到期提醒合同"
        }
      ],
      btnGroup: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "SIGNED",
          label: "待生效合同"
        },
        {
          value: "VALID",
          label: "生效合同"
        },
        {
          value: "INVALID",
          label: "失效合同"
        },
         {
          value: "UNAUDITED",
          label: "审核合同"
        }
      ],
      btnChoose: 0,
      formSearch: {
        time: [],
        pageNum: 1,
        pageSize: 10,
        companyName: "",
        endTime: "",
        serialNumber: "",
        startTime: "",
        status: ""
      },
      total: 6,
      tableData: [],
      //        转单or派单
      title: "",
      //        全部人员名单
      people: [
        {
          key: 1,
          label: "备选项1备选项1备选项1备选项1备选项1"
        },
        {
          key: 2,
          label: "备选项2"
        }
      ],
      sendWork: {
        //        选择人员名单
        workPeople: [],
        workNum: ""
      },
      appraise: {
        workNum: "",
        appraiseLevel: 0,
        appraiseContent: ""
      },
      // tableData每个row的值
      rowData: {},
      titles: ["源列表", "目标列表"],
      mode: "transfer", // transfer addressList
      fromData: [
      ],
      toData: [
      ],
      refuseshow: false,
      RenewShow: false,
      withParameters: false,
      isAdmin: false,
      renew: false
    };
  },

  mounted() {
    //let obj= getObjByKey(this.permission.examine)
    if('/pm/contract/audit'){
      this.isAdmin = true
    }else{
      this.isAdmin = false
    }
    // this.isAdmin = this.$store.state.user.user.admin;
    this.getAllWork();
    let formSearch = this.formSearch;
    this.getList(formSearch);
    if(this.$route.query.id){
        this.btnChoose = this.$route.query.value;
        this.formSearch.status = this.$route.query.id
        this.onSearch()
      }
  },
  methods: {
    timeChange() {
      if (!this.formSearch.time) {
        this.formSearch.time = [];
        this.getList(this.formSearch);
      }
    },
    // table多选
    multipleChange(val){
        let temp = val.map(item=>{
          return {alarmCode:item.code,closeReason:""}
        })
        this.multipleArr = temp
      },
    download() {
      //let obj = getObjByKey(this.permission.contractDownLoad);
      if (this.formSearch.time.length) {
        this.formSearch.startTime = this.formSearch.time[0];
        this.formSearch.endTime = this.formSearch.time[1];
      }

      let data = {
        startTime: this.formSearch.startTime,
        endTime: this.formSearch.endTime,
        pageNum: this.formSearch.pageNum,
        pageSize: this.formSearch.pageSize
      };
      if (data.startTime === "" || data.endTime === "") {
        this.$message.error("请选择需要导出合同的时间段");
      } else {
        $contract
          .downloadAll('/pm/contract/download', 'get', data)
          .then(res => {
            this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    // 获取全部数据
    getList(formSearch) {
       if (this.formSearch.time) {
        this.formSearch.startTime = this.formSearch.time[0];
        this.formSearch.endTime = this.formSearch.time[1];
      } else {
        this.formSearch.startTime = "";
        this.formSearch.endTime = "";
      }
      //let data = getObjByKey(this.permission.search);
      $contract.searchForm('/pm/contract/all', 'get', formSearch).then(res => {
        if (res.code === 200) {
          if (res.data.data) {
            this.tableData = res.data.data;
            this.formSearch.pageNum = res.data.pageNum;
            this.formSearch.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    // 详情和编辑
    detailVisibleShow(data) {
      this.workPageShow = data;
      this.detailShow = !data;
      this.titledetail = "合同编辑";
      this.getAllWork();
      this.getList(this.formSearch);
    },
    RenewVisibleShow(data) {
      this.workPageShow = data;
      this.RenewShow = !data;
      this.getAllWork();
      this.getList(this.formSearch);
    },
    setItemProgress(data) {
      return parseInt((data.num / this.allWork[0].num).toFixed(2) * 100);
    },
    setItemText(row) {
      return () => {
        return row.num.toFixed();
      };
    },
    getAllWork() {
      //let obj = getObjByKey(this.permission.tongji);
      $contract.searchForm('/pm/contract/statistics', 'get').then(res => {
        let datas = 0;
        res.data.forEach(item=>{
          if(item.label!=="到期提醒合同"){
            datas += item.num;
          }
        })
        this.allWork = res.data;
        this.allWork.unshift({
          num:datas,
          label:"全部合同"
        });
      });
    },
    btnclick(item, index) {
      this.formSearch.pageNum = 1;
      this.btnChoose = item.index;
      this.formSearch.status = item.item.value;
      this.getList(this.formSearch);
    },
    //      派单
    onSend(data) {
      this.title = "派单";
      this.sendShow = true;
      this.sendWork.workNum = data.workNum;
    },
    //      转派
    onReassignment(data) {
      this.title = "转单";
      this.sendShow = true;
      this.sendWork.workNum = data.workNum;
    },
    //      评价
    onAppraise(data) {
      this.appraiseShow = true;
      this.appraise.workNum = data.workNum;
    },
    //      撤销
    onRemove(id) {
      //let data = getObjByKey(this.permission.remove);
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
          $contract
            .removes('/pm/contract', 'put', id.serialNumber)
            .then(res => {
              if (res.code === 200) {
                this.$message.success("撤销成功");
                this.formSearch.status = "";
                // this.formSearch.pageNum=1
                this.formSearch.pageSize = 10;
                this.getList(this.formSearch);
                this.getAllWork();
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
    // 详情
    onDetail(data) {
      this.workPageShow = false;
      this.detailShow = true;
      this.titledetail = "合同详情";
      this.iscreate = false;
      this.ischeck = false;
      this.rowData = data;
    },
    onCheck(data) {
          this.allClosemessage = true
          this.workPageShow = false;
          this.iscreate = false;
          this.rowData = data;
          this.detailShow = true;
          this.titledetail = "合同审核";
          this.ischeck = true;
    },
    //      编辑
    onEdit(data) {
      this.workPageShow = false;
      this.createWorkShow = true;
      this.rowData = data;
      this.ischeck = false;
      this.titledetail = "合同编辑";
      this.rowData.toData = this.toData;
    },
    handleCurrentChange(val) {
      this.formSearch.pageNum = val.page;
      this.formSearch.pageSize = val.limit;
      this.onSearch(this.formSearch);
    },
    //      搜索
    onSearch(formSearch) {
      this.formSearch.startTime = this.formSearch.time[0];
      this.formSearch.endTime = this.formSearch.time[1];
      let searchForm = Object.assign({}, this.formSearch);
      delete searchForm.time;
      this.getList(searchForm);
    },
    //      创建工单
    createWork() {
      this.workPageShow = false;
      this.createWorkShow = true;
      this.detailShow = true;
      this.ischeck = false;
      this.rowData = {};
      this.iscreate = true;
    },
    onReset() {
      this.formSearch = {
        workNumber: "",
        businessName: "",
        workType: "",
        time: "",
        startTime: "",
        endTime: "",
        status:"",
        //status: this.formSearch.status ? this.formSearch.status : "",
        pageNum: 1,
        pageSize: 10
      };
      this.getList(this.formSearch);
    },
    workDetailVisibleShow(data) {
      this.workPageShow = data;
      this.createWorkShow = !data;
      this.workDetailShow = !data;
    },
    cancel() {
      if (this.sendShow) {
        this.sendShow = false;
        this.refuseshow = false;
        this.sendWork.workNum = "";
        this.sendWork.workPeople = [];
      } else if (this.appraiseShow) {
        this.appraiseShow = false;
        this.appraise.workNum = "";
        this.appraise.appraiseLevel = 0;
        this.appraise.appraiseContent = "";
      }
    },
    tableDataNew(data) {
      this.tableData = data;
    },
    onChange(data) {
      this.workPageShow = false;
      this.RenewShow = true;
      this.titlerenew = "合同变更";
      this.renew = false;
      this.rowData = data;
    },
    onRenew(data) {
      this.workPageShow = false;
      this.RenewShow = true;
      this.titlerenew = "合同续签";
      this.renew = true;
      this.rowData = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.transparent {
  background-color: transparent;
  padding: 0;
  overflow-y: scroll;
}

p {
  margin: 0;
  padding: 0;
}
.workInfo {
  border-radius: 8px;
  padding: 20px;
  padding-top:0px;
  height: calc(100vh - 300px);
}

.color {
  color: #206aff;
}

.chexiao {
  color: #ff403d;
}

::v-deep .el-transfer-panel {
  width: 300px;
  //background-color: #202230;
  .el-transfer-panel__header {
    background-color: transparent !important;
    .el-checkbox .el-checkbox__label {
      color: #ffffff !important;
    }
  }
  .el-transfer-panel__body {
    .el-checkbox .el-checkbox__label {
      color: #ffffff !important;
    }
  }
  .el-transfer-panel__filter .el-input__inner {
    width: 90%;
    margin-right: 20px;
  }
}

::v-deep .el-rate {
  padding-top: 5px;
}

::v-deep.el-progress--circle .el-progress__text,
.el-progress--dashboard .el-progress__text {
  font-size: 30px !important;
}

::v-deep.wl-transfer .el-tree {
  background-color: inherit;
}

::v-deep.wl-transfer .transfer-title {
  background-color: inherit;
  color: #fff;
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

::v-deep.el-pagination {
  margin-top: -25px;
}
</style>
<style scoped>


.flex {
  justify-content: flex-end;
}

::v-deep svg path:first-child {
  stroke: rgb(229, 233, 242);
}

.tableheight {
  height: calc(100vh - 450px);
}
</style>
