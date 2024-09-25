<!-- 夜景照明 -->
<template>
    <div class="app-container-bow">
        <div class="video-web-left-box">
            <HighlightSquare class="highlight-height-main padding-20">
                <template v-slot:child>
                    <div class="video-web-left-tree-outer">
                        <!--左侧树-->
                        <!-- 多维树组件 -->
                        <OrgizeTree
                        :districtList="dominList"
                        :isCheck="isCheck"
                        :dominShow="dominShow"
                        :permissionData="permission"
                        @handleNodeDblclick="handleNodeDblclick"
                        @DragEnd="DragEnd"
                        :draggable="draggable"
                        :nodeType='nodeType'
                          @treeId="treeId"
                        @getTableData="getTableData" />
                    </div>
                </template>
            </HighlightSquare>

        </div>
        <div class="video-web-right-box-top">
                <comCard class="card-wrap" :spanList='spanList' @routerClick="routerClick($event)"></comCard>
        </div>
        <div class="video-web-right-box-bottom">
            <!-- 搜索 -->
            <el-form
              :inline="true"
              ref="serForm"
              :model="form"
              class="demo-form-inline forms"
            >
               <el-form-item prop="name">
                    <el-input
                        v-model="form.name"
                        placeholder="请输入设备名称"
                        style="width: 200px"
                        clearable
                        @keyup.native.enter="search"
                    ></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button
                        icon="el-icon-search"
                        @click="search()"
                        type="primary"
                        >搜索</el-button
                    >
                    <el-button
                        icon="el-icon-refresh-left"
                        @click="reset()"
                        plain
                        >重置</el-button
                    >
                </el-form-item>
                <el-form-item style="float: right;margin-right:0px;">
                    <el-button
                        @click="openDialog"
                        type="primary"
                        >开灯</el-button
                    >
                    <el-button
                        @click="closeDia"
                        plain
                        >关灯</el-button
                    >
                    <el-button
                        type="primary"
                        icon="el-icon-refresh"
                        @click="refreshs"
                        ></el-button
                    >
                </el-form-item>
            </el-form>
            <!-- end -->
            <!-- 表格 -->
            <div class="box-card table-padding">
                <div class="photoBox" v-if="tableData.length">
                    <el-table :data="tableData" height="588px" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"/>
                        <el-table-column label="序号" width="80" type="index"></el-table-column>
                        <el-table-column prop="deviceCode" label="设备编号" showOverflowTooltip></el-table-column>
                        <el-table-column prop="area" label="控制区域" showOverflowTooltip />
                        <el-table-column prop="deviceName" label="设备名称" showOverflowTooltip></el-table-column>
                        <el-table-column label="回路反馈" prop="onlineStatus" showOverflowTooltip>
                            <template slot-scope="scope">
                                <div :class="scope.row.onlineStatus === 'true' ? 'greens' : 'reds'"></div>

                            </template>
                        </el-table-column>
                        <el-table-column prop="switchStatus" label="设备操作" showOverflowTooltip>
                            <template slot-scope="scope">
                                <div class="lightSet">
                                    <el-switch
                                        v-model="scope.row.switchStatus"
                                        active-text="关闭"
                                        inactive-text="开启"
                                        active-value="1"
                                        inactive-value="0"
                                        @change="switchLoop(scope.row)">
                                    </el-switch>
                                    <!-- <img @click="lighting = true" :src="require(`@/assets/images/smartBuild/zm5.png`)" /> -->
                                </div>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
                <div v-else style="text-align:center">
                    <div class="el-table__empty-text"  style="margin:0 auto;color:white;font-size:20px;">暂无数据</div>
                </div>

                <!--分页 -->
                <div class="content-bottom" v-if="tableData.length>0 && tableData">
                    <pagination
                        @pagination="handleCurrentChange"
                        :page.sync="form.pageNum"
                        :pageSizes="[10, 20, 30, 40]"
                        :limit.sync="form.pageSize"
                        :total="total"
                    />
                </div>
                <!-- end -->
            </div>
        </div>

    </div>
</template>
<script>
import HighlightSquare from "@/components/HighlightSquare";
import sysTree from "@/components/sysTree";
import pagination from '@/components/comPagination'
import OrgizeTree from '@/components/orgnizeTree'
import { treeData, getDeviceInfoById, getIvsPlayer, getDeviceCriteria } from '@/api/system/organization'
import comCard from "@/components/comCard"
import { getObjByKey,getStringByKey } from "@/utils/voice.js";
import $smartBuild from "@/api/smartBuild"
import {
  getDeviceTree
} from '@/api/monitor/splitscreen'
export default {
    components: { sysTree, HighlightSquare, pagination, OrgizeTree, comCard  },
    data() {
        return {
            lighting:false,
            lightingValue:1,
            styleValue:1,
            ruleForm: {
                pass: '',
                checkPass: '',
                age: '',
                switch:true
            },
            permission: {
                deviceTree: 'monitor::splitscreen::deviceTree',
                treeCheck: 'tree::check',
                collectDevice: 'collectTag::device',
                collectDelete: 'collectTag::delete',
                collectCheck: 'collecttag::check',
                searchstatus: 'smartBuild::nightlighting::searchstatus',
                smartBuildControl: 'smartBuild::nightlighting::control',
                statistics: 'smartBuild::nightlighting::statistics'
            },
            dominList:[],
            draggable: true,
            districtList: [],
            tagNode: {},
            isCheck: '',
            nodeType:'nightlighting',
            isShow: true,
            dominShow:true,
            total :0,
            form: {
                value: "",
                pageNum:1,
                pageSize:10,
                type:"nightlighting",
                nodeId:"",
                name:"",
                code:""
            },
            tableData: [],
            selectedIds: [],
            spanList: [
                {
                    type: "total",
                    num: null,
                    name: "设备总数",
                    path: require(`@/assets/images/smartBuild/zm1.png`),
                },
                {
                    type: "off-line",
                    num: null,
                    name: "设备开启",
                    path: require(`@/assets/images/smartBuild/zm2.png`),
                },
                {
                    type: "off-line",
                    num: null,
                    name: "设备关闭",
                    path: require(`@/assets/images/smartBuild/zm3.png`),
                },
                {
                    type: "normal",
                    num: null,
                    name: "设备离线",
                    path: require(`@/assets/images/smartBuild/zm4.png`),
                }
            ],
            multipleSelection: []
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initPageIntell();
        });
    },
    computed:{

    },
    created(){
        // this.permissionData= this.this.permission
        this.getStatistics()
    },
    mounted(){
        this.treeId();
    },
    methods: {
          treeId(data) {
      this.form.nodeId = data;
      this.getNightlighTable();
    },
        /**
         * @name: 初始化函数--暖通空调
         * @Author: sscaij
         * @msg:
         * @param {*}
         * @return {*}
         */
        // 获取设备统计
        getStatistics(){
            let obj =  getObjByKey(this.permission.statistics)
            $smartBuild.getStatistics(obj).then(res=>{
                if(res.meta.status === 200){
                    this.spanList[0].num=res.data.deviceNum
                    this.spanList[1].num=res.data.deviceNormalNum
                    this.spanList[2].num=res.data.deviceFaultNum
                    this.spanList[3].num=res.data.deviceOffLineNum
                }
            })
        },
        initPageIntell() {},
        // card事件 routerClick
        routerClick(item){
            console.log(item)
        },
        // 获取夜景照明列表
        getNightlighTable(){
            let obj =  getObjByKey(this.permission.searchstatus)
            $smartBuild.getCriteria(obj,this.form).then(res=>{
                if(res.meta.status === 200){
                    this.tableData = res.data.data
                    this.total = res.data.total
                }else{
                    this.$message.error(res.meta.message)
                }
            })
        },
        //  获取设备信息
        getDeviceData(data) {
            this.form.nodeId = data.id
            if (!data.children) {
                if(!data.code){
                    if (this.isType === 'click'){
                        this.getNightlighTable()
                    }else if (this.isType === 'dbClick'){
                        this.getNightlighTable()
                    }
                    return
                }
                this.getNightlighTable()
            }
        },
        // 左侧设备树双击
        handleNodeDblclick(data) {
            this.isType = 'dbClick'
            this.form.nodeId = data.id
            this.getNightlighTable()
        },
        // 左侧设备树拖拽
        DragEnd(node, prenode, pis, evt) {
            this.clientX = evt.clientX
            this.clientY = evt.clientY
            this.isType = 'drag'
            for (let i = 0; i < this.distance.length; i++) {
                if (
                this.clientX > this.distance[i].toLeft &&
                this.clientX < this.distance[i].toRight &&
                (this.clientY + this.scrollTop > this.distance[i].toTop &&
                    this.clientY + this.scrollTop < this.distance[i].toBottom)
                ) {
                // 调用接口获取视频流
                this.dragIndex = i
                this.getDeviceData(node.data)
                }
            }
        },
        // 获取树组件数据
        // async getTreeData() {
        //     debugger
        //     if(this.domainCode != ""){
        //         let url = this.$store.getters.btnpremissAll[this.permission.deviceTree].url
        //         let method = this.$store.getters.btnpremissAll[this.permission.deviceTree].method
        //         getDeviceTree(url,method,this.domainCode)
        //         .then(res => {
        //             this.dominList = res.data
        //         })
        //         .catch(err => {
        //             this.$message.error(err)
        //         })
        //     }else{
        //         let url = this.$store.getters.btnpremissAll[this.permissionData.treeCheck].url
        //         let method = this.$store.getters.btnpremissAll[this.permissionData.treeCheck].method
        //         const res = await treeData(url, method, [])
        //         if (res.meta.status === 200) {
        //             this.districtList = res.data
        //             this.dominList = res.data
        //         } else {
        //             this.$message.error('获取区域数据失败')
        //         }
        //     }
        // },
        getTableData(data, activeName) {
            this.tagNode = data
            this.isType = 'click'
          this.form.nodeId =  data.id;
          this.getNightlighTable()
//            if ('type' in data === false) {
//                let obj = {...data, type: 'IPC', code: data.deviceId}
//                console.log(obj,"getTableData ")
//
//                this.getDeviceData(obj)
//            }
//            this.getDeviceData(data)
        },
        handleCurrentChange(){
            this.getNightlighTable()
        },
        // 回路控制方法
        getLoopControl(data){
            let obj =  getObjByKey(this.permission.smartBuildControl);
            $smartBuild.getLoopControl(obj,data).then(res=>{
                console.log(res.data)
                if(res.meta.status === 200){
                    this.getNightlighTable()
                }else{
                    this.$message.error(res.meta.message)
                }
            })
        },
        // 全选 handleSelectionChange
        handleSelectionChange(data){
            this.multipleSelection = data;
        },
        // 开启
        openDialog(){
            let obj = this.multipleSelection.filter(res=>!res.onlineStatus)
            let arrObj = obj.map(item=>{
                return {deviceCode:item.deviceCode,type:1}
            })
            console.log(arrObj)
            this.getLoopControl(arrObj)
        },
        // 关闭
        closeDia(){
            let obj = this.multipleSelection.filter(res=>res.onlineStatus)
            console.log(obj)
            let arrObj = obj.map(item=>{
                return {deviceCode:item.deviceCode,type:0}
            })
            console.log(arrObj)
            this.getLoopControl(arrObj)
        },
        // table  开关
        switchLoop(data){
            console.log(data.switchStatus,"switchLoop")
            var obj = {}
            if(data.switchStatus==1){
                obj = { deviceCode:data.deviceCode,type:1}
            }else{
                obj = { deviceCode:data.deviceCode,type:0}
            }
            this.getLoopControl([obj])
        },
        // 搜索
        search(){
            // this.form.name = this.form.value
            this.getNightlighTable()
        },
        // 重置
        reset(){
            this.$refs['serForm'].resetFields();
            this.getNightlighTable()
        },
        // 刷新
        refreshs(){
            window.location.reload()
        }
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-switch__label {
  position: absolute;
  display: none;
  font-size: 14px !important;
  color: #fff!important;
}
::v-deep .el-switch__label *{
  font-size: 14px !important;
}
/*打开时文字位置设置*/
::v-deep .el-switch__label--right {
  z-index: 1;
  left: 0px; // 这里是重点
  top: 0.5px;
}
/*关闭时文字位置设置*/
::v-deep .el-switch__label--left {
  z-index: 1;
  right: 0px; // 这里是重点
  top: 0.5px;
}
/*显示文字*/
::v-deep .el-switch__label.is-active {
  display: block;
}

::v-deep .el-switch .el-switch__core{
    border-color: #206aff !important;
    background-color: #206aff !important;
}
::v-deep .el-switch__core {
  width: 60px !important;
  height: 22px;
  border: 2px solid #DCDFE6;
  border-radius: 13px;
}
// ::v-deep .el-switch {
//   width: 50%;
// }
::v-deep .el-form-item--small .el-form-item__label{
    line-height:30px !important;
}
::v-deep  .el-form-item--small .el-form-item__content{
    line-height:30px !important;
}
.margin0{
    margin-bottom:5px;
    text-align:center
}
.bgCond{
    display: inline-block;
    width:70px;
    height:27px;
    border-radius: 5px;
    background: #313448;
    cursor: pointer;
}
.bgSucc{
    background: #00e984;
    color:#000
}
.el-form-item
.app-container {
    background-color: transparent;
}
.top-card {
    width: 100%;
    display: flex;
    align-items: center;
    margin-left: 0px !important;
    justify-content: space-between;
    .total {
        border-radius: 5px;
        background-color: #202230;
        margin-right: 6%;
        height: 100px;
    }
    .off-line {
        border-radius: 5px;
        background-color: #202230;
        margin-right: 6%;
        height: 100px;
    }
    .normal {
        border-radius: 5px;
        background-color: #202230;
        margin-right: 6%;
        height: 100px;
    }
    .exception {
        border-radius: 5px;
        background-color: #202230;
        margin-right: 0%;
        height: 100px;
    }
}
.table-padding{
    padding:0px 20px 0px 20px;
}
.photoBox {
  width: 100%;
  height: calc(100vh - 350px);
  display: flex;
  overflow: auto;
  flex-direction: column;
}
.content-Text {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    float: left;
}
.rightSpan {
    float: right;
    margin-top: 16px;
    width: 40%;
    height: 75px;
    color: rgba(0, 0, 0, 0.16);
    opacity: 0.8;
}


.groups{
    display: flex;
    justify-content: space-around;
    height:350px;
    padding:10px;
    width: 100%;
    background-color: #272937;
	border-radius: 8px;
    margin-bottom:15px;
    &:last-child{
        margin-bottom:0
    }
    .imgTitle{
        display:flex;
        flex-direction: column;
        align-items: center;
        width: 70%;
        border-right: solid 1px#363845;
        .gifs{
            display:flex;
            width:100%;
            height:auto;
            img{
                width:80%;
                margin: 0 auto;
            }
        }
    }
    .infomation{
         width: 30%;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;

    }
}
.greens{
    width: 20px;
	height: 20px;
    border-radius: 50%;
    background: #00e984;
}
.reds{
    width: 20px;
	height: 20px;
    border-radius: 50%;
    background: #ff403d;
}
  .forms{
      padding:20px 20px 0 20px
  }
  .lightSet{
      display:flex;
      align-items: center;
      img{
          width:20px;
          cursor: pointer;
          margin-left: 30px;
      }
  }

  .dialogLig{
      width:100%;
      display:flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding:20px 0;
      .block{
          width: 100%;
          display: flex;
          align-items: center;
          height: 50px;
          .demonstration{
              width:30px;
              margin-right:20px;
          }
          .sliders{
              width:79%;
          }

      }
      img{
          width:30%;
      }
  }


</style>
