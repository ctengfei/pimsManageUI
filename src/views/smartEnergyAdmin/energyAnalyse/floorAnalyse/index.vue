<template>
	<div class="app-container" style="display: flex;">
		<!-- <regiontree @nodeclick="nodeclick" :type="'1'" :nodeType = "nodeType "></regiontree> -->
		<!-- 表格数据 -->
		<div style="height: 100%;width: 100%;">
			<div style="display: flex; justify-content: space-between;"> 
				<el-radio-group v-model="radio2" size="medium" @input="inputradio">
					<el-radio-button label="waterMeter">水</el-radio-button>
					<el-radio-button label="ammeter">电</el-radio-button>
					<!-- <el-radio-button label="heatMeter">热</el-radio-button> -->
				</el-radio-group>
				<el-form ref="formSearch" inline :model="monitorSite" style="margin-left: 10px;">
					<el-form-item prop="nodeCode" label="用电区域">
                        <el-select v-model="monitorSite.nodeCode"  :clearable="false" @change="dateAreaChange"  style="width: 150px">
                            <el-option v-for="item in areaList" :key="item.value" :label="item.name" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="dateType" label="时间维度">
                        <el-select v-model="monitorSite.dateType"  :clearable="false"  style="width: 150px" @change="dateTypeChange">
                            <el-option v-for="item in dateTypeList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="时间范围" prop="timeArr">
						<el-date-picker v-model="monitorSite.timeArr" type="daterange" value-format="yyyy-MM-dd"  v-if="monitorSite.dateType === 'day'"
							range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  :clearable="false">
						</el-date-picker>
						<div class="flex" v-else-if="monitorSite.dateType === 'week'">
							<el-date-picker
							v-model="monitorSite.timeArr[0]"
							type="week"
							:clearable="false"
							format="yyyy 第 WW 周"
							placeholder="开始周">
							</el-date-picker>
							<span>至</span>
							<el-date-picker
							v-model="monitorSite.timeArr[1]"
							type="week"
							format="yyyy 第 WW 周"
							class="noIcon"
							:clearable="false"
							placeholder="结束周">
							</el-date-picker>
						</div>
						<el-date-picker
							v-else
							v-model="monitorSite.timeArr"
							value-format="yyyy/MM"
							type="monthrange"
							:clearable="false"
							range-separator="至"
							start-placeholder="开始月份"
							end-placeholder="结束月份">
              			</el-date-picker>
					</el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
                        <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
                    </el-form-item>
                </el-form>
				<div>
					<el-button icon="download" type="primary" @click="exportReport">导出</el-button>
				</div>
			</div>
			<div style="margin-top: 20px;">
				<div id="ss" style="height: 315px;width: 100%;"></div>
			</div>
			<div style="margin-top: 20px;">
				<el-table ref="multipleTable" :data="tableData" style="width: 100%">
					<el-table-column type="index" label="序号"></el-table-column>
					<el-table-column prop="area" label="区域节点" show-overflow-tooltip></el-table-column>
					<el-table-column prop="hydropowerType" label="能源类型" show-overflow-tooltip></el-table-column>
					<el-table-column prop="dateOrMonthStr" label="时间"></el-table-column>
					<el-table-column prop="value" label="用量" show-overflow-tooltip></el-table-column>
				</el-table>
				<!-- 分页fefeef -->
				<!-- <pagination v-show="tableData && tableData.length > 0" @pagination="handleCurrentChange"
					:page.sync="monitorSite.pageNum" :pageSizes="[10, 20, 30, 40]" :limit.sync="monitorSite.pageSize"
					:total="pagination" /> -->
			</div>
		</div>
	</div>
</template>

<script>
import Moment from 'moment'
import { downloadFile } from '@/utils/index'
import regiontree from "../../components/regiontree"  // 树结构组件
import pagination from "@/components/comPagination";
import $environMonitor from "@/api/environMonitor";
export default {
	components: {
        pagination,
        regiontree
    },
	data() {
		return {
			nodeType:'waterMeter',
			radio2: 'waterMeter',
			monitorSite: {
				start:'',
				end:'',
				nodeId: '',
				dateType: 'day',
				timeArr: [],
				nodeCode: 'public',
            },
			timeArr: [],
			pagination: 10,
            tableData: [],
			dateTypeList: [
				{
					value: 'day',
					label: '日'
				}, {
					value: 'week',
					label: '周'
				}, {
					value: 'month',
					label: '月'
				}
            ],
			areaList:[
				{
					name: "公共区域",
					value: "public"  
				},
				{
					name: "住户区域",
					value: "tenement"  
				},
				{
					name: "办公区域",
					value: "office"  
				},
				{
					name: "商业区域",
					value: "market"  
				},
			]
		}
	},
	created(){
		let today = new Date().toISOString().substring(0, 10)
		let aWeekAgo = new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().substring(0, 10)
		this.monitorSite.timeArr = [aWeekAgo, today]
	},
	mounted() {
		this.initcolumnarChart()
		this.getVisitorData()
	},
	methods: {
		onSearch() {
            this.getVisitorData();
        },
		// 重置接口数据
		onReset() {
			this.resetForm('formSearch')
			this.onSearch()
		},
		// 导出数据
		exportReport(){
			let params = {
				nodeId:this.monitorSite.nodeId,
				nodeCode: this.monitorSite.nodeCode,
				start: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[0])).format('yyyy-WW') : this.monitorSite.timeArr[0],
				end: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[1])).format('yyyy-WW') : this.monitorSite.timeArr[1],
			}
			$environMonitor.reportDataExport(this.radio2,this.monitorSite.dateType,params).then(res => {
				downloadFile(res, `能耗趋势${new Date().getTime()}`, "xlsx")
				this.$message.success("导出成功")
			})
		},
		inputradio(val){
			console.log(val,'val')
			this.nodeType = val
			this.getVisitorData()
			this.$nextTick(() => {
				this.initcolumnarChart()
			})
			this.$nextTick(() => {
				window.dispatchEvent(new Event('resize'))
			})
		},
		nodeclick(data) {
            console.log(data, 'data')
			this.monitorSite.nodeId = data   //节点nodeid
            this.getVisitorData();
        },
		// 翻页
        handleCurrentChange(val) {
			this.getVisitorData()
            console.log(`当前页: ${val}`);
        },
		 // 时间维度切换
		 dateTypeChange(val){
			if(val === 'day'){
				let today = new Date().toISOString().substring(0, 10)
				let aWeekAgo = new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().substring(0, 10)
				this.monitorSite.timeArr = [aWeekAgo, today]
				this.getVisitorData()
			}else if(val === 'week'){
				let today = new Date()
				let sixWeekAgo = new Date(new Date().setDate(new Date().getDate() - 42))
				this.monitorSite.timeArr = [sixWeekAgo, today]
				this.getVisitorData()
			}else {
				let today = new Date().toISOString().substring(0, 7).replace(/-/g, "/")
				let sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().substring(0, 7).replace(/-/g, "/")
				this.monitorSite.timeArr = [sixMonthAgo, today]
				this.getVisitorData()
			}
		},
		// 用电区域切换
		dateAreaChange(){
			this.getVisitorData()
		},
		// 获取图标数据
        getVisitorData() {
			let obj = {
				nodeId:this.monitorSite.nodeId,
				nodeCode: this.monitorSite.nodeCode,
				start: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[0])).format('yyyy-WW') : this.monitorSite.timeArr[0],
        		end: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[1])).format('yyyy-WW') : this.monitorSite.timeArr[1],
			}
            $environMonitor.gettrend(obj,this.radio2,this.monitorSite.dateType).then((res) => {
				this.tableData = res.data
                let xtemp = [], ytemp = []
				res.data.forEach(item => {
					xtemp.push(item.dateOrMonthStr)
					ytemp.push(item.value)
				})
				this.initcolumnarChart(xtemp,ytemp);
            }).catch((err) => {
                this.$message.error(err.message);
            });
        },
		initcolumnarChart(xdata, ydata,title) {
			let pieChart = this.$Echarts.init(document.getElementById('ss'))
			let lineOption = {
				title: {
					// title
					text:this.radio2=='waterMeter'? '园区用水趋势统计':this.radio2=='ammeter'?'园区用电趋势统计':'园区用热趋势统计',
					subtext: '',
					left: 'left'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				// legend: {},  图例
				grid: {
					left: '1%',
					right: '1%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: [0, 0.01],
					data: xdata,
					axisTick: {
						show: false,
					},
					axisLine: {
						lineStyle: {
							type: 'solid',
							opacity: '0.1',
							color: '#606266',//坐标线的颜色
						}
					},
				},
				yAxis: {
					type: 'value',
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							width: '0'//坐标线的宽度
						}
					},
					splitLine: {
						lineStyle: {
							color: ['#606266'],
							width: 1,
							type: 'solid',
							opacity: '0.1',
						}
					},
				},
				// color: ['#73c0de',],
				series: [
					{
						// name: '冷水',
						type: 'bar',
						// barWidth: 10,
                        color: {
                            type: 'linear',
                            x: 0,  //右
                            y: 0,  //下
                            x2: 0,  //左
                            y2: 1,  //上
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#2d6dff' // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#94abdf' // 100% 处的颜色
                                }
                            ]
                        },
						data: ydata
					},
				]
			}
			pieChart.setOption(lineOption);
			window.addEventListener('resize', function() {
				pieChart.resize()
			})
		},
	}
}
</script>

<style lang="scss" scoped></style>