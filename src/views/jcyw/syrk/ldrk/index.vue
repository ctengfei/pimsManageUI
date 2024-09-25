<template>
  <div class="flex flex-col h-full  app-container">
    <el-row :span="24"
            class="xzBox">
      <el-col class="xztongji">
        <el-row :gutter="10"
                class="xztongjiBox">
          <el-col :span="4">
            <Population class="xzmain"
                        :optionObj="optionObj"></Population>
          </el-col>
          <el-col :span="5">
            <Lryy class="xzmain"
                  :liuRu="liuRu"></Lryy>
          </el-col>
          <el-col :span="5">
            <Zslx class="xzmain"
                  :zhuSuo="zhuSuo"></Zslx>
          </el-col>
          <el-col :span="10">
            <Province class="xzmain"
                      :shengFen="shengFen"></Province>
          </el-col>

        </el-row>
      </el-col>
      <el-row class="xzysBox"
              style="
        overflow-y: scroll;
        height: calc(100% - 230px);
        background: white;
        box-sizing: border-box;
        padding: 0px;
      ">
        <el-col :span="24"
                class="xzgdBox"
                :xs="24">
          <VTable :havecellclick="false"
                  rowKey="idCard"
                  class="xzgdBox"
                  ref="table"
                  :showIndex="true"
                  :selection="false"
                  :data="tableData"
                  :columns="columns"
                  @on-search="onSearch"
                  @on-reset="onReset">
            <!-- label-width="auto"
                label-position="left" -->
            <!-- @currentPageChange="currentPageChange"
          @pageSizeChange="pageSizeChange" -->
            <template #search>
              <VTableSearchItem label="身份证号">
                <el-input v-model="queryParams.sfzhm"
                          placeholder="请输入身份证号"
                          clearable
                          size="small"
                          @keyup.enter.native="onSearch" />
              </VTableSearchItem>
              <VTableSearchItem label="姓名">
                <el-input v-model="queryParams.xm"
                          placeholder="请输入姓名"
                          clearable
                          size="small"
                          @keyup.enter.native="onSearch" />
              </VTableSearchItem>
              <VTableSearchItem label="现住地址">
                <el-input v-model="queryParams.xzdxz"
                          placeholder="请输入现住详细地址"
                          clearable
                          size="small"
                          @keyup.enter.native="onSearch" />
              </VTableSearchItem>

              <VTableSearchItem label="联系方式">
                <el-input v-model="queryParams.lxfs"
                          placeholder="联系方式"
                          clearable
                          size="small"
                          @keyup.enter.native="onSearch" />
              </VTableSearchItem>
              <VTableSearchItem label="流入原因">
                <el-select filterable
                           v-model="queryParams.lryy"
                           placeholder="请选择流入原因"
                           clearable>
                  <el-option v-for="dict in dict.type.ga_ldyy"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
              </VTableSearchItem>
            </template>
              <!-- <template #advanced>
            <VTableSearchItem label="流入原因">
                <el-select filterable
                           v-model="queryParams.lryy"
                           placeholder="请选择流入原因"
                           clearable>
                  <el-option v-for="dict in dict.type.ga_ldyy"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
                <el-input
                v-model="queryParams.lryy"
                placeholder="请输入流入原因"
                clearable
                size="small"
                @keyup.enter.native="onSearch"
              />
              </VTableSearchItem> 
               <VTableSearchItem label="证件类型">
              <el-input
                v-model="queryParams.zjdm"
                placeholder="请输入证件类型"
                clearable
                size="small"
                @keyup.enter.native="onSearch"
              />
            </VTableSearchItem>
            <VTableSearchItem label="证件号码">
              <el-input
                v-model="queryParams.zjhm"
                placeholder="请输入证件号码"
                clearable
                size="small"
                @keyup.enter.native="onSearch"
              />
            </VTableSearchItem>
            <VTableSearchItem label="登记日期">
              <el-date-picker
                clearable
                size="small"
                v-model="queryParams.djrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择登记日期"
                class="!w-full"
              >
              </el-date-picker>
            </VTableSearchItem>
            <VTableSearchItem label="证件到期日期">
              <el-date-picker
                clearable
                size="small"
                v-model="queryParams.zjdqrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择证件到期日期"
                class="!w-full"
              >
              </el-date-picker>
            </VTableSearchItem>
            <VTableSearchItem label="住所类型">
              <el-input
                v-model="queryParams.zslx"
                placeholder="请输入住所类型"
                clearable
                size="small"
                @keyup.enter.native="onSearch"
              />
            </VTableSearchItem>
            <VTableSearchItem label="服务处所">
              <el-input
                v-model="queryParams.fwcs"
                placeholder="请输入服务处所"
                clearable
                size="small"
                @keyup.enter.native="onSearch"
              />
            </VTableSearchItem> 
            </template> -->
            <!-- <template #operate>
              <el-row :gutter="8"
                      type="flex">
                <el-col>
                  <el-button type="primary"
                             plain
                             icon="el-icon-plus"
                             size="mini"
                             v-hasPermi="['jcyw:syrk:ldrk:add']"
                             @click="show = true">新增</el-button>
                </el-col>
                <el-col>
                  <el-button type="success" plain icon="el-icon-edit" size="mini">修改</el-button>
                </el-col>
                <el-col>
                  <el-button type="danger" plain icon="el-icon-delete" size="mini">删除</el-button>
                </el-col>
                <el-col>
                  <el-button
                    type="warning"
                    @click="handleExport"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    >导出</el-button
                  >
                </el-col>
              </el-row>
            </template> -->
          </VTable>
        </el-col>
      </el-row>
    </el-row>
    <EditModal :value="show"
               :isEdit="isEdit"
               ref="editModal"
               @drawerClose="drawerClose"
               @submitForm="submitForm"
               @previewImg="previewImg" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%"
           :src="dialogImageUrl"
           alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  listLdrk,
  ldrkCountNum,
  //getBeliefs,
  //getNations,
  addLdrk,
  delLdrk,
  getStatistics
} from '@/api/jcyw/syrk/ldrk'
import { formatIdCard } from '@/utils'
import { getNations, getBeliefs } from '@/api/system/dict/data'
export default {
  name: 'Ldrk',
  components: {
    Population: () => import('../hjrk//components/Population'),
    Zslx: () => import('../ldrk/components/Zslx'),
    Province: () => import('../ldrk/components/Province'),
    Lryy: () => import('../ldrk/components/Lryy'),
    EditModal: () => import('../ldrk/components/EditModal')
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
    'ga_ldyy'
  ],
  data () {
    return {
      optionObj: null,
      liuRu: [],
      zhuSuo: [],
      shengFen: [],
      dialogVisible: false,
      dialogImageUrl: '',
      timer: '',
      show: false,
      queryParams: {
        xm: '',
        deptId: undefined,
        deptName: undefined,
        nickName: undefined,
        phonenumber: undefined,
        userDeptId: undefined,
        wgbm: undefined,
        sfzhm: undefined,
        xzdqh: undefined,
        xzdxz: undefined,
        lryy: undefined,
        zjdm: undefined,
        zjhm: undefined,
        djrq: undefined,
        zjdqrq: undefined,
        zslx: undefined,
        fwcs: undefined,
        lxfs: undefined
      },
      columns: [
        {
          label: '主键',
          prop: 'id',
          show: false,
          minWidth: '100px'
        },
        {
          label: '姓名',
          prop: 'xm',
          minWidth: '100px',
          'show-overflow-tooltip': true
        },
        {
          label: '性别',
          prop: 'xb',
          minWidth: '80px',
          render: (h, { row }) => {
            const val = this.dict?.type?.sys_user_sex
            return <dict-tag options={val} value={row.xb} />
          }
        },
        {
          label: '身份证号',
          prop: 'sfzhm',
          minWidth: '120px', // 其他参数同elui-table
          render: (h, { row }) => {
            const val = formatIdCard(row.sfzhm)
            return (
              <el-link type="primary" onClick={() => this.getPersonInfo(row)}>
                {val}
              </el-link>
            )
          }
        },
        {
          label: '出生日期',
          prop: 'csrq',
          show: false
        },
        {
          label: '民族',
          prop: 'mz',
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_mz
            return <dict-tag options={val} value={row.mz} />
          }
        },
        {
          label: '联系方式',
          prop: 'lxfs',
          minWidth: '120px'
        },
        {
          label: '现住地址',
          prop: 'xzdxzAddr',
          minWidth: '300px',
          'show-overflow-tooltip': true
        },
        {
          label: '户籍详址',
          prop: 'hjxzAddr',
          minWidth: '250px',
          show: false,
          'show-overflow-tooltip': true
        },
        {
          label: '流入原因',
          prop: 'lryy',
          show: false
        },
        {
          label: '证件类型',
          prop: 'zjdm',
          show: false
        },
        {
          label: '证件号码',
          prop: 'zjhm',
          minWidth: '120px',
          show: false,
          'show-overflow-tooltip': true
        },
        {
          label: '登记日期',
          prop: 'djrq',
          minWidth: '120px'
        },
        {
          label: '证件到期日期',
          prop: 'zjdqrq',
          minWidth: '120px',
          show: false
        },
        {
          label: '住所类型',
          prop: 'zslx',
          show: false
        },
        {
          label: '服务处所',
          prop: 'fwcs',
          width: '180px',
          show: false
          /*   }, {
              label: '创建人',
              prop: 'userId'
            }, {
              label: '创建单位',
              prop: 'deptId'
            }, {
              label: '更新人',
              prop: 'uUserId'
            }, {
              label: '更新单位',
              prop: 'uDeptId'
            }, {
              label: '备注',
              prop: 'remark' */
        },
        {
          label: '操作',
          prop: 'action',
          align: 'center',
          width: '200px',
          fixed: 'right',
          render: (h, { row }) => {
            return (
              <span>
                <VTableCell
                  type="档案"
                  // icon="el-icon-document"
                  // title={row.xm}
                  promiseStr='jcyw:syrk:ldrk:dangan'
                  onClick={() => this.getPersonInfo(row)}
                />
                <VTableCell
                  type="修改"
                  // icon="el-icon-edit"
                  promiseStr='jcyw:syrk:ldrk:edit'
                  onClick={() => this.onEdit(row)}
                />
                <VTableCell
                  type="删除"
                  // icon="el-icon-delete"
                  promiseStr='jcyw:syrk:ldrk:remove'
                  // title={row.zhzzJcywSyrkJbxx.xm}
                  onClick={() => this.onDel(row)}
                />
              </span>
            )
          }
        }
      ],
      tableData: (parameter) => {
        // delete this.queryParams.pageNum
        // delete this.queryParams.pageSize
        let parmas = {
          ...this.queryParams,
          zhzzJcywSyrkJbxx: this.queryParams
        }
        let { pageNum, pageSize } = parameter
        return this.filterTableData(listLdrk(parmas, pageNum, pageSize))
      },
      population: null,
      sex: [],
      nation: null,
      religion: null,
      isEdit: false
    }
  },
  created () {
    this.ldrkCountNumMethotd()
    this.getStatistics()
  },
  methods: {
    getStatistics () {
      let taskList = {
        showCount: 6
      }
      getStatistics(taskList).then(res => {
        // console.log(res)
        this.optionObj = {
          name: '流动人口',
          num: res.data.totalNum
        }
        res.data.lryyList.forEach(item => {
          this.liuRu.push({
            name: item.lable,
            value: item.num
          })
        })
        res.data.zslxList.forEach(item => {
          this.zhuSuo.push({
            name: item.lable,
            value: item.num
          })
        })
        res.data.lzsfList.forEach(item => {
          this.shengFen.push({
            name: item.lable,
            value: item.num
          })
        })
      })
    },
    previewImg (dialogImageUrl, dialogVisible) {
      this.dialogVisible = dialogVisible
      this.dialogImageUrl = dialogImageUrl
    },
    // currentPageChange(data) {
    //   this.queryParams.pageNum = data
    //   this.tableData = () => {
    //     return this.filterTableData(
    //       listLdrk(
    //         {
    //           ...this.queryParams,
    //           zhzzJcywSyrkJbxx: this.queryParams
    //         },
    //         // { ...parameter, ...parmas },
    //         this.queryParams.pageNum,
    //         this.queryParams.pageSize
    //       )
    //     )
    //   }
    // },
    // pageSizeChange(data) {
    //   this.queryParams.pageNum = 1
    //   this.queryParams.pageSize = data
    //   this.tableData = () => {
    //     return this.filterTableData(
    //       listLdrk(
    //         {
    //           ...this.queryParams,
    //           zhzzJcywSyrkJbxx: this.queryParams
    //         },
    //         this.queryParams.pageNum,
    //         this.queryParams.pageSize
    //       )
    //     )
    //   }
    // },
    ldrkCountNumMethotd () {
      ldrkCountNum().then(async (res) => {
        const { hjrkCountNum: data } = res
        this.population = data.totalRenShuNum
        const man = Number(data.nanXingBie)
        const woman = Number(data.nuXingbie)
        this.sex = [
          {
            value: man,
            name: '男',
            percent: man
          },
          {
            value: woman,
            name: '女',
            percent: woman
          }
        ]
        // this.sex = [{
        //   value: man, name: '男', percent: `${parseInt((man / (man + woman)) * 100)}%`
        // }, {
        //   value: woman, name: '女', percent: `${parseInt((woman / (man + woman)) * 100)}%`
        // }]
        let nations = await getNations()
        if (!nations) return
        this.filterNationsData(nations.data, data.mzCount, 'mz')
        this.nation = data.mzCount.map((item) => ({
          value: Number(item.countNum),
          name: item.label
        }))
        // 宗教信仰
        let beliefs = await getBeliefs()
        if (!beliefs) return
        this.filterNationsData(beliefs.data, data.zjxyCount, 'zjxy')
        // const total = data.zjxyCount.map(item => Number(item.countNum)).reduce((prev, next) => prev + next)
        this.religion = data.zjxyCount.map((item) => ({
          value: Number(item.countNum),
          name: item.label,
          percent: item.countNum
          // name: item.zjxy,
          // percent: `${parseInt(Number(item.countNum) / total * 100)}%`
        }))
      })
    },
    onSearch () {
      // this.queryParams.pageNum = 1
      this.$refs.table.refresh()
    },
    // 重置
    onReset () {
      this.queryParams = {}
      this.$refs.table.refresh()
    },
    onEdit (row) {
      this.isEdit = true
      this.show = true
      this.$refs.editModal.editForm(row)
    },
    async onDel (row) {
      this.$confirm('是否继续删除该数据?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let params = {
            sfzhm: row.sfzhm,
            id: row.id
          }
          let delLdrkRes = await delLdrk(params)
          if (!delLdrkRes) return
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          await this.getStatistics()
          this.$refs.table.refresh()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getPersonInfo (row) {
      localStorage.setItem('rybqqxzf', JSON.stringify(['jcyw:syrk:ldrk:rybq']))
      this.$router.push({
        name: 'Ryda',
        params: { row: row, type: 0 }
      })
    },
    // 处理民族、宗教数据
    filterNationsData (nations, interNations, flag) {
      if (nations.length < 1) return []
      if (interNations.length < 1) return []
      for (let i = 0; i < nations.length; i++) {
        let nation = nations[i]
        for (let j = 0; j < interNations.length; j++) {
          let interNation = interNations[j]
          if (nation.dictValue == interNation[flag]) {
            interNation.label = nation.dictLabel
          }
        }
      }
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download(
        '/jcyw/syrk/ldrk/export',
        {
          ...this.queryParams
        },
        `ldrk_${new Date().getTime()}.xlsx`
      )
    },
    async submitForm (form) {
      let addRes = await addLdrk(form)
      if (!addRes) return
      // if (this.isEdit) {
      this.$modal.msgSuccess('操作成功')
      // } else {
      //   this.$modal.msgSuccess('新增成功')
      // }
      this.$refs.table.refresh()
      this.timer = new Date().getTime()
      this.ldrkCountNumMethotd()
      this.isEdit = false
      await this.getStatistics()
    },
    drawerClose () {
      this.show = false
      this.isEdit = false
    },
    async filterTableData (table) {
      let data = await table
      if (data.rows.length < 1)
        return {
          total: 0,
          rows: [],
          code: 200,
          msg: '查询成功'
        }
      data.rows.filter((item) => {
        if (item.zhzzJcywSyrkJbxx) {
          for (let k in item.zhzzJcywSyrkJbxx) {
            if (!item[k]) {
              item[k] = item.zhzzJcywSyrkJbxx[k]
            }
          }
        }
      })
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
.el-drawer__body {
  overflow: hidden !important;
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
