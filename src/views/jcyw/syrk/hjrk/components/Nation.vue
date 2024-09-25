<template>
  <div>
    <div class="box" id="mainbox">
      <div class="bom" >
        <!-- <v-chart :option="option"
                 :loading="loading"
                 :loading-options="{text: '加载中'}"
                 :autoresize="true" /> -->
      </div>

    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return{
     option:{
      title: {
        text: '民族分布',
        left: 'center',
        top: '0',
        textStyle: {
          width: '60',
          overflow: 'break',
          fontSize: '14px'
        },
      },
      grid: {
        top: '18',
        left: '10',
        right: '10',
        bottom: '0',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#E9EAF1'
          }
        },
        axisLabel: {
          color: '#A0A7C1'
        },
        data: []
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'axis'
      },
      series: [{
        type: 'bar',
        barWidth: '10',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#3E8FFF' // 0% 处的颜色
            }, {
              offset: 1, color: '#0AC6F8' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        data: []
      }]
     }
    }
   
    // return {
    //   option,
    //   loading: false,
    // }
  },
  props: ['minzu'],
  watch: {
    minzu (val) {
      this.$nextTick(() => {
        let yList = []
        let xList = []
        val.forEach(item => {
          yList.push(item.name)
          xList.push(item.value)
        });
        this.option.series[0].data = xList  //x轴
        this.option.xAxis.data = yList //y轴
        var chartDom = document.getElementById('mainbox');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    }
  },
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  .bom {
    flex: 1;
    width: 100%;
  }
}
</style>
