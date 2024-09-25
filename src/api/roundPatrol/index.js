import request from '@/utils/request'

const roundApi = {
  // 根据条件分页查询轮巡计划
  getRoundList(data) {
    return request(
      {
        url:"/sm/robin/round",
        method:"get",
        params: data
      }
    )
  },
  //  新增轮巡计划
  addRound(data) {
    return request(
      {
        url:"/sm/robin/round",
        method:"post",
        data: data
      }
    )
  },
  // /sm/robin/round  修改轮巡计划
  editRound(data) {
    return request(
      {
        url:"/sm/robin/round",
        method:"put",
        data: data
      }
    )
  },
  // 根据id查询轮巡计划
  searchRound(id) {
    return request(
      {
        url:"/sm/robin/round/" + id,
        method:"get",
      }
    )
  },
  // 根据id删除轮巡计划
  delRound(id) {
    return request(
      {
        url:"/sm/robin/round/" + id,
        method:"delete",
      }
    )
  },
  // /sm/robin/round/active  启动或停止轮训计划
  startRound(data) {
    return request(
      {
        url:"/sm/robin/round/active",
        method:"get",
        params: data
      }
    )
  },
  // /sm/robin/round/alarm/{planid}  轮巡告警上报
  getRoundAlarm(data) {
    return request(
      {
        url:"/sm/robin/round/alarm",
        method:"post",
        data: data
      }
    )
  },
  // /sm/robin/round/alarm/event  获取轮巡告警事件
  getRoundAlarmEvent(id) {
    return request(
      {
        url:"/sm/robin/round/alarm/event",
        method:"get",
      }
    )
  },
  //  ​/sm​/robin​/round​/clock 轮巡打卡
  getRoundAlarmClock(data) {
    return request(
      {
        url:"/sm/robin/round/clock",
        method:"post",
        data:data
      }
    )
  },
  // 获取实时轮巡播放链接
  getRoundAlarmPlay(id) {
    return request(
      {
        url:"/sm/robin/round/play/" + id,
        method:"get",
      }
    )
  },
  // 查询告警类型编码
  getConfigBusin(){
    return request(
      {
        url:"/pm/alarm/config/business",
        method:"get",
      }
    )
  },
  // /pm/alarm/config/event/{businessCode}  根绝类型编码获取事件编码
  getConfigEvent(id){
    return request(
      {
        url:"/pm/alarm/config/event/" + id,
        method:"get",
      }
    )
  },
  // /sm/robin/round/pause/{id} 暂停轮训计划
  getRoundPause(id){
    return request(
      {
        url:"/sm/robin/round/pause/" + id,
        method:"get",
      }
    )
  },
  // /sm/robin/round/report  实时轮巡  巡逻上报
  getRoundReport(data){
    return request(
      {
        url:"/sm/robin/round/report",
        method:"get",
        params:data
      }
    )
  },

}

export default roundApi
