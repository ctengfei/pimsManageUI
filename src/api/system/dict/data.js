import request from '@/utils/request1'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}
//人员标签
export function getRybq() {
  return new Promise(resolve => {
    request({
      url: '/system/dict/data/type/bq_rybq',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//重点青少年标签
export function getzdqsnbq() {
  return new Promise(resolve => {
    request({
      url: '/system/dict/data/type/bq_zdqsn',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//关爱人员标签
export function getGarybq() {
  return new Promise(resolve => {
    request({
      url: '/system/dict/data/type/bq_gary',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
//特殊人员标签
export function gettsrybq() {
  return new Promise(resolve => {
    request({
      url: '/system/dict/data/type/bq_tsrq',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
// 查询网格
export function getWangGe(deptId) {
  return request({
    url: `/system/dept/${deptId}`,
    method: 'get',
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
export function getBeliefs() {
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

