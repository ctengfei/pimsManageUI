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
          <el-col :span="5">
            <Sex class="xzmain"
                 :sexList="sexList"></Sex>
          </el-col>
          <el-col :span="5">
            <Religion class="xzmain"
                      :laiHua="laiHua"></Religion>
          </el-col>
          <el-col :span="10">
            <Lzgj class="xzmain"
                  :guoJia="guoJia"></Lzgj>
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
                  :data="tableData"
                  :columns="columns"
                  @on-search="onSearch"
                  @on-reset="onReset"
                  @selection-change="handleSelectionChange">
            <!-- label-width="auto"
                label-position="left" -->
            <template #search>
              <VTableSearchItem label="中文姓名">
                <el-input v-model="queryParams.zwxm"
                          placeholder="请输入中文姓名"
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
              <VTableSearchItem label="证件号码">
                <el-input v-model="queryParams.zjhm"
                          placeholder="请输入证件号码"
                          clearable
                          size="small" />
              </VTableSearchItem>
              <!-- <VTableSearchItem label="联系方式">
              <el-input
                v-model="queryParams.lxfs"
                placeholder="请输入联系方式"
                clearable
                size="small"
              />
            </VTableSearchItem> -->
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
              <!-- <VTableSearchItem label="来华目的">
              <el-select
                v-model="queryParams.lhmd"
                placeholder="请选择来华目的"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.zdy_lhmd"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </VTableSearchItem> -->
            </template>
            <template #operate>
              <el-row :gutter="8"
                      type="flex">
                <el-col>
                  <el-button type="primary"
                             plain
                             icon="el-icon-plus"
                             size="mini"
                             v-hasPermi="['jcyw:syrk:jwry:add']"
                             @click="show = true">新增</el-button>
                </el-col>
                <el-col>
                  <el-button :disabled="hasSelected"
                             type="danger"
                             plain
                             icon="el-icon-delete"
                             size="mini"
                             v-hasPermi="['jcyw:syrk:jwry:remove']"
                             @click="onDel">删除</el-button>
                </el-col>
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
  //getNations,
  //getBeliefs,
  addGark,
  updateGark,
  delGark,
  multipleDelGark,
  getTotal,
  getStatistics
} from '@/api/jcyw/syrk/jwry'
import { getNations, getBeliefs } from '@/api/system/dict/data'
import { formatIdCard } from '@/utils'

export default {
  name: 'Jwry',
  dicts: [
    'sys_user_sex',
    'ga_zjxy',
    'gb_mz',
    'gb_zylb',
    'sys_yes_no',
    'ga_zjzl',
    'gb_gjdqdm',
    'zdy_lhmd'
  ],
  components: {
    Population: () => import('../hjrk/components/Population'),
    Sex: () => import('./components/Sex'),
    Lzgj: () => import('./components/Lzgj'),
    Religion: () => import('./components/Religion'),
    EditModal: () => import('./components/EditModal')
  },
  data () {
    return {
      optionObj: null,
      sexList: [],
      laiHua: [],
      guoJia: [],
      hasSelected: true,
      delIds: [],
      timer: '',
      show: false,
      queryParams: {
        wwx: undefined,
        wwm: undefined,
        zwxm: undefined,
        xb: undefined,
        csrq: undefined,
        gj: undefined,
        zjxy: undefined,
        zjdm: undefined,
        zjhm: undefined,
        zjyxq: undefined,
        lxfs: undefined,
        lhmd: undefined,
        zylb: undefined,
        zy: undefined,
        fwzs: undefined,
        xzd: undefined,
        xzxz: undefined,
        ddrq: undefined,
        yjlkrq: undefined,
        sfzdgzry: undefined
      },
      columns: [
        {
          label: '外文姓',
          prop: 'wwx',
          width: '100px',
          'show-overflow-tooltip': true
        },
        {
          label: '外文名',
          prop: 'wwm',
          width: '100px',
          'show-overflow-tooltip': true
        },
        {
          label: '中文姓名',
          prop: 'zwxm',
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
          label: '出生日期',
          prop: 'csrq',
          width: '100px',
          show: false
        },
        {
          label: '国籍(地区)',
          prop: 'gj',
          width: '100px',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_gjdqdm
            return <dict-tag options={val} value={row.gj} />
          }
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
          label: '证件类型',
          prop: 'zjdm',
          width: '130px',
          render: (h, { row }) => {
            const val = this.dict?.type?.ga_zjzl
            return <dict-tag options={val} value={row.zjdm} />
          }
        },
        {
          label: '证件号码',
          prop: 'zjhm',
          width: '180px',// 其他参数同elui-table
          render: (h, { row }) => {
            const val = formatIdCard(row.zjhm)
            return (<span> {val}</span>)
          }
          // render: (h, { row }) => {
          //   return (
          //     <el-link type="primary" onClick={() => this.getPersonInfo(row)}>
          //       {row.zjhm}
          //     </el-link>
          //   )
          // }
        },
        {
          label: '证件有效期',
          prop: 'zjyxq',
          width: '100px',
          show: false
        },
        {
          label: '联系方式',
          prop: 'lxfs',
          width: '120px'
        },
        {
          label: '来华目的',
          prop: 'lhmd',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = this.dict?.type?.zdy_lhmd
            return <dict-tag options={val} value={row.lhmd} />
          }
        },
        {
          label: '职业类别',
          prop: 'zylb',
          width: '180px',
          show: false,
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_zylb
            return <dict-tag options={val} value={row.zzmm} />
          }
        },
        {
          label: '职业',
          prop: 'zy',
          width: '480px',
          show: false,
          'show-overflow-tooltip': true
        },
        {
          label: '服务住所',
          prop: 'fwzs',
          width: '480px',
          show: false,
          'show-overflow-tooltip': true
        },
        {
          label: '现住地',
          prop: 'xzd',
          // width: '480px',
          'show-overflow-tooltip': true
        },
        {
          label: '现住门(楼)详址',
          prop: 'xzxz',
          // width: '480px',
          'show-overflow-tooltip': true
        },
        {
          label: '抵达日期',
          prop: 'ddrq',
          width: '100px',
          show: false
        },
        {
          label: '预计离开日期',
          prop: 'yjlkrq',
          width: '100px',
          show: false
        },
        {
          label: '是否重点关注人员',
          prop: 'sfzdgzry',
          width: '180px',
          show: false
          // render: (h, { row }) => {
          //   const val = this.dict?.type?.sys_yes_no
          //   return <dict-tag options={val} value={row.sfzdgzry} />
          // }
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
                  type="修改"
                  // icon="el-icon-edit"
                  promiseStr='jcyw:syrk:jwry:edit'
                  onClick={() => this.onEdit(row)}
                />
                <VTableCell
                  type="删除"
                  // icon="el-icon-delete"
                  // title={row.wwm}
                  promiseStr='jcyw:syrk:jwry:remove'
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
      nation: [],
      religion: [],
      isEdit: false
    }
  },
  mounted () {
    this.hjrkCountNumMethod()
    this.getStatistics()
  },
  methods: {
    getStatistics () {
      let taskList = {
        showCount: 6
      }
      getStatistics(taskList).then(res => {
        //console.log(res)
        this.optionObj = {
          name: '境外人员',
          num: res.data.totalNum
        }
        res.data.lhmdList.forEach(item => {
          this.laiHua.push({
            name: item.lable,
            value: item.num
          })
        })
        res.data.lzgjList.forEach(item => {
          this.guoJia.push({
            name: item.lable,
            value: item.num
          })
        })
        res.data.xbList.forEach(item => {
          this.sexList.push({
            name: item.lable.replace('\r', ' '),
            value: item.num
          })
        })
      })
    },

    handleSelectionChange (val) {
      this.delIds = val.map((item) => item.id)
      if (val.length) {
        this.hasSelected = false
      } else {
        this.hasSelected = true
      }
    },
    hjrkCountNumMethod () {
      this.nation = []
      this.religion = []
      getTotal().then(async (res) => {
        const { jwryCount: data } = res
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
        for (let i = 0; i < nations.data.length; i++) {
          let nation = nations.data[i]
          for (let j in data.gj) {
            if (nation.dictValue == j) {
              this.nation.push({
                value: Number(data.gj[j]),
                name: nation.dictLabel
              })
            }
          }
        }

        // 宗教信仰
        let beliefs = await getBeliefs()
        if (!beliefs) return
        for (let i = 0; i < beliefs.data.length; i++) {
          let belief = beliefs.data[i]
          for (let j in data.zjxy) {
            if (belief.dictValue == j) {
              this.religion.push({
                value: Number(data.zjxy[j]),
                name: belief.dictLabel,
                percent: Number(data.zjxy[j])
              })
            }
          }
        }
      })
    },
    onSearch () {
      this.$refs.table.refresh()
    },
    // 重置
    onReset () {
      this.queryParams = {}
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
            let delLdrkRes = await delGark(row.id)
            if (!delLdrkRes) return
          } else {
            let delLdrkRes = await multipleDelGark(this.delIds)
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
    filterNationsData (nations, interNations) {
      if (nations.length < 1) return []
      if (JSON.stringify(interNations) === '{}') return []
      for (let i = 0; i < nations.length; i++) {
        let nation = nations[i]
        for (let j in interNations) {
          // console.log(j)
          let interNation = {}
          if (nation.dictValue == j) {
            interNation.label = nation.dictLabel
          }
        }
      }
    },
    async submitForm (form) {
      if (form.id) {
        // alert(8)
        this.$modal.msgSuccess('修改成功')
        let addRes = await updateGark(form)
        if (!addRes) return
      } else {
        // alert(7)
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
        'jcyw/syrk/jwry/export',
        {
          ...this.queryParams
        },
        `jwry_${new Date().getTime()}.xlsx`
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
