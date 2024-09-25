<template>
    <div class="app-container">
        <el-row :gutter="20" style="overflow-y:hidden;">
            <el-col style="height:inherit">
                <el-button plain icon="el-icon-back" @click="onBack" style="float:left;margin-right: 10px;"></el-button>
                <div class="ListManage">
                    <el-form ref="formSearch" inline :model="formSearch" class="demo-form-inline">
                        <el-form-item label="上报时间" prop="timeArr">
                            <el-date-picker v-model="timeArr" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                         <el-form-item>
                            <el-button icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
                            <el-button icon="el-icon-refresh-left" @click="onReset('formSearch')">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-row :gutter="10" class="mb8">
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <div style="height:calc(100% - 150px)">
            <el-table :data="tableData">
                <el-table-column type="index" label="序号" width="50" />
                <el-table-column prop="detectionSiteName" label="监测点" />
                <el-table-column prop="deviceName" label="设备名称" />
                <el-table-column prop="deviceCode" label="设备编码" />
                <el-table-column prop="deviceStatus" label="设备状态" >
                    <template slot-scope="scope">
                            <span v-if="scope.row.deviceStatus">在线</span>
                            <span v-else>离线</span>
                        </template>
                </el-table-column>>
                <el-table-column prop="collectionTime" label="上报时间" />
                <el-table-column prop="pm2Point5" label="PM2.5（ug/m3）" />
                <el-table-column prop="temperature" label="温度（℃）" />
                <el-table-column prop="humidity" label="湿度（%RH）" />
                <el-table-column prop="co2" label="CO₂（PPM）" />
                <el-table-column prop="tvoc" label="TVOC（mg/m³）" />
            </el-table>
        </div>

        <!-- 分页 -->
        <pagination v-show="formSearch.total > 0" :total="formSearch.total" :page.sync="formSearch.pageNum"
            :limit.sync="formSearch.pageSize" @pagination="tableCurrentChange" />
    </div>
</template>
  
<script>
import $detectionAlarm from "@/api/environMonitor/detectionAlarm";
import $environMonitor from "@/api/environMonitor";
import pagination from "@/components/comPagination";
export default {
    components: {
        pagination,
    },
    dicts: ["enableState"],
    data() {
        const today = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1 + '').padStart(2, '0')) + "-" + ((new Date().getDate() + '').padStart(2, '0'))
        return {
            dialogShow: false,
            dialogShows: false,
            siteTitle: "",
            alarmAmount: "",
            formSearch: {
                // 搜索的表单
                startTime: "",
                endTime: "",
                pageNum: 1,
                pageSize: 10,
                total: 0,
                siteId: ''
            },
            timeArr: [],
            minitorProject: [
                {
                    name: "PM2.5",
                    value: "PM2.5"
                },
                {
                    name: "PM10",
                    value: "PM10"
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
            historypeople: {},
            timeArr: [],
            // 表格的数据
            tableData: [],
            radio: "PM2.5"
        };
    },
    mounted() {
        this.formSearch.siteId = this.$route.query.id;
        this.getTableData();
    },
    methods: {
        // 返回上一页
        onBack() {
            this.$router.go(-1);
        },
        // checkBox多选
        handleChecked(data) { },
        //  获取列表信息
        getTableData() {
            if(this.timeArr){
                this.formSearch.startTime = this.timeArr[0]
                this.formSearch.endTime = this.timeArr[1]
            }else {
                this.formSearch.startTime = ''
                this.formSearch.endTime = ''
            }
            if(this.$route.query.type == 'outdoor'){
                delete this.formSearch.total
                $environMonitor.singleSite(this.formSearch).then(res => {
                    this.tableData = res.data.data;
                    this.formSearch.pageNum = res.data.pageNum;
                    this.formSearch.pageSize = res.data.pageSize;
                    this.formSearch.total = res.data.total;
                });
            }else{
                $environMonitor.singleSite(this.formSearch).then(res => {
                    this.tableData = res.data.data;
                    this.formSearch.pageNum = res.data.pageNum;
                    this.formSearch.pageSize = res.data.pageSize;
                    this.formSearch.total = res.data.total;
                });
            }
            
        },
        // 搜索列表信息
        onSearch() {
            this.getTableData();
        },
        // 重置
        onReset() {
            this.formSearch.pageNum = 1,
                this.formSearch.pageSize = 10
            this.$refs.formSearch.resetFields()
            this.timeArr = []
            this.getTableData();
        },
        // table分页
        tableCurrentChange(val) {
            this.formSearch.pageNum = val.page;
            this.getTableData(this.formSearch);
        },
    }
};
</script>
  
<style lang='scss' scoped>
.dateButton {
    padding: 5px;
    cursor: pointer;

    &:hover {
        color: #fff;
        background: #206aff;
    }
}

.filterTypes {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    height: 30px;
    align-items: center;
}

.filterTypess {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    height: 30px;
    align-items: center;
}

.focus {
    color: #fff;
    background: #206aff;
}

::v-deep.el-table.el-table--fit {
    overflow: hidden;
}

::v-deep .el-dialog__body {
    padding-top: 10px;
}
</style>
  