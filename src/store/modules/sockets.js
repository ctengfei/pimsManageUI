import { Notification,MessageBox, Message } from 'element-ui'
const state = {
  websock: null,	//websock变量
  Csock: null,	//websock变量
  lastestRecvtime: new Date().getTime(),
  webUid:"",
  timeout:null,
  sendHeartInterval: null,        // 发送心跳
  recvHeartInterval: null,        // 接受心跳
  dialogIds: []
}

// mutations 进行数据状态的变化
const mutations = {
  //申明并连接websocket，
  SET_WEBUID_DATA: (state, data) => {
    state.webUid = data
    state.lastestRecvtime = new Date().getTime()
  },
  SET_SENDHERT_DATA: (state)=>{
    if (state.sendHeartInterval) {
        clearInterval(state.sendHeartInterval)
        state.sendHeartInterval = null
    }
    if (state.recvHeartInterval) {
        clearInterval(state.recvHeartInterval)
        state.recvHeartInterval = null
    }
    state.webUid = null;
  },
  SET_DIALOGIDS_DATA: (state, data)=>{
    if(data.notifyType==1){
      if (data.dialogId != null && data.result === 0) {
        state.dialogIds.push(msg.dialogId);
      }
    }else{
      if (data.dialogId != null && data.result === 0) {
        state.dialogIds = state.dialogIds.filter(function (item) {
            return item !== data.dialogId;
        });
      }
    }
  },
}
// actions 改变状态的操作
const actions = {
  initCSocket({ commit }){
    if (!("WebSocket" in window)) {
      //不支持WebSocket
      return;
    }
    if(state.Csock === null){
      const wsuri = 'ws://localhost:50015'
      // const token = obj.token
      state.Csock = new WebSocket(wsuri)
      state.Csock.onopen = function () {
        console.log("wsC连接成功！")
        // state.websock.send()
      };
      state.Csock.onerror = function (e) { //错误
        console.log("wsC错误!")
      };
      state.Csock.onmessage = function (event) {
        let msg = JSON.parse(event.data).msg;
        // state.webUid = msg.webUid;
        commit('SET_WEBUID_DATA', msg.webUid)
        
        actions.msgHandler({ commit },msg);
        console.log("wsC!", event)
      }
      state.Csock.onclose = function () {
        console.log('wsC关闭')
        setTimeout(() => {
          actions.initCSocket({ commit });
        }, 3000);
      }
      state.Csock.onsend = function (data) {
        console.log("wsC===>onsend成功！"+ data)
      }
    }else {
      console.log(state.timeout,"state.timeout")
      actions.release({ commit });
      // if (state.timeout) {
      //     clearTimeout(this.timeout)
      //     state.timeout = null
      // }
      // state.timeout = setTimeout(actions.initCSocket({ commit }, obj), 1000);
    }
    
  },
  sendMessage({commit},method,body) {
    if (state.Csock) {
      state.Csock.send(JSON.stringify({
            func: method,
            msg: body
        }))
    }
  },
  webLogin({commit}){
    let request = {
      webUid: String(msg.webUid),
      loginType: 1,
      ip: '124.70.205.217',
      port: 10010,
      agentType: 1,
      token: null,
      userName: "admin",
      passWord: "123456",
    }
    actions.sendMessage({ commit },"web_login", request);
  },
  msgHandler({commit},msg) {
    let notifyType = msg.notifyType;
    commit('SET_DIALOGIDS_DATA', msg)
    switch (notifyType) {
      case 0:
          Message({
              showClose: true,
              message: "初始化成功",
              type: '',
              duration: 1000
          });
          break;
      case 1:
        commit('SET_DIALOGIDS_DATA', notifyType)
          break;
      case 2:
          commit('SET_DIALOGIDS_DATA', notifyType)
          break;
      case 5:
          if (msg.result === 0) {
            Message({
              showClose: true,
              message: `截图操作成功,保存路径为${JSON.parse(msg.data).msg.captureInfo.saveDirectory}`,
              type: '',
              duration: 1000
            });
              // this.notifyWindow(`截图操作成功,保存路径为${JSON.parse(event.data).msg.captureInfo.saveDirectory}`, true, JSON.parse(event.data).msg.captureInfo.saveDirectory, "#3696e5")
          }
          else {
            Message({
              showClose: true,
              message: "截取图片失败",
              type: '',
              duration: 1000
            });
              // this.notifyWindow("截取图片失败")
          }
          break;
      case 11:
          if (msg.result === 0) {
              console.log("登录成功");
              Message({
                showClose: true,
                message: "登录成功",
                type: '',
                duration: 1000
            });
          }
          else {
            Message({
              showClose: true,
              message: "登录失败",
              type: '',
              duration: 1000
            });
          }
          break;
      case 15:
          if (msg.result === 0) {
              let saveDirectory = JSON.parse(msg.data).msg.localRecordInfo.saveDirectory
              let index = saveDirectory.indexOf("：") + 1
              // this.notifyWindow(
              //     `录像操作成功,${JSON.parse(event.data).msg.localRecordInfo.saveDirectory}`, true, saveDirectory.slice(index, saveDirectory.length - 4), "#3696e5"
              // );
              Message({
                showClose: true,
                message: `录像操作成功,${JSON.parse(msg.data).msg.localRecordInfo.saveDirectory}`,
                type: '',
                duration: 1000
              });
          }
          else {
            Message({
              showClose: true,
              message: "本地录像失败",
              type: '',
              duration: 1000
            });
              // this.notifyWindow("本地录像失败");
          }
          break;
      case 18:
          // // 断线重连之后的操作
          let request = {
              webUid: String(state.webUid),
          }
          actions.sendMessage({ commit },"web_notifyLogin_sucess", request)
          break
      case 19:
        Message({
          showClose: true,
          message: "窗口正在录像中，请勿关闭",
          type: '',
          duration: 1000
        });
          // this.notifyWindow("窗口正在录像中，请勿关闭");
          break
      case 20:
        Message({
          showClose: true,
          message: "浏览器最大窗口还原",
          type: '',
          duration: 1000
        });
          break
      case 22:
          // 文件广播返回结果信息
          // this.resultFileBroadcast(msg)
          break
      case 23:
          console.log('23 message', msg)
          break 
      default:
          break
    }
    
},
  release({ commit }) {
    commit('SET_SENDHERT_DATA')
    // if (this.sendHeartInterval) {
    //   clearInterval(this.sendHeartInterval)
    //   this.sendHeartInterval = null
    // }
    // if (this.recvHeartInterval) {
    //     clearInterval(this.recvHeartInterval)
    //     this.recvHeartInterval = null
    // }
    // if (this.client) {
    //     this.client.close();
    //     this.client = null;
    // }
    
    // this.webUid = null;
    // this.alertMessage("资源已释放");`
  },
  
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
