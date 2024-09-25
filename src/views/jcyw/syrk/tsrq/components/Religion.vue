<template>
  <div id="tschart">
    <!-- <v-chart class="chart"
             :option="option"
             :loading="loading"
             :loading-options="{text: '加载中'}"
             :autoresize="true" /> -->
  </div>

</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return{
    option:{
      color: ['#3E8FFF', '#76CFFF', '#4799D2', '#F73959', '#FF945F', '#5FCD00'],
      title: {
        text: '年龄分布',
        left: '10',
        top: '10',
        textStyle: {
          fontSize: '14px'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['男', '女', '未知', '未说明'],
        right: '10',
        icon: 'rect',
        top: '10'
      },
      grid: {//画布位置
        left: '10',
        right: '10',
        bottom: '10',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '男',
          type: 'line',
          stack: 'Total',
          areaStyle: {

          },
          emphasis: {
            focus: 'series'
          },
          data: []
        },
        {
          name: '女',
          type: 'line',
          stack: 'Total',
          areaStyle: {

          },
          emphasis: {
            focus: 'series'
          },
          data: []
        },
        {
          name: '未知',
          type: 'line',
          stack: 'Total',
          areaStyle: {

          },
          emphasis: {
            focus: 'series'
          },
          data: []
        },
        {
          name: '未说明',
          type: 'line',
          stack: 'Total',
          areaStyle: {

          },
          emphasis: {
            focus: 'series'
          },
          data: []
        },
      ]
     }
    }
    // return {
    //   option,
    //   loading: false,
    // }
  },
  props: ['sexList'],
  watch: {
    sexList (val) {
      this.$nextTick(() => {
        // this.option.xAxis.data //x轴
        // this.option.series[0].data //男
        // this.option.series[1].data //女
        // this.option.series[2].data //未知
        // this.option.series[3].data //为说明
        // 0是未知  1是男 2是女 9是未说明
        let xAxis = []
        let wz = []
        let nan = []
        let nv = []
        let wsm = []
        val.forEach(item => {

          xAxis.push(item.ageRange)

          item.sexList.forEach(res => {

            if (res.value == '0') {
              wz.push(res.num)
            } else if (res.value == '1') {
              nan.push(res.num)
            } else if (res.value == '2') {
              nv.push(res.num)
            } else if (res.value == '9') {
              wsm.push(res.num)
            }

          })
        });
        this.option.xAxis[0].data = xAxis
        this.option.series[0].data = nan
        this.option.series[1].data = nv
        this.option.series[2].data = wz
        this.option.series[3].data = wsm
        console.log(this.option)
        var chartDom = document.getElementById('tschart');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    }
  },
}
</script>

<style lang="less" scoped>
</style>
