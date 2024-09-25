<template>
  <div class="app-container">
    <div id="cesiumContainer">
      <div class="homeShow" v-if="contentTable">
        <div class="flex">
          <el-form ref="formSearchs" inline :model="formSearch" v-if="showSearch">
            <el-form-item prop="taskName" label="周界名称">
              <el-input placeholder="请输入周界任务名称" v-model="formSearch.taskName"></el-input>
            </el-form-item>
            <el-form-item label="任务创建时间">
              <el-date-picker
                v-model="dataValue"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <!-- <el-date-picker
                v-model="formSearch.createTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择创建日期"
                align="right">
              </el-date-picker> -->
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-button type="primary" :disabled="!multipleSelection.length" @click="allDel()">批量删除</el-button>
            <el-button type="primary" @click="onAddTask()">创建周界任务</el-button>
              <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
            </el-row>
        </div>
        <!-- 表格数据 -->
        <div style="height:calc(100% - 50px)">
            <el-table
              ref="multipleTable"
              :data="controlTableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="任务创建时间"></el-table-column>
              <el-table-column prop="alarmNum" label="告警数量" show-overflow-tooltip></el-table-column>
              <el-table-column prop="stateStr" label="任务状态" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.state == 'STOP'"
                      type="text"
                      @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                    <el-button
                      type="text"
                      @click="handleLook(scope.row)"
                    >查看</el-button>
                    <el-button
                      v-if="scope.row.state == 'STOP'"
                      type="text"
                      @click="handleStart(scope.row)"
                    >启用</el-button>
                    <el-button
                      v-else
                      type="text"
                      @click="handleStop(scope.row)"
                    >停止</el-button>
                  </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="bottom">
            <pagination
              v-show="controlTableData && controlTableData.length > 0"
              @pagination="handleCurrentChange"
              :page.sync="formSearch.pageNum"
              :pageSizes="[10, 20, 30, 40]"
              :limit.sync="formSearch.pageSize"
              :layout="'total, sizes, prev, pager, next'"
              :total="total"
            />
          </div>
      </div>
      <div class="homeShow" v-if="contentTable">

      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/comPagination";
import $executeControl from "@/api/executeControl"
import { getTaskList, startOrStop, deleteTask } from "@/api/monitor/perimeterTask"
var GisMapObj = null,
  viewer = null,
  that = null;
export default {
  name:'',
  components: {
    pagination
  },
  data() {
    return {
      controlTableData:[],
      contentTable: true,
      showSearch:true,
      carStatus: [
        {
          label: '已启用',
          value: 'ENABLE'
        },
        {
          label: '未启用',
          value: 'DISABLED'
        },
      ],
      formSearch: {
        taskName: '',
        createTime: '',
        status: '',
        pageNum: 1,
        pageSize: 10,
        queryType: 0,
        startTime:"",
        endTime:""
      },
      total: 0,
      multipleSelection:[],
      dataValue:[]
    };
  },
  watch: {
    
  },
  beforeDestroy() {
  },
  created() {
  },
  mounted() {
    this.init();
  },
  methods: {
    // 重置
    onReset(){
      this.dataValue = []
      this.$refs['formSearchs'].resetFields()
      this.formSearch.pageNum = 1
      this.onSearch()
    },
    // table多选
    handleSelectionChange(val) {
      let tableIds = val.map(item=>item.id)
      this.multipleSelection = tableIds;
    },
    init() {
      this.infoData()
    },
    // 初始列表数据
    infoData() {
      getTaskList(this.formSearch).then(res => {
        if (res.code === 200) {
          this.total = res.data.total;
          this.controlTableData = res.data.data;
          this.formSearch.pageNum = res.data.pageNum;
          this.formSearch.pageSize = res.data.pageSize;
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    // 根据车主搜索
    onSearch() {
      this.formSearch.startTime = this.dataValue[0]
      this.formSearch.endTime = this.dataValue[1]
      this.formSearch.pageNum = 1
      this.infoData();
    },
    // 切换到第几页了
    handleCurrentChange() {
      // this.formSearch.pageNum = n.page
      this.infoData();
    },
    // table表格修改
    handleUpdate(row){
      this.$router.push({name:"PerimeterTask/addEdit",query:{id:row.id,type:"edit"}})
    },
    // table表格启用
    handleStart(row){
      startOrStop({id:row.id,state:"START"}).then(res => {
        this.$message({
          message: '启用成功',
          type: 'success'
        })
        this.infoData()
      });
    },
    // table表格停止
    handleStop(row){
      startOrStop({id:row.id,state:"STOP"}).then(res => {
        this.$message({
          message: '停止成功',
          type: 'success'
        })
        this.infoData()
      });
    },
    // table表格查看
    handleLook(row){
      this.$router.push({name:"PerimeterTask/addEdit",query:{id:row.id,type:"look"}})
    },
    // 批量删除
    allDel(){
      this.$confirm("此操作将删除选中的周界任务信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteTask(this.multipleSelection).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.infoData()
        });
      })
    },
    // 新增车辆布控任务
    onAddTask(){
      this.$router.push({name:"PerimeterTask/addEdit",query:{type:"add"}})
    },
    // add新增确认
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
        } else {
          
          return false;
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
  .homeShow{
      width: 100%;
      height: 86%;
      z-index: 100;
      padding: 20px;
  }
</style>

