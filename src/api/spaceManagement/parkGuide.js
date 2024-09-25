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
export function addGuide(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//删除计划
export function deleteGuide(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//更新计划
export function editGuide(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
