<template>
  <el-dialog :title="isEdit ? '编辑流动人口' : '添加流动人口'"
             :visible.sync="value"
             direction="rtl"
             size="40%"
             width="600px"
             ref="drawer"
             @opened="drawerOpen"
             @close="beforeClose">
    <el-steps :active="stepActive"
              align-center>
      <el-step title="基本信息"
               icon="el-icon-edit"></el-step>
      <el-step title="流口信息"
               icon="el-icon-user-solid"></el-step>
    </el-steps>
    <div class="drawerForm-container"
         v-show="step == 1">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号"
                          prop="sfzhm">
              <el-input :readonly="isEdit"
                        v-model="form.sfzhm"
                        placeholder="请输入身份证号">
                <i v-if="!isEdit"
                   slot="suffix"
                   @click="autoComplete"
                   class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名"
                          prop="xm">
              <el-input v-model="form.xm"
                        placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="曾用名"
                          prop="zym">
              <el-input v-model="form.zym"
                        placeholder="请输入曾用名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.xb"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.sys_user_sex"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期"
                          prop="csrq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.csrq"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择出生日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族">
              <el-select v-model="form.mz"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_mz"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  style="clear: both">
            <el-form-item label="籍贯"
                          prop="jg">
              <!-- <el-input v-model="form.jg" placeholder="请输入籍贯" /> -->
              <el-cascader v-model="form.jg"
                           :options="options"
                           :props="areaProps"
                           clearable
                           style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻状况">
              <el-select v-model="form.hyzk"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_hyzk"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌">
              <el-select v-model="form.zzmm"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_zzmm"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文化程度">
              <el-select v-model="form.xl"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_xldm"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宗教信仰">
              <el-select v-model="form.zjxy"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.ga_zjxy"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业类别">
              <el-cascader v-model="form.zylb"
                           :options="zylboptions"
                           :props="zylbareaProps"
                           clearable
                           style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式"
                          prop="lxfs">
              <el-input v-model="form.lxfs"
                        placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业信息"
                          prop="zyxx">
              <el-input v-model="form.zyxx"
                        placeholder="请输入职业信息" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="流入原因">
              <el-select v-model="form.lryy"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.ga_ldyy"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  style="clear: both">
            <el-form-item label="户籍区划"
                          prop="hjqh">
              <el-cascader v-model="form.hjqh"
                           :options="options"
                           :props="areaProps"
                           clearable
                           style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户籍地址"
                          prop="hjxz">
              <el-select @change="hjxzChange()"
                         :popper-class="'selectClass'"
                         filterable
                         remote
                         allow-create
                         :remote-method="remoteMethod"
                         :popper-append-to-body="false"
                         default-first-option
                         v-model="form.hjxz"
                         placeholder="请选择">
                <el-option v-for="item in fwList"
                           :key="item.id"
                           :label="item.fwdzxz"
                           :value="item.fwdzid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="居住地址"
                          prop="xzdxz">
              <el-select @change="xzdxzChange()"
                         filterable
                         remote
                         :remote-method="remoteMethod"
                         v-model="form.xzdxz"
                         placeholder="请选择">
                <el-option v-for="item in fwList"
                           :key="item.id"
                           :label="item.fwdzxz"
                           :value="item.fwdzid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="照片：">
            <el-upload ref="upload"
                       :headers="uploadHeaders"
                       :limit="3"
                       :on-change="handlePicChange"
                       :on-exceed="handleExceed"
                       :file-list="fileList"
                       :action="uploadUrl"
                       list-type="picture-card"
                       :auto-upload="true"
                       accept=".gif,.jpg,.jpeg,.png"
                       :before-upload="beforeAvatarUpload">
              <i slot="default"
                 class="el-icon-plus"></i>
              <div slot="file"
                   slot-scope="{ file }"
                   style="width: 100%; height: 100%">
                <img class="el-upload-list__item-thumbnail"
                     :src="file.url"
                     alt=""
                     style="width: 100%; height: 100%" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span class="el-upload-list__item-delete"
                        @click="handleRemove(file, fileList)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="drawerForm-container"
         v-show="step == 2">
      <el-form :model="form1"
               :rules="rules1"
               ref="form1"
               label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="住所类型">
              <el-select v-model="form1.zslx"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_zslx"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="服务处所"
                          prop="fwcs">
              <el-input v-model="form1.fwcs"
                        placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"
                 @click="changeStep"
                 :icon="this.step == 2 ? 'el-icon-circle-check' : 'el-icon-ali-xiayibu'">{{
            this.step == 2 ? '确定' : '下一步'
          }}</el-button>
      <el-button @click="drawerCancelBtn"
                 :icon="this.step == 1 ? 'el-icon-circle-close' : 'el-icon-ali-shangyibu'">{{
            this.step == 1 ? '取消' : '上一步'
          }}</el-button>

    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getRkxx } from '@/api/jcyw/syrk/ldrk'
import { queryfw, getAreaTree, getZylbTree } from '@/api/jcyw/syrk/hjrk'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  dicts: [
    'sys_user_sex',
    'gb_yhzgx',
    'ga_zjxy',
    'gb_xldm',
    'gb_zylb',
    'gb_zzmm',
    'gb_hyzk',
    'gb_mz',
    'gb_zylb',
    'ga_ldyy',
    'gb_rhyzbz',
    'gb_zslx'
  ],
  data () {
    return {
      // jgChangeFlag: false,
      // hjqhChangeFlag: false,
      // zylbChangeFlag: false,
      areaProps: {
        value: 'areaCode',
        label: 'areaName',
        children: 'children',
        emitPath: false
      },
      zylbareaProps: {
        value: 'zylbCode',
        label: 'zylbName',
        children: 'children',
        emitPath: false
      },
      options: [],
      zylboptions: [],
      hjxzAddr: '',
      xzdxzAddr: '',
      hjxzChangeFlag: false,
      xzdxzChangeFlag: false,
      focusFlag: true,
      searchValue: '',
      timer: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // uploadSite: process.env.VUE_APP_BASE_API + '/common/upload', // 上传的图片服务器地址
      uploadUrl: process.env.VUE_APP_BASE_API + '/common/upload',
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      name: '',
      step: 1,
      stepActive: 1,
      form: {
        hjqh: '',
        csrq: '',
        hyzk: '',
        jg: '',
        mz: '',
        whcd: '',
        xb: '',
        zjxy: '',
        zylb: '',
        zym: '',
        zyxx: '',
        zzmm: '',
        xm: '',
        xl: '',
        hjxz: '',
        // hjxzAddr: '',
        xzdxz: '',
        // xzdxzAddr: '',
        sfzhm: '',
        lxfs: '',
        lryy: '',
        zp: ''
        // fwdzid: ''
      },
      rules: {
        lxfs: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        sfzhm: [
          /*
            { required: true, message: "身份证号不能为空", trigger: "blur" },
*/
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        xm: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        // hjxz: [{ required: true, message: '请输入户籍地址', trigger: 'change' }],
        xzdxz: [
          { required: true, message: '请输入居住地址', trigger: 'change' }
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      },
      form1: {
        yhzgx: '',
        rhyzbz: '',
        xzdxz: '',
        lryy: '',
        fwcs: '',
        zslx: ''
      },
      rules1: {
        rhyzbz: [
          { required: false, message: '请输入人户一致信息', trigger: 'blur' },
          { min: 1, max: 2, message: '长度在 1 到 2 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      },
      fwList: [],
      fileList: []
    }
  },
  mounted () {
    getAreaTree().then((res) => {
      if (res.code === 200) {
        this.options = res.data
      }
    })
    getZylbTree().then((res) => {
      this.zylboptions = this.getTreeData(res.data)
    })
  },
  methods: {
    getTreeData(data) { // 递归遍历树结构，将值转换
        for (let i = 0; i < data.length; i++) {
            if (!data[i].children || data[i].children.length < 1) {
                data[i].children = undefined
            } else {
                this.getTreeData(data[i].children)
            }
        }
        return data
    },
    beforeAvatarUpload (file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
      if (!isJPG) {
        this.$message.error('只能上传图片')
      }
      return isJPG
    },
    handleExceed () {
      this.$message.warning(`最多上传 3 张图片`)
    },
    handlePicChange (file, fileList) {
      this.fileList = fileList
    },
    handleRemove (file, fileList) {
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].uid == file.uid) {
          this.fileList.splice(i, 1)
        }
      }
    },
    handlePictureCardPreview (file) {
      this.$emit('previewImg', file.url, true)
    },
    drawerOpen () {
      this.$refs['form'].clearValidate()
    },
    remoteMethod (value) {
      this.searchValue = value
      this.queryParams.pageNum = 1
      this.fwList = []
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryFwList(value, 0)
      }, 1000)
    },
    xzdxzChange () {
      this.xzdxzChangeFlag = true
    },
    hjxzChange () {
      this.hjxzChangeFlag = true
    },
    queryFwList (value) {
      queryfw({ fwdzxz: value, ...this.queryParams }).then((res) => {
        this.fwList = this.fwList.concat(res.rows)
      })
    },
    async autoComplete (row) {
      let patt =
        /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
      let params = null
      if (row.id) {
        params = {
          id: row.id,
          sfzhm: row.sfzhm
        }
      } else {
        if (!patt.test(this.form.sfzhm)) {
          // this.$modal.msgError('请输入正确格式的身份证号');
          return
        }
        params = {
          sfzhm: this.form.sfzhm
        }
      }
      let getRkxxRes = await getRkxx(params)
      params = null
      if (!getRkxxRes.data) return
      for (let j in getRkxxRes.data.zhzzJcywSyrkJbxx) {
        getRkxxRes.data[j] = getRkxxRes.data.zhzzJcywSyrkJbxx[j]
      }
      for (let k in this.form) {
        this.form[k] = getRkxxRes.data[k]
      }
      for (let k in this.form1) {
        this.form1[k] = getRkxxRes.data[k]
      }
      this.form.xzdxz = row.xzdxzAddr
      this.xzdxzAddr = row.xzdxz
      this.hjxzAddr = row.hjxz
      this.form.hjxz = row.hjxzAddr
      if (this.form.zp) {
        let arr = this.form.zp.split(',')
        for (let i = 0; i < arr.length; i++) {
          this.fileList.push({
            url: process.env.VUE_APP_BASE_FILE_VIEW + arr[i],
            response: {
              url: arr[i]
            }
          })
        }
      }
    },
    reset () {
      this.form = {
        hjqh: '',
        csrq: '',
        hyzk: '',
        jg: '',
        mz: '',
        whcd: '',
        xb: '',
        zjxy: '',
        zylb: '',
        zym: '',
        zyxx: '',
        zzmm: '',
        xm: '',
        xl: '',
        hjxz: '',
        // hjxzAddr: '',
        xzdxz: '',
        // xzdxzAddr: '',
        sfzhm: '',
        lxfs: '',
        lryy: '',
        zp: ''
      }
      this.step = 1
      this.stepActive = 1
      this.fileList = []
    },
    editForm (row) {
      this.hjxzChangeFlag = false
      this.xzdxzChangeFlag = false
      this.autoComplete(row)
    },
    // 抽屉中取消或者上一步按钮
    drawerCancelBtn () {
      if (this.step == 1) {
        this.$emit('drawerClose')
        this.reset()
      } else if (this.step == 3) {
        this.step = 2
        this.stepActive = 2
      } else {
        this.step = 1
        this.stepActive = 1
      }
    },
    validateForm () {
      return new Promise((resolve) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    // 添加网格弹窗中确定按钮切换填写步骤
    async changeStep () {
      if (this.step == 1) {
        let validateRes = await this.validateForm()
        if (!validateRes) return
        this.stepActive = 2
        this.step = 2
      } else if (this.step == 2) {
        if (!this.xzdxzChangeFlag) {
          this.form.xzdxz = this.xzdxzAddr
        }
        if (!this.hjxzChangeFlag) {
          this.form.hjxz = this.hjxzAddr
        }
        if (this.fileList.length) {
          let zp = []
          this.fileList.forEach(async (item) => {
            zp.push(item.response.url)
          })
          this.form.zp = zp.toString()
        } else {
          this.form.zp = ''
        }
        // if (this.fileList.length) {
        //   this.form.zp = this.fileList[0].response.fileName
        // } else {
        //   this.form.zp = ''
        // }
        this.form1.sfzhm = this.form.sfzhm
        this.form1.xzdxz = this.form.xzdxz
        this.form1.lryy = this.form.lryy
        let FormData = this.form1
        FormData.zhzzJcywSyrkJbxx = this.form
        this.$emit('drawerClose')
        // this.reset()
        this.$emit('submitForm', FormData)
      }
    },
    beforeClose () {
      this.$emit('drawerClose')
      this.reset()
    }
  }
}
</script>

<style lang="less" scoped>
.el-date-editor,
.el-select {
  width: 100%;
}
::v-deep .el-input__prefix {
  top: 0px !important;
}
::v-deep .el-drawer__body {
  overflow-y: scroll !important;
  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  &::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 5px;
  }
}
.uploadImgContainer {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  position: relative;
  img {
    margin: 0;
    height: 100%;
    width: 100%;
  }
  .el-icon-close {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
