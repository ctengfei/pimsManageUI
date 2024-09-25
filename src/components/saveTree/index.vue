<!--
 * @version:                
 * @Author: xlshaod
 * @explain: 巡航计划左侧树
 * @Date: 2021-03-04 10:43:08
 * @LastEditTime: 2021-04-09 14:23:59
 * @LastEditors: xlshaod
-->
<template>
<div>
  <el-button v-if="dataTree.length === 0" type="primary" @click="onAppend">新增根目录</el-button>
  <el-tree
  style="height:200px;overflow-y:scroll"
  :data="dataTree"
  :props="defaultProps" 
  node-key="id"
  @node-click="nodeClick"
  >

  <div slot-scope="{ node, data }" v-if="dataTree.length > 0">
    <span>
      <i v-if="node.data.deviceId === null && node.level < 4" style="color:#ffcf5c" class="iconfont iconwenjianjia" />
      <span>{{ data.name }}</span>
    </span>
    <span class="video-tree-edit">
      <el-button
        v-if="node.data.deviceId === null && node.level < 3"
        icon="el-icon-circle-plus-outline"
          circle
          type="text"
         
          @click.stop="() => onAppend(data)">
        </el-button>
        <el-button
        v-if="node.data.deviceId === null"
        type="text"
        icon="el-icon-delete"
        circle
         
          @click.stop="() => onRemove(node, data)">

      </el-button>
      <el-button
        v-if="node.data.deviceId === null"
          icon="el-icon-edit"
          circle
          type="text"
         
          @click.stop="() => onEdit(node,data)">
        </el-button>
        <el-button
          v-if="node.data.deviceId !== null"
          icon="el-icon-star-off"
          circle
          type="text"
         
          @click.stop="() => onCancelSave(node,data)">
        </el-button>
      </span>
    </div>
  </el-tree>
</div>
</template>
<script>
export default {
  props: {
    dataTree: Array,
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
      },
      permissionObj: {}
    }
  },
  watch: {
    permissionData: {
      handler(newVal, oldVal) {
        console.log('newVal ---', newVal)
        this.permissionObj = newVal
      },
      immediate: true
    }
  },
  methods: {
    onAppend(node) {
      this.$emit('onAppend', node)
    },
    onEdit(node) {
      this.$emit('onEdit', node)
    },
    // 将节点添加到收藏夹下
    nodeClick(node) {
      this.$emit('nodeClick', node)
    },
    onRemove(node, data) {
      this.$emit('onRemove', node, data)
    },
    onCancelSave(node, data) {
      this.$emit('onCancelSave', node, 'cancel')
    }
  }
}
</script>