import request from '@/utils/request'

const detectionAlarm = {
    // 获取监测告警列表
    getList(params) {
        return request({
          url: `/detectionSite/detectionAlarm/page`,
          method: 'get',
          params: params
        })
    },
    // 环境信息发布新增接口
    addInfoPublish(data){
        return request({
            url: `/environmentalServices/environmentalInformationPublish`,
            method: 'post',
            data: data
        })
    },
    // 环境信息发布查询接口
    getInfoPublish(params){
        return request({
            url: `/environmentalServices/environmentalInformationPublish/page`,
            method: 'get',
            params: params
        })
    },
    // 监测告警 {siteId}
    alarmAnalysis(id, data) {
        return request({
          url:"/detectionSite/detectionAlarm/monitoringTrendAnalysis/" + id,
          method:"get",
          params:data,
        })
    },
    // 最近24小时环境监测报警记录 /detectionSite/detectionAlarm/24h/{siteId}
    detectionAlarm24h(id) {
        return request({
          url:"/detectionSite/detectionAlarm/24h/" + id,
          method:"get",
        })
    },
}
export default detectionAlarm