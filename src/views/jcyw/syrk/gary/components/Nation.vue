<template>
  <div class="main">
    <div class="main_box mb-5px">
      <!-- 留守人员 -->
      <div class="box mr-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/lsry.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">留守人员</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{lsry || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
      <!-- 残疾人员 -->
      <div class="box ml-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/cjry.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">残疾人员</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{cjry || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main_box mt-5px">
      <!-- 孤寡老人 -->
      <div class="box mr-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/gglr.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">孤寡老人</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{gglr || 0}}</span>
            <span class="text-14px text-hex-505D69">户</span>
          </div>
        </div>
      </div>
      <!-- 低保人员 -->
      <div class="box ml-5px">
        <div class="box_img box-border pr-10px">
          <img src="@/assets/images/tongjitubiao/dbry.svg"
               style="width: 54px; height: 59px;"
               alt="">
        </div>
        <div class="box-border pl-10px">
          <div class="text-14px text-hex-505D69 box-border pb-3px">低保人员</div>
          <div>
            <span class="font-bold text-28px text-hex-3E8FFF">{{dbry || 0}}</span>
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
      lsry: 0,
      cjry: 0,
      gglr: 0,
      dbry: 0
    }
  },
  props: ['renyuanList'],
  watch: {
    renyuanList (val) {
      this.$nextTick(() => {
        val.forEach(item => {
          if (item.value == '01') {
            this.gglr = item.num
          } else if (item.value == '02') {
            this.lsry = item.num
          } else if (item.value == '03') {
            this.dbry = item.num
          } else if (item.value == '04') {
            this.cjry = item.num
          }
        })
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
        -moz-justify-content: flex-end;
        -ms-ustify-content: flex-end;
        -webkit-justify-content: flex-end;
        justify-content: flex-end;
      }
    }
  }
}
</style>
