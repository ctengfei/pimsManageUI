<template>
  <el-dialog title="查看标签人员信息"
             :visible.sync="value"
             direction="rtl"
             size="40%"
             width="600px"
             ref="drawer"
             :before-close="beforeClose"
             @opened="drawerOpen">
    <div class="drawerForm-container">
      <el-form :disabled="true"
               :model="form"
               ref="form"
               label-width="80px">
        <!-- :rules="rules" -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名"
                          prop="xm">
              <el-input v-model="form.xm"
                        placeholder="暂无信息"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别"
                          prop="xb">
              <el-select v-model="form.xb"
                         placeholder="暂无信息">
                <el-option v-for="dict in dict.type.sys_user_sex"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号"
                          prop="sfzhm">
              <el-input v-model="form.sfzhm"
                        placeholder="暂无信息"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族"
                          prop="mz">
              <el-select v-model="form.mz"
                         placeholder="暂无信息">
                <el-option v-for="dict in dict.type.gb_mz"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌"
                          prop="zzmm">
              <el-select v-model="form.zzmm"
                         placeholder="暂无信息">
                <el-option v-for="dict in dict.type.gb_zzmm"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式"
                          prop="lxfs">
              <el-input v-model="form.lxfs"
                        placeholder="暂无信息"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户籍地址"
                          prop="hjxzAddr">
              <el-input v-model="form.hjxzAddr"
                        placeholder="暂无信息">
              </el-input>
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
                              placeholder="暂无信息">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户籍区划"
                          prop="hjqh">
              <!-- :show-all-levels="false"<el-input v-model="form.hjqh" placeholder="暂无信息"> </el-input> -->
              <el-cascader placeholder="未知"
                           v-model="form.hjqh"
                           :options="options"
                           :props="areaProps"
                           style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯"
                          prop="jg">
              <!-- <el-input v-model="form.jg" placeholder="暂无信息"> </el-input> -->
              <el-cascader placeholder="未知"
                           v-model="form.jg"
                           :options="options"
                           :props="areaProps"
                           style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻状况"
                          prop="hyzk">
              <el-select v-model="form.hyzk"
                         placeholder="暂无信息">
                <el-option v-for="dict in dict.type.gb_hyzk"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历"
                          prop="xl">
              <el-select v-model="form.xl"
                         placeholder="暂无信息">
                <el-option v-for="dict in dict.type.gb_xldm"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宗教信仰"
                          prop="zjxy">
              <el-select v-model="form.zjxy"
                         placeholder="暂无信息">
                <el-option v-for="dict in dict.type.ga_zjxy"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="drawerCancelBtn"
                 > 取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAreaTree } from '@/api/jcyw/syrk/hjrk'
import { getToken } from '@/utils/auth'
import { query } from '@/api/jcyw/syfw/fwgl'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  dicts: [
    'sys_user_sex',
    'ga_zjxy',
    'gb_xldm',
    'gb_zylb',
    'gb_zzmm',
    'gb_hyzk',
    'gb_mz',
    'gb_rhyzbz'
  ],
  data () {
    return {
      options: [],
      areaProps: {
        value: 'areaCode',
        label: 'areaName',
        children: 'children',
        emitPath: false
      },
      uploadSite: process.env.VUE_APP_BASE_API + '/common/upload', // 上传的图片服务器地址
      uploadUrl: '',
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      fwList: [],
      form: {
        sfzhm: '',
        csrq: '',
        hjqh: '',
        hjxzAddr: '',
        hyzk: '',
        jg: '',
        lxfs: '',
        mz: '',
        xb: '',
        xl: '',
        xm: '',
        zjxy: '',
        zp: '',
        zylb: '',
        zym: '',
        zyxx: '',
        zzmm: ''
      }
    }
  },
  mounted () {
    getAreaTree().then((res) => {
      if (res.code === 200) {
        this.options = res.data
      }
    })
  },
  methods: {
    drawerOpen () {
      this.$refs['form'].clearValidate()
    },
    async autoComplete (row) {
      for (let k in this.form) {
        this.form[k] = row[k]
      }
    },
    reset () {
      this.form = {
        sfzhm: '',
        csrq: '',
        hjqh: '',
        hjxzAddr: '',
        hyzk: '',
        jg: '',
        lxfs: '',
        mz: '',
        xb: '',
        xl: '',
        xm: '',
        zjxy: '',
        zp: '',
        zylb: '',
        zym: '',
        zyxx: '',
        zzmm: ''
      }
    },
    editForm (row) {
      this.autoComplete(row)
    },
    // 抽屉中取消或者上一步按钮
    drawerCancelBtn () {
      this.$emit('drawerClose')
      this.reset()
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
        // if (!this.hjxzChangeFlag) {
        //   this.form.hjxz = this.hjxzAddr
        // }
        // if (!this.xzdxzChangeFlag) {
        //   this.form.xzdxz = this.xzdxzAddr
        // }
        // this.form1.sfzhm = this.form.sfzhm
        // this.form1.xzdxz = this.form.xzdxz
        let FormData = { ...this.form1, ...this.form }
        // FormData.zhzzJcywSyrkJbxx = this.form
        this.$emit('drawerClose')
        this.reset()
        this.$emit('submitForm', FormData)
      }
    },
    beforeClose (done) {
      this.$emit('drawerClose')
      this.reset()
      done()
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
::v-deep input[disabled],
input:disabled,
input.disabled {
  -webkit-text-fill-color: #363636;
  background: #363636;
  -webkit-opacity: 1;
  opacity: 1;
  cursor: not-allowed;
}
</style>
