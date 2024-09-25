<template>
  <div id="adochart">
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
        text: '青少年类型',
        left: '13%',
        top: 'center',
        textStyle: {
          width: '70',
          overflow: 'break',
          fontSize: '14px'
        },
      },

      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '20',
        right: '3%',
        bottom: '20',
        orient: 'vertical',
        icon: 'rect'
      },
      series: [
        {
          name: '青少年类型',
          type: 'pie',
          radius: ['70%', '85%'],
          center: ["20%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center',

          },
          labelLine: {
            show: false
          },
          data: [

          ]
        }
      ]
     }
    }
    // return {
    //   option,
    //   loading: false
    // }
  },
  props: ['qsntype'],
  watch: {
    qsntype (val) {
      this.$nextTick(() => {
        this.option.series[0].data = val
        var chartDom = document.getElementById('adochart');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    }
  },
}
</script>

<style>
</style>
