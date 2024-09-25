import request from '@/utils/request'

//获取设备详细信息能耗唯一
export function getDeviceCriteriaEnergy(url, method, params) {
    return request({
      url: '/pm/hydropower/whole',
      method: 'get',
      params,
    })
  }
//获取树状结构信息能耗唯一
export function getDeviceTreeEnergy(url, method, params) {
    return request({
      url: '/pm/hydropower/whole',
      method: 'get',
      params,
    })
}
//获取列表
export function initTableData(params) {
    return request({
      // url: '/pm/hydropower/point/everyDayData',
      url: '/pm/hydropower/point/everyDay',
      method: 'get',
      params
    })
}
//获取公司列表
export function initCompanyTableData(params) {
  return request({
    // url: '/pm/hydropower/point/everyDayData',
    // url: '/pm/hydropower/point/everyDay',
    url: '/pm/hydropower/point/everyDayCompany',
    method: 'get',
    params
  })
}
//导出(楼宇)
export function download(url, method, params) {
  return request({
    url: url,
    method: method,
    responseType: 'blob',
    params
  })
}
//导出月报
export function downloadMonthly(url, method) {
  return request({
    url: url,
    method: method,
    responseType: 'blob',
  })
}