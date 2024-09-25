<template>
	<div class="app-container">
		<el-form inline :model="formSearchWarning" ref="formSearchWarning" v-show="showSearch">
			<el-form-item label="告警编号" prop="code">
				<el-input placeholder="请输入告警编号" v-model="formSearchWarning.code"></el-input>
			</el-form-item>
			<el-form-item label="表类型" prop="type">
				<el-select placeholder="请选择表类型" v-model="formSearchWarning.type" clearable>
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="告警级别" prop="level">
				<el-select placeholder="请选择告警级别" v-model="formSearchWarning.level" clearable>
					<el-option v-for="item in leveldata" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="告警时间" prop="timeArr">
				<el-date-picker v-model="timeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至" start-placeholder="开始日期" :default-time="['00:00:00', '23:59:59']" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="onSearch(formSearchWarning)">搜索</el-button>
				<el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="clickThreshold(formSearchWarning)">阈值监测</el-button>
			</el-form-item>
		</el-form>
		<div class="photoBox">
			<el-table :data="tableDataList">
				<el-table-column type="index" label="序号" width="50" ></el-table-column>
				<el-table-column prop="deviceTypeStr" label="表类型"></el-table-column>
				<el-table-column prop="deviceName" label="表名称"></el-table-column>
				<el-table-column prop="code" label="告警编号"></el-table-column>
				<el-table-column prop="" label="告警方式">
					<template slot-scope="scope">
						<span v-if="scope.row.alarmFrom == 'MANUAL_ALARM'">手动告警</span>
						<span v-else-if="scope.row.alarmFrom == 'AUTO_ALARM'">自动告警</span>
					</template>
				</el-table-column>
				<el-table-column prop="eventNameStr" label="事件名称"></el-table-column>
				<el-table-column prop="location" label="告警位置"></el-table-column>
				<el-table-column prop="triggerTime" label="告警时间"></el-table-column>
				<el-table-column prop="levelStr" label="告警级别"></el-table-column>
				<el-table-column prop="statusStr" label="告警状态"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="openDialogDetail(scope.row,1)" v-if="scope.row.status == 'unprocessed'" type="text" class="color">详情及确认</el-button>
						<el-button @click="openDialogDetail(scope.row,2)" type="text" v-else class="color">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="tableDataList && tableDataList.length > 0" @pagination="handleCurrentChange"
				:page.sync="formSearchWarning.pageNum" :pageSizes="[10, 20, 40]" :limit.sync="formSearchWarning.pageSize"
				:total="total" />
		</div>

		<el-dialog :title="titlestr" width="42%" :visible.sync="detailPlanShow">
			<el-row>
				<el-form labelWidth="80px" :model="detailFormWarning" ref="detailFormWarning">
					<el-col :span="8">
						<el-form-item label="表类型" prop="deviceTypeStr" >
							<el-input v-model="detailFormWarning.deviceTypeStr" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="表编号" prop="deviceCode" >
							<el-input v-model="detailFormWarning.deviceCode" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="表名称" prop="deviceName">
							<el-input v-model="detailFormWarning.deviceName" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="告警编号" prop="alarmCode">
							<el-input v-model="detailFormWarning.alarmCode" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="事件名称" prop="eventNameStr">
							<el-input v-model="detailFormWarning.eventNameStr" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="告警时间" prop="triggerTime">
							<el-input v-model="detailFormWarning.triggerTime" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="告警位置" prop="location">
							<el-input v-model="detailFormWarning.location" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="告警方式" prop="fromStr">
							<el-input v-model="detailFormWarning.fromStr" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="告警级别" prop="levelStr">
							<el-input v-model="detailFormWarning.levelStr" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="告警描述" >
							<el-input v-model="detailFormWarning.threshold" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="typenum == 1">
						<el-form-item label="修改原因" prop="resultReason" :rules="[{required: true, message: '请输入修改原因', trigger: 'blur'}]">
							<el-input v-model="detailFormWarning.resultReason" placeholder="请输入修改原因"></el-input>
						</el-form-item>
					</el-col>
					<div v-show="typenum == 2">
						<el-col :span="24">
							<el-form-item label="修改原因" prop="resultReason" >
								<el-input v-model="detailFormWarning.resultReason" placeholder="请输入修改原因" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="确认结果" prop="statusStr">
								<el-input v-model="detailFormWarning.statusStr" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="操作时间" prop="confirmerTime">
								<el-input v-model="detailFormWarning.confirmerTime" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="操作人" prop="confirmer">
								<el-input v-model="detailFormWarning.confirmer" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
					</div>
				</el-form>
			</el-row>
			<div class="submitButton" v-show="typenum == 1">
				<el-button type="primary" @click="roundPatrolCancel">任务下发</el-button>
				<el-button plain @click="roundPatrolSubmit">误报，关闭告警</el-button>
			</div>
			<div slot="footer">
				<el-button plain @click="cancelDetail()">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="阈值监测" width="48%" :visible.sync="monitoringShow">
			<el-row>
				<el-form labelWidth="220px" style="width: 100%;" :model="monitoring" ref="monitoring">
					<!-- 动态表单校验 -->
					<div v-for="(item,index) in monitoring.EnableArr " :key="index">
						<el-col :span="12">
						<el-form-item :label="item.name" :prop="'EnableArr.' + index + '.status'" :rules="{required: true, message: `请选择${item.name}`, trigger: 'blur'}">
							<el-radio-group v-model="item.status">
								<el-radio :label=" true " >启用</el-radio>
								<el-radio :label=" false " >停用</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="item.dictLabel1" :prop="'EnableArr.' + index + '.threshold'" :rules="{required: true, message: `请输入${item.dictLabel1}`, trigger: 'blur'}">
							<el-input-number v-model="item.threshold" :min="0" :max="100" label="描述文字"></el-input-number>
						</el-form-item>
					</el-col>
					</div>
				</el-form>
			</el-row>
			<div slot="footer">
				<el-button type="primary" @click="submitmonitoring">确定</el-button>
				<el-button plain @click="cancelDetail()">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import pagination from '@/components/comPagination'
import { initTabDataList, toWarningNext,alarmifon,alarmAssign,alarmClose,threshold,databatch } from '@/api/smartEnergyAdmin/energyWarning'
import {  } from "@/api/system/operlog";

export default {
	name: '',
	components: {
		pagination,
	},
	data() {
		return {
			video:"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        	picture:"http://static.runoob.com/images/demo/demo2.jpg",
			options: [
				{
					label:'电表',
					value:'ammeter'
				},
				{
					label:'水表',
					value:'waterMeter'
				},
				// {
				// 	label:'热量表',
				// 	value:'heatMeter'
				// },
			],
			leveldata:[
					{
					value: 'normal',
					label: '普通告警'
				}, {
					value: 'emergency',
					label: '严重告警'
				}, {
					value: 'veryEmergency',
					label: '紧急告警'
				},
			],
			value: '',
			showSearch: true,
			tableDataList: [],
			total: 15,
			detailPlanShow: false,
			detailFormWarning: {
				resultReason:''
			},
			detailFormWarning1:{
				content:''
			},
			timeArr: [],
			formSearchWarning: {
				code: '',
				level: '',
				startTime: '',
				endTime: '',
				pageNum: 1,
				pageSize: 10,
			},
			spanIndex: [],
			titlestr:'告警详情及确认',
			typenum:1,
			monitoringShow:false,
			EnableVal:3,
			monitoring:{
				EnableArr:[],
			}
		}
	},
	mounted() {
		this.getTableData()
	},
	methods: {
		clickThreshold(){
			this.monitoringShow = true
			this.getthreshold()
		},
		getthreshold(){
			threshold().then(res=>{
				let temp = res.data.map(item=>{
					if(item.dictValue == 'daily_hydropower_threshold'){
						item.dictLabel1 = '日用量异常报警浮动百分比阈值'
					}else{
						item.dictLabel1 = '月用量异常报警浮动百分比阈值'
					}
					return item
				})
				this.monitoring.EnableArr = temp
			})
		},
		resetQuery() {
			this.resetForm('formSearchWarning')
			this.onSearch()
		},
		// 任务下发
		roundPatrolCancel(){
			console.log(this.detailFormWarning.resultReason,'this.detailFormWarning.content')
			this.$refs['detailFormWarning'].validate((valid) => {
				if (valid) {
					let obj = {
						alarmCode:this.detailFormWarning.alarmCode,
						content:this.detailFormWarning.resultReason,
						submit:true
					}
					alarmAssign(obj).then(res=>{
						this.detailPlanShow = false
						this.$refs.detailFormWarning.resetFields()
						this.$message.success("告警任务下发成功")
						this.getTableData()
					}).catch(err=>{
						this.$message.error(err.msg)
					})
				}
			})
		},
		// 阈值提交
		submitmonitoring(){
			this.$refs['monitoring'].validate((valid) => {
				if (valid) {
					databatch(this.monitoring.EnableArr).then(res=>{
						this.monitoringShow = false
						this.$refs.monitoring.resetFields()
						this.$message.success("阈值设置成功")
						this.getTableData()
					}).catch(err=>{
						this.$message.error(err.msg)
					})
				}
			})
		},
		// 关闭告警
		roundPatrolSubmit(){
			this.$refs['detailFormWarning'].validate((valid) => {
				if (valid) {
					let obj = {
						alarmCode:this.detailFormWarning.alarmCode,
						closeReason:this.detailFormWarning.resultReason
					}
					alarmClose(obj).then(res=>{
						this.detailPlanShow = false
						this.$refs.detailFormWarning.resetFields()
						this.$message.success("关闭告警成功")
						this.getTableData()
					}).catch(err=>{
						this.$message.error(err.msg)
					})
				}
			})
		},
		// 详情
		openDialogDetail(data,type) {
			console.log(type, 'type')
			this.typenum = type
			if(type == 1){
				this.titlestr = '告警详情及确认'
			}else {
				this.titlestr = '告警详情'
			}
			alarmifon(data.id).then(resp => {
				console.log(resp,'详情')
				this.detailFormWarning = resp.data
			});
			this.detailPlanShow = true
		},
		// 详情的取消关闭
		cancelDetail() {
			this.detailPlanShow = false
			this.monitoringShow = false
		},
		// 搜索
		onSearch() {
			this.formSearchWarning.pageNum = 1
			this.getTableData()
		},
		getTableData() {
			if(this.timeArr){
                this.formSearchWarning.alarmStartTime = this.timeArr[0]
                this.formSearchWarning.alarmEndTime = this.timeArr[1]
            }else {
                this.formSearchWarning.alarmStartTime = ''
                this.formSearchWarning.alarmEndTime = ''
            }
			initTabDataList(this.formSearchWarning).then(resp => {
				this.tableDataList = resp.data.data
				this.total = resp.data.total;
			});
		},
		handleCurrentChange() {
			this.getTableData();
		},
		onTrue(res) {
			let params = {
				id: res.id
			}
			toWarningNext(params).then(resp => {
				this.$message.success("预警成功");
				this.getTableData()
			})
		},
		//  重置新增/编辑表单
		resetForm() {
			this.timeArr = []
			this.$refs.formSearchWarning.resetFields()
			this.getTableData()
		},
	}
}
</script>

<style lang="scss" scoped>
.el-form .el-select {
	width: 100%;
}

.el-date-editor.el-input__inner {
	width: 100%;
}

.colors {
	background-color: #206aff;
}

.photoBox {
	// width: 100%;
	// display: flex;
	// overflow: auto;
	// flex-direction: column;
}
.submitButton {
	width: 100%;
	bottom: 20px;
	display: flex;
	justify-content: center;
	margin-top: 25px
}
</style>