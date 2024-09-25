import request  from '@/utils/request'
// 获取销控管理左侧树菜单信息
export function getControlTree1(url, method, params) {
    console.log(params,'params99999999999999')
    return request({
        url: url + `?name=${params.name}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
        method: method,
    })
}
// 获取销控管理左侧树菜单信息
export function getControlTree(url, method, params) {
    return request({
        url: url,
        method: method,
        params
    })
}
export function listData(url, method, data) {
    return request({
        url: url,
        method: method,
        data
    })
}

export function delrooms(data){
    return request({
        url: '/pm/room/batch',
        method: 'delete',
        data
    })
}
// 查询列表 
export function getRoomList(params){
    return request({
        url: '/pm/room/all',
        method: 'get',
        params
    })
}
// 统计查询 
export function getZoomStatist(params){
    return request({
        url: '/pm/zone',
        method: 'get',
        params
    })
}


