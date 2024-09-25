/*
 * @Descripttion: 
 * @version: 
 * @Author: HJQ
 * @Date: 2022-02-09 17:07:36
 * @LastEditors: HJQ
 * @LastEditTime: 2022-02-22 10:17:48
 */
import request from '@/utils/request'

//获取入驻页面表格数据
export function initTabData(url, method, data) {
  return request({
    url: url,
    method: method,
    params: data
  })

}

//获取企业画像表格数据根据id
export function initportraitTabData(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//获取企业详情数据根据id
export function getCompanyDetail(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//企业入驻
export function addentered(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//下载附件
export function downloads(url, method, data) {
  return request({
    url: url + '?filePath=' + data,
    method: method,
    data: data,
    responseType: 'blob',
  })
}
export function getdetails(data) {
  return request({
    // url: '/pm/property/fee/bill/query?payStaus=YES&companyName=' + data,
    url: '/pm/property/fee/bill/query',
    method: "GET",
    params: data
  })
}
export function getdetail(data) {
  return request({
    url: '/pm/property/fee/bill/query-detail?billNo=' + data,
    method: "GET",
  })
}
