<template>
  <div  style="height:inherit">
    <div style="height:inherit">
      <!-- <HighlightSquare class="highlight-height-table-new"> -->
        <!-- <template v-slot:child> -->
            <div>
              <h4 class='titleName'>{{floorName}}</h4>
              <div class='parkInfor'>
                <div class='imgBox'>
                  <img :src="NET.BASE_URL+floorData.picture" alt="">
                </div> 
                <div class='parkInforContent'>
                  <com-descriptions title="" class='infor'>
                    <com-descriptions-item :span="12" label="楼宇总数">
                        <template slot="content">
                            <div>{{floorData.buildingSum + '栋'}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="建筑面积">
                        <template slot="content">
                            <div>{{floorData.area + '㎡'}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="房间套数">
                        <template slot="content">
                            <div class="colorStress">{{'总共'+floorData.roomSum+'套，'+'剩余'+floorData.surplusRoomSum+'套'}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="入驻企业">
                        <template slot="content">
                            <div class="colorStress">{{'总共'+floorData.companySum+'家'}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="所在位置">
                        <template slot="content">
                            <div class="colorStress">{{floorData.address}}</div>
                        </template>
                    </com-descriptions-item>
                    <com-descriptions-item :span="24" label="项目简介">
                        <template slot="content">
                            <div class="colorStress" style="white-space:pre-line;width: 500px;">{{floorData.description}}</div>
                        </template>
                    </com-descriptions-item>
                  </com-descriptions>
                </div>
              </div>
            </div>
          <!-- </template> -->
        <!-- </HighlightSquare> -->
      <div  class="video-web-flex" style="margin-top:30px;">
         <el-form v-model="searchForm" :inline="true" class="demo-form-inline"  v-show="showSearch">
           <el-form-item prop="floorName" label="楼宇名称">
              <el-input v-model="searchForm.floorName" placeholder="请输入楼宇名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()" >搜索</el-button>
              <el-button icon="el-icon-refresh" @click="reset()" >重置</el-button>
            </el-form-item>
          </el-form>
      </div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click='addFloor'
          >新建楼宇</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
      </el-row>
      <div style="height:calc(100% - 460px)">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="name" label="楼宇名称" align="left" show-overflow-tooltip />
        <el-table-column prop="accruedArea" label="计费面积（m³）" align="left" show-overflow-tooltip />
        <el-table-column prop="rentedArea" label="出租面积（m³）" align="left" show-overflow-tooltip />
        <el-table-column prop="surplusArea" label="剩余面积（m³）" align="left" show-overflow-tooltip />
        <el-table-column prop="rentedRatio" label="出租率（%）" align="left" show-overflow-tooltip />
        <el-table-column prop="rentedNum" label="已租套数" align="left" show-overflow-tooltip />
        <el-table-column prop="surplusNum" label="剩余套数" align="left" show-overflow-tooltip />
        <el-table-column label="操作" align="left" width="160px">
          <template slot-scope="scope">
             <el-button  type="text"  @click="showEditAbility(scope.row)" icon="el-icon-edit">编 辑</el-button>
            <el-button type="text"  @click="deleteAbility(scope.row)" icon="el-icon-delete">删除</el-button>
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
      <addfloor :dataRow='dataRow' ref="addfloor" @showfloor='showfloor' :start='start' :selfId='selfId' :addType='addType' :nodeId='nodeId' :referenceId='referenceId' :treePid='treePid'></addfloor>
    </el-dialog>
  </div>

</template>
<script>
import { getControlTree } from '@/api/spaceManagement/controlManagement'
import ComDescriptions from "@/components/comDescription/comdescription"
import ComDescriptionsItem from "@/components/comDescription/comdescriptionItem"
import pagination from '@/components/comPagination'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
import { Message } from 'element-ui';
import addfloor from'./addfloor'
import pubsub from 'pubsub-js'
export default {
  name:'ControlManagement',
   components:{pagination,ComDescriptions,ComDescriptionsItem,addfloor},
   props:['floorData','tableData','treePid','nodeId','referenceId','floorName','parameter','dataRow','initTreedata'],
  data(){
    return {
      groupDialogTitle:'新建楼宇',
      groupDialogShow:false,
      loading:false,
      defaultProps:{

      },
      searchForm: {
        floorName: '',
      },
      permission:{
        treeAll:'spaceManagement::controlManagement::treeAll',
        addFloor:'spaceManagement::controlManagement::addFloor',
        editFloor:'spaceManagement::controlManagement::editFloor',
        delFloor:'spaceManagement::controlManagement::delFloor',
        floorList:'spaceManagement::controlManagement::floorList',
          // 根据主键I的查询楼宇信息
          floorRoom:'spaceManagement::controlManagement::floorRoom',
      },
      addType:'ADD',
      pubId:'',
      pubIds:'',
      selfId:'',
      showSearch:true,
      start: 0
    }
  },
  mounted(){
    
  },
  methods:{
    closeGroupDialog() {
      this.$refs['addfloor'].resetForm()
      this.groupDialogShow = false
    },
    showfloor(data){
     this.groupDialogShow=data
    },
    addFloor(){
     this.addType='ADD'
     this.groupDialogShow=true
     this.start = 0
    this.pubId = pubsub.subscribe('floorData',(msgName,data)=>{
      this.$emit('floorAddEvent',data)
      console.log(data,'floorAddEventdata')
    })
    this.pubIds = pubsub.subscribe('zoneDept',(msgName,data)=>{
      this.$emit('floorAddEventTree',data)
      console.log(data,'floorAddEventTree')
		})
    },
    // 所有楼层列表
  floorAll(params){
     //let obj = getObjByKey(this.permission.floorList);
      getControlTree('/pm/building/all','get',params).then(res=>{
        if(res.code===200){
          this.$emit('delFool',res.data)
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    search(){
      //let obj = getObjByKey(this.permission.floorList);
      let params={
        pid:this.treePid,
        name:this.searchForm.floorName,
        pageSize:this.searchForm.pageSize,
        pageNum:this.searchForm.pageNum
      }
      getControlTree('/pm/building/all','get',params).then(res=>{
        if(res.code===200){
          this.$emit('delFool',res.data)
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    reset(){
      //let obj = getObjByKey(this.permission.floorList);
      let params={
        pid:this.treePid,
      }
      getControlTree('/pm/building/all','get',params).then(res=>{
        if(res.code===200){
          this.$emit('delFool',res.data)
          this.searchForm.floorName=''
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    showEditAbility(data){
      this.groupDialogShow=true
      this.addType='EDIT'
       this.groupDialogTitle='编辑楼宇'
       this.start++
       this.selfId=data.id
      this.pubIds = pubsub.subscribe('editFloor',(msgName,data)=>{
        this.$emit('flooreditEventTree',data)
        console.log(data,'flooreditEventTree')
      })
      this.pubIds = pubsub.subscribe('treeDept',(msgName,data)=>{
        this.$emit('treeDeptEvent',data)
      })
    },
 
    deleteAbility(data){
       this.$confirm(`确定要删除该楼宇吗?`, '提示', {
        confirmButtonText: '确定',
        confirmButtonClass:'el-icon-check',
        cancelButtonText: '取消',
        cancelButtonClass:'el-icon-close',
        type: 'warning'
      }).then(() => {
        //let obj = getObjByKey(this.permission.delFloor);
      let params={
        id:data.id
      }
        getControlTree('/pm/building','delete',params).then(res=>{
          if(res.code===200){
            this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.floorAll({pid:this.treePid})
              this.initTreedata()
            }else{
              this.$message({
                message: res.meta.message,
                type: 'error'
              })
            }
        }).catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "已取消",
            // });
          });
      }).catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "已取消",
            // });
          });
    },
    handleCurrentChange(val){
      this.searchForm.pageNum =val.page
      this.searchForm.pageSize =val.limit
      this.search()
    },
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
