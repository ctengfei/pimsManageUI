<template>
  <div @click="imgUpload" style="height: 100%; width: 100%">
    <el-carousel
      class="lunbo"
      style="height: 100%; width: 100%"
      v-if="carouselList.length"
      :autoplay="false"
      indicator-position="none"
    >
      <el-carousel-item v-for="(item, index) in carouselList" :key="index">
        <img style="width: 100%; height: 100%" :src="item.url" />
      </el-carousel-item>
    </el-carousel>
    <img
      style="height: 100%; width: 100%"
      v-else
      src="@/assets/images/tuli/ythcj.png"
    />
    <el-dialog
      :visible.sync="show"
      append-to-body
      width="30%"
      @close="beforeClose"
    >
      <el-row>
        <el-upload
          ref="upload"
          :headers="uploadHeaders"
          :limit="3"
          :on-change="handlePicChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :action="uploadUrl"
          :http-request="customUpload"
          list-type="picture-card"
          :auto-upload="false"
          accept=".gif,.jpg,.jpeg,.png"
          :before-upload="beforeAvatarUpload"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div
            slot="file"
            slot-scope="{ file }"
            style="width: 100%; height: 100%"
          >
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
              style="width: 100%; height: 100%"
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file, fileList)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="customUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import {
  addFile,
  upload,
  uploads,
  getInfoByRelationId,
  removeFile,
  editFile,
  updateFile
} from '@/api/sjzx/sjsb'
export default {
  props: {
    floorId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      show: false,
      qianmian: process.env.VUE_APP_BASE_FILE_VIEW,
      uploadUrl: '',
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      fileList: [],
      uploadfileList: [],
      carouselList: []
      // removeIds: []
    }
  },
  methods: {
    getDialogImgList() {
      if (this.carouselList.length > 0) {
        for (let i = 0; i < this.carouselList.length; i++) {
          this.fileList.push({
            url: this.carouselList[i].url,
            id: this.carouselList[i].id
          })
        }
      }
      // console.log(this.fileList)
    },
    getInfoById() {
      this.carouselList = []
      getInfoByRelationId({ relationId: this.floorId }).then((res) => {
        if (res.data && res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            let id = res.data[i].id
            let urllist = res.data[i].url.split(',')
            for (let j = 0; j < urllist.length; j++) {
              let obj = { url: this.qianmian + urllist[j], id: id }
              this.carouselList.push(obj)
            }
          }
          // console.log(this.carouselList)
        }
        // if (this.carouselList.length > 0) {
        //   this.getDialogImgList()
        // }
      })
    },
    // noRepeat(arr) {
    //   let newArr = [...new Set(arr)] //利用了Set结构不能接收重复数据的特点
    //   return newArr
    // },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].uid == file.uid) {
          // this.removeIds.push(this.fileList[i].id)
          this.fileList.splice(i, 1)
        }
      }
      // this.removeIds = this.noRepeat(this.removeIds)
    },
    async customUpload() {
      // let a = {}
      // let arr = []
      // for (let i = 0; i < this.fileList.length; i++) {
      //   let c = this.fileList[i]
      //   if (!a[c.id]) {
      //     arr.push({ id: c.id, url: c.url })
      //     a[c.id] = c
      //   } else {
      //     for (let j = 0; j < arr.length; j++) {
      //       let d = arr[j]
      //       if (d.id == c.id) {
      //         console.log(arr[j])
      //         console.log(c)
      //       }
      //     }
      //   }
      // }
      this.uploadfileList = []
      let uploadList = []
      for (let i = 0; i < this.fileList.length; i++) {
        // 这是新选择的图片没有id,需要调用新增接口
        if (this.fileList[i].raw) {
          uploadList.push(this.fileList[i].raw)
        } else {
          // 这是有id的
          let data = this.fileList[i].url.replace(
            process.env.VUE_APP_BASE_FILE_VIEW,
            ''
          )
          this.uploadfileList.push(data)
        }
      }
      if (uploadList.length) {
        let form = new FormData()
        for (let i = 0; i < uploadList.length; i++) {
          form.append(`files`, uploadList[i])
        }
        let res = await uploads(form)
        if (res.code == 200) {
          for (let i = 0; i < res.url.length; i++) {
            this.uploadfileList.push(res.url[i])
          }
        }
      }

      // if (this.removeIds.length) {
      //   removeFile(this.removeIds).then((res) => {
      //     console.log(res)
      //   })
      // }
      if (this.uploadfileList.length) {
        let bodyParams = {
          relationId: this.floorId,
          url: this.uploadfileList.toString()
        }
        updateFile(bodyParams).then((res) => {
          if (res.code == 200) {
            this.getInfoById()
            this.show = false
          }
        })
      }
    },
    imgUpload() {
      this.show = true
      this.getDialogImgList()
    },
    handlePicChange(file, fileList) {
      this.fileList = fileList
    },
    handleExceed() {
      this.$message.warning(`最多上传 3 张图片`)
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      if (!isJPG) {
        this.$message.error('只能上传图片')
      }
      return isJPG
    },
    beforeClose(done) {
      this.fileList = []
    }
  },
  mounted() {
    this.$nextTick(() => {
      //this.getInfoById()
    })
  }
}
</script>
<style lang="less" scoped>
.lunbo ::v-deep .el-carousel__container {
  height: 100%;
}
</style>