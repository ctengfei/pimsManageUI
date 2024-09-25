<template>
    <div class="app-container" style="display: flex;">
        <regiontree @nodeclick="nodeclick" :type="'1'" :nodeType = " 'heatMeter' "></regiontree>
        <div style="height: 100%;width: 100%;">
            <div>
                <el-form ref="formSearch" inline :model="monitorSite" v-if="showSearch">
                    <el-form-item prop="code" label="设备编号">
                        <el-input placeholder="请输入设备编号" clearable v-model="monitorSite.code"></el-input>
                    </el-form-item>
                    <el-form-item prop="name" label="设备名称">
                        <el-input placeholder="请输入设备名称" clearable v-model="monitorSite.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="area" label="所在区域">
                        <el-select v-model="monitorSite.area" clearable>
                            <el-option v-for="item in siteName" :key="item.name" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
                        <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
                    </el-form-item>
                    <!-- <el-form-item style="float: right;margin-right: 0">
                        <el-button plain type="primary" @click="onMonitorSite()">监测频率</el-button>
                    </el-form-item> -->
                </el-form>
                <el-row :gutter="10" class="mb8">
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
                </el-row>
            </div>
            <!-- 表格数据 -->
            <div>
                <el-table ref="multipleTable" :data="tableData" style="width: 100%" height="650">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="code" label="设备编码" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="subTypeStr" label="设备分类"></el-table-column>
                    <el-table-column prop="areaStr" label="所在区域" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" label="安装位置" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="设备状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.status">在线</span>
                            <span v-else>离线</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="validBeginTime" label="操作" show-overflow-tooltip width="200">
                        <template slot-scope="scope">
                            <el-button @click="onLook(scope.row)" type="text" icon="el-icon-view">实时数据</el-button>
                            <el-button @click="onMonutorData(scope.row)" type="text" icon="el-icon-document">历史数据</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页fefeef -->
                <pagination v-show="tableData && tableData.length > 0" @pagination="handleCurrentChange"
                    :page.sync="monitorSite.pageNum" :pageSizes="[10, 20, 30, 40]" :limit.sync="monitorSite.pageSize"
                    :total="pagination" />
            </div>
            <!-- 添加实时数据弹窗 -->
            <el-dialog :close-on-click-modal="false" :title="siteTitle" :visible.sync="addSortDialogShow"
                :before-close="carDialogClose" width="42%">
                <el-row>
                    <div class="data_dv" style="">
                        <div class="time_dv">数据获取时间：{{ addForm.collectTime }}</div>
                        <el-button plain type="primary" @click="manualAlarm()">手动告警</el-button>
                    </div>
                    <el-form ref="addForm" :model="addForm" class="demo-form-inline" labelWidth="100px" :disabled="isLook"
                        :hide-required-asterisk="isLook">

                        <el-col :span="12">
                            <el-form-item prop="deviceName" label="设备名称">
                                <el-input v-model="addForm.deviceName" placeholder="请输入设备名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="deviceCode" label="设备编码">
                                <el-input v-model="addForm.deviceCode" placeholder="请输入设备编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="hydropowerDeviceTypeStr" label="设备分类">
                                <el-input v-model="addForm.hydropowerDeviceTypeStr" placeholder="请输入设备分类" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="address" label="所在区域">
                                <el-input v-model="addForm.address" placeholder="请输入所在区域" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="personInCharge" label="所属园区">
                                <el-input v-model="addForm.personInCharge" placeholder="请输入所属园区" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="area" label="安装位置">
                                <el-input v-model="addForm.area" placeholder="请输入安装位置"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="deviceStatus" label="设备状态">
                                <el-input v-if="addForm.deviceStatus == '1' " value="在线" placeholder="请输入设备状态"></el-input>
                                <el-input v-else value="离线" placeholder="请输入设备状态"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="value" label="累积流量">
                                <el-input v-model="addForm.value" placeholder="请输入流量"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
                <div slot="footer" style="text-align:center;">
                    <!-- <el-button @click="onSubmit()" v-show="!isLook" type="primary" class="video-web-main-btn">确定</el-button> -->
                    <!-- <el-button @click="cancel()" v-show="!isLook" class="video-web-plain-btn">取消</el-button> -->
                    <el-button @click="cancel()" v-show="isLook" class="video-web-plain-btn">关闭</el-button>
                </div>
            </el-dialog>
            <!-- 手动告警 -->
            <el-dialog :close-on-click-modal="false" title="手动告警" :visible.sync="manualAlarmShow"
                :before-close="carDialogClose1" width="42%">
                <el-row>
                    <el-form ref="addForm1" :model="addForm" class="demo-form-inline" labelWidth="100px"
                        :rules="addFormRules">
                        <el-col :span="12">
                            <el-form-item prop="name" label="异常名称">
                                <el-input v-model.trim="addForm.name" placeholder="请输入异常名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="detectionDeviceId" label="设备编码">
                                <el-input v-model.trim="addForm.name" placeholder="请输入设备编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="detectionDeviceId" label="触发位置">
                                <el-input v-model.trim="addForm.name" placeholder="请输入触发位置"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="bulidDate" label="触发时间">
                                <el-date-picker v-model="addForm.bulidDate" type="date" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="告警类型" prop="applyPosition">
                                <el-select style="width: 100%;" v-model="addForm.applyPosition" placeholder="请选择告警类型"
                                    :popper-append-to-body="false">
                                    <el-option v-for="(item, index) in applyPosition" :label="item.name" :value="item.value"
                                        :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="告警级别" prop="applyPosition">
                                <el-select style="width: 100%;" v-model="addForm.applyPosition" placeholder="请选择告警级别"
                                    :popper-append-to-body="false">
                                    <el-option v-for="(item, index) in applyPosition" :label="item.name" :value="item.value"
                                        :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
                <div slot="footer" style="text-align:center;">
                    <el-button @click="onSubmit()" type="primary" class="video-web-main-btn">确定</el-button>
                    <el-button @click="cancel1()" class="video-web-plain-btn">取消</el-button>
                </div>
            </el-dialog>
            <!-- 历史数据 -->
            <el-dialog :close-on-click-modal="false" title="历史数据" :visible.sync="historydataShow"
                :before-close="carDialogClose2" width="42%">
                <div>
                    <div class="data_dv" style="">
                        <div class="time_dv">设备名称：{{ historyname }}</div>
                        <div style="display: flex;">
                            <el-date-picker v-model="timeArr" value-format="yyyy-MM-dd" type="datetimerange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                            <el-button style="margin-left: 20px;" icon="el-icon-search" type="primary"
                                @click="historyonSearch()">搜索</el-button>
                            <el-button icon="el-icon-refresh-left" @click="historyonReset()">重置</el-button>
                        </div>
                    </div>
                    <el-table :data="historytableData" style="width: 100%" ref="multipleTable">
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="collectTime" label="数据获取时间" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="value" label="累积流量"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <pagination v-show="historytableData && historytableData.length > 0" @pagination="historyhandleCurrentChange"
                    :page.sync="historymonitorSite.pageNum" :pageSizes="[10, 20, 30, 40]" :limit.sync="historymonitorSite.pageSize"
                    :total=" historypagination" />
                </div>
                <div slot="footer" style="text-align:center;">
                    <el-button @click="onSubmit()" type="primary" class="video-web-main-btn">确定</el-button>
                    <el-button @click="cancel2()" class="video-web-plain-btn">取消</el-button>
                </div>
            </el-dialog>
            <!-- 监测频率 -->
            <el-dialog :close-on-click-modal="false" title="设置监测频率" :visible.sync="frequencyShow"
                :before-close="cancel3" width="22%">
                <el-radio-group v-model="radio">
                    <el-radio :label="3">15分钟</el-radio>
                    <el-radio :label="6">30分钟</el-radio>
                    <el-radio :label="9">1小时</el-radio>
                </el-radio-group>
                <div slot="footer" style="text-align:center;">
                    <el-button @click="onSubmit()" type="primary" class="video-web-main-btn">确定</el-button>
                    <el-button @click="cancel3()" class="video-web-plain-btn">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
  
<script>
import $environMonitor from "@/api/environMonitor";
import pagination from "@/components/comPagination";
import regiontree from "../../components/regiontree"  // 树结构组件

export default {
    name: '',
    components: {
        pagination,
        regiontree
    },
    data() {
        return {
            timeArr: [],
            monitorSite: {
                pageSize: 10,
                pageNum: 1,
                code: "",
                name: "",
                nodeId: '',
                area:'',
                type:'heatMeter' 
            },
            historymonitorSite: {
                pageSize: 10,
                pageNum: 1,
                startDate: "",
                endDate: "",
            },
            siteName: [
                {
                    name: '公共区域',
                    value: 'public'
                },
                {
                    name: '住户区域',
                    value: 'tenement'
                }
            ],
            waterMeter: [
                {
                    name: '冷水表',
                    value: 'cold'
                },
                {
                    name: '热水表',
                    value: 'heat'
                }
            ],
            pagination: 10,
            historypagination: 10,
            tableData: [],
            historytableData:[],
            historyname:'',
            showSearch: true,
            multipleArr: [],
            rowData: {},
            siteTitle: "",
            siteType: '',
            addSortDialogShow: false,
            manualAlarmShow: false,
            historydataShow: false,
            frequencyShow:false,
            radio: 3,
            isLook: false,
            addForm: {
                position: 'indoor',
                name: '',
                detectionDeviceId: '',
                detectionDeviceCode: '',
                detectionDeviceManufacturer: '',
                bulidDate: '',
                detectionDeviceStatus: '',
                personInCharge: '',
                phoneNumb: '',
                images: []
            },
            addFormRules: {
                belongParcel: [
                    { required: true, message: '请选择所属地块', trigger: ['blur', 'change'] }
                ],
            },
            deviceInfoArr: [],
            applyPosition: [],
            hydropowerDeviceType:'',
            deviceCode:''
        };
    },
    mounted() {
        this.init()
    },
    methods: {
        nodeclick(data) {
            console.log(data, 'data')
            this.monitorSite.nodeId = data   //节点nodeid
            this.getVisitorData();
        },
        // 初始化数据
        init() {
            this.getVisitorData();
            this.deviceInfo()
        },
        // 获取设备信息
        deviceInfo() {
            let obj = {
                type: 'detection',
            }
            $environMonitor.deviceInfo(obj).then(res => {
                this.deviceInfoArr = res.data.data
            })
        },
        // 获取历史数据
        gethistoryVisitorData(subType,code){
            console.log(this.timeArr,'this.timeArr')
            if(this.timeArr){
                this.historymonitorSite.startDate = this.timeArr[0]
                this.historymonitorSite.endDate = this.timeArr[1]
            }else {
                this.historymonitorSite.startDate = ''
                this.historymonitorSite.endDate = ''
            }
            $environMonitor.history(subType,code,this.historymonitorSite).then((res) => {
                this.historytableData = res.data.data;
                this.historypagination = res.data.total;
            })
            .catch((err) => {
                this.$message.error(err.message);
            });
        },
        // 获取列表
        getVisitorData() {
            $environMonitor.getcriteria(this.monitorSite).then((res) => {
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
        // 添加实时数据
        onMonitorSite() {
            this.frequencyShow = true
        },
        manualAlarm() {
            this.manualAlarmShow = true
        },
        // 搜索
        onSearch() {
            this.monitorSite.pageNum = 1
            this.getVisitorData();
        },
        historyonSearch() {
            this.historymonitorSite.pageNum = 1
            this.gethistoryVisitorData(this.hydropowerDeviceType,this.deviceCode);
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
        historyonReset() {
            Object.keys(this.historymonitorSite).forEach((x) => {
                if (x === "pageNum") {
                    this.historymonitorSite[x] = 1;
                } else if (x === "pageSize") {
                    this.historymonitorSite[x] = 10;
                }
            });
            this.timeArr = []
            this.gethistoryVisitorData(this.hydropowerDeviceType,this.deviceCode);
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
            this.siteTitle = "查看实时数据"
            this.addSortDialogShow = true
            $environMonitor.realtime(rows.subType,rows.code).then(res => {
                this.addForm = res.data;
                // this.addForm.belongParcel = '336地块东区'
            })
        },
        // 编辑
        onEdit(rows) {
            this.isLook = false
            this.siteType = 'edit'
            this.siteTitle = "修改实时数据"
            this.addSortDialogShow = true
            $environMonitor.getDetail(rows.id).then(res => {
                this.addForm = res.data;
                // this.addForm.belongParcel = '336地块东区'
            })
        },
        // 监测数据
        onMonutorData(rows) {
            this.historydataShow = true
            this.historyname = rows.name
            this.hydropowerDeviceType = rows.subType
            this.deviceCode = rows.code
            this.gethistoryVisitorData(this.hydropowerDeviceType,this.deviceCode);
        },
        // 翻页
        handleCurrentChange(val) {
            this.getVisitorData();
            console.log(`当前页: ${val}`);
        },
        historyhandleCurrentChange(val) {
            this.gethistoryVisitorData(this.hydropowerDeviceType,this.deviceCode);
            console.log(`当前页: ${val}`);
        },
        // 取消
        cancel() {
            if (this.$refs['addForm'].resetFields() !== undefined) {
                this.$refs['addForm'].resetFields()
            }
            this.addSortDialogShow = false;
        },
        cancel1() {
            if (this.$refs['addForm1'].resetFields() !== undefined) {
                this.$refs['addForm1'].resetFields()
            }
            this.manualAlarmShow = false;
        },
        cancel2() {
            this.historydataShow = false;
        },
        cancel3() {
            this.frequencyShow = false;
        },
        // 关闭 添加或修改弹窗
        carDialogClose() {
            this.cancel()
        },
        carDialogClose1() {
            this.cancel1()
        },
        carDialogClose2() {
            this.cancel2()
        },
        // 提交添加或修改
        onSubmit() {
            console.log(this.addForm, "handleChecked")
            this.$refs.addForm.validate(valid => {
                if (valid) {
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
::v-deep .el-table.el-table--fit {
    overflow: hidden;
}

::v-deep .el-tree-node__label {}

::v-deep .el-form-item__content {
    // margin-left: 0px !important;
}

::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #409EFF !important;
    color: #fff;
}

::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 300px !important;
}

.data_dv {
    display: flex;
    justify-content: space-between;
    line-height: 32px;
    margin-bottom: 20px;
    width: 100%;

    .time_dv {
        // margin-left: 29px;
        font-size: 14px;
        color: #606266;
        font-weight: 600;
    }
}
</style>
  