<template>
  <div class="flex flex-col app-container"
       style="height: 100%">

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
                    :zongjiao="zongjiao"></Religion>
        </el-col>
        <el-col :span="10">
          <Nation class="xzmain"
                  :minzu="minzu"></Nation>
        </el-col>

      </el-row>
    </el-row>
    <el-row class="xzysBox">
      <el-col :span="24"
              class="xzgdBox">
        <VTable class="xzgdBox"
                :havecellclick="false"
                rowKey="idCard"
                ref="table"
                :showIndex="true"
                :selection="false"
                :data="tableData"
                :columns="columns"
                @on-search="onSearch"
                @on-reset="onReset">
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
            <VTableSearchItem label="户籍地址">
              <el-input v-model="queryParams.xzdxz"
                        placeholder="请输入户籍地址"
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
            <VTableSearchItem label="出生日期">
              <el-date-picker v-model="queryParams.csrq"
                              class="!w-full"
                              type="date"
                              placeholder="选择出生日期">
              </el-date-picker>
            </VTableSearchItem>
            <VTableSearchItem label="民族">
              <el-select v-model="queryParams.mz"
                         placeholder="请选择民族"
                         clearable>
                <el-option v-for="dict in dict.type.gb_mz"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
              <!-- <el-input
                v-model="queryParams.mz"
                placeholder="请输入民族"
                clearable
                size="small"
              /> -->
            </VTableSearchItem>
            <VTableSearchItem label="联系方式">
              <el-input v-model="queryParams.lxfs"
                        placeholder="请输入联系方式"
                        clearable
                        size="small" />
            </VTableSearchItem>
            <VTableSearchItem label="户籍区划">
              <el-cascader @change="hjqhChange"
                           v-model="queryParams.hjqh"
                           :options="qhoptions"
                           :props="areaProps"
                           clearable
                           style="width: 100%"></el-cascader>
              <!-- <el-input
                v-model="queryParams.hjqh"
                placeholder="请输入户籍区划"
                clearable
                size="small"
              /> -->
            </VTableSearchItem>
          </template>
          <template #operate>
            <el-row :gutter="8"
                    type="flex">
              <el-col>
                <el-button type="primary"
                           plain
                           icon="el-icon-plus"
                           size="mini"
                           v-hasPermi="['jcyw:syrk:hjrk:add']"
                           @click="show = true">新增</el-button>
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
    <EditModal ref="editModal"
               :value="show"
               :isEdit="isEdit"
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
import { getxzqh } from '@/api/jcyw/syrk/ryda'
import {
  listHjrk,
  hjrkCountNum,
  getNations,
  getBeliefs,
  addLdrk,
  delLdrk,
  getAreaTree,
  getStatistics
} from '@/api/jcyw/syrk/hjrk'
import { formatIdCard } from '@/utils'
export default {
  name: 'Hjrk',
  dicts: [
    'sys_user_sex',
    'gb_yhzgx',
    'ga_zjxy',
    'gb_xldm',
    'gb_zylb',
    'gb_zzmm',
    'gb_hyzk',
    'gb_mz',
    'gb_zylb'
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
      timer: '',
      show: false,
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
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
          minWidth: '100px',
          show: false
        },
        {
          label: '民族',
          prop: 'mz',
          minWidth: '100px',
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_mz
            return <dict-tag options={val} value={row.mz} />
          }
        },
        {
          label: '政治面貌',
          prop: 'zzmm',
          minWidth: '100px',
          render: (h, { row }) => {
            const val = this.dict?.type?.gb_zzmm
            return <dict-tag options={val} value={row.zhzzJcywSyrkJbxx.zzmm} />
          }
        },
        {
          label: '联系方式',
          prop: 'lxfs',
          minWidth: '100px'
        },
        {
          label: '现住地详址',
          prop: 'xzdxzAddr',
          minWidth: '300px',
          show: false,
          'show-overflow-tooltip': true
        },
        {
          label: '户籍地址',
          prop: 'hjxzAddr',
          minWidth: '300px',
          'show-overflow-tooltip': true
        },
        {
          label: '户籍区划',
          prop: 'hjqh',
          show: false, // 默认显示，手动设置不显示
          render: (h, { row }) => {
            let str = this.getQhlabel(row.hjqh)
            return <span>{str}</span>
          }
        },
        {
          label: '现住地区划',
          prop: 'xzdqh',
          show: false
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
          show: false
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
                  // title={row.xm}
                  promiseStr='jcyw:syrk:hjrk:dangan'
                  onClick={() => this.getPersonInfo(row)}
                />
                <VTableCell
                  type="修改"
                  icon="el-icon-edit"
                  promiseStr='jcyw:syrk:hjrk:edit'
                  onClick={() => this.onEdit(row)}
                />
                <VTableCell
                  type="删除"
                  icon="el-icon-delete"
                  // title={row.xm}
                  promiseStr='jcyw:syrk:hjrk:remove'
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
          zhzzJcywSyrkJbxx: this.queryParams
        }
        let { pageNum, pageSize } = parameter
        return this.filterTableData(listHjrk(parmas, pageNum, pageSize))
      },
      population: null,
      sex: [],
      nation: null,
      religion: null,
      isEdit: false,
      dialogVisible: false,
      dialogImageUrl: '',
      qhoptions: [],
      areaProps: {
        value: 'areaCode',
        label: 'areaName',
        children: 'children',
        emitPath: false
      },
      qhlabelArr: []
    }
  },
  mounted () {
    getxzqh().then((res) => {
      if (res.data) {
        this.qhlabelArr = res.data
      }
    })
    getAreaTree().then((res) => {
      if (res.code === 200) {
        this.qhoptions = res.data
      }
    })
    this.getStatistics()
  },
  methods: {
    getStatistics () {
      let taskList = {
        showCount: 6
      }
      getStatistics(taskList).then(res => {
        this.optionObj = {
          name: '户籍人口',
          num: res.data.totalNum
        }
        res.data.xbList.forEach(item => {
          this.sexList.push({
            name: item.lable,
            value: item.num
          })
        })
        res.data.zjxyList.forEach(item => {
          this.zongjiao.push({
            name: item.lable,
            value: item.num
          })
        })
        res.data.mzList.forEach(item => {
          this.minzu.push({
            name: item.lable.replace('\r', ' '),
            value: item.num
          })
        })
      })
    },
    getQhlabel (data) {
      let arr = this.qhlabelArr.filter((item) => {
        return item.countyCode == data
      })
      if (arr.length != 0) {
        return `${arr[0].provinceName}/${arr[0].cityName}/${arr[0].countyName}`
      } else {
        return ''
      }
    },
    hjqhChange () {
      console.log(this.queryParams.hjqh)
      // this.queryParams.hjqh = this.queryParams.hjqh[2]
    },
    previewImg (dialogImageUrl, dialogVisible) {
      // console.log(dialogImageUrl,dialogVisible)
      this.dialogVisible = dialogVisible
      this.dialogImageUrl = dialogImageUrl
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
    onEdit (row) {
      this.show = true
      this.$refs.editModal.editForm(row)
      this.isEdit = true

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
      localStorage.setItem('rybqqxzf', JSON.stringify(['jcyw:syrk:hjrk:rybq']))
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
      let addRes = await addLdrk(form)
      if (!addRes) return
      // if (this.isEdit) {
      this.$modal.msgSuccess('操作成功')
      // } else {
      //   this.$modal.msgSuccess('新增成功')
      // }
      await this.getStatistics()
      this.$refs.table.refresh()
      this.timer = new Date().getTime()
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
::v-deep .el-form.mb-6px .el-form-item__label {
  text-align: left;
  // text-align-last: justify;
  // text-align: justify;
  // text-justify: distribute-all-lines;
}
::v-deep .el-form.mb-6px .el-select {
  width: 100%;
}
</style>
<style>
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
