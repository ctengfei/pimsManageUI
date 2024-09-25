import request from '@/utils/request'

const executeControl = {
    // 人脸和车辆布控列表
    getList(params) {
        return request({
          url: `/pm/monitor/pageQuery`,
          method: 'get',
          params: params
        })
    },
    // 创建布控任务 
    createTask(data) {
        return request({
          url: `/pm/monitor/create`,
          method: 'post',
          data:data
        })
    },
    // 根据id批量删除布控任务 
    deleteTask(data) {
        return request({
            url: `/pm/monitor/delete`,
            method: 'delete',
            data:data
        })
    },
    // 人脸和车辆布控根据id获取详情
    getDetail(id) {
        return request({
          url: `/pm/monitor/detail/`+ id,
          method: 'get',
        })
    },
    // 修改人脸和车辆布控任务
    updateTask(data) {
        return request({
          url: `/pm/monitor/update`,
          method: 'post',
          data:data
        })
    },
    // 开启或者禁用布控任务
    updataStatus(data) {
        return request({
          url: `/pm/monitor/status`,
          method: 'post',
          data: data
        })
    },
    // 黑名单组创建
    blockArrCreate(data){
      return request({
        url: `/sm/group/add`,
        method: 'post',
        data: data
      })
    },
    // 黑名单组查询
    blockArrSearch(params){
      return request({
        url: `/sm/group/query`,
        method: 'get',
        params: params
      })
    },
    // 黑名单组修改
    blockArrUpdate(data){
      return request({
        url: `/sm/group/update`,
        method: 'put',
        data: data
      })
    },
    // 黑名单组删除
    blockArrDelete(id){
      return request({
        url: `/sm/group/delete/`+ id,
        method: 'delete',
      })
    },
    // 布控状态 pm/monitor/monitorTaskStatus
    monitorTaskStatus(){
      return request({
        url: `/pm/monitor/monitorTaskStatus`,
        method: 'get',
      })
    },
}
export default executeControl