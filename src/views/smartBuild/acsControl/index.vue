<!--
 * @LastEditors: renjianwu jwrenx@isstech.com
 * 暖风空调
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
        <OrgizeTree
          :districtList="dominList"
          :isCheck="isCheck"
          :dominShow="dominShow"
          :permissionData="{}"
          @handleNodeDblclick="handleNodeDblclick"
          @DragEnd="DragEnd"
          :draggable="draggable"
          :nodeType="nodeType"
          @treeId="treeId"
          @getTableData="getTableData"
        />
      </el-col>
      <el-col :xl="20" :lg="18" :sm="17" :xs="24">
        <comCard
          class="card-wrap"
          :spanList="spanList"
          @routerClick="routerClick($event)"
        ></comCard>
        <el-form
          :inline="true"
          ref="serForm"
          :model="form"
          class="mt20">
          <el-form-item prop="deviceName" label="门禁名称">
            <el-input
              v-model="form.deviceName"
              placeholder="请输入门禁名称"
              style="width: 200px"
              clearable
              @keyup.native.enter="search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              @click="search()"
              type="primary"
              >搜索
            </el-button>
            <el-button
              icon="el-icon-refresh-left"
              @click="reset()"
              plain
              >重置
            </el-button>
          </el-form-item>
          <el-form-item style="float: right;margin-right:0px;">
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh"
              @click="refreshs"
              circle
              >
            </el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <div class="photoBox" v-if="tableData.length && tableData">
          <el-row
            :gutter="15"
            style="overflow: auto;height: calc(100vh - 315px);"
          >
            <el-col
              :span="6"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="groups">
                <div class="imgTitle">
                  <div class="info">
                    <span style="cursor: pointer;" @click="toDeviceDraw(item)">{{ item.deviceName }}</span>
                    <span class="bgCond bgSucc" v-if="item.status == 'CLOSE' || item.status == 'OPEN'">在线</span>
                    <span class="bgCond bgErr" v-if="item.status == null || item.status == 'OFFLINE'">离线</span>
                  </div>
                  <div class="imgs">
                    <img
                      :src="
                        item.status == 'CLOSE' || item.status == 'OPEN'
                          ? require(`@/assets/images/smartBuild/openDoor.png`)
                          : require(`@/assets/images/smartBuild/closeDoor.png`)
                      "
                    />
                    <el-divider></el-divider>
                    <div class="down">
                      <el-button
                        type="primary"
                        @click="openDoor(item)"
                        >开门</el-button
                      >
                      <el-button
                        type="primary"
                        @click="passrecord(item)"
                        >通行记录</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="content-bottom" v-if="tableData.length && tableData">
            <pagination
              @pagination="handleCurrentChange"
              :page.sync="form.pageNum"
              :pageSizes="[8, 16, 32]"
              :limit.sync="form.pageSize"
              :total="total"
            />
          </div>
        </div>
        <div v-else style="text-align:center">
          <div class="el-table__empty-text"  style="margin:0 auto;font-size:20px;">暂无数据</div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="通行记录" :visible.sync="dialogVisible" width="800px">
      <el-table
        ref="multipleTable"
        :data="DoorTableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column
          prop="doorName"
          label="房门名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="employeeName"
          label="刷卡人名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="typeName"
          label="出开门/进开门"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="eventDate"
          label="刷卡时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="serial"
          label="刷卡卡号"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <pagination
        v-show="DoorTableData && DoorTableData.length > 0"
        @pagination="handleCurrentChanges"
        :page.sync="formSearch.pageNum"
        :pageSizes="[10, 20, 30, 40]"
        :limit.sync="formSearch.pageSize"
        :total="totals"
      />
      <div slot="footer">
        <el-button plain @click="cancel">关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
  name:"AcsControl",
  components: { sysTree, pagination, OrgizeTree, comCard },
  data() {
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        age: "",
        switch: true
      },
      current: {},
      dominList: [],
      draggable: true,
      districtList: [],
      tagNode: {},
      isCheck: "",
      nodeType: "entranceControl",
      isShow: true,
      dominShow: true,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      total: 0,
      totals: 0,
      form: {
        deviceName: "",
        treeNodeId: "",
        pageNum: 1,
        pageSize: 8
      },
      formSearch: {
        pageNum: 1,
        pageSize: 10
      },
      DoorTableData: [],
      dialogVisible: false,
      TypeArr: [{ value: 0, label: "不限" }, { value: 1, label: "名称" }],
      tableData: [],
      selectedIds: [],
      spanList: [
        {
          type: "icon_menjingzongshu",
          num: 0,
          name: "门禁总数",
          path: require(`@/assets/icons/svgui/icon_menjingzongshu.svg`)
        },
        {
          type: "icon_menjingon",
          num: 0,
          name: "门禁开启",
          path: require(`@/assets/icons/svgui/icon_menjingon.svg`)
        },
        {
          type: "icon_menjingclose",
          num: 0,
          name: "门禁关闭",
          path: require(`@/assets/icons/svgui/icon_menjingclose.svg`)
        },
        {
          type: "icon_menjingbaojing",
          num: 0,
          name: "门禁报警",
          path: require(`@/assets/icons/svgui/icon_menjingbaojing.svg`)
        },
        {
          type: "icon_menjinglixian",
          num: 0,
          name: "门禁离线",
          path: require(`@/assets/icons/svgui/icon_menjinglixian.svg`),
        }
      ]
    };
  },
  created() {},
  mounted() {
    // this.getDeviceStatus(this.form);
    this.getStatistics();
  },
  methods: {
    toDeviceDraw(item){
      item.deviceId = item.id
      this.$router.push({name:"deviceDraw",query:item})
    },
    treeId(data) {
      this.form.nodeId = data;
      this.getDeviceStatus(this.form);
    },
    cancel() {
      this.dialogVisible = false;
    },
    passrecord(item) {
      this.current = item;
      this.dialogVisible = true;
      this.getpassrecord(this.current);
    },
    getpassrecord(item) {
      let data = {
        doorId: item.doorId,
        pageNum: this.formSearch.pageNum,
        pageSize: this.formSearch.pageSize
      };
      $smartBuild.getDoorRecord(data).then(res => {
        this.DoorTableData = res.data.data;
        this.totals = res.data.total;
      });
    },
    handleCurrentChanges(n) {
      this.formSearch.pageNum = n.page;
      this.formSearch.pageSize = n.limit;
      this.getpassrecord(this.current);
    },
    openDoor(data) {
      let datas = {
        channelId: data.channelId,
        controlStatus: "OPEN",
        stationNo: data.stationNo
      };
      $smartBuild.openDoor(datas).then(res => {
        this.$message.success("开门成功");
      });
    },
    closeDoor(data) {
      let datas = {
        channelId: data.channelId,
        controlStatus: "CLOSE",
        stationNo: data.stationNo
      };
      $smartBuild.openDoor(datas).then(res => {
        this.$message.success("关门成功");
      });
    },
    getStatistics() {
      $smartBuild.getDoorNum().then(res => {
        this.spanList[0].num = res.data.total;
        this.spanList[1].num = res.data.open;
        this.spanList[2].num = res.data.close;
        this.spanList[3].num = res.data.alarm;
        this.spanList[4].num = res.data.offline;
      });
    },
    // card事件 routerClick
    routerClick(item) {
      console.log(item);
    },
    // 获取设备状态
    getDeviceStatus(data) {
      $smartBuild.getdoorList(data).then(res => {
        if (res.data.data == null) {
          this.tableData = [];
          this.total = 0;
        } else {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    //  获取设备信息
    getDeviceData(data) {
      if (!data.children) {
        if (!data.code) {
          if (this.isType === "click") {
            let tempObj = [
              {
                deviceId: data.id,
                deviceName: data.name
              }
            ];
            this.handleleftClick(tempObj);
          } else if (this.isType === "dbClick") {
            const player = {
              deviceId: data.deviceId,
              deviceName: data.name
            };
            this.goVideoControl(player);
          }
          return;
        }
        getDeviceInfoById(data.code)
          .then(res => {
            if (this.isType === "click") {
              this.handleleftClick(res.data);
            } else if (this.isType === "dbClick") {
              if (res.data[0]) {
                const player = {
                  deviceId: res.data[0].deviceId,
                  deviceName: res.data[0].name,
                  protocol: res.data[0].protocol
                };
                this.goVideoControl(player);
              }
            } else if (this.isType === "drag") {
              this.players[this.dragIndex].deviceId = res.data[0].deviceId;
              this.players[this.dragIndex].deviceName = res.data[0].name;
              this.players[this.dragIndex].protocol = res.data[0].protocol;
            } else {
              this.$message.error("获取设备信息失败");
            }
          })
          .catch(err => {
            console.log(err, "err");
          });
      }
    },
    // 左侧设备树双击
    handleNodeDblclick(data) {
      this.isType = "dbClick";
      this.getDeviceData(data);
    },
    // 左侧设备树拖拽
    DragEnd(node, prenode, pis, evt) {
      this.clientX = evt.clientX;
      this.clientY = evt.clientY;
      this.isType = "drag";
      for (let i = 0; i < this.distance.length; i++) {
        if (
          this.clientX > this.distance[i].toLeft &&
          this.clientX < this.distance[i].toRight &&
          (this.clientY + this.scrollTop > this.distance[i].toTop &&
            this.clientY + this.scrollTop < this.distance[i].toBottom)
        ) {
          // 调用接口获取视频流
          this.dragIndex = i;
          this.getDeviceData(node.data);
        }
      }
    },
    //  点击左侧通道树
    handleleftClick(data) {
      const res = data[0];
      if (res) {
        let params = {
          mounted: true,
          blurryType: "DEVICE_TREE",
          nodeId: data.deviceId,
          type: this.nodeType
        };
        getDeviceCriteria('/pm/device/criteria', 'GET', params).then(rs => {
          this.getIvsPlayer(rs.data.data[0].code);
        });
      }
    },
    // 通道列表点击选择通道
    handleClickChannel(data, index) {
      const player = this.players[index];
      player.deviceId = data.deviceId;
      player.deviceName = data.name;
      player.protocol = data.protocol;
      this.workspaceDeviceCounts++;
    },
    getTableData(data, activeName) {
      this.tagNode = data;
      this.isType = "click";
      this.form.treeNodeId = data.id;
      this.getDeviceStatus(this.form);
    },
    handleCurrentChange() {
      this.getDeviceStatus(this.form);
    },

    // 开启
    openDialog() {},
    // 关闭
    closeDia() {},
    // 搜索
    search() {
      this.getDeviceStatus(this.form);
    },
    // 重置
    reset() {
      this.$refs["serForm"].resetFields();
      this.getDeviceStatus(this.form);
    },
    // 刷新
    refreshs() {
      this.getDeviceStatus(this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
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

.margin0 {
  margin-bottom: 5px;
  text-align: center;
}

.bgCond {
  display: inline-block;
  border-radius: 5px;
  font-size: 14px;
  padding: 0 6px;
  background: #313448;
  cursor: pointer;
  color: #ffffff;
}

.bgSucc {
  background: #00e984;
}
.bgErr {
  background-color: #ff403d;
}

.el-form-item .app-container {
  background-color: transparent;
}

.top-card {
  width: 100%;
  display: flex;
  align-items: center;
  margin-left: 0px !important;
  justify-content: space-between;
  .total {
    border-radius: 5px;
    background-color: #202230;
    margin-right: 6%;
    height: 100px;
  }
  .off-line {
    border-radius: 5px;
    background-color: #202230;
    margin-right: 6%;
    height: 100px;
  }
  .normal {
    border-radius: 5px;
    background-color: #202230;
    margin-right: 6%;
    height: 100px;
  }
  .exception {
    border-radius: 5px;
    background-color: #202230;
    margin-right: 0%;
    height: 100px;
  }
}

.table-padding {
  padding: 0px 20px 0px 20px;
}

.photoBox {
  width: 100%;
  height: calc(100vh - 265px);
  padding: 0 20px;
  overflow: auto;
}

.content-Text {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  float: left;
}

.rightSpan {
  float: right;
  margin-top: 16px;
  width: 40%;
  height: 75px;
  color: rgba(0, 0, 0, 0.16);
  opacity: 0.8;
}

.groups {
  overflow: auto;
  display: flex;
  justify-content: space-between;
  // height: 315px;
  padding: 10px 20px 15px 20px;
  //background-color: #272937;
  border-radius: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;

  .imgTitle {
    color: #afb9d0;
    width: 100%;
    .info {
      text-align: center;
      border-bottom: 1px solid rgba(98, 103, 133, 0.21);
      span {
        display: inline-block;
        margin: 0 0 5px 0;
      }
    }
    .imgs {
      display: block;
      margin-top: 20px;
      text-align: center;
      .down {
        display: block;
      }
    }
  }
}

.forms {
  padding: 20px 20px 0 20px;
}

::v-deep .el-divider--horizontal {
  opacity: 0.1;
  margin: 13px 0 !important;
}

.pagination-container {
  margin-top: 0px;
}
 ::v-deep .heights > .el-dialog__wrapper .el-dialog .el-dialog__body {
    height: 60vh !important;
    overflow: auto !important;
    margin-bottom:20px;
  }
</style>
