/*
 * @Descripttion: 
 * @version: 
 * @Author: HJQ
 * @Date: 2022-02-09 17:09:47
 * @LastEditors: HJQ
 * @LastEditTime: 2022-02-22 14:35:54
 */
import request from '@/utils/request'

// 获取停车场统计信息
export function parkingLot() {
  return request({
    url: '/pm/device/barrierGate/parking/lot',
    method: 'GET',
  })
}
//   获取通行统计数据
export function statistics(data) {
  return request({
    url: '/pm/device/barrierGate/traffic/statistics?category=' + data,
    method: 'GET',
  })
}
// 获取人员统计信息
export function peopleNum() {
  return request({
    url: '/pm/traffic/person/statistics',
    method: 'GET',
  })
}
//   获取人员通行统计数据
export function peopleNums(data) {
  return request({
    url: '/pm/traffic/person/traffic/statistics?category=' + data,
    method: 'GET',
  })
}
// 获取工单左上角统计信息
export function orderNum() {
  return request({
    url: '/pm/repair/order/query/statistics',
    method: 'GET',
  })
}
// 获取工单左侧中间统计信息
export function orderNumber() {
  return request({
    url: '/pm/repair/order/query/statistics/category',
    method: 'GET',
  })
}
//   获取工单左下角统计信息
export function orderNums(data) {
  return request({
    url: '/pm/repair/order/query/statistics/' + data,
    method: 'GET',
  })
}
//   获取每日工单统计信息
export function orderNumday() {
  return request({
    url: '/pm/repair/order/query/statistics/today',
    method: 'GET',
  })
}
//   获取合同分类信息
export function contractNum() {
  return request({
    url: '/pm/contract/statistics',
    method: 'GET',
  })
}
//   获取房屋统计信息
export function homenum() {
  return request({
    url: '/pm/zone/all?pid=1',
    method: 'GET',
  })
}
//   获取会议室信息
export function officenum() {
  return request({
    url: '/pm/meeting/usage',
    method: 'GET',
  })
}
