import request from '@/utils/request'
// /zhzz/sjzx/sjgl/sjsbList   get 查询接口
export function query(params) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/sjsbList',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 发起流程
export function submitApply(id) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/submitApply/' + id,
      method: 'post',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /zhzz/sjzx/sjgl//{id} get 获取详情接口
export function getDetails(id) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/' + id,
      method: 'get',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /zhzz/sjzx/sjgl post  新增接口
export function add(data) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl',
      method: 'post',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /zhzz/sjzx/sjgl/updateSjglStatus  put
export function updateSjglStatus(data) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/updateSjglStatus',
      method: 'put',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /zhzz/sjzx/sjgl put  编辑接口
export function edit(data) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl',
      method: 'put',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 事件暂存
export function temporaryStorage(data) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/temporaryStorage',
      method: 'post',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 政法事件处理流程开启，事件有则更新，无则新增（登记上报）
export function submitAndRegister(data) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/startProcess',
      method: 'post',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}

//  /zhzz/sjzx/sjgl/{ids} delete  删除接口
export function deleteList(id) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/' + id,
      method: 'delete'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 文件上传
export function upload(data) {
  return new Promise(resolve => {
    request({
      url: '/common/upload',
      method: 'post',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 多个文件上传
export function uploads(data) {
  return new Promise(resolve => {
    request({
      url: '/uploads',
      method: 'post',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 文件查询接口
export function fileList(params) {
  return new Promise(resolve => {
    request({
      url: '/system/commonFile/list',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 文件新增接口
export function addFile(data) {
  return new Promise(resolve => {
    request({
      url: '/system/commonFile',
      method: 'post',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 处理上传文件信息接口
export function updateFile(data) {
  return new Promise(resolve => {
    request({
      url: '/system/commonFile/dealFileInfo',
      method: 'put',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 文件修改接口
export function editFile(data) {
  return new Promise(resolve => {
    request({
      url: '/system/commonFile',
      method: 'put',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 通过关联Id获取系统文件详细信息
export function getInfoByRelationId(params) {
  return new Promise(resolve => {
    request({
      url: '/system/commonFile/getInfoByRelationId',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 文件删除接口
export function removeFile(id) {
  return new Promise(resolve => {
    request({
      url: '/system/commonFile/' + id,
      method: 'delete',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 查询上级部门
export function getHigherDeptByDeptId(params) {
  return new Promise(resolve => {
    request({
      url: '/system/dept/getHigherDeptByDeptId',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 查询下级部门
export function getLowerDeptByDeptId(params) {
  return new Promise(resolve => {
    request({
      url: '/system/dept/getLowerDeptByDeptId',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 查询平级部门
export function getEqualDeptByDeptId(deptId) {
  return new Promise(resolve => {
    request({
      url: `/system/dept/getDeptInfoByDeptId/${deptId}`,
      method: 'get',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 查询当前登录人的接收对象
export function getReceive(deptId) {
  return new Promise(resolve => {
    request({
      url: `/system/dept/getReceive/${deptId}`,
      method: 'get',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 事件类别
export function getsjlb() {
  return new Promise(resolve => {
    request({
      url: '/system/dict/data/type/gb_sjlb',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}