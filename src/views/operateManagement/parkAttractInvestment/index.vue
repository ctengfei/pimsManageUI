<template>
    <div class="app-container">
      <div class="boxs">
        <div class="boxTop">
            <div class="topData">
                <div class="bgc" v-for="(item, value) in spanList" :key="value">
                    <div class="leftText">
                    <span class="bottomText">{{ value }}{{ item }}</span>
                    </div>
                </div>
            </div>
        </div>
          <el-row  class="boxBottom">
            <el-col :span="12">
              <div style="width: 100%; height: 360px">
                <div class="dateButton">
                  招商线索来源
                </div>
                <div style="height: 90%">
                    <ve-ring
                    :data="courtshipChartData"
                    :settings="piechartSettings"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="width: 100%; height: 360px">
                <div class="dateButton">
                  最近一年企业入住趋势
                </div>
                <div style="height: 80%">
                    <ve-line
                        :settings="lineChartSettings"
                        :data="lineChartDatas"
                        :extend="chartExtend"
                        height="100%"
                        :grid="grid"
                    />
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="width: 100%; height: 360px">
                <div class="dateButton">
                  办公空间租赁情况
                </div>
                <div style="height: 90%">
                  <ve-ring
                    :data="chartcarDatas"
                    :settings="piechartSettings"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="width: 100%; height: 360px">
                <div class="dateButton">
                  最近一年租金收入情况
                </div>
                <div style="height: 80%">
                    <ve-line
                        :settings="lineChartSettings"
                        :data="rentChartData"
                        :extend="chartExtend"
                        height="100%"
                        :grid="grid"
                    />
                </div>
              </div>
            </el-col>
          </el-row>
      </div>
    </div>
  </template>
  
  <script>
  import * as $peopleStatistic from "@/api/peopleManage/peopleStatistics"
  import { countsBySource, enterpriseSettled, rentalIncome, countsByRent } from "@/api/operateManagement"
  export default {
    name: 'PersonAndVehicleStatistics',
    data() {
      return {
        test: "100%",
        // 距离周围的距离
        grids: {
          top: 0,
          bottom: 20
        },
        grid: {
          top: 40,
          bottom: 0
        },
        piechartExtend: {
          series: {
            center: ["25%", "50%"]
          },
          legend: {
            pageTextStyle: {
              color: "#000" //翻页数字颜色
            },
            pageIconColor:'#206aff',
            pageIconInactiveColor:'#202230',
            // type: "scroll",
            textStyle: {
              color: "#000" //图例字体颜色
            },
            width: '30%',
            left: '50%',            //设置位置
            top: '20%',
          }
        },
        piechartSettings: {
          radius: ["0%", "80%"]
        },
        lineChartSettings:{
            area: true,//是否显示为面积图
            itemStyle:{ //面积图颜色设置
                color:{
                    type:'linear',
                    colorStops:[
                        {
                            offset: 0,
                            color: 'rgba(80, 135, 236, 1)', // 0% 处的颜色
                        }, 
                        {
                            offset: 1, 
                            color: 'rgba(80, 135, 236, 1)' // 100% 处的颜色
                        },
                    ],
                    globalCoord: false // 缺省为 false
                }
                    
            },
            labelMap: {
              companyOrtype: "企业",
                value: "数量"
            }
        },
        chartExtend: {
          legend: {
            pageTextStyle: {
              color: "#000" //翻页数字颜色
            },
            pageIconColor:'#206aff',
            pageIconInactiveColor:'#202230',
            textStyle: {
              color: "#000"
            },
          },
          xAxis: {
            show: true,
            // 坐标轴轴线
            axisLine: {
              show: true
            },
            // 坐标轴刻度
            axisTick: {
              show: false
            },
            // 坐标轴每项的文字
            axisLabel: {
              showMaxLabel: true,
              showMinLabel: true,
              color: "#000",
              rotate: 0, //刻度文字旋转，防止文字过多不显示
              margin: 8, //文字离x轴的距离
              boundaryGap: true
              // backgroundColor:'#0f0',
            },
            // X轴下面的刻度小竖线
            axisTick: {
              show: false,
              alignWithLabel: true, //axisLabel.boundaryGap=true时有效
              interval: 0,
              length: 4 //长度
            },
            // x轴对应的竖线
            splitLine: {
              show: false,
              interval: 0,
              lineStyle: {
                color: "red",
                backgroundColor: "red"
              }
            }
          },
          yAxis: {
            show: true,
            offset: 0,
            splitNumber: 9,
            min: 'dataMin' ? 'dataMin' : 10, //取最小值为最小刻度
            max: 'dataMax' ? 'dataMax' : 100, //取最大值为最大刻度
            minInterval: 5, //分割刻度
            scale: true, //自适应
            // 坐标轴轴线
            axisLine: {
              show: false
            },
            // x轴对应的竖线
            splitLine: {
              show: true,
              lineStyle: {
                color: "#000",
                opacity: "0.1",
                backgroundColor: "#000"
              }
            },
            // 坐标轴刻度
            axisTick: {
              show: false,
              length: 4
            },
            boundaryGap: false,
            axisLabel: {
              color: "#000"
            }
          }
        },
        chartcarDatas: {},
        lineChartDatas: {},
        spanList: {},
        courtshipChartData: {},
        rentChartData: {},
      };
    },
    watch: {},
    created() {},
    mounted() {
      this.initFn();
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.resizeTheChart());
    },
    methods: {
      initFn(){
        this.countsByRent();
        this.getcountsBySource();
        this.enterpriseSettled();
        this.rentalIncome();
        window.addEventListener("resize", this.resizeTheChart);
      },
      // top统计
      countsByRent(){
        countsByRent().then(res=>{
          this.spanList = res.data.rentcount
          let data = {
              columns: ["companyOrtype", "value"],
              rows: res.data.rentType
            };
            this.chartcarDatas = data
        })
      },
      // 招商线索来源
      getcountsBySource(){
        countsBySource().then(res=>{
          if(res.data){
            let data = {
              columns: ["companyOrtype", "value"],
              rows: res.data
            };
            this.courtshipChartData = data
          }
        })
      },
      // 最近一年企业入住趋势
      enterpriseSettled(){
        enterpriseSettled().then(res=>{
          if(res.data){
            let data = {
              columns: ["companyOrtype", "value"],
              rows: res.data
            };
            this.lineChartDatas = data
          }
        })
      },
      // 最近一年租金收入情况
      rentalIncome(){
        rentalIncome().then(res=>{
          if(res.data){
            let data = {
              columns: ["companyOrtype", "value"],
              rows: res.data
            };
            this.rentChartData = data
          }
        })
      },
      // 获取日期
      getDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        return y + "-" + `${m}`.padStart(2, "0") + "-" + d;
      },
      get24HoursTime (){
        let timeArr = []
        for (let i = 0; i < 24; i++) {
          let hour = i < 10 ? `0${i}` : i
          timeArr.push(`${hour}:00`)
        }
        return timeArr
      },
      resizeTheChart() {
        if (this.$refs.linechart) {
          this.$refs.linechart.resize();
        }
        if (this.$refs.histogramchart) {
          this.$refs.histogramchart.resize();
        }
      },
    }
  };
  </script>
  
  <style lang="scss" scoped>

  ::v-deep svg path:first-child {
    stroke: #31364a;
  }
  .color {
    color: #206aff;
  }
  .dateButton{
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 30px;
    height: 30px;
    .btns{
      display: flex;
      width: 40%;
      span{
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
  .boxs{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .boxTop{
    height: 60px;
    display: flex;
    .leftCard{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    .textLeft{
        width: 20%;
       font-size: 16px;
       text-align: center;
    }
  }
  .boxBottom{
    width: 100%;
  }
  .topData{
    display: flex;
    height: 40px;
    width: 100%;
  }
  .bgc{
    flex:1;
    display: flex;
    //background-color: #202230;
    box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);

    height: inherit;
    border-radius: 8px;
    cursor: pointer;
    margin:10px 5px;
    align-items: center;
    justify-content: space-around;
    padding:10px 0;
    &:first-child{
        margin-left:0;
    }
    &:last-child{
        margin-right:0;
    }
}
  </style>
  