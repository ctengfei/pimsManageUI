// 划分日志页面
import request from '@/utils/request'

// 获取网格列表数据
export function getListForHfrz(query) {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params: query
  })
}
