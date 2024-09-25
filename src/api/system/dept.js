import request from '@/utils/request1'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}

// 查询部门下拉树结构
export function treeselect(query) {
  return request({
    url: '/system/dept/treeselect',
    method: 'get',
    params: query
  })
}
// 房屋标签字典
export function getFwbq() {
  return new Promise(resolve => {
    request({
      url: '/system/dict/data/type/bq_fwbq',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}