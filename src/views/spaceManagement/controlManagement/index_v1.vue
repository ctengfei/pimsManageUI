<template>
  <div class="app-container">
    <el-row :gutter="20">
      
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
        <div class="head-container">
          <el-input
            v-model="filterText"
            placeholder="请输入区域名称"
            clearable
           
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
        <el-tree
          ref="tree"
          highlight-current
          v-loading="loading"
          :data="treeData"
          :default-expanded-keys="expandList"
          node-key="id"
          class="video-web-tree"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        />
        </div>
  </el-col>
  <el-col :xl="20" :lg="18" :sm="17" :xs="24">
    <div class="video-web-right-box  padding-20">
        <parkList v-show='isParkList' :treePid='treePid' :initTreedata="initTreedata" :parkInfors='parkInfors' :areaAll='areaAll' @parkDataEvent='parkDataEvent' @delparkDataEvent='delparkDataEvent' @parkTreeDataEvent='parkTreeDataEvent'></parkList>
        <floorList  v-show='isFloorList' :dataRow='dataRow' :initTreedata="initTreedata" :parameter='parameter' :floorName='floorName' :nodeId='nodeId' :referenceId='referenceId' :treePid='treePid'  :tableData='tableData' :floorData='floorData' @treeDeptEvent='treeDeptEvent' @flooreditEventTree='flooreditEventTree' @floorAddEvent='floorAddEvent' @floorAddEventTree='floorAddEventTree' @delFool='delFool'></floorList>
        <roomList  v-show='isRoomList' :parameter='parameter' :initTreedata="initTreedata" :floorName='floorName' :nodeId='nodeId' :referenceId='referenceId' :roomId='roomId' :treePid='treePid' :tableData='tableData' :roomData='roomData' @roomAddEvent='roomAddEvent' @roomeditEventTree='roomeditEventTree' @roomtreeDept='roomtreeDept' @delRoom='delRoom' @roomDataEven='roomDataEven'></roomList>
    </div>
    </el-col>
    </el-row>
    </div>
</template>
<script>
import { getControlTree } from '@/api/spaceManagement/controlManagement'
import ComDescriptions from "@/components/comDescription/comdescription"
import ComDescriptionsItem from "@/components/comDescription/comdescriptionItem"
import { Message } from 'element-ui'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
import parkList from'./parkList'
import floorList from'./floorList'
import roomList from'./roomList'
import pubsub from 'pubsub-js'
export default {
  name:'ControlManagement',
   components:{ComDescriptions,ComDescriptionsItem,parkList,floorList,roomList},
  data(){
    return {
      dataRow:{},
      isParkList:true,
      isFloorList:false,
      isRoomList:false,
      addShow:false,
      loading:false,
      defaultShowNodes:[],
      treePid:'',
      treeData:[],
      nodeId:'',
      defaultProps:{
        label:'name',
        value:'id',
        children:'children'
      },
      searchForm: {
        parkName: '',
      },
      searchParkName:'',
      parkName:[
        { value: "IPC", label: "IPC" },
        { value: "NVR", label: "NVR" },
      ],
      parkInfors:[],
      floorData:{},
      roomData:{},
      tableData:[],
      // permission:{
      //   treeAll:'spaceManagement::controlManagement::treeAll',
      //   areaAll:'spaceManagement::controlManagement::areaAll',
      //   areaFloor:'spaceManagement::controlManagement::areaFloor',
      //   floorRoom:'spaceManagement::controlManagement::floorRoom',
      //   floorList:'spaceManagement::controlManagement::floorList',
      //   roomList:'spaceManagement::controlManagement::roomList',
      //   getImage:'get::image',
      // },
      referenceId:'',
      floorName:'',
      filterText:'',
      roomId:'',
       parameter: {
        pageNum: 1,
        pageSize: 10,
        total:0
      },
      expandList:[],
    }
  },
  watch: {
    filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  mounted(){
    this.initTreedata()
    this.areaAll({
          pid:1
        })
  },
  methods:{
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
      nodeExpand(data){
        console.log(data,'data树节点')
      this.expandList.push(data.id)
    },
    nodeCollapse(data){
      this.expandList.splice(this.expandList.indexOf(data.id),1)
    },
    initTreedata(){
      //let obj = getObjByKey(this.permission.treeAll)
      let parmas  = {
          nodeType:'DIR',
        }
      getControlTree('/pm/space/tree/whole','get',parmas).then(res=>{

        this.treeData=res.data
        console.log(this.treeData[0].id,'this.treeData[0].id')
        this.nodeExpand(this.treeData[0])
      })
    },
    handleNodeClick(data,node){
      if(data.type==='ROOM'){
        return false
      }else {
        this.dataRow=data
        this.treePid=data.id
        this.nodeId=data.pid
        this.referenceId=data.referenceId
        if(node.level===1){
          this.floorName=data.name
          this.isParkList=true
          this.isFloorList=false
          this.isRoomList=false
          let params={
            pid:data.id
          }
          let params2={
            pid:data.pid,
            id:data.referenceId
          }
          this.areaAll(params)
        }else if(node.level===2){
          this.floorName=data.name
          this.isParkList=false
          this.isFloorList=true
          this.isRoomList=false
          let params={
            pid:data.id,
            pageNum:this.parameter.pageNum,
            pageSize:this.parameter.pageSize,
          }
          let params2={
            pid:data.pid,
            id:data.referenceId
          }
          this.floorId=data.id

          this.floorAll(params)
          this.areaFloor(params2)
        }else if(node.level===3){
          this.floorName=data.name
          this.isParkList=false
          this.isFloorList=false
          this.isRoomList=true
          let params={
            pageNum:this.parameter.pageNum,
            pageSize:this.parameter.pageSize,
            pid:data.id
          }
          let params2={
            pid:data.pid,
            id:data.referenceId
          }
          this.roomId=data.id
          this.roomAll(params)
          this.floorRoom(params2)
        }
      }
    },
    // 所有园区列表
    areaAll(params){
      //let obj = getObjByKey(this.permission.areaAll)
      getControlTree('/pm/zone/all','get',params).then(res=>{
        if(res.code===200){
          this.parkInfors=res.data.data
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    // 楼层所在园区信息
  areaFloor(params){
    //let obj = getObjByKey(this.permission.areaFloor)
      getControlTree('/pm/zone','get',params).then(res=>{
         if(res.code===200){
          this.floorData=res.data
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    // 房间所在楼层信息
  floorRoom(params){
     //let obj = getObjByKey(this.permission.floorRoom)
      getControlTree('/pm/building','get',params).then(res=>{
         if(res.code===200){
           this.roomData=res.data
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
  // 所有楼层列表
  floorAll(params){
      //let obj = getObjByKey(this.permission.floorList)
      getControlTree('/pm/building/all','get',params).then(res=>{
        if(res.code===200){
          this.tableData=res.data.data
          this.parameter={
            pageSize:res.data.pageSize,
            total:res.data.total,
            pageNum:res.data.pageNum
          }
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
          this.tableData=res.data.data
           this.parameter={
            pageSize:res.data.pageSize,
            total:res.data.total,
            pageNum:res.data.pageNum
          }
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
  },
  showPark(data){
     this.addShow=data
  },
  addPark(){
    this.addShow=true

   },
   // 新增园区刷表格
  parkDataEvent(data){
    this.parkInfors=data.data
    this.parameter.total = data.total
    console.log(data,this.parkInfors,'this.parkInfors11111')
  },
  // 新增园区刷新树
  parkTreeDataEvent(data){
    this.treeData=data
    console.log(this.treeData,'this.treeData')
  },
  // 删除园区刷表格
  delparkDataEvent(data){
    this.parkInfors=data.data
    this.parameter.total = data.total
  },
  // 新增楼层刷表格
  floorAddEvent(data){
    this.tableData=data.data
    this.parameter.total = data.total
  },
  // 新增楼层刷新树
  floorAddEventTree(data){
    this.treeData=data
  },
  flooreditEventTree(data){
    this.tableData=data.data
    this.parameter.total = data.total
  },
  delFool(data){
    this.tableData=data.data
    this.parameter.total = data.total
  },
  treeDeptEvent(data){
    this.treeData=data
  },
  roomAddEvent(data){
    this.tableData=data.data
    this.parameter.total = data.total
  },
  roomeditEventTree(data){
    this.tableData=data.data
    this.parameter.total = data.total
  },
  delRoom(data){
this.tableData=data.data
this.parameter.total = data.total
  },
  roomtreeDept(data){
    this.treeData=data
  },
  roomDataEven(data){
    this.tableData=data.data
    this.parameter.total = data.total
  }
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
}
.titleName{
  padding-bottom:10px;
  /* border-bottom:1px solid rgb(49, 52, 72); */
  color: #606266;
  text-align: left;
  font-weight:700;
  font-size: 16px;
}
.imgBox{
  width: 517px;
	height: 273px;
	background-color: #fff;
  border-radius: 8px;
}
.parkInfor{
  display: flex;
  justify-content: flex-start;
}

.parkInforContent{
  display: flex;
  flex-direction: column;
   margin-left:100px;
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
::v-deep .el-card{
      border: none;
}
::v-deep .el-card__body {
	padding: 0px;
}
 .video-web-left-box{
   overflow: hidden;
  //  margin-top: 10px;
 }
 .video-web-left-area{
   overflow: auto;
 }
</style>
