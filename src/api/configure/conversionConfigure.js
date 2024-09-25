import request from '@/utils/request'

// 条件查询
export function QueryData(data) {
    // yun/vm/ip/config/page
    return request({
        url: `${data.url}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: data.method
    })
}

// 配置修改
export function Modify(url,method,data) {
    // `yun/vm/ip/config`
    return request({
        url:url,
        method: method,
        data
    })
}
// 配置删除
export function Delete(data) {
    // yun/vm/ip/config
    return request({
        url: `${data.url}?id=${data.id}`,
        method: 'delete'
    })
}
// 配置新增
export function NewlyAdd(url,method,data) {
    // `yun/vm/ip/config/create`
    return request({
        url: url,
        method: method,
        data
    })
}
