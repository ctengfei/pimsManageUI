<template>
  <div class="app-container">
    <el-dialog
      title="数据同步"
      :visible.sync="isSynchro"
      :before-close="closeAddPersonDialog"
      width="600px"
      >
      <el-table
        ref="deviceTypeTable"
        v-loading="isLoading"
        element-loading-text="加载中"
        :data="listDatas"
        @selection-change="handlePersonsSelectionChange"
      >
        <el-table-column type="selection" align="left" />
        <el-table-column prop="name" label="设备类型" />
        <el-table-column prop="description" label="设备厂商" />
      </el-table>
      <div slot="footer">
        <el-button
          type="primary"
          @click="confirmTong"
       
        >同步</el-button>
        <el-button @click="cancelAddDevice" plain >取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑设备类型"
      :visible.sync="isAdd"
     
      :before-close="closeAddPersonDialog"
      width="320px"
      >
      <el-form
        ref="addDevice"
        :model="addDevice"
        :rules="addDeviceRule"
        class="demo-form-inline"
        label-width="80px"
      >
        <el-form-item label="设备分类" prop="name">
          <el-input v-model="addDevice.name" placeholder="请输入设备名称" clearable disabled />
        </el-form-item>
        <el-form-item label="硬件厂商" prop="description">
          <el-input v-model="addDevice.description" placeholder="请输入硬件厂商" clearable />
        </el-form-item>
        <el-form-item label="上传图片" prop="path">
          <div class="upload__tip">只能上传jpg/png文件</div>
          <el-upload
            class="avatar-uploader"
            :action="action"
            :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="parkImgUrl" :src="parkImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="primary"
          @click="confirmAddDevice"
        >确定</el-button>
        <el-button @click="cancelAddDevice" plain >取消</el-button>
      </span>
    </el-dialog>
    <!-- <div class="synchro">
      <el-button type="primary" icon="el-icon-refresh" @click="btnSynchro">数据同步</el-button>
    </div> -->
    <ul class="listBox">
      <li v-for="item in listDatas" :key="item.id" @click="checkCamera(item)">
        <div class="bgImg">
          <img :src="item.path" alt='' />
        </div>
        <span>设备分类：{{item.name}}</span>
        <span>硬件厂商：{{item.description}}</span>
        <div class="iconBtn">
          <div @click.stop="edit(item)">
            <i class="el-icon-edit-outline"></i>
          </div>
          <!-- <div @click.stop="del(item)">
            <i class="el-icon-delete"></i>
          </div> -->
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { initData, treeByIdData, deviceSync } from "@/api/facility/information";
import ImgIcon from "@/assets/images/audio_chat.png";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
export default {
  name: "Information",
  data() {
    return {
      isAdd: false,
      parkImgUrl: "",
      isCrameShow: true,
      // 暂用图片
      ImgIcon,
      // 子系统数据
      listDatas: [],
      // 子系统类型
      sysChildType: "",
      // 总数量
      total: 5,
      formSearch: {
        // 搜索的表单
        userName: "",
        phoneNo: "",
        pageNum: 1,
        pageSize: 10
      },
      total: 12,
      pageNum: 1,
      pageSize: 10,
      // 弹出框查询条件搜索
      personFilter: {
        deviceType: ""
      },
      action: process.env.VUE_APP_BASE_API + "/file/file/upload",
      isLoading: false,
      // 搜索条件子系统集合
      sysChildList: [],
      // 搜索条件楼层集合
      devicePositionList: [],
      tableShow: true, // 表格的展示
      isSynchro: false,
      addDevice: {
        name: "",
        type: "",
        description: "",
        picture: ""
      },
      // 校验
      addDeviceRule: {
        name: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: ["blur", "change"]
          }
        ],
        type: [
          {
            required: true,
            message: "请输入设备类型",
            trigger: ["blur", "change"]
          }
        ],
        description: [
          {
            required: true,
            message: "请输入设备厂商",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  mounted() {
    this.getTableData();
    if (this.$route.query.type) {
      this.isCrameShow = this.$route.query.isShow;
      this.sysChildType = this.$route.query.type;
    }
  },
  methods: {
    // 上传前格式和图片大小限制
    beforeAvatarUpload(file) {
      const type = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!type) {
        this.$message.error("图片格式不正确!(只能包含jpg，pngJPEG)");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return type && isLt2M;
    },
    handleAvatarSuccess(res, file, fileList) {
      this.parkImgUrl = res.data.fullPath;
    },
    getTableData() {
      let parmas = {
        nodeType: "DIR"
      };
      initData("/pm/tree/type", "GET", parmas).then(res => {
        console.log(res,'res');
        this.listDatas = res.data;
        this.parkImgUrl = res.path;
      });
    },
    onSearch() {},
    onReset() {
      this.$refs.formName.resetFields();
    },
    addDeviceEvent() {
      this.title = "新增设备";
      this.init();
    },
    async init() {
      this.isAdd = true;
      this.parkImgUrl = "";
      if (this.$refs["addDevice"]) {
        this.$refs["addDevice"].resetFields();
      }
    },
    btnSynchro() {
      this.isSynchro = true;
    },
    btnCrameShow(data) {
      this.isSynchro = data;
    },
    checkCamera(data) {
      this.$router.push('/information/device-data/index/' + data.type)
    },
    // 关闭添加人员窗口
    closeAddPersonDialog() {
      this.isSynchro = false;
      this.isAdd = false;
      this.personFilter = {
        accountNumber: "",
        name: "",
        tel: ""
      };
      this.selectedPersonIds = [];
      if (this.$refs.deviceTypeTable) {
        this.$refs.deviceTypeTable.clearSelection();
      }
    },
    // 勾选人员表格复选框
    handlePersonsSelectionChange(data) {
      this.selectedPersonIds = [];
      data.forEach(item => {
        this.selectedPersonIds.push(item.type);
      });
    },
    confirmAddDevice() {
      this.$refs.addDevice.validate(valid => {
        if (valid) {
          if (this.addDevice.type) {
            let datas = {
              description: this.addDevice.description,
              name: this.addDevice.name,
              path: this.parkImgUrl,
              id: this.addDevice.id,
              sort: 0,
              type: this.addDevice.type
            };
            treeByIdData("/pm/tree/type", "PUT", datas).then(res => {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.isAdd = false;
              this.getTableData();
            });
          } else {
            let datas = {
              description: this.addDevice.description,
              name: this.addDevice.name,
              path: this.parkImgUrl,
              sort: 0,
              type: this.addDevice.type
            };
            treeByIdData("/pm/tree/type", "POST", datas).then(res => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.init();
              this.isAdd = false;
              this.getTableData();
            });
          }
        }
      });
    },
    edit(data) {
      this.$nextTick(() => {
        this.title = "编辑设备";
        this.init();
        this.addDevice = JSON.parse(JSON.stringify(data));
        this.parkImgUrl = data.path;
      });
    },
    del(data) {
      this.$confirm(`确定删除吗？`, "提示", {
        confirmButtonText: "确定",
        confirmButtonClass: "el-icon-check",
        cancelButtonText: "取消",
        cancelButtonClass: "el-icon-close",
        type: "warning",
        center: true
      }).then(() => {
        let parmas = { id: data.id };
        initData("/pm/tree/type", "DELETE", parmas).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getTableData();
        });
      });
    },
    // 弹框内确定
    confirmTong() {
      if (!this.selectedPersonIds.length) {
        this.$message.warning("请选择设备");
        return;
      } else {
        deviceSync(this.selectedPersonIds).then(res => {
          this.$message.success("同步成功！");
          this.closeAddPersonDialog();
        });
      }
    },
    // 弹框内取消
    cancelAddDevice() {
      this.closeAddPersonDialog();
    }
  }
};
</script>

<style lang="scss" scoped>
.synchro {
  text-align: right;
}
.listBox {
  display: flex;
  flex-wrap: wrap;
  li {
    padding: 15px;
    width: 18%;
    display: flex;
    flex-direction: column;
    margin-right: 2%;
    margin-bottom: 1%;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    .bgImg {
      border-radius: 6px;
      width: 100%;
      height: 200px;
      // background-color: #56596e;
      img {
        vertical-align: middle;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    span {
      margin-top: 10px;
      font-size: 14px;
    }
    .iconBtn {
      height: 34px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #dcdfe6;
      display: flex;
      justify-content: space-around;
      align-items: center;
      i {
        cursor: pointer;
      }
    }
  }
}
</style>
