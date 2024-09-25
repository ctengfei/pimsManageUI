<template>
	<div class="app-container">
		<el-row :gutter="20" style="overflow-y:hidden;">
			<el-col style="height:inherit">
				<div class="ListManage" style="height:100%">
					<el-form ref="formSearch" inline :model="formSearch" class="demo-form-inline">
						<!-- <el-form-item label="监测项目" style="width:100%" prop="detectionProject">
							<el-checkbox-group v-model="formSearch.detectionProject" @change="handleChecked">
								<el-checkbox v-for="(item, index) in minitorProject" :key="index" :label="item.value"
									:value="item.value">{{ item.name }}</el-checkbox>
							</el-checkbox-group>
						</el-form-item> -->
						<el-form-item label="监测指标" prop="detectionProject">
							<el-select v-model="formSearch.detectionProject" placeholder="请选择监测指标" clearable>
								<el-option v-for="item in minitorProject" :key="item.name" :label="item.name" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="监测站点" prop="detectionSiteId">
							<el-select v-model="formSearch.detectionSiteId" placeholder="请选择监测站点" clearable>
								<el-option v-for="item in siteName" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="预警时间" prop="timeArr">
							<el-date-picker v-model="timeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
								range-separator="至" start-placeholder="开始日期" :default-time="['00:00:00', '23:59:59']" end-placeholder="结束日期">
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
		<div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="detectionSiteName" label="监测点" />
				<el-table-column prop="deviceName" label="设备名称" />
				<el-table-column prop="alarmTime" label="预警时间" />
				<el-table-column prop="earlyWarningName" label="预警名称" />
				<el-table-column prop="detectionProject" label="监测指标" />
				<el-table-column prop="concentrationValue" label="监测值" />
				<el-table-column prop="standardValue" label="标准值" />
			</el-table>
		</div>

		<!-- 分页 -->
		<pagination v-show="total > 0" :total="total" :page.sync="formSearch.pageNum"
			:limit.sync="formSearch.pageSize" @pagination="tableCurrentChange" />
	</div>
</template>
  
<script>
import $detectionAlarm from "@/api/environMonitor/detectionAlarm";
import $environMonitor from "@/api/environMonitor";
import pagination from "@/components/comPagination";
export default {
	name: "",
	components: {
		pagination,
	},
	dicts: ["enableState"],
	data() {
		const today = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1 + '').padStart(2, '0')) + "-" + ((new Date().getDate() + '').padStart(2, '0'))
		return {
			// 总数量
			total: 0,
			formSearch: {
				// 搜索的表单
				alarmStartTime: "",
				alarmEndTime: "",
				detectionProject: [],
				detectionSiteName: "",
				pageNum: 1,
				pageSize: 10,
				position:'outdoor'
			},
			siteName: [],
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
			timeArr: [],
			// 表格的数据
			tableData: [],
			meetingId: "",
			nowStarTime: today,
			nowEndTime: today,
			addFormStatus: false,
			meetingId: "",
			meetingObj: {}
		};
	},
	mounted() {
		this.getTableData();
		this.getSiteAll()
	},
	methods: {
		// 获取站点名称
		getSiteAll() {
			$environMonitor.getSiteAll().then(res => {
				this.siteName = res.data
			})
		},
		// checkBox多选
		handleChecked(data) { },
		// 取消
		onCancel(form) {
			if (this.$refs[form] !== undefined) {
				this.$refs[form].resetFields();
			}
			this.timeArr = []
			this.addFormStatus = false
		},
		//  获取列表信息
		getTableData() {
			if(this.timeArr){
                this.formSearch.alarmStartTime = this.timeArr[0]
                this.formSearch.alarmEndTime = this.timeArr[1]
            }else {
                this.formSearch.alarmStartTime = ''
                this.formSearch.alarmEndTime = ''
            }
			$detectionAlarm.getList(this.formSearch).then(res => {
				this.tableData = res.data.data;
				this.formSearch.pageNum = res.data.pageNum;
				this.formSearch.pageSize = res.data.pageSize;
				this.total = res.data.total;
			});
		},
		// 搜索列表信息
		onSearch() {
			this.formSearch.pageNum = 1
			this.getTableData();
		},
		onReset() {
			this.formSearch.pageNum = 1
			this.formSearch.pageSize = 10
			this.timeArr = []
			this.$refs.formSearch.resetFields()
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
  
<style scoped>
.content-bottom {
	margin-bottom: 20px;
}

::v-deep.el-table.el-table--fit {
	overflow: hidden;
}

::v-deep .el-dialog__body {
	padding-top: 10px;
}

.btnBox {
	display: block;
	margin: 20px 0;
	text-align: right;
}
</style>
  