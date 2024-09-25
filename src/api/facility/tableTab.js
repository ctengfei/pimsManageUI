import request from '@/utils/request'

const tableTabApi = {
    // /deviceInspection/deviceInspection/page
    // 设备检修画像
    getDeviceInsp(data){
        return request({
            url:"/deviceInspection/deviceInspection/page",
            method: "get",
            params: data
        })
    },
    // /pm/alarm/deviceAlarm/page
    // 设备告警画像
    getDeviceAlarm(data){
        return request({
            url:"/pm/alarm/deviceAlarm/page",
            method: "get",
            params: data
        })
    },
    // /maintenance/record/page
    // 设备维保画像
    getDeviceRecode(data){
        return request({
            url:"/maintenance/record/page",
            method: "get",
            params: data
        })
    },
    // 设备运行记录
    getDeviceRunHistory(data){
        return request({
            url:"/pm/device/runHistory",
            method: "get",
            params: data
        })
    },
    // 设备操作日志管理
    // /pm/device/operate
    getDeviceDeviceOperate(data){
        return request({
            url:"/pm/device/operate",
            method: "get",
            params: data
        })
    },
    // 设备维修记录 
    queryAlarmOrderBy(params){
        return request({
            url:"/pm/alarm/order/query/queryAlarmOrderBy",
            method: "get",
            params
        })
    },
}

export default tableTabApi