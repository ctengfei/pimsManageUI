import request from '@/utils/request'

const appVer = {
    // 获取版本列表
    getVersionPage(params){
        return request({
            url: '/appVersion/page',
            method: 'get',
            params: params
        })
    },
    // 发布版本
    publishVer(params){
        return request({
            url: '/appVersion',
            method: 'post',
            data: params
        })
    },
     // 编辑版本
    editVersion(id,params){
        return request({
            url: `/appVersion/`+id,
            method: 'put',
            data: params
        })
    },
    // 发布  appVersion/s/unpublish
    publish(id){
      return request({
          url: `/appVersion/`+ id + `/publish`,
          method: 'post',
      })
    },
    // 取消发布
    unpublish(id){
      return request({
          url: `/appVersion/`+ id + `/unpublish`,
          method: 'post',
      })
    },
}
export default appVer