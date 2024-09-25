<template>
  <div id="chartnat">
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
      // title: {
      //   text: '经济占比',
      //   left: '18%',
      //   top: '44%',
      //   textStyle: {
      //     width: '60',
      //     overflow: 'break',
      //     fontSize: '14px'
      //   },
      // },
      color: ['#3E8FFF', '#76CFFF', '#4799D2', '#F73959', '#FF945F', '#5FCD00'],
      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        top: '10%',
        right: '1%',
        bottom: '15%',
        orient: 'vertical',
        height: '80%',
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
          name: '经济占比',
          type: 'pie',
          radius: ['70%', '85%'],
          center: ['22%', '50%'],
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
  props: ['minzu'],
  watch: {
    minzu(val) {
      this.$nextTick(() => {
        this.option.series[0].data = val
        var chartDom = document.getElementById('chartnat');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    }
  }
}
</script>

<style>
</style>
