import request from '@/utils/request'

//获取列表
export function searchChange(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}
//查询详情通过合同编号
export function searchByNumber(url, method, data) {
  let newurl = url + "?serialNumber=" + data
  return request({
    url: newurl,
    method: method,
  })
}
