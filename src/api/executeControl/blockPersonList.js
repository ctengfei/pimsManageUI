import request from '@/utils/request'
// 黑名单管理
const blockPersonList = {

  // 人员黑名单
    // 查询列表
    getPersonList(params) {
        return request({
          url: `/sm/target/blackwhite/pageQuery`,
          method: 'get',
          params: params
        })
    },
    // 创建人员 
    createPerson(data) {
        return request({
          url: `/sm/target/blackwhite/add`,
          method: 'post',
          data: data
        })
    },
    // 根据id批量删除
    deletePerson(id) {
        return request({
            url: `/sm/target/blackwhite/delete/`+ id,
            method: 'delete',
        })
    },
    // 人员根据id获取详情
    // getPersonDetail(id,data) {
    //     return request({
    //       url: `/sm/target/blackwhite/edit/`+ id,
    //       method: 'put',
    //       data:data
    //     })
    // },
    // 修改人员
    updatePerson(id,data) {
        return request({
          url: `/sm/target/blackwhite/edit/` + id,
          method: 'put',
          data:data
        })
    },
  // 车辆黑名单
    // 查询列表
    getCarList(params) {
        return request({
          url: `/sm/car/blackwhite/pageQuery`,
          method: 'get',
          params: params
        })
    },
    // 创建人员 
    createCar(data) {
        return request({
          url: `/sm/car/blackwhite/add`,
          method: 'post',
          data: data
        })
    },
    // 根据id批量删除
    deleteCar(id) {
        return request({
            url: `/sm/car/blackwhite/delete/`+ id,
            method: 'delete',
        })
    },

    // 修改车辆
    updateCar(id,data) {
        return request({
          url: `/sm/car/blackwhite/edit/` + id,
          method: 'put',
          data:data
        })
    },
    // 人员车辆轨迹 /pm/alarm/query/track/{ivsId}
    trackId(id,params) {
      return request({
        url: `/pm/alarm/query/track/` + id,
        method: 'get',
        params
      })
  },
  // 人员车辆轨迹列表
  trackIdList(params) {
    return request({
      url: `/pm/alarm/query/trackList`,
      method: 'get',
      params
    })
},
}
export default blockPersonList