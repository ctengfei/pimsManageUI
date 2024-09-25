<template>
  <el-card>
    <template #header>
      <span class="text-size-16px">人员类型占比</span>
    </template>
    <v-chart class="chart" :option="option" :loading="loading" :loading-options="{text: '加载中'}" :autoresize="true" />
  </el-card>
</template>

<script>
export default {
  props: {
    data: Array
  },
  data () {
    const option = {
      color: ['#0081FF', '#36559C', '#FF8100', '#8BE757','#3E8EFF'],
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        itemWidth: 10,
        itemHeight: 10
      },
      grid: {
        top: '8%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      series: [{
        type: 'pie',
        radius: ['72%', '90%'],
        center: ['25%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        data: []
      }]
    }
    return {
      option,
      loading: false,
    }
  },
  watch: {
    data (val) {
      const { legend, series } = this.option
      legend.formatter = name => {
        let precet = null;
        val.forEach((item) => {
          if (item.name == name) {
            precet = item.percent;
          }
        });
        return `${name} ${precet}`;
      }
      series[0].data = val
    }
  },
}
</script>

<style lang="less" scoped>
.chart {
  height: 100px;
}
/deep/.el-card__header {
  border-bottom: none !important;
}
</style>
