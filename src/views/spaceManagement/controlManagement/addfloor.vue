<template>
    <div class="app-container">
      <h4 class='titleName'>{{titleName}}</h4>
      <el-form label-width="80px" ref="controlRuleForm" :model="controlRuleForm" :rules="controlRules">
        <el-form-item label="所属园区" prop="pid">
          <el-select
                  v-model="controlRuleForm.pid"
                  clearable
                  placeholder="请输入所属园区"
                  style="width:100%"
                  @change='selectChange'
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
        <el-form-item label="楼宇名称" prop="spaceBuilding.name" :rules="[
            { required: true, message: '请输入楼宇名称', trigger: ['blur', 'change'] }
            ]">
          <el-input v-model.trim="controlRuleForm.spaceBuilding.name" placeholder="请输入楼宇名称"></el-input>
        </el-form-item>
        <el-form-item label="总面积" prop="spaceBuilding.area" :rules="[
            { required: true, message: '请输入总面积(m²)', trigger: ['blur', 'change'] }
            ]">
          <el-input v-model.trim="controlRuleForm.spaceBuilding.area" onkeyup="value=value.replace(/[^\d^\.]+/g,'')" placeholder="请输入总面积"></el-input>
        </el-form-item>
        <el-form-item label="计费面积" prop="spaceBuilding.accruedArea" :rules="[
            { required: true, message: '请输入计费面积', trigger: ['blur', 'change'] }
            ]">
          <el-input  v-model.trim="controlRuleForm.spaceBuilding.accruedArea" placeholder="请输入计费面积"></el-input>
        </el-form-item>
        <el-form-item label="建筑日期" prop="spaceBuilding.constructionDate">
          <el-date-picker
            v-model="controlRuleForm.spaceBuilding.constructionDate"
            type="date"
            value-format='yyyy-MM-dd'
            placeholder="请选择建筑日期">
          </el-date-picker>
          <!-- <el-input v-model="controlRuleForm.spaceBuilding.constructionDate"  placeholder="请输入建筑日期"></el-input> -->
        </el-form-item>

        <el-form-item label="竣工日期" prop="spaceBuilding.completionDate">
          <el-date-picker
            v-model="controlRuleForm.spaceBuilding.completionDate"
            type="date"
              value-format='yyyy-MM-dd'
            placeholder="请选择竣工日期">
          </el-date-picker>
          <!-- <el-input v-model="controlRuleForm.spaceBuilding.completionDate"  placeholder="请输入竣工日期"></el-input> -->
        </el-form-item>
        <el-form-item label="楼宇地址" prop="spaceBuilding.address" :rules="[
            { required: true, message: '请输入楼宇地址', trigger: ['blur', 'change'] }
            ]">
          <el-input v-model.trim="controlRuleForm.spaceBuilding.address"  placeholder="请输入楼宇地址"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="spaceBuilding.longitude">
          <el-input v-model="controlRuleForm.spaceBuilding.longitude" placeholder="请输入经度" @focus="ChooseDialog"/>
        </el-form-item>
        <el-form-item label="纬度" prop="spaceBuilding.latitude">
          <el-input v-model="controlRuleForm.spaceBuilding.latitude" placeholder="请输入纬度" @focus="ChooseDialog"/>
        </el-form-item>
        <el-form-item label="楼宇简介" prop="spaceBuilding.description">
          <el-input type='textarea' v-model.trim="controlRuleForm.spaceBuilding.description"  placeholder="楼宇简介"></el-input>
        </el-form-item>
        <h4 class='titleName'>图片信息</h4>
        <el-form-item label="上传图片" ref="picture" prop="spaceBuilding.picture" :rules="[
            { required: true, message: '请上传图片', trigger: ['blur', 'change'] }
            ]">
          <div class="">只能上传jpg/png文件</div>
          <el-upload
              class="avatar-uploader"
              :action="action"
              accept=".jpg,.jpeg,.png"
              :on-progress='handleProgress'
              :on-success="handleAvatarSuccess"
              :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
              :show-file-list="false">
              <img v-if="controlRuleForm.spaceBuilding.picture" :src="NET.BASE_URL+controlRuleForm.spaceBuilding.picture" class="avatar" style="object-fit: cover;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span  class='btnBox'>
            <el-button type="primary" @click="submitFloor(addType,controlRuleForm.spaceBuilding)">保存</el-button>
            <el-button plain @click="resetForm(controlRuleForm)">取消</el-button>
      </span>
      <el-dialog
        width="90%"
       
        title="选择经纬度"
        :visible.sync="ChooseDialogShow"
        append-to-body
      >
        <point-map
          ref="gisMap1"
          @map-location="maplocation"
        ></point-map>
        <div slot="footer" style="text-align:center;">
          <el-button type="primary" @click="mapadd">添加</el-button>
          <el-button @click="mapcancel" plain>取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { getControlTree,listData } from '@/api/spaceManagement/controlManagement'
import {toArr,queryTree} from '@/utils/index'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
import pubsub from 'pubsub-js'
import pointMap from "@/components/common/map/point-map";
export default {
  props:['treeData','addType','treePid','nodeId','selfId','dataRow','start'],
  components:{ pointMap },
   
    data(){
       // form表单自定义验证规则，开始时间不可大于结束时间
    var startTimeRules = (rule, value, callback) => {
      console.log(value,'value')
        if(!value){
            callback(new Error('请选择建筑日期'));
        }else{
            if(this.timeCompare()){
                callback(new Error('建筑日期必须早于竣工日期'));
            }else {
                callback();
            }
        }
    }
    // 结束时间不可小于开始时间
    var endTimeRules = (rule, value, callback) => {
        if(!value){
            callback(new Error('请选择竣工日期'));
        }else{
            if(this.timeCompare()){
                callback(new Error('竣工日期必须晚于建筑日期'));
            }else {
                callback();
            }
        }
    }
        return {
        ChooseDialogShow: false,
        latitudearr: [],
        action:process.env.VUE_APP_BASE_API+'/file/pm/fastdfs/upload/picture',
        // loading:false,
        titleName:'楼宇信息',
        controlRuleForm:{
         pid:this.treePid,
         constructionDate:'',
         completionDate:'',
         spaceBuilding:{
           picture: '',
           constructionDate:'',
           completionDate:'',
         }
        },
        controlRules:{
            pid: [{required: true, message: '请选择园区名称', trigger: 'blur'}],
            constructionDate: [{ required: true, validator: startTimeRules, trigger: 'change' }],
            completionDate: [{ required: true, validator: endTimeRules, trigger: 'change' }]
        },
        parkImg:'',
        floorName:'',
        // 园区信息
        floorNames:[],
        // 临时存放的园区信息
        zoneDept:[],
        permission:{
          treeAll:'spaceManagement::controlManagement::treeAll',
          editfloor:'spaceManagement::controlManagement::editFloor',
          addfloor:'spaceManagement::controlManagement::addFloor',
          delfloor:'spaceManagement::controlManagement::delFloor',
          floorList:'spaceManagement::controlManagement::floorList',
           floorRoom:'spaceManagement::controlManagement::floorRoom',

          uploadImage:'upload::image'
        },
      }
    },
    watch:{
      start(cur,old){
        if(cur){
            this.floorRoom({id:this.selfId,pid:this.treePid})
            this.controlRuleForm.pid=this.treePid
        }else{
          this.controlRuleForm = {
            pid:this.treePid,
            spaceBuilding:{
              picture: ''
            }
          }
        }
      }
    },
    mounted(){
      this.initTreedata()
      this.$nextTick(()=>{
        this.controlRuleForm.pid=this.treePid
        if(this.start){
          this.floorRoom({id:this.selfId,pid:this.treePid})
          this.controlRuleForm.pid=this.treePid
        }
      })
      this.controlRuleForm.pid=this.treePid
    },
    methods:{
      timeCompare(){
            let endDate = new Date(this.controlRuleForm.completionDate );
            let endGetTime = endDate.getTime();
            let startDate = new Date(this.controlRuleForm.constructionDate);
            let startGetTime = startDate.getTime();
            if(startGetTime != 0 && endGetTime != 0 && startGetTime > endGetTime){
                return true
            }
        }, 
      maplocation(e) {
        this.latitudearr=e;
        this.$refs.gisMap1.clearLayer();
        const arr = [
            {
                src: require("@/assets/images/mapImg/position.png"),
                coord: [e[0],e[1]],
            },
        ];
        this.$refs.gisMap1.addMarket(arr, "position");
      },
      mapadd(){
        this.controlRuleForm.spaceBuilding.longitude = this.latitudearr[0]
        this.controlRuleForm.spaceBuilding.latitude = this.latitudearr[1]
        this.mapcancel()
      },
      mapcancel(){
        this.ChooseDialogShow = false;
      },
      ChooseDialog(){
        this.ChooseDialogShow = true
        this.$nextTick(() => {
          if(this.controlRuleForm.spaceBuilding.longitude && this.controlRuleForm.spaceBuilding.latitude){
            this.$refs.gisMap1.clearLayer();
            const arr = [
                {
                    src: require("@/assets/images/mapImg/position.png"),
                    coord: [+this.controlRuleForm.spaceBuilding.longitude,+this.controlRuleForm.spaceBuilding.latitude],
                },
            ];
            this.$refs.gisMap1.addMarket(arr, "position");
          }
        })
      },
      floorRoom(params){
      //let obj = getObjByKey(this.permission.floorRoom);
      console.log(params,',..11')
      getControlTree('/pm/building','get',params).then(res=>{
         if(res.code===200){
           this.controlRuleForm.spaceBuilding=JSON.parse(JSON.stringify(res.data))
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
           pubsub.publish('zoneDept',res.data)
           pubsub.publish('treeDept',res.data)
            let arr=toArr(JSON.parse(JSON.stringify(res.data)))
            this.floorNames=arr.filter(x=>x.type==='ZONE')
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
      selectChange(val){
        this.controlRuleForm.pid=val
        console.log(val,'val')
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
        this.controlRuleForm.spaceBuilding.picture=res.data.path
        this.$refs['picture'].clearValidate()
       },
      submitFloor(type,data){
        this.$refs['controlRuleForm'].validate(valid => {
          if (valid) {
            if(type==='EDIT'){
               console.log('编辑')
               //let obj = getObjByKey(this.permission.editfloor);
               this.controlRuleForm.spaceBuilding.constructionDate = this.controlRuleForm.constructionDate
               this.controlRuleForm.spaceBuilding.completionDate = this.controlRuleForm.completionDate
                let data={
                  pid:this.controlRuleForm.pid,
                  spaceBuilding:this.controlRuleForm.spaceBuilding
                }
                listData('/pm/building','put',data).then(res=>{
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
                  }
                })
                console.log('验证通过')
            }else if(type==='ADD'){
               //let obj = getObjByKey(this.permission.addfloor);
                this.controlRuleForm.spaceBuilding.constructionDate = this.controlRuleForm.constructionDate
               this.controlRuleForm.spaceBuilding.completionDate = this.controlRuleForm.completionDate
                let data={
                  pid:this.controlRuleForm.pid,
                  spaceBuilding:this.controlRuleForm.spaceBuilding
                }
                console.log(data,'dara')
                listData('/pm/building','post',data).then(res=>{
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
                  }
                })
            }
          }
        })
      },
      getParkRenfrenceId(data){
        this.floorAll({pid:data})

      },
        // 所有楼层列表
      floorAll(params){
        //let obj = getObjByKey(this.permission.floorList);
          getControlTree('/pm/building/all','get',params).then(res=>{
            if(res.code===200){
              pubsub.publish('floorData',res.data)
              pubsub.publish('editFloor',res.data)
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
          this.controlRuleForm.spaceBuilding.picture=''
          this.$emit('showfloor',false)
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
  color:#606266;
  text-align: left;
  font-weight: 700;
  font-size:16px;
}
.el-form-item{
  display: inline-block;
  width:48%;
  margin-right: 8px;
  vertical-align: top;
}
    .btnBox{
    display: block;
    margin: 20px 0;
    text-align: end;
  }
  ::v-deep.el-date-editor.el-input{
    width:100%;
  }
  #iGisMap {
  height: calc(100vh - 300px);
}
::v-deep.v-modal{
      z-index: auto !important;
}

</style>
