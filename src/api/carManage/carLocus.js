import request from '@/utils/request'

// 获取名单列表
export function getCarLocus(data) {
  return request({
    url: data.url,
    method: data.method,
    data: data.data
  })
}

export default {
    getCarLocus
}
