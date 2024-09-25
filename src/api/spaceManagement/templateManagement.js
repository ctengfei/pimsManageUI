/*
 * @Author: renjianwu jwrenx@isstech.com
 * @Date: 2022-10-31 17:43:16
 * @LastEditors: renjianwu jwrenx@isstech.com
 * @LastEditTime: 2022-11-11 15:14:28
 * @FilePath: \pimsManageUI\src\api\spaceManagement\templateManagement.js
 * @Description: 
 */
import request from '@/utils/request'

//获取模板
export function searchTemplate(url, method,data) {
  return request({
    url: url,
    method: method,
    params:data
  })
}

//添加模板
export function addTemplate(url, method,data) {
    return request({
      url: url,
      method: method,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data;'
      }
    })
  }
  //删除模板
export function deleteTemplate(url, method,data) {
    return request({
      url: url,
      method: method,
      data:data
    })
  }
  //下载模板
export function downloadTemplate(url, method) {
    return request({
      url: url,
      method: method,
    })
  }

    //批量下载模板
export function downloadBatchTemplate(url, method) {

  return request({
    url: url,
    method: method,
    responseType: 'blob'
  })
}