<template>
  <div class="xzWgyglmain">
    <v-chart :option="option"
             :loading="loading"
             :loading-options="{ text: '加载中' }"
             :autoresize="true" />
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  },
  data () {
    const option = {
      title: {
        text: '性别占比',
        left: '18%',
        top: 'center',
        textStyle: {
          width: '60',
          overflow: 'break',
          fontSize: '14px'
        }
      },
      color: ['#76CFFF', '#4799D2', '#3E8FFF'],
      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        top: '15%',
        right: '3%',
        bottom: '15%',
        orient: 'vertical',
        height: '80%',
        icon: 'rect'
      },
      series: [
        {
          type: 'pie',
          radius: ['70%', '85%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          data: []
        }
      ]
    }
    return {
      option,
      loading: false
    }
  },
  created () { },
  watch: {
    data (val) {
      const { legend, series } = this.option
      legend.formatter = (name) => {
        let precet = null
        val.forEach((item) => {
          if (item.name == name) {
            precet = item.percent
          }
        })
        return `${name} ${precet}`
      }
      series[0].data = val
    }
  }
}
</script>
