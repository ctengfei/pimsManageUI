<template>
    <div class="app-container">
        <div style="height: 100%;">
            <div>
                <el-form ref="formSearch" inline :model="monitorSite" v-if="showSearch">
                    <el-form-item prop="name" label="监测点名称">
                        <el-input placeholder="请输入监测点名称" clearable v-model="monitorSite.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="status" label="设备状态">
                        <el-select v-model="monitorSite.status" clearable>
                            <el-option v-for="item in siteName" :key="item.name" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
                        <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
                    </el-form-item>
                    <el-form-item style="float: right;margin-right: 0">
                        <el-button plain type="primary" @click="onMonitorSite()">添加站点</el-button>
                        <!-- <el-button plain type="primary" :disabled="multipleArr.length == 0" @click="onExport()">导出</el-button> -->
                    </el-form-item>
                </el-form>
                <el-row :gutter="10" class="mb8">
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
                </el-row>
            </div>
            <!-- 表格数据 -->
            <div>
                <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="multipleChange">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="监测站点"></el-table-column>
                    <el-table-column prop="bulidDate" label="建点时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="detectionDeviceName" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="detectionDeviceCode" label="设备编码" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="alarmTimes" label="预警次数" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="detectionDeviceStatus" label="设备状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.detectionDeviceStatus">在线</span>
                            <span v-else>离线</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="validBeginTime" label="操作" show-overflow-tooltip width="300">
                        <template slot-scope="scope">
                            <el-button @click="onLook(scope.row)" type="text">查看</el-button>
                            <el-button @click="onEdit(scope.row)" type="text">编辑</el-button>
                            <el-button @click="onDelete(scope.row)" type="text">删除</el-button>
                            <el-button @click="onMonutorData(scope.row)" type="text">历史数据</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination v-show="tableData && tableData.length > 0" @pagination="handleCurrentChange"
                    :page.sync="monitorSite.pageNum" :pageSizes="[10, 20, 30, 40]" :limit.sync="monitorSite.pageSize"
                    :total="pagination" />
            </div>
            <!-- 添加站点弹窗 -->
            <el-dialog :close-on-click-modal="false" :title="siteTitle" :visible.sync="addSortDialogShow"
                :before-close="carDialogClose" width="35%">
                <el-row>
                    <el-form ref="addForm" :model="addForm" class="demo-form-inline" labelWidth="100px" :disabled="isLook"
                        :rules="addFormRules" :hide-required-asterisk="isLook">
                        <!-- <el-col :span="12">
                            <el-form-item prop="belongParcel" label="所属地块">
                                <el-select v-model="addForm.belongParcel" style="width:100%" placeholder="请选择所属地块">
                                    <el-option v-for="(item, index) in belongParcels" :key="index" :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="code" label="站点编码">
                                <el-input v-model.trim="addForm.code" placeholder="请输入站点编码"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item prop="name" label="监测点">
                                <el-input v-model.trim="addForm.name" placeholder="请输入监测点"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="detectionDeviceId" label="监测设备">
                                <el-select v-model="addForm.detectionDeviceId" style="width:100%" placeholder="请选择监测设备"
                                    @change="selectChange">
                                    <el-option v-for="(item, index) in deviceInfoArr" :key="index" :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item prop="bulidDate" label="建成时间">
                                <el-date-picker style="width:100%" value-format="yyyy-MM-dd" v-model="addForm.bulidDate"
                                    type="date" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item prop="detectionDeviceCode" label="设备编码">
                                <el-input v-model.trim="addForm.detectionDeviceCode" placeholder="请输入设备编码" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="detectionDeviceManufacturer" label="设备厂商">
                                <el-input v-model.trim="addForm.detectionDeviceManufacturer" placeholder="请输入设备厂商"
                                    disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item prop="longitude" label="经度">
                                <el-input v-model.trim="addForm.longitude" placeholder="请输入经度"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="latitude" label="纬度">
                                <el-input v-model.trim="addForm.latitude" placeholder="请输入纬度"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="经纬度" prop="latitudes">
                                <el-input v-model="addForm.latitudes" placeholder="请选择经纬度" @focus="latitudeChoose()"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="siteType != 'add'">
                            <el-form-item prop="bulidDate" label="建点时间">
                                <el-input v-model.trim="addForm.bulidDate" placeholder="请输入建点时间" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="siteType != 'add'">
                            <el-form-item prop="alarmTimes" label="预警次数">
                                <el-input v-model.trim="addForm.alarmTimes" placeholder="请输入预警次数" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="siteType != 'add'">
                            <el-form-item prop="" label="设备状态">
                                <el-input v-if="addForm.detectionDeviceStatus" value="在线" placeholder="请输入设备状态" disabled>
                                </el-input>
                                <el-input v-else value="离线" placeholder="请输入设备状态" disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col>
                            <el-form-item prop="detectionProject" label="监测项目">
                                <el-checkbox-group v-model="addForm.detectionProject" @change="handleChecked">
                                    <el-checkbox v-for="(item, index) in minitorProject" :key="index" :label="item.value"
                                        :value="item.value">{{ item.name }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item prop="belongParcel" label="所属园区">
                                <el-select v-model="addForm.belongParcel" style="width:100%" placeholder="请选择所属园区">
                                    <el-option v-for="(item, index) in belongParcels" :key="index" :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="personInCharge" label="站点负责人">
                                <el-input v-model.trim="addForm.personInCharge" placeholder="请输入站点负责人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="phoneNumb" label="联系电话">
                                <el-input v-model.trim="addForm.phoneNumb" placeholder="请输入联系电话"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item prop="images" label="监测点图片">
                                <ImageUpload v-model="addForm.images" v-if="!isLook" />
                                <div v-else>
                                    <el-image style="width: 150px; height: 150px; margin:3px"
                                        v-for="(item, index) in addForm.images" :key="index" :src="item"
                                        :preview-src-list="addForm.images" alt="" />
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
                <div slot="footer" style="text-align:center;">
                    <el-button @click="onSubmit()" v-show="!isLook" type="primary" class="video-web-main-btn">确定</el-button>
                    <el-button @click="cancel()" v-show="!isLook" class="video-web-plain-btn">取消</el-button>
                    <el-button @click="cancel()" v-show="isLook" class="video-web-plain-btn">关闭</el-button>
                </div>
            </el-dialog>
            <el-dialog title="选择经纬度" :visible.sync="ChooseDialogShow" :modal="false" width="800px">
                <point-map ref="gisMap"  @map-location="maplocation" style="height: 500px;"></point-map>
                <div slot="footer">
                    <el-button type="primary" @click="mapadd">添加</el-button>
                    <el-button plain @click="mapcancel">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
  
<script>
import $environMonitor from "@/api/environMonitor";
import pagination from "@/components/comPagination";
import { downloadFile } from "@/utils/index";
import ImageUpload from "@/components/ImgUploadArr"
import pointMap from "@/components/common/map/point-map";

export default {
    name: 'PeopleBase',
    components: {
        pagination,
        ImageUpload,
        pointMap
    },
    data() {
        return {
            ChooseDialogShow: false,
            latitudearr:[],
            monitorSite: {
                pageSize: 10,
                pageNum: 1,
                code: "",
                name: "",
                position:'outdoor'
            },
            siteName: [
                {
                    name:'在线',
                    value:true
                },
                {
                    name:'离线',
                    value:false
                }
            ],
            homepage: true,
            pagination: 10,
            tableData: [],
            showSearch: true,
            multipleArr: [],
            rowData: {},
            siteTitle: "",
            siteType: '',
            addSortDialogShow: false,
            belongParcels: [
                {
                    name:'二期东区',
                    value:'EAST336'
                },
                {
                    name:'二期西区',
                    value:'WEST345'
                }
            ],
            isLook: false,
            addForm: {
                position:'outdoor',
                name:'',
                detectionDeviceId:'',
                detectionDeviceCode:'',
                detectionDeviceManufacturer:'',
                bulidDate:'',
                detectionDeviceStatus:'',
                personInCharge:'',
                phoneNumb:'',
                belongParcel:'',
                latitudes:'',
                images:[]
            },
            addFormRules: {
                belongParcel: [
                    { required: true, message: '请选择所属园区', trigger: ['blur', 'change'] }
                ],
                bulidDate: [
                    { required: true, message: '请选择建成时间', trigger: ['blur', 'change'] }
                ],
                detectionDeviceCode: [
                    { required: true, message: '请选择监测设备', trigger: ['blur', 'change'] }
                ],
                detectionDeviceId: [
                    { required: true, message: '请选择监测设备', trigger: ['blur', 'change'] }
                ],
                detectionProject: [
                    { required: true, message: '请选择监测项目', trigger: ['blur', 'change'] }
                ],
                images: [
                    { required: true, message: '请上传站点图片', trigger: ['blur', 'change'] }
                ],
                latitude: [
                    { required: true, message: '请输入纬度', trigger: ['blur', 'change'] }
                ],
                longitude: [
                    { required: true, message: '请输入经度', trigger: ['blur', 'change'] }
                ],
                name: [
                    { required: true, message: '请输入监测站点', trigger: ['blur', 'change'] }
                ],
                personInCharge: [
                    { required: true, message: '请输入站点负责人', trigger: ['blur', 'change'] }
                ],
                phoneNumb: [
                    { required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
                    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: ['blur', 'change'] }
                ],
            },
            deviceInfoArr: [],
        };
    },
    mounted() {
        this.init()
    },
    methods: {
        latitudeChoose() {
            this.ChooseDialogShow = true;
            if(this.addForm.latitudes){
                this.$nextTick(() => {
                    const latitudesArr = this.addForm.latitudes.split(',')
                    if(latitudesArr.length){
                        this.$refs.gisMap.clearLayer();
                        const arr = [
                            {
                                src: require("@/assets/images/mapImg/position.png"),
                                coord: [+latitudesArr[0],+latitudesArr[1]],
                            },
                        ];
                        this.$refs.gisMap.addMarket(arr, "position");
                    }
                })
            }
            
        },
        mapadd(){
            this.addForm.latitudes = this.latitudearr.join(',');
            this.ChooseDialogShow = false;
        },
        mapcancel(){
            this.ChooseDialogShow = false;
        },
        maplocation(e) {
            this.latitudearr=e;
            this.$refs.gisMap.clearLayer();
            const arr = [
                {
                    src: require("@/assets/images/mapImg/position.png"),
                    coord: [e[0],e[1]],
                },
            ];
            this.$refs.gisMap.addMarket(arr, "position");
        },
        // 初始化数据
        init() {
            this.getVisitorData();
            this.deviceInfo()
            // this.getSiteAll()
        },
        // 获取设备信息
        deviceInfo() {
            let obj = {
                type: 'detection',
                mounted: true,
                pageNum: 1,
                pageSize: 500
            }
            $environMonitor.deviceInfo(obj).then(res => {
                this.deviceInfoArr = res.data.data
            })
        },
        // 获取站点名称
        // getSiteAll() {
        //     $environMonitor.getSiteAll().then(res => {
        //         this.siteName = res.data
        //     })
        // },
        // 导出
        onExport() {
            $environMonitor.exportMonitor(this.multipleArr).then(res => {
                downloadFile(res, '监测站点', "xlsx");
                this.$message.success("导出成功")
            })
        },
        // table多选
        multipleChange(val) {
            let temp = val.map(item => item.id)
            this.multipleArr = temp
        },
        // 获取列表
        getVisitorData() {
            $environMonitor.getList(this.monitorSite)
                .then((res) => {
                    this.tableData = res.data.data;
                    this.pagination = res.data.total;
                })
                .catch((err) => {
                    this.$message.error(err.message);
                });
        },
        // 选择监测设备获取设备厂商
        selectChange($e) {
            let temp = this.deviceInfoArr.filter(res => $e == res.id)
            console.log(temp, "temp")
            this.addForm.detectionDeviceManufacturer = temp[0].belongSubsystem
            this.addForm.detectionDeviceCode = temp[0].code
        },
        // 添加站点
        onMonitorSite() {
            this.isLook = false
            this.siteType = 'add'
            this.addSortDialogShow = true
            this.siteTitle = "添加站点"
        },
        // 搜索
        onSearch() {
            this.monitorSite.pageNum = 1
            this.getVisitorData();
        },
        // 重置
        onReset() {
            this.$refs.formSearch.resetFields()
            Object.keys(this.monitorSite).forEach((x) => {
                if (x === "pageNum") {
                    this.monitorSite[x] = 1;
                } else if (x === "pageSize") {
                    this.monitorSite[x] = 10;
                }
            });
            this.getVisitorData();
        },
        // checkBox多选
        handleChecked(data) { },
        // 删除
        onDelete(rows) {
            this.$confirm(`确认删除${rows.name}吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                $environMonitor.deleteMonitor(rows.id).then(res => {
                    this.$message.success("删除成功");
                    this.onSearch()
                })
            });
        },
        // 查看
        onLook(rows) {
            this.isLook = true
            this.siteType = 'look'
            this.siteTitle = "查看站点"
            this.addSortDialogShow = true
            $environMonitor.getDetail(rows.id).then(res => {
                this.addForm = res.data;
                this.addForm.latitudes = res.data.longitude + ',' + res.data.latitude
                // this.addForm.belongParcel = '336地块东区'
            })
        },
        // 编辑
        onEdit(rows) {
            this.isLook = false
            this.siteType = 'edit'
            this.siteTitle = "修改站点"
            this.addSortDialogShow = true
            $environMonitor.getDetail(rows.id).then(res => {
                this.addForm = res.data;
                this.addForm.position = 'outdoor'
                this.addForm.latitudes = res.data.longitude + ',' + res.data.latitude
                // this.addForm.belongParcel = '336地块东区'
            })
        },
        // 监测数据
        onMonutorData(rows) {
            this.$router.push({ name: "SingleSite", query: { id: rows.id,type: 'outdoor' } })
        },
        // 翻页
        handleCurrentChange(val) {
            this.getVisitorData();
            console.log(`当前页: ${val}`);
        },
        // 取消
        cancel() {
            if (this.$refs['addForm'].resetFields() !== undefined) {
                this.$refs['addForm'].resetFields()
            }
            this.addSortDialogShow = false;
        },
        // 关闭 添加或修改弹窗
        carDialogClose() {
            this.cancel()
        },
        // 提交添加或修改
        onSubmit() {
            console.log(this.addForm, "handleChecked")
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.addForm.longitude = this.latitudearr[0]
                    this.addForm.latitude = this.latitudearr[1]
                    delete this.addForm.latitudes
                    let data = this.addForm;
                    if (this.siteType == "add") {
                        delete data.id;
                        $environMonitor.addMonitor(data).then(res => {
                            this.$message.success("添加成功");
                            this.onSearch();
                            this.cancel();
                        })
                    } else {
                        $environMonitor.updateMonitor(data.id, data).then(res => {
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
::v-deep.el-table.el-table--fit {
    overflow: hidden;
}
</style>
  