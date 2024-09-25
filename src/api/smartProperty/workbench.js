import request from '@/utils/request'

export function initSpanData(data) {
  return request({
    url: '/pm/company_enter/statistics',
    method: 'GET',
  })
}
export function initContractData(data) {
  return request({
    url: '/pm/contract/statistics/renewAndGiveUp',
    method: 'GET',
  })
}
export function worksortsNum(data) {
  return request({
    url: '/pm/repair/order/query/statistics',
    method: 'GET',
  })
}

export function initTabData(data) {
  return {
    data: [
      {
        serialNumber: 1,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "退租",
        createTime: "2017-10-31  23:12:00",
      },
      {
        serialNumber: 1,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "退租",
        createTime: "2017-10-31  23:12:00",
      },
      {
        serialNumber: 1,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "退租",
        createTime: "2017-10-31  23:12:00",
      },
      {
        serialNumber: 1,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "退租",
        createTime: "2017-10-31  23:12:00",
      },
      {
        serialNumber: 2,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "入驻",
        createTime: "2017-10-31  23:12:00",
      },

      {
        serialNumber: 1,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "退租",
        createTime: "2017-10-31  23:12:00",
      },
      {
        serialNumber: 1,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "退租",
        createTime: "2017-10-31  23:12:00",
      },
      {
        serialNumber: 1,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "退租",
        createTime: "2017-10-31  23:12:00",
      },
      {
        serialNumber: 1,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "退租",
        createTime: "2017-10-31  23:12:00",
      },
      {
        serialNumber: 2,
        content: "【合同退租】您为租赁合同：HTly20190052【一期/A栋/332】办理了部分退租，并生成退租结算单，因为个人能力不足，所以退出目前租售的办公室，希望物业公司尽快同意",
        business: "入驻",
        createTime: "2017-10-31  23:12:00",
      },]
  }

  // return request({
  //   url: data.url,
  //   method: data.method,
  // })
}

export function initPieData(data) {
  // return {
  //   data: [
  //     {value: 1, name: '搜索引擎'},
  //     {value: 2, name: '直接访问'},
  //     {value: 3, name: '邮件营销'}
  //   ]
  // }

  return request({
    url: '/pm/repair/order/query/statistics/category',
    method: "GET",
  })
}

export function initLineData(data) {
  return request({
    url: `/pm/repair/order/query/statistics/${data}`,
    method: 'GET',
  })
}
export function initpayData(data) {
  return request({
    url: `/pm/property/fee/bill/feePayStatistics`,
    method: 'GET',
  })
}

export function initFillData(url, method, data) {
  if (data.filterSelectType === 'week') {
    return {
      data: [
        {
          num: 1234,
          name: "全部工单"
        },
        {
          num: 234,
          name: "待处理"
        },
        {
          num: 567,
          name: "处理中"
        },
        {
          num: 789,
          name: "已完成"
        },
      ]
    }
  } else if (data.filterSelectType === 'month') {
    return {
      data: [
        {
          num: 3456,
          name: "全部工单"
        },
        {
          num: 234,
          name: "待处理"
        },
        {
          num: 567,
          name: "处理中"
        },
        {
          num: 789,
          name: "已完成"
        },
      ]
    }
  } else if (data.filterSelectType === 'year') {
    return {
      data: [
        {
          num: 4567,
          name: "全部工单"
        },
        {
          num: 234,
          name: "待处理"
        },
        {
          num: 567,
          name: "处理中"
        },
        {
          num: 789,
          name: "已完成"
        },
      ]
    }
  }

  // return request({
  //   url: url,
  //   method: method,
  //   data:data,
  // })
}
