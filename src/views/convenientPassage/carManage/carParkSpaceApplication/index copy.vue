<template>
    <div class="app-container">
      <el-form ref="formSearch" inline :model="formSearch" v-if="showSearch">
        <el-form-item prop="carNumber" label="车牌号码">
          <el-input placeholder="请输入车牌号" v-model="formSearch.carNumber"></el-input>
        </el-form-item>
        <el-form-item prop="carOwner" label="车主姓名">
          <el-input placeholder="请输入车牌号" v-model="formSearch.carOwner"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="licensePlateType" label="车牌类型">
          <el-select v-model="formSearch.licensePlateType" placeholder="请选择车牌类型">
            <el-option v-for="item in licensePlateTypes" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="vehicleType" label="车辆类型">
          <el-select v-model="formSearch.vehicleType" placeholder="请选择车辆类型">
            <el-option v-for="item in vehicleTypes" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="parkingLotType" label="车场类型">
          <el-select v-model="formSearch.parkingLotType" placeholder="请选择车场车类">
            <el-option v-for="item in parkingLotTypes" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item> -->
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
          <!-- <el-col :span="1.5">
            <el-button  
              icon="el-icon-plus" 
              plain 
              type="primary" 
              @click="onAwait()"
            >同步</el-button>
          </el-col> -->
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
              <el-table-column prop="ownerName" label="车主姓名"></el-table-column>
              <el-table-column prop="ownerPhone" label="手机号码" show-overflow-tooltip></el-table-column>
              <el-table-column prop="carPlate" label="车牌号码" show-overflow-tooltip></el-table-column>
              <el-table-column prop="vehicleTypeName" label="车辆类型" show-overflow-tooltip></el-table-column>
              <el-table-column prop="parkingSpaceTypeName" label="车位类型" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip></el-table-column>
              <el-table-column prop="approvalStatusName" label="审批状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.approvalStatusName == '' ? "待审批" : scope.row.approvalStatusName}}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="onLook(scope.row)" type="text" v-if="scope.row.approvalStatusName" icon="el-icon-edit">查看</el-button>
                    <!-- <el-button @click="onEdit(scope.row)" type="text" icon="el-icon-edit">修改</el-button> -->
                    <!-- <el-button @click="onDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button> -->
                    <el-button @click="parkSpaceApply(scope.row)" v-else type="text" icon="el-icon-circle-plus">审批</el-button>
                    <!-- <el-button @click="cancelParkSpace(scope.row)" v-else type="text" icon="el-icon-edit-outline">编辑申请</el-button> -->
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
                          <el-form-item prop="ownerName" label="车主姓名">
                              <el-input
                              v-model.trim="addForms.ownerName"
                              placeholder="请输入车主姓名"
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="ownerPhone" label="手机号码">
                              <el-input
                              v-model.trim="addForms.ownerPhone"
                              placeholder="请输入手机号码"
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="idcard" label="身份证号码">
                              <el-input
                              v-model.trim="addForms.idcard"
                              placeholder="请输入身份证号码"
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="carPlate" label="车牌号码">
                            <el-input
                              v-model.trim="addForms.carPlate"
                              placeholder="请输入车牌号码"
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="licensePlateType" label="车牌类型">
                          <el-select v-model="addForms.licensePlateType" placeholder="请选择车牌类型" disabled>
                            <el-option v-for="item in licensePlateTypes" :key="item.value" :label="item.name" :value="item.value"/>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="licensePlateColor" label="车牌颜色">
                          <el-input
                              v-model.trim="addForms.licensePlateColor"
                              placeholder="请输入车牌颜色"
                              disabled
                              ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="vehicleType" label="车辆类型">
                            <el-select v-model="addForms.vehicleType" placeholder="请选择车辆类型" disabled>
                              <el-option v-for="item in vehicleTypes" :key="item.value" :label="item.name" :value="item.value"/>
                            </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="model" label="车辆型号">
                            <el-input
                              v-model.trim="addForms.model"
                              placeholder="请输入车辆型号"
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="exteriorColor" label="车身颜色">
                              <el-input
                              v-model.trim="addForms.exteriorColor"
                              placeholder="请输入车身颜色"
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="vehicleBrand" label="车辆品牌">
                              <el-input
                              v-model.trim="addForms.vehicleBrand"
                              placeholder="请输入车辆品牌"
                              disabled
                              ></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item prop="createTime" label="申请时间">
                            <el-date-picker
                                disabled
                                style="width:100%"
                                value-format="yyyy-MM-dd"
                                v-model="addForms.createTime"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="!isLook">
                            <el-form-item prop="approvalStatusEnum" label="审批状态" :rules="[{ required: true, message: '请选择审批状态', trigger: ['blur','change'] }]">
                                <el-radio-group v-model="addForms.approvalStatusEnum">
                                    <el-radio label="pass">通过</el-radio>
                                    <el-radio label="refuse">拒绝</el-radio>
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
                            <el-form-item prop="approvaledBy" label="审批人">
                                <el-input
                                v-model.trim="addForms.approvaledBy"
                                disabled
                                ></el-input>
                            </el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="isLook">
                            <el-form-item prop="updateTime" label="审批日期">
                                <el-input
                                v-model.trim="addForms.updateTime"
                                placeholder=""
                                disabled
                                ></el-input>
                            </el-form-item>
                      </el-col>
                      <div v-show="isHide">
                        <el-col>
                            <p class="formTitle">车位信息</p>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="parkingLotNum" label="车位号">
                            <el-input
                                v-model.trim="addForms.parkingLotNum"
                                placeholder="请输入车位号"
                                disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="parkName" label="所属园区">
                            <el-input
                                v-model.trim="addForms.parkName"
                                placeholder="请输入所属园区"
                                disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="parkCarlot" label="所属车场">
                                <el-input
                                v-model.trim="addForms.parkCarlot"
                                disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="parkAddress" label="车位位置">
                                <el-input
                                v-model.trim="addForms.parkAddress"
                                disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="parkType" label="车位类型">
                                <el-input
                                v-model.trim="addForms.parkType"
                                disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="validBeginTime" label="有效起日" :rules="[{ required: true, message: '请选择有效起日', trigger: ['blur','change'] }]">
                                <el-date-picker
                                    style="width:100%"
                                    value-format="yyyy-MM-dd"
                                    v-model="addForms.validBeginTime"
                                    type="date"
                                    placeholder="选择日期"
                                    :disabled="isLook">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="validEndTime" label="有效止日" :rules="[{ required: true, message: '请选择有效止日', trigger: ['blur','change'] }]">
                                <el-date-picker
                                    style="width:100%"
                                    value-format="yyyy-MM-dd"
                                    v-model="addForms.validEndTime"
                                    type="date"
                                    placeholder="选择日期"
                                    :disabled="isLook">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="authorizedLane" label="授权车道" :rules="[{ required: true, message: '请输入授权车道', trigger: ['blur','change'] }]">
                                <el-input
                                v-model.trim="addForms.authorizedLane"
                                :disabled="isLook"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        </div>
                    </el-row>
                </el-form>
              <div slot="footer" style="text-align:center;">
                <el-button @click="onApplication()" v-show="isHide" type="primary">确定</el-button>
                <el-button @click="cancelApplication()" >取消</el-button>
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
            carNumber: '',
            carOwner: '',
            licensePlateType: '',
            parkingLotType: '',
            vehicleType: '',
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
            approvalStatusEnum:"pass",
            parkingLotNum: "",
            parkName: "",
            parkCarlot: "",
            parkAddress:"",
            parkType:"",
            authorizedLane:"",
            approvalStatusName:""
          },
          isLook: false,
          parkList:[],
          parkSpaceTitle:"",
          parkSpaceType: '',
          parkSpaceShow: false,
          isHide:false,
        }
      },
      mounted() {
        this.onSearch();
        this.getParkList();
      },
      methods: {
        // 获取车位列表
        getParkList(){
          $carParkingSet.getCarPark({pageSize: 5000, pageNum: 1,})
            .then((res) => {
                this.parkList = res.data.data;
            })
            .catch((err) => {
                this.$message.error(err.message);
            });
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
            this.parkSpaceTitle = "查看详情";
            this.parkSpaceType = "look"
            this.parkSpaceShow = true;
            this.addForms = row
            if(row.approvalStatus == "pass"){
                this.isHide = true
                $carParkSpace.lookCarParkSpace(row.id).then(res=>{
                    let temp = res.data
                    this.addForms = res.data;
                    this.addForms.parkingLotNum = temp.parkingLotNum
                    this.addForms.parkName = temp.parkName
                    this.addForms.parkCarlot = temp.carSite
                    this.addForms.parkAddress = temp.area
                    this.addForms.parkType = temp.parkingSpaceTypeName
                })
            }else{
                this.isHide = false
            }
            this.$forceUpdate()
        },
        // 表格 申请车位
        parkSpaceApply(row){
            this.isLook = false
            this.parkSpaceTitle = '申请车位'
            this.parkSpaceType = 'add'
            this.parkSpaceShow = true
            this.isHide = true
            this.addForms = Object.assign({},row, this.addForms.approvalStatusEnum = "")
            $carParkingSet.lookCarParking(row.parkingLotId).then(res=>{
                this.$nextTick(()=>{
                    let  temp = res.data
                    this.addForms.parkingLotNum = temp.parkingLotNum
                    this.addForms.parkName = temp.parkName
                    this.addForms.parkCarlot = temp.carSite
                    this.addForms.parkAddress = temp.area
                    this.addForms.parkType = temp.parkingSpaceTypeName
                })
                this.$forceUpdate()
            })
          
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
            console.log(this.addForms,"onApplication")
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
  