<template>
  <div class="app-container">
    <div style="height:100%">
      <el-form inline v-if="showSearch">
        <el-form-item label="模板名称">
          <el-input
            placeholder="请输模板名称"
            v-model="formSearch.title"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="onSearch()"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            @click="onReset()"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
            icon="el-icon-plus"
            plain
            type="primary"
            @click="onAdd()"
            >新增</el-button
          >
          <el-button
            icon="el-icon-download"
            type="warning"
            plain
            @click="onBatchDownload()"
            :disabled="!checkItemAll.length"
            >批量下载</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            plain
            @click="onBatchDelete()"
            :disabled="!checkItemAll.length"
            >批量删除</el-button
          >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getTableData"></right-toolbar>
        </el-row>
      <div style="height:calc(100% - 170px)">
        <el-table
          :data="tableData"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            prop="title"
            label="合同模板名称"
            showOverflowTooltip
          ></el-table-column>
          <el-table-column
            prop="description"
            label="模板说明"
          ></el-table-column>
          <el-table-column
            prop="fileName"
            label="文件名称"
            showOverflowTooltip
          ></el-table-column>
          <el-table-column
            prop="fileSize"
            label="大小(B)"
            showOverflowTooltip
          ></el-table-column>
          <el-table-column
            prop="creator"
            label="上传作者"
            width="230"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="上传时间"
            showOverflowTooltip
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="openDownload(scope.row)"
                type="text"
                icon="el-icon-download"
               
                >下载</el-button
              >
              <el-button
                @click="onDelete(scope.row)"
                type="text"
                icon="el-icon-delete"
               
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="tableData && tableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="formSearch.pageNum"
          :pageSizes="[10, 20, 40]"
          :limit.sync="formSearch.pageSize"
          :total="total"
        />
      </div>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="addShow"
      width="320px"
     
      :show-close="false"
    >
      <el-form :model="contemplate" ref="contemplate" :rules="rules">
        <el-form-item label="模板附件" label-width="80px" prop="file">
          <el-upload
            class="upload-demo"
            ref="uploadfile"
            action="#"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :limit="1"
            :on-exceed="masterFileMax"
            :auto-upload="false"
            accept=".doc,.docx,.xls,.xlsx"
            :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
          >
            <el-button icon="el-icon-upload" type="primary"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="模板名称" label-width="80px" prop="title">
          <el-input v-model="contemplate.title" />
        </el-form-item>
        <el-form-item label="模板说明" label-width="80px" prop="description">
          <el-input v-model="contemplate.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="dialogMarksT"
          >确定</el-button
        >
        <el-button  @click="dialogMarksF"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import pagination from "@/components/comPagination";
import {
  searchTemplate,
  addTemplate,
  deleteTemplate,
  downloadBatchTemplate,
  downloadTemplate,
} from "@/api/spaceManagement/templateManagement.js";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { downloads } from "@/api/smartProperty/notice.js";
import { downloadFile } from "@/utils/index";

export default {
  name:'TemplateManagement',
  components: {
    pagination,
  },
  data() {
    return {
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        title: "",
      },
      // permission: {
      //   search: "spaceManagement::templateManagement::search",
      //   add: "spaceManagement::templateManagement::add",
      //   download: "spaceManagement::templateManagement::download",
      //   delete: "spaceManagement::templateManagement::delete",
      //   downloadBatch: "spaceManagement::templateManagement::downloadBatch",
      // },
      downloadUrl: process.env.VUE_APP_BASE_API + "/file/file/loadByUrl?url=",
      filePath:'',
      showSearch:true,
      multipleArr:[],
      tableData: [],
      total: 0,
      addShow: false,
      fileList: [],
      action: process.env.VUE_APP_BASE_API + "/file/pm/fastdfs/upload/file",
      contemplate: {
        title: "",
        description: "",
        file: {},
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入模板名称",
            trigger: ["change", "blur"],
          },
        ],
        description: [
          {
            required: true,
            message: "请输入模板描述",
            trigger: ["change", "blur"],
          },
        ],
        file: [
          { required: true, validator: this.validatefile, trigger: "change" },
        ],
      },
      single:true,
      filePath:[],
      checkItemAll: [],
      checkItemFIle: [],
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
     // table多选
     multipleChange(val){
        let temp = val.map(item=>{
          return {alarmCode:item.code,closeReason:""}
        })
        this.multipleArr = temp
      },
    masterFileMax(files, fileList) {
      this.$message.warning(`请最多上传1个文件。`);
    },
    validatefile(rule, value, callback) {
      let data = JSON.parse(JSON.stringify(value));
      if (Object.keys(data).length > 0) {
        callback();
      } else {
        callback(new Error("请上传模板"));
      }
    },

    getTableData() {
      //let obj = getObjByKey(this.permission.search);
      let data = this.formSearch;
      if (data.title == "") {
        delete data.title;
      }
      searchTemplate('/pm/contract/contractTemplate', 'get', data).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.formSearch.pageNum = res.data.pageNum;
          this.formSearch.pageSize = res.data.pageSize;
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            totalPage === this.formSearch.pageNum &&
            this.tableData.length === 1
          ) {
            this.formSearch.pageNum--;
          }
        }else{
           this.$message.error(res.meta.message);
        }
      });
    },
    onSearch() {
      this.formSearch.pageNum = 1;
      this.getTableData();
    },
    onAdd() {
      this.addShow = true;
    },
    onDelete(data) {
      //let obj = getObjByKey(this.permission.delete);
      let arr = [];
      arr.push(data.id);
      this.$confirm(`确定删除【${data.title}】的合同模板吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        //center: true,
      }).then(() => {
        deleteTemplate('/pm/contract/contractTemplate/delete', 'delete', arr).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getTableData();
          } else {
            this.$message.error(res.meta.message);
          }
        });
      });
    },
    onBatchDelete() {
      //let obj = getObjByKey(this.permission.delete);
      this.$confirm(`确定删除所选合同模板吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        //center: true,
      }).then(() => {
        deleteTemplate('/pm/contract/contractTemplate/delete', 'delete', this.checkItemAll).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getTableData();
            this.checkItemFIle = [];
          } else {
            this.$message.error(res.meta.message);
          }
        });
      });
    },
    onReset() {
      this.formSearch = {
        pageNum: 1,
        pageSize: 10,
        title: "",
      };
      this.getTableData();
    },
    openDownload(data) {
      location.href = this.downloadUrl + data.filePath
      //let obj = getObjByKey(this.permission.download);
      // let suffix = data.filePath.substring(data.filePath.lastIndexOf(".")+1);
      // downloads('/pm/contract/contractTemplate/downTemplateFile', 'get', data.filePath)
      //   .then((res) => {
      //     downloadFile(res, data.fileName.split(".")[0], suffix);
      //   })
      //   .catch((err) => {
      //     this.$message.error(err.message);
      //   });
    },
    onBatchDownload() {
      //let obj = getObjByKey(this.permission.download);
      //let fileData = this.tableData
      //location.href = this.downloadUrl + this.filePath
      for (let i in this.checkItemFIle) {
        let suffix = this.checkItemFIle[i].split("&")[0].split(".")[1];
        let name = this.checkItemFIle[i].split("&")[1];
        downloadFile('/pm/fastdfs/download/files', 'get', this.checkItemFIle[i])
          .then((res) => {
            downloadFile(res, name, suffix);
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      }
      this.getTableData();
    },
    handleCurrentChange(n) {
      this.getTableData();
    },
    handleRemove(file, fileList) {
      this.contemplate.file = {};
      this.contemplate.title = "";
      if (fileList.length > 0) {
      }
    },
    handleChange(file, fileList) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const extension3 = testmsg === "doc";
      const extension4 = testmsg === "docx";
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.contemplate.file={};
        this.fileList=[];
        this.$message({
          message: "上传文件只能是 xls、xlsx、doc、docx格式!",
          type: "warning",
        });
        return false;
      } else {
        this.contemplate.file = file;
        this.contemplate.title = file.name.substring(0,file.name.lastIndexOf("."));
        if (fileList.length > 0) {
          this.$refs.contemplate.clearValidate("file");
        }
      }   
    },
    selectionChange(row) {
      this.checkItemAll = row.map((item) => item.id);
      this.filePath = row.map((item)=>item.filePath)
      this.single = row.length!=1
      this.checkItemFIle = row.map((item) => item.filePath + "&" + item.title);
    },
    dialogMarksF() {
      this.fileList = [];
      this.$refs["contemplate"].resetFields();
      this.addShow = false;
    },
    dialogMarksT() {
      //let obj = getObjByKey(this.permission.add);
      this.$refs.contemplate.validate((valid) => {
        if (valid) {
          let dataPar = this.contemplate;
          let fdParams = new FormData();
          fdParams.append("title", dataPar.title);
          fdParams.append("description", dataPar.description);
          fdParams.append("file", dataPar.file.raw);
          addTemplate('/pm/contract/contractTemplate/add', 'post', fdParams)
            .then((res) => {
              if (res.code === 200) {
                this.addShow = false;
                this.$refs["contemplate"].resetFields();
                this.fileList = [];
                this.getTableData();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.$message.error(res.msg);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form .el-select {
  width: 100%;
}

.el-date-editor.el-input__inner {
  width: 100%;
}

.colors {
  background-color: #206aff;
}
::v-deep.el-table.el-table--fit {
  overflow: hidden;
}
</style>
