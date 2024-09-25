import request from '@/utils/request'

//  通知设备推流
export function devicePushTream(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
//  获取通道列表
export function getChannelList(url, method, data) {
  return request({
    url: `${url}?deviceId=${data.deviceId}&deviceName=${data.deviceName}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&type=MOUNTED`,
    method: method
  })
}
//  获取工作区列表
export function getLayout(url, method, data) {
  return request({
    url: `${url}?blurryType=NAME&blurry=${data.searchKeyword}&pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
    method: method
  })
}
//  删除工作区
export function delLayout(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
//  新增工作区
export function addLayout(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
//  修改工作区
export function editLayout(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
//  设置默认工作区
export function setDefault(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
//  获取默认工作区
export function getDefault(url, method) {
  return request({
    url: url,
    method: method
  })
}
//  根据名称获取工作区详情
export function getWorkspaceDetail(url, method, data) {
  return request({
    url: `${url}?name=${data}`,
    method: method
  })
}
//  开始广播
export function broadcast(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
//  停止广播
export function stopBroadcast(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
//  根据id获取当前工作区详情
export function getWorkspaceDetailById(url, method, id) {
  return request({
    url: `${url.replace('{id}',id)}`,
    method: method
  })
}
// 查询默认循环播放次数
export function queryCircleTimes(url, method) {
  return request({
    url: `${url}?code=VOICE_BROADCAST_CYCLE`,
    method: method
  })
}
// 根据域信息查询设备
export function getDomainCode(url, method, data) {
  return request({
    url: `${url}?domainCode=${data.domainCode}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: method
  })
}
// 查询下级域
export function getNextDomain(url, method) {
  return request({
    url: url,
    method: method
  })
}
// 获取设备树
export function getDeviceTree(url, method, data) {
  return request({
    url: `${url}?domainCode=${data}`,
    method: method
  })
}

export default {
  devicePushTream,
  getChannelList,
  getLayout,
  delLayout,
  addLayout,
  editLayout,
  setDefault,
  getDefault,
  getWorkspaceDetail,
  broadcast,
  stopBroadcast,
  queryCircleTimes
}
