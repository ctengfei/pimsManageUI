import request from '@/utils/request'
import request1 from '@/utils/request1'
//获取国家
export function getcompanyCountry() {
  return request1({
    url: '/system/dict/data/type/nv/company_country',
    method: 'get',
  })
}

//获取省市区
export function getAdress(url, method) {
  return request({
    url: url,
    method: method,
  })
}

//获取分类树
export function getcategory(url, method) {
  return request({
    url: url,
    method: method,
  })
}

//获取工单类型
export function getworkOrderType() {
  return request({
    url: '/sys/dict/type/nv/repair_work_order_type',
    method: 'get',
  })
}

//获取工作组成员
export function getallPeoples() {
  return request({
    url: '/sys/dict/type/nv/repair_work_order_type',
    method: 'get',
  })
}
