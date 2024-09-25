
/* 获取dom元素的绝对top坐标,
     所需参数1、'el'----> 需要获取坐标的dom元素
     返回值 dom元素的绝对top坐标，类型Number
      ---luws 2021/1/18
  */
const getOffsetTop = function (el) {
  return el.offsetParent
    ? el.offsetTop + getOffsetTop(el.offsetParent)
    : el.offsetTop
}
/* 获取dom元素的绝对left坐标,
     所需参数1、'el'----> 需要获取坐标的dom元素
     返回值 dom元素的绝对left坐标，类型Number
     ---luws 2021/1/18
  */
const getOffsetLeft = function (el) {
  return el.offsetParent
    ? el.offsetLeft + getOffsetLeft(el.offsetParent)
    : el.offsetLeft
}
import html2canvas from 'html2canvas'
/* dom元素截图功能，将传入的dom元素做成截图并提供下载
    所需参数
    1、'el'----> 需要截图的dom元素
    2、'num'---> 连拍功能命名使用
    无返回值
    ---luws 2021/1/22
  */

const printScreen = function (el, num,rectInfo) {
  let video = null
  if (el.tagName === 'VIDEO') {
    video = el
  } else {
    video = el.getElementsByTagName('video')[0]
  }
  if (!video) {
    return
  }
  video.useCORS = true// 解决跨域
  video.crossOrigin = 'Anonymous'
  const scale = 1
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth * scale
  canvas.height = video.videoHeight * scale
  const ctx = canvas.getContext('2d')
  if(rectInfo){
    let sx = rectInfo.sx
    let sy = rectInfo.sy
    let sWidth = rectInfo.sWidth
    let sHeight = rectInfo.sHeight
    let width = rectInfo.width
    let height = rectInfo.height
    canvas.width = sWidth
    canvas.height = sHeight
    console.log(rectInfo)
    ctx.drawImage(video,0,0,width,height, sx, sy, width, height)
  }else{
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }
  const images = canvas.toDataURL('image/png')
  downloadImage(images, num)
}
/* 尺寸px字符串转换成float类型
     所需参数1、'pxStr'----> 需要截图的dom元素
            
     无返回值
     ---luws 2021/3/18
  */
const parsePxToNum =function(pxStr){
  return parseFloat(pxStr.split('px')[0])
}
//
/* dom元素截图连拍功能，将传入的dom元素做成截图并提供下载
     所需参数1、'el'----> 需要截图的dom元素
            2、连拍总数
            3、间隔毫秒值
     无返回值
     ---luws 2021/1/22
  */
const intervalPrintScreen = function (el, num, timer = 0) {
  let temp = 1
  const inter = setInterval(() => {
    temp++
    if (temp > num) {
      window.clearInterval(inter)
    }
    printScreen(el, temp - 1)
  }, timer)
}
// 图片下载功能
const downloadImage = function (url, num = '') {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'vid')
  // const date = new Date().getTime()
  a.setAttribute('download', new Date().getTime() + '-' + num + '.png')
  const canSupportDownload = 'download' in a
  // 防止反复添加
  if (document.getElementById('vid')) {
    document.body.removeChild(document.getElementById('vid'))
  }
  if (canSupportDownload) {
    document.body.appendChild(a)
    a.click()
  } else {
    alert('不支持下载')
    window.open(url)
  }
}
const insertedMousewheel = function (dom,scrollFunc) {
  console.log('事件绑定');
  /*IE、Opera注册事件*/
  if (dom.attachEvent) {
    dom.attachEvent('onmousewheel', scrollFunc);

  }
  //Firefox使用addEventListener添加滚轮事件  
  if (dom.addEventListener) {//firefox  
    dom.addEventListener('DOMMouseScroll', scrollFunc, false);
  }
  //Safari与Chrome属于同一类型
  dom.onmousewheel = scrollFunc;
  /*
 event.wheelDelta 滚动方向
 上：120
 下：-120
 Firefox：event.detail 滚动方向
 上：-3
 下:3
 */
}
export {
  getOffsetTop,
  getOffsetLeft,
  printScreen,
  intervalPrintScreen,
  downloadImage,
  insertedMousewheel,
  parsePxToNum
}
