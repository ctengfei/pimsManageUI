import request from '@/utils/request'

// 查询智慧综治_基础业务_实有人口_流动人口列表
export function listLdrk (data, pageNum, pageSize) {
  return request({
    url: `/jcyw/syrk/ldrk/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

// 查询智慧综治_基础业务_实有人口_流动人口详细
export function getLdrk (id) {
  return request({
    url: '/jcyw/syrk/ldrk/' + id,
    method: 'get'
  })
}


// 修改智慧综治_基础业务_实有人口_流动人口
export function updateLdrk (data) {
  return request({
    url: '/jcyw/syrk/ldrk',
    method: 'put',
    data: data
  })
}

// 导出智慧综治_基础业务_实有人口_流动人口
export function exportLdrk (query) {
  return request({
    url: '/jcyw/syrk/ldrk/export',
    method: 'get',
    params: query
  })
}


// 基础业务_人口_流动人口_统计
export function ldrkCountNum (query) {
  return request({
    url: '/jcyw/syrk/ldrk/ldrkCountNum',
    method: 'get',
    params: query
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
// 新增智慧综治_基础业务_实有人口_流动人口
export function addLdrk (data) {
  return new Promise(resolve => {
    request({
      url: "/jcyw/syrk/ldrk",
      method: 'post',
      data: data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 删除智慧综治_基础业务_实有人口_流动人口
export function delLdrk (data) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syrk/ldrk/deleteByIdAndSfzhm',
      method: 'delete',
      data: data
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 获取新增修改自动填充的表单数据
export function getRkxx (params) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syrk/ldrk/getRkxx',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}

// 工作台_流动人口_统计
export function ldrkRsCountNum () {
  return request({
    url: '/jcyw/syrk/ldrk/ldrkRsCountNum',
    method: 'get'
  })
}

//流动人口统计
export function getStatistics (query) {
  return request({
    url: '/jcyw/syrk/ldrk/statistics',
    method: 'get',
    params: query
  })
}
