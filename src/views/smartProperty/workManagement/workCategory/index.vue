<template>
  <div class="app-container">
      <!-- <el-col class="left-area">
        <HighlightSquare>
          <template v-slot:child>
            <div>
              <el-input
                placeholder="工单类型"
                style="position: relative; font-size: 16px; line-height: 36px"
                disabled
              ></el-input>
            </div>
            <div
              class="type"
              v-for="(item, index) in repair_work_order_type"
              :key="index"
            >
              <el-row>
                <el-col :span="24">
                  <p style="font-size: 14px">{{ item.name }}</p>
                </el-col>
              </el-row>
            </div>
          </template>
        </HighlightSquare>
      </el-col> -->
      <!--右侧主体部分-->
        <div >
          <el-button
            type="primary"
            plain
            @click="onEdit()"
            >添加分类</el-button
          >
        </div>
        <div style="margin-top: 10px;height:calc(100% - 100px)">
          <el-table
            :data="tableData"
            row-key="id"
            ref="tableRef"
            default-expand-all
            :tree-props="{ children: 'children' }"
          >
            <el-table-column
              label="分类名称"
              show-overflow-tooltip
              prop="name"
            ></el-table-column>
            <el-table-column
              label="分类描述"
              show-overflow-tooltip
              prop="description"
            ></el-table-column>
            <el-table-column label="图标" show-overflow-tooltip prop="icon">
              <template slot-scope="scope">
                <img
                  v-if="scope.row.icon"
                  :src="scope.row.icons"
                  alt=""
                  style="width: 25px; height: 25px"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="创建人"
              show-overflow-tooltip
              prop="creator"
            ></el-table-column>
            <el-table-column
              label="创建时间"
              show-overflow-tooltip
              prop="createTime"
            ></el-table-column>
            <el-table-column
              label="优先级"
              show-overflow-tooltip
              prop="emergencyLevel"
            >
              <template slot-scope="scope">
                <span>
                  {{
                    scope.row.emergencyLevel == "normal"
                      ? "普通"
                      : scope.row.emergencyLevel == "emergency"
                      ? "紧急"
                      : "非常紧急"
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span>
                  <el-button @click="onEdit(scope.row)" 
                    type="text"
                   
                    icon="el-icon-edit"
                    >编辑</el-button
                  >
                  <el-button
                    @click="onDelete(scope.row)"
                    type="text"
                    icon="el-icon-delete"
                   
                    >删除</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
    <el-dialog
      :title="title"
      :visible.sync="classificationShow"
      width="600px"
      :show-close="true"
      @closed="cancel()"
     
    >
      <el-row>
        <el-form
          labelWidth="80px"
          :model="addclassificationform"
          :rules="rules"
          ref="addclass"
        >
          <el-col>
            <el-form-item label="上级分类" v-if="title == '新增'">
              <el-select v-model="addclassificationform.pid" clearable>
                <el-option
                  v-for="(item, index) in tableData"
                  :label="item.name"
                  :key="index"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上级分类" v-else>
              <el-select clearable v-model="editId">
                <el-option
                  v-for="(item, index) in tableData"
                  :label="item.name"
                  :key="index"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="优先级" prop="emergencyLevel">
              <el-select
                v-model="addclassificationform.emergencyLevel"
                placeholder="请选择优先级"
                @change="$forceUpdate()"
              >
                <el-option
                  v-for="item in level"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="addclassificationform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="分类描述">
              <el-input
                type="textarea"
                :rows="2"
                v-model="addclassificationform.description"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <!-- -->
            <el-form-item label="图标文件">
              <el-upload
                class="upload-demo"
                :action="pictureUrl"
                :limit="1"
                :file-list="fileDatas"
                :on-change="handlerChange"
                :on-success="handlerChangeSuccese"
                :on-remove="handleRemove"
                accept=".jpg,.jpeg,.png"
                :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
              >
                <el-button type="primary">点击上传</el-button>
                <!--<i slot="default" class="el-icon-plus"></i>-->
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/jpeg/png文件
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align:right;">
        <el-button type="primary" @click="addclassifications"
          >确定</el-button
        >
        <el-button plain @click="cancel()"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HighlightSquare from "@/components/HighlightSquare";
import { getcategory } from "@/api/smartProperty/dictionaries";
import {
  addCategory,
  updateCategory,
  delCategory,
  getPhoto,
} from "@/api/smartProperty/workManagement";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { get } from "@/api/system/dicttype";
import { dayTimeList } from "../../../../utils/time-monitor";

export default {
  name: "WorkCategory",
  components: {
    HighlightSquare,
  },
  data() {
    return {
      permission: {
        addcategory: "smartProperty::workCategory::addcategory",
        delcategory: "smartProperty::workCategory::delcategory",
        searchcategorytree: "smartProperty::workCategory::searchcategorytree",
        // searchcategorytreeByID:"smartProperty::workCategory::searchcategorytreeByID",
        updatecategory: "smartProperty::workCategory::updatecategory",
      },
      addTypeShow: false,
      classificationShow: false,
      addtypeform: {},
      tableData: [],
      addclassificationform: {
        pid: "",
        description: "",
        name: "",
        sort: 0,
        id: "",
        icon: "",
        emergencyLevel: "",
        creator:null,
      },
      level: [
        {
          label: "普通",
          value: "normal",
        },
        {
          label: "紧急",
          value: "emergency",
        },
        {
          label: "非常紧急",
          value: "veryEmergency",
        },
      ],
      fileDatas: [],
      repair_work_order_type: [],
      addtype: "",
      categorys: [],
      title: "",
      // 校验
      rules: {
        name: { required: true, message: "请输入分类名称", trigger: "blur" },
        emergencyLevel: {
          required: true,
          message: "请选择优先级",
          trigger: ["blur", "change"],
        },
      },
      editId: "",
      fileList: [],
      dictionary: ["repair_work_order_type"],
      pictureUrl:
        process.env.VUE_APP_BASE_API + "/file/pm/fastdfs/upload/picture",
    };
  },

  mounted() {
    this.getcategorys();
    this.getdict();
    this.getTableData();
  },
  methods: {
    getcategorys() {
      // let obj = getObjByKey(this.permission.searchcategorytree);
      let url = '/pm/repair/category/query/tree'
      let method = 'GET'
      getcategory(url, method)
        .then((res) => {
          this.categorys = res.data;
        })
        .catch((err) => {});
    },

    //      获取字典
    getdict() {
      this.dictionary.forEach((item) => {
        get(item).then((res) => {
          this.$set(this, item, [...res.data]);
        });
      });
    },
    addclassifications() {
      this.$refs.addclass.validate((valid) => {
        if (valid) {
          let data = this.addclassificationform;
          data.pid = data.pid != "" ? data.pid : 0;
          if (data.pid != 0) {
            let sort = this.tableData.filter((item) => {
              return item.id == data.pid;
            });
            if (sort[0].children) {
              data.sort = sort[0].children.length + 1;
            } else {
              data.sort = 0;
            }
          } else if (data.pid == 0) {
            data.sort = this.tableData.length + 1;
          }

          if (this.fileDatas.length) {
            data.icon = JSON.stringify(this.fileDatas[0]);
          }else{
            data.icon = "";
          }
          if (this.title == "新增") {
            // let obj = getObjByKey(this.permission.addcategory);
            let url = '/pm/repair/category/add'
            let method = 'POST'
            delete data.id;
            addCategory(url, method, data).then((res) => {
              console.log(res,'res')
              if (res.code === 200) {
                this.$message.success("添加成功");
                this.getTableData();
                this.cancel();
              } else {
                this.$set(this.addclassificationform, "pid", "");
                this.$message.warning("不能添加重复分类");
              }
            });
          } else if (this.title == "编辑") {
            // let obj = getObjByKey(this.permission.updatecategory);
            let url = '/pm/repair/category/update'
            let method = 'PUT'
            if (this.editId == "") {
              data.pid = 0;
            } else {
              data.pid = this.editId;
            }
            console.log(data,'124124');
            updateCategory(url, method, data).then((res) => {
              if (res.code === 200) {
                this.$message.success("编辑成功");
                this.cancel();
                this.getTableData();
              } else {
                this.$set(this.addclassificationform, "pid", "");
                this.$message.warning(res.meta.message);
              }
            });
          }
        }
      });
    },
    getTableData() {
      // let obj = getObjByKey(this.permission.searchcategorytree);
      let url = '/pm/repair/category/query/tree'
      let method = 'GET'
      getcategory(url, method).then((res) => {
        this.tableData = res.data;
        this.findTreeArr(this.tableData);
      });
    },
    findTreeArr(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].icon) {
          this.setPhoto(JSON.parse(arr[i].icon).path).then((val) => {
            let img = `data:img/jpg;base64,${val.data}`;
            this.$set(arr[i], "icons", img);
          });
        } else {
          if (arr[i].children) {
            this.findTreeArr(arr[i].children);
          }
        }
      }
    },
    setPhoto(item) {
      let url = "/pm/fastdfs/file/resource";
      let method = "get";
      let tempObj1 = {
        url,
        method,
        path: item,
      };
      return new Promise(function (resolve, reject) {
        getPhoto(tempObj1).then((res) => {
          resolve(res);
        });
      });
    },
    addType() {
      this.addtype = "添加类型";
      this.addTypeShow = true;
    },
    cancel() {
      this.resetForm("addclass");
      this.fileDatas= [];
    },

    onEdit(data = false) {
      this.title = !data ? "新增" : "编辑";
      if (data) {
        this.fileDatas = [];
        this.editId = data.pid == 0 ? "" : data.pid;
        this.addclassificationform.name = data.name;
        this.addclassificationform.pid = data.pid;
        this.addclassificationform.description = data.description;
        this.addclassificationform.emergencyLevel = data.emergencyLevel;
        this.addclassificationform.sort = data.sort;
        this.addclassificationform.id = data.id;
        if (data.icon) {
          let datas = JSON.parse(data.icon);
          this.fileDatas.push({
            name: datas.name,
            path: datas.path,
            uid: datas.uid,
          });
        }else{
          data.icon= "";
        } 
      }
      this.classificationShow = true;
    },
    onDelete(data) {
      let id = data.id;
      // let obj = getObjByKey(this.permission.delcategory);
      let url = '/pm/repair/category/delete/'
      let method = 'DELETE'
      this.$confirm(`您确定要删除这条数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delCategory(url, method, id).then((res) => {
          this.$message.success("删除成功");
          this.getTableData();
        });
      });
    },
    //  重置新增/编辑表单
    resetForm(formName) {
      this.classificationShow = false;
      this.$refs[formName].resetFields();
      this.editId = "";
      this.addclassificationform = {
        pid: "",
        description: "",
        name: "",
        sort: 0,
      };
    },
    handlerChange(file, fileList) {},
    handleRemove(file, fileList) {
      for (var i = 0; i < this.fileDatas.length; i++) {
        if (this.fileDatas[i].uid == file.uid) {
          this.fileDatas.splice(i, 1);
        }
      }
    },
    handlerChangeSuccese(res, file, fileList) {
      this.fileDatas.push({
        uid: file.uid,
        name: file.name,
        path: res.data.path,
      });
    },
  },
};
</script>


<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}

.right-area {
  overflow: hidden;
  // padding: 20px;
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}

::v-deep.el-select {
  width: 100%;
}

.type {
  p {
    height: 32px;
    margin-top: 17px;
    margin-left: 15px;
    
  }
}
::v-deep .el-dialog__body{
    padding: 30px 10px !important;
  }
  ::v-deep .el-upload-list__item-name{
        width: 458px !important;
  }
</style>
