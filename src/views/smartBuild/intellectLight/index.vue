<!-- 智能照明 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
        <OrgizeTree
          ref="trees"
          :districtList="dominList"
          :isCheck="isCheck"
          :dominShow="dominShow"
          :permissionData="{}"
          @handleNodeDblclick="handleNodeDblclick"
          :draggable="draggable"
          :deviceType="nodeType"
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
        <el-form :inline="true" ref="serForm" :model="form" class="mt20">
          <el-form-item prop="name" label="关键字">
            <el-input
              v-model="form.name"
              placeholder="请输入关键字"
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
            <el-button
              :disabled="!chooseTable.length"
              @click="openBatchDialog()"
              type="primary"
              plain
              round
              >开灯
            </el-button>
            <el-button
              :disabled="!chooseTable.length"
              @click="closeBatchDia()"
              type="danger"
              plain
              round
              >关灯
            </el-button>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button
              type="primary"
              plain
              circle
              icon="el-icon-refresh"
              @click="refreshs"
            ></el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <div class="photoBox" v-if="tableData.length">
          <el-table
            :data="tableData"
            height="588px"
            @selection-change="SelectionChange"
            ref="multipleTable"
          >
            <el-table-column
              type="selection"
              width="55"
              :selectable="selectable"
            />
            <el-table-column
              label="序号"
              width="80"
              type="index"
            ></el-table-column>
            <el-table-column
              prop="deviceCode"
              label="设备编号"
              showOverflowTooltip
            ></el-table-column>
            <el-table-column prop="area" label="控制区域" showOverflowTooltip>
            </el-table-column>
            <el-table-column
              prop="deviceName"
              label="回路名称"
              showOverflowTooltip
            ></el-table-column>
            <el-table-column label="回路反馈" prop="">
              <template slot-scope="scope">
                <span
                  :class="filterFeedbacks(scope.row) ? 'reds' : 'greens'"
                ></span>
              </template>
            </el-table-column>
            <el-table-column label="设备操作" showOverflowTooltip>
              <template slot-scope="scope">
                <div class="lightSet">
                  <el-button
                    @click="openDialog(scope.row)"
                    type="primary"
                    >开灯
                  </el-button>
                  <el-button
                    @click="closeDia(scope.row)"
                    type="danger"
                    >关灯
                  </el-button>
                  <el-button @click="toDeviceDraw(scope.row)" type="primary">设备画像</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else style="text-align:center">
          <div
            class="el-table__empty-text"
            style="margin:0 auto;font-size:20px;"
          >
            暂无数据
          </div>
        </div>

        <!--分页 -->
        <div class="content-bottom" v-if="tableData.length > 0 && tableData">
          <pagination
            @pagination="handleCurrentChange"
            :page.sync="form.pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="form.pageSize"
            :total="total"
          />
        </div>
      </el-col>
    </el-row>
    <!-- 亮度设置 -->
    <el-dialog
      title="亮度调节"
      :visible.sync="lighting"
      width="800px"
      center>
      <div class="dialogLig">
        <img
          :src="require(`@/assets/images/smartBuild/zm1.png`)"
          :style="{ opacity: styleValue }"
        />
        <div class="block">
          <span class="demonstration">默认</span>
          <el-slider
            class="sliders"
            :min="1"
            v-model="lightingValue"
            :max="10"
            :format-tooltip="formatTooltip"
          ></el-slider>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="lightingSubmit">确定</el-button>
        <el-button plain @click="lighting = false">取消</el-button>
      </span>
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
  name:"IntellectLight",
  components: { sysTree, pagination, OrgizeTree, comCard },
  data() {
    return {
      lighting: false,
      lightingValue: 1,
      styleValue: 1,
      ruleForm: {
        pass: "",
        checkPass: "",
        age: "",
        switch: true
      },
      flag: false,
      dominList: [],
      draggable: true,
      districtList: [],
      tagNode: {},
      isCheck: "",
      nodeType: "lighting",
      isShow: true,
      dominShow: true,
      total: 0,
      form: {
        name: "",
        type: "LIGHTING",
        pageNum: 1,
        pageSize: 10,
        nodeId: "",
        code: ""
      },
      TypeArr: [{ value: 0, label: "不限" }, { value: 1, label: "名称" }],
      tableData: [],
      selectedIds: [],
      chooseTable: [],
      spanList: [
        {
          type: "icon_zmshebeizongshu",
          num: 0,
          name: "照明设备总数",
          path: require(`@/assets/icons/svgui/icon_zmshebeizongshu.svg`)
        },
        {
          type: "icon_zmshebeizhnegchang",
          num: 0,
          name: "照明设备正常",
          path: require(`@/assets/icons/svgui/icon_zmshebeizhnegchang.svg`)
        },
        {
          type: "icon_zmshebeiguzhang",
          num: 1,
          name: "照明设备故障",
          path: require(`@/assets/icons/svgui/icon_zmshebeiguzhang.svg`)
        }
      ]
    };
  },
  mounted() {
    this.getStatistics();
  },
  computed: {},
  methods: {
    toDeviceDraw(item){
      item.deviceId = item.id
      this.$router.push({name:"deviceDraw",query:item})
    },
    openBatchDialog() {
      let datas = [];
      let pointlist = this.chooseTable.map(item => {
        return item.pointRunDataList;
      });
      for (let i = 0; i < pointlist.length; i++) {
        for (let j = 0; j < pointlist[i].length; j++) {
          if (
            pointlist[i][j].pointType === "lighting_state" &&
            pointlist[i][j].dataValue === "false"
          ) {
            datas.push(pointlist[i]);
          }
        }
      }
      let ids = [];
      for (let i = 0; i < datas.length; i++) {
        for (let j = 0; j < datas[i].length; j++) {
          if (datas[i][j].pointType === "lighting_contr") {
            ids.push({
              id: datas[i][j].tagId,
              systemType: "LIGHTING",
              type: 0,
              value: true
            });
          }
        }
      }
      if (ids.length > 0) {
        let obj = {
          url: '/pm/ibms/device/control',
          method: 'POST'
        }
        $smartBuild.getDeviceControl(obj, ids).then(res => {
          this.$message.success("开启成功");
          this.$refs.multipleTable.clearSelection();
          this.getDeviceStatus(this.form);
        });
      } else {
        this.$message.error("请选择关闭状态的灯");
      }
    },
    closeBatchDia() {
      let datas = [];
      let pointlist = this.chooseTable.map(item => {
        return item.pointRunDataList;
      });
      for (let i = 0; i < pointlist.length; i++) {
        for (let j = 0; j < pointlist[i].length; j++) {
          if (
            pointlist[i][j].pointType === "lighting_state" &&
            pointlist[i][j].dataValue === "true"
          ) {
            datas.push(pointlist[i]);
          }
        }
      }
      let ids = [];
      for (let i = 0; i < datas.length; i++) {
        for (let j = 0; j < datas[i].length; j++) {
          if (datas[i][j].pointType === "lighting_contr") {
            ids.push({
              id: datas[i][j].tagId,
              systemType: "LIGHTING",
              type: 0,
              value: false
            });
          }
        }
      }
      if (ids.length > 0) {
        let obj = {
          url: '/pm/ibms/device/control',
          method: 'POST'
        }
        $smartBuild.getDeviceControl(obj, ids).then(res => {
          this.$message.success("关闭成功");
          this.$refs.multipleTable.clearSelection();
          this.getDeviceStatus(this.form);
        });
      } else {
        this.$message.error("请选择开启状态的灯");
      }
    },
    SelectionChange(val) {
      this.chooseTable = val;
    },
    treeId(data) {
      this.form.nodeId = data;
      this.getDeviceStatus(this.form);
    },
    filterFeedback(data) {
      let res = data.pointRunDataList.filter(item => {
        return item.pointType === "lighting_state";
      });
      if (res.length > 0) {
        var news = { status: !JSON.parse(res[0].dataValue), flag: false };
        return news;
      } else {
        var news = { status: false, flag: true };
        return news;
      }
    },
    selectable(row, index) {
      let res = row.pointRunDataList.filter(item => {
        return item.pointType === "lighting_state";
      });
      if (res.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    filterFeedbacks(data) {
      let res = data.pointRunDataList.filter(item => {
        return item.pointType === "lighting_state";
      });
      if (res.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    getStatistics() {
      let data = {
        type: "LIGHTING"
      };
      $smartBuild.getStatistics(data).then(res => {
        this.spanList[0].num = res.data.deviceNum;
        this.spanList[1].num = res.data.deviceNormalNum;
        this.spanList[2].num = res.data.deviceOffLineNum;
      });
    },
    // 获取设备状态
    getDeviceStatus(data) {
      $smartBuild.getDeviceStatus(data).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    initPageIntell() {},
    // card事件 routerClick
    routerClick(item) {},
    // 格式化亮度
    formatTooltip(val) {
      this.styleValue = val / 10;
      return val / 10;
    },
    // 亮度设置
    lightingSubmit() {
      this.lighting = false;
    },
    // table  开关
    switchLoop(data) {
      var obj = {};
      if (data.switchStatus == 1) {
        obj = { deviceCode: data.deviceCode, type: 1 };
      } else {
        obj = { deviceCode: data.deviceCode, type: 0 };
      }
      this.getLoopControl([obj]);
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
                  // channelId: res.data[0].channelId,
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
            this.$message.error(err);
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
      this.form.nodeId = data.id;
      this.form.pageNum = 1;
      this.getDeviceStatus(this.form);
    },
    // 开启
    openDialog(data) {
      let tagid = "";
      data.pointRunDataList.forEach(item => {
        if (item.pointType == "lighting_contr") {
          tagid = item.tagId;
        }
      });
      let obj = {
        url: '/pm/ibms/device/control',
        method: 'POST'
      }
      let datas = [];
      datas.push({
        id: tagid,
        systemType: "LIGHTING",
        type: 0,
        value: true
      });

      $smartBuild.getDeviceControl(obj, datas).then(res => {
        this.getDeviceStatus(this.form);
        this.$message.success("开启成功");
      });
    },
    // 关闭
    closeDia(data) {
      let tagid = "";
      data.pointRunDataList.forEach(item => {
        if (item.pointType == "lighting_contr") {
          tagid = item.tagId;
        }
      });
      let obj = {
        url: '/pm/ibms/device/control',
        method: 'POST'
      }
      let datas = [];
      datas.push({
        id: tagid,
        systemType: "LIGHTING",
        type: 0,
        value: false
      });
      $smartBuild.getDeviceControl(obj, datas).then(res => {
        this.getDeviceStatus(this.form);
        this.$message.success("关闭成功");
      });
    },
    // 搜索
    handleCurrentChange() {
      this.getDeviceStatus(this.form);
    },
    // 搜索
    search() {
      this.form.pageNum = 1;
      this.getDeviceStatus(this.form);
    },
    // 重置
    reset() {
      this.form.pageNum = 1;
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
  width: 80px !important;
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
  width: 70px;
  height: 27px;
  border-radius: 5px;
  background: #313448;
  cursor: pointer;
}

.bgSucc {
  background: #00e984;
  color: #000;
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
  height: calc(100vh - 350px);
  display: flex;
  overflow: auto;
  flex-direction: column;
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
  display: flex;
  justify-content: space-around;
  height: 350px;
  padding: 10px;
  width: 100%;
  background-color: #272937;
  border-radius: 8px;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
  .imgTitle {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
    border-right: solid 1px #363845;
    .gifs {
      display: flex;
      width: 100%;
      height: auto;
      img {
        width: 80%;
        margin: 0 auto;
      }
    }
  }
  .infomation {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
  }
}

.greens {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00e984;
}

.reds {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff403d;
}

.card-wrap {
  height: 100px;
}

.lightSet {
  display: flex;
  align-items: center;
  img {
    width: 20px;
    cursor: pointer;
    margin-left: 30px;
  }
}

.dialogLig {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  .block {
    width: 100%;
    display: flex;
    align-items: center;
    height: 50px;
    .demonstration {
      width: 30px;
      margin-right: 20px;
    }
    .sliders {
      width: 79%;
    }
  }
  img {
    width: 30%;
  }
}
</style>
