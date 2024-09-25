<template>
  <div class="app-container" style="display: flex;">
    <!-- <regiontree @nodeclick="nodeclick" :type="'1'" :nodeType="monitorSite.radio2"></regiontree> -->
    <!-- 表格数据 -->
    <div style="height: 100%;width: 100%;">
      <el-form ref="formSearch" inline :model="monitorSite">
        <el-form-item prop="radio2">
          <el-radio-group v-model="monitorSite.radio2">
            <!-- <el-radio-button label="waterMeter">水</el-radio-button> -->
            <el-radio-button label="ammeter">电</el-radio-button>
            <!-- <el-radio-button label="heatMeter">热</el-radio-button> -->
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="时间范围" prop="timeArr">
          <el-date-picker
            v-model="monitorSite.timeArr"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="时间范围"
            :clearable="false"
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item label="用电区域" prop="nodeCode">
          <el-select v-model="monitorSite.nodeCode"  :clearable="false"  style="width: 150px">
              <el-option v-for="item in optionList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
      <div id="lineChart" class="idecharts"></div>
      <div>
        <el-table ref="multipleTable" :data="tableData">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="用电区域" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="code" label="能源类型" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="dateTime" label="时间"></el-table-column>
          <el-table-column prop="forecastValue" label="预测用电" show-overflow-tooltip></el-table-column>
          <el-table-column prop="realValue" label="实际用电" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviationValue" label="偏差值" show-overflow-tooltip></el-table-column>
          <el-table-column prop="areaStr" label="偏差率" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- <pagination
          v-show="total > 0"
          @pagination="getList"
          :page.sync="monitorSite.pageNum"
          :pageSizes="[10, 20, 30, 40]"
          :limit.sync="monitorSite.pageSize"
          :total="total"
        />-->
      </div>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import regiontree from "../../components/regiontree"; // 树结构组件
import $environMonitor from "@/api/environMonitor";
export default {
  components: {
    regiontree
  },
  data() {
    return {
      monitorSite: {
        radio2: "ammeter",
        pageSize: 6,
        pageNum: 1,
        nodeCode: "public",
      },
      total: 0,
      tableData: [],
      nodeId: null,
      optionList: [
        {
          value: "public",
          name: "公共区域",
        },
        {
          value: "tenement",
          name: "住户区域",
        },
        {
          value: "office",
          name: "办公区域",
        },
        {
          value: "market",
          name: "商业区域",
        },
      ]
    };
  },
  mounted() {
  },
  methods: {
    // 获取列表
    getList() {
      let params = {
        // nodeId: this.nodeId,
        // nodeId: "1592721639844859906",
        // dateTime: Moment(new Date(this.monitorSite.timeArr)).format('yyyyWW')
        // dateTime: "202301"
        nodeCode: this.monitorSite.nodeCode
      };
      $environMonitor.getPrediction(this.monitorSite.radio2, params).then(res => {
          this.tableData = res.data;
          let xData = [],
            yData = [],
            yData1 = [];
          res.data.forEach(item => {
            xData.push(item.dateTime);
            yData.push(item.realValue);
            yData1.push(item.forecastValue);
          });
          this.initcolumnarChart(xData, yData, yData1);
          // this.total = res.data.total;
          // this.initcolumnarChart()
        });
    },
    nodeclick(data) {
      this.nodeId = data;
      this.getList();
    },
    // 搜索
    onSearch() {
      this.monitorSite.pageNum = 1;
      this.getList();
    },
    // 重置接口数据
    onReset() {
      this.resetForm("formSearch");
      this.onSearch();
    },
    // 柱状图和折线图结合
    initcolumnarChart(xData, yData, yData1) {
      let pieChart = this.$Echarts.init(document.getElementById("lineChart"));
      let lineOption = {
        title: {
          text: "本周用电预测",
          left: "left"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {}, // 图例
        // grid: {
        // 	left: '1%',
        // 	right: '1%',
        // 	bottom: '3%',
        // 	containLabel: true
        // },
        xAxis: {
          type: "category",
          boundaryGap: [0, 0.01],
          data: xData,
          axisTick: {
            show: false
          },
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
        // color: ['#73c0de',],
        series: [
          {
            name: "实际用电",
            type: "line",
            smooth: true,
            color: "#1ceb24",
            data: yData
          },
          {
            name: "预测用电",
            type: "line",
            smooth: true,
            color: "#e7e325",
            data: yData1
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
</style>