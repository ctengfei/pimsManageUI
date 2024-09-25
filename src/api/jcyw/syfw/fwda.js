import request from '@/utils/request'

// 查询基础业务_实有人口_人口档案
export function populationFile(fwId) {
  return request({
    url: `/jcyw/syfw/fwgl/getZhzzJcywSyfwJbxxAllInfoByFwId/${fwId}`,
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
// 查询人员地图信息
export function getMapInfo(id) {
  return request({
    url: `/jcyw/bzdz/ythcj/${id}`,
    method: 'get',
  })
}
// 根据室的id查询楼栋id
export function getBuildId(params) {
  return new Promise(resolve => {
    request({
      url: '/jcyw/bzdz/ythcj/getlxinfo',
      method: 'get',
      params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      resolve(false);
    })
  })
}
