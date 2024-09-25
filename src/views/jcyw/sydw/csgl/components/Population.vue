<template>
  <div class="statusMain">
    <div class="tupian"
         style="display: flex; justify-content: end;">
      <img src="@/assets/images/tongjitubiao/sydw.svg"
           alt="">
    </div>
    <div class="wenzi">
      <div class="mb-10px name">{{name}}</div>
      <div class="mb-10px shuzi">{{num}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      num: 0,
      name: null,
    }
  },
  props: ['optionObj'],
  watch: {
    optionObj (val) {
      this.$nextTick(() => {
        this.num = val.num
        this.name = val.name
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
</style>