<template>
  <div class="xzstatistics">
    <div class="xztupian"
         style="display: flex; justify-content: end;">
      <img src="@/assets/images/tongjitubiao/hujirenkou.png"
           alt=""
           style="width: 80px;">
    </div>
    <div class="xzwenzi pl-46px pr-20px">
      <div class="text-14px text-hex-505D69 box-border pb-3px">境外人员</div>
      <div class="text-28px text-hex-3E8FFF box-border pt-3px">{{num}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      num: 0
    }
  },
  props: ['optionList'],
  watch: {
    optionList (val) {
      this.$nextTick(() => {
        this.num = val.totalRenShuNum
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
.xzstatistics {
  box-sizing: border-box;
  padding: 20px; //  在图标的时候  左侧间距设置为0  只设置右侧间距
  .xztupian {
    width: 140px;
    flex: 1; //在为图标时  在左侧文字设置好之后 用flex：1设置图标的宽度
    img {
      width: 100%;
    }
  }
}
</style>