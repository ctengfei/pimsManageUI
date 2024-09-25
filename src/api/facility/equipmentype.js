import request from '@/utils/request'

//  设备类型
export function getequipmentype(params){
  return request({
      url: '/pm/tree/type',
      method: 'get',
      params
  })
}