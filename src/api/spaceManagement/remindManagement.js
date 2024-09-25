import request from '@/utils/request'

//获取模板
export function searchRemind(url, method,data) {
  return request({
    url: url,
    method: method,
    params:data
  })
}
