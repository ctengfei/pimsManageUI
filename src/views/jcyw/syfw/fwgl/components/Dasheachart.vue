<template>
  <div class="dasheachart" >
    <div id="chartbox"></div>
    <!-- <v-chart :option="option"
             class="chart"
             ref="chart"
             :loading="loading"
             :loading-options="{ text: '加载中' }" /> -->
    <div class="box-border tuBiaoWenzi">
      <div class="text-14px text-hex-505D69 box-border pb-3px">入住率</div>
      <div class="font-bold text-28px text-hex-3E8FFF box-border pt-3px">{{`${this.option.series[0].data[0].value}%`}}</div>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'process'
import * as echarts from 'echarts'
export default {
  data () {
    return{
     option:{
      tooltip: {
        formatter: '入住率'
      },
      series: [
        {
          name: '1',
          type: 'gauge',
          detail: {
            formatter: ' '
          },
          data: [
            {
              value: '0',
              name: ''
            }
          ],
          center: ['50%', '50%'],
          radius: "82%",
          pointer: {
            width: 3,
            length: '60%'
          },
          axisLine: {
            lineStyle: {
              width: 10
            }
          },
          axisTick: {
            length: 1
          },
          axisLabel: {
            fontSize: 8
          }
        }
      ]
     }
    }
    // return {
    //   option,
    //   loading: false,
    //   chartWidth: 0,
    //   chartHeight: 0
    // }
  },
  props: ['optionList'],
  mounted () {

  },
  watch: {
    optionList (val) {
      this.$nextTick(() => {
        this.option.series[0].data[0].value = val.rzRate
        var chartDom = document.getElementById('chartbox');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    },

  },
}
</script>

<style lang="scss" scoped>
.dasheachart {
  // width: 267px !important;
  // box-sizing: border-box;
  //  在图标的时候  左侧间距设置为0  只设置右侧间距
  .chart {
    flex: 1; //在为图标时  在左侧文字设置好之后 用flex：1设置图标的宽度
  }
  #chartbox{
    position: relative;
    width: 263px;
    height: 164px;
    padding: 0px;
    margin: 0px;
    border-width: 0px;
    cursor: default;
  }
  .tuBiaoWenzi {
    padding-right: 12%;
  }
}
</style>