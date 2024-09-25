import request from '@/utils/request'
// 查询车证信息
export function getcarLicense(data) {
  return request({
    url:"/sm/car/license/all",
    method:"get",
    params:data
  })
}
//同步车证
export function getawaitLicense(data) {
  return request({
    url:"/sm/car/license/synchronize",
    method:"get",
    params:data
  })
}
