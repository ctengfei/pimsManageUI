<template>
  <div style="height:inherit">
    <div style="height:inherit">
      <!-- <HighlightSquare class="highlight-height-table-new"> -->
        <!-- <template v-slot:child> -->
            <div>
              <h4 class='titleName'>{{floorName}}</h4>
              <div class='parkInfor'>
                <div class='imgBox'>
                  <img :src="NET.BASE_URL+roomData.picture" alt="">
                </div> 
                <div class='parkInforContent'>
                  <com-descriptions title="" class='infor'>
                    <!-- <com-descriptions-item :span="12" label="楼层总数">
                        <template slot="content">
                            <div>{{roomData.buildingSum + '栋'}}</div>
                        </template>
                    </com-descriptions-item> -->
                    <com-descriptions-item :span="24" label="建筑面积">
                        <template slot="content">
                            <div>{{roomData.area + '㎡'}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="房间套数">
                        <template slot="content">
                            <div class="colorStress">{{'总共'+roomData.roomSum+'套，'+'剩余'+roomData.surplusNum+'套'}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="入驻企业">
                        <template slot="content">
                            <div class="colorStress">{{'总共'+roomData.companySum+'家'}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="所在位置">
                        <template slot="content">
                            <div class="colorStress">{{roomData.address}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="楼宇简介">
                        <template slot="content">
                            <div class="colorStress" style="white-space:pre-line;width: 500px;">{{roomData.description}}</div>
                        </template>
                    </com-descriptions-item>
                  </com-descriptions>
                </div>
              </div>
            </div>
          <!-- </template> -->
        <!-- </HighlightSquare> -->
      <div  class="video-web-flex" style="margin-top:30px;">
         <el-form v-model="searchForm" :inline="true" class="demo-form-inline" v-if="showSearch">
           <el-form-item prop="roomName" label="房间名称">
              <el-input v-model="searchForm.roomName" placeholder="请输入房间名称" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-select
                      v-model="searchForm.searchFloorName"
                      clearable
                      placeholder="请选择楼层"
                      style="max-width: 200PX;margin-left: 10px;"
                    >
                      <el-option
                        v-for="item in floorNames"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                  </el-select>
            </el-form-item> -->
            <el-form-item label="租赁状态">
              <el-select
                      v-model="searchForm.rentedStatus"
                      clearable
                      placeholder="请选择租赁状态"
                      style="max-width: 200PX;margin-left: 10px;"
                    >
                      <el-option
                        v-for="item in dict.type.rentedStatus_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                  </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
          <!--
            <div style="display: flex;">
             <el-button @click='addFloor'  icon="el-icon-plus">新建房间</el-button>
             <el-button  :disabled="!selectedData.length" icon="el-icon-delete" @click='delFloor'>删除</el-button>
          </div>
          -->
      </div>
      <el-row :gutter="10" class="mb8" style="margin-top: 8px;">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click='addFloor'
          >新建房间</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            @click='delFloor'
          >删除</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
      </el-row>
      <div style="height:calc(100% - 460px)">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="id" label="序号" align="left" show-overflow-tooltip /> -->
        <el-table-column :selectable="isSelected" type="selection" width="55" />
        <el-table-column prop="name" label="房间名称" align="left" show-overflow-tooltip />
        <el-table-column prop="accruedArea" label="建筑面积（m³）" align="left" show-overflow-tooltip />
        <el-table-column prop="companyName" label="企业名称" align="left" show-overflow-tooltip />
        <el-table-column prop="enterpriseLegalPerson" label="企业法人" align="left" show-overflow-tooltip />
        <el-table-column prop="rentedStatusStr" label="租赁状态" align="left" show-overflow-tooltip />
        <el-table-column label="操作" align="left"  width="160px">
          <template slot-scope="scope">
            <el-button  type="text" :disabled="scope.row.rentedStatus === 'RENTED' || scope.row.rentedStatus === 'SCHEDULED'" @click="showEditAbility(scope.row)" icon="el-icon-edit">编 辑</el-button>
            <el-button type="text" :disabled="scope.row.rentedStatus === 'RENTED' || scope.row.rentedStatus === 'SCHEDULED'" @click="deleteAbility(scope.row)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <!-- 分页 -->
            <div class="content-bottom">
              <pagination
                 v-show="tableData && tableData.length > 0"
              :page.sync="parameter.pageNum"
              :total="parameter.total"
              :limit.sync="parameter.pageSize"
              :pageSizes="[10, 50, 100]"
              @pagination="handleCurrentChange"
              />
            </div>
    </div>
    <el-dialog :title="groupDialogTitle" :close-on-click-modal='false' :visible.sync="groupDialogShow" :before-close="closeGroupDialog" width="800px">
      <addroom @showroom='showroom' ref="addroom" :start='start' :nodeId='nodeId'  :addType='addType' :selfId='selfId' :referenceId='referenceId' :treePid='treePid'></addroom>
    </el-dialog>
  </div>

</template>
<script>
import { getControlTree,delrooms } from '@/api/spaceManagement/controlManagement'
import ComDescriptions from "@/components/comDescription/comdescription"
import ComDescriptionsItem from "@/components/comDescription/comdescriptionItem"
import pagination from '@/components/comPagination'
import { Message } from 'element-ui';
import addroom from'./addroom'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
import pubsub from 'pubsub-js'
export default {
  name:'ControlManagement',
   components:{pagination,ComDescriptions,ComDescriptionsItem,addroom},
   props:['roomData','tableData','treePid','roomId','tableData','referenceId','floorName','parameter','nodeId','initTreedata'],
   dicts: ['rentedStatus_type'],
  data(){
    
    return {
       groupDialogTitle:'新建房间',
      groupDialogShow:false,
      groupDialogShow:false,
      loading:false,
      defaultProps:{

      },
      searchForm: {
        roomName: '',
        // searchFloorName:'',
        rentedStatus:''
      },
      floorNames:[
        { value: "IPC", label: "IPC" },
        { value: "NVR", label: "NVR" },
      ],
      roomStatus:[
        { value: 0, label: "已租赁" },
        { value: 1, label: "预定" },
        { value: 2, label: "空置" },
      ],
      roomInfors:[
        {
          titleName:'北向园区-1号楼',
          floorTotal:'',
          builtArea:'',
          roomTotal:'',
          settledEnterprise:'',
          position:''
        }
      ],
      permission:{
        treeAll:'spaceManagement::controlManagement::treeAll',
        addRoom:'spaceManagement::controlManagement::addRoom',
        editRoom:'spaceManagement::controlManagement::editRoom',
        delRoom:'spaceManagement::controlManagement::delRoom',
        roomById:'spaceManagement::controlManagement::roomById',
        roomList:'spaceManagement::controlManagement::roomList'
      },
      addType:'ADD',
      pubId:'',
      selfId:'',
      start: 0,
      showSearch:true,
      selectedData: []
    }
  },
  mounted(){
  },
  methods:{
    isSelected(row, index) {
      if (row.rentedStatus === 'RENTED' || row.rentedStatus === 'SCHEDULED') {
        return 0
      } else {
        return 1
      }
    },
    handleSelectionChange(val){
      this.selectedData = val
    },
    closeGroupDialog() {
      this.$refs['addroom'].resetForm()
      this.groupDialogShow = false
    },
    showroom(data){
     this.groupDialogShow=data[0]
     this.groupDialogTitle=data[1]
    },
    addFloor(){
     this.groupDialogShow=true
     this.addType='ADD'
     this.start = 0
     this.pubId = pubsub.subscribe('roomDataEven',(msgName,data)=>{
      this.$emit('roomAddEvent',data)
      console.log(data,'roomAddEvent')
    })
    this.pubIds = pubsub.subscribe('roomtreeDept',(msgName,data)=>{
      this.$emit('roomtreeDept',data)
    })
    },
    delFloor(){
      if(this.selectedData.length){
        this.$confirm(`确定要删除房间吗?`, '提示', {
          confirmButtonText: '确定',
          confirmButtonClass:'el-icon-check',
          cancelButtonText: '取消',
          cancelButtonClass:'el-icon-close',
          type: 'warning'
        }).then(() => {
          let delArr = []
          this.selectedData.forEach(item => {
            delArr.push(item.id)
          });
          delrooms(delArr).then(res=>{
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.initTreedata()
            this.roomAll({pid:this.treePid})
          })
        }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    showEditAbility(data){
      this.addType='EDIT'
      this.groupDialogTitle='编辑房间'
      this.groupDialogShow=true
      this.start++
      this.selfId=data.id
       this.pubIds = pubsub.subscribe('roomFloor',(msgName,data)=>{
        this.$emit('roomeditEventTree',data)
        console.log(data,'roomeditEventTree')
      })
      this.pubIds = pubsub.subscribe('roomtreeDept',(msgName,data)=>{
        this.$emit('treeDeptEvent',data)
        console.log(data,'treeDeptEvent')
      })
    },
    deleteAbility(data){
    this.$confirm(`确定要删除该房间吗?`, '提示', {
        confirmButtonText: '确定',
        confirmButtonClass:'el-icon-check',
        cancelButtonText: '取消',
        cancelButtonClass:'el-icon-close',
        type: 'warning'
      }).then(() => {
          //let obj = getObjByKey(this.permission.delRoom)
          let params={
            id:data.id
          }
          getControlTree('/pm/room','delete',params).then(res=>{
            if(res.code===200){
              this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.initTreedata()
                this.roomAll({pid:this.treePid})
              }else{
                this.$message({
                  message: res.meta.message,
                  type: 'error'
                })
              }
          })
      })
    },
    search(){
      //let obj = getObjByKey(this.permission.roomList)
      let params={
        pid:this.treePid,
        name:this.searchForm.roomName,
        status:this.searchForm.rentedStatus,
        pageSize:this.searchForm.pageSize,
        pageNum:this.searchForm.pageNum
      }
      getControlTree('/pm/room/all','get',params).then(res=>{
        if(res.code===200){
          this.$emit('roomAddEvent',res.data)
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    reset(){
      //let obj = getObjByKey(this.permission.roomList)
      let params={
        pid:this.treePid,
      }
      getControlTree('/pm/room/all','get',params).then(res=>{
        if(res.code===200){
          this.$emit('roomAddEvent',res.data)
          this.searchForm.roomName=''
          this.searchForm.rentedStatus=''
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    // 所有房间列表
  roomAll(params){
     //let obj = getObjByKey(this.permission.roomList)
      getControlTree('/pm/room/all','get',params).then(res=>{
        if(res.code===200){
          this.$emit('delRoom',res.data)
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
  },
    handleCurrentChange(val){
      this.searchForm.pageNum =val.page
      this.searchForm.pageSize =val.limit
      this.search()
    },
    // handleSizeChangeTable(val) {
    //   console.log(val,'val2')
    //    this.pages.pageSize =val.limit
    // },
  }
}
</script>
<style scoped>
::v-deep .video-web-right-box{
  height:100%;
}
.demo-form-inline{
  display:flex;
  flex-direction: row;
  margin-top:20px;
  margin-left: 0px;
}
.titleName{
  padding:0;
  margin:0;
  padding-bottom:10px;
  color:#000;
  text-align: left;
}
.imgBox{
  width: 517px;
	height: 273px;
	background-color: #fff;

}
.imgBox img{
  /* width:100%;
  height:100%; */
  width:400px;
  height:300px;
  object-fit: cover;
  display: block;
  border-radius: 8px;
  image-rendering: -webkit-optimize-contrast;
}
.parkInfor{
  display: flex;
  justify-content: flex-start;
}

.parkInforContent{
  display: flex;
  flex-direction: column;
   margin-left:50px;
}

</style>
<style lang="less" scoped>
 ::v-deep .el-textarea__inner{
   &::placeholder {
      color: #afb9d0 !important;
    }
    font-family: Microsoft YaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
}
::v-deep .descriptions-item{
  padding: 10px 20px 15px 0;
}
</style>
