import request from '@/utils/request'
// 查询车位申请列表
export function getCarParkSpace(data) {
  return request({
    url:"/carParkingSpaceApplication/page",
    method:"get",
    params:data
  })
}

// 新增车位申请
export function addCarParkSpace(data) {
  return request({
    url: "/carParkingSpaceApplication",
    method: "post",
    data: data
  })
}

// 编辑车位申请
export function editCarParkSpace(id, data) {
    return request({
      url: "/carParkingSpaceApplication/" + id,
      method: "put",
      data: data
    })
}

// 查看车位申请
export function lookCarParkSpace(id) {
    return request({
      url: "/carParkingSpaceApplication/" + id,
      method: "get",
    })
}

// 车位审批
export function carParkSpaceApproval(id, data) {
    return request({
      url: "/carParkingSpaceApplication/approval/" + id,
      method: "put",
      data: data
    })
}
// 删除车位申请
export function delCarParkSpace(id) {
    return request({
      url: "/carParkingSpaceApplication/" + id,
      method: "delete",
    })
}
// 车道 
export function carChannelPage(params) {
  return request({
    url: "/sm/car/carChannelPage",
    method: "get",
    params
  })
}
// 审批状态 /getApprovalStatusEnum"
export function getApprovalStatus() {
  return request({
    url: "/carParkingSpaceApplication/getApprovalStatusEnum",
    method: "get",
  })
}

