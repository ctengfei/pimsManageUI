import request from '@/utils/request'
//获取能耗告警数量
export function getKeyAreaMonitor(date, params) {
    return request({
        url: '/pm/hydropower/keyArea/monitoring/' + date,
        method: 'post',
        params
    })
}