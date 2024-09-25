<template>
  <div class="app-container">
    <el-row type="flex" justify="space-between">
      <el-form :model="searchForm" :inline="true" ref="searchForm">
        <el-col>
          <el-form-item label="状态" prop="status">
            <el-select v-model="searchForm.status" clearable>
              <el-option
                v-for="item in steps"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="平台类型" prop="platformType">
            <el-select v-model="searchForm.platformType" clearable>
              <el-option
                v-for="item in platformType"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchFn">搜索</el-button> 
            <el-button plain icon="el-icon-refresh" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" @click="dialog">新增</el-button>
      </el-col>
    </el-row>
    <div style="height:calc(100% - 120px)">
    <el-table ref="table" v-loading="loading" :data="noticeData">
      <el-table-column :show-overflow-tooltip="true" align="left" prop="platformType" label="平台类型" >
        <template slot-scope="scope">
            <div>
                {{scope.row.platformType =="ios" ? 'IOS' : '安卓'}}
            </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" prop="insideVersion" label="内部版本号" />
      <el-table-column :show-overflow-tooltip="true" align="left" prop="version" label="版本号" />
      <el-table-column :show-overflow-tooltip="true" align="left" prop="forceUpdate" label="强制升级" >
        <template slot-scope="scope">
            <div>
                {{scope.row.forceUpdate  ? '是' : '否'}}
            </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" prop="status" label="状态" >
          <template slot-scope="scope">
              <div>
                  {{scope.row.status=='published' ? '发布' : '未发布'}}
              </div>
          </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
            <div style="display: flex;">
                <el-button type="text" @click="see(scope.row,'none')">查看</el-button>
                <div v-if="scope.row.status=='unpublished'" style="margin-left:10px">
                  <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                  <el-button type="text" @click="publish(scope.row)">发布</el-button>
                </div>
                <div v-else  style="margin-left:10px">
                  <el-button type="text" @click="unpublish(scope.row)">取消发布</el-button>
                </div>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="searchForm.pageNum"
      :limit.sync="searchForm.pageSize"
      :pageSizes="[10, 20, 30, 40]"
      @pagination="init"
    />
    </div>
    <el-dialog :title="varsion+'新版本'" :visible.sync="isDialog" :before-close="restNoticeFrom" width="600px">
        <el-form ref="version" :model="appVer" :rules="rules" label-width="100px">
          <el-form-item label="平台类型" prop="platformType">
            <el-select v-model="appVer.platformType" style="width:100%" clearable :disabled=" varsion == '发布' ? false : true" placeholder="请选择平台类型">
              <el-option
                v-for="item in platformType"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="版本号" prop="version" >
               <el-input
                type="text"
                v-model="appVer.version"
                placeholder="请输入版本号"
                clearable
                />
          </el-form-item>
          <el-form-item label="内部版本号" prop="insideVersion" >
               <el-input
                type="text"
                v-model="appVer.insideVersion"
                placeholder="请输入内部版本号"
                clearable
                />
          </el-form-item>
          <el-form-item label="立即发布" prop="publishNow" >
                <el-radio v-model="appVer.publishNow" :label="true" >是</el-radio>
                <el-radio v-model="appVer.publishNow" :label="false" >否</el-radio>
          </el-form-item>
          <el-form-item label="强制升级" prop="forceUpdate" >
                <el-radio v-model="appVer.forceUpdate" :label="true" >是</el-radio>
                <el-radio v-model="appVer.forceUpdate" :label="false" >否</el-radio>
          </el-form-item>
          <el-form-item label="安装包上传" prop="packageUrl" v-if="appVer.platformType == 'ios' ? false : true" ref="apkItem">
                <Upload v-model="appVer.packageUrl" :fileType="['apk']"  :fileSize="300" ref="apkUpload" @input="inputVal"/>
          </el-form-item>
          <el-form-item label="更新内容" prop="updateContent" >
            <Editor v-model="appVer.updateContent"  :min-height="192" />
          </el-form-item>
        </el-form>
        <div slot="footer" v-if="footerNo">
            <el-button type="primary" v-if="varsion=='发布'" @click="addClick">确定</el-button>
            <el-button type="primary" v-else @click="editClick">确定</el-button>
            <el-button plain @click="restNoticeFrom">取消</el-button>
        </div>
    </el-dialog>
  </div>
  
</template>
<script>
import $appVer from "@/api/system/appVersion"
import Upload from "@/components/FileUpload"
import pagination from '@/components/comPagination'

export default {
  name: 'Versions',
  components:{
    Upload,
    pagination
  },
  data() {
    return {
      searchForm: {
        status:'',
        pageNum: 1,
        pageSize: 10,
        platformType:"",
      },
      dialogDiab:false,
      loading:false,
      noticeData: [],
      varsion:'发布',
      total: 0,
      isDialog:false,
      appVer:{
        id:"",
        forceUpdate: true,
        insideVersion: "",
        packageUrl: "",
        platformType: "",
        publishNow: true,
        updateContent: "",
        version: ""
      },
      platformType:[
        {
          value: "android",
          name: "安卓"
        },
        {
          value: "ios",
          name: "IOS"
        }
      ],
      steps: [
        {
          value: "published",
          name: "发布"
        },
        {
          value: "unpublished",
          name: "未发布"
        }
	    ],
      rules:{
        forceUpdate: [{ required: true, message: "请选择是否强制更新", trigger: "blur" }],
        insideVersion: [{ required: true, message: "请输入内部版本号", trigger: "blur" }],
        packageUrl: [{ required: true, message: "请上传app包", trigger: "change" }],
        platformType: [{ required: true, message: "请选择平台类型", trigger: "change" }],
        publishNow: [{ required: true, message: "请选择是否立即发布", trigger: "blur" }],
        updateContent: [{ required: true, message: "请输入更新内容", trigger: "blur" }],
        version: [{ required: true, message: "请输入版本号", trigger: "blur" }]
      },
      footerNo:true
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    change (e) {
        this.$forceUpdate()
    },
    inputVal(path){
      this.appVer.packageUrl = path
      this.$refs.apkItem.$emit('el.form.change')
    },
    // 获取列表数据
    init() {
      this.loading = false;
      $appVer.getVersionPage(this.searchForm).then(res => {
        this.loading = false;
        this.noticeData = res.data.data;
        this.total = Number(res.data.total);
      });
    },
    searchFn(){
      this.searchForm.pageNum = 1
      this.init()
    },
    // 公告弹窗
    dialog(){
        this.varsion = '发布'
        this.isDialog=true
        this.footerNo=true
    },
    // 关闭弹窗按钮
    restNoticeFrom(){
      this.isDialog = false
      this.$refs['version'].resetFields()
      if(this.$refs.apkUpload) {
        this.$refs.apkUpload.fileList = []
      }
    },
    // 查看
    see(item){
      this.isDialog = true;
      this.footerNo=false
      item.publishNow = item.status == "unpublished" ? false : true
      let temp = item
      this.$nextTick(() => {
        this.appVer = Object.assign({},temp)
      })
    },
    // 取消发布
    unpublish(item){
      $appVer.unpublish(item.id).then(res=>{
        this.$message.success('取消发布成功！')
        this.init()
      })
    },
    // 发布
    publish(item){
      $appVer.publish(item.id).then(res=>{
        this.$message.success('发布成功！')
        this.init()
      })
    },
    // 提交新增
    addClick(){
      this.$refs['version'].validate(valid => {
        if (valid) {
          $appVer.publishVer(this.appVer).then(res=>{
            this.isDialog=false
            this.init()
          })
        }else{
          return false
        }
      })
    },
    // 编辑
    edit(item){
      this.varsion = '编辑'
      this.isDialog=true;
      this.dialogDiab=true;
      this.footerNo=true
      item.publishNow = item.status == "unpublished" ? false : true
      let temp = item
      this.$nextTick(() => {
        this.appVer = Object.assign({},temp)
      })
    },
    // 提交编辑
    editClick(){
        $appVer.editVersion(this.appVer.id,this.appVer).then(res=>{
          this.isDialog=false
          this.$refs.version.resetFields()
          this.$message.success('编辑成功！')
          this.init()
        })
    },
    // 重置
    resetFn(){
      this.$refs.searchForm.resetFields()
      this.searchForm.pageNum = 1
      this.init()
    },
   
  }
};
</script>
<style lang="scss" scoped>
.downLoad a{
    color:#1890ff
}
::v-deep .w-e-text-container {
    height: 200px !important;
}
::v-deep .w-e-toolbar .w-e-menu{
  height: 25px;
}
::v-deep.el-table.el-table--fit{
  overflow: hidden;
}
 ::v-deep .heights > .el-dialog__wrapper .el-dialog .el-dialog__body {
    height: 60vh !important;
    overflow: auto !important;
    margin-bottom:20px;
  }
</style>