import request from '@/utils/request'

// 查询智慧综治-基础业务-组织管理-党组织管理列表
export function listDzzgl(query) {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl/list',
    method: 'get',
    params: query
  })
}

// 查询智慧综治-基础业务-组织管理-党组织管理详细
export function getDzzgl(id) {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl/' + id,
    method: 'get'
  })
}

// 新增智慧综治-基础业务-组织管理-党组织管理
export function addDzzgl(data) {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl',
    method: 'post',
    data: data
  })
}

// 修改智慧综治-基础业务-组织管理-党组织管理
export function updateDzzgl(data) {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl',
    method: 'put',
    data: data
  })
}

// 删除智慧综治-基础业务-组织管理-党组织管理
export function delDzzgl(id) {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl/' + id,
    method: 'delete'
  })
}

// 导出智慧综治-基础业务-组织管理-党组织管理
export function exportDzzgl(data) {
  return request({
    url: '/zhzz/jcyw/syrk/dzzgl/export',
    method: 'post',
    data: data
  })
}

// 查询智慧综治-基础业务-组织管理-党组织管理-地址列表
export function dzList(data) {
  return request({
    url: '/jcyw/bzdz/ythcj/getInfoByDzlx',
    method: 'post',
    data: data
  })
}
