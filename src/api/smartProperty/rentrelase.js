import request from '@/utils/request'


export function initTabData(data) {
  return request({
    url: '/space/contractGiveup/page',
    method: "GET",
    params: data
  })
}


export function check(data) {
  return request({
    url: '/space/contractGiveup/allowable',
    method: "POST",
    data: data
  })
}

export function add(data) {
  return request({
    url: "/space/contractGiveup",
    method: "POST",
    data: data
  })
}


export function allow(data) {
  return request({
    url: '/space/contractGiveup/audit',
    method: "POST",
    data: data
  })
}

