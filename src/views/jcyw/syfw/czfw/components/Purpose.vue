<template>
  <div class="main">
    <div class="main_box mb-5px">
      <!-- 单人租住 -->
      <div class="box mr-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/drzz.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">单人租住</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{drzz || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
      <!-- 家庭租住 -->
      <div class="box ml-5px mr-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/jtzz.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">家庭租住</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{jtzz || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
      <!-- 二人合租 -->
      <div class="box ml-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/erhz.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">二人合租</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{erhz || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main_box mt-5px">
      <!-- 多人合租 -->
      <div class="box mr-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/drhz.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">多人合租</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{drhz || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
      <!-- 其他租住 -->
      <div class="box ml-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/qtzz.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">其他租住</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{qtzz || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drzz: 0,
      jtzz: 0,
      erhz: 0,
      drhz: 0,
      qtzz: 0
    }
  },
  props: ['optionList'],
  watch: {
    optionList (val) {
      this.$nextTick(() => {
        val.czqkList.forEach(item => {
          if (item.value == '1') {
            this.jtzz = item.num
          } else if (item.value == '2') {
            this.drzz = item.num
          } else if (item.value == '3') {
            this.erhz = item.num
          } else if (item.value == '4') {
            this.drhz = item.num
          } else if (item.value == '9') {
            this.qtzz = item.num
          }
        });
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  .main_box {
    width: 100%;
    height: 100%;
    display: flex;
    .box {
      width: 100%;
      height: 100%;
      background: white;
      display: flex;
      align-items: center;
      .box_img {
        width: 50%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>