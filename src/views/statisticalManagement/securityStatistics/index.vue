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
          告警统计
        </p>

        <ve-ring
          ref="ringchart"
          :data="chartDatas"
          :settings="piechartSettings"
          height="100%"
          :extend="piechartExtend"
        ></ve-ring>
      </div>
      <div style="width: 100%; height: 30%">
        <div class="dateButtonGroup">
          <p><img src="@/assets/images/arrow.png" alt="" />告警等级分类</p>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDates(item,'alarmClass')"
              class="dateButton"
              plain
              :class="[item.type === alarmClassNum ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <ve-histogram
          ref="histogramchart"
          :data="chartData"
          :extend="chartExtend"
          height="100%"
          :grid="grid"
        >
        </ve-histogram>
      </div>
      <div style="width: 100%; height: 30%">
        <div class="dateButtonGroup">
          <p><img src="@/assets/images/arrow.png" alt="" />历史告警数量</p>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDates(item,'his')"
              class="dateButton"
              plain
              :class="[item.type === historyNum ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>

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
    <div class="middletop">
      <div v-for="(item, index) in workcons" :key="index" @click="jumpDetail(item)">
        <p class="nums">{{ item.num }}</p>
        <p class="labels">{{ item.label }}</p>
      </div>
    </div>
    <div class="middlebottom" v-if="deviceVal">
      <p class="titles">
        <img src="@/assets/images/arrow.png" alt="" />
        设备设施在线率
      </p>
      <div class="innerBox">
        <div v-for="(item, index) in percentCons" :key="index" @click="onLines(item)">
          <el-progress
          color="#206aff"
            type="dashboard"
            :percentage="item.value"
            :width="80"
          ></el-progress>
          <p class="labels">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="middlebottomUp">
      <div :class="[deviceVal ? 'triangle-down' : 'triangle-up']" @click="deviceVal=!deviceVal"></div>
    </div>
    <div class="rightbgc">
      <div style="width: 100%; height: 30%">
        <p class="titles">
          <img src="@/assets/images/arrow.png" alt="" />
          任务统计
        </p>

        <ve-ring
          ref="ringcharts"
          :data="chartcarDatas"
          :settings="piechartSettings"
            height="100%"
          :extend="piechartExtend"
        ></ve-ring>
      </div>
      <div style="width: 100%; height: 30%">
        <div class="dateButtonGroup">
          <p><img src="@/assets/images/arrow.png" alt="" />任务优先级分类</p>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDates(item,'priority')"
              class="dateButton"
              plain
              :class="[item.type === priorityNum ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <ve-histogram
          ref="histogramcharts"
          :data="chartcarData"
          :extend="chartExtend"
            height="100%"
          :grid="grid"
        >
        </ve-histogram>
      </div>
      <div style="width: 100%; height: 30%">
        <div class="dateButtonGroup">
          <p><img src="@/assets/images/arrow.png" alt="" />任务数量</p>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDates(item,'workOrder')"
              class="dateButton"
              plain
              :class="[item.type === filterSelectType ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
        </div>

        <ve-line
          ref="linechartes"
          :data="historycar"
          :extend="chartExtend"
          height="100%"
          :grid="grids"
        >
        </ve-line>
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
  initFillData,
} from "@/api/smartProperty/workbench";
import gisMap from "@/components/common/map/gis-map";
import { getStringByKey, getObjByKey } from "@/utils/voice.js";
import { getHistoryNum, getAlarmClass, getAlarmCount, getOrderCount, getPriorityCount, getWorkOrderCount, getDeviceOnlineCount } from "@/api/statisticalManagement/monitor";
export default {
  name: 'SecurityStatistics',
  components: {
    gisMap,
  },
  data() {
    return {
      deviceVal:true,
      screenWidth: document.body.clientWidth,
      // 距离周围的距离
      grid: {
        top: 50,
        bottom: 10,
      },
      grids: {
        top: 50,
        bottom: 10,
      },
      piechartExtend: {
        series: {
          type: 'pie',
          center: ["50%", "70%"],
        },
        legend: {
          type: "scroll",
          textStyle: {
            color: "#fff", //图例字体颜色
          },
          pageTextStyle: {
            color: "#fff" //翻页数字颜色
          },
          pageIconColor:'#206aff',
          pageIconInactiveColor:'#202230',
        },
      },
      piechartSettings: {
        type: "pie",
        radius: ["30%", "40%"],
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
        position: "",
      },
      workcons: [
        {
          label: "告警总数",
          num: 0,
        },
        {
          label: "重大事件",
          num: 0,
        },
        {
          label: "任务总数",
          num: 0,
        },
        {
          label: "待分派任务",
          num: 0,
        },
      ],
      percentCons: [
        { num: 70, label: "摄像头" },
        { num: 60, label: "智能照明" },
        { num: 50, label: "暖通空调" },
      ],
      chartExtend: {
        series: {
          type: 'bar',
          barWidth: 10,
        },
        legend: {
          type: "scroll",
          textStyle: {
            color: "#fff",
          },
          pageTextStyle: {
            color: "#fff" //翻页数字颜色
          },
          pageIconColor:'#206aff',
          pageIconInactiveColor:'#202230',
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
      filterSelectType: "year",
      cameraImg: require("../../../assets/images/map/camera.png"),
      changeImg: require("../../../assets/images/map/camera-erry.png"),
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
      // 历史告警 周月年
      historyNum:'year',
      priorityNum:"year",
      alarmClassNum:"year",
    };
  },
  watch: {},
  created() {},
  mounted() {
    window.addEventListener("resize", this.resizeTheChart);
    this.init()
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTheChart());
  },
  methods: {
    // 在线率跳转
    onLines(item){
      if(item.name=="摄像头"){
        this.$router.push({name:"Information",query:{type:"camera",isShow:false}})
      }else{
        this.$router.push({name:"Information",query:{type:"nightlighting",isShow:false}})
      }
    },
    // 跳转详情
    jumpDetail(item){
      if(item.label == "告警总数"){
        this.$router.push({name:"WarningInfo"})
      }else if(item.label == "重大事件"){
        this.$router.push({name:"WarningInfo",query:{id:'VERY_EMERGENCY'}})
      }else if(item.label == "任务总数"){
        this.$router.push({name:"WarningTask",query:{id:""}})
      }else{
        this.$router.push({name:"WarningTask",query:{id:"TODO"}})
      }
    },
    // 初始化请求
    init(){
      // 告警统计
      this.getAlarmCount();
      // 工单统计
      this.getOrderCount();
      //历史告警数量
      this.getHistoryNum(this.filterSelectTypes[2]); 
      //告警等级分类
      this.getAlarmClass(this.filterSelectTypes[2]);
      // 任务优先级分类
      this.getPriorityCount(this.filterSelectTypes[2]);
      // 任务工单数量
      this.getWorkOrderCount(this.filterSelectTypes[2]);
      // 设备设施在线率
      this.getDeviceOnlineCount();
    },
    resizeTheChart() {
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;
      if (this.$refs.linechartes) {
        this.$refs.linechartes.resize();
      }
      if (this.$refs.ringchart) {
        this.$refs.ringchart.resize();
      }
      if (this.$refs.ringcharts) {
        this.$refs.ringcharts.resize();
      }
      if (this.$refs.histogramchart) {
        this.$refs.histogramchart.resize();
      }
      if (this.$refs.histogramcharts) {
        this.$refs.histogramcharts.resize();
      }
      if (this.$refs.linechart) {
        this.$refs.linechart.resize();
      }
    },
    setItemProgress(data) {
      if (data) {
        return parseInt((data.num / this.allWork[0].num).toFixed(2) * 100);
      } else {
        return 0 + "";
      }
    },
    chooseDates(date,type) {
      if(type == 'his'){
        this.historyNum = date.type;
        this.getHistoryNum(date);
      }else if(type=='priority'){
        this.priorityNum = date.type;
        this.getPriorityCount(date);
      }else if(type=='alarmClass'){
        this.alarmClassNum =  date.type
        this.getAlarmClass(date);
      }else if(type=='workOrder'){
        this.filterSelectType = date.type;
        this.getWorkOrderCount(date);
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
    getCount(data){
      if(data > 100000){
        return `${parseInt(data/10000) + ' w'}`
      }else{
        return data
      }
    },
    // 工单统计
    getOrderCount(){
      getOrderCount().then(res=>{
        let obj = res.data
        let temp = []
        this.workcons[2].num = this.getCount(res.data.totalAmount)
        this.workcons[3].num = this.getCount(res.data.todoAmount)
        for(let key in obj){
          if(key === "todoAmount"){
            temp.push({工单状态:"待分派", 数量:obj[key]})
          }else if(key === "dongingAmount"){
            temp.push({工单状态:"执行中", 数量:obj[key]})
          }else if(key === "doneAmount"){
            temp.push({工单状态:"已完成", 数量:obj[key]})
          }
        }
          let datas = {
          columns: ["工单状态", "数量"],
          rows: [...temp],
        };
        this.chartcarDatas = datas;
      })
    },
    // 优先级统计
    getPriorityCount(data){
      getPriorityCount(data.type).then(res=>{
        var values=[]; //月份
        let reData = res.data
        values = reData.map(item=>{
          if(data.type == 'week'){
            return {'月份':`${item.time}`,"一般告警":item.normal,"紧急告警":item.emergency,"非常紧急":item.veryEmergency,}
          }else{
            return {'月份':`${item.time}`+`${data.type !== 'year' ? '日' : '月'}`,"一般告警":item.normal,"紧急告警":item.emergency,"非常紧急":item.veryEmergency,}
          }
          
        })
        let temp = {
          columns: ["月份", "标准", "紧急", "非常紧急"],
          rows: [...values],
        };
        this.chartcarData = temp;
      })
    },
    // 告警统计
    getAlarmCount(){
      getAlarmCount().then(res=>{
        this.workcons[0].num = this.getCount(res.data.amount)
        this.workcons[1].num = this.getCount(res.data.important)
        var values=[];
        for(var key in res.data.category){    
          if (res.data.category.hasOwnProperty(key) === true){ 
            values.push({'告警类型':key,"数量":res.data.category[key]});
          }   
        } 
        let datas = {
          columns: ["告警类型", "数量"],
          rows: [...values],
        };
        this.chartDatas = datas;
      })
    },
    // 历史告警数量
    getHistoryNum(data){
      getHistoryNum(data.type).then(res=>{
        var values=[]; //定义一个数组用来接受value  
        let reData = res.data;
        values = reData.map(item=>{
          if(data.type == 'week'){
            return {'月份':`${item.name}`,"告警数量":item.value}
          }else{
            return {'月份':`${item.name}`+`${data.type !== 'year' ? '日' : '月'}`,"告警数量":item.value}
          }
          
        })
        let temp = {
          columns: ["月份", "告警数量"],
          rows: [...values],
        };
        this.historypeople = temp;
      })
    },
    // 告警等级分类
    getAlarmClass(data){
      getAlarmClass(data.type).then(res=>{
        var values=[]; //月份
        let reData = res.data
        values = reData.map(item=>{
          if(data.type == 'week'){
            return {'月份':`${item.time}`,"一般告警":item.normal,"紧急告警":item.emergency,"非常紧急":item.veryEmergency,}
          }else{
            return {'月份':`${item.time}`+`${data.type !== 'year' ? '日' : '月'}`,"一般告警":item.normal,"紧急告警":item.emergency,"非常紧急":item.veryEmergency,}
          }
          
        })
        let temp = {
          columns: ["月份", "一般告警", "紧急告警", "非常紧急"],
          rows: [...values],
        };
        this.chartData = temp;
      })
    },
    // 物业工单统计
    getWorkOrderCount(data){
      getWorkOrderCount(data.type).then(res=>{
        var values=[]; //定义一个数组用来接受value  
        let reData = res.data;
        values = reData.map(item=>{
          if(data.type == 'week'){
            return {'月份':`${item.name}`,"数量":item.value}
          }else{
            return {'月份':`${item.name}`+`${data.type !== 'year' ? '日' : '月'}`,"数量":item.value}
          }
          
        })
        let temp = {
          columns: ["月份", "数量"],
          rows: [...values],
        };
        this.historycar = temp;
      })
    },
    // 设备设施在线率
    getDeviceOnlineCount(){
      getDeviceOnlineCount().then(res=>{
        this.percentCons = res.data
      })
    },
    initmap() {
      //
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
    margin: 0 0 10px 0;
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
.middlebottomUp{
  // width: 43%;
  padding: 20px;
  position: absolute;
  right: 24%;
  bottom: 0px;
  transform: translate(-50%, 0);
  margin: 0 auto;
  cursor: pointer;
}
.middlebottom {
  width: 43%;
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
  .titles {
    width: 100%;
    margin: 0 0 20px 0;
    text-align: left;
    color: #fff;
    cursor: pointer;
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
  .titles {
    width: 100%;
    margin: 0 0 10px 0;
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
}
.focus{
  color: #206aff;
}
.triangle-up {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 15px solid #206aff;
}
.triangle-down {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 15px solid #206aff;
}
</style>
