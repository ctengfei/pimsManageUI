import request from '@/utils/request'

// 获取名单列表
export function getCarMonitorTask(data) {
  return request({
    url: "/pm/car/monitor/pageQuery",
    method: "get",
    params:data
  })
}

// 禁用车辆
export function getStopTask(obj,data) {
  return request({
    url: obj.url,
    method: obj.method,
    data:data
  })
}

 // 启动车辆
 export function getStartTask(obj,data) {
  return request({
    url: obj.url,
    method: obj.method,
    data:data
  })
}

// 新增布控车辆信息
export function postCarContent(obj,data) {
  return request({
    url: "/pm/car/monitor/create",
    method: "post",
    data:data
  })
}

// 删除布控车辆信息
export function deleteCarContent(obj,data) {
  return request({
    url: obj.url,
    method: obj.method,
    data:data
  })
}
 // 获取布控对象
export function getCarControl(data) {
  return request({
    url: data.url,
    method: data.method,
    data:data.data
  })
}

export default {
  getCarMonitorTask,
  postCarContent,
  getStopTask,
  getStartTask,
  deleteCarContent
}
