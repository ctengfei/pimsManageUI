<template>
	<div class="app-container" style="display: flex;">
		<regiontree @nodeclick="nodeclick" :type="'2'" :nodeType = " nodeType "></regiontree>
		<!-- 表格数据 -->
		<div style="height: 100%;width: 100%;">
			<div style="display: flex;"> 
				<el-radio-group v-model="radio2" size="medium" @input="inputradio">
					<el-radio-button label="waterMeter">水</el-radio-button>
					<el-radio-button label="ammeter">电</el-radio-button>
					<!-- <el-radio-button label="heat">热</el-radio-button> -->
				</el-radio-group>
				<el-form ref="formSearch" inline :model="monitorSite" style="margin-left: 30px;">
                    <!-- <el-form-item prop="area" label="时间维度">
                        <el-select v-model="monitorSite.area" clearable>
                            <el-option v-for="item in siteName" :key="item.name" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
					<el-form-item label="时间范围" prop="timeArr">
						<el-date-picker
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
			</div>
			<div style="margin-top: 20px;">
				<div :id="getID(1)" class="idecharts"></div>
			</div>
			<div style="display: flex;">
			<div style="margin-top: 30px;width:50%;" >
				<!-- echarts -->
				<div :id="getID(2)" class="idecharts"></div>
			</div>
			<div style="margin-top: 30px;width:50%;">
				<!-- echarts -->
				<div :id="getID(3)" class="idecharts"></div>
			</div>
		</div>
		</div>
	</div>
</template>

<script>
import Moment from 'moment'
import regiontree from "../../components/regiontree";  // 树结构组件
import $environMonitor from "@/api/environMonitor";
export default {
	components: {
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
				timeArr: [],
            },
			timeArr: [],
			siteName: [
                {
                    name: '每日',
                    value: 'daily'
                },
                {
                    name: '每周',
                    value: 'weekly'
                },
				{
                    name: '每月',
                    value: 'monthly'
                }
            ],
		}
	},
	created(){
		let today = new Date().toISOString().substring(0, 7).replace(/-/g, "/")
		let sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().substring(0, 7).replace(/-/g, "/")
		this.monitorSite.timeArr = [sixMonthAgo, today]
	},
	mounted() {
		this.initcolumnarChart("line" + 1)
        this.initcategoryChart("line" + 2)
        this.initcategoryChart("line" + 3)
		// this.getVisitorData()
	},
	methods: {
		// diagnosis
		// 获取图标数据
        getVisitorData() {
			let obj = {
				nodeId:this.monitorSite.nodeId,
				start: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[0])).format('yyyy-WW') : this.monitorSite.timeArr[0],
        		end: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[1])).format('yyyy-WW') : this.monitorSite.timeArr[1],
			}
            $environMonitor.diagnosis(obj,this.radio2).then((res) => {
				console.log(res,'崔')
				this.tableData = res.data
                let momxtemp = [], momytemp = [], thisPeriodytemp = [],yoyytemp = [],thisPeriodxtemp=[]
				// 本期
				res.data.thisPeriod.forEach(item => {
					if(item.subtype == 'waterMeter' || item.subtype == 'ammeter'){
						thisPeriodytemp.push(item.value)
						thisPeriodxtemp.push(item.dateOrMonthStr)
					}
				})
				// 环比
				res.data.mom.forEach(item => {
					if(item.subtype == 'waterMeter' || item.subtype == 'ammeter'){
						momxtemp.push(item.dateOrMonthStr)
						momytemp.push(item.value)
					}
				})
				// 同比
				res.data.yoy.forEach(item => {
					yoyytemp.push(item.value)
				})
				this.initcolumnarChart("line" + 1,momxtemp,momytemp,yoyytemp)
				this.initcategoryChart("line" + 2,res.data.thisPeriodAmount,res.data.yoyAmount)
        		this.initcategoryChart("line" + 3,res.data.thisPeriodAmount,res.data.momAmount)
            }).catch((err) => {
                this.$message.error(err.message);
            });
        },
		getID(index) {
			return "line" + index; 
		},
		inputradio(val){
			this.nodeType = val
			this.getVisitorData()
			this.$nextTick(() => {
				this.initcolumnarChart("line" + 1)
                this.initcategoryChart("line" + 2)
                this.initcategoryChart("line" + 3)
			})
			this.$nextTick(() => {
				window.dispatchEvent(new Event('resize'))
			})
		},
		nodeclick(data) {
			this.monitorSite.nodeId = data   //节点nodeid
            this.getVisitorData();
        },
		// 搜索数据来源
		onSearch(){
			 this.getVisitorData();
		},
		// 重置接口数据
		onReset(){
			 this.getVisitorData();
		},
		// 柱状图和折线图结合
		initcolumnarChart(id,momxtemp,momytemp,yoyytemp) {
			let pieChart = this.$Echarts.init(document.getElementById(id))
			let lineOption = {
				title: {
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
				legend: {},// legend: {},  图例
				grid: {
					left: '1%',
					right: '1%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: [0, 0.01],
					data: momxtemp,
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
				yAxis:[
                    {
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
                            // show:false,
                            lineStyle: {
                                color: ['#606266'],
                                width: 1,
                                type: 'solid',
                                opacity: '0.1',
                            }
                        },
                    },
                    {
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
                            // show:false,
                            lineStyle: {
                                color: ['#606266'],
                                width: 1,
                                type: 'solid',
                                opacity: '0.1',
                            }
                        },
                    },
                ],
				// color: ['#73c0de',],
				series: [
                    {
                        name: '同比',
                        type: 'line',
                        smooth: true,
						color: '#1ceb24',
                        data: yoyytemp //同比
                    },
                    {
                        name: '环比',
                        type: 'line',
                        smooth: true,
						color: '#e7e325',
                        data: momytemp //  环比
                    },
				]
			}
			pieChart.setOption(lineOption);
			window.addEventListener('resize', function() {
				pieChart.resize()
			})
		},
        // 右侧主状图
		initcategoryChart(id,thisPeriodAmount,yoyAmount) {
			let pieChart = this.$Echarts.init(document.getElementById(id))
			let lineOption = {
				title: {
					text:id=='line2'? '用能对比':'用能对比',
					subtext: '',
					left: 'left'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {},
				grid: {
					left: 60,
					top: 60,
					right: 20,
					bottom: 20,
				},
				xAxis: {
					boundaryGap: false,
					// data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
					type: 'category',
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
					data: ['总量',]
				},
				// color: ['#2d6dff',],
				series: [
					{
						name: '本期',
						type: 'bar',
						data: [thisPeriodAmount],
						color:'#2D6DFF',
					},
					{
						name: id=='line2'? '同比':'环比',
						type: 'bar',
						data: [yoyAmount],
						color:id=='line2'? '#1ceb24' : '#e7e325',
					}
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

<style lang="scss" scoped>
    .idecharts{
		height: 315px;
		width: 100%;
	}
</style>