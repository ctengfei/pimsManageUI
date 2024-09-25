<template>
  <el-dialog :title="isEdit ? '编辑关爱人员信息' : '查看关爱人员信息'"
             :visible.sync="value"
             direction="rtl"
             size="40%"
             width="600px"
             ref="drawer"
             :before-close="beforeClose"
             @opened="drawerOpen">
    <div class="drawerForm-container">
      <el-form :model="jbxx"
               label-width="80px"
               disabled
               v-if="!isEdit">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="jbxx.xm"
                        placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="曾用名">
              <el-input v-model="jbxx.zym"
                        placeholder="请输入曾用名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="jbxx.xb"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.sys_user_sex"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期">
              <el-date-picker clearable
                              size="small"
                              v-model="jbxx.csrq"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择出生日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族"
                          prop="mz">
              <el-select v-model="jbxx.mz"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_mz"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯"
                          prop="jg">
              <el-cascader v-model="jbxx.jg"
                           :options="options"
                           :props="areaProps"
                           clearable
                           style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻状况"
                          prop="hyzk">
              <el-select v-model="jbxx.hyzk"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_hyzk"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌"
                          prop="zzmm">
              <el-select v-model="jbxx.zzmm"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_zzmm"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文化程度"
                          prop="xl">
              <el-select v-model="jbxx.xl"
                         placeholder="请选择">
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
              <el-select v-model="jbxx.zjxy"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.ga_zjxy"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业类别"
                          prop="zylb">
              <el-cascader v-model="jbxx.zylb"
                           :options="zylboptions"
                           :props="zylbareaProps"
                           clearable
                           style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式"
                          prop="lxfs">
              <el-input v-model="jbxx.lxfs"
                        placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业信息"
                          prop="zyxx">
              <el-input v-model="jbxx.zyxx"
                        placeholder="请输入职业信息" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户籍区划"
                          prop="hjqh">
              <el-cascader v-model="jbxx.hjqh"
                           :options="options"
                           :props="areaProps"
                           clearable
                           style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="jbxx.hjxzAddr"
                          label="户籍地址"
                          prop="hjxzAddr">
              <el-input v-model="jbxx.hjxzAddr"
                        placeholder="未知"> </el-input>
              <!-- <el-select v-model="jbxx.hjxzAddr" placeholder="请选择">
                <el-option
                  v-for="item in fwList"
                  :key="item.id"
                  :label="item.fwdzxz"
                  :value="item.fwdzid"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item v-else
                          label="户籍地址"
                          prop="hjxz">
              <el-input v-model="jbxx.hjxz"
                        placeholder="未知"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="居住地址"
                          prop="xzdxz">
              <el-select v-model="jbxx.xzdxz"
                         placeholder="请选择">
                <el-option v-for="item in fwList"
                           :key="item.id"
                           :label="item.fwdzxz"
                           :value="item.fwdzid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider v-if="!isEdit"></el-divider>
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="100px"
               :disabled="!isEdit">
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号"
                          prop="sfzhm">
              <el-input v-model="form.sfzhm"
                        placeholder="请输入身份证号"
                        disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员类型"
                          prop="lsrylx">
              <el-select multiple
                         v-model="form.lsrylx"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.bq_gary"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.raw.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="健康状况"
                          prop="jkzk">
              <el-select v-model="form.jkzk"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.st_jkzk"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年收入"
                          prop="grnsr">
              <el-input v-model="form.grnsr"
                        placeholder="请输入个人年收入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭主要成员身份证号码"
                          prop="jtzycysfzhm">
              <el-input v-model="form.jtzycysfzhm"
                        placeholder="请输入家庭主要成员身份证号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭主要成员姓名"
                          prop="jtzycyxm">
              <el-input v-model="form.jtzycyxm"
                        placeholder="请输入家庭主要成员姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭主要成员健康状况"
                          prop="jtzycyjkzk">
              <el-select v-model="form.jtzycyjkzk"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.st_jkzk"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭主要成员联系方式"
                          prop="jtzycylxfs">
              <el-input v-model="form.jtzycylxfs"
                        placeholder="请输入家庭主要成员联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭主要成员工作详细地址"
                          prop="jtzycygzxxdz">
              <el-input v-model="form.jtzycygzxxdz"
                        placeholder="请输入家庭主要成员工作详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭年收入"
                          prop="jtnsr">
              <el-input v-model="form.jtnsr"
                        placeholder="请输入家庭年收入" />
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  style="clear: both">
            <el-form-item label="困难及诉求"
                          prop="knjsq">
              <el-input v-model="form.knjsq"
                        placeholder="请输入困难及诉求" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帮扶情况"
                          prop="bfqk">
              <el-input v-model="form.bfqk"
                        placeholder="请输入帮扶情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关爱人员类型"
                          prop="garylx">
              <el-select multiple
                         v-model="form.garylx"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.bq_gary"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.raw.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭主要成员与留守人员关系">
              <el-select v-model="form.ylsrygx"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_yhzgx"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否人户一致"
                          prop="rhyzbz">
              <el-select v-model="form.rhyzbz"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_rhyzbz"
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
      <el-button type="primary"
                 @click="drawerCancelBtn"
                 v-if="!isEdit">关闭
      </el-button>
      <el-button type="primary"
                 @click="changeStep"
                 v-if="isEdit">确定
      </el-button>
      <el-button @click="drawerCancelBtn"
                 v-if="isEdit">取消 </el-button>

    </div>
  </el-dialog>
</template>

<script>
import { getGaryInfo } from '@/api/jcyw/syrk/gary'
import { getToken } from '@/utils/auth'
import { query } from '@/api/jcyw/syfw/fwgl'
import { getAreaTree, getZylbTree } from '@/api/jcyw/syrk/hjrk'
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
    'st_jkzk',
    'sys_user_sex',
    'bq_gary',
    'gb_yhzgx',
    'ga_zjxy',
    'gb_xldm',
    'gb_zylb',
    'gb_zzmm',
    'gb_hyzk',
    'gb_mz',
    'gb_zylb',
    'gb_rhyzbz'
  ],
  data () {
    return {
      hjxzAddr: '',
      // xzdxzAddr: '',
      hjxzChangeFlag: false,
      // xzdxzChangeFlag: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      timer: null,
      uploadSite: process.env.VUE_APP_BASE_API + '/common/upload', // 上传的图片服务器地址
      uploadUrl: '',
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      fwList: [],
      form: {
        id: '',
        sfzhm: '',
        jkzk: '',
        grnsr: '',
        lsrylx: [],
        jtzycysfzhm: '',
        jtzycyxm: '',
        jtzycyjkzk: '',
        ylsrygx: '',
        jtzycylxfs: '',
        jtzycygzxxdz: '',
        jtnsr: '',
        knjsq: '',
        bfqk: '',
        garylx: [],
        rhyzbz: ''
      },
      rules: {
        //   lxfs: [
        //     {
        //       required: true,
        //       pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //       message: '请输入正确的手机号码',
        //       trigger: 'blur'
        //     }
        //   ],
        //   mz: [{ required: true, message: '请选择民族', trigger: 'change' }],
        sfzhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ]
        //   xm: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        //   hjxz: [
        //     { required: true, message: '请输入户籍地址', trigger: 'change' }
        //   ],
        //   // xzdxz: [{ required: true, message: '请输入居住地址', trigger: 'blur' }],
        //   date1: [
        //     {
        //       type: 'date',
        //       required: true,
        //       message: '请选择日期',
        //       trigger: 'change'
        //     }
        //   ],
        //   date2: [
        //     {
        //       type: 'date',
        //       required: true,
        //       message: '请选择时间',
        //       trigger: 'change'
        //     }
        //   ],
        //   type: [
        //     {
        //       type: 'array',
        //       required: true,
        //       message: '请至少选择一个活动性质',
        //       trigger: 'change'
        //     }
        //   ],
        //   resource: [
        //     { required: true, message: '请选择活动资源', trigger: 'change' }
        //   ],
        //   desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      },
      jbxx: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      options: [],
      areaProps: {
        value: 'areaCode',
        label: 'areaName',
        children: 'children',
        emitPath: false
      },
      zylboptions: [],
      zylbareaProps: {
        value: 'zylbCode',
        label: 'zylbName',
        children: 'children',
        emitPath: false
      },
      fwList: []
    }
  },
  mounted () {
    getAreaTree().then((res) => {
      if (res.code === 200) {
        this.options = res.data
      }
    })
    getZylbTree().then((res) => {
      this.zylboptions = res.data
    })
  },
  methods: {
    drawerOpen () {
      this.$refs['form'].clearValidate()
    },
    removeZp () {
      this.form.zp = ''
      this.uploadUrl = ''
    },
    handleFileSuccess (res) {
      this.form.zp = res.fileName
      this.uploadUrl = res.url
    },
    async autoComplete (row) {
      let getHjrkRes = await getGaryInfo(row.sfzhm)
      if (getHjrkRes.data) {
        for (let k in this.form) {
          this.form[k] = getHjrkRes.data[k]
        }
        this.form.sfzhm = row.sfzhm
        this.form.lsrylx = row.bqId
      } else {
        this.form.sfzhm = row.sfzhm
        this.form.lsrylx = row.bqId
      }
    },
    hjxzChange () {
      this.hjxzChangeFlag = true
    },
    remoteMethod (value) {
      this.fwList = []
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryFwList(value)
      }, 1000)
    },
    queryFwList (value) {
      query({ fwdzxz: value, ...this.queryParams }).then((res) => {
        this.fwList = this.fwList.concat(res.rows)
      })
    },
    reset () {
      this.form = {
        id: '',
        sfzhm: '',
        jkzk: '',
        grnsr: '',
        lsrylx: [],
        jtzycysfzhm: '',
        jtzycyxm: '',
        jtzycyjkzk: '',
        ylsrygx: '',
        jtzycylxfs: '',
        jtzycygzxxdz: '',
        jtnsr: '',
        knjsq: '',
        bfqk: '',
        garylx: [],
        rhyzbz: ''
      }
    },
    editForm (row) {
      this.jbxx = row
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
      let validateRes = await this.validateForm()
      if (!validateRes) return
      let FormData = { ...this.form }
      this.$emit('drawerClose')
      this.reset()
      this.$emit('submitForm', FormData)
      // }
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
