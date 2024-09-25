   <template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <div class="homeShow" v-if="contentTable">
        <div class="flex">
          <el-form ref="formSearchs" inline :model="formSearch" v-if="showSearch">
            <el-form-item prop="name">
              <el-input placeholder="请输入人脸布控任务名称" v-model="formSearch.name"></el-input>
            </el-form-item>
            <el-form-item prop="createTime">
              <el-date-picker
                v-model="formSearch.createTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择创建日期"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="carStatus">
              <el-select v-model="formSearch.status" placeholder="请选择车证状态">
                <el-option v-for="item in carStatus" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
              <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
            </el-row>
        </div>
        <!-- 表格数据 -->
        <div style="height:calc(100% - 50px)">
          <el-button type="primary" @click="allDel()">批量删除</el-button>
          <el-button type="primary" @click="onAddTask()">新建人脸布控任务</el-button>
          <el-button type="primary" @click="onPersonManage()">人员名单管理</el-button>
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
              <el-table-column prop="alarmLevelStr" label="告警类型" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="groupName" label="人员黑名单" show-overflow-tooltip></el-table-column>
              <el-table-column prop="cameraList" label="布控摄像机" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.cameraList" :key="index">{{ item }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="synchronizeTime" label="操作" show-overflow-tooltip>
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="handleLook(scope.row)"
                >查看</el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleStart(scope.row)"
                >启用</el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleStop(scope.row)"
                >停止</el-button>
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
import { getDicts, add, del } from "@/api/system/dict";
var GisMapObj = null,
  viewer = null,
  that = null;
export default {
  name:'CarControl',
  components: {
    pagination
  },
  data() {
    return {
      groupType: "CAR_GROUP_DICT:71042",
      controlTableData:[],
      contentTable: true,
      showSearch:true,
      carStatus: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        },
      ],
      formSearch: {
        name: '',
        createTime: '',
        status: null,
        pageNum: 1,
        pageSize: 10,
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
    // this.infoData();
    // this.init();
  },
  methods: {
    // 重置
    onReset(){
      this.$refs['formSearchs'].resetFields()
    },
    // table多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    init() {
      getDicts('/sys/dict/type/page', 'get', this.searchData).then(res => {
        if (res.code === 200) {
          let datas = res.data.data.filter(item => {
            return item.code == "White" || item.code == "Black";
          });
          for (let i in datas) {
            datas[i].children = [];
            datas[i].level = 1;
          }
          this.groups = datas;
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    // 初始化车辆布控数据
    infoData() {
      //let obj = getObjByKey(this.permission.getCarMonitorTask);
      this.formSearch.pageNum = 1;
      this.formSearch.pageSize = 10;
      console.log(this.formSearch,"this.formSearch")
      // getCarMonitorTask(this.formSearch).then(res => {
      //   if (res.code === 200) {
      //     this.total = res.data.total;
      //     this.controlTableData = res.data.data;
      //     this.formSearch.pageNum = res.data.pageNum;
      //     this.formSearch.pageSize = res.data.pageSize;
      //     const totalPage = Math.ceil(this.total / this.formSearch.pageSize);
      //     if (
      //       totalPage === this.formSearch.pageNum &&
      //       this.controlTableData.length === 1
      //     ) {
      //       this.formSearch.pageNum--;
      //     }
      //   } else {
      //     this.$message.error(res.meta.message);
      //   }
      // });
    },
    // 根据车主搜索
    onSearch() {
      this.infoData();
    },
    // 切换到第几页了
    handleCurrentChange(n) {
      // this.pageNum = n
      this.infoData();
    },
    // table表格修改
    handleUpdate(row){},
    // table表格启用
    handleStart(row){},
    // table表格停止
    handleStop(row){},
    // table表格查看
    handleLook(row){},
    // 批量删除
    allDel(){},
    // 新增人脸布控任务
    onAddTask(){

    },
    // 人员管理名单
    onPersonManage(){
      
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

