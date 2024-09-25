<template>
  <div class="app-container">
    <el-form ref="formSearch" inline :model="formSearch">
      <el-form-item prop="personName" label="人员姓名">
        <el-input
          placeholder="请输入人员姓名"
          clearable
          v-model="formSearch.personName"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type" label="人员类型">
        <el-select v-model="formSearch.type">
          <el-option
            v-for="item in btnGroup"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="openingMode" label="开闸方式">
        <el-select v-model="formSearch.openingMode">
          <el-option
            v-for="item in openingModes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="刷卡时间">
        <el-date-picker
          :clearable="false"
          v-model="timeInterval"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
        <el-button  icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
      </el-form-item>
      <el-form-item style="float: right;margin-right: 0">
        <el-button plain type="primary" :disabled="multipleArr.length == 0" @click="onExport()">导出</el-button>
      </el-form-item>
    </el-form>
        <!-- 表格数据 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="multipleChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="personName" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="personTypeName" label="人员类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="刷卡时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="passTypeName" label="进出状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="openingModeName" label="开闸方式" show-overflow-tooltip></el-table-column>
          <el-table-column prop="doorId" label="闸机编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="doorArea" label="闸机位置" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button @click="lookDetail(scope.row)" type="text">人员详情</el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="passTypeName" label="进入/离开" show-overflow-tooltip></el-table-column> -->

          <!-- <el-table-column prop="doorName" label="门禁（授权门禁）" show-overflow-tooltip></el-table-column> -->
          <!-- <el-table-column prop="openingModeName" label="开闸方式（通行方式）" show-overflow-tooltip></el-table-column>
          <el-table-column prop="passState" label="通过状态" show-overflow-tooltip></el-table-column> -->
          <!-- <el-table-column prop="personImg" label="人脸照片" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-image 
                style="width: 100px; height: 100px"
                :src="scope.row.personImg" 
                :preview-src-list="[scope.row.personImg]">
              </el-image>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- 分页 -->
        <div class="bottom">
          <pagination
            v-show="tableData && tableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="formSearch.pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="pageSize"
            :total="pagination"
          />
        </div>
        <!-- 查看人员详情 -->
        <el-dialog
            :close-on-click-modal="false"
            title="人员详情"
            :visible.sync="dialogShow"
            :before-close="dialogClose"
            width="35%"
        >
          <el-row>
              <el-col :span="6">
                <el-image
                  style="width: 90%; height: 200px"
                  :src="detailData.personImg">
                </el-image>
              </el-col>
              <el-col :span="18">
                  <el-descriptions :column="2" label-class-name="labelClass" content-class-name="contentClass">
                      <el-descriptions-item label="姓名">{{ detailData.personName }}</el-descriptions-item>
                      <el-descriptions-item label="卡号">{{ detailData.userDoorNum }}</el-descriptions-item>
                      <el-descriptions-item label="身份证号码">{{ detailData.idNumber }}</el-descriptions-item>
                      <el-descriptions-item label="权限类型">{{ detailData.permissionTypeName }}</el-descriptions-item>
                      <el-descriptions-item label="性别">{{ detailData.sex }}</el-descriptions-item>
                      <el-descriptions-item label="起始日期">{{ detailData.validEndTime }}</el-descriptions-item>
                      <el-descriptions-item label="手机号码">{{ detailData.phone }}</el-descriptions-item>
                      <el-descriptions-item label="截止日期">{{ detailData.validBeginTime }}</el-descriptions-item>
                      <el-descriptions-item label="人员类型">{{ detailData.typeName }}</el-descriptions-item>
                      <el-descriptions-item label="进出时间">{{ detailData.createTime }}</el-descriptions-item>
                      <el-descriptions-item label="关联房屋">{{ detailData.house }}</el-descriptions-item>
                      <el-descriptions-item label="进出状态">{{ detailData.passTypeName }}</el-descriptions-item>
                      <el-descriptions-item label="房屋联系人">{{ detailData.houseContacts }}</el-descriptions-item>
                      <el-descriptions-item label="识别方式">{{ detailData.openingModeName }}</el-descriptions-item>
                      <el-descriptions-item label="联系人电话">{{ detailData.contactsPhone }}</el-descriptions-item>
                      <el-descriptions-item label="闸机编号">{{ detailData.doorId }}</el-descriptions-item>
                      <el-descriptions-item label="车牌号码">{{ detailData.licensePlateNumber }}</el-descriptions-item>
                      <el-descriptions-item label="闸机名称">{{ detailData.doorName }}</el-descriptions-item>
                      <el-descriptions-item label="工作单位">{{ detailData.enterpriseName }}</el-descriptions-item>
                      <el-descriptions-item label="闸机位置">{{ detailData.doorArea }}</el-descriptions-item>
                  </el-descriptions>
              </el-col>
          </el-row>
        </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/components/comPagination'
  import {getAccess, exportPersonPassRecord, getPersonType} from '@/api/peopleManage/index'
  import { downloadFile, formatData } from "@/utils/index";

  export default {
    name:'AccessControl',
    components: {
      pagination,
    },
    data() {
      return {
        // permission: {
        //   searchAccsee: "peopleManage::accessControl::searchAccsee",
        // },
        formSearch:{
          personName:"",
          type:"",
          openingMode:"",
          pageNum: 1,
          pageSize: 10,
        },
        btnGroup: [],
        openingModes:[
          {
            value:"FACE",
            label:"人脸识别",
          },
          {
            value:"ACCESSCONTROL",
            label:"门禁",
          },
          {
            value:"QRCODE",
            label:"二维码",
          }
        ],
        timeInterval: [],
        pageNum: 1,
        pageSize: 10,
        pagination: 0,
        tableData: [],
        multipleArr: [],
        dialogShow: false,
        detailData:{}
      }
    },
    mounted() {
      // this.getDefaultTime();
      this.onSearch();
      this.getPersonTypes();
    },
    methods: {
      // 获取人员类型
      getPersonTypes(){
        getPersonType().then(res=>{
          this.btnGroup = formatData(res.data)
        })
      },
      // 导出
      onExport(){
        exportPersonPassRecord(this.multipleArr).then(res=>{
          downloadFile(res, '人员信息', "xls");
          this.$message.success("导出成功")
        })
      },
      // table多选
      multipleChange(val){
          let temp = val.map(item=>item.id)
          this.multipleArr = temp
      },
      // 人员详情
      lookDetail(row){
        this.detailData = Object.assign({},row)
        this.dialogShow = true
      },
      // 查看详情
      dialogClose(){
        this.dialogShow = false
      },
      handleCurrentChange() {
        this.onSearch();
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
      onSearch() {
        //let obj = getObjByKey(this.permission.searchAccsee);
        const date1 = this.timeInterval[0];
        const date2 = this.timeInterval[1];
        let startTime = date1;
        let endTime = date2;
        this.formSearch.startTime = startTime
        this.formSearch.endTime = endTime
        getAccess(this.formSearch).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.data;
            this.pagination = res.data.total;
          }
        })
      },
      onReset() {
        this.timeInterval = []
        this.$refs.formSearch.resetFields()
        this.onSearch();
      },
    }
  };
</script>

<style lang="scss" scoped>
::v-deep .labelClass,::v-deep .contentClass{
  font-size: 14px !important;
}
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
