<template>
    <div class="app-container">
      <div class="boxs">
        <div class="boxTop">
            <div class="topData" style="width: 60%;height: 100%;">
                <div class="bgc" v-for="(item,value) in queryCount" :key="value">
                    <div class="leftText">
                        <span class="topText">{{item}}</span>
                        <span class="bottomText">{{value}}</span>
                    </div>
                </div>
            </div>
            <div class="leftCard" style="width: 40%;height: 100%;display: flex;">
                <div class="textLeft">
                    专利软著成果
                </div>
                <div class="topData" style="width: 80%;height: 100%;">
                    <div class="bgc" v-for="(item,value) in softnesObj" :key="value">
                        <div class="leftText">
                            <span class="topText">{{item}}</span>
                            <span class="bottomText">{{value}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
          <el-row  class="boxBottom">
            <el-col :span="12">
              <div style="width: 100%; height: 300px">
                <div class="dateButton">
                  企业按产业类型分布
                </div>
                <div style="height: 90%">
                  <ve-ring
                    :data="industryChartData"
                    :settings="piechartSettings"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="width: 100%; height: 300px">
                <div class="dateButton">
                  企业专利类型分布
                </div>
                <div style="height: 90%">
                  <ve-ring
                    :data="patentChartData"
                    :settings="piechartSettings"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="width: 100%; height: 300px">
                <div class="dateButton">
                  上年度产业营收分布
                </div>
                <div style="height: 90%">
                  <ve-ring
                    :data="moneyChartData"
                    :settings="piechartSettings"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
                <div class="dateButton">
                  上年度企业营收入排行
                </div>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    >
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="company" label="企业名称"></el-table-column>
                    <el-table-column prop="income" label="主营收入"></el-table-column>
                </el-table>
            </el-col>
          </el-row>
      </div>
    </div>
  </template>
  
  <script>
  import * as $peopleStatistic from "@/api/peopleManage/peopleStatistics"
  import { querycount, queryPatentscount, countByType, countPatentsByType, incomeByType, incomeOrder } from "@/api/operateManagement"
  import comCard from "@/components/comCard";
  export default {
    name: 'PersonAndVehicleStatistics',
    components: {
      comCard
    },
    data() {
      return {
        test: "100%",
        // 距离周围的距离
        grids: {
          top: 0,
          bottom: 20
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
            width: '20%',
            left: '50%',            //设置位置
            top: '20%',
          }
        },
        piechartSettings: {
          radius: ["0%", "80%"],
          labelMap: {
            companyOrtype: "企业",
            value: "数量"
          },
        },
        industryChartData: {},
        patentChartData: {},
        moneyChartData: {},
        softnesObj: {},
        queryCount: {},
        enterpriseType: {},
        tableData: []
      };
    },
    watch: {},
    created() {},
    mounted() {
      this.initFn()
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.resizeTheChart());
    },
    methods: {
      // 方法初始化
      initFn(){
        this.getQuerycount();
        this.queryPatentscount();
        this.countByType();
        this.countPatentsByType();
        this.incomeByType();
        this.incomeOrder();
        window.addEventListener("resize", this.resizeTheChart);
      },
      // 企业统计
      getQuerycount(){
        querycount().then(res=>{
          this.queryCount = res.data
        })
      },
      // 软著统计
      queryPatentscount(){
        queryPatentscount().then(res=>{
          this.softnesObj = res.data
        })
      },
      // 企业按产业类型分布
      countByType(){
        countByType().then(res=>{
          let data = {
            columns: ["companyOrtype", "value"],
            rows: res.data
          };
          this.industryChartData = data
        })
      },
      // 企业专利类型分布
      countPatentsByType(){
        countPatentsByType().then(res=>{
          if(res.data){
            let data = {
              columns: ["companyOrtype", "value"],
              rows: res.data
            };
            this.patentChartData = data
          }
        })
      },
      // 年收入统计
      incomeByType(){
        incomeByType().then(res=>{
          if(res.data){
            let data = {
              columns: ["companyOrtype", "value"],
              rows: res.data
            };
            this.moneyChartData = data
          }
        })
      },
      // 企业年收入排名
      incomeOrder(){
        incomeOrder().then(res=>{
          this.tableData = res.data
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
    height: 100px;
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
  .topData {
   display: flex;
   align-content: center;
   align-items: center;
   height: inherit;
  //  padding: 10px 10px;
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
       margin:0 10px;
     }
     .topText {
       font-family: Microsoft YaHei;
       font-size: 25px;
       font-weight: 600;
       font-stretch: normal;
       letter-spacing: 0px;
       color: #333333;
     }
     .bottomText {
       height: 19px;
       font-family: Microsoft YaHei;
       font-size: 14px;
       font-weight: normal;
       font-stretch: normal;
       line-height: 19px;
       letter-spacing: 0px;
       width: 85px;
      //  color: #ffffff;
     }
   }
 }
  </style>
  