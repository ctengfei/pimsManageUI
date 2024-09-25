import request from '@/utils/request'
import { getToken } from '@/utils/auth'
//视频下载
export function getdownloadRange(data,i) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(data.method, process.env.VUE_APP_BASE_API+`${data.url}?filePath=${data.myFilePath}`, true);
    req.setRequestHeader('Access-Control-Allow-Origin','*');
    req.setRequestHeader('Content-Range', `bytes ${data.start}-${data.end}/${data.size}`)
    req.setRequestHeader('Authorization', getToken())
    req.responseType = "blob";
    req.onload = function (oEvent) {
        req.response.arrayBuffer().then(res => {
            resolve({
                i,
                buffer: res
            });
        })
    };
    req.send();
  });
}
//获取文件大小
export function getFileSize(data) {
  return request({
    url: data.url +"?filePath="+data.fileurl,
    method: data.method
  })
}

export function getRecordVideo(obj) {
  return request({
    url: obj.url,
    method: obj.method
  })
}

// 点击左侧tree是某一个设备得录像接口
export function getDeviceVideo(data) {
  return request({
    url: `${data.url}?blurry=${data.deviceId}&blurryType=DEVICE_ID&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: data.method
  })
}
// 新增书签的接口
export function postRecordTag(Bookmarks) {
  return request({
    url: '/vm/recordTag',
    method: 'post',
    data: Bookmarks
  })
}
// 书签的修改
export function putRecordTag(data) {
  return request({
    url: `/vm/recordTag`,
    method: 'put',
    data: data
  })
}
// 书签的查询接口
export function bookmarkQuery(obj) {
  return request({
    url: `/vm/recordTag/retrieve?blurry=${obj.blurry}&blurryType=DESCPTION&recordId=${obj.id}`,
    method: 'get',
  })
}
// 根据书签id删除
export function deleteRecordTag(id) {
  return request({
    url: `/vm/recordTag/${id}`,
    method: 'delete'
  })
}
// 根据录像id查询书签
export function inquireID(obj) {
  return request({
    url: `/vm/recordTag/description?recordId=${obj.recordId}&description=${obj.description}`,
    method: 'GET',
    data: obj
  })
}
// 录像模糊查询
export function getFuzzyList(data) {
  return request({
    url: `${data.url}?cameraCode=${data.cameraCode}&domainCode=${data.domainCode}&endDate=${data.endTime}&startDate=${data.startTime}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: data.method
  })
}

// 分页
export function getChangeList(data) {
  return request({
    url: data.url+'?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
    method: data.method
  })
}

// 删除录像的接口
export function deleteVideoList(data) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  return request({
    url: data.url,
    method: 'delete'
  })
}

// 批量删除
export function deleteSnapVideoAll(data) {
  return request({
    url:  data.url,
    method: 'delete',
    data: data.checked
  })
}

// 下载录像的接口
export function downloadMP4(url,method,data) {
  // /vm/recordVideo/downloadFile
  return request({
    url: `${url}?filePath=${data.filePath}`,
    method: method,
    responseType: 'blob'
  })
}
// 录像检索接口
export function videoRetrieval(data) {
  return request({
    url: `${data.url}?blurry=${data.id}&blurryType=TYPE`,
    method: data.method,
  })
}
// 播放录像的接口
export function playRecordVideo(filePath) {
  return   process.env.VUE_APP_FST_API + filePath
}
// 开启手动录像的接口
export function startRecord(url,method,data) {
  // `/vm/recordVideo/startRecord`
  return request({
    url: `${url}`,
    method: method,
    data,
  })
}
// 停止手动录像接口
export function stopRecord(url,method,data) {
  // `/vm/recordVideo/stopRecord`
  return request({
    url: `${url}?cameraCode=${data.cameraCode}&domainCode=${data.domainCode}&uuid=${data.uuid }`,
    method: method
  })
}
// export function hasUuid(data) {
//   return request({
//     url: `/vm/recordVideo/hasUuid`,
//     method: 'post',
//     data: data
//   })
// }
// 树节点点击接口
export function treeClick(url,method,data) {
  // /vm/recordVideo
  return request({
    url: `${url}?favoriteId=${data.favoriteId}&nodeId=${data.nodeId}&pageSize=${data.pageSize}&pageNum=${data.pageNum}&blurry=${data.content}&blurryType=TYPE&endTime=${data.endTime}&startTime=${data.startTime}`,
    method: method,
  })
}