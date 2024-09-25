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
        <div class="treeBox">
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
          style="background-color: #f5f7fa;"
        />
        </div>
  </el-col>
  <el-col :xl="20" :lg="18" :sm="17" :xs="24">
    <div class="video-web-right-box  padding-20">
        <div class="topData">
          <div class="bgc" v-for="(item,index) in spanList" :key="index">
            <div class="leftText">
              <span class="bottomText">{{item.name}}{{item.num}}</span>
            </div>
          </div>
        </div>
        <el-descriptions :column="5"  label-class-name="labelClass" content-class-name="contentClass">
            <el-descriptions-item label="已租房间">{{roomObj.rentedRoomSum}}个</el-descriptions-item>
            <el-descriptions-item label="即将到期房间">{{roomObj.dueRoomSum}}个</el-descriptions-item>
            <el-descriptions-item label="已逾期房间">{{roomObj.expectedRoomSum}}个</el-descriptions-item>
            <el-descriptions-item label="已预订房间">{{roomObj.predetermineRoomSum}}个</el-descriptions-item>
            <el-descriptions-item label="自用房间">{{roomObj.selfUseRoomSum}}个</el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="5" label-class-name="labelClass" content-class-name="contentClass">
            <el-descriptions-item label="面积">{{areaObj.rentedArea}}m²</el-descriptions-item>
            <el-descriptions-item label="面积">{{areaObj.dueArea}}m²</el-descriptions-item>
            <el-descriptions-item label="面积">{{areaObj.expectedArea}}m²</el-descriptions-item>
            <el-descriptions-item label="面积">{{areaObj.predetermineArea}}m²</el-descriptions-item>
            <el-descriptions-item label="面积">{{areaObj.selfUseArea}}m²</el-descriptions-item>
        </el-descriptions>
        <div class="tabWrap">
          <div class="tabItem" :class="{'active':index == itemIndex ? true : false}" v-for="(item,index) in tabList" :key="index" @click="tabClick(item,index)">
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="contentWrap">
          <el-row :gutter="12">
            <el-col :span="8" v-for="(item,index) in tableData" :key="index">
              <el-card shadow="always" style="margin-bottom:10px" >
                <el-descriptions :column="1"  label-class-name="labelClass" content-class-name="contentClass">
                    <el-descriptions-item label="房间名称">{{ item.name }}</el-descriptions-item>
                    <el-descriptions-item label="面积">{{ item.accruedArea }}</el-descriptions-item>
                    <el-descriptions-item label="企业名称">{{ item.companyName }}</el-descriptions-item>
                    <el-descriptions-item label="企业法人">{{ item.enterpriseLegalPerson }}</el-descriptions-item>
                    <el-descriptions-item label="所属产业">{{ item.industry }}</el-descriptions-item>
                    <el-descriptions-item v-if="itemVal !== 'SELF_USE'" label="租期">{{ item.startDate }}~{{ item.endDate }}</el-descriptions-item>
                    <el-descriptions-item v-if="itemVal == 2" label="逾期时间">{{ item.expectTime }}</el-descriptions-item>
                    <el-descriptions-item v-if="itemVal == 1" label="即将时间">{{ item.dueTime }}</el-descriptions-item>
                    <el-descriptions-item v-if="itemVal == 3" label="预定时间">{{ item.predetermineTime }}</el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
          </el-row>
        </div>
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
    </el-col>
    </el-row>
    </div>
</template>
<script>
import { getControlTree, getRoomList, getZoomStatist } from '@/api/spaceManagement/controlManagement'
import { formatData } from '@/utils/index'
import pagination from '@/components/comPagination'

export default {
  name:'ControlManagement',
   components:{ pagination },
  data(){
    return {
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
      tableData:[],
      referenceId:'',
      floorName:'',
      filterText:'',
       parameter: {
        pageNum: 1,
        pageSize: 10,
        total:0
      },
      expandList:[],
      spanList: [
        {
          num:1,
          name:"房源总数（套）"
        },
        {
          num:1,
          name:"房源总面积（m²）"
        },
        {
          num:1,
          name:"已租房源（套）"
        },
        {
          num:1,
          name:"即将到期房源（套）"
        },
        {
          num:1,
          name:"已逾期房源（套）"
        },
        {
          num:1,
          name:"已预订房源（套）"
        }
      ],
      itemIndex:0,
      itemVal:"",
      tabList:[
        {
          name:"已租",
          value:"RENTED"
        },
        {
          name:"即将到期",
          value:1
        },
        {
          name:"已逾期",
          value:2
        },
        {
          name:"已预订",
          value:3
        },
        {
          name:"自用",
          value:"SELF_USE"
        }
      ],
      roomObj:{},
      areaObj:{},
      statusVal:"RENTED",
      querayTagVal:"",
      usageModeVal:"",
      ptype:"",
      pid:""
    }
  },
  watch: {
    filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  mounted(){
    this.initTreedata()
    this.getListData({status:"RENTED"})
    this.areaAll({pid:1})
  },
  methods:{
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    nodeExpand(data){
      this.expandList.push(data.id)
    },
    nodeCollapse(data){
      this.expandList.splice(this.expandList.indexOf(data.id),1)
    },
    // 树结构
    initTreedata(){
      let parmas  = {
          nodeType:'DIR',
        }
      getControlTree('/pm/space/tree/whole','get',parmas).then(res=>{
        this.treeData=res.data
        this.nodeExpand(this.treeData[0])
      })
    },
    // tab过滤
    tabClick(item,index){
      this.itemIndex = index
      this.itemVal = item.value
      if(item.value == 'RENTED'){
        this.statusVal = item.value
        this.querayTagVal = ""
        this.usageModeVal = ""
      }else if(item.value == 'SELF_USE'){
        this.statusVal = ""
        this.querayTagVal = ""
        this.usageModeVal = item.value
      }else{
        this.statusVal = ""
        this.querayTagVal = item.value
        this.usageModeVal = ""
      }
      let params = {
        pageNum:this.parameter.pageNum,
        pageSize:this.parameter.pageSize,
        pid: this.pid,
        ptype: this.ptype,
        usageMode:this.usageModeVal,
        status:this.statusVal,
        querayTag:this.querayTagVal
      }
      this.getListData(params)

    },
    // 点击树父节点查询
    handleNodeClick(data,node){
      if(data.type==='ROOM'){
        return false
      }else {
        this.pid=data.id
        this.nodeId=data.pid
        this.id=data.referenceId
        this.ptype = data.type
        if(node.level===1){
          this.floorName=data.name
          let params1={
            pid:data.id,
          }
          let params = {
            pageNum:this.parameter.pageNum,
            pageSize:this.parameter.pageSize,
            pid: data.id,
            ptype: data.type,
            usageMode:this.usageModeVal,
            status:this.statusVal,
            querayTag:this.querayTagVal
          }
          this.getListData(params)
          this.areaAll(params1)
        }else if(node.level===2){
          this.floorName=data.name
          let params={
            pageNum:this.parameter.pageNum,
            pageSize:this.parameter.pageSize,
            pid: data.id,
            ptype: data.type,
            usageMode:this.usageModeVal,
            status:this.statusVal,
            querayTag:this.querayTagVal
          }
          let params2={
            pid:data.pid,
            id:data.referenceId
          }
          this.floorId=data.id
          this.getListData(params)
          this.areaFloor(params2)
        }else if(node.level===3){
          this.floorName=data.name
          let params={
            pageNum:this.parameter.pageNum,
            pageSize:this.parameter.pageSize,
            pid: data.id,
            ptype: data.type,
            usageMode:this.usageModeVal,
            status:this.statusVal,
            querayTag:this.querayTagVal
          }
          let params2={
            pid:data.pid,
            id:data.referenceId
          }
          this.getListData(params)
          this.floorRoom(params2)
        }
        // this.getZoomStatistData(params)
        // this.getListData(params)
      }
    },
    // 所有园区列表
    areaAll(params){
      //let obj = getObjByKey(this.permission.areaAll)
      getControlTree('/pm/zone/all','get',params).then(res=>{
        if(res.code===200){
          let temp = res.data.data
          this.spanList = [
            {
              name:"房间（个）",
              num:res.data.data[0].roomSum
            },
            {
              name:"总面积（m²）",
              num:res.data.data[0].area
            },
            {
              name:"企业（家）",
              num:res.data.data[0].companySum
            }
          ]
          this.roomObj={
            dueRoomSum:res.data.data[0].dueRoomSum,
            expectedRoomSum:res.data.data[0].expectedRoomSum,
            predetermineRoomSum:res.data.data[0].predetermineRoomSum,
            rentedRoomSum:res.data.data[0].rentedRoomSum,
            selfUseRoomSum:res.data.data[0].selfUseRoomSum
          },
          this.areaObj= {
            dueArea:res.data.data[0].dueArea,
            expectedArea:res.data.data[0].expectedArea,
            predetermineArea:res.data.data[0].predetermineArea,
            rentedArea:res.data.data[0].rentedArea,
            selfUseArea:res.data.data[0].selfUseArea,
          }
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
            // this.spanList=res.data
            this.spanList = [
              {
                name:"房间（个）",
                num:res.data.roomSum
              },
              {
                name:"总面积（m²）",
                num:res.data.area
              },
              {
                name:"企业（家）",
                num:res.data.companySum
              }
            ],
            this.roomObj={
              dueRoomSum:res.data.dueRoomSum,
              expectedRoomSum:res.data.expectedRoomSum,
              predetermineRoomSum:res.data.predetermineRoomSum,
              rentedRoomSum:res.data.rentedRoomSum,
              selfUseRoomSum:res.data.selfUseRoomSum
            },
            this.areaObj= {
              dueArea:res.data.dueArea,
              expectedArea:res.data.expectedArea,
              predetermineArea:res.data.predetermineArea,
              rentedArea:res.data.rentedArea,
              selfUseArea:res.data.selfUseArea,
            }
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
          //  this.spanList=res.data
           this.spanList = [
            {
              name:"房间（个）",
              num:res.data.roomSum
            },
            {
              name:"总面积（m²）",
              num:res.data.area
            },
            {
              name:"企业（家）",
              num:res.data.companySum
            }
          ]
          this.roomObj={
            dueRoomSum:res.data.dueRoomSum,
            expectedRoomSum:res.data.expectedRoomSum,
            predetermineRoomSum:res.data.predetermineRoomSum,
            rentedRoomSum:res.data.rentedNum,
            selfUseRoomSum:res.data.selfUseRoomSum
          },
          this.areaObj= {
            dueArea:res.data.dueArea,
            expectedArea:res.data.expectedArea,
            predetermineArea:res.data.predetermineArea,
            rentedArea:res.data.rentedArea,
            selfUseArea:res.data.selfUseArea,
          }
        }else{
          this.$message({
            message: res.meta.message,
            type: 'error'
          })
        }
      })
    },
    // 查询列表
    getListData(params){
      getRoomList(params).then(res=>{
        this.tableData = res.data.data
        this.parameter.total = res.data.total
      })
    },
    // 统计
    getZoomStatistData(params){
      getZoomStatist(params).then(res=>{
        this.tabList = res.data
      })
    },
    // 分页
    handleCurrentChange(){

    },
 }
}
</script>
<style lang="less" scoped>
.head-container{
  background-color: #f5f7fa;
}
.treeBox {
  height: 800px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
::v-deep .el-card{
      border: none;
}
::v-deep .el-card__body{
  padding:10px;
}
::v-deep .labelClass,::v-deep .contentClass{
    font-size: 14px !important;
}
 .contentWrap{
  margin-top:20px;
 }
 .topData,.tabWrap {
   display: flex;
   align-content: center;
   align-items: center;
   height: inherit;
   .tabItem{
    margin-right: 40px;
    width: 100px;
    color:#000;
    font-size: 16px;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border-radius: 5px;
    height: 35px;
    line-height: 35px;
   }
   .active{
    background: rgb(53, 109, 238);
    color:#fff;
   }
 .bgc{
       flex:1;
       display: flex;
       //background-color: #202230;
       box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);

       height: inherit;
       border-radius: 8px;
      //  cursor: pointer;
       margin:10px 5px;
       align-items: center;
       justify-content: space-around;
       padding:10px 0;
       &:first-child{
           margin-left:0;
       }
       &:last-child{
           margin-right:0;
       }
   }
   .leftText {
     display: flex;
     flex-direction: column;
     justify-content: space-around;
     height: inherit;
     span {
       margin:0 10px;
     }
     .topText {
       font-family: Microsoft YaHei;
       font-size: 25px;
       font-weight: 600;
       font-stretch: normal;
       letter-spacing: 0px;
       color: #333333;
     }
     .bottomText {
       height: 19px;
       font-family: Microsoft YaHei;
       font-size: 14px;
       font-weight: normal;
       font-stretch: normal;
       line-height: 19px;
       letter-spacing: 0px;
      //  color: #ffffff;
     }
   }
 }
</style>
