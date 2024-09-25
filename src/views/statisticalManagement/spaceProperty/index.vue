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
      <div style="width: 100%; height: 15%">
        <p class="titles">
          <img src="@/assets/images/arrow.png" alt="" />
          维修工单统计
        </p>
        <div class="topinfo">
          <div v-for="(item, index) in allWork" :key="index">
            <el-progress
              stroke-linecap="square"
              color="#206aff"
              type="circle"
              :percentage="setItemProgress(item, allWork) || 0"
              :format="setItemText(item)"
              :stroke-width="5"
              :width="progresswidth"
            ></el-progress>
            <p>{{ item.label }}</p>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 30%">
        <p style="width: 100%; text-align: left; color: #fff; margin: 20px 0">
          <img src="@/assets/images/arrow.png" alt="" />
          工单分类统计
        </p>
        <div style="height: 100%">
          <ve-ring
            :grid="grid"
            :data="orderchartData"
            :settings="orderpiechartSettings"
            height="100%"
            ref="piechart"
            :extend="piechartExtend"
          ></ve-ring>
        </div>
      </div>
      <div style="width: 100%; height: 35%">
        <div class="dateButtonGroup">
          <p><img src="@/assets/images/arrow.png" alt="" />历史工单统计</p>
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
            :grid="grid"
            :data="chartDatas"
            :settings="chartSettingline"
            height="100%"
            :extend="chartLineExtend"
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
      <div style="width: 100%; height: 50%">
        <p
          style="
            width: 100%;
            text-align: left;
            color: #fff;
            margin-bottom: 20px;
          "
        >
          <img src="@/assets/images/arrow.png" alt="" />
          合同分类统计
        </p>
        <ve-ring
          ref="piechart"
          :data="chartData"
          :settings="piechartSettings"
          height="100%"
          :grid="grid"
          :extend="piechartExtend"
        ></ve-ring>
      </div>
      <div style="width: 100%; height: 50%; margin-top: 20px">
        <p class="titles">
          <img src="@/assets/images/arrow.png" alt="" />房屋出租统计
        </p>
         <ve-histogram
          ref="histogramcharts"
          :data="orderchartDatas"
          :extend="chartExtend"
          height="100%"
          :grid="grids"
        >
        </ve-histogram>
      </div>
    </div>
  </div>
</template>

<script>
import {
  initSpanData,
  initTabData,
  initPieData,
  initLineData,
  initFillData
} from "@/api/smartProperty/workbench";
import gisMap from "@/components/common/map/gis-map";
import { getStringByKey, getObjByKey } from "@/utils/voice.js";
import {
  orderNum,
  orderNumber,
  orderNums,
  orderNumday,
  contractNum,
  homenum,
  officenum
} from "@/api/statisticalManagement/overallStatistics.js";
export default {
  name: 'SpaceProperty',
  components: {
    gisMap
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      progresswidth: 80,
      grid: {
        bottom: 10
      },
      grids: {
        top:40,
        bottom: 35
      },
      piechartExtend: {
        series: {
          type: 'pie',
          center: ["50%", "50%"]
        },
        legend: {
          show: true,
          pageIconColor: "#206aff",
          pageIconInactiveColor: "#202230",
          type: "scroll",
          textStyle: {
            color: "#fff" //图例字体颜色
          },
          pageTextStyle: {
            color: "#fff" //翻页数字颜色
          }
        }
      },
      piechartSettings: {
        type: "pie",
        radius: ["0%", "50%"]
      },
      orderpiechartSettings: {
        type: "pie",
        radius: ["40%", "50%"]
      },
      orderpiechartSettingss: {
        roseType:'radius',
        radius: ["0%", "50%"]
      },
      chartExtend: {
        xAxis: {
          axisLabel: {
            textStyle: {
              color: "#fff" //x轴字体颜色
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: "#fff" //y轴字体颜色
            }
          },
          splitLine: {
            lineStyle: {
              color: "#fff",
              width: 0.5 //线宽
            }
          }
        },
        legend: {
          pageTextStyle: {
            color: "#fff" //翻页数字颜色
          },
          pageIconColor: "#206aff",
          pageIconInactiveColor: "#202230",
          type: "scroll",
          textStyle: {
            color: "#fff" //图例字体颜色
          }
        },
        series: {
          type: 'bar',
          barMaxWidth: 10
        },
      },
      chartLineExtend: {
        xAxis: {
          axisLabel: {
            textStyle: {
              color: "#fff" //x轴字体颜色
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: "#fff" //y轴字体颜色
            }
          },
          splitLine: {
            lineStyle: {
              color: "#fff",
              width: 0.5 //线宽
            }
          }
        },
        legend: {
          pageTextStyle: {
            color: "#fff" //翻页数字颜色
          },
          pageIconColor: "#206aff",
          pageIconInactiveColor: "#202230",
          type: "scroll",
          textStyle: {
            color: "#fff" //图例字体颜色
          }
        },
        series: {
          type: 'line',
          barMaxWidth: 10
        },
      },
      chartSettings: {
        type: "pie",
        roseType: "radius",
        radius: "80"
      },
      chartSettingline: {
        area: true,
        itemStyle: {
          //面积图颜色设置
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(11,143,148)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(129,248,252)" // 100% 处的颜色
              }
            ],
            globalCoord: false // 缺省为 false
          }
        }
      },
      chartData: {},
      chartDatas: {},
      orderchartData: {},
      orderchartDatas: {},
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
          label: "工单总数",
          num: 0
        },
        {
          label: "待处理工单",
          num: 0
        },
        {
          label: "待生效合同",
          num: 0
        },
        {
          label: "生效合同",
          num: 0
        }
      ],
      allWork: [
        {
          label: "工单总数",
          num: 0
        },
        {
          label: "今日工单",
          num: 0
        },
        {
          label: "待处理工单",
          num: 0
        }
      ],
      homenums: [],
      officenums: [
        {
          label: "北向会议室使用率",
          num: 0
        },
        {
          label: "南向会议室使用率",
          num: 0
        }
      ],
      filterSelectType: "week",
      cameraImg: require("../../../assets/images/map/camera.png"),
      changeImg: require("../../../assets/images/map/camera-erry.png"),
      filterSelectTypes: [
        {
          type: "week",
          name: "周"
        },
        {
          type: "month",
          name: "月"
        },
        {
          type: "year",
          name: "年"
        }
      ]
    };
  },
  watch: {
    screenWidth(val) {
      console.log(val,'0');
      if (val > 1920) {
        this.progresswidth = 120;
      }
      if (val <= 1920 && val > 1536) {
        this.progresswidth = 80;
      }
      if (val <= 1536 && val > 1280) {
        this.progresswidth = 70;
      }
      if (val <= 1280) {
        this.progresswidth = 50;
      }
      this.screenWidth = val;
    }
  },
  created() {
    let val = document.body.clientWidth;
     if (val > 1920) {
        this.progresswidth = 120;
      }
      if (val <= 1920 && val > 1536) {
        this.progresswidth = 80;
      }
      if (val <= 1536 && val > 1280) {
        this.progresswidth = 70;
      }
      if (val <= 1280) {
        this.progresswidth = 50;
      }
    this.screenWidth = val;
  },
  mounted() {
    window.addEventListener("resize", this.resizeTheChart);
    this.getleftmiddleData();
    this.getlefttopData();
    this.getrighttopData();
    this.getleftbottomData();
    this.getleftdayData();
    // this.getofficeData();
    this.gethomeData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTheChart());
  },
  methods: {
    // 跳转详情
    jumpDetail(item){
      if(item.label == "工单总数"){
        this.$router.push({name:"Infomation"})
      }else if(item.label == "待处理工单"){
        this.$router.push({name:"Infomation",query:{id:'TODO'}})
      }else if(item.label == "待生效合同"){
        this.$router.push({name:"InfoManagement",query:{id:"SIGNED",value:1}})
      }else{
        this.$router.push({name:"InfoManagement",query:{id:"VALID",value:2}})
      }
    },
    resizeTheChart() {
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;
      // this.$refs.progresswidths.resize();
      if (this.$refs.runTimes_creditChart) {
        this.$refs.runTimes_creditChart.resize();
      }
      if (this.$refs.piechart) {
        this.$refs.piechart.resize();
      }
      if (this.$refs.linechart) {
        this.$refs.linechart.resize();
      }
    },
    setItemProgressr(data, nums) {
      if (data) {
        return parseInt((data.num / data.nums).toFixed(2) * 100);
      } else {
        return 0 + "";
      }
    },
    setItemProgress(data, nums) {
      if (data) {
        return parseInt((data.num / nums[0].num).toFixed(2) * 100);
      } else {
        return 0 + "";
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
    chooseDate(date) {
      this.filterSelectType = date;
      this.getleftbottomData();
    },
    getlefttopData() {
      orderNum().then(res => {
        this.allWork[0].num = res.data.totalAmount;
        this.allWork[2].num = res.data.todoAmount;
        this.workcons[0].num =
          res.data.totalAmount > 100000
            ? parseInt(res.data.totalAmount / 10000) + "w"
            : res.data.totalAmount;
        this.workcons[1].num =
          res.data.todoAmount > 100000
            ? parseInt(res.data.todoAmount / 10000) + "w"
            : res.data.todoAmount;
      });
    },
    getleftdayData() {
      orderNumday().then(res => {
        this.allWork[1].num = res.data;
      });
    },
    getofficeData() {
      officenum().then(res => {
        this.officenums[0].num = res.data*100;
        this.officenums[1].num = 0;
      });
    },
    gethomeData() {
      homenum().then(res => {
        let datas = [];
        res.data.data.forEach(item => {
          datas.push({ 房间分类: item.name, 已出租数量: item.roomSum - item.surplusRoomSum, 未出租数量: item.surplusRoomSum });
        });
        let orderdata = {
          columns: ["房间分类", "已出租数量","未出租数量"],
          rows: datas
        };
        this.orderchartDatas = orderdata;
      });
    },
    getleftmiddleData() {
      orderNumber().then(res => {
        let datas = [];
        res.data.forEach(item => {
          datas.push({ 工单分类: item.name, 数量: item.value });
        });
        let orderdata = {
          columns: ["工单分类", "数量"],
          rows: datas
        };
        this.orderchartData = orderdata;
      });
    },
    getleftbottomData() {
      let data = this.filterSelectType;
      orderNums(data).then(res => {
        let datas = [];
        res.data.cycleResult.forEach(item => {
          if(data === 'week'){
            datas.push({
              日期: this.toWeekName(Number(item.name)),
              数量: item.value
            });
          }else {
            datas.push({
              日期: data !== "year" ? item.name + "日" : item.name + "月",
              数量: item.value
            });
          }
        });
        let orderdata = {
          columns: ["日期", "数量"],
          rows: datas
        };
        this.chartDatas = orderdata;
      });
    },
    getrighttopData() {
      contractNum().then(res => {
        let datas = [];
        res.data.forEach(item => {
          datas.push({ 合同分类: item.label, 数量: item.num });
        });
        let orderdata = {
          columns: ["合同分类", "数量"],
          rows: datas
        };
        this.chartData = orderdata;
        let contract = res.data.filter(item => {
          return item.label === "待生效合同";
        });
        let contracts = res.data.filter(item => {
          return item.label === "生效合同";
        });
        this.workcons[2].num =
          contract[0].num > 100000
            ? parseInt(contract[0].num / 10000) + "w"
            : contract[0].num;
        this.workcons[3].num =
          contracts[0].num > 100000
            ? parseInt(contracts[0].num / 10000) + "w"
            : contracts[0].num;
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
    getMouseLOcation(e) {},
    toWeekName(num) {
      switch(num){
        case 1: return '周一'; break;
        case 2: return '周二'; break;
        case 3: return '周三'; break;
        case 4: return '周四'; break;
        case 5: return '周五'; break;
        case 6: return '周六'; break;
        case 7: return '周日'; break;
      }
    }
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
    text-align: center;
  }
}
.bigbgc {
  .titles {
    width: 100%;
    margin: 0 0 20px 0;
    text-align: left !important;
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
    rgba(0, 0, 0, 0.5) 0%,
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
    text-align: left !important;
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
  // font-size: 20px !important;
  font-size: 0.5rem !important;
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
