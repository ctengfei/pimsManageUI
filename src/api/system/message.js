import request from '@/utils/request'

export function getMessageList(params){
    return request({
        url: '/message/page/mine',
        method: 'get',
        params
    })
}

// 标记已读
export function markRead(id){
    return request({
        url: '/message/'+id+'/readed',
        method: 'post'
    })
}
// 批量标记已读
export function markReads(data){
    return request({
        url: '/message/readed',
        method: 'post',
        data
    })
}

// 删除消息
export function noSeeMessage(id){
    return request({
        url: '/message/' + id + '/hide',
        method: 'post'
    })
}

// 批量删除消息
export function noSeeMessages(data){
    return request({
        url: '/message/hide',
        method: 'post',
        data
    })
}

// 下载
export function loadByUrl(url) {
    return request({
        url: '/file/loadByUrl?url='+url,
        method: 'get'
    })
}


// 查询消息模板列表
export function listMessageTemplate() {
    return request({
      url: '/message/template/list',
      method: 'get'
    })
  }
  
  
  
  // 编辑消息模板页面
  export function getMessageTemplate(params) {
    return request({
      url: '/message/template',
      method: 'get',
      params:params
    })
  }
  
  // 修改消息模板
  export function updateMessageTemplate(data) {
    return request({
      url: '/message/template',
      method: 'put',
      data: data
    })
  }