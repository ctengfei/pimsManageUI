import request from '@/utils/request'

// 校园周边查询
export function queryNearBySchool(query) {
  return request({
    url: '/jcyw/xyzb/xxgl/queryNearBySchool',
    method: 'get',
    params: query
  })
}
