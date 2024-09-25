<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="addRules"
          >添加提醒规则</el-button>
        </el-col>
      </el-row>
    <div style="margin-top: 10px">
      <el-table :data="tableData" style="width: 100%" height="640">
        <el-table-column prop="level" label="优先级" showOverflowTooltip>
          <template slot-scope="scope">
            <span>
              {{
                scope.row.level == "normal"
                  ? "普通"
                  : scope.row.level == "emergency"
                  ? "紧急"
                  : "非常紧急"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="workOrderStatus"
          label="提醒条件"
          showOverflowTooltip
        >
          <template slot-scope="scope">
            {{ scope.row.workOrderStatus === "todo" ? "未分派" : "已分派" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="timeLimit"
          label="提醒时限"
          showOverflowTooltip
        ></el-table-column>
        <el-table-column
          prop="userRealName"
          label="通知用户"
          showOverflowTooltip
        ></el-table-column>
        <el-table-column prop="enabled" label="启用状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="onSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span>
              <el-button @click="onEdit(scope.row)" type="text"
                >编辑</el-button
              >
              <el-button
                @click="onDelete(scope.row.id)"
                type="text"
               
                style="color: #ff403d"
                >删除</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="addRuleShow"
      width="600px"
      :show-close="true"
      @closed="cancel('addform')"
    >
      <el-row>
        <el-form
          labelWidth="80px"
          :model="addData"
          ref="addform"
          :rules="remindrules"
        >
          <el-col>
            <el-form-item label="是否启用" prop="enabled">
              <el-radio v-model="addData.enabled" :label="true">启用</el-radio>
              <el-radio v-model="addData.enabled" :label="false">禁用</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="level">
              <el-select v-model="addData.level" placeholder="请选择优先级">
                <el-option
                  v-for="item in level"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提醒条件" prop="workOrderStatus">
              <el-select
                v-model="addData.workOrderStatus"
                placeholder="请选择提醒条件"
              >
                <el-option
                  v-for="item in workOrder"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知时限" prop="timeLimit">
              <el-input
                :change="check_num()"
                v-model="addData.timeLimit"
                placeholder="请输入通知时限(分钟)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            
          <el-form-item label="通知用户" prop="userId">
                <div style="display: flex;justify-content: space-between;">
                  <p :style="[{color:addData.userRealName ? '#606266' : '#b4b6bb'},{margin: 0}]">{{ addData.userRealName?addData.userRealName:'尚未选择用户'}}</p>
                  <el-button type="primary" @click="addDialog" :disabled="addPersonDis">选择用户</el-button>
                </div>
          </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="提醒描述" prop="description">
              <el-input
                v-model="addData.description"
                placeholder="请输入提醒描述"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="onSubmit()">确定
        </el-button>
        <el-button plain @click="cancel('addform')">取消
        </el-button>
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
import {
  searchRemind,
  addRemind,
  delRemind,
  editRemind,
} from "@/api/smartProperty/workManagement";
import { getUser } from "@/api/smartProperty/maintenancePlan.js";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { getUser1 } from "@/api/system/user";
import ComDeptUser from "@/components/comDeptUser"
export default {
  name: "WorkReminder",
  components: {
    ComDeptUser
  },
  data() {
    return {
      title: "",
      tableData: [],
      addRuleShow: false,
      addData: {
        enabled: true,
        level: "",
        timeLimit: "",
        userId: "",
        workOrderStatus: "",
        description: "",
        userRealName:''
      },
      workOrder: [
        {
          label: "已分派",
          value: "doing",
        },
        {
          label: "未分派",
          value: "todo",
        },
      ],
      level: [
        {
          label: "普通",
          value: "normal",
        },
        {
          label: "紧急",
          value: "emergency",
        },
        {
          label: "非常紧急",
          value: "veryEmergency",
        },
      ],
      permission: {
        add: "smartProperty::workReminder::add",
        del: "smartProperty::workReminder::del",
        edit: "smartProperty::workReminder::edit",
        search: "smartProperty::workReminder::search",
        user: "system::group::user",
      },
      remindrules: {
        level: [
          {
            required: true,
            message: "请选择优先级",
            trigger: ["blur", "change"],
          },
        ],
        workOrderStatus: [
          {
            required: true,
            message: "请选择工单状态",
            trigger: ["blur", "change"],
          },
        ],
        timeLimit: [
          {
            required: true,
            message: "请输入通知时限",
            trigger: ["blur", "change"],
          },
        ],
        userId: [
          {
            required: true,
            message: "请选择通知用户",
            trigger: ["blur", "change"],
          },
        ],
      },
      userInfo: [],
      userInfoList: [],
      addPersonDis:false,
      personId: "",
      sendShow: false,
      title1:"添加人员",
    };
  },

  mounted() {
    this.getTableData();
    // this.getUser();
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
      this.addData.userId = $e[0]
    },
    // 添加人员
    onSubmit1() {
        console.log('10000000000000000000000',this.personId)
        getUser1(this.personId).then(res => {
          console.log(res,'res崔')
            let data = {
              name: res.data.nickName,
              account: res.data.userName,
              groups: res.data.dept.deptName
            };
            console.log(data,'data')
            // this.personCharge.push(data)
            this.addData.userRealName = res.data.nickName
            this.sendShow = false
            // this.cancel();
          });
      },
      cancel1() {
        this.sendShow = false;
        // this.getUserInfo();
        // this.$refs.addForm.resetFields()
      },
    check_num() {
      var license_num = this.addData.timeLimit;
      if (typeof license_num == "string") {
        license_num = license_num.replace(/[^0-9]/g, ""); // 清除“数字”和“.”以外的字符
        if (license_num.indexOf(".") < 0 && license_num != "") {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          license_num = parseInt(license_num);
        }
        this.addData.timeLimit = license_num;
      }
    },
    getUser() {
      // let obj = getObjByKey(this.permission.user);
      let url = '/sys/user'
      let method = 'GET'
      let data = {
        pageNum: 1,
        pageSize: 99999,
      };
      getUser(url, method, data).then((res) => {
        this.userInfo = [];
        this.userInfoList = [];
        this.userInfoList = res.data.data;
        for (const item of this.userInfoList) {
          this.userInfo.push({
            value: item.nickname,
            id: item.id.toString(),
          });
        }
      });
    },
    getTableData() {
      // let obj = getObjByKey(this.permission.search);
      let url = '/property/workOrderNoticeConfig'
      let method = 'GET'
      searchRemind(url, method).then((res) => {
        this.tableData = res.data;
      });
    },
    onEdit(data) {
      console.log(data,'99999999999999999999999999999')
      this.title = "编辑";
      //解决数据是obj类型，赋值操作的时候把地址给共同绑定了
      this.$nextTick(() => {
        let copy = Object.assign({}, data);
        this.addData = copy;
      });

      this.addRuleShow = true;
    },
    onDelete(data) {
      // let obj = getObjByKey(this.permission.del);
      let url = '/property/workOrderNoticeConfig/'
      let method = 'DELETE'
      this.$confirm("此操作将永久移除该提醒条件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delRemind(url, method, data).then((res) => {
          this.$message("移除成功");
          this.getTableData();
        });
      });
    },
    addRules() {
      this.addRuleShow = true;
      this.title = "添加提醒规则";
      this.addData.userRealName = ''
    },
    onSwitch(data) {
      this.addData.userId = data.userId;
      this.addData.enabled = data.enabled;
      this.addData.timeLimit = data.timeLimit;
      this.addData.workOrderStatus = data.workOrderStatus;
      this.addData.description = data.description;
      this.addData.level = data.level;
      // let obj = getObjByKey(this.permission.edit);
      let url = '/property/workOrderNoticeConfig/'
      let method = 'PUT'
      editRemind(url, method, this.addData).then((res) => {
        if (this.addData.enabled) {
          this.$message.success("开启成功");
        } else {
          this.$message.success("关闭成功");
        }
        this.getTableData();
      });
    },
    onSubmit() {
      // let obj = this.title == "编辑"? getObjByKey(this.permission.edit): getObjByKey(this.permission.add);
      let obj = {}
      if(this.title == "编辑"){
        obj = {
          url : '/property/workOrderNoticeConfig/',
          method:'PUT'
        }
      }else {
        obj = {
          url : '/property/workOrderNoticeConfig',
          method:'POST'
        }
      }
      let data = this.addData;
      this.$refs["addform"].validate((valid) => {
        if (valid) {
          if (this.title == "编辑") {
            editRemind(obj.url, obj.method, data).then((res) => {
              this.$message.success("编辑成功");
              this.cancel("addform");
              this.getTableData();
            });
          } else {
            addRemind(obj.url, obj.method, data).then((res) => {
              this.$message.success("添加成功");
              this.cancel("addform");
              this.getTableData();
            });
          }
        }
      });
    },
    cancel(formName) {
      this.addRuleShow = false;
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
