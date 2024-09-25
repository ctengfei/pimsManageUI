import { request } from '@/utils/request'
// -------------------------------------------------------通行车辆记录---------------------------------------------------------------
// 车辆通行记录
export function getCarRecord(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 通行记录详情
export function getDetaRecord(data) {
    return request({
        url: data.url,
        method: data.method,
    })
}
// 车辆导出
export function getExportList(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data,
        responseType: 'blob'
    })
}
// -------------------------------------------------------访客管理---------------------------------------------------------------
// 访客管理
export function getVisitor(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 新增访客
export function getAddVisitor(data) {
    return request({
        url:data.url,
        method:data.method,
        data:data.data
    })
}
//编辑访客
export function getEditVisitor(data) {
    return request({
        url:data.url,
        method:data.method,
        data:data.data
    })
}
// 删除访客
export function getDeleteVisitor(data) {
    return request({
        url:data.url,
        method:data.method,
        data:data.data
    })
}
// 批量删除
export function getALLDeleteVisitor(data) {
    return request({
        url:data.url,
        method:data.method,
        data:data.data
    })
}
// 数据字典
export function getDict(data) {
    return request({
        url:data.url,
        method:data.method,
        data:data.data
    })
}
// -------------------------------------------------------通行人员记录---------------------------------------------------------------
// 人员通行记录
export function getPersonnelRecord(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 人员记录详情
export function getPasslRecord(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 导出人员记录
export function getExportRecord(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data,
        responseType: 'blob'
    })
}
// -------------------------------------------------------通行配置---------------------------------------------------------------
//查询所有数据
export function getConfigController(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 新增通行配置
export function getAddConfig(url,method,data) {
    return request({
        url:url,
        method:method,
        data:data
    })
}
// 删除通行配置
export function getDeleteConfig(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 批量删除
export function getDeleteAllConfig(data) {
    return request({
        url:data.url,
        method:data.method,
        data:data.data
    })
}
// 部门名称
export function getDepartment(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 设备左侧数据
export function getController(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 名单管理
export function getPeople(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}
// 根据设备获取人员
export function getDeviceIds(data) {
    return request({
        url:data.url,
        method:data.method,
        params:data.data
    })
}