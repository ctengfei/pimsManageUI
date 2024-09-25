import request from '@/utils/request'
// /zhzz/sjzx/sjgl/list  get 查询接口
export function query (params) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/list',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//【全部事件】 列表
export function qbsjList (params) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/qbsj/list',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /zhzz/sjzx/sjgl//{id} get 获取详情接口
export function getDetails (id) {
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
export function add (data) {
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
export function edit (data) {
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
export function deleteList (id) {
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
//事件类别统计接口
export function getSxmlTypeCount () {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sxgl/sxml/getSxmlTypeCount',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//【受理登记】 列表
export function sldjList (params) {
  return new Promise(resolve => {
    request({
      url: '/zhzz/sjzx/sjgl/sldj/list',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//受理登记】事件统计 待受理【dsl】，事件来源【sjly】，事件类型【sjlx】，已受理【ysl】，已登记【ydj】
export function sldjStatistics (type) {
  return new Promise(resolve => {
    request({
      url: `/zhzz/sjzx/sjgl/sldj/statistics/${type}`,
      method: 'get',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//【待办列表】事件统计 待办理【dbl】，事件来源【sjly】，事件类型【sjlx】，紧急程度【jjcd】
export function dblbStatistics (type) {
  return new Promise(resolve => {
    request({
      url: `/zhzz/sjzx/sjgl/dblb/statistics/${type}`,
      method: 'get',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//【已办列表】事件统计 已办理【ybl】，事件来源【sjly】，事件类型【sjlx】，紧急程度【jjcd】
export function yblbStatistics (type) {
  return new Promise(resolve => {
    request({
      url: `/zhzz/sjzx/sjgl/yblb/statistics/${type}`,
      method: 'get',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//【全部事件】事件统计 事件总数【sjzs】，事件来源【sjly】，事件类型【sjlx】，紧急程度【jjcd】
export function qbsjStatistics (type) {
  return new Promise(resolve => {
    request({
      url: `/zhzz/sjzx/sjgl/qbsj/statistics/${type}`,
      method: 'get',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}