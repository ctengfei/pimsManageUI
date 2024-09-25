<template>
  <div>
    <div class="video-web-flex" v-if='isrefesh'>
      <el-form v-model="searchForm" :inline="true" class="demo-form-inline">
        <el-form-item label="园区名称">
          <el-input v-model="searchForm.parkName" placeholder="请输入园区名称" clearable />
          <!-- <el-select
                  v-model="searchParkName"
                  clearable
                  placeholder="全部园区"
                  style="max-width: 200PX;margin-left: 10px;"
                >
                  <el-option
                    v-for="item in parkName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select> -->
        </el-form-item>
        <el-form-item>
          <el-button  @click="search()"  type="primary" icon="el-icon-search">搜索</el-button>
          <el-button @click="reset()" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <!--<el-button  @click='addPark'  icon="el-icon-plus" plain type="primary">新建园区</el-button>-->
    </div>
    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click='addPark'
          >新建园区</el-button>
        </el-col>
      </el-row>
      <div v-if="parkInfors.length">
        <div :style="'padding-bottom:40px;'+ {backgroundImage: 'url(' + jiantou + ')' }" v-for='(item,index) in parkInfors' :key='index'>
          <h4 class='titleName' :style="{backgroundImage: 'url(' + jiantou + ')' }">{{item.name}}</h4>
          <div class='parkInfor'>
            <div class='imgBox'>
              <img :src="NET.BASE_URL+item.picture" alt="">
            </div>
            <div class='parkInforContent'>
              <com-descriptions title="" class='infor'>
                <com-descriptions-item :span="12" label="楼宇总数">
                    <template slot="content">
                        <div>{{item.buildingSum}}</div>
                    </template>
                </com-descriptions-item>
                <com-descriptions-item :span="24" label="建筑面积">
                    <template slot="content">
                        <div>{{item.area}}</div>
                    </template>
                </com-descriptions-item>
                <com-descriptions-item :span="24" label="房间套数">
                    <template slot="content">
                        <div class="colorStress">{{item.roomSum}}</div>
                    </template>
                </com-descriptions-item>
                <com-descriptions-item :span="24" label="入驻企业">
                    <template slot="content">
                        <div class="colorStress">{{item.companySum}}</div>
                    </template>
                </com-descriptions-item>
                <com-descriptions-item :span="24" label="所在位置">
                    <template slot="content">
                        <div class="colorStress">{{item.address}}</div>
                    </template>
                </com-descriptions-item>
                <com-descriptions-item :span="24" label="园区简介">
                    <template slot="content">
                        <div class="colorStress" style="white-space:pre-line;width: 500px;">{{item.description}}</div>
                    </template>
                </com-descriptions-item>
              </com-descriptions>
              <span slot="footer">
                <el-button type="primary" plain icon='el-icon-edit-outline' @click="editPark(item)">编 辑</el-button>
                <el-button type="danger" plain icon='el-icon-delete' @click="delPark(item)">删 除</el-button>
              </span>
            </div>
          </div>
        </div>
        </div>
        <div class="el-table__empty-text" v-else style="color:white;font-size:20px;">
          <span>暂无数据</span>
        </div>
    <!-- <div style='text-align:center;'> -->
     <el-dialog :title="groupDialogTitle" :close-on-click-modal='false' :visible.sync="groupDialogShow" :before-close="closeGroupDialog" width="600px">
      <addpark @showPark='showPark' :start='start' :addType='addType' :treePid='treePid' :rowData='rowData' ref="addpark"></addpark>
     </el-dialog>
    <!-- </div> -->
  </div>
</template>
<script>
import { getControlTree } from '@/api/spaceManagement/controlManagement'
import ComDescriptions from "@/components/comDescription/comdescription"
import ComDescriptionsItem from "@/components/comDescription/comdescriptionItem"
import pagination from '@/components/comPagination'
import { Message } from 'element-ui';
import addpark from'./addpark'
import pubsub from 'pubsub-js'
import jiantou from '@/assets/images/jiantou.png'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
export default {
  name:'ControlManagement',
   components:{pagination,ComDescriptions,ComDescriptionsItem,addpark},
   props:['parkInfors','treePid','initTreedata'],
  data(){
    return {
      jiantou,
      groupDialogTitle:'新建园区',
      groupDialogShow:false,
      rowData:{},
      isrefesh:true,
      loading:false,
      parkPid:'',
      treeData:[],
      defaultProps:{

      },
      addType:'ADD',
      searchForm: {
        parkName: '',
      },
      searchParkName:'',
      parkName:[
        { value: "IPC", label: "IPC" },
        { value: "NVR", label: "NVR" },
      ],
      permission:{
        areaAll:'spaceManagement::controlManagement::areaAll',
        treeAll:'spaceManagement::controlManagement::treeAll',
        editarea:'spaceManagement::controlManagement::editarea',
        addarea:'spaceManagement::controlManagement::addarea',
        delarea:'spaceManagement::controlManagement::delarea'
      },
      pubId:'',
      start: 0
    }
  },
  mounted(){
  },
  methods:{
    closeGroupDialog() {
      this.$refs['addpark'].resetForm()
      this.groupDialogShow = false
    },
   showPark(data){
     this.groupDialogShow=data
   },
   addPark(data){
    this.addType='ADD'
    this.start = 0
    this.groupDialogShow=true
    this.pubId = pubsub.subscribe('parkData',(msgName,data)=>{
			this.$emit('parkDataEvent',data)
    })
    this.pubId = pubsub.subscribe('parkTreeData',(msgName,data)=>{
			this.$emit('parkTreeDataEvent',data)
    })
   },
    editPark(data){
    this.addType='EDIT'
    this.start++
    this.groupDialogTitle='编辑园区'
    this.groupDialogShow=true
    this.rowData=data
    this.pubId = pubsub.subscribe('parkTreeData',(msgName,data)=>{
			this.$emit('parkTreeDataEvent',data)
    })
    this.pubId = pubsub.subscribe('parkData',(msgName,data)=>{
			this.$emit('parkDataEvent',data)
    })
   },
   delPark(data){
      this.$confirm(`确定要删除该园区吗?`, '提示', {
        confirmButtonText: '确定',
        confirmButtonClass:'el-icon-check',
        cancelButtonText: '取消',
        cancelButtonClass:'el-icon-close',
        type: 'warning'
      }).then(() => {
      //let obj = getObjByKey(this.permission.delarea)
      let params={
        id:data.id
      }
      getControlTree('/pm/zone','delete',params).then(res=>{
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.initTreedata()
        this.areaAll({pid:1})
      })
    }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
   },
   // 所有园区列表
    areaAll(params){
      //let obj = getObjByKey(this.permission.areaAll)
      getControlTree('/pm/zone/all','get',params).then(res=>{
        if(res.code===200){
          this.$emit('delparkDataEvent',res.data)
          // pubsub.publish('delparkData',res.data.data)
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    search(){
      let datas={
        pid:1,
        name:this.searchForm.parkName
      }
      this.areaAll(datas)
    },
    reset(){
      this.searchForm.parkName=''
      this.areaAll({pid:1})
    }
  }
}
</script>
<style scoped>
::v-deep .video-web-right-box{
  height:100%;
}
::v-deep .el-form-item--small.el-form-item{
  margin-bottom: 0;
}
.demo-form-inline{
  display:flex;
  flex-direction: row;
}
.video-web-flex{
  margin-top: 30px;
  padding: 0px 10px 20px 0px;
}
.titleName{
  margin:0;
  padding:0px 10px 10px 0px;
  color:#000;
  text-align: left;
	font-family: Microsoft YaHei;
	font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 21px;
	letter-spacing: 0px;
  background-position:0 25px;
  background-repeat:  no-repeat;

}
.imgBox{
  width: 517px;
	height: 280px;
}
.imgBox img{
  width:400px;
  height:300px;
  border-radius: 8px;
  /* max-width:100%; */
  object-fit: cover;
  /* background-size: 100% 100%; */
  image-rendering: -webkit-optimize-contrast;
}
.parkInfor{
  display: flex;
  justify-content: flex-start;
  height: 300px;
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
 .el-table__empty-text{
   width: 100%;
   color: #909399 !important;
   text-align: center;
   height: calc(100vh - 280px);
   span{
     display: block;
     margin-top: 200px;
   }
 }
</style>
