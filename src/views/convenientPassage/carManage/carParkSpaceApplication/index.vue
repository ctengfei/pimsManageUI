<template>
    <div class="app-container">
      <el-form ref="formSearch" inline :model="formSearch" v-if="showSearch">
        <el-form-item prop="visitors" label="来访人姓名">
          <el-input placeholder="请输入来访人" v-model="formSearch.visitors"></el-input>
        </el-form-item>
        <el-form-item prop="visitorsPhone" label="车牌号码">
          <el-input placeholder="请输入车牌号" v-model="formSearch.visitorsPhone"></el-input>
        </el-form-item>
        <el-form-item prop="approvalStatus" label="审批状态">
          <el-select v-model="formSearch.approvalStatus" placeholder="请选择审批状态">
            <el-option v-for="item in approvalStatusArr" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right;margin-right: 0">
          <!-- <el-button type="primary" @click="addCar()">添加车辆</el-button> -->
          <!-- <el-button plain type="primary" :disabled="multipleArr.length == 0" @click="onExport()">导出</el-button> -->
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
      </el-row>
          <!-- 表格数据 -->
          <div style="height:calc(100vh - 295px)">
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%;"
              @selection-change="multipleChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="interviewee" label="被访人"></el-table-column>
              <el-table-column prop="intervieweePhone" label="被访人手机号码" show-overflow-tooltip></el-table-column>
              <el-table-column prop="visitors" label="来访人" show-overflow-tooltip></el-table-column>
              <el-table-column prop="visitorsPhone" label="来访人手机号" show-overflow-tooltip></el-table-column>
              <el-table-column prop="licensePlateNumber" label="车牌号码" show-overflow-tooltip></el-table-column>
              <el-table-column prop="validBeginTime" label="开始时间" show-overflow-tooltip></el-table-column>
              <el-table-column prop="validEndTime" label="结束时间" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="申请提交时间" show-overflow-tooltip></el-table-column>
              <el-table-column prop="approvalStatusName" label="审批状态" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="onLook(scope.row)" v-if="scope.row.approvalStatus !== 'PENDING'" type="text">查看</el-button>
                    <!-- <el-button @click="onEdit(scope.row)" type="text" icon="el-icon-edit">修改</el-button> -->
                    <!-- <el-button @click="onDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button> -->
                    <el-button @click="parkSpaceApply(scope.row)" v-else type="text">审批</el-button>
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
              :pageSizes="[10, 20, 30, 40]"
              :limit.sync="formSearch.pageSize"
              :total="pagination"
            />
          </div>
          <!-- 申请车位、编辑申请 -->
          <el-dialog
              :close-on-click-modal="false"
              :title="parkSpaceTitle"
              :visible.sync="parkSpaceShow"
              :before-close="parkSpaceClose"
              :hide-required-asterisk="false"
              width="35%"
          >
              
                  <p class="formTitle">车辆信息</p>
                  <el-form
                      ref="addForms"
                      :model="addForms"
                      class="demo-form-inline"
                      labelWidth="100px"
                  >
                  <el-row>
                      <el-col :span="12">
                          <el-form-item prop="interviewee" label="被访人">
                              <el-input
                              v-model.trim="addForms.interviewee"
                              placeholder=""
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="intervieweePhone" label="被访人手机号码">
                              <el-input
                              v-model.trim="addForms.intervieweePhone"
                              placeholder=""
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="intervieweeCompany" label="被访单位">
                              <el-input
                              v-model.trim="addForms.intervieweeCompany"
                              placeholder=""
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="visitors" label="来访人">
                              <el-input
                              v-model.trim="addForms.visitors"
                              placeholder=""
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="visitorsPhone" label="来访人手机号码">
                              <el-input
                              v-model.trim="addForms.visitorsPhone"
                              placeholder=""
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="visitorsNum" label="来访人数">
                              <el-input
                              v-model.trim="addForms.visitorsNum"
                              placeholder=""
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="visitorsReason" label="来访事由">
                              <el-input
                              v-model.trim="addForms.visitorsReason"
                              placeholder=""
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="carPlate" label="车牌号码">
                            <el-input
                              v-model.trim="addForms.carPlate"
                              placeholder=""
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="areaName" label="停车场">
                          <el-input
                              v-model.trim="addForms.areaName"
                              placeholder=""
                              disabled
                              ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="carType" label="停车类型">
                          <el-input
                              v-model.trim="addForms.carType"
                              placeholder=""
                              disabled
                              ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="validBeginTime" label="开始时间">
                          <el-input
                              v-model.trim="addForms.validBeginTime"
                              placeholder=""
                              disabled
                              ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="validEndTime" label="结束时间">
                          <el-input
                              v-model.trim="addForms.validEndTime"
                              placeholder=""
                              disabled
                              ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="createTime" label="申请提交时间">
                            <el-date-picker
                                disabled
                                style="width:100%"
                                value-format="yyyy-MM-dd"
                                v-model="addForms.createTime"
                                type="date"
                                placeholder="">
                            </el-date-picker>
                          </el-form-item>
                      </el-col>
                      <div style="width: 100%;" class="formTitle">审批信息</div>
                        <el-col :span="12" v-if="!isLook">
                            <el-form-item prop="approvalStatus" label="审批状态" :rules="[{ required: true, message: '请选择审批状态', trigger: ['blur','change'] }]">
                                <el-radio-group v-model="addForms.approvalStatus">
                                    <el-radio label="PASS">通过</el-radio>
                                    <el-radio label="REFUSE">拒绝</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-else>
                              <el-form-item prop="approvalStatusName" label="审批状态" >
                                  <el-input
                                  v-model.trim="addForms.approvalStatusName"
                                  disabled
                                  ></el-input>
                              </el-form-item>
                        </el-col>
                        <el-col :span="12" v-show="isLook">
                            <el-form-item prop="updateTime" label="审批时间">
                                <el-input
                                v-model.trim="addForms.updateTime"
                                disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-show="isLook">
                            <el-form-item prop="approvaledBy" label="审批人">
                                <el-input
                                v-model.trim="addForms.approvaledBy"
                                disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
              <div slot="footer" style="text-align:center;">
                <el-button @click="onApplication()" v-if="isHide" type="primary">确定</el-button>
                <el-button @click="cancelApplication()" >{{ isHide ? '取消' : '关闭'}}</el-button>
              </div>
          </el-dialog>
    </div>
  </template>
  
  <script>
    import pagination from '@/components/comPagination'
    import {getcarInfo, getawaitInfo, exportCarInfo, addCarInfo, editCarInfo, lookCarInfo, delCarInfo} from '@/api/carManage/carInfo'
    import * as $carParkingSet from "@/api/carManage/carParkingSet"
    import * as $carParkSpace from "@/api/carManage/carParkSpace"
    import {getObjByKey, getStringByKey} from "@/utils/voice.js"
    import { downloadFile } from "@/utils/index";
    import ImageUpload from "@/components/ImgUploadArr"
    import { formatData } from "@/utils/index";

    export default {
      name:'CarParkSpaceApplication',
      components: {
        pagination,
        ImageUpload
      },
      data() {
        return {
          // permission:{
          //   searchInfo: 'carManage::carInfo::searchInfo',
          //   awaitInfo: 'carManage::carInfo::awaitInfo',
          // },
          pageNum: 1,
          pageSize: 10,
          pagination: 0,
          tableData: [],
          showSearch:true,
          multipleArr:[],
          formSearch: {
            licensePlateType: '',
            parkingLotType: '',
            vehicleType: '',
            approvalStatus: '',
            visitorsPhone:'',
            visitors:'',
            pageNum: 1,
            pageSize: 10,
          },
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
          // 车辆类型
          vehicleTypes: [
            {
              name:"小型车",
              value:0
            },
            {
              name:"中型车",
              value:1
            },
            {
              name:"大型车",
              value:2
            },
          ],
          // 车牌类型
          licensePlateTypes: [
            {
              name:"新能源车牌",
              value:0
            },
            {
              name:"普通蓝牌",
              value:1
            },
            {
              name:"黑牌",
              value:2
            },
            {
              name:"黄牌",
              value:3
            },
            {
              name:"双层黄牌",
              value:4
            },
            {
              name:"警车车牌",
              value:5
            },
            {
              name:"新式武警车牌",
              value:6
            },
            {
              name:"使馆车牌",
              value:8
            },
            {
              name:"港澳车牌",
              value:9
            },
          ],
          addForms: {
            carPlate: "",
            exteriorColor: "",
            idcard: "",
            licensePlateColor: "",
            licensePlateType: "",
            model: "",
            ownerName: "",
            ownerPhone: "",
            validBeginTime: "",
            validEndTime: "",
            vehicleBrand: "",
            vehicleType: "",
            createTime:"",
            approvalStatus: "",
            parkingLotNum: "",
            parkName: "",
            parkCarlot: "",
            parkAddress:"",
            parkType:"",
            authorizedLane:[],
            approvalStatusName:""
          },
          isLook: false,
          parkList:[],
          parkSpaceTitle:"",
          parkSpaceType: '',
          parkSpaceShow: false,
          isHide:false,
          carChannelArr:[{ChannelName:"车道1",channelID:1},{ChannelName:"车道2",channelID:2}],
          approvalStatusArr:[]
        }
      },
      mounted() {
        this.onSearch();
        // this.carChannel();
        this.getApprovalStatus();
      },
      methods: {
        // 多选框
        handleChecked(data){

        },
        // 获取审批状态
        getApprovalStatus(){
          $carParkSpace.getApprovalStatus().then(res=>{
            this.approvalStatusArr = formatData(res.data)
          })
        },
        // 获取车道信息
        carChannel(){
          $carParkSpace.carChannelPage({curPage:1,pageSize:300}).then(res=>{
            let tempArr = res.data.data
            this.carChannelArr = tempArr.map(item=>{ChannelName:item.ChannelName; channelID:item.ChannelId})
          })
        },
        handleCurrentChange() {
          this.onSearch();
        },
        // table多选
       multipleChange(val){
          let temp = val.map(item=>item.id)
          this.multipleArr = temp
        },
        // 导出
        onExport(){
          exportCarInfo(this.multipleArr).then(res=>{
            downloadFile(res, '车辆信息', "xlsx");
            this.$message.success("导出成功")
          })
        },
        onSearch() {
          //let obj = getObjByKey(this.permission.searchInfo);
          let data = this.formSearch;
            $carParkSpace.getCarParkSpace(data).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data.data;
                    this.pagination = res.data.total;
                }
            })
        },
        onAwait() {
          let d = new Date();
          let data = {
            date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
          };
          //let obj = getObjByKey(this.permission.awaitInfo);
          getawaitInfo(data).then(res => {
            if (res.code === 200) {
              this.$message.success("同步车辆成功");
              this.onSearch();
            } else {
              this.$message.error(res.meta.message);
            }
          })
        },
        // 重置
        onReset() {
          // this.formSearch.carNumber = "";
          // this.formSearch.carOwner = '';
          this.$refs.formSearch.resetFields()
          Object.keys(this.formSearch).forEach((x) => {
            if (x === "pageNum") {
              this.formSearch[x] = 1;
            } else if (x === "pageSize") {
              this.formSearch[x] = 10;
            }
          });
          this.onSearch();
        },
        // 车位号选择
        selectData($e){
          let obj = this.parkList.find((item) => {
            return item.id === $e; //筛选出匹配数据
          });
          this.addForms.parkName = obj.parkName
          this.addForms.parkCarlot = obj.carSite
          this.addForms.parkAddress = obj.area
          this.addForms.parkType = obj.parkingSpaceTypeName
        },
        // 关闭申请弹窗
        parkSpaceClose(){
          this.parkSpaceShow = false
        },
        // 查看详情
        onLook(row){
            this.isLook = true
            this.parkSpaceTitle = "停车申请详情";
            this.parkSpaceType = "look"
            this.parkSpaceShow = true;
            this.addForms = row
            this.isHide = false
            $carParkSpace.lookCarParkSpace(row.id).then(res=>{
                let temp = res.data
                this.addForms = res.data;
                this.addForms.authorizedLane = []
                this.addForms.parkingLotNum = temp.parkingLotNum
                this.addForms.parkName = temp.parkName
                this.addForms.parkCarlot = temp.carSite
                this.addForms.parkAddress = temp.area
                this.addForms.parkType = temp.parkingSpaceTypeName
            })
            this.$forceUpdate()
        },
        // 表格 申请车位
        parkSpaceApply(row){
            this.isLook = false
            this.parkSpaceTitle = '停车申请审批'
            this.parkSpaceType = 'add'
            this.parkSpaceShow = true
            this.isHide = true
            this.addForms = Object.assign({},row, {approvalStatusEnum:'',approvalStatus:''})
            // $carParkingSet.lookCarParking(row.id).then(res=>{
            //     this.$nextTick(()=>{
            //         let  temp = res.data
            //         this.addForms.parkingLotNum = temp.parkingLotNum
            //         this.addForms.parkName = temp.parkName
            //         this.addForms.parkCarlot = temp.carSite
            //         this.addForms.parkAddress = temp.area
            //         this.addForms.parkType = temp.parkingSpaceTypeName
            //     })
            //     this.$forceUpdate()
            // })
          
        },
        
        // 车位弹窗 取消
        cancelApplication(){
          if(this.$refs['addForms'].resetFields() !== undefined){
            this.$refs['addForms'].resetFields()
          }
          this.parkSpaceShow = false
        },
        // 车位申请
        onApplication(){
          this.$refs.addForms.validate(valid => {
            if (valid) {
              let data = this.addForms;
              if (this.parkSpaceType == "add") {
                $carParkSpace.carParkSpaceApproval(data.id,data).then(res=>{
                  this.$message.success("审批成功");
                  this.onSearch();
                  this.cancelApplication();
                })
              }else{
                $carParkSpace.editCarParkSpace(data.carLotAppliacId,{parkingLotId:this.carPark.parkingLotId}).then(res=>{
                  this.$message.success("编辑成功");
                  this.onSearch();
                  this.cancelApplication();
                })
              }
            }
          });
        },
      }
    };
  </script>
  
  <style lang="scss" scoped>
    .formTitle{
      font-size: 16px;
      font-weight: 500;
    }
  </style>
  