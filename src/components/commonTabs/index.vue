<template>
  <div class="btnGroups" :style="{ width: getWidth }">
    <div
      class="btn"
      v-for="(item, index) in btnGroup"
      :key="index"
      :class="btnChoose == index ? 'divActive' : ''"
      @click="btnClick(item, index)"
      :style="{ width: singleWidth + 'px' }"
    >
      {{ item.label }}
    </div>
    <div class="bgc" :style="sty"></div>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    /*
     * btnGroup为文字数组
     * */
    btnGroup: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /*
     * btnChoose为默认值选项
     * */
    btnChoose: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    /*
     * singleWidth为单个按钮宽度
     * */
    singleWidth: {
      type: Number,
      default: () => {
        return 0;
      }
    }
  },
  methods: {
    btnClick(item, index) {
      // this.btnChoose = index;
      this.$emit("btnclick", { item, index });
    }
  },
  computed: {
    getWidth() {
      let Width = this.singleWidth * this.btnGroup.length + "px";
      return Width;
    },
    sty() {
      let num = Number(this.btnChoose) * 100;
      let singlewidth = this.singleWidth + "px";
      return `transform:translateX(${num}%);transition:all 0.3s;width:${singlewidth}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.btnGroups {
  cursor: pointer;
  // background-color: #313448;
  background: #f5f7fa;
  border-radius: 30px;
  height: 42px;
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  & > div {
    display: inline-block;
  }
  .btn {
    height: 42px;
    border-radius: 30px;
    line-height: 42px;
    color: #606266;
    font-size: 12px;
    transition: all 0.35s;
    z-index: 1;
  }
  .bgc {
    left: 0;
    height: 42px;
    border-radius: 30px;
    line-height: 42px;
    color: #606266;
    font-size: 12px;
    background-color: #1890ff;
    position: absolute;
    z-index: 0;
  }
  .divActive {
    color: #fff;
  }
}
</style>
