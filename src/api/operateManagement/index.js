import request from '@/utils/request'

// 园区入驻企业收入情况统计
export function  companyIncome() {
    return request({
        url: '/pm/OperateCompany/companyIncome',
        method: "get",
    })
}

// 企业按类型统计
export function  countByType() {
    return request({
        url: '/pm/OperateCompany/countByType',
        method: "get",
    })
}

// 专利著作分类统计
export function  countPatentsByType() {
    return request({
        url: '/pm/OperateCompany/countPatentsByType',
        method: "get",
    })
}

// 办公租赁情况
export function  countsByRent() {
    return request({
        url: '/pm/OperateCompany/countsByRent',
        method: "get",
    })
}

// 招商线索来源
export function  countsBySource() {
    return request({
        url: '/pm/OperateCompany/countsBySource',
        method: "get",
    })
}

// 园区资产状态统计
export function  deviceStatus() {
    return request({
        url: '/pm/OperateCompany/deviceStatus',
        method: "get",
    })
}

// 企业入驻情况(近一年)
export function  enterpriseSettled() {
    return request({
        url: '/pm/OperateCompany/enterpriseSettled',
        method: "get",
    })
}

// 企业年收入统计
export function  incomeByType() {
    return request({
        url: '/pm/OperateCompany/incomeByType',
        method: "get",
    })
}

// 企业年收入排名
export function  incomeOrder() {
    return request({
        url: '/pm/OperateCompany/incomeOrder',
        method: "get",
    })
}

// 企业统计
export function  querycount() {
    return request({
        url: '/pm/OperateCompany/querycount',
        method: "get",
    })
}

// 专利著作统计
export function  queryPatentscount() {
    return request({
        url: '/pm/OperateCompany/queryPatentscount',
        method: "get",
    })
}

// 租金收入情况(近一年)
export function  rentalIncome() {
    return request({
        url: '/pm/OperateCompany/rentalIncome',
        method: "get",
    })
}
//  园区企业五年收入
export function  IncomeStatus() {
    return request({
        url: '/pm/OperateCompany/IncomeStatus',
        method: "get",
    })
}
// 园区服务 
export function maintenancecount() {
    return request({
        url: '/pm/operate/maintenancecount',
        method: "get",
    })
}









