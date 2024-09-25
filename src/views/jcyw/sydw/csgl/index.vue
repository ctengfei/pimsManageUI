<template>
  <div class="flex flex-col app-container">
    <el-row class="xztongji">
      <el-row :gutter="10" class="xztongjiBox">
        <el-col :span="4" :lg="4">
          <Population class="xzmain" :optionObj="optionObj"></Population>
        </el-col>
        <el-col :span="5" :lg="6">
          <Sex class="xzmain" :sexList="sexList"></Sex>
        </el-col>
        <el-col :span="5" :lg="6">
          <Religion class="xzmain" :zongjiao="zongjiao"></Religion>
        </el-col>
        <el-col :span="10" :lg="8">
          <Nation class="xzmain" :minzu="minzu"></Nation>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="xzysBox">
      <el-col :span="24"
              class="xzgdBox">
        <VTable rowKey="idCard"
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
            <VTableSearchItem label="单位编码">
              <el-input v-model="queryParams.dwbm"
                        placeholder="请输入单位编码"
                        clearable
                        size="small" />
            </VTableSearchItem>
            <VTableSearchItem label="单位名称">
              <el-input v-model="queryParams.dwmc"
                        placeholder="请输入单位名称"
                        clearable
                        size="small" />
            </VTableSearchItem>
          </template>
          <template #advanced>
            <!-- <VTableSearchItem label="性别">
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
            <VTableSearchItem label="出生日期">
              <el-date-picker
                v-model="queryParams.csrq"
                class="!w-full"
                type="date"
                placeholder="选择出生日期"
              >
              </el-date-picker>
            </VTableSearchItem>
            <VTableSearchItem label="民族">
              <el-select
                v-model="queryParams.mz"
                placeholder="请选择民族"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.gb_mz"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </VTableSearchItem>
            <VTableSearchItem label="联系方式">
              <el-input
                v-model="queryParams.lxfs"
                placeholder="请输入联系方式"
                clearable
                size="small"
              />
            </VTableSearchItem>
            <VTableSearchItem label="户籍区划">
              <el-input
                v-model="queryParams.hjqh"
                placeholder="请输入户籍区划"
                clearable
                size="small"
              />
            </VTableSearchItem> -->
          </template>
          <!-- <template #operate>
            <el-row :gutter="8"
                    type="flex">
              <el-col>
                <el-button type="primary"
                           plain
                           icon="el-icon-plus"
                           size="mini"
                           v-hasPermi="['jcyw:sydw:csgl:add']"
                           @click="onAdd">新增</el-button>
              </el-col>
              
              <el-col>
                <el-button
                  :disabled="hasSelected"
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  size="mini"
                  @click="onDel"
                  >删除</el-button
                >
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
    <EditModal :isEdit="isEdit"
               :isDisable="isDisable"
               ref="editModal"
               :value="show"
               @drawerClose="drawerClose"
               @submitForm="submitForm" />
  </div>
</template>

<script>
import {
  getStatistics,
  listCsgl,
  getCsgl,
  delCsgl,
  addCsgl,
  updateCsgl,
  listHjrk,
  hjrkCountNum,
  //getNations,
  //getBeliefs,
  addGark,
  updateGark,
  delGark,
  multipleDelGark,
  getTotal
} from '@/api/jcyw/sydw/csgl'
import { getNations, getBeliefs } from '@/api/system/dict/data'
export default {
  dicts: [
    'gb_dwlx',
    'gb_jjlx',
    'gb_jyfw',
    'ga_zjzl',
    'st_ggcs_lb',
  ],
  components: {
    Population: () => import('./components/Population'),
    Sex: () => import('./components/Sex'),
    Nation: () => import('./components/Nation'),
    Religion: () => import('./components/Religion'),
    EditModal: () => import('./components/EditModal')
  },
  data () {
    return {
      optionObj: null,
      sexList: [],
      zongjiao: [],
      minzu: [],
      hasSelected: true,
      delIds: [],
      delBqIds: [],
      timer: '',
      show: false,
      queryParams: {
        dwbm: null,
        dwmc: null,
        dwywmc: null,
        dwywsx: null,
        zzjgdm: null,
        dwlxdm: null,
        jjlxdm: null,
        hylbdm: null,
        kyrq: null,
        tyrq: null,
        jyfwzy: null,
        jyfwjy: null,
        jymj: null,
        jyfs: null,
        yyzzh: null,
        yyzzyxq: null,
        qsrq: null,
        jzrq: null,
        zczj: null,
        lxdh: null,
        dwdz: null,
        dzbm: null,
        ssqx: null,
        qhnxxdz: null,
        wz: null,
        fddbr: null,
        fdrkbm: null,
        fdgmsfzhm: null,
        fdxm: null,
        fdzjzl: null,
        fdzjhm: null,
        fdwwx: null,
        fdwwm: null,
        fdlxdh: null,
        bwfzr: null,
        bwrkbm: null,
        bwgmsfzhm: null,
        bwxm: null,
        bwlxdh: null,
        zddwbs: null,
        zxsj: null,
        gxsj: null,
        userId: null,
        deptId: null,
        uUserId: null,
        uDeptId: null,
        field1: null,
        field2: null,
        field3: null,

      },
      columns: [
        // {
        //   label: '单位编码',
        //   prop: 'dwbm',
        //   width: '100px',
        //   'show-overflow-tooltip': true
        // },
        {
          label: '单位名称',
          prop: 'dwmc',
          width: '250px',
          'show-overflow-tooltip': true
        },
        // {
        //   label: '身份证号',
        //   prop: 'sfzhm',
        //   width: '180px', // 其他参数同elui-table
        //   render: (h, { row }) => {
        //     return (
        //       <el-link type="primary" onClick={() => this.getPersonInfo(row)}>
        //         {row.sfzhm}
        //       </el-link>
        //     )
        //   }
        // },
        {
          label: '单位类型',
          prop: 'dwlxdm',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_dwlx
            return <dict-tag options={val} value={row.dwlxdm} />
          }
        },
        {
          label: '经济类型',
          prop: 'jjlxdm',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_jjlx
            return <dict-tag options={val} value={row.jjlxdm} />
          }
        },
        {
          label: '行业类别',
          prop: 'hylbdm',
          'show-overflow-tooltip': true,
          render: (h, { row }) => {
            const val = this.dict?.type?.st_ggcs_lb
            return <dict-tag options={val} value={row.hylbdm} />
          }

        },
        // {
        //   label: '起始日期',
        //   prop: 'qsrq',
        //   width: '120px'
        // },
        // {
        //   label: '截止日期',
        //   prop: 'jzrq',
        //   width: '120px'
        // },
        // {
        //   label: '联系电话',
        //   prop: 'lxdh',
        //   width: '120px',
        //   'show-overflow-tooltip': true
        // },
        // {
        //   label: '现住地详址',
        //   prop: 'xzdxzAddr',
        //   // width: '480px',
        //   show: false,
        //   'show-overflow-tooltip': true
        // },

        // {
        //   label: '地址编码',
        //   prop: 'dzbm',
        //   'show-overflow-tooltip': true
        // },
        // {
        //   label: '现住地区划',
        //   prop: 'xzdqh',
        //   show: false
        // },
        // {
        //   label: '区划内详细地址',
        //   prop: 'dzysqc',
        //   'show-overflow-tooltip': true
        // },
        // {
        //   label: '网址',
        //   prop: 'wz',
        //   'show-overflow-tooltip': true
        // },
        {
          label: '法定代表人',
          prop: 'fddbr',

        },
        {
          label: '法定代表人电话',
          prop: 'fdlxdh',
          'show-overflow-tooltip': true
          // render: (h, { row }) => {
          //   const val = this.dict?.type?.ga_zjxy
          //   return <dict-tag options={val} value={row.zjxy} />
          // }
        },
        {
          label: '开业日期',
          prop: 'kyrq',
          width: '120px',
          show: false
        },
        {
          label: '单位地址',
          prop: 'dwdz',
          width: '400px',
          'show-overflow-tooltip': true
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
                  // icon="el-icon-view"
                  promiseStr='jcyw:sydw:csgl:view'
                  onClick={() => this.onSee(row)}
                />
                <VTableCell
                  type="修改"
                  // icon="el-icon-edit"
                  promiseStr='jcyw:sydw:csgl:edit'
                  onClick={() => this.onEdit(row)}
                />
                <VTableCell
                  type="删除"
                  // icon="el-icon-delete"
                  title={row.xm}
                  promiseStr='jcyw:sydw:csgl:remove'
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
        }
        return this.filterTableData(listCsgl({ ...parmas, ...parameter }))
      },
      population: null,
      sex: [],
      nation: null,
      religion: null,
      isEdit: false,
      isDisable: false,
    }
  },
  mounted () {
    this.hjrkCountNumMethod()
    this.getStatistics()
  },
  methods: {
    getStatistics(){
      getStatistics().then(res=>{
        if (res.code==200&&res.data) {
          this.optionObj = {
            name: '场所',
            num: res.data.totalNum
          }
          res.data.cslxList.forEach((item) => {
            this.sexList.push({
              name: item.lable,
              value: item.num
            })
          })
          res.data.dwlxList.forEach((item) => {
            this.zongjiao.push({
              name: item.lable,
              value: item.num
            })
          })
          res.data.jjlxList.forEach((item) => {
            this.minzu.push({
              name: item.lable,
              value: item.num
            })
          })
        }
        
      })
    },
    handleSelectionChange (val) {
      this.delIds = val.map((item) => item.id)
      this.delBqIds = val.map((item) => item.bqId)

      if (val.length) {
        this.hasSelected = false
      } else {
        this.hasSelected = true
      }
    },
    hjrkCountNumMethod () {
      getTotal({ type: 'bq_gary' }).then(async (res) => {
        const { hjrkCountNum: data } = res
        this.population = data.totalRenShuNum
        const man = Number(data.nanXingBie)
        const woman = Number(data.nuXingbie)
        // this.sex = [{
        //   value: man, name: '男', percent: `${parseInt((man / (man + woman)) * 100)}%`
        // }, {
        //   value: woman, name: '女', percent: `${parseInt((woman / (man + woman)) * 100)}%`
        // }]
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
        this.religion = data.zjxyCount.map((item) => ({
          value: Number(item.countNum),
          // name: item.zjxy,
          name: item.label,
          // percent: `${parseInt(Number(item.countNum) / total * 100)}%`
          percent: `${item.countNum}`
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
      // this.queryParams.pageNum = 1
      // this.queryParams.pageSize = 10
      this.$refs.table.refresh()
    },
    onAdd () {
      this.show = true
      this.isDisable = false
    },
    onEdit (row) {
      this.show = true
      this.$refs.editModal.editForm(row)
      this.isEdit = true
      this.isDisable = false
    },
    onSee (row) {
      this.show = true
      this.$refs.editModal.editForm(row)
      this.isDisable = true
    },
    async onDel (row) {
      let ids = row.id || this.delIds
      this.$modal.confirm('是否确认删除？').then(function () {
        return delCsgl(ids);
      }).then(() => {
        this.$refs.table.refresh()
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
      // if (row.id) {
      //   let delLdrkRes = await delGark(row.id, row.bqId)
      //   if (!delLdrkRes) return
      // } else {
      //   let delLdrkRes = await multipleDelGark({ids:this.delIds,bqIds:this.delBqIds})
      //   if (!delLdrkRes) return
      // }
      // this.$message({
      //   message: '删除成功',
      //   type: 'success'
      // })
      // this.$refs.table.refresh()
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
        // alert(8)
        this.$modal.msgSuccess('修改成功')
        let addRes = await updateCsgl(form)
        if (!addRes) return
      } else {
        // alert(7)
        let addRes = await addCsgl(form)
        if (!addRes) return
        this.$modal.msgSuccess('新增成功')
      }
      this.$refs.table.refresh()
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
        'jcyw/sydw/csgl/export',
        {
          ...this.queryParams
        },
        `csgl_${new Date().getTime()}.xlsx`
      )
    },
    async filterTableData (table) {
      let data = await table
      if (data.rows.length < 1) return {}
      data.rows.filter((item) => {
        if (item.zhzzJcywBzdzYthcj) {
          for (let k in item.zhzzJcywBzdzYthcj) {
            if (!item[k]) {
              item[k] = item.zhzzJcywBzdzYthcj[k]
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
  height: 100%;
  ::v-deep .el-input__prefix {
    top: 0px !important;
  }
}

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
