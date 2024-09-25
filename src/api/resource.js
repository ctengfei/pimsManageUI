/*
 * @version: 
 * @Author: sscaij
 * @Date: 2021-03-31 14:03:42
 * @LastEditTime: 2021-10-22 11:20:14
 * @LastEditors: sscaij
 */

import request from '@/utils/request'

// 删除接口
export function Delete(data) {
  // `/vm/device/delete/${id}`
  return request({
    url:data.url,
    method:data.method,
    data:data.data
  })
}
// 修改接口
export function editAbility(url,method,data) {
  // /vm/device/update/device
  return request({
    // ?id=${data.deviceId}&name=${data.name}&latitude=${data.latitude}&longitude=${data.longitude}
    url: url,
    method: 'put',
    data: data
  })
}
// 挂载/未挂载
export function getDataListByType(data) {
  return request({
    url:data.url,
    method:data.method,
    params:data.data
  })
}

// 查询省级行政区域信息
export function Administrative(data) {
  return request({
    // yun/vm/region
    url: `${data.url}?blurryType=LEVEL&blurry=${data.level}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'get'
  })
}
// 查询市区级
export function UrbanDistrict(data) {
  return request({
    url: `/vm/region?blurryType=LEVEL&blurry=${data.code[1]}&pid=${data.code[2]}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'get'
  })
}
// 查询区级
export function Area(data1) {
  return request({
    url: `/vm/region?blurryType=LEVEL&blurry=${data1.code[1]}&pid=${data1.code[2]}&pageNum=${data1.pageNum}&pageSize=${data1.pageSize}`,
    method: 'get'
  })
}
// 设备编号接口
export function EqNumber(data) {
  // yun/vm/device/code
  return request({
    url: `${data.url}?countyCode=${data.countyCode}&codingIndustryCode=${data.codingIndustryCode}&typeCode=${data.typeCode}&networkCode=${data.networkCode}`,
    method: data.method,
  })
}
// 挂载设备到结构
export function MountTree(data) {
  // yun/vm/tree/mount_device
  return request({
    url: `${data.url}?treeNodeId=${data.treeNodeId}`,
    method: data.method,
    data: data.deviceId
  })
}

// 取消挂载
export function Unmount(data) {
  return request({
    url:data.url,
    method:data.method,
    data:data.data
  })
}
// 全部设备
export function getAllDevice(data) {
  return request({
    url: `/pm/device/criteria?pageNum=${data.params.pageNum}&pageSize=${data.params.pageSize}`,
    method: 'get'
  })
}

// 查询设备及子设备信息
export function QueryDevice(data) {
  return request({
    url: `/vm/device/query/${data}`,
    method: 'get',
  })
}

// 配置设备视频分析类型
export function ConfigVideoAnalytic(data) {
  return request({
    url: `/vm/videoAnalysis`,
    method: 'post',
    data: data
  })
}

// 全部设备
export function getAllDevicePoint(data) {
  return request({
    url: `/pm/device/criteria`,
    method: 'get',
    params:data
  })
}
// 视频分析
// export function getVideoanAlysis() {
//   return request({
//     url:`/sys/dict/type/video_analysis`,
//     method: 'get',
//   })
// }

// -------------------------------------------------------视频分析模块接口---------------------------------------------------------------
// 获取分析类型
export function getVideoanAlysis(query, type) {
  return request({
    url:`${query.url.split('/{')[0]}/${type}`,
    method: query.method,
  })
}
//全量查询分析配置
export function getAnalysisConfig(data) {
  return request({
      url:data.url,
      method:data.method,
      params:data.data
  })
}
// 修改分析配置
export function getEditAnalysis(url,method,data) {
  return request({
    url:url,
    method:method,
    data:data
  })
}
// 新增分析配置
export function getAddAnalysis(url,method,data) {
  return request({
      url:url,
      method:method,
      data:data
  })
}
// 删除分析配置
export function getDeleteAnalysis(url,method,data) {
  return request({
      url:url,
      method:method,
      data:data
  })
}
// 同步分析配置
export function getSyncAnalysis(data) {
  return request({
      url:data.url,
      method:data.method,
      params:data.data
  })
}
// 根据类型查询分析配置
export function getSearch(data) {
  return request({
      url:data.url,
      method:data.method,
      params:data.data
  })
}
// 新增设备配置
export function getAddDevice(data) {
  return request({
      url:`/vm/device/add`,
      method:'post',
      data
  })
}
// 设备扫描
export function getScan(data) {
  return request({
      url:data.url,
      method:data.method,
  })
}
// 更新设备经纬度
export function updateDeviceByid(data,params) {
  return request({
      url:data.url,
      method:data.method,
      data:JSON.stringify(params),
  })
}