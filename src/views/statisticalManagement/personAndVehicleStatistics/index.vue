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
      <div style="width: 100%; height: 30%">
        <p class="titles">
          <img src="@/assets/images/arrow.png" alt="" />
          人员分类
        </p>
        <div style="height: 100%">
          <ve-ring
            :data="chartDatas"
            :settings="piechartSettings"
            height="100%"
            ref="piechart"
            :extend="piechartExtend"
          ></ve-ring>
        </div>
      </div>
      <div style="width: 100%; height: 30%">
        <p style="width: 100%; text-align: left; color: #fff">
          <img src="@/assets/images/arrow.png" alt="" />
          人员日流量
        </p>
        <div style="height: 100%">
          <ve-histogram
            :data="chartData"
            :extend="chartExtend"
            height="100%"
            :grid="grid"
            ref="histogramchart"
            :settings="chartSettings"
          >
          </ve-histogram>
        </div>
      </div>
      <div style="width: 100%; height: 30%">
        <div class="dateButtonGroup">
          <p><img src="@/assets/images/arrow.png" alt="" />历史人员流量</p>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDate(item.type)"
              class="dateButton"
              plain
              :class="[item.type === filterSelectType ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <div style="height: 100%">
          <ve-line
            ref="linechart"
            :data="historypeople"
            :extend="chartExtend"
            height="100%"
            :grid="grids"
          >
          </ve-line>
        </div>
      </div>
    </div>
    <div class="middletop">
      <div v-for="(item, index) in workcons" :key="index" @click="jumpDetail(item)">
        <p class="nums">{{ item.num }}</p>
        <p class="labels">{{ item.label }}</p>
      </div>
    </div>
    <div class="rightbgc">
      <div style="width: 100%; height: 30%">
        <p class="titles">
          <img src="@/assets/images/arrow.png" alt="" />
          车辆统计
        </p>
        <div style="height: 100%">
          <ve-ring
            :data="chartcarDatas"
            :settings="piechartSettings"
            height="100%"
            :extend="piechartExtend"
          ></ve-ring>
        </div>
      </div>
      <div style="width: 100%; height: 30%">
        <p style="width: 100%; text-align: left; color: #fff">
          <img src="@/assets/images/arrow.png" alt="" />
          车辆日流量
        </p>
        <div style="height: 100%">
          <ve-histogram
            :data="chartcarData"
            :extend="chartExtend"
            height="100%"
            :grid="grid"
            :settings="chartSettings"
          >
          </ve-histogram>
        </div>
      </div>
      <div style="width: 100%; height: 30%">
        <div class="dateButtonGroup">
          <p><img src="@/assets/images/arrow.png" alt="" />历史车辆流量</p>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDates(item.type)"
              class="dateButton"
              plain
              :class="[item.type === filterSelectTypies ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <div style="height: 100%">
          <ve-line
            :data="historycar"
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
import gisMap from "@/components/common/map/gis-map";
import { getStringByKey, getObjByKey } from "@/utils/voice.js";
import {
  parkingLot,
  statistics,
  peopleNum,
  peopleNums
} from "@/api/statisticalManagement/overallStatistics.js";
export default {
  name: 'PersonAndVehicleStatistics',
  components: {
    gisMap
  },
  data() {
    return {
      test: "100%",
      // 距离周围的距离
      grid: {
        top: 20,
        bottom: 10
      },
      grids: {
        top: 20,
        bottom: 10
      },
      piechartExtend: {
        series: {
          type: 'pie',
          center: ["50%", "50%"]
        },
        legend: {
          pageTextStyle: {
            color: "#fff" //翻页数字颜色
          },
          pageIconColor:'#206aff',
          pageIconInactiveColor:'#202230',
          type: "scroll",
          textStyle: {
            color: "#fff" //图例字体颜色
          }
        }
      },
      piechartSettings: {
        type: "pie",
        radius: ["40%", "50%"]
      },
      // 历史人员流量数据
      historypeople: {},
      historycar: {},
      // 人员日流量数据
      chartData: {},
      chartcarData: {},
      // 人员分类数据
      chartDatas: {},
      chartcarDatas: {},
      defaultPieChart: null,
      defaultLineChart: null,
      cameraForm: {
        name: "",
        latitude: "",
        longitude: "",
        position: ""
      },
      workcons: [
        {
          label: "在园人数",
          num: 0
        },
        {
          label: "访客数量",
          num: 0
        },
        {
          label: "车位总数",
          num: 0
        },
        {
          label: "剩余车位",
          num: 0
        }
      ],
      chartSettings: {
        showLine: ["出园"]
      },
      chartExtend: {
        series: [{
          type: 'line',
        },{
          type: 'bar',
          barWidth: 10
        }],
        legend: {
          pageTextStyle: {
            color: "#fff" //翻页数字颜色
          },
          pageIconColor:'#206aff',
          pageIconInactiveColor:'#202230',
          textStyle: {
            color: "#fff"
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
            color: "#fff",
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
          // 坐标轴轴线
          axisLine: {
            show: false
          },
          // x轴对应的竖线
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff",
              opacity: "0.1",
              backgroundColor: "#fff"
            }
          },
          // 坐标轴刻度
          axisTick: {
            show: false
          },
          boundaryGap: false,
          axisLabel: {
            color: "#fff"
          }
        }
      },
      filterSelectType: "WEEK",
      filterSelectTypies: "WEEK",
      cameraImg: require("../../../assets/images/map/camera.png"),
      changeImg: require("../../../assets/images/map/camera-erry.png"),
      filterSelectTypes: [
        {
          type: "WEEK",
          name: "周"
        },
        {
          type: "MONTH",
          name: "月"
        },
        {
          type: "YEAR",
          name: "年"
        }
      ]
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getPeopleData();
    this.getPeopleDatas();
    this.getpeopleDataday();
    this.getcarDataday();

    this.getcarData();
    this.getcarDatas();
    window.addEventListener("resize", this.resizeTheChart);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTheChart());
  },
  methods: {
    // 跳转详情
    jumpDetail(item){
      if(item.label=="访客数量"){
        this.$router.push({name:"PeopleBase",query:{id:'VISITOR'}})
      }
    },
    resizeTheChart() {
      if (this.$refs.linechart) {
        this.$refs.linechart.resize();
      }
      if (this.$refs.piechart) {
        this.$refs.piechart.resize();
      }
      if (this.$refs.histogramchart) {
        this.$refs.histogramchart.resize();
      }
    },
    chooseDate(date) {
      this.filterSelectType = date;
      this.getPeopleDatas();
    },
    chooseDates(date) {
      this.filterSelectTypies = date;
      this.$forceUpdate();
      this.getcarDatas();
    },
    // 求和
    sum(arr) {
      return arr.reduce(function(prev, curr, idx, arr){
          return prev + curr;
      });
    },
    getPeopleData() {
      peopleNum().then(res => {
        let data = {
          columns: ["人员类型", "数量"],
          rows: [
            { 人员类型: "企业人员", 数量: res.data.staff },
            { 人员类型: "内部人员", 数量: res.data.selfStaff },
            { 人员类型: "访客", 数量: res.data.visitor }
          ]
        };
        let datas = res.data.staff + res.data.selfStaff + res.data.visitor;
        this.workcons[1].num = res.data.visitor>100000?parseInt(res.data.visitor/10000)+'w':res.data.visitor
        this.chartDatas = data;
      });
    },
    getPeopleDatas() {
      let category = this.filterSelectType;
      peopleNums(category).then(res => {
        let row = [];
        if (
          res.data.timeList.length &&
          res.data.outData.length &&
          res.data.inData.length
        ) {
          for (let i in res.data.timeList) {
            row.push({
              时间: category!=='YEAR'?res.data.timeList[i].substring(5):res.data.timeList[i].substring(5)+"月",
              入园: res.data.inData[i],
              出园: res.data.outData[i]
            });
          }
        }
        let data = {
          columns: ["时间", "出园", "入园"],
          rows: row
        };
        this.historypeople = data;
      });
    },
    getcarData() {
      parkingLot().then(res => {
        let data = {
          columns: ["车位类型", "数量"],
          rows: [
            { 车位类型: "车位总数", 数量: res.data.totalNum },
            { 车位类型: "剩余车位", 数量: res.data.totalRemainNum },
            { 车位类型: "已停车位", 数量: res.data.totalStopNum }
          ]
        };
        this.chartcarDatas = data;
        let datas = res.data.totalNum + res.data.totalRemainNum + res.data.totalStopNum;
        this.workcons[2].num = datas>100000?parseInt(datas/10000)+'w':datas
        this.workcons[3].num = res.data.totalRemainNum>100000?parseInt(res.data.totalRemainNum/10000)+'w':res.data.totalRemainNum
      });
    },
    getcarDatas() {
      let category = this.filterSelectTypies;
      statistics(category).then(res => {
        let row = [];
        if (
          res.data.timeList.length &&
          res.data.outData.length &&
          res.data.inData.length
        ) {
          for (let i in res.data.timeList) {
            row.push({
              时间: category!=='YEAR'?res.data.timeList[i].substring(5):res.data.timeList[i].substring(5)+"月",
              入园: res.data.inData[i],
              出园: res.data.outData[i]
            });
          }
        }
        let data = {
          columns: ["时间", "出园", "入园"],
          rows: row
        };
        this.historycar = data;
      });
    },
    getcarDataday() {
      let category = "DAY";
      statistics(category).then(res => {
        let row = [];
        if (
          res.data.timeList.length &&
          res.data.outData.length &&
          res.data.inData.length
        ) {
          for (let i in res.data.timeList) {
            row.push({
              时间: res.data.timeList[i].split(" ")[1] + "点",
              入园: res.data.inData[i],
              出园: res.data.outData[i]
            });
          }
        }
        let data = {
          columns: ["时间", "出园", "入园"],
          rows: row
        };
        this.chartcarData = data;
      });
    },
    getpeopleDataday() {
      let category = "DAY";
      peopleNums(category).then(res => {
        let row = [];
        if (
          res.data.timeList.length &&
          res.data.outData.length &&
          res.data.inData.length
        ) {
          for (let i in res.data.timeList) {
            row.push({
              时间: res.data.timeList[i].split(" ")[1] + "点",
              入园: res.data.inData[i],
              出园: res.data.outData[i]
            });
          }
        }
        let data = {
          columns: ["时间", "出园", "入园"],
          rows: row
        };
        this.chartData = data;
        let nums = this.sum(res.data.inData) - this.sum(res.data.outData)
        this.workcons[0].num = nums > 0 ? nums : 0
      });
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
    getMouseLOcation(e) {}
  }
};
</script>

<style lang="scss" scoped>
::v-deep.wl-transfer .el-tree {
  background-color: inherit;
}

::v-deep.wl-transfer .transfer-title {
  background-color: inherit;
  color: #fff;
}
::v-deep svg path:first-child {
  stroke: #31364a;
}
.color {
  color: #206aff;
}
.dateButtonGroups {
  text-align: right !important;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 10%;
  .dateButton {
    margin: 0 5px;
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
.bigbgc {
  .titles {
    width: 100%;
    margin: 0 0 20px 0;
    text-align: left;
    color: #fff;
  }
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
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.35) 34%,
    rgba(0, 0, 0, 0.2) 100%
  );
  height: calc(100vh - 120px);
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
    cursor: pointer;
    color: #ffffff;
    height: 100%;
    width: 100%;
    background-color: rgba(64, 66, 80, 0.5);
    border-radius: 32px 8px 32px 8px;
    margin: 0 10px;
    text-align: center;
    .labels {
      font-size: 16px;
    }
    .nums {
      font-size: 39px;
      margin-top: 12px;
    }
  }
}
.rightbgc {
  .titles {
    width: 100%;
    margin: 0 0 20px 0;
    text-align: left;
    color: #fff;
  }
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
    to left,
    rgba(0, 0, 0, 0.7) 0%,
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
}
.focus {
  color: #206aff;
}
</style>
