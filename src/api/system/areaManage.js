import request from '@/utils/request'

//  获取区域初始化树菜单及params传值数据
export function treeData(url, method, params) {
    return request({
        url: url,
        method: method,
        params
    })
}
// 所有区域body传参接口
export function areaAll(url, method, data) {
    return request({
        url: url,
        method: method,
        data
    })
}
// 所有无参数接口
export function areaAllType(url, method) {
    return request({
        url: url,
        method: method
    })
}