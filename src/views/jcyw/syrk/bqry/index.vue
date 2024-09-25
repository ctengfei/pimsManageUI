<template>
  <div class="flex flex-col h-full hjrk_wrap xzMain">
    <el-row class="xzBox">
      <el-col class="xztongji">
        <el-row :gutter="10"
                class="xztongjiBox">
          <el-col :span="4">
            <Population class="xzmain"
                        :optionObj="optionObj"></Population>
          </el-col>
          <el-col :span="8">
            <Bqfl class="xzmain"
                  :biaoqian="biaoqian"></Bqfl>
          </el-col>
          <el-col :span="12">
            <Sex class="xzmain"
                 :sexList="sexList"></Sex>
          </el-col>
        </el-row>
      </el-col>
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
                  class="xzgdBox"
                  ref="table"
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
              <VTableSearchItem class="bqlx"
                                label="标签类型">
                <el-cascader placeholder="请选择标签类型"
                             ref="tree"
                             :options="bqOptions"
                             :props="bqProps"
                             collapse-tags
                             @change="handleChange"
                             clearable></el-cascader>
              </VTableSearchItem>
              <VTableSearchItem label="身份证号">
                <el-input v-model="queryParams.sfzhm"
                          placeholder="请输入身份证号"
                          clearable
                          size="small" />
              </VTableSearchItem>
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
import { formatIdCard, formatPhone } from '@/utils'
import {
  listHjrk,
  //getNations,
  //getBeliefs,
  addGark,
  updateGark,
  delGark,
  multipleDelGark,
  getTotal,
  getBqList,
  getCountByType,
  getStatistics
} from '@/api/jcyw/syrk/bqry'
import { getNations, getBeliefs } from '@/api/system/dict/data'
export default {
  name: 'Bqry',
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
    'bq_rybq'
  ],
  components: {
    Population: () => import('../hjrk//components/Population'),
    Sex: () => import('./components/Sex'),
    Bqfl: () => import('./components/Bqfl'),
    Religion: () => import('./components/Religion'),
    EditModal: () => import('./components/EditModal')
  },
  data () {
    return {
      optionObj: null,
      biaoqian: [],
      sexList: [],
      bqOptions: [],
      hasSelected: true,
      multipleParam: [],
      timer: '',
      show: false,
      bqProps: { multiple: true },
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
        hjqh: undefined,
        bqId: []
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
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = this.dict?.type?.bq_rybq
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
          width: '120px',
          show: false
        },
        {
          label: '民族',
          prop: 'mz',
          width: '120px',
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_mz
            return <dict-tag options={val} value={row.mz} />
          }
        },
        {
          label: '政治面貌',
          prop: 'zzmm',
          width: '120px',
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_zzmm
            return <dict-tag options={val} value={row.zzmm} />
          }
        },
        {
          label: '人口类别',
          prop: 'rklb',
          width: '120px',
          render: (h, { row }) => {
            if (row.hjrkFlag == "1") {
              const val = "户籍人口"
              return <span class="el-tag el-tag--warning el-tag--medium el-tag--light" index="9">{val}</span>
            }
            if (row.ldrkFlag == "1") {
              const val = "流动人口"
              return <span class="el-tag el-tag--medium el-tag--light" index="9">{val}</span>
            }
          }
        },
        {
          label: '联系方式',
          prop: 'lxfs',
          width: '120px',
          render: (h, { row }) => {
            const val = formatPhone(row.lxfs)
            return <span>{val}</span>
          }
        },
        {
          label: '现居地址',
          prop: 'xzdxzAddr',
          'show-overflow-tooltip': true
        },
        {
          label: '户籍区划',
          prop: 'hjqh',
          show: false // 默认显示，手动设置不显示
        },
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
                  icon="el-icon-document"
                  promiseStr='jcyw:syrk:gzry:dangan'
                  onClick={() => this.getPersonInfo(row)}
                />
                <VTableCell
                  type="查看"
                  icon="el-icon-view"
                  promiseStr='jcyw:syrk:gzry:edit'
                  onClick={() => this.onEdit(row)}
                />
                <VTableCell
                  type="删除"
                  icon="el-icon-delete"
                  promiseStr='jcyw:syrk:gzry:remove'
                  onClick={() => this.onDel(row)}
                />
              </span>
            )
          }
        }
      ],
      tableData: (parameter) => {
        let parmas = {
          ...this.queryParams
          // jbxx: this.queryParams
        }
        return listHjrk({ ...parmas, ...parameter })
      },
      population: null,
      sex: [],
      nation: null,
      religion: null,
      isEdit: false
    }
  },
  mounted () {
    this.hjrkCountNumMethod()
    this.getBqList()
    //  console.log(gaCount)
    this.getStatistics()
  },
  methods: {
    getStatistics () {
      getStatistics().then((res) => {
        this.optionObj = {
          name: '标签人员',
          num: res.data.bqryNum
        }
        res.data.bqryList.forEach((item) => {
          this.biaoqian.push({
            name: item.lable,
            value: item.num
          })
        })
        this.sexList = res.data.ageRange
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
    handleChange (val) {
      // console.log(val)
      let list = []
      for (let i = 0; i < val.length; i++) {
        list.push(val[i][1])
      }
      // console.log(list)
      this.queryParams.bqId = list
    },
    getBqList () {
      getBqList().then((res) => {
        this.bqOptions = []
        if (res.code == 200) {
          for (let k in res.data) {
            this.bqOptions.push({
              label: k,
              children: res.data[k]
            })
          }
          for (let i = 0; i < this.bqOptions.length; i++) {
            // this.bqOptions[i].value=i
            this.bqOptions[i].children.forEach((item) => {
              ; (item.label = item.dictLabel), (item.value = item.dictCode)
            })
          }
        }
      })
    },
    hjrkCountNumMethod () {
      this.religion = []
      getTotal().then(async (res) => {
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
        // const total = data.zjxyCount.map(item => Number(item.countNum)).reduce((prev, next) => prev + next)
        // this.religion = data.zjxyCount.map((item) => ({
        //   value: Number(item.countNum),
        //   // name: item.zjxy,
        //   name: item.label,
        //   // percent: `${parseInt(Number(item.countNum) / total * 100)}%`
        //   percent: `${item.countNum}`
        // }))
      })
      getCountByType().then((res) => {
        for (let index = 0; index < res.data.length; index++) {
          this.religion.push({
            value: res.data[index].totalNum,
            name: res.data[index].dict_label,
            percent: `${res.data[index].totalNum}`
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
      // this.queryParams.bqId=[]
      this.$refs.tree.$refs.panel.clearCheckedNodes()
      this.$refs.table.refresh()
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
        params: { row: row, type: row.hjrkFlag == 1 ? 1 : 0 }
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
        'jcyw/syrk/hjrk/export',
        {
          ...this.queryParams
        },
        `hjrk_${new Date().getTime()}.xlsx`
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
.hjrk_wrap {
  height: calc(100% - 39px);
  ::v-deep .el-input__prefix {
    top: 0px !important;
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
