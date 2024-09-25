import request from '@/utils/request'

//获取列表
export function getTableData(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}

//获取告警统计
export function getAllWarning() {
  return request({
    url: '/pm/alarm/order/count',
    method: "get",
  })
}

//导出
export function download(data) {
  return request({
    url: "/pm/alarm/order/download",
    method: "get",
    params:data,
    responseType: 'blob',
  })
}

// 指派任务
export function alarmOrderAssign(id, data) {
  return request({
    url: "/pm/alarm/order/assign?id="+ id,
    method:"post",
    data
  })
}

// 告警任务评价
export function alarmOrderEvaluate(data) {
  return request({
    url: "/pm/alarm/order/evaluate",
    method: "post",
    data: data
  })
}
