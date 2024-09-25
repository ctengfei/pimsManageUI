<!--
 * @version:
 * @Author: dongwangs
 * @explain: 轮巡左侧树组件
 * @Date: 2021-01-22 16:17:36
 * @LastEditTime: 2022-02-14 14:52:32
 * @LastEditors: HJQ
-->
<template>
  <div class="video-web-tabs-tree">
    <div class="search video-web-flex" v-show="dominShow">
      <el-input
        placeholder="请输入关键字"
        v-model="searchValue"
        class="searchValue"
      >
      </el-input>
    </div>
    <div v-if="dominShow" class="tabs" >
      <el-tabs
        v-model="activeName"
        :type="type"
        :closable="closeable"
        :tab-position="tabPosition"
        :stretch="stretch"
        :before-leave="beforeLeave"
        @tab-click="switchTab"
        @tab-remove="tabRemove"
      >
        <el-tab-pane
          v-for="(item, index) in tabData"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <el-tree
            ref="treeRef"
            :data="data"
            :props="props"
            :highlight-current="highlightCurrent"
            :expand-on-click-node="expandOnClickNode"
            :default-expanded-keys="filterExpandedKeys"
            :filter-node-method="filterNode"
            :node-key="nodeKey"
            :draggable="draggable"
            :auto-expand-parent="true"
            :show-checkbox="isCheckBox"
            :default-expand-all="defaultExpandAll"
            :default-checked-keys="defaultCheckedKeys"
            :current-node-key="currentNodeKey"
            @node-click="nodeClick"
            @check="nodeCheck"
            @check-change="checkChange"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
            @node-contextmenu="nodeContextmenu"
            @node-drag-end="nodeDragEnd"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
          >
            <div class="video-web-flex" slot-scope="{ node, data }" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <span style="width:80%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">
              <!-- <i v-if="item.label === '收藏' && node.data.deviceId === null && node.level < 4" style="color:#ffcf5c"
                 class="iconfont iconwenjianjia"/>
              <i v-else-if="item.label === '组织树' && node.data.type === 'IPC' " style="color:#fff"
                 class="iconfont iconshexiangtou-off"/>
              <i v-else-if="item.label === '组织树' && node.data.type === 'MOBILE_DEVICE' " style="color:#fff"
                 class="iconfont iconyidongshexiangtou"/>
              <i v-else-if="item.label === '组织树' && node.data.type === 'DIR' " style="color:#fff"
                 class="iconfont iconziyuan"/> -->
              <span>{{ data.name
                }}</span>
            </span>
              <!-- tabs为区域 -->
              <div v-if="item.label === '组织树'">
                <span class="video-tree-edit" v-if="isShow">
                <el-button
                  v-if="!node.data.favorite && node.data.type !== 'DIR'"
                  circle
                  @click="() => updateFavourites(node,data)">
                </el-button>
                <el-button
                  v-if="node.data.favorite && node.data.type !== 'DIR'"
                  icon="el-icon-star-on"
                  circle
                  @click="() => onFavouriteRemove(node,data)">
                </el-button>
                </span>
              </div>

              <!-- tabs为收藏 -->
              <div v-if="item.label === '收藏'">
                <span class="video-tree-edit">
                  <el-button
                    v-if="node.data.deviceId === null && node.level < 3"
                    icon="el-icon-circle-plus-outline"
                    circle
                    type="text"
                   
                    @click.stop="() => onFavouriteAdd(data)">
                    </el-button>
                    <el-button
                      v-if="node.data.deviceId === null"
                      type="text"
                      icon="el-icon-delete"
                      circle
                     
                      @click.stop="() => onFavouriteRemove(node, data)">

                    </el-button>
                    <el-button
                      v-if="node.data.deviceId === null"
                      icon="el-icon-edit"
                      circle
                      type="text"
                     
                      @click.stop="() => onFavouriteEdit(node,data)">
                    </el-button>
                    <el-button
                      v-if="!node.data.favorite && node.data.favorite !== null"
                      icon="el-icon-star-on"
                      circle
                      type="text"
                     
                      @click.stop="() => onFavouriteCancel(node,data)">
                    </el-button>
                  </span>
              </div>
            </div>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="domaincss">
      <el-tree
        ref="treeRef"
        :data="data"
        :props="props"
        :highlight-current="highlightCurrent"
        :expand-on-click-node="expandOnClickNode"
        :default-expanded-keys="filterExpandedKeys"
        :filter-node-method="filterNode"
        :node-key="nodeKey"
        :draggable="draggable"
        :auto-expand-parent="true"
        :show-checkbox="isCheckBox"
        :default-expand-all="defaultExpandAll"
        :default-checked-keys="defaultCheckedKeys"
        :current-node-key="currentNodeKey"
        @node-click="nodeClick"
        @check="nodeCheck"
        @check-change="checkChange"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
        @node-contextmenu="nodeContextmenu"
        @node-drag-end="nodeDragEnd"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
      >
        <div class="video-web-flex" slot-scope="{ node, data }" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <span>
              <i v-if="node.data.deviceId === null" style="color:#ffcf5c" class="iconfont iconwenjianjia"/>
              <span style="width:80%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{ data.name
                }}</span>
            </span>
          <!-- tabs为区域 -->
          <div>
                <span class="video-tree-edit" v-if="node.data.type === 'FIXED_DEVICE' && isShow">
                 <!-- 标签 -->
                <el-button
                  v-if=""
                  icon="el-icon-collection-tag"
                  circle
                  @click="() => updateMark(data)">
                </el-button>
                  <!-- 收藏 -->
                <el-button
                  v-if=""
                  icon="el-icon-star-on"
                  circle
                  @click="() => updateFavourites(node,data)">
                </el-button>
                </span>
          </div>
        </div>
      </el-tree>
    </div>
    <div v-if="isShowContextMenu && !isShow" ref="contextMenuRef" class="contextmenu" @mouseleave="leaveEvent">
      <ul>
        <li @click="addCollect">添加收藏</li>
        <li @click="addMark">添加标签</li>
        <li v-show="isShowDeleteTag" @click="deleteMark">删除标签</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getDeviceInfoById} from '@/api/system/organization'
  import {reAllTagsInDevice} from '@/api/mutiTree'
  import {Message} from 'element-ui'

  export default {
    props: {
      districtList: Array,
      favouriteList: Array,
      props: {
        // 配置选项
        type: Object,
        require: true,
        default() {
          return {}
        }
      },
      treeRef: {
        // 操作DOM用。
        type: String,
        require: false,
        default: 'tree'
      },
      expandOnClickNode: {
        // 是否在点击节点的时候展开或者收缩节点
        type: Boolean,
        require: false,
        default: false
      },
      highlightCurrent: {
        // 高亮当前选中节点，默认值是 true。
        type: Boolean,
        require: false,
        default: true
      },
      defaultExpandedKeys: {
        // 默认展开的节点
        type: Array,
        require: false,
        default() {
          return []
        }
      },

      defaultCheckedKeys: {
        // 默认勾选的节点的
        type: Array,
        require: false,
        default() {
          return []
        }
      },
      nodeKey: {
        // 树唯一标识
        type: String,
        require: true,
        default: ''
      },
      defaultExpandAll: {
        // 默认展开所有节点
        type: Boolean,
        require: false,
        default: false
      },
      isShow: {
        type: Boolean,
        require: false,
        default: false
      },
      tabData: {
        type: Array,
        required: true
      },
      type: {
        type: String
      },
      closeable: {
        type: Boolean,
        default: false
      },
      addable: {
        type: Boolean,
        default: false
      },
      editable: {
        type: Boolean,
        default: false
      },
      tabPosition: {
        type: String,
        default: 'top'
      },
      stretch: {
        type: Boolean,
        default: false
      },
      beforeLeave: {
        type: Function
      },
      allTagsOptions: {
        type: Array,
        default: function () {
          return []
        }
      },
      collectCascaderOptions: {
        type: Array,
        default: function () {
          return []
        }
      },
      isShowContextmenu: {
        type: Boolean,
        default: false
      },
      draggable: {
        type: Boolean,
        default: false
      },
      dominShow: {
        type: Boolean,
        default: true
      },
      isCheck: {
        type: String,
        default: ''
      },
      permissionData: Object,
      currentNodeKey: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        rightNav: false, // 控制右键菜单显示与隐藏
        id: 999,
        treeValue: '',
        num: 0, // 每次只能添加一个，或者编辑一个，多个则为bug
        treeClickCount: 0,
        draggableData: [],
        activeName: this.tabData[0].name,
        tableData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        isShowContextMenu: false, //是否开启右键点击功能
        isShowDeleteNode: false, // 默认不展示收藏树节点上的删除按钮
        isShowDeleteTag: false, // 默认不展示删除标签按钮
        searchValue: '', // 搜索的值
        cascaderProps: {
          value: 'id',
          label: 'name',
          checkStrictly: true,
          expandTrigger: 'hover',
          emitPath: false
        },
        defaultShowNodes: [],
        filterExpandedKeys: [],
        permissionObj: {},
        // isCheckBox: this.showCheckBox
      }
    },
    created() {
      
    },
    mounted() {
      this.getTreeRef()
    },
    computed: {
      isCheckBox() {
        if (this.isCheck === '') {
          return false
        } else {
          if (this.activeName === 'first') {
            return true
          } else {
            return false
          }
        }
      },
      data() {
        if (this.activeName === 'first') {
          return this.districtList
        } else {
          return this.favouriteList
        }
      },
    },
    watch: {
      currentNodeKey(val){
        if(this.dominShow){
          this.$nextTick(() => {
            this.$refs.treeRef[0].setCurrentKey(this.currentNodeKey);
          });
          this.filterExpandedKeys = [this.currentNodeKey]
        }else{
          this.$nextTick(() => {
            this.$refs.treeRef.setCurrentKey(this.currentNodeKey);
          });
          this.filterExpandedKeys = [this.currentNodeKey]
        }
        
      },
      searchValue(val) {
        if (this.activeName === 'first') {
          this.$refs.treeRef[0].filter(val);
        } else if (this.activeName === 'second') {
          this.$refs.treeRef[1].filter(val);
        }
      },
      defaultExpandedKeys(newVal, oldVal) {
        this.filterExpandedKeys = newVal
      },
      permissionData: {
        handler(newVal, oldVal) {
          this.permissionObj = newVal
        },
        immediate: true
      },
    },
    methods: {
      /* 点击节点 */
      nodeClick(data, node, tree) {
        if (!this.nodeKey) return
        // 记录点击次数
        this.treeClickCount++
        // 单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
        if (this.treeClickCount >= 2) {
          return
        }
        // 计时器,计算200毫秒为单位,可自行修改
        this.timer = window.setTimeout(() => {
          if (this.treeClickCount === 1) {
            //  把次数归零
            this.treeClickCount = 0
            //  单击事件
            this.$emit('handleNodeClick', data, this.activeName)
          } else if (this.treeClickCount > 1) {
            //  把次数归零
            this.treeClickCount = 0
            //  双击事件
            this.$emit('handleNodeDblclick', data, node, tree)
          }
        }, 500)
      },
      // 节点拖拽
      nodeDragEnd(node, prenode, pis, evt) {
        this.$emit('handleNodeDragEnd', node, prenode, pis, evt)
      },
      // 节点选中便哈
      checkChange(data, node, childNode) {
      },
      /* 对树节点过滤 */
      filterNode(value, data, node) {
        if (!value) {
          this.filterExpandedKeys = []
          this.defaultExpandAll = false
          return true
        }
        return data[this.props.label].includes(value)
      },

      /* 把树的ref传给父组件 */
      getTreeRef() {
        this.$emit('getTreeRef', this.$refs[this.treeRef])
      },

      /* 点击复选框 */
      nodeCheck(node, obj) {
        if (this.activeName === 'first') {
          this.$emit('nodeCheck', node, obj)
        } else {
          this.$emit('nodeCheck', node, obj)
        }


        // 父组件事件名:check
      },
      // 默认展开的节点
      handleNodeExpand(data) {
        let flag = false
        this.filterExpandedKeys.some(item => {
          if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
            flag = true
            return true
          }
        })
        if (!flag) { // 不存在则存到数组里
          this.filterExpandedKeys.push(data.id)
        }
      },
      handleNodeCollapse(data) {
        // 删除当前关闭的节点
        this.filterExpandedKeys.some((item, i) => {
          if (item === data.id) {
            this.filterExpandedKeys.splice(i, 1)
          }
        })
      },
      /* 节点鼠标右键 */
      async nodeContextmenu(event, obj, node, self) {
        // 如果没有多选框 或 禁用右键菜单
        // if (!this.showCheckbox || this.props.disabledRightMenu) {
        //   return // 右键不显示菜单。
        // }
        this.$emit('nodeContextmenu', event, obj, node, self) // 右键时触发父组件事件@right-menu-data，获取值
        this.nodeContextmenuObj = obj
        // 右击设备查询设备标签
        if (obj.type === 'DEVICE' && this.isShowContextmenu === true) {
          const res = await reAllTagsInDevice(obj.id)
          // console.log(res, 'resTag')
          if (res.meta.status === 200) {
            // 如果查询结果为null, 不展示删除标签
            if (!res.data) {
              this.isShowDeleteTag = false
            } else {
              this.isShowDeleteTag = true
            }
          } else {
            Message.error(res.meta.message)
          }
          this.isShowContextMenu = true
          this.$nextTick(() => {
            this.$refs.contextMenuRef.style.left = event.pageX - 10 + 'px'
            this.$refs.contextMenuRef.style.top = event.pageY - 10 + 'px'
          })
        }
      },
      // 右键勾选递归
      getTreeCheck(dataAll, data, childrenName, code) {
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (this.checkedKeys.indexOf(data[i][code]) === -1) {
              this.checkedKeys.push(data[i][code])
            }
            if (data[i][childrenName] && data[i][childrenName].length > 0) {
              this.getTreeCheck(
                dataAll,
                data[i][childrenName],
                childrenName,
                code
              )
            }
            this.$refs[this.treeRef].setCheckedKeys(this.checkedKeys)
          }
        }
      },
      updateMark(data) {
        this.$emit('updateMark', data)
      },
      updateFavourites(node,data) {
        this.$emit('updateFavourites', data)
      },
      remove(node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
        this.$emit('removeNode', node, data)
      },
      datadragEnd(evt) {
        this.$emit('treeDrag', evt)
      },
      datadragMove(evt) {
      },
      // 收藏设备
      addCollect() {
        // console.log('收藏设备')
        this.$emit('addCollect')
      },
      // 取消收藏
      deleteCollect() {
        // console.log('取消收藏')
        this.$emit('deleteCollect')
      },
      // 触发添加标签
      addMark() {
        this.$emit('addMark')
      },
      // 触发删除标签
      deleteMark() {
        this.$emit('deleteTag')
      },
      // 切换tab
      switchTab(tab, event) {
        this.activeName = tab.name
        // 切换tab, 置空搜索框的值
        this.searchValue = ''
        this.$emit('switchTab', tab, event)
      },
      tabRemove(name) {
        // console.log(name, 'name')
        this.$emit('tabRemove', name)
      },
      leaveEvent() {
        this.isShowContextMenu = false
      },
      showOperateBtn(e) {
        e.target.children[1].style.display = 'inline-block'
      },
      hiddenOperateBtn(e) {
        e.target.children[1].style.display = 'none'
      },
      // 在收藏树下, 鼠标进入节点,显示删除按钮
      mouseenter(e) {
        if (this.activeName === 'first') {
          return
        }
        e.target.children[1].style.display = 'inline-block'
      },
      mouseleave(e) {
        if (this.activeName === 'first') {
          return
        }
        e.target.children[1].style.display = 'none'
      },
      // 触发收藏树下删除事件
      deleteColloctNode(data) {
        // console.log(data, 'data')
        this.$emit('deleteColloctNode', data)
      },
      // 改变下拉选择的值
      changeSelect(value) {
        this.$emit('changeSelect', value)
      },
      handleVisibleChange(flag) {
        if (flag && this.$refs.cascaderRef.getCheckedNodes().length === 0) {
          // 重置激活路径，级联下拉框恢复默认，收起展开节点路径面板
          this.$refs.cascaderRef.panel.activePath = []
          this.$refs.cascaderRef.panel.syncActivePath()
        }
      },
      //  拖拽后不改变层级结构
      allowDrop() {
        return false
      },
      allowDrag(draggingNode) {
        return !draggingNode.data.children
      },


      // 以下为收藏树的节点的功能
      onFavouriteAdd(node,data) {
        this.$emit('onFavouriteAdd', data)
      },
      onFavouriteEdit(node) {
        this.$emit('onFavouriteEdit', node)
      },
      onFavouriteCancel(node) {
        this.$emit('onFavouriteCancel', node, 'cancel')
      },
      onFavouriteRemove(node) {
        this.$emit('onFavouriteRemove', node)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    margin-bottom: 20px;
  }

  ::v-deep .el-tabs__item.is-active {
    border-radius: 30px !important;
  }
  .video-web-flex {
    width: 100%;
    display: flex;
    align-items: center;
  }

  // .domaincss {
  //   overflow: auto;
  //   font-size: 14px;
  //   .video-web-tabs-tree {
  //     .el-tabs {
  //       .el-tabs__header {
  //         .el-tabs__nav-wrap {
  //           border-radius: 30px !important;
  //           border: 0px !important;
  //         }
  //       }
  //     }
  //   }
  // }
</style>
