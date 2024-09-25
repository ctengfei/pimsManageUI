import request  from '@/utils/request'

//获取维保表格数据
export function initTabData(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })
}

//导出计划
export function download(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
