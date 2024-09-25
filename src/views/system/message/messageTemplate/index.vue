<template>
<div class="app-container">
  <el-table v-loading="loading" :data="messageTemplateList">
        <el-table-column :show-overflow-tooltip="true" prop="businessScene" label="业务场景"/>
        <el-table-column :show-overflow-tooltip="true" prop="businessStr" label="业务类型"/>
        <el-table-column :show-overflow-tooltip="true" prop="pushMessage" label="消息模板" ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="smsMessage" label="短信模板" ></el-table-column>
        <el-table-column label="操作" class-name="small-padding fixed-width" width="200">
          <template slot-scope="scope">
             <el-button 
              type="text" 
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog class="dialog-template" append-to-body :destroy-on-close="true" :visible.sync="showFlag" :title="title" width="600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="业务场景" prop="businessScene">
            <el-input v-model="form.businessScene" :disabled="true" />
          </el-form-item>
          <el-form-item label="模板可用参数" prop="paramsList">
            <el-table :data="form.paramsList">
              <el-table-column align="left" label="参数" prop="key"></el-table-column>
              <el-table-column align="left" label="参数描述" prop="value"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="消息模板" prop="pushMessage">
            <el-input  v-model="form.pushMessage" type="textarea" resize="none" rows="4" />
          </el-form-item>
           <el-form-item label="短信模板" prop="smsMessage">
            <el-input v-model="form.smsMessage" type="textarea" resize="none" rows="4" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary"  @click="confirmContent">确定</el-button>
          <el-button plain @click="cancel">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import {listMessageTemplate,getMessageTemplate,updateMessageTemplate} from '@/api/system/message'
export default {
  name: "MessageTemplate",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 弹出层标题
      title: "",
      // 查询参数
      menuName: '',
      form:{
        businessScene:'',
        pushMessage:'',
        smsMessage:'',
        paramsList:[],
        messageType:''
      },
      messageTemplateList:[],
      showFlag:false,
      rules: {
         pushMessage: [
          { required: true, message: '请输入消息模板', trigger: 'blur' }
        ],
         smsMessage: [
          { required: true, message: '请输入短信模板', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
  },
  mounted(){
    this.init();
  },
  methods: {
    init() { 
      this.loading = false;
      listMessageTemplate().then(res => {
        this.messageTemplateList = res.data
      })
    },
     // 取消按钮
    cancel() {
      this.showFlag = false;
      this.$refs['form'].resetFields()
    },

  handleUpdate(row){
    let params = {
      messageTemplateType: row.messageType
    }
    getMessageTemplate(params).then(res => {
      this.title = "修改消息模板信息"
      this.form=res.data
      this.showFlag = true
    })
},
      //编辑
     confirmContent() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.messageType) {
            let data = {}
            data.messageType = this.form.messageType
            data.pushMessage = this.form.pushMessage
            data.smsMessage = this.form.smsMessage
            updateMessageTemplate(data).then(res => {
              this.$message.success("修改成功！");
              this.showFlag=false
              this.init()
              }
            );
          }
          }
      });
    }
    },
  }
</script>


<style lang="scss">
.dialog-template {
  .el-table th.is-leaf, .el-table td {
    border: none !important;
  }
  .el-table::before, .el-table--group::after, .el-table--border::after, .el-table .el-table__header-wrapper th, .el-table .el-table__fixed-header-wrapper th {
    background-color: transparent;
  }
}
</style>