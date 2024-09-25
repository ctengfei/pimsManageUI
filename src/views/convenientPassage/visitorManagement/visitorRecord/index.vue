<template>
    <div class="app-container">
      <div style="height: 100%">
        <div>
          <el-form ref="formSearch" inline :model="visitorManage" v-if="showSearch">
            <el-form-item prop="visitorName" label="门口机">
              <el-input
                placeholder="请输入门口机"
                clearable
                v-model="visitorManage.visitorName"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item prop="vistStateEnum" label="当前状态">
              <el-select v-model="visitorManage.vistStateEnum">
                <el-option
                  v-for="item in btnGroup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="开锁时间">
              <el-date-picker
                v-model="time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="onSearch()"
                >搜索</el-button
              >
              <el-button
                icon="el-icon-refresh-left"
                @click="onReset()"
                >重置</el-button
              >
            </el-form-item>
            <el-form-item style="float: right;margin-right: 0">
              <!-- <el-button plain type="primary" :disabled="multipleArr.length == 0" @click="onExport()">导出</el-button> -->
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
          </el-row>
        </div>
        <!-- 表格数据 -->
        <div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            @selection-change="multipleChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="entranceGuard" label="门口编号"></el-table-column>
            <el-table-column prop="visitorName" label="门口机"></el-table-column>
            <el-table-column prop="visitPlace" label="分机"></el-table-column>
            <el-table-column prop="createTime" label="开锁时间"></el-table-column>
            <!-- <el-table-column prop="visitorName" label="访客姓名"></el-table-column>
            <el-table-column prop="visitorName" label="门口机"></el-table-column>
            <el-table-column prop="cardNum" label="身份证号"></el-table-column>
            <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="licensePlate" label="车牌号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="visitoredName" label="被访人姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="visitPlace" label="到访地点（楼栋、单元、房间）" show-overflow-tooltip></el-table-column>
            <el-table-column prop="entranceGuard" label="门禁（授权门禁）" show-overflow-tooltip></el-table-column>
            <el-table-column prop="validBeginTime" label="有效起日" show-overflow-tooltip></el-table-column>
            <el-table-column prop="validEndTime" label="有效止日" show-overflow-tooltip></el-table-column>
            <el-table-column prop="stateName" label="当前状态" show-overflow-tooltip></el-table-column>
            <el-table-column prop="personImg" label="人脸照片" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-image 
                  style="width: 100px; height: 100px"
                  :src="scope.row.personImg" 
                  :preview-src-list="[scope.row.personImg]">
                </el-image>
              </template>
            </el-table-column> -->
          </el-table>
          <pagination
            v-show="tableData && tableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="visitorManage.pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="visitorManage.pageSize"
            :total="pagination"
          />
        </div>
        <!-- 分页 -->
      </div>
    </div>
  </template>
  
  <script>
  import { visitorRecord, visitorRecordExport } from "@/api/peopleManage";
  
  import { getAccessControl } from "@/api/peopleManage/index.js";
  import pagination from "@/components/comPagination";
  import { downloadFile } from "@/utils/index";
  
  export default {
    name:'PeopleBase',
    components: {
      pagination,
    },
    data() {
      return {
        visitorManage: {
          pageSize: 10,
          pageNum: 1,
          visitorName: "",
          vistStateEnum: "",
          validBeginTime: "",
          validEndTime: ""
        },
        time: [],
        options: [{ value: "", name: "" }],
        btnChoose: "企业人员信息",
        btnGroup: [
          {
            value: "EFFECTIVE",
            label: "有效",
          },
          {
            value: "NOAVAIL",
            label: "失效",
          }
        ],
        homepage: true,
        pagination: 10,
        tableData: [],
        showSearch:true,
        multipleArr:[],
        rowData: {},
      };
    },
    mounted() {
      this._getVisitorData();
      if(this.$route.query.id){
          this.btnChoose = "访客人员信息";
          this.visitorManage.type = this.$route.query.id
          this.onSearch()
        }
    },
    methods: {
      // 导出
      onExport(){
        visitorRecordExport(this.multipleArr).then(res=>{
          downloadFile(res, '人员信息', "xlsx");
          this.$message.success("导出成功")
        })
      },
      // table多选
      multipleChange(val){
          let temp = val.map(item=>item.id)
          this.multipleArr = temp
      },
      btnClick(item, index) {
        this.btnChoose = item.label;
        this.visitorManage.type = item.value;
        this._getVisitorData();
      },
      onControl(data) {
        this.rowData = data;
        this.homepage = false;
      },
  
      _getVisitorData() {
        if(this.time.length){
          this.visitorManage.validBeginTime = this.time[0];
          this.visitorManage.validEndTime = this.time[1];
        }
        visitorRecord(this.visitorManage)
          .then((res) => {
            this.tableData = res.data.data;
            this.pagination = res.data.total;
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      // 搜索
      onSearch() {
        this._getVisitorData();
      },
      // 重置
      onReset() {
        this.time = []
        Object.keys(this.visitorManage).forEach((x) => {
          if (x === "pageNum") {
            this.visitorManage[x] = 1;
          } else if (x === "pageSize") {
            this.visitorManage[x] = 10;
          }
        });
        this.$refs.formSearch.resetFields()
        this._getVisitorData();
      },
      handleSizeChange(val) {
        this.visitorManage.pageSize = val;
        this._getVisitorData();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this._getVisitorData();
        console.log(`当前页: ${val}`);
      },
      authorityShow(data) {
        this.homepage = data;
      },
      onAwait() {
        let d = new Date();
        let data = {
          date: `${d.getFullYear()}-${
            d.getMonth() + 1 > 10 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)
          }-${d.getDate() > 10 ? d.getDate() : "0" + d.getDate()}`,
        };
        //let obj = getObjByKey(this.permission.awaitAuthority);
        getAwait(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("同步人员成功");
            this._getVisitorData();
          } else {
            this.$message.error(res.meta.message);
          }
        });
      },
    },
  };
  </script>
  <style lang='scss' scoped>
  .btnGroups {
    cursor: pointer;
    background-color: #f5f7fa;
    border-radius: 30px;
    width: 240px;
    height: 42px;
    text-align: center;
    display: flex;
    justify-content: space-around;
    align-items: center;
    & > div {
      display: inline-block;
    }
    .btn {
      width: 120px;
      height: 42px;
      border-radius: 30px;
      line-height: 42px;
      color: #afb9d0;
      font-size: 14px;
    }
    .divActive {
      background-color: #206aff;
      color: #fff;
    }
  }
  
  .color {
    color: #206aff;
  }
    ::v-deep.el-table.el-table--fit{
    overflow: hidden;
  }
  </style>
  