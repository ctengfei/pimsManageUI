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
                 :loading-options="{ text: '加载中' }"
                 :autoresize="true" />
      </el-col>
      <el-col :span="10"
              justify="center"
              align="middle">
        <p class="mb-4px">{{ title }}</p>
        <countTo :startVal="0"
                 :endVal="count.count"
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
    wgType: {
      default: {
        title: '',
        count: 0
      }
    },
    total: {
      default: 0
    }
  },
  data () {
    const option = {
      title: {
        show: false
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
          type: 'pie',
          radius: ['70%', '85%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: 'center',
            //显示百分比
            formatter: (params) => {
              return params.percent + '%'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            }
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
      count: '',
      countNum: '',
      title: ''
    }
  },
  watch: {
    wgType: {
      handler: function (val) {
        this.count = val
        this.title = val.title
        const { series } = this.option
        let qt = this.total - val.count
        series[0].data = []
        series[0].data.push({
          name: val.title,
          value: val.count,
          selected: true,
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
            color: '#4799D2'
          }
        })
        series[0].data.push({ name: '其他', value: qt })
      },
      deep: true
    }
  },
  total (val) {
    this.countNum = val
  },
  methods: {}
}
</script>