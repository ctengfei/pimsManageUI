<template>
  <div class="app-container">
    <div class="infos">
      <div class="topData">
        <comCard
          :spanList="spanList"
          @routerClick="routerClick($event)"
        ></comCard>
      </div>
      <div class="middleData">
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="middleLeft">
              <el-col :span="6">
                <p class="workOrder">{{ workOrder }}</p>
                <div class="liquidFillGroups">
                  <div
                    class="liquidFill"
                    v-for="(item, index) in liquidFillGroup"
                    :id="'fillChart' + index"
                    :key="index"
                  ></div>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="middleCenter_content">
                  <div class="dateButtonGroup">
                    <el-button
                      v-for="(item, index) in filterSelectTypes"
                      :key="index"
                      :value="item.type"
                      @click="chooseDate($event)"
                      class="dateButton"
                      plain
                      :class="[item.type === filterSelectType ? 'focus' : '']"
                    >
                      {{ item.name }}
                    </el-button>
                  </div>
                  <div id="line">
                    <ve-line
                      ref="linechart"
                      :grid="grid"
                      :data="chartDatas"
                      :settings="chartSettingline"
                      height="100%"
                      :extend="chartExtend"
                    >
                    </ve-line>
                  </div>
                </div>
              </el-col>
            </div>
          </el-col>
          <el-col :span="6">
            <div id="pie"></div>
          </el-col>
        </el-row>
      </div>
      <div class="bottomData">
        <p>业务动态</p>
        <div style="height:calc(100% - 65px);">
          <el-table :data="tableData" style="overflow:hidden">
            <el-table-column label="序号" type="index" width="80"></el-table-column>
            <el-table-column label="内容" prop="msg" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="业务分类"
              prop="operateTypeStr"
              show-overflow-tooltip
              width="200"
            >
              <!-- <template slot-scope="scope">
                {{ filterContent(scope.row) }}
              </template> -->
            </el-table-column>
            <el-table-column
              label="产生时间"
              prop="createTime"
              show-overflow-tooltip
              width="200"
            ></el-table-column>
          </el-table>
            <pagination
            style="margin-top:0px"
            v-show="tableData && tableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="pageNum"
            :pageSizes="[5, 10, 20]"
            :limit.sync="pageSize"
            :total="total"
          />
         </div>
       
      </div>
    </div>
  </div>
</template>

<script>
import "echarts-liquidfill";
import pagination from "@/components/comPagination";
import {
  initSpanData,
  initTabData,
  initPieData,
  initContractData,
  initLineData,
  initFillData,
  worksortsNum,
  initpayData
} from "@/api/smartProperty/workbench";
import comCard from "@/components/comCard";

import $contract from "@/api/spaceManagement/contractManagement.js";

export default {
  name: "Workbench",
  components: {
    pagination,
    comCard,
  },
  data() {
    return {
      grid: {
        bottom: 0
      },
        chartExtend: {
        xAxis: {
          axisLabel: {
            textStyle: {
              color: "#333" //x轴字体颜色
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: "#333" //y轴字体颜色
            }
          },
          splitLine: {
            lineStyle: {
              color: "#333",
              width: 0.5 //线宽
            }
          }
        },
        legend: {
          pageTextStyle: {
            color: "#333" //翻页数字颜色
          },
          pageIconColor: "#206aff",
          pageIconInactiveColor: "#202230",
          type: "scroll",
          textStyle: {
            color: "#333" //图例字体颜色
          }
        },
        series: {
          barMaxWidth: 10,
          type:'line'
        },
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
      // permission: {
      //   getSpan: "smartProperty::workbench::getSpan",
      //   getFill: "smartProperty::workbench::getFill",
      //   getLine: "smartProperty::workbench::getLine",
      //   getDynamics: "smartProperty::workbench::getDynamics",
      // },
      spanList: [
        {
          type: "icon_weixiugongdan",
          num: 0,
          name: "维修工单",
          path: require(`@/assets/icons/svgui/icon_weixiugongdan.svg`),
        },
        {
          type: "icon_yuqiweifukuan",
          num: 0,
          name: "逾期未付款",
          path: require(`@/assets/icons/svgui/icon_yuqiweifukuan.svg`),
        },
        {
          type: "icon_feiyongjiaona",
          num: 0,
          name: "费用缴纳",
          path: require(`@/assets/icons/svgui/icon_feiyongjiaona.svg`),
        },
        {
          type: "icon_ruzhu",
          num: 0,
          name: "入驻",
          path: require(`@/assets/icons/svgui/icon_ruzhu.svg`),
        },
        {
          type: "icon_xuzu",
          num: 0,
          name: "续租",
          path: require(`@/assets/icons/svgui/icon_xuzu.svg`),
        },
        {
          type: "icon_tuizu",
          num: 0,
          name: "退租",
          path: require(`@/assets/icons/svgui/icon_tuizu.svg`),
        },
      ],
      tableData: [],
      filterSelectType: "week",
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
      total: 0,
      pageNum: 1,
      pageSize: 5,
      defaultLineChart: null,
      defaultPieChart: null,
      liquidFillGroup: [],
      fillTotal: 0,
      workOrder: "工单数量统计",
      worktotal: 0,
      worksorts: [
        {
          value: "CHANGE",
          name: "合同变更",
        },
        {
          value: "ENTER",
          name: "入驻",
        },
        {
          value: "GIVEUP",
          name: "退租",
        },
        {
          value: "RENEW",
          name: "续租",
        },
        {
          value: "SIGN",
          name: "签订合同",
        },
      ],
      chartDatas:{},
    };
  },
  mounted() {
    this.getSpanData();
    this.getTabData();
    this.chartInit();
    this.getLineData();
    this.getPieData();
    this.getFillData();
    this.init();
  },
  methods: {
    filterContent(data) {
      let res = this.worksorts.filter((item) => {
        return item.value == data.operateType;
      });
      return res[0].name;
    },
    init() {
      //      this.$nextTick()将回调延迟到下次 DOM 更新循环之后执行,解决this.$Echarts初始化循环生成节点报错的问题
      this.$nextTick(function () {
        this.liquidFillGroup.map((v, index) => {
          var fillChart = this.$Echarts.init(
            document.getElementById("fillChart" + index)
          );
          fillChart.setOption(this.initFillChart(index));
          window.addEventListener("resize", () => {
            fillChart.resize();
          });
        });
      });
    },
    // 统计图初始化
    chartInit() {
      this.defaultPieChart = this.$Echarts.init(document.getElementById("pie"));
    },
    //      请求最上方六个标签数据
    getSpanData() {
      initSpanData().then((res) => {
        this.spanList[3].num = res.data;
      });
      initContractData().then((res) => {
        let nums = res.data.filter((item) => {
            return item.name == "renew";
          });
          this.spanList[4].num = nums[0].value;
          let numss = res.data.filter((item) => {
            return item.name == "giveup";
          });
          this.spanList[5].num = numss[0].value;
      });
      worksortsNum().then((res) => {
        this.spanList[0].num = res.data.totalAmount;
      });
      initpayData().then((res)=>{
        this.spanList[1].num = res.data.nopayCompany;
        this.spanList[2].num = res.data.payCompany;
      })
    },
    getTabData() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      $contract.searchdynamic(data).then((res) => {
        this.tableData = res.data.data;
          this.total = res.data.total;
      });
    },
    //      请求饼图数据
    getPieData() {
     initPieData().then((res)=>{
      this.initPieChart(this.defaultPieChart, res.data);
      });
    },
    getLineData() {
      let data = this.filterSelectType;
      initLineData(data).then((res) => {
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
    },
    //      请求水球图数据
    getFillData() {
       let data = this.filterSelectType;
      initLineData(data).then((res) => {
        let data = [];
          res.data.statusResult.forEach(item=>{
            if(item.name =='全部工单'){
              data.push(item)
            }
          })
          let results = res.data.statusResult.filter(item=>{
            if(item.name !='全部工单'){
              return item;
            }
          })
          data.push(...results)
          console.log(data,'15')
          this.liquidFillGroup = data; 
          this.init();
      })
    },
    initPieChart(eleDom, data) {
      let pieOption = {
        title: {
          text: "工单分类",
          left: "left",
          textStyle: {
            /* color: "#afb9d0", */
            /* fontWeight: "lighter", */
            fontFamily: "Microsoft YaHei",
            fontSize: 16,
            fontWeight:700,
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          show:true,
          type:'scroll',
          orient: "horizontal",
          left: "left",
          top: "10%",
          pageIconColor: "#206aff",
          pageIconInactiveColor: "#202230",
          textStyle: {
            /* color: "#afb9d0", */
            color:"#333",
            fontFamily: "Microsoft YaHei",
            fontSize: 14,
            fontWeight: "normal",
          },
            pageTextStyle: {
            color: "#333" //翻页数字颜色
          }
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["50%", "60%"],
            data: data,
          },
        ],
        color: ["#efb01d", "#00dae2", "#00e984"],
      };
      eleDom && eleDom.setOption(pieOption);
      window.addEventListener("resize", () => {
        eleDom.resize();
      });
    },
    initFillChart(index) {
      return {
        title: {
          text: `${this.liquidFillGroup[index].value}/${this.liquidFillGroup[0].value}`,
          textStyle: {
            color: "#fff",
            fontSize: 10,
            align: "center",
            fontWeight: "400",
            baseline: "middle",
            verticalAlign: "middle",
          },
          left: "center",
          top: "45%",
        },
        series: [
          {
            //        类型为水球图
            type: "liquidFill",
            backgroundStyle: {
              color: "#40445a",
            },
            //        指定水波比例，可传四个参数
            data: [
              {
                value:
                  this.liquidFillGroup[index].value / this.liquidFillGroup[0].value,
                direction: "left",
                itemStyle: {
                  normal: {
                    color: "#8fa1ff",
                  },
                },
              },
              {
                value:
                  this.liquidFillGroup[index].value / this.liquidFillGroup[0].value,
                direction: "right",
                itemStyle: {
                  normal: {
                    /* color: "#4b69ff", */
                    color:"rgb(64, 158, 255)",
                  },
                },
              },
            ],
            //          中间文字样式
            label: {
              normal: {
                //          水球内容formatter
                formatter: this.liquidFillGroup[index].name,
                textStyle: {
                  fontSize: 14,
                  fontFamily: "Microsoft YaHei",
                  fontWeight: "normal",
                  color:"#333",
                  /* color: "#afb9d0", */
                },
                position: ["50%", "130%"],
              },
            },
            outline: {
              //          是否显示轮廓 布尔值
              show: false,
            },
          },
        ],
      };
    },
    //      折线图选择x轴选项
    chooseDate(date) {
      this.filterSelectType = date.currentTarget.value;
      this.getLineData();
      this.getFillData();
    },
    handleCurrentChange(val) {
      this.getTabData();
    },
    routerClick(data) {
      console.log(data,'data')
      if (data === "icon_weixiugongdan") this.$router.push({ path: "/SmartProperty/WorkManagement/Infomation" });
      if (data === "icon_yuqiweifukuan")
        this.$router.push({ name:"/payment", params: { id: 0 } });
      if (data === "icon_feiyongjiaona")
        this.$router.push({ name:"/payment", params: { id: 1 } });
      if (data === "icon_ruzhu") this.$router.push({ path: "/SmartProperty/Settled" });
      if (data === "icon_xuzu") this.$router.push({ path: "/SmartProperty/Renewal" });
      if (data === "icon_tuizu")
        this.$router.push({ params: {value: 'giveupCompleted'},path: "/SmartProperty/Rentrelease" } );
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: transparent;
  padding: 0;
  overflow:hidden;
}

.infos {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 16px ;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  img {
    width: 80px;
    height: auto;
  }
}

p {
  margin: 0;
  padding: 0;
}

.topData {
  width:100%;
  height: 12vh;
  padding:0px;
}

.middleData {
  margin-top: 10px;
  .middleLeft {
    background: rgb(255, 255, 255);
    // padding: 16px 16px 0px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
    border-radius: 8px;
    height: 35vh;
    .workOrder {
      // width: 80px;
      height: 26px;
      font-family: Microsoft YaHei;
      font-size: 16px;
      font-weight: 700;
      font-stretch: normal;
      line-height: 26px;
      letter-spacing: 0px;
      margin: 20px 0 0 10px;
    }
    .liquidFillGroups {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .liquidFill {
        width: 33%;
        height: 12vh;
      }
    }

    .middleCenter_content {
      border-radius: 8px;
      position: relative;
      .dateButtonGroup {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 9999;
        .focus {
          color: #ffffff;
          background-color:rgb(64, 158, 255);
        }
      }
      #line {
        height: 35vh;
        padding: 10px;
      }
      .dateButton {
        border: none;
        border-radius: 2px;
        font-size: 12px;
      }
    }
  }
}
  #pie {
    width: 100%;
    height: 35vh;
    background: rgb(255, 255, 255);
    // padding: 16px 16px 0px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
    border-radius: 8px;
    padding: 20px;
  }

.bottomData {
  flex: 1;
  width: 100%;
  background: rgb(255, 255, 255);
    // padding: 16px 16px 0px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
  overflow:hidden;
  p {
    margin-bottom: 10px;
    width: 80px;
    height: 26px;
    font-family: Microsoft YaHei;
    font-size: 16px;
    font-weight: 700;
    font-stretch: normal;
    line-height: 26px;
    letter-spacing: 0px;
  }
}
</style>