<template>
  <div
    :class="boxshow ? 'right a1' : 'left a2'"
    id="showBox"
    @mouseleave="boxshow = false && mapOptions.length > 1"
    @mouseenter="boxshow = true && mapOptions.length > 1"
  >
    <div class="img" v-for="item in mapOptions" :key="item.dictCode">
      <img
        :src="item.imgSrc"
        alt=""
        @click="checkLayer(item)"
        @mouseenter="checkBg($event, 'title in')"
        @mouseleave="checkBg($event, 'title out')"
      />
      <span class="title out">{{ item.dictLabel }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      boxshow: false,
      mapOptions: []
    }
  },
  methods: {
    checkLayer(item) {
      this.$emit('getChecking', item.dictValue)
    },
    checkBg(e, bg) {
      let dom = e.currentTarget.nextElementSibling
      dom.setAttribute('class', bg)
    },
    addImgForMapSource(data) {
      let arr = data
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].dictValue == '1') {
          arr[i].imgSrc = require('../../../assets/images/weixingtu.png')
        }
        if (arr[i].dictValue == '2') {
          arr[i].imgSrc = require('../../../assets/images/qiansetu.png')
        }
        if (arr[i].dictValue == '3') {
          arr[i].imgSrc = require('../../../assets/images/shensetu.png')
        }
        if (arr[i].dictValue == '5' || arr[i].dictValue == '6') {
          arr[i].imgSrc = require('../../../assets/images/gaodetu.png')
        }
      }
      return arr
    }
  },
  mounted() {
    let mapSource = JSON.parse(localStorage.getItem('mapSource'))
    this.mapOptions = this.addImgForMapSource(mapSource)
  }
}
</script>

<style lang="less" scoped>
.left {
  width: 80px;
  height: 80px;
  padding: 5px;
  background: #d9d7d2a3;
  justify-content: space-between;
  overflow: hidden;
}
.right {
  display: flex;
  padding: 5px;
  background: #d9d7d2a3;
  justify-content: space-between;
}
.img,
img {
  width: 70px;
  height: 70px;
}
.img {
  position: relative;
}
img:hover {
  border: 2px solid #409eff;
}
.title {
  // position: absolute;
  //right: 5px;
  bottom: 0px;
  font-size: 12px;

  font-weight: 400;
  color: #ffffff;
  line-height: 22px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.69);
  padding: 0 5px;
}
.in {
  background: #3e8fff;
}
.out {
  background: #000000;
  opacity: 0.52;
}
@keyframes out {
  0% {
    width: 300px;
  }
  50% {
    width: 200px;
  }
  100% {
    width: 100px;
  }
}
@keyframes in {
  0% {
    width: 100px;
  }
  50% {
    width: 200px;
  }
  100% {
    width: 300px;
  }
}
.a1 {
  animation: in 0.2s linear;
}
.a2 {
  animation: out 0s linear;
}
</style>
