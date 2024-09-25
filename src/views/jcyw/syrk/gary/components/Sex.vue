<template>
  <div id="sexChart">
    <!-- <v-chart :option="option"
             class="chart"
             :loading="loading"
             :loading-options="{ text: '加载中' }" /> -->
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
        text: '性别占比',
        left: '20%',
        top: '44%',
        textStyle: {
          width: '60',
          overflow: 'break',
          fontSize: '14px'
        },
      },

      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        top: '20',
        right: '5%',
        bottom: '20',
        orient: 'vertical',
        icon: 'rect',
        formatter: (name) => {
          if (name.length > 4) {
            return `${name.slice(0, 3)}...`
          } else {
            return name
          }
        }
      },
      series: [
        {
          name: '性别占比',
          type: 'pie',
          radius: ['70%', '85%'],
          center: ["30%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center',

          },
          emphasis: {

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
    sexList (val) {
      this.$nextTick(() => {

        this.option.series[0].data = val
        var chartDom = document.getElementById('sexChart');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    }
  },
}
</script>

<style>
</style>
