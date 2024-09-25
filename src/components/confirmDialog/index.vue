<!--
 * @version:                
 * @Author: xlshaod
 * @explain: 巡航计划弹窗组件
 * @Date: 2021-01-21 18:10:23
 * @LastEditTime: 2021-07-13 11:37:29
 * @LastEditors: sscaij
-->
<template>
  <div class="com-dialog">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      custom-class="comDialogBox"
      :show-close="showClose"
      :destroy-on-close="true"
      :before-close="beforeClose"
    >
      <slot />
      <div slot="footer" style="text-align: right" v-if="isShowConfirm">
        <el-button
          type="primary"
          :disabled="isAbled"
          :loading="buttonLoading"
          @click="onConfirm"
          >确定</el-button
        >
        <el-button plain @click="onCancel" :disabled="isAbled">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogTitle: String,
    dialogWidth: String,
    isAbled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    isShowConfirm: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 右上角关闭按钮是否显示
    showClose: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      buttonLoading: false,
    };
  },
  methods: {
    onCancel() {
      this.dialogVisible = false;
      this.$emit("onCancel");
    },
    onConfirm() {
      this.buttonLoading = false;
      this.$emit("onConfirm");
    },
    beforeClose() {
      this.$emit("beforeClose");
      this.dialogVisible = false;
      this.buttonLoading = false;
    },
  },
};
</script>
<style scoped>
.com-dialog .el-dialog__wrapper .el-dialog {
  margin: 0 !important;
}
</style>
<style>
.comDialogBox {
  width: 30vw;
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
