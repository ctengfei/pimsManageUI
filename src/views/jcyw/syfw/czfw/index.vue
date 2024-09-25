<template>
  <div class="flex flex-col h-full app-container">
    <el-col :span="24"
            class="xzBox"
            style="margin: 0; box-sizing: border-box; padding: 0; height: 100%">
      <el-col class="xztongji">
        <el-row :gutter="10"
                class="xztongjiBox">
          <el-col :span="4">
            <Statistics class="xzmain"
                        :optionList="optionList"></Statistics>
          </el-col>
          <!--  -->
          <el-col :span="7">
            <Religion class="xzmain"
                      :optionList="optionList"></Religion>
          </el-col>
          <el-col :span="13">
            <Purpose class="xzmainwei"
                     :optionList="optionList"></Purpose>
          </el-col>
        </el-row>
      </el-col>
      <el-row class="xzysBox"
              style="
          overflow-y: scroll;
          height: calc(100% - 188px);
          background: white;
          box-sizing: border-box;
          padding: 0px;
        ">
        <el-col :span="24"
                class="xzgdBox">
          <VTable ref="table"
                  class="xzgdBox"
                  label-width="auto"
                  label-position="left"
                  :data="tableData"
                  :columns="columns"
                  :showIndex="true"
                  :selection="false"
                  @on-search="$refs.table.refresh()"
                  @on-reset="onReset">
            <template #search>
              <VTableSearchItem label="房屋地址">
                <el-input v-model="queryParams.fwdzxz"
                          size="small"
                          placeholder="请输入房屋地址" />
              </VTableSearchItem>
              <VTableSearchItem label="房主电话">
                <el-input size="small"
                          v-model="queryParams.fzlxfs"
                          placeholder="请输入房主联系方式" />
              </VTableSearchItem>
              <VTableSearchItem label="房屋类别">
                <el-select v-model="queryParams.fwlx"
                           placeholder="请选择"
                           clearable>
                  <el-option v-for="dict in dict.type.ga_fwlb"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
              </VTableSearchItem>
              <VTableSearchItem label="房屋用途">
                <el-select v-model="queryParams.fwyt"
                           placeholder="请选择"
                           clearable>
                  <el-option v-for="dict in dict.type.ga_fwyt"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
              </VTableSearchItem>
              <!--<VTableSearchItem label="是否出租房屋">
                <el-select
                  v-model="queryParams.sfczfw"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="dict in dict.type.sys_yes_no"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </VTableSearchItem>-->
            </template>

            <template #operate>
              <!-- <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="onAdd"
                >新增</el-button
              > -->
            </template>
          </VTable>
        </el-col>
      </el-row>
    </el-col>
    <!-- 新增弹框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               size="40%"
               width="600px"
               append-to-body
               custom-class="dialog-style"
               style="font-size: 24px">
      <div style="width: 100%; padding: 20px">
        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="100px">
          <el-row :gutter="20"
                  v-if="form.sfczfw === 'Y'">
            <el-col class="white-space-nowrap"
                    :span="column.label == '房屋地址' ? 24 : 12"
                    v-for="(column, index) in addColumns"
                    :key="index">
              <el-form-item v-if="column.dict"
                            :label="column.label">
                <!-- @change="czrzjdmChange(form[column.prop])" -->
                <el-select v-if="column.label == '承租人证件类型'"
                           @change="czrzjdmChange(form[column.prop])"
                           v-model="form[column.prop]"
                           placeholder="请选择">
                  <el-option v-for="dict in dict.type[column.dict]"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
                <el-select v-else
                           v-model="form[column.prop]"
                           placeholder="请选择">
                  <el-option v-for="dict in dict.type[column.dict]"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else
                            :label="column.label"
                            :prop="column.prop">
                <el-input v-if="column.prop == 'fwmj' || column.prop == 'fwjs'"
                          v-model="form[column.prop]"
                          placeholder="请输入"
                          maxlength="100" show-word-limit
                          min="0"><i v-if="column.prop == 'fwmj'"
                     slot="suffix">㎡</i></el-input>
                <el-select v-else-if="column.prop == 'czrxm'"
                           @change="czrxmChange()"
                           filterable
                           remote
                           :remote-method="remoteMethod"
                           v-model="form[column.prop]"
                           placeholder="请选择">
                  <el-option v-for="item in peopleList"
                             :key="item.id"
                             :label="item.xm"
                             :value="`${item.xm},${item.sfzhm},${item.lxfs}`"></el-option>
                </el-select>
                <el-input v-else
                          v-model="form[column.prop]"
                          placeholder="请输入"
                          maxlength="100"
                          show-word-limit
                          :readonly="column.prop == 'fwdzxz'" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20"
                  v-else>
            <el-col class="white-space-nowrap"
                    :span="column.label == '房屋地址' ? 24 : 12"
                    v-for="(column, index) in noRentColumns"
                    :key="index">
              <el-form-item v-if="column.dict"
                            :label="column.label">
                <el-select v-model="form[column.prop]"
                           placeholder="请选择">
                  <el-option v-for="dict in dict.type[column.dict]"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else
                            :label="column.label"
                            :prop="column.prop">
                <el-input v-if="column.prop == 'fwmj' || column.prop == 'fwjs'"
                          v-model="form[column.prop]"
                          placeholder="请输入"
                          show-word-limit
                          maxlength="100"><i v-if="column.prop == 'fwmj'"
                     slot="suffix">㎡</i></el-input>
                <el-input v-else
                          v-model="form[column.prop]"
                          placeholder="请输入"
                          maxlength="100"
                          show-word-limit
                          :readonly="column.prop == 'fwdzxz'" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="房屋图片">
              <div v-if="uploadUrl"
                   class="uploadImgContainer">
                <img :src="uploadUrl"
                     alt=""
                     srcset="" />
                <i @click="removeZp"
                   class="el-icon-close"></i>
              </div>
              <el-upload style="display: inline-block; vertical-align: middle"
                         list-type="picture-card"
                         ref="upload"
                         accept="image/jpeg,image/gif,image/png"
                         :show-file-list="false"
                         :headers="uploadHeaders"
                         :on-remove="handleRemove"
                         :on-change="fileChange"
                         :on-success="handleFileSuccess"
                         :action="uploadSite">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
      <el-row type="flex"
              class="position-br"
              justify="end">
       
        <el-button type="primary"
                   @click="submitForm"
                   >确 定</el-button>
        <el-button @click="cancel"
                   >取 消</el-button>
      </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Statistics from './components/Statistics'
import Religion from './components/Religion'
import Purpose from './components/Purpose'
import { getPeopleList } from '@/api/wggl/xcrz'
import {
  query,
  add,
  edit,
  deleteList,
  getCzfwCount,
  getCzfwlbCount,
  getCzfwytCount,
  getCZStatistics
} from '@/api/jcyw/syfw/fwgl'
import { removeFile, fileList } from '@/api/sjzx/sjsb'
import { formatDate, formatIdCard } from '@/utils'
import { getToken } from '@/utils/auth'
export default {
  name: 'Czfw',
  components: {
    Statistics,
    Religion,
    Purpose
  },
  dicts: [
    'ga_fwyt',
    'ga_fwcq',
    'ga_fwlb',
    'sys_yes_no',
    'gb_czyt',
    'ga_zjzl',
    'zdy_fwczqk'
  ],
  data () {
    const checkFwmj = (rule, value, callback) => {
      const regMobile = /^[]?(0|([1-9]\d*))(\.\d+)?$/g
      if (value) {
        if (regMobile.test(value)) {
          return callback()
        } else {
          callback(new Error('请输入合法的数字'))
        }
      } else {
        return callback()
      }
    }
    return {
      optionList: null,
      uploadSite: process.env.VUE_APP_BASE_API + '/common/upload', // 上传的图片服务器地址
      timer: '',
      timeout: null,
      peopleList: [],
      uploadUrl: '',
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      queryParams: {
        fwdzxz: undefined,
        fzxm: undefined,
        fwlx: undefined,
        fzlxfs: undefined,
        fwyt: undefined,
        sfczfw: 'Y'
      },
      deleteParams: {},
      editParams: {},
      addParams: {},
      columns: [
        {
          label: '房屋地址',
          prop: 'fwdzxz',
          width: '430px',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            return (
              <el-link
                style="text-overflow: ellipsis;width: 100%;overflow: hidden;display: block;"
                type="primary"
                onClick={() => this.getHouseInfo(row)}
              >
                {row.fwdzxz}
              </el-link>
            )
          }
        },
        {
          label: '房屋类别',
          prop: 'fwlx',
          width: '120px',
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.ga_fwlb
            return <dict-tag options={val} value={row.fwlx} />
          },
          dict: 'ga_fwlb'
        },
        {
          label: '房屋用途',
          prop: 'fwyt',
          dict: 'ga_fwyt',
          width: '80px',
          'show-overflow-tooltip': true,
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.ga_fwyt
            return <dict-tag options={val} value={row.fwyt} />
          }
        },
        {
          label: '房屋面积',
          prop: 'fwmj',
          width: '80px',
          show: false
        },
        {
          label: '房屋间数',
          prop: 'fwjs',
          width: '80px',
          show: false
        },
        {
          label: '产权性质',
          prop: 'fwcqxz',
          dict: 'ga_fwcq',
          width: '120px',
          show: false,
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.ga_fwcq
            return <dict-tag options={val} value={row.fwcqxz} />
          }
        },
        {
          label: '房屋产权证号',
          prop: 'fwcqzh',
          show: false,
          width: '120px'
        },
        {
          label: '房主姓名',
          prop: 'fzxm',
          width: '100px'
        },
        {
          label: '房主身份证号',
          prop: 'fzzjhm',
          width: '150px',
          render: (h, { row }) => {
            const val = formatIdCard(row.fzzjhm)
            return <span>{val}</span>
          }
        },
        {
          label: '房主电话',
          prop: 'fzlxfs',
          width: '130px',
          show: false
        },
        {
          label: '房主住址',
          prop: 'fzxjxz',
          width: '220px',
          show: false
        },
        {
          label: '是否出租房屋',
          prop: 'sfczfw',
          dict: 'sys_yes_no',
          width: '110px',
          show: false,
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.sys_yes_no
            return <dict-tag options={val} value={row.sfczfw} />
          }
        },
        {
          label: '出租用途',
          prop: 'czyt',
          dict: 'gb_czyt',
          width: '80px',
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.gb_czyt
            return <dict-tag options={val} value={row.czyt} />
          }
        },
        {
          label: '房屋承租情况',
          prop: 'fwczqk',
          dict: 'zdy_fwczqk',
          width: '100px',
          show: false,
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.zdy_fwczqk
            return <dict-tag options={val} value={row.fwczqk} />
          }
        },
        {
          label: '承租人',
          prop: 'czrxm',
          width: '100px'
        },
        {
          label: '承租人证件类型',
          prop: 'czrzjdm',
          dict: 'ga_zjzl',
          width: '150px',
          show: false,
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.ga_zjzl
            return <dict-tag options={val} value={row.czrzjdm} />
          }
        },
        {
          label: '承租人证件号码',
          prop: 'czrzjhm',
          width: '170px',
          render: (h, { row }) => {
            const val = formatIdCard(row.czrzjhm)
            return <span>{val}</span>
          }
        },
        {
          label: '承租人联系方式',
          prop: 'czrlxfs',
          show: false,
          width: '130px'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          width: '160px',
          render: (h, { row }) => {
            const val = formatDate(row.createTime)
            return <span>{val}</span>
          }
        },
        {
          label: '操作',
          prop: 'action',
          align: 'center',
          fixed: 'right',
          width: '200px',
          render: (h, { row, column, index }) => {
            return (
              <span>
                <VTableCell
                  type="档案"
                  // icon="el-icon-document"
                  // title={row.xm}
                  promiseStr='jcyw:syfw:czfw:dangan'
                  onClick={() => this.getHouseInfo(row)}
                />
                <VTableCell
                  type="修改"
                  // icon="el-icon-edit"
                  promiseStr='jcyw:syfw:czfw:edit'
                  onClick={() => this.onEdit(row)}
                />
                <VTableCell
                  type="删除"
                  // icon="el-icon-delete"
                  // title={row.fwdzxz}
                  promiseStr='jcyw:syfw:czfw:remove'
                  onClick={() => this.onDel(row)}
                />
              </span>
            )
          }
        }
      ],
      tableData: (parameter) => {
        return query({ ...parameter, ...this.queryParams })
      },
      title: '',
      open: false,
      form: {
        fzxm: '',
        fzlxfs: '',
        fzxjxz: '',
        fwyt: '',
        fwmj: '',
        fwlx: '',
        fwjs: '',
        fwdzxz: '',
        fwdzid: '',
        fwcqxz: '',
        fwcqzh: '',
        id: '',
        sfczfw: 'Y',
        czyt: '',
        czrxm: '',
        czrzjdm: '',
        czrzjhm: '',
        czrlxfs: '',
        fwzp: '',
        fwczqk: ''
      },
      // 表单校验
      rules: {
        fwdzxz: [
          { required: true, message: '房屋地址详址不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '房屋地址详址长度必须介于 1 和 50 之间',
            trigger: 'blur'
          }
        ],
        fwdzid: [
          { required: true, message: '房屋地址ID不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '房屋地址ID长度必须介于 1 和 20 之间',
            trigger: 'blur'
          }
        ],
        fzxm: [
          { required: false, message: '请输入', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '输入长度介于1到10个字符之间',
            trigger: 'blur'
          }
        ],
        fzlxfs: [
          {
            required: false,
            pattern:
              /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 11,
            message: '输入长度介于1到11个字符之间',
            trigger: 'blur'
          }
        ],
        czrlxfs: [
          {
            required: false,
            pattern:
              /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 11,
            message: '输入长度介于1到11个字符之间',
            trigger: 'blur'
          }
        ],
        czrzjhm: [{ required: true, message: '请输入', trigger: 'blur' }],
        fzxjxz: [
          { required: false, message: '请输入', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '输入长度介于1到10个字符之间',
            trigger: 'blur'
          }
        ],
        fwmj: [
          { required: false, message: '内容不能为空', trigger: 'change' },
          { validator: checkFwmj, trigger: 'change' },
          {
            min: 1,
            max: 10,
            message: '输入长度介于1到10个字符之间',
            trigger: 'change'
          }
        ],
        fwjs: [
          { required: false, message: '内容不能为空', trigger: 'change' },
          // { validator: checkFwmj, trigger: 'change' },
          {
            min: 1,
            max: 10,
            message: '输入长度介于1到10个字符之间',
            trigger: 'change'
          },
          {
            pattern: /^[0-9][0-9]*$/,
            message: '只允许输入数字',
            trigger: 'change'
          }
        ],
        fwcqzh: [
          { required: false, message: '请输入', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '输入长度介于1到10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      houseData: null,
      religion: [],
      purpose: []
    }
  },
  watch: {
    'form.sfczfw': (val) => {
      if (val == 'Y') {
        this.form.czrzjdm = '111'
      } else {
        this.form.czrzjdm = ''
      }
    }
  },
  mounted () {
    this.initHouseData()
    this.getCZStatistics()
  },
  computed: {
    addColumns () {
      return this.columns.slice(0, this.columns.length - 1).filter((item) => {
        return item.label != '创建时间'
      })
    },
    noRentColumns () {
      return this.columns.slice(0, this.columns.length - 7)
    }
  },
  methods: {
    getCZStatistics () {
      getCZStatistics().then((res) => {
        this.optionList = res.data
      })
    },
    czrxmChange () {
      this.form.czrzjhm = this.form.czrxm.split(',')[1]
      this.form.czrlxfs = this.form.czrxm.split(',')[2]
      this.form.czrxm = this.form.czrxm.split(',')[0]
      // console.log(this.form.czrzjhm, this.form.czrxm, this.form.czrlxfs)
    },
    remoteMethod (value) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.queryPeopleList(value)
      }, 1000)
    },
    queryPeopleList (value) {
      getPeopleList({
        pageNum: 1,
        pageSize: 10,
        xm: value
      }).then((res) => {
        // console.log(res)
        this.peopleList = res.rows
      })
    },
    czrzjdmChange (dict) {
      switch (dict) {
        case '111':
          this.$set(this.rules.czrzjhm, 0, {
            required: true,
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入正确格式',
            trigger: 'blur'
          })
          break
        case '112':
          // alert("fdfdf")
          break
        default:
          break
      }
    },
    removeZp () {
      this.form.fwzp = ''
      this.uploadUrl = ''
    },
    handleFileSuccess (res) {
      // console.log('上传图片', res)
      this.form.fwzp = res.fileName
      this.uploadUrl = process.env.VUE_APP_BASE_FILE_VIEW + res.url
    },
    async fileChange (file, fileList) {
      // console.log(file, fileList)
      // this.fileList = fileList
      // let files = file.raw
    },
    async handleRemove (file, fileList) {
      // console.log(file)
      let res = await removeFile(file.id)
      this.$modal.msgSuccess('删除成功')
    },
    // 获取房屋统计数据
    async initHouseData () {
      this.religion = []
      this.purpose = []
      let houseTotalNum = await getCzfwCount()
      let rentHouseNum = await getCzfwlbCount()
      let purpose = await getCzfwytCount()
      this.houseData = houseTotalNum.data
      for (let k in rentHouseNum.data) {
        this.religion.push({
          value: rentHouseNum.data[k],
          name: k,
          percent: `${rentHouseNum.data[k]}`
        })
      }
      for (let k in purpose.data) {
        this.purpose.push({
          value: purpose.data[k],
          name: k,
          percent: `${purpose.data[k]}`
        })
      }
      // console.log(purpose)
    },
    // 重置
    onReset () {
      this.queryParams = {}
      this.queryParams.sfczfw = "Y"
      this.$refs.table.refresh()
    },
    // 新增
    async onAdd () {
      this.open = true
      this.title = '新增'
    },
    // 修改
    onEdit (row) {
      // console.log(row)
      for (let k in this.form) {
        this.form[k] = row[k]
      }
      if (this.form.fwzp != '' && this.form.fwzp != null) {
        this.uploadUrl = process.env.VUE_APP_BASE_FILE_VIEW + this.form.fwzp
      } else {
        this.uploadUrl = ''
      }
      if (row.czrzjdm == null) {
        this.form.czrzjdm = '111'
      }
      this.open = true
      this.title = '修改出租房屋信息'
    },
    // 删除
    async onDel (row) {
      this.$confirm('确定删除吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (!row.id && !row.fwdzid) return
          let interfaceRes = await deleteList(row.id, row.fwdzid)
          if (!interfaceRes) return
          this.$modal.msgSuccess('删除成功')
          await this.getCZStatistics()
          this.$refs.table.refresh()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getHouseInfo (row) {
      localStorage.setItem('fwbqqxzf', JSON.stringify(['jcyw:syfw:czfw:fwbq']))
      this.$router.push({
        name: 'Fwda',
        params: row
      })
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        fzxm: '',
        fzlxfs: '',
        fzxjxz: '',
        fwyt: '',
        fwmj: '',
        fwlx: '',
        fwjs: '',
        fwdzxz: '',
        fwdzid: '',
        fwcqxz: '',
        fwcqzh: '',
        id: '',
        sfczfw: 'Y',
        czyt: '',
        czrxm: '',
        czrzjdm: '',
        czrzjhm: '',
        czrlxfs: '',
        fwzp: '',
        fwczqk: ''
      }
    },

    /** 提交按钮 */
    async submitForm () {
      let validateRes = await this.valiteForm()
      if (!validateRes) return
      this.open = false
      if (this.title == '新增') {
        let interfaceRes = await add(this.form)
        if (!interfaceRes) return
        this.$modal.msgSuccess('新增成功')
        this.$refs.table.refresh()
      } else {
        let interfaceRes = await edit(this.form)
        if (!interfaceRes) return
        this.$modal.msgSuccess('修改成功')
        await this.initHouseData()
        this.timer = new Date().getTime()
        this.$refs.table.refresh()
      }
      await this.getCZStatistics()
      this.reset()
    },
    valiteForm () {
      return new Promise((resolve) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
.xzmainwei {
  width: 100%;
  height: 164px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
::v-deep .el-form.mb-6px .el-form-item__label {
  text-align: left;
  // text-align-last: justify;
  // text-align: justify;
  // text-justify: distribute-all-lines;
}
.h-full {
  height: calc(100% - 39px);
}

.white-space-nowrap {
  white-space: nowrap;
}
.el-select {
  width: 100%;
}
.padding-10 {
  box-sizing: border-box;
  padding: 10px;
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
<style>
.position-br {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
/* 滚动条样式 */
div::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
div::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
div::-webkit-scrollbar-thumb {
  background: #d8d8d8;
  border-radius: 5px;
}
</style>
