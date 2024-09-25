<template>
  <el-dialog :title="isEdit ? '修改境外人员信息' : '新增境外人员信息'"
             :visible.sync="value"
             direction="rtl"
             size="40%"
             width="600px"
             ref="drawer"
             :before-close="beforeClose"
             @opened="drawerOpen">
    <div class="drawerForm-container">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="外文姓"
                          prop="wwx">
              <el-input v-model="form.wwx"
                        placeholder="请输入外文姓">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外文名"
                          prop="wwm">
              <el-input v-model="form.wwm"
                        placeholder="请输入外文名">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文姓名"
                          prop="zwxm">
              <el-input v-model="form.zwxm"
                        placeholder="请输入中文姓名">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别"
                          prop="xb">
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
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择出生日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国籍(地区)"
                          prop="gj">
              <el-select v-model="form.gj"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_gjdqdm"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  style="clear: both">
            <el-form-item label="宗教信仰"
                          prop="zjxy">
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
            <el-form-item label="证件类型"
                          prop="zjdm">
              <el-select v-model="form.zjdm"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.ga_zjzl"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码"
                          prop="zjhm">
              <el-input v-model="form.zjhm"
                        placeholder="请输入证件号码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件有效期"
                          prop="zjyxq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.zjyxq"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="证件有效期">
              </el-date-picker>
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
            <el-form-item label="来华目的"
                          prop="lhmd">
              <el-select v-model="form.lhmd"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.zdy_lhmd"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业类别"
                          prop="zylb">
              <el-select v-model="form.zylb"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_zylb"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业"
                          prop="zy">
              <el-input v-model="form.zy"
                        placeholder="请输入职业"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务住所"
                          prop="fwzs">
              <el-input v-model="form.fwzs"
                        placeholder="请输入服务住所">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现住地"
                          prop="xzd">
              <el-input v-model="form.xzd"
                        placeholder="请输入现住地">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现居住地址"
                          prop="xzxz">
              <el-input v-model="form.xzxz"
                        placeholder="请输入现居住地址">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抵达日期"
                          prop="ddrq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.ddrq"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="抵达日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  style="clear: both">
            <el-form-item label="预计离开日期"
                          prop="yjlkrq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.yjlkrq"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="预计离开日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否重点关注"
                          prop="sfzdgzry">
              <el-select v-model="form.sfzdgzry"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.sys_yes_no"
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
                 @click="changeStep"
                 > 确定 </el-button>
      <el-button @click="drawerCancelBtn"
                 >取消 </el-button>

    </div>
  </el-dialog>
</template>

<script>
import { getHjrk } from '@/api/jcyw/syrk/jwry'
import { getToken } from '@/utils/auth'
import { query } from '@/api/jcyw/syfw/fwgl'
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
    'gb_yhzgx',
    'ga_zjxy',
    'gb_xldm',
    'gb_zzmm',
    'gb_hyzk',
    'gb_mz',
    'gb_zylb',
    'gb_rhyzbz',
    'gb_gjdqdm',
    'zdy_lhmd',
    'sys_yes_no',
    'ga_zjzl'
  ],
  data () {
    return {
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
        wwx: '',
        wwm: '',
        zwxm: '',
        xb: '',
        csrq: '',
        gj: '',
        zjxy: '',
        zjdm: '',
        zjhm: '',
        zjyxq: '',
        lxfs: '',
        lhmd: '',
        zylb: '',
        zy: '',
        fwzs: '',
        xzd: '',
        xzxz: '',
        ddrq: '',
        yjlkrq: '',
        sfzdgzry: ''
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
        // mz: [{ required: true, message: '请选择民族', trigger: 'change' }],
        zjhm: [
          {
            required: true,
            message: '请输入证件号码',
            trigger: 'blur'
          },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }

        ],
        xm: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        zjyxq: [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        csrq: [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        ddrq: [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        yjlkrq: [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        sfzdgzry: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  mounted () { },
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
      let getHjrkRes = await getHjrk(row.id)
      if (getHjrkRes.data) {
        for (let k in this.form) {
          this.form[k] = getHjrkRes.data[k]
        }
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
        wwx: '',
        wwm: '',
        zwxm: '',
        xb: '',
        csrq: '',
        gj: '',
        zjxy: '',
        zjdm: '',
        zjhm: '',
        zjyxq: '',
        lxfs: '',
        lhmd: '',
        zylb: '',
        zy: '',
        fwzs: '',
        xzd: '',
        xzxz: '',
        ddrq: '',
        yjlkrq: '',
        sfzdgzry: ''
      }
    },
    editForm (row) {
      debugger
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
</style>
