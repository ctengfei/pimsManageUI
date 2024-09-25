import request from '@/utils/request'

//获取业务分类
export function getConfigType(url, method) {
  return request({
    url: url,
    method: method
  })
}

//获取列表
export function getTableData(data) {
  return request({
    url: "/pm/alarm/linkageRole/page",
    method: "get",
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
// 根据ID查询详情
export function editId(id) {
  return request({
    url: "/pm/alarm/linkageRole/" + id,
    method: "get",
  })
}
//新增
export function add(data) {
  return request({
    url: "/pm/alarm/linkageRole",
    method: "post",
    data
  })
}

//编辑
export function edit(id,data) {
  return request({
    url: "/pm/alarm/linkageRole/" + id,
    method: "put",
    data
  })
}
//删除
export function Delete(id) {
  return request({
    url: "/pm/alarm/linkageRole/" + id,
    method: "delete",
  })
}
//启用
export function Start(data) {
    return request({
        url: "/pm/alarm/linkageRole/batchChangeStatus/" + true,
        method: "put",
        data
    })
}
//禁用
export function Disabled(data) {
    return request({
      url: "/pm/alarm/linkageRole/batchChangeStatus/" + false,
      method: "put",
      data
    })
}
// 批量删除
export function mulDelete(data) {
  return request({
    url: '/pm/alarm/linkageRole',
    method: 'delete',
    data: data
  })
}
// /pm/alarm/linkageRole/actions  查询设备类型支持的所有动作
export function linkageRoleActive(data) {
  return request({
    url: '/pm/alarm/linkageRole/actions',
    method: 'get',
    params: data
  })
}
// 获取事件名称
export function getConfigEvent() {
  return request({
    url: "/pm/alarm/config/event",
    method: "get",
  })
}

