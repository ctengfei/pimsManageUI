import request from '@/utils/request'
  
  // 门禁放行方式排行统计
export function  entranceOutOrEnter(data) {
    return request({
        url: '/traffic/personPassStatistic/entranceOutOrEnter/statistic',
        method: "GET",
        params: data
    })
}

// 门禁和人员进出的数量统计
export function  entrAndPersonPass() {
    return request({
        url: '/traffic/personPassStatistic/entrAndPersonPass/statistic',
        method: "GET",
    })
}
// 人员刷卡方式统计
export function  personEnterOutPancakeVo(data) {
    return request({
        url: '/traffic/personPassStatistic/personEnterOutPancakeVo/statistic',
        method: "GET",
        params: data
    })
}

// 人员进出趋势统计
export function  personEnterOutTrend(data) {
    return request({
      url: '/traffic/personPassStatistic/personEnterOutTrend/statistic',
      method: "get",
      params: data
    })
}

// 访客到访统计
export function  visitorAccess(data) {
    return request({
      url: '/traffic/personPassStatistic/visitorAccess/statistic',
      method: "get",
      params: data
    })
}

