<template>
  <div class="app-container" v-show='deviceDrawVisible' style="color:#fff;position:relative;baground:rgba(0,0,0,.7)">
    <el-row  :gutter="20">
      <el-col>
        <el-card class="box-card" style='margin-bottom:0;'>
            <div slot="header" class="clearfixs">
                <span class="clearfixsTitle" :style="{backgroundImage: 'url(' + jiantou + ')' }">基本信息</span>
                <div class='gobackCls' @click="onback">
                   <svg-icon icon-class="icon-goback" style="height: 30px;width: 16px;" />
                   <div class="icon-name">返回上一页</div>
                </div>
            </div>
            <el-form ref="deviceForm" :inline="true" :model="submitFormData" :rules="devicerule" class="demo-form-inline carBorder" label-width="85px" >
                <el-form-item label="设备类型" prop="type">
                  <!-- disabled="" -->
                  <el-select v-model="submitFormData.deviceType" placeholder="请选择设备类型" clearable disabled>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备名称" prop="name">
                    <el-input v-model="submitFormData.name" placeholder="请输入设备名称" clearable />
                </el-form-item>
                <el-form-item label="设备编号" prop="code">
                    <el-input v-model="submitFormData.deviceId" placeholder="请输入设备编号" clearable disabled/>
                </el-form-item>
                <el-form-item label="所属公司" prop="ip">
                  <el-select v-model="submitFormData.company" placeholder="请选择所属公司" :disabled="submitFormData.address == 0 ? true : false" clearable >
                    <el-option
                      v-for="item in companyDataList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否节能表" prop="monitors">
                  <el-select v-model="submitFormData.saving" placeholder="请选择是或否" clearable >
                    <el-option
                      v-for="item in savings"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在区域" prop="deviceLevel">
                  <el-select v-model="submitFormData.address" placeholder="请选择所在区域" clearable @change="changeAddresss" >
                    <el-option
                      v-for="item in addresss"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
        </el-card>
      </el-col>
    </el-row>
    <span slot="footer">
        <el-button type="primary" icon='el-icon-check' @click="onSubmit()">确定</el-button>
        <el-button plain icon='el-icon-close' @click="onCancel">取消</el-button>
    </span>
    <el-dialog title="设备厂商" :visible.sync="addPersonDialogShow" :before-close="closeAddPersonDialog" width="800px">
      <div style="display: flex;">
        <div class="peopleSearch">
           <!-- 搜索 -->
          <el-input
            v-model="blurry"
            clearable
           
            style="width:215px;"
            placeholder=" 请输入厂商名称 "
          />
          <el-button icon="el-icon-search" @click="search()" type="primary">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="reset()" plain>重置</el-button>

      </div>
      </div>
      <el-table
        height="530"
        element-loading-text="加载中"
        :data="manufacturerInforData"
       @row-click="selectChange"
      >
        <el-table-column width='50' align="left">
           <template slot-scope="scope">
            <el-radio v-model="radios" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="设备厂商名称"/>
        <el-table-column prop="phone" width='100' label="设备厂商电话"/>
        <el-table-column prop="contacter" width='300' label="设备厂商联系人"/>
        <el-table-column prop="address" label="设备厂商地址"/>
      </el-table>
      <span slot="footer">
        <el-button type="primary" @click="confirmAddPerson">添加</el-button>
        <el-button plain @click="cancelAddPerson" plain>取消</el-button>
      </span>
    </el-dialog>
        <el-dialog title="设备维保" :visible.sync="addmaintenanceDialogShow" :before-close="closemaintenanceDialog" width="800px">
      <div  style="display: flex;">
        <div class="peopleSearch">
           <!-- 搜索 -->
          <el-input
            v-model="blurrys"
            clearable
           
            style="width:215px;"
            placeholder=" 请输入维保单位名称 "
          />
          <el-button icon="el-icon-search" @click="searchmaintenance()" type="primary">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="resetmaintenance()" plain>重置</el-button>

      </div>
      </div>
      <el-table
        height="530"
        element-loading-text="加载中"
        :data="maintenanceInforData"
       @row-click="selectChangemaintenance"
      >
        <el-table-column width='50' align="left">
           <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="maintenanceCompany" label="维保单位"/>
        <el-table-column prop="phone" width='100' label="维保单位电话"/>
        <el-table-column prop="maintenanceContacter" width='300' label="维保单位联系人"/>
        <el-table-column prop="address" label="维保单位地址"/>
      </el-table>
      <span slot="footer">
        <el-button type="primary" @click="confirmmaintenance">添加</el-button>
        <el-button @click="cancelmaintenance" plain>取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {initData,unmounted,getDetailById} from '@/api/facility/information'
// treeByIdData
import {treeByIdDataAdd,treeByIdDataEdit,initCompanyData} from '@/api/facility/crameEnergyList'
import jiantou from '@/assets/images/jiantou.png'
import pagination from '@/components/comPagination'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
export default {
    name:'AddAndEditEnergy',
      components: {
        pagination
      },
    data(){
        return {
          companyDataList:[],
          options: [{
            value: '0',
            label: '水'
          }, {
            value: '1',
            label: '电'
          }],
          value: '',
          savings: [{
            value: '0',
            label: '否'
          }, {
            value: '1',
            label: '是'
          }],
          addresss: [{
            value: '0',
            label: '公共区域'
          }, {
            value: '1',
            label: '租户区域'
          }],
           jiantou,
            manufacturerInforData:[],
            addPersonDialogShow: false,
            personFilter:{},
            selectedPersonIds:{},
            radio:'',
            blurry:'',
            manufacturerData:[],
            maintenanceInforData:[],
            addmaintenanceDialogShow: false,
            // personFilter:{},
            maintenanceIds:{},
            radios:'',
            blurrys:'',
            maintenanceData:[],
          // 设备类型数据
          serviceData:[],
        //   接入协议的名称
          agreementData:[],
          // 获得的设备类型名称
          treeTypeSetData:[],
        //   获得接入协议的名称
          treeAgreementData:[],
          // 设备类型的编号
            treeType:[],
            defaultNameType:{
            label:'name',
            value:'type',
          },
            defaultNameAgreement:{
                label:'name',
                value:'type',
            },
            loading:false,
            // addAndEditShow:true,
            deviceDrawVisible: true,
            // 新增的表单
            submitFormData:{
                deviceManufacturer:{},
                deviceMaintenance:{},
                deviceType:"",
                saving:"",
                address:"",
                company:"",
            },
            deviceAreaCheck:'',
            deviceImgUrl: '',
            dialogVisible: false,
            parkImgUrl:'',
            action:'',
            // 校验
            devicerule: {
                code: [
                { required: false, message: '请输入设备编号', trigger: 'blur' }
                ],
                name: [
                { required: false, message: '请输入设备名称', trigger: ['blur', 'change'] }
                ],
                type:[
                { required: false, message: '请输入设备类型', trigger: 'blur' },
                ],
            },
            manufacturerrule:{
                name: [
                { required: true, message: '请输入设备厂商名称', trigger: ['blur', 'change'] }
                ],
            },
            maintenancerule:{
                 name: [
                { required: true, message: '请输入维保单位名称', trigger: ['blur', 'change'] }
                ],
            }
        }
    },
    computed:{
      deviceManufacturer(){
        return this.submitFormData.deviceManufacturer?this.submitFormData.deviceManufacturer:{}
      },
      deviceMaintenance(){
        return this.submitFormData.deviceMaintenance?this.submitFormData.deviceMaintenance:{}
      },
      deviceType(){
        return this.submitFormData.deviceType == "0"?"水":"电"
      },
      saving(){
        return this.submitFormData.saving == "0"?"是":"否"
      },
      address(){
        return this.submitFormData.address == "0"?"公共区域":"租户区域"
      },
      company(){
        return this.submitFormData.address == "0"?"":this.submitFormData.company
      }
    },
    props:['dialogVisibleType','rowData','deviceinforId','sysChildType'],
    mounted(){
      this.getInitCompanyData(),
      this.submitFormData.type=this.sysChildType
      this.submitFormData=this.rowData
      this.action=process.env.VUE_APP_BASE_API+'/file/pm/fastdfs/upload/picture'
    },
    methods:{
      changeAddresss(val){
        if (val == 0) {
          this.submitFormData.company = ""
        } else {
          this.submitFormData.company = this.submitFormData.company
        }
      },
      getInitCompanyData(){
        initCompanyData().then(res=>{
          this.companyDataList=res.data
        })
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
        this.parkImgUrl =res.data.path
       },
       // 勾选厂商
   selectChange(row) {
      this.selectedPersonIds = row
    },
         // 勾选维保
   selectChangemaintenance(row) {
      this.maintenanceIds = row
    },
         // 选择维保
    confirmmaintenance() {
      let data=this.maintenanceIds
      this.submitFormData.deviceMaintenance=data
      this.closemaintenanceDialog()
    },
        // 选择厂商
    confirmAddPerson() {
      let data=this.selectedPersonIds
      this.submitFormData.deviceManufacturer=data
      this.closeAddPersonDialog()
    },
    cancelAddPerson() {
      this.closeAddPersonDialog ()
    },
    // 关闭添加维保窗口
    closeAddPersonDialog() {
      this.addPersonDialogShow = false
      this.maintenanceIds = {}
    },
     cancelmaintenance() {
      this.closemaintenanceDialog ()
    },
    // 关闭添加维保窗口
    closemaintenanceDialog() {
      this.addmaintenanceDialogShow = false
      this.maintenanceIds = {}
    },
    search(){
      let obj = {
        url: '/pm/device/manufacturer',
        method: 'GET'
      }
        let params={
          manufacturerName:this.blurry
        }
        initData(obj.url,obj.method,params).then(res=>{
          this.manufacturerInforData=res.data
        })
    },
    // 获取维保信息
    searchmaintenance(){
       let obj = {
         url: '/pm/device/maintenance',
         method: 'GET'
       }
       let params={
           companyName:this.blurrys
       }
       initData(obj.url,obj.method,params).then(res=>{
        this.maintenanceInforData=res.data
       })
    },
     reset() {
      this.blurry=''
      this.search()
    },
     resetmaintenance() {
      this.blurrys=''
      this.searchmaintenance()
    },
    maintenance(){
        this.addmaintenanceDialogShow = true
        let obj = {
          url: '/pm/device/maintenance',
          method: 'GET'
        }
            initData(obj.url,obj.method).then(res=>{
              this.maintenanceInforData=res.data
            })
    },
    changshang(){
           this.addPersonDialogShow = true
            let obj = {
              url: '/pm/device/manufacturer',
              method: 'GET'
            }
            initData(obj.url,obj.method).then(res=>{
              this.manufacturerInforData=res.data
            })
        },
        onback(){
          this.deviceDrawVisible=true;
          this.$emit('addAndEditShow',[true,false])
        },
        onSubmit(){
            const p1=new Promise((resolve,reject)=>{
              this.$refs['deviceForm'].validate(valid=>{
                if(valid) resolve()
              })
            })
            Promise.all([p1]).then(()=>{
              let obj = {
                url:'/pm/hydropower/updatedevice',
                method:'post',
              }
              delete this.submitFormData.latitudes
              this.submitFormData.deviceMaintenance = this.deviceMaintenance
              this.submitFormData.deviceManufacturer = this.deviceManufacturer
              treeByIdDataEdit(obj.url, obj.method, this.submitFormData).then(res=>{
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.onback();
              })
            })
        },
        // 取消
        onCancel() {
            this.deviceDrawVisible = true
             this.$emit('addAndEditShow',[true,false])
            this.$refs.maintenanceForm.resetFields()
        },
        handleClose(){
           this.addPersonDialogShow = false
        },
        handleProgress(){
            this.loading = true;
        },

    }
}
</script>

<style lang="scss" scoped>
::v-deep.app-container{
  margin:0 !important;
  padding:0 20px !important;
}
.colors{
    color:#206aff;
    cursor: pointer;
}
.carBorder .el-form-item__content {
    width:85%;
}
.carBorder .el-form-item--small.el-form-item{
   width:33%;
}
::v-deep .el-input.is-disabled .el-input__inner,::v-deep.el-input--small .el-input__inner,::v-deep.el-select .el-input__inner,::v-deep.el-textarea.el-input--small .el-textarea__inner{
  width:462px;
  height:42px;
}
::v-deep.el-textarea.el-input--small .el-textarea__inner{
  height:107px;
    font-family: Microsoft YaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
}
.clearfixs{
    display:flex;
    justify-content:space-between;
    margin-top:20px;
}
.clearfix{
  margin-top:10px;

}
.gobackCls{
  display:flex;
  flex-direction: row;
   cursor: pointer;
}
.gobackCls div{
  margin-left:10px;
  font-size: 12px;
}
  .clearfixsTitle{
  font-family: Microsoft YaHei;
	font-size: 16px;
	font-weight: bold;
	font-stretch: normal;
	line-height: 21px;
	letter-spacing: 0px;
  background-position:0 4px;
  padding-left:24px;
	background-repeat:  no-repeat;
  }
  ::v-deep .el-card__header{
    margin-bottom:10px !important;
  }
</style>
