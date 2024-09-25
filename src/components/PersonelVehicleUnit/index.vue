<!--
 * @version:
 * @Author: xlshaod
 * @explain: 车辆/人员分组组件
 * @Date: 2021-06-17 10:34:30
 * @LastEditTime: 2021-08-23 11:08:34
 * @LastEditors: sscaij
-->
<template>
<div>
   <highlight-square class="highlight-height-table8">
         <template v-slot:child>
           <div style="display:flex;justify-content:space-between;margin:10px">
             <span style="color:#206aff;font-family: Microsoft YaHei;font-size:14px;font-weight:bold">{{isType === '人员' ? '人员分组' : '车辆分组'}}</span>
             <svg-icon style="cursor:pointer" class-name="plus" icon-class="plus" @click="onAddGroup" />
           </div>
            <div class="group-area">
              <div class="group-item-hover" v-for="item in peopleGroupList" :key="item.id" >
                <div class="group-item" >
                  <div class="item-name">{{item.name}}</div>
                  <div class="controls video-web-flex">
                    <i style="margin-right:5px" class="el-icon-link" @click.stop="onRealated(item)"></i>
                    <i style="margin-right:5px" class="el-icon-edit" @click.stop="openGroupDialog(item)"></i>
                    <i class="el-icon-delete" @click.stop="delGroup(item)"></i>
                  </div>
                </div>
              </div>
            </div>
         </template>
      </highlight-square>

      <!-- 人员添加对话框 -->
   <ConfirmDialog
      append-to-body
      ref="peopleGroup"
      :dialog-title="confirmTitle"
      :dialog-width="dialogAddWidth"
      @onConfirm="onSaveConfirm"

    >
      <el-form ref="form" :model="form" :rules="peopleGroupRules" label-width="80px" >
        <el-form-item :label=" isType === '人员' ? '人员分组' : '车辆分组'" prop="name">
          <el-input v-model="form.name" placeholder="请输入组名"></el-input>
        </el-form-item>
      </el-form>
   </ConfirmDialog>


    <!-- 分组添加成员对话框 -->

   <div class="ConfirmDialogMy">
   <ConfirmDialog
      append-to-body
      ref="groupInfo"
      :dialog-title="isType === '人员' ? '关联用户' : '关联车辆'"
      :dialog-width="dialogWidth"
      @onConfirm="onAddConfirm"
      :isShowConfirm="false"
    >
    <div style="text-align:right;margin-bottom:20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="relatePeople">
        {{isType === '人员' ? '关联用户' : '关联车辆' }}
      </el-button>
       <el-button
        icon="el-icon-delete"
       
        :disabled="!selectedPeopleList.length"
        @click="batchPeopleRemove">
        批量移除
      </el-button>
    </div>
    <el-table
      :data="tableGroupData"
      style="width: 100%;"
      @selection-change="handleSelectPropleChange"
    >
      <el-table-column type="selection"  width="55"></el-table-column>
      <el-table-column  v-for="item in tableTypeColumns" :key="item.param"
          :prop="item.param"
          :label="item.label"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="isType === '人员' && (item.param === 'gender' || item.param ==='jobTitle')">{{item.render(scope.row)}}</span>
             <span v-else-if="isType === '车辆' && (item.param === 'carBrand' || item.param ==='carType')">{{item.render(scope.row)}}</span>
            <span v-else>{{scope.row[item.param]}}</span>
          </template>
        </el-table-column>
      <el-table-column
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button @click="onDeleteGroupPeople(scope.row)"  type="text" style="color:#f05656;">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      v-if="personnelTotal"
      layout="total,prev, pager, next"
      :current-page="currentPage4"
      @current-change="handleCurrentChange"
      :total="personnelTotal">
    </el-pagination>
   </ConfirmDialog>
   </div>
    <!-- 绑定人员 -->
    <ConfirmDialog
      append-to-body
      ref="relatePeopleInfo"
      :dialog-title="confirmMemberTitle"
      :dialog-width="dialogWidth"
      @onConfirm="onRelateConfirm"
      @onCancel="onCancelRelate"
      @beforeClose="onCancelRelate"
    >
       <el-input
       v-if="isType === '人员'"
       v-model="relateInfo.userName"
        clearable
       
        placeholder=" 请输入查询姓名 "
        style="width: 200px;margin-bottom:20px"
      />
      <el-input
       v-else
       v-model="formSeach.carOwner"
        clearable
       
        placeholder=" 请输入车主 "
        style="width: 200px;margin-bottom:20px"
      />
       <el-button type="primary" icon="el-icon-search" @click="onSearchPeople">搜索</el-button>
          <el-table
            :data="tableRelateData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"  width="55"></el-table-column>
            <el-table-column v-for="item in tableTypeColumns" :key="item.param"
              :prop="item.param"
              :label="item.label"
              show-overflow-tooltip
            >
             <template slot-scope="scope">
              <span v-if="isType === '人员' && ( item.param === 'gender' || item.param ==='jobTitle')">{{item.render(scope.row)}}</span>
              <span v-else-if="isType === '车辆' && (item.param === 'carBrand' || item.param ==='carType')">{{item.render(scope.row)}}</span>
              <span v-else>{{scope.row[item.param]}}</span>
            </template>
            </el-table-column>

          </el-table>
        <!-- 分页 -->
            <pagination
              style="margin-bottom:20px"
              v-show="relateTotal > 0"
              :total="relateTotal"
              :page.sync="queryPage.pageNum"
              :limit.sync="queryPage.pageSize"
              @pagination="handleSizeChange"
            />
   </ConfirmDialog>
</div>
</template>
<script>
import pagination from '@/components/comPagination'
//import pagination from '@/components/Crud/Pagination'

import ConfirmDialog from '@/components/confirmDialog'
import {getConfigController} from "@/api/trafficManage/carRecords";
import {getQueryByPage} from '@/api/carManage/listManage.js'
import {
  getPeopleManageList,
  getMemberType,
  singleDelete,
  batchDeletion,
  newPersonnelList,
  editEdit,
  getSchor,
  getPersonGroup,
  addPersonGroup,
  editPersonGroup,
  deletePersonGroup,
  getPersonGroupById,
  addPeopleToGroup,
  deletePeopleToGroup,
  getGroupAllMember} from '@/api/peopleManage'
import { getObjByKey} from "@/utils/voice.js";
export default{
  components: {
    pagination,
    ConfirmDialog
  },
  props: {
    groupType: String,
    jobTitleList: Array,
    isType: String,
    carBrand: Array,
    carType: Array,
  },
  data() {
    return {
      dialogAddWidth: '30%',
      tableGroupData: [],
      confirmMemberTitle: '',
      confirmTitle: '',
      dialogWidth: '45%',
      relateTotal: 0,
      tableGroupColumns: [
        {
          label: "姓名",
          param: "name",
          width: "auto",
          isTitle: true,
        },
        {
          label: "性别",
          param: "gender",
          width: "auto",
          isTitle: false,
          render: row => {
            if (row.gender == 2) {
              return '男'
            } else {
              return '女'
            }
          }
        },
        {
          label: "手机号",
          param: "phoneNo",
          width: "auto",
          isTitle: true,
        },
        {
          label: "部门",
          param: "departmentName",
          width: "auto",
          isTitle: true,
        },
        {
          label: "职务名称",
          param: "jobTitle",
          width: "auto",
          isTitle: true,
          render: row => {
            let jobStr;
            this.jobTitleList && this.jobTitleList.map(x => {
              if (x.code === row.jobTitle) {
                jobStr = x.name
              }
            })
            return jobStr
          }
        },
      ],
      tableCarColumns: [
        {
          label: "车主",
          param: "carOwner",
          width: "auto",
          isTitle: true,
        },
        {
          label: "车牌",
          param: "carNumber",
          width: "auto",
          isTitle: true,
        },
        {
          label: "车辆类型",
          param: "carType",
          width: "auto",
          isTitle: true,
          render: row => {
            let carStr;
            this.carType && this.carType.map(x => {
              if (x.value === row.carType) {
                carStr = x.name
              }
            })
            return carStr
          }
        },
        {
          label: "车辆品牌",
          param: "carBrand",
          width: "auto",
          isTitle: true,
          render: row => {
            let brandStr;
            this.carBrand && this.carBrand.map(x => {
              if (x.value === row.carBrand) {
                brandStr = x.name
              }
            })
            return brandStr
          }
        },
      ],
      peopleGroupRules:{
          name: [
            { required: true, message: '组名不能为空', trigger: 'blur' }
          ],
        },
      permission:{
        getQueryByPage: 'carManage::listManage::getQueryByPage',
        look:"videoMange::snapPhotoWall:look",
        downloadThumbnail: "videoMange::snapPhotoWall:downloadThumbnail",
        getSearchVideo: 'system::group::search',
        delete: 'people::delete',
        batchDelete: 'people::batchdelete',
        list: 'people::list',
        check: 'people::check',
        add: 'people::add',
        department:"trafficManage::visitorManage::department",
        edit: 'people::edit',
        schor:'people::schor',
        search: 'peoplegroup::search',
        addGroup: 'peoplegroup::add',
        editGroup:'peoplegroup::edit',
        batchDeleteGroup: 'peoplegroup::batchdelete',
        deleteGroup: 'peoplegroup::delete',
        relateGroup:'peoplegroupId::searhbyid',
        addpeople: 'groupaddpeople::add',
        deletePeople: 'groupdeletepeople::delete',
        checkAllGroup: 'peopleGroup::checkmember',
        checkcargrop: 'carlistbyid::search'
      },
      peopleGroupList: [],
      relateInfo: { // 搜索的表单
        userName:'',
        // pageNum: 1,
        // pageSize: 10
      },
      query: {
        name: '',
        pageSize: 10,
        pageNum: 1,
        startTime: '',
        endTime: '',
        groupType: ''
      },
      selectedPeopleList: [],
      form:{
        name: '',
        groupType: '',
        id: ''
      },
      currentPage4: 1,
      tableRelateData: [],
      selectList: [],
      personnelTotal:0,
      formSeach: { // 搜索的表单
        carOwner:'',
        carNumber:'',
        carType:'',
        carColor:'',
        carGroup:'',
        // pageNum: 1,
        // pageSize: 10
      },
      queryPage: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getPersonGroupList()
  },
  computed: {
    tableTypeColumns() {
      if (this.isType === '人员') {
        return this.tableGroupColumns
      } else {
        return this.tableCarColumns
      }
    },
    // countPageNum() {
    //   return this.isType === '人员' ? this.relateInfo.pageNum : this.formSeach.pageNum
    // },
    // countPageSize() {
    //   return this.isType === '人员' ? this.relateInfo.pageSize : this.formSeach.pageSize
    // }
  },
  watch: {
    isType(val) {
      if (val === '人员') {
        this.confirmTitle = '添加人员分组'
        this.confirmMemberTitle = '关联人员'
      } else {
        this.confirmTitle = '添加车辆分组'
        this.confirmMemberTitle = '关联车辆'
      }

    }
  },
  methods: {
    async getRelatePeopleList() {
      let params = {
        ...this.relateInfo,
        ...this.queryPage
      }
      const result = await getGroupAllMember(getObjByKey(this.permission.checkAllGroup), params)
      if (result.meta.status === 200) {
        this.relateTotal = result.data.total
        this.tableRelateData = result.data.data
      }
    },
    getRelateCarList() {
      let params = {
          url: this.$store.getters.btnpremissAll[this.permission.getQueryByPage].url,
          method: this.$store.getters.btnpremissAll[this.permission.getQueryByPage].method,
          data: {...this.formSeach, ...this.queryPage}
        }
        getQueryByPage(params).then(res=>{
          if (res.meta.status == 200){
            this.relateTotal = res.data.total
            this.tableRelateData = res.data.data
          }
        }).catch(err=>{

        })
    },
    // 添加人员
    onAddConfirm() {
      this.getRelateCarList()
    },
    // 搜索
    onSearchPeople() {
      if (this.isType === '人员') {
        this.getRelatePeopleList()
      } else {
        this.getRelateCarList()
      }
    },
    // 选择人员
    handleSelectionChange(val) {
      this.selectList = val
      console.log('this.selectList', this.selectList)
    },
    // 获取组列表
    getPersonGroupList() {
      this.query.groupType = this.groupType
      getPersonGroup(getObjByKey(this.permission.search), this.query).then(res => {
        if (res.meta.status === 200) {
            this.peopleGroupList = res.data.data
        } else {
            this.$message.error(res.meta.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 添加组
    onAddGroup() {
      if (this.isType === '人员') {
        this.confirmTitle = '添加人员分组'
      } else {
        this.confirmTitle = '添加车辆分组'
      }
      this.form.name = ''
      this.$refs.peopleGroup.dialogVisible = true
    },
    // 关联人员
    relatePeople() {
      if (this.isType === '人员') {
        this.getRelatePeopleList()
      } else {
        console.log('111')
        this.getRelateCarList()
      }
      this.$refs.relatePeopleInfo.dialogVisible = true
    },
    onCancelRelate() {
      this.relateInfo.userName = ''
      this.formSeach.carOwner = ''
    },

    // 选择人员移除
    handleSelectPropleChange(val) {
      this.selectedPeopleList = val
    },
    // 批量移除
    batchPeopleRemove() {
      let arr= []
      this.selectedPeopleList.map(x => {
        arr.push(x.id)
      })
      this.deleteGroupPeople(arr)
    },
    deleteGroupPeople(list) {
      this.$confirm(`确定要移除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePeopleToGroup(getObjByKey(this.permission.deletePeople), this.groupData.id, list).then(res => {
          if (res.meta.status === 200) {
            this.$message.success('移除成功')
            this.getPersonGroupByIdList()
          } else {
            this.$message.err(res.meta.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
      })
    },
    getPersonGroupByIdList() {
      console.log('this.carType -------', this.carType)
      let str
      if (this.isType === '人员') {
        str = this.permission.relateGroup
      } else
        str = this.permission.checkcargrop
      getPersonGroupById(getObjByKey(str), this.groupData.id).then(res => {
        if (res.meta.status === 200) {
          this.currentPage4 = 1
          this.personnelTotal =  res.data.length
          this.personnelData = res.data
          this.tableGroupData = this.personnelData.slice(0,10)
        } else {
          this.$message.err(res.meta.message)
          this.tableGroupData = []
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 关联
    onRealated(item) {
      this.groupData = item
      this.$refs.groupInfo.dialogVisible = true
      this.getPersonGroupByIdList()
    },
    // 编辑组
    openGroupDialog(item) {
      if (this.isType === '人员') {
        this.confirmTitle = '编辑人员分组'
      } else {
        this.confirmTitle = '编辑车辆分组'
      }

      this.$refs.peopleGroup.dialogVisible = true
      this.form.name = item.name
      this.form.id = item.id
    },
    // 删除人员分组
    delGroup(item) {
      this.$confirm(`确定要删除该分组吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePersonGroup(getObjByKey(this.permission.deleteGroup), item.id).then(res => {
          if (res.meta.status === 200) {
            this.$message.success('删除分组成功')
            this.getPersonGroupList()
          } else {
            this.$message.error(res.meta.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
      })
    },
    onDeleteGroupPeople(item) {
      let list = [item.id]
      this.deleteGroupPeople(list)
    },
    // 绑定确认按钮
    onRelateConfirm() {
      let arr = []
      this.selectList.map(x => {
        arr.push(x.id)
      })
      addPeopleToGroup(getObjByKey(this.permission.addpeople), this.groupData.id, arr).then(res => {
        if (res.meta.status === 200) {
          this.$message.success('关联成功')
          this.getPersonGroupByIdList()
        } else {
          this.$message.error(res.meta.message)
        }
        this.$refs.relatePeopleInfo.dialogVisible = false
        this.relateInfo.userName = ''
        this.$refs.relatePeopleInfo.buttonLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.$refs.relatePeopleInfo.dialogVisible = false
        this.$refs.relatePeopleInfo.buttonLoading = false
        this.relateInfo.userName = ''
      })
    },
    handleCurrentChange(val) {
      this.currentPage4 = val
      this.tableGroupData = this.personnelData.slice((val-1)*10, val*10)
    },
    // 分页
    handleSizeChange() {
      if (this.isType === '人员') {
        this.getRelatePeopleList()
      } else {
        this.getRelateCarList()
      }
    },
    onSaveConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.groupType = this.groupType
          console.log(this.confirmTitle, '9999999999')
          if (this.confirmTitle === '添加人员分组' || this.confirmTitle === '添加车辆分组') {
            this.form.id = ''
            addPersonGroup(getObjByKey(this.permission.addGroup), this.form).then(res => {
              if (res.meta.status === 200) {
                this.$message.success('添加分组成功')
                this.getPersonGroupList()
              } else {
                this.$message.error(res.meta.message)
              }
              this.$refs.peopleGroup.dialogVisible = false
              this.$refs.peopleGroup.buttonLoading = false
              this.form.name = ''
            }).catch(err => {
              this.$message.error(err)
              this.$refs.peopleGroup.buttonLoading = false
            })
          } else if (this.confirmTitle === '编辑人员分组' || this.confirmTitle === '编辑车辆分组') {
            editPersonGroup(getObjByKey(this.permission.editGroup), this.form).then(res => {
              if (res.meta.status === 200) {
                this.$message.success('编辑分组成功')
                this.getPersonGroupList()
              } else {
                this.$message.error(res.meta.message)
              }
              this.$refs.peopleGroup.dialogVisible = false
              this.$refs.peopleGroup.buttonLoading = false
              this.form.name = ''
            }).catch(err => {
              this.$message.error(err)
              this.$refs.peopleGroup.buttonLoading = false
            })
          }

        } else {
          return false
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.el-pagination{
  padding-bottom: 17px;
  margin-top: 18px;
}
</style>
