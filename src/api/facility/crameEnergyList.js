import request from '@/utils/request'

//  查询子系统/设备列表
export function initData(params) {
    return request({
        url: "/pm/hydropower/selectDevice",
        method: "get",
        params
    })
}
//  监测频率
export function rateLookData(params) {
    return request({
        url: "/pm/hydropower/updateFrequency",
        method: "get",
        params
    })
}
//  监测频率回显
export function rateLookBackView(params) {
    return request({
        url: "/pm/hydropower/alarm/Threshold",
        method: "get",
        params
    })
}
//  查询公司列表
export function initCompanyData(params) {
    return request({
        url: "/pm/hydropower/EnteredCompany",
        method: "get",
        params
    })
}
//  设备新增
export function treeByIdDataAdd(url, method, data) {
    return request({
        url: "/pm/hydropower/insertdevice",
        method: "post",
        data
    })
}
//  设备编辑
export function treeByIdDataEdit(url, method, data) {
    return request({
        url: "/pm/hydropower/updatedevice",
        method: "post",
        data,
    })
}
// 能耗态势园区用水用电用热能耗排名 /pm/hydropower/data/situation/trend/{area}/{type}/{cycle}
export function situationtrend(area,type,cycle) {
    return request({
        url: `/pm/hydropower/data/situation/trend/${area}/${type}/${cycle}`,
        method: "get",
    })
}
// 用热折线图 
export function datatrend(area,type,cycle) {
    return request({
        url: `/pm/hydropower/data/trend/${area}/${type}/${cycle}`,
        method: "get",
    })
}
// 能耗态势能耗总量统计 /pm/hydropower/data/situation/amount/{area}/{type}
export function situationamount(area,type) {
    return request({
        url: `/pm/hydropower/data/situation/amount/${area}/${type}`,
        method: "get",
    })
}
// 能耗态势能耗环比统计 /pm/hydropower/data/situation/cycleAmount/{area}/{type}/{cycle}
export function situationcycleAmount(area,type,cycle) {
    return request({
        url: `/pm/hydropower/data/situation/cycleAmount/${area}/${type}/${cycle}`,
        method: "get",
    })
}
// 能耗态势能耗排名 /pm/hydropower/data/situation/areaRank/{area}/{type}/{cycle}
export function situationareaRank(area,type,cycle) {
    return request({
        url: `/pm/hydropower/data/situation/areaRank/${area}/${type}/${cycle}`,
        method: "get",
    })
}
// 用电饼图  /pm/hydropower/data/situation/{area}/{type}/{cycle}
export function situationPieChart(area,type,cycle) {
    return request({
        url: `/pm/hydropower/data/situation/${area}/${type}/${cycle}`,
        method: "get",
    })
}