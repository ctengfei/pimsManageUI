<!--
 * @version:
 * @Author: zhoujian
 * @Explain: 上传图片公共组件（车辆管理模块示例）
 * @Date: 2021-05-13 09:45:00
 * @LastEditTime: 2021-06-04 10:38
 * @LastEditors: zhoujian
-->
<template>
  <div>
    <el-upload
      ref="upload"
      action="#"
      :limit="1"
      :file-list="fileList"
      :on-change="onChange"
      :on-remove="onRemove"
      list-type="picture-card"
      :auto-upload="false"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">
        {{imgMessage}}
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    putJpeg: {
      type: String,
      default: ''
    },
    imgMessage: {
      type: String,
      default: () => {
        return '上传图片只能是 jpg/png格式!'
      }
    }
  },
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    putJpeg(d) {
        if(d){
            this.fileList = [{url:d}]
            document.querySelector('.el-upload--picture-card').style.display='none'
        }else{
            this.fileList = []
            document.querySelector('.el-upload--picture-card').style.display='block'
        }
    }
  },
  mounted() {
      if(this.putJpeg) {
        this.fileList = [{url:this.putJpeg}]
        document.querySelector('.el-upload--picture-card').style.display='none'
      }else{
        this.fileList = []
      }
  },
  methods: {
    onChange(file, fileList) {
      const isJPG =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";
      const isLt5M = file.raw.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error(this.imgMessage);
        this.fileList = [];
        return false;
      }
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        this.fileList = [];
        return false;
      }
      if(file){
        document.querySelector('.el-upload--picture-card').style.display='none'
      }
      this.$emit("photoUrl", file.raw);
      return isJPG && isLt5M;
    },
    onRemove(){
      this.$emit("photoUrl", 0);
      document.querySelector('.el-upload--picture-card').style.display='block'
    }
  },
};
</script>

<style lang="scss" scoped>
 ::v-deep .el-upload--picture-card{
   border: 1px solid #206aff;
   width: 145px;
   height: 145px;
   color: #8c939d;
  //  background: #294e80;
   font-size: 28px;
   display: flex;
   align-items: center;
   justify-content: center;
 }
 ::v-deep .el-upload-list__item {
  transition: none !important;
}
</style>