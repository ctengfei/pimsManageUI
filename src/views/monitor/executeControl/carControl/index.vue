<template>
  <div class="app-container">
    <div id="cesiumContainer">
      <div class="homeShow" v-if="contentTable">
        <div class="flex">
          <el-form ref="formSearchs" inline :model="formSearch" v-if="showSearch">
            <el-form-item prop="name" label="任务名称">
              <el-input placeholder="请输入车辆布控任务名称" v-model="formSearch.name"></el-input>
            </el-form-item>
            <el-form-item prop="createTime" label="任务创建时间">
              <el-date-picker
                v-model="formSearch.createTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="status" label="布控状态">
              <el-select v-model="formSearch.status" placeholder="请选择布控状态">
                <el-option v-for="item in carStatus" :key="item.value" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" :disabled="!multipleSelection.length" @click="allDel()">批量删除</el-button>
              <el-button type="primary" @click="onAddTask()">新建布控任务</el-button>
              <el-button type="primary" @click="onPersonManage()">黑名单组管理</el-button>
              <el-button type="primary" @click="onPersonWhite()">白名单组管理</el-button>
            </el-col>
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
              <el-table-column prop="name" label="任务名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="任务创建时间"></el-table-column>
              <el-table-column prop="statusStr" label="布控状态" show-overflow-tooltip></el-table-column>
              <el-table-column prop="alarmLevelStr" label="告警级别" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="groupName" label="车辆黑名单" show-overflow-tooltip></el-table-column>
              <el-table-column prop="cameraList" label="布控摄像机" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.cameraList" :key="index">{{ item.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="synchronizeTime" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                    <el-button
                      type="text"
                      @click="handleLook(scope.row)"
                    >查看</el-button>
                    <el-button
                      v-if="scope.row.status == 'DISABLED'"
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
import { formatData } from "@/utils/index";
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
        name: '',
        createTime: [],
        startTime:'',
        endTime:'',
        status: '',
        pageNum: 1,
        pageSize: 10,
        type:"CAR"
      },
      total: 0,
      multipleSelection:[]
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
      this.$refs['formSearchs'].resetFields()
      this.formSearch.pageNum = 1
      this.onSearch()
    },
    // 布控状态
    monitorTaskStatu(){
      $executeControl.monitorTaskStatus().then(res=>{
        this.carStatus = formatData(res.data)
      })
    },
    // table多选
    handleSelectionChange(val) {
      let tableIds = val.map(item=>item.id)
      this.multipleSelection = tableIds;
    },
    init() {
      this.infoData();
      this.monitorTaskStatu();
    },
    // 初始化车辆布控数据
    infoData() {
      $executeControl.getList(this.formSearch).then(res => {
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
      this.formSearch.startTime = this.formSearch.createTime[0]
      this.formSearch.endTime = this.formSearch.createTime[1]
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
      this.$router.push({name:"CarControl/addEdit",query:{id:row.id,type:"edit"}})
    },
    // table表格启用
    handleStart(row){
      $executeControl.updataStatus({ids:[row.id],status:"ENABLE"}).then(res => {
        this.$message({
          message: '启用成功',
          type: 'success'
        })
        this.infoData()
      });
    },
    // table表格停止
    handleStop(row){
      $executeControl.updataStatus({ids:[row.id],status:"DISABLED"}).then(res => {
        this.$message({
          message: '停止成功',
          type: 'success'
        })
        this.infoData()
      });
    },
    // table表格查看
    handleLook(row){
      this.$router.push({name:"CarControl/addEdit",query:{id:row.id,type:"look"}})
    },
    // 批量删除
    allDel(){
      this.$confirm("此操作将删除选中的布控信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        $executeControl.deleteTask(this.multipleSelection).then(res => {
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
      this.$router.push({name:"CarControl/addEdit",query:{type:"add"}})
    },
    // 车辆管理名单
    onPersonManage(){
      this.$router.push({name:"BlockList/carBlock"})
    },
    // 车辆白名单组
    onPersonWhite(){
      this.$router.push({name:"BlockList/carWhite"})
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

