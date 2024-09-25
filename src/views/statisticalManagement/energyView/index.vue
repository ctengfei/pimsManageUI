<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <gis-map
        ref="gisMap"
        :getMouseLOcation="getMouseLOcation"
        @map-location="maplocation"
        @clickPoint="clickPoint"
      ></gis-map>
    </div>
    <div class="bigbgc">
      <div style="width: 100%; height: 20vh">
        <div class="titles">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            能耗告警
          </div>
        </div>
        <div class="part1" style="margin: 10px 0">
          <div class="item" v-for="(item, index) in securityList" :key="index">
            <div style="font-size: 32px">{{ item.num }}</div>
            <div>{{ item.label }}</div>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 35vh">
        <div class="titles">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            <!-- 人员统计 -->
            能耗告警数量
          </div>
        </div>
        <div style="height: 100%">
          <ve-histogram
            ref="histogramcharts"
            :data="chartData"
            :extend="chartBarExtend"
            height="100%"
            :grid="grid"
          >
          </ve-histogram>
        </div>
      </div>
      <div style="width: 100%; height: 35vh">
        <div class="titles dateButtonGroup">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            <!-- 车辆态势 -->
            水耗监测(吨)
          </div>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDatesShui(item.type)"
              class="dateButton"
              plain
              :class="[item.type === filterSelectTypeShui ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <div style="height: 100%">
          <ve-line
            ref="linecharts"
            :data="historycarShui"
            :extend="chartExtend"
            height="100%"
            :grid="grid"
          >
          </ve-line>
        </div>
      </div>
    </div>
    <div class="middletop">
      <div v-for="(item, index) in workcons" :key="index">
        <p class="labels">{{ item.label }}</p>
        <p class="nums">{{ item.num }}</p>
        <p class="labels">{{ item.rate }}</p>
      </div>
    </div>
    <div class="middlebottom">
      <div class="middlebottomNew">
        <div class="titless dateButtonGroup">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            <!-- 设备设施在线率 -->
            厂房减排量(kg)
          </div>
          <div>
            <span
              v-for="(item, index) in filterSelectTypeCarbons"
              :key="index"
              :value="item.type"
              @click="chooseDates(item.type)"
              class="dateButton"
              plain
              :class="[item.type === filterSelectType ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <div style="height:100%">
          <ve-line
            ref="linechart"
            :data="historycar"
            :extend="chartExtend"
            height="100%"
            :grid="gridCar"
          >
          </ve-line>
        </div>
      </div>

      <div class="middlebottomNew2">
        <div class="titless dateButtonGroup">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            园区碳排放量(kg)
          </div>
          <div>
            <span
              v-for="(item, index) in filterSelectTypeCarbonsTwo"
              :key="index"
              :value="item.type"
              @click="chooseDatesTwo(item.type)"
              class="dateButton"
              plain
              :class="[item.type === filterSelectTypeTwo ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <div style="height:100%">
          <ve-line
            ref="linechart"
            :data="historycarTwo"
            :extend="chartExtend"
            height="96%"
            :grid="gridCar"
          >
          </ve-line>
        </div>
      </div>
    </div>
    <div class="rightbgc">
      <div style="width: 100%; height: 75vh">
        <div class="titles dateButtonGroup">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            <!-- 能耗统计 -->
            TOP10企业用水/用电排名
          </div>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectComponyTypes"
              :key="index"
              :value="item.type"
              @click="chooseDatesCompony(item.type)"
              class="dateButton"
              plain
              :class="[item.type === filterSelectTypeCom ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <div style="height:100%">
          <div style="height: calc(100% - 70px)">
            <el-table
              :data="tableData"
              style="width: 100%"
            >
              <!-- prop="date" -->
              <el-table-column type="index" label="序号"> </el-table-column>
              <el-table-column
                prop="typeName"
                label="企业名称"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column prop="sumValue" show-overflow-tooltip label="用量">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 25vh">
        <div class="titles dateButtonGroup">
          <p>
            <img src="@/assets/images/arrow.png" alt="" />
            电耗监测(度)
          </p>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDatesDian(item.type)"
              class="dateButton"
              plain
              :class="[item.type === filterSelectTypeDian ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <div style="height:100%">
          <ve-line
            ref="lineCharts"
            :data="historycarDian"
            :extend="chartExtend"
            height="100%"
            :grid="grids"
          >
          </ve-line>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPointPosionNews,
  getEnergyWarnNum,
  getRankingList,
  getRankingEleList,
  getCountNum,
  getCarbonNeutralNumWeekShui,
  getCarbonNeutralNumWeekShuiTwo,
  getCarbonNeutralNumWeekDian,
  getCarbonNeutralNumWeekDianTwo,
  getCarbonNeutralNumMouthShui,
  getCarbonNeutralNumMouthShuiTwo,
  getCarbonNeutralNumMouthDian,
  getCarbonNeutralNumMouthDianTwo,
  getMonitorNumWeek,
  getMonitorNumMouth,
  getMonitorNumYear,
  getMonitorShuiNumWeek,
  getMonitorShuiNumMouth,
  getMonitorShuiNumYear,
  getEnergyWarnBarNum,
} from "@/api/smartEnergyAdmin/energyView";
import {
  initSpanData,
  initTabData,
  initPieData,
  initLineData,
  initFillData,
} from "@/api/smartProperty/workbench";
import gisMap from "@/components/common/map/gis-map";
import { getStringByKey, getObjByKey } from "@/utils/voice.js";
export default {
  name: 'EnergyView',
  components: {
    gisMap,
  },
  data() {
    return {
      results1 : [],
      results2 : [],
      results3 : [],
      results4 : [],
      results11 : [],
      results22 : [],
      results33 : [],
      results44 : [],
      filterSelectTypes: [
        {
          type: "week",
          name: "周",
        },
        {
          type: "month",
          name: "月",
        },
        {
          type: "year",
          name: "年",
        },
      ],
      filterSelectComponyTypes: [
        {
          type: "water",
          name: "水(吨)",
        },
        {
          type: "ele",
          name: "电(度)",
        },
      ],
      filterSelectTypeCarbons: [
        {
          type: "week",
          name: "本周",
        },
        {
          type: "month",
          name: "本月",
        },
      ],
      filterSelectTypeCarbonsTwo: [
        {
          type: "week",
          name: "本周",
        },
        {
          type: "month",
          name: "本月",
        },
      ],
      tableData: [
        {
          date: "1",
          typeName: "小米科技有限公司",
          sumValue: "1510",
        },
        {
          date: "2",
          typeName: "小米科技有限公司",
          sumValue: "1511",
        },
        {
          date: "3",
          typeName: "小米科技有限公司",
          sumValue: "1512",
        },
        {
          date: "4",
          typeName: "小米科技有限公司",
          sumValue: "1513",
        },
        {
          date: "5",
          name: "小米科技有限公司",
          address: "1514",
        },
        {
          date: "6",
          name: "小米科技有限公司",
          address: "1515",
        },
        {
          date: "7",
          name: "小米科技有限公司",
          address: "1516",
        },
        {
          date: "8",
          name: "小米科技有限公司",
          address: "1517",
        },
        {
          date: "9",
          name: "小米科技有限公司",
          address: "1518",
        },
        {
          date: "10",
          name: "小米科技有限公司",
          address: "1519",
        },
      ],
      // 距离周围的距离
      grid: {
        top: 20,
        bottom: 40,
      },
      gridCar: {
        top: 20,
        bottom: 20,
      },
      grids: {
        top: 20,
        bottom: 20,
      },
      // 历史人员流量数据
      historypeople: {},
      historycar: {},
      historycarTwo: {},
      historycarShui: {},
      historycarDian: {},
      // 能耗告警数量数据
      chartData: {},
      defaultPieChart: null,
      defaultLineChart: null,
      cameraForm: {
        name: "",
        latitude: "",
        longitude: "",
        position: "",
      },
      workcons: [
        {
          label: "本日用电量(度)",
          num: 265,
          rate: "15%",
        },
        {
          label: "本月用电量(度)",
          num: 23,
          rate: "15%",
        },
        {
          label: "本日用水量(吨)",
          num: 200,
          rate: "15%",
        },
        {
          label: "本月用水量(吨)",
          num: 50,
          rate: "15%",
        },
      ],
      percentCons: [
        { num: 70, label: "摄像头" },
        { num: 60, label: "智能照明" },
        { num: 50, label: "暖通空调" },
      ],
      securityList: [
        { num: "256", label: "能耗告警" },
        { num: "23", label: "今日告警" }
      ],
      envList: [
        { num: 20, label: "占用" },
        { num: 60, label: "已租" },
        { num: 40, label: "空闲" },
        { num: 100, label: "空置" },
      ],
      chartExtend: {
        series: {
          type: 'line',
        },
        legend: {
          textStyle: {
            color: "#fff",
          },
        },
        xAxis: {
          show: true,
          // 坐标轴轴线
          axisLine: {
            show: true,
          },
          // 坐标轴刻度
          axisTick: {
            show: false,
          },
          // 坐标轴每项的文字
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            color: "#fff",
            rotate: 0, //刻度文字旋转，防止文字过多不显示
            margin: 8, //文字离x轴的距离
            boundaryGap: true,
            // backgroundColor:'#0f0',
          },
          // X轴下面的刻度小竖线
          axisTick: {
            show: false,
            alignWithLabel: true, //axisLabel.boundaryGap=true时有效
            interval: 0,
            length: 4, //长度
          },
          // x轴对应的竖线
          splitLine: {
            show: false,
            interval: 0,
            lineStyle: {
              color: "red",
              backgroundColor: "red",
            },
          },
        },
        yAxis: {
          show: true,
          offset: 0,
          // 坐标轴轴线
          axisLine: {
            show: false,
          },
          // x轴对应的竖线
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff",
              opacity: "0.1",
              backgroundColor: "#fff",
            },
          },
          // 坐标轴刻度
          axisTick: {
            show: false,
          },
          boundaryGap: false,
          axisLabel: {
            color: "#fff",
          },
        },
      },
      chartBarExtend: {
        series: {
          type: 'bar',
          barWidth: 10,
        },
        legend: {
          textStyle: {
            color: "#fff",
          },
        },
        xAxis: {
          show: true,
          // 坐标轴轴线
          axisLine: {
            show: true,
          },
          // 坐标轴刻度
          axisTick: {
            show: false,
          },
          // 坐标轴每项的文字
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            color: "#fff",
            rotate: 0, //刻度文字旋转，防止文字过多不显示
            margin: 8, //文字离x轴的距离
            boundaryGap: true,
            // backgroundColor:'#0f0',
          },
          // X轴下面的刻度小竖线
          axisTick: {
            show: false,
            alignWithLabel: true, //axisLabel.boundaryGap=true时有效
            interval: 0,
            length: 4, //长度
          },
          // x轴对应的竖线
          splitLine: {
            show: false,
            interval: 0,
            lineStyle: {
              color: "red",
              backgroundColor: "red",
            },
          },
        },
        yAxis: {
          show: true,
          offset: 0,
          // 坐标轴轴线
          axisLine: {
            show: false,
          },
          // x轴对应的竖线
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff",
              opacity: "0.1",
              backgroundColor: "#fff",
            },
          },
          // 坐标轴刻度
          axisTick: {
            show: false,
          },
          boundaryGap: false,
          axisLabel: {
            color: "#fff",
          },
        },
      },
      filterSelectType: "week",
      filterSelectTypeTwo: "week",
      filterSelectTypeShui: "week",
      filterSelectTypeCom: "water",
      filterSelectTypeDian: "week",
      filterSelectTypies: "week",
      cameraImg: require("../../../assets/images/map/camera.png"),
      changeImg: require("../../../assets/images/map/camera-erry.png"),
    };
  },
  watch: {},
  created() {},

  mounted() {
    this.getPeopleData();
    // this.getcarData();
    this.getWarnNum();
    this.getRanking();
    this.getCountUseNum();
    this.getLineData();
    this.getLineDataTwo();
    this.getLineDataShui();
    this.getLineDataDian();
    window.addEventListener("resize", this.resizeTheChart());
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTheChart());
  },
  methods: {
    
    resizeTheChart() {
      if (this.$refs.linecharts) {
        this.$refs.linecharts.resize();
      }
      if (this.$refs.linechart) {
        this.$refs.linechart.resize();
      }
      if (this.$refs.histogramcharts) {
        this.$refs.histogramcharts.resize();
      } if (this.$refs.lineCharts) {
        this.$refs.lineCharts.resize();
      }
    },
    // 告警数量
    getWarnNum(data) {
      getEnergyWarnNum().then((res) => {
        this.securityList[0].num = res.data.totalNumber;
        this.securityList[1].num = res.data.totalToday;
      });
    },
    // 排行榜
    getRanking() {
      let data = this.filterSelectTypeCom;
      if (data === "water") {
        getRankingList().then((res) => {
          this.tableData = res.data;
        });
      } else {
        getRankingEleList().then((res) => {
          this.tableData = res.data;
        });
      }
    },
    // 本日本月使用量
    getCountUseNum(data) {
      getCountNum().then((res) => {
        this.workcons[0].num = res.data.electricityToday;
        this.workcons[1].num = res.data.eletricityMonth;
        this.workcons[2].num = res.data.waterToday;
        this.workcons[3].num = res.data.waterMonth;
        this.workcons[0].rate = res.data.eleTodayRowthRate;
        this.workcons[1].rate = res.data.eleMonthRowthRate;
        this.workcons[2].rate = res.data.waterTodayRowthRate;
        this.workcons[3].rate = res.data.waterMonthRowthRate;
      });
    },
    setItemProgress(data) {
      if (data) {
        return parseInt((data.num / this.allWork[0].num).toFixed(2) * 100);
      } else {
        return 0 + "";
      }
    },
    chooseDate(date) {
      this.filterSelectType = date;
      this.getPeopleData();
    },
    // filterSelectTypeTwo
    chooseDatesTwo(date) {
      this.filterSelectTypeTwo = date;
      this.getLineDataTwo();
    },
    chooseDates(date) {
      this.filterSelectType = date;
      this.getLineData();
    },
    chooseDatesShui(date) {
      this.filterSelectTypeShui = date;
      this.getLineDataShui();
    },
    chooseDatesCompony(date) {
      this.filterSelectTypeCom = date;
      this.getRanking();
    },
    chooseDatesDian(date) {
      this.filterSelectTypeDian = date;
      this.getLineDataDian();
    },
    // 请求厂房减排量数据
    getLineData() {
      let data = this.filterSelectType;
      if (data === "week") {
        Promise.all([
          getCarbonNeutralNumWeekShui().then((res) => {
            this.results1 = res.data;
            this.results1.forEach((item) => {
              item.水 = item.sumValue;
            });
          }),
          getCarbonNeutralNumWeekDian().then((res) => {
            this.results2 = res.data;
            this.results2.forEach((item) => {
              item.电 = item.sumValue;
            });
          })
        ]).then( res => {
          let results6 = this.results1
          let results7 = this.results2
          var list = results6.map((key,index) => { return {...key,...results7[index]}})
          let ress = {
            columns: ["payMouth", "水", "电"],
            rows: list,
          };
          this.historycar = ress;
        })
      } else {
        // 碳中和月使用量

        Promise.all([
          getCarbonNeutralNumMouthShui().then((res) => {
            this.results3 = res.data;
            this.results3.forEach((item) => {
              item.水 = item.sumValue;
            });
          }),
          getCarbonNeutralNumMouthDian().then((res) => {
            this.results4 = res.data;
            this.results4.forEach((item) => {
              item.电 = item.sumValue;
            });
          })
        ]).then( res => {
          let results8 = this.results1
          let results9 = this.results2
          var list = results8.map((key,index) => { return {...key,...results9[index]}})
          let ress = {
            columns: ["payMouth", "水", "电"],
            rows: list,
          };
          this.historycar = ress;
        })
      }
    },
    // 请求园区碳排放量数据
    getLineDataTwo() {
      let data = this.filterSelectTypeTwo;
      if (data === "week") {
        Promise.all([
          getCarbonNeutralNumMouthShuiTwo().then((res) => {
            this.results11 = res.data;
            this.results11.forEach((item) => {
              item.水 = item.sumValue;
            });
          }),
          getCarbonNeutralNumMouthDianTwo().then((res) => {
            this.results22 = res.data;
            this.results22.forEach((item) => {
              item.电 = item.sumValue;
            });
          })
        ]).then( res => {
          let results6 = this.results11
          let results7 = this.results22
          var list = results6.map((key,index) => { return {...key,...results7[index]}})
          let ress = {
            columns: ["payMouth", "水", "电"],
            rows: list,
          };
          this.historycarTwo = ress;
        })
      } else {
        // 园区碳排放量月使用量
        Promise.all([
          getCarbonNeutralNumWeekShuiTwo().then((res) => {
            this.results33 = res.data;
            this.results33.forEach((item) => {
              item.水 = item.sumValue;
            });
          }),
          getCarbonNeutralNumWeekDianTwo().then((res) => {
            this.results44 = res.data;
            this.results44.forEach((item) => {
              item.电 = item.sumValue;
            });
          }),
        ]).then( res => {
          let results8 = this.results33
          let results9 = this.results44
          var list = results8.map((key,index) => { return {...key,...results9[index]}})
          let ress = {
            columns: ["payMouth", "水", "电"],
            rows: list,
          };
          this.historycarTwo = ress;
        })
      }
    },
    // 请求折线图数据dian
    getLineDataDian() {
      let data = this.filterSelectTypeDian;
      if (data === "week") {
        getMonitorNumWeek(data).then((res) => {
          let results = res.data;
          results.forEach((item) => {
            item.用量 = item.sumUsage;
          });
          let dian = {
            columns: ["payMouth", "用量"],
            rows: results,
          };
          this.historycarDian = dian;
        });
      } else if (data === "month") {
        getMonitorNumMouth(data).then((res) => {
          let results = res.data;
          results.forEach((item) => {
            item.用量 = item.sumUsage;
          });
          let dian = {
            columns: ["payMouth", "用量"],
            rows: results,
          };
          this.historycarDian = dian;
        });
      } else {
        getMonitorNumYear(data).then((res) => {
          let results = res.data;
          results.forEach((item) => {
            item.用量 = item.sumUsage;
          });
          let dian = {
            columns: ["payMouth", "用量"],
            rows: results,
          };
          this.historycarDian = dian;
        });
      }
    },
    // 请求折线图数据shui
    getLineDataShui() {
      let data = this.filterSelectTypeShui;
      if (data === "week") {
        getMonitorShuiNumWeek(data).then((res) => {
          let results = res.data;
          results.forEach((item) => {
            item.用量 = item.sumUsage;
          });
          let shui = {
            columns: ["payMouth", "用量"],
            rows: results,
          };
          this.historycarShui = shui;
        });
      } else if (data === "month") {
        getMonitorShuiNumMouth(data).then((res) => {
          let results = res.data;
          results.forEach((item) => {
            item.用量 = item.sumUsage;
          });
          let shui = {
            columns: ["payMouth", "用量"],
            rows: results,
          };
          this.historycarShui = shui;
        });
      } else {
        getMonitorShuiNumYear(data).then((res) => {
          let results = res.data;
          results.forEach((item) => {
            item.用量 = item.sumUsage;
          });
          let shui = {
            columns: ["payMouth", "用量"],
            rows: results,
          };
          this.historycarShui = shui;
        });
      }
    },
    setItemText(row) {
      if (!row.num) {
        return () => {
          return 0 + "";
        };
      }
      return () => {
        return row.num;
      };
    },
    getPeopleData() {
      getEnergyWarnBarNum().then((res) => {
        let results = res.data;
        results.forEach((item) => {
          item.水 = item.waterCount;
          item.电 = item.eleCount;
        });
        let shui = {
          columns: ["mouth", "水", "电"],
          rows: results,
        };
        this.chartData = shui;
      });
      let data = {
        columns: ["月份", "告警数量"],
        rows: [
          { 月份: "10点", 告警数量: 100 },
          { 月份: "11点", 告警数量: 140 },
          { 月份: "12点", 告警数量: 220 },
          { 月份: "13点", 告警数量: 100 },
          { 月份: "14点", 告警数量: 140 },
          { 月份: "15点", 告警数量: 60 },
        ],
      };
      let res = {
        columns: ["月份", "水", "电"],
        rows: [
          { 月份: "1月", 水: 100, 电: 150 },
          { 月份: "2月", 水: 140, 电: 100 },
          { 月份: "3月", 水: 220, 电: 220 },
          { 月份: "4月", 水: 100, 电: 90 },
          { 月份: "5月", 水: 140, 电: 120 },
          { 月份: "6月", 水: 60, 电: 140 },
        ],
      };
      this.historypeople = res;
    },

    clickPoint(e) {
      console.log(e, "22222");
    },
    maplocation(e) {
      this.cameraShow = true;
      this.cameraForm.latitude = e[0];
      this.cameraForm.longitude = e[1];
      this.cameraForm.name = "";
      this.addType = "add";
    },
    getMouseLOcation(e) {},
  },
};
</script>

<style lang="scss" scoped>
.dateButtonGroups {
  text-align: right !important;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 10%;
  .dateButton {
    margin: 0 5px;
    // color: #e71414;
    cursor: pointer;
    &:hover {
      color: #206aff;
    }
  }
}
p {
  margin: 0;
}
.topinfo {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  p {
    text-align: center;
    color: #fff;
  }
  div {
    display: inline-block;
  }
}
.titles {
  width: 100%;
  margin: 0 0 20px 0;
  text-align: left;
  color: #fff;
  display: flex;
  justify-content: space-between;
  .el-icon-right {
    font-size: 24px;
  }
}
.titless {
  width: 50%;
  margin: 0 0 20px 0;
  text-align: left;
  color: #fff;
  display: flex;
  justify-content: space-between;
  .el-icon-right {
    font-size: 24px;
  }
}
.bigbgc {
  padding: 20px;
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  left: 20px;
  top: 20px;
  width: 25%;
  border-radius: 8px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.35) 34%,
    rgba(0, 0, 0, 0.2) 100%
  );
  height: calc(100vh - 120px);
}
.part1 {
  display: flex;
  justify-content: space-around;
  .item {
    text-align: center;
    color: #fff;
  }
}
.part2 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: #fff;
  .item {
    width: 50%;
    display: flex;
    .el-progress {
      flex: 1;
      margin-left: 10px;
    }
  }
}
::v-deep.el-table.el-table--fit tr th{
   background-color: rgba(38, 40, 57, 0.3) !important;
}
.middletop {
  width: 43%;
  height: 100px;
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translate(-50%, 0);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  div {
    color: #ffffff;
    height: 100%;
    width: 100%;
   overflow: hidden;
    background-color: rgba(64, 66, 80, 0.5);
    border-radius: 32px 8px 32px 8px;
    margin: 0 10px;
    text-align: center;
    padding-top: 18px;
    .labels {
     font-size: 14px;
    }
    .nums {
      font-size: 20px;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
        
    }
  }
}
.middlebottom {
  float: left;
  height: 36%;
  width: 45%;
  padding: 20px;
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translate(-50%, 0);
  margin: 0 auto;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.35) 34%,
    rgba(0, 0, 0, 0.2) 100%
  );
  border-radius: 8px;
  .middlebottomNew {
    float: left;
    width: 48%;
    height: 27vh
  }
  .middlebottomNew2 {
    float: right;
    width: 46%;
    height: 27vh
  }
  .innerBox {
    display: flex;
    div {
      flex: 1;
      color: #ffffff;
      text-align: center;
      .labels {
        font-size: 16px;
      }
      .nums {
        font-size: 39px;
      }
    }
  }
}
.rightbgc {
  padding: 20px;
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  right: 20px;
  top: 20px;
  width: 25%;
  border-radius: 8px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.35) 34%,
    rgba(0, 0, 0, 0.2) 100%
  );
  height: calc(100vh - 120px);
}
.app-container-gis {
  position: relative;

  #cesiumContainer {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    .mainButton {
      position: absolute;
      left: 50px;
      top: 10px;
      z-index: 100;
    }
    .leftBox {
      position: absolute;
      top: 70px;
      width: 420px;
      height: 80%;
      z-index: 100;
      padding: 10px;
      left: 20px;
      background-color: rgba(32, 34, 48, 0.9);
      .seachBox {
        width: 100%;
        height: 35px;
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
        button {
          margin-left: 10px;
        }
      }
      .addBox {
        margin: 5px;
        display: flex;
        button {
          color: white;
        }
        .deletebutton {
          color: #f05656;
        }
      }
      .pagination-container {
        width: 400px;
      }
    }

    .cameraBox {
      position: absolute;
      top: 70px;
      right: 2%;
      width: 16%;
      height: 35%;
      z-index: 100;
      padding: 10px;
      padding-top: 30px;
      background-color: rgba(32, 34, 48, 0.9);
      .info {
        position: absolute;
        top: -10px;
        left: 10px;
        color: white;
        cursor: pointer;
      }
      i {
        position: absolute;
        top: 10px;
        right: 10px;
        color: white;
        cursor: pointer;
      }
    }
    // 布控详情
    .controlDetails,
    .rightBox {
      position: absolute;
      top: 70px;
      right: 20px;
      width: 20%;
      min-width: 350px;
      height: 85%;
      z-index: 100;
      padding: 10px;
      background-color: rgba(0, 15, 52, 0.9);
      .title {
        color: #206aff;
        i {
          float: right;
          font-size: 18px;
          margin: 10px;
          cursor: pointer;
        }
      }
      span {
        color: white;
      }
      .submitButton {
        width: 100%;
        position: absolute;
        bottom: 20px;
        display: flex;
        justify-content: center;
      }
      .tableBox {
        position: relative;
        p {
          color: #f05656;
          font-size: 12px;
          position: absolute;
          left: 80px;
          top: -5px;
        }
      }
    }
  }
  .bigVideo {
    position: absolute;
    width: 300px;
    left: 27%;
    top: 70px;
    min-width: 400px;
    height: 265px;
    z-index: 100;
    padding: 10px;
    background-color: rgba(0, 15, 52, 0.9);
    .title {
      color: #206aff;
      display: flex;
      justify-content: space-between;
      i {
        margin: 5px;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }

  ::v-deep .el-table__empty-text {
    padding-top: 160px;
    background-size: contain;
  }
}

::v-deep.el-progress--circle .el-progress__text,
.el-progress--dashboard .el-progress__text {
  font-size: 20px !important;
}
.dateButtonGroup {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .dateButton {
    margin: 0 5px;
    cursor: pointer;
    &:hover {
      color: #206aff;
    }
  }
  .focus {
    color: #3957ff;
  }
  // .focuss {
  //   background-color: #f7131e;
  // }
}
::v-deep.el-table.el-table--fit{
  overflow: hidden;
}
</style>
