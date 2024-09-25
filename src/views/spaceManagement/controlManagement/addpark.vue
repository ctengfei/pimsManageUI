<template>
    <div>
      <el-form label-width="80px" ref="controlRuleForm" :model="controlRuleForm" :rules="controlRules">
        <div>
          <h4 class='titleName'>{{titleName}}</h4>
            <el-form-item label="园区名称" prop="name">
              <el-input v-model.trim="controlRuleForm.name" placeholder="请输入园区名称"></el-input>
            </el-form-item>
            <el-form-item label="建筑面积" prop="area">
              <el-input v-model.trim="controlRuleForm.area" placeholder="总面积(m²)" onkeyup="value=value.replace(/[^\d^\.]+/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="所在位置" prop="address">
              <el-input v-model.trim="controlRuleForm.address"  placeholder="请输入所在位置"></el-input>
            </el-form-item>
            <el-form-item label="园区简介" prop="description">
              <el-input type='textarea' v-model.trim="controlRuleForm.description"  placeholder="园区简介"></el-input>
            </el-form-item>
        </div>
        <div>
          <h4 class='titleName'>图片信息</h4>
            <el-form-item label="上传图片" prop="picture" ref="picture">
              <div class="">只能上传jpg/png/jpeg文件</div>
              <el-upload
                  class="avatar-uploader"
                  :action="action"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  accept=".jpg,.jpeg,.png"
                  :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="controlRuleForm.picture" :src="NET.BASE_URL+controlRuleForm.picture" class="avatar" style="object-fit: cover;">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
        </div>
        </el-form>
        <div slot="footer">
           <span class='btnBox'>
              <el-button type="primary" @click="submitPark(addType,rowData)">保存</el-button>
              <el-button plain @click="resetForm()">取消</el-button>
           </span>
        </div>
    </div>
</template>
<script>
import { getControlTree,listData } from '@/api/spaceManagement/controlManagement'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
import pubsub from 'pubsub-js'
export default {
    props:['rowData','treePid','addType','start'],
    data(){
        return {
        // alertTyp:'',
        titleName:'园区信息',
        groupDialogShow: false,
        pid:this.treePid,
        controlRuleForm:{
          picture: ''
        },
         permission:{
           treeAll:'spaceManagement::controlManagement::treeAll',
           areaAll:'spaceManagement::controlManagement::areaAll',
          editarea:'spaceManagement::controlManagement::editarea',
          addarea:'spaceManagement::controlManagement::addarea',
          delarea:'spaceManagement::controlManagement::delarea',
          uploadImage:'upload::image'
        },
        controlRules:{
            name: [{required: true, message: '请输入园区名称', trigger: 'blur'}],
            builtAreaTotal: [{required: true, message: '请输入总建筑面积(m²)', trigger: 'blur'}],
            area: [{required: true, message: '请输入建筑面积(m²)', trigger: 'blur'}],
            picture: [{ required: true, message: '请上传图片', trigger: ['blur', 'change'] }]
        },
        fileList:[],
        imgName:'',
        // 提交给后台的地址
        action:process.env.VUE_APP_BASE_API+'/file/pm/fastdfs/upload/picture',
        }
    },
    watch:{
      start(cur){
        if(cur){
          this.controlRuleForm=JSON.parse(JSON.stringify(this.rowData))
        }else{
          this.controlRuleForm={};
        }
      }
    },
    mounted(){
      this.$nextTick(()=>{
        if(this.start){
          this.controlRuleForm=JSON.parse(JSON.stringify(this.rowData))
        }
      })
    },
    methods:{
       // 上传前格式和图片大小限制
      beforeAvatarUpload(file) {
        const type = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!type) {
          this.$message.error('图片格式不正确!(只能包含jpg，pngJPEG)')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return type && isLt2M
      },
      handleAvatarSuccess(res, file, fileList) {
        this.controlRuleForm.picture=res.data.path
        this.$refs.picture.clearValidate()
       },
      submitPark(type,data){
        console.log(this.addType,'123');
        console.log(type,'type');
          this.$refs['controlRuleForm'].validate(valid => {
            if (valid) {
              if(type==='EDIT'){

              //let obj = getObjByKey(this.permission.editarea);
              let datas={
                pid:1,
                spaceZone:this.controlRuleForm
              }
              listData('/pm/zone','put',datas).then(res=>{
                if(res.code===200){
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                  this.initTreedata()
                  this.areaAll({pid:1})
                  this.resetForm()
                }else{
                  this.$message({
                    message: res.meta.message,
                    type: 'error'
                  })
                }
              })
              console.log('验证通过')
          }else if(type==='ADD'){

            //let obj = getObjByKey(this.permission.addarea);
              let data={
                pid:1,
                spaceZone:this.controlRuleForm
              }
              listData('/pm/zone','post',data).then(res=>{
                if(res.code===200){
                    this.$message({
                      message: '新增成功',
                      type: 'success'
                    })
                    this.resetForm()
                    this.initTreedata()
                    this.areaAll({pid:1})
                }else{
                  this.$message({
                    message: res.meta.message,
                    type: 'error'
                  })
                }
              })
          }
            }
          })
        },
     initTreedata(){
       //let obj = getObjByKey(this.permission.treeAll);
      let parmas  = {
          nodeType:'DIR',
        }
      getControlTree('/pm/space/tree/whole','get',parmas).then(res=>{
        if(res.code===200){
          pubsub.publish('parkTreeData',res.data)
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
        // 所有园区列表
    areaAll(params){
       //let obj = getObjByKey(this.permission.areaAll);
      getControlTree('/pm/zone/all','get',params).then(res=>{
        if(res.code===200){
          pubsub.publish('parkData',res.data)
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    resetForm(){
      this.$refs['controlRuleForm'].resetFields()
      this.controlRuleForm.picture = ''
      this.$emit('showPark',false)
    },
    }
}
</script>
<style scoped>
.titleName{
  padding:0;
  margin:0;
  margin-bottom:20px;
  padding-bottom:10px;
  /* border-bottom:1px solid rgb(49, 52, 72); */
  /* color:#909399; */
  color: #606266;
  text-align: left;
  font-weight:700;
  font-size:16px;
}
::v-deep .el-form-item--small.el-form-item{
  width:90%;
  margin-bottom: 20px !important;
}
  .btnBox{
    display: block;
    margin: 20px 0;
    text-align: end;
  }
</style>
