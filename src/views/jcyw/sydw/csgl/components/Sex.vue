<template>
  <div id="chartsexs">
    <!-- <v-chart
      :option="option"
      class="chart"
      :loading="loading"
      :loading-options="{ text: '加载中' }"
    /> -->
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return{
     option:{
      color: ['#3E8FFF', '#76CFFF', '#4799D2', '#F73959', '#FF945F', '#5FCD00'],
      // title: {
      //   text: '场所占比',
      //   left: '16%',
      //   top: '44%',
      //   textStyle: {
      //     width: '60',
      //     overflow: 'break',
      //     fontSize: '14px'
      //   },
      // },

      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        top: '33%',
        right: '3%',
        bottom: '15%',
        orient: 'vertical',
        // height: '30%',
        icon: 'rect',
        textStyle: {
          width: 61,
          overflow: 'truncate'
        },
        tooltip: {
          show: true
        }
      },
      series: [
        {
          name: '场所占比',
          type: 'pie',
          radius: ['70%', '85%'],
          center: ['25%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center',
            formatter: '{a}',
            fontSize: 14,
            fontWeight: 'bold'
          },
          labelLine: {
            show: false
          },
          data: []
        }
      ]
    }
    }
   
    // return {
    //   option,
    //   loading: false
    // }
  },
  props: ['sexList'],
  watch: {
    sexList(val) {
      this.$nextTick(() => {
        this.option.series[0].data = val
        var chartDom = document.getElementById('chartsexs');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    }
  }
}
</script>

<style>
</style>
