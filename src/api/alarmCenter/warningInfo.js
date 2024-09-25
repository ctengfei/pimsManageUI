import request from '@/utils/request'

//获取列表
export function getTableData(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}
//删除按钮
export function Delete(id) {
  return request({
    url: "/pm/alarm/deleteById",
    method: "delete",
    params: id
  })
}
//获取告警统计
export function getAllWarning(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}

//导出
export function download(url, method) {
  return request({
    url: url,
    method: method,
    responseType: 'blob',
  })
}
// 获取事件名称
export function getConfigEvent() {
  return request({
    url: "/pm/alarm/config/event",
    method: "get",
  })
}
