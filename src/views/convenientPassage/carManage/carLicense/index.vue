<template>
  <div class="app-container">
    <el-form ref="formSearch" inline :model="formSearch" v-if="showSearch">
      <el-form-item prop="carNumber" label="车牌号">
        <el-input placeholder="请输入车牌号" v-model="formSearch.licensePlate"></el-input>
      </el-form-item>
      <el-form-item prop="carLicenseType" label="车证状态">
        <el-select v-model="formSearch.carLicenseType" placeholder="请选择车证状态">
          <el-option v-for="item in carStatus" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
      </el-form-item>
      <!-- <el-form-item style="float: right;margin-right: 0">
        <el-button plain icon="el-icon-plus" type="primary" @click="onAwait()">同步</el-button>
      </el-form-item> -->
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
      <el-button  
          icon="el-icon-plus" 
          plain 
          type="primary" 
          @click="onAwait()"
        >同步</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
    </el-row>
    <div style="height:calc(100% - 150px)">
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="licensePlate" label="车牌号码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ownerName" label="车主姓名"></el-table-column>
            <el-table-column prop="ownerPhone" label="车主手机号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="carLicenseType" label="车证状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.carLicenseType == 'VALID' ? '有效' : ((scope.row.carLicenseType == 'INVALID') ? '失效' : ((scope.row.carLicenseType == 'WAITING_VALID') ? '待生效' : '已过期'))}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="bottom">
          <pagination
            v-show="tableData && tableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="formSearch.pageNum"
            :pageSizes="[5,10, 20]"
            :limit.sync="formSearch.pageSize"
            :total="pagination"
          />
        </div>
      
  </div>
</template>

<script>
  import pagination from '@/components/comPagination'
  import {getcarLicense, getawaitLicense} from '@/api/carManage/carLicense'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js"

  export default {
    name:'CarLicense',
    components: {
      pagination,
    },
    data() {
      return {
        // permission: {
        //   searchLicense: 'carManage::carLicense::searchLicense',
        //   awaitLicense: 'carManage::carLicense::awaitLicense',
        // },
        pagination: 0,
        tableData: [],
        showSearch:true,
        multipleArr:[],
        formSearch: {
          licensePlate: '',
          carLicenseType: '',
          pageNum: 1,
          pageSize: 5,
        },
        carStatus: [
          {
            label: '待生效',
            value: 'WAITING_VALID'
          },
          {
            label: '有效',
            value: 'VALID'
          },
          {
            label: '失效',
            value: 'INVALID'
          },
          {
            label: '已过期',
            value: 'EXPIRED'
          },
        ]
      }
    },
    mounted() {
      this.onSearch();
    },
    methods: {
    // table多选
     multipleChange(val){
        let temp = val.map(item=>{
          return {alarmCode:item.code,closeReason:""}
        })
        this.multipleArr = temp
      },
      handleCurrentChange() {
        this.onSearch();
      },
      onSearch() {
        //let obj = getObjByKey(this.permission.searchLicense);
        let data = this.formSearch;
        if(data.licensePlate==''){
          delete data.licensePlate
        }
         if(data.carLicenseType==''){
          delete data.carLicenseType
        }
        getcarLicense(data).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.data;
            this.pagination = res.data.total;
          }
        })
      },
      onAwait() {
        let d = new Date();
        let data = {
          date: `${d.getFullYear()}-${(d.getMonth() + 1)>10?d.getMonth() + 1: '0'+(d.getMonth() + 1)}-${(d.getDate()>10)?d.getDate():'0'+ d.getDate()}`
        };
        //let obj = getObjByKey(this.permission.awaitLicense);
        getawaitLicense(data).then(res => {
          if (res.code === 200) {
            this.$message.success("同步车证成功");
            this.onSearch();
          } else {
            this.$message.error(res.meta.message);
          }
        })
      },
      onReset() {
        this.formSearch.licensePlate = "";
        this.formSearch.carLicenseType = '';
        Object.keys(this.formSearch).forEach((x) => {
          if (x === "pageNum") {
            this.formSearch[x] = 1;
          } else if (x === "pageSize") {
            this.formSearch[x] = 10;
          }
        });
        this.onSearch();
      },
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep.el-table.el-table--fit{
  overflow: hidden;
}

</style>
