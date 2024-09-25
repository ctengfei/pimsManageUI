<template>
  <div class="flex flex-col h-full hjrk_wrap  app-container">
    <el-row :span="24"
            class="xzBox">
      <el-row class="xztongji">
        <el-row :gutter="10"
                class="xztongjiBox">
          <el-col :span="4">
            <Population class="xzmain"
                        :optionObj="optionObj"></Population>
          </el-col>
          <el-col :span="6">
            <Sex class="xzmain"
                 :sexList="sexList"></Sex>
          </el-col>
          <el-col :span="6">
            <Jkzk class="xzmain"
                  :jiankang="jiankang"></Jkzk>
          </el-col>
          <el-col :span="8">
            <Nation class="xzmainwei"
                    :renyuanList="renyuanList"></Nation>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="xzysBox"
              style="
          overflow-y: scroll;
          height: calc(100% - 190px);
          background: white;
          box-sizing: border-box;
          padding: 0px;
        ">
        <el-col :span="24"
                class="xzgdBox">
          <VTable :havecellclick="false"
                  rowKey="idCard"
                  ref="table"
                  class="xzgdBox"
                  :showIndex="true"
                  :selection="false"
                  :data="tableData"
                  :columns="columns"
                  @on-search="onSearch"
                  @on-reset="onReset"
                  @selection-change="handleSelectionChange">
            <!-- label-width="auto"
                label-position="left" -->
            <template #search>
              <VTableSearchItem label="姓名">
                <el-input v-model="queryParams.xm"
                          placeholder="请输入姓名"
                          clearable
                          size="small" />
              </VTableSearchItem>
              <VTableSearchItem label="身份证号">
                <el-input v-model="queryParams.sfzhm"
                          placeholder="请输入身份证号"
                          clearable
                          size="small" />
              </VTableSearchItem>
              <VTableSearchItem label="性别">
                <el-select v-model="queryParams.xb"
                           placeholder="请选择性别"
                           clearable>
                  <el-option v-for="dict in dict.type.sys_user_sex"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value"></el-option>
                </el-select>
              </VTableSearchItem>
            </template>
            <template #advanced>
              <!-- <VTableSearchItem label="出生日期">
              <el-date-picker
                v-model="queryParams.csrq"
                class="!w-full"
                type="date"
                placeholder="选择出生日期"
              >
              </el-date-picker>
            </VTableSearchItem> -->
            </template>
            <template #operate>
              <el-row :gutter="8"
                      type="flex">
                <!-- <el-col>
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="show = true"
                  >新增</el-button
                >
              </el-col> -->
                <!--
                <el-col>
                  <el-button :disabled="hasSelected"
                             type="danger"
                             plain
                             icon="el-icon-delete"
                             size="mini"
                             @click="onDel">删除</el-button>
                </el-col>
                -->
                <!-- <el-col>
                <el-button
                  type="warning"
                  @click="handleExport"
                  plain
                  icon="el-icon-download"
                  size="mini"
                  >导出</el-button
                >
              </el-col> -->
              </el-row>
            </template>
          </VTable>
        </el-col>
      </el-row>
    </el-row>
    <EditModal :isEdit="isEdit"
               ref="editModal"
               :value="show"
               @drawerClose="drawerClose"
               @submitForm="submitForm" />
  </div>
</template>

<script>
import {
  listHjrk,
  getCountByType,
  //getNations,
  //getBeliefs,
  addGark,
  updateGark,
  delGark,
  multipleDelGark,
  getTotal,
  getStatistics
} from '@/api/jcyw/syrk/gary'
import { formatIdCard } from '@/utils'
import { getNations, getBeliefs } from '@/api/system/dict/data'
export default {
  name: 'Gary',
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
    'bq_gary'
  ],
  components: {
    Population: () => import('../hjrk/components/Population'),
    Sex: () => import('./components/Sex'),
    Nation: () => import('./components/Nation'),
    Jkzk: () => import('./components/Jkzk'),
    EditModal: () => import('./components/EditModal')
  },
  data () {
    return {
      optionObj: null,
      sexList: [],
      jiankang: [],
      renyuanList: [],
      hasSelected: true,
      multipleParam: [],
      timer: '',
      show: false,
      queryParams: {
        sfzhm: undefined,
        xzdxz: undefined,
        lryy: undefined,
        zjdm: undefined,
        zjhm: undefined,
        djrq: undefined,
        zjdqrq: undefined,
        zslx: undefined,
        fwcs: undefined,
        xm: undefined,
        xzdqh: undefined,
        xb: undefined,
        csrq: undefined,
        mz: undefined,
        lxfs: undefined,
        hjqh: undefined
      },
      columns: [
        {
          label: '姓名',
          prop: 'xm',
          width: '100px',
          'show-overflow-tooltip': true
        },
        {
          label: '性别',
          prop: 'xb',
          width: '100px',
          render: (h, { row }) => {
            const val = this.dict?.type?.sys_user_sex
            return <dict-tag options={val} value={row.xb} />
          }
        },
        {
          label: '标签',
          prop: 'bqId',
          width: '200px',
          render: (h, { row }) => {
            const val = this.dict?.type?.bq_gary
            for (let i = 0; i < val.length; i++) {
              val[i].value = val[i].raw.dictCode
            }
            return <dict-tag options={val} value={row.bqId} />
          }
        },
        {
          label: '身份证号',
          prop: 'sfzhm',
          width: '180px', // 其他参数同elui-table
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
          width: '100px',
          show: false
        },
        {
          label: '民族',
          prop: 'mz',
          width: '130px',
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_mz
            return <dict-tag options={val} value={row.mz} />
          }
        },
        {
          label: '政治面貌',
          prop: 'zzmm',
          width: '150px',
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_zzmm
            return <dict-tag options={val} value={row.zzmm} />
          }
        },
        {
          label: '联系方式',
          prop: 'lxfs',
          width: '120px'
        },
        // {
        //   label: '现住地详址',
        //   prop: 'xzdxzAddr',
        //   // width: '480px',
        //   show: false,
        //   'show-overflow-tooltip': true
        // },
        {
          label: '户籍地址',
          prop: 'hjxzAddr',
          // width: '480px',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            if (row.hjxzAddr) {
              return <span>{row.hjxzAddr}</span>
            } else {
              return <span>{row.hjxz}</span>
            }
          }
        },
        {
          label: '户籍区划',
          prop: 'hjqh',
          show: false // 默认显示，手动设置不显示
        },
        // {
        //   label: '现住地区划',
        //   prop: 'xzdqh',
        //   show: false
        // },
        {
          label: '籍贯',
          prop: 'jg',
          show: false
        },
        {
          label: '婚姻状况',
          prop: 'hyzk',
          show: false
        },
        {
          label: '学历',
          prop: 'xl',
          show: false
        },
        {
          label: '宗教信仰',
          prop: 'zjxy',
          show: false,
          render: (h, { row }) => {
            const val = this.dict?.type?.ga_zjxy
            return <dict-tag options={val} value={row.zjxy} />
          }
        },
        {
          // <VTableCell
          //   type="档案"
          //   icon="el-icon-document"
          //   // title={row.xm}
          //   onClick={() => this.getPersonInfo(row)}
          // />
          label: '操作',
          prop: 'action',
          align: 'center',
          width: '200px',
          fixed: 'right',
          render: (h, { row }) => {
            return (
              <span>
                <VTableCell
                  type="查看"
                  icon="el-icon-view"
                  promiseStr='jcyw:syrk:gary:view'
                  onClick={() => this.onView(row)}
                />
                <VTableCell
                  type="修改"
                  icon="el-icon-edit"
                  promiseStr='jcyw:syrk:gary:edit'
                  onClick={() => this.onEdit(row)}
                />
                <VTableCell
                  type="删除"
                  icon="el-icon-delete"
                  // title={row.xm}
                  promiseStr='jcyw:syrk:gary:remove'
                  onClick={() => this.onDel(row)}
                />
              </span>
            )
          }
        }
      ],
      tableData: (parameter) => {
        let parmas = {
          ...this.queryParams,
          type: 'bq_gary'
          // jbxx: this.queryParams
        }
        return listHjrk({ ...parmas, ...parameter })
      },
      population: null,
      sex: [],
      nation: null,
      religion: [],
      isEdit: false
    }
  },
  mounted () {
    // this.hjrkCountNumMethod()
    this.getStatistics()
  },
  methods: {
    getStatistics () {
      getStatistics().then((res) => {
        this.optionObj = {
          name: '关爱人员',
          num: res.data.gatyNum
        }
        res.data.jkzkList.forEach((item) => {
          this.jiankang.push({
            name: item.lable,
            value: item.num
          })
        })
        res.data.xbList.forEach((item) => {
          this.sexList.push({
            name: item.lable,
            value: item.num
          })
        })
        this.renyuanList = res.data.lslxList
      })
    },
    handleSelectionChange (val) {
      this.multipleParam = []
      for (let i = 0; i < val.length; i++) {
        this.multipleParam.push({ id: val[i].id, bqIds: val[i].bqId })
      }
      if (val.length) {
        this.hasSelected = false
      } else {
        this.hasSelected = true
      }
    },
    hjrkCountNumMethod () {
      this.religion = []
      getTotal({ type: 'bq_gary' }).then(async (res) => {
        const { hjrkCountNum: data } = res
        this.population = data.totalRenShuNum
        const man = Number(data.nanXingBie)
        const woman = Number(data.nuXingbie)
        this.sex = [
          {
            value: man,
            name: '男',
            percent: `${man}`
          },
          {
            value: woman,
            name: '女',
            percent: `${woman}`
          }
        ]
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
      })
      getCountByType().then((res) => {
        for (let k in res.data) {
          this.religion.push({
            value: res.data[k],
            name: k,
            percent: `${res.data[k]}`
          })
        }
      })
    },
    onSearch () {
      // this.queryParams.pageNum = 1
      this.$refs.table.refresh()
    },
    // 重置
    onReset () {
      this.queryParams = {}
      // this.queryParams.pageNum = 1
      // this.queryParams.pageSize = 10
      this.$refs.table.refresh()
    },
    onView (row) {
      this.show = true
      this.$refs.editModal.editForm(row)
      this.isEdit = false
    },
    onEdit (row) {
      this.show = true
      this.$refs.editModal.editForm(row)
      this.isEdit = true
    },
    async onDel (row) {
      this.$confirm('确定删除吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // let ids = row.id || this.delIds
          if (row.id) {
            let delLdrkRes = await delGark(row.id, row.bqId)
            if (!delLdrkRes) return
          } else {
            let delLdrkRes = await multipleDelGark(this.multipleParam)
            if (!delLdrkRes) return
          }
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
      this.$router.push({
        name: 'Ryda',
        params: { row: row, type: 1 }
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
    async submitForm (form) {
      if (form.id) {
        this.$modal.msgSuccess('修改成功')
        let addRes = await updateGark(form)
        if (!addRes) return
      } else {
        let addRes = await addGark(form)
        if (!addRes) return
        this.$modal.msgSuccess('新增成功')
      }
      this.$refs.table.refresh()
      await this.getStatistics()
      this.timer = new Date().getTime()
      this.hjrkCountNumMethod()
    },
    drawerClose () {
      this.show = false
      this.isEdit = false
    },
    // 导出
    handleExport () {
      this.download(
        'jcyw/syrk/gary/export',
        {
          ...this.queryParams
        },
        `gary_${new Date().getTime()}.xlsx`
      )
    },
    async filterTableData (table) {
      let data = await table
      if (data.rows.length < 1) return {}
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

.xzmainwei {
  width: 100%;
  height: 164px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.hjrk_wrap {
  height: calc(100% - 39px);
  ::v-deep .el-input__prefix {
    top: 0px !important;
  }
  .biaodan ::v-deep.el-form .el-row .el-col:nth-child(5) {
    clear: both;
  }
}
</style>
<style>
.hjrk_wrap .v-table .el-card__body {
  height: 100%;
  overflow-y: scroll;
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
