import request from '@/utils/request'
// 查询车辆信息
export function getcarInfo(data) {
  return request({
    url:"/sm/car/all",
    method:"get",
    params:data
  })
}

//同步车辆信息
export function getawaitInfo(data) {
  return request({
    url:"/sm/car/synchronize",
    method:"get",
    params:data
  })
}
// 车辆信息导出
export function exportCarInfo(data) {
  return request({
    url: "/sm/car/export",
    method: "post",
    data: data,
    responseType: 'blob',
  })
}

// 新增车辆/sm/car
export function addCarInfo(data) {
  return request({
    url: "/sm/car",
    method: "post",
    data: data,
  })
}

// 查看车辆信息
export function lookCarInfo(id) {
  return request({
    url: "/sm/car/" + id,
    method: "get",
  })
}

// 编辑车辆信息
export function editCarInfo(id, data) {
  return request({
    url: "/sm/car/" + id,
    method: "put",
    data: data,
  })
}

// 删除车辆信息
export function delCarInfo(id) {
  return request({
    url: "/sm/car/" + id,
    method: "get",
  })
}