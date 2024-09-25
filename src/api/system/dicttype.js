import request from '@/utils/request1'
// 所有字典相关的通用接口
export function getTypeAll(url, method) {
  return request({
    url: url,
    method: method
  })
}
// 根据字典类型查询字典列表
export function get(dictType) {
  return request({
    url: '/system/dict/data/type/nv/' + dictType,
    method: 'get'
  })
}

// 新增字典类型
export function add(url, method, data) {
  return request({
    url: url,
    method: method,
    data
  })
}
// 删除字典类型
export function del(url, method, ids) {
  return request({
    url: url,
    method: method,
    data: ids
  })
}
// 编辑字典类型
export function edit(url, method, data) {
  return request({
    url: url,
    method: method,
    data
  })
}

export default { get, add, edit, del, getTypeAll }
