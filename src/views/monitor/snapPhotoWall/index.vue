<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xl="4" :lg="6" :sm="7" :xs="24" style="background-color:#f5f7fa;">
        <div class="treeBox">
          <OrgizeTree
            :currentNodeKey="currentNodeKey"
            ref="orgizeTree"
            :isCheck="isCheck"
            :nodeType='nodeType'
            :permissionData="permission"
            @getTableData="getTableData"
          />
        </div>
      </el-col>
      <el-col :xl="20" :lg="18" :sm="17" :xs="24">
        <div class="flex-between">
          <el-form inline>
            <el-form-item label="抓拍时间">
              <el-date-picker
                v-model="searchform.time"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 240px;"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchButton()"
                >搜索</el-button
              >
              <el-button
                plain
                icon="el-icon-refresh-left"
                @click="resetList()"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <!-- <el-button
            plain
            type="primary"
            @click="download()"
            >下载</el-button
          > -->
          </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index"  label="序号" />
          <el-table-column label="设备编码" prop="cameraCode" />
          <el-table-column
            prop="pictureName"
            label="抓拍文件名"
            show-overflow-tooltip
          />
          <!-- <el-table-column label="抓拍类型" prop="snapTypeStr" /> -->
          <el-table-column label="抓拍缩略图">
            <template slot-scope="scope">
              <img
                :src="scope.row.previewUrl"
                style="width: 70px; height: 40px"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="snapTime"
            label="抓拍时间"
            show-overflow-tooltip
          />
          <!-- <el-table-column label="图片大小" prop="pictureSizeStr" width="150" /> -->
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <!-- <el-button
                type="text"
                @click="lookList(scope.row, scope.$index)"
              >查看图片</el-button> -->
              <el-button
                type="text"
                @click="downloadImg(scope.row, scope.$index)"
              >下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          v-loading="loading"
          :visible.sync="bigPhotoShow"
          width="800px"
          lock-scroll
          element-loading-text="拼命加载中····"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(128, 128, 128, 0.4)"
          center
          class="bigPhoto"
          >
          <div class="img-area">
            <img id="printingImg" style="width:100%" :src="bigPhotoSrc" />
          </div>
        </el-dialog>
        <Thumbnail
          v-if="thumbnailShow && tableData.length"
          :mytable-data="tableData"
          :checked-null="thumbnailChecked"
          :checkAll="false"
          @thumbnailChecked="thumbnailCheckedData"
        />
        <pagination
          v-if="tableData && tableData.length > 0"
          :page.sync="Interface.pageNum"
          :total="pageTotal"
          :limit.sync="Interface.pageSize"
          :pageSizes="[10, 20, 30, 40]"
          @pagination="handleCurrentChange"
        />
        <!-- <div class="photoBoxNo" v-else>
          <span class="el-table__empty-text" style="text-align: center;">暂无数据</span>
        </div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeData, getDeviceCriteria } from "@/api/system/organization";
import OrgizeTree from "@/components/orgnizeTree";
import "@/assets/styles/variables.scss";
import Thumbnail from "./thumbnail";
import { validateString } from "@/utils/validate";
import { downloadImage } from "@/utils/dom";
import {
  getSnapPhoto,
  deleteSnapPhoto,
  getChangeList,
  getFuzzyList,
  getDevicePhoto,
  deleteSnapPhotoAll,
  getSmallPhoto,
  getBigPhoto,
} from "@/api/imageMange/snapPhotoWall";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import pagination from '@/components/comPagination'
import { getCarInformation } from '@/api/monitor/timemonitor'

export default {
  name:"",
  components: {
    Thumbnail,
    OrgizeTree,
    pagination
  },
  data() {
    return {
      // 新树
      dialogTitle: "收藏夹",
      dialogWidth: "30%",
      districtList: [],
      tagOptions: [],
      allTagsOptions: [], // 收藏tabs的数据
      nodekey: "id", // 树节点标识
      collectCascaderOptions: [], // 搜索部分级联选择数据
      favouriteList: [],
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
      tabData: [
        // tab数据
        { label: "组织树", name: "first" },
      ],
      data: [], // 树组件渲染数据
      obj: {
        // 树组件相关属性
        children: "children",
        label: "name",
        value: "id",
      },
      nodekey: "id", // 树节点标识
      dataListShow: true, // 控制列表展示
      thumbnailShow: false, // 控制缩略图
      bigPhotoShow: false, // 控制列表里查看大图
      bigPhotoSrc: "", // 大图展示的图片路径
      pageTotal: 0, // 总条数
      deviceId: null, // tree的id
      loading: false, // 加载。。。
      searchform: {
        // 搜索框的数据 获取到并搜索
        content: "",
        time: "",
        position: "",
      },
      tableData: [],
      dataListChecked: [], // 绑定列表多选框
      thumbnailChecked: [], // 绑定缩略图多选框
      thumbnailDataF: [], // 接受缩略图的数据
      downloadData: [],
      Interface: {
        pageNum: 1,
        pageSize: 10,
        endTime: "",
        startTime: "",
        content: "",
      },
      checkdisabled: true,
      statusTab: 0,
      permission: {
        // download: "videoMange::snapPhotoWall:download",
        // deleteList: "videoMange::snapPhotoWall:deleteList",
        // downloadThumbnail: "videoMange::snapPhotoWall:downloadThumbnail",
        // look: "videoMange::snapPhotoWall:look",
      },
      defaultExpandedKeys: [],
      permissionData: {},
      tempdeviceId: "",
      nodeType:'camera',
      cameraCode:'',
      selectOpt:[{
        id:1,
        value:'智能分析抓拍'
      },
      {
        id:2,
        value:'告警抓拍'
      },
      {
        id:4,
        value:'手动抓拍'
      }],
      selValue:4,
      treeNode:0,
      currentNodeKey:"",
      currentNodeKeyObj:{}
    };
  },
  created() {
    // 树数据
    this.permissionData = this.permission;
    this.isCheck = "";
  },
  mounted() {
    if (typeof this.$route.query.player == "object") {
      this.currentNodeKeyObj.id = this.$route.query.player.deviceId
      this.currentNodeKeyObj.referenceId = this.$route.query.player.referenceId
      this.getTableData(this.currentNodeKeyObj)
    }
    this.getTreeData()
  },
  methods: {
    async getTreeData() {
      let data = {nodeType:'camera'} || {}
      const res = await treeData('/pm/tree/node', 'GET', data)
      let arr = res.data
      this.getTreeLeaf(arr)
    },
    getTreeLeaf(treeData) {
        // 判断是否为数组
        if(typeof this.$route.query.player == "object"){
          this.currentNodeKey = this.$route.query.player.deviceId
          return 
        }
        if (Array.isArray(treeData)) {
          treeData.every(item => {
            if (item.children && item.children.length > 0) {
              if(item.children[0].children.length == 0 && item.children[0].type =="camera"){
                let tempKey = item.children[0].children.length
                if(!tempKey){
                  this.currentNodeKey = item.children[0].id
                  this.getCarInformation(item.children[0])
                  return false
                }else{
                  this.getTreeLeaf(item.children)
                }
              }else{
                this.getTreeLeaf(item.children)
              }
            }
          })
        } 

    },
    getTableData(data, activeName) {
      this.tagNode = data;
      this.Interface.pageNum = 1;
      this.Interface.pageSize = 10;
      this.isType = 'click'
      if(data.referenceId){
        this.getCarInformation(data)
      }
    },
    // 获取设备code编码
    getCarInformation(data){
      getCarInformation(data.referenceId).then(res=>{
        this.cameraCode = res.data.code
        this.getSnapPhoto(this.cameraCode)
      })
    },
    // 点击左侧树返回列表 getSnapPhoto
    getSnapPhoto(data){
      let obj = {
        url: '/sm/ivs/snapshot/list',
        method: 'POST'
      };
      let temp = {
        cameraCode: data.split("#")[0],
        domainCode: data.split("#")[1],
        endTime: "",
        pageNum: this.Interface.pageNum,
        snapType: this.selValue,
        startTime: "",
        pageSize: this.Interface.pageSize
      }
      getSnapPhoto(obj,temp)
      .then((res) => {
        this.pageTotal = res.data.snapshotInfoList.total;
        this.tableData = res.data.snapshotInfoList.snapshotInfos;
      })
      .catch((err) => {
        this.$message.error("数据访问失败！", err);
      });
      
    },
    // 搜索按钮
    searchButton() {
      console.log("selValueselValueselValue",this.selValue)
      let startTime = "";
      let endTime = "";
      this.Interface.pageNum = 1;
      if (this.searchform.time && !validateString(this.searchform.time)) {
        startTime = this.searchform.time[0];
        endTime = this.searchform.time[1];
      }
      let obj = {
        url: '/sm/ivs/snapshot/list',
        method: 'POST'
      };
      const temp = {
        cameraCode: this.cameraCode ? this.cameraCode.split("#")[0] : "",
        domainCode: this.cameraCode ? this.cameraCode.split("#")[1] : "",
        startTime,
        endTime,
        snapType: this.selValue,
        pageNum: this.Interface.pageNum,
        pageSize: this.Interface.pageSize,
      };
      getSnapPhoto(obj,temp)
        .then((res) => {
          this.pageTotal = res.data.snapshotInfoList.total;
          this.tableData = res.data.snapshotInfoList.snapshotInfos;
        })
        .catch((err) => {
          this.$message.error("数据访问失败！", err);
        });
    },
    // 重置
    resetList() {
      let startTime = "";
      let endTime = "";
      if (this.searchform.time && !validateString(this.searchform.time)) {
        startTime = this.searchform.time[0];
        endTime = this.searchform.time[1];
      }
      let obj = {
        url: '/sm/ivs/snapshot/list',
        method: 'POST'
      };
      let temp = {
        cameraCode: this.cameraCode.split("#")[0],
        domainCode: this.cameraCode.split("#")[1],
        endTime: "",
        startTime: "",
        pageNum: 1,
        pageSize: 10,
        snapType: this.selValue       
      };
      this.searchform.time = "";
      getSnapPhoto(obj,temp)
        .then((res) => {
          this.pageTotal = res.data.snapshotInfoList.total;
          this.tableData = res.data.snapshotInfoList.snapshotInfos;
        })
        .catch((err) => {
          this.$message.error("数据访问失败！", err);
        });
    },
    // 列表中的下载
    downloadImg(data){
      downloadImage(data.pictureUrl)
    },
    // 头部下载按钮，选中的数据  判断是在列表还是缩略图的数据
    download() {
      if (this.thumbnailShow) {
        if (this.thumbnailChecked.length) {
          this.thumbnailChecked.map((item) => {
            let obj = getObjByKey(this.permission.download);
            let tempObj = JSON.parse(JSON.stringify(obj));
            tempObj.filePath = item.filePath;
            getBigPhoto(tempObj).then((res) => {
              const url = window.URL.createObjectURL(new Blob([res]));
              downloadImage(url);
            });
          });
        } else {
          this.$message.info("至少要勾选一条数据才可以下载");
        }
      } else if (this.dataListShow) {
        if (this.dataListChecked.length) {
          if (this.downloadData.length > 0) {
            const data = this.downloadData;
            data.map((item) => {
              const url = window.URL.createObjectURL(new Blob([item]));
              downloadImage(url)
            });
          }
        } else {
          this.$message.info("至少要勾选一条数据才可以下载");
        }
      }
    },
    // 头部删除按钮，选中的数据  判断是在列表还是缩略图的数据
    handleDelete() {
      if (this.thumbnailShow) {
        if (this.thumbnailChecked.length) {
          const arr = [];
          this.thumbnailChecked.map((item) => {
            arr.push(item.id);
          });
          console.log(arr);
          this.$confirm("是否删除已选中数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            let obj = getObjByKey(this.permission.deleteList);
            let tempObj = JSON.parse(JSON.stringify(obj));
            tempObj.arr = arr;
            deleteSnapPhotoAll(tempObj)
              .then((res) => {
                this.$message.success("删除成功！", res);
                this.thumbnailChecked = [];
                this.Interface.pageNum = 1;
                this.getImgList();
              })
              .catch((err) => {
                this.$message.error("数据访问失败！b", err);
              });
          });
        } else {
          this.$message.info("至少要勾选一条数据才可以删除");
        }
      } else if (this.dataListShow) {
        if (this.dataListChecked.length) {
          this.$confirm("此操作将永久删除已选中数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // 获取到选中的id
              let ids = [];
              this.tableData.filter((item) => {
                ids = this.dataListChecked.map((v) => v.id);
              });
              let obj = getObjByKey(this.permission.deleteList);
              let tempObj = JSON.parse(JSON.stringify(obj));
              tempObj.arr = ids;
              deleteSnapPhotoAll(tempObj)
                .then((res) => {
                  this.$message.success("删除成功！", res);
                  this.Interface.pageNum = 1;
                  this.getImgList();
                })
                .catch((err) => {
                  this.$message.error("数据访问失败！", err);
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除",
              });
            });
        } else {
          this.$message.info("至少要勾选一条数据才可以删除");
        }
      }
    },
    //分页获取列表
    getImgList() {
      const data = {
        pageNum: this.Interface.pageNum,
        pageSize: this.Interface.pageSize,
        url: '/sm/ivs/snapshot/list',
        method: 'POST',
      };
      getChangeList(data)
        .then((res) => {
          this.pageTotal = res.data.total;
          this.tableData = res.data.data;
          this.tableData.map((item) => {
            let obj = getObjByKey(this.permission.downloadThumbnail);
            let tempObj = JSON.parse(JSON.stringify(obj));
            tempObj.path = item.smallFilePath;
            getSmallPhoto(tempObj).then((res) => {
              item.smallFilePath = "data:img/jpg;base64," + res.data;
            });
          });
        })
        .catch((err) => {
          this.$message.error("数据访问失败！", err);
        });
    },
    // 缩略图传过来的列表数据
    thumbnailData(v) {
      this.thumbnailDataF = v;
    },
    // 缩略图传过来的多选框数据
    thumbnailCheckedData(v) {
      this.thumbnailChecked = v;
      if (this.thumbnailChecked.length > 0) {
        this.checkdisabled = false;
      } else {
        this.checkdisabled = true;
      }
    },
    // 多选框的实时更新赋值
    handleSelectionChange(val) {
      this.dataListChecked = val;
      const dataPath = [];
      val.map((item, index) => {
        dataPath.push(item.previewUrl);
        this.downloadData = dataPath;
      });
      if (this.dataListChecked.length > 0) {
        this.checkdisabled = false;
      } else {
        this.checkdisabled = true;
      }
    },
    // 点击切换列表和缩略图
    switchList() {
      this.thumbnailShow = !this.thumbnailShow;
      this.dataListShow = !this.dataListShow;
      this.dataListChecked = []; // 清空绑定列表多选框
      this.thumbnailChecked = []; // 清空绑定缩略图多选框
    },

    // 列表里的查看大图按钮
    lookList(data, index) {
      this.bigPhotoSrc = "";
      this.bigPhotoShow = true;
      this.bigPhotoSrc = data.pictureUrl;
    },
    // 列表里的删除按钮
    deleteList(data, index) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let obj = {
            url: '/sm/ivs/snapshot/delete',
            method: 'DELETE'
          };
          let tempObj = JSON.parse(JSON.stringify(obj));
          tempObj.url = tempObj.url.replace("{id}", data.id);
          deleteSnapPhoto(tempObj)
            .then((res) => {
              this.$message.success("删除成功！");
              this.Interface.pageNum = 1;
              this.getImgList();
            })
            .catch((err) => {
              this.$message.error("删除失败！", err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      this.Interface.pageSize = val;
      this.sedData();
    },
    // 分页切换 切换到第几页 发送请求
    handleCurrentChange(n) {
      // this.Interface.pageNum = n;
      // 判断是否是tree当前设备的分页
      // this.sedData();
      this.getSnapPhoto(this.cameraCode)
    },
    sedData() {
      if (this.deviceId) {
        const devData = {
          pageNum: this.Interface.pageNum,
          pageSize: this.Interface.pageSize,
          url: '/sm/ivs/snapshot/list',
          method: 'POST',
          nodeId: this.deviceId,
          deviceIds: this.tempdeviceId,
          favoriteId: "",
          startTime: "",
          endTime: "",
        };
        
        if (this.searchform.time) {
          if (this.searchform.time && !validateString(this.searchform.time)) {
            devData.startTime = this.searchform.time[0];
            devData.endTime = this.searchform.time[1];
          }
        }
        getDevicePhoto(devData)
          .then((res) => {
            this.tableData = res.data.data;
            this.tableData.map((item) => {
              let obj = getObjByKey(this.permission.downloadThumbnail);
              let tempObj = JSON.parse(JSON.stringify(obj));
              tempObj.path = item.smallFilePath;
              getSmallPhoto(tempObj).then((res) => {
                item.smallFilePath = "data:img/jpg;base64," + res.data;
              });
            });
          })
          .catch((err) => {
            this.$message.error("数据访问失败！", err);
          });
        return;
      }
      if (this.searchform.content || this.searchform.time) {
        let startTime = "";
        let endTime = "";
        if (this.searchform.time && !validateString(this.searchform.time)) {
          startTime = this.searchform.time[0];
          endTime = this.searchform.time[1];
        }
        const obj = {
          startTime,
          endTime,
          nodeId: "",
          favoriteId: "",
          pageNum: this.Interface.pageNum,
          pageSize: this.Interface.pageSize,
          content: this.searchform.content,
          deviceIds: this.tempdeviceId,
          url: '/sm/ivs/snapshot/list',
          method: 'POST'
        };
        getFuzzyList(obj).then((res) => {
          this.pageTotal = res.data.total;
          this.tableData = res.data.data;
          this.tableData.map((item) => {
            let obj = getObjByKey(this.permission.downloadThumbnail);
            let tempObj = JSON.parse(JSON.stringify(obj));
            tempObj.path = item.smallFilePath;
            getSmallPhoto(tempObj).then((res) => {
              item.smallFilePath = "data:img/jpg;base64," + res.data;
            });
          });
        });
        return;
      }
      const data = {
        pageNum: this.Interface.pageNum,
        pageSize: this.Interface.pageSize,
        url: '/sm/ivs/snapshot/list',
        method: 'POST'
      };
      if (this.tempdeviceId != "") {
        data.deviceIds = this.tempdeviceId;
      }
      getChangeList(data)
        .then((res) => {
          this.tableData = res.data.data;
          this.tableData.map((item) => {
            let obj = getObjByKey(this.permission.downloadThumbnail);
            let tempObj = JSON.parse(JSON.stringify(obj));
            tempObj.path = item.smallFilePath;
            getSmallPhoto(tempObj).then((res) => {
              item.smallFilePath = "data:img/jpg;base64," + res.data;
            });
          });
        })
        .catch((err) => {
          this.$message.error("数据访问失败！", err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/variables";
.treeBox{
  height: 800px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
.app-container {
  .myTree {
    width: 20%;
    background: white;
    margin: 20px 20px;
  }
  .dataList {
    width: 78%;
    height: 700px;
    margin: 20px 0;
    position: relative;
    .header {
      width: 100%;
      // height: 40px;
      display: flex;
      margin-bottom: 20px;
      justify-content: space-between;
      .search {
        display: flex;
      }
      .headerButton {
        height: 100%;
        display: flex;
        float: right;
        margin-right: 3%;
      }
    }
    .bigPhoto {
      img {
        width: 100%;
        vertical-align: bottom;
      }
      ::v-deep .el-dialog__body {
        padding: 0;
      }
      ::v-deep .el-dialog__header {
        display: none;
      }
    }
    .pagination {
      position: absolute;
      bottom: 30px;
      right: 40px;
    }
  }
  .img-area {
    width: 100%;
    height: 650px;
    overflow: auto;
    img {
      width: 100%;
    }
  }
  .table {
   
    overflow: hidden;
    button {
      margin-right: 10px;
    }
    ::v-deep .el-dialog {
      width: 400px;
    }
  }
  //分页的样式
  .pagination {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
