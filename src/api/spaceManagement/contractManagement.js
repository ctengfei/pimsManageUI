/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: HJQ
 * @Date: 2022-02-09 17:07:36
 * @LastEditors: renjianwu jwrenx@isstech.com
 * @LastEditTime: 2022-11-11 14:41:23
 */
import request from '@/utils/request'

const contract = {
  // 查询
  
  searchForm(url, method, data) {
    return request({
      url: url,
      method: method,
      params: data
    })
  },
  // 下载
  downloadAll(url, method, data) {
    return request({
      url: url,
      method: method,
      params: data,
      responseType: 'blob',
    })
  },
  // 详情
  detail(url, method, data) {
    return request({
      url: url + `?id=${data}`,
      method: method
    })
  },
  // 撤销
  removes(url, method, data) {
    return request({
      url: url + `?serialNumber=${data}`,
      method: method,
    })
  },
  // body查询
  addForm(url, method, data) {
    return request({
      url: url,
      method: method,
      data
    })
  }, 
  searchdynamic(data) {
    return request({
      url: '/pm/contract/dynamic',
      method: 'GET',
      params:data
    })
  },
  checkcontract(data) {
    return request({
      url: '/pm/contract/audit',
      method: 'POST',
      data:data
    })
  },
}
export default contract
