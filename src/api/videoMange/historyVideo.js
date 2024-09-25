import request from '@/utils/request'

// 根据id获取历史录像
export function getHistoryVideo(url,method,params) {
  return request({
    url,
    method,
    params
  })
}

export function getSearchVideo(url,method,params) {
  return request({
    url,
    method,
    params
  })
}

// 拖动时间轴
export function playerRange(url,method) {
  return request({
    url,
    method
  })
}

// 点击暂停按钮
export function playerSuspend(url,method,ssrc) {
  return request({
    url,
    method,
    params:ssrc
  })
}

// 点击播放按钮
export function playerPlay(url,method,ssrc) {
  return request({
    url,
    method,
    params:ssrc
  })
}

// 点击倍数按钮
export function playerSpeed(url,method,params) {
  return request({
    url,
    method,
    params
  })
}

// 点击停止按钮
export function playerStop(url,method,ssrc) {
  return request({
    url,
    method,
    params:ssrc
  })
}

// 开始录制
export function startRecording(url,method,data) {
  return request({
    url,
    method,
    data
  })
}

// 结束录制
export function endRecording(url,method,data) {
  return request({
    url,
    method,
    data
  })
}

// 抓拍多张照片
export function postSnapPhoto(url,method,data) {
  return request({
    url:`${url}?cameraCode=${data.cameraCode}&domainCode=${data.domainCode}`,
    method,
  })
}

// 新增书签
export function postRecordTag(url,method,data) {
  return request({
    url,
    method,
    data
  })
}

// 根据id获取书签列表
export function getRecordTag(url,method,params) {
  return request({
    url,
    method,
    params
  })
}

// 根据id获取告警列表
export function getQueryAlarm(url,method,params) {
  return request({
    url,
    method,
    params
  })
}

// 搜索书签列表
export function getSearchMasks(url,method,params) {
  return request({
    url,
    method,
    params
  })
}

// 搜索告警列表
export function getSearchWarning(url,method,params) {
  return request({
    url,
    method,
    params
  })
}

// 根据书签id删除
export function deleteRecordTag(url,method) {
  return request({
    url,
    method,
  })
}

// 书签的修改
export function putRecordTag(url,method,data) {
  return request({
    url,
    method,
    data
  })
}

// 下载历史回放
export function downloadVideo(url,method,params) {
  return request({
    url,
    method,
    params
  })
}

export default {
  startRecording,
  endRecording,
  postSnapPhoto,
  postRecordTag,
  deleteRecordTag,
  getRecordTag,
  getHistoryVideo,
  playerSpeed,
  playerSuspend,
  playerPlay,
  playerStop,
  playerRange,
  putRecordTag,
  getSearchMasks,
  getSearchVideo,
  downloadVideo,
  getQueryAlarm,
  getSearchWarning
}
