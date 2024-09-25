<template>
  <div id="natchart">
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
        text: '帮扶手段',
        textStyle: {
          width: '60',
          overflow: 'break',
          fontSize: '14px'
        },
      },
      legend: {
        show: false,
        data: ['Allocated Budget', 'Actual Spending']
      },

      radar: {
        shape: 'circle',
        radius: 45,
        startAngle: 70,
        indicator: [{ label: '1', num: 0 }, { label: '1', num: 0 }, { label: '1', num: 0 }],
        axisName: {//字体样式
          color: '#428BD4',
          fontSize: '14px'
        }
      },
      series: [
        {
          name: '帮扶手段',
          center: ['25%', '50%'],
          type: 'radar',
          areaStyle: {//覆盖面样式
            color: 'rgba(255, 228, 52, 0.6)'
          },
          label: {
            show: true,
            formatter: function (params) {
              return params.value;
            }
          },
          data: [
            {
              value: [0, 0, 0],
            },
          ]
        }
      ]
     }
    }
    
    // return {
    //   option,
    //   loading: false,
    // }
  },
  props: ['leida'],
  watch: {
    leida (val) {
      if (val.list) {
        this.$nextTick(() => {
          let list = []
          let seriesList = []
          val.list.forEach(item => {
            list.push({
              name: item.lable,
              max: val.num
            })
            seriesList.push(item.num)
          });
          this.option.radar.indicator = list
          this.option.series[0].data[0].value = seriesList
          var chartDom = document.getElementById('natchart');
          var myChart = echarts.init(chartDom);
          myChart.setOption(this.option);
        })
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>
