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
        // type: "scroll",
        top: '15%',
        right: '10%',
        bottom: '15%',
        orient: 'vertical',
        // height: '30%',
        icon: 'rect'
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
  props: ['sexList'],
  watch: {
    sexList (val) {
      this.$nextTick(() => {
        this.option.series[0].data = val
      })
    }
  },
}
</script>

<style>
</style>
