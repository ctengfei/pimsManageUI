<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-form ref="formSearch" inline :model="monitorSite">
      <el-form-item label="区域名称" prop="loopType">
        <el-select v-model="monitorSite.loopType" placeholder="请选择" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间维度" prop="dateType">
        <el-select v-model="monitorSite.dateType" placeholder="请选择" @change="dateTypeChange">
          <el-option
            v-for="item in dateTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围" prop="timeArr">
        <div style="display: flex;">
          <el-select v-model="monitorSite.year" style="width: 100px" placeholder="请选择年" >
            <el-option
              v-for="item in yearsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-select v-model="monitorSite.start" style="width: 150px;margin-left: 15px;" :placeholder="placeholderText" >
            <el-option
              v-for="item in tempList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div style="width: 20px; text-align: center;">
            -
          </div>
          <el-select v-model="monitorSite.end" style="width: 150px;" :placeholder="placeholderText">
            <el-option
              v-for="item in tempList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

        </div>
        
        <!-- <div class="flex" v-if="monitorSite.dateType === 'week'">
          <el-date-picker
            id="weekStart"
            v-model="monitorSite.timeArr[0]"
            type="week"
            format="yyyy第WW周"
            placeholder="开始周">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            id="weekEnd"
            v-model="monitorSite.timeArr[1]"
            type="week"
            format="yyyy第WW周"
            class="noIcon"
            placeholder="结束周">
          </el-date-picker>
        </div>
        <el-date-picker
          v-else-if="monitorSite.dateType === 'month'"
          v-model="monitorSite.timeArr"
          type="monthrange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始月份"
          end-placeholder="结束月份">
        </el-date-picker>
        <div class="flex" v-else>
          <week-picker v-model="monitorSite.timeArr[0]" :placeholder="'开始季度'" class="noPl"></week-picker>
          <span>至</span>
          <week-picker v-model="monitorSite.timeArr[1]" :placeholder="'结束季度'" :isShowIcon='false'></week-picker>
        </div> -->
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <div :id="getID(1)" class="idecharts"></div>
      </el-col>
      <el-col :span="12">
        <div :id="getID(2)" class="idecharts"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table ref="multipleTable" :data="yoyTableData">
          <el-table-column prop="dateNumberStr" label="时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="value" label="用电量(kW·h)" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hisValue" label="去年同期用电量(kW·h)" show-overflow-tooltip></el-table-column>
          <el-table-column prop="musValue" label="增加值(kW·h)" show-overflow-tooltip></el-table-column>
          <el-table-column prop="percentage" label="同比(%)" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table ref="multipleTable" :data="qoqTableData">
          <el-table-column prop="dateNumberStr" label="时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="value" label="用电量(kW·h)" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hisValue" label="上期用电量(kW·h)" show-overflow-tooltip></el-table-column>
          <el-table-column prop="musValue" label="增加值(kW·h)" show-overflow-tooltip></el-table-column>
          <el-table-column prop="percentage" label="环比(%)" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- <el-table ref="multipleTable" :data="tableData">
      <el-table-column prop="name" label="时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="code" label="用电量(kW·h)" show-overflow-tooltip></el-table-column>
      <el-table-column prop="areaStr" label="用电量环比上期(%)" show-overflow-tooltip></el-table-column>
      <el-table-column prop="areaStr" label="用电量同比去年同期(%)" show-overflow-tooltip></el-table-column>
    </el-table> -->
    <!-- <pagination
      v-show="total > 0"
      @pagination="handleCurrentChange"
      :page.sync="monitorSite.pageNum"
      :pageSizes="[10, 20, 30, 40]"
      :limit.sync="monitorSite.pageSize"
      :total="total"
    /> -->
  </div>
</template>

<script>
import $environMonitor from "@/api/environMonitor";
import weekPicker from '@/components/weekPicker'
import { getKeyAreaMonitor } from "@/api/smartEnergyAdmin/keyArea"
export default {
  name: "KeyArea",
  components: { weekPicker },
  data() {
    return {
      monitorSite: {
        dateType: 'week',
        loopType: 'LIGNTINGELETRICITY',
        start: '',
        end: '',
        year: ''
      },
      total: 0,
      tableData: [],
      areaList:[
        {
          value: 'POWERELETRICITY',
          label: '动力用电'
        },
        {
          value: 'LIGNTINGELETRICITY',
          label: '照明用电'
        },
      ],
      dateTypeList: [
        {
          value: 'week',
          label: '周'
        }, {
          value: 'month',
          label: '月'
        }, {
          value: 'season',
          label: '季'
        }
      ],
      weekWidth: '160',
      yearsList: [],
      seasonsList:[
        {
          value: '1',
          label: '第一季度'
        },
        {
          value: '2',
          label: '第二季度'
        },
        {
          value: '3',
          label: '第三季度'
        },
        {
          value: '4',
          label: '第四季度'
        }
      ],
      weeksList:[],
      monthsList:[],
      placeholderText:'请选择周',
      tempList: [],
      echartLegendText: "当周",
      qoqData:[],
      qoqData1:[],
      yoyData:[],
      yoyData1:[],
      dateNumberStr:[],
      qoqTableData:[],
      yoyTableData:[],
    };
  },
  created(){
    // const starts = new Date();
    // this.monitorSite.timeArr[0] = starts
    // this.monitorSite.timeArr[1] = starts
    this.yearChange()
    this.weekChange()
    this.monthChange()
    const starts = new Date();
    this.monitorSite.year = starts.getFullYear()
  },
  mounted() {
    this.tempList = this.weeksList
    this.monitorSite.start = this.tempList[0].value
    this.monitorSite.end = this.tempList[0].value
    // if(this.monitorSite.dateType === 'week'){
    //   let weekStart =  document.getElementById('weekStart').value;
    //   let weekEnd =  document.getElementById('weekEnd').value;
    //   this.monitorSite.start = weekStart.substr(5,2)
    //   this.monitorSite.end = weekEnd.substr(5,2)
    // }
    // const myDate = new Date()
    // this.monitorSite.year = myDate.getFullYear()
    this.getKeyAreaMonitor()
  },
  methods: {
    // 获取年
    yearChange () {
      var myDate = new Date()
      var startYear = myDate.getFullYear() - 10// 起始年份
      var endYear = myDate.getFullYear()// 结束年份
      this.yearsList = []
      for (var i = startYear; i <= endYear; i++) {
        this.yearsList.push({value: (i), label: (i)})
      }
    },
    // 获取周
    weekChange () {
      this.weeksList = []
      for (var i = 1; i <= 52; i++) {
        this.weeksList.push({value: (i), label: '第' + (i) + '周'})
      }
    },
    // 获取月份
    monthChange () {
      this.monthsList = []
      for (var i = 1; i <= 12; i++) {
        this.monthsList.push({value: (i), label: (i) + '月'})
      }
    },
    // 获取重点监测数据
    getKeyAreaMonitor(){
      getKeyAreaMonitor(this.monitorSite.dateType,this.monitorSite).then(res=>{
        this.qoqTableData = res.data.mom;
        this.yoyTableData = res.data.yoy;
        // 同比
        if(res.data.yoy){
          this.yoyData = res.data.yoy.map(item=>item.value)
          this.yoyData1 = res.data.yoy.map(item=>item.hisValue)
          this.dateNumberStr = res.data.yoy.map(item=>item.dateNumberStr)
        }
        // 环比
        if(res.data.mom){
          this.qoqData = res.data.mom.map(item=>item.value)
          this.qoqData1 = res.data.mom.map(item=>item.hisValue)
        }
        this.showChart()
      })
    },
    dateTypeChange(){
      if(this.monitorSite.dateType == 'week'){
        this.placeholderText = '请选择周'
        this.tempList = []
        this.monitorSite.start = ''
        this.monitorSite.end = ''
        this.tempList = this.weeksList
        this.echartLegendText = "当周"
      }else if(this.monitorSite.dateType == 'month'){
        this.placeholderText = '请选择月份'
        this.tempList = []
        this.monitorSite.start = ''
        this.monitorSite.end = ''
        this.tempList = this.monthsList
        this.echartLegendText = "当月"
      }else{
        this.placeholderText = '请选择季度'
        this.tempList = []
        this.monitorSite.start = ''
        this.monitorSite.end = ''
        this.tempList = this.seasonsList
        this.echartLegendText = "当季"
      }
    },
    showChart(){
      let obj = {
        id: "line" + 1,
        title: '用电同比分析',
        xdata: this.dateNumberStr,
        name: [this.echartLegendText,'去年同期'],
        type: 'bar',
        color: ["#1ceb24","#e7e325"],
        ydata: this.yoyData,
        ydata1: this.yoyData1,
      }
      this.initcolumnarChart(obj);
      
      let obj1 = {
        id: "line" + 2,
        title: '用电环比分析',
        xdata: this.dateNumberStr,
        name: [this.echartLegendText,'上周'],
        type: 'bar',
        color: ["#1ceb24","#e7e325"],
        ydata: this.qoqData,
        ydata1: this.qoqData1,
      }
      this.initcolumnarChart(obj1);
    },
    getID(index) {
      return "line" + index;
    },
    // 搜索数据来源
    onSearch() {
      // if(this.monitorSite.dateType === 'week'){
      //   let weekStart =  document.getElementById('weekStart').value;
      //   let weekEnd =  document.getElementById('weekEnd').value;
      //   this.monitorSite.start = weekStart.substr(5,2)
      //   this.monitorSite.end = weekEnd.substr(5,2)
      //   this.monitorSite.year = weekEnd.substr(0,4)
      // }else if(this.monitorSite.dateType === 'month'){
      //   this.monitorSite.start = this.monitorSite.timeArr[0].substr(5,2)
      //   this.monitorSite.end = this.monitorSite.timeArr[1].substr(5,2)
      //   this.monitorSite.year = this.monitorSite.timeArr[0].substr(0,4)
      // }else{
        
      // }
      this.getKeyAreaMonitor();
     
    },
    // 重置接口数据
    onReset() {
      this.getKeyAreaMonitor();
    },
    // 柱状图和折线图结合
    initcolumnarChart(obj) {
      let pieChart = this.$Echarts.init(document.getElementById(obj.id));
      let lineOption = {
        title: {
          text: obj.title,
          left: "left"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {},
        xAxis: {
          type: "category",
          boundaryGap: [0, 0.01],
          data: obj.xdata,
          axisLine: {
            lineStyle: {
              type: "solid",
              opacity: "0.1",
              color: "#606266" //坐标线的颜色
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
              width: "0" //坐标线的宽度
            }
          },
          splitLine: {
            lineStyle: {
              color: ["#606266"],
              width: 1,
              type: "solid",
              opacity: "0.1"
            }
          }
        },
        series: [
          {
            name: obj.name[0],
            type: obj.type,
            color: obj.color[0],
            barWidth: '30%',
            data: obj.ydata
          },
          {
            name: obj.name[1],
            type: obj.type,
            color: obj.color[1],
            barWidth: '30%',
            data: obj.ydata1
          }
        ]
      };
      pieChart.setOption(lineOption);
      window.addEventListener("resize", function() {
        pieChart.resize();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.idecharts {
  height: 315px;
  width: 100%;
}
::v-deep .flex {
  width: 300px;
  display: flex;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  .el-input__inner {
    border: none;
  }
  .noIcon {
    .el-input__icon {
      display: none;
    }
  }
  .noPl {
    .el-input__inner {
      padding-right: 0;
    }
  }
}
</style>