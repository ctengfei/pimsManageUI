// 巡查配置页面
import request from '@/utils/request'

// 列表查询
export function getListForXcpz(query) {
  return request({
    url: '/wggl/xcpz/list',
    method: 'get',
    params: query
  })
}

// 修改
export function updateForXcpz(data) {
  return request({
    url: '/wggl/xcpz',
    method: 'put',
    data: data
  })
}
// 新增配置数据
export function addForXcpz(data) {
  return request({
    url: '/wggl/xcpz',
    method: 'post',
    data: data
  })
}
// 删除
export function deleteForXcpz(id) {
  return request({
    url: '/wggl/xcpz/' + id,
    method: 'delete'
  })
}

// 配置目录树
export function getSelectXcpzTree() {
  return request({
    url: '/wggl/xcpz/selectXcpzTree',
    method: 'get',
  })
}

// 配置目录树子节点
export function getSelectXcpzTreeChild(query) {
  return request({
    url: '/wggl/xcpz/selectXcpzTreeChild',
    method: 'get',
    params: query
  })
}
