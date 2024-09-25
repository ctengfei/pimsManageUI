import request from '@/utils/request1'

// export function get(url, method, params) {
//   return request({
//     url: url + params,
//     method: method
//   })
// }
// 非字典管理页面的根据绑定的字典类型获取字典值
export function getDicts(url, method, params) {
  return request({
    url: url,
    method: method,
    params
  })
}
// 根据类型获取字典值
export function gettypeDict(url, method) {
  return request({
    url: url,
    method: method
  })
}
// 新增字典
export function add(url, method, data) {
  return request({
    url: url,
    method: method,
    data
  })
}
// 删除字典
export function del(url, method, ids) {
  return request({
    url: url,
    method: method,
    data: ids
  })
}
// 编辑字典
export function edit(url, method, data) {
  return request({
    url: url,
    method: method,
    data
  })
}
export default { getDicts, add, edit, del, gettypeDict }
