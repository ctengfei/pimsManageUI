<template>
  <span>
    <el-popconfirm
      v-if="title"
      confirm-button-text="确定"
      cancel-button-text="取消"
      icon="el-icon-info"
      icon-color="red"
      :title="`您确定要${type}【${title}】吗？`"
      @confirm="$emit('click')"
    >
      <el-button
        type="text"
        slot="reference"
        :icon="icon"
        :disabled="disabledFlag"
        class="btn"
        :v-hasPermi="promiseStr"
        >{{ type }}</el-button
      >
    </el-popconfirm>
    <el-button
      v-else
      type="text"
      class="btn"
      :icon="icon"
      :disabled="disabledFlag"
      @click="$emit('click')"
      v-hasPermi="promiseStr"
      >{{ type }}</el-button
    >
  </span>
</template>

<script>
export default {
  name: 'VTableCell',
  props: {
    // 删除提示名
    title: {
      type: [String, Number],
      default: undefined
    },
    type: {
      type: String,
      default: '删除'
    },
    disabledFlag: {
      type: Boolean,
      default: false
    },
    icon: String,
    promiseStr: null
  },
  mounted() {
    // console.log('xxxxxxx',this.disabledFlag)
  }
}
</script>
<style lang="less" scoped>
.btn {
  margin: 0 2px;
  font-size: 14px;
  padding: 4px 2px;
  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
  }
}
</style>
