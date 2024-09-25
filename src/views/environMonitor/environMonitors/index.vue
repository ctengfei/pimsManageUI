<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <gis-map ref="gisMap"></gis-map>
      <!-- 新增布控 -->
      <div class="rightBox">
        <div class="selectBox">
          <span style="font-size: 14px">监测站点：</span
          ><el-select
            v-model="monitors"
            style="width: 80%"
            placeholder="请选择监测设备"
            @change="selectChange"
          >
            <el-option
              v-for="(item, index) in siteNameArr"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div style="font-size: 14px; line-height: 28px">
          上报时间： {{ collectionTime }}
        </div>
        <div class="wrapCard">
          <div class="cards" v-for="(item, index) in targetArr" :key="index">
            <span class="l1">{{ item.name }}</span>
            <span class="c1"><img :src="item.img" /> {{ item.value }}</span>
            <span class="r1">{{ item.unit }}</span>
          </div>
        </div>
        <div>
          <div class="title">最近24小时环境监测趋势分析</div>
          <div class="filterTypes">
            <el-radio-group v-model="radio" @change="radioChange()">
              <el-radio
                :label="item.value"
                v-for="(item, index) in minitorProject"
                :key="index"
                :value="item.value"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </div>
          <div style="width: 100%; height: 20vh">
            <ve-line
              ref="linechart"
              :data="historypeople"
              :extend="chartExtend"
              height="100%"
              :grid="grids"
            />
          </div>
          <div class="title">最近24小时环境监测报警记录</div>
          <div style="height: calc(100% - 50px)">
            <el-table
              ref="table"
              :data="tableData"
              style="width: 100%"
              height="220px"
              @cell-mouse-enter="mouseEnter"
              @cell-mouse-leave="mouseLeave"
            >
              <el-table-column prop="detectionSiteName" label="监测站点" />
              <el-table-column prop="detectionProject" label="监测项目" />
              <el-table-column prop="concentrationValue" label="浓度值" />
              <el-table-column prop="alarmTime" width="150" label="报警时间" />
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import gisMap from "@/components/common/map/gis-map";
import pagination from "@/components/comPagination";
import $detectionAlarm from "@/api/environMonitor/detectionAlarm";
import $environMonitor from "@/api/environMonitor";
export default {
  name: "",
  components: {
    pagination,
    gisMap,
  },
  data() {
    return {
      monitors: "",
      targetArr: [],
      siteNameArr: [],
      radio: "temperature",
      chartExtend: {
        series: {
          barWidth: 10,
        },
        legend: {
          show: false,
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
      historypeople: {
        columns: ["日期", " "],
        rows: [
          {
            日期: "2021-02-1",
            " ": 12,
          },
          {
            日期: "2021-02-2",
            " ": 2,
          },
          {
            日期: "2021-02-6",
            " ": 123,
          },
        ],
      },
      grids: {
        top: 30,
        bottom: 0,
      },
      minitorProject: [
        {
          name: "温度",
          value: "temperature",
        },
        {
          name: "湿度",
          value: "humidity",
        },
        {
          name: "PM2.5",
          value: "PM2.5",
        },
        {
          name: "CO₂",
          value: "co2",
        },

        {
          name: "TVOC",
          value: "tvoc",
        },
      ],
      tableData: [],
      timer: null,
      collectionTime: "",
    };
  },
  watch: {},
  beforeDestroy() {},
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(null); // 销毁定时器
  },
  methods: {
    // 初始化数据
    init() {
      // 获取全部站点
      this.getSiteAll();
      setTimeout(() => {
        // 获取最新上报的指标数据
        this.detectionLatest();
        // 获取24小时告警信息
        this.detectionAlarm24h();
        // 获取24小时监测趋势分析
        this.detection24h();
        this.handScroll();
      }, 500);
    },
    // 鼠标移入
    mouseEnter() {
      clearInterval(this.timer);
      this.timer = null;
    },
    //鼠标移出
    mouseLeave() {
      this.handScroll();
    },
    // 表格自动滚动
    handScroll() {
      clearInterval(this.timer);
      const table = this.$refs.table;
      const divData = table.bodyWrapper;
      this.timer = setInterval(() => {
        divData.scrollTop += 1;
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          divData.scrollTop = 0;
        }
      }, 60);
    },
    // 获取站点名称
    getSiteAll() {
      $environMonitor
        .getSiteAll({
          position: "outdoor",
        })
        .then((res) => {
          this.siteNameArr = res.data;
          this.$nextTick((_) => {
            this.monitors = this.siteNameArr[0].id;
          });
        });
    },
    // 选择指标切换
    radioChange() {
      // 获取24小时监测趋势分析
      this.detection24h();
    },
    //   选择监测站点
    selectChange(item) {
      this.monitors = item;
      // 获取最新上报的指标数据
      this.detectionLatest();
      // 获取24小时告警信息
      this.detectionAlarm24h();
      // 获取24小时监测趋势分析
      this.detection24h();
      this.handScroll();
    },
    // 获取最新上报监测指标
    detectionLatest() {
      $environMonitor.detectionLatest(this.monitors).then((res) => {
        this.collectionTime = res.data.collectionTime;
        let obj = res.data;
        let temp = [];
        for (let key in obj) {
          if (key == "pm2Point5") {
            temp.push({
              name: "PM 2.5",
              value: obj[key],
              unit: "ug/m³",
              img: require("@/assets/wq/pm1.png"),
            });
          } else if (key == "temperature") {
            temp.push({
              name: "温度",
              value: obj[key],
              unit: "°C",
              img: require("@/assets/wq/wd.png"),
            });
          } else if (key == "humidity") {
            temp.push({
              name: "湿度",
              value: obj[key],
              unit: "%rh",
              img: require("@/assets/wq/sd.png"),
            });
          } else if (key == "co2") {
            temp.push({
              name: "CO₂",
              value: obj[key],
              unit: "%rh",
              img: require("@/assets/wq/fs.png"),
            });
          } else if (key == "tvoc") {
            temp.push({
              name: "tvoc",
              value: obj[key],
              unit: "kpa",
              img: require("@/assets/wq/fx.png"),
            });
          }
        }
        this.targetArr = temp;
      });
    },
    // 获取24小时监测趋势分析
    detection24h() {
      $environMonitor
        .detection24h(`${this.monitors}/${this.radio}`)
        .then((res) => {
          let temp = [];
          res.data.map((item) => {
            temp.push({
              日期: item.collectionTime,
              " ": item.value,
            });
          });
          let data = {
            columns: ["日期", " "],
            rows: temp,
          };
          this.historypeople = data;
        });
    },
    // 获取24小时告警信息
    detectionAlarm24h() {
      $detectionAlarm.detectionAlarm24h(this.monitors).then((res) => {
        this.tableData = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-radio {
  margin-right: 15px;
  color: #000;
}

.filterTypes {
  position: absolute;
  z-index: 999;
  left: 30px;
}

.app-container-gis {
  position: relative;

  #cesiumContainer {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;

    .rightBox {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 31.5%;
      min-width: 350px;
      height: 98%;
      z-index: 100;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 10px;
      background-color: #f5f7fa;
      color: #000;
    }
  }
}

.selectBox {
  display: flex;
  align-items: center;
}

.wrapCard {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .cards {
    width: 160px;
    height: 75px;
    background: rgba(22, 132, 252, 0.45);
    margin: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: flex-start;
    font-size: 14px;
    padding: 10px;

    .c1 {
      margin-left: 20px;
      display: flex;
      align-items: center;
      margin-top: 10px;

      img {
        width: 20px;
        height: 20px;
        border: 0px;
        margin-right: 10px;
      }
    }

    .r1 {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
  }
}

.title {
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: rgb(45, 109, 255);
  margin: 10px;
}
</style>
  