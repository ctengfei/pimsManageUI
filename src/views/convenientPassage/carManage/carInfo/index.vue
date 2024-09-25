<template>
  <div class="app-container">
    <el-form ref="formSearch" inline :model="formSearch" v-if="showSearch">
      <el-form-item prop="carOwner" label="车主姓名">
        <el-input placeholder="请输入车牌号" v-model="formSearch.carOwner"></el-input>
      </el-form-item>
      <el-form-item prop="carNumber" label="车牌号码">
        <el-input placeholder="请输入车牌号" v-model="formSearch.carNumber"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="licensePlateType" label="车牌类型">
        <el-select v-model="formSearch.licensePlateType" placeholder="请选择车牌类型">
          <el-option v-for="item in licensePlateTypes" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item prop="vehicleType" label="车辆类型">
        <el-select v-model="formSearch.vehicleType" placeholder="请选择车辆类型">
          <el-option v-for="item in vehicleTypes" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item> -->
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
            <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="ownerName" label="车主姓名"></el-table-column>
            <el-table-column prop="ownerPhone" label="手机号码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="idcard" label="身份证号码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="workUnit" label="工作单位" show-overflow-tooltip></el-table-column>
            <el-table-column prop="carPlate" label="车牌号码" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="licensePlateTypeName" label="车牌类型" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="vehicleTypeName" label="车辆类型" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="vehicleTypeName" label="车位类型" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="exteriorColor" label="车身颜色" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parkingLotTypeName" label="停车类型" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                  <el-button @click="onLook(scope.row)" type="text">查看</el-button>
                  <!-- <el-button @click="onEdit(scope.row)" type="text">修改</el-button> -->
                  <!-- <el-button @click="onDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button> 
                  <el-button @click="parkSpaceApply(scope.row)" v-if="!scope.row.carLotAppliacId" type="text" icon="el-icon-circle-plus">申请车位</el-button>
                  <el-button @click="cancelParkSpace(scope.row)" v-else type="text" icon="el-icon-edit-outline">编辑申请</el-button> -->
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
        <!-- 添加、编辑、查看车辆 -->
        <el-dialog
            :close-on-click-modal="false"
            :title="carInfoTitle"
            :visible.sync="addSortDialogShow"
            :before-close="carDialogClose"
            width="35%"
            @open="openCarInfo"
        >
            <el-row>
                <el-form
                    ref="addForm"
                    :model="addForm"
                    class="demo-form-inline"
                    labelWidth="100px"
                    :disabled="isLook"
                    :rules="addFormRules"
                    :show-message="!isLook"
                    :hide-required-asterisk="isLook"
                >
                    <el-col :span="12">
                        <el-form-item prop="ownerName" label="车主姓名">
                            <el-input
                            v-model.trim="addForm.ownerName"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="ownerPhone" label="手机号码">
                            <el-input
                            v-model.trim="addForm.ownerPhone"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="idcard" label="身份证号码">
                            <el-input
                            v-model.trim="addForm.idcard"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="address" label="房屋地址">
                            <el-input
                            v-model.trim="addForm.address"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="workUnit" label="工作单位">
                            <el-input
                            v-model.trim="addForm.workUnit"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="carPlate" label="车牌号码">
                          <el-input
                            v-model.trim="addForm.carPlate"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                      <el-form-item prop="licensePlateType" label="车牌类型">
                        <el-select v-model="addForm.licensePlateType" placeholder="请选择车牌类型">
                          <el-option v-for="item in licensePlateTypes" :key="item.value" :label="item.name" :value="item.value"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="licensePlateColor" label="车牌颜色">
                        <el-input
                            v-model.trim="addForm.licensePlateColor"
                            placeholder="请输入车牌颜色"
                            ></el-input>
                      </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item prop="vehicleType" label="车辆类型">
                          <el-select v-model="addForm.vehicleType" placeholder="">
                            <el-option v-for="item in vehicleTypes" :key="item.value" :label="item.name" :value="item.value"/>
                          </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item prop="model" label="车辆型号">
                          <el-input
                            v-model.trim="addForm.model"
                            placeholder="请输入车辆型号"
                            ></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item prop="exteriorColor" label="车身颜色">
                            <el-input
                            v-model.trim="addForm.exteriorColor"
                            placeholder="请输入车身颜色"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item prop="vehicleBrand" label="车辆品牌">
                            <el-input
                            v-model.trim="addForm.vehicleBrand"
                            placeholder="请输入车辆品牌"
                            ></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col>
                        <el-form-item prop="vehicleImg" label="车辆照片" ref="imgUpload">
                            <ImageUpload v-model="addForm.vehicleImg" v-if="!isLook"/>
                            <div v-else style="width: 150px; height: 150px; line-height: 150px;">
                                <el-image style="margin:3px;object-fit: contain;" v-for="(item,index) in addForm.vehicleImg" :key="index" :src="item" :preview-src-list="addForm.vehicleImg" alt="" />
                            </div>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" style="text-align:center;">
            <el-button @click="onSubmit()" v-show="!isLook" type="primary" class="video-web-main-btn"
                >确定</el-button
            >
            <el-button @click="cancel()" v-show="!isLook" class="video-web-plain-btn"
                >取消</el-button
            >
            <el-button @click="cancel()" v-show="isLook" class="video-web-plain-btn"
                >关闭</el-button
            >
            </div>
        </el-dialog>
        <!-- 申请车位、编辑申请 -->
        <el-dialog
            :close-on-click-modal="false"
            :title="parkSpaceTitle"
            :visible.sync="parkSpaceShow"
            :before-close="parkSpaceClose"
            :hide-required-asterisk="false"
            width="35%"
        >
            <el-row>
                <p class="formTitle">车辆信息</p>
                <el-form
                    ref="addForms"
                    :model="addForms"
                    class="demo-form-inline"
                    labelWidth="100px"
                    :disabled="isLook"
                    :rules="addFormRules"
                    :hide-required-asterisk="isLook"
                >
                    <el-col :span="12">
                        <el-form-item prop="ownerName" label="车主姓名">
                            <el-input
                            v-model.trim="addForms.ownerName"
                            placeholder="请输入车主姓名"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="ownerPhone" label="手机号码">
                            <el-input
                            v-model.trim="addForms.ownerPhone"
                            placeholder="请输入手机号码"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="idcard" label="身份证号码">
                            <el-input
                            v-model.trim="addForms.idcard"
                            placeholder="请输入身份证号码"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="carPlate" label="车牌号码">
                          <el-input
                            v-model.trim="addForms.carPlate"
                            placeholder="请输入车牌号码"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="licensePlateType" label="车牌类型">
                        <el-select v-model="addForms.licensePlateType" placeholder="请选择车牌类型">
                          <el-option v-for="item in licensePlateTypes" :key="item.value" :label="item.name" :value="item.value"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="licensePlateColor" label="车牌颜色">
                        <el-input
                            v-model.trim="addForms.licensePlateColor"
                            placeholder="请输入车牌颜色"
                            ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="vehicleType" label="车辆类型">
                          <el-select v-model="addForms.vehicleType" placeholder="请选择车辆类型">
                            <el-option v-for="item in vehicleTypes" :key="item.value" :label="item.name" :value="item.value"/>
                          </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="model" label="车辆型号">
                          <el-input
                            v-model.trim="addForms.model"
                            placeholder="请输入车辆型号"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="exteriorColor" label="车身颜色">
                            <el-input
                            v-model.trim="addForms.exteriorColor"
                            placeholder="请输入车身颜色"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="vehicleBrand" label="车辆品牌">
                            <el-input
                            v-model.trim="addForms.vehicleBrand"
                            placeholder="请输入车辆品牌"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
                <p class="formTitle">车位信息</p>
                <el-form
                    ref="carPark"
                    class="demo-form-inline"
                    labelWidth="100px"
                    :model="carPark"
                >
                    <el-col :span="12">
                      <el-form-item prop="parkingLotId" label="车位号" :rules="[{ required: true, message: '请选择车位号', trigger: ['blur','change'] }]">
                        <el-select v-model="carPark.parkingLotId" placeholder="请选择车位号" @change="selectData">
                          <el-option v-for="item in parkList" :key="item.id" :label="item.parkingLotNum" :value="item.id"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="parkName" label="所属园区">
                        <el-input
                            v-model.trim="carPark.parkName"
                            placeholder="请输入所属园区"
                            disabled
                            ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="parkCarlot" label="所属车场">
                          <el-input
                            v-model.trim="carPark.parkCarlot"
                            disabled
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="parkAddress" label="车位位置">
                            <el-input
                            v-model.trim="carPark.parkAddress"
                            disabled
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="parkType" label="车位类型">
                            <el-input
                            v-model.trim="carPark.parkType"
                            disabled
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" style="text-align:center;">
              <el-button @click="onApplication()" type="primary">确定</el-button>
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
    name:'CarInfo',
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
        addForm: {
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
          vehicleImg: [],
          vehicleType: "",
          address:"",
          workUnit:""
        },
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
          address:"",
          workUnit:""
        },
        addFormRules: {
          ownerName: [
              { required: true, message: '请输入车主姓名', trigger: ['blur','change'] }
          ],
          ownerPhone: [
              { required: true, message: '请输入手机号码', trigger: ['blur','change'] },
              { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: ['blur','change'] }
          ],
          carPlate: [
              { required: true, message: '请输入车牌号', trigger: ['blur','change'] }
          ],
          exteriorColor: [
              { required: true, message: '请输入车身颜色', trigger: ['blur','change'] }
          ],
          idcard: [
              { required: true, message: '请输入车主身份证号', trigger: ['blur','change'] },
              { pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
                message: "请输入正确的身份证号码", trigger: ['blur','change']
              }
          ],
          address: [
            { required: true, message: '请输入房屋地址', trigger: ['blur','change'] },
          ],
          workUnit: [
            { required: true, message: '请输入工作单位', trigger: ['blur','change'] },
          ],
          // licensePlateColor: [
          //     { required: true, message: '请输入车牌颜色', trigger: ['blur','change'] }
          // ],
          // licensePlateType: [
          //     { required: true, message: '请选择车牌类型', trigger: ['blur','change'] }
          // ],
          model: [
              { required: true, message: '请输入车辆型号', trigger: ['blur','change'] }
          ],
          // vehicleBrand: [
          //     { required: true, message: '请输入车辆品牌', trigger: ['blur','change'] }
          // ],
          vehicleImg: [
              { required: true, message: '请上传车辆照片', trigger: ['blur','change'] }
          ],
          // vehicleType: [
          //     { required: true, message: '请选择车辆类型', trigger: ['blur','change'] }
          // ],  
        },
        isLook: false,
        carInfoTitle:"",
        carInfoType: '',
        addSortDialogShow: false,
        minitorProject:[],
        deviceInfoArr:[],
        belongParcels:[],
        parkList:[],
        parkSpaceTitle:"",
        parkSpaceType: '',
        parkSpaceShow: false,
        carPark:{
          parkingLotId: "",
          parkName: "",
          parkCarlot: "",
          parkAddress:"",
          parkType:""
        }
      }
    },
    mounted() {
      this.onSearch();
      // this.getParkList();
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
        getcarInfo(data).then(res => {
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
      // 新增打开前的回调
      openCarInfo(){
        this.$nextTick(()=>{
          if(this.$refs['addForm'] !== undefined){
            this.$refs['addForm'].resetFields()
          }
        })
      },
      // 取消
      cancel() {
          if(this.$refs['addForm'] !== undefined){
              this.$refs['addForm'].resetFields()
          }
          this.addSortDialogShow = false;
      },
      // 关闭 添加或修改弹窗
      carDialogClose(){
          this.cancel()
      },
      // 添加车辆
      addCar(){
        this.isLook = false
        this.carInfoTitle = "添加车辆";
        this.carInfoType = "add"
        this.addSortDialogShow = true;
        if(this.$refs['addForm'] !== undefined){
          this.$refs['addForm'].resetFields()
        }
      },
      // 编辑车辆
      onEdit(row){
        this.isLook = false
        this.carInfoTitle = "编辑车辆";
        this.carInfoType = "edit"
        this.addSortDialogShow = true;
        lookCarInfo(row.id).then(res=>{
          this.addForm = res.data;
          this.addForm.vehicleImg = [res.data.vehicleImg]
        })
      },
      // 查看车辆
      onLook(row){
        this.isLook = true
        this.carInfoTitle = "查看车辆";
        this.carInfoType = "look"
        this.addSortDialogShow = true;
        lookCarInfo(row.id).then(res=>{
          this.addForm = res.data;
          this.addForm.vehicleImg = [res.data.vehicleImg]
        })
      },
      // 删除车辆
      onDelete(row){
        this.$confirm(`确认删除${rows.ownerName}的车辆信息吗?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
          delCarInfo(row.id).then(res=>{
              this.$message.success("删除成功");
              this.onSearch()
          })
        });
      },
      // 提交添加或修改
      onSubmit() {
        this.addForm.vehicleImg = this.addForm.vehicleImg[0]
        console.log(this.addForm,"handleChecked")
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let data = this.addForm;
            if (this.carInfoType == "add") {
              delete data.id;
              addCarInfo(data).then(res=>{
                this.$message.success("添加成功");
                this.onSearch();
                this.cancel();
              })
            }else{
              editCarInfo(data.id,data).then(res=>{
                this.$message.success("编辑成功");
                this.onSearch();
                this.cancel();
              })
            }
          }
        });
      },
      // 车位号选择
      selectData($e){
        let obj = this.parkList.find((item) => {
          return item.id === $e; //筛选出匹配数据
        });
        this.carPark.parkName = obj.parkName
        this.carPark.parkCarlot = obj.carSite
        this.carPark.parkAddress = obj.area
        this.carPark.parkType = obj.parkingSpaceTypeName
      },
      // 关闭申请弹窗
      parkSpaceClose(){
        this.parkSpaceShow = false
      },
      // 表格 申请车位
      parkSpaceApply(row){
        this.isLook = true
        this.parkSpaceTitle = '申请车位'
        this.parkSpaceType = 'add'
        let temp = Object.assign({},row)
        this.addForms = temp
        this.parkSpaceShow = true
      },
      // 表格 取消车位
      cancelParkSpace(row){
        this.isLook = true
        this.parkSpaceTitle = '取消车位'
        this.parkSpaceType = 'edit'
        let temp = Object.assign({},row)
        this.addForms = temp
        this.parkSpaceShow = true
        $carParkSpace.lookCarParkSpace(row.carLotAppliacId).then(res=>{
          this.carPark.parkingLotId = res.data.parkingLotId
          this.carPark.parkName = res.data.parkName
          this.carPark.parkCarlot = res.data.carSite
          this.carPark.parkAddress = res.data.area
          this.carPark.parkType = res.data.parkingSpaceTypeName
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
        this.$refs.addForms.validate(valid => {
          if (valid) {
            let data = this.addForms;
            if (this.parkSpaceType == "add") {
              $carParkSpace.addCarParkSpace({carId:data.id,parkingLotId:this.carPark.parkingLotId}).then(res=>{
                this.$message.success("添加成功");
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
