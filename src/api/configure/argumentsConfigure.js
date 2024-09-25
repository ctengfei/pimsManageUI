import request from '@/utils/request'

 // 条件查询
export function QueryData(data) {
  // yun/vm/param/config/page
    return request({
      url: `${data.url}?pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}`,
      method: data.method
    })
  }
// 新增
export function Increase(url,method,data) {
  // `yun/vm/param/config/create`
  return request({
    url: url,
    method: method,
    data
  })
}
// 删除
export function Delete(data) {
  // yun/vm/param/config
  return request({
    url: `${data.url}?id=${data.id}`,
    method: 'delete'
  })
}
// 修改
export function Modify(url,method,data) {
  // `yun/vm/param/config`
  return request({
    url: url,
    method: method,
    data
  })
}
// 根据code查询配置项值
export function getConfigByCode(url,method,data) {
  // `yun/vm/param/config`
  return request({
    url: `${url}?code=${data.code}`,
    method: method
  })
}