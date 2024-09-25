import request from '@/utils/request'

const favoFolders = {
  // 新增收藏夹
  addFavoFolder(data) {
    return request(
      {
        url:"/device/devicesFavoFolder",
        method:"post",
        data: data
      }
    )
  },
  //  查询文件夹
  searchFavoFolder() {
    return request(
      {
        url:"/device/devicesFavoFolder/page?pageNum=1&pageSize=1000",
        method:"get",
      }
    )
  },
  // 消息未读
  messageRead(data) {
    return request(
      {
        url:"/message/readed",
        method:"post",
        data: data
      }
    )
  },
  
  
}

export default favoFolders
