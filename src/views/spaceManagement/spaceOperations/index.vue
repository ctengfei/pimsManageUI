<template>
    <div class="app-container">
      <el-row :gutter="20" style="overflow-y:hidden;">
        <el-col style="height:inherit">
          <div class="ListManage" style="height:100%">
            <el-form
              ref="formSearch"
              inline
              :model="formSearch"
              class="demo-form-inline"
            >
              <el-form-item prop="name" label="房源名称">
                <el-input
                  v-model="formSearch.name"
                  placeholder="请输入房源名称"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="房源类型" prop="sourceType">
                <el-select
                  v-model="formSearch.sourceType"
                  placeholder="请选择房源类型"
                  clearable
                >
                  <el-option
                    v-for="item in sourceTypeArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="经营状态" prop="usageMode">
                <el-select
                  v-model="formSearch.usageMode"
                  placeholder="请选择经营状态"
                  clearable
                >
                  <el-option
                    v-for="item in usageModeArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产权归属" prop="belongTo">
                <el-select
                  v-model="formSearch.belongTo"
                  placeholder="请选择产权归属"
                  clearable
                >
                  <el-option
                    v-for="item in belongToArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="onSearch"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh-left"
                  @click="onReset('formSearch')"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column prop="zoneName" label="所属地块" />
          <el-table-column prop="code" label="房源编码" />
          <el-table-column prop="name" label="房源名称" />
          <el-table-column prop="roomSourceTypeStr" label="房源类型" />
          <el-table-column prop="rentedStatusStr" label="经营状态" />
          <el-table-column prop="createTime" label="建成时间" />
          <el-table-column prop="belongToStr" label="产权归属" />
          <el-table-column prop="accruedArea" label="面积（㎡）" />
          <el-table-column prop="address" label="地址" />
          <el-table-column prop="updateTime" label="更新时间" />
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="onInfo(scope.row)"
                >查看租赁信息</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
       
        <!-- 分页 -->
        <pagination
          v-show="formSearch.total > 0"
          :total="formSearch.total"
          :page.sync="formSearch.pageNum"
          :limit.sync="formSearch.pageSize"
          @pagination="tableCurrentChange"
        />
    </div>
  </template>
  
  <script>
  import { searchRoom, roomInfo, contractRoom, feeBillRentRoom, getRoomSourceType, getUsageModeEnum, getBelongToEnum } from "@/api/spaceManagement/spaceOperations";
  import pagination from "@/components/comPagination";
  export default {
    name: "",
    components: {
      pagination,
    },
    data() {
      const today =  new Date().getFullYear() + "-" + ((new Date().getMonth() + 1 + '').padStart(2, '0')) + "-" + ((new Date().getDate() + '' ).padStart(2, '0'))
      return {
        // tableData每个row的值
        rowData: {},
        preStatus: false,
        // 总数量
        total: 5,
        formSearch: {
          // 搜索的表单
          pageNum: 1,
          pageSize: 10,
          total: 0,
          belongTo:"",
          sourceType:"",
          status:"",
          usageMode:"",
        },
        foreignStates:[
          {
            label: "开放",
            value: "1"
          },
          {
            label: "不开放",
            value: "0"
          },
        ],
        // 表格的数据
        tableData: [],
        roomId:"",
        roomObj:{},
        belongToArr:[],
        usageModeArr:[],
        sourceTypeArr:[]
      };
    },
    mounted() {
      this.init()
    },
    methods: {
      // 初始化
      init(){
        this.getRoomSourceTypeArr();
        this.getRoomRentedStatusArr();
        this.getUsageModeEnumArr();
        this.getTableData();
      },
      onInfo(data) {
        this.roomObj = data
        this.roomId = data.id
        this.$router.push({name:"SpaceOperationsDetail",query:this.roomObj})
      },
      // 获取房源类型
      getRoomSourceTypeArr(){
        getRoomSourceType().then(res=>{
          this.sourceTypeArr = this.formatData(res.data)
        })
      },
      // 获取经营类型
      getRoomRentedStatusArr(){
        getUsageModeEnum().then(res=>{
          this.usageModeArr = this.formatData(res.data)         
        })
      },
      // 获取产权归属
      getUsageModeEnumArr(){
        getBelongToEnum().then(res=>{
          this.belongToArr = this.formatData(res.data)
        })
      },
      // 格式化数据
      formatData(arrObj){
          let temp = [];
          for(var i in arrObj){
              temp.push({name:arrObj[i],value:i})
          }
          return temp
      },
      //  获取列表信息
      getTableData() {
        searchRoom(this.formSearch).then(res => {
            this.tableData = res.data.data;
            this.formSearch.pageNum = res.data.pageNum;
            this.formSearch.pageSize = res.data.pageSize;
            this.formSearch.total = res.data.total;
        });
      },
      // 搜索列表信息
      onSearch() {
        this.getTableData();
      },
      onReset() {
        this.formSearch.pageNum = 1,
        this.formSearch.pageSize = 10
        this.$refs.formSearch.resetFields()
        this.getTableData();
      },
      // table分页
      tableCurrentChange(val){
          this.formSearch.pageNum = val.page;
          this.getTableData(this.formSearch);
      },
    }
  };
  </script>
  
  <style scoped>
  .content-bottom {
    margin-bottom: 20px;
  }
   ::v-deep.el-table.el-table--fit{
    overflow: hidden;
  }
  ::v-deep .el-dialog__body{
    padding-top:10px;
  }
  .btnBox{
      display: block;
      margin: 20px 0;
      text-align: right;
    }
  </style>
  