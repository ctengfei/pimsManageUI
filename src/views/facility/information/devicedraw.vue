<template>
  <div class="app-container" v-show='deviceDrawVisible' style="position:relative;">
      <!-- <el-row  :gutter="20" style="padding:10px 0;" type="flex" justify="center">
        <el-col class='gobackBox'>
            <div class="devicePosition">{{descriptions.address}} {{descriptions.name}}</div>
        </el-col>
      </el-row> -->
      <el-button type="text" icon="el-icon-back" style="font-size: 24px;" @click.native="onback()"></el-button>
      <span class="clearfixsTitle">基本信息</span>
      <el-row  :gutter="20" style="padding:20px 0;overflow:hidden;border-bottom:1px solid #313448;border-top:1px solid #313448;" type="flex" justify="center">
        <el-col :span="4" style="display: flex;align-items:center;justify-content: center;">
               <img :src="!descriptions.picture?ImgIcon:NET.BASE_URL+descriptions.picture" style="width: 100%;" >
        </el-col>
        <el-col :span="20">
            <el-descriptions :column="3"  label-class-name="labelClass" content-class-name="contentClass">
                <el-descriptions-item label="设备类型">{{descriptions.belongSubsystem}}</el-descriptions-item>
                <el-descriptions-item label="设备名称">{{descriptions.name}}</el-descriptions-item>
                <el-descriptions-item label="设备编码">{{descriptions.code}}</el-descriptions-item>
                <el-descriptions-item label="设备IP">{{descriptions.ip}}</el-descriptions-item>
                <el-descriptions-item label="规格型号">{{descriptions.model}}</el-descriptions-item>
                <el-descriptions-item label="归属园区">{{descriptions.areaStr}}</el-descriptions-item>
                <el-descriptions-item label="所在区域" v-if="descriptions.type === 'camera' || descriptions.type === 'ammeter'" >{{descriptions.regionStr}}</el-descriptions-item>
                <el-descriptions-item label="安装位置">{{descriptions.address}}</el-descriptions-item>
                <el-descriptions-item label="经纬度">{{descriptions.latitude}},{{ descriptions.longitude }}</el-descriptions-item>
                <el-descriptions-item label="附近摄像头">
                    <div v-if="descriptions.monitorDevices.length">   
                        <span v-for="(item,index) in descriptions.monitorDevices" :key="index">
                            {{item.name}},
                        </span>
                    </div>
                </el-descriptions-item>
                <el-descriptions-item label="设备描述">{{descriptions.description}}</el-descriptions-item>
                <el-descriptions-item label="管理责任人">{{descriptions.head}}</el-descriptions-item>
                <el-descriptions-item label="设备状态">{{descriptions.status ? '在线' : '离线'}}</el-descriptions-item>
                <el-descriptions-item label="设备标签" v-if="descriptions.type === 'camera'">{{descriptions.tagStr}}</el-descriptions-item>
            </el-descriptions>
        </el-col>
      </el-row>
      <span class="clearfixsTitle">设备厂商信息</span>
        <el-descriptions :column="2"  label-class-name="labelClass" content-class-name="contentClass">
            <el-descriptions-item label="设备厂商">{{ descriptions.deviceManufacturer ? descriptions.deviceManufacturer.name : '' }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ descriptions.deviceManufacturer ? descriptions.deviceManufacturer.contacter : '' }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ descriptions.deviceManufacturer ? descriptions.deviceManufacturer.phone : '' }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ descriptions.deviceManufacturer ? descriptions.deviceManufacturer.address : '' }}</el-descriptions-item>
        </el-descriptions>
        <span class="clearfixsTitle">维保单位信息</span>
        <el-descriptions :column="2"  label-class-name="labelClass" content-class-name="contentClass">
            <el-descriptions-item label="维保单位">{{ descriptions.deviceMaintenance ? descriptions.deviceMaintenance.maintenanceCompany : '' }}</el-descriptions-item>
            <el-descriptions-item label="责任人">{{  descriptions.deviceMaintenance ? descriptions.deviceMaintenance.maintenanceContacter : '' }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{  descriptions.deviceMaintenance ? descriptions.deviceMaintenance.phone : ''}}</el-descriptions-item>
            <el-descriptions-item label="地址">{{  descriptions.deviceMaintenance ? descriptions.deviceMaintenance.address : '' }}</el-descriptions-item>
        </el-descriptions>
      <el-row>
          <el-col>
              <TableTab :rowDataId="$route.params.deviceId"></TableTab>
          </el-col>
      </el-row>
      <div v-show="crameShow" class="crameShowMask">
          <div class="close">
              <svg-icon icon-class="icon-guanbi" style="height: 30px;width: 16px;"  @click="onclose"/>
              <div class="icon-name"></div>
          </div>
          <div class="vedioShow">
            <div id="vedioShow"></div>
          </div>
      </div>
  </div>
</template>

<script>
import ComDescriptions from "@/components/comDescription/comdescription"
import {initData,unmounted} from '@/api/facility/information'
import ComDescriptionsItem from "@/components/comDescription/comdescriptionItem"
import ImgIcon from "@/assets/images/audio_chat.png"
import TableTab from "./tableTab"
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
import { getCarInformation } from '@/api/monitor/timemonitor'
import { getIvsPlayer } from '@/api/system/organization'
import { mapGetters, mapState } from 'vuex'
export default {
    name:"DeviceDraw",
    components:{ComDescriptions,ComDescriptionsItem,TableTab},
    computed:{
        ...mapGetters(['sidebar', 'device', 'user', 'baseApi','plateInfo']),
    },
    data(){
        return {
            imgUrl:process.env.VUE_APP_BASE_API,
            crameShow:false,
            ImgIcon,
            deviceDrawVisible: true,
            // 陈列的信息数据
            descriptions: {
                deviceCode: '',
                deviceName: '',
                devicePosition: '',
                sysChild: '',
                deviceChild: '',
                manufacturer: '',
                model: '',
                deviceLevel: '',
                deviceType:'',
                deviceArea:[
                    {value:"区域一",label:"区域一"},
                    {value:"区域二",label:"区域二"},
                    {value:"区域三",label:"区域三"},
                    {value:"区域四",label:"区域四"}
                ],
                liable:'',
                deviceImg:'',
                
            },
            // 校验
            rules: {
                deviceName: [
                { required: true, message: '请输入设备编号', trigger: 'blur' }
                ],
            },
            rtspUrl:'',
            widowWidth: window.screen.width,
            widowHeight: window.screen.width,
            vedioTop:'',
            vedioLeft:'',
            vedioWidth:'',
            vedioHeight:'',
            deviceZoom:'',
            toPath:'',
        }
    },
    beforeRouteEnter(to,from,next){
        next(vm=>{
            vm.toPath = from.path
        })
    },
    created(){
        let params={
          id:this.$route.params.deviceId
        }
        initData('/pm/device','GET',params).then(res=>{
            this.descriptions=res.data
        })
    },
    mounted(){
        // setTimeout(function(){
        // let str1 = `{"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
        // _this.$store.state.socket.Csock.send(str1)
        // },500)
    },
      //离开页面时一定要销毁不然会出问题
    beforeDestroy(){
        // this.onclose()
    },
    methods:{
        onback(){
            console.log("22222",this.toPath)
           this.$router.push(`${this.toPath}`)
        //    this.deviceDrawVisible = false
        },
        oncamera(item){
            let _this = this
            _this.crameShow=true
            let data = {
                "cameraCode": item.code,
                "mediaURLParam": {
                    "broadCastType": 0,
                    "packProtocolType": 1,
                    "protocolType": 2,
                    "serviceType": 1,
                    "streamType": 2,
                    "transMode": 0
                }
            }
            getIvsPlayer('/sm/ivs/player/play','POST',data).then(res => {
                _this.rtspUrl = res.data.rtspURL
                if(res.data.description == "成功"){
                }else{
                    this.$message.info(res.data.description)
                }
            })
            // .catch(err => {
            //     this.$message.error(err)
            // })
        },
        onclose(){
            this.crameShow=false
            
        }
    }
}
</script>

<style scoped>
.vedioShow{
    margin:0 auto;
    width: 750px;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    
}
#vedioShow{
    width: 750px;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
}
::v-deep.descriptions-item .descriptions-item-content .descriptions-item-value{
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.carBorder{
     padding:10px 0;
}
.carBorder .el-form-item__content {
    width:85%;
}
.carBorder .el-form-item--small.el-form-item{
   width:48%;
}
.deviceImg{
    width:200px;
    margin-top: 10%;
    /* height:273px; */
}
.deviceImg img{
    display: block;
    height:100%;
    width:100%;
}
.devicePosition{
    display:inline-block;
    margin:0 auto;
	height: 21px;
	font-family: Microsoft YaHei;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 21px;
	letter-spacing: 0px;
}
.deviceStatus{
    display:inline-block;
    height:27px;
    line-height:27px;
    border-radius:5px;
    text-align:center;
    font-size:12px;
}
.crameShowMask{
    position:fixed;
    left:0;
    top:0;
    background:rgba(0,0,0,.9);
    width:100vw;
    height:100vh;
    z-index:9999;
}
.close{
    position: fixed;
    right: 31px;
    top: 16px;
}
.colorStress{
    color:#00e984;
}
.gobackBox{
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.gobackCls{
    display: flex;
    flex-direction: row;
    
    justify-self: flex-end;
    cursor: pointer;
}
.gobackCls div{
  margin-left:10px;
  font-size: 12px;
  align-self: center;
}
.clearfixsTitle {
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    margin: 10px;
  }
</style>