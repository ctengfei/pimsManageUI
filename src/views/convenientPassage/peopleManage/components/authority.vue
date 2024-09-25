<template>
  <div>
    <div class="flex">
      <div class="btnGroups margin-bottom-20">
        <div
          class="btn"
          v-for="(item, index) in btnGroup"
          :key="index"
          :class="btnChoose == item.label ? 'divActive' : ''"
          @click="btnClick(item, index)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="operationbtn">
        <div @click="onBack" class="backtext">
          <svg aria-hidden="true" class="svg-icon">
            <use href="#icon-icon-goback" />
          </svg>
          <span>返回上一页</span>
        </div>
      </div>
    </div>
    <highlight-square class="highlight-height-table">
      <template v-slot:child>
        <!-- 表格数据 -->
        <div class="tab">
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="doorId"
            height="640"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              prop="stationNo"
              label="设备编号"
            ></el-table-column>
            <el-table-column prop="channelId" label="通道号"></el-table-column>
            <el-table-column prop="deviceIp" label="设备IP"></el-table-column>
            <el-table-column
              prop="doorName"
              label="房门名称"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="stationName" label="设备名称"></el-table-column>
            <el-table-column prop="status" label="门禁状态">
            <template slot-scope="scope">
              {{scope.row.status != "3"? scope.row.status == "1"? "关门": "开门": "控制器不在线"}}
            </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </highlight-square>
    <el-dialog
      :visible.sync="bindShow"
      width="60%"
      :title="title"
      :show-close="false"
     
    >
      <el-row>
        <el-form :model="bindForm">
          <el-col :span="12">
            <el-form-item label="截止时间">
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="bindForm.time"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-table
                height="520"
                ref="tables"
                row-key="doorId"
                :data="tableDatas"
                @selection-change="selectionChangeHandler"
              >
                <el-table-column
                  type="selection"
                  :reserve-selection="true"
                ></el-table-column>
                <el-table-column
                  label="房门名称"
                  show-overflow-tooltip
                  prop="doorName"
                ></el-table-column>
                <el-table-column
                  label="设备IP"
                  show-overflow-tooltip
                  prop="deviceIp"
                ></el-table-column>
                <el-table-column
                  label="设备名称"
                  show-overflow-tooltip
                  prop="deviceName"
                ></el-table-column>
                <el-table-column
                  label="通道号"
                  show-overflow-tooltip
                  prop="channelId"
                ></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col>
            <pagination
              v-show="tableDatas && tableDatas.length > 0"
              @pagination="handleCurrentChanges"
              :page.sync="forms.pageNum"
              :pageSizes="[10, 20, 30, 40]"
              :limit.sync="forms.pageSize"
              :total="nums"
            />
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: center; margin-top: 20px">
        <el-button plain @click="resetForm()"
          >取消</el-button
        >
        <el-button type="primary" @click="submitForm()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/comPagination";
import { getAccessControl, getBind } from "@/api/peopleManage/index.js";
// import { getBind } from "@/api/peopleManage/index2.js";

import { getObjByKey } from "@/utils/voice.js";
import $smartBuild from "@/api/smartBuild";

export default {
  components: {
    pagination,
  },
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {
          personName: "胡佳琪",
        };
      },
    },
  },
  data() {
    return {
      permission: {
        searchAuthority: "peopleManage::peopleBase::searchAuthority",
        bindAuthority: "peopleManage::peopleBase::bindAuthority",
        removeAuthority: "peopleManage::peopleBase::removeAuthority",
        searchDoor: "peopleManage::peopleBase::searchDoor",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pageNum: 1,
      pageSize: 10,
      pagination: 0,
      bindShow: false,
      title: "",
      selection: [],
      tableData: [],
      bindForm: {
        time: "",
        peopleselection: [],
      },
      btnGroup: [
        {
          value: "CARD",
          label: "卡片权限",
        },

        {
          value: "QRCODE",
          label: "二维码权限",
        },
        // {
        //   value: "FACE",
        //   label: "人脸权限",
        // },
      ],
      btnChoose: "卡片权限",
      tableDatas: [],
      roomnames: [],
      type: "CARD",
      forms: {
        pageNum: 1,
        pageSize: 10,
      },
      nums: 0,
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // scope.$index
    getDeviceStatus() {
      this.bindForm.peopleselection = [];
      let data = this.forms;
      $smartBuild.getdoorList(data).then((res) => {
        if (res.meta.status === 200) {
          if (res.data.data != null) {
            this.tableDatas = res.data.data;
            this.nums = res.data.total;
          } else {
            this.tableDatas = [];
          }
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    getTableData() {
      let rowdata = this.rowData;
      let obj = getObjByKey(this.permission.searchAuthority);
      let data = {
        identityId: rowdata.type == "STAFF" ? rowdata.userId : rowdata.personId,
        type: this.type,
      };
      getAccessControl(obj, data).then((res) => {
        if (res.meta.status === 200) {
          this.tableData = res.data;
          this.roomnames = [];
          this.tableData.forEach((item) => {
            this.roomnames.push({
              channelId: item.channelId,
              doorId: item.doorId,
              doorName: item.doorName,
            });
          });
          //
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },

    handleCurrentChange() {},
    handleCurrentChanges() {
      this.getDeviceStatus();
    },
    bind() {
      this.title = "权限绑定";
      this.bindShow = true;
      this.getDeviceStatus();
    },
    remove() {
      let rowData = this.rowData;
      let obj = getObjByKey(this.permission.removeAuthority);
      let doorids = [];
      this.selection.forEach((item) => {
        doorids.push(item.doorId);
      });
      let data = {
        doors: doorids,
        type: this.type,
        identityId: rowData.type == "STAFF" ? rowData.userId : rowData.personId,
      };
      getBind(obj, data).then((res) => {
        if (res.meta.status === 200 && res.data == "") {
          this.getTableData();
          this.resetForm();
          this.$message.success("权限解除成功");
        } else {
          this.$message.error(res.data);
        }
      });
    },
    btnClick(item) {
      this.btnChoose = item.label;
      this.type = item.value;
      this.getTableData();
    },

    handleSelectionChange(val) {
      this.selection = val;
    },
    selectionChangeHandler(val) {
      this.bindForm.peopleselection = val;
    },
    onBack() {
      this.$emit("authorityShow", true);
    },
    resetForm() {
      this.bindShow = false;
      this.bindForm.time = [];
      this.bindForm.peopleselection = [];
      this.$refs.tables.clearSelection();
    },
    submitForm() {
      let rowData = this.rowData;
      let obj = getObjByKey(this.permission.bindAuthority);
      let doorids = [];
      this.bindForm.peopleselection.forEach((item) => {
        doorids.push(item.doorId);
      });
      let data = {
        doors: doorids,
        type: this.type,
        identityId: rowData.type == "STAFF" ? rowData.userId : rowData.personId,
        expiryTime: this.bindForm.time,
      };
      if (data.expiryTime == "") {
        delete data.expiryTime;
      }
      getBind(obj, data).then((res) => {
        if (res.meta.status === 200 && res.data == "") {
          this.getTableData();
          this.resetForm();
          this.$message.success("权限绑定成功");
        } else {
          this.$message.error(res.data);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btnGroups {
  cursor: pointer;
  background-color: #313448;
  border-radius: 30px;
  width: 220px;
  height: 42px;
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
  & > div {
    display: inline-block;
  }
  .btn {
    width: 110px;
    height: 42px;
    border-radius: 30px;
    line-height: 42px;
    color: #afb9d0;
    font-size: 14px;
  }
  .divActive {
    background-color: #206aff;
    color: #fff;
  }
}

.flex {
  display: flex;
  justify-content: space-between;
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}

.backtext {
  display: inline-block;
  margin-left: 10px;
  span {
    color: #afb9d0;
    font-size: 14px;
  }
  cursor: pointer;
}
</style>
