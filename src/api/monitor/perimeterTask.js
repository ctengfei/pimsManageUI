import request from '@/utils/request'

//  获取列表信息
export function getTaskList(params) {
  return request({
    url: "/securitymonitor/intelligenceAnalysisTask/page",
    method: "get",
    params
  })
}

//  新增任务
export function addTask(data) {
    return request({
      url: "/securitymonitor/intelligenceAnalysisTask",
      method: "post",
      data
    })
}

// 任务开启结束  
export function startOrStop(params) {
    return request({
      url: "/securitymonitor/intelligenceAnalysisTask/startOrStop",
      method: "get",
      params
    })
}

// 编辑任务  
export function editTask(id, data) {
    return request({
      url: "/securitymonitor/intelligenceAnalysisTask/" + id,
      method: "put",
      data
    })
}

// 查询 
export function detailTask(id) {
    return request({
      url: "/securitymonitor/intelligenceAnalysisTask/" + id,
      method: "get",
    })
}

// 删除任务  
export function deleteTask(data) {
    return request({
      url: "/securitymonitor/intelligenceAnalysisTask",
      method: "delete",
      data
    })
}

// 任务类型 
export function getTaskType() {
  return request({
    url: "/securitymonitor/intelligenceAnalysisTask/getTaskTypeEnum",
    method: "get",
  })
}
