import request from '@/utils/request'
// 事项清单查询接口
export function sxqdList(query) {
    return request({
        url: '/zhzz/sjzx/sxgl/sxqd/list',
        method: 'get',
        params: query
    })
}
//事项清单详情接口
export function sxqdInfo(id) {
    return new Promise(resolve => {
        request({
            url: `/zhzz/sjzx/sxgl/sxqd/${id}`,
            method: 'get',
        }).then(res => {
            resolve(res);
        }).catch(err => {
            resolve(false);
        })
    })
}
// 事项清单删除接口
export function delsxqd(ids) {
    return request({
      url: `/zhzz/sjzx/sxgl/sxqd/${ids}`,
      method: 'delete'
    })
  }
  // 事项清单编辑接口
export function editsxqd(data) {
    return request({
        url: '/zhzz/sjzx/sxgl/sxqd',
        method: 'put',
        data: data
    })
}
// 事项清单新增接口
export function addsxqd(data) {
    return request({
      url: '/zhzz/sjzx/sxgl/sxqd',
      method: 'post',
      data: data
    })
  }