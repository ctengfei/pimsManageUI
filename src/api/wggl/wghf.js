// 网格划分页面
import request from '@/utils/request'

// 获取网格列表数据
export function getListTable(query) {
  return request({
    url: '/zhzz/wggl/wghf/wgList',
    method: 'get',
    params: query
  })
}

// 新增网格
export function addGrid(data) {
  return request({
    url: '/zhzz/wggl/wghf/add',
    method: 'post',
    data: data
  })
}

// 删除网格
export function delGrid(deptId) {
  return request({
    url: '/zhzz/wggl/wghf/remove/' + deptId,
    method: 'delete'
  })
}

// 修改网格
export function updateGrid(data) {
  return request({
    url: '/zhzz/wggl/wghf/update',
    method: 'put',
    data: data
  })
}

// 新增网格坐标数据
export function addGridPoint(data) {
  return request({
    url: '/zhzz/wggl/wghf/addWghf',
    method: 'post',
    data: data
  })
}

// 修改网格坐标数据
export function updateGridPoint(data) {
  return request({
    url: '/zhzz/wggl/wghf/editWghf',
    method: 'put',
    data: data
  })
}

// 获取网格统计数据
export function getCountNum(data) {
  return request({
    url: '/zhzz/wggl/wgygl/wgCountNum',
    method: 'get',
    params: data
  })
}

// 添加网格时判断网格编码是否已存在
export function getDeptById(data) {
  return request({
    url: '/zhzz/wggl/wghf/getDeptById',
    method: 'get',
    params: data
  })
}