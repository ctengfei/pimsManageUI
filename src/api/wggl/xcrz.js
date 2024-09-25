import request from '@/utils/request'

// 查询智慧综治-网格管理-巡查日志列表
export function listXcrz(query) {
  return request({
    url: '/wggl/xcrz/list',
    method: 'get',
    params: query
  })
}

// 查询智慧综治-网格管理-巡查日志详细
export function getXcrz(id) {
  return request({
    url: '/wggl/xcrz/' + id,
    method: 'get'
  })
}

// 新增智慧综治-网格管理-巡查日志
export function addXcrz(data) {
  return request({
    url: '/wggl/xcrz',
    method: 'post',
    data: data
  })
}

// 修改智慧综治-网格管理-巡查日志
export function updateXcrz(data) {
  return request({
    url: '/wggl/xcrz',
    method: 'put',
    data: data
  })
}

// 删除智慧综治-网格管理-巡查日志
export function delXcrz(id) {
  return request({
    url: '/wggl/xcrz/' + id,
    method: 'delete'
  })
}

// 导出智慧综治-网格管理-巡查日志
export function exportXcrz(query) {
  return request({
    url: '/wggl/xcrz/export',
    method: 'get',
    params: query
  })
}

// 查询人员列表
export function getPeopleList(query) {
  return request({
    url: '/jcyw/syrk/jbxx/list',
    method: 'get',
    params: query
  })
}

// 查询工作台本月巡检数据
export function getGztByxj() {
  return request({
    url:'/wggl/xcpz/selectCountByXcpz',
    method: 'get'
  })
}

// 查询人员列表(new)
export function selectUserByRzlx(query) {
  return request({
    url:'/wggl/xcrz/selectUserByRzlx',
    method: 'get',
    params: query
  })
}