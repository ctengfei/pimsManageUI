import request from '@/utils/request'

//获取告警列表
export function getTableData(data) {
  return request({
    url: '/pm/alarm',
    method: "get",
    params: data
  })
}
// 手动告警
export function manualAralm(data) {
  return request({
    url: '/pm/alarm',
    method: "post",
    data: data
  })
}

// 根据主键查询告警
export function getAlarmId(id) {
  return request({
    url: '/pm/alarm/'+id,
    method: "get",
  })
}

// 告警下发
export function alarmAssign(data) {
  return request({
    url: "/pm/alarm/assign",
    method:"post",
    data: data
  })
}

// 关闭告警
export function alarmClose(data) {
  return request({
    url: "/pm/alarm/close",
    method: "put",
    data: data
  })
}
// 批量关闭告警
export function batchAlarmClose(data) {
  return request({
    url: "/pm/alarm/batchClose",
    method: "put",
    data: data
  })
}
// 获取事件名称
export function getConfigCodeEvent() {
  return request({
    url: "/pm/alarm/config/event",
    method: "get",
  })
}
// 查询安防告警各等级数量统计信息
export function getstatisticsEvent() {
  return request({
    url: "/pm/alarm/query/statistics/all/level",
    method: "get",
  })
}
