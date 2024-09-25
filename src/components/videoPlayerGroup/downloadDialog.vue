<template>
  <el-dialog
    :visible.sync="$parent.downloadVisible"
    width="440px"
    top="10vh"
    :title="$t('public.prompt')"
   
    :modal="false"
    @open="dialogOpen"
    @closed="dialogClosed"
    id="segmentDialog"
  >
    <div class="wcp__content">
      插件未安装或者未启动, 是否下载？
    </div>
    

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDataSave">{{
        $t("public.download")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  mounted() {},
  methods: {
    dialogOpen() {
    },
    dialogClosed() {},
    handleDataSave() {
      this.$emit("confirm", this.form);
      this.$parent.downloadVisible = false;
    },
    handleDialogClose() {
      this.$emit("cancel");
      this.$parent.downloadVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
#segmentDialog {
  .wcp__content {
    margin-bottom: 20px;
  }
  .wcp__picture {
    width: 100%;
    padding-left: 20px;
    height: 32px;
    display: flex;
    align-items: center;
  }
  /deep/.el-dialog__header {
    text-align: left;
    font-weight: bold;
  }
  /deep/.el-dialog__footer {
    text-align: center;
  }
  /deep/.el-button {
    width: 80px;
    height: 36px;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #bfbfbf;
  }
  /deep/.el-button + .el-button {
    margin-left: 40px;
  }
}
</style>