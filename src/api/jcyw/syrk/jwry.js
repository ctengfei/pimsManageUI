import request from '@/utils/request'

// 人口总数统计
export function getTotal () {
  return request({
    url: '/jcyw/syrk/jwry/getJwryCount',
    method: 'get'
  })
}

// 查询智慧综治_基础业务_人口_关爱人口列表
export function listHjrk (data) {
  return request({
    url: `/jcyw/syrk/jwry/list`,
    method: 'get',
    params: data
  })
}

// 根据id查询智慧综治_基础业务_人口_关爱人口详细
export function getHjrk (id) {
  return request({
    url: `/jcyw/syrk/jwry/${id}`,
    method: 'get'
  })
}
// 根据身份证查询智慧综治_基础业务_人口_关爱人口详细
export function getGaryInfo (sfz) {
  return request({
    url: `/jcyw/syrk/zdqsn/queryBySfzhm/${sfz}`,
    method: 'get'
  })
}
// 新增智慧综治_基础业务_人口_关爱人口
export function addGark (data) {
  return request({
    url: '/jcyw/syrk/jwry',
    method: 'post',
    data: data
  })
}

// 修改智慧综治_基础业务_人口_关爱人口
export function updateGark (data) {
  return request({
    url: '/jcyw/syrk/jwry/updateById',
    method: 'put',
    data: data
  })
}

// 删除智慧综治_基础业务_人口_关爱人口
export function delGark (id) {
  return request({
    url: `/jcyw/syrk/jwry/removeById/${id}`,
    method: 'delete'
  })
}
// 批量删除智慧综治_基础业务_人口_关爱人口
export function multipleDelGark (ids) {
  return request({
    url: `/jcyw/syrk/jwry/${ids}`,
    method: 'delete',
  })
}

// 导出智慧综治_基础业务_人口_关爱人口
export function exportHjrk (query) {
  return request({
    url: '/jcyw/syrk/hjrk/export',
    method: 'get',
    params: query
  })
}

// 基础业务_人口_关爱人口_统计
export function hjrkCountNum () {
  return request({
    url: '/jcyw/syrk/hjrk/hjrkCountNum',
    method: 'get'
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
// ​/jcyw​/syrk​/hjrk​/listInfo 关爱人口检索
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
      url: '/system/dict/data/type/gb_gjdqdm',
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

//人员统计
export function getStatistics (query) {
  return request({
    url: '/jcyw/syrk/jwry/statistics',
    method: 'get',
    params: query
  })
}