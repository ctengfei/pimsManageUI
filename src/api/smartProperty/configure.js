/*
 * @Descripttion: 
 * @version: 
 * @Author: HJQ
 * @Date: 2022-02-09 17:07:36
 * @LastEditors: HJQ
 * @LastEditTime: 2022-02-21 17:38:17
 */
import request from '@/utils/request'

//获取收费项表格数据
export function initTabData(url, method) {
  return request({
    url: url,
    method: method,
  })
}
export function initTabDatas(url, method) {
  return request({
    url: url,
    method: method,
  })
}


//根据费用名称查询收费项
export function searchByName(url, method, name) {
  console.log(name);
  console.log(url);
  return request({
    url: url + '?name=' + name,
    method: method,
  })
}

//新增收费项
export function addFee(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}

//删除收费项
export function deleteFee(url, method, id) {
  url = url.split('{')[0] + id;
  return request({
    url: url,
    method: method,
  })
}

//更新收费项
export function editFee(url, method, data) {
  return request({
    url: url,
    method: method,
    data: data
  })
}
