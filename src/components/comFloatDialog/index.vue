<!--
 * @version:                
 * @Author: wslul
 * @explain: 弹窗组件拖动
 * @Date: 2021-01-26 18:23:23 
 * @LastEditTime: 2021-05-25 08:54
 * @LastEditors: hzdu
-->
<template>
  <el-container ref="dialog" v-if="visible">
    <el-header ref="header">
      <div @click="clickHeader" class="video-web-flex cursor-scroll" @mousedown="mousedown">
        <div class="el-dialog-title left-align">
          <span>{{title}}</span>
        </div>
        <div>
          <slot name="btn">
          </slot>
        </div>
        <div class="flex-1 right-align">
          <i class="el-icon-close cursor-pointer" @click="closeDialog"></i>
        </div>
      </div>
    </el-header>
    <el-main @mousedown="mousedown">
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'Window',
    props: {
      title: String,
      dialogVisible:{
        type:Boolean,
        default(){
          return false
        }
      },
    },
    computed: {
      visible: {
        get: function() {
          return this.dialogVisible
        },
        set: function() {} 
      }
    },
    data() {
      return {
        selectElement: ''
      }
    },
    methods: {
      closeDialog(e) {
        this.$emit('closeDialog')
      },
      mousedown(event) {
        this.selectElement = this.$refs.dialog.$el
        let div = this.selectElement
        this.selectElement.style.cursor = 'move'
        this.isDowm = true
        let distanceX = event.clientX - this.selectElement.offsetLeft
        let distanceY = event.clientY - this.selectElement.offsetTop
        document.onmousemove = (ev) => {
          let oevent = ev || event
          let headerHeight = this.$refs.header.$el.offsetHeight
          let headerWidth = this.$refs.header.$el.offsetWidth
          let top = 0
          let left = 0
          left = oevent.clientX - distanceX
          top = oevent.clientY - distanceY
          // 此处所有的if逻辑均为弹出框的移动边界限制，左右为宽度一半，下方为header高度，上方顶边 --luws 2021/3/23
          if( top < 0 ){
            top = 0
          }
          if( top > window.innerHeight - headerHeight ){
            top = window.innerHeight - headerHeight
          }
          if( left < ~ (headerWidth / 2) ){
            left = ~ (headerWidth / 2)
          }
          if( left > window.innerWidth - (headerWidth / 2) ){
            left = window.innerWidth - (headerWidth / 2)
          }
          div.style.left = left + 'px'
          div.style.top = top + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          div.style.cursor = 'default'
        }
      },
      clickHeader(){
        this.$emit('click-header')
      }
    }
  }
</script>

<style scoped>
  .el-container {
    position: fixed;
    border: 1px;
    top: calc(50% - (916px / 2) );
    left: calc(50% - (1430px / 2) );
    border-radius: 2px;
    z-index: 1002;
    border: 1px solid #3a949a;
  }
  .el-dialog-title {
    font-size: 14px;
    color: #206aff;
  }
  .el-main {
    background-color: #061a3c;
    padding:0;
  }

  .el-footer {
    background-color: #061a3c;
  }

  .el-header {
    background-color: #061a3c;
    color: #fff;
    line-height: 60px;
  }

  .el-aside {
    color: #fff;
  }

  .right-align{
    text-align: right;
  }
  .left-align{
    text-align: left;
  }
  .cursor-pointer{
    cursor: pointer;
  }
  
</style>