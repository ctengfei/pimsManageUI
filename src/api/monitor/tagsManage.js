import request from '@/utils/request'

export function reAddTag(url, method, data) {
  return request(
    {
      url,
      method,
      data
    }
  )
}

export function reDeleteTag(url, method, id) {
  return request(
    {
      url: `${url}/${id}`,
      method
    }
  )
}

export function reQueryTags(url, method) {
  return request(
    {
      url,
      method
    }
  )
}

export function reSearchTag(url, method, data) {
  return request(
    {
      url: `${url}/${data}`,
      method
    }
  )
}

export function reUpdateTag(url, method, data) {
  return request(
    {
      url,
      method,
      data
    }
  )
}

export function updateTags(url, method, data) {
  return request({
    url,
    method,
    data
  })
}

export function getTagsbyNodeId(url, method, data) {
  return request({
    url: `${url}/${data}`,
    method
  })
}
