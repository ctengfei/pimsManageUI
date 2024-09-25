<template>
  <div class="descriptions">
    <div v-if="Boolean(title)" class="descriptions-title">{{ title }}</div>
    <div class="descriptions-view">
      <el-row class="descriptions-row">
        <slot v-if="$slots.default" />
        <div v-else style="text-align: center; color: grey;">暂无数据</div>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElDescription',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
  .descriptions{
    .descriptions-title{
      margin-bottom: 20px;
      font-weight: normal;
      font-size: 16px;
      line-height: 21px;
    }
    .descriptions-view{
      width: 100%;
      overflow: hidden;
      table{
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
      }
    }

  }

</style>