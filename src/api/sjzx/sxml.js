import request from '@/utils/request'
// 级联事项目录结构
export function sxmlCascader(query) {
    return request({
        url: '/zhzz/sjzx/sxgl/sxml/sxmlAllTreeList',
        method: 'get',
        params: query
    })
}

// 事项目录树结构接口
export function sxmlTreeList(query) {
    return request({
        url: '/zhzz/sjzx/sxgl/sxml/sxmlTreeList',
        method: 'get',
        params: query
    })
}
// 事项目录树结构接口
export function sxmlList(query) {
    return request({
        url: '/zhzz/sjzx/sxgl/sxml/list',
        method: 'get',
        params: query
    })
}
//事项目录树详情接口
export function sxmlTreeInfoById(id) {
    return new Promise(resolve => {
        request({
            url: `/zhzz/sjzx/sxgl/sxml/${id}`,
            method: 'get',
        }).then(res => {
            resolve(res);
        }).catch(err => {
            resolve(false);
        })
    })
}
// 事项目录删除接口
export function delSxml(ids) {
    return request({
      url: `/zhzz/sjzx/sxgl/sxml/${ids}`,
      method: 'delete'
    })
  }
  // 事项目录编辑接口
export function editSxml(data) {
    return request({
        url: '/zhzz/sjzx/sxgl/sxml',
        method: 'put',
        data: data
    })
}
// 事项目录新增接口
export function addSxml(data) {
    return request({
      url: '/zhzz/sjzx/sxgl/sxml',
      method: 'post',
      data: data
    })
  }