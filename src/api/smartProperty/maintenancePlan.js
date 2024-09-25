import request from '@/utils/request'

//获取维保表格数据
export function initTabData(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}

//新增计划
export function addPlan(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//删除计划
export function deletePlan(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//更新计划
export function editPlan(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//批量删除计划
export function batchDelete(url, method, data) {
    return request({
      url: url,
      method: method,
      data: data
    })
  }
//   根据id查询
  export function searchById(url, method, id) {
    url = url.split('{')[0] + id;
    return request({
      url: url,
      method: method,
    })
  }

  export function getUser(url, method, data) {
    return request({
      url: url,
      method: method,
      params: data
    })
  }
  export function getDeviceTotal(url, method, data) {
    url = url.split('{')[0] + data;
    return request({
      url: url,
      method: method,
    })
  }