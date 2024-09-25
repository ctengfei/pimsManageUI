import request from '@/utils/request'

// 锁定控制
export function getLockList(url,method,data) {
  return request({
    url: `${url}?deviceId=${data.deviceId}&status=${data.status}&time=${data.time}&timeUnit=${data.timeUnit}`,
    method: method,
    data:data
  })
}
// 云台锁定状态
export function getLockState(url,method,id) {
  return request({
    url: `${url}?deviceId=${id}`,
    method: method
  })
}
// 放大/缩小/方位控制
export function getControl(url,method,data) {
  return request({
    url: url,
    method: method,
    data:data
  })
}
// 局部放大控制
export function dragZoom(data) {
  return request({
    url: `/vm/ptz/control/dragZoom`,
    method: 'post',
    data: data
  })
}
// 灯光控制
export function getLightList(url,method,data) {
  return request({
    url: `${url}?supplyLightType=${data.supplyLightType}&deviceId=${data.deviceId}`,
    method: method
  })
}
// 雨刷控制
export function getWiperList(url,method,data) {
  return request({
    url: `${url}/${data.status}/${data.deviceId}`,
    method: method
  })
}
// 看守卫控制
export function getResetList(data) {
  return request({
    url: `/vm/preset/position/home/callDefault/${data.deviceId}`,
    method: 'post',
    data: data
  })
}
// 镜头聚焦/光圈调节
export function getFocusList(url,method,data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
// 暂停播放
export function getPauseplayList(data) {
  return request({
    url: `/vm/ptz/control/pauseplay?play=${data.enlarge}&ssrc=${data.speed}`,
    method: 'post'
  })
}
// 开始扫描
export function getHorizontalList(url,method,data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
// 停止扫描
export function getStopScann(url,method,data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
// 垂直巡航
export function getVerticalList(data) {
  return request({
    url: `/vm/ptz/control/vertical?deviceId=${data.deviceId}`,
    method: 'post'
  })
}
// 定位
export function getLocationList(url,method,data) {
  return request({
    url: `${url}?deviceId=${data.deviceId}&Interval=${data.Interval}`,
    method: method
  })
}
// 预留位设置添加
export function onAddPreset(url, method, data) {
  return request({
    url,
    method,
    data
  })
}

export function onDeletePreset(url, method, data) {
  return request({
    url,
    method,
    data
  })
}

export function onCallPreset(url, method, id) {
  return request({
    url: `${url}/${id}`,
    method,
  })
}

// 查询预留位list
export function queryPreset(url, method, data) {
  return request({
    url: `${url}?cameraCode=${data.cameraCode}&domainCode=${data.domainCode}`,
    method:method
  })
}


export function isPreset(url, method, data) {
  return request({
    url: `${url}?cameraCode=${data.cameraCode}&domainCode=${data.domainCode}`,
    method,
  })
}

export function isSetPreset(url, method, data) {
  return request({
    url: `${url}/${data.id}/${data.time}`,
    method,
  })
}

// 获取巡航路线
export function queryCruiseLineList(deviceId) {
  return request({
    url: `/vm/cruise/list?deviceId=${deviceId}`,
    method: 'get'
  })
}

export function onDeleteCruiseLine(url, method, data) {
  return request({
    url,
    method,
    data
  })
}
// 巡航路线更新顺序
export function changeOrderCruise(data) {
  return request({
    url: '/vm/cruise',
    method: 'put',
    data
  })
}

export function addCruiseLine(url, method, data) {
  return request({
    url,
    method,
    data
  })
}

export function onExcuteCruise(url, method, id) {
  return request({
    url: `${url}/${id}`,
    method,
  })
}
// 视频码流切换
export function changeDefinition(data) {
  return request({
    url: `/vm/ptz/control/definition?ssrc=${data.ssrc}&definition=${data.definition}`,
    method: 'get'
  })
}
// 媒体实时音视频点播
export function changeChoice(data) {
  return request({
    url: `/vm/player/choice/${data.choice}/${data.ssrc}`,
    method: 'post'
  })
}
// 巡航轨迹路线记录
export function getRecordCruiseLine(data) {
  return request({
    url: `/vm/cruise/getCruiseTrail?deviceId=${data.deviceId}&blurry=${data.blurry}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'get'
  })
}
// 语音对讲
export function voiceInterCom(url,method,data) {
  return request({
    url: `${url}?targetDeviceId=${data.deviceId}`,
    method: method
  })
}

export function getCruiseRecordVideo(url, method, data) {
  return request({
    url,
    method,
    params: data
  })
}

// 巡航路线查看详情
export function getCruiseDetail(id) {
  return request({
    url: `/vm/cruise/${id}`,
    method: 'get'
  })
}

export function closeCruiseLine(url, method, data) {
  return request({
    url: `${url}/${data}`,
    method,
  })
}

// 根据树查询右侧列表
export function getDeviceListByTree(data) {
  return request({
    url: '/vm/tree/page',
    method: 'post',
    data
  })
}

// 点击收藏树，右侧table更新接口
export function getDeviceList(data) {
  return request({
    url: '/vm/favorites/page',
    method: 'post',
    data
  })
}

export function updatePresetData(url, method, data) {
  return request({
    url,
    method,
    data
  })
}
// 查询设备信息
export function getInformation(data) {
  return request({
      url:data.url,
      method:data.method,
  })
}

// 查询摄像头配置
export function getCarInformation(data) {
  return request({
      url:`/pm/device?id=${data}`,
      method:'get',
  })
}

// 云台控制
export function getLockCtrl(data){
    return request({
      url:`/sm/ivs/ptz/operation`,
      method:'post',
      data
    })
}
// 设置看守卫
export function setPreset(url, method, data) {
  return request({
    url,
    method,
    data
  })
}
