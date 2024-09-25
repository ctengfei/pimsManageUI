import request from '@/utils/request'

// 查询基础业务_实有人口_人口档案
export function populationFile(sfz,type) {
  return request({
    url: `/jcyw/syrk/jbxx/getInfoByIdCard/${sfz}/${type}`,
    method: 'get',
  })
}
// 新增基础业务_实有人口_人员标签
export function addPersonTag(data) {
  return request({
    url: '/jcyw/bqgl',
    method: 'post',
    data: data
  })
}

// 删除基础业务_实有人口_人员标签
export function deletePersonTag(id) {
  return request({
    url: `/jcyw/bqgl/removeById/${id}`,
    method: 'delete',
  })
}
// 查询人员基本信息
export function getPersonBase(sfz) {
  return request({
    url: `/jcyw/syrk/jbxx/list?sfzhm=${sfz}`,
    method: 'get',
  })
}
// 查询人员户籍信息
export function getHJInfo(sfz) {
  return request({
    url: `/jcyw/syrk/hjrk/getRkxx?sfzhm=${sfz}`,
    method: 'get',
  })
}
// 查询流动人口流动信息
export function getLDInfo(sfz) {
  return request({
    url: `/jcyw/syrk/ldrk/getRkxx?sfzhm=${sfz}`,
    method: 'get',
  })
}
// 查询人员地图信息
export function getMapInfo(sfz) {
  return request({
    url: `/jcyw/bzdz/ythcj/getXzdxzBySfzhm/${sfz}`,
    method: 'get',
  })
}
// 查询网格
export function getWangGe(deptId) {
  return request({
    url: `/system/dept/${deptId}`,
    method: 'get',
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
//查询行政区划字典，由底层到顶层
export function getxzqh() {
  return new Promise(resolve => {
    request({
      url: '/system/area/dic',
      method: 'get'
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
