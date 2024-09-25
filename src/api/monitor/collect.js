import request from '@/utils/request'

export function reAddCollect(url, method, data) {
  return request(
    {
      url,
      method,
      data
    }
  )
}
export function reDeleteCollect(url, method, id, folderId) {
  return request(
    {
      url: `${url}?referenceId=${id}&folderId=${folderId}`,
      method,
    }
  )
}

export function reUpdateCollect(url, method, data) {
  return request(
    {
      url,
      method,
      data
    }
  )
}

export function reQueryCollectList(data) {
  return request(
    {
      url:`/device/devicesFavoFolder/page?pageNum=1&pageSize=100&type=${data.type}`,
      method:"get",
    }
  )
}
export function reQueryCollect(data) {
  return request(
    {
      url:`/pm/device/favorite/pc?folderId=${data.folderId}&type=${data.type}&pageNum=1&pageSize=500`,
      method:"get",
    }
  )
}
