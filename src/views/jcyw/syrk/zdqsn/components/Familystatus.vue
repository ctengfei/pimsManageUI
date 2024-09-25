<template>
  <div id="famchart">
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
        text: '家庭情况',
        left: '19%',
        top: '42%',
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
        // formatter: (name) => {
        //   if (name.length > 4) {
        //     return `${name.slice(0, 3)}...`
        //   } else {
        //     return name
        //   }
        // }
      },
      series: [
        {
          name: '家庭情况',
          type: 'pie',
          radius: ['70%', '85%'],
          center: ["25%", "50%"],
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
  props: ['jiating'],
  watch: {
    jiating (val) {
      this.$nextTick(() => {

        this.option.series[0].data = val
        var chartDom = document.getElementById('famchart');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    }
  },
}
</script>

<style>
</style>
