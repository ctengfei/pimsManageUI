import request from '@/utils/request'

const smartBuild = {
  // 获取设备状态
  getDeviceStatus(data) {
    return request({
      url: "/pm/ibms/criteria",
      method: "get",
      params: data
    })
  },
  // 夜景照明   查询列表状态
  getCriteria(data) {
    return request({
      url: "/pm/ibms/criteria",
      method: "get",
      params: data
    })
  },
  // 夜景照明   回路控制
  getLoopControl(data) {
    return request({
      url: "/pm/ibms/circuit/control",
      method: "post",
      data: data
    })
  },
  // 获取设备统计
  getStatistics(data) {
    return request({
      url: "/pm/ibms/criteria/statistics",
      method: "get",
      params: data
    })
  },

  // 设备控制
  getDeviceControl(query, data) {
    return request({
      url: query.url,
      method: query.method,
      data: data
    })
  },
  getDeviceControls(data) {
    return request({
      url: "/pm/device/barrierGate/control",
      method: "POST",
      data: data
    })
  },


  // 添加设备
  getCreateEnergyDevice(data) {
    return request({
      url: '/building/energy-conservation-model-device/createEnergyDevice',
      method: "POST",
      data: data
    })
  },

  // 删除设备
  getDeleteEnergyDevice(data) {
    return request({
      url: '/building/energy-conservation-model-device/deleteEnergyDeviceBy',
      method: "POST",
      data: data
    })
  },

  // 创建更新节能模式
  getcreateOrUpdate(data) {
    return request({
      url: '/building/energy-conservation-model/createOrUpdateEnergyConservationModel',
      method: "POST",
      data: data
    })
  },

  // 节能模式删除
  getdeleteEnergy(data) {
    return request({
      url: '/building/energy-conservation-model/deleteEnergyConservationModelBy?id=' + data,
      method: "GET",
    })
  },

  // 节能模式设备列表
  getlisettEnergy(data) {
    return request({
      url: '/building/energy-conservation-model/lisettEnergyConservationModelDevice',
      method: "GET",
      params: data
    })
  },

  // 节能模式列表
  getlistEnergyConservationModel(data) {
    return request({
      url: '/building/energy-conservation-model/listEnergyConservationModel',
      method: "GET",
      params: data
    })
  },

  // 开启关闭任务
  getopenOrCloseJob(query, data) {
    return request({
      url: '​/building​/energy-conservation-model​/openOrCloseJob',
      method: "POST",
      data: data
    })
  },

  // 道闸信息
  getCarbarrierGate(data) {
    return request({
      url: '/pm/device/barrierGate/pageQuery',
      method: "GET",
      params: data
    })
  },
  // 道闸通行记录
  getCarbarrierGatePass(data) {
    return request({
      url: '/pm/device/barrierGate/records',
      method: "GET",
      params: data
    })
  },
  //门禁列表
  getdoorList(data) {
    return request({
      url: '/pm/device/entrancecontrol/all',
      method: "GET",
      params: data
    })
  },
  getDoorNum() {
    return request({
      url: '/pm/device/entrancecontrol/statistics',
      method: "GET",
    })
  },
  getDoorRecord(data) {
    return request({
      url: '/pm/device/entrancecontrol/access/records',
      method: "GET",
      params: data
    })
  },
  openDoor(data) {
    return request({
      url: '/pm/device/entrancecontrol/control',
      method: "POST",
      data: data
    })
  },
  // 批量控制设备
  getBatchControl(data) {
    return request({
      url: '/pm/ibms/device/allControl',
      method: "POST",
      data: data
    })
  },
  // 获取暖通空调差值设置
  getAlarmDifference(){
    return request({
      url: 'alarm/airConditioningRoomTemperatureDifference',
      method: "GET",
    })
  },
  // 修改暖通空调差值设置
  putAlarmDifference(data){
    return request({
      url: 'alarm/airConditioningRoomTemperatureDifference',
      method: "PUT",
      data: data
    })
  }

}

export default smartBuild
