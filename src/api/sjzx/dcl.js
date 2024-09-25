import request from '@/utils/request'
import qs from 'qs';
// 待处理列表  get 查询接口
export function query(params) {
  return new Promise(resolve => {
    request({
      url: '/activiti/process/taskList',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//【待办列表】 列表
export function dblbList(params) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/dblb/list',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//【已办列表】 列表
export function yblbList(params) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/yblb/list',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 已处理列表 查询接口
export function taskDoneList(params) {
  return new Promise(resolve => {
    request({
      url: '/activiti/process/taskDoneList',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 处理接口
export function complete(data) {
  return new Promise(resolve => {
    request({
      url: '/activiti/process/complete',
      method: 'post',
      data:qs.stringify(data)
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 转办接口
export function delegate(params) {
  return new Promise(resolve => {
    request({
      url: '/activiti/process/delegate',
      method: 'post',
      params
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