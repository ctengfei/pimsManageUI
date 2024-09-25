import request from '@/utils/request'
// /jcyw/syfw/fwgl/list  查询列表  post
export function query (params) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl/list',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//列表数据源
export function TableList (params) {
  return new Promise(resolve => {
    request({
      url: '/pm/room/all',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
  // return request({
  //   url: '/pm/room/all',
  //   method: 'get',
  //   params
  // })
}
// /jcyw/syfw/fwgl/{id} 获取详情 get
export function getDetails (id) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl/' + id,
      method: 'get',
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /jcyw/syfw/fwgl  新增   post
export function add (data) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl',
      method: 'post',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /jcyw/syfw/fwgl  修改  put
export function edit (data) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl',
      method: 'put',
      data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /jcyw/syfw/fwgl/{ids} 移除  delete
export function deleteList (id, fwdzid) {
  //debugger;
  return new Promise(resolve => {
    request({
      url: `/jcyw/syfw/fwgl/remove/${id}/${fwdzid}`,
      method: 'delete'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 民族字典
export function getNations () {
  return new Promise(resolve => {
    request({
      url: '/system/dict/data/type/gb_mz',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 宗教字典
export function getBeliefs () {
  return new Promise(resolve => {
    request({
      url: '/system/dict/data/type/ga_zjxy',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 获取统计数据 /jcyw/syfw/fwgl/selectfwCount
export function selectfwCount (params) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl/selectfwCount',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 获取出租房屋数量接口
export function getCzfwCount (params) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl/selectCzfwCount',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 获取出租房屋类别统计接口
export function getCzfwlbCount (params) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl/selectCzfwLbCount',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 获取出租房屋用途数量接口
export function getCzfwytCount (params) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl/selectCzfwYtCount',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}

//房屋管理统计
export function getStatistics () {
  return request({
    url: '/jcyw/syfw/fwgl/statistics',
    method: 'get'
  })
}
//出租房屋统计
export function getCZStatistics () {
  return request({
    url: '/jcyw/syfw/fwgl/cz/statistics',
    method: 'get'
  })
}
