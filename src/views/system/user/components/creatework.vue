<template>
  <div v-show="createWorkShow" style="height: 100%">
    <div>
      <div style="width: 50%">
        <p class="pClass" style="margin-bottom: 20px">基本信息</p>
        <el-row>
          <el-form label-width="80px" :model="addForm" :rules="addFormRules" ref="form">
            <el-col :span="12">
              <el-form-item label="工单类型" prop="type">
                <el-select v-model="addForm.type">
                  <el-option
                    v-for="item in type"
                    :key="item.value"
                    :value="item.value"
                    :label="item.name"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报修分类" prop="repairType">
                <el-cascader
                  change-on-select="trues"
                  :options="options"
                  :props="typeProps"
                  v-model="selectedOptions"
                  @change="handlechange"
                  clearable>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名" prop="creatorName">
                <el-input v-model="addForm.creatorName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="creatorPhone">
                <el-input v-model="addForm.creatorPhone"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="位置信息" prop="location">
                <el-input type="textarea" v-model="addForm.location" :rows="2"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述信息" prop="content">
                <el-input type="textarea" v-model="addForm.content" :rows="2"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件信息">
                <el-upload
                  class="upload-demo"
                  :action="action"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="onSuccess"
                  :before-remove="beforeRemove"
                  :limit="3"
                  multiple
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div style="height: 32px">
                  <el-col style="text-align: center;margin:10px 0;">
                    <el-button type="primary" @click="saveDraft()">保存草稿</el-button>
                    <el-button type="primary" @click="onSubmit()">确认</el-button>
                    <el-button plain @click="onCancel()">取消</el-button>
                  </el-col>
                </div>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
  import {
    getcategory
  } from '@/api/smartProperty/dictionaries'
  import {addWorkOrders} from '@/api/smartProperty/workManagement'

  export default {
    name: 'CreateWork',
    props: {
      rowData: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        action:process.env.VUE_APP_BASE_API+'/file/pm/fastdfs/upload/picture',
        createWorkShow: true,
        assignment: true,
        repairType: [],
        addForm: {
          repairType: '',
          type: '',
          creator: '',
          creatorPhone: '',
          creatorName: '',
          location: '',
          content: '',
          submit: true,
          mediaMeta: {
            pictures: [],
            videos: [],
          },
        },
        repairWorkOrderTypes: [],
        type: [
          {
            value: "enterprise",
            name: "企业报修"
          },
          {
            value: "public",
            name: "公共报修"
          }
        ],
        addFormRules: {
          type: [
            {required: true, message: '请选择工单类型', trigger: ['blur']}
          ],
          repairType: [
            {required: true, message: '请选择报修分类', trigger: ['blur']}
          ],
          creatorName: [
            {required: true, message: '请输入姓名', trigger: ['blur', 'change']}
          ],
          creatorPhone: [
            {required: true, message: '请输入联系电话', trigger: ['blur', 'change']},
            {validator: this.validatePhoneTwo, trigger: ['blur', 'change']}
          ],
          location: [
            {required: true, message: '请输入位置信息', trigger: ['blur', 'change']}
          ],
        },
        options: [],
        selectedOptions: [],
        typeProps: {
          value: 'name',
          label: 'name',
          children: 'children'
        },
        fileList: [],
        title: "",
      }
    },
    mounted() {
      this.getcategorys();
      let obj = JSON.parse(JSON.stringify(this.rowData));
      if (Object.keys(obj).length != 0) {
        this.addForm = this.rowData;
        console.log(this.addForm, '124151235');
        if (this.rowData.mediaMeta != null) {
          this.rowData.mediaMeta.pictures.forEach(item => {
            this.fileList.push(item);
          })
        }
        this.selectedOptions = this.addForm.repairType;


        this.title = "编辑"
      } else {
        this.title = "添加"
      }
    },
    methods: {
      getcategorys() {
        let obj = {url: "/pm/repair/category/query/tree", method: "GET"};
        getcategory(obj.url, obj.method).then(res => {
          if (res.meta.status === 200) {
            this.options = res.data;
          }
        }).catch(err => {
        })
      },

      /* 是否手机号码或者固话*/
      validatePhoneTwo(rule, value, callback) {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
        if (value === '' || value === undefined || value == null) {
          callback()
        } else {
          if ((!reg.test(value)) && value !== '') {
            callback(new Error('请输入正确的电话号码或者固话号码'))
          } else {
            callback()
          }
        }
      },
      saveDraft() {
        this.addForm.submit = false;
        this.onSubmit();
      },
      onSubmit() {
        this.addForm.repairType = this.selectedOptions[this.selectedOptions.length - 1] + '';
        let obj = {};
        if (this.title == "添加") {
          obj = {url: "/pm/repair/order/add", method: "POST"};
        } else if (this.title == "编辑") {
          obj = {url: "/pm/repair/order/update", method: "PUT"};
          this.addForm.submit = true;
        }
        let data = this.addForm;
        this.$refs.form.validate((valid) => {
          if (valid) {
            addWorkOrders(obj.url, obj.method, data).then(res => {
              if (res.code === 200) {
                this.$message.success('添加成功');
                this.onCancel();
              } else {
                this.$message.error('添加失败')
              }
            }).catch(err => {
              this.$message.error(err.message);
            })


          }
        })
      },
      onCancel() {
        this.addForm = {
          repairType: '',
          type: '',
          creator: '',
          creatorPhone: '',
          creatorName: '',
          location: '',
          content: '',
          submit: false,
        };
        this.$emit('createWorkVisibleShow', true);
      },
      handlechange() {
        console.log(this.selectedOptions);
      },
      handleRemove(file, fileList) {
        if (file.raw.type.indexOf('image') != -1) {
          const index = this.addForm.mediaMeta.pictures.findIndex(text => text.name === file.name);
          this.addForm.mediaMeta.pictures.splice(index, 1);
        }
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      beforeUpload(fileList) {
        console.log(fileList, 'upload');
      },
      onSuccess(response, file, fileList) {
        console.log(file, '1234124');
        if (file.raw.type.indexOf('image') != -1) {
          this.addForm.mediaMeta.pictures.push(response.data);
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .backgroundcolor {
    background-color: #202230;
    border-radius: 8px;
  }

  .pClass {
    font-weight: 900;
    color: #fff;
    font-size: 16px;
  }

  .el-form .el-select {
    width: 100%;
  }

  .transparent {
    background-color: transparent;
  }

  ::v-deep .el-transfer-panel {
    background-color: #202230;
    .el-transfer-panel__header {
      background-color: transparent !important;
      .el-checkbox .el-checkbox__label {
        color: #ffffff !important;
      }
    }
    .el-transfer-panel__body {
      .el-checkbox .el-checkbox__label {
        color: #ffffff !important;
      }
    }
  }

  ::v-deep.el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }

  .bottomheight {
    height: calc(100vh - 500px - 20px - 42px)
  }

  ::v-deep.wl-transfer {
    width: 80% !important;
  }

  ::v-deep.wl-transfer .el-tree {
    background-color: #202230;
  }

  ::v-deep.wl-transfer .transfer-title {
    background-color: #202230;
    color: #fff;
  }
</style>
