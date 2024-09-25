<template>
    <div class="app-container">
        <div style="height: 100%;">
            <div>
                <el-form ref="formSearch" inline :model="monitorSite" v-if="showSearch">
                    <el-form-item prop="name" label="预警名称">
                        <el-input show-word-limit maxlength="30" placeholder="请输入预警名称" clearable v-model="monitorSite.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="status" label="规则状态">
                        <el-select v-model="monitorSite.status" clearable>
                            <el-option v-for="item in siteName" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
                        <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
                    </el-form-item>
                    <el-form-item style="float: right;margin-right: 0">
                        <el-button plain type="primary" @click="onMonitorSite()">添加规则</el-button>
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
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="预警名称"></el-table-column>
                    <el-table-column prop="paramStr" label="参数" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="规则" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.compareRuleStr}} {{ scope.row.value }} {{ getfilterate(scope.row.param)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="startTime" label="起止时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="applyPositionStr" label="设备" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="note" label="备注" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="规则状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.status">启用</span>
                            <span v-else>禁用</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="validBeginTime" label="操作" show-overflow-tooltip width="180">
                        <template slot-scope="scope">
                            <el-button @click="onEdit(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
                            <el-button v-if="scope.row.status == true "  @click="onDelete1(scope.row,false)" type="text">禁用</el-button>
                            <el-button v-else @click="onDelete1(scope.row,true)" type="text">启用</el-button>
                            <el-button @click="onDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
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
                        <el-col :span="12">
                            <el-form-item prop="name" label="预警名称">
                                <el-input maxlength="30" show-word-limit v-model="addForm.name" placeholder="请输入预警名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="参数" prop="param">
                                <el-select v-model="addForm.param" placeholder="请选择参数" :popper-append-to-body="false" @change="handleChange">
                                    <el-option v-for="(item, index) in minitorProject" :label="item.name" :value="item.value" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="规则" prop="value">
                                <el-col :span="24">
                                    <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')" v-model="addForm.value" placeholder="请输入数字" class="input-with-select">
                                        <el-select style="width: 130px;line-height: 32px;" v-model="addForm.compareRule" placeholder="请选择范围" slot="prepend">
                                            <el-option v-for="(item, index) in ruleSize" :label="item.label" :value="item.value" :key="index"></el-option>
                                        </el-select>
                                        <template slot="append">{{ unitval }}</template>
                                    </el-input>
                                    
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="起止时间" prop="timeArr">
                                <el-date-picker style="width: 100%;" v-model="addForm.timeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="设备" prop="applyPosition">
                                <el-select style="width: 100%;" v-model="addForm.applyPosition" placeholder="请选择设备" :popper-append-to-body="false">
                                    <el-option v-for="(item, index) in applyPosition" :label="item.name" :value="item.value" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="note">
                                <el-input type="textarea" v-model="addForm.note" maxlength="100" show-word-limit placeholder="请输入备注描述"></el-input>
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
        </div>
    </div>
</template>
  
<script>
import $environMonitor from "@/api/environMonitor";
import pagination from "@/components/comPagination";
import { downloadFile } from "@/utils/index";
import ImageUpload from "@/components/ImgUploadArr"

export default {
    name: 'PeopleBase',
    components: {
        pagination,
        ImageUpload
    },
    data() {
        return {
            monitorSite: {
                pageSize: 10,
                pageNum: 1,
                name: "",
                status:''
            },
            siteName: [
                {
                    name:'启用',
                    value:true
                },
                {
                    name:'禁用',
                    value:false
                }
            ],
            homepage: true,
            pagination: 10,
            tableData: [],
            showSearch: true,
            multipleArr: [],
            rowData: {},
            minitorProject: [
                {
                    name: "PM2.5",
                    value: "PM2.5"
                },
                {
                    name: "CO₂",
                    value: "CO2"
                },
                {
                    name: "温度",
                    value: "temperature"
                },
                {
                    name: "湿度",
                    value: "humidity"
                },
                {
                    name: "TVOC",
                    value: "tvoc"
                },
            ],
            ruleSize: [
                { label: "大于", value: "gt" },
                { label: "大于等于", value: "ge" },
                { label: "小于", value: "lt" },
                { label: "小于等于", value: "le" }
            ],
            ruleSizeVal:'大于',
            ruleUnit:[
                { label: "ug/m3", value: "PM2.5" },
                { label: "℃", value: "temperature" ,},
                { label: "%RH", value: "humidity" , },
                { label: "PPM", value: "CO2", },
                { label: "mg/m³", value: "tvoc",},
            ],
            unitval:'ug/m3',
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
                name:'',
                param:'PM2.5',
                value:'',
                compareRule:'gt',
                timeArr:[],
                applyPosition:'',
                note:''
            },
            timeArr:[],
            addFormRules: {
                name: [
                    { required: true, message: '请输入预警名称', trigger: ['blur', 'change'] }
                ],
                value: [
                    { required: true, message: '请输入规则范围', trigger: [ "change"] }
                ],
                applyPosition: [
                    { required: true, message: '请选择设备', trigger: ['blur', 'change'] }
                ],
                timeArr: [
                    { required: true, message: '请选择起止时间', trigger: ['blur', 'change'] }
                ],
            },
            applyPosition:[
                {
                    name:'室内监测设备',
                    value:'indoor'
                },
                {
                    name:'室外监测设备',
                    value:'outdoor'
                }
            ],
            deviceInfoArr: [],
        };
    },
    mounted() {
        this.init()
    },
    methods: {
        handleChange() {
            let str = ''
            this.ruleUnit.forEach(res=>{
                if(res.value == this.addForm.param){
                    str = res.label
                }
            })
            this.unitval = str
            // 在这里执行相关操作
        },
        getfilterate(val){
            let str = ''
            this.ruleUnit.forEach(res=>{
                if(res.value == val){
                    str = res.label
                }
            })
            return str
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
                status: true,
            }
            $environMonitor.deviceInfo(obj).then(res => {
                this.deviceInfoArr = res.data.data
            })
        },
        // 导出
        onExport() {
            $environMonitor.exportMonitor(this.multipleArr).then(res => {
                downloadFile(res, '监测规则', "xlsx");
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
            $environMonitor.earlyWarningRule(this.monitorSite)
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
            this.addForm.deviceManufacturer = temp[0].belongSubsystem
        },
        // 添加站点
        onMonitorSite() {
            this.isLook = false
            this.siteType = 'add'
            this.addSortDialogShow = true
            this.siteTitle = "添加规则"
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
                $environMonitor.deleteWarningRule(rows.id).then(res => {
                    this.$message.success("删除成功");
                    this.onSearch()
                })
            });
        },
        onDelete1(data,str) {
            this.$confirm(`确认${str == '1'?'启用':'禁用'}这条预警规则吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                console.log('888888888')
                $environMonitor.WarningRulestatus(str, data.id).then(res => {
                    console.log(res)
                    this.$message.success(`${str == true?'启用':'禁用'}成功`);
                    this.getVisitorData();
                });
            }).catch(() => {});
        },
        // 编辑
        onEdit(rows) {
            this.isLook = false
            this.siteType = 'edit'
            this.siteTitle = "修改规则"
            this.addSortDialogShow = true
            $environMonitor.getWarningRule(rows.id).then(res => {
                this.addForm = res.data;
                this.addForm.timeArr = [res.data.startTime,res.data.endTime]
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
                    if(this.addForm.timeArr){
                        this.addForm.startTime = this.addForm.timeArr[0]
                        this.addForm.endTime = this.addForm.timeArr[1]
                    }else {
                        this.addForm.startTime = ''
                        this.addForm.endTime = ''
                    }
                    let data = this.addForm;
                    if (this.siteType == "add") {
                        delete data.timeArr;
                        delete data.id;
                        $environMonitor.addWarningRule(data).then(res => {
                            this.$message.success("添加成功");
                            this.onSearch();
                            this.cancel();
                        })
                    } else {
                        $environMonitor.updateWarningRule(data.id, data).then(res => {
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
::v-deep .el-input-group__prepend{
    background-color: #fff !important;
}
</style>
  