el-icon-back spaceOperationsDetail
<template>
    <div class="app-container">
        
      <div>
        <el-button type="text" icon="el-icon-back" style="font-size: 16px;" @click="goBacks">{{name}}</el-button>
      </div>
      <div class="houseDetail">
        <div class="titles">
            房源详情
        </div>
        <el-descriptions title="用户信息" column="5" label-class-name="labelClass" content-class-name="contentClass">
            <el-descriptions-item label="所属地块">{{roomInfoObj.zoneName}}</el-descriptions-item>
            <el-descriptions-item label="所属楼栋">{{roomInfoObj.buildingName}}</el-descriptions-item>
            <!-- <el-descriptions-item label="所属楼层">{{roomInfoObj.zoneName}}</el-descriptions-item> -->
            <el-descriptions-item label="房源名称">{{roomInfoObj.name}}</el-descriptions-item>
            <el-descriptions-item label="房源编码">{{roomInfoObj.code}}</el-descriptions-item>
            <el-descriptions-item label="房源类型">{{roomInfoObj.roomSourceTypeStr}}</el-descriptions-item>
            <el-descriptions-item label="建成时间">{{roomInfoObj.createTime}}</el-descriptions-item>
            <!-- <el-descriptions-item label="装修情况">{{roomInfoObj.zoneName}}</el-descriptions-item> -->
            <el-descriptions-item label="面积">{{roomInfoObj.accruedArea}}</el-descriptions-item>
            <el-descriptions-item label="地址">{{roomInfoObj.address}}</el-descriptions-item>
            <el-descriptions-item label="产权归属">{{roomInfoObj.belongToStr}}</el-descriptions-item>
            <el-descriptions-item label="业主姓名">{{roomInfoObj.ownerName}}</el-descriptions-item>
            <el-descriptions-item label="业主手机号">{{roomInfoObj.housekeepPhone}}</el-descriptions-item>
            <el-descriptions-item label="经营状态">{{roomInfoObj.usageModeStr}}</el-descriptions-item>
            <el-descriptions-item label="租赁状态">{{roomInfoObj.rentedStatusStr}}</el-descriptions-item>
            <el-descriptions-item label="承租人">{{roomInfoObj.companyName}}</el-descriptions-item>
            <el-descriptions-item label="承租人手机号">{{roomInfoObj.companyPhone}}</el-descriptions-item>
            <el-descriptions-item label="月租金">{{roomInfoObj.rent}}</el-descriptions-item>
            <el-descriptions-item label="付款方式">{{roomInfoObj.paymentMode}}</el-descriptions-item>
            <el-descriptions-item label="物业专家">{{roomInfoObj.housekeepName}}</el-descriptions-item>
            <el-descriptions-item label="管家手机号">{{roomInfoObj.housekeepPhone}}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div>
        <el-row :gutter="10">
            <el-col :span="12">
                <div class="titles">
                    租赁历史
                </div>
                <el-table
                    :data="contractRoomTable"
                    style="width: 100%"
                    >
                    <el-table-column type="index" label="序号" width="50" />
                    <el-table-column prop="serialNumber" label="合同编号" />
                    <el-table-column prop="transactor" label="合同状态" />
                    <el-table-column label="合同周期" width="200">
                      <template slot-scope="scope">
                        {{ scope.row.startDate }}~{{ scope.row.endDate }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="transactor" label="经办人" />
                    <el-table-column prop="updateTime" label="更新时间" />
                    <!-- <el-table-column label="操作" width="220">
                        <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="onInfo(scope.row.imgPath)"
                            >查看合同</el-button
                        >
                        </template>
                    </el-table-column> -->
                </el-table>
                <!-- 分页 -->
                <!-- <pagination
                v-show="formSearch.total > 0"
                :total="formSearch.total"
                :page.sync="formSearch.pageNum"
                :limit.sync="formSearch.pageSize"
                @pagination="tableCurrentChange"
                /> -->
            </el-col>
            <el-col :span="12">
                <div class="titles">
                    缴费记录
                </div>
                <el-table
                    :data="feeBillRentTable"
                    style="width: 100%"
                    >
                    <el-table-column type="index" label="序号" width="50" />
                    <el-table-column prop="remark" label="费用名称" />
                    <el-table-column prop="type" label="费用类型" />
                    <el-table-column label="账单周期" width="200">
                      <template slot-scope="scope">
                        {{ scope.row.startExpirydate }}~{{ scope.row.endExpirydate }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="payStateStr" label="缴纳状态" />
                    <el-table-column prop="receiptDueamount" label="缴费金额" />
                    <el-table-column prop="updateTime" label="缴费时间" />
                </el-table>
                <!-- 分页 -->
                <!-- <pagination
                v-show="formSearch.total > 0"
                :total="formSearch.total"
                :page.sync="formSearch.pageNum"
                :limit.sync="formSearch.pageSize"
                @pagination="tableCurrentChange"
                /> -->
            </el-col>
        </el-row>
        
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-image
          style="width: 100%; height: 300px"
          :src="imgUrl"
          ></el-image>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
        
    </div>
  </template>
  
  <script>
  import { roomInfo, contractRoom, feeBillRentRoom } from "@/api/spaceManagement/spaceOperations";
  import pagination from "@/components/comPagination";
  export default {
    name: "",
    components: {
      pagination,
    },
    data() {
      const today =  new Date().getFullYear() + "-" + ((new Date().getMonth() + 1 + '').padStart(2, '0')) + "-" + ((new Date().getDate() + '' ).padStart(2, '0'))
      return {
        dialogVisible: false,
        meetingId:"",
        roomInfoObj:{},
        contractRoomTable:[],
        feeBillRentTable:[],
        name:""
      };
    },
    mounted() {
      this.roomId = this.$route.query.id
      this.name = this.$route.query.name
      this.init()
    },
    methods: {
      // 初始化
      init(){
        this.roomInfoData()
        this.contractRoomData()
        this.feeBillRentRoomData()
      },
      // 返回
      goBacks(){
          this.$router.push({name:"SpaceOperations"})
      },
      // 房源信息
      roomInfoData(){
        roomInfo({id:this.roomId}).then(res=>{
          this.roomInfoObj = res.data
        })
      },
      // 租赁历史
      contractRoomData(){
        contractRoom({roomId:this.roomId}).then(res=>{
          this.contractRoomTable = res.data
        })
      },
      // 缴费记录
      feeBillRentRoomData(){
        feeBillRentRoom({roomId:this.roomId}).then(res=>{
          this.feeBillRentTable = res.data
        })
      },
      // 查看合同
      onInfo(url) {
        this.dialogVisible = true;
        this.imgUrl = url
      },
    }
  };
  </script>
  
  <style scoped>
    .titles{
        width: 100%;
        padding-bottom: 10px;
        border-bottom:solid 2px #ccc;
        margin-bottom: 10px;
    }
    ::v-deep .labelClass,::v-deep .contentClass{
        font-size: 14px !important;
    }
    .houseDetail{
        margin-bottom: 20px;
    }
  </style>
  