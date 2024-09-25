<template>
  <div class="app-container" style="display: flex">
    <regiontree @nodeclick="nodeclick" :type="'0'" :nodeType="'0'"></regiontree>
    <div style="height: 100%; width: 100%">
      <div style="margin-bottom: 60px">
        <span style="color: #000; font-weight: 600">监测区域名称：</span
        ><span style="margin-right: 150px">{{ name }}</span>
        <span style="color: #000; font-weight: 600">数据更新时间：</span
        ><span>{{ collectionTime }}</span>
      </div>
      <div style="margin-bottom: 30px">
        <div style="margin-bottom: 30px; color: #000; font-weight: 600">
          实时数据
        </div>
        <div class="progressBox">
          <div
            class="elProgress"
            v-for="(item, index) in targetArr"
            :key="index"
          >
            <el-progress
              style="margin-right: 30px"
              type="dashboard"
              :percentage="item.value"
              :color="colors"
            />
            <span style="width: 80%; text-align: center">
              {{ `${item.name}/${item.unit}` }}</span
            >
          </div>
        </div>
      </div>
      <div>
        <div style="margin-bottom: 30px; color: #000; font-weight: 600">
          最近24小时检测趋势
        </div>
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
        <div style="width: 100%; height: 40vh">
          <ve-line
            ref="linechart"
            :data="historypeople"
            :extend="chartExtend"
            height="100%"
            :grid="grids"
          />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import $environMonitor from "@/api/environMonitor";
import regiontree from "../../smartEnergyAdmin/components/regiontree";
export default {
  name: "",
  components: {
    regiontree,
  },
  data() {
    return {
      percentage: 10,
      radio: "temperature",
      historypeople: {
        columns: ["日期", " "],
        rows: [],
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
      treedata: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      name: "",
      collectionTime: "",
      currentNodeKey: "", //设备id
      currentNodeKeyNew: "", //监测点id
      expandDefault: [], //默认选中第一项
      targetArr: [
        {
          name: "PM 2.5",
          value: 0,
          unit: "ug/m³",
          img: require("@/assets/wq/pm1.png"),
        },
        {
          name: "温度",
          value: 0,
          unit: "°C",
          img: require("@/assets/wq/wd.png"),
        },
        {
          name: "湿度",
          value: 0,
          unit: "%rh",
          img: require("@/assets/wq/sd.png"),
        },
        {
          name: "CO₂",
          value: 0,
          unit: "%rh",
          img: require("@/assets/wq/fs.png"),
        },
        {
          name: "tvoc",
          value: 0,
          unit: "kpa",
          img: require("@/assets/wq/fx.png"),
        },
      ],
    };
  },
  mounted() {
    this.init();
    // this.gettree()
  },
  methods: {
    // 获取设备树  treenode
    gettree() {
      let obj = {
        nodeType: "detection",
      };
      $environMonitor.treenode(obj).then((res) => {
        this.treedata = res.data;
        // this.currentNodeKey = res.data[0].children[0].children[0].referenceId
        this.expandDefault.push(res.data[0].children[0].children[0].id);
        this.name = res.data[0].children[0].children[0].name;
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(res.data[0].children[0].children[0].id);
        });
      });
    },
    //获取监测点id
    getByDeviceId(data) {
      let code = {
        deviceId: data,
      };
      return $environMonitor.getByDeviceId(code);
    },

    nodeclick(data) {
      if (data.children?.length) {
        return;
      }
      this.currentNodeKey = data.referenceId;
      this.name = data.name;
      if (data.referenceId) {
        this.getByDeviceId(data.referenceId).then((res) => {
          this.currentNodeKeyNew = res.data.id;
          this.detection24h();
          this.detectionLatest();
        });
      } else {
        this.$message.info("请点击设备信息");
      }
    },
    // 初始化数据
    init() {
      setTimeout(() => {
        // 获取24小时监测趋势分析
        // this.detection24h()
        // if(this.currentNodeKey){
        // 	this.detectionLatest()
        // }else{
        // 	this.$message.info("请点击设备信息")
        // }
      }, 500);
    },
    // 选择指标切换
    radioChange() {
      // 获取24小时监测趋势分析
      if (this.currentNodeKey) {
        this.detection24h();
      } else {
        this.$message.info("请选中设备信息");
      }
    },
    // 获取最新上报监测指标
    detectionLatest() {
      $environMonitor.detectionLatest(this.currentNodeKeyNew).then((res) => {
        let obj = res.data;
        let temp = [];
        if (obj) {
          this.collectionTime = res.data.collectionTime;
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
        } else {
          temp = [
            {
              name: "PM 2.5",
              value: 0,
              unit: "ug/m³",
              img: require("@/assets/wq/pm1.png"),
            },
            {
              name: "温度",
              value: 0,
              unit: "°C",
              img: require("@/assets/wq/wd.png"),
            },
            {
              name: "湿度",
              value: 0,
              unit: "%rh",
              img: require("@/assets/wq/sd.png"),
            },
            {
              name: "CO₂",
              value: 0,
              unit: "%rh",
              img: require("@/assets/wq/fs.png"),
            },
            {
              name: "tvoc",
              value: 0,
              unit: "kpa",
              img: require("@/assets/wq/fx.png"),
            },
          ];
        }
        this.targetArr = temp;
      });
    },
    // 环形添加文字描述
    setItemText(item) {
      return () => {
        return `${item.value} ${item.name}/${item.unit}`;
      };
    },
    detection24h() {
      $environMonitor
        .detection24h(`${this.currentNodeKeyNew}/${this.radio}`)
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
  },
};
</script>
<style lang='scss' scoped>
.filterTypes {
  // position: absolute;
  // z-index: 999;
  // left: 30px;
}
::v-deep.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #409eff !important;
  color: #fff;
}
.progressBox {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
}
.elProgress {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
  