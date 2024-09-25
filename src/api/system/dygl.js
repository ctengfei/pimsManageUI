import request from '@/utils/request'

// 查询智慧综治-基础业务-实有人口-党员管理列表
export function listDygl(query) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl/list',
    method: 'get',
    params: query
  })
}

// 查询智慧综治-基础业务-实有人口-党员管理详细
export function getDygl(id) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl/' + id,
    method: 'get'
  })
}

// 新增智慧综治-基础业务-实有人口-党员管理
export function addDygl(data) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl',
    method: 'post',
    data: data
  })
}

// 修改智慧综治-基础业务-实有人口-党员管理
export function updateDygl(data) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl',
    method: 'put',
    data: data
  })
}

// 删除智慧综治-基础业务-实有人口-党员管理
export function delDygl(id) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl/' + id,
    method: 'delete'
  })
}

// 导出智慧综治-基础业务-实有人口-党员管理
export function exportDygl(data) {
  return request({
    url: '/zhzz/jcyw/syrk/dygl/export',
    method: 'post',
    data: data
  })
}
