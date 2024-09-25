<template>
  <el-dialog :title="
      isEdit ? '修改场所信息' : isDisable ? '查看场所信息' : '新增场所信息'
    "
             :visible.sync="value"
             direction="rtl"
             size="40%"
             width="600px"
             ref="drawer"
             :before-close="beforeClose"
             @opened="drawerOpen">
    <div class="drawerForm-container">
      <el-form :model="form"
               :disabled="isDisable"
               :rules="rules"
               ref="form"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位编码"
                          prop="dwbm">
              <el-input type="text"
                        maxlength="18"
                        show-word-limit
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
                        v-model="form.dwbm"
                        placeholder="请输入单位编码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称"
                          prop="dwmc">
              <el-input type="text"
                        maxlength="100"
                        show-word-limit
                        v-model="form.dwmc"
                        placeholder="请输入单位名称">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位类型"
                          prop="dwlxdm">
              <el-select v-model="form.dwlxdm"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_dwlx"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经济类型"
                          prop="jjlxdm">
              <el-select v-model="form.jjlxdm"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_jjlx"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业类别"
                          prop="hylbdm">
              <el-select v-model="form.hylbdm"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.st_ggcs_lb"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开业日期"
                          prop="kyrq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.kyrq"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择开业日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停业日期"
                          prop="tyrq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.tyrq"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择停业日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围(主营)"
                          prop="jyfwzy">
              <el-select v-model="form.jyfwzy"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_jyfw"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  style="clear: both">
            <el-form-item label="经营范围(兼营)"
                          prop="jyfwjy">
              <el-select v-model="form.jyfwjy"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.gb_jyfw"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营面积(平方米)"
                          prop="jymj">
              <el-input type="text"
                        maxlength="6"
                        show-word-limit
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
                        v-model="form.jymj"
                        placeholder="请输入经营面积(平方米)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营方式"
                          prop="jyfs">
              <el-input type="text"
                        maxlength="4"
                        show-word-limit
                        v-model="form.jyfs"
                        placeholder="请输入经营方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照"
                          prop="yyzzh">
              <el-input type="text"
                        maxlength="18"
                        show-word-limit
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
                        v-model="form.yyzzh"
                        placeholder="请输入营业执照" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照有效期"
                          prop="yyzzyxq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.yyzzyxq"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择营业执照有效期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起始日期"
                          prop="qsrq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.qsrq"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择起始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止日期"
                          prop="jzrq">
              <el-date-picker clearable
                              size="small"
                              v-model="form.jzrq"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择截止日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册资金"
                          prop="zczj">
              <el-input type="text"
                        maxlength="6"
                        show-word-limit
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
                        v-model="form.zczj"
                        placeholder="请输入注册资金" />
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  style="clear: both">
            <el-form-item label="联系电话"
                          prop="lxdh">
              <el-input v-model="form.lxdh"
                        placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重点单位标识"
                          prop="zddwbs">
              <el-select v-model="form.zddwbs"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.sys_yes_no"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
              <!-- <el-input v-model="form.zddwbs" placeholder="请输入重点单位标识" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保卫负责人"
                          prop="bwfzr">
              <el-input type="text"
                        maxlength="50"
                        show-word-limit
                        v-model="form.bwfzr"
                        placeholder="请输入保卫负责人">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保卫负责人联系电话"
                          prop="bwlxdh">
              <el-input v-model="form.bwlxdh"
                        placeholder="请输入保卫负责人联系电话">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保卫负责人人口编码"
                          prop="bwrkbm">
              <el-input type="text"
                        maxlength="18"
                        show-word-limit
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
                        v-model="form.bwrkbm"
                        placeholder="请输入保卫负责人人口编码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保卫负责人证件种类"
                          prop="bwxm">
                <el-select v-model="form.bwxm"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.ga_zjzl"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
              <!-- <el-input type="text"
                        maxlength="50"
                        v-model="form.bwxm"
                        placeholder="请输入保卫负责人证件种类">
              </el-input> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="创建单位" prop="deptId">
              <el-input v-model="form.deptId" placeholder="请输入创建单位">
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="证件号码"
                          prop="bwgmsfzhm">
              <el-input v-model="form.bwgmsfzhm"
                        placeholder="请输入证件号码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人"
                          prop="fddbr">
              <el-input type="text"
                        maxlength="50"
                        show-word-limit
                        v-model="form.fddbr"
                        placeholder="请输入法定代表人">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人联系电话"
                          prop="fdlxdh">
              <el-input type="text"
                        v-model="form.fdlxdh"
                        placeholder="请输入法定代表人联系电话">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人证件种类"
                          prop="fdzjzl">
              <el-select v-model="form.fdzjzl"
                         placeholder="请选择">
                <el-option v-for="dict in dict.type.ga_zjzl"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代表人证件号码"
                          prop="fdgmsfzhm">
              <el-input v-model="form.fdgmsfzhm"
                        placeholder="请输入代表人证件号码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="区划内详细地址"
                          prop="qhnxxdz">
              <el-select @change="xzdxzChange()"
                         filterable
                         default-first-option
                         remote
                         :remote-method="remoteMethod"
                         v-model="form.qhnxxdz"
                         placeholder="请选择">
                <el-option v-for="item in fwList"
                           :key="item.id"
                           :label="item.fwdzxz"
                           :value="item.fwdzid"></el-option>
              </el-select>
              <!-- <el-select v-model="form.dzysqc" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select> -->
              <!-- <el-input v-model="form.dzysqc" placeholder="请输入区划内详细地址" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位地址"
                          prop="dwdz">
              <el-input type="text"
                        maxlength="36"
                        show-word-limit
                        v-model="form.dwdz"
                        placeholder="请输入单位地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!isDisable"
                 type="primary"
                 @click="changeStep">
        确定
      </el-button>
      <el-button @click="drawerCancelBtn"
                 >取消 </el-button>

    </div>
  </el-dialog>
</template>

<script>
import { getCsgl } from '@/api/jcyw/sydw/csgl'
import { getToken } from '@/utils/auth'
import { query } from '@/api/jcyw/syfw/fwgl'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isDisable: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  dicts: [
    'gb_dwlx',
    'gb_jjlx',
    'gb_jyfw',
    'ga_zjzl',
    'st_ggcs_lb',
    'sys_yes_no'
  ],
  data () {
    return {
      hjxzAddr: '',
      // xzdxzAddr: '',
      xzdxzChangeFlag: false,
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
      //命名一个第三方的变量来接收列表传来的qhnxxdz
      qhnxxdz: '',
      form: {},
      rules: {
        dwbm: [
          { required: true, message: '单位编码不能为空', trigger: 'blur' }
        ],
        // bwfzr: [
        //   { required: true, message: "保卫负责人不能为空", trigger: "blur" }
        // ],
        // bwgmsfzhm: [
        //   { required: true, message: "保卫负责人身份证号码不能为空", trigger: "blur" }
        // ],
        lxdh: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        bwlxdh: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        fdlxdh: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        bwgmsfzhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确证件号码',
            trigger: 'blur'
          }
        ],
        fdgmsfzhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确证件号码',
            trigger: 'blur'
          }
        ],
        // bwrkbm: [
        //   { required: true, message: "保卫负责人人口编码不能为空", trigger: "blur" }
        // ],
        // bwxm: [
        //   { required: true, message: "保卫负责人姓名不能为空", trigger: "blur" }
        // ],
        // deptId: [
        //   { required: true, message: "单位编码不能为空", trigger: "blur" }
        // ],
        // dwlxdm: [
        //   { required: true, message: "单位类型不能为空", trigger: "blur" }
        // ],
        // fddbr: [
        //   { required: true, message: "法定代表人不能为空", trigger: "blur" }
        // ],
        // fdgmsfzhm: [
        //   { required: true, message: "法定代表人身份证号码不能为空", trigger: "blur" }
        // ],
        dwmc: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        qhnxxdz: [
          { required: true, message: '区划内详细地址不能为空', trigger: 'blur' }
        ],

        zddwbs: [
          { required: true, message: '重点单位标识不能为空', trigger: 'blur' }
        ]
      },
      form1: {
        ylsrygx: '',
        rhyzbz: ''
        // xzdxz: ''
      },
      rules1: {
        rhyzbz: [
          { required: false, message: '请输入人户一致信息', trigger: 'blur' },
          { min: 1, max: 2, message: '长度在 1 到 2 个字符', trigger: 'blur' }
        ],
        ylsrygx: [
          { required: false, message: '请输入人户一致信息', trigger: 'blur' },
          { min: 1, max: 2, message: '长度在 1 到 2 个字符', trigger: 'blur' }
        ]
        // region: [
        //   { required: true, message: '请选择活动区域', trigger: 'change' }
        // ],
        // date1: [
        //   {
        //     type: 'date',
        //     required: true,
        //     message: '请选择日期',
        //     trigger: 'change'
        //   }
        // ],
        // date2: [
        //   {
        //     type: 'date',
        //     required: true,
        //     message: '请选择时间',
        //     trigger: 'change'
        //   }
        // ],
        // type: [
        //   {
        //     type: 'array',
        //     required: true,
        //     message: '请至少选择一个活动性质',
        //     trigger: 'change'
        //   }
        // ],
        // resource: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        // desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    // this.queryFwList()
    this.remoteMethod()
  },
  methods: {
    drawerOpen () {
      this.$refs['form'].clearValidate()
    },
    xzdxzChange () {
      this.xzdxzChangeFlag = true
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
        dwbm: '',
        bwfzr: '',
        bwgmsfzhm: '',
        bwlxdh: '',
        bwrkbm: '',
        bwxm: '',
        deptId: '',
        dwlxdm: '',
        // ylsrygx: '',
        fddbr: '',
        fdgmsfzhm: '',
        dwmc: '',
        qhnxxdz: '',
        zddwbs: ''
        // lxfs: '',
        // zp: ''
      }
      //将值初始化回来
      this.xzdxzChangeFlag = false
    },
    editForm (row) {
      this.reset()
      let obj = JSON.parse(JSON.stringify(row)) //  深拷贝
      this.form = obj
      // 用来接收从列表传过来的qhnxxdz
      this.qhnxxdz = this.form.qhnxxdz
      query({ fwdzid: this.form.qhnxxdz }).then((res) => {
        this.form.qhnxxdz = res.rows.length === 1 ? res.rows[0].fwdzxz : ''
      })
      // this.hjxzChangeFlag = false
      // this.xzdxzChangeFlag = false
      // this.autoComplete(row)
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
      //如果为false，说明没改直接提交了
      if (!this.xzdxzChangeFlag) {
        this.form.qhnxxdz = this.qhnxxdz
      }
      let FormData = { ...this.form }
      // FormData.zhzzJcywSyrkJbxx = this.form
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
