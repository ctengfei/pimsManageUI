import request  from '@/utils/request'

// 会议室资源导出
export function downloadAll(data) {
    return request({
        url: "/space/meetingResource/page/export",
        method: "get",
        params: data,
        responseType: 'blob',
    })
}
// 获取会议资源所有列表
export function getMeetingList(params) {
    return request({
        url: "/space/meetingResource/page",
        method: "get",
        params
    })
}
// 搜索会议状态时间段列表
export function searchStatus(url, method, params) {
    return request({
        url: url,
        method: method,
        params
    })
}
// 查看会议室预约状态
export function lookStatus(params) {
    return request({
        url: "/space/meetingReservation/listReservation",
        method: "get",
        params
    })
}