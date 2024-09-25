import request from '@/utils/request'

// 本周新增时间数量查询
export function getWeekSjzxCount () {
  return new Promise(resolve=>{
    request({
      url: '/zhzz/sjzx/sjgl/getWeekSjzxCount',
      method: 'get',
    }).then(res=>{
      resolve(res);
    }).catch(err=>{
      resolve(false);
    })
  })
}
// 事件数量查询
export function getSjzxCount (params) {
  return new Promise(resolve=>{
    request({
      url: '/zhzz/sjzx/sjgl/getSjzxCount',
      method: 'get',
      params
    }).then(res=>{
      resolve(res);
    }).catch(err=>{
      resolve(false);
    })
  })
}
// 已处理数量或未处理查询
export function getLast6MonthSjzxCount (params) {
  return new Promise(resolve=>{
    request({
      url: '/zhzz/sjzx/sjgl/getLast6MonthSjzxCount',
      method: 'get',
      params
    }).then(res=>{
      resolve(res);
    }).catch(err=>{
      resolve(false);
    })
  })
}
// 进度查询 post
export function readResource (params) {
    return new Promise(resolve=>{
      request({
        url: '/activiti/process/read-resource',
        method: 'get',
        responseType: 'blob',
        params
      }).then(res=>{
        resolve(res);
      }).catch(err=>{
        resolve(false);
      })
    })
  }
// 审批历史
export function listHistory (data) {
  return new Promise(resolve=>{
    request({
      url: '/activiti/process/listHistory',
      method: 'post',
      data
    }).then(res=>{
      resolve(res);
    }).catch(err=>{
      resolve(false);
    })
  })
}
export function getDetails (id) {
  return new Promise(resolve=>{
    request({
      url: '/zhzz/sjzx/sjgl/'+id,
      method: 'get',
    }).then(res=>{
      resolve(res);
    }).catch(err=>{
      resolve(false);
    })
  })
}
// 文件查询接口
export function fileList (params) {
  return new Promise(resolve=>{
    request({
      url: '/system/commonFile/list',
      method: 'get',
      params
    }).then(res=>{
      resolve(res);
    }).catch(err=>{
      resolve(false);
    })
  })
}

