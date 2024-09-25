<!--
 * @version:
 * @Author: xlshaod
 * @explain: 巡航计划树组件
 * @Date: 2021-01-21 18:10:23
 * @LastEditTime: 2021-08-24 10:00:32
 * @LastEditors: sscaij
-->
<template>
  <div class="com-table">
    <!-- form表单 -->
    <el-form
      ref="form"
      :model="queryParams"
      :label-width="formObj.labelWidth ? formObj.labelWidth : ''"
      :inline="formObj.inline ? true : false"
      class="demo-ruleForm"
    >
      <template v-for="(query, index) in queryFormList">
        <el-form-item
          v-if="query.isType === 'selectTree'"
          :key="index"
          :label="query.label"
          :prop="query.prop"
        >
          <SelectTree :ref="query.ref" v-model="queryParams[query.prop]" :width="query.width" :options="query.props.list" :props="query.props.defaultProps" />
        </el-form-item>
      </template>
      <!-- 输入框 -->
      <template v-for="(query, index) in queryFormList">
        <el-form-item
          v-if="query.isType === 'input'"
          :key="index"
          :label="query.label"
          :prop="query.prop"
        >
          <el-input
            v-model="queryParams[query.prop]"
            :style="{'width': query.width}"
            :placeholder="query.placeholder"
            :disabled="query.disabled"
            clearable
            @keyup.enter.native="onSearch"
          />
        </el-form-item>
      </template>
      <!-- 下拉选择 -->
      <template v-for="(query, index) in queryFormList">
        <el-form-item
          v-if="query.isType === 'select'"
          :key="index"
          :label="query.label"
          :prop="query.prop"
        >
          <el-select v-model="queryParams[query.prop]" :style="{'width': query.width}" :placeholder="query.placeholder" :filterable="query.filterable">
            <el-option
              v-for="(item, index) in query.props.list"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <!-- 文本输入框 -->
      <template v-for="(query, index) in queryFormList">
        <el-form-item
          v-if="query.isType === 'inputText'"
          :key="index"
          :label="query.label"
          :prop="query.prop"
        >
          <el-input
            v-model="queryParams[query.prop]"
            type="textarea"
            :maxlength="query.maxLength"
            show-word-limit
            :rows="2"
            :placeholder="query.placeholder"
            clearable
          />
        </el-form-item>
      </template>
      <!-- 时间 -->
      <template v-for="(query, index) in queryFormList">
        <el-form-item
          v-if="query.isType === 'time'"
          :key="index"
          :label="query.label"
          :prop="query.prop"
        >
          <DateRangePicker v-model="queryParams[query.prop]" class="date-item" />
        </el-form-item>
      </template>
      <!-- 复选框 -->
      <template v-for="(query, index) in queryFormList">
        <el-form-item
          v-if="query.isType === 'checkbox'"
          :key="index"
          :label="query.label"
          :prop="query.prop"
        >
          <el-checkbox-group v-model="queryParams[query.prop]" :style="{'width': query.width}">
            <el-checkbox v-for="(item, index) in query.props.list" :key="index" :label="item.name" name="type" />
          </el-checkbox-group>
        </el-form-item>
      </template>
      <!-- 单选 -->
      <template v-for="(query, index) in queryFormList">
        <el-form-item
          v-if="query.isType === 'radio'"
          :key="index"
          :label="query.label"
          :prop="query.prop"
        >
          <el-radio-group v-model="queryParams[query.prop]" :style="{'width': query.width}">
            <el-radio v-for="(item, index) in query.props.list" :key="index" :label="item.id" name="type">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item v-if="formObj.isSearchButton">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        <el-button plain icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </el-form-item>
      <!-- form除了常态的搜索和重置，有可能有其他的类似于，新增，多条删除，导出等按钮 -->
      <el-form-item v-if="queryFormList.length > 0" class="queryFormList">
        <div style="display:flex">
          <el-button
              v-for="(btn, index) in formBtnsList"
              :key="index"
              :class="btn.class"
              :icon="btn.icon"
              :disabled="btn.disabled"
              @click="formBtns(btn)"
            >{{ btn.name }}</el-button>
        </div>

      </el-form-item>
    </el-form>
    <div style="margin-bottom:20px" v-if="queryFormList.length === 0">
       <el-button
          v-for="(btn, index) in formBtnsList"
          :key="index"
          :class="btn.class"
          :icon="btn.icon"
          :disabled="btn.disabled"
          @click="formBtns(btn)"
        >{{ btn.name }}</el-button>
    </div>
    <!-- table表格开始 有边框的分页-->
    <div v-if="isHighLight">
      <template>
        <el-table
          ref="table"
          v-loading="isLoading"
          element-loading-text="加载中"
          :data="tableData"
          :border="formObj.border"
          lazy
          style="width: 100%"
          :tree-props="treeProps === true ? {children: 'children', hasChildren: 'hasChildren'} : {}"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="querySet.isSelection" type="selection" align="centlefter" width="55" />
          <el-table-column v-if="querySet.typeIndex" label="序号" type="index" width="50" />
          <el-table-column
            v-for="(item, index) in tableColumns"
            :key="index"
            :prop="item.param"
            :width="item.width ? item.width : 'auto'"
            :sortable="item.sortable ? true : false"
            :show-overflow-tooltip="item.isTitle"
            :label="item.label"
          >
            <template slot-scope="scope">
              <span v-if="item.param === 'menuIcon'">
                <svg-icon v-if="scope.row.menuIcon !== null" :icon-class="scope.row.menuIcon" />
              </span>
              <span v-else-if="item.param === 'state'" :style="{color: scope.row.state === 1 ? '#67C23A' : '#F56C6C'}">
                {{item.render(scope.row)}}
              </span>
              <span v-else-if="item.param === 'read'" :style="{color: scope.row.read === true ? '#67C23A' : '#F56C6C'}">
                {{item.render(scope.row)}}
              </span>
              <span v-else-if="item.render">
                {{ item.render(scope.row) }}
              </span>
              <span v-else>{{ scope.row[item.param] }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            v-if="tableOption.label"
            :label="tableOption.label"
            align="center"
            :width="tableOption.width"
          >
            <template slot-scope="scope">
              <el-button
                v-for="(item, index) in tableOption.options"
                :key="index"
                type="text"
                :style="item.style"
                :icon="item.icon"
                @click.native="btnType(scope.row, item)"
              >
                {{ item.label }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="handlePage"
        />
     </template>
    </div>
  <!-- 没有边框的表格 -->
        <el-table
          v-if="!isHighLight"
          ref="table"
          v-loading="isLoading"
          element-loading-text="加载中"
          :data="tableData"
          :border="formObj.border"
          lazy
          style="width: 100%"
          :tree-props="treeProps === true ? {children: 'children', hasChildren: 'hasChildren'} : {}"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="querySet.isSelection" disabled :selectable="isSelected" type="selection" align="centlefter" width="55" />
          <el-table-column v-if="querySet.typeIndex" label="序号" type="index" width="50" />
          <el-table-column
            v-for="(item, index) in tableColumns"
            :key="index"
            :prop="item.param"
            :width="item.width ? item.width : 'auto'"
            :sortable="item.sortable ? true : false"
            :show-overflow-tooltip="item.isTitle"
            :label="item.label"
          >
            <template slot-scope="scope">
              <span v-if="item.param === 'menuIcon'">
                <svg-icon v-if="scope.row.menuIcon !== null" :icon-class="scope.row.menuIcon" />
              </span>
              <span v-else-if="item.param === 'state'" :style="{color: scope.row.state === 1 ? '#67C23A' : '#F56C6C'}">
                {{item.render(scope.row)}}
              </span>
              <span v-else-if="item.param === 'read'" :style="{color: scope.row.read === true ? '#67C23A' : '#F56C6C'}">
                {{item.render(scope.row)}}
              </span>
              <span v-else-if="item.render">
                {{ item.render(scope.row) }}
              </span>

              <span v-else>{{ scope.row[item.param] }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            v-if="tableOption.label"
            :label="tableOption.label"
            align="center"
            :width="tableOption.width"
          >
            <template slot-scope="scope">
              <el-button
                v-for="(item, index) in tableOption.options"
                :key="index"
                type="text"
                :style="item.style"
                :icon="item.icon"
                @click.native="btnType(scope.row, item)"
              >
                {{ item.label }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <template v-if="!isHighLight">
          <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="handlePage"
        />
        </template>

  </div>
</template>
<script>
import pagination from '../comPagination'
import DateRangePicker from '@/components/DateRangePicker'
import Sortable from 'sortablejs'
export default {
  components: {
    pagination,
    DateRangePicker,
  },
  props: {
    isHighLight: { // table列表是否有外层的边框
      type: Boolean,
      default: () => {
        return false
      }
    },
    queryFormList: {
      type: Array,
      default: () => {
        return []
      }
    },
    formObj: {
      type: Object,
      default: () => {
        return {
          border: false
        }
      }
    },
    formOtherBtns: {
      type: Array,
      default: () => {
        return []
      }
    },
    treeProps: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    queryData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    queryUrl: {
      type: Function
    },
    tableColumns: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableOption: {
      // 表格操作
      type: Object,
      default: () => {
        return {}
      }
    },
    isDrag: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    tableSelected: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isDel: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isDelNum: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    urlData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    resetData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableHeight: {
      type: String,
      default: '640'
    },
    querySet: {
      type: Object,
      default: () => {
        return {
          isPage: true,
          queryType: 'Object',
          queryString: '',
          isSelection: true,
          typeIndex: false,
          permission: '',
        }
      }
    }
  },
  data() {
    return {
      inheritAttrs: true,
      sortable: null,
      isLoading: false,
      queryParams: this.queryData,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      isAbled: true,
      selectData: [],
      currentQuery: this.queryData,
      list: [],
      dragList: [],
      queryUrlData: {},
      queryResetData: {}
    }
  },
  computed: {
    formBtnsList() {
      if (this.isDel) {
          if (this.$store.getters.btnDataList.length === 0) {
          return this.formOtherBtns
        } else {
          return this.$store.getters.btnDataList
        }
      } else {
        return this.formOtherBtns
      }
    },
    dropCol() {
      return this.tableColumns
    },
    tableData() {
      return this.list
    }
  },
  watch: {
    'queryParams.createTime'(cur, old) {
      if (cur) {
        this.queryParams.startTime = cur[0]
        this.queryParams.endTime = cur[1]
      } else {
        this.queryParams.startTime = ''
        this.queryParams.endTime = ''
      }
    },
    queryData: {
      handler(val) {
        this.queryParams = val
        this.currentQuery = val
      },
      deep: true,
      immediate: true
    },
    urlData: {
      handler(val) {
        this.queryUrlData = val
      },
      deep: true,
      immediate: true
    },
    resetData: {
      handler(val) {
        console.log('val ---', val)
        this.queryResetData = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  methods: {
    // 获取列表
    async getList(url, method){
      console.log('url ---', url)
      try {
        if (this.querySet.isPage) {
          if (method === 'GET') {
            this.isLoading = true
//            url = `${url}&pageNum=${this.listQuery.pageNum}&pageSize=${this.listQuery.pageSize}`
            let params = Object.assign(this.listQuery, this.currentQuery)
            const result = await this.queryUrl(url, method, params)
            if (result.code === 200) {
              this.list = result.data.data === null ? [] : result.data.data
              this.total = result.data.total
            } else {
              this.$message.error(result.meta.message)
            }
            this.isLoading = false
          } else {
            const result = await this.queryUrl(url, method, { ...this.listQuery, ...this.currentQuery })
            if (result.code === 200) {
              this.list = result.data.data === null ? [] : result.data.data
              this.total = result.data.total
            } else {
              this.$message.error(result.meta.message)
            }
            this.isLoading = false
            if (this.isDrag) {
              this.$nextTick(_ => {
                this.rowDrop()
              })
            }
          }

        } else {
          if (method === 'GET') { // get请求
            this.isLoading = true

            const result = await this.queryUrl(url, method)
            if (result.code === 200) {
              this.list = result.data === null ? [] : result.data
              console.log('this.list ===', this.list)
            } else {
              this.$message.error(result.meta.message)
            }
            this.isLoading = false
          } else { // post

          }
        }
      } catch {

      }
    },
    handlePage() {
      console.log('this.queryUrlData.method', this.queryUrlData.method)
      let url;
      let arr = []
      if (this.queryUrlData.method === "GET") {
        url = this.queryUrlData.url
        // for (var i in this.currentQuery) {
        //   arr.push(`${i}=${this.currentQuery[i]}`)
        // }
        // url = `${url[0]}?${arr.join('&')}`
        console.log('url ----999', url)
        this.getList(url, this.queryUrlData.method)
      } else {
        this.getList(this.queryUrlData.url, this.queryUrlData.method)
      }
    },
    // 鼠标按下搜索
    enterSearch() {
      let isTrue = this.queryFormList.some(x => x.isEnter === true)
      if (!isTrue) return
      this.listQuery.pageNum = 1
      console.log('this.queryUrlData', this.queryUrlData)

      this.getList(this.queryUrlData.url, this.queryUrlData.method)
    },
    // table表格的按钮点击(编辑，删除)事件
    /**
     * 可以在此组件将url传递过来，组件内删除，也可分发到父组件然后做操作
     * 编辑和新增可复用一个对话框的form
     */
    btnType(row, item) {
      if (item.methods === 'edit') { // 编辑
        this.onEdit(item.url)
      } else if (item.methods === 'delete') { // 删除
        this.selectData = [row]
         this.$emit('onDelete', row)
      } else if (item.methods === 'check') {
        this.$emit('onCheck', row)
      } else if (item.methods === 'add') {
        this.$emit('onAdd', row)
      } else if (item.methods === 'record') {
        this.$emit('onRecord', row)
      }
      // this.$emit("operateHandle", row, type)
    },
    // 点击排序
    handleSortChange(val) {
    },
    // 选择多行
    handleSelectionChange(val) {
      this.selectData = val
      this.formBtnsList.length > 0 && this.formBtnsList.map(x => {
        if (val.length > 0) {
            x.disabled = false
          } else {
            x.disabled = true
        }
      })
      this.$store.commit('app/SET_SELECTED_DATA', this.selectData)
    },
    // 搜索
    onSearch() {
      this.listQuery.pageNum = 1
      this.currentQuery = JSON.parse(JSON.stringify(this.queryParams))
      if ('createTime' in this.currentQuery) {
        delete this.currentQuery.createTime
      }
      let str = ''
      let arr = []
      let url;
      // this.queryUrlData = deepClone(this.queryUrlData)
      if (this.queryUrlData.method === "GET") {
        url = this.queryUrlData.url.split('?')[0]
        for (var i in this.currentQuery) {
          arr.push(`${i}=${this.currentQuery[i]}`)
        }
        console.log(arr)
        // url = `${url[0]}?${arr.join('&')}`
        this.getList(url, this.queryUrlData.method)
      } else {
        this.getList(this.queryUrlData.url, this.queryUrlData.method)
      }
    },
    // 重置
    onReset() {
      this.$refs.form.resetFields()
      this.currentQuery = JSON.parse(JSON.stringify(this.queryParams))
      this.queryData = JSON.parse(JSON.stringify(this.queryParams))
      this.listQuery.pageNum = 1
      // 调getList
      this.getList(this.queryUrlData.url, this.queryUrlData.method)
    },
    // form表单的其他按钮
    formBtns(btn) {
      // this.selectData = btn.type === 'del' ? this.selectData : null
      if (btn.type === 'add') {
        // 新增
        this.$emit('btnAdd', this.queryParams)
      } else if (btn.type === 'del') {
        this.$emit('btnDelete', this.selectData)
      } else if (btn.type === 'read') {
        this.$emit('btnRead', this.selectData)
      } else {
        this.btnExport(btn)
      }
    },
    isSelected(row, index) {
      if (this.tableSelected) {
        if ((row.creator === this.$store.getters.user.username) || this.$store.getters.user.username === 'admin') {
          return 1
        } else {
          return 0
        }
      } else {
        return 1
      }
    },
    rowDrop() {
      // 获取当前表格
      const tbody = this.$refs.table.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      const that = this
      // newIndex -- 新下标 oldIndex -- 旧下标
      Sortable.create(tbody, {
        ghostClass: 'sortable-ghost',
        onEnd({ newIndex, oldIndex }) {
          // 移除原来的数据
          const currRow = that.tableData.splice(oldIndex, 1)[0]
          // 移除原来的数据并插入新的数据
          that.tableData.splice(newIndex, 0, currRow)
          that.$emit('changeOrder', that.tableData)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.demo-ruleForm {
  &.el-form--inline .el-form-item, &.el-form--inline .el-form-item__content {
    vertical-align: middle;
    .el-button {
      vertical-align: top;
    }
  }
}
// .com-table .el-table.el-table--fit{
//   overflow-y: scroll;
// }
.padding {
    padding: 15px;
  }
  .queryFormList{
    position: absolute;
    right:-10px;
  }
</style>
