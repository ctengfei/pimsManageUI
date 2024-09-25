import request from '@/utils/request'

// 查询智慧综治-网格管理-荣誉墙列表
export function listRyq(query) {
  return request({
    url: '/zhzz/wggl/ryq/list',
    method: 'get',
    params: query
  })
}

// 查询智慧综治-网格管理-荣誉墙详细
export function getRyq(id) {
  return request({
    url: '/zhzz/wggl/ryq' + id,
    method: 'get'
  })
}

// 新增智慧综治-网格管理-荣誉墙
export function addRyq(data) {
  return request({
    url: '/zhzz/wggl/ryq',
    method: 'post',
    data: data
  })
}

// 修改智慧综治-网格管理-荣誉墙
export function updateRyq(data) {
  return request({
    url: '/zhzz/wggl/ryq',
    method: 'put',
    data: data
  })
}

// 删除智慧综治-网格管理-荣誉墙
export function delRyq(id) {
  return request({
    url: '/zhzz/wggl/ryq/' + id,
    method: 'delete'
  })
}

// 导出智慧综治-网格管理-荣誉墙
export function exportRyq(query) {
  return request({
    url: '/zhzz/wggl/ryq/export',
    method: 'get',
    params: query
  })
}

//查询部门下所有网格员
export function queryAllWgyList() {
  return request({
    url: '/zhzz/wggl/ryq/queryAllWgyList',
    method: 'get'
  })
}

