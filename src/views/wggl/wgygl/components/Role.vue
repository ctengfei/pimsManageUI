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
    jsdata: Array
  },
  data () {
    const option = {
      title: {
        text: '角色分类',
        left: '16%',
        top: 'center',
        textStyle: {
          width: '60',
          overflow: 'break',
          fontSize: '14px'
        },
      },
      // color: ['#0081FF', '#36559C', '#FF8100', '#8BE757'],
      // color: ['#0450e7', '#2e68db', '#5684df', '#8ca8e1'],
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
          center: ['25%', '50%'],
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
  watch: {
    jsdata (val) {
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
      series[0].data = []
      series[0].data = val
    }
  },
  mounted () { }
}
</script>
