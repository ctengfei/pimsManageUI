import request from '@/utils/request'
//获取能耗告警数量
export function getEnergyWarnNum(url, method, params) {
    return request({
      url: '/pm/hydropower/alarm/countalarm',
      method: 'get',
      params,
    })
  }
//获取能耗告警数量--柱状图
export function getEnergyWarnBarNum(params) {
  return request({
    url: '/pm/hydropower/alarm/mouthCountAlarm',
    method: 'get',
    params,
  })
}
//获取排行榜数据列表
export function getRankingList(url, method, params) {
    return request({
      url: '/pm/hydropower/point/companyLeaderboard',
      method: 'get',
      params,
    })
}
export function getRankingEleList(url, method, params) {
  return request({
    url: '/pm/hydropower/point/companyLeaderboard?type=1',
    method: 'get',
    params,
  })
}
//获取点位信息
export function getPointPosionNews(url, method, params) {
  return request({
    url: '/pm/hydropower/selectDeviceValue',
    method: 'get',
    params,
  })
}
//获取本日本月使用量
export function getCountNum(url, method, params) {
    return request({
      url: '/pm/hydropower/point/usageAmount',
      method: 'get',
      params,
    })
}
//获取碳中和周使用量
export function getCarbonNeutralNumWeekShui(url, method, params) {
    return request({
      url: '/pm/hydropower/point/carbonNeutralWeek?type=0',
      method: 'get',
      params,
    })
}
export function getCarbonNeutralNumWeekDian(url, method, params) {
  return request({
    url: '/pm/hydropower/point/carbonNeutralWeek?type=1',
    method: 'get',
    params,
  })
}
//获取园区碳排放量周使用量
export function getCarbonNeutralNumWeekShuiTwo(url, method, params) {
  return request({
    url: '/pm/hydropower/point/carbonNeutralDayNo?type=0',
    method: 'get',
    params,
  })
}
export function getCarbonNeutralNumWeekDianTwo(url, method, params) {
return request({
  url: '/pm/hydropower/point/carbonNeutralDayNo?type=1',
  method: 'get',
  params,
})
}
//获取园区碳排放量月使用量
export function getCarbonNeutralNumMouthShuiTwo(url, method, params) {
    return request({
      // url: '/pm/hydropower/point/carbonNeutralMouth?type=0',
      url: '/pm/hydropower/point/carbonNeutralWeekNo?type=0',
      method: 'get',
      params,
    })
}
export function getCarbonNeutralNumMouthDianTwo(url, method, params) {
  return request({
    url: '/pm/hydropower/point/carbonNeutralWeekNo?type=1',
    method: 'get',
    params,
  })
}
//获取碳中和月使用量
export function getCarbonNeutralNumMouthShui(url, method, params) {
    return request({
      // url: '/pm/hydropower/point/carbonNeutralMouth?type=0',
      url: '/pm/hydropower/point/carbonNeutralDay?type=0',
      method: 'get',
      params,
    })
}
export function getCarbonNeutralNumMouthDian(url, method, params) {
  return request({
    url: '/pm/hydropower/point/carbonNeutralDay?type=1',
    method: 'get',
    params,
  })
}
//获取监测周使用量dian
export function getMonitorNumWeek(url, method, params) {
    return request({
      url: '/pm/hydropower/point/everyDayMonitor?type=1',
      method: 'get',
      params,
    })
}
//获取监测月使用量dian
export function getMonitorNumMouth(url, method, params) {
    return request({
      url: '/pm/hydropower/point/everyMouthMonitor?type=1',
      method: 'get',
      params,
    })
}
//获取监测年使用量dian
export function getMonitorNumYear(url, method, params) {
    return request({
      url: '/pm/hydropower/point/everyYearMonitor?type=1',
      method: 'get',
      params,
    })
}
//获取监测周使用量shui
export function getMonitorShuiNumWeek(url, method, params) {
    return request({
      url: '/pm/hydropower/point/everyDayMonitor?type=0',
      method: 'get',
      params,
    })
}
//获取监测月使用量shui
export function getMonitorShuiNumMouth(url, method, params) {
    return request({
      url: '/pm/hydropower/point/everyMouthMonitor?type=0',
      method: 'get',
      params,
    })
}
//获取监测年使用量shui
export function getMonitorShuiNumYear(url, method, params) {
    return request({
      url: '/pm/hydropower/point/everyYearMonitor?type=0',
      method: 'get',
      params,
    })
}
