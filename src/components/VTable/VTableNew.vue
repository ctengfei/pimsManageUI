<template>
  <el-card class="v-table"
           shadow="never"
           ref="cardTableRef"
           :bodyStyle="{ padding: '16px 16px 0 16px',boxSizing:'border-box',height:'100%',display:'flex',flexDirection:'column', overflow: 'visible !important'}">
    <!-- 查询 -->
    <el-form v-if="$slots.search"
             :label-width="labelWidth"
             justify="space-between">
      <el-row>
        <el-col :span="20">
          <el-row :span="24">
            <slot name="search"></slot>
          </el-row>
          <el-row v-if="advanced">
            <slot name="advanced"></slot>
          </el-row>
        </el-col>
        <el-col :span="4"
                class="fr">
          <el-row justify="space-between">
            <el-form-item label-width="0px"
                          class="text-right">
              <a @click="getAdvanced()"
                 v-if="$slots.advanced"
                 class="mr-10px text-blue-500">
                {{ advanced ? '收起' : '展开' }}
                <i :class="advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
              </a>
              <el-button type="primary"
                         size="mini"
                         icon="el-icon-search"
                         @click="$emit('on-search')">搜索</el-button>
              <el-button size="mini"
                         icon="el-icon-refresh"
                         @click="$emit('on-reset')">重置</el-button>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex"
            align="middle"
            justify="space-between"
            class="pb-8px">
      <slot name="operate"></slot>
      <!-- 操作栏 -->
      <div class="text-right flex-1"
           v-if="tool">
        <!--<el-checkbox v-model="stripe" class="!mb-0px">斑马纹</el-checkbox>-->
        <el-tooltip content="刷新"
                    placement="top">
          <i class="el-icon-refresh text-size-16px cursor-pointer mx-12px"
             @click="refresh"></i>
        </el-tooltip>
        <span v-click-outside="() => (showColumnSet = false)"
              ref="set">
          <el-dropdown :hide-on-click="false"
                       placement="bottom">
            <el-tooltip content="列设置"
                        placement="top">
              <i class="el-icon-setting text-size-16px cursor-pointer"></i>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <div class="max-h-200px overflow-y-auto">
                <el-checkbox-group v-model="checkColumns">
                  <el-dropdown-item :key="item.key"
                                    v-for="item in localColumns">
                    <el-checkbox :value="item.label"
                                 :label="item.label">
                      {{ item.label }}
                    </el-checkbox>
                  </el-dropdown-item>
                </el-checkbox-group>
              </div>
              <el-divider class="!mt-10px !mb-0"></el-divider>
              <el-button size="small"
                         type="text"
                         class="block w-full"
                         style="padding: 0px 15px;
                          font-size: 12px;
                          border-radius: 3px;"
                         @click="initColumn">重置</el-button>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </el-row>

    <!-- 表格 -->
    <div class="zengxin"
         ref="tableDiv"
         id="zengxin">
      <el-table v-bind="$attrs"
                v-on="$listeners"
                :stripe="stripe"
                ref="table"
                :max-height="maxHeight"
                :rowKey="rowKey"
                :loading="localLoading"
                :data="localData"
                @cell-click="changeCellData"
                @cell-mouse-enter="cellMouseEnter">
        <slot></slot>
        <el-table-column v-if="selection"
                         align="center"
                         type="selection"></el-table-column>
        <el-table-column label="序号"
                         v-if="showIndex"
                         align="center"
                         type="index"></el-table-column>
        <template v-for="item in localColumns">
          <el-table-column v-if="item.show"
                           :key="item[rowKey]"
                           :prop="item.prop"
                           v-bind="item">
            <template slot="header">
              <span>{{ item.label }}</span>
            </template>
            <template slot-scope="scope">
              <RenderCell v-if="item.render"
                          :render="item.render"
                          :row="scope.row"
                          :index="scope.$index"
                          :column="item"></RenderCell>
              <span v-else>{{ scope.row[item.prop] || '' }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <div class="text-right"
         style="box-sizing: border-box;padding: 5px 0;">
      <el-pagination v-if="showPagination"
                     background
                     @size-change="onSizeChange"
                     @current-change="onCurrentChange"
                     :current-page="localPagination.pageNum"
                     :page-sizes="localPagination.pageSizes"
                     :page-size="localPagination.pageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="localPagination.total">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import * as vClickOutside from 'v-click-outside-x'
export default {
  name: 'VTableNew',
  props: {
    havecellclick: {
      type: Boolean,
      default: true
    },
    // 搜索label宽度
    labelWidth: {
      type: String,
      default: '80px'
    },
    // 是否显示右侧工具栏
    tool: {
      type: Boolean,
      default: true
    },
    // 是否显示多选框
    selection: {
      type: Boolean,
      default: true
    },
    // 是否序号
    showIndex: {
      type: Boolean,
      default: true
    },
    // 表头配置
    columns: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    // 表格数据
    data: {
      type: Function,
      required: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    forceRefresh: {
      type: Boolean,
      default: false
    }
  },
  components: {
    RenderCell: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, context) => {
        const params = {
          row: context.props.row,
          index: context.props.index
        }
        if (context.props.column) params.column = context.props.column
        return context.props.render(h, params)
      }
    }
  },
  data () {
    return {
      maxHeight: 650,
      advanced: false,
      stripe: false,
      showColumnSet: false,
      localColumns: [],
      checkColumns: [],
      localLoading: false,
      localData: [],
      localPagination: {
        pageNum: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 0
      }
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  watch: {
    checkColumns (val) {
      const { localColumns } = this
      this.localColumns = localColumns.map((item) => ({
        ...item,
        show: val.includes(item.label)
      }))
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    },
    forceRefresh (val) {
      if (val) {
        this.localPagination.pageNum = 1
        this.reset()
        this.loadData()
        this.$emit('getForceRefreshStatus', false)
      }
    }
  },
  created () {
    this.loadData()
    this.initColumn()
    this.getHeight()
  },
  methods: {
    getHeight () {
      setTimeout(() => {
        let obj = this.$refs.tableDiv
        let height = window.getComputedStyle(obj).height//- 2
        let num = (height.substring(0, height.length) * 1)
        this.$nextTick(() => {
          this.maxHeight = Math.trunc(num)
        })
      }, 1);
    },
    getAdvanced () {
      this.advanced = !this.advanced
      this.maxHeight = 650
      this.getHeight()
    },
    changeCellData (row, column, cell) {
      if (column.property === 'idCard') {
        cell.innerHTML = row.idCard ? row.idCard : ''
      }
      if (this.havecellclick) {
        if (column.label === '联系方式') {
          cell.innerHTML = row.phonenumber ? row.phonenumber : ''
        }
      }
      if (column.property === 'zsbt') {
        this.$emit('getViewInfoStatus', row)
      }
    },
    cellMouseEnter (row, column, cell) {
      if (column.label === '身份证号') {
        // cell.innerHTML = row.idCard
        cell.style.cursor = 'pointer'
        // var parent = document.createElement('el-tooltip') //  新建父元素
        // parent.content = '点击查看完整信息'
        // cell.parentNode.replaceChild(parent, cell) //  获取子元素原来的父元素并将新父元素代替子元素
        // parent.appendChild(cell) //  在新父元素下添加原来的子元素
      }
      if (column.label === '联系方式') {
        // cell.innerHTML = row.phonenumber
        cell.style.cursor = 'pointer'
      }
      if (column.property === 'zsbt') {
        cell.style.cursor = 'pointer'
      }
    },
    // 初始化列
    initColumn () {
      this.localColumns = this.columns.map((item) => {
        return {
          ...item,
          show: item?.show === undefined
        }
      })
      this.checkColumns = this.localColumns.map(
        (item) => item.show && item.label
      )
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh (bool = false) {
      if (bool) this.localPagination.pageNum = 1
      this.reset()
      this.loadData()
    },
    reset () {
      this.localData = []
    },
    /**
     * 加载数据方法
     */
    loadData () {
      this.localLoading = true
      const parameter = {
        pageNum: this.localPagination.pageNum,
        pageSize: this.localPagination.pageSize
      }
      const data = this.data(parameter)

      if (
        (typeof data === 'object' || typeof data === 'function') &&
        typeof data.then === 'function'
      ) {
        data.then((res) => {
          if (this.showPagination) this.localPagination.total = res.data.total
          if (
            res.data.data.length === 0 &&
            this.showPagination &&
            this.localPagination.pageNum > 1
          ) {
            this.localPagination.pageNum--
            this.loadData()
            return
          }
          this.localData = res.data.data
          this.localLoading = false
        })
      }
    },
    // pageSize 改变时会触发
    onSizeChange (val) {
      //户籍人口用
      this.$emit('pageSizeChange', val)
      this.localPagination.pageNum = 1
      this.localPagination.pageSize = val
      this.loadData()
    },
    // currentPage 改变时会触发
    onCurrentChange (val) {
      //户籍人口用
      this.$emit('currentPageChange', val)
      this.localPagination.pageNum = val
      this.loadData()
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .el-table--medium .el-table__cell {
  padding: 9px 0;
}
::v-deep .btn[data-v-60f5c391]{
  font-size: 12px !important;
}
::v-deep .btn[data-v-14ad7811] {
  margin: 0 2px;
  font-size: 12px !important;
  padding: 4px 2px;
}
::v-deep .el-table__body-wrapper .is-scrolling-left{
  max-height: 443px;
}
::v-deep .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
}

::v-deep .el-table__body-wrapper {
    overflow: hidden;
    position: relative;
}
::v-deep .el-table__body-wrapper, .el-table__footer-wrapper, .el-table__header-wrapper {
    width: 100%;
}
.v-table {
  width: 100%;
  border: none;
  border-radius: 0;
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
  /deep/ .el-table__fixed-right::before {
    height: 0 !important;
  }
}
.w-full{
  width: 100%;
  text-align: center;
}
.el-table::before {
  height: 0;
}

// .el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0px !important;
}
.zengxin {
  flex: 1;
}
</style>
