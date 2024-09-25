import request from '@/utils/request'
//  获取工作组初始化树菜单数据
export function treeData(url, method, params) {
    return request({
        url: url,
        method: method,
        params
    })
}
// 根据工作组code码获取用户列表
export function groupUserList(url, method, params) {
    return request({
        url: url,
        method: method,
        params
    })
}
// 所有工作组body传参接口
export function groupsAll(url, method, data) {
    return request({
        url: url,
        method: method,
        data
    })
}