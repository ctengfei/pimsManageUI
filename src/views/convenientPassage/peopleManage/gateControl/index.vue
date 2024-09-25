<!--
 * @LastEditors: renjianwu jwrenx@isstech.com
 * 暖风空调
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col
        :xl="4"
        :lg="6"
        :sm="7"
        :xs="24"
        style="background-color: #f5f7fa"
      >
        <div class="treeBox">
          <OrgizeTree
            :favourite="favourite"
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
            style="background-color: #f5f7fa"
          />
        </div>
      </el-col>
      <el-col :xl="20" :lg="18" :sm="17" :xs="24" style="">
        <el-form v-if="showSearch" :inline="true" ref="serForm" :model="form">
          <el-form-item prop="doorId" label="闸机编号">
            <el-input
              v-model="form.doorId"
              placeholder="请输入闸机编号"
              style="width: 200px"
              clearable
              @keyup.native.enter="search"
            ></el-input>
          </el-form-item>
          <el-form-item prop="deviceName" label="闸机名称">
            <el-input
              v-model="form.deviceName"
              placeholder="请输入门禁名称"
              style="width: 200px"
              clearable
              @keyup.native.enter="search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="search()" type="primary"
              >搜索
            </el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()" plain
              >重置
            </el-button>
          </el-form-item>
          <el-form-item style="float: right; margin-right: 0px">
            <el-button type="primary" @click="passrecord"
              >门禁控制记录</el-button
            >
            <!-- <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-refresh"
                            @click="refreshs"
                            circle
                            >
                        </el-button>
                    </el-tooltip> -->
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="search"
          ></right-toolbar>
        </el-row>
        <div class="photoBox">
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="doorId"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              prop="stationNo"
              label="控制器编号"
            ></el-table-column>
            <el-table-column prop="sn" label="产品序列号"></el-table-column>
            <el-table-column prop="doorId" label="闸机编号"></el-table-column>
            <el-table-column
              prop="doorName"
              label="闸机名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="doorArea" label="闸机位置"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="openDoor(scope.row)" type="text"
                  >打开</el-button
                >
                <!-- <el-button @click="closeDoor(scope.row)" type="text">关闭</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <div v-if="tableData.length && tableData">
            <pagination
              @pagination="handleCurrentChange"
              :page.sync="form.pageNum"
              :limit.sync="form.pageSize"
              :total="total"
            />
          </div>
        </div>
      </el-col>
    </el-row>
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
  getDeviceCriteria,
} from "@/api/system/organization";
import comCard from "@/components/comCard";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import * as $gateControl from "@/api/peopleManage/gateControl";

export default {
  name: "",
  components: { sysTree, pagination, OrgizeTree, comCard },
  data() {
    return {
      favourite: true,
      showSearch: true,
      dominList: [],
      draggable: true,
      districtList: [],
      tagNode: {},
      isCheck: "isCheck",
      nodeType: "entranceControl",
      isShow: true,
      dominShow: true,
      treeData: [],
      total: 0,
      form: {
        doorId: "",
        deviceName: "",
        treeNodeId: "",
        pageNum: 1,
        pageSize: 10,
      },
      formSearch: {
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      current: {},
    };
  },
  created() {},
  mounted() {
    this.getDeviceStatus(this.form);
  },
  methods: {
    toDeviceDraw(item) {
      item.deviceId = item.id;
      this.$router.push({ name: "deviceDraw", query: item });
    },
    treeId(data) {
      this.form.nodeId = data;
      this.getDeviceStatus(this.form);
    },
    openDoor(data) {
      let datas = {
        channelId: data.channelId,
        controlStatus: "OPEN",
        stationNo: data.stationNo,
      };
      $gateControl.openDoor(datas).then((res) => {
        this.$message.success("开门成功");
      });
    },
    closeDoor(data) {
      let datas = {
        channelId: data.channelId,
        controlStatus: "CLOSE",
        stationNo: data.stationNo,
      };
      $gateControl.openDoor(datas).then((res) => {
        this.$message.success("关门成功");
      });
    },
    // 获取设备状态
    getDeviceStatus(data) {
      $gateControl.getdoorList(data).then((res) => {
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
                deviceName: data.name,
              },
            ];
            this.handleleftClick(tempObj);
          } else if (this.isType === "dbClick") {
            const player = {
              deviceId: data.deviceId,
              deviceName: data.name,
            };
            this.goVideoControl(player);
          }
          return;
        }
        getDeviceInfoById(data.code)
          .then((res) => {
            if (this.isType === "click") {
              this.handleleftClick(res.data);
            } else if (this.isType === "dbClick") {
              if (res.data[0]) {
                const player = {
                  deviceId: res.data[0].deviceId,
                  deviceName: res.data[0].name,
                  protocol: res.data[0].protocol,
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
          .catch((err) => {
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
          this.clientY + this.scrollTop > this.distance[i].toTop &&
          this.clientY + this.scrollTop < this.distance[i].toBottom
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
          type: this.nodeType,
        };
        getDeviceCriteria("/pm/device/criteria", "GET", params).then((rs) => {
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
    //   闸机控制记录
    passrecord(item) {
      this.current = item;
      this.$router.push({ name: "ControlRecord" });
    },
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
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.treeBox {
  height: 800px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
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

.photoBox {
  width: 100%;
  height: 100%;
  padding: 0 20px;
}

.forms {
  padding: 20px 20px 0 20px;
}
</style>
  