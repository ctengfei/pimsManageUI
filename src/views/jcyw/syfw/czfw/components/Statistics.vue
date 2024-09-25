<template>
  <div class="statusMain">
    <div class="tupian">
      <img src="@/assets/images/tongjitubiao/chuzuwu1.svg"
           alt=""
           style="height: 100%;">
    </div>
    <div class="wenzi">
      <div class="mb-10px name">出租房屋</div>
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
        this.num = val.czfwNum
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
</style>