<template>
  <div style="height: 145px; width: 100%">
    <el-carousel
      class="lunbo"
      style="height: 100%; width: 100%"
      :autoplay="false"
      indicator-position="none"
    >
      <el-carousel-item v-for="(item, index) in fwzpUrl" :key="index">
        <!-- <img style="width: 100%; height: 100%" :src="item" /> -->
        <el-image
          style="width: 100%; height: 100%"
          :src="item"
          :preview-src-list="fwzpUrl"
        >
        </el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
  <script>
export default {
  props: {
    fwzpUrl: {
      type: Array,
      default: []
    }
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {
    // console.log(this.fwzpUrl)
  }
}
</script>
  <style lang="less" scoped>
.lunbo ::v-deep .el-carousel__container {
  height: 100%;
}
</style>