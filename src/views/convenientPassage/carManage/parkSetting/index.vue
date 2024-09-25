<template>
    <div class="app-container">
        <div>
            <el-form ref="formSearch" inline :model="carParking" v-if="showSearch">
                <el-form-item prop="parkingLotNum" label="车位编号">
                    <el-input
                        placeholder="请输入车位编号"
                        clearable
                        v-model="carParking.parkingLotNum"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="parkCode" label="所属园区">
                    <el-select v-model="carParking.parkCode" clearable>
                        <el-option
                        v-for="item in belongParcels"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="parkingSpaceType" label="车位类型">
                    <el-select v-model="carParking.parkingSpaceType" clearable>
                        <el-option
                        v-for="item in carParkingType"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="parkingSpaceState" label="车位状态">
                    <el-select v-model="carParking.parkingSpaceState" clearable>
                        <el-option
                        v-for="item in carParkingState"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click="onSearch()" >搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="onReset()" >重置</el-button>
                </el-form-item>
                <el-form-item style="float: right;margin-right: 0">
                    <el-button plain type="primary" @click="onMonitorSite()">新增车位</el-button>
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
                <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="parkingLotNum" label="车位号"></el-table-column>
                <el-table-column prop="parkName" label="所属园区"></el-table-column>
                <el-table-column prop="carSite" label="所属车场" show-overflow-tooltip></el-table-column>
                <el-table-column prop="area" label="车位位置" show-overflow-tooltip></el-table-column>
                <el-table-column prop="parkingSpaceTypeName" label="车位类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="parkingSpaceStateName" label="车位状态" show-overflow-tooltip></el-table-column>
                <el-table-column prop="parkingSpaceArea" label="车位面积" show-overflow-tooltip></el-table-column>
                <el-table-column prop="chargingStandards" label="收费标准" show-overflow-tooltip></el-table-column>
                <el-table-column prop="validBeginTime" label="操作" show-overflow-tooltip width="300">
                    <template slot-scope="scope">
                        <el-button @click="onLook(scope.row)" type="text">查看</el-button>
                        <el-button @click="onEdit(scope.row)" type="text">修改</el-button>
                        <!-- <el-button @click="onDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination
                v-show="tableData && tableData.length > 0"
                @pagination="handleCurrentChange"
                :page.sync="carParking.pageNum"
                :pageSizes="[10, 20, 30, 40]"
                :limit.sync="carParking.pageSize"
                :total="pagination"
            />
        </div>
        <!-- 添加站点弹窗 -->
        <el-dialog
            :close-on-click-modal="false"
            :title="siteTitle"
            :visible.sync="addSortDialogShow"
            :before-close="carDialogClose"
            width="35%"
        >
            <el-row>
                <el-form
                    ref="addForm"
                    :model="addForm"
                    class="demo-form-inline"
                    labelWidth="100px"
                    :rules="addFormRules"
                    :hide-required-asterisk="isLook"
                >
                    <el-col :span="12">
                        <el-form-item prop="parkingLotNum" label="车位号">
                            <el-input
                            :disabled="isLook"
                            v-model.trim="addForm.parkingLotNum"
                            placeholder="请输入车位号"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="parkCode" label="所属园区">
                            <el-select
                            v-model="addForm.parkCode"
                            :disabled="isLook"
                            style="width:100%"
                            placeholder="请选择所属园区"
                            >
                                <el-option
                                    v-for="(item, index) in belongParcels"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="carSite" label="所属车场">
                            <el-input
                            :disabled="isLook"
                            v-model.trim="addForm.carSite"
                            placeholder="请输入所属停车场"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="area" label="车位位置">
                            <el-input
                            :disabled="isLook"
                            v-model.trim="addForm.area"
                            placeholder="请输入车位位置"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="bindingHouse" label="绑定房屋">
                            <el-input
                            :disabled="isLook"
                            v-model.trim="addForm.bindingHouse"
                            placeholder="请输入绑定房屋地址"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="parkingSpaceType" label="车位类型">
                            <el-select
                            v-model="addForm.parkingSpaceType"
                            :disabled="siteType == 'look'"
                            style="width:100%"
                            placeholder="请选择车位类型"
                            >
                                <el-option
                                    v-for="(item, index) in carParkingType"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="parkingSpaceState" label="车位状态">
                            <el-select
                            :disabled="isLook"
                            v-model="addForm.parkingSpaceState"
                            style="width:100%"
                            placeholder="请选择车位状态"
                            >
                                <el-option
                                    v-for="(item, index) in carParkingState"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="parkingSpaceArea" label="车位面积">
                            <el-input
                            :disabled="isLook"
                            v-model.trim="addForm.parkingSpaceArea"
                            placeholder="请输入车位面积"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="chargingStandards" label="收费标准">
                            <el-input
                            :disabled="isLook"
                            v-model.trim="addForm.chargingStandards"
                            placeholder="请输入收费标准"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="remark" label="备注">
                            <el-input
                            :disabled="isLook"
                            v-model.trim="addForm.remark"
                            placeholder="请输入描述"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col>
                        <el-form-item prop="images" label="站点图片">
                            <ImageUpload v-model="addForm.images" v-if="!isLook"/>
                            <div v-else>
                                <el-image style="width: 150px; height: 150px; margin:3px" v-for="(item,index) in addForm.images" :key="index" :src="item" :preview-src-list="addForm.images" alt="" />
                            </div>
                        </el-form-item>
                    </el-col> -->
                </el-form>
            </el-row>
            <div slot="footer" style="text-align:center;">
                <el-button @click="onSubmit()" v-show="siteType !== 'look'" type="primary">确定</el-button>
                <el-button @click="cancel()" v-if="siteType == 'look'">关闭</el-button>
                <el-button @click="cancel()" v-else>取消</el-button>
            </div>
        </el-dialog>
    </div>
  </template>
  
  <script>
  import * as $carParkingSet from "@/api/carManage/carParkingSet";
  import pagination from "@/components/comPagination";
  import { downloadFile } from "@/utils/index";
  import ImageUpload from "@/components/ImgUploadArr"
  
  export default {
    name:'ParkSetting',
    components: {
      pagination,
      ImageUpload
    },
    data() {
      return {
        carParking: {
          pageSize: 10,
          pageNum: 1,
          parkCode: "",
          parkingLotNum:"",
          parkingSpaceType: "",
          parkingSpaceState: ""
        },
        siteName: [],
        homepage: true,
        pagination: 10,
        tableData: [],
        showSearch:true,
        multipleArr:[],
        rowData: {},
        siteTitle:"",
        siteType: '',
        addSortDialogShow: false,
        belongParcels:[
        ],
        isLook: false,
        addForm: {
            area: "",
            bindingHouse: "",
            carSite: "",
            chargingStandards: "",
            parkCode: "",
            parkName: "",
            parkingLotNum: "",
            parkingSpaceArea: "",
            parkingSpaceState: "",
            parkingSpaceType: "",
            remark: ""
        },
        addFormRules: {
            area: [
                { required: true, message: '请输入车位位置', trigger: ['blur','change'] }
            ],
            bindingHouse: [
                { required: true, message: '请输入绑定房屋', trigger: ['blur','change'] }
            ],
            carSite: [
                { required: true, message: '请输入所属车场', trigger: ['blur','change'] }
            ],
            chargingStandards: [
                { required: true, message: '请输入收费标准', trigger: ['blur','change'] }
            ],
            parkCode: [
                { required: true, message: '请选择所属园区', trigger: ['blur','change'] }
            ],
            parkingLotNum: [
                { required: true, message: '请输入车位号', trigger: ['blur','change'] }
            ],
            parkingSpaceArea: [
                { required: true, message: '请输入车位面积', trigger: ['blur','change'] }
            ],
            parkingSpaceState: [
                { required: true, message: '请选择车位状态', trigger: ['blur','change'] }
            ],
            parkingSpaceType: [
                { required: true, message: '请选择车位类型', trigger: ['blur','change'] }
            ],
            remark: [
                { required: true, message: '请输入备注', trigger: ['blur','change'] },
                // { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: ['blur','change'] }
            ],
        },
        deviceInfoArr:[],
        carParkingState:[],
        carParkingType:[]
      };
    },
    mounted(){
      this.init()
    },
    methods: {
        // 初始化数据
        init(){
            this.getParkCode();
            this.getCarParkList();
            this.getCarParkingState();
            this.getCarParkingType();
        },
        // 获取列表
        getCarParkList() {
            $carParkingSet.getCarPark(this.carParking)
            .then((res) => {
                this.tableData = res.data.data;
                this.pagination = res.data.total;
            })
            .catch((err) => {
                this.$message.error(err.message);
            });
        },
        // 获取园区
        getParkCode(){
            $carParkingSet.getCarParkingCode()
            .then((res) => {
                this.belongParcels = this.formatData(res.data);
            })
            .catch((err) => {
                this.$message.error(err.message);
            });
        },
        // 获取车位类型
        getCarParkingType(){
            $carParkingSet.getCarParkingType()
            .then((res) => {
                this.carParkingType = this.formatData(res.data);
            })
            .catch((err) => {
                this.$message.error(err.message);
            });
        },
        // 获取车位状态
        getCarParkingState(){
            $carParkingSet.getCarParkingState()
            .then((res) => {
                this.carParkingState = this.formatData(res.data);
            })
            .catch((err) => {
                this.$message.error(err.message);
            });
        },
        // 格式化数据
        formatData(obj){
            let temp = [];
            for(var i in obj){
                temp.push({name:obj[i],value:i})
            }
            return temp
        },
        // table多选
        multipleChange(val){
            let temp = val.map(item=>item.id)
            this.multipleArr = temp
        },
        
        // 选择监测设备获取设备厂商
        selectChange($e){
            let temp = this.deviceInfoArr.filter(res=>$e==res.id)
            console.log(temp,"temp")
            this.addForm.deviceManufacturer = temp[0].belongSubsystem
        },
        // 添加站点
        onMonitorSite(){
            this.isLook = false
            this.siteType = 'add'
            this.addSortDialogShow = true
            this.siteTitle = "新增车位"
        },
        // 搜索
        onSearch() {
            this.carParking.pageNum = 1
            this.getCarParkList();
        },
        // 重置
        onReset() {
            this.$refs.formSearch.resetFields()
            Object.keys(this.carParking).forEach((x) => {
            if (x === "pageNum") {
                this.carParking[x] = 1;
            } else if (x === "pageSize") {
                this.carParking[x] = 10;
            }
            });
            this.getCarParkList();
        },
        // checkBox多选
        handleChecked(data){},
        // 删除
        onDelete(rows){
            this.$confirm(`确认删除车位号${rows.parkingLotNum}吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                $carParkingSet.delCarParking(rows.id).then(res=>{
                    this.$message.success("删除成功");
                    this.onSearch()
                })
            });
        },
        // 查看
        onLook(rows){
            this.isLook = true
            this.siteType = 'look'
            this.siteTitle = "查看车位"
            this.addSortDialogShow = true
            $carParkingSet.lookCarParking(rows.id).then(res=>{
                this.addForm = res.data;
                // this.addForm.belongParcel = '336地块东区'
            })
        },
        // 编辑
        onEdit(rows){
            this.isLook = true
            this.siteType = 'edit'
            this.siteTitle = "编辑车位"
            this.addSortDialogShow = true
            $carParkingSet.lookCarParking(rows.id).then(res=>{
                this.addForm = res.data;
                // this.addForm.belongParcel = '336地块东区'
            })
        },
        // 翻页
        handleCurrentChange(val) {
            this.getVisitorData();
            console.log(`当前页: ${val}`);
        },
        // 取消
        cancel() {
            if(this.$refs['addForm'].resetFields() !== undefined){
                this.$refs['addForm'].resetFields()
            }
            this.addSortDialogShow = false;
        },
        // 关闭 添加或修改弹窗
        carDialogClose(){
            this.cancel()
        },
        // 提交添加或修改
        onSubmit() {
            console.log(this.addForm,"handleChecked")
            this.$refs.addForm.validate(valid => {
            if (valid) {
                let data = this.addForm;
                if (this.siteType == "add") {
                delete data.id;
                $carParkingSet.addCarParking(data).then(res=>{
                    this.$message.success("添加成功");
                    this.onSearch();
                    this.cancel();
                })
                }else{
                $carParkingSet.editCarParking(data.id,data).then(res=>{
                    this.$message.success("编辑成功");
                    this.onSearch();
                    this.cancel();
                })
                }
            }
            });
        },
    },
  };
  </script>
  <style lang='scss' scoped>
    ::v-deep.el-table.el-table--fit{
    overflow: hidden;
  }
  </style>
  