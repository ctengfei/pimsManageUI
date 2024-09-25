<template>
  <div class="flex flex-col xzMain" style="height: 100%">
    <el-row class="xztongji">
      <el-row :gutter="10" class="xztongjiBox">
        <el-col :span="4">
          <Population class="xzmain" :optionObj="optionObj"></Population>
        </el-col>
        <el-col :span="5">
          <Sex class="xzmain" :sexList="sexList"></Sex>
        </el-col>
        <el-col :span="5">
          <Religion class="xzmain" :zongjiao="zongjiao"></Religion>
        </el-col>
        <el-col :span="10">
          <Nation class="xzmain" :minzu="minzu"></Nation>
        </el-col>
      </el-row>
    </el-row>
    <div class="app-container xzysBox">
      <VTable
        class="xzgdBox"
        rowKey="id"
        ref="table"
        :showIndex="true"
        :data="tableData"
        :columns="columns"
        label-width="72px"
        @on-search="onSearch"
        @on-reset="onReset"
        @selection-change="handleSelectionChange"
        style="height: calc(100% - 38px); overflow-y: scroll"
      >
        <template #search>
          <VTableSearchItem label="姓名">
            <el-input
              v-model="queryParams.xm"
              placeholder="请输入姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </VTableSearchItem>
          <VTableSearchItem label="性别">
            <el-select
              v-model="queryParams.xb"
              placeholder="请选择性别"
              clearable
            >
              <el-option
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </VTableSearchItem>
          <!-- <VTableSearchItem label="归属机关党委">
          <el-input
            v-model="queryParams.gsjgdw"
            placeholder="请输入归属机关党委"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </VTableSearchItem>
        <VTableSearchItem label="所属党支部">
          <el-input
            v-model="queryParams.ssdzb"
            placeholder="请输入所属党支部"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </VTableSearchItem> -->
        </template>
        <template #operate>
          <el-row :gutter="8" type="flex">
            <el-col>
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['zhzz:jcyw:syrk:dygl:add']"
                >新增</el-button
              >
            </el-col>
            <!--
          <el-col>
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete"
              v-hasPermi="['zhzz:jcyw:syrk:dygl:remove']"
              :disabled="hasSelected"
              >删除</el-button
            >
          </el-col>
          -->
          </el-row>
        </template>
      </VTable>
      <el-drawer
        :key="date"
        :title="title"
        :visible.sync="open"
        size="40%"
        direction="rtl"
        :wrapperClosable="true"
        :destroy-on-close="true"
      >
        <div class="drawerForm-container">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :disabled="isDisabled"
            label-width="100px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="xm">
                  <el-input v-model="form.xm" placeholder="请输入姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号码" prop="sfzhm">
                  <el-input
                    v-model="form.sfzhm"
                    placeholder="请输入身份证号码"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生日期" prop="csrq">
                  <el-date-picker
                    clearable
                    size="small"
                    v-model="form.csrq"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="暂无信息"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别" prop="xb">
                  <el-select
                    v-model="form.xb"
                    clearable
                    placeholder="请选择性别"
                  >
                    <el-option
                      v-for="dict in dict.type.sys_user_sex"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="民族" prop="mz">
                  <el-select
                    v-model="form.mz"
                    clearable
                    placeholder="请选择民族"
                  >
                    <el-option
                      v-for="dict in dict.type.gb_mz"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="籍贯" prop="jg">
                  <el-cascader
                    v-model="form.jg"
                    :options="options"
                    :props="areaProps"
                    clearable
                    style="width: 100%"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="籍贯详址" prop="jgxxdz">
                  <el-input
                    v-model="form.jgxxdz"
                    placeholder="请输入籍贯详细地址"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机" prop="dh">
                  <el-input v-model="form.dh" placeholder="请输入手机" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学历" prop="xl">
                  <el-select
                    v-model="form.xl"
                    clearable
                    placeholder="请选择学历"
                  >
                    <el-option
                      v-for="dict in dict.type.gb_xldm"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="党支部" prop="ssdzb">
                  <el-select
                    :loading="loading"
                    @visible-change="loseFocus"
                    filterable
                    remote
                    clearable
                    :remote-method="enterQueryDzb"
                    v-model="form.ssdzb"
                    placeholder="请选择党支部"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dzbList"
                      :key="item.id"
                      :label="item.dzbmc"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机关党委" prop="gsjgdw">
                  <el-input
                    v-model="form.gsjgdw"
                    placeholder="请输入归属机关党委"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="党工委" prop="ssgdw">
                  <el-input
                    v-model="form.ssgdw"
                    placeholder="请输入所属党工委"
                  />
                </el-form-item>
              </el-col>
              <!--<el-col :span="12">
              <el-form-item label="角色"
                            prop="js">
                <el-input v-model="form.js"
                          placeholder="请输入角色" />
              </el-form-item>
            </el-col>-->
              <el-col :span="12">
                <el-form-item label="职位" prop="zw">
                  <el-input v-model="form.zw" placeholder="请输入职位" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入党日期" prop="rdrq">
                  <el-date-picker
                    clearable
                    size="small"
                    v-model="form.rdrq"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择入党日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <!--<el-col :span="12">
              <el-form-item label="转正日期"
                            prop="zzrq">
                <el-date-picker clearable
                                size="small"
                                v-model="form.zzrq"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>-->

              <!--<el-col :span="12">
              <el-form-item label="是否流动党员"
                            prop="sflddy">
                <el-select v-model="form.sflddy"
                           placeholder="请选择是否流动党员">
                  <el-option v-for="dict in dict.type.sys_yes_no"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
              <!--<el-col :span="12">
              <el-form-item label="应缴党费"
                            prop="yjdf">
                <el-input v-model="form.yjdf"
                          placeholder="请输入应缴党费" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="党费说明"
                            prop="dfsm">
                <el-input v-model="form.dfsm"
                          placeholder="请输入党费说明" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账户"
                            prop="zh">
                <el-input v-model="form.zh"
                          placeholder="请输入账户" />
              </el-form-item>
            </el-col>-->
            </el-row>
            <el-row>
              <el-form-item label="党员照片：">
                <el-upload
                  ref="upload"
                  :headers="uploadHeaders"
                  :limit="1"
                  :on-change="fileChange"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                  :action="uploadUrl"
                  accept="image/jpeg,image/gif,image/png"
                  list-type="picture-card"
                  :auto-upload="true"
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
              </el-form-item>
            </el-row>
          </el-form>
        </div>
        <div class="drawer__footer__right">
          <el-button type="primary" @click="submitForm"  icon="el-icon-circle-check" v-if="!isDisabled">确 定</el-button>
          <el-button type="primary" @click="cancel" icon="el-icon-circle-close" v-if="isDisabled">关 闭</el-button>
          <el-button @click="cancel" icon="el-icon-circle-close" v-if="!isDisabled">取 消</el-button>

        </div>
      </el-drawer>
      <el-dialog
        title="图片预览"
        :visible.sync="previewDialogVisible"
        width="70%"
        class="dialog-picture"
      >
        <img :src="imgUrl" alt="" class="previewImg" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDyCount, getCountBytype } from '@/api/djyl/djyl'
import {
  listDygl,
  getDygl,
  delDygl,
  addDygl,
  updateDygl
} from '@/api/system/dygl'
import { getToken } from '@/utils/auth'
import { getAreaTree } from '@/api/jcyw/syrk/hjrk'
import { listDzzgl, getDzzgl } from '@/api/system/dzzgl'

export default {
  name: 'Dygl',
  dicts: ['sys_user_sex', 'gb_xldm', 'gb_mz', 'sys_yes_no'],
  components: {
    Population: () => import('./components/Population'),
    Sex: () => import('./components/Sex'),
    Nation: () => import('./components/Nation'),
    Religion: () => import('./components/Religion')
  },
  data() {
    return {
      optionObj: null,
      sexList: [],
      zongjiao: [],
      minzu: [],
      dzbList: [],
      loading: true,
      date: new Date().getTime(),
      tableData: (parameter) => {
        return listDygl({ ...parameter, ...this.queryParams })
      },
      columns: [
        {
          label: '姓名',
          prop: 'xm',
          minWidth: '120px'
        },
        {
          label: '性别',
          prop: 'xb',
          minWidth: '120px',
          render: (h, { row }) => {
            const val = this.dict?.type?.sys_user_sex
            return <dict-tag options={val} value={row.xb} />
          }
        },
        {
          label: '归属机关党委',
          prop: 'gsjgdw',
          minWidth: '120px'
        },
        {
          label: '所属党支部',
          prop: 'ssdzb',
          minWidth: '120px',
          render: (h, { row }) => {
            let ssdzb = row.ssdzb
            return <span>{this.getssdzbLabel(ssdzb)}</span>
          }
        },
        {
          label: '身份证号码',
          prop: 'sfzhm',
          minWidth: '150px'
        },
        {
          label: '学历',
          prop: 'xl',
          minWidth: '120px',
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_xldm
            return <dict-tag options={val} value={row.xl} />
          }
        },
        {
          label: '操作',
          prop: 'action',
          align: 'center',
          minWidth: '150px',
          fixed: 'right',
          render: (h, { row }) => {
            return (
              <span>
                <VTableCell
                  type="查看"
                  icon="el-icon-view"
                  promiseStr='zhzz:jcyw:syrk:dygl:view'
                  onClick={() => this.onSee(row)}
                />
                <VTableCell
                  type="修改"
                  icon="el-icon-edit"
                  promiseStr='zhzz:jcyw:syrk:dygl:edit'
                  onClick={() => this.handleUpdate(row)}
                />
                <VTableCell
                  type="删除"
                  icon="el-icon-delete"
                  promiseStr='zhzz:jcyw:syrk:dygl:remove'
                  onClick={() => this.handleDelete(row)}
                />
              </span>
            )
          }
        }
      ],
      rules: {
        dh: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        mz: [{ required: true, message: '请选择民族', trigger: 'change' }],
        // sfzhm: [
        //   {
        //     required: true,
        //     pattern:
        //       /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
        //     message: '请输入正确的身份证号',
        //     trigger: 'blur'
        //   }
        // ],
        xm: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        xb: [{ required: true, message: '请选择性别', trigger: 'change' }],
        ssdzb: [
          { required: true, message: '请选择所属党支部', trigger: 'change' }
        ]
      },
      hasSelected: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 智慧综治-基础业务-实有人口-党员管理表格数据
      dyglList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        dyzp: null,
        zh: null,
        gsjgdw: null,
        ssdzb: null,
        js: null,
        xm: null,
        sfzhm: null,
        xb: null,
        csrq: null,
        mz: null,
        dh: null,
        zw: null,
        rdrq: null,
        zzrq: null,
        jg: null,
        jgxxdz: null,
        xl: null,
        yjdf: null,
        sflddy: null,
        dfsm: null,
        ssgdw: null,
        userId: null,
        deptId: null,
        uUserId: null,
        uDeptId: null
      },
      // 表单参数
      form: {},
      fileList: [],
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/common/upload',
      imgUrl: '',
      previewDialogVisible: false,
      options: [],
      areaProps: {
        value: 'areaCode',
        label: 'areaName',
        children: 'children',
        emitPath: false
      },
      addressList: [],
      isDisabled: false
    }
  },
  computed: {
    getssdzbLabel() {
      return function (data) {
        var label
        for (let i = 0; i < this.dzbList.length; i++) {
          if (data == this.dzbList[i].id) {
            label = this.dzbList[i].dzbmc
          }
        }
        return label
      }
    }
  },
  created() {
    getAreaTree().then((res) => {
      if (res.code === 200) {
        this.options = res.data
      }
    })
    this.listDzzgl()
    this.getTongji()
  },
  methods: {
    getTongji() {
      // 党员总数
      getDyCount().then((res) => {
        if (res.code == 200 && res.count) {
          this.optionObj = {
            name: '党员',
            num: res.count
          }
        }
      })
      // 性别
      getCountBytype({ type: 'xb' }).then((res) => {
        if (res.data) {
          res.data.forEach((item) => {
            this.sexList.push({
              name: item.lable,
              value: item.num
            })
          })
        }
      })
      // 学历
      getCountBytype({ type: 'xl' }).then((res) => {
        if (res.data) {
          res.data.forEach((item) => {
            this.zongjiao.push({
              name: item.lable,
              value: item.num
            })
          })
        }
      })
      // 民族
      getCountBytype({ type: 'mz' }).then((res) => {
        if (res.data) {
          res.data.forEach((item) => {
            this.minzu.push({
              name: item.lable,
              value: item.num
            })
          })
        }
      })
    },
    listDzzgl() {
      listDzzgl({
        pageNum: 1,
        pageSize: 10
      }).then((res) => {
        this.dzbList = res.rows.slice(0, 10)
        this.loading = false
      })
    },
    loseFocus(val) {
      if (val) {
        this.loading = true
        this.dzbList = []
        setTimeout(() => {
          this.listDzzgl()
        }, 1000)
      }
    },
    enterQueryDzb(val) {
      this.loading = true
      setTimeout(() => {
        listDzzgl({
          dzbmc: val
        }).then((res) => {
          this.$nextTick(() => {
            this.dzbList = res.rows.slice(0, 10)
            this.loading = false
          })
        })
      }, 500)
    },
    fileChange(file, fileList) {
      this.fileList = fileList
    },
    handleExceed() {
      this.$message.warning(`最多上传 1 张图片`)
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
    handlePictureCardPreview(file) {
      this.imgUrl = file.url
      this.previewDialogVisible = true
    },
    handleRemove(file, fileList) {
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].uid == file.uid) {
          this.fileList.splice(i, 1)
        }
      }
    },
    onSearch() {
      this.$refs.table.refresh()
    },
    // 重置
    onReset() {
      this.queryParams = {}
      this.$refs.table.refresh()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        dyzp: null,
        zh: null,
        gsjgdw: null,
        ssdzb: null,
        js: null,
        xm: null,
        sfzhm: null,
        xb: null,
        csrq: null,
        mz: null,
        dh: null,
        zw: null,
        rdrq: null,
        zzrq: null,
        jg: '',
        jgxxdz: null,
        xl: null,
        yjdf: null,
        sflddy: null,
        dfsm: null,
        ssgdw: null,
        userId: null,
        deptId: null,
        createTime: null,
        uUserId: null,
        uDeptId: null,
        updateTime: null,
        delFlag: null,
        remark: null
      }
      this.fileList = []
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.onSearch()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (selection.length) {
        this.hasSelected = false
      } else {
        this.hasSelected = true
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.isDisabled = false
      this.title = '添加党员信息'
    },
    /** 查看按钮操作 */
    onSee(row) {
      this.reset()
      const id = row.id || this.ids
      this.form = JSON.parse(JSON.stringify(row))
      this.form.xb = this.form.xb.toString()
      this.open = true
      this.isDisabled = true
      this.title = '查看党员信息'
      if (this.form.dyzp != '' && this.form.dyzp != null) {
        this.fileList = []
        this.fileList.push({
          url: process.env.VUE_APP_BASE_FILE_VIEW + this.form.dyzp,
          response: {
            url: process.env.VUE_APP_BASE_FILE_VIEW + this.form.dyzp
          }
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      this.form = JSON.parse(JSON.stringify(row))
      this.form.xb = this.form.xb.toString()
      this.open = true
      this.isDisabled = false
      this.title = '修改党员信息'
      if (this.form.dyzp != '' && this.form.dyzp != null) {
        this.fileList = []
        this.fileList.push({
          url: process.env.VUE_APP_BASE_FILE_VIEW + this.form.dyzp,
          response: {
            url: process.env.VUE_APP_BASE_FILE_VIEW + this.form.dyzp
          }
        })
      }
    },
    /** 提交按钮 */
    submitForm() {
      if (this.fileList.length != 0) {
        this.form.dyzp = this.fileList[0].response.fileName
      } else {
        this.form.dyzp = ''
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDygl(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.onSearch()
            })
          } else {
            addDygl(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.onSearch()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除？')
        .then(function () {
          return delDygl(ids)
        })
        .then(() => {
          this.onSearch()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/dygl/export',
        {
          ...this.queryParams
        },
        `dygl_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="less" scoped>
.app-container {
  overflow-y: scroll;
  height: calc(100% - 39px);
  padding: 10px;
}
.el-date-picker,
.el-select {
  width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
</style>
