import request from '@/utils/request'

// 获取整个树接口
export function treeData(url, method, params) {
    return request({
        url,
        method,
        params,
    })
}

//获取设备详细信息
export function getDeviceCriteria(url, method, params) {
  return request({
    url,
    method,
    params,
  })
}

//获取设备历史回放列表
export function getRecordData(url, method, params) {
  return request({
    url,
    method,
    data: params,
  })
}

//获取IVS播放rtsp流
export function getIvsPlayer(url, method, params) {
  return request({
    url,
    method,
    data: params,
  })
}

// 获取组织结构接口
export function deptTreeData(data) {
    // '/vm/tree/whole/dept'
    return request({
        url: data.url,
        method: data.method
    })
}

export function deleteNode(data) {
    // /vm/tree/delete
    return request({
        url: data.url,
        method: 'delete'
    })
}

export function addNode(url, method, data) {
    // '/vm/tree/create'
    return request({
        url: url,
        method: method,
        data
    })
}

export function editNode(url, method, data) {
    // '/vm/tree/update'
    return request({
        url: url,
        method: method,
        data
    })
}

export function getDeviceInfoById(id) {
    return request({
        url: '/vm/device/query/' + id,
        method: 'get'
    })
}
export function getGroupTreeshebeiInfo(params) {
    return request({
        url: '/device/groupDevice',
        method: 'get',
        params
    })
}
export function getDeviceTree(pid) {
    return request({
        url: '/vm/tree/lazy/' + pid,
        method: 'get'
    })
}
export function SetDeviceTree(data) {
    return request({
        url: '/device/groupDevice',
        method: 'post',
        data
    })
}
