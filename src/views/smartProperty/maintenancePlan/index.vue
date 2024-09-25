<!--
 * @Descripttion: 
 * @version: 
 * @Author: HJQ
 * @Date: 2021-11-23 14:18:01
 * @LastEditors: renjianwu jwrenx@isstech.com
 * @LastEditTime: 2023-01-16 16:43:04
-->
<template>
  <div class="app-container">
    <div style="height:100%">
      <el-form inline ref="formSearch" :model="formSearch">
        <el-form-item prop="deviceType" label="设备类型">
          <el-select
            v-model="formSearch.deviceType"
            placeholder="请选择设备类型"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(item, index) in deviceTypes"
              :label="item.name"
              :value="item.type"
              :key="index"
            >
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
           @click="openDialog()"
          >创建维保计划</el-button>
        </el-col>
      </el-row>
      <div style="height:calc(100% - 120px)">
        <el-table :data="tableData">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
            prop="deviceType"
            label="设备类型"
            showOverflowTooltip
          >
            <template slot-scope="scope">
              {{ filterDevices(scope.row.deviceType) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="维保项目内容"
            showOverflowTooltip
          ></el-table-column>
          <el-table-column
            prop="headerUserRealName"
            label="维保负责人"
          ></el-table-column>
          <el-table-column
            prop="headerUserPhone"
            label="联系方式"
          ></el-table-column>
          <el-table-column
            prop="frequency"
            label="维保频次"
            showOverflowTooltip
          >
            <template slot-scope="scope">
              {{ filterfrequency(scope.row.frequency) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="openDialog(scope.row)"
                type="text"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                @click="onDelete(scope.row)"
                type="text"
                icon="el-icon-delete"
                >删除</el-button
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
    <el-dialog
      :title="title == '新增' ? '创建维保计划' : '编辑维保计划'"
      width="600px"
      :show-close="true"
      :visible.sync="maintenancePlanShow"
      @closed="cancel('addform')"
    >
      <el-row>
        <el-form
          labelWidth="80px"
          :model="addForm"
          ref="addForm"
          :rules="rules"
        >
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
                <el-select
                  v-model="addForm.deviceType"
                  placeholder="请选择设备类型"
                  @change="searchDeviceTotal()"
                >
                  <el-option
                    v-for="(item, index) in deviceTypes"
                    :label="item.name"
                    :value="item.type"
                    :key="index"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="设备数量">
                <el-input v-model="deviceNum" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维保频次" prop="frequency">
                <el-select v-model="addForm.frequency">
                  <el-option
                    v-for="item in frequencies"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="headerUserId">
                <!-- <el-select
                  v-model="addForm.headerUserId"
                  placeholder="请选择负责人"
                >
                  <el-option
                    v-for="(item, index) in userInfo"
                    :key="index"
                    :value="item.id"
                    :label="item.value"
                  >
                  </el-option>
                </el-select> -->
                <div style="display: flex;justify-content: space-between;">
                  <p :style="[{color:addForm.headerUserRealName ? '#606266' : '#b4b6bb'},{margin: 0}]">{{ addForm.headerUserRealName ?addForm.headerUserRealName:'尚未选择负责人' }}</p>
                  <el-button type="primary" @click="addDialog" :disabled="addPersonDis">选择用户</el-button>
                </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="维保内容" prop="content">
                <el-input
                  type="textarea"
                  :row="2"
                  v-model="addForm.content"
                  placeholder="请输入维保内容"
                  auto-complete="off"
                ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="onsubmit">确定</el-button>
        <el-button plain @click="cancel('addForm')">取消</el-button>
      </div>
    </el-dialog>
     <!-- 选择负责人 -->
    <el-dialog
      :title="title1"
      :visible.sync="sendShow"
      width="850px"
     
      :before-close="cancel1"
    >
      <el-row :gutter="20">
          <el-col>
              <!-- <tree-transfer
                :title="titles"
                :from_data="fromData"
                :to_data="toData"
                :defaultProps="{ label: 'label', disabled: disabledFn }"
                @add-btn="add"
                @remove-btn="remove"
                @left-check-change="leftChange"
                :mode="mode"
                height="320px"
                filter
                openAll
              >
              </tree-transfer> -->
              
              <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/>
          </el-col>
      </el-row>
      <div slot="footer" style="text-align:right;">
        <el-button type="primary"  @click="onSubmit1()">确定</el-button>
        <el-button plain @click="cancel1()">取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/comPagination";
import {
  initTabData,
  getUser,
  getDeviceTotal,
  addPlan,
  editPlan,
  deletePlan,
  batchDelete,
  searchById
} from "@/api/smartProperty/maintenancePlan.js";
import { getUserinfos } from "@/api/smartProperty/workManagement";
import { initData, treeByIdData } from "@/api/facility/information";
import { getUser1 } from "@/api/system/user";
import ComDeptUser from "@/components/comDeptUser"
export default {
  name: "/maintenancePlan",
  components: {
    pagination,
    ComDeptUser
  },
  data() {
    return {
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        deviceType: ""
      },
      deviceTypes: [],
      time: [],
      tableData: [],
      total: 15,
      maintenancePlanShow: false,
      frequencies: [
        { label: "每周", value: "week" },
        { label: "每月", value: "month" },
        { label: "每季度", value: "season" },
        { label: "每年", value: "year" }
      ],
      addForm: {
        deviceType: "",
        content: "",
        frequency: "",
        headerUserId: "",
        headerUserRealName:''
      },
      spanIndex: [],
      rules: {
        deviceType: [
          {
            required: true,
            message: "请选择设备类型",
            trigger: ["blur", "change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请选择维保频次",
            trigger: ["blur", "change"]
          }
        ],
        headerUserId: [
          {
            required: true,
            message: "请选择负责人",
            trigger: ["blur", "change"]
          }
        ],
        content: [
          {
            required: true,
            message: "请输入维保内容",
            trigger: ["blur", "change"]
          }
        ]
      },
      userInfo: [],
      userInfoList: [],
      deviceNum: "",
      currentid: "",
      title: "",
      addPersonDis:false,
      personId: "",
      sendShow: false,
      title1:"添加人员",
    };
  },
  mounted() {
    this.getTableData();
    this.getType();
    // this.getUserInfo();
  },
  methods: {
    addDialog(){
      this.sendShow = true
        this.$refs.comDeptUsers.init()
        this.addPersonDis = false
    },
    // 获取人员id
    selectClick($e){
      console.log($e,'$e')
      this.personId = $e[0]
      this.addForm.headerUserId = $e[0]
    },
    // 添加人员
    onSubmit1() {
        console.log('6666666666666666')
        // if(this.personCharge.length>0){
        //   this.$message.error("列表中已有负责人，请勿添加");
        // }else{
        //   getUser(this.personId).then(res => {
        //     let data = {
        //       name: res.data.nickName,
        //       account: res.data.userName,
        //       groups: res.data.dept.deptName
        //     };
        //     this.personCharge.push(data)
        //     this.sendShow = false
        //     this.cancel();
        //   });
        // }
        getUser1(this.personId).then(res => {
            let data = {
              name: res.data.nickName,
              account: res.data.userName,
              groups: res.data.dept.deptName
            };
            console.log(data,'data')
            // this.personCharge.push(data)
            this.addForm.headerUserRealName = res.data.nickName
            this.sendShow = false
            // this.cancel();
          });
      },
      cancel1() {
        
        this.sendShow = false;
        // this.getUserInfo();
        // this.$refs.addForm.resetFields()
      },
    validatePeople(rule, value, callback) {
      if (this.usernames) {
        callback();
      } else {
        callback(new Error("请选择负责人"));
      }
    },
    getUserInfo() {
      let data = { pageNum: 1, pageSize: 100, code: "WB_WORK" };
      getUserinfos(data)
        .then(res => {
          
            this.userInfo = [];
            this.userInfoList = [];
            this.userInfoList = res.data.data[0].userInfos;
            for (const item of this.userInfoList) {
              this.userInfo.push({
                value: item.nickname,
                id: item.id.toString()
              });
            }
          
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /**
     * @description:
     * @param {*} data
     * @return {*}
     * @author: HJQ
     */

    filterDevices(data) {
      let devArr = this.deviceTypes.filter(item => {
        return item.type === data;
      });
      return devArr[0].name;
    },
    filterfrequency(data) {
      let devArr = this.frequencies.filter(item => {
        return item.value === data;
      });
      return devArr[0].label;
    },
    getType() {
      let obj = {url: "/pm/tree/type", method: "GET"};
      let parmas = {
        nodeType: "DIR"
      };
      initData(obj.url, obj.method, parmas).then(res => {
       
          this.deviceTypes = res.data;
        
      });
    },
    onSearch() {
      this.getTableData();
    },
    getTableData() {
      let obj = {url: "/maintenance/plan/page", method: "GET"};
      let data = this.formSearch;
      initTabData(obj.url, obj.method, data).then(res => {
        
          this.tableData = res.data.data;
          this.formSearch.pageSize = res.data.pageSize;
          this.formSearch.pageNum = res.data.pageNum;
          this.total = res.data.total;
        
      });
    },
    handleCurrentChange() {
      this.getTableData();
    },
    onReset(formName) {
      this.$refs[formName].resetFields();
      this.getTableData();
    },
    onEdit() {},
    onDelete(data) {
      this.$confirm(`确认删除这条维保计划吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          let obj = {url: "/maintenance/plan/{id}", method: "DELETE"};
          deletePlan(obj.url, obj.method, data.id).then(res => {
            
              this.$message.success("删除成功");
              this.getTableData();
            
          });
        })
    },
    searchDeviceTotal() {
      let obj = {url: "/maintenance/plan/device/count/{deviceType}", method: "GET"};
      getDeviceTotal(obj.url, obj.method, this.addForm.deviceType).then(res => {
        
          this.deviceNum = res.data;
        
      });
    },
    onsubmit() {
      let obj =
        this.title == "新增"
          ? {url: "/maintenance/plan", method: "POST"}
          : {url: "/maintenance/plan/{id}", method: "PUT"};
      let urls = "";
      if (this.title == "编辑") {
        urls = obj.url.split("{")[0] + this.currentid;
      }else{
        urls = obj.url + this.currentid;
      }
      let data = this.addForm;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addPlan(urls, obj.method, data).then(res => {
            
              if (this.title == "新增") {
                this.$message.success("添加成功");
              } else {
                this.$message.success("编辑成功");
              }

              this.cancel("addForm");
              this.getTableData();
            
          });
        }
        /**
         * @description:
         * @param {*}
         * @return {*}
         * @author: HJQ
         */
      });
    },
    openDialog(data = false) {
      this.title = !data ? "新增" : "编辑";
      if (data) {
        console.log(data,'data')
        this.$nextTick(() => {
          this.addForm.deviceType = data.deviceType;
          this.addForm.content = data.content;
          this.addForm.frequency = data.frequency;
          this.currentid = data.id;
          this.addForm.headerUserId = data.headerUserId;
          this.addForm.headerUserRealName = data.headerUserRealName;
          

          this.searchDeviceTotal();
        });
      }
      this.maintenancePlanShow = true;
    },
    cancel() {
      this.resetForm("addForm");
      // this.$refs[formName].resetFields();
    },

    resetForm(formName) {
      this.maintenancePlanShow = false;
      this.$refs[formName].resetFields();
      this.addForm = {
        deviceType: "",
        content: "",
        frequency: "",
        headerUserId: "",
        headerUserRealName:''
      };
      this.deviceNum = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form .el-select {
  width: 100%;
}

.el-date-editor.el-input__inner {
  width: 100%;
}

.colors {
  color: #206aff;
}
::v-deep .el-table.el-table--fit {
  overflow: hidden;
}
</style>
