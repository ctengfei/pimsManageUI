import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import './assets/icons/font/iconfont.css'
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request1'

import './assets/icons' // icon
import './permission' // permission control
import './jsHostSDK-1.0.0.min' // permission control
import Videoplayers from '@/components/videoplayers'
import VideoPlayerGroup from '@/components/videoPlayerGroup'
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { VTable, VTableCell, VTableSearchItem ,VTableNew} from '@/components/VTable'
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
// 高亮角组件
import HighlightSquare from './components/HighlightSquare'

// 图表
import * as Echarts from 'echarts';

import VCharts from 'v-charts'
import browser from "@/utils/browser";
import "echarts"
import ECharts from 'vue-echarts'
import dataV from '@jiaminghi/data-view'
import VueAMap from 'vue-amap';
 
Vue.use(VueAMap);

Vue.use(dataV)
// 引入图片静态常量
import net from "./constants"
Vue.component('HighlightSquare', HighlightSquare)
// 全局方法挂载
Vue.prototype.$browser = browser
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.$Echarts = Echarts;


Vue.prototype.NET = net
// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)
Vue.component('Videoplayers', Videoplayers)
Vue.component('VideoPlayerGroup', VideoPlayerGroup)
Vue.component(VTable.name, VTable)
Vue.component(VTableNew.name, VTableNew)
Vue.component(VTableCell.name, VTableCell)
Vue.component(VTableSearchItem.name, VTableSearchItem)
Vue.component('v-chart', ECharts)
Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
Vue.use(VCharts)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: 'small' // set element-ui default size
})
VueAMap.initAMapApiLoader({
    key: '11aacd8b4429ccdc79d847c45c50c1a5',
    plugin: [
      'AMap.Autocomplete',
      'AMap.PlaceSearch',
      'AMap.Scale',
      'AMap.OverView',
      'AMap.ToolBar',
      'AMap.MapType',
      'AMap.PolyEditor',
      'AMap.CircleEditor',
      'AMap.Geolocation',
      'AMap.DistrictSearch',
      'AMap.Geocoder'
    ],
    v: '1.4.15',
    uiVersion: '1.0.11',
});
window._AMapSecurityConfig = {
    securityJsCode: 'dc17db6c9c2fbc8b64b842f2afbe155f' // 密钥
}
// 高德地图密钥 token: '11aacd8b4429ccdc79d847c45c50c1a5'    center: [113.272938, 23.304494]

// 禁止点击 modal 关闭 Dialog
Element.Dialog.props.closeOnClickModal.default = false;
Element.Dialog.props.closeOnPressEscape.default = false;

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
