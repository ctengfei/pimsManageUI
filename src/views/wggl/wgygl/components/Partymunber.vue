<template>
  <div class="xzWgyglmain">
    <el-row :span="24"
            style="height: 100%; width: 100%"
            type="flex"
            justify="center"
            align="middle"
            align-items="center">
      <el-col :span="14"
              style="height: 100%">
        <v-chart :option="option"
                 :loading="loading"
                 :loading-options="{ text: '加载中' }"
                 :autoresize="true" />
      </el-col>
      <el-col :span="10"
              justify="center"
              align="middle">
        <p class="mb-4px">党员数量</p>
        <countTo :startVal="0"
                 :endVal="dysl"
                 class="text-size-24px text-blue-500"></countTo>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  props: {
    partymunber: '',
    gridTeam: ''
  },
  data () {
    const option = {
      title: {
        text: '党员占比',
        top: 'center',
        left: '18%',
        textStyle: {
          width: '60',
          overflow: 'break',
          fontSize: '14px'
        }
      },
      color: ['#4799D2', '#999696d4'],
      tooltip: {
        trigger: 'item'
      },
      legend: {
        show: false,
        orient: 'vertical',
        right: 10,
        top: 'center',
        itemWidth: 10,
        itemHeight: 10
      },
      series: [
        {
          name: '党员占比',
          type: 'pie',
          radius: ['70%', '85%'],
          center: ['35%', '50%'],
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
    }
    return {
      option,
      loading: false,
      dysl: this.partymunber,
      countNum: this.gridTeam
    }
  },
  watch: {
    partymunber (val) {
      this.dysl = val
      // console.info(val)
      const { series } = this.option
      let qt = this.gridTeam - val
      series[0].data = []
      series[0].data.push({
        value: val,
        selected: true,
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold',
          color: '#4799D2'
        }
      })
      series[0].data.push({ name: '其他', value: qt })
      // console.info(series[0].data)
    }
  },
  gridTeam (val) {
    this.countNum = val
  },
  methods: {
    getPercentage (val) {
      //百分比必须为0-100，否则报错[Vue warn]:Invalid prop:custom validator check failed for prop "percentage"
      let result = 0
      if (val != null) {
        result = Math.round((val / this.countNum) * 100)
      }
      return result
    }
  }
}
</script>

