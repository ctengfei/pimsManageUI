<!--
 * @version:
 * @Author: xlshaod
 * @explain: 组织树，收藏组件
 * @Date: 2021-04-16 16:58:34
 * @LastEditTime: 2021-11-08 10:42:07
 * @LastEditors: sscaij
-->
<template>
<div>
  <div>
        <!-- <highlight-square class="highlight-height-main padding-15" >
          <template v-slot:child> -->
            <CommonTreeEne
              ref="commonTreeEne"
              :tab-data="tabList"
              :favouriteList="favouriteList"
              :districtList="arrData"
              :props="prop"
              :node-key="nodekey"
              :draggable="draggable"
              :all-tags-options="allTagsOptions"
              :is-check="isCheck"
              :is-show="isShow"
              :dominShow="dominShow"
              :permissionData="permissionData"
              :defaultExpandedKeys="defaultExpandedKeys"
              @changeSelect="changeSelect"
              @updateMark="updateMark"
              @switchTab="switchTab"
              @nodeCheck="nodeCheck"
              @updateFavourites="updateFavourites"
              @handleNodeClick="handleNodeClick"
              @handleNodeDblclick="handleNodeDblclick"
              @handleNodeDragEnd="handleDragEnd"
              @onFavouriteAdd="onAppend"
              @onFavouriteEdit="onEdit"
              @onFavouriteRemove="onRemove"
              @onFavouriteCancel="onRemove"
              @searchDeviceByTag="searchDeviceByTag"
              @searchDeviceByCollect="searchDeviceByCollect"
            />
          <!-- </template> -->
        <!-- </highlight-square> -->
      </div>
      <!--标签对话框组件 -->
      <CommonMark
      ref="updateMark"
      :mark-list="tagOptions"
      :tag-node="tagNode"
      >
      </CommonMark>
       <!-- 收藏夹组件 -->
      <ComDialog
        ref="saveDialog"
        :dialog-title="dialogTitle"
        :dialog-width="dialogWidth"
      >
        <SaveTree
          :data-tree="favouriteList"
          :tag-node="tagNode"
          :permissionData="permissionData"
          @onAppend="onAppend"
          @onEdit="onEdit"
          @onRemove="onRemove"
          @onCancelSave="onRemove"
          @nodeClick="nodeClick"
        />
      </ComDialog>
      <!-- 收藏夹操作的对话框 -->
       <ConfirmDialog
          append-to-body
          ref="saveForm"
          :dialog-title="confirmTitle"
          :dialog-width="dialogWidth"
          @onConfirm="onSaveConfirm"

        >
          <el-form :model="treeValue" label-width="100px">
            <el-form-item label="上级文件夹" v-if="type === 'add' && favouriteList.length > 0">
              <el-input v-model="treeValue.pname" disabled></el-input>
            </el-form-item>
            <el-form-item label="节点名称">
              <el-input v-model="treeValue.name"></el-input>
            </el-form-item>
          </el-form>
       </ConfirmDialog>
</div>

</template>
<script>
import {getDeviceTreeEnergy} from '@/api/smartEnergyAdmin/energyAnalyse'

import { reQueryCollect, reAddCollect, reUpdateCollect, reDeleteCollect } from '@/api/monitor/collect'
import {getCruiseRecordVideo, getDeviceListByTree, getDeviceList} from '@/api/monitor/timemonitor'
import { reCollectDevice, reQueryDeviceByCollect } from '@/api/mutiTree'
// import CommonTree from '../commonTree'
import CommonTreeEne from '../commonTreeEne'
import { treeData } from '@/api/system/organization'
import { reQueryTags } from '@/api/monitor/tagsManage'
import CommonMark from '../commonMark'
import ComDialog from '../comDialog'
import ConfirmDialog from '../confirmDialog'
import SaveTree from '../saveTree'
import {getAllCruiseList} from '@/api/monitor/cruiseplan'
import { deepClone } from '@/utils/index.js'
export default {
  components: {
    CommonTreeEne,
    CommonMark,
    ComDialog,
    ConfirmDialog,
    SaveTree
  },
  props: {
    permissionData: Object,
    queryParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    draggable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    dominShow: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    isCheck: {
      type: String,
      default: ''
    },
    nodeType: {
      type: String,
      default: ''
    },
    // saveData: Object,
    // groupData: Object
    saveData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    groupData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    districtList:{
      type: Array,
      default: () => {
        return []
      }
    },
    hasDevice:{
      type: Boolean,
      default: false
    },
    deviceType:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogTitle: '收藏夹',
      dialogWidth: '30%',
      isShow: true,
      tagOptions: [],
      allTagsOptions: [],
      favouriteList: [],
      defaultExpandedKeys: [],
      nodekey: 'id',
      tabList: [
        { label: '组织树', name: 'first' },
        // { label: '收藏', name: 'second' }
      ],
      prop: {
        // 树组件相关属性
        children: 'children',
        label: 'name',
        value: 'id',
      },
      tagNode: {},
      treeValue: {
        id: '',
        pid: '',
        name: '',
        pname: '',
        PId: ''
      },
      type: '',
      nodeData: {},
      confirmTitle: '',
      searchTree: {
        // deviceIds: [],
        treeNodes: []
      },
      saveTreeData: this.saveData,
      groupTreeData: this.groupData,
      arrData : this.districtList,
      parame:this.nodeType
    }
  },
  watch: {
    districtList(val) {
      this.arrData = val
    }
  },
  created() {
  },
  mounted() {
    // this.isCheck = 'check'
    
    this.getTreeData()
    // this.queryTags()
    // this.getCollectTreeData()
  },
  computed: {
    searchData() {
      return this.queryParams
    }
  },
  methods: {
    async getTreeData(  ) {
      // let url = this.$store.getters.btnpremissAll[this.permissionData.treeCheck].url
      // let method = this.$store.getters.btnpremissAll[this.permissionData.treeCheck].method
      // let data = {nodeType:this.parame} || {}
      // console.log(data,'parame11')
      // getDeviceTreeEnergy
      // const res = await treeData(url, method, data)
      const res = await getDeviceTreeEnergy()
      this.arrData = res.data
    },
    async queryTags() {
      console.log('this.permissionData.tagCheck.trim()', this.permissionData.tagCheck.trim())
      let str = this.permissionData.tagCheck.trim()
      let url = this.$store.getters.btnpremissAll[this.permissionData.tagCheck].url
      let method = this.$store.getters.btnpremissAll[this.permissionData.tagCheck].method
      const res = await reQueryTags(url, method)
      if (res.meta.status === 200) {
        this.tagOptions = res.data
        this.allTagsOptions = res.data
      } else {
       this.$message.error(res.meta.message)
      }
    },
    // 获取收藏夹及收藏设备相关数据
    async getCollectTreeData() {
      let url = this.$store.getters.btnpremissAll[this.permissionData.collectCheck].url
      let method = this.$store.getters.btnpremissAll[this.permissionData.collectCheck].method
      // const res = await reQueryCollect(url, method, {type: this.deviceType})
      // const res = await reQueryCollect({type: this.deviceType,deviceName:""})
      if (res.meta.status === 200) {
        // this.dataTree = res.data
        this.favouriteList = res.data
      } else {
        this.$message.error(res.meta.message)
      }
    },
    // 通过标签搜索设备
    async searchDeviceByTag(value) {
      // if (value === '') return
      console.log('ss');
      console.log(value);
      let url = this.$store.getters.btnpremissAll[this.permissionData.treeCheck].url
      let method = this.$store.getters.btnpremissAll[this.permissionData.treeCheck].method
      let res
      if (value === '') {
        // getDeviceTreeEnergy
        res = await treeData(url, method, [])
      } else {
        res = await treeData(url, method, [value])
        console.log(res,'qqqq');
      }
      if (res.meta.status === 200) {
        this.arrData = res.data
        if (value === '') {
          this.defaultExpandedKeys = []
        } else {
          this.dealExpandedKey(this.arrData)
        }

      } else {
       this.$message.error(res.meta.message)
      }
    },
    dealExpandedKey(list) {
      list.map(x => {
        this.defaultExpandedKeys.push(x.id)
        if (x.children) {
          this.dealExpandedKey(x.children)
        }
      })
    },
    // 双击
    handleNodeDblclick(data, node, tree) {
      this.$emit('handleNodeDblclick', data, node, tree)
    },
    handleDragEnd(node, prenode, pis, evt) {
      this.$emit('DragEnd', node, prenode, pis, evt)
    },
    changeSelect(val) {

    },
    // 通过收藏夹搜索设备
    async searchDeviceByCollect(value) {
    },
    switchTab(tab) {
      if (tab.name === 'first') {
        this.getTreeData()
      } else {
        // 获取收藏树
        this.getCollectTreeData()
        this.getCollectData()
        this.$emit('saveTreeTab', tab.name)
      }
    },
    async getCollectData() {
    },
    handleNodeClick(data, activeName) {
      this.tagNode = data
      if (this.isCheck === 'check') {
          let treeArr = []
          let treeDeviceId = []
          if (activeName === 'second') {
            if (data.deviceId === null) {
              this.saveTreeData.deviceIds = null
              treeArr.push(data.id)
              // this.saveTreeData.treeNodeIds = treeArr
              this.saveTreeData.treeNodes = treeArr
            } else {
              // this.saveTreeData.treeNodeIds = null
              this.saveTreeData.treeNodes = null
              treeDeviceId.push(data.deviceId)
              this.saveTreeData.deviceIds = treeDeviceId
            }
            this.$nextTick((_) => {
              this.$emit('getTableData', activeName, this.saveTreeData)
            })
          }
      } else {
        this.$emit('getTableData', data, activeName)
      }
    },
    updateMark(data) {
      this.tagNode = data
      this.$refs.updateMark.dialogFormVisible = true
      this.$nextTick(_ => {
        this.$refs.updateMark.getNodeTags()
      })
    },
    // 收藏
    updateFavourites(data) {
      const obj = {
        deviceCode: data.code,
        name: data.name,
        deviceType: data.type,
        referenceId: data.referenceId
      }
      let url = '/yun/pm/device/favorite'
      let method = 'POST'
      reCollectDevice(url, method, obj).then(res => {
        this.$message.success('收藏设备成功')
        this.getCollectTreeData()
      }).catch(err => {
        this.$message.error(err)
      })

    },
    nodeCheck(node, data, nodeIds) {
      this.groupTreeData.treeNodes = []
      this.groupTreeData.treeNodes = data.checkedNodes.map((x) => {
        return x.id
      });
      this.groupTreeData.treeNodes = this.groupTreeData.treeNodes.filter(
        (x) => x !== undefined
      );
      this.$nextTick((_) => {
        this.$emit('getTableData', null, this.groupTreeData)
      });

    },
    // 收藏夹的添加和编辑
    onSaveConfirm() {
      let obj = {}
      if (this.type === 'add') { // 新增
        if (this.favouriteList.length === 0) {
            obj = {
              id: '',
              pid: '',
              name: this.treeValue.name
            }
        } else {
          obj = {
            id: '',
            pid: this.nodeData.id,
            name: this.treeValue.name
          }
        }
        let url = this.$store.getters.btnpremissAll[this.permissionData.collectAdd].url
        let method = this.$store.getters.btnpremissAll[this.permissionData.collectAdd].method
        reAddCollect(url, method, obj).then(res => {
          if (res.meta.status === 200) {
            this.$message.success('添加成功')
            this.getCollectTreeData()
          } else {
            this.$message.success('添加失败')
          }
          this.$refs.saveForm.dialogVisible = false
          this.$refs.saveForm.buttonLoading = false
          this.treeValue.name = ''
          this.treeValue.pname = ''
        }).catch(err => {
          this.$message.error(err)
          this.$refs.saveForm.dialogVisible = false
          this.$refs.saveForm.buttonLoading = false
        })
      } else { // 编辑
        obj = {
          id: this.treeValue.id,
          pid: this.treeValue.pid,
          name: this.treeValue.name
        }
        let url = this.$store.getters.btnpremissAll[this.permissionData.collectEdit].url
        let method = this.$store.getters.btnpremissAll[this.permissionData.collectEdit].method
        reUpdateCollect(url, method, obj).then(res => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.message)
          } else {
            this.$message.success('编辑成功')
            this.getCollectTreeData()
          }
          this.$refs.saveForm.dialogVisible = false
          this.$refs.saveForm.buttonLoading = false
          this.treeValue.name = ''
          this.treeValue.pname = ''
        }).catch(err => {
          this.$message.error(err)
          this.$refs.saveForm.dialogVisible = false
          this.$refs.saveForm.buttonLoading = false
        })
      }
    },
    // 添加
    onAppend(data) {
      this.confirmTitle = '新增收藏夹'
      this.nodeData = data
      this.type = 'add'
      this.$refs.saveForm.dialogVisible = true
      this.treeValue.pname = data.name
    },
    // 编辑
    onEdit(node) {
      this.type = 'edit'
      this.confirmTitle = '编辑收藏夹'
      this.$refs.saveForm.dialogVisible = true
      this.treeValue.pname = node.data.name
      this.treeValue.Pid = node.data.pid
      this.treeValue.id = node.data.id
      this.treeValue.pid = node.data.pid
      this.treeValue.name = node.data.name
    },
    onRemove(node, type) {
      if (type === 'cancel') {
        this.$confirm(`确认取消收藏的设备?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteNode(node.data.referenceId, type)
        }).catch(() => {
        })
      } else {
        console.log('111')
         this.$confirm(`确认删除文件夹?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteNode(node.data.referenceId, type)
        }).catch(() => {
        })
      }
    },
    deleteNode(id, type) {
      let url = this.$store.getters.btnpremissAll[this.permissionData.collectDelete].url
      let method = this.$store.getters.btnpremissAll[this.permissionData.collectDelete].method
      reDeleteCollect(url, method, id).then(res => {
         if (res.meta.status === 200) {
          if (type === 'cancel') {
             this.$message.success('设备取消收藏成功')
          } else {
             this.$message.success('删除成功')
          }
          this.getCollectTreeData()
        } else {
          this.$message.error(res.meta.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    nodeClick(data) {
      console.log('data ---', data)
      if (data.deviceId) {
        this.$message.error('设备只能收藏在收藏夹下')
        return
      }
      // const obj = {
      //   deviceId: this.tagNode.code,
      //   name: this.tagNode.name,
      //   pid: data.id
      // }
      const obj = {
        createTime: "2021-12-06T03:27:20.992Z",
        creator: "string",
        deviceCode: "string",
        deviceName: "string",
        deviceType: "string",
        referenceId: 0
      }
      let url = this.$store.getters.btnpremissAll[this.permissionData.collectDevice].url
      let method = this.$store.getters.btnpremissAll[this.permissionData.collectDevice].method
      reCollectDevice(url, method, obj).then(res => {
        if (res.meta.status === 200) {
          this.$message.success('收藏设备成功')
          this.getCollectTreeData()
        } else {
          this.$message.error(res.meta.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>
<style>
</style>
