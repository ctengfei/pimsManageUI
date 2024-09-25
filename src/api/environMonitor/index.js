import request from '@/utils/request'

const environMonitor = {
  // 获取站点列表
  getList(params) {
    return request({
      url: `/environmentalServices/detectionSite/page`,
      method: 'get',
      params: params
    })
  },
  // 
  earlyWarningRule(params) {
    return request({
      url: `/environmentalServices/earlyWarningRule/page`,
      method: 'get',
      params: params
    })
  },
  // 添加站点 
  addMonitor(data) {
    return request({
      url: `/environmentalServices/detectionSite`,
      method: 'post',
      data: data
    })
  },
  // 添加预警规则  
  addWarningRule(data) {
    return request({
      url: `/environmentalServices/earlyWarningRule`,
      method: 'post',
      data: data
    })
  },
  // 根据id批量删除 
  deleteBatchMonitor(data) {
    return request({
      url: `/environmentalServices/detectionSite`,
      method: 'delete',
      data: data
    })
  },
  // 根据id单个删除 
  deleteMonitor(id) {
    return request({
      url: `/environmentalServices/detectionSite/` + id,
      method: 'delete',
    })
  },
  // 删除预警规则
  deleteWarningRule(id) {
    return request({
      url: `/environmentalServices/earlyWarningRule/` + id,
      method: 'delete',
    })
  },
  //启用禁用规则
  WarningRulestatus(status, id) {
    return request({
      url: `/environmentalServices/earlyWarningRule/status/${status}?id=${id}`,
      method: 'get',
    })
  },
  // 根据id获取详情
  getDetail(id) {
    return request({
      url: `/environmentalServices/detectionSite/` + id,
      method: 'get',
    })
  },
  // 获取预警规则详情  /environmentalServices/earlyWarningRule/{id}
  getWarningRule(id) {
    return request({
      url: `/environmentalServices/earlyWarningRule/` + id,
      method: 'get',
    })
  },
  // 修改站点信息
  updateMonitor(id, data) {
    return request({
      url: `/environmentalServices/detectionSite/` + id,
      method: 'put',
      data: data
    })
  },
  // 修改预警规则
  updateWarningRule(id, data) {
    return request({
      url: `/environmentalServices/earlyWarningRule/` + id,
      method: 'put',
      data: data
    })
  },
  // 导出站点列表 /pm/hydropower/data/trend/{type}/{cycle}/export
  exportMonitor(data) {
    return request({
      url: "/environmentalServices/detectionSite/page/export",
      method: "post",
      data: data,
      responseType: 'blob',
    })
  },
  // 获取站点 
  getSiteAll(data) {
    return request({
      url: `/environmentalServices/detectionSite/getListByPosition`,
      method: 'get',
      params: data
    })
  },
  // 设备信息 
  deviceInfo(data) {
    return request({
      url: "/pm/device/criteria/origin",
      method: "get",
      params: data,
    })
  },

  // 单个监测站点数据 
  singleSite(data) {
    return request({
      url: "/detection/data/singleSite",
      method: "get",
      params: data,
    })
  },
  // 监测趋势 /detection/data/monitoringTrendAnalysis/{siteId}
  trendAnalysis(id, data) {
    return request({
      url: "/detection/data/monitoringTrendAnalysis/" + id,
      method: "get",
      params: data,
    })
  },
  // 设配树接口  /pm/tree/node?nodeType=detection
  treenode(data) {
    return request({
      url: "/pm/tree/node",
      method: "get",
      params: data,
    })
  },
  // 获取监测点id business/environmentalServices/detectionSite/getByDeviceId?deviceId=121835
  getByDeviceId(data) {
    return request({
      url: "/environmentalServices/detectionSite/getByDeviceId",
      method: "get",
      params: data,
    })
  },
  // 环境监测最新上报监测指标 /detection/data/latest/{siteId}
  detectionLatest(id) {
    return request({
      url: "/detection/data/latest/" + id,
      method: "get",
    })
  },
  // 环境监测最近24小时趋势分析  /detection/data/24h/{siteId}/{detectionProject}
  detection24h(id) {
    return request({
      url: `/detection/data/24h/${id}`,
      method: "get",
    })
  },
  //获取用电列表 
  getcriteria(params) {
    return request({
      url: `/pm/hydropower/criteria`,
      method: 'get',
      params: params
    })
  },
  //获取用电监测列表
  getRealtimeAmmeter(params) {
    return request({
      url: `/pm/hydropower/data/realtimeAmmeter`,
      method: 'get',
      params
    })
  },
  // 用电实时数据   /pm/hydropower/data/realtime/{hydropowerDeviceType}/{deviceCode}
  realtime(hydropowerDeviceType, deviceCode) {
    return request({
      url: `/pm/hydropower/data/realtime/${hydropowerDeviceType}/${deviceCode}`,
      method: 'get',
    })
  },
  // 用电历史数据
  history(hydropowerDeviceType, deviceCode, params) {
    return request({
      url: `/pm/hydropower/data/history/${hydropowerDeviceType}/${deviceCode}`,
      method: 'get',
      params: params
    })
  },
  // 能耗趋势 /pm/hydropower/data/trend/{type}/{cycle}
  gettrend(data, type, cycle) {
    return request({
      url: `/pm/hydropower/data/trend/${type}/${cycle}`,
      method: 'post',
      data: data
    })
  },
  // 能耗趋势导出  /pm/hydropower/data/trend/{type}/{cycle}/export
  reportDataExport(type, cycle, data) {
    return request({
      url: `/pm/hydropower/data/trend/${type}/${cycle}/export`,
      method: 'post',
      data,
      responseType: 'blob',
    })
  },
  getPrediction(type, params) {
    return request({
      url: `/pm/hydropower/forecast/${type}/getForecastDataByNodeId`,
      method: 'get',
      params
    })
  },
  getCarbonEmission(params) {
    return request({
      url: `/pm/hydropower/carbonEmission/${params.timeType}/getCarbonEmissionByCompany`,
      method: 'get',
      params
    })
  },
  // 能耗诊断  /pm/hydropower/data/diagnosis/{type}
  diagnosis(data, type) {
    return request({
      url: `/pm/hydropower/data/diagnosis/${type}`,
      method: 'post',
      data: data
    })
  },
  // 能耗手动上报告警  
  reportAlarm(params) {
    return request({
      url: `pm/hydropower/alarm/reportAlarm`,
      method: 'get',
      params
    })
  },
}
export default environMonitor