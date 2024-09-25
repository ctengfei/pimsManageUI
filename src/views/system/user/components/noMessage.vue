<template>
  <div>
    <el-form ref="formSearch" inline v-model="formSearch" v-show="showSearch">
      <el-form-item label="消息内容">
        <el-input placeholder="请输入消息内容" clearable v-model="formSearch.searchKey"></el-input>
      </el-form-item>
      <!-- <el-form-item label="日期">
        <el-date-picker
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd"
          style="width: 240px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button  @click="onSearch()" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button @click="onReset()" plain icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain :disabled="!multipleSelection.length" @click="remarkAll">标记已读</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain :disabled="!multipleSelection.length" @click="delAll">批量删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column prop="msgBody"  label="消息内容" showOverflowTooltip />
      <el-table-column prop="contentTypeStr" label="消息类型"  showOverflowTooltip />
      <el-table-column prop="createTime"  label="创建时间"  showOverflowTooltip />
      <el-table-column label="操作" align="left"  width="140">
        <template slot-scope="scope">
          <div>
            <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
              <el-button @click="onRemove(scope.row.id)" type="text">删除 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="formSearch.pageNum"
      :limit.sync="formSearch.pageSize"
      @pagination="getList"
    />
    <el-dialog
        title="消息查看"
        :visible.sync="centerDialogVisible"
        width="600px">
        <el-form label-width="80px" :model="formLabelAlign">
            <el-form-item label="消息类型">
                <el-input v-model="formLabelAlign.contentTypeStr" disabled></el-input>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input v-model="formLabelAlign.createBy" disabled></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-input v-model="formLabelAlign.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="消息内容">
                <el-input type="textarea" v-model="formLabelAlign.msgBody" disabled></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <!-- <el-button type="primary" @click="centerDialogVisible = false">确定</el-button> -->
            <el-button plain @click="centerDialogVisible = false">关闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

  import pagination from '@/components/comPagination'
  import messApi from "@/api/needMess"
  export default {
    components: {
      pagination
    },
    data() {
      let self = this
      return {
        formLabelAlign: {
          contentTypeStr: '',
          createBy: '',
          createTime: '',
          msgBody: ''
        },
        showSearch: true,
        centerDialogVisible: false,
        workPageShow:true,
//        查看详情组件展示
        detailShow: false,
        formSearch: {
          pageNum: 1,
          pageSize: 10,
          endTime: "",
          searchKey: "",
          startTime: "",
          readed: false
        },
        time:[],
        total: 6,
        tableData: [],
        sendWork: {
//        选择人员名单
          workPeople: [],
          workNum: ''
        },
        appraise: {
          workNum: '',
          appraiseLevel: 0,
          appraiseContent: '',
        },
        // tableData每个row的值
        mode: "transfer", // transfer addressList
        refuseshow: false,
        withParameters: false,
        allDel:true,
        multipleSelection:[]
      }
    },

    mounted() {
      this.getList()
    },
    methods: {
      // 获取全部数据
      getList(){
          // if(this.time.length){
          //   this.formSearch.startTime = this.time[0]
          //   this.formSearch.endTime = this.time[1]
          // }else {
          //   this.formSearch.startTime = ''
          //   this.formSearch.endTime = ''
          // }
          messApi.getMineList(this.formSearch).then(res=>{
            this.tableData = res.data.data
            this.total = res.data.total
          })
      },
        // 标记已读
      remarkAll(){
        messApi.messageRead(this.multipleSelection).then(res=>{
          this.$message.success("已读成功")
          this.getList()
          this.$emit('remark')
        })
      },
    //   获取表格数据
    handleSelectionChange(val){
        this.multipleSelection = val.map(res=>res.id)
    },
      //   批量删除
      delAll(){
        messApi.delMine(this.multipleSelection).then(res=>{
          this.$message.success("删除成功")
          this.getList(this.formSearch)
        })
      },
       //   表格中删除
      onRemove(id){
        messApi.delMine([id]).then(res=>{
            this.$message.success("删除成功")
            this.getList(this.formSearch)
        })
      },
      // 详情
      onDetail(data) {
        this.centerDialogVisible = true
        this.formLabelAlign = data
      },
//      编辑
      onEdit(data) {
      
      },
     onSearch(){
        this.formSearch.pageNum =  1
        this.getList()
      },
      onReset() {
        this.formSearch.searchKey = ''
        this.time = []
        this.getList()
      },
    }


  }
</script>


<style lang="scss" scoped>
  .transparent {
    background-color: transparent;
    padding: 0;
    // height: 100%;
    overflow-y: hidden;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .workInfo {
    background-color: #202230;
    border-radius: 8px;
    margin-top: 10px;
    height: calc(100% - 10px - 150px);
    .btnGroups {
      margin-bottom:10px;
      cursor: pointer;
      background-color: #313448;
      border-radius: 30px;
      width: 280px;
      height: 42px;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > div {
        display: inline-block;
      }
      .btn {
        width: 94px;
        height: 42px;
        border-radius: 30px;
        line-height: 42px;
        
        font-size:14px;
      }
      .divActive {
        background-color: #206aff;
        color: #fff;
      }
    }

  }
  .color {
    color: #206aff;
  }
  .chexiao{
    color: #ff403d;
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
  ::v-deep.el-pagination{
    margin-top: -25px;
  }
</style>
