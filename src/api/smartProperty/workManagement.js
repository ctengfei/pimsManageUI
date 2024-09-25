import request from '@/utils/request'
//获取工单页面表格数据
export function initTabData(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })

}

//获取工单统计数据
export function getNumData(url, method) {
  return request({
    url: url,
    method: method,
  })
}


//添加工单
export function addWorkOrders(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//拒绝工单
export function refuseWorkOrder(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//评价工单
export function appraiseWorkOrder(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//派单
export function assignOrder(url, method, data) {
  return request({
    url: url + '?id=' + data.id + '&username=' + data.username,
    // data: data,
    method: method,
  })
}

//转派
export function transferOrder(url, method, data) {
  return request({
    url: url + '?id=' + data.id + '&username=' + data.username,
    method: method,
  })
}

//添加工单分类
export function addCategory(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//编辑工单分类
export function updateCategory(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//删除工单分类
export function delWork(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//删除工单分类
export function delCategory(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//根据id查询工单
export function searchWorkorderById(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//获取人员
export function getUserinfos(data) {
  return request({
    url: '/sys/team',
    method: 'get',
    params: data
  })
}

// 缩略图接口
export function getPhoto(data) {
  return request({
    url: `${data.url}?filePath=${data.path}`,
    method: data.method
  })
}

//工单反馈
export function feedback(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//工单反馈
export function downloadworkOrder(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data,
    responseType: 'blob',
  })
}
//新增
export function addRemind(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data,
  })
}

//删除
export function delRemind(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//编辑
export function editRemind(url, method, data) {
  url = url.split('{')[0] + data.id;
  return request({
    url: url,
    method: method,
    data: data,
  })
}

//查询
export function searchRemind(url, method) {
  return request({
    url: url,
    method: method,
  })
}
// 挂起
export function hangUp(params) {
  return request({
    url: '/pm/repair/order/hang',
    method: 'post',
    params
  })
}