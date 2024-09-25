<template>
  <div id="thumbnail">
    <!-- 缩略图 -->
    <ul v-if="tableData && tableData.length">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"><p>全选</p></el-checkbox>
      <el-checkbox-group v-model="mychecked" @change="CheckedChange">

        <li v-for="li in tableData" :key="li.id">
            <img slot="reference" @click="imgZoom(li)" :src="li.pictureUrl" :alt="li.pictureUrl">
          <div style="color: #ffffff;font-size: 14px;"><el-checkbox class="checkbox" :label="li" />{{ li.pictureID }}</div>
          <div style="color: #206aff;font-size: 12px;">{{ li.snapTime }}</div>
        </li>
      </el-checkbox-group>
    </ul>
    <div v-else style="margin:0 auto;width:100px;color: #909399;line-height: 120px;">暂无数据</div>
     <el-dialog
      v-loading="imgloading"
      :visible.sync="imgShow"
      width="50%"
      lock-scroll
      :show-close="true"
      element-loading-text="拼命加载中····"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(128, 128, 128, 0.4)"
      center
      class="bigPhototh"
      >
      <div class="img-areath">
        <img  :src="imgSrc" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBigPhoto,
} from "@/api/imageMange/snapPhotoWall";
import { getObjByKey } from "@/utils/voice.js";
export default {
  props: {
    mytableData: {
      type: Array,
      default() {
        return []
      }
    },
    checkedNull: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      checkAll:false,
      isIndeterminate: true,
      allChecked:[],
      mychecked: [],
      pageTotal: 0,
      tableData: [],
      imgloading:false,
      imgShow :false,
      imgSrc:"",
      permission: {
        // look:"videoMange::snapPhotoWall:look",
      },
    }
  },
  watch: {
    // 监听父级传过来的数据并赋值
    mytableData(data) {
      this.tableData = data
      this.checkAll=false
    },
    // 赋值为空
    checkedNull(arr) {
      this.mychecked = arr
    }
  },
  mounted() {
    this.tableData = this.$props.mytableData
  },
  methods: {
    imgZoom(data){
      this.imgSrc = "";
      // this.imgloading = true;
      this.imgShow = true;
      this.imgSrc = data.pictureUrl;
      // let obj =  getObjByKey(this.permission.look)
      // let tempObj = JSON.parse(JSON.stringify(obj))
      // tempObj.filePath = data.filePath;
      // getBigPhoto(tempObj).then((res) => {
      //   const url = window.URL.createObjectURL(new Blob([res]));
      //   this.imgSrc = url;
      //   this.imgloading = false;
      // });
    },
    handleCheckAllChange(){
      console.log(this.checkAll)
      if(this.checkAll) {
        this.allChecked = this.tableData
        this.mychecked = this.allChecked
        this.$emit('thumbnailChecked', this.mychecked)
        this.$emit('thumbnailData', this.tableData)
      }else{
        this.allChecked = []
        this.mychecked = []
        this.$emit('thumbnailChecked', this.mychecked)
      }
    },
    // 点击多选框，并赋值穿给父元素
    CheckedChange(v) {
      this.mychecked = v
      console.log(this.mychecked ,this.tableData);
      if(this.mychecked.length == this.tableData.length) {
        this.checkAll = true
      }else{
        this.checkAll = false
      }
      this.$emit('thumbnailChecked', this.mychecked)
      this.$emit('thumbnailData', this.tableData)
    }
  }
}
</script>
<style lang="scss" scoped>
#thumbnail {
  p{
    color: #206aff;
  }
  width: 100%;

  padding: 0;
  ul {
    width: 100%;
    padding: 0;
    height: 680px;
    overflow: auto;
    ::v-deep .el-checkbox-group {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    li {
      list-style: none;
      width: 18.5%;
      height: 188px;
      // border: 1px solid ghostwhite;
      margin: 0 10px 5px 0;
      position: relative;
      img {
        width: 100%;
        height: 130px;
      }
      div:nth-of-type(1) {
        color: gray;
        font-size: 12px;
        margin: 8px 0;
      }
      div:nth-of-type(2) {
        color: gray;
        font-size: 10px;
      }
      .checkbox {
        margin-right:10px;
        ::v-deep .el-checkbox__inner {
          border: 1px solid slategrey;
        }
      }
      ::v-deep .el-checkbox__label {
        display: none;
      }
    }
  }
  .bigPhototh {
      img {
        width: 100%;
        vertical-align: bottom;
      }
      ::v-deep .el-dialog__body {
        padding: 0;
      }
      ::v-deep .el-dialog__header{
        padding-bottom: 0px !important;
      }
      ::v-deep .el-dialog__header .el-dialog__headerbtn {
        top: 10px !important;
      }
    }
  .img-areath {
    width: 100%;
    height: 100%;
    overflow: auto;
    margin-top: 16px;
    img {
      width: 100%;
    }
  }
}
</style>
