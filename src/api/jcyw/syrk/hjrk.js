import request from '@/utils/request'
export function queryfw (params) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syfw/fwgl/getHavingFzlist',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 人口总数统计
export function getTotal () {
  return request({
    url: '/jcyw/syrk/hjrk/getTotal',
    method: 'get'
  })
}
//查询是否是户主
export function isHz (data) {
  return request({
    url: `/jcyw/syrk/hjrk/getHzInfo`,
    method: 'post',
    data
  })
}
// 查询智慧综治_基础业务_人口_户籍人口列表
export function listHjrk (data, pageNum, pageSize) {
  return request({
    url: `/jcyw/syrk/hjrk/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

// 查询智慧综治_基础业务_人口_户籍人口详细
export function getHjrk (id) {
  return request({
    url: '/jcyw/syrk/hjrk/' + id,
    method: 'get'
  })
}

// 新增智慧综治_基础业务_人口_户籍人口
export function addHjrk (data) {
  return request({
    url: '/jcyw/syrk/hjrk',
    method: 'post',
    data: data
  })
}

// 修改智慧综治_基础业务_人口_户籍人口
export function updateHjrk (data) {
  return request({
    url: '/jcyw/syrk/hjrk',
    method: 'put',
    data: data
  })
}

// 删除智慧综治_基础业务_人口_户籍人口
export function delHjrk (id) {
  return request({
    url: '/jcyw/syrk/hjrk/' + id,
    method: 'delete'
  })
}

// 导出智慧综治_基础业务_人口_户籍人口
export function exportHjrk (query) {
  return request({
    url: '/jcyw/syrk/hjrk/export',
    method: 'get',
    params: query
  })
}

// 基础业务_人口_户籍人口_统计
export function hjrkCountNum (query) {
  return request({
    url: '/jcyw/syrk/hjrk/hjrkCountNum',
    method: 'get',
    params: query
  })
}

// /jcyw/syrk/hjrk/nationalTotal 统计智慧综治_基础业务_人口_宗教信仰占比
export function nationalTotal () {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syrk/hjrk/nationalTotal',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// ​/jcyw​/syrk​/hjrk​/listInfo 户籍人口检索
export function listInfo (params) {
  return new Promise(resolve => {
    request({
      url: '​/jcyw​/syrk​/hjrk​/listInfo',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /jcyw/syrk/hjrk/genderTotal 统计男女比例
export function genderTotal () {
  return new Promise(resolve => {
    request({
      url: '​/jcyw/syrk/hjrk/genderTotal',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// /jcyw/syrk/hjrk/beliefsTotal 统计智慧综治_基础业务_人口_宗教信仰占比
export function beliefsTotal () {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syrk/hjrk/beliefsTotal',
      method: 'get'
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

// 新增智慧综治_基础业务_实有人口_流动人口
export function addLdrk (data) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/syrk/hjrk',
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
      url: '/jcyw/syrk/hjrk/deleteByIdAndSfzhm',
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
      url: '/jcyw/syrk/hjrk/getRkxx',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 查询行政区划树结构
export function getAreaTree (params) {
  return new Promise(resolve => {
    request({
      url: '/system/area/tree',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}

// 工作太_户籍人口_统计
export function hjrkRsCountNum () {
  return request({
    url: '/jcyw/syrk/hjrk/hjrkRsCountNum',
    method: 'get'
  })
}
// 职业类别树
export function getZylbTree () {
  return request({
    url: '/jcyw/syrk/jbxx/getZylbTree',
    method: 'get'
  })
}

//户籍人口统计
export function getStatistics (query) {
  return request({
    url: '/jcyw/syrk/hjrk/statistics',
    method: 'get',
    params: query
  })
}

