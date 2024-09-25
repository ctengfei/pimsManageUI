import request from '@/utils/request'

// 获取列表数据
export function getList(params){
    return request({
        url: "/securitymonitor/pepleAccessRecord/page",
        method: "get",
        params
    })
}

// 导出列表
export function exportList(params){
    return request({
        url: "/securitymonitor/pepleAccessRecord/page/export",
        method: "get",
        params,
        responseType: 'blob',
    })
}

// 获取通道信息   
export function getChannelEnum(){
    return request({
        url: "/securitymonitor/pepleAccessRecord/getChannelEnum",
        method: "get",
    })
}

// 高空抛物告警统计  
export function getHighAltitudeStatics(){
    return request({
        url: "/pm/alarm/highAltitudeStatics",
        method: "get",
    })
}

// 当月每天的告警数统计   
export function getEveryDayCountsByMonth(){
    return request({
        url: "/pm/alarm/everyDayCountsByMonth",
        method: "get",
    })
}

// 高抛设备统计  
export function getDeviceStatistics(){
    return request({
        url: "/pm/device/camera/statistics?tag=HIGH_DROPPING",
        method: "get",
    })
}

// 当月每天时间段告警数
export function getEveryHourCountsByMonth(){
    return request({
        url: "/pm/alarm/everyHourCountsByMonth",
        method: "get",
    })
}
