<!--
 * @version:                
 * @Author: xlshaod
 * @explain: 巡航计划左侧树组件
 * @Date: 2021-03-04 10:43:08 
 * @LastEditTime: 2021-04-09 14:35
 * @LastEditors: xlshaod
-->
<template>
<el-dialog title="更新标签" :visible.sync="dialogFormVisible" width="30%">
  <el-form ref="form" :model="form" label-width="70px">
    <el-row>
      <el-col :span="18">
         <el-form-item label="标签" >
          <el-select v-model="form.tagIds" multiple placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in markList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button plain @click="editMarkManage">编辑标签库</el-button>
      </el-col>
    </el-row>
  </el-form>
  <div slot="footer" style="text-align:right;">
    <el-button type="primary" @click="onConfirm">确定</el-button>
    <el-button plain @click="dialogFormVisible = false">取消</el-button>
  </div>
</el-dialog>
</template>
<script>
import { updateTags, getTagsbyNodeId } from '@/api/monitor/tagsManage'
export default {
  props: {
    markList: Array,
    tagNode: Object
  },
  data () {
    return {
      dialogFormVisible: false,
      form: {
        tagIds: [],
        nodeId: 0
      },
      permission: {
        markbyNode: 'mark::search::nodeId',
        markEdit: 'mark::update'
      }
    }
  },
  methods: {
    editMarkManage() {
      this.$router.push('./tagsManage')
    },
    getNodeTags() {
      this.form.tagIds = []
      let url = this.$store.getters.btnpremissAll[this.permission.markbyNode].url.split('/{')[0]
      let method = this.$store.getters.btnpremissAll[this.permission.markbyNode].method
      getTagsbyNodeId(url, method, this.tagNode.id).then(res => {
        res.data.length > 0 && res.data.map(x => {
          this.form.tagIds.push(x.id)
        })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    onConfirm() {
      this.form.nodeId = this.tagNode.id
      let url = this.$store.getters.btnpremissAll[this.permission.markEdit].url
      let method = this.$store.getters.btnpremissAll[this.permission.markEdit].method
      updateTags(url, method, this.form).then(res => {
        this.$message.success('标签添加成功')
        this.$parent.queryTags()
        this.dialogFormVisible = false
        this.$refs.form.resetFields()
      }).catch(err => {
        this.$message.error(err)
        this.dialogFormVisible = false
      })
    }
  }
}
</script>
<style>
</style>