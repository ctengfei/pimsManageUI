<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <gis-map
        ref="gisMap"
        :getMouseLOcation="getMouseLOcation"
        @map-location="maplocation"
      ></gis-map>
    </div>
    <div class="bigbgc">
      <div style="width: 100%; height: auto">
        <div class="titles">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            安防统计
          </div>
          <i
            class="el-icon-right"
          style="z-index: 999;cursor:pointer"
            @click="routerClick('/monitor/securityStatistics')"
          ></i>
        </div>
        <div class="part1">
          <div class="item">
            <el-progress
              stroke-linecap="square"
              color="#206aff"
              type="circle"
              :percentage="importCount"
              :width="progresswidth"
            ></el-progress>
            <div class="label">重大事件率</div>
          </div>
          <div class="item">
            <el-progress
              stroke-linecap="square"
              color="#206aff"
              type="circle"
              :percentage="orderCount"
              :width="progresswidth"
            ></el-progress>
            <div class="label">任务完成率</div>
          </div>
        </div>
        <div class="part1" style="margin: 10px 0">
          <div class="item" v-for="(item, index) in securityList" :key="index">
            <div>{{ item.num }}</div>
            <div>{{ item.label }}</div>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 30vh">
        <div class="titles">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            人员统计
          </div>
          <i
            class="el-icon-right"
            style="z-index: 999;cursor:pointer"
            @click="routerClick('/carManage/personAndVehicleStatistics')"
          ></i>
        </div>
        <ve-histogram
          :data="chartData"
          :extend="chartExtend"
          height="100%"
          ref="histogarmchart"
          :grid="grid"
        >
        </ve-histogram>
      </div>
      <div style="width: 100%; height: 30vh">
        <div class="titles">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            车辆态势
          </div>
          <i
            class="el-icon-right"
            style="z-index: 999;cursor:pointer"
            @click="routerClick('/carManage/personAndVehicleStatistics')"
          ></i>
        </div>
        <ve-histogram
          :data="chartcarData"
          :extend="chartExtend"
          height="100%"
          :grid="grid"
          ref="histogarmcharts"
        >
        </ve-histogram>
      </div>
    </div>
    <div class="middletop">
      <div v-for="(item, index) in workcons" :key="index" @click="jumpDetail(item)">
        <p class="nums">{{ item.num }}</p>
        <p class="labels">{{ item.label }}</p>
      </div>
    </div>
    <div class="middlebottom" v-if="deviceVal">
      <div class="titles">
        <div>
          <img src="@/assets/images/arrow.png" alt="" />
          设备设施在线率
        </div>
        <i
            class="el-icon-right"
             style="z-index: 999;cursor:pointer"
            @click="routerClick('/monitor/securityStatistics')"
          ></i>
      </div>
      <div class="innerBox">
        <div v-for="(item, index) in percentCons" :key="index" @click="onLines(item)">
          <el-progress
            stroke-linecap="square"
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
      <div style="width: 100%; height: 30vh">
        <div class="titles dateButtonGroup">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            能耗统计
          </div>
          <div style="z-index:999">
            <span
              v-for="(item, index) in filterSelectTypes"
              :key="index"
              :value="item.type"
              @click="chooseDates(item)"
              class="dateButton"
              plain
              :class="[item.type === everyNum ? 'focus' : '']"
              >{{ item.name }}</span
            >
          </div>
          <i
            class="el-icon-right"
             style="z-index: 999;cursor:pointer"
            @click="routerClick('/smartEnergyAdmin/energyView')"
          ></i>
        </div>
        
        <ve-line
          ref="linechart"
          :data="historypeople"
          :extend="chartlineExtend"
          height="100%"
          :grid="grids"
        >
        </ve-line>
      </div>
      <div style="width: 100%; height: 30vh">
        <div class="titles">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            环境空间
          </div>
          <i
            class="el-icon-right"
             style="z-index: 999;cursor:pointer"
            @click="routerClick('/smartProperty/spaceProperty')"
          ></i>
        </div>
        <div class="partWarp">
          <div class="part1">
            <div class="item">
              <el-progress
                stroke-linecap="square"
                color="#206aff"
                type="circle"
                :percentage="house"
                :width="progresswidth"
              ></el-progress>
              <div class="label">房屋出租率</div>
            </div>
          </div>
          <div class="part2" style="margin: 10px 0">
            <div class="item" v-for="(item, index) in envList" :key="index">
              <div>{{ item.label }}</div>
              <el-progress color="#206aff" :percentage="item.num"></el-progress>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 30vh">
        <div class="titles">
          <div>
            <img src="@/assets/images/arrow.png" alt="" />
            物业工单统计
          </div>
          <i
            class="el-icon-right"
            style="z-index: 999;cursor:pointer"
            @click="routerClick('/smartProperty/spaceProperty')"
          ></i>
        </div>
        <ve-line
          ref="linecharts"
          :data="historycar"
          :extend="chartlineExtend"
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
import {
  orderNum,
  orderNumber,
  orderNums,
  orderNumday,
  contractNum,
  homenum,
  officenum
} from "@/api/statisticalManagement/overallStatistics.js";
import {
  parkingLot,
  statistics,
  peopleNum,
  peopleNums
} from "@/api/statisticalManagement/overallStatistics.js";
import { getMessageList } from '@/api/system/message'
import { getAlarmCount, getOrderCount, getDeviceOnlineCount, getEveryMounth, getHouse } from "@/api/statisticalManagement/monitor";
export default {
  name: 'OverallStatistics',
  components: {
    gisMap,
  },
  data() {
    return {
      deviceVal:true,
      filterSelectTypes: [
        {
          type: "0",
          name: "水",
        },
        {
          type: "1",
          name: "电",
        }
      ],
      // 距离周围的距离
      grid: {
        top: 50,
        bottom: 30,
      },
      grids: {
        top: 50,
        bottom: 25,
      },
      // 历史人员流量数据
      historypeople: {},
      historycar: {},
      // 人员日流量数据
      chartData: {},
      chartcarData: {},
      // 人员分类数据
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
      securityList: [  
        { num: "20", label: "告警总数" },
        { num: "1", label: "重大事件" },
        { num: "100", label: "任务总数" },
        { num: "40", label: "已完成" },
      ],
      envList: [
        { num: 60, label: "已租面积" },
        { num: 100, label: "空置面积" },
      ],
      chartExtend: {
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
      chartlineExtend: {
        series: {
          type: 'line',
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
      filterSelectTypies: "week",
      progresswidth: 80,
      screenWidth: document.body.clientWidth,
      cameraImg: require("../../../assets/images/map/camera.png"),
      changeImg: require("../../../assets/images/map/camera-erry.png"),
      importCount:0,
      orderCount:0,
      everyNum:"0",
      house:0
    };
  },
  watch: {
    screenWidth(val) {
      if (val > 1920) {
        this.progresswidth = 120;
      }
      if (val <= 1920 && val >= 1536) {
        this.progresswidth = 80;
      }
      if (val < 1536 && val >= 1280) {
        this.progresswidth = 50;
      }
      if (val < 1280) {
        this.progresswidth = 30;
      }
      this.screenWidth = val;
    },
  },
  created() {
    let val = document.body.clientWidth;
    if (val > 1920) {
      this.progresswidth = 120;
    }
    if (val <= 1920 && val >= 1536) {
      this.progresswidth = 80;
    }
    if (val < 1536 && val >= 1280) {
      this.progresswidth = 50;
    }
    if (val < 1280) {
      this.progresswidth = 30;
    }
    this.screenWidth = val;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTheChart());
  },
  mounted() {
    window.addEventListener("resize", this.resizeTheChart);
    this.init()
  },
  beforeRouteEnter(to,from,next){
    next(vm => {
      if(from.path === '/login'){
        const params = {
          pageNum: 1,
          pageSize: 10,
          readed: false,
          contentType: 'Alarm'
        }
        getMessageList(params).then(res => {
          if(res.data.data.length){
            vm.$alert('您存在未读告警消息，请及时处理', '告警', {
              confirmButtonText: '确定',
              showClose: false,
              callback: () => {
                vm.$router.push({path: '/system/message',query: {type: 'Alarm'}})
              }
            });
          }
        })
      }
    })
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
    // 初始化
    init(){
      // 物业工单统计
      this.getleftbottomData()
      // 人员统计
      this.getPeopleDatas()
      // 车辆统计
      this.getcarDatas()
      this.getEveryMounth(this.filterSelectTypes[0])
      this.getAlarmCount()
      this.getOrderCount()
      this.getDeviceOnlineCount()
      // 环境空间
      this.getHouse()
    },
    routerClick(data) {
      this.$router.push({ path: data });
    },
    resizeTheChart() {
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;
      if (this.$refs.histogarmchart) {
        this.$refs.histogarmchart.resize();
      }
      if (this.$refs.histogarmcharts) {
        this.$refs.histogarmcharts.resize();
      }
      if (this.$refs.linechart) {
        this.$refs.linechart.resize();
      }
      if (this.$refs.linecharts) {
        this.$refs.linecharts.resize();
      }
    },
    setItemProgress(data) {
      if (data) {
        return parseInt((data.num / this.allWork[0].num).toFixed(2) * 100);
      } else {
        return 0 + "";
      }
    },
    chooseDates(date) {
      this.everyNum = date.type;
      this.getEveryMounth(date)
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
    // 环境空间
    getHouse(){
      getHouse().then(res=>{
        this.house = res.data
        this.envList[0].num = res.data
        this.envList[1].num = 100 - res.data
      })
    },
     // 设备设施在线率
    getDeviceOnlineCount(){
      getDeviceOnlineCount().then(res=>{
        this.percentCons = res.data
      })
    },
    getCount(data){
      if(data > 100000){
        return `${parseInt(data/10000) + ' w'}`
      }else{
        return data
      }
    },
    // 告警统计
    getAlarmCount(){
      getAlarmCount().then(res=>{
        this.workcons[0].num = this.getCount(res.data.amount)
        this.workcons[1].num = this.getCount(res.data.important)
        this.securityList[0].num = this.getCount(res.data.amount)
        this.securityList[1].num = this.getCount(res.data.important)
        this.importCount = Number(parseFloat((res.data.important/res.data.amount)*100).toFixed(1))
      })
    },
    // 工单统计
    getOrderCount(){
      getOrderCount().then(res=>{
        this.workcons[2].num = this.getCount(res.data.totalAmount)
        this.workcons[3].num = this.getCount(res.data.todoAmount)
        this.securityList[2].num = this.getCount(res.data.totalAmount)
        this.securityList[3].num = this.getCount(res.data.doneAmount)
        this.orderCount = isNaN(Number(parseInt((res.data.doneAmount/res.data.totalAmount)*100))) ? 0 : Number(parseInt((res.data.doneAmount/res.data.totalAmount)*100))
      })
    },
    // 能耗统计(水)
    getEveryMounth(data){
      getEveryMounth({type:data.type}).then(res=>{
        let temp = []
          res.data.forEach(item => {
            if(data.type == '0'){
            temp.push({
              月份: (item.payMouth).substring(5) + "月",
              水: item.sumUsage
            });
            }else{
              temp.push({
              月份: (item.payMouth).substring(5) + "月",
              电: item.sumUsage
            });
            }
          
        });
          let value = {
          columns: ["月份", data.name],
          rows: temp,
        };

        this.historypeople = value;
      })
    },
    // 物业工单统计
    getleftbottomData() {
      orderNums('year').then(res => {
        let datas = [];
        res.data.cycleResult.forEach(item => {
          datas.push({
            日期: item.name + "月",
            数量: item.value
          });
        });
        let orderdata = {
          columns: ["日期", "数量"],
          rows: datas
        };
        this.historycar = orderdata;
      });
    },
    // 人员统计
    getPeopleDatas() {
      peopleNums('YEAR').then(res => {
        let row = [];
        if (res.data.timeList.length && res.data.outData.length && res.data.inData.length) {
          for (let i in res.data.timeList) {
            row.push({
              月份: res.data.timeList[i].substring(5)+"月",
              入园人数: res.data.inData[i],
              出园人数: res.data.outData[i]
            });
          }
        }
        let data = {
          columns: ["月份", "入园人数", "出园人数"],
          rows: row
        };
        this.chartData = data;
      });
    },
    // 车辆统计
    getcarDatas() {
      statistics('YEAR').then(res => {
        let row = [];
        if (res.data.timeList.length && res.data.outData.length && res.data.inData.length) {
          for (let i in res.data.timeList) {
            row.push({
              月份: res.data.timeList[i].substring(5)+"月",
              入园车辆: res.data.inData[i],
              出园车辆: res.data.outData[i]
            });
          }
        }
        let data = {
          columns: ["月份", "入园车辆", "出园车辆"],
          rows: row
        };
        this.chartcarData = data;
      });
    },
    setItemProgressr(data, nums) {
      if (data) {
        return parseInt((data.num / data.nums).toFixed(2) * 100);
      } else {
        return 0 + "";
      }
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
    cursor: pointer;
    &:hover {
      color: #206aff;
    }
  }
}
  .partWarp{
    display: flex;
    flex:1;
    height: 80%;
    align-items: center;
  }
    ::v-deep .wl-transfer .el-tree {
    background-color: inherit;
  }

  ::v-deep .wl-transfer .transfer-title {
    background-color: inherit;
    color: #fff;
  }
  ::v-deep .el-progress-bar__outer{
    background: #31364a;
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
.titles {
  width: 100%;
  margin: 0 0 10px 0;
  text-align: left;
  color: #fff;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  .el-icon-right {
    font-size: 24px;
  }
}
.bigbgc {
  .titles {
    width: 100%;
    margin: 0 0 10px 0;
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
.part1 {
  display: flex;
  flex: 1;
  justify-content: space-around;
  .item {
    font-size: 1rem;
    text-align: center;
    color: #fff;
  }
}
.part2 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: #fff;
  flex: 1;
  .item {
    width: 100%;
    display: flex;
    .el-progress {
      flex: 1;
      margin-left: 10px;
    }
  }
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
  .innerBox {
    display: flex;
    div {
      cursor: pointer;
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
::v-deep .el-progress__text{
  color: #fff;
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
