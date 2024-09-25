<template>
    <div class="app-container">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="信息类型" prop="informationType">
                <el-select v-model="ruleForm.informationType" placeholder="请选择信息类型">
                    <el-option label="紧急通知" value="emergency"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布方式" prop="publishType">
                <el-select v-model="ruleForm.publishType" placeholder="请选择发布方式">
                    <el-option label="室外显示屏" value="outdoorDisplayScreen"></el-option>
                    <el-option label="路灯显示屏" value="streetLightDisplayScreen"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="width: 50%;" label="信息标题" prop="title">
                <el-input v-model="ruleForm.title"  placeholder="请输入信息标题"></el-input>
            </el-form-item>
            <el-form-item style="width: 50%;" label="发布内容" prop="content">
                <el-input class="info-textarea" rows="8" type="textarea" placeholder="请输入发布内容" v-model="ruleForm.content"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import $detectionAlarm from "@/api/environMonitor/detectionAlarm";
  export default {
    name:"InformatPublish",
    data() {
      return {
        ruleForm: {
            content: '',
            publishType: '',
            informationType: '',
            title: '',
            pageNum: 1,
            pageSize: 1,
        },
        rules: {
            content: [
                { required: true, message: '请输入发布内容', trigger: ['blur', 'change'] },
            ],
            publishType: [
                { required: true, message: '请选择发布方式', trigger: 'change' }
            ],
            title: [
                { required: true, message: '请输入信息标题', trigger: ['blur', 'change'] },
            ],
            informationType: [
                { required: true, message: '请选择信息类型', trigger: 'change' }
            ],
        }
      };
    },
    mounted(){
        this.getDetail()
    },
    methods: {
        // 获取发布内容
        getDetail(){
            $detectionAlarm.getInfoPublish(this.ruleForm).then(res=>{
                if(res.data.data.length){
                    this.ruleForm = res.data.data[0]
                }
                
            })
        },
        // 新增发布内容
        addPublish(){
            $detectionAlarm.addInfoPublish(this.ruleForm).then(res=>{
                this.$message.success("发布成功")
            })
        },
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.addPublish()
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
  }
</script>
<style lang="scss" scoped>


    .info-textarea {
        font-family:"微软雅黑" !important;
    }
    // #606266
    ::v-deep .info-textarea textarea::-webkit-input-placeholder{
        // color: #606266 !important;
        font-family:"微软雅黑" !important;
    }
    ::v-deep .info-textarea .el-textarea__inner{
        color: #606266 !important;
        font-family:"微软雅黑" !important;
    }
</style>