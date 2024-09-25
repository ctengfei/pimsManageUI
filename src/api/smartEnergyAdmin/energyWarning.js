import request from '@/utils/request'

// 异常列表
export function initTabDataList(data) {
    return request({
      url: "/pm/hydropower/alarm/criteria",
      method: "get",
      params: data
    })
}
// /pm/hydropower/alarm/{id}
export function alarmifon(id) {
  return request({
    url: `/pm/hydropower/alarm/${id}`,
    method: "get",
  })
}
// 告警下发
export function alarmAssign(data) {
  return request({
    url: "/pm/hydropower/alarm/assign",
    method:"post",
    data: data
  })
}

// 关闭告警
export function alarmClose(data) {
  return request({
    url: "/pm/hydropower/alarm/close",
    method: "put",
    data: data
  })
}
// 异常确认
export function toWarningNext(data) {
  return request({
    url: "/pm/hydropower/alarm/addAlarm",
    method: "get",
    params: data
  })
}
// 手动预警
export function handleWarningTo(data) {
  return request({
    url: "/pm/hydropower/alarm/insertAlarmList",
    method: "post",
    params: data
  })
}
// 阈值监测
export function thresholdWarning(data) {
  return request({
    url: "/pm/hydropower/alarm/ThresholdDetection",
    method: "get",
    params: data
  })
}

//导出
export function download(url, method, params) {
  return request({
    url: url,
    method: method,
    responseType: 'blob',
    params
  })
}
//历史数据
export function initLineDataNew(data) {
  // if (data.filterSelectType === 'week') {
  //   return {
  //     data: [820, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330]
  //   }
  // } else if (data.filterSelectType === 'month') {
  //   return {
  //     data: [820, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330]
  //   }
  // } else if (data.filterSelectType === 'year') {
  //   return {
  //     data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 434, 1190]
  //   }
  // }

  return request({
    url: "/pm/hydropower/point/historicalData",
    // url: `/pm/repair/order/query/statistics/${data}`,
    method: "get",
    params: data
  })
  
}
export function threshold() {
  return request({
    url: '/pm/hydropower/alarm/threshold',
    method: 'get'
  })
}
//修改阈值监测
export function databatch(data) {
  return request({
    url: '/pm/hydropower/alarm/threshold',
    method: 'put',
    data: data
  })
}