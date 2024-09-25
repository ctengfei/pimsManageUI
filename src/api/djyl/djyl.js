import request from '@/utils/request'

// 党员数量查询
export function getDyCount(query) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl/count',
    method: 'get',
    params: query
  })
}
// 分类查询 xb-性别分类 xl-学历分类 mz-民族分类
export function getCountBytype(query) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl/dictType',
    method: 'get',
    params: query
  })
}

// 党组织数量查询
export function getDzzCount(query) {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl/count',
    method: 'get',
    params: query
  })
}

// 按类型统计
export function queryCountForType() {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl/queryCountForType',
    method: 'get'
  })
}
// 下属结构党组织统计
export function dzzStatistics() {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl/statistics',
    method: 'get'
  })
}
// 党员年龄分布
export function queryCountForAge() {
  return request({
    url: '/zhzz/jcyw/syrk/dygl/ageRange',
    method: 'get'
  })
}

// 男女数量
export function queryCountForSex(type) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl/xbXlCount/' + type,
    method: 'get'
  })
}
