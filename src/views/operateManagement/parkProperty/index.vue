<template>
    <div class="app-container">
      <div class="boxs">
          <el-row  class="boxBottom">
            <el-col :span="24">
              <div style="width: 100%; height: 400px">
                <div class="dateButton">
                  资产分类占比
                </div>
                <div style="height: 90%">
                    <ve-ring
                    ref="piechart"
                    :data="chartcarDatas"
                    :settings="piechartSettings"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div>
              </div>
            </el-col>
            
            <el-col :span="24">
              <div style="width: 100%; height: 400px">
                <div class="dateButton">
                  资产状态分析
                </div>
                <div style="height: 90%">
                  <ve-ring
                    ref="piechart"
                    :data="chartcarDatas1"
                    :settings="piechartSettings"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row  class="boxBottom">
            <el-col :span="24">
              <div style="width: 100%; height: 700px">
                <div class="dateButton">
                  监管资产使用排名
                </div>
                <div style="height: 90%">
                    <ve-bar
                      ref="barchart"
                      :settings="lineChartSettings"
                      :data="lineChartDatas"
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
  import { deviceStatus } from "@/api/operateManagement"
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
          top: 50,
          bottom: 50,
          containLabel: true
        },
        piechartExtend: {
          series: {
            center: ["30%", "50%"]
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
            left: '60%',            //设置位置
            top: '20%',
          }
        },
        piechartSettings: {
          radius: ["0%", "80%"],
          labelMap: {
            companyOrtype: "",
            value: "数量"
          },
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
              value: "数量",
              companyOrtype: "时间",
            }
        },
        chartExtend: {
          legend: {
            show: false,
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
            show: false,
            // 坐标轴轴线
            axisLine: {
              show: true
            },
            // 坐标轴刻度
            axisTick: {
              show: true
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
            offset: 10,
            splitNumber: 3,
            min: 'dataMin' ? 'dataMin' : 10, //取最小值为最小刻度
            max: 'dataMax' ? 'dataMax' : 10, //取最大值为最大刻度
            minInterval: 2, //分割刻度
            scale: true, //自适应
            // 坐标轴轴线
            axisLine: {
              show: true
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
          },
          series: {
            type:"bar",
            label: {
              show: true
            },
            barWidth: 30,
          },

        },
        chartcarDatas: {},
        chartcarDatas1: {},
        lineChartDatas: {},
        tableData: [],
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
      // 初始化
      initFn(){
        this.deviceStatus();
        window.addEventListener("resize", this.resizeTheChart);
      },
      // 园区资产统计
      deviceStatus(){
        deviceStatus().then(res=>{
          if(res.data){
            let data = {
              columns: ["companyOrtype", "value"],
              rows: res.data.ranking,
            };
            this.lineChartDatas = data
            // this.chartcarDatas = 
            let data1 = {
              columns: ["companyOrtype", "value"],
              rows: res.data.classification,
            };
            this.chartcarDatas = data1
            let data2 = {
              columns: ["companyOrtype", "value"],
              rows: res.data.usage,
            };
            this.chartcarDatas1 = data2

            // this.lineChartDatas 
          }
          
        })
      },
      resizeTheChart() {
        if (this.$refs.barchart) {
          this.$refs.barchart.resize();
        }
        if (this.$refs.piechart) {
          this.$refs.piechart.resize();
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
  