import request from '@/utils/request'
  
  //门禁列表
export function  getdoorList(data) {
    return request({
        url: '/pm/device/entrancecontrol/all',
        method: "GET",
        params: data
    })
}

// 打开、关闭门禁
export function  openDoor(data) {
    return request({
      url: '/pm/device/entrancecontrol/control',
      method: "POST",
      data: data
    })
}

// 闸机控制记录列表
export function  getControlRecord(data) {
    return request({
      url: '/traffic/deviceEntranceControlRecord/page',
      method: "get",
      params: data
    })
}

// 导出闸机控制记录
export function  exportControlRecord(data) {
    return request({
      url: '/traffic/deviceEntranceControlRecord/ids/export',
      method: "post",
      data: data,
      responseType: 'blob',
    })
}