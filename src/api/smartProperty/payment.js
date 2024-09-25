import request from '@/utils/request'
import request1 from '@/utils/request1'
//获取入驻页面表格数据
export function initTabData(data) {
  return request({
    url: '/pm/property/fee/bill/query',
    method: 'GET',
    params: data
  })
}
export function WriteOffData(data) {
  return request({
    url: '/pm/property/fee/bill/query-detail?billNo=' + data,
    method: 'GET',
  })
}
export function payData(data) {
  return request({
    url: '/pm/property/fee/bill/account-reconciliation',
    method: 'POST',
    data: data
  })
}


//下载附件
export function downloads(data) {
  return request1({
    url: '/pm/charge/debitNote/generate',
    method: 'GET',
    params:data,
    responseType: 'blob',
  })
}
