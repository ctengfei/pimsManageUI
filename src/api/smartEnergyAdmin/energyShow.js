import request from '@/utils/request'


// 请求饼状图数据
export function initPieData(data) {
    return request({
      url: '/pm/hydropower/alarm/alarmHandlingRate',
      method: 'get',
    })
}

// 请求终端数量的数据
export function initNumRateData(data) {
    return request({
      url: '/pm/hydropower/count-number',
      method: 'get',
    })
}

// 请求最上方的六个数据
export function initTopFiveData(data) {  
    return request({
      url: '/pm/hydropower/count-current-usage',
      method: 'get',
    })
}

// 告警列表
export function initTabData(params) {
    return request({
      url: "/pm/hydropower/alarm/selectAlarmList",
      method: "get",
      params
    })
}
// 水排行榜公司
export function initTabDataShui(data) {
  return request({
    url: "/pm/hydropower/point/companyLeaderboard?type=0",
    method: "get",
    data,
  })
}
// 水排行榜楼宇
export function initTabDataFloorShui(data) {
  return request({
    url: "/pm/hydropower/point/companyBuilding?type=0",
    method: "get",
    data,
  })
}
// 电排行榜公司
export function initTabDataDian(data) {
  return request({
    url: "/pm/hydropower/point/companyLeaderboard?type=1",
    method: "get",
    data,
  })
}
// 电排行榜楼宇
export function initTabDataFloorDian(data) {
  return request({
    url: "/pm/hydropower/point/companyBuilding?type=1",
    method: "get",
    data,
  })
}
export function initLineDataNew(data) {
  return request({
    url: `/pm/hydropower/point/everyhoursMonitor/${data}`,
    method: 'get',
    data,
  })
}