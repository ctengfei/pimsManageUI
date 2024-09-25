 import request from '@/utils/request'

 export function getCruiseLineList(url, method) {
   return request ({
     url: url,
     method: method
   })
 }
 // 获取巡航计划列表
 export function getAllCruiseList(url, method, data) {
   return request ({
     url: url,
     method: method,
     params: data
   })
 }

