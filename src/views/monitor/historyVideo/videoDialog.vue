<template>
  <div>
    <comFloatDialog
      ref="dialog"
      :dialogVisible="true"
      @closeDialog="closeDialog"
      @click-header="focusMe"
    >
      <div ref="localVideo" class="localVideo">
        <div :ref="mainId" class="videocon" @mousedown="mousedown">

        </div>
      </div>
    </comFloatDialog>
  </div>
</template>

<script>
import comFloatDialog from "@/components/comFloatDialog"
import { getOffsetTop, getOffsetLeft, insertedMousewheel } from "@/utils/dom"
import { parsePxToNum } from '@/utils/dom'
export default {
  components: {
    comFloatDialog
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    index: {
      type: Number,
      default() {
        return -1
      },
    },
    playerUrl: {
      type: String,
      default() {
        return ""
      },
    },
    mainId:{
      type:Number|String,
      default(){
        return ''
      }
    }
  },
  data() {
    return {
      selectElement: null,
    }
  },
  mounted() {
    this.zoomScroll()

    // 算出选框相对于video的比例
    let rectInfo = this.item.rectInfo
    let w_dynameter = (rectInfo.windowLength / rectInfo.lengthX).toFixed(2)
    let h_dynameter = (rectInfo.windowWidth / rectInfo.lengthY).toFixed(2)
    let localVideo = this.$el.querySelector(".localVideo")
    let videocon = this.$refs[this.mainId]
    let _localVideoW = localVideo.offsetWidth
    let _localVideoH = localVideo.offsetHeight
    let left = -(rectInfo.midPointX - rectInfo.lengthX / 2) * (w_dynameter / (rectInfo.windowLength / _localVideoW)) + "px"
    let top = -(rectInfo.midPointY - rectInfo.lengthY / 2) * (w_dynameter / (rectInfo.windowLength / _localVideoW)) + "px"

    if(-(rectInfo.midPointY - rectInfo.lengthY / 2) * (w_dynameter / (rectInfo.windowLength / _localVideoW)) > 0){
      top = 0
    }
    if(-(rectInfo.midPointX - rectInfo.lengthX / 2) * (w_dynameter / (rectInfo.windowLength / _localVideoW)) > 0){
      left = 0
    }

    this.setPosition(
      left,
      top,
      _localVideoW * w_dynameter + "px",
      _localVideoH * h_dynameter + "px"
    )
  },
  methods: {
    callBack(e) {

    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    setPosition(left, top, width, height) {
      let videocon = this.$refs[this.mainId]
      videocon.setAttribute(
        "style",
        `width:${width};height:${height};top:${top};left:${left};`
      )
    },
    zoomScroll() {
      let dom = this.$el.querySelector(".localVideo")
      insertedMousewheel(dom, (e) => {
        e = e || window.event
        let type = ''
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
              type = 'IN'
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
              type = 'OUT'
            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail> 0) { //当滑轮向下滚动时
              type = 'OUT'
            }
            if (e.detail< 0) { //当滑轮向上滚动时
              type = 'IN'
            }
        }
        this.scrollHandle(type,e)
      })
    },
    // 滚轮缩小放大
    scrollHandle(type,e){
      let videocon = this.$refs[this.mainId]
      let parent = this.$refs.localVideo
      let left = 0
      let top = 0
      let width = videocon.clientWidth
      let height = videocon.clientHeight
      let x = getOffsetLeft(parent)
      let y = getOffsetTop(parent)
      let ratioL = (e.clientX - x + Math.abs(parsePxToNum(videocon.style.left))) / width
      let ratioT = (e.clientY - y + Math.abs(parsePxToNum(videocon.style.top))) / height
      let ratioDelta = 'IN' === type ? 1 + 0.1 : 1 - 0.1
      width = parseFloat(width * ratioDelta)
      height = parseFloat(height * ratioDelta)
      left = Math.round(e.clientX - x - (width * ratioL))
      top = Math.round(e.clientY - y - (height * ratioT))
      if(width < 1000 || height < 560 || top > 0 || left > 0 ){
        videocon.setAttribute('style',`width:${1000}px;height:${560}px;top:${0}px;left:${0}px;`)
      }else{
        videocon.setAttribute('style',`width:${width}px;height:${height}px;top:${top}px;left:${left}px;`)
      }
    },
    mousedown(event) {
      let that = this
      this.selectElement = this.$refs[this.mainId]
      let parent = this.$refs.localVideo
      this.selectElement.style.cursor = "move"
      this.isDowm = true
      let distanceX = event.clientX - parseInt(this.selectElement.style.left)
      let distanceY = event.clientY - parseInt(this.selectElement.style.top)
      document.onmousemove = function (ev) {
        let oevent = ev || event
        let top = oevent.clientY - distanceY
        let left = oevent.clientX - distanceX
        // that.selectElement.style.top = top + "px"
        // that.selectElement.style.left = left + "px"

        // 此处所有的if逻辑均为视频框的移动边界限制，均为顶边 --luws 2021/3/23
        if(top > 0){
          top = 0
        }
        // if(top < ~ (that.selectElement.offsetHeight - parent.offsetHeight)){
        //   top = ~ (that.selectElement.offsetHeight - parent.offsetHeight)
        // }
        if(left > 0){
          left = 0
        }
        // if(left < ~ (that.selectElement.offsetWidth - parent.offsetWidth)){
        //   left = ~ (that.selectElement.offsetWidth - parent.offsetWidth)
        // }
        that.selectElement.style.top = top + 'px'
        that.selectElement.style.left = left + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        that.selectElement.style.cursor = "default"
      }
    },
    focusMe() {
      this.$emit("handle-focus-video")
    },
  }
}
</script>

<style lang="scss" scoped>
.localVideo {
  width: 1000px;
  height: 560px;
  overflow: hidden;
  position: relative;

  .videocon {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
