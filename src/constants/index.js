const baseUrl = process.env.VUE_APP_BASE_API
const BASE_URL = baseUrl + "/file/pm/fastdfs/download/file?filePath="
const BASE_URL_FILE = baseUrl + "/file/pm/fastdfs/upload/file"
export default {
    BASE_URL,
    BASE_URL_FILE
}
