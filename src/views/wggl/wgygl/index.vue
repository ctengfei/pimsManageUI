<template>
  <div class="wgygl">
    <el-row type="flex"
            justify="space-between"
            style="margin-left: 0px; margin-right: 0px; height: 100%">
      <el-col :xs="24"
              :sm="24"
              :md="4"
              :lg="4"
              :xl="4"
              style="background-color: white"
              class="treeBox">
        <el-input v-model="deptName"
                  placeholder="请输入网格名称"
                  clearable
                  size="small"
                  prefix-icon="el-icon-search"
                  style="margin-bottom: 5px; padding: 8px; box-sizing: border-box" />
        <el-tree :data="deptOptions"
                 :props="defaultProps"
                 node-key="id"
                 :highlight-current="true"
                 :filter-node-method="filterNode"
                 ref="tree"
                 class="tree"
                 :default-expanded-keys="deptTreeExpanded"
                 @node-click="handleNodeClick" />
      </el-col>
      <el-col :xs="24"
              :sm="24"
              :md="20"
              :lg="20"
              :xl="20"
              style="margin: 0; box-sizing: border-box; padding: 0; height: 100%">
        <el-row class="xzBox">
          <!-- 主体布局 -->
          <el-row :gutter="10"
                  style="padding-bottom: 10px">
            <el-col :span="5"
                    class="xztongjiBox">
              <Population :data="gridTeam"
                          :key="key" />
            </el-col>
            <el-col :span="7"
                    class="xztongjiBox">
              <Partymunber :partymunber="partymunber"
                           :gridTeam="gridTeam"
                           :key="key" />
            </el-col>
            <el-col :span="7"
                    class="xztongjiBox">
              <Role :jsdata="roleData"
                    :key="key" />
            </el-col>
            <el-col :span="5"
                    class="xztongjiBox">
              <Sex :data="sex"
                   :key="key" />
            </el-col>
          </el-row>
          <el-row class="xzysBox">
            <!--用户数据-->
            <el-col :span="24"
                    :xs="24"
                    class="xzgdBox">
              <VTable class="xzgdBox"
                      rowKey="getId"
                      ref="table"
                      :showIndex="true"
                      :data="userList"
                      :columns="columns"
                      :selection="false"
                      label-width="90px"
                      @on-search="onSearch"
                      @on-reset="onReset"
                      :key="key">
                <template #search>
                  <VTableSearchItem label="姓名">
                    <el-input v-model="queryParams.nickName"
                              placeholder="请输入姓名"
                              clearable
                              size="small"></el-input>
                  </VTableSearchItem>
                  <VTableSearchItem label="网格角色">
                    <el-select v-model="queryParams.roleIds[0]"
                               placeholder="请选择"
                               size="small"
                               clearable>
                      <el-option v-for="item in roleOptions"
                                 :key="item.roleId"
                                 :label="item.roleName"
                                 :value="item.roleId"
                                 :disabled="item.status == 1"></el-option>
                    </el-select>
                  </VTableSearchItem>
                  <VTableSearchItem label="联系方式">
                    <el-input v-model="queryParams.phonenumber"
                              placeholder="请输入手机号码"
                              clearable
                              size="small" />
                  </VTableSearchItem>
                  <VTableSearchItem label="性别">
                    <el-select v-model="queryParams.sex"
                               placeholder="请选择"
                               clearable
                               size="small">
                      <el-option v-for="dict in dict.type.sys_user_sex"
                                 :key="dict.value"
                                 :label="dict.label"
                                 :value="dict.value"></el-option>
                    </el-select>
                  </VTableSearchItem>
                </template>
                <template #advanced>
                  <VTableSearchItem label="政治面貌">
                    <el-select v-model="queryParams.political"
                               placeholder="请选择"
                               clearable
                               size="small">
                      <el-option v-for="dict in dict.type.gb_zzmm"
                                 :key="dict.value"
                                 :label="dict.label"
                                 :value="dict.value"></el-option>
                    </el-select>
                  </VTableSearchItem>
                  <VTableSearchItem label="身份证号">
                    <el-input v-model="queryParams.idCard"
                              placeholder="请输入身份证号"
                              clearable
                              size="small" />
                  </VTableSearchItem>
                </template>
                <template #operate>
                  <el-row :gutter="8"
                          type="flex">
                    <el-col>
                      <el-button type="primary"
                                 plain
                                 size="mini"
                                 v-hasPermi="['wggl:wgygl:add']"
                                 @click="handleAdd">
                        <i class="el-icon-plus" />
                        新增
                      </el-button>
                    </el-col>
                    <!--
                    <el-col>
                      <el-button
                        type="info"
                        plain
                        size="mini"
                        disabled
                        @click="handleImport"
                      >
                        <i class="el-icon-upload2" />
                        导入</el-button
                      >
                    </el-col>
                    -->
                    <el-col>
                      <el-button type="warning"
                                 plain
                                 size="mini"
                                 v-hasPermi="['wggl:wgygl:export']"
                                 @click="handleExport">
                        <i class="el-icon-download" />
                        导出
                      </el-button>
                    </el-col>
                  </el-row>
                </template>
              </VTable>
            </el-col>
          </el-row>
        </el-row>
        <el-drawer :title="title"
                   :visible.sync="open"
                   size="40%"
                   direction="rtl"
                   :wrapperClosable="true">
          <div style="width: 100%; padding: 20px">
            <el-form ref="form"
                     :model="form"
                     :rules="rules"
                     label-width="100px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="身份证号：">
                    <el-input v-model="form.idCard"
                              placeholder="请输入身份证号"
                              maxlength="18" show-word-limit />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="姓名："
                                prop="nickName">
                    <el-input v-model="form.nickName"
                              placeholder="请输入姓名" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="政治面貌：">
                    <el-select v-model="form.political"
                               placeholder="请选择政治面貌">
                      <el-option v-for="dict in dict.type.gb_zzmm"
                                 :key="dict.value"
                                 :label="dict.label"
                                 :value="dict.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别：">
                    <el-select v-model="form.sex"
                               placeholder="请选择性别">
                      <el-option v-for="dict in dict.type.sys_user_sex"
                                 :key="dict.value"
                                 :label="dict.label"
                                 :value="dict.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系方式："
                                prop="phonenumber">
                    <el-input v-model="form.phonenumber"
                              placeholder="请输入联系方式"
                              maxlength="11" show-word-limit />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角色："
                                prop="roleIds">
                    <el-select v-model="form.roleIds"
                               multiple
                               placeholder="请选择角色">
                      <el-option v-for="item in roleOptions"
                                 :key="item.roleId"
                                 :label="item.roleName"
                                 :value="item.roleId"
                                 :disabled="item.status == 1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="所属网格："
                                prop="deptId">
                    <el-select class="main-select-tree"
                               ref="selectTree"
                               v-model="form.deptId"
                               v-if="open">
                      <el-option v-for="item in formatData(deptOptions)"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"
                                 style="display: none" />
                      <el-tree :data="deptOptions"
                               :props="defaultProps"
                               node-key="id"
                               ref="tree1"
                               :highlight-current="true"
                               :auto-expand-parent="true"
                               :default-expanded-keys="defaultTreeArr"
                               :current-node-key="defaultTreeArr[0]"
                               @node-click="handleNodeClick1"
                               placeholder="请选择所属网格" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职务："
                                prop="position">
                    <el-input v-model="form.position"
                              placeholder="请输入职务"
                              maxlength="50"
                              show-word-limit />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="平台账号："
                                prop="userName">
                    <el-input v-model="form.userName"
                              placeholder="请输入平台账号（推荐手机号)"
                              maxlength="30" show-word-limit/>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="管辖范围："
                                prop="remark">
                    <el-input v-model="form.remark"
                              :rows="4"
                              placeholder="请输入管辖范围描述"
                              type="textarea" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-alert title="平台账号使用提示"
                        type="info"
                        description="建议手机号或身份证号可作为平台账号登录使用，新创建的网格队伍用户默认密码为：123456，请及时提醒用户登录平台修改密码。"
                        show-icon>
              </el-alert>
            </el-form>
          </div>
          <div class="drawer__footer__right">
            <el-button icon="el-icon-circle-check"
                       type="primary"
                       @click="submitForm">确 定</el-button>
            <el-button icon="el-icon-circle-close"
                       @click="cancel">取 消</el-button>
          </div>
        </el-drawer>

        <!-- 用户导入对话框 暂时不提供该功能-->
        <el-dialog :title="upload.title"
                   :visible.sync="upload.open"
                   width="600px"
                   append-to-body
                   class="text-align-center"
                   custom-class="dialog-style">
          <el-upload ref="upload"
                     :limit="1"
                     accept=".xlsx, .xls"
                     :headers="upload.headers"
                     :action="upload.url + '?updateSupport=' + upload.updateSupport"
                     :disabled="upload.isUploading"
                     :on-progress="handleFileUploadProgress"
                     :on-success="handleFileSuccess"
                     :auto-upload="false"
                     drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip text-center"
                 slot="tip">
              <div class="el-upload__tip"
                   slot="tip">
                <el-checkbox v-model="upload.updateSupport" />
                是否更新已经存在的用户数据
              </div>
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary"
                       :underline="false"
                       style="font-size: 12px; vertical-align: baseline"
                       @click="importTemplate">下载模板</el-link>
            </div>
          </el-upload>
          <div slot="footer"
               class="dialog-footer">
            <el-button type="primary"
                       @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { encrypt, decrypt, RSAencrypt, RSAdecrypt } from '@/utils/jsencrypt'
import {
  listTable,
  getUser,
  delUser,
  addUser,
  updateUser,
  getInfo,
  selectWgyCount,
  getAdminForDept,
  getRoleCountByUserId,
  getRole
} from '@/api/wggl/wgygl'
import { getToken } from '@/utils/auth'
import { formatDate, formatIdCard, formatPhone } from '@/utils'
import { treeselect } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listAllRole } from '@/api/system/role'
export default {
  name: 'Wgygl',
  dicts: [
    'wg_jsgzpz',
    'sys_normal_disable',
    'sys_user_sex',
    'gb_zzmm',
    'sys_common_status'
  ],
  components: {
    Treeselect,
    Population: () => import('./components/Population'),
    Sex: () => import('./components/Sex'),
    Role: () => import('./components/Role'),
    Partymunber: () => import('./components/Partymunber.vue')
  },
  data () {
    return {
      //默认level
      defaultLevel:"1",
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
      // 用户表格数据
      userList: (parameter) => {
        return listTable({ ...parameter, ...this.queryParams })
      },
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 网格角色选项
      roleOptions: [],
      deptTreeExpanded: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      openSearchBar: false,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken(),'Client-Type':'manageWeb' },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      searchBarItems: [
        {
          label: '用户姓名',
          prop: 'nickName',
          placeholder: '请输入用户姓名',
          /*
          maxlength: 8,
*/
          show: true
        },
        {
          label: '联系方式',
          prop: 'phonenumber',
          placeholder: '请输入联系方式',
          maxlength: 11,
          show: true
        },
        {
          label: '性别',
          prop: 'sex',
          placeholder: '请输入',
          show: this.openSearchBar ? true : false
        },
        {
          label: '身份证号',
          prop: 'idCard',
          placeholder: '请输入身份证号',
          show: this.openSearchBar ? true : false
        },
        {
          label: '网格角色',
          prop: 'roleIds',
          placeholder: '请输入网格角色',
          show: this.openSearchBar ? true : false
        },
        {
          label: '政治面貌',
          prop: 'roleIds',
          placeholder: '请输入政治面貌',
          show: this.openSearchBar ? true : false
        },
        {
          label: '所属网格',
          prop: 'deptId',
          placeholder: '请输入所属网格',
          show: this.openSearchBar ? true : false
        }
      ],
      // 查询参数
      queryParams: {
        nickName: undefined,
        phonenumber: undefined,
        roleIds: [null]
      },
      rolesArr: null,
      // 列信息
      columns: [
        {
          label: '姓名',
          prop: 'nickName',
          minWidth: '100px',
          'show-overflow-tooltip': true
        },
        {
          label: '性别',
          prop: 'sex',
          align: 'center',
          minWidth: '80px',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = this.dict?.type?.sys_user_sex
            return <dict-tag options={val} value={row.sex} />
          }
        },
        {
          label: '身份证号',
          prop: 'idCard',
          minWidth: '160px',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = formatIdCard(row.idCard)
            return <span>{val}</span>
          },
          show: false
        },
        {
          label: '网格角色',
          prop: 'roleIds',
          minWidth: '140px',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            if (this.rolesArr && this.rolesArr.length) {
              let roleId = row.roleIds ? row.roleIds : ''
              let rolesArr = roleId.split(',')
              let roleIds = []
              let roles = this.rolesArr
              for (let i = 0; i < rolesArr.length; i++) {
                for (let k = 0; k < roles.length; k++) {
                  if (Number(rolesArr[i]) == roles[k].roleId) {
                    roleIds.push(roles[k].roleName)
                  }
                }
              }
              let str = roleIds.toString()
              return <span>{str}</span>
            }
          }
        },
        {
          label: '联系方式',
          prop: 'phonenumber',
          minWidth: '120px',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = formatPhone(row.phonenumber)
            return <span>{val}</span>
          }
        },
        {
          label: '政治面貌',
          prop: 'political',
          minWidth: '150px',
          'show-overflow-tooltip': true,
          show: false,
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_zzmm
            return <dict-tag options={val} value={row.political} />
          }
        },
        {
          label: '所属网格',
          prop: 'deptNameDetail',
          minWidth: '240px',
          'show-overflow-tooltip': true
        },
        {
          label: '管辖范围',
          prop: 'remark',
          minWidth: '180px',
          'show-overflow-tooltip': true
        },
        {
          label: '职务',
          prop: 'position',
          minWidth: '140px',
          'show-overflow-tooltip': true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          minWidth: '180px',
          render: (h, { row }) => {
            const val = formatDate(row.createTime)
            return <span>{val}</span>
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
                  type="修改"
                  icon="el-icon-edit"
                  promiseStr='wggl:wgygl:edit'
                  onClick={() => this.handleUpdate(row)}
                />
                <VTableCell
                  type="删除"
                  icon="el-icon-delete"
                  promiseStr='wggl:wgygl:remove'
                  onClick={() => this.handleDelete(row)}
                />
              </span>
            )
          }
        }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '用户名称长度必须介于 2 和 20 之间',
            trigger: 'blur'
          }
        ],
        nickName: [
          {
            required: true,
            message: '用户姓名不能为空',
            trigger: ['blur', 'change']
          },
          {
            required: true,
            pattern: '^[\u4e00-\u9fa5]{1,10}$',
            message: '不支持特殊字符,且长度不能超过10位',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '用户密码长度必须介于 5 和 20 之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        idCard: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        deptId: [
          { required: true, message: '请选择归属部门', trigger: 'blur' }
        ],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      gridTeam: null,
      sex: [],
      roleData: [],
      partymunber: null,
      separator: '',
      defaultTreeArr: [],
      treeClickData: {},
      key: 0
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.initGridRoleSelectOptions()
    this.getTreeselect()
    this.getConfigKey('sys.user.initPassword').then((response) => {
      this.initPassword = response.msg
    })
    this.initGriderTotal()
  },
  mounted () { },
  methods: {
    getId (row) {
      return row.userId + row.roleIds
    },
    formatData (data) {
      let options = []
      data.forEach((item, key) => {
        options.push({ label: item.label, value: item.id })
        if (item.children) {
          item.children.forEach((items, keys) => {
            options.push({ label: items.label, value: items.id })
            if (items.children) {
              items.children.forEach((itemss, keyss) => {
                options.push({ label: itemss.label, value: itemss.id })
                if (itemss.children) {
                  itemss.children.forEach((itemsss, keysss) => {
                    options.push({ label: itemsss.label, value: itemsss.id })
                  })
                }
              })
            }
          })
        }
      })
      return options
    },
    async handleNodeClick1 (node) {
      this.form.deptId = node.id
      let roles = await getRole(node.level)
      if (!roles.data) return
      this.roleOptions = roles.data
    },
    async initGriderTotal () {
      let griderTotalData = await getRoleCountByUserId({
        deptId: this.treeClickData.id
      })
      let griderTotal = griderTotalData.data
      let roleDataArr = [
        {
          value: 0,
          name: '网格指导员',
          percent: 0
        },
        {
          value: 0,
          name: '网格员',
          percent: 0
        },
        {
          value: 0,
          name: '兼职网格员',
          percent: 0
        },
        {
          value: 0,
          name: '网格长',
          percent: 0
        },
        {
          value: 0,
          name: '副网格长',
          percent: 0
        },
        {
          value: 0,
          name: '联户长（单元长）',
          percent: 0
        }
      ]

      for (let j = 0; j < roleDataArr.length; j++) {
        for (let i = 0; i < griderTotal.length; i++) {
          if (roleDataArr[j].name == griderTotal[i].roleName) {
            roleDataArr[j].value = Number(griderTotal[i].countNum)
            roleDataArr[j].percent = Number(griderTotal[i].countNum)
          } else {
            this.gridTeam = Number(griderTotal[i].totalNum)
          }
        }
      }
      this.roleData = roleDataArr
      let selectWgyCountRes = await selectWgyCount({
        deptId: this.treeClickData.id
      })
      if (!selectWgyCountRes) return
      let staticData = selectWgyCountRes.rows
      let nan = 0
      let nv = 0
      let wz = 0
      for (let i = 0; i < staticData.length; i++) {
        if (staticData[i].countType == 'nan') {
          nan = staticData[i].total
        }
        if (staticData[i].countType == 'nv') {
          nv = staticData[i].total
        }
        if (staticData[i].countType == 'wz') {
          wz = staticData[i].total
        }
        if (staticData[i].countType == 'dysl') {
          this.partymunber = staticData[i].total
        }
      }
      this.sex = [
        {
          value: nan,
          name: '男',
          percent: `${nan}`
        },
        {
          value: nv,
          name: '女',
          percent: `${nv}`
        },
        {
          value: wz,
          name: '未知',
          percent: `${wz}`
        }
      ]
    },
    initGridRoleSelectOptions () {
      getUser().then(async (response) => {
        let roleIds = await getInfo()
        if (!roleIds) return
        let roleKey = roleIds.roles[0]
        let dicts = this.dict.type.wg_jsgzpz
        let rolesValue = ''
        if (!dicts) return
        for (var k = 0; dicts.length; k++) {
          let dict = dicts[k]
          if (dict.label === roleKey) {
            rolesValue = dict.value
            break
          }
        }
        // this.roleOptions = this.filterRoles(response.roles, rolesValue)
        this.filterRoles(response.roles, rolesValue)
        // }
        this.rolesArr = response.roles
      })
    },
    getPercentage (val) {
      //百分比必须为0-100，否则报错[Vue warn]:Invalid prop:custom validator check failed for prop "percentage"
      let result = 0
      if (val != null) {
        result = Math.round((val / this.countNum) * 100)
      }
      return result
    },
    onSearch () {
      this.$refs.table.refresh()
    },
    // 重置
    onReset () {
      this.queryParams = {
        nickName: undefined,
        phonenumber: undefined,
        roleIds: [null]
      }
      this.getTreeselect()
      this.$refs.table.refresh()
    },
    // 过滤初始化数据
    filterData (data, pageNum) {
      if (!data || data.length < 1) return
      return data.filter((item, index) => {
        item.index = (pageNum - 1) * 10 + index + 1
        item.userName = item.nickName
        item.deptName = item.dept_name
        item.idCard = item.idCard
        item.roleIds = item.roleIds ? item.roleIds : ''
        let rolesArr = item.roleIds.split(',')
        let roleIds = ''
        if (rolesArr.length > 1) {
          for (let k = 0; k < rolesArr.length; k++) {
            roleIds =
              roleIds +
              ',' +
              (rolesArr[k] =
                rolesArr[k] == '2'
                  ? '综治中心'
                  : rolesArr[k] == '3'
                    ? '网格中心'
                    : rolesArr[k] == '4'
                      ? '网格指导员'
                      : rolesArr[k] == '5'
                        ? '网格员'
                        : rolesArr[k] == '6'
                          ? '兼职网格员'
                          : rolesArr[k] == '7'
                            ? '网格长'
                            : rolesArr[k] == '8'
                              ? '副网格长'
                              : rolesArr[k] == '9'
                                ? '联户长（单元长）'
                                : '查询用户')
          }
          item.roleIds = roleIds.slice(1)
        } else {
          item.roleIds =
            item.roleIds === '2'
              ? '综治中心'
              : item.roleIds === '3'
                ? '网格中心'
                : item.roleIds === '4'
                  ? '网格指导员'
                  : item.roleIds === '5'
                    ? '网格员'
                    : item.roleIds == '6'
                      ? '兼职网格员'
                      : item.roleIds === '7'
                        ? '网格长'
                        : item.roleIds === '8'
                          ? '副网格长'
                          : item.roleIds === '9'
                            ? '联户长（单元长）'
                            : '查询用户'
        }
        return item
      })
    },
    /** 查询用户列表 */
    getList () {
      this.loading = true
      listTable(this.queryParams).then((response) => {
        this.userList = this.filterData(response.rows, this.queryParams.pageNum)
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询部门下拉树结构 */
    getTreeselect () {
      treeselect().then((response) => {
        this.deptOptions = response.data
        this.deptTreeExpanded.push(this.deptOptions[0].id) //默认展开第一个节点
      })
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick (data) {
      // console.log(data)
      this.queryParams.deptId = data.id
      this.treeClickData = data
      this.defaultLevel = data.level
      this.initGriderTotal()
      this.key += 1
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        postIds: [],
        roleIds: [],
        idCard: undefined,
        political: undefined,
        position: undefined
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.form.deptId = this.treeClickData.id
        ? this.treeClickData.id
        : this.deptOptions[0].id
      this.defaultTreeArr = []
      this.defaultTreeArr.push(this.form.deptId)
      getUser().then(async (response) => {
        this.postOptions = response.posts
        // let roleIds = await getInfo()
        // if (!roleIds) return
        // let roleKey = roleIds.user.roles[0].roleKey
        // let roleKey = roleIds.roles[0]
        // if (roleKey === 'admin') {
          // this.roleOptions = response.roles
          let roles = await getRole(this.defaultLevel)
          if (!roles.data) return
          this.roleOptions = roles.data
        // } else {
        //   let dicts = this.dict.type.wg_jsgzpz
        //   let rolesValue = ''
        //   if (!dicts) return
        //   for (var k = 0; dicts.length; k++) {
        //     let dict = dicts[k]
        //     if (dict.label === roleKey) {
        //       rolesValue = dict.value
        //       break
        //     }
        //   }
        //   // this.roleOptions = this.filterRoles(response.roles, rolesValue)
        //   this.filterRoles(response.roles, rolesValue)
        // }
        this.open = true
        this.title = '新增网格人员'
        this.form.password = this.initPassword
      })
    },
    // 过滤网格角色数据
    filterRoles (roles, dictsValue) {
      listAllRole().then((res) => {
        if (!roles) return []
        let dicts = dictsValue.split(',')
        let roleArr = res.data
        let filterData = []
        for (var j = 0; j < dicts.length; j++) {
          for (var i = 0; i < roleArr.length; i++) {
            if (roleArr[i].roleId == dicts[j]) {
              filterData.push(roleArr[i])
            }
          }
        }
        this.roleOptions = filterData
      })
    },
    filterTableMater (code, arr) {
      for (const item of arr) {
        if (item.id === code) return item
        if (item.children && item.children.length) {
          const _item = this.filterTableMater(code, item.children)
          if (_item) return _item
        }
      }
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      // console.log(row)
      this.reset()
      this.defaultTreeArr = []
      this.defaultTreeArr.push(row.deptId)
      const userId = row.userId || this.ids
      let level = this.filterTableMater(row.deptId,this.deptOptions)
      // console.log(level)
      getUser(userId).then(async (response) => {
        this.form = response.data
        this.postOptions = response.posts
        // let roleIds = await getInfo()
        // if (!roleIds) return
        // let roleKey = roleIds.user.roles[0].roleKey
        // let roleKey = roleIds.roles[0]
        // if (roleKey === 'admin') {
          // this.roleOptions = response.roles
          let roles = await getRole(level.level)
          if (!roles.data) return
          this.roleOptions = roles.data
        // } else {
        //   let dicts = this.dict.type.wg_jsgzpz
        //   let rolesValue = ''
        //   if (!dicts) return
        //   for (var k = 0; dicts.length; k++) {
        //     let dict = dicts[k]
        //     if (dict.label === roleKey) {
        //       rolesValue = dict.value
        //       break
        //     }
        //   }
        //   // this.roleOptions = this.filterRoles(response.roles, rolesValue)
        //   this.filterRoles(response.roles, rolesValue)
        // }
        this.form.postIds = response.postIds
        this.form.roleIds = response.roleIds
        this.open = true
        this.title = '修改网格人员'
        this.form.password = ''
      })
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.getWanggezhang()
        }
      })
    },
    submitRequest () {
      //默认密码
      let password = '123456'
      //加密密码
      this.form.password = RSAencrypt(password)
      if (this.form.userId != undefined) {
        updateUser(this.form).then((response) => {
          this.$modal.msgSuccess('修改成功')
          this.open = false
          this.onSearch()
        })
      } else {
        addUser(this.form).then((response) => {
          this.$modal.msgSuccess('新增成功')
          this.open = false
          this.onSearch()
        })
      }
      treeselect().then((response) => {
        this.deptOptions = response.data
        this.initGriderTotal()
        setTimeout(() => {
          this.key += 1
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const userIds = row.userId || this.ids
      this.$modal
        .confirm('是否确认删除用户姓名为"' + row.nickName + '"的数据项？')
        .then(function () {
          return delUser(userIds)
        })
        .then(() => {
          this.onSearch()
          this.initGriderTotal()
          setTimeout(() => {
            this.key += 1
          })
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download(
        'zhzz/wggl/wgygl/export',
        {
          ...this.queryParams
        },
        `网格队伍_${new Date().getTime()}.xlsx`
      )
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate () {
      this.download(
        'system/user/importTemplate',
        {},
        `user_template_${new Date().getTime()}.xlsx`
      )
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
        response.msg +
        '</div>',
        '导入结果',
        { dangerouslyUseHTMLString: true }
      )
      this.getList()
    },
    // 提交上传文件
    submitFileForm () {
      this.$refs.upload.submit()
    },
    columnChange (data) {
      for (let item in this.columns) {
        const key = this.columns[item].key
        this.columns[item].visible = data.includes(key)
      }
    },
    openSearchBarBtn () {
      this.openSearchBar = !this.openSearchBar
    },
    // 获取该网格是否有网格长
    getWanggezhang () {
      let status = this.form.roleIds.indexOf(7)
      let oldName
      if (status != -1) {
        getAdminForDept({
          deptId: this.form.deptId
        }).then((res) => {
          if (res.data && res.data.nickName) {
            oldName = res.data.nickName
            if (oldName != this.form.nickName) {
              this.$confirm(
                `该网格已有网格长${oldName}, 是否替换为${this.form.nickName}?`,
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              ).then(() => {
                this.submitRequest()
              })
            } else {
              this.submitRequest()
            }
          } else {
            this.submitRequest()
          }
        })
      } else {
        this.submitRequest()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
.wgygl {
  width: 100%;
  flex: 1;
  overflow: hidden;
  background-color: #eef2fb;
  .treeBox {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    margin-right: 10px;
    .tree {
      box-sizing: border-box;
      flex: 1;
      // tree上面增加元素 改变第一个数值为0   设置新增的元素  padding-top=10px
      padding: 10px 10px 10px 10px;
    }
  }
  .treeBox::-webkit-scrollbar {
    display: none;
  }
}
.drawer__footer {
  position: absolute;
  bottom: 15px;
  right: 20px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  display: -webkit-box;
  display: -ms-flexbox;
  -webkit-box-pack: flex-end;
}
.el-select {
  width: 100%;
}
</style>
<style>
.el-dialog.dialog-style {
  margin-top: 6vh !important;
  /* margin-right: 0 !important; */
  height: 100vh;
}

.el-dialog.dialog-style .el-dialog__footer {
  position: absolute;
  bottom: 0;
  right: 0;
}
.el-dialog:not(.is-fullscreen) {
  margin-top: 6vh !important;
}
.el-dialog {
  left: none !important;
}
/* 滚动条样式 */
div::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
div::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
div::-webkit-scrollbar-thumb {
  background: #d8d8d8;
  border-radius: 5px;
}
.el-drawer__body {
  overflow: hidden !important;
}

.xzWgyglmain {
  background: white;
  width: 100%;
  height: 145px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
