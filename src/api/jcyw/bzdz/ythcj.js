import request from '@/utils/request'

// 查询智慧综治_基础业务_标准地址列表
export function listYthcj (query) {
  return request({
    url: '/jcyw/bzdz/ythcj/list',
    method: 'get',
    params: query
  })
}

// 查询智慧综治_基础业务_标准地址详细,查询单个数据详情
export function getYthcj (id) {
  return request({
    url: '/jcyw/bzdz/ythcj/' + id,
    method: 'get'
  })
}

// 新增智慧综治_基础业务_标准地址
export function addYthcj (data) {
  return request({
    url: '/jcyw/bzdz/ythcj',
    method: 'post',
    data: data
  })
}

// 修改智慧综治_基础业务_标准地址
export function updateYthcj (data) {
  return request({
    url: '/jcyw/bzdz/ythcj',
    method: 'put',
    data: data
  })
}
// 修改智慧综治_基础业务_标准地址   懒加载修改
export function updateYthcjTree (data) {
  return request({
    url: '/jcyw/bzdz/ythcj/tree',
    method: 'put',
    data: data
  })
}

// 删除智慧综治_基础业务_标准地址
export function delYthcj (id) {
  return request({
    url: '/jcyw/bzdz/ythcj/' + id,
    method: 'delete'
  })
}

// 导出智慧综治_基础业务_标准地址
export function exportYthcj (query) {
  return request({
    url: '/jcyw/bzdz/ythcj/export',
    method: 'get',
    params: query
  })
}

// 获取树结构数据
export function getTreeSelect (query) {
  return request({
    url: '/jcyw/bzdz/ythcj/treeselect',
    method: 'get',
    params: query
  })
}
// 根据id获取树结构数据
export function getTreeSelectId (id) {
  return request({
    url: '/jcyw/bzdz/ythcj/treeSelectById/' + id,
    method: 'get',
  })
}

// 删除智慧综治_基础业务_标准地址
export function delYthcjById (id) {
  return request({
    url: '/jcyw/bzdz/ythcj/removeById/' + id,
    method: 'delete'
  })
}

// 批量插入层户结构
export function batchAddFloor (data) {
  return request({
    url: '/jcyw/bzdz/ythcj/batchAdd',
    method: 'post',
    data: data
  })
}
//修改层户结构
export function batchEdit (data) {
  return request({
    url: '/jcyw/bzdz/ythcj/batchEdit',
    method: 'post',
    data: data
  })
}

//层户结构新增 修改 删除
export function batchBuilding (data) {
  return request({
    url: '/jcyw/bzdz/ythcj/batchBuilding',
    method: 'post',
    data: data
  })
}


// 根据id查询所有子节点
export function getZhzzJcywBzdzYthcjTreeById (id) {
  return request({
    url: '/jcyw/bzdz/ythcj/getZhzzJcywBzdzYthcjTreeById/' + id,
    method: 'get',
  })
}

//根据id校验层户结构有没有关联
export function batchCheck (id) {
  return request({
    url: '/jcyw/bzdz/ythcj/batch/check/' + id,
    method: 'get',
  })
}


// 修改坐标
export function updateYthcjPoint (data) {
  return request({
    url: '/jcyw/bzdz/ythcj/updateJdAndWdById',
    method: 'put',
    data: data
  })
}

// 修改名称
export function updateYthcjName (data) {
  return request({
    url: '/jcyw/bzdz/ythcj/updateChildById',
    method: 'put',
    data: data
  })
}

// 查询建筑物数量
export function getJzwCount () {
  return request({
    url: '/jcyw/bzdz/ythcj/getJzwCount',
    method: 'get'
  })
}