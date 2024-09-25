import request from '@/utils/request'

// 楼栋详情-总数量查询
export function getZhzzJcywBzdzYthcjLdxqCountById(id) {
  return request({
    url: '/jcyw/bzdz/ythcj/getZhzzJcywBzdzYthcjLdxqCountById/' + id,
    method: 'get'
  })
}

// 楼栋详情-按条件查询
export function getZhzzJcywBzdzYthcjLdxqById(id, type) {
  return request({
    url: '/jcyw/bzdz/ythcj/getZhzzJcywBzdzYthcjLdxqById/' + id + '/' + type,
    method: 'get'
  })
}

// 楼栋详情-每户居住人数查询
export function getEveryJzrsCountById(id) {
  return request({
    url: '/jcyw/bzdz/ythcj/getEveryJzrsCountById/' + id,
    method: 'get'
  })
}