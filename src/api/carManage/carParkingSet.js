import request from '@/utils/request'
// 查询车位列表
export function getCarPark(data) {
  return request({
    url:"/carParkingLot/page",
    method:"get",
    params:data
  })
}

// 新增车位设置
export function addCarParking(data) {
  return request({
    url: "/carParkingLot",
    method: "post",
    data: data
  })
}

// 查看车位设置
export function lookCarParking(id) {
    return request({
      url: "/carParkingLot/" + id,
      method: "get",
    })
}

// 编辑车位设置
export function editCarParking(id, data) {
    return request({
      url: "/carParkingLot/" + id,
      method: "put",
      data: data
    })
}

// 删除车位设置
export function delCarParking(id) {
    return request({
      url: "/carParkingLot/" + id,
      method: "delete",
    })
}

// 获取车位状态
export function getCarParkingState() {
    return request({
      url: "/carParkingLot/parkingSpaceState",
      method: "get",
    })
}

// 获取车位类型
export function getCarParkingType() {
    return request({
      url: "/carParkingLot/parkingSpaceType",
      method: "get",
    })
}

// 获取园区编码
export function getCarParkingCode() {
    return request({
      url: "/carParkingLot/parkCode",
      method: "get",
    })
}
// 车辆信息导出
export function exportCarInfo(data) {
  return request({
    url: "/carParkingLot/page/export",
    method: "get",
    data: data,
    responseType: 'blob',
  })
}
