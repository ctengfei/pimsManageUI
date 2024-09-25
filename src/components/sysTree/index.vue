<!--
 * @version:
 * @Author: ningyangf
 * @explain: 菜单管理树组件
 * @Date: 2021-01-22 18:46:12
 * @LastEditTime: 2022-10-27 09:51:54
 * @LastEditors: renjianwu jwrenx@isstech.com
-->
<template>
  <div class="video-web-left-area">
    <div class="video-web-flex video-web-form-box">
      <el-input
        v-model="filterText"
        clearable
       
        placeholder=" 请输入查询内容 "
        :style="{'width': $store.getters.user.username === 'admin' ? '200px' : '100%'}"
      />
      <el-button v-show="$store.getters.user.username === 'admin'" type="primary" @click="addNewMenu">新增根目录</el-button>
      <!-- <span>
        <el-button type="success" icon="el-icon-search" @click="toSearch(filterText)">搜索</el-button>
        <el-button type="warning" icon="el-icon-refresh-left" @click="reSearch()">重置</el-button>
      </span> -->
    </div>
    <!-- <div style="height:1px;width:100%;background:#ececec;margin:20px 0" /> -->
    <!-- <div class="parentAdd" >
      <el-button v-show="!isAddRoot" style="margin:20px 20px" type="primary" icon="el-icon-plus" @click="addNewMenu">新增根目录</el-button>
    </div> -->
    <el-tree
      ref="baseTree"
      v-loading="loading"
      :data="treeData"
      node-key="id"
      class="video-web-tree"
      :filter-node-method="filterNode"
      :default-expand-all="defaulTexpandAll"
      :default-expanded-keys="keys"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-expand="handleNodeExpand"
      @node-click="handleNodeClick"
      @node-collapse="handleNodeCollapse"
    >
      <span slot-scope="{ node, data }" class="video-web-flex" :style="{'background-color': node.data.flag ? '#1a3376' : '' }">
        <!--<template v-if="node.label.length > 4">-->
          <!--<el-tooltip class="item" effect="dark" placement="top-start" :content="node.label">-->
           <!--<span style="width: 80%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" >{{ node.label }}</span>-->
          <!--</el-tooltip>-->
        <!--</template>-->
        <span style="width: 80%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" >{{ node.label }}</span>
        <span class="el-btn video-tree-edit">
          <span>
            <el-button
              v-if="isType === 'group' && $route.path==='/menu' && data.menuType!==2 && flagAuth(data)"
              icon="el-icon-circle-plus-outline"
              circle
              type="text"
             
              @click.stop="handleAdd(node, data)"
            />
            <el-button
              v-else-if="isType !== 'group' && $route.path==='/menu' && data.menuType!==2 && $store.getters.btnpremissAll[permissionObj.add] "
              icon="el-icon-circle-plus-outline"
              circle
              type="text"
             
              @click.stop="handleAdd(node, data)"
            />
          </span>
          <span>
            <el-button
              v-if="isType === 'group' && $route.path!=='/menu' && flagAuth(data)"
              icon="el-icon-circle-plus-outline"
              circle
              type="text"
             
              @click.stop="appendMenu(data)"
            />
            <el-button
              v-else-if="isType !== 'group' &&  $route.path!=='/menu' && $store.getters.btnpremissAll[permissionObj.add]"
              icon="el-icon-circle-plus-outline"
              circle
              type="text"
             
              @click.stop="appendMenu(data)"
            />
          </span>
          <!-- <span>
            <el-button
              v-if="isType === 'group' && $route.path==='/menu' && flagAuth(data)"
              icon="el-icon-edit"
              circle
              type="text"
             
              @click.native="handleEditmenu(node, data)"
            />
            <el-button
             v-else-if="isType !== 'group' && $route.path==='/menu' && $store.getters.btnpremissAll[permissionObj.edit]"
              icon="el-icon-edit"
              circle
              type="text"
             
              @click.native="handleEditmenu(node, data)"
            />
           </span> -->
           <!-- <span>
              <el-button
                v-if="isType === 'group' && $route.path!=='/menu' && flagAuth(data)"
                icon="el-icon-edit"
                circle
                type="text"
               
                @click.native="handleEdit(node, data)"
              />
                <el-button
                v-else-if="isType !== 'group' && $route.path!=='/menu' && $store.getters.btnpremissAll[permissionObj.edit]"
                icon="el-icon-edit"
                circle
                type="text"
               
                @click.native="handleEdit(node, data)"
              />
          </span> -->
          <span>
            <el-button
              v-if="isType === 'group' && flagAuth(data)"
              type="text"
              icon="el-icon-delete"
              circle
             
              @click.stop="handleremove(node, data)"
            />
            <el-button
              v-else-if="isType !== 'group' && $store.getters.btnpremissAll[permissionObj.del]"
              type="text"
              icon="el-icon-delete"
              circle
             
              @click.stop="handleremove(node, data)"
            />
          </span>
        </span>
        </span>
    </el-tree>
  </div>
</template>

<script>
import { queryTree } from '@/utils/index'
export default {
  name: 'SysTree',
  props: {
    permissionData: Object,
    initData: {
      type: Array,
      required: true
    },
    allowDataList: {
      type: Array,
      required: false
    },
    permission: Object,
    isType: String,
    defaulTexpandAll: {
      type: Boolean,
      default: false
    },
    paneName: {
      type: String,
      default: '1'
    },
    isAddRoot: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    filterKey: String
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'nameTitle'
      },
      isScroll: false,
      filterText: '',
      treeData: [], // 树形组件数据集
      // 树形结构所需数据
      treeSetData: {
        editFlg: true, // 是否是编辑状态
        // 编辑树形数组内容
        editList: [],
        // 删除树形数据数组内容
        deleteList: [],
        // 添加树形数据数组内容
        addList: [],
        // 是否添加flg
        addNodeFlg: false,
        deloge: {
          isshow: false,
          type: 0,
          else: 0
        },
        // 默认的id
        defaultId: 5000,
        // 新增的最外层节点名称
        newName: '',
        tree_key: 0
      },
      value: '',
      dian: 'dianjiyixia',
      flag: true,
      keys: [],
      loading: true,
      permissionObj: {},
      // showArr: [],
      // newShowArr: [],
      authList: []
    }
  },
  watch: {
    initData(cur, old) {
      // console.log('sss22', this.loading)
      if (cur) {
        // this.currentList = cur
        this.loading = false
        // console.log('sss44', this.loading)
        this.treeData = queryTree(cur)
      }
    },
    allowDataList(cur, old) {
      if (cur) {
        this.authList = cur
      }
    },
    filterText(val) {
      this.$refs.baseTree.filter(val);
    },
    // permission(newVal, oldVal) {
    //   this.permissionObj = newVal
    //   console.log(permissionObj, 'ddd')
    // },
    permissionData: {
      handler(newVal, oldVal) {
        // console.log('newVal ---', newVal)
        this.permissionObj = newVal
      },
      immediate: true
    }
  },
  methods: {
    flagAuth(data) {
      if (this.$store.getters.user.admin) {
        return true
      } else {
        if (data.groupMaster === this.$store.getters.user.username ) {
          return true
        } else {
          let isTrue = this.authList.some(x => data.pid === x.id)
          return isTrue
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    handleAdd(node, data) {
      this.appendMenu(data)
    },
    handleNodeExpand(data) {
      // let flag = false
      // this.keys.some(item => {
      //   if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
      //       flag = true
      //       return true
      //   }
      // })
      let flag = this.keys.some(x => x === data.id)
      if (!flag) { // 不存在则存到数组里
        this.keys.push(data.id)
      }
    },
    handleNodeCollapse(data, node) {
      this.keys.some((item, i) => {
        if (item === data.id) {
          this.keys.splice(i, 1)
        }
      })
    },
    handleEditmenu(node, data) {
      if (node.data.menuType === 0) {
        this.editList(node, data)
      } else if (node.data.menuType === 1) {
        this.editMenu(node, data)
      } else if (node.data.menuType === 2) {
        this.editBtn(node, data)
      }
    },
    handleEdit(node, data) {
      this.editList(node, data)
    },
    handleremove(node, data) {
      this.removeList(node, data)
    },
    addNewMenu() {
      this.treeSetData.deloge.isshow = true
      this.treeSetData.deloge.type = 0
      this.$emit('addNewMenu', this.treeSetData.deloge)
    },
    // 取消按钮
    add_area_cancel() {
      this.treeSetData.addNodeFlg = false
      this.treeSetData.newName = ''
    },
    // toSearch(val) {
    //   this.keys = []
    //   if (val) {
    //     this.initData.forEach(item => {
    //       if (item.nameTitle.search(val) !== -1) {
    //         item.bgColor = '#37f'
    //         this.keys.push(item.pid)
    //       } else {
    //         item.bgColor = '#666'
    //       }
    //     })
    //   } else {
    //     this.initData.forEach(item => {
    //       item.bgColor = '#666'
    //     })
    //     this.loading = false
    //   }
    //   this.loading = false
    //   this.treeData = queryTree(this.initData)
    // },
    // reSearch() {
    //   this.keys = []
    //   this.initData.forEach(item => {
    //     item.bgColor = '#666'
    //     this.filterText = ''
    //   })
    //   this.loading = false
    //   this.treeData = queryTree(this.initData)
    // },
    handleNodeClick(data, node) {
      // console.log('--------data', data)
      // console.log('------node', node)
      node.data.flag = false
      this.dealFlag(this.treeData, node.data)

      this.$emit('treeNodeData', node, data, this.paneName)
    },
    dealFlag(arr, obj) {
      arr.map((item) => {
        if(item.id === obj.id) {
          item.flag = true
        }else {
          item.flag = false
        }
        if(item.children) {
          this.dealFlag(item.children, obj)
        }
      })
    },
    appendMenu(data) {
      this.treeSetData.deloge.isshow = true
      this.treeSetData.deloge.type = 1
      this.$emit('appendMenu', this.treeSetData.deloge, data)
    },
    // appendBtn(data) {
    //  this.treeSetData.deloge.isshow = true
    //  this.treeSetData.deloge.type =1
    //  this.$emit('appendBtn',this.treeSetData.deloge,data)
    // },
    removeList(node, data) {
      this.$emit('removeList', node, data)
    },
    editList(node, data) {
      this.treeSetData.deloge.isshow = true
      this.treeSetData.deloge.type = 0
      this.$emit('editList', this.treeSetData.deloge, node, data)
    },
    editMenu(node, data) {
      this.treeSetData.deloge.isshow = true
      this.treeSetData.deloge.type = 1
      this.$emit('editMenu', this.treeSetData.deloge, node, data)
    },
    editBtn(node, data) {
      this.treeSetData.deloge.isshow = true
      this.treeSetData.deloge.type = 2
      this.treeSetData.deloge.else = 2
      this.$emit('editBtn', this.treeSetData.deloge, node, data)
    }
  },
}
</script>

<style lang="less" scoped>
.video-web-tree {
  height: calc(100% - 60px - 30px);
  overflow: auto;
}
.block, .video-web-flex{
  width:100%;
}
</style>

