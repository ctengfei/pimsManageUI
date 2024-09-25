import request  from '@/utils/request'

// 搜索空间经营列表
export function searchRoom(params) {
    return request({
        url: "/pm/room/all",
        method: "get",
        params: params
    })
}
// 房源详情
export function roomInfo(params) {
    return request({
        url: "/pm/room/info",
        method: "get",
        params: params
    })
}
// 租赁历史
export function contractRoom(params) {
    return request({
        url: "/pm/contract/queryByRoomId",
        method: "get",
        params: params
    })
}
// 缴费记录
export function feeBillRentRoom(params) {
    return request({
        url: "/property/feeBillRent/queryByRoomId",
        method: "get",
        params: params
    })
}
// 房源类型
export function getRoomSourceType() {
    return request({
        url: "/pm/room/getRoomSourceType",
        method: "get",
    })
}
// 产权归属
export function getBelongToEnum() {
    return request({
        url: "/pm/room/getBelongToEnum",
        method: "get",
    })
}
// 经营状态
export function getUsageModeEnum() {
    return request({
        url: "/pm/room/getUsageModeEnum",
        method: "get",
    })
}