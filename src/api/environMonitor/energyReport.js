import request from '@/utils/request'

// 能耗报表列表数据
export function getListData(type,cycle,data) {
  return request({
    url: `/pm/hydropower/statData/${type}/${cycle}/query`,
    method: 'post',
    data
  })
}

// 能耗报表统计图数据
export function getReportData(type,cycle,data) {
  return request({
    url: `/pm/hydropower/data/trend/${type}/${cycle}`,
    method: 'post',
    data
  })
}

// 能耗报表导出
export function reportDataExport(type,cycle,data) {
  return request({
    url: `/pm/hydropower/statData/${type}/${cycle}/export`,
    method: 'post',
    data,
    responseType: 'blob',
  })
}
