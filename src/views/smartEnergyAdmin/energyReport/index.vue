<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <regiontree @nodeclick="nodeclick" :type="'1'" :nodeType="monitorSite.radio2"></regiontree>
      </el-col>
      <el-col :span="19" style="margin-left:25px">
        <div class="querys">
          <el-form ref="formSearch" inline :model="monitorSite">
            <el-form-item prop="radio2">
              <el-radio-group v-model="monitorSite.radio2" @input="inputradio">
                <el-radio-button label="waterMeter">水</el-radio-button>
                <el-radio-button label="ammeter">电</el-radio-button>
                <!-- <el-radio-button label="heatMeter">热</el-radio-button> -->
              </el-radio-group>
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
              <el-date-picker
                v-if="monitorSite.dateType === 'day'"
                v-model="monitorSite.timeArr"
                value-format="yyyy-MM-dd"
                type="daterange"
                :clearable="false"
                style="width: 300px;"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
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
              <el-button icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="iconContainer">
            <svg-icon icon-class='list' class="mr20" :style="{color: listShow ? '#356dee' : '#606266'}" @click="changeIcon(true)" />
            <svg-icon icon-class='chart' class="mr20" :style="{color: listShow ? '#606266' : '#356dee'}" @click="changeIcon(false)" />
            <svg-icon icon-class="download" @click="exportReport" />
          </div>
        </div>
        <div v-if="!listShow" id="barChart" class="idecharts"></div>
        <el-table :data="tableData" v-if="listShow">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="name" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="设备编号" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="nodeAdress" label="挂载信息" show-overflow-tooltip></el-table-column>
          <el-table-column prop="useage" :label="monitorSite.radio2 == 'waterMeter' ? '用水量' : '用电量'"></el-table-column>
          <el-table-column prop="dateTime" label="时间"></el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          @pagination="getList"
          :page.sync="monitorSite.pageNum"
          :pageSizes="[10, 20, 30, 40]"
          :limit.sync="monitorSite.pageSize"
          :total="total"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Moment from 'moment'
import regiontree from "../components/regiontree"; // 树结构组件
import { downloadFile } from '@/utils/index'
import { getReportData, reportDataExport, getListData } from "@/api/environMonitor/energyReport";
export default {
  components: {
    regiontree
  },
  data() {
    return {
      monitorSite: {
        pageSize: 10,
        pageNum: 1,
        radio2: "waterMeter",
        dateType: 'day',
        timeArr: [],
      },
      total: 0,
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
      listShow: true,
      nodeId: ''
    };
  },
  created(){
    let today = new Date().toISOString().substring(0, 10)
    let aWeekAgo = new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().substring(0, 10)
    this.monitorSite.timeArr = [aWeekAgo, today]
  },
  methods: {
    // 判断调用哪个接口
    getDatas(){
      if(this.listShow === true){
        this.getList()
      }else {
        this.getdataArr()
      }
    },
    // 点击数结构
    nodeclick(data) {
      this.nodeId = data
      setTimeout(()=>{
        this.getDatas()
      },1500)
      
    },
    // 获取列表接口
    getList(){
      let params = {
        nodeId: this.nodeId,
        // nodeId: '12',
        pageNum: this.monitorSite.pageNum,
        pageSize: this.monitorSite.pageSize,
        start: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[0])).format('yyyy-WW') : this.monitorSite.timeArr[0],
        end: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[1])).format('yyyy-WW') : this.monitorSite.timeArr[1],
      }
      getListData(this.monitorSite.radio2,this.monitorSite.dateType,params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    // 获取统计数据
    getdataArr() {
      let params = {
        nodeId: this.nodeId,
        start: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[0])).format('yyyy-WW') : this.monitorSite.timeArr[0],
        end: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[1])).format('yyyy-WW') : this.monitorSite.timeArr[1],
      }
      getReportData(this.monitorSite.radio2,this.monitorSite.dateType,params).then(res => {
        let xtemp = [], ytemp = []
        res.data.forEach(item => {
          xtemp.push(item.dateOrMonthStr)
          ytemp.push(item.value)
        })
        this.initcolumnarChart(xtemp,ytemp);
      })
    },
    // 搜索
    onSearch(){
      this.monitorSite.pageNum = 1
      this.getDatas()
    },
    // 重置接口数据
    onReset() {
      this.resetForm('formSearch')
      this.onSearch()
    },
    // 时间维度切换
    dateTypeChange(val){
      if(val === 'day'){
        let today = new Date().toISOString().substring(0, 10)
        let aWeekAgo = new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().substring(0, 10)
        this.monitorSite.timeArr = [aWeekAgo, today]
        this.getDatas()
      }else if(val === 'week'){
        let today = new Date()
        let sixWeekAgo = new Date(new Date().setDate(new Date().getDate() - 42))
        this.monitorSite.timeArr = [sixWeekAgo, today]
        this.getDatas()
      }else {
        let today = new Date().toISOString().substring(0, 7).replace(/-/g, "/")
        let sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().substring(0, 7).replace(/-/g, "/")
        this.monitorSite.timeArr = [sixMonthAgo, today]
        this.getDatas()
      }
    },
    // 列表统计图切换
    changeIcon(type){
      this.listShow = type
      this.$nextTick(() => {
        this.getDatas()
      })
    },
    // 类型切换
    inputradio(val) {
      this.getDatas()
    },
    // 导出数据
    exportReport(){
      let params = {
        // nodeId: this.nodeId,
        nodeId: '12',
        pageNum: this.monitorSite.pageNum,
        pageSize: this.monitorSite.pageSize,
        start: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[0])).format('yyyy-WW') : this.monitorSite.timeArr[0],
        end: this.monitorSite.dateType === 'week' ? Moment(new Date(this.monitorSite.timeArr[1])).format('yyyy-WW') : this.monitorSite.timeArr[1],
      }
      reportDataExport(this.monitorSite.radio2,this.monitorSite.dateType,params).then(res => {
        downloadFile(res, `能耗报表${new Date().getTime()}`, "xlsx")
        this.$message.success("导出成功")
      })
    },
    // 柱状图和折线图结合
    initcolumnarChart(xdata, ydata) {
      let pieChart = this.$Echarts.init(document.getElementById('barChart'));
      let lineOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        // legend: {},
        xAxis: {
          type: "category",
          boundaryGap: [0, 0.01],
          data: xdata,
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
            type: 'bar',
            barWidth: '30%',
            data: ydata
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
  height: 600px;
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
}
.querys {
  display: flex;
  justify-content: space-between;
  .svg-icon {
    font-size: 22px;
    cursor: pointer;
  }
}
</style>