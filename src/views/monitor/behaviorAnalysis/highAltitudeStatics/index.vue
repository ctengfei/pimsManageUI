<template>
    <div class="app-container">
      <div class="boxs">
        <div class="topData">
          <div class="bgc" v-for="(item,index) in topTabList" :key="index">
            <div class="leftText">
              <span class="bottomText">{{item.name}}:{{item.num}}</span>
            </div>
          </div>
        </div>
        <el-row  class="boxBottom">
          <el-card>
            <div slot="header">
              <span>本月抛物趋势</span>
            </div>
            <el-col :span="24">
              <div style="width: 100%; height: 300px">
                  <ve-line
                  :settings="chartSettings"
                  :data="personOut"
                  :extend="chartExtend"
                  height="100%"
                  :grid="grids"
                  >
                  </ve-line>
              </div>
            </el-col>
          </el-card>
          <el-card style="margin-top:10px">
            <div slot="header">
              <span>抛物时间段统计</span>
            </div>
            <el-col :span="24">
                <div style="width: 100%; height: 300px">
                    <ve-line
                    :settings="chartSettings"
                    :data="hourCounts"
                    :extend="chartExtends"
                    height="100%"
                    :grid="grids"
                    >
                    </ve-line>
                </div>
            </el-col>
          </el-card>
        </el-row>
      </div>
    </div>
  </template>
  
  <script>
  import pagination from "@/components/comPagination";
  import { getList, getHighAltitudeStatics, getEveryDayCountsByMonth, getDeviceStatistics, getEveryHourCountsByMonth } from "@/api/monitor/behaviorAnalysis"
    import { formatData, downloadFile } from '@/utils/index'

  export default {
    name: '',
    components:{
        pagination
    },
    data() {
      return {
        grids: {
          top: 40,
          bottom: 20
        },
        showSearch:true,
        // chartSettings: {
        //     area: true,//是否显示为面积图
        // },
        chartSettings: {
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
                data: "数据",
                time: "时间"
            }
        },
        chartExtends:{
          legend: {
            show: false,
          },
          xAxis: {
            show: true,
            // 坐标轴轴线
            axisLine: {
              show: true
            },
            // 坐标轴每项的文字
            axisLabel: {
              showMaxLabel: true,
              showMinLabel: true,
              color: "#000",
              rotate: 0, //刻度文字旋转，防止文字过多不显示
              margin: 8, //文字离x轴的距离
              boundaryGap: true,
              interval: 0,
              // backgroundColor:'#0f0',
            },
          },
          yAxis:{
            show: true,
            offset: 0,
            min: 'dataMin' ? 'dataMin' : 10, //取最小值为最小刻度
            max: 'dataMax' ? 'dataMax' : 100, //取最大值为最大刻度
            minInterval: 5, //分割刻度
            scale: true, //自适应
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
          grid: {
            right: 30,
          },
          xAxis: {
            show: true,
            // 坐标轴轴线
            axisLine: {
              show: true
            },
            // 坐标轴每项的文字
            axisLabel: {
              showMaxLabel: true,
              showMinLabel: true,
              color: "#000",
              rotate: -45, //刻度文字旋转，防止文字过多不显示
              margin: 8, //文字离x轴的距离
              boundaryGap: true,
              interval: 0,
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
            splitNumber: 5,
            min: 'dataMin' ? 'dataMin' : 10, //取最小值为最小刻度
            max: 'dataMax' ? 'dataMax' : 100, //取最大值为最大刻度
            minInterval: 5, //分割刻度
            scale: true, //自适应
            // min: function(value) {//取最小值向下取整为最小刻度
            //     return Math.floor(value.min)
            // },
            // max: function(value) {//取最大值向上取整为最大刻度
            //     return  Math.ceil(value.max) 
            // },
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
              show: false
            },
            boundaryGap: false,
            axisLabel: {
              color: "#000"
            }
          },
          // dataZoom: [{
          //       type: 'slider',
          //       show: true, //flase直接隐藏图形
          //       xAxisIndex: [0],
          //       left: '2%', //滚动条靠左侧的百分比
          //       bottom: -5,
          //       start: 0,//滚动条的起始位置
          //       end: 30 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
          //   }],
        },
        personOut:{},
        multipleSelection:[],
        value1:"",
        tableData:[],
        formSearch: {
            channelEnum:"",
            queryDate:"",
            pageNum: 1,
            pageSize: 10,
        },
        total: 0,
        channelCodeArr:[],
        hourCounts:{},
        topTabList:[]
      };
    },
    watch: {},
    created() {},
    mounted() {
      this.getDeviceCount();
      this.getHighAltitudeCount();
        setTimeout(() => {
            this.infoData();
            this.getEveryHour()
        }, 300);
        window.addEventListener("resize", this.resizeTheChart);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resizeTheChart());
    },
    methods: {
        // 获取当月所有日期
        currentMonthDays(){
            // 获取标准时间
            let date = new Date();
            // 获取当前月份（实际月份需要加1）
            let currentMonth = (date.getMonth() + 1);
            //当小于10->01,02,03...
            currentMonth = `${currentMonth}`.padStart(2, "0");
            // 获取当前年份
            let currentYear = date.getFullYear();
            // 获取当前月有多少天
            let currentMonthDays = new Date(currentYear, currentMonth, 0).getDate();
            // 当前月份所有日期集合
            let currentMonthArr = [];
            for (let day = 1; day <= currentMonthDays; day++) {
                // 年月日(yyyy-MM-dd)
                let dateItem = currentYear + "-" + currentMonth + "-" + `${day}`.padStart(2, "0");
                currentMonthArr.push(dateItem);
            }
            return currentMonthArr;
        },
        // 获取高空抛物告警数
        getHighAltitudeCount(){
            getHighAltitudeStatics().then(res=>{
              // this.highStatic = []
              this.topTabList = [
                {
                  name:"今日抛物",
                  num:res.data.currentDayNum + '次'
                },
                {
                  name:"当月抛物",
                  num:res.data.currentMonthNum + '次'
                },
              ]
            })
        },
        // 获取当月每天的告警数
        getEveryHour(){
            getEveryHourCountsByMonth().then(res=>{
                let row = [];
                for(let j in res.data){
                    row.push({
                        time: res.data[j].hour,
                        data: res.data[j].num,
                    });
                }
                for (let i = 0; i < 24; i++) {
                    const hourStr = `${i}`.padStart(2, "0") + ":00";
                    if (!row.some((record) => record.time === hourStr)) {
                    row.push({ time: hourStr, data: 0 });
                    }
                }
                row.sort((a, b) => a.time.localeCompare(b.time));
                let data = {
                    columns: ["time", "data"],
                    rows: row
                }
                this.hourCounts = data;
            })
        },
        // 获取高空抛物设备统计
        getDeviceCount(){
            getDeviceStatistics().then(res=>{
                this.deviceSta = [
                  {
                    name:"高空抛物摄像头",
                    num:res.data[0].value + '台'
                  },
                  {
                    name:"在线",
                    num:res.data[1].value + '台'
                  },
                  {
                    name:"离线",
                    num:res.data[2].value + '台'
                  }
                ]
                this.topTabList = [...this.deviceSta,...this.topTabList]
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
      // 获取人员进出趋势
      infoData(){
        getEveryDayCountsByMonth().then(res=>{
          let row = [];
          for(let j in res.data){
            row.push({
                time: res.data[j].day,
                data: res.data[j].num,
            });
            
          }
          let arrLength = this.currentMonthDays()
          for (let i = 0; i < arrLength.length; i++) {
            const hourStr = `${i}`.padStart(2, "0") + ":00";
            if (!row.some((record) => record.time === arrLength[i])) {
              row.push({ time: arrLength[i], data: 0 });
            }
          }
          row.sort((a, b) => a.time.localeCompare(b.time));
          let data = {
            columns: ["time", "data"],
            rows: row
          }
          this.personOut = data;
        })
      },
      // table多选
        handleSelectionChange(val) {
        let tableIds = val.map(item=>item.id)
        this.multipleSelection = tableIds;
        },
      // 切换到第几页了
        handleCurrentChange() {
        // this.formSearch.pageNum = n.page
        this.infoData();
        },
      resizeTheChart() {
        if (this.$refs.linechart) {
          this.$refs.linechart.resize();
        }
        if (this.$refs.histogramchart) {
          this.$refs.histogramchart.resize();
        }
      },
      // 根据车主搜索
        onSearch() {
            this.formSearch.startTime = this.dataValue[0]
            this.formSearch.endTime = this.dataValue[1]
            this.formSearch.pageNum = 1
            this.infoData();
        },
      // 重置
        onReset(){
            this.dataValue = []
            this.$refs['formSearch'].resetFields()
            this.formSearch.pageNum = 1
            this.onSearch()
        },
      // 人员进出趋势 选择日期
      selectDate(e){
        this.formSearch.queryDate = e
        this.infoData();
      },
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .topData{
    display: flex;
    align-content: center;
    align-items: center;
    height: inherit;
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
   }
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
  }
  .boxBottom{
    width: 100%;
  }
  .focus {
    color: #206aff;
  }
  </style>
  