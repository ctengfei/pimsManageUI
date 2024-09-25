import request from '@/utils/request'

//获取业务分类
export function getConfigType(url, method) {
  return request({
    url: url,
    method: method
  })
}

//获取列表
export function getTableData(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}

//获取执行人列表
export function getUserinfos(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}

//新增
export function add(url, method, data) {
  return request({
    url: url,
    method: method,
    data
  })
}

//编辑
export function edit(url, method, data) {
  return request({
    url: url,
    method: method,
    data
  })
}
//删除
export function Delete(url, method, data) {
  return request({
    url: url,
    method: method,
    data
  })
}
export function mulDelete(data) {
  return request({
    url: '/pm/alarm/config',
    method: 'delete',
    data: data
  })
}

