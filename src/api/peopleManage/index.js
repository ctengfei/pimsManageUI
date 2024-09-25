import request from '@/utils/request'

// 获取人员名单管理列表
export function getPeopleManageList(query, data) {
  return request({
    url: query.url,
    method: query.method,
    params: data
  })
}


// 获取类型列表
export function getMemberType(query, data) {
  return request({
    url: query.url,
    method: query.method,
    params: data
  })
}

// 获取人员布控列表
export function getPeopleControl(query, params) {
  return request({
    url: query.url,
    method: query.method,
    params
  })
}

// 删除布控
export function deleteControl(query, id) {
  return request({
    url: `${query.url.split('/{')[0]}/${id}`,
    method: query.method
  })
}
// 单个删除
export function singleDelete(query, data) {
  return request({
    url: `${query.url.split('/{')[0]}/${data}`,
    method: query.method,
  })
}

// 批量删除
export function batchDeleteControl(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}


// 启动人员布控
export function startControl(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}

// 停用人员不控
export function stopControl(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}



export function batchDeletion(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}

// 添加人员布控
export function addControl (query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}
// 新增
export function newPersonnelList(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}

// 修改、编辑
export function editEdit(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}

// 获取人员布控设备
export function getControlDevice(query) {
  return request({
    url: query.url,
    method: query.method
  })
}


// 获取人员轨迹
export function getPeopleLocus(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data: data
  })
}


export function getPhoto(query, data) {
  return request({
    url: query.url,
    method: query.method,
    params: data
  })
}


// 人员同步
export function getSchor(query) {
  return request({
    url: query.url,
    method: query.method,
  })
}


// 获取人员分组信息
export function getPersonGroup(query, data) {
  return request({
    url: query.url,
    method: query.method,
    params: data
  })
}


// 人员分组添加
export function addPersonGroup(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}


// 编辑人员分组
export function editPersonGroup(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data
  })
}

// 删除人员分组
export function deletePersonGroup(query, id) {
  return request({
    url: `${query.url.split('/{')[0]}/${id}`,
    method: query.method
  })
}


// 根据id查询该分组下的用户
export function getPersonGroupById(query, id) {
  return request({
    url: `${query.url.split('/{')[0]}/${id}`,
    method: query.method
  })
}

// 分组下添加人员
export function addPeopleToGroup(query, id, data) {
  return request({
    url:  `${query.url.split('/{')[0]}/${id}`,
    method: query.method,
    data
  })
}
export function deletePeopleToGroup(query, id, data) {
  return request({
    url:  `${query.url.split('/{')[0]}/${id}`,
    method: query.method,
    data
  })
}

// 分组下全量人员
export function getGroupAllMember(query, data) {
  return request({
    url: query.url,
    method: query.method,
    params: data
  })
}

// 分组下全量人员
export function getAccess(data) {
  return request({
    url: "/traffic/personPassRecord/page",
    method: "get",
    params: data
  })
}

// 查询用户权限
export function getAccessControl(query, data) {
  return request({
    url: query.url,
    method: query.method,
    params: data
  })
}
// 同步用户
export function getAwait(data) {
  return request({
    url: "/pm/traffic/person/synchronize",
    method: "get",
    params: data
  })
}

export function getVisitor(data) {
  return request({
      url:data.url,
      method:data.method,
      params:data.data
  })
}
// 绑定权限
export function getBind(query, data) {
  return request({
    url: query.url,
    method: query.method,
    data: data
  })
}
// 人员管理导出  
export function exportPersonInfo(data) {
  return request({
    url: "/pm/traffic/person/export",
    method: "post",
    data: data,
    responseType: 'blob',
  })
}
//  人员通行记录导出
export function exportPersonPassRecord(data) {
  return request({
    url: "/traffic/personPassRecord/export",
    method: "post",
    data: data,
    responseType: 'blob',
  })
}
// 访客记录分页查询
export function visitorRecord(data) {
  return request({
    url: "/visitor/visitorRecord/page",
    method: "get",
    params: data,
  })
}
// 访客记录导出
export function visitorRecordExport(data) {
  return request({
    url: "/visitor/visitorRecord/export",
    method: "post",
    data: data,
    responseType: 'blob',
  })
}

// 人员类型
export function getPersonType() {
  return request({
    url: "/traffic/personType/getPersonTypes",
    method: "get",
  })
}

// 