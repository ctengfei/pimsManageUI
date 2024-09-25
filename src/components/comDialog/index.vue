<!--
 * @version:                
 * @Author: xlshaod
 * @explain: 巡航弹窗组件
 * @Date: 2021-01-21 18:10:23 
 * @LastEditTime: 2021-07-13 17:12:51
 * @LastEditors: sscaij
-->
<template>
<div class="com-dialog">
  <el-dialog
    :title="dialogTitle"
    top="17vh"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    append-to-body
    destroy-on-close
    @closed="handleClosed"
  >
    <slot />
  </el-dialog>
</div>
  
</template>
<script>
export default {
  components: {
  },
  props: {
    dialogTitle: String,
    dialogWidth: String,
    beforeClose: Function
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleClosed() {
      this.$emit('handleDialogClosed')
    }
  }
}
</script>
<style scoped>
.com-dialog  .el-dialog__wrapper .el-dialog {
  margin:0;
}
::v-deep .com-dialog .el-dialog__wrapper{
  position: absolute !important;
}
::v-deep .com-dialog .v-modal{
  position: absolute !important;
}
</style>
