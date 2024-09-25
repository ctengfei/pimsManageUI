/*
 * @Author: renjianwu jqhux@isstech.com
 * @Date: 2022-10-14 18:21:02
 * @LastEditors: renjianwu jqhux@isstech.com
 * @LastEditTime: 2022-10-14 18:21:36
 * @FilePath: \pimsManageUI\src\api\system\autosendorder.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

//  获取自动派单数据
export function getsetting() {
  return request({
    url: "/pm/commonConfig/autoDispatchWorkorderConfig",
    method: "get"
  })
}
//  设置自动派单
export function addsetting(data) {
  return request({
    url: "/pm/commonConfig/autoDispatchWorkorderConfig",
    method: "post",
    data:data
  })
}
export default {
    getsetting,
    addsetting,
}