<!--
 * @version:
 * @Author: xlshaod
 * @explain: 组织树，收藏组件
 * @Date: 2021-04-16 16:58:34
 * @LastEditTime: 2022-02-25 14:09:35
 * @LastEditors: HJQ
-->
<template>
  <div>
    <div>
      <CommonTree
        ref="commonTree"
        :tab-data="tabList"
        :favouriteList="favouriteList"
        :districtList="arrData"
        :props="prop"
        :node-key="nodekey"
        :draggable="draggable"
        :all-tags-options="allTagsOptions"
        :is-check="isCheck"
        :is-show="isShow"
        :dominShow="dominShow"
        :currentNodeKey="currentNodeKey"
        :defaultExpandedKeys="defaultExpandedKeys"
        :favourite="favourite"
        @changeSelect="changeSelect"
        @updateMark="updateMark"
        @switchTab="switchTab"
        @nodeCheck="nodeCheck"
        @updateFavourites="updateFavourites"
        @handleNodeClick="handleNodeClick"
        @handleNodeDblclick="handleNodeDblclick"
        @handleNodeDragEnd="handleDragEnd"
        @onFavouriteAdd="onAppend"
        @onFavouriteEdit="onEdit"
        @onFavouriteRemove="onRemove"
        @onFavouriteCancel="onRemove"
        @searchDeviceByTag="searchDeviceByTag"
        @searchDeviceByCollect="searchDeviceByCollect"
        @collection="collection"
        @createFile="createFile"
        @nodeChecks="nodeChecks"
        @delFile="delFile"
        style="background-color:#f5f7fa;"
      />
    </div>
    <!--标签对话框组件 -->
    <CommonMark ref="updateMark" :mark-list="tagOptions" :tag-node="tagNode">
    </CommonMark>
    <!-- 收藏夹组件 -->
    <ComDialog
      ref="saveDialog"
      :dialog-title="dialogTitle"
      :dialog-width="dialogWidth"
    >
      <SaveTree
        :data-tree="favouriteList"
        :tag-node="tagNode"
        @onAppend="onAppend"
        @onEdit="onEdit"
        @onRemove="onRemove"
        @onCancelSave="onRemove"
        @nodeClick="nodeClick"
      />
    </ComDialog>
    <!-- 收藏夹操作的对话框 -->
    <ConfirmDialog
      append-to-body
      ref="saveForm"
      :showClose="false"
      :dialog-title="confirmTitle"
      :dialog-width="dialogWidth"
      @onConfirm="onSaveConfirm"
      @onCancel="onSaveCancel"
    >
      <el-form :model="treeValue" label-width="100px">
        <el-form-item label="节点名称">
          <el-input v-model="treeValue.folderName"></el-input>
        </el-form-item>
      </el-form>
    </ConfirmDialog>
    <!-- 收藏设备对话框 -->
    <ConfirmDialog
      append-to-body
      ref="favouriteForm"
      :showClose="false"
      :dialog-title="favouriteTitle"
      :dialog-width="dialogWidth"
      @onConfirm="onFavouriteSumbit"
      @onCancel="onFavouriteCancel"
    >
      <el-form :model="favouriteForm" label-width="100px">
        <el-form-item label="节点名称">
          <el-select
            v-model="favouriteForm.folderId"
            placeholder="请选择收藏文件夹"
            style="width: 100%"
          >
            <el-option
              v-for="item in favouriteList"
              :key="item.id"
              :label="item.folderName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ConfirmDialog>
    <!-- 删除文件夹的弹窗 -->
    <ConfirmDialog
      append-to-body
      ref="favouriteForm1"
      :showClose="false"
      :dialog-title="favouriteTitle"
      :dialog-width="dialogWidth"
      @onConfirm="delFileSumbit"
      @onCancel="delFileCancel"
    >
      <el-form :model="favouriteForm1" label-width="100px">
        <el-form-item label="节点名称">
          <el-select
            v-model="favouriteForm1.folderId"
            placeholder="请选择要删除的文件夹"
            style="width: 100%"
          >
            <el-option
              v-for="item in favouriteList"
              :key="item.id"
              :label="item.folderName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </div>
</template>
<script>
import {
  reQueryCollect,
  reAddCollect,
  reUpdateCollect,
  reDeleteCollect,
  reQueryCollectList,
} from "@/api/monitor/collect";
import {
  getCruiseRecordVideo,
  getDeviceListByTree,
  getDeviceList,
} from "@/api/monitor/timemonitor";
import {
  reCollectDevice,
  delFileApi,
  reQueryDeviceByCollect,
} from "@/api/mutiTree";
import CommonTree from "../commonTree";
import { treeData } from "@/api/system/organization";
import $favoFolder from "@/api/favoFolder";
import CommonMark from "../commonMark";
import ComDialog from "../comDialog";
import ConfirmDialog from "../confirmDialog";
import SaveTree from "../saveTree";
import { getAllCruiseList } from "@/api/monitor/cruiseplan";
import { deepClone } from "@/utils/index.js";
export default {
  components: {
    CommonTree,
    CommonMark,
    ComDialog,
    ConfirmDialog,
    SaveTree,
  },
  props: {
    queryParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    draggable: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    dominShow: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    isCheck: {
      type: String,
      default: "",
    },
    nodeType: {
      type: String,
      default: "",
    },
    accessPartyCode: {
      type: String,
      default: "",
    },
    saveData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    groupData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    districtList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    hasDevice: {
      type: Boolean,
      default: false,
    },
    deviceType: {
      type: String,
      default: "",
    },
    currentNodeKey: {
      type: String,
      default: "",
    },
    // 收藏夹按钮
    favourite: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogTitle: "收藏夹",
      dialogWidth: "30%",
      isShow: true,
      tagOptions: [],
      allTagsOptions: [],
      favouriteList: [],
      defaultExpandedKeys: [],
      nodekey: "id",
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
      tagNode: {},
      treeValue: {
        type: this.nodeType,
        folderName: "",
      },
      type: "",
      nodeData: {},
      confirmTitle: "",
      searchTree: {
        // deviceIds: [],
        treeNodes: [],
      },
      saveTreeData: this.saveData,
      groupTreeData: this.groupData,
      arrData: this.districtList,
      parame: this.nodeType,
      widowWidth: document.documentElement.clientWidth,
      widowHeight: document.documentElement.clientHeight,
      // 收藏设备标题
      favouriteTitle: "",
      favouriteForm: {
        referenceIds: [],
        folderId: "",
      },
      favouriteForm1: {
        referenceIds: [],
        folderId: "",
      },
      favouriteListArr: [],
    };
  },
  watch: {
    districtList(val) {
      this.arrData = val;
    },
    widowWidth(val) {
      let that = this;
      console.log("实时屏幕宽度", val, that.widowWidth);
    },
    widowHeight(val) {
      let that = this;
      console.log("实时屏幕高度", val, that.widowHeight);
    },
  },
  created() {},
  mounted() {
    this.getTreeData();
    // setTimeout(()=>{

    // },1000)
    this.reQueryCollectLists();
  },
  computed: {
    searchData() {
      return this.queryParams;
    },
  },
  methods: {
    async getTreeData() {
      let data =
        { nodeType: this.parame, accessPartyCode: this.accessPartyCode } || {};
      const res = await treeData("/pm/tree/node", "GET", data);
      this.arrData = res.data;
      this.$refs.commonTree.searchValue = "";
      this.defaultExpandedKeys.push(this.arrData[0].id);
      this.$emit("treeId", this.arrData[0].id);
    },
    // 获取收藏文件夹列表
    async reQueryCollectLists() {
      const res = await reQueryCollectList({
        type: this.nodeType,
        deviceName: "",
      });
      this.favouriteList = res.data.data;
    },
    // 获取收藏夹及收藏设备相关数据
    async getCollectTreeData(e) {
      const res = await treeData("/pm/tree/node", "GET", {
        type: this.nodeType,
        deviceName: "",
        folderId: e,
      });
      // reQueryCollect({type: this.nodeType,deviceName:"",folderId:e})
      this.favouriteList.forEach((item) => {
        if (item.id == e) {
          item.childrens = [...res.data];
        }
      });
      this.$nextTick(() => {
        this.favouriteList = [...this.favouriteList];
      });
    },
    // 获取收藏夹列表的树
    fileFolder(e) {
      this.getCollectTreeData(e);
    },
    // 通过标签搜索设备
    async searchDeviceByTag(value) {
      let res;
      if (value === "") {
        res = await treeData("/pm/tree/node", "GET", []);
      } else {
        res = await treeData("/pm/tree/node", "GET", [value]);
      }
      this.arrData = res.data;
      if (value === "") {
        this.defaultExpandedKeys = [];
      } else {
        this.dealExpandedKey(this.arrData);
      }
    },
    dealExpandedKey(list) {
      list.map((x) => {
        this.defaultExpandedKeys.push(x.id);
        if (x.children) {
          this.dealExpandedKey(x.children);
        }
      });
    },
    // 双击
    handleNodeDblclick(data, node, tree) {
      this.$emit("handleNodeDblclick", data, node, tree);
    },
    handleDragEnd(node, prenode, pis, evt) {
      this.$emit("DragEnd", node, prenode, pis, evt);
    },
    changeSelect(val) {},
    // 通过收藏夹搜索设备
    async searchDeviceByCollect(value) {
      const res = await reQueryCollect({
        type: this.nodeType,
        deviceName: value,
      });
      this.favouriteList = res.data;
    },
    switchTab(tab) {
      if (tab.name === "first") {
        this.getTreeData();
      } else {
        // 获取收藏夹列表
        this.reQueryCollectLists();
        // 获取收藏夹列表的树
        // this.getCollectTreeData()
        this.$emit("saveTreeTab", tab.name);
      }
    },
    async getCollectData() {
      const res = await reQueryCollect({ type: this.nodeType, deviceName: "" });
      this.cascaderOptions = res.data.data;
      this.collectCascaderOptions = res.data.data;
    },
    handleNodeClick(data, activeName) {
      this.tagNode = data;
      if (this.isCheck === "check") {
        let treeArr = [];
        let treeDeviceId = [];
        if (activeName === "second") {
          if (data.deviceId === null) {
            this.saveTreeData.deviceIds = null;
            treeArr.push(data.id);
            // this.saveTreeData.treeNodeIds = treeArr
            this.saveTreeData.treeNodes = treeArr;
          } else {
            // this.saveTreeData.treeNodeIds = null
            this.saveTreeData.treeNodes = null;
            treeDeviceId.push(data.deviceId);
            this.saveTreeData.deviceIds = treeDeviceId;
          }
          this.$nextTick((_) => {
            this.$emit("getTableData", activeName, this.saveTreeData);
          });
        } else {
          this.$emit("getTableData", data, activeName);
        }
      } else {
        this.$emit("getTableData", data, activeName);
      }
    },
    updateMark(data) {
      this.tagNode = data;
      this.$refs.updateMark.dialogFormVisible = true;
      this.$nextTick((_) => {
        this.$refs.updateMark.getNodeTags();
      });
    },
    // 删除文件夹
    delFile() {
      this.favouriteTitle = "删除文件夹";
      this.type = "del";
      this.$refs.favouriteForm1.dialogVisible = true;
    },
    // 一键收藏
    collection() {
      this.favouriteTitle = "一键收藏设备";
      this.type = "add";
      this.$refs.favouriteForm.dialogVisible = true;
    },
    // 收藏
    updateFavourites(data) {
      this.favouriteForm.referenceIds = [data.referenceId];
      this.timer = setTimeout((_) => {
        this.favouriteTitle = "收藏设备";
        this.type = "add";
        this.$refs.favouriteForm.dialogVisible = true;
      }, 200);
    },
    // 提交一键收藏设备弹窗
    onFavouriteSumbit() {
      if (this.favouriteForm.referenceIds.length) {
        reCollectDevice("/pm/device/favorite", "POST", this.favouriteForm)
          .then((res) => {
            this.$message.success("收藏设备成功");
            this.getTreeData();
            this.$refs.favouriteForm.dialogVisible = false;
            this.favouriteForm = {
              referenceIds: [],
              folderId: "",
            };
          })
          .catch((err) => {
            // this.$message.error(err)
          });
      } else {
        this.$message.error("请选择收藏的设备");
      }
    },
    //删除文件夹提交的按钮
    delFileSumbit() {
      // favouriteForm1.referenceIds.length 
      if (this.favouriteForm1.folderId) {
       
        delFileApi(this.favouriteForm1.folderId)
          .then((res) => {
            this.$message.success("删除文件夹成功");
            this.getTreeData();
            this.reQueryCollectLists();
            this.$refs.favouriteForm1.dialogVisible = false;
            this.favouriteForm1 = {
              referenceIds: [],
              folderId: "",
            };
          })
          .catch((err) => {
            // this.$message.error(err)
          });
      } else {
        this.$message.error("请选择需要删除的文件夹");
      }
    },
    // 取消一键收藏弹窗
    onFavouriteCancel() {
      this.$refs.favouriteForm.dialogVisible = false;
      (this.favouriteForm.referenceIds = []),
        (this.favouriteForm.folderId = "");
    },
    // 取消按钮删除文件夹弹窗
    delFileCancel() {
      this.$refs.favouriteForm1.dialogVisible = false;
      (this.favouriteForm1.referenceIds = []),
        (this.favouriteForm1.folderId = "");
    },
    nodeCheck(node, data, nodeIds) {
      console.log(data.checkedNodes, "datass");
      this.groupTreeData.treeNodes = [];
      this.groupTreeData.treeNodes = data.checkedNodes.map((x) => {
        if (x.type !== "DIR") {
          return {
            code: x.code,
            name: x.name,
            id: x.id,
          };
        }
      });

      this.groupTreeData.treeNodes = this.groupTreeData.treeNodes.filter(
        (x) => x !== undefined
      );
      this.$nextTick((_) => {
        this.$emit("getTableData", null, this.groupTreeData);
      });
      let temp = [];
      temp = data.checkedNodes.map((x) => {
        return x.referenceId;
      });
      this.favouriteForm.referenceIds = temp.filter((x) => x !== null);
      console.log(
        this.favouriteForm.referenceIds,
        "this.favouriteForm.referenceIds"
      );
    },
    // 收藏获取id
    nodeChecks(node, data, nodeIds) {
      console.log(nodeIds, "nodeIdsnodeIdsnodeIds");
      this.favouriteListArr.treeNodes = nodeIds.filter(
        (x) => x.referenceId !== null
      );
      this.$emit("getTableData", null, this.favouriteListArr);
    },
    // 创建文件夹createFile
    createFile() {
      this.confirmTitle = "新增收藏夹";
      this.type = "add";
      this.$refs.saveForm.dialogVisible = true;
    },
    // 收藏夹的添加和编辑
    onSaveConfirm() {
      $favoFolder.addFavoFolder(this.treeValue).then((res) => {
        this.$refs.saveForm.dialogVisible = false;
        this.treeValue.folderName = "";
        this.reQueryCollectLists();
      });
    },
    // 取消创建文件夹
    onSaveCancel() {
      this.treeValue.folderName = "";
      this.$refs.saveForm.dialogVisible = false;
    },
    // 添加
    onAppend(data) {
      this.confirmTitle = "收藏设备";
      this.nodeData = data;
      this.type = "add";
      this.$refs.saveForm.dialogVisible = true;
      this.treeValue.pname = data.name;
    },
    // 编辑
    onEdit(node) {
      this.type = "edit";
      this.confirmTitle = "编辑收藏夹";
      this.$refs.saveForm.dialogVisible = true;
      this.treeValue.pname = node.data.name;
      this.treeValue.Pid = node.data.pid;
      this.treeValue.id = node.data.id;
      this.treeValue.pid = node.data.pid;
      this.treeValue.name = node.data.name;
    },
    onRemove(node, type, id) {
      // if (type === 'cancel') {
      // let that = this;
      // const x = that.widowWidth/2 - 752, y = that.widowHeight/2 - 252
      // const str0 = { "cmd":"cutting_window","x" : x,"y" : y,"w" : 520,"h" : 250,"e_type" : "chrome","time" : "2020-08-17 00:00:00.000","cmd_id" : "001_1 " }
      // that.$store.state.socket.Csock.send(JSON.stringify(str0))
      this.$confirm(`确认取消收藏的设备?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // const str1 = { "cmd":" repair_window ","x" : x,"y" : y,"w" : 520,"h" : 250,"e_type" : "chrome","time" : "2020-08-17 00:00:00.000","cmd_id" : "001_1 " }
          // that.$store.state.socket.Csock.send(JSON.stringify(str1))
          this.deleteNode(node.data.referenceId, id, type);
        })
        .catch(() => {
          // const str1 = { "cmd":" repair_window ","x" : x,"y" : y,"w" : 520,"h" : 250,"e_type" : "chrome","time" : "2020-08-17 00:00:00.000","cmd_id" : "001_1 " }
          // that.$store.state.socket.Csock.send(JSON.stringify(str1))
        });
    },
    deleteNode(id, folderId, type) {
      reDeleteCollect("/pm/device/favorite", "DELETE", id, folderId)
        .then((res) => {
          this.$message.success("设备取消收藏成功");
          if (this.$refs.commonTree.activeName === "first") {
            this.getTreeData();
          } else {
            this.getCollectTreeData();
            this.reQueryCollectLists();
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    nodeClick(data) {
      if (data.deviceId) {
        this.$message.error("设备只能收藏在收藏夹下");
        return;
      }
      const obj = {
        createTime: "2021-12-06T03:27:20.992Z",
        creator: "string",
        deviceCode: "string",
        deviceName: "string",
        deviceType: "string",
        referenceId: 0,
      };
      reCollectDevice("/pm/device/favorite", "POST", obj)
        .then((res) => {
          this.$message.success("收藏设备成功");
          this.getCollectTreeData();
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>
<style>
</style>
