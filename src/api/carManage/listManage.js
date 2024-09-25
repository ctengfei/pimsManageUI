import request from '@/utils/request'

// 查询车辆类型
export function getCarType(data) {
  return request({
    url: data.url,
    method: data.method
  })
}

//  查询车辆颜色
export function getCarColor(data) {
  return request({
    url: data.url,
    method: data.method
  })
}

//  查询车辆分组
export function getCarGroup(data) {
  return request({
    url: data.url,
    method: data.method
  })
}

// 查询车辆品牌
export function getCarBrand(data) {
  return request({
    url: data.url,
    method: data.method
  })
}

// 获取所有车辆列表
export function getQueryByPage(data) {
  return request({
    url: "/sm/car/all",
    method: "get",
    params: data
  })
}
// 获取车辆列表
export function getCarByPage(data) {
  return request({
    url: "/sm/car/all",
    method: "get",
    params: data
  })
}

// 新增车辆信息
export function postCarContent(data) {
  return request({
    url: data.url,
    method: data.method,
    data: data.data
  })
}

// 删除车辆信息
export function deleteCarContent(data) {
  return request({
    url: data.url,
    method: data.method,
    data: data.data
  })
}

// 修改车辆信息
export function putCarContent(data) {
  return request({
    url: data.url,
    method: data.method,
    data: data.data
  })
}
// 获取车辆分组信息
// export function getSearchCarList(data) {
//   return request({
//     url:data.url,
//     method:data.method,
//     params:data.data
//   })
// }
// 分组添加车辆
export function getAddCarList(url,method,data) {
  return request({
    url:url,
    method:method,
    data:data
  })
}
// 删除车辆信息
export function deleteCar(url,method,data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
// // 编辑车辆信息
// export function getEditCarList(url,method,data) {
//   return request({
//     url:url,
//     method:method,
//     data:data
//   })
// }
// // 删除车辆分组
// export function getDeleteCarList(url,method,data) {
//   return request({
//     url:url,
//     method:method,
//     data:data
//   })
// }
// // 批量删除车辆分组
// export function getAllDeleteCar(url,method,data) {
//   return request({
//     url:url,
//     method:method,
//     data:data
//   })
// }
// // 根据id查询该分组下的用户
// export function getSerarchId(data) {
//   return request({
//     url:data.url,
//     method:data.method,
//     params:data.data
//   })
// }

export default {
  getCarType,
  getCarColor,
  getCarGroup,
  getCarBrand,
  getQueryByPage,
  postCarContent,
  deleteCarContent,
  putCarContent,
  getCarByPage,
  deleteCar,
  getAddCarList
}
