import request from '@/utils/request'

// 新增知识库
export function addZsk(data) {
  return request({
    url: '/zhzz/wggl/zsk',
    method: 'post',
    data: data
  })
}

// 删除知识库
export function delZsk(id) {
  return request({
    url: '/zhzz/wggl/zsk/' + id,
    method: 'delete'
  })
}

// 修改知识库
export function updateZsk(data) {
  return request({
    url: '/zhzz/wggl/zsk',
    method: 'put',
    data: data
  })
}

// 查询知识库
export function getZskList(query) {
  return request({
    url: '/zhzz/wggl/zsk/list',
    method: 'get',
    params: query
  })
}

// 新增知识库目录
export function addZskml(data) {
  return request({
    url: '/zhzz/wggl/zskml',
    method: 'post',
    data: data
  })
}

// 删除知识库目录
export function delZskml(id) {
  return request({
    url: '/zhzz/wggl/zskml/' + id,
    method: 'delete'
  })
}

// 修改知识目录
export function updateZskml(data) {
  return request({
    url: '/zhzz/wggl/zskml',
    method: 'put',
    data: data
  })
}

// 查询知识库目录
export function getZskmlList(query) {
  return request({
    url: '/zhzz/wggl/zskml/list',
    method: 'get',
    params: query
  })
}

// 查询知识库目录--树结构
export function getZskTreeList() {
  return request({
    url: '/zhzz/wggl/zskml/zskmlTreeList',
    method: 'get'
  })
}
