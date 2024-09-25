<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
        <div class="flex">
          <div class='addGroupBtn' @click="openGroupDialog()">
            <span>工作组</span>
            <i class="el-icon-circle-plus"></i>
          </div>
        </div>
        <div class="group-area">
          <div class="group-item-hover" v-for="item in groups" :key="item.id" >
            <div class="group-item" @click="selectGroup(item)">
              <div class="item-name">{{item.name}}</div>
              <div class="controls flex">
                <i class="el-icon-edit" @click.stop="openGroupDialog(item)"></i>
                <i class="el-icon-delete" @click.stop="delGroup(item.id)"></i>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xl="20" :lg="18" :sm="17" :xs="24">
        <div class="flex mb10">
          <span class="group-info">工作组名：{{currentGroupName}}</span>
          <div>
            <el-button @click="addPerson" type="primary" icon='el-icon-plus'>添加人员</el-button>
            <el-button v-if="!groupChatDialogShow" :disabled="!selectedIds.length" @click="delPerson()" icon='el-icon-delete' type="danger">移除人员</el-button>
          </div>
        </div>
        <el-table
          ref='groupList'
          row-key="id"
          element-loading-text="加载中"
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column :reserve-selection='true' type="selection" align="left" />
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="nickname" label="姓名"/>
          <el-table-column prop="email" label="邮箱"/>
          <el-table-column prop="phone" label="电话" />
          <el-table-column prop="deptName" label="所属部门"/>
          <el-table-column label="操作" align="left"  width='100'>
            <template slot-scope="scope">
              <el-button type="text" @click="delPerson(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :title="groupDialogTitle" :close-on-click-modal='false' :visible.sync="groupDialogShow" :before-close="resetForm" width="400px">
      <el-form label-width="100px" ref="groupRuleForm" :model="groupRuleForm" :rules="groupRules">
        <el-form-item label="工作组名称" prop="name">
          <el-input v-model.trim="groupRuleForm.name" placeholder="请输入节点名称"></el-input>
        </el-form-item>
        <el-form-item label="工作组编码" prop="code">
          <el-input v-model.trim="groupRuleForm.code" placeholder="请输入工作组编码，如：GJ_WORK"></el-input>
        </el-form-item>
        <el-form-item label="工作组类型" prop="type">
          <el-input  v-model.trim="groupRuleForm.type" placeholder="请输入工作组类型"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model.trim="groupRuleForm.description"  placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon='el-icon-check' @click="saveGroup(groupRuleForm)">保存</el-button>
          <el-button plain icon='el-icon-close' @click="resetForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="添加人员" :visible.sync="addPersonDialogShow" :before-close="closeAddPersonDialog" width="60%">
      <div class="flex ">
        <div class="peopleSearch">
           <!-- 搜索 -->
          <el-input
            v-model="blurry"
            clearable
           
            style="width:215px;"
            placeholder=" 请输入查询内容 "
          />
           
          <el-select
            v-model="blurryType"
            clearable
           
            placeholder="选择搜索类型"
            class="select-large"
          >
            <el-option
              v-for="item in dict.user_type"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <el-button icon="el-icon-search" @click="search()" type="primary">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="reset()" plain>重置</el-button>
        </div>
      </div>
      <div style="height:calc(100% - 120px)">
        <el-table
          ref="multipleTable"
          row-key="id"
          v-loading="isLoading"
          element-loading-text="加载中"
          :data="personTableData"
          @selection-change="handlePersonsSelectionChange"
        >
          <el-table-column :reserve-selection='true' type="selection" width='50' align="left" :selectable="selectable"/>
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="nickname" width='100' label="姓名"/>
          <el-table-column prop="email" width='220' label="邮箱"/>
          <el-table-column prop="phone" label="手机号"/>
          <el-table-column prop="dept.deptName" label="部门"/>
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="personTableData && personTableData.length > 0"
          :page.sync="pageNum"
          :total="total"
          :limit.sync="pageSize"
          :pageSizes="[10, 50, 100]"
          @pagination="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
      <span slot="footer">
        <el-button type="primary" @click="confirmAddPerson" icon='el-icon-check'>确定</el-button>
        <el-button @click="closeAddPersonDialog" plain icon='el-icon-close'>取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import HighlightSquare from '@/components/HighlightSquare'
import pagination from '@/components/comPagination'
import { treeData , groupUserList ,groupsAll } from '@/api/system/workTeam'
import { getuserAll } from '@/api/system/user'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
export default {
  dicts: ['user_type'],
  name: 'GroupManage',
  components: {
    HighlightSquare,
    pagination
  },
  data(){
    return {
      keyword: '',
      activeGroup: 0,
      selectedId: [],
      selectedIds: [],
      selectedPersonIds: [],
      currentGroupId: '',
      currentGroupName: '告警任务工作组',
      creator: '',
      groups: [
      ],
      groupDialogShow: false,
      groupDialogTitle: '创建工作组',
      groupRuleForm: {
        name: '',
        code: '',
        type: '',
        description: ''
      },
      blurry:'',
      blurryType:'',
      groupRules: {
        name: [{required: true, message: '请输入工作组名称', trigger: 'blur'}],
        type: [{required: true, message: '请输入工作组类型', trigger: 'blur'}],
        code: [{required: true, message: '请输入工作组编码', trigger: 'blur'}],
      },
      // 当前工作组编码
      currentCode:'',
      isLoading: false,
      tableData: [],
      groupChatDialogShow: false,
      addPersonDialogShow: false,
      personFilter: {
        username: '',
        nickname: '',
        phone: ''
      },
      personTableData: [],
      total: 12,
      pageNum: 1,
      pageSize: 10,
      isAudioGroup: false,
    }
  },
  mounted(){
    this.initData();
  },
  methods: {
    selectable(row,index){
      if(this.tableData.find(i => i.id === row.id)){
        return 0
      }else {
        return 1
      }
    },
    // 查询所有工作组
    initData(){
      let query = {
        pageNum:this.tablePageNum,
        pageSize:1000
      }
      treeData('/sys/team','GET',query).then(res=>{
        this.groups = res.data.data
        this.groupUserList(res.data.data[0].code)
        this.currentGroupName=res.data.data[0].name
        this.currentCode=res.data.data[0].code
        this.currentGroupId=res.data.data[0].id
      })
    },
     //  切换当前工作组
    selectGroup(data) {
      this.currentGroupName=data.name
      this.currentGroupId=data.id
      this.currentCode=data.code
      this.groupUserList(data.code)
    },
    //  获取工作组人员列表
    groupUserList(data){
      let query = {
        code:data,
      }
      groupUserList('/sys/team/users','GET',query).then((res)=>{
        this.tableData=res.data
      })
      this.currentCode=data
    },
    // 打开编辑工作组窗口
    openGroupDialog(data) {
       this.groupDialogShow = true
      if(data) {
        this.groupDialogTitle ='编辑工作组'
        this.$nextTick(() => {
          this.selectedId = JSON.parse(JSON.stringify(data.id))
          this.groupRuleForm = JSON.parse(JSON.stringify(data))
        })
      }else{
        this.groupDialogTitle ='创建工作组'
      }
    
    
    },
    // 编辑工作组
    editgroups(data){
      groupsAll('/sys/team','PUT',data).then(res=>{
        this.initData()
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.resetForm()
        this.initData()
      })
    },
    // 添加工作组
    addgroups(data){
      groupsAll('/sys/team','POST',data).then(res=>{
        this.initData()
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.resetForm()
        this.initData()
      })
    },
    resetForm() {
      this.$refs['groupRuleForm'].resetFields()
      this.groupDialogShow = false
    },
    // 保存工作组
    saveGroup(data) {
       this.$refs.groupRuleForm.validate((valid) => {
        if (valid) {
          if(this.groupDialogTitle === '创建工作组') {
            this.addgroups(data)
          } else {
            this.editgroups(data)
          }
        }
       })
    },
    // 打开添加人员窗口并获取人员信息
    addPerson() {
      if(this.currentGroupId === '') {
        this.$message.warning('请先选择工作组！')
        return
      }
      this.getPeopleALL()
      this.addPersonDialogShow = true
    },
    // 获取人员列表
    getPeopleALL(){
      let query = {
        pageNum:this.pageNum,
        pageSize:this.pageSize
      }
      treeData('/sys/user','GET',query).then(res=>{
        this.personTableData=res.data.data
        this.total=res.data.total
        
      })
    },
    // 勾选工作组人员表格复选框
    handleSelectionChange(data) {
      this.selectedIds = []
      data.forEach(item => {
        this.selectedIds.push(item.id)
      })
    },
    // 勾选人员表格复选框
    handlePersonsSelectionChange(data) {
      this.selectedPersonIds = []
      data.forEach(item => {
        this.selectedPersonIds.push(item.id)
      })
    },
    // 删除工作组
    delGroup(id) {
      this.$confirm(`确定要删除该组吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data =[]
        data.push(id)
        groupsAll('/sys/team','DELETE',data).then(res=>{
          this.initData()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
      })
    },
    // 添加人员
    confirmAddPerson() {
      if(this.selectedPersonIds.length < 1) {
        this.$message.warning('请选择人员')
        return
      }
      let data={
        teamId:this.currentGroupId,
        userIds:this.selectedPersonIds  
      }
      groupsAll('/sys/team/addUsers','PUT',data).then(res=>{
        this.groupUserList(this.currentCode)
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
      this.closeAddPersonDialog()
    },
    //  移除人员
    delPerson (data) {
      if(data) {
        this.selectedIds.push(data.id)
      }
      this.$confirm('确定要从工作组移除选中人员吗？','提示',{
         confirmButtonText: '确定',
        confirmButtonClass:'el-icon-check',
        cancelButtonText: '取消',
        cancelButtonClass:'el-icon-close',
        type: 'warning'
      }).then(() => {
        let data={
          teamId:this.currentGroupId,
          userIds:this.selectedIds  
        }
        groupsAll('/sys/team/delUsers','PUT',data).then(res=>{
          this.groupUserList(this.currentCode)
          this.$message({
           message: '删除成功',
           type: 'success'
          })
          this.selectedIds=[]
        })
      }).catch(() => {
        this.$message.info('已取消')
        this.$refs.groupList.clearSelection()
        if(this.selectedIds.length===1){
          this.selectedIds=[]
        }
      })
    },

    //  打开工作组窗口
    openAudioChat(isAudioGroup) {
      if(this.currentGroupId === '') {
        this.$message.warning('请先选择工作组！')
        return
      }
      if(this.tableData.length < 1) {
        this.$message.warning('请为工作组添加人员！')
        return
      }
      this.groupChatDialogShow = true
      this.isAudioGroup = isAudioGroup
    },
 
    //  关闭工作组窗口
    closeChat() {
      this.groupChatDialogShow = false
    },
 
    // 关闭添加人员窗口
    closeAddPersonDialog() {
      this.addPersonDialogShow = false
      this.pageNum = 1
      this.personFilter = {
        username: '',
        nickname: '',
        phone: ''
      }
      
      this.$refs.multipleTable.clearSelection()
      this.selectedPersonIds = [];
    },
    
    //  根据过滤条件搜索人员数据
    search(type){
      if(!type){
        if(!this.blurry){
          this.$message.warning('请输入查询内容！')
          return false
        }
        if(!this.blurryType){
          this.$message.warning('请选择搜索类型！')
          return false
        }
      }
      
      let query={
        blurry:this.blurry,
        blurryType:this.blurryType
      }
      getuserAll('/sys/user','GET',query).then(res=>{
        this.personTableData=res.data.data
        this.total=res.data.total
        this.pageNum=res.data.pageNum
      })
    },
    reset() {
      this.personFilter = {
        username: '',
        nickname: '',
        phone: ''
      }
      this.pageNum = 1
      this.pageSize = 10
      this.blurry=''
      this.blurryType=''
      this.search('reset')
    },
    //  点击分页
    handleCurrentChange(val) {
      this.pageNum = val.page
       this.getPeopleALL()
    },
    //  更改每页显示数量
    handleSizeChange(val) {
      this.pageSize = val.limit
     
    },
  },
  watch: {
  }

}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.left-area{
  float: left;
  width:400px;
  margin-right: 20px;
}
 .group-info {
	  font-size: 14px;
    color: #206aff;
    line-height: 36px;
  }
  ::v-deep .el-textarea__inner{
   &::placeholder {
      color: #afb9d0 !important;
    }
    font-family: Microsoft YaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
}
.addGroupBtn{
  width:100%;
  display:flex;
  justify-content:space-between;
  padding:0 20px;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  height:38px;
  background-color: #f8f8f9;
  span{
    font-size:14px;
    font-weight: bold;
  }
}
 ::v-deep .heights > .el-dialog__wrapper .el-dialog .el-dialog__body {
    height: 60vh !important;
    overflow: auto !important;
    margin-bottom:20px;
  }
</style>
