/*
 * @version: 
 * @Author: sscaij
 * @Date: 2021-03-31 14:03:42
 * @LastEditTime: 2021-06-11 10:15:03
 * @LastEditors: sscaij
 */
import request from '@/utils/request'
// 获取图片数据的接口
export function getSnapPhoto(data,obj) {
  if(data.deviceIds){
    return request({
      url: `${data.url}?deviceIds=${data.deviceIds}`,
      method: data.method
    })
  }else{
    return request({
      url: `${data.url}`,
      method: data.method,
      headers: {
        "X-Intranet": true
      },
      data: obj
    })
  }
}

// 点击左侧tree是某一个设备得图片接口
export function getDevicePhoto(data) {
  return request({
    url: `${data.url}?favoriteId=${data.favoriteId}&nodeId=${data.nodeId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&deviceIds=${data.deviceIds}&endTime=${data.endTime}&startTime=${data.startTime}`,
    method: data.method,
  })
}

// 分页 前期接口与后台参数不定，造成一个接口写了多个函数
export function getChangeList(data) {
  if(data.deviceIds){
    return request({
      url: data.url+'?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize+ '&deviceIds=' + data.deviceIds,
      method: data.method
    })
  }else{
    return request({
      url: data.url+'?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize ,
      method: data.method
    })
  }
}

// 模糊查询
export function getFuzzyList(data) {
  return request({
    url: `${data.url}?blurry=${data.content}&blurryType=DESCRIPTION&endTime=${data.endTime}&startTime=${data.startTime}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&nodeId=${data.nodeId}&favoriteId=${data.favoriteId}`,
    method: data.method
  })
}

// 删除图片的接口
export function deleteSnapPhoto(data) {
  return request({
    url: data.url,
    method: data.method
  })
}

// 批量删除
export function deleteSnapPhotoAll(data) {
  return request({
    url: data.url,
    method: data.method,
    data: data.arr
  })
}

// 缩略图接口
export function getSmallPhoto(data) {
  return request({
    url: `${data.url}?filePath=${data.path}`,
    method: data.method
  })
}

// 查看大图的接口
export function getBigPhoto(data) {
  return request({
    url: `${data.url}?filePath=${data.filePath}`,
    method: 'get',
    responseType: 'blob'
  })
}

export default {
  getSnapPhoto, deleteSnapPhoto, getChangeList, getFuzzyList, getDevicePhoto, deleteSnapPhotoAll, getSmallPhoto, getBigPhoto
}
