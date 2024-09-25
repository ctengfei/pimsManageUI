import { BarChart, LineChart, PieChart } from 'echarts/charts'

import {
  GridComponent,
  LegendComponent, TitleComponent,
  TooltipComponent
} from 'echarts/components'

import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import {
  CanvasRenderer
} from 'echarts/renderers'

import Vue from 'vue'

import ECharts from 'vue-echarts'



use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent
])


// register globally (or you can do it locally)
Vue.component('v-chart', ECharts)

