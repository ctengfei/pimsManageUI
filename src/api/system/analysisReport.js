/*
 * @Descripttion: 
 * @version: 
 * @Author: HJQ
 * @Date: 2022-02-08 15:06:00
 * @LastEditors: HJQ
 * @LastEditTime: 2022-02-08 16:55:21
 */

import  request  from '@/utils/request'

const analysisReport = {
    // 获取版本列表
    getReportByPage(url,method,data){
        return request({
            url: url,
            method: method,
            params: data
        })
    },
    downloads(data){
        return request({
            url: "/file/loadByUrl?url=" +data,
            method: "GET",
            responseType: 'blob',
        })
    },
   
}
export default analysisReport