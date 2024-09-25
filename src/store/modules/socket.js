import { Notification,MessageBox, Message } from 'element-ui'
const state = {
  websock: null,	//websock变量
  Csock: null,	//websock变量
  sySsock: null, //用户被挤
  infoNum: 0,	//消息通知
  cruiseInfo: null, // 巡航计划
  cruiseInfoList: [], // 正在巡航的列表
  warningInfo: [], // 告警信息
  turnInfo: null, // 轮巡信息
  isRefresh: false,
  turnTips: null,
  turnTipsList: [], // 正在轮巡的列表
  flag: true,
  isShowTurnTip: false,
  warningSize: '', // 告警总数
  tempObj1:{},
  tempObj2:{},
  reconnectCount:0,
  obj1:null,
  obj2:null,
  obj3:null,
  obj4:null,
  sockAlarmMsg:[],
  sysCount:0,
  warnMsg: '',
  stopIdx: ''
}

// mutations 进行数据状态的变化
const mutations = {
  // 获取实时告警数据
  SET_SOCKET_ALARM: (state, alarmMsg) => {
    state.sockAlarmMsg = []
    state.sockAlarmMsg.push(alarmMsg)
  },
  SET_SOCKET_IDX: (state, idx) => {
    state.stopIdx = idx
  },
  //申明并连接websocket，
  SET_SOCKET_DATA: (state, infoNum) => {
    if(infoNum && infoNum > 0){
      state.infoNum = infoNum
    }else{
      state.infoNum = ''
    }
  },
  SET_SOCKET_WARNMSG: (state,msg) => {
    state.warnMsg = msg
  },
  SET_CRUISE_DATA: (state, cruiseInfo) => {
    state.cruiseInfoList.push(cruiseInfo)
    // if((state.turnTipsList.length+state.cruiseInfoList.length) > 5) {
    //   return
    // }
    // cruiseInfo.createTime == 'undifined' ? " ": cruiseInfo.createTime
    if(!cruiseInfo.createTime){
      return
    }
    Notification({
      dangerouslyUseHTMLString: true,
      message:  '计划类型：巡航计划'+'</br>计划进度：'+'【正在执行】</a>'+'</br>创建时间：'+cruiseInfo.createTime+'</br> <el-button style="height: 30px;width: 40px;color: #051a39 !important;font-size: 15px !important;border: 3px solid transparent !important;background-color: #206aff !important;border-radius: 4px !important;float: right;margin-right: -60px;" class="el-button--primary">查看</el-button>',
      duration: 3000,
      position: 'bottom-right',
      // showClose: false,
      onClick() {
        Notification.closeAll()
        state.cruiseInfoList = []
        state.turnTipsList = []
        state.tempObj2 = cruiseInfo
        toCruise()
      },
    });
  },
  SET_WARNING_DATA:  (state, warningInfo) => {
    state.warningInfo = []
    state.warningInfo.push({
      time: new Date().getTime(),
      info: warningInfo
    })
  },
  SET_WARING_SIZE: (state,warningSize)=>{
    if(warningSize && warningSize > 0){
      state.warningSize = warningSize
    }else{
      state.warningSize = ''
    }
  },
  SET_TURN_DATA: (state, turnInfo) => {
    state.turnInfo = turnInfo
  },
  SET_REFRESH_DATA: (state, isRefresh) => {
    state.infoNum = isRefresh
  },
  SET_ROUND_ROBIN_TIP: (state, turnTips) => {
    state.turnTips = turnTips
    state.turnTipsList.push(turnTips)
    // if((state.turnTipsList.length+state.cruiseInfoList.length) > 5) {
    //   return
    // }
    let planName = "轮巡计划"
    if (turnTips.turnType == 2) {
      planName = "组轮巡计划"
    }else if(turnTips.turnType == 3){
      planName = "特巡计划"
    }
      Notification({
        dangerouslyUseHTMLString: true,
        message:  '计划类型：'+planName+'</br>计划名称：'+turnTips.planName+'</br>计划进度：【正在执行】</a>'+'</br>创建时间：'+turnTips.createTime+'</br><el-button style="height: 30px;width: 40px;color: #051a39 !important;font-size: 15px !important;border: 3px solid transparent !important;background-color: #206aff !important;border-radius: 4px !important;float: right;margin-right: -60px;" class="el-button--primary">查看</el-button>',
        duration: 3000,
        position: 'bottom-right',
        // showClose: false,
        onClick() {
          state.cruiseInfoList = []
          state.turnTipsList = []
          Notification.closeAll()
          state.tempObj1 = turnTips
          toNoticeInfo()
        },
      });
  },
  SET_SHOW_TURN_TIP: (state, isShowTurnTip) => {
    state.isShowTurnTip = isShowTurnTip
  }
}
// actions 改变状态的操作
const actions = {
  initCSocket({ commit }, obj){
    const wsuri = 'ws://127.0.0.1:8090/'
    const token = obj.token
    state.Csock = new WebSocket(wsuri, obj.token)
    state.Csock.onopen = function () {
      console.log("wsC连接成功！")
      // state.websock.send()
    };
    state.Csock.onerror = function (e) { //错误
      console.log("wsC错误!")
    };
    state.Csock.onmessage = function (message) {
      if(message.data == 'from EchoSession:'){
        return false
      }else{
        var msg = JSON.parse(message.data);
        if(typeof(msg) == "object"){
          if(msg.cmd === "download_ok"){
            Message.success("视频下载地址：   " + msg.file_path)
          }else if(msg.cmd === "stop_video"){
            commit('SET_SOCKET_IDX',msg.wnd_index)
          }else{
            return false
          }
        }
        
      }
      
      console.log("wsC!", message)
    }
    state.Csock.onclose = function () {
      console.log('wsC关闭')
      var obj = {
        url: wsuri,
        token: [encodeURI(token)]
      }
      if(typeof(obj) == 'object'){
        setTimeout(() => {
          actions.initCSocket({ commit }, obj);
        }, 3000);
      }
    }
    state.Csock.onsend = function (data) {
      console.log("wsC===>onsend成功！"+ data)
    }
  },
  WEBSOCKET_INIT({ commit }, obj) {
    state.obj1 = commit
    state.obj2 = obj
    try{
      if ('WebSocket' in window) {
        try{
            state.websock = new WebSocket(obj.url, obj.token)
            
        }catch(error){
            console.error(error,"WEBSOCKET_INIT")
        }
        state.websock.onopen = function () {
            console.log("连接成功！")
        };
        state.websock.onerror = function (e) { //错误
          console.log("ws错误!")
          actions.reconnect()
        };
        //websocket与后端链接的数据，为异步链接的方式！
        state.websock.onmessage = function (message) {
          let msg = JSON.parse(message.data)
          if(msg.msgType == "CLOSE"){
            MessageBox.alert(msg.msg, '退出', {
              confirmButtonText: '确定',
              showClose: false,
              callback: action => {
                toLogin()
              }
            });
            return
          }
          let info = JSON.parse(msg.msg)
          // 实时告警
          if (info.socketMsgType === 'alarm'){
            commit('SET_SOCKET_ALARM', info.body)
          }
          // 消息推送
          if (info.socketMsgType === 'message'){
            commit('SET_REFRESH_DATA', info.body.unreadCount)
            if(!info.body.readed && info.body.contentType === 'alarm'){
              commit('SET_SOCKET_WARNMSG', info.body.msgBody)
            }
          }
          if (info.webSocketMsgType === 'SYS_TIP') {
            commit('SET_SOCKET_DATA', info.data)
          }
          if (info.webSocketMsgType === 'CRUISE_PLAN') {
            commit('SET_CRUISE_DATA', info.data)
          }
          if (info.webSocketMsgType === 'ROUND_ROBIN') {
            commit('SET_TURN_DATA', info.data)
          }
          if (info.webSocketMsgType === 'ALARM') {
            commit('SET_WARNING_DATA', info.data)
          }
          if (info.webSocketMsgType === 'ALARM_COUNT') {
            commit('SET_WARING_SIZE', info.data)
          }
          if(info.webSocketMsgType === 'ROUND_ROBIN_TIP') {
            commit('SET_ROUND_ROBIN_TIP', info.data)
          }
          state.websock.onclose = function () {
            console.log('关闭ws')
          }
        }
        state.websock.onsend = function (data) {
          console.log("onsend成功！"+ data)
          state.websock.send(data)
        }
      }else{
        this.$message("此浏览器不支持websocket");
    }
  }catch (e){
    actions.reconnect()
    }
  },
  reconnect(){
      //重连不能超过5次
      if(state.reconnectCount >= 5){
          console.log("重连不能超过5次");
          return;
      }
      actions.WEBSOCKET_INIT(state.obj1,state.obj2);
      //重连不能超过5次
      state.reconnectCount++;
      console.log("第"+state.reconnectCount+"次重连");
  },
  reconnects(){
    //重连不能超过5次
    if(state.sysCount >= 5){
        console.log("重连不能超过5次");
        return;
    }
    actions.WEBSOCKET_INIT(state.obj3,state.obj4);
    //重连不能超过5次
    state.sysCount++;
    console.log("第"+state.sysCount+"次重连");
}
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
