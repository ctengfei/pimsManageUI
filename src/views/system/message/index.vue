<template>
<div class="app-container noticeInfo">
  <el-form :model="searchParams" ref="queryForm" :inline="true" v-show="showSearch">
    <el-form-item label="主题" prop="keywords">
      <el-input
        v-model="searchParams.keywords"
        placeholder="请输入主题"
        clearable
      />
    </el-form-item>
    <el-form-item label="状态" prop="readed">
      <el-select v-model="searchParams.readed" style="width: 220px;margin-right: 10px;">
        <el-option :value="false" label="未读"></el-option>
        <el-option :value="true" label="已读"></el-option>
        <el-option value="all" label="全部"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  icon="el-icon-search" @click="searchFn">搜索</el-button> 
      <el-button plain icon="el-icon-refresh" @click="resetFn">重置</el-button>
    </el-form-item>
  </el-form>
  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button type="primary" plain :disabled="!ids.length" @click="markReadsFn">标记已读</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="danger" plain :disabled="!multipleSelection.length" @click="delMessage">批量删除</el-button>
    </el-col>
    <right-toolbar :showSearch.sync="showSearch" @queryTable="initPage"></right-toolbar>
  </el-row>
  <div style="height:calc(100% - 120px)">
  <el-table ref="table" v-loading="loading" :data="noticeData" @selection-change="handleSelectionChange">
    <el-table-column align="left" disabled  type="selection" width="55" />
    <el-table-column :show-overflow-tooltip="true" align="left" prop="msgBody" label="主题" />
    <el-table-column :show-overflow-tooltip="true" align="left" prop="contentTypeStr" label="类型" width="260" />
    <el-table-column label="状态" width="160">
      <template slot-scope="scope">{{ scope.row.readed ? '已读' : '未读'}}</template>
    </el-table-column>
    <el-table-column :show-overflow-tooltip="true" align="left" prop="createTime" label="产生时间" width="260" />
    <el-table-column label="操作" width="200px">
      <template slot-scope="scope">
        <el-button type="text" @click="details(scope.row)">查看</el-button>
        <el-button type="text" v-if="!scope.row.readed" @click="markReadFn(scope.row)">标记已读</el-button>
        <el-link type="primary" :href='downloadUrl + scope.row.url' :underline='false' v-if="scope.row.webMessageType === 'download'" style="line-height: 32px;">下载</el-link>
        <el-button type="text" @click="delMessage(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
  <pagination
    v-show="total > 0"
    :total="total"
    :page.sync="queryPage.pageNum"
    :limit.sync="queryPage.pageSize"
    @pagination="initPage"
  />
  <el-dialog title="消息详情" :visible.sync="dialogVisible" width="800px">
    <el-row>
      <el-col class="items">
        <label class="el-form-item__label">消息类型</label>
        <div class="content">{{message.contentTypeStr}}</div>
      </el-col>
      <el-col class="items">
        <label class="el-form-item__label">创建时间</label>
        <div class="content">{{message.createTime}}</div>
      </el-col>
      <el-col class="items">
        <label class="el-form-item__label">消息内容</label>
        <div class="content">{{message.msgBody}}</div>
      </el-col>
    </el-row>
  </el-dialog>
</div>
</template>
<script>
import { getMessageList, markRead, markReads, noSeeMessage, noSeeMessages } from '@/api/system/message'
import pagination from '@/components/comPagination'
export default {
  name: 'Message',
  components: { pagination },
  data () {
    return {
      loading: false,
      showSearch: true,
      multipleSelection: [],
      ids: [],
      noticeData: [],
      total: 0,
      queryPage: {
        pageNum: 1,
        pageSize: 10,
      },
      searchParams: {
        keywords: '',
        readed: false,
        contentType: ''
      },
      dialogVisible: false,
      message: {
        contentTypeStr: '',
        createTime: '',
        msgBody: '',
      },
      downloadUrl: process.env.VUE_APP_BASE_API + "/file/file/loadByUrl?url="
    }
  },
  computed: {
    infoNum: {
      get(){
        return this.$store.state.socket.infoNum
      },
      set(){}
    }
  },
  watch: {
    '$store.state.socket.warnMsg'(newVal,oldVal){
      if(newVal){
        this.resetFn()
      }
    }
  },
  mounted () {
    if(this.$route.query.type){
      this.searchParams.contentType = this.$route.query.type
    }
    this.initPage()
  },
  methods: {
    initPage() {
      this.loading = true
      const params = {
        pageNum: this.queryPage.pageNum,
        pageSize: this.queryPage.pageSize
      }
      if(this.searchParams.keywords){
        params.searchKey = this.searchParams.keywords
      }
      if(this.searchParams.readed !== 'all'){
        params.readed = this.searchParams.readed
      }
      if(this.searchParams.contentType){
        params.contentType = this.searchParams.contentType
      }
      getMessageList(params).then(res => {
        this.loading = false
        this.noticeData =  res.data.data
        this.total = Number(res.data.total)
      })
    },
    searchFn(){
      this.queryPage.pageNum = 1
      this.initPage()
    },
    resetFn(){
      this.$refs.queryForm.resetFields()
      this.searchFn()
    },
    details(row){
      this.message.contentTypeStr = row.contentTypeStr
      this.message.createTime = row.createTime
      this.message.msgBody = row.msgBody
      this.message.pushType = row.pushType
      this.dialogVisible = true
    },
    handleSelectionChange(val){
      this.ids = []
      this.multipleSelection = val
      val.forEach(item => {
        if(!item.readed){
          this.ids.push(item.id)
        }
      })
    },
    markReadFn(row){
      markRead(row.id).then(res => {
        this.$message.success('标记已读成功！')
        let info = this.infoNum - 1
        this.$store.commit('socket/SET_SOCKET_DATA',info)
        if(this.$store.state.socket.warnMsg === row.msgBody){
          this.$store.commit('socket/SET_SOCKET_WARNMSG','')
        }
        this.initPage()
      })
    },
    markReadsFn(){
      if(this.ids.length){
        markReads(this.ids).then(res => {
          this.$message.success('标记已读成功！')
          let info = this.infoNum - this.ids.length
          this.$store.commit('socket/SET_SOCKET_DATA',info)
          this.multipleSelection.forEach(item => {
            if(this.$store.state.socket.warnMsg === item.msgBody){
              this.$store.commit('socket/SET_SOCKET_WARNMSG','')
            }
          })
          this.initPage()
        })
      }
    },
    delMessage(row){
      this.$confirm('确认删除所选消息吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        if(row.id){
          noSeeMessage(row.id).then(res => {
            this.$message.success('删除成功！')
            if(!row.readed){
              let info = this.infoNum - 1
              this.$store.commit('socket/SET_SOCKET_DATA',info)
            }
            if(this.noticeData.length === 1 && this.queryPage.pageNum > 1){
              this.queryPage.pageNum--
            }
            this.initPage()
          })
        }else {
          let idList = [], noread=[]
          this.multipleSelection.forEach(item => {
            idList.push(item.id)
            if(!item.readed){
              noread.push(item.id)
            }
          })
          noSeeMessages(idList).then(res => {
            this.$message.success('删除成功！')
            if(noread.length){
              let info = this.infoNum - noread.length
              this.$store.commit('socket/SET_SOCKET_DATA',info)
            }
            if(idList.length === this.noticeData.length  && this.queryPage.pageNum > 1){
              this.queryPage.pageNum--
            }
            this.initPage()
          })
        }
      }).catch(() => {})
    }
  },
}
</script>
<style lang="scss">
.noticeInfo {
  .el-link {
    font-size: 12px;
    margin: 0 10px;
  }
  .mb8 {
    text-align: right;
  }
  .items {
    display: flex;
    align-items: center;
    .content {
      width: 90%;
      line-height: 32px;
    }
  }
  .el-dialog__body {
    padding: 10px 20px !important;
  }
}

</style>
<style lang="scss" scoped>
::v-deep .el-table.el-table--fit{
  overflow-y: hidden;
}
</style>