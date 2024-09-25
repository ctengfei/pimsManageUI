import request from '@/utils/request'
// 查询车辆通记录
export function getcarRecord(data) {
  return request({
    url:"/sm/carPeerRecord/page",
    method:"get",
    params:data
  })
}
//  车辆通行记录导出
export function exportCarRecord(data) {
  return request({
    url:"/sm/carPeerRecord/export",
    method:"post",
    data:data,
    responseType: 'blob',
  })
}