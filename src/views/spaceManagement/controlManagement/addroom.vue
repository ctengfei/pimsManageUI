<template>
    <div>
        <div>
          <h4 class='titleName'>{{titleName}}</h4>
          <el-form label-width="80px" ref="controlRuleForm" :model="controlRuleForm" :rules="controlRules">
            <el-form-item label="所属园区" v-if="addType==='ADD'" prop="spaceRoom.rentedId" :rules="[
                { required: true, message: '请选择所属园区', trigger: ['blur', 'change'] }
                ]">
              <el-select
                      v-model="controlRuleForm.spaceRoom.rentedId"
                      placeholder="请选择所属园区"
                      style="width:100%"
                      @change='selectChange'
                      disabled
                    >
                      <el-option
                        v-for="item in zoneNames"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="所属园区" v-else-if="addType==='EDIT'" prop="spaceRoom.zoneTreeNodeId"  :rules="[
                { required: true, message: '请选择所属园区', trigger: ['blur', 'change'] }
                ]">
              <el-select
                      v-model="controlRuleForm.spaceRoom.zoneTreeNodeId"
                      placeholder="请选择所属园区"
                      style="width:100%"
                      @change='selectChange'
                      disabled
                    >
                      <el-option
                        v-for="item in zoneNames"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                  </el-select>
            </el-form-item>
             <el-form-item label="所属楼宇"  v-if="addType==='ADD'" prop="pid">
              <el-select
                      v-model="controlRuleForm.pid"
                      placeholder="请输入所属楼宇"
                      style="width:100%"
                      @change='selectChangeFloor'
                      disabled
                    >
                      <el-option
                        v-for="item in floorNames"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="所属楼宇" v-else-if="addType==='EDIT'" prop="spaceRoom.buildingTreeNodeId">
              <el-select
                      v-model="controlRuleForm.spaceRoom.buildingTreeNodeId"
                      placeholder="请输入所属楼宇"
                      style="width:100%"
                      @change='selectChangeFloor'
                      disabled
                    >
                      <el-option
                        v-for="item in floorNames"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                  </el-select>
            </el-form-item>

            <el-form-item label="房间名称" prop="spaceRoom.name"  :rules="[
                { required: true, message: '请输入房间名称', trigger: ['blur', 'change'] }
                ]">
              <el-input v-model.trim="controlRuleForm.spaceRoom.name" placeholder="请输入房间名称"></el-input>
            </el-form-item>
            <el-form-item label="建筑面积" prop="spaceRoom.accruedArea" :rules="[
                { required: true, message: '请输入总面积(m²)', trigger: ['blur', 'change'] }
                ]">
              <el-input v-model.trim="controlRuleForm.spaceRoom.accruedArea" onkeyup="value=value.replace(/[^\d^\.]+/g,'')" placeholder="请输入总面积"></el-input>
            </el-form-item>
            <el-form-item label="经营用途"  align='left' prop="spaceRoom.usageMode" :rules="[
                { required: true, message: '请选择经营用途', trigger: ['blur', 'change'] }
                ]">
              <el-radio-group v-model="controlRuleForm.spaceRoom.usageMode">
                  <el-radio label="SELF_USE">自用</el-radio>
                  <el-radio label="RENTED">可租赁</el-radio>
                </el-radio-group>
            </el-form-item>
                <h4 class='titleName'>图片信息</h4>
              <el-form-item label="上传图片" prop="spaceRoom.picture" ref="picture" :rules="[
                { required: true, message: '请上传图片', trigger: ['blur', 'change'] }
                ]">
              <div class="">只能上传jpg/png文件</div>
              <el-upload
                  class="avatar-uploader"
                  :action="action"
                  accept=".jpg,.jpeg,.png"
                  :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
                  :on-progress='handleProgress'
                  :on-success="handleAvatarSuccess"
                  :show-file-list="false">
                  <img v-if="controlRuleForm.spaceRoom.picture" :src="NET.BASE_URL+controlRuleForm.spaceRoom.picture" class="avatar" style="object-fit: cover;">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span  class='btnBox'>
              <el-button type="primary"  @click="submitFloor(addType,controlRuleForm.spaceRoom)">保存</el-button>
              <el-button plain @click="resetForm(controlRuleForm)">取消</el-button>
        </span>
      </div>
</template>
<script>
import { getControlTree,listData } from '@/api/spaceManagement/controlManagement'
import {toArr,queryTree} from '@/utils/index'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
import pubsub from 'pubsub-js'
export default {
  props:['parkInfors','addType','roomId','treePid','selfId','nodeId','start'],
    data(){
        return {
        action:process.env.VUE_APP_BASE_API+'/file/pm/fastdfs/upload/picture',
        zoneDept:[],
        // loading:false,
        titleName:'房间信息',
        controlRuleForm:{
          pid:'',
         spaceRoom:{
           picture: '',
           usageMode:'SELF_USE'
         }
        },
        controlRules:{
            pid: [{required: true, message: '请输入园区名称', trigger: 'blur'}],
            area: [{required: true, message: '请输入总建筑面积(m²)', trigger: 'blur'}],
            accruedArea: [{required: true, message: '请输入经营面积(m²)', trigger: 'blur'}],
        },
        parkImg:'',
        floorName:'',
        floorNames:[],
        zoneNames:[],
        permission:{
          treeAll:'spaceManagement::controlManagement::treeAll',
          editroom:'spaceManagement::controlManagement::editRoom',
          addroom:'spaceManagement::controlManagement::addRoom',
          floorList:'spaceManagement::controlManagement::floorList',
          uploadImage:'upload::image',
          roomById:'spaceManagement::controlManagement::roomById',
          roomList:'spaceManagement::controlManagement::roomList',
        },
      }
    },
    watch:{
      start(cur,old){
        if(cur){
          this.roomById({id:this.selfId})
        }else{
          this.controlRuleForm={
            pid:this.treePid,
            spaceRoom:{
              rentedId:this.nodeId,
              picture: '',
              usageMode:'SELF_USE'
            }
          };
        }
      }
    },
    created(){
      this.controlRuleForm.spaceRoom.rentedId=this.nodeId
      this.controlRuleForm.pid=this.treePid
      console.log(this.NET.BASE_URL,'this.NET.BASE_URL')
    },
    mounted(){
      this.initTreedata()
      this.$nextTick(() => {
        if(this.start){
          this.roomById({id:this.selfId})
        }
      })
    },
    methods:{
         // 根据ID查询房间信息
  roomById(params){
      //let obj = getObjByKey(this.permission.roomById)
      getControlTree('/pm/room','get',params).then(res=>{
        if(res.code===200){
           this.controlRuleForm.spaceRoom=JSON.parse(JSON.stringify(res.data))
           this.controlRuleForm.pid=res.data.buildingTreeNodeId
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
  },
       // 获取所有的园区信息
     initTreedata(){
        //let obj = getObjByKey(this.permission.treeAll);
      let parmas  = {
          nodeType:'DIR',
        }
      getControlTree('/pm/space/tree/whole','get',parmas).then(res=>{
        if(res.code===200){
           pubsub.publish('roomDept',res.data)
           pubsub.publish('roomtreeDept',res.data)
            let arr=toArr(JSON.parse(JSON.stringify(res.data)))
            this.zoneNames=arr.filter(x=>x.type==='ZONE')
            this.zoneDept=arr.filter(x=>x.type!=='ITEM')
            this.floorNames=arr.filter(x=>x.type==='BUILDING')

        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
      selectChange(val){
        this.controlRuleForm.spaceRoom.rentedId=val
        let n=queryTree(this.zoneDept)
        this.floorNames=n.filter(x=>x.id===val)[0].children
      },
      selectChangeFloor(val){
        this.controlRuleForm.pid=val
      },
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
        this.controlRuleForm.spaceRoom.picture = res.data.path
        this.$refs['picture'].clearValidate()
       },
      submitFloor(type,data){
          this.$refs['controlRuleForm'].validate(valid=>{
          if(valid){
            if(type==='EDIT'){
                //let obj = getObjByKey(this.permission.editroom);
                let datas={
                  pid:this.controlRuleForm.pid,
                  spaceRoom:this.controlRuleForm.spaceRoom
                }
                console.log(datas,'编辑')
                listData('/pm/room','put',datas).then(res=>{
                  if(res.code===200){
                    this.$message({
                      message: '编辑成功',
                      type: 'success'
                    })
                    this.getParkRenfrenceId(this.controlRuleForm.pid)
                    this.initTreedata()
                    this.resetForm()
                  }else{
                    this.$message({
                      message: res.meta.message,
                      type: 'error'
                    })
                    this.resetForm()
                  }
                })
            }else if(type==='ADD'){
              //let obj = getObjByKey(this.permission.addroom);
                let data={
                  pid:this.controlRuleForm.pid,
                  spaceRoom:this.controlRuleForm.spaceRoom
                }
                listData('/pm/room','post',data).then(res=>{
                  if(res.code===200){
                     this.$message({
                        message: '新增成功',
                        type: 'success'
                      })
                      this.resetForm()
                       this.initTreedata()
                      this.getParkRenfrenceId(this.controlRuleForm.pid)
                  }else{
                    this.$message({
                      message: res.meta.message,
                      type: 'error'
                    })
                    this.resetForm()
                  }
                })
            }
          }
         })
        },
      getParkRenfrenceId(data){
        this.roomAll({pid:data})
      },
      // 所有房间列表
  roomAll(params){
     //let obj = getObjByKey(this.permission.roomList);
      getControlTree('/pm/room/all','get',params).then(res=>{
        if(res.code===200){
           pubsub.publish('roomDataEven',res.data)
           pubsub.publish('roomFloor',res.data)
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
          this.controlRuleForm.spaceRoom.rentedId=this.nodeId
          this.controlRuleForm.pid=this.treePid
          this.controlRuleForm.spaceRoom.picture = ''
          this.$emit('showroom',false)
        },
        handleProgress(){
            // this.loading = true;
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
  color: #606266;
  text-align: left;
  font-weight:700;
  font-size: 16px;
}
.el-form-item{
  display: inline-block;
  width:48%;
  margin-right: 8px;
  /* margin-right: 100px; */
}
    .btnBox{
    display: block;
    margin: 20px 0;
    text-align: end;
  }
</style>
