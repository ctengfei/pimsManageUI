<template>
  <div class="app-container">
    <div v-if="tableShow">
      <div class="video-web-left-box">
        <div class="highlight-height-main">
          <template>
            <div class="video-web-left-area">
               <OrgizeTree
                :isCheck="isCheck"
                :permissionData="permissionData"
                @getTableData="getTableData" />
            </div>
          </template>
        </div>
      </div>
      <div class="video-web-right-box">
        <div class="screen">
          <div class="screen-picker">
            <el-form
              :inline="true"
              :model="formInline"
              class="demo-form-inline"
            >
              <el-form-item label="" @change="eliminateTime(v)">
                <el-date-picker
                  v-model="formInline.valueTime"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="stateInput"
                  clearable
                  placeholder="请选择计划状态"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
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
                  icon="el-icon-refresh-left"
                  @click="onReset()"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="screen-button">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="newlyAdded()"
              >新增</el-button
            >
            <el-button
              :disabled="checkdisabled"
              icon="el-icon-delete"
              @click="delet()"
              >删除</el-button
            >
          </div>
        </div>
        <div class="highlight-height-table padding-20">
            <!-- 表格 -->
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              height="640"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" />
              <el-table-column
                prop="deviceId"
                label="设备编号"
                show-overflow-tooltip
              />
              <el-table-column
                prop="deviceName"
                label="设备名称"
                show-overflow-tooltip
              />
              <el-table-column
                prop="startTime"
                label="开始时间"
                show-overflow-tooltip
              />
              <el-table-column
                prop="endTime"
                label="结束时间"
                show-overflow-tooltip
              />
              <el-table-column prop="creator" label="创建人员" width="120px" />
              <el-table-column prop="resolution" label="分辨率" width="70px" />
              <el-table-column
                prop="description"
                label="备注"
                show-overflow-tooltip
              />
              <el-table-column
                prop="operation"
                label="启用/暂停"
                width="90px"
              >
                <template slot-scope="scope">
                  <!-- <div v-if="scope.row.status === -1"> -->
                  <el-switch
                    v-model="scope.row.enable"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="scope.row.status !== -1"
                    @change="termination(scope.row)"
                  />
                  <!-- </div> -->
                </template>
              </el-table-column>

              <el-table-column prop="status" label="状态" width="80px">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 1" style="color: #18dca7"
                    >已完成</span
                  >
                  <span
                    v-else-if="scope.row.status === 0"
                    style="color: #206aff"
                    >进行中</span
                  >
                  <span
                    v-else-if="scope.row.status === -1"
                    style="color: #eeda5b"
                    >未开始</span
                  >
                    <span
                    v-else-if="scope.row.status === -2"
                    style="color: #f05656"
                    >失败</span
                  >
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === -1">
                    <el-button
                      type="text"
                      @click="editList(scope.row, scope.$index)"
                      >编 辑</el-button
                    >
                    <el-button
                      type="text"
                      @click="deleteList(scope.row)"
                      >删 除</el-button
                    >
                  </div>
                  <div v-else-if="scope.row.status == 1">
                    <el-button
                      type="text"
                      @click="lookList(scope.row)"
                      >查看录像</el-button
                    >
                    <el-button
                      type="text"
                      @click="download(scope.row, scope.$index)"
                      >下 载</el-button
                    >
                  </div>
                  <div v-else-if="scope.row.status == -2">
                    <el-button
                    type="text"
                      @click="deleteList(scope.row)"
                      >删 除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination
              v-show="tableData && tableData.length > 0"
              :page.sync="Interface.pageNum"
              :total="pagination"
              :limit.sync="Interface.pageSize"
              :pageSizes="[10, 20, 30, 40]"
              @pagination="handleCurrentChange"
            />
        </div>
      </div>
    </div>

    <el-dialog :title="titleText" :visible.sync="playerShow" width="40%">
      <el-table
        ref="multipleTable"
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
          show-overflow-tooltip
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="onPlay(scope.row)"
              >播 放</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button plain @click="playerShow = false">关闭</el-button>
      </span>
    </el-dialog>

    <PlsyVideo
      v-if="playerShows"
      :player-item="playerItem"
      :one-player-url="playerUrl"
      @goBack="goBack"
      :data="videoData"
    >
    </PlsyVideo>

    <!-- 新增、编辑弹框 -->
    <UpdatePlanVideo
      :equiment-code="equimentCode"
      ref="updatePlanVideo"
      :title-text="titleText"
      @children="children"
    />
    <!-- 下载弹框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="downloadDialogVisible"
      width="40%"
    >
      <el-table
        ref="multipleTable"
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
          show-overflow-tooltip
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="downloadList(scope.row)"
              >下 载</el-button
            >
            <el-button
              type="text"
              @click="deleteAbility(scope.row)"
              >删 除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button
          plain
          @click="downloadDialogVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from "@/utils/index.js";
import PlsyVideo from "@/views/videoMange/recordVideo/playVideo.vue";
import pagination from '@/components/comPagination'
import { treeData } from "@/api/system/organization";
import { reQueryTags } from "@/api/monitor/tagsManage";
import {
  reQueryCollect,
  reAddCollect,
  reUpdateCollect,
  reDeleteCollect,
} from "@/api/monitor/collect";
import { reCollectDevice, reQueryDeviceByCollect } from "@/api/mutiTree";
// import CommonTree from "@/components/commonTree";
// import CommonMark from "@/components/commonMark";
// import ComDialog from "@/components/comDialog";
// import SaveTree from "@/components/saveTree";
// import ConfirmDialog from "@/components/confirmDialog";
import {
  playRecordVideo,
  downloadMP4,
  deleteVideoList,
} from "@/api/videoMange/recordVideo";
import { downloadFile } from "@/utils";
import OrgizeTree from '@/components/orgnizeTree'
import {
  PlanQuery,
  PlanQuerytree,
  DeleteInterface,
  Stopit,
  PlanDeletion,
  TreesCreen,
  List,
} from "@/api/planningVideo/index.js";
import { Message } from "element-ui";
import UpdatePlanVideo from "./components/updatePlanVideo";
import { getObjByKey,getStringByKey } from "@/utils/voice.js";

export default {
  name: "PlanningVideo",
  components: {
    PlsyVideo,
    UpdatePlanVideo,
    OrgizeTree,
    pagination
  },
  data() {
    return {
      // 下载
      downloadDialogVisible: false,
      // 新树
      // dialogTitle: "收藏夹",
      // dialogWidth: "30%",
      // districtList: [],
      // tagOptions: [],
      // allTagsOptions: [], // 收藏tabs的数据
      nodekey: "id", // 树节点标识
      // collectCascaderOptions: [], // 搜索部分级联选择数据
      // favouriteList: [],
      tagNode: {},
      timer: null,
      confirmTitle: "",
      // tabs
      tabList: [
        { label: "组织树", name: "first" },
        { label: "收藏", name: "second" },
      ],
      prop: {
        // 树组件相关属性
        children: "children",
        label: "name",
        value: "id",
      },
      isCheck: "",
      isShow: true,
      treeValue: {
        id: "",
        pid: "",
        name: "",
        pname: "",
        PId: "",
      },
      type: "",
      // 标签页
      tableData: [],
      formInline: {
        valueTime: [],
      },
      stateInput: "",
      // 查询状态
      options: [
        {
          value: "1",
          label: "已完成",
        },
        {
          value: "-1",
          label: "未开始",
        },
        {
          value: "-2",
          label: "失败",
        },
        {
          value: "0",
          label: "进行中",
        },
      ],
      // 新增、编辑表单
      titleText: "",
      multipleSelections: [],
      dialogFormVisible: false,
      equimentCode: {},
      playerUrl: "", //  播放的url地址
      playerShow: false, // 控制播放器的展示
      playerShows: false, // 控制播放器的展示
      playerItem: "",
      tableShow: true,
      // 树数据
      treeData: [],
      nodeKey: "id",
      // 分页
      pagination: 0,
      // 其他
      id: "",
      treeTabelData: [],
      videoData: [],
      Interface: {
        pageNum: 1,
        pageSize: 10,
        endTime: "",
        startTime: "",
        status: "",
        deviceIds: [],
        DEVICE_ID: "",
        id: "",
        favoriteId: "",
      },
      // queryData: {
      //   id: '',
      //   name: '',
      //   state: '',
      //   deviceIds: null,
      //   treeNodes: null,
      //   treeNodeIds: null
      // },
      tableshow: true,
      tableList: [],
      videoId: "",
      titleText: "",
      statusTab: 0,
      permission: {
        download:'videoMange::planningVideo:download',
        search: "videoMange::planningVideo:search",
        add: "videoMange::planningVideo:add",
        deleteList: "videoMange::planningVideo:deleteList",
        enable: "videoMange::planningVideo:enable",
        edit: "videoMange::planningVideo:edit",
        deleteId: "videoMange::planningVideo:deleteId",
        recorddeleteId: "videoMange::recordVideo:deleteId",
        treeCheck: 'tree::check',
        tagCheck: 'tags::check',
        collectCheck: 'collecttag::check',
        devicebycollect: 'device::by::collecttag',
        historyrecord: 'monitor::cuisePlan::recordhistory',
        collectAdd: 'collectTag::add',
        collectEdit: 'collectTag::edit',
        collectDelete: 'collectTag::delete',
        collectDevice: 'collectTag::device',
        markUpate: 'mark::edit',
      },
      checkdisabled: true,
      defaultExpandedKeys: [],
      permissionData: {}
    };
  },
  created() {
    // 表格数据
    this.permissionData = this.permission
    this.getPagaData();
    // 树数据
    // this.getTreeData();
    // this.queryTags();
    // this.getCollectTreeData();
    this.isCheck = "";
  },
  watch: {
    "formInline.valueTime"(time) {
      if (time === null) {
        this.formInline.valueTime = [];
      }
    },
  },
  methods: {
    // 获取表格数据
    getPagaData() {
      this.Interface.url = getStringByKey(this.permission.search,'url'),
      this.Interface.method = getStringByKey(this.permission.search,'method')
      PlanQuery(this.Interface)
        .then((res) => {
          this.tableData = res.data.data;
          this.pagination = res.data.total;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 树筛选表格数据
    getTreePageData() {
      this.Interface.url = getStringByKey(this.permission.search,'url'),
      this.Interface.method = getStringByKey(this.permission.search,'method')
      PlanQuerytree(this.Interface)
        .then((res) => {
          this.tableData = res.data.data;
          this.pagination = res.data.total;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    getTableData(data, activeName) {
      this.tagNode = data;
      this.equimentCode = data;
      this.formInline.valueTime = [];
      this.stateInput = '';
      if (activeName === 'second') {
        this.Interface.favoriteId = data.id
        this.Interface.nodeId = '';
      } else {
        this.Interface.nodeId = data.id
        this.Interface.favoriteId = ''
      }
      if (data.children === null && data.code === null) {
        this.$message.error("此节点无可用设备，请重新选择！");
      } else if (data.type == "DEVICE") {
        this.Interface.deviceIds.push(data.code);
        this.Interface.id = data.id;
        this.getTreesCreen();
      } else {
        this.Interface.pageNum = 1;
        this.Interface.id = data.id;
        this.getTreesCreen();
      }
    },

    // 点击树节点获取录像信息
    getTreesCreen() {
      this.Interface.url = getStringByKey(this.permission.search,'url'),
      this.Interface.method = getStringByKey(this.permission.search,'method')
      TreesCreen(this.Interface)
        .then((res) => {
          this.videoReference = "1";
          this.tableData = res.data.data;
          this.pagination = res.data.total;
          res.data.data.map((item) => {
            this.Interface.deviceIds.push(item.deviceId);
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    getList() {
      List(this.videoId).then((res) => {
        this.tableList = res.data;
      });
    },
    // 勾选设备新增计划录像
    nodeCheck(node, data) {
      this.equimentCode = node;
      if (this.equimentCode.length > 0) {
        this.checkdisabled = false;
      } else {
        this.checkdisabled = true;
      }
    },
    handleSizeChange(val) {
      this.Interface.pageSize = val;
      if (this.Interface.deviceIds.length === 0) {
        this.getPagaData();
      } else {
        this.getTreePageData();
      }
    },
    // 获取点击分页页码
    handleCurrentChange(val) {
      console.log(val)
      // this.Interface.pageNum = val;
      // 分页数据
      if (this.Interface.deviceIds.length === 0) {
        this.getPagaData();
      } else {
        if (this.videoReference === "1") {
          this.getTreesCreen();
        } else {
          this.getTreePageData();
        }
      }
    },
    // 搜索
    onSearch() {
      this.Interface.pageNum = 1;
      this.videoReference = "";
      (this.Interface.endTime = parseTime(this.formInline.valueTime[1])),
        (this.Interface.startTime = parseTime(this.formInline.valueTime[0]));
      this.Interface.status = this.stateInput;
      if (this.Interface.deviceIds.length === 0) {
        this.getPagaData();
      } else {
        this.getTreePageData();
      }
    },
    // 重置
    onReset() {
      this.formInline.valueTime = [];
      this.stateInput = "";
      this.Interface.endTime = "";
      this.Interface.startTime = "";
      this.Interface.status = "";
      this.Interface.deviceIds = [];
      this.getPagaData();
    },
    // 点击复选框获取信息
    handleSelectionChange(val) {
      const arr = [];
      this.multipleSelections = [];
      val.map((item) => {
        arr.push(item.id);
      });
      this.multipleSelection = arr;
      if (this.multipleSelection.length > 0) {
        this.checkdisabled = false;
      } else {
        this.checkdisabled = true;
      }
    },
    // 批量删除
    delet() {
      if (this.multipleSelection) {
        //没有选择，直接点击删除按钮
        let url = getStringByKey(this.permission.deleteList,'url')
        let  method = getStringByKey(this.permission.deleteList,'method')
        PlanDeletion(url,method,this.multipleSelection)
          .then((res) => {
            if (res.meta.status === 200) {
              this.$message.success("删除成功");
              this.getPagaData();
            } else {
              this.$message.error(res.meta.message);
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      } else {
        this.$message.warning("请选择计划");
      }
    },
    // 新增按钮
    newlyAdded() {
      this.titleText = "新增计划录像";
      if (this.equimentCode === "" || this.equimentCode.type == "DEPT")
        return Message.error("请在树节点选择设备");
      this.$refs.updatePlanVideo.dialogFormVisible = true;
      this.$refs.updatePlanVideo.updateData("add", {});
    },
    //
    children(val) {
      if (val === false) {
        this.equimentCode = {};
      }
    },
    // 编辑
    editList(data) {
      this.titleText = "编辑计划录像";
      this.$refs.updatePlanVideo.dialogFormVisible = true;
      this.$refs.updatePlanVideo.updateData("edit", data);
    },
    // 查看
    lookList(data) {
      this.playerShow = true;
      this.titleText = "视频编号 " + data.deviceId;
      this.videoId = data.id;
      this.getList();
    },
    // 播放
    onPlay(data) {
      this.videoData = data;
      this.tableShow = false;
      this.playerShow = false;
      this.playerShows = true;
      // this.playerUrl = data.filePath;
      this.playerItem = data;
      console.log("视频地址===", this.playerUrl);
      this.playerUrl = playRecordVideo(data.filePath);
    },
    //下载
    download(data) {
      this.downloadDialogVisible = true;
      this.titleText = "视频编号 " + data.deviceId;
      this.videoId = data.id;
      this.getList();
    },
    // 录像下载
    downloadList(data) {
      const obj = {
        filePath: data.filePath,
      };
      let url = getStringByKey(this.permission.download,'url')
      let  method = getStringByKey(this.permission.download,'method')
      downloadMP4(url,method,obj).then((res) => {
        downloadFile(res, "录像数据", "mp4");
        this.$message.success("下载录像已完成！");
      });
    },
    // 删除
    deleteAbility(data) {
      const id = [data.id];
      this.$confirm(`您确定删除选中的录像? 删除后将无法恢复！`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let obj = getObjByKey(this.permission.recorddeleteId);
          let tempObj = JSON.parse(JSON.stringify(obj));
          tempObj.url = tempObj.url.replace("{id}", id);
          deleteVideoList(tempObj)
            .then((res) => {
              if (res.meta.status === 200) {
                this.$message.success("删除成功");
                this.getList();
              } else {
                this.$message.error(res.meta.message);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("删除失败！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 播放器页面返回
    goBack() {
      this.playerShows = false;
      this.playerShow = false;
      this.tableShow = true;
    },
    // 启用/暂停
    termination(data) {
      if (data.enable === 1) {
        const dat = {
          id: data.id,
          deviceId: data.deviceId,
          enable: 1,
        };
        let url = getStringByKey(this.permission.search,'url')
        let method = getStringByKey(this.permission.search,'method')
        Stopit(url,method,dat)
          .then((res) => {
            if (res.meta.status === 200) {
              this.$message.success("计划已启用！");
              this.getPagaData();
            } else {
              this.$message.error(res.meta.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("数据请求失败！");
          });
      } else {
        const dat = {
          id: data.id,
          deviceId: data.deviceId,
          enable: 0,
        };
        let url = getStringByKey(this.permission.search,'url')
        let method = getStringByKey(this.permission.search,'method')
        Stopit(url,method,dat)
          .then((res) => {
            if (res.meta.status === 200) {
              this.$message.success("计划已暂停！");
              this.getPagaData();
            } else {
              this.$message.error(res.meta.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("数据请求失败！");
          });
      }
    },
    // 删除
    deleteList(data) {
      const id = [data.id];
      this.$confirm(`您确定删除选中的录像? 删除后将无法恢复！`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
           let obj = getObjByKey(this.permission.deleteList);
          let tempObj = JSON.parse(JSON.stringify(obj));
          tempObj.id = id;
          DeleteInterface(tempObj)
            .then((res) => {
              if (res.meta.status === 200) {
                this.$message.success("删除成功");
                this.getPagaData();
              } else {
                this.$message.error(res.meta.message);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("删除失败！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container{
  .screen {
    display: flex;
    justify-content: space-between;
    .demo-form-inline {
      &.el-form--inline .el-form-item,
      &.el-form--inline .el-form-item__content {
        vertical-align: middle;
        .el-button {
          vertical-align: top;
        }
      }
    }
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
