import request from '@/utils/request'

//  查询子系统
export function initData(url, method, params) {
    return request({
        url: url,
        method: method,
        params
    })
}
export function treeByIdData(url,method,data) {
    return request({
        url: url,
        method: method,
        data
    })
}
export function unmounted(url, method, params, data) {
    return request({
        url: url + '?deviceType=' + params,
        method: method,
        data,
    })
}

export function deviceSync(data) {
    return request({
        url: '/collector/deviceDataSync',
        method: 'post',
        data
    })
}

export function getDetailById(params){
    return request({
        url: '/pm/device',
        method: 'get',
        params
    })
}

//导出
export function download(params) {
    return request({
      url: "/pm/device/criteria/origin/export",
      method: "get",
      params,
      responseType: 'blob',
    })
  }
//   设备所在区域
export function getRegion() {
    return request({
        url: "/pm/device/getRegionEnum",
        method: "get",
    })
}

//   获取摄像头标签 
export function getTage() {
    return request({
        url: "/pm/device/getTageEnum",
        method: "get",
    })
}

