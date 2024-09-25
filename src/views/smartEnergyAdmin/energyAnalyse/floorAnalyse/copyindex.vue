<!-- 智能照明 -->
<template>
	<div class="app-container">
		<el-row :gutter="20">
			<el-col :xl="4" :lg="6" :sm="7" :xs="24">
				<OrgizeTreeEne :districtList="dominList" :isCheck="isCheck" :dominShow="dominShow" :permissionData="{}"
					@handleNodeDblclick="handleNodeDblclick" @DragEnd="DragEnd" :draggable="draggable" :nodeType="nodeType"
					@getTableData="getTableData" />
			</el-col>
			<el-col :xl="20" :lg="18" :sm="17" :xs="24">
				<!-- 搜索 -->
				<el-form :inline="true" ref="serForm" :model="tableForm" v-show="showSearch">
					<el-form-item label="单位" prop="value">
						<el-select style="width:10vh" placeholder="请选择单位" v-model="tableForm.value">
							<el-option v-for="item in options" :key="item.value" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备类型" prop="deviceType">
						<el-select style="width:20vh" placeholder="请选择设备类型" v-model="tableForm.deviceType" clearable>
							<el-option v-for="item in deviceTypes" :key="item.value" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="开始日期" prop="startTime">
						<el-date-picker style="width:25vh" v-model="tableForm.startTime" type="date"
							value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="结束日期" prop="endTime">
						<el-date-picker style="width:25vh" v-model="tableForm.endTime" type="date"
							value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" @click="search()" type="primary">搜索</el-button>
						<el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
				<el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button @click="exportFloorReport()" type="warning" plain>导出楼宇数据</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button @click="exportMonthReport()" type="warning" plain>导出月报数据</el-button>
					</el-col>
					<right-toolbar :showSearch.sync="showSearch" @queryTable="getTableDataNext"></right-toolbar>
				</el-row>
				<!-- end -->
				<el-table :data="tableData">
					<el-table-column label="序号" width="80" type="index"></el-table-column>
					<el-table-column prop="time" label="时间" showOverflowTooltip></el-table-column>
					<el-table-column prop="tagId" label="设备编号" showOverflowTooltip />
					<el-table-column prop="deviceType" label="设备类型">
						<template slot-scope="scope">
							<span v-if="scope.row.deviceType == 1" style="color:#18dca7;">电</span>
							<span v-else-if="scope.row.deviceType == 0" style="color:#f05656;">水</span>
							<span v-else style="color:#f05656;">空</span>
						</template>
					</el-table-column>
					<el-table-column prop="deviceName" label="设备名称"></el-table-column>
					<el-table-column prop="deviceValue" label="用量" showOverflowTooltip>
						<template slot-scope="scope">
							<span v-if="scope.row.deviceType == 1"
								style="color:#18dca7;">{{ scope.row.deviceValue }}(度)</span>
							<span v-else-if="scope.row.deviceType == 0"
								style="color:#f05656;">{{ scope.row.deviceValue }}(吨)</span>
							<span v-else style="color:#f05656;">空</span>
						</template>
					</el-table-column>
					<el-table-column prop="carbonEmission" label="碳排放量(kg)" showOverflowTooltip></el-table-column>
					<el-table-column label="同比" prop="grew">
					</el-table-column>
				</el-table>
				<!--分页 -->
				<div class="content-bottom" v-if="tableData.length > 0 && tableData">
					<pagination @pagination="handleCurrentChange" :page.sync="tableForm.pageNum"
						:pageSizes="[10, 20, 30, 40]" :limit.sync="tableForm.pageSize" :total="total" />
				</div>
				<!-- end -->
			</el-col>
		</el-row>
		<!-- 亮度设置 -->
		<el-dialog title="亮度调节" :visible.sync="lighting" width="600px" center>
			<div class="dialogLig">
				<img :src="require(`@/assets/images/smartBuild/zm1.png`)" :style="{ opacity: styleValue }" />
				<div class="block">
					<span class="demonstration">默认</span>
					<el-slider class="sliders" :min="1" v-model="lightingValue" :max="10"
						:format-tooltip="formatTooltip"></el-slider>
				</div>
			</div>
			<span slot="footer">
				<el-button type="primary" @click="lightingSubmit">确定</el-button>
				<el-button plain @click="lighting = false">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { downloadFile } from "@/utils/index";
import "echarts-liquidfill";
import { initLineData } from "@/api/smartProperty/workbench";
import {
	getDeviceCriteriaEnergy,
	initTableData,
	download,
	downloadMonthly
} from "@/api/smartEnergyAdmin/energyAnalyse";
import sysTree from "@/components/sysTree";
import pagination from "@/components/comPagination";
import OrgizeTree from "@/components/orgnizeTree";
import OrgizeTreeEne from "@/components/orgnizeTreeEne";
import {
	treeData,
	getDeviceInfoById,
	getIvsPlayer,
	getDeviceCriteria
} from "@/api/system/organization";
import comCard from "@/components/comCard";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import $smartBuild from "@/api/smartBuild";

export default {
	name: 'Flooranalyse',
	components: {
		sysTree,
		pagination,
		OrgizeTree,
		comCard,
		OrgizeTreeEne
	},
	data() {
		return {
			tableForm: {
				deviceType: "",
				floor: "",
				value: "1",
				startTime: "",
				endTime: "",
				pageNum: 1,
				pageSize: 10
			},
			deviceTypes: [
				{
					value: "0",
					label: "水"
				},
				{
					value: "1",
					label: " 电"
				}
			],
			labelpng: ["repair", "rentwithdrawal", "renewal"],
			filterSelectType: "week",
			filterSelectTypes: [
				{
					type: "week",
					name: "本周"
				},
				{
					type: "month",
					name: "本月"
				},
				{
					type: "year",
					name: "本年"
				}
			],
			showSearch: true,
			defaultLineChart: null,
			options: [
				{ value: "1", label: "日" },
				{ value: "2", label: "周" },
				{ value: "3", label: "月" },
				{ value: "4", label: "季" },
				{ value: "5", label: "年" }
			],
			value: "1",
			// 时间选择器
			pickerOptions: {
				shortcuts: [
					{
						text: "最近一周",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit("pick", [start, end]);
						}
					},
					{
						text: "最近一个月",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit("pick", [start, end]);
						}
					},
					{
						text: "最近三个月",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit("pick", [start, end]);
						}
					}
				]
			},
			value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
			value2: "",
			weeks: [
				{
					value: 1,
					num: 0,
					name: "星期一"
				},
				{
					value: 2,
					num: 0,
					name: "星期二"
				},
				{
					value: 3,
					num: 0,
					name: "星期三"
				},
				{
					value: 4,
					num: 0,
					name: "星期四"
				},
				{
					value: 5,
					num: 0,
					name: "星期五"
				},
				{
					value: 6,
					num: 0,
					name: "星期六"
				},
				{
					value: 7,
					num: 0,
					name: "星期日"
				}
			],
			months: [],
			years: [
				{
					value: 1,
					num: 0,
					name: "一月"
				},
				{
					value: 2,
					num: 0,
					name: "二月"
				},
				{
					value: 3,
					num: 0,
					name: "三月"
				},
				{
					value: 4,
					num: 0,
					name: "四月"
				},
				{
					value: 5,
					num: 0,
					name: "五月"
				},
				{
					value: 6,
					num: 0,
					name: "六月"
				},
				{
					value: 7,
					num: 0,
					name: "七月"
				},
				{
					value: 8,
					num: 0,
					name: "八月"
				},
				{
					value: 9,
					num: 0,
					name: "九月"
				},
				{
					value: 10,
					num: 0,
					name: "十月"
				},
				{
					value: 11,
					num: 0,
					name: "十一月"
				},
				{
					value: 12,
					num: 0,
					name: "十二月"
				}
			],

			lighting: false,
			lightingValue: 1,
			styleValue: 1,
			ruleForm: {
				pass: "",
				checkPass: "",
				age: "",
				switch: true
			},
			permission: {
				getLine: "smartProperty::workbench::getLine",
				download: "smartEnergyAdmin::energyAnalyse::floorAnalyse::download",
				downloadMonthly:
					"smartEnergyAdmin::energyAnalyse::floorAnalyse::downloadMonthly",

				deviceTree: "monitor::splitscreen::deviceTree",
				deviceCriteria: "monitor::splitscreen::deviceCriteria",
				treeCheck: "tree::check",
				searchDevice: "smartBuild::intellectCondite::searchDevice"
			},
			dominList: [],
			draggable: true,
			districtList: [],
			tagNode: {},
			isCheck: "",
			nodeType: "lighting",
			isShow: true,
			dominShow: true,
			total: 0,
			pageNum: 1,
			pageSize: 10,
			form: {
				value: "1",
				// type: 0,
				pageNum: 1,
				pageSize: 10
			},
			TypeArr: [
				{ value: 0, label: "不限" },
				{ value: 1, label: "名称" }
			],
			tableData: [],
			selectedIds: [],
			spanList: [
				{
					type: "total",
					num: 156,
					name: "照明设备总数",
					path: require(`@/assets/images/smartBuild/zm1.png`)
				},
				{
					type: "off-line",
					num: 12,
					name: "照明设备正常",
					path: require(`@/assets/images/smartBuild/zm2.png`)
				},
				{
					type: "off-line",
					num: 12,
					name: "照明设备离线",
					path: require(`@/assets/images/smartBuild/zm3.png`)
				},
				{
					type: "normal",
					num: 111,
					name: "照明设备故障",
					path: require(`@/assets/images/smartBuild/zm4.png`)
				}
			]
		};
	},
	mounted() {
		this.getTableDataNext();
	},
	computed: {},
	methods: {
		resetQuery() {
			this.resetForm('serForm')
			this.search()
		},
		// 导出楼宇数据
		exportFloorReport() {
			let url = "/pm/hydropower/point/downloadBuilding";
			let method = "get";
			let params = this.tableForm;
			download(url, method, params)
				.then(res => {
					this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 导出月报数据
		exportMonthReport() {
			let url = "/pm/hydropower/exportWord";
			let method = "get";
			downloadMonthly(url, method)
				.then(res => {
					this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 列表
		getTableDataNext() {
			let data = this.tableForm;
			initTableData(data).then(res => {
				this.tableData = res.data.data;
				this.total = res.data.total;
			});
		},
		// 统计图初始化
		chartInit() {
			this.defaultLineChart = this.$Echarts.init(document.getElementById("line"));
		},
		// 请求折线图数据
		getLineData() {
			let data = this.filterSelectType;
			initLineData(data).then(res => {
				let results = res.data.cycleResult;
				let xAxis = [];
				let yAxis = [];
				if (this.filterSelectType === "week") {
					results.forEach(item => {
						this.weeks.forEach(items => {
							if (item.name == items.value) {
								items.num = item.value;
							}
						});
					});
					this.weeks.forEach(res => {
						xAxis.push(res.name);
					});
					this.weeks.forEach(res => {
						yAxis.push(res.num);
					});
				} else if (this.filterSelectType === "month") {
					results.forEach(item => {
						yAxis.push(item.value);
					});
					results.forEach(item => {
						xAxis.push(item.name);
					});
				} else if (this.filterSelectType === "year") {
					results.forEach(item => {
						this.years.forEach(items => {
							if (item.name == items.value) {
								items.num = item.value;
							}
						});
					});
					this.years.forEach(res => {
						xAxis.push(res.name);
					});
					this.years.forEach(res => {
						yAxis.push(res.num);
					});
				}
				this.initLineChart(this.defaultLineChart, xAxis, yAxis);
			});
		},
		// 折线图选择x轴选项
		chooseDate(date) {
			this.filterSelectType = date.currentTarget.value;
			this.getLineData();
			this.getFillData();
		},
		initLineChart(eleDom, xAxis, yAxis) {
			let lineOption = {
				xAxis: {
					type: "category",
					boundaryGap: true,
					data: xAxis,
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							type: "solid",
							opacity: "0.1",
							color: "#afb9d0" //坐标线的颜色
						}
					},
					axisLabel: {
						textStyle: {
							color: "#afb9d0" //坐标值得具体的颜色
						}
					}
				},
				yAxis: {
					type: "value",
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							type: "solid",
							opacity: "0.1",
							color: "#afb9d0", //左边线的颜色
							width: "0" //坐标线的宽度
						}
					},
					splitLine: {
						lineStyle: {
							color: ["#afb9d0"],
							width: 1,
							type: "solid",
							opacity: "0.1"
						}
					},
					axisLabel: {
						textStyle: {
							opacity: "0.1",
							color: "#afb9d0" //坐标值得具体的颜色
						}
					}
				},
				grid: {
					left: 50,
					top: 60,
					right: 10,
					bottom: 20
				},
				asixPointer: {
					z: -10
				},
				title: {
					text: "能耗折线图",
					left: "10px",
					top: "10px",
					textStyle: {
						color: "#afb9d0",
						fontFamily: "Microsoft YaHei",
						fontSize: 18,
						fontWeight: "normal"
					}
				},
				tooltip: {
					trigger: "item"
				},
				series: [
					{
						data: yAxis,
						type: "line",
						itemStyle: {
							color: "#206aff"
						},
						areaStyle: {
							color: "#206aff",
							opacity: 0.3
						}
					}
				]
			};
			eleDom && eleDom.setOption(lineOption);
			window.addEventListener("resize", () => {
				eleDom.resize();
			});
		},

		/**
		 * @name: 初始化函数--暖通空调
		 * @Author: sscaij
		 * @msg:
		 * @param {*}
		 * @return {*}
		 */
		// initPageIntell() {},
		// card事件 routerClick
		routerClick(item) {
			console.log(item, 119);
		},
		// 格式化亮度
		formatTooltip(val) {
			this.styleValue = val / 10;
			return val / 10;
		},
		// 亮度设置
		lightingSubmit() {
			this.lighting = false;
		},
		//  获取设备信息
		getDeviceData(data) {
			if (!data.children) {
				if (!data.code) {
					if (this.isType === "click") {
						let tempObj = [
							{
								deviceId: data.id,
								deviceName: data.name
							}
						];
						this.handleleftClick(tempObj);
					} else if (this.isType === "dbClick") {
						const player = {
							deviceId: data.deviceId,
							deviceName: data.name
						};
						this.goVideoControl(player);
					}
					return;
				}
				getDeviceInfoById(data.code)
					.then(res => {
						if (this.isType === "click") {
							this.handleleftClick(res.data);
						} else if (this.isType === "dbClick") {
							if (res.data[0]) {
								const player = {
									deviceId: res.data[0].deviceId,
									deviceName: res.data[0].name,
									protocol: res.data[0].protocol
								};
								this.goVideoControl(player);
							}
						} else if (this.isType === "drag") {
							this.players[this.dragIndex].deviceId = res.data[0].deviceId;
							this.players[this.dragIndex].deviceName = res.data[0].name;
							this.players[this.dragIndex].protocol = res.data[0].protocol;
						} else {
							this.$message.error("获取设备信息失败");
						}
					})
					.catch(err => {
						console.log(err, "err");
					});
			}
		},
		// 左侧设备树双击
		handleNodeDblclick(data) {
			this.isType = "dbClick";
			this.getDeviceData(data);
		},
		// 左侧设备树拖拽
		DragEnd(node, prenode, pis, evt) {
			this.clientX = evt.clientX;
			this.clientY = evt.clientY;
			this.isType = "drag";
			for (let i = 0; i < this.distance.length; i++) {
				if (
					this.clientX > this.distance[i].toLeft &&
					this.clientX < this.distance[i].toRight &&
					this.clientY + this.scrollTop > this.distance[i].toTop &&
					this.clientY + this.scrollTop < this.distance[i].toBottom
				) {
					// 调用接口获取视频流
					this.dragIndex = i;
					this.getDeviceData(node.data);
				}
			}
		},
		//  点击左侧通道树
		handleleftClick(data) {
			const res = data[0];
			// if (res) {
			//   getDeviceCriteriaEnergy(params).then(rs => {
			//   });
			// }
		},
		// 通道列表点击选择通道
		handleClickChannel(data, index) {
			const player = this.players[index];
			player.deviceId = data.deviceId;
			player.deviceName = data.name;
			player.protocol = data.protocol;
			this.workspaceDeviceCounts++;
		},
		getTableData(data, activeName) {
			if (activeName === "first") {
				this.tableForm.floor = data.id;
				let pae = this.tableForm;
				initTableData(pae).then(res => {
					this.tableData = res.data.data;
					this.total = res.data.total;
				});
			} else {
				// 右侧收藏数数据（待填充）
			}
		},
		handleCurrentChange() {
			this.getTableDataNext();
		},
		// 开启
		openDialog() { },
		// 关闭
		closeDia() { },
		// 搜索
		search() {
			this.tableForm.pageNum = 1
			this.getTableDataNext()
		},
		// 重置
		reset() {
			this.$refs["serForm"].resetFields();
		},
	}
};
</script>
  
<style lang="scss" scoped>
#line {
	width: 300px;
	height: 350px;
	padding: 10px;
}

.video-web-right-box-top {
	border-radius: 8px;
	position: relative;
	height: 42%;

	.dateButtonGroup {
		position: absolute;
		top: 20px;
		right: 20px;
		z-index: 9999;

		.focus {
			background-color: #3957ff;
		}
	}

	#line {
		position: absolute;
		width: 100%;
		height: 350px;
		padding: 10px;
	}

	.dateButton {
		border: none;
		color: #afb9d0;
		border-radius: 2px;
		font-size: 12px;
	}
}

.video-web-right-box-bottom {
	height: 100%;
	margin-top: 0px;
}

::v-deep .el-switch__label {
	position: absolute;
	display: none;
	font-size: 14px !important;
	color: #fff !important;
}

::v-deep .el-switch__label * {
	font-size: 14px !important;
}

/*打开时文字位置设置*/
::v-deep .el-switch__label--right {
	z-index: 1;
	left: 0px; // 这里是重点
	top: 0.5px;
}

/*关闭时文字位置设置*/
::v-deep .el-switch__label--left {
	z-index: 1;
	right: 0px; // 这里是重点
	top: 0.5px;
}

/*显示文字*/
::v-deep .el-switch__label.is-active {
	display: block;
}

::v-deep .el-switch .el-switch__core {
	border-color: #00e984 !important;
	background-color: #00e984 !important;
}

::v-deep .el-switch.is-checked .el-switch__core {
	border-color: #206aff !important;
	background-color: #206aff !important;
}

::v-deep .el-switch__core {
	width: 80px !important;
	height: 22px;
	border: 2px solid #dcdfe6;
	border-radius: 13px;
}

// ::v-deep .el-switch {
//   width: 50%;
// }
::v-deep .el-form-item--small .el-form-item__label {
	line-height: 30px !important;
}

::v-deep .el-form-item--small .el-form-item__content {
	line-height: 30px !important;
}

.margin0 {
	margin-bottom: 5px;
	text-align: center;
}

.bgCond {
	display: inline-block;
	width: 70px;
	height: 27px;
	border-radius: 5px;
	background: #313448;
	cursor: pointer;
}

.bgSucc {
	background: #00e984;
	color: #000;
}

.el-form-item .app-container {
	background-color: transparent;
}

.top-card {
	width: 100%;
	display: flex;
	align-items: center;
	margin-left: 0px !important;
	justify-content: space-between;

	.total {
		border-radius: 5px;
		background-color: #202230;
		margin-right: 6%;
		height: 100px;
	}

	.off-line {
		border-radius: 5px;
		background-color: #202230;
		margin-right: 6%;
		height: 100px;
	}

	.normal {
		border-radius: 5px;
		background-color: #202230;
		margin-right: 6%;
		height: 100px;
	}

	.exception {
		border-radius: 5px;
		background-color: #202230;
		margin-right: 0%;
		height: 100px;
	}
}

.table-padding {
	padding: 0px 20px 0px 20px;
}

.photoBox {
	width: 100%;
	height: calc(100vh - 240px);
	display: flex;
	overflow: auto;
	flex-direction: column;
}

.content-Text {
	width: 100%;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	float: left;
}

.rightSpan {
	float: right;
	margin-top: 16px;
	width: 40%;
	height: 75px;
	color: rgba(0, 0, 0, 0.16);
	opacity: 0.8;
}

.groups {
	display: flex;
	justify-content: space-around;
	height: 350px;
	padding: 10px;
	width: 100%;
	background-color: #272937;
	border-radius: 8px;
	margin-bottom: 15px;

	&:last-child {
		margin-bottom: 0;
	}

	.imgTitle {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 70%;
		border-right: solid 1px#363845;

		.gifs {
			display: flex;
			width: 100%;
			height: auto;

			img {
				width: 80%;
				margin: 0 auto;
			}
		}
	}

	.infomation {
		width: 30%;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-content: center;
	}
}

.greens {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: #00e984;
}

.reds {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: #ff403d;
}

.forms {
	padding: 20px 20px 0 20px;
}

.card-wrap {
	height: 100px;
}

.lightSet {
	display: flex;
	align-items: center;

	img {
		width: 20px;
		cursor: pointer;
		margin-left: 30px;
	}
}

.dialogLig {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 20px 0;

	.block {
		width: 100%;
		display: flex;
		align-items: center;
		height: 50px;

		.demonstration {
			width: 30px;
			margin-right: 20px;
		}

		.sliders {
			width: 79%;
		}
	}

	img {
		width: 30%;
	}
}
</style>