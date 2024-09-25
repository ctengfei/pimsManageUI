// 网格总览页面
import request from '@/utils/request'

// 获取组织列表树形结构数据
export function listTable(query) {
  return request({
    url: '/zhzz/wggl/common/deptList',
    method: 'get',
    params: query
  })
}

// 查询网格坐标
export function getPoint(query) {
  return request({
    url: '/zhzz/wggl/wghf/list',
    method: 'get',
    params: query
  })
}

// 查询边界坐标
export function getBoundaryPoint(query) {
  return request({
    url: '/zhzz/wggl/wghf/getWgPoint',
    method: 'get',
    params: query
  })
}

// 查询网格弹出框中左边数据
export function getDeptByTypeCount(query) {
  return request({
    url: '/zhzz/wggl/common/getDeptByTypeCount',
    method: 'get',
    params: query
  })
}

// 查询网格弹出框中右边数据
export function getRoleCount(query) {
  return request({
    url: '/zhzz/wggl/common/getRoleCount',
    method: 'get',
    params: query
  })
}