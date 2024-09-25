import request from '@/utils/request'

const roundApi = {
  // 获取消息列表
  getMineList(data) {
    return request(
      {
        url:"/message/page/mine",
        method:"get",
        params: data
      }
    )
  },
  //  批量删除
  delMine(data) {
    return request(
      {
        url:"/message",
        method:"delete",
        data: data
      }
    )
  },
  // 消息未读
  messageRead(data) {
    return request(
      {
        url:"/message/readed",
        method:"post",
        data: data
      }
    )
  },
  // 任务转派
  transferOrder(data) {
    return request(
      {
        url:"/pm/alarm/order/transfer",
        method:"get",
        params: data
      }
    )
  },
  // 待办中我的统计
  getTodoCenter(){
    return request(
      {
        url:"/pm/todoCenter",
        method:"get",
      }
    )
  },
  // 我的任务的统计
  getAlermOrder() {
    return request(
      {
        url:"/pm/alarm/order/query/me/statistic",
        method:"get",
      }
    )
  },
  // /pm/alarm/order/query/{id}
  // 根据id查询告警任务
  getAlarmIdOrder(id){
    return request(
      {
        url:"/pm/alarm/order/query/"+ id,
        method:"get",
      }
    )
  },
  // 根据id查询告警
  getAlarmIdDetail(id){
    return request(
      {
        url:"/pm/alarm/"+ id,
        method:"get",
      }
    )
  },
}

export default roundApi
