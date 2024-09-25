import {request} from '@/utils/request'

// 录像暂停接口
export function Stopit(url,method,data) {
  // `yun/vm/recordPlan`
  return request({
    url: url,
    method: 'put',
    data
  })
}
// 计划录像查询接口
export function PlanQuery(data) {
  // yun/vm/recordPlan
  return request({
    url: `${data.url}?blurry=${data.status}&blurryType=STATUS&pageNum=${data.pageNum}&pageSize=${data.pageSize}&startTime=${data.startTime}&endTime=${data.endTime}`,
    method: 'get'
  })
}
// 树节点查询录像信息
export function PlanQuerytree(data) {
  // yun/vm/recordPlan
  return request({
    url: `${data.url}?blurry=${data.status}&blurryType=STATUS&pageNum=${data.pageNum}&pageSize=${data.pageSize}&startTime=${data.startTime}&endTime=${data.endTime}&deviceIds=${data.deviceIds}`,
    method: 'get'
  })
}
// 计划录像批量删除接口
export function PlanDeletion(url,method,data) {
  return request({
    url: url,
    method: 'delete',
    data
  })
}
// 计划录像新增接口
export function NewPlan(url,method,data) {
  return request({
    url: url,
    method: method,
    data
  })
}
// 录像修改接口
export function Modify(url,method,data) {
  return request({
    url: url,
    method: method,
    data
  })
}
// 录像删除接口
export function DeleteInterface(data) {
  return request({
    url: data.url,
    method: 'delete',
    data: data.id
  })
}
// 点击树节点 查询计划录像
export function TreesCreen(data) {
  return request({
    url: `${data.url}?favoriteId=${data.favoriteId}&nodeId=${data.nodeId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: data.method
  })
}

// 查看获取计划录像列表
export function List(data) {
  return request({
    url: `/vm/recordVideo/plan/${data}`,
    method: 'get'
  })
}