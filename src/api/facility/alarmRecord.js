import request from '@/utils/request'

//  查询子系统
export function initData(url, method, params) {
  return request({
      url: url,
      method: method,
      params
  })
}
//获取维保表格数据
export function initTabData(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}
//工单反馈
export function downloadworkOrder(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data,
    responseType: 'blob',
  })
}
export function getDeviceInsp(data){
  return request({
      url:"/deviceInspection/deviceInspection/page",
      method: "get",
      params: data
  })
}