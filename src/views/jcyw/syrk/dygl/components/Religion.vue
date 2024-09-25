<template>
  <div>
    <v-chart :option="option"
             class="chart"
             :loading="loading"
             :loading-options="{ text: '加载中' }" />
  </div>
</template>

<script>
export default {
  data () {
    const option = {
      title: {
        text: '学历占比',
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
        type: "scroll",
        top: '10%',
        right: '1%',
        bottom: '15%',
        orient: 'vertical',
        height: '80%',
        icon: 'rect',
        formatter: (name) => {
          if (name.length > 4) {
            return `${name.slice(0, 4)}...`
          } else {
            return name
          }
        }
      },
      series: [
        {
          name: '学历占比',
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
          labelLine: {
            show: false
          },
          data: []
        }
      ]
    };
    return {
      option,
      loading: false
    }
  },
  props: ['zongjiao'],
  watch: {
    zongjiao (val) {
      this.$nextTick(() => {
        this.option.series[0].data = val
      })
    }
  },
}
</script>

<style>
</style>
