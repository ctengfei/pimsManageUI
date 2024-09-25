/*
 * @Descripttion: 
 * @version: 
 * @Author: HJQ
 * @Date: 2022-02-09 17:09:47
 * @LastEditors: HJQ
 * @LastEditTime: 2022-02-16 14:20:49
 */
import request from '@/utils/request'

// 获取历史告警数量
export function getHistoryNum(data) {
    return request({
      url: '/pm/alarm/query/statistics/'+ data,
      method: 'GET',
    })
  }
//   获取告警等级分类 /pm/alarm/query/statistics/level/{cycle}
  export function getAlarmClass(data) {
    return request({
      url: '/pm/alarm/query/statistics/level/'+data,
      method: 'GET',
    })
  }
  // 获取告警统计
export function getAlarmCount() {
  return request({
    url: '/pm/alarm/statistics',
    method: 'GET',
  })
}
//   获取工单统计数据
export function getOrderCount(data) {
  return request({
    url: '/pm/alarm/order/count',
    method: 'GET',
  })
}
//   获取任务优先级
export function getPriorityCount(data) {
  return request({
    url: '/pm/alarm/order/query/statistics/level/' + data,
    method: 'GET',
  })
}
//   获取物业工单统计  
export function getWorkOrderCount(data) {
  return request({
    url: '/pm/alarm/order/query/statistics/' + data,
    method: 'GET',
  })
}
// 获取设备设施在线率
export function getDeviceOnlineCount() {
  return request({
    url: '/pm/device/status/statistics',
    method: 'GET',
  })
}
// 获取能耗统计 /pm/hydropower/point/everyMouthMonitor
export function getEveryMounth(data) {
  return request({
    url: '/pm/hydropower/point/everyMouthMonitor',
    method: 'GET',
    params: data
  })
}
// 房屋出租率 /pm/room/statistics/occupancy/rate
export function getHouse() {
  return request({
    url: '/pm/room/statistics/occupancy/rate',
    method: 'GET'
  })
}