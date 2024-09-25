<template>
  <div class="app-container">
    <div class="infos">
      <div class="topData">
        <div class="bgc">
          <div class="leftText">
              <span class="topText">{{topFiveData.waterUsageThisMonth}}</span>
              <span class="bottomText">本月累计用水量(单位:吨)</span>
              <span class="bottomText1">截止昨日24时</span>
          </div>
          <div class="imgs">
            <img  src="@/assets/images/shuidi2.png" alt="item.type" />
            <!-- <svg-icon width="150" height="150" icon-class='icon_yongshuiliang'  /> -->
          </div>
        </div>
        <div class="bgc">
          <div class="leftText">
              <span class="topText">{{topFiveData.electricityUsageThisMonth}}</span>
              <span class="bottomText">本月累计用电量(单位:度)</span>
              <span class="bottomText1">截止昨日24时</span>
          </div>
          <div class="imgs">
            <img src="@/assets/images/dianbiao.png" alt="item.type" />
          </div>
        </div>
        <div class="bgc">
          <div class="leftText">
              <span class="topText">{{topFiveData.carbonBioxideEmissions}}</span>
              <span class="bottomText">本月二氧化碳排放量(单位:kg)</span>
              <span class="bottomText1">截止昨日24时</span>
          </div>
          <div class="imgs">
            <img src="@/assets/images/tan-pai-fang.png" alt="item.type" />
          </div>
        </div>
        <div class="bgc">
          <div class="leftText">
              <span class="topText">{{topFiveData.saveWaterUsage}}</span>
              <span class="bottomText">本月节水量(单位:吨)</span>
              <span class="bottomText1">截止昨日24时</span>
          </div>
          <div class="imgs">
            <img src="@/assets/images/jieshui.png" alt="item.type" />
          </div>
        </div>
        <div class="bgc">
          <div class="leftText">
              <span class="topText">{{topFiveData.saveElectricityUsage}}</span>
              <span class="bottomText">本月节电量(单位:度)</span>
              <span class="bottomText1">截止昨日24时</span>
          </div>
          <div class="imgs">
            <img src="@/assets/images/dian.png" alt="item.type" />
          </div>
        </div>
        <div class="bgc">
          <div class="leftText">
              <span class="topText">{{topFiveData.saveCarbonBioxideEmissions}}</span>
              <span class="bottomText">本月二氧化碳减排量(单位:kg)</span>
              <span class="bottomText1">截止昨日24时</span>
          </div>
          <div class="imgs">
            <img src="@/assets/images/tan-jian-pai.png" alt="item.type" />
          </div>
        </div>
      </div>
      <div class="middleData">
        <el-row :gutter="10">
          <el-col :span="6">
            <div class="middleLeft1">
              <div class="titles dateButtonShuiGroup">
                <div>
                  <!-- 车辆态势 -->
                  当月用水量排行榜
                </div>
                <div style="z-index:99">
                  <span
                    v-for="(item, index) in floorComponytTypes"
                    :key="index"
                    :value="item.type"
                    @click="choosetypeShui(item.type)"
                    class="dateButtonShui"
                    :class="[item.type === componyFloorTypeShui ? 'focus' : '']"
                    >{{ item.name }}</span
                  >
                </div>
              </div>
              <div style="height:calc(100% - 65px);">
                <el-table :data="tableDataShui" style="overflow:hidden">
                  <el-table-column label="序号" type="index" ></el-table-column>
                  <el-table-column label="名称" prop="typeName" show-overflow-tooltip ></el-table-column>
                  <el-table-column label="用量(吨)" prop="sumValue" show-overflow-tooltip ></el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="middleLeft">
              <el-col :span="24">
                <div class="middleCenter_content">
                  <div class="dateButtonGroup">
                    <el-button plain v-for="(item,index) in filterSelectTypes" :key="index" :value="item.type"
                               @click="chooseDate($event)" class="dateButton"
                               :class="[item.type === filterSelectType ? 'focus' : '']">
                      {{item.name}}
                    </el-button>
                  </div>
                  <div id="line"></div>
                </div>
              </el-col>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="middleLeft1">
              <div class="titles dateButtonShuiGroup">
                <div>
                  <!-- 车辆态势 -->
                  当月用电量排行榜
                </div>
                <div style="z-index:99">
                  <span
                    v-for="(item, index) in floorComponytTypes"
                    :key="index"
                    :value="item.type"
                    @click="choosetypeDian(item.type)"
                    class="dateButtonShui"
                    :class="[item.type === componyFloorTypeDian ? 'focus' : '']"
                    >{{ item.name }}</span
                  >
                </div>
              </div>
              <div style="height:calc(100% - 65px);">
                <el-table :data="tableDataDian" style="overflow:hidden">
                  <el-table-column type="index" ></el-table-column>
                  <el-table-column label="名称" prop="typeName" show-overflow-tooltip ></el-table-column>
                  <el-table-column label="用量(度)" prop="sumValue" show-overflow-tooltip ></el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bottomData">
        <el-row :gutter="10">
          <el-col :span="6">
            <div style="height:calc(100% - 65px);">
              <div class="imgs">
                <img src="@/assets/images/shuibiao.png" alt="item.type" style="margin-left:35%"/>
                <img src="@/assets/images/dianbiao1.png" alt="item.type" style="margin-left:10%"/>
              </div>
              <div class="bottomDataText1">
                <span style="margin-left:11.5%">终端数量</span>
                <span style="margin-left:11%">{{numRateData.hydropowerWaterNumber}}</span>
                <span style="margin-left:19%">{{numRateData.hydropowerEleNumber}}</span>
              </div>
              <div class="bottomDataText1">
                <span style="margin-left:15%">抄表率</span>
                <span style="margin-left:11%">{{numRateData.hydropowerWaterpoint}}</span>
                <span style="margin-left:15%">{{numRateData.hydropowerElepoint}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <p>告警列表</p>
            <div style="height:calc(100% - 65px);">
              <el-table :data="tableData1" height="20vh" style="overflow:hidden">
                <el-table-column type="index" ></el-table-column>
                <el-table-column label="级别"  prop="level" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.level == 'normal'" style="color:#18dca7;">普通</span>
                    <span v-else-if="scope.row.level == 'emergency'" style="color:#f05656;">严重</span>
                    <span v-else style="color:#f05656;">非常严重</span>
                  </template>
                </el-table-column>
                <el-table-column label="区域" prop="location" show-overflow-tooltip ></el-table-column>
                <el-table-column label="告警类型" prop="eventName" show-overflow-tooltip >
                  <template slot-scope="scope">
                    <span v-if="scope.row.eventName == 'wmConnBroken'" style="color:#18dca7;">水表通讯中断</span>
                    <span v-else-if="scope.row.eventName == 'emConnBroken'" style="color:#f05656;">电表通讯中断</span>
                    <span v-else-if="scope.row.eventName == 'wmAbnormal'" style="color:#18dca7;">水表数据异常</span>
                    <span v-else style="color:#f05656;">电表数据异常</span>
                  </template>
                </el-table-column>
                <el-table-column label="时间" prop="triggerTime" show-overflow-tooltip ></el-table-column>
              </el-table>
              <pagination
                v-show="tableData1 && tableData1.length > 0"
                @pagination="handleCurrentChange"
                :page.sync="tableForm.pageNum"
                :pageSizes="[5, 10, 20]"
                :limit.sync="tableForm.pageSize"
                :total="total"
              />
            </div>
          </el-col>
        </el-row>

      </div>
    </div>

  </div>
</template>

<script>
  import pagination from '@/components/comPagination'
  import {initSpanData, initTabData1,initLineData, initFillData} from '@/api/smartProperty/workbench'
  import {initPieData,initTabData,initNumRateData,initTopFiveData,initTabDataShui,initTabDataFloorShui,initTabDataDian,initTabDataFloorDian,initLineDataNew} from '@/api/smartEnergyAdmin/energyShow'
  import comCard from "@/components/comCard"

  export default {
    name: 'Energyshow',
    components: {
      pagination,
      comCard
    },
    data() {
      return {
        tableForm: {
          pageNum:1, 
          pageSize:10,
        },
        componyFloorTypeShui: "floor",
        componyFloorTypeDian: "floor",
        numRateData: {
          hydropowerWaterNumber:"",
          hydropowerEleNumber:"",
          hydropowerWaterpoint:"",
          hydropowerElepoint:"",
        },
        topFiveData: {
          waterUsageThisMonth:"",
          electricityUsageThisMonth:"",
          carbonBioxideEmissions:"",
          saveWaterUsage:"",
          saveElectricityUsage:"",
          saveCarbonBioxideEmissions:"",
        },
        spanList: [],
        tableData: [],
        tableData1: [],
        tableDataShui: [],
        tableDataDian: [],
        filterSelectType: "Water",
        floorComponytTypes: [
          {
            type: "floor",
            name: "楼宇",
          },
          {
            type: "compony",
            name: "公司",
          },
        ],
        filterSelectTypes: [
          {
            type: 'Water',
            name: '水(吨)'
          },
          {
            type: "Electricity",
            name: '电(度)'
          },
        ],
        total: 10,
        pageNum: 1,
        pageSize: 10,
        defaultLineChart: null,
        defaultPieChart: null,
        liquidFillGroup: [],
        weeks: [ {
                value:1,
                num:0,
                name:'星期一',
              },
              {
                value:2,
                num:0,
                name:'星期二',
              },
              {
                value:3,
                num:0,
                name:'星期三',
              },
              {
                value:4,
                num:0,
                name:'星期四',
              },
              {
                value:5,
                num:0,
                name:'星期五',
              },
              {
                value:6,
                num:0,
                name:'星期六',
              },
              {
                value:7,
                num:0,
                name:'星期日',
              }],
        months: [
        ],
        years: [
              {
                value:1,
                num:0,
                name:'一月',
              },
              {
                value:2,
                num:0,
                name:'二月',
              },
              {
                value:3,
                num:0,
                name:'三月',
              },
              {
                value:4,
                num:0,
                name:'四月',
              },
              {
                value:5,
                num:0,
                name:'五月',
              },
              {
                value:6,
                num:0,
                name:'六月',
              },
              {
                value:7,
                num:0,
                name:'七月',
              },
              {
                value:8,
                num:0,
                name:'八月',
              },
              {
                value:9,
                num:0,
                name:'九月',
              },
              {
                value:10,
                num:0,
                name:'十月',
              },
              {
                value:11,
                num:0,
                name:'十一月',
              },
              {
                value:12,
                num:0,
                name:'十二月',
              }
        ],
        fillTotal: 0,
        workOrder: "工单总数",
        worktotal: 0,
        labelpng: ['repair', 'rentwithdrawal', 'renewal']
      }
    },
    mounted() {
      this.getSpanData();
      this.getTabData1();
      this.getNumRateData();
      this.getTabDataFloorShui();
      this.getTabDataFloorDian();
      this.getLineData();
      this.init();
      this.chartInit();

    },
    methods: {      
      choosetypeShui(date) {
        if (date == "compony") {
          this.componyFloorTypeShui = date;
          this.getTabDataShui();
        } else {
          this.componyFloorTypeShui = date;
          this.getTabDataFloorShui();
        }
      },
      choosetypeDian(date) {
        if (date == "compony") {
          this.componyFloorTypeDian = date;
          this.getTabDataDian();
        } else {
          this.componyFloorTypeDian = date;
          this.getTabDataFloorDian();
        }
      },
      init() {
        //      this.$nextTick()将回调延迟到下次 DOM 更新循环之后执行,解决this.$Echarts初始化循环生成节点报错的问题
        this.$nextTick(function () {
          this.liquidFillGroup.map((v, index) => {
            var fillChart = this.$Echarts.init(document.getElementById('fillChart' + index));
            fillChart.setOption(this.initFillChart(index));
            window.addEventListener("resize", () => {
              fillChart.resize();
            });
          })
        });
      },
      // 统计图初始化
      chartInit() {
        this.defaultLineChart = this.$Echarts.init(document.getElementById('line'));
        // this.defaultPieChart = this.$Echarts.init(document.getElementById('pie'));
      },
//      请求最上方六个标签数据
      getSpanData() {
        initTopFiveData().then( resp => {
          // 水本月当前用量
          this.topFiveData.waterUsageThisMonth = resp.data.waterUsageThisMonth;
          // 电本月当前用量
          this.topFiveData.electricityUsageThisMonth = resp.data.electricityUsageThisMonth;
          // 碳排放量
          this.topFiveData.carbonBioxideEmissions = resp.data.carbonBioxideEmissions;
          // 节水
          this.topFiveData.saveWaterUsage = resp.data.saveWaterUsage;
          // 节电
          this.topFiveData.saveElectricityUsage = resp.data.saveElectricityUsage;
          // 二氧化碳减排量
          this.topFiveData.saveCarbonBioxideEmissions = resp.data.saveCarbonBioxideEmissions;
        });
      },
      // 告警列表
      getTabData1() {
        let data = this.tableForm;
        initTabData(data).then( resp => {
          this.tableData1 = resp.data.data;
          this.total = resp.data.total;
        });
      },
      //终端数量和成功率
      getNumRateData() {
        initNumRateData().then( resp => {
          this.numRateData.hydropowerWaterNumber = resp.data.hydropowerWaterNumber;
          this.numRateData.hydropowerEleNumber = resp.data.hydropowerEleNumber;
          this.numRateData.hydropowerWaterpoint = resp.data.hydropowerWaterpoint;
          this.numRateData.hydropowerElepoint = resp.data.hydropowerElepoint;
        });
      },
      // 水公司排行榜
      getTabDataShui() {
        initTabDataShui().then( resp => {
          let data = resp.data;
          this.tableDataShui = data;
        });
      },
      // 水楼宇排行榜
      getTabDataFloorShui() {
        initTabDataFloorShui().then( resp => {
          let data = resp.data;
          this.tableDataShui = data;
        });
      },
      // 电公司排行榜
      getTabDataDian() {
        initTabDataDian().then( resp => {
          let data = resp.data;
          this.tableDataDian = data;
        });
      },
      // 电楼宇排行榜
      getTabDataFloorDian() {
        initTabDataFloorDian().then( resp => {
          let data = resp.data;
          this.tableDataDian = data;
        });
      },
//      请求饼图数据
      getPieData() {
        initPieData().then( resp => {
          let data = resp.data;
          this.initPieChart(this.defaultPieChart, data);
        });
      },
      getLineData() {
        let data = this.filterSelectType;
        initLineDataNew(data).then((res) => {
          let results = res.data;
          let xAxis = [];
          let yAxis = [];
          if (this.filterSelectType === "Water") {
            results.forEach(item=>{
              yAxis.push(item.sumUsage);    
            });
            results.forEach(item=>{
              xAxis.push(item.payMouth);    
            });
          } else {
            results.forEach(item=>{
              yAxis.push(item.sumUsage);    
            });
            results.forEach(item=>{
              xAxis.push(item.payMouth);    
            });
          }
          this.initLineChart(this.defaultLineChart, xAxis, yAxis);
        });  
      },
//      请求水球图数据
      getFillData() {
        let data = this.filterSelectType;
      initLineDataNew(data).then((res) => {
        let data = [];
        res.data.statusResult.forEach(item=>{
          if(item.name =='全部工单'){
            data.push(item)
          }
        })
        let results = res.data.statusResult.filter(item=>{
          if(item.name !='全部工单'){
            return item;
          }
        })
        data.push(...results)
        this.liquidFillGroup = data; 
        this.init();
      })
      },
      initPieChart(eleDom, data) {
        let pieOption = {
          title: {
            text: '工单数量统计',
            left: 'left',
            textStyle: {
              color: '#606266',
              fontFamily: 'Microsoft YaHei',
              fontSize: 18,
              fontWeight: 'lighter',
            }
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'horizontal',
            left: 'left',
            top: '15%',
            textStyle: {
              color: '#606266',
              fontFamily: 'Microsoft YaHei',
              fontSize: 14,
              fontWeight: 'normal',
            }
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              center: ['50%', '60%'],
              data: data,
            }
          ],
          color: ["#efb01d", "#00dae2", "#00e984"]
        };
        eleDom && eleDom.setOption(pieOption);
        window.addEventListener("resize", () => {
          eleDom.resize();
        });
      },
      initLineChart(eleDom, xAxis, yAxis) {
        let lineOption = {
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: xAxis,
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
            axisLabel: {
              textStyle: {
                color: '#606266', //坐标值得具体的颜色
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
                type: 'solid',
                opacity: '0.1',
                color: '#606266',//左边线的颜色
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
            axisLabel: {
              textStyle: {
                opacity: '0.1',
                color: '#606266',//坐标值得具体的颜色
              }
            }
          },
          grid: {
            left: 60,
            top: 60,
            right: 10,
            bottom: 20
          },
          asixPointer: {
            z: -10,
          },
          title: {
            text: '当日能耗监测',
            left: '10px',
            top: '10px',
            textStyle: {
              color: '#606266',
              fontFamily: 'Microsoft YaHei',
              fontSize: 18,
              fontWeight: 'normal',
            }
          },
          tooltip: {
            trigger: 'item'
          },
          series: [{
            data: yAxis,
            type: 'line',
            itemStyle: {
              color: '#206aff',
            },
            areaStyle: {
              color: '#206aff',
              opacity: 0.3
            }
          }]
        };
        eleDom && eleDom.setOption(lineOption);
        window.addEventListener("resize", () => {
          eleDom.resize();
        });
      },
      initFillChart(index) {
        return {
          title: {
            text: `${this.liquidFillGroup[index].value}/${this.liquidFillGroup[0].value}`,
            textStyle: {
              color: '#606266',
              fontSize: 10,
              align: 'center',
              fontWeight: '400',
              baseline: 'middle',
              verticalAlign: 'middle',
            },
            left: "center",
            top: "45%"
          },
          series: [{
//        类型为水球图
            type: 'liquidFill',
            backgroundStyle: {
              color: "#40445a"
            },
//        指定水波比例，可传四个参数
            data: [
              {
                value: this.liquidFillGroup[index].num / this.liquidFillGroup[0].num,
                direction: "left",
                itemStyle: {
                  normal: {
                    color: '#8fa1ff'
                  }
                }
              },
              {
                value: this.liquidFillGroup[index].num / this.liquidFillGroup[0].num,
                direction: "right",
                itemStyle: {
                  normal: {
                    color: '#4b69ff'
                  }
                }
              }
            ],
//          中间文字样式
            label: {
              normal: {
//          水球内容formatter
                formatter: this.liquidFillGroup[index].name,
                textStyle: {
                  fontSize: 14,
                  fontFamily: 'Microsoft YaHei',
                  fontWeight: 'normal',
                  color: '#606266'
                },
                position: ['50%', '130%'],
              }
            },
            outline: {
//          是否显示轮廓 布尔值
              show: false,
            }
          }]
        }
      },
//      折线图选择x轴选项
      chooseDate(date) {
        this.filterSelectType = date.currentTarget.value;
        this.getLineData();
      },
      handleCurrentChange() {
        this.getTabData1();
      },
      routerClick(data) {
        if (data === "repair")
          this.$router.push({path: '/infomation'})
        if (data === "unpaid")
          this.$router.push({name: 'payment', params: {id: 1}})
        if (data === "pay")
          this.$router.push({name: 'payment', params: {id: 2}})
        if (data === "settled")
          this.$router.push({path: '/notice'})
        if (data === "renewal")
          this.$router.push({path: '/renewal'})
        if (data === "rentwithdrawal")
          this.$router.push({path: '/rentrelease'})
      },
    }
  }
</script>

<style lang="scss" scoped>
  .infos {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    img {
      width: 80px;
      height: auto
    }

  }

  p {
    margin: 0;
    padding: 0;
  }

  .topData {
    display: flex;
    align-content: center;
    align-items: center;
    .bgc {
      height: 15vh;
      border-radius: 8px;
      cursor: pointer;
      flex:1;
      display: flex;
      margin:0 5px;
      align-items: center;
      justify-content: space-around;
      box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
      &:first-child{
          margin-left:0;
      }
      &:last-child{
          margin-right:0;
      }
    }

    .leftText {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: inherit;
      span {
        margin: 10px;
      }
      .topText {
        font-family: Microsoft YaHei;
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        letter-spacing: 0px;
      }
      .bottomText {
        height: 23px;
        font-family: Microsoft YaHei;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 19px;
        letter-spacing: 0px;
      }
      .bottomText1 {
        height: 8px;
        font-family: Microsoft YaHei;
        font-size: 8px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0px;
        letter-spacing: 0px;
      }
    }

    img {
      padding: 5px;
    }
  }

  .middleData {
    margin-top: 10px;
    .middleLeft1 {
      width: 100%;
      height: 35vh;
      box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
      border-radius: 8px;
      padding: 20px;
    }
    .middleLeft {
      box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
      border-radius: 8px;
      height: 35vh;
      .liquidFillGroups {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        .liquidFill {
          width: 50%;
          height: 150px;
        }
      }

      .middleCenter_content {
        border-radius: 8px;
        position: relative;
        .dateButtonGroup {
          position: absolute;
          top: 20px;
          right: 20px;
          .focus {
            color: #fff;
            background-color: #3957ff;
          }
        }
        #line {
          height: 35vh;
          padding: 10px;
        }
        .dateButton {
          border: none;
          color: #606266;
          border-radius: 2px;
          font-size: 12px;
        }
      }

    }
  }

  .bottomData {
    flex: 1;
    width: 100%;
    box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
    border-radius: 8px;
    padding: 20px;
    margin-top: 10px;
    margin-top: 10px;
    overflow:hidden;
    .bottomDataText1 {
      margin-top: 15px;
    }
    p {
      width: 80px;
      height: 26px;
      font-family: Microsoft YaHei;
      font-size: 1.2rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 26px;
      letter-spacing: 0px;
    }

    #pie {
      width: 100%;
      height: 350px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
      border-radius: 8px;
      padding: 20px;
    }
  }


  .titles {
    width: 100%;
    margin: 0 0 20px 0;
    text-align: left;
    display: flex;
    justify-content: space-between;
  }
  .dateButtonShuiGroup {
    color: #606266;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .focus {
      color: #3957ff;
    }
  }
  .dateButtonShui {
    margin: 0 5px;
    cursor: pointer;
    &:hover {
      color: #206aff;
    }
  }

  .tableheight {
    height:calc(100% - 65px);
  }
  ::-webkit-scrollbar {
    height: 0px !important;
  }
  ::v-deep .el-table--small .el-table__cell {
    padding: 0.2rem 0;
  }
</style>
