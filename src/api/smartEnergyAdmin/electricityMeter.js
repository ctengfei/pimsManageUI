/*
 * @Descripttion: 
 * @version: 
 * @Author: HJQ
 * @Date: 2022-02-09 17:09:47
 * @LastEditors: HJQ
 * @LastEditTime: 2022-02-10 17:52:18
 */
import request from '@/utils/request'

export function getTable(url,method,params) {
  return request({
    url: url,
    method: method,
    params: params,
  })
}
export function getDetail(url, method, params) {
  return request({
    url: url,
    method: method,
    params: params,
  })
}
