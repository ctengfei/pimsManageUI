import request from '@/utils/request'

// 获取楼信息
export function BuildInfo(data){
  return request({
    url: '/pm/tree/node/list/gis',
    method: 'post',
    data
  })
}
// 获取楼层信息
export function getFloorDataByBuildId(params){
  return request({
    url: '/pm/tree/node/list/gis',
    method: 'get',
    params
  })
}

// 获取设备信息
export function getdeviceByFloor(params){
    return request({
        url: '/pm/tree/node/list/device/gis',
        method: 'get',
        params
    })
}
