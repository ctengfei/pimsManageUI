<template>
  <div class="app-container">
    <el-row :gutter="20" style='height:100%;'>
      <el-col style="height:100%">
        <div class="ListManage" style="height:100%">
          <el-form ref="formSearch" inline :model="formSearch" class="demo-form-inline" v-if="showSearch">
            <el-form-item prop="eventName" label="事件名称">
              <el-input placeholder="请输入安防告警事件名称" clearable v-model="formSearch.eventName"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="sysChild" label="业务分类">
              <el-select v-model="rowData.businessCode" placeholder="请选择业务分类" clearable>
                <el-option
                  v-for="item in businessArr"
                  :key="item.businessCode"
                  :label="item.businessType"
                  :value="item.businessCode">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button  icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
              <el-button  icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button  type="primary" plain icon="el-icon-plus"  @click="btnAdd">新增</el-button>
            <el-button  type="danger" :disabled="multiple" icon="el-icon-delete" plain @click="btnDel">批量删除</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getTableData"></right-toolbar>
        </el-row> -->
          <div style="height:calc(100% - 150px)">
              <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection"  width="55"></el-table-column>
                <el-table-column prop="businessType" label="业务分类"></el-table-column>
                <el-table-column prop="eventCode" label="事件编码"></el-table-column>
                <el-table-column prop="eventName" label="事件名称"></el-table-column>
                <el-table-column prop="level" label="告警级别">
                  <template slot-scope="scope">
                    {{ scope.row.level == "normal" ? "普通" : scope.row.level == "emergency" ? "紧急" : "非常紧急" }}
                  </template>
                </el-table-column>
                <el-table-column prop="autoDispatchWorkorder" label="自动下发任务">
                  <template slot-scope="scope">
                    {{scope.row.autoDispatchWorkorder ? "是" : "否"}}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="onEdit(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
                    <!-- <el-button @click="onDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
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
      </el-col>
    </el-row>
    <!--新增dialog-->
    <el-dialog
      :title=title
      :visible.sync="addShow"
      width="40%"
    >
      <el-row>
        <el-form ref="addData" :model="addData" label-width="80px">
          <el-col :span="12">
            <el-form-item label="业务分类">
              <el-select v-model="addData.businessType" @change="handleSelectBusiness"  disabled placeholder="请选择业务分类">
                <el-option
                  v-for="item in businessArr"
                  :key="item.businessCode"
                  :label="item.businessType"
                  :value="item.businessCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="业务编码">
              <el-input v-model="addData.businessCode" placeholder="请选择业务编码" disabled/>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="事件名称">
              <!-- <el-input v-model="addData.eventName" placeholder="请选择事件名称"/> -->
              <el-select v-model="addData.eventName" @change="handleSelectEvent" disabled placeholder="请选择事件名称">
                <el-option
                  v-for="item in eventNameArr"
                  :key="item.eventCode"
                  :label="item.eventName"
                  :value="item.eventCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="事件编码">
              <el-input v-model="addData.eventCode" placeholder="请选择事件编码" disabled/>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="告警级别">
              <el-select v-model="addData.level" @change="handleSelectlevelChange" placeholder="请选择告警级别">
                <el-option
                  v-for="item in levelArr"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="addData.level == 'veryEmergency'">
            <el-form-item label="">
             <el-checkbox v-model="addData.autoDispatchWorkorder" >自动下发任务</el-checkbox>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import img from '@/assets/401_images/401.gif'
  import pagination from '@/components/comPagination'
  import {getConfigType, getTableData, getUserinfos, add, edit, Delete, mulDelete} from '@/api/alarmCenter/warningeventConfig'
  import {redefineTransfer} from '@/utils/index';
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import treeTransfer from 'el-tree-transfer'
  import roundApi from "@/api/roundPatrol"

  export default {
    name:'WarningeventConfig',
    components:{
      pagination,
      treeTransfer
    },
    data() {
      return {
        // permission: {
        //   searchConfigType: 'alarmCenter::warningeventConfig::searchConfigType',
        //   searchTable:'alarmCenter::warningeventConfig::searchTable',
        //   searchUserInfo:'alarmCenter::warningeventConfig::searchUserInfo',
        //   add:'alarmCenter::warningeventConfig::add',
        //   edit:'alarmCenter::warningeventConfig::edit',
        //   delete:'alarmCenter::warningeventConfig::delete'
        // },
        businessArr: [], //业务分类
        // tableData每个row的值
        rowData:{
          eventName:'',
          businessCode:'securityAlert'
        },
        // 总数量
        total: 0,
        formSearch: { // 搜索的表单
          eventName:'',
          businessCode:'securityAlert',
          pageNum: 1,
          pageSize: 10,
        },
        showSearch:true,
        multipleArr:[],
        addShow: false,
        levelShow: false,
        titles: ["人员列表", "已选人员"],
        levelArr: [{id: 'normal', value: '普通'},{id:'emergency',value:'紧急'},{id:'veryEmergency',value:'非常紧急'}],
        dialogVisibleType: "add",
        mode: "transfer", // transfer addressList
        addData: {
          businessType: '',
          businessCode:'',
          eventName:'',
          eventCode:'',
          level: '',
          autoDispatchWorkorder:false
        },
        fromData: [],
        toData: [],
        // 表格的数据
        tableData: [],
        tableShow: true, // 表格的展示
        title:'新增',
        eventNameArr:[],
        multipleSelection:[],
        multiple: true,
        ids: [],
        mulSelection:true
      }
    },
    created() {

    },
    mounted() {
      this.getConfigBusiness()
      this.getTableData()
      //this.getUserInfos()
    },
    computed: {

    },
    methods: {
      // table多选
      multipleChange(val){
        let temp = val.map(item=>{
          return {alarmCode:item.code,closeReason:""}
        })
        this.multipleArr = temp
      },
      // 根据业务类型编码查询事件名称及事件编码
      getConfigEvent(code){
        roundApi.getConfigEvent(code).then(res=>{
          if(res.code === 200){
            this.eventNameArr = res.data.eventNames
          }else{
            this.$message.info(res.meta.message)
          }
        }).catch(err=>{
          this.$message.error(err)
        })
      },
      getConfigBusiness(){
        //let obj = getObjByKey(this.permission.searchConfigType);
        getConfigType('/pm/alarm/config/business', 'get').then(res => {
          console.log(res, 'res');
          if (res.code === 200) {
            this.businessArr = res.data;
          }
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      // 获取列表
      getTableData(){
        let data = this.formSearch
        if (this.rowData.businessCode != "") {
           data.businessCode = this.rowData.businessCode;
        }else{
          delete data.businessCode
        }
        //let obj = getObjByKey(this.permission.searchTable);
        getTableData('/pm/alarm/config', 'get', data).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.total;
          }
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      getUserInfos(){
        let data = { pageNum: 1, pageSize: 100 }
        getUserinfos('/sys/team','get', data).then(res => {
          if (res.code=== 200) {
            this.fromData = redefineTransfer(res.data.data);
          }
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      // 搜索
      onSearch(){
        this.formSearch.pageNum = 1
        this.getTableData()
      },
      // 分页
      handleCurrentChange() {
        this.getTableData();
      },
      handleSelectlevelChange(e){
        if(e == 'veryEmergency'){
          this.levelShow = true;
          this.addData.autoDispatchWorkorder = true
        }else{
          this.levelShow = false;
          this.addData.autoDispatchWorkorder = false
        }
      },
      // 业务分类
      handleSelectBusiness(e){
        this.addData.businessCode = e;
        this.getConfigEvent(e)
      },
      // 事件名称
      handleSelectEvent(e){
        if(!this.addData.businessType){
          this.$message.error("请先选择业务分类")
        }else{
          this.addData.eventCode = e
        }
        
      },
      // // 告警级别
      // handleSelectlevelChange(e){
      //   this.addData.eventCode = e
      // },
      onReset(){
        this.formSearch.businessCode = '';
        this.formSearch.eventName = '';
        this.getTableData();
      },
      onSubmit(){
        this.$refs.addData.validate((valid) => {
          if (valid) {
            if (this.dialogVisibleType === 'add'){
              //let url = this.$store.getters.btnpremissAll[this.permission.add].url
              //let method = this.$store.getters.btnpremissAll[this.permission.add].method
              add('/pm/alarm/config','post',this.addData).then(res=>{
                if(res.code===200){
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.getTableData()
                  this.addData={
                    businessType: '',
                    businessCode:'',
                    eventName:'',
                    eventCode:'',
                    level: '',
                    autoDispatchWorkorder:false
                  },
                  this.addShow = false

                }else{
                  this.$message({
                    message: res.meta.message,
                    type: 'error'
                  })
                }
              })
            }else{
              //let url = this.$store.getters.btnpremissAll[this.permission.edit].url
              //let method = this.$store.getters.btnpremissAll[this.permission.edit].method
              edit('/pm/alarm/config','put',this.addData).then(res=>{
                if(res.code===200){
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                  this.getTableData()
                  this.addData={
                    businessType: '',
                    businessCode:'',
                    eventName:'',
                    eventCode:'',
                    level: '',
                    autoDispatchWorkorder:false
                  },
                  this.addShow = false
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
      cancel(){
        // this.addData.businessType = '';
        // this.addData.businessCode = '';
        // this.addData.eventName = '';
        // this.addData.eventCode = '';
        // this.addData.level = '';
        this.addShow = false;
      },
      
      //监听左侧勾选事件
      checkLeft(nodeObj, treeObj, checkAll){
        console.log("nodeObj:", nodeObj);
        console.log("treeObj:", treeObj);
        console.log("checkAll:", checkAll);
      },
      // 监听穿梭框组件添加
      add(fromData, toData, obj) {
        this.toData = toData
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
      },
      // 监听穿梭框组件移除
      remove(fromData, toData, obj) {
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
      },
      // 批量选择
      // handleSelectionChange(val) {
      //   this.multipleSelection = val.map(item=>{
      //     return item.id
      //   })
      //   if(this.multipleSelection.length >0){
      //     this.mulSelection = false
      //   }else{
      //     this.mulSelection = true
      //   }
      // },
      handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
      this.single = val.length!=1
      this.multiple = !val.length
    },
      // 批量删除
      btnDel(){
        let temp = this.ids
        mulDelete(temp).then(res=>{
          if(res.code===200){
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTableData()
          }else{
            this.$message({
              message: res.meta.message,
              type: 'error'
            })
          }
        })
      },
      // 新增
      btnAdd(){
        this.addData.businessType = '';
        this.addData.businessCode = '';
        this.addData.eventName = '';
        this.addData.eventCode = '';
        this.addData.level = '';
        this.addShow = true;
      },
      onEdit(data){
        // this.addData.businessType = '';
        // this.addData.businessCode = '';
        // this.addData.eventName = '';
        // this.addData.eventCode = '';
        // this.addData.level = '';
        this.addShow = true
        this.title = '编辑'
        this.dialogVisibleType = 'edit'
        this.addData = data
        this.getConfigEvent(data.businessCode)
      },
      onDelete(row){
        //let url = this.$store.getters.btnpremissAll[this.permission.delete].url
        //let method = this.$store.getters.btnpremissAll[this.permission.delete].method
        let data = []
        data.push(row.id)
        Delete('/pm/alarm/config','delete',data).then(res=>{
          if(res.code===200){
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTableData()
            this.addShow = false
          }else{
            this.$message({
              message: res.meta.message,
              type: 'error'
            })
          }
        })
      },

      dialogClose() {
        Object.keys(this.addform).forEach(x => {
          this.addform[x] = ''
        })
      },
      selectionChange(){

      }
    }
  }
</script>
<style lang="scss" scoped>
  .highlight-height-table{
    height: calc(100vh - 60px - 46px - 20px - 32px - 42px) !important;
  }

  .color {
    color: #206aff;
  }
  ::v-deep .el-checkbox .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #37f !important;
  }
  ::v-deep .el-transfer-panel {
    width: 300px;
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
    .el-transfer-panel__filter .el-input__inner {
      width: 90%;
      margin-right: 20px;
    }
  }

  ::v-deep .el-rate {
    padding-top: 5px;
  }

  ::v-deep.el-progress--circle .el-progress__text, .el-progress--dashboard .el-progress__text {
    font-size: 30px !important;
  }

  ::v-deep.wl-transfer .el-tree {
    background-color: inherit;
  }

  ::v-deep.wl-transfer .transfer-title {
    background-color: inherit;
    color: #fff;
  }

  .el-form .el-select {
    width: 100%;
  }

  ::v-deep.el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }

  // ::v-deep.el-range-editor--small .el-range-separator {
  //   line-height: 34px;
  // }
  ::v-deep.el-form-item--small .el-form-item__label{
    line-height: 40px;
  }
</style>
