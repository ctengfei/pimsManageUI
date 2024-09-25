<template>
  <div class="main">
    <div class="main_box mb-5px">
      <!-- 刑满释放人员 -->
      <div class="box mr-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/xmsfry.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">刑满释放人员</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{xmsfry || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
      <!-- 社区矫正人员 -->
      <div class="box ml-5px mr-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/sqjzry.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">社区矫正人员</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{sqjzry || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
      <!-- 精神障碍患者 -->
      <div class="box ml-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/jszahz.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">精神障碍患者</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{jszahz || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main_box mt-5px">
      <!-- 吸毒人员 -->
      <div class="box mr-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/xdry.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">吸毒人员</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{xdry || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
      <!-- 艾滋病危险人员 -->
      <div class="box ml-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/azbwxry.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">艾滋病危险人员</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{azbwxry || 0}}</span>
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
      xmsfry: 0,
      sqjzry: 0,
      jszahz: 0,
      xdry: 0,
      azbwxry: 0
    }
  },
  props: ['renyuanList'],
  watch: {
    renyuanList (val) {
      this.$nextTick(() => {
        console.log(val)
        val.forEach(item => {
          if (item.value == '01') {
            this.xmsfry = item.num
          } else if (item.value == '02') {
            this.sqjzry = item.num
          } else if (item.value == '03') {
            this.jszahz = item.num
          } else if (item.value == '04') {
            this.xdry = item.num
          } else if (item.value == '05') {
            this.azbwxry = item.num
          }
        });
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
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