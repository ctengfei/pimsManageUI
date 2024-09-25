<template>
  <div class="app-container">
    <el-form ref="formSearch" inline :model="formSearch">
        <el-form-item prop="licenseOrOwner" label="车牌号或车主姓名">
          <el-input placeholder="请输入车牌号或车主姓名" v-model="formSearch.licenseOrOwner"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="parkingLotType" label="车场类型">
          <el-select v-model="formSearch.parkingLotType" placeholder="请选择车场车类">
            <el-option v-for="item in parkingLotTypes" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="过场时间">
          <el-date-picker
           :clearable="true"
            v-model="timeInterval"
            type="datetimerange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right;margin-right: 0">
          <el-button plain type="primary" :disabled="multipleArr.length == 0" @click="onExport()">导出</el-button>
        </el-form-item>
      </el-form>
        <!-- 表格数据 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="multipleChange"
          height="650"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <!-- <el-table-column type="index" label="序号"></el-table-column> -->
          <el-table-column prop="carPlate" label="车牌号码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ownerName" label="车主姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="parkingSpaceTypeName" label="车位类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="directionName" label="出入状态" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="parkingLotArea" label="车场区域" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="parkingLotArea" label="车道名称" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="enterOrOutName" label="入口/出口" show-overflow-tooltip></el-table-column> -->
          <el-table-column label="出入时间" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.enterTime }}{{ scope.row.outTime }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="outTime" label="出场时间" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="parkingTime" label="停车时长" show-overflow-tooltip></el-table-column>
          <el-table-column prop="realChargeAmount" label="实收金额（元）" show-overflow-tooltip></el-table-column>
          <el-table-column prop="chargeAmount" label="应收金额（元）" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="creator" label="操作员" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="vehicleImg" label="车辆照片" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-image :src="carImgIp + scope.row.vehicleImg" style="width: 60px; height: 60px" :preview-src-list="[carImgIp + scope.row.vehicleImg]"/>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="bottom">
          <pagination
            v-show="tableData && tableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="formSearch.pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="formSearch.pageSize"
            :total="pagination"
          />
        </div>
  </div>
</template>

<script>
  import pagination from '@/components/comPagination'
  import {getcarRecord,exportCarRecord} from '@/api/carManage/carPassingRecord'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import { downloadFile } from "@/utils/index";
  export default {
    name:'CarPassingRecord',
    components: {
      pagination,
    },
    data() {
      return {
        permission: {
          searchRecord: 'carManage::carPassingRecord::searchRecord',
        },
        pagination: 0,
        tableData: [],
        formSearch: {
          licenseOrOwner: '',
          carNumber: '',
          ownerName: '',
          ownerPhone: '',
          pageNum: 1,
          pageSize: 10,
        },
        timeInterval: [],
        // 车场类型
        parkingLotTypes: [
          {
            name:"免费车",
            value:0
          },
          {
            name:"月租车",
            value:1
          },
          {
            name:"临时车",
            value:2
          },
          {
            name:"初值车",
            value:3
          }
        ],
        multipleArr:[],
        carImgIp:process.env.VUE_APP_CARIMG,
      }
    },
    mounted() {
      // this.getDefaultTime();
      this.onSearch();
    },
    methods: {
       // table多选
      multipleChange(val){
        let temp = val.map(item=>item.id)
        this.multipleArr = temp
      },
      getDefaultTime() {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let starthour = "00";
        let startminutes = "00";
        let startsecond = "00";
        let endhour = "23";
        let endminutes = "59";
        let endsecond = "59";
        this.timeInterval = [new Date(year, month, day, starthour, startminutes, startsecond), new Date(year, month, day, endhour, endminutes, endsecond)]
      },
      p(s) {
        return s < 10 ? '0' + s : s
      },
      dates(d) {
        const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
        const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds());
        return `${resDate} ${resTime}`
      },

      handleCurrentChange() {
        this.onSearch();
      },
      // 导出
      onExport(){
        exportCarRecord(this.multipleArr).then(res=>{
          downloadFile(res, '车辆通行记录', "xlsx");
          this.$message.success("导出成功")
        })
      },
      // 搜索
      onSearch() {
        const date1 = this.timeInterval[0];
        const date2 = this.timeInterval[1];
        let startTime = date1;
        let endTime = date2;
        this.formSearch.startTime = startTime
        this.formSearch.endTime = endTime
        getcarRecord(this.formSearch).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.data;
            this.pagination = res.data.total;
//            res.data.mediaMeta.pictures.map((item) => {
//              this.setPhoto(item).then((val) => {
//                let img = `data:img/jpg;base64,${val.data}`;
//                this.$set(item, "img", img);
//              });
//            });
          }
        })
      },
      onReset() {
        // this.formSearch.carNumber = '';
        this.$refs.formSearch.resetFields()
        this.timeInterval = []
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
  .btnGroups {
    cursor: pointer;
    background-color: #313448;
    border-radius: 30px;
    width: 330px;
    height: 42px;
    text-align: center;
    display: flex;
    justify-content: space-around;
    align-items: center;
    & > div {
      display: inline-block;
    }
    .btn {
      width: 110px;
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

  .flex {
    display: flex;
    justify-content: space-between
  }
    ::v-deep.el-table.el-table--fit{
  overflow: hidden;
}
</style>
