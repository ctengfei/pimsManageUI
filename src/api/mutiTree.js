import request from '@/utils/request'

// 获取收藏树
export function reGetCollectTree(url, method, data) {
  return request(
    {
      url: `${url}?${data.deviceName}&${data.pageNum}&${data.pageSize}&${data.type}`,
      method
    }
  )
}

// 设备添加标签
export function reAddTagToDevice(data) {
  return request(
    {
      url: '/vm/tags/add/nodeTag',
      method: 'post',
      data
    }
  )
}

// 查询设备所有标签
export function reAllTagsInDevice(deviceId) {
  return request(
    {
      url: '/vm/tags/query/nodeTags/' + deviceId,
      method: 'post'
    }
  )
}

// 收藏设备
export function reCollectDevice(url, method, data) {
  return request(
    {
      url,
      method,
      data
    }
  )
}

// 删除文件夹
export function delFileApi(id) {
  return request(
    {
      url: "/device/devicesFavoFolder/"+ id,
      method: "delete",
    }
  )
}

// 删除收藏节点下的设备或者删除节点
export function reDelCollectNodeOrDevice(id) {
  return request(
    {
      url: '/vm/favorites/delete/' + id,
      method: 'delete'
    }
  )
}

// 删除设备上的单个标签
export function reDeleteTag(url, method, data) {
  return request(
    {
      url,
      method,
      data
    }
  )
}

// 通过收藏夹名称获取设备
export function reQueryDeviceByCollect(url, method, data) {
  return request(
    {
      url: `${url}?type=${data.type}&deviceName=${data.deviceName}`,
      method
    }
  )
}
