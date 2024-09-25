<template>
  <el-col :xl="4"
          :lg="6"
          :md="9">
    <el-form-item v-bind="$attrs"
                  class="jiange">
      <slot></slot>
    </el-form-item>
  </el-col>
</template>

<script>
export default {
  name: 'VTableSearchItem'
}
</script>

<style lang="less" scoped>
.jiange {
  margin-right: 20px;
}

::v-deep .el-form-item--medium .el-form-item__content {
  margin-left: 0 !important;
  display: flex !important;
}

::v-deep .el-form-item__label {
  text-align: left !important;
}
</style>
