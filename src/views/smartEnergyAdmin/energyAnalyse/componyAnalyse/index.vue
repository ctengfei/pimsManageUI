<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-radio-group v-model="radio2" size="medium" @input="inputradio">
          <el-radio-button label="waterMeter">水</el-radio-button>
          <el-radio-button label="ammeter">电</el-radio-button>
          <!-- <el-radio-button label="heatMeter">热</el-radio-button> -->
        </el-radio-group>
      </el-col>
      <el-col :span="6">
        <el-form ref="formSearch" inline :model="monitorSite">
          <el-form-item prop="status" label="规则状态">
            <el-select v-model="monitorSite.area" :clearable="false">
              <el-option
                v-for="item in parkAddress"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 能耗态势  水 -->
    <el-descriptions
      title=" "
      :column="7"
      size="medium"
      :colon="false"
      v-show="radio2 == 'waterMeter'"
    >
      <el-descriptions-item label="水表:">{{
        deviceAmount
      }}</el-descriptions-item>
      <el-descriptions-item label="冷水表:">{{
        deviceTypeCounts.amount
      }}</el-descriptions-item>
      <el-descriptions-item label="累计用冷水表:"
        >{{ deviceTypeCounts.sumvalue }} t</el-descriptions-item
      >
      <el-descriptions-item label="今日用冷水表:">{{
        waterMeterday1.amount
      }}</el-descriptions-item>
      <el-descriptions-item label="环比:">{{
        dayringRatio1
      }}</el-descriptions-item>
      <el-descriptions-item label="本月用冷水表:"
        >{{ ringRatio1.amount }} t</el-descriptions-item
      >
      <el-descriptions-item label="环比:">{{
        monthringRatio1
      }}</el-descriptions-item>

      <!-- <el-descriptions-item label="占位置用的" labelStyle="color:#fff;"></el-descriptions-item>

			<el-descriptions-item label="热水表:" >{{ deviceTypeCounts1.amount }}</el-descriptions-item>
			<el-descriptions-item label="累计用热水表:"  >{{ deviceTypeCounts1.value }} t</el-descriptions-item>
			<el-descriptions-item label="今日用热水表:">{{ waterMeterday.amount }}</el-descriptions-item>
			<el-descriptions-item label="环比:">{{ dayringRatio}}</el-descriptions-item>
			<el-descriptions-item label="本月用热水表:">{{ ringRatio.amount }} t</el-descriptions-item>
			<el-descriptions-item label="环比:">{{ monthringRatio}}</el-descriptions-item> -->
    </el-descriptions>
    <!-- 能耗态势  电 -->
    <el-descriptions
      title=" "
      :column="7"
      size="medium"
      v-show="radio2 == 'ammeter'"
    >
      <el-descriptions-item label="电表">{{
        deviceAmount
      }}</el-descriptions-item>
      <el-descriptions-item
        label="三相电表"
        v-if="deviceTypeCountsammeter.amount"
        >{{ deviceTypeCountsammeter.amount }}</el-descriptions-item
      >
      <el-descriptions-item
        label="累计用电"
        v-if="deviceTypeCountsammeter.sumvalue"
        >{{ deviceTypeCountsammeter.sumvalue }}Kwh</el-descriptions-item
      >
      <el-descriptions-item label="今日用电"
        >{{ waterMeterammeterD.amount }}Kwh</el-descriptions-item
      >
      <el-descriptions-item label="环比">{{
        ammeterringRatioD
      }}</el-descriptions-item>
      <el-descriptions-item label="本月用电"
        >{{ waterMeterammeterM.amount }}Kwh</el-descriptions-item
      >
      <el-descriptions-item label="环比">{{
        ammeterringRatioM
      }}</el-descriptions-item>
    </el-descriptions>
    <!-- 能耗态势  热 -->
    <el-descriptions
      title=" "
      :column="7"
      size="medium"
      v-show="radio2 == 'heatMeter'"
    >
      <el-descriptions-item label="热量表">{{
        deviceAmount
      }}</el-descriptions-item>
      <el-descriptions-item
        label="累计用热"
        v-if="deviceTypeCountsheatMeter.value"
        >{{ deviceTypeCountsheatMeter.value }}</el-descriptions-item
      >
      <el-descriptions-item label="今日用热">{{
        waterMeterheatMeterD.amount
      }}</el-descriptions-item>
      <el-descriptions-item label="环比">{{
        heatMeterringRatioD
      }}</el-descriptions-item>
      <el-descriptions-item label="本月用热">{{
        waterMeterheatMeterM.amount
      }}</el-descriptions-item>
      <el-descriptions-item label="环比">{{
        heatMeterringRatioM
      }}</el-descriptions-item>
    </el-descriptions>
    <div style="width: 100%; position: relative; margin-top: 10px">
      <div class="pos_dv">
        <span
          class="span_sp"
          :class="[showbgc == 'year' ? 'bluebg' : 'whitebg']"
          @click="clickshowbgcZhexian('year')"
          >本月</span
        >
        <span
          :class="[showbgc == 'month' ? 'bluebg' : 'whitebg']"
          @click="clickshowbgcZhexian('month')"
          >今年</span
        >
      </div>
      <!-- 电的折线图 -->
      <div v-show="radio2 == 'ammeter'" :id="getID(1)" class="idecharts"></div>
      <!-- 水的双柱状图 -->
      <div
        v-show="radio2 == 'waterMeter'"
        :id="getID(4)"
        class="idecharts"
      ></div>
      <!-- 热的折线 -->
      <div
        v-show="radio2 == 'heatMeter'"
        :id="getID(7)"
        class="idecharts"
      ></div>
    </div>
    <div style="display: flex" v-show="radio2 != 'heatMeter'">
      <div
        style="position: relative; margin-top: 30px"
        :style="{ width: radio2 == 'waterMeter' ? '50%' : '35%' }"
      >
        <div class="pos_dv">
          <span
            class="span_sp"
            :class="[showbgc1 == 'month' ? 'bluebg' : 'whitebg']"
            @click="clickshowbgcShuizhuHeDianbiao('month')"
            >本月</span
          >
          <span
            :class="[showbgc1 == 'year' ? 'bluebg' : 'whitebg']"
            @click="clickshowbgcShuizhuHeDianbiao('year')"
            >今年</span
          >
        </div>
        <!-- 用电饼图id===2 -->
        <div
          v-show="radio2 == 'ammeter'"
          :id="getID(2)"
          class="idecharts"
        ></div>
        <!-- 水的双柱状图 id==5 -->
        <div
          v-show="radio2 == 'waterMeter'"
          :id="getID(5)"
          class="idecharts"
        ></div>
      </div>
      <div
        style="position: relative; margin-top: 30px"
        :style="{ width: radio2 == 'waterMeter' ? '50%' : '65%' }"
      >
        <div class="pos_dv" v-show="radio2 == 'ammeter'">
          <span
            class="span_sp"
            :class="[showbgc2 == 'month' ? 'bluebg' : 'whitebg']"
            @click="clickDianZhu('month')"
            >本月</span
          >
          <span
            :class="[showbgc2 == 'year' ? 'bluebg' : 'whitebg']"
            @click="clickDianZhu('year')"
            >今年</span
          >
        </div>
        <!-- 用电右侧主状图 id== 3 -->
        <div
          v-show="radio2 == 'ammeter'"
          :id="getID(3)"
          class="idecharts"
        ></div>
        <!-- 用水右侧柱状图  id== 6 -->
        <!-- <div v-show="radio2 == 'waterMeter' " :id="getID(6)" class="idecharts"></div> -->
      </div>
    </div>
    <div style="display: flex" v-show="radio2 == 'heatMeter'">
      <div style="width: 100%; position: relative; margin-top: 30px">
        <div class="pos_dv">
          <span
            class="span_sp"
            :class="[showbgc1 == 'year' ? 'bluebg' : 'whitebg']"
            @click="clickshowbgcShuizhuHeDianbiao('year')"
            >本月</span
          >
          <span
            :class="[showbgc1 == 'month' ? 'bluebg' : 'whitebg']"
            @click="clickshowbgcShuizhuHeDianbiao('month')"
            >今年</span
          >
        </div>
        <!-- 用热双柱图 id == 8 -->
        <div
          v-show="radio2 == 'heatMeter'"
          :id="getID(8)"
          class="idecharts"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  situationtrend,
  situationamount,
  situationcycleAmount,
  situationareaRank,
  situationPieChart,
  datatrend,
} from "@/api/facility/crameEnergyList";
export default {
  data() {
    return {
      monitorSite: {
        area: "EAST336",
      },
      parkAddress: [
        {
          name: "二期东区",
          value: "EAST336",
        },
        {
          name: "二期西区",
          value: "WEST345",
        },
      ],
      radio2: "waterMeter",
      showbgc: "month",
      showbgc1: "month",
      showbgc2: "month",
      hotWaterMeter: [],
      waterMeter: [],
      dateOrMonth: [],
      ammeterArr: [],
      heatMeterArr: [],
      cycle: "month",
      deviceAmount: "",
      deviceTypeCounts: {},
      deviceTypeCounts1: {},
      ringRatio: {},
      ringRatio1: {},
      waterMeterday: {},
      waterMeterday1: {},
      monthringRatio: null,
      monthringRatio1: null,
      dayringRatio: null,
      dayringRatio1: null,
      ammeterringRatioM: null,
      waterMeterammeterM: {},
      waterMeterammeterD: {},
      ammeterringRatioD: null,
      deviceTypeCountsammeter: {},
      deviceTypeCountsheatMeter: {},
      heatMeterringRatioM: null,
      waterMeterheatMeterM: {},
      waterMeterheatMeterD: {},
      heatMeterringRatioD: null,
      areaRankDate: [],
      areaRankVal: [],
      areaRankDate1: [],
      areaRankVal1: [],
      PieChartArr: [],
    };
  },
  // 页面加载时调取的所有接口
  mounted() {
    // 这个是折线的接口
    this.getsituationtrend();
    this.getsituationcycleAmount(this.monitorSite.area, this.radio2, "month");
    this.getsituationcycleAmount1(this.monitorSite.area, this.radio2, "day");
    this.getsituationamount(this.monitorSite.area, this.radio2);
    //需要改这个,改成饼图的接口, 然后用电的饼图和柱图, 用同一个接口, 数据也是一样
    this.getsituationareaRank(this.monitorSite.area, "waterMeter", this.cycle); //右侧冷水柱状图
    // this.getsituationareaRank1(this.monitorSite.area,'hotWaterMeter',this.cycle) //右侧热水柱状图
  },
  methods: {
    // 环比本月用水表(顶部数据)
    getsituationcycleAmount(area, type, cycle) {
      situationcycleAmount(area, type, cycle).then((res) => {
        res.data.forEach((CO) => {
          if (CO.subType == "hotWaterMeter") {
            this.monthringRatio =
              Number(CO.ringRatio) <= 0
                ? Number(CO.ringRatio) * -1
                : Number(CO.ringRatio);
            this.ringRatio = CO;
          } else if (CO.subType == "waterMeter") {
            this.monthringRatio1 =
              Number(CO.ringRatio) <= 0
                ? Number(CO.ringRatio) * -1
                : Number(CO.ringRatio);
            this.ringRatio1 = CO;
          } else if (CO.subType == "ammeter") {
            this.ammeterringRatioM =
              Number(CO.ringRatio) <= 0
                ? Number(CO.ringRatio) * -1
                : Number(CO.ringRatio);
            this.waterMeterammeterM = CO;
          } else if (CO.subType == "heatMeter") {
            this.heatMeterringRatioM =
              Number(CO.ringRatio) <= 0
                ? Number(CO.ringRatio) * -1
                : Number(CO.ringRatio);
            this.waterMeterheatMeterM = CO;
          }
        });
      });
    },
    // 环比今日用水表(顶部数据)
    getsituationcycleAmount1(area, type, cycle) {
      situationcycleAmount(area, type, cycle).then((res) => {
        res.data.forEach((CO) => {
          if (CO.subType == "hotWaterMeter") {
            this.dayringRatio =
              Number(CO.ringRatio) <= 0
                ? Number(CO.ringRatio) * -1
                : Number(CO.ringRatio);
            this.waterMeterday = CO;
          } else if (CO.subType == "waterMeter") {
            this.dayringRatio1 =
              Number(CO.ringRatio) <= 0
                ? Number(CO.ringRatio) * -1
                : Number(CO.ringRatio);
            this.waterMeterday1 = CO;
          } else if (CO.subType == "ammeter") {
            this.ammeterringRatioD =
              Number(CO.ringRatio) <= 0
                ? Number(CO.ringRatio) * -1
                : Number(CO.ringRatio);
            this.waterMeterammeterD = CO;
          } else if (CO.subType == "heatMeter") {
            this.heatMeterringRatioD =
              Number(CO.ringRatio) <= 0
                ? Number(CO.ringRatio) * -1
                : Number(CO.ringRatio);
            this.waterMeterheatMeterD = CO;
          }
        });
      });
    },
    // 顶部数据栏数据接口
    getsituationamount(area, type) {
      situationamount(area, type).then((res) => {
        this.deviceAmount = "";
        this.deviceAmount = res.data.deviceAmount;
        res.data.deviceTypeCounts.forEach((CO) => {
          if (CO.enumstype == "waterMeter") {
            this.deviceTypeCounts = CO;
          } else if (CO.type == "hotWaterMeter") {
            this.deviceTypeCounts1 = CO;
          } else if (CO.enumstype == "ammeter") {
            this.deviceTypeCountsammeter = CO;
          } else if (CO.type == "heatMeter") {
            this.deviceTypeCountsheatMeter = CO;
          }
        });
      });
    },
    // 趋势统计图折线图
    getsituationtrend() {
      situationtrend(this.monitorSite.area, this.radio2, this.cycle).then(
        (res) => {
          let dateOrMonth = [];
          this.hotWaterMeter = [];
          this.waterMeter = [];
          this.ammeterArr = [];
          res.data.forEach((item) => {
            dateOrMonth.push(item.dateOrMonth);
            if (item.subtype == "hotWaterMeter") {
              this.hotWaterMeter.push(item.value);
            } else if (item.subtype == "waterMeter") {
              this.waterMeter.push(item.value);
            } else if (item.subtype == "ammeter") {
              this.ammeterArr.push(item.value);
            } else if (item.subtype == "heatMeter") {
              this.heatMeterArr.push(item.value);
            }
          });
          // 数组日期去重
          this.dateOrMonth = [
            ...new Set(dateOrMonth.map((item) => JSON.stringify(item))),
          ].map((i) => JSON.parse(i));
          this.initcolumnarChart("line" + 4);
          this.initcategoryChart("line" + 5);
          // this.initcategoryChart("line" + 6)
          // this.initcategoryChart("line" + 8) // 用热双柱图
          this.initLineChart("line" + 1); //用电折线图
          // this.initLineChart("line" + 7) //用热折线图
        }
      );
    },
    // 用冷水的排名, 用水和用电的柱状图
    getsituationareaRank(area, type, cycle) {
      situationPieChart(area, type, cycle).then((res) => {
        // console.log(res, "水柱图和电柱图");
        let shuju = [
          { value: res.data.marketArea, name: "商业区域" },
          { value: res.data.publicArea, name: "公共区域" },
          { value: res.data.tenantArea, name: "住户区域" },
          { value: res.data.officeArea, name: "办公区域" },
        ];
        this.areaRankDate = [];
        this.areaRankVal = [];
        shuju.forEach((item) => {
          this.areaRankDate.push(item.name);
          this.areaRankVal.push(item.value);
        });
        if (type == "waterMeter") {
          this.initcategoryChart("line" + 5); //显示水的柱状图
        } else if (type == "ammeter") {
          this.initcategoryChart("line" + 3); //显示电的柱状图
        }
      });
    },
    // 用热水的排名(这个暂时没有展示)
    // getsituationareaRank1(area, type, cycle) {
    //   situationPieChart(area, type, cycle).then((res) => {
    //     this.areaRankDate1 = [];
    //     this.areaRankVal1 = [];
    //     res.data.forEach((item) => {
    //       this.areaRankDate1.push(item.area);
    //       this.areaRankVal1.push(item.value);
    //     });
    //     // this.initcategoryChart("line" + 6)  //右侧主状图
    //     this.initcategoryChart("line" + 3); //右侧主状图
    //   });
    // },
    // 用电的饼状图
    getsituationPieChart(area, type, cycle) {
      situationPieChart(area, type, cycle).then((res) => {
        this.PieChartArr = [
          { value: res.data.marketArea, name: "商业区域" },
          { value: res.data.publicArea, name: "公共区域" },
          { value: res.data.tenantArea, name: "住户区域" },
          { value: res.data.officeArea, name: "办公区域" },
        ];
        this.initPieChart("line" + 2); //饼图id===2
      });
    },
    // 点击水电热tab切换
    inputradio(val) {
      this.deviceAmount = "";
      if (this.radio2 == "waterMeter") {
        // 获取折线图
        this.getsituationtrend();
        // 本月用水
        this.getsituationcycleAmount(
          this.monitorSite.area,
          this.radio2,
          "month"
        );
        // 本日用水
        this.getsituationcycleAmount1(
          this.monitorSite.area,
          this.radio2,
          "day"
        );
        this.getsituationamount(this.monitorSite.area, this.radio2);
        // 获取柱状图
        this.getsituationareaRank(
          this.monitorSite.area,
          "waterMeter",
          this.cycle
        ); //右侧冷水柱状图
        // this.getsituationareaRank1(this.monitorSite.area,'hotWaterMeter',this.cycle) //右侧热水柱状图
      } else if (this.radio2 == "ammeter") {
        //折线图
        this.getsituationtrend();
        // 顶部数据-本月用电
        this.getsituationcycleAmount(
          this.monitorSite.area,
          this.radio2,
          "month"
        );
        // 顶部数据-今日用电
        this.getsituationcycleAmount1(
          this.monitorSite.area,
          this.radio2,
          "day"
        );
        // 顶部数据
        this.getsituationamount(this.monitorSite.area, this.radio2);
        // 用电饼状图
        this.getsituationPieChart(this.monitorSite.area, "ammeter", this.cycle); //用电柱状图
        this.getsituationareaRank(this.monitorSite.area, "ammeter", this.cycle);
      } else {
        this.getsituationtrend();
        this.getsituationcycleAmount(
          this.monitorSite.area,
          this.radio2,
          "month"
        );
        this.getsituationcycleAmount1(
          this.monitorSite.area,
          this.radio2,
          "day"
        );
        this.getsituationamount(this.monitorSite.area, this.radio2);
        // this.getsituationPieChart(this.monitorSite.area, "ammeter", this.cycle);
        // this.getdatatrend(this.monitorSite.area,this.radio2,this.cycle)
      }
      this.$nextTick(() => {
        window.dispatchEvent(new Event("resize"));
      });
    },
    // 本月本年
    clickshowbgcZhexian(val) {
      this.showbgc = val;
      this.cycle = val;
      this.getsituationtrend();
    },
    // 水的柱状图年月按钮和电的饼状图年月按钮
    clickshowbgcShuizhuHeDianbiao(val) {
      this.showbgc1 = val;
      this.cycle = val;
      if (this.radio2 == "waterMeter") {
        this.getsituationareaRank(
          this.monitorSite.area,
          this.radio2,
          this.cycle
        );
      } else if (this.radio2 == "ammeter") {
        //用电饼状图
        this.getsituationPieChart(
          this.monitorSite.area,
          this.radio2,
          this.cycle
        );
      }
    },
    //电的柱状图年月按钮
    clickDianZhu(val) {
      this.showbgc2 = val;
      this.cycle = val;
      //用电柱状图
      this.getsituationareaRank(this.monitorSite.area, this.radio2, this.cycle);
    },
    getID(index) {
      return "line" + index;
    },
    // 折线图
    initLineChart(id) {
      let lineChart = this.$Echarts.init(document.getElementById(id));
      let lineOption = {
        title: {
          text: id == "line1" ? "园区用电趋势统计" : "园区用热趋势统计",
          left: "left",
          // textStyle: {
          // fontWeight: 'normal',
          // color: '#606266'
          // }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: 60,
          top: 60,
          right: 20,
          bottom: 20,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.dateOrMonth,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              opacity: "0.1",
              color: "#606266", //坐标线的颜色
            },
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: "0", //坐标线的宽度
            },
          },
          splitLine: {
            lineStyle: {
              color: ["#606266"],
              width: 1,
              type: "solid",
              opacity: "0.1",
            },
          },
        },
        color: ["#73c0de"],
        series: [
          {
            data: id == "line1" ? this.ammeterArr : this.heatMeterArr,
            type: "line",
          },
        ],
      };
      lineChart.setOption(lineOption);
      window.addEventListener("resize", function () {
        lineChart.resize();
      });
    },
    // 用电饼图
    initPieChart(id) {
      let pieChart = this.$Echarts.init(document.getElementById(id));
      let lineOption = {
        title: {
          text: id == "line2" ? "园区分类用电统计" : "故障原因分析",
          subtext: "",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        // legend: {
        // 	orient: '',
        // 	// data: ['1月', '2月', '3月', '4月','5月', '6月', '7月', '8月','9月', '10月', '11月', '12月',]
        // 	x: 'left', //可设定图例在左、右、居中
        // 	y: 'center', //可设定图例在上、下、居中
        // 	// left: 'right'
        // },
        color: ["#e3935d", "#eecb5f", "#61a5e8", "#e16757"],
        series: [
          {
            name: "",
            type: "pie",
            radius: "70%",
            center: ["50%", "60%"],
            labelLine: {
              // 标签的视觉引导线样式,在 label 位置 设置为'outside'的时候会显示视觉引导线。
              normal: {
                show: true, // 是否显示视觉引导线。
                length: 8, // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
                length2: 8, // 视觉引导项第二段的长度。
                lineStyle: {
                  // 视觉引导线的样式
                  //color: '#000',
                  //width: 1
                },
              },
            },
            data: id == "line2" ? this.PieChartArr : [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      pieChart.setOption(lineOption);
      window.addEventListener("resize", function () {
        pieChart.resize();
      });
    },
    // 右侧主状图
    initcategoryChart(id) {
      let pieChart = this.$Echarts.init(document.getElementById(id));
      let lineOption = {
        title: {
          text:
            id == "line3"
              ? "园区区域用电排名"
              : id == "line5"
              ? "园区区域用水排名"
              : id == "line6"
              ? "园区区域用水排名"
              : "园区区域用热排名",
          subtext: "",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        // dataset: {
        // 	source: [
        // 		[89.3, 58212, 'Matcha Latte'],
        // 		[57.1, 78254, 'Milk Tea'],
        // 		[74.4, 41032, 'Cheese Cocoa'],
        // 		[50.1, 12755, 'Cheese Brownie'],
        // 		[89.7, 20145, 'Matcha Cocoa'],
        // 		[68.1, 79146, 'Tea'],
        // 		[19.6, 91852, 'Orange Juice'],
        // 		[10.6, 101852, 'Lemon Juice'],
        // 		[32.7, 20112, 'Walnut Brownie']
        // 	]
        // },
        // grid: { containLabel: true },
        // xAxis: { name: '' },
        // yAxis: { type: 'category' },
        grid: {
          left: 60,
          top: 60,
          right: 20,
          bottom: 20,
        },
        xAxis: {
          boundaryGap: false,
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              opacity: "0.1",
              color: "#606266", //坐标线的颜色
            },
          },
        },
        yAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          // this.areaRankDate1
          data:
            id == "line3"
              ? this.areaRankDate
              : id == "line5"
              ? this.areaRankDate
              : id == "line6"
              ? this.areaRankDate1
              : [],
          axisLine: {
            lineStyle: {
              width: "0", //坐标线的宽度
            },
          },
          splitLine: {
            lineStyle: {
              color: ["#606266"],
              width: 1,
              type: "solid",
              opacity: "0.1",
            },
          },
        },
        color: ["#73c0de"],
        series: [
          {
            name:
              id == "line3"
                ? "用电"
                : id == "line5"
                ? "冷水"
                : id == "line6"
                ? "热水"
                : "",
            type: "bar",
            // label: {
            // 	normal: {
            // 		show: true,
            // 		position: 'right',

            // 	}
            // },
            data:
              id == "line3"
                ? this.areaRankVal
                : id == "line5"
                ? this.areaRankVal
                : id == "line6"
                ? this.areaRankVal1
                : [],
          },
        ],
      };
      pieChart.setOption(lineOption);
      window.addEventListener("resize", function () {
        pieChart.resize();
      });
    },
    // 双柱状图
    initcolumnarChart(id) {
      let pieChart = this.$Echarts.init(document.getElementById(id));
      let lineOption = {
        title: {
          text: id == "line4" ? "园区用水趋势统计" : "故障原因分析",
          subtext: "",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "1%",
          right: "1%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: [0, 0.01],
          data: this.dateOrMonth,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              opacity: "0.1",
              color: "#606266", //坐标线的颜色
            },
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: "0", //坐标线的宽度
            },
          },
          splitLine: {
            lineStyle: {
              color: ["#606266"],
              width: 1,
              type: "solid",
              opacity: "0.1",
            },
          },
        },
        series: [
          {
            name: "冷水",
            type: "line",
            data: this.waterMeter,
            // barWidth: 10,
            color: {
              type: "linear",
              x: 0, //右
              y: 0, //下
              x2: 0, //左
              y2: 1, //上
              colorStops: [
                {
                  offset: 0,
                  color: "#2d6dff", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#94abdf", // 100% 处的颜色
                },
              ],
            },
          },
          // {
          // 	name: '热水',
          // 	type: 'bar',
          // 	data: this.hotWaterMeter,
          // 	// barWidth: 10,
          //     color: {
          //         type: 'linear',
          //         x: 0,  //右
          //         y: 0,  //下
          //         x2: 0,  //左
          //         y2: 1,  //上
          //         colorStops: [
          //             {
          //                 offset: 0,
          //                 color: '#35bdea' // 0% 处的颜色
          //             },
          //             {
          //                 offset: 1,
          //                 color: '#57efea' // 100% 处的颜色
          //             }
          //         ]
          //     },
          // }
        ],
      };
      pieChart.setOption(lineOption);
      window.addEventListener("resize", function () {
        pieChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-descriptions__body .el-descriptions__table {
  font-size: 16px !important;
  font-weight: 600 !important;
}
::v-deep .el-descriptions__header {
  margin-bottom: 0px !important;
}
.pos_dv {
  position: absolute;
  right: 70px;
  z-index: 999;
  cursor: pointer;
  span {
    margin: 0 5px;
    padding: 5px;
  }
}
.idecharts {
  height: 315px;
  width: 100%;
}
.bgc {
  color: #2d6dff;
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