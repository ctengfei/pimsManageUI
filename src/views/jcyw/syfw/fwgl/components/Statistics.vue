<template>
  <div class="statusMain">
    <div class="tupian">
      <img src="@/assets/images/tongjitubiao/fangwuzongshu.svg"
           alt=""
           style="height: 100%;">
    </div>
    <div class="wenzi">
      <div class="mb-10px name">房屋总数</div>
      <div class="mb-10px shuzi">{{num}}</div>
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
        this.num = val.totalNum
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
</style>