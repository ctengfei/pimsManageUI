<template>
  <div class="app-container">
    <div class="boxs">
      <div class="boxTop">
        <comCard :spanList="entrAndPersonList"></comCard>
      </div>
      <el-row class="boxBottom">
        <el-col :span="12">
          <div style="width: 100%; height: 300px">
            <div class="dateButton">
              <p>人员统计趋势</p>
              <div class="btns">
                <span
                  v-for="(item, index) in filterSelectTypes"
                  :key="index"
                  :value="item.type"
                  @click="chooseDates(item.type)"
                  class="dateButton"
                  plain
                  :class="[
                    item.type === filterSelectTypies ? 'bluebg' : 'whitebg',
                  ]"
                  >{{ item.name }}</span
                >
                <div>
                  <el-date-picker
                    v-model="value1"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @change="selectDate"
                  >
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div style="width: 100%; height: 200px">
              <ve-line
                :data="personOut"
                :extend="chartExtend"
                height="100%"
                :grid="grids"
              >
              </ve-line>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="width: 100%; height: 300px">
            <div class="dateButton">
              <p>人员进出分析</p>
              <div class="btns">
                <span
                  v-for="(item, index) in filterSelectTypes"
                  :key="index"
                  :value="item.type"
                  @click="chooseDates2(item.type)"
                  class="dateButton"
                  plain
                  :class="[item.type === filterSelectTypies2 ? 'bluebg' : 'whitebg']"
                  >{{ item.name }}</span
                >
                <div>
                  <el-date-picker
                    v-model="value2"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @change="selectDate2"
                  >
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div style="height: 80%">
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
          <div style="width: 100%; height: 300px">
            <div class="dateButton">
              <p>门闸放行排行榜（TOP5）</p>
              <div class="btns">
                <span
                  v-for="(item, index) in filterSelectTypes"
                  :key="index"
                  :value="item.type"
                  @click="chooseDates3(item.type)"
                  class="dateButton"
                  plain
                  :class="[item.type === filterSelectTypies3 ? 'bluebg' : 'whitebg']"
                  >{{ item.name }}</span
                >
                <div>
                  <el-date-picker
                    v-model="value3"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @change="selectDate3"
                  >
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div style="height: 100%">
              <ve-bar
                :data="chartData"
                :extend="chartExtendBars"
                height="100%"
                :grid="gridBar"
                ref="histogramchart"
              >
              </ve-bar>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="width: 100%; height: 300px">
            <div class="dateButton">
              <p>访客到访趋势</p>
              <div class="btns">
                <span
                  v-for="(item, index) in filterSelectTypes"
                  :key="index"
                  :value="item.type"
                  @click="chooseDates4(item.type)"
                  class="dateButton"
                  plain
                  :class="[
                    item.type === filterSelectTypies4 ? 'bluebg' : 'whitebg',
                  ]"
                  >{{ item.name }}</span
                >
                <div>
                  <el-date-picker
                    v-model="value4"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @change="selectDate4"
                  >
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div style="height: 100%">
              <ve-line
                :data="chartcarData"
                :extend="chartExtend"
                height="100%"
                :grid="grid"
              >
              </ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
  
  <script>
import * as $peopleStatistic from "@/api/peopleManage/peopleStatistics";
import comCard from "@/components/comCard";
export default {
  name: "PersonAndVehicleStatistics",
  components: {
    comCard,
  },
  data() {
    return {
      test: "100%",
      // 距离周围的距离
      grid: {
        top: 40,
        bottom: 20,
      },
      gridBar: {
        top: 40,
        bottom: 30,
        containLabel: true,
      },
      grids: {
        top: 40,
        bottom: 20,
      },
      piechartExtend: {
        series: {
          center: ["50%", "50%"],
        },
        legend: {
          pageTextStyle: {
            color: "#000", //翻页数字颜色
          },
          pageIconColor: "#206aff",
          pageIconInactiveColor: "#202230",
          type: "scroll",
          textStyle: {
            color: "#000", //图例字体颜色
          },
        },
      },
      piechartSettings: {
        radius: ["40%", "50%"],
      },
      // 人员日流量数据
      chartData: {},
      chartcarData: {},
      chartcarDatas: {},
      cameraForm: {
        name: "",
        latitude: "",
        longitude: "",
        position: "",
      },
      workcons: [
        {
          label: "在园人数",
          num: 0,
        },
        {
          label: "访客数量",
          num: 0,
        },
        {
          label: "车位总数",
          num: 0,
        },
        {
          label: "剩余车位",
          num: 0,
        },
      ],
      chartExtendBars: {
        barWidth: 20,
        height: 'auto',
        grid: {
          show: true,
        },
        xAxis: {
          gridIndex: 0,
          position: 'bottom',
          min: 0, //取最小值为最小刻度
          max: "dataMax" ? "dataMax" : 100, //取最大值为最大刻度
        },
        yAxis: {
          show: true,
        }
      },
      chartExtends: {
        legend: {
          show: false,
          pageTextStyle: {
            color: "#000", //翻页数字颜色
          },
          pageIconColor: "#206aff",
          pageIconInactiveColor: "#202230",
          textStyle: {
            color: "#000",
          },
        },
        xAxis: {
          show: true,
          splitNumber: 9,
          min: "dataMin", //取最小值为最小刻度
          max: "dataMax", //取最大值为最大刻度
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
            color: "#000",
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
            show: true,
          },
          // x轴对应的竖线
          splitLine: {
            show: true,
            lineStyle: {
              color: "#000",
              opacity: "0.1",
              backgroundColor: "#000",
            },
          },
          // 坐标轴刻度
          axisTick: {
            show: false,
            interval: 2,
            min: 0, // 坐标轴刻度最小值
          },
          boundaryGap: false,
          axisLabel: {
            color: "#000",
          },
        },
      },
      chartExtend: {
        legend: {
          pageTextStyle: {
            color: "#000", //翻页数字颜色
          },
          pageIconColor: "#206aff",
          pageIconInactiveColor: "#202230",
          textStyle: {
            color: "#000",
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
            color: "#000",
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
          splitNumber: 2,
          min: "dataMin" ? "dataMin" : 10, //取最小值为最小刻度
          max: "dataMax" ? "dataMax" : 100, //取最大值为最大刻度
          minInterval: 5, //分割刻度
          scale: true, //自适应
          // 坐标轴轴线
          axisLine: {
            show: false,
          },
          // x轴对应的竖线
          splitLine: {
            show: true,
            lineStyle: {
              color: "#000",
              opacity: "0.1",
              backgroundColor: "#000",
            },
          },
          // 坐标轴刻度
          axisTick: {
            show: false,
            length: 4,
          },
          boundaryGap: false,
          axisLabel: {
            color: "#000",
          },
        },
      },
      filterSelectTypes: [
        {
          type: 0,
          name: "今日",
        },
        {
          type: -1,
          name: "昨日",
        },
      ],
      entrAndPersonList: [],
      personOut: {},
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      filterSelectTypies: 0,
      filterSelectTypies2: 0,
      filterSelectTypies3: 0,
      filterSelectTypies4: 0,
    };
  },
  watch: {},
  created() {},
  mounted() {
    // this.getPeopleData();
    let temp = this.getDateStr(0);
    this.getEntrAndPersonPass();
    this.getpersonOut(temp);
    this.getPersonOutPie(temp);
    this.getEntranceOutOrEnter(temp);
    this.getVisitorAccess(temp);

    window.addEventListener("resize", this.resizeTheChart);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTheChart());
  },
  methods: {
    // top统计
    getEntrAndPersonPass() {
      $peopleStatistic.entrAndPersonPass().then((res) => {
        this.entrAndPersonList = [
          { name: "门闸数", num: res.data.entranceNum },
          { name: "授权人数", num: res.data.entrancePermissionNum },
          { name: "今日进入人次", num: res.data.entranceNum },
          { name: "今日离开人次", num: res.data.todayPersonOutNum },
          { name: "今日到访人次", num: res.data.todayPersonAccessNum },
        ];
      });
    },
    // 获取日期
    getDateStr(AddDayCount) {
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      return y + "-" + `${m}`.padStart(2, "0") + "-" + d;
    },
    get24HoursTime() {
      let timeArr = [];
      for (let i = 0; i < 24; i++) {
        let hour = i < 10 ? `0${i}` : i;
        timeArr.push(`${hour}:00`);
      }
      return timeArr;
    },
    // 获取人员进出趋势
    getpersonOut(date) {
      $peopleStatistic.personEnterOutTrend({ date: date }).then((res) => {
        let row = [];
        let hours = this.get24HoursTime();

        for (let j in res.data) {
          if (res.data[j].passType == "ENTER") {
            row.push({
              时间: res.data[j].hour,
              离开: 0,
              进入: res.data[j].num,
            });
          } else if (res.data[j].passType == "OUT") {
            row.push({
              时间: res.data[j].hour,
              离开: res.data[j].num,
              进入: 0,
            });
          }
        }
        for (let i = 0; i < 24; i++) {
          const hourStr = `${i}`.padStart(2, "0") + ":00";
          if (!row.some((record) => record.时间 === hourStr)) {
            row.push({ 时间: hourStr, 离开: 0, 进入: 0 });
          }
        }
        row.sort((a, b) => a.时间.localeCompare(b.时间));
        let data = {
          columns: ["时间", "进入", "离开"],
          rows: row,
        };
        this.personOut = data;
      });
    },
    // 人员进出方式
    getPersonOutPie(date) {
      $peopleStatistic.personEnterOutPancakeVo({ date: date }).then((res) => {
        let temp = [];
        res.data.map((item) => {
          if (item.openingMode == "FACE") {
            temp.push({
              出行方式: item.openingModeName,
              数量: item.num,
            });
          } else if (item.openingMode == "QRCODE") {
            temp.push({
              出行方式: item.openingModeName,
              数量: item.num,
            });
          } else {
            temp.push({
              出行方式: item.openingModeName,
              数量: item.num,
            });
          }
        });
        let data = {
          columns: ["出行方式", "数量"],
          rows: temp,
        };
        this.chartcarDatas = data;
      });
    },
    getEntranceOutOrEnter(date) {
      $peopleStatistic.entranceOutOrEnter({ date: date }).then((res) => {
        let temp = [];
        res.data.map((item) => {
          temp.push({
            数量: item.enterOrOutNum,
            排行: item.entranceName,
          });
        });
        let data = {
          columns: ["排行", "数量"],
          rows: temp,
        };
        this.chartData = data;
      });
    },
    resizeTheChart() {
      if (this.$refs.linechart) {
        this.$refs.linechart.resize();
      }
      if (this.$refs.histogramchart) {
        this.$refs.histogramchart.resize();
      }
    },
    chooseDates(date) {
      this.filterSelectTypies = date;
      this.getpersonOut(this.getDateStr(date));
    },
    chooseDates2(date) {
      this.filterSelectTypies2 = date;
      this.$forceUpdate();
      this.getPersonOutPie(this.getDateStr(date));
    },
    chooseDates3(date) {
      this.filterSelectTypies3 = date;
      this.$forceUpdate();
      this.getEntranceOutOrEnter(this.getDateStr(date));
    },
    chooseDates4(date) {
      this.filterSelectTypies4 = date;
      this.$forceUpdate();
      this.getVisitorAccess(this.getDateStr(date));
    },
    // 人员进出趋势 选择日期
    selectDate(e) {
      console.log(e, "selectDateselectDate");
      this.getpersonOut(e);
    },
    // 人员出行方式 选择日期
    selectDate2(e) {
      this.getPersonOutPie(e);
    },
    // 门闸放行排行 选择日期
    selectDate3(e) {
      this.getEntranceOutOrEnter(e);
    },
    // 访客到访趋势 选择日期
    selectDate4(e) {
      this.getVisitorAccess(e);
    },

    // 访客到访趋势
    getVisitorAccess(date) {
      $peopleStatistic.visitorAccess({ date: date }).then((res) => {
        let temp = [];
        res.data.map((item) => {
          temp.push({
            时间: item.hour,
            数量: item.num,
          });
        });
        for (let i = 0; i < 24; i++) {
          const hourStr = `${i}`.padStart(2, "0") + ":00";
          if (!temp.some((record) => record.时间 === hourStr)) {
            temp.push({ 时间: hourStr, 数量: 0 });
          }
        }
        temp.sort((a, b) => a.时间.localeCompare(b.时间));
        let data = {
          columns: ["时间", "数量"],
          rows: temp,
        };
        this.chartcarData = data;
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped>
::v-deep svg path:first-child {
  stroke: #31364a;
}
.color {
  color: #206aff;
}
.dateButton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btns {
    display: flex;
    width: 40%;
    span {
      margin: 0 5px;
      padding: 0 5px;
      cursor: pointer;
      // border: 1px solid #dcdfe6;
      // background-color: #409EFF;
      // color: white;
    }
  }
}
.boxs {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.boxTop {
  height: 100px;
  cursor: default;
}
.boxBottom {
  width: 100%;
}
.bluebg {
  color: white;
  background-color: #206aff;
}
.whitebg {
  color: #206aff;
  background-color: white;
  border: 1px solid #dcdfe6;
}
</style>
  