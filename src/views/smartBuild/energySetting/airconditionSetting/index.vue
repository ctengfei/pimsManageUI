<!--
 * @LastEditors: renjianwu jwrenx@isstech.com
 * 车辆道闸
-->
<template>
  <div class="app-container-bow">
    <el-row :gutter="20">
    <el-col :xl="4" :lg="6" :sm="7" :xs="24">
    <div class="video-web-left-box">
      <HighlightSquare class="highlight-height-main padding-20">
        <template v-slot:child>
          <div class="addGroupBtn">
            <span>节能模式模式分类</span>
            <i class="el-icon-circle-plus" @click="addSort()"></i>
          </div>
          <div class="group-area">
            <div v-for="item in groups" :key="item.id">
              <div class="group-item-hover">
                <div class="group-item" @click="selectGroup(item)">
                  <div class="item-name ">{{ item.modelName }}</div>
                  <div class="controls">
                    <i class="el-icon-edit" @click.stop="editSort(item)"></i>
                    <i
                      class="el-icon-delete"
                      @click.stop="deleteSort(item)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </HighlightSquare>
    </div>
  </el-col>
  <el-col :xl="20" :lg="18" :sm="17" :xs="24">
    <div class="video-web-right-box-bottom">
      <img src="@/assets/images/arrow.png" alt="" />
      <span>工作日模式</span>
      <el-divider></el-divider>
      <p>
        周期计划：{{ currentdata.modelName }} {{ currentdata.startTime }}~{{
          currentdata.endTime
        }}
      </p>
      <p>启用状态：{{ currentdata.isOpen == "1" ? "开启" : "不开启" }}</p>
      <p>空调温度：{{ currentdata.id }}</p>
      <el-divider></el-divider>
      <el-form
        :inline="true"
        ref="serForm"
        :model="form"
        class="demo-form-inline"
      >
        <el-form-item prop="deviceName">
          <el-input
            v-model="form.deviceName"
            placeholder="请输入设备名称"
            style="width: 200px"
            clearable
            @keyup.native.enter="search"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="search()"
            >搜索
          </el-button>
          <el-button
            icon="el-icon-refresh-left"
            @click="reset()"
            >重置
          </el-button>
        </el-form-item>
        <el-form-item style="float: right;margin-right:0px;">
          <el-button @click="addDevice()" type="primary" plain
            >添加设备
          </el-button>
          <el-button
            @click="deleteDevice()"
            plain
            :disabled="!devices.length"
            >移除设备
          </el-button>
        </el-form-item>
      </el-form>
      <div style="height: calc(100vh - 450px)">
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChanges"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" width="80" type="index"></el-table-column>
        <el-table-column
          prop="deviceCode"
          label="设备编号"
          showOverflowTooltip
        ></el-table-column>
        <el-table-column
          prop="area"
          label="控制区域"
          showOverflowTooltip
        ></el-table-column>
        <el-table-column
          prop="deviceName"
          label="设备名称"
          showOverflowTooltip
        ></el-table-column>
      </el-table>
      <pagination
        v-if="tableData && tableData.length"
        @pagination="handleCurrentChanges"
        :page.sync="form.pageNum"
        :pageSizes="[10, 20, 30, 40]"
        :limit.sync="form.pageSize"
        :total="totals"
      />
    </div>
    </div>
    </el-col>
    </el-row>
    <el-dialog
     
      :title="title"
      :visible.sync="addSortDialogShow"
      width="25%"
    >
      <el-row>
        <el-form
          ref="addForm"
          :model="addForm"
          class="demo-form-inline"
          labelWidth="80px"
          :rules="rules"
        >
          <el-col>
            <el-form-item prop="modelName" label="模式名称">
              <el-input
                v-model.trim="addForm.modelName"
                placeholder="请输入模式名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="modelType" label="重复周期">
              <el-select
                v-model="addForm.modelType"
                placeholder="请选择重复周期"
              >
                <el-option
                  v-for="(item, index) in modelGroups"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="addForm.modelType == 3">
            <el-form-item label="时间设置" prop="modelDate">
              <el-date-picker
                style="width: 100%"
                v-model="formcustomDates"
                type="dates"
                value-format="yyyy-MM-dd"
                @change="choosedate()"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="modelTime" label="重复时间">
              <el-time-picker
              style="width:100%"
                is-range
                @change="test"
                format='HH:mm:ss'
                value-format="HH:mm:ss"
                v-model="value2"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
              <!-- <el-time-select
                style="float: left"
                @change="chooseTimes()"
                placeholder="起始时间"
                :clearable="false"
                v-model="addForm.startTime"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '23:00'
                }"
              >
              </el-time-select>
              <el-time-select
                :clearable="false"
                @change="chooseTimes()"
                style="float: right"
                placeholder="结束时间"
                v-model="addForm.endTime"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '23:00',
                  minTime: addForm.startTime
                }"
              >
              </el-time-select> -->
            </el-form-item>
          </el-col>
          <!-- <el-col>
            <el-form-item label="温度设置">
              <el-slider
                v-model="addForm.temperature"
                :min="15"
                :max="35"
                :marks="marks"
              >
              </el-slider>
            </el-form-item>
          </el-col> -->
          <el-col>
            <el-form-item label="是否启用">
              <el-switch
                v-model="addForm.isOpen"
                active-text="开启"
                inactive-text="关闭"
                :active-value="1"
                :inactive-value="0"
                active-color="#206aff"
                inactive-color="gray"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer" style="text-align:center;">
        <el-button @click="onSubmit()" type="primary"
          >添加</el-button
        >
        <el-button @click="cancel()" plain
          >取消</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
     
      title="添加设备"
      :visible.sync="addDeviceDialogShow"
      width="50%"
    >
      <div style="height: 650px;overflow: auto">
        <el-table
          ref="multipleTable"
          height="520"
          :data="controlTableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column label="设备名称" show-overflow-tooltip prop="name">
          </el-table-column>
          <el-table-column
            label="所属系统"
            show-overflow-tooltip
            prop="belongSubsystem"
          >
          </el-table-column>
          <el-table-column
            label="创建时间"
            show-overflow-tooltip
            prop="createTime"
          >
          </el-table-column>
          <el-table-column label="创建人" show-overflow-tooltip prop="creator">
          </el-table-column>
        </el-table>
        <pagination
          v-show="controlTableData && controlTableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="pageNum"
          :pageSizes="[10, 20, 30, 40]"
          :limit.sync="pageSize"
          :total="total"
        />
        <div slot="footer" style="text-align:center;">
          <el-button @click="addDevices()" type="primary"
            >添加</el-button
          >
          <el-button @click="cancelDevices()" plain
            >取消</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import HighlightSquare from "@/components/HighlightSquare";
import sysTree from "@/components/sysTree";
import pagination from "@/components/comPagination";
import OrgizeTree from "@/components/orgnizeTree";
import {
  treeData,
  getDeviceInfoById,
  getIvsPlayer,
  getDeviceCriteria
} from "@/api/system/organization";
import comCard from "@/components/comCard";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import $smartBuild from "@/api/smartBuild";

export default {
  name:'AirconditionSetting',
  components: { sysTree, HighlightSquare, pagination, OrgizeTree, comCard },
  data() {
    return {
      value2: ['00:00:00','23:59:59'],
      addDeviceDialogShow: false,
      ruleForm: {
        pass: "",
        checkPass: "",
        age: "",
        switch: true
      },
      rules: {
        modelName: [
          {
            required: true,
            message: "请输入模式名称",
            trigger: ["blur"]
          }
        ],
        isOpen: [{ required: true }],
        modelType: [
          {
            required: true,
            message: "请选择模式类型",
            trigger: ["blur"]
          }
        ],
        modelTime: [
          {
            required: true,
            validator: this.validatetime,
            trigger: ["blur"]
          }
        ],
        modelDate: [
          {
            required: true,
            validator: this.validatedate,
            trigger: ["blur"]
          }
        ]
      },
      // permission: {
      //   deviceTree: "monitor::splitscreen::deviceTree",
      //   deviceCriteria: "monitor::splitscreen::deviceCriteria",
      //   treeCheck: "tree::check",
      //   searchDevice: "smartBuild::intellectCondite::searchDevice",
      //   searchDeviceList: "facility::information::sysChild::searchDeviceList"
      // },
      dominList: [],
      totals: 0,
      draggable: true,
      districtList: [],
      tagNode: {},
      isCheck: "",
      nodeType: "airConditioning",
      isShow: true,
      dominShow: true,
      groups: [],
      controlTableData: [],
      formcustomDates: [],
      addForm: {
        customDates: [],
        deviceType: "airConditioning",
        endTime: "",
        id: "",
        isOpen: 0,
        modelName: "",
        modelType: "",
        startTime: ""
      },
      currentdata: {},
      total: 0,
      TypeArr: [{ value: 0, label: "不限" }, { value: 1, label: "名称" }],
      tableData: [],
      selectedIds: [],
      spanList: [],
      title: "",
      addSortDialogShow: false,
      modelGroups: [
        {
          label: "每天",
          value: 0
        },
        {
          label: "法定工作日",
          value: 1
        },
        {
          label: "法定节假日",
          value: 2
        },
        {
          label: "自定义",
          value: 3
        }
      ],
      form: {
        energyId: "",
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      marks: {
        15: "15°C",
        20: "20°C",
        30: "30°C"
      },
      addType: "add",
      first: true,
      deviceGroups: [],
      currentDeviceids: [],
      devices: [],
      pageNum: 1,
      pageSize: 10
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getDevices();
  },
  methods: {
    test(){
      this.addForm.startTime = this.value2[0];
      this.addForm.endTime = this.value2[1];
    },
    search() {
      this.getTableData(this.currentdata.id);
    },
    reset() {
      this.form.deviceName = "";
      this.getTableData(this.currentdata.id);
    },
    getDevices() {
      //let obj = getObjByKey(this.permission.searchDeviceList);
      let data = {
        type: "AIR_CONDITIONING",
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      $smartBuild.getStatistics(data).then(res => {
        if (res.code === 200) {
          this.controlTableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    getTableData(data) {
      this.form.energyId = data;
      $smartBuild.getlisettEnergy(this.form).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.data;
          this.totals = res.data.total;
        }
      });
    },
    chooseTimes() {
      if (this.addForm.startTime == "" || this.addForm.endTime == "") {
      } else {
        this.$refs["addForm"].clearValidate("modelTime");
      }
    },
    choosedate() {
      if (this.formcustomDates.length > 0) {
        this.$refs["addForm"].clearValidate("modelDate");
      }
    },
    validatetime(rule, value, callback) {
      if (this.addForm.startTime == "" || this.addForm.endTime == "") {
        callback(new Error("请选择重复时间"));
      } else {
        callback();
      }
    },
    validatedate(rule, value, callback) {
      if (this.formcustomDates.length > 0) {
        callback();
      } else {
        callback(new Error("请选择自定义时间"));
      }
    },
    addSort() {
      this.addSortDialogShow = true;
      this.title = "添加";
      this.addType = "add";
    },
    getList() {
      let data = {
        deviceType: "airConditioning"
      };
      $smartBuild.getlistEnergyConservationModel(data).then(res => {
        if (res.meta.status === 200) {
          this.groups = res.data;
          this.getTableData(this.groups[0].id);
          if (this.first) {
            this.currentdata = this.groups[0];
          }
          this.first = false;
        }
      });
    },
    deleteSort(data) {
      this.$confirm(`确认删除${data.modelName}这条模式分类吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        $smartBuild.getdeleteEnergy(data.id).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("移除成功");
            window.location.reload();
          } else {
            this.$message.error(res.meta.message);
          }
        });
      });
    },
    editSort(data) {
      this.$nextTick(() => {
        this.formcustomDates = data.customDates
          .map(item => {
            return item.dateStr;
          })
          .join(",")
          .split(",");
        let copy = Object.assign({}, data);
        this.addForm = copy;
        this.value2 = [copy.startTime,copy.endTime];
      });
      this.addSortDialogShow = true;
      this.title = "编辑";
      this.addType = "edit";
    },
    cancel() {
      this.addSortDialogShow = false;
      this.$refs["addForm"].clearValidate();
      this.addForm = {
        customDates: [],
        deviceType: "airConditioning",
        endTime: "",
        id: "",
        isOpen: 0,
        modelName: "",
        modelType: "",
        startTime: ""
      };
      this.value2 = ['00:00:00','23:59:59'];
      this.formcustomDates = [];
    },
    selectGroup(data) {
      this.currentdata = data;
      this.getTableData(this.currentdata.id);
    },
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let data = this.addForm;
          if (this.addType == "add") {
            delete data.id;
          }
          if (data.modelType != 3) {
            this.formcustomDates = [];
          } else {
            let currentDate = this.formcustomDates;
            data.customDates = [];
            for (let i = 0; i < currentDate.length; i++) {
              this.$set(data.customDates, i, { dateStr: currentDate[i] });
            }
          }
          $smartBuild.getcreateOrUpdate(this.addForm).then(res => {
            if (res.meta.status === 200) {
              if (this.addType == "add") {
                this.currentDeviceids = [];
                this.$message.success("添加成功");
              } else {
                this.$message.success("编辑成功");
              }
              this.$refs["addForm"].clearValidate();
              this.cancel();
              this.getList();
            } else {
              this.$message.error(res.meta.message);
            }
          });
        }
      });
    },
    addDevice() {
      this.addDeviceDialogShow = true;
    },
    deleteDevice() {
      this.$confirm(
        `确认从${this.currentdata.modelName}中移除这个设备吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        $smartBuild.getDeleteEnergyDevice(this.devices).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("移除成功");
            this.getTableData(this.currentdata.id);
          } else {
            this.$message.error(res.meta.message);
          }
        });
      });
    },
    handleCurrentChange() {
      this.getDevices();
    },
    handleCurrentChanges() {
      this.getList();
    },
    addDevices() {
      let data = {
        deviceIds: this.currentDeviceids,
        energyId: this.currentdata.id
      };
      $smartBuild.getCreateEnergyDevice(data).then(res => {
        if (res.meta.status === 200) {
          this.$message.success("添加成功");
          this.addDeviceDialogShow = false;
          this.$refs.multipleTable.clearSelection();
          this.getTableData(this.currentdata.id);
          this.getList();
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    cancelDevices() {
      this.addDeviceDialogShow = false;
      this.currentDeviceids = [];
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      let arrNew = val.map(item => {
        return item.id;
      });
      this.currentDeviceids = arrNew;
    },
    handleSelectionChanges(val) {
      let arrNew = val.map(item => {
        return item.energyDeviceId;
      });
      this.devices = arrNew;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-table__empty-text{
  padding-top: 120px;
}
::v-deep .el-switch__label {
  position: absolute;
  display: none;
  font-size: 14px !important;
  color: #fff !important;
}

::v-deep .el-switch__label * {
  font-size: 14px !important;
}

/*打开时文字位置设置*/
::v-deep .el-switch__label--right {
  z-index: 1;
  left: 0px; // 这里是重点
  top: 0.5px;
}

/*关闭时文字位置设置*/
::v-deep .el-switch__label--left {
  z-index: 1;
  right: 0px; // 这里是重点
  top: 0.5px;
}

/*显示文字*/
::v-deep .el-switch__label.is-active {
  display: block;
}

::v-deep .el-switch .el-switch__core {
  border-color: #00e984 !important;
  background-color: #00e984 !important;
}

::v-deep .el-switch.is-checked .el-switch__core {
  border-color: #206aff !important;
  background-color: #206aff !important;
}

::v-deep .el-switch__core {
  width: 60px !important;
  height: 22px;
  border: 2px solid #dcdfe6;
  border-radius: 13px;
}

// ::v-deep .el-switch {
//   width: 50%;
// }
::v-deep .el-form-item--small .el-form-item__label {
  line-height: 30px !important;
}

::v-deep .el-form-item--small .el-form-item__content {
  line-height: 30px !important;
}

::v-deep .el-select {
  width: 100%;
}

.video-web-right-box-bottom {
  height: 100%;
  margin-top: 0;
  padding: 20px;
  // span {
  //   color: #afb9d0;
  // }
  // p {
  //   color: #afb9d0;
  // }
}

::v-deep .el-divider--horizontal {
  opacity: 0.1;
}

.addGroupBtn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    94deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(128, 128, 128, 0.12) 100%
  );
  padding: 0 20px;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  height: 38px;
}

.addGroupBtn span {
  font-size: 14px;
  font-weight: bold;
  color: #666;
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}

::v-deep.el-select {
  width: 100%;
}

::v-deep.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 49%;
}
</style>
