
<template>
  <div id="main">
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
    return {
      // option,
      // loading: false
      option: {
            color: ['#3E8FFF', '#76CFFF', '#4799D2', '#F73959', '#FF945F', '#5FCD00'],
                // 设置标题
                  title: {
                    text: '出租用途',
                    left: '18%',
                    top: '42%',
                    textStyle: {
                      width: '60',
                      overflow: 'break',
                      fontSize: '14px'
                    },
                  },
 
                // 鼠标滑过显示悬浮框
                tooltip: {
                  trigger: 'item'
                },
                // 设置图例
                  legend: {
                    top: '19%',
                    right: '15%',
                    bottom: '15%',
                    orient: 'vertical',
                    height: '60%',
                    icon: 'rect'
                  },
                // 设置主体
                series: [
                    {
                        name: '出租用途', 
                        type: 'pie',
                        radius: ['70%', '85%'],
                        center: ['25%', '50%'],
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
                        ],
                    },
                ]
            }
    }
  },
  props: ['optionList'],
  watch: {
    optionList (val) {
      this.$nextTick(() => {
        val.czytList.forEach(item => {
          this.option.series[0].data.push({
            name: item.lable,
            value: item.num
          })
        })
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom);
        myChart.setOption(this.option);
      })
    }
  }
}
</script>

<style>
</style>
