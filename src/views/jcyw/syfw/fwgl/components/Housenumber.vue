<template>
  <div class="main">
    <div class="mainBox mb-10px">
      <div style="width: 50%; display: flex;justify-content: end;"
           class="box-border pr-10px">
        <img src="@/assets/images/tongjitubiao/chuzufang.svg"
             style="width: 54px; height: 59px;"
             alt="">
      </div>

      <div class="box-border pl-10px">
        <div class="text-14px text-hex-505D69 box-border pb-3px">出租房屋</div>
        <div>
          <span class="font-bold text-28px text-hex-3E8FFF">{{czfwNum || 0}}</span>
          <span class="text-14px text-hex-505D69">户</span>
        </div>
      </div>
    </div>
    <div class="mainBox">
      <div style="width: 50%; display: flex;justify-content: end;"
           class="box-border pr-10px">
        <img src="@/assets/images/tongjitubiao/kongzhifang.svg"
             style="width: 54px; height: 59px;"
             alt="">
      </div>
      <div class="box-border pl-10px">
        <div class="text-14px text-hex-505D69 box-border pb-3px">空置房屋</div>
        <div>
          <span class="font-bold text-28px text-hex-3E8FFF">{{kzfwNum || 0}}</span>
          <span class="text-14px text-hex-505D69">户</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      czfwNum: 0,
      kzfwNum: 0
    }
  },
  props: ['optionList'],
  watch: {
    optionList (val) {
      this.$nextTick(() => {
        this.czfwNum = val.czfwNum
        this.kzfwNum = val.kzfwNum
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.mainBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  // justify-content: center;
  // text-align: center;
  background: white;
}
</style>