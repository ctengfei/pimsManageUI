<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <gis-map ref="gisMap" @mapReady="mapReady" @deviceInfo="deviceInfo"></gis-map>
      <!-- 联动列表 -->
      <div class="leftBox padding-10">
        <audio id="audio" src="@/assets/audio/alarm.mp3" />
        <div class="addBox">
          <div style="margin:0 5px;width:100%">
            <el-row :gutter="10">
              <el-form
                :inline="true"
                ref="alarmForm"
                :model="formSeach"
                style="width:100%"
              >
                <el-col :span="24">
                  <el-form-item prop="title">
                    <el-input
                      v-model="formSeach.title"
                      placeholder="请输入告警编号和事件名称"
                      style="width:355px"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="carType">
                    <el-select v-model="formSeach.carType" clearable placeholder="请选择告警时间">
                        <el-option
                        v-for="item in carTypes"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="level">
                    <el-select v-model="formSeach.level" clearable placeholder="请选择告警级别">
                        <el-option
                        v-for="item in alarmLevel"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="businessCode">
                    <el-select v-model="formSeach.businessCode" clearable placeholder="请选择业务类型">
                      <el-option
                        v-for="item in businessArr"
                        :key="item.businessCode"
                        :label="item.businessType"
                        :value="item.businessCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="status">
                    <el-select v-model="formSeach.status" clearable placeholder="请选择告警状态">
                        <el-option
                        v-for="item in alarmStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item>
                    <el-button
                      icon="el-icon-search"
                      type="primary"
                      @click="alarmSearch()"
                      >搜索
                    </el-button>
                    <el-button
                      icon="el-icon-refresh-left"
                      @click="carReset()"
                      >重置
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </div>
          <div class="listBox" v-if="roundList && roundList.length > 0">
            <div class="listWrap" >
              <div  class="listArr" v-for="(item,index) in roundList" :key="index">
                <div class="listTop"  @click="nowVidoe(item)">
                  <div class="listLeft">
                    <div>[{{item.businessName}}]{{item.eventName}}</div>
                    <div>{{item.deviceName}}</div>
                    <div>{{item.triggerTime}}</div>
                  </div>
                  <div class="listRight">
                    <div>待处理</div>
                    <div :class='["cricle", item.alarmLevel == "normal" ? "handCircle" : item.alarmLevel == "emergency" ? "redCircle" : "doneCircle"]'>
                        {{item.alarmLevel == 'normal' ? '普通' : item.alarmLevel == 'emergency' ? '紧急' : '非常紧急'}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else>
            <div class="el-table__empty-block" style="height: 50vh; width: 340px;"><span class="el-table__empty-text">暂无数据</span></div>
          </div>
          <div class="pageStyle" v-if="roundList && roundList.length > 0">
            <pagination 
              :small="false"
              @pagination="handleCurrentChange"
              :page.sync="formSeach.pageNum"
              :pageSizes="[10, 20, 30, 40]"
              :layout="'prev, pager, next'"
              :limit.sync="formSeach.pageSize"
              :total="total"
              :pagerCount="5"
            />
          </div>
          
        </div>
      </div>
      <!-- <div  class="manual padding-10" @click="manualClick">
        手动
      </div> -->
      <!-- 告警详情 -->
      <div class="rightBox padding-10" v-if="roundPatrolShow">
        <div style="line-height:36px;">告警详情</div>
        <div style="margin-top: 15px;">
          <el-form :model="roundPatrol" ref="roundPatalForm" label-width="80px" label-position="left">
            <el-form-item label="业务分类">
              <el-input v-model="roundPatrol.businessName" disabled></el-input>
            </el-form-item>
            <el-form-item label="告警位置">
              <el-input v-model="roundPatrol.location" disabled></el-input>
            </el-form-item>
            <el-form-item label="告警时间">
              <el-input v-model="roundPatrol.triggerTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="告警级别">
              <el-input :value="roundPatrol.alarmLevel == 'normal' ? '普通' : roundPatrol.alarmLevel == 'emergency' ? '紧急' : '非常紧急'" disabled></el-input>
            </el-form-item>
            <el-form-item label="事件名称">
              <el-input v-model="roundPatrol.eventName" disabled></el-input>
            </el-form-item>
            <el-form-item label="告警描述">
              <el-input v-model="roundPatrol.content" disabled></el-input>
            </el-form-item>
            <div class="tableBoxTitle">
              <span>告警处理</span>
            </div>
            <el-form-item label="处理描述" prop="remark" :rules="[{required: true, message: '请输入内容', trigger: 'blur'}]">
              <el-input type="textarea" v-model="roundPatrol.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="submitButton">
          <el-button type="primary" @click="roundPatrolCancel"
          >任务下发</el-button
          >
          <el-button plain @click="roundPatrolSubmit"
          >关闭告警</el-button
          >
        </div>
      </div>
      <!-- 手动告警 -->
      <div class="rightBox padding-10" v-if="alarmShow">
        <div style="line-height:36px;">手动告警</div>
        <div  style="margin-top: 15px;">
          <el-form :model="cameraForm" :rules="cameraFormRules" ref="cameraForm" label-width="80px" label-position="left">
            <el-form-item label="告警分类" prop="businessType">
              <el-input v-model="cameraForm.businessType" disabled></el-input>
            </el-form-item>
            <el-form-item label="事件名称" prop="eventCode">
              <el-select v-model="cameraForm.eventCode" @change="handleSelectEvent" placeholder="请选择事件名称">
                <el-option
                  v-for="item in eventNameArr"
                  :key="item.eventCode"
                  :label="item.eventName"
                  :value="item.eventCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="告警描述">
              <el-input type="textarea" v-model="cameraForm.content"></el-input>
            </el-form-item>
            <el-form-item label="上传图片" >
              <el-upload
                :class="{hide:hideUpload}"
                :action="fileUrl"
                list-type="picture-card"
                :limit="limitCount"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
                :on-change="changeImg"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="上传视频" >
              <el-upload
                ref="uploadvideo"
                :action="pictureVideo"
                drag
                :file-list="fileListVideo"
                :on-remove="onRemoveVideo"
                :on-success="onSuccessVideo"
                :on-exceed="handleExceedVideo"
                :on-change="onChangeVideo"
                :limit="1"
              >
                <video v-if="showVideoPath !=''"
                      :src="showVideoPath"
                      class="video-avatar"
                      controls="controls">
                  您的浏览器不支持视频播放
                </video>
                <i slot="default" class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">
                  {{videoMessage}}
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="submitButton">
          <el-button type="primary" @click="onCancel">取消</el-button>
          <el-button plain @click="onSubmit1()">确认</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    
  </div>
</template>

<script>
  import gisMap from '@/components/common/map/gis-map';
  //import gisMaplong from '@/components/common/map/gis-maplong';
  import pagination from "@/components/comPagination";
  import roundApi from "@/api/roundPatrol";
  import UpLoadPhoto from '@/components/upLoadPhoto/upLoadPhoto.vue'
  import Moment from 'moment'
  import alarmMp3 from '@/assets/audio/alarm.mp3'
  import {getTableData, getAlarmId, alarmAssign, alarmClose, manualAralm} from '@/api/alarmCenter/warningRealtime'
  import {getConfigType} from '@/api/alarmCenter/warningeventConfig'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";

  var GisMapObj = null,
    viewer = null,
    that = null;
  export default {
    name:'WarningRealtime',
    components: {
    pagination,
    gisMap,
    UpLoadPhoto,
    //GisMaplong
},
    data() {
      return {
        pictureVideo: process.env.VUE_APP_BASE_API + '/file/pm/fastdfs/upload/file',
        businessArr: [], //业务分类
        alarmLevel:[
          {value:"remind",label:"提示"},
          {value: 'NORMAL', label: '普通'},
          {value:'EMERGENCY',label:'紧急'},
          {value:'VERY_EMERGENCY',label:'非常紧急'}
        ],
        alarmStatus:[
          {label:"待处理",value:"UNPROCESSED"},
          {label:"已关闭",value:"CLOSED"},
          {label:"已下发任务",value:"ISSUED"},
        ],
        hideUpload:false,
        hideUploadVedio:false,
        limitCount:3,
        limitCountVedio:1,
        dialogImageUrl: '',
        dialogVisible: false,
        formSeach: {
          status:'',
          businessCode: "securityAlert",
          level:"",
          pageNum: 1, // 分页
          pageSize: 10,
          startTime:'',
          endTime:''
        },
        total: 0, // 总数量
        cameraShow: false, // 摄像机展示
        cameraForm: {
          businessType:"",
          content: "",
          deviceId: "",
          eventCode: "",
          alermImg: [],
          from:"MANUAL_ALARM",
          mediaMeta:{
            pictures: [
              {
                name: "",
                path: ""
              }
            ],
            videos: [
              {
                name: "",
                path: ""
              }
            ]
          },
          triggerTime: Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        },
        cameraFormRules: {
          businessType: [{ required: true, message: '请选择告警类型', trigger: ['blur','change'] }],
          content: [{ required: true, message: '请输入事件描述', trigger: 'blur' }],
          eventCode: [{ required: true, message: '请选择事件名称', trigger: ['blur','change'] }],
          alermImg: [
            { type: 'array', required: true, message: '请上传图片', trigger: ['blur','change'] }
          ],
        },
        videoShow: false, // 实时监控展示
        player: {}, // 监控的流路径
        preIcon: "",
        clickIcon: "",
        isClickShow: false,
        markers: [],
        //tab1: require("../../../../assets/images/tab1.png"),
        sendShow: false,
        fromData:[],
        defaultfromData: [],
        defaultdata: [],
        toData: [],
        title:"添加人员",
        sendWork: {
          //        选择人员名单
        },
        num:1,
        carmeaShow:false,
        personCharge:[],
        roundList:[],
        carmeaShowDuration:'',
        addFormType:"add",
        roundListId:"",
        alarmShow:false,
        roundPatrolShow:false,
        
        fileList: [],
        roundPatrol:{
          handler:"",
          planName:"",
          actualClockTimesL:"",
          planClockTimes:"",
          remark:"",
          lackClockTimes:""
        },
        alarmWorkOrder:{},
        fileUrl:process.env.VUE_APP_BASE_API + "/file/pm/fastdfs/upload/picture",
        // 告警类型
        configBusin:[{label:"轮巡告警",value:"roundRobinAlert"}],
        // 告警名称
        configName:[],
        rtspUrl:"",
        resetTime:"",
        interval:null, // 定时器
        tempIndex:true,
        eventNameArr:[],
        fileListVideo: [],
        showVideoPath: "",
        videoMessage:"请选择视频文件",
        socket:null,
        test:""
      };
    },
    watch: {
      roundList:{
        handler(){
          setTimeout(()=>{
            this.$refs.gisMap.clearLayer()
            this.$refs.gisMap.handlerDeviceInfo(this.roundList,'warn')
          },100)
        },
        immediate:true,
        deep:true
      },
      '$store.state.socket.sockAlarmMsg'(newVal,oldVal){
        this.getTableData()
        this.$nextTick(()=>{
          this.$refs.gisMap.handlerDeviceInfo([newVal],'warn')
          this.$refs.gisMap.getDevice()
          this.aplayAudio()
        })
      }
    },
    created() {
      // this.getCarGroup();
      // this.infoData();
      // this.getConfigBusin()
      this.getRoundAlarmEvent()
    },
    mounted() {
      this.initmap();
      this.getConfigBusiness()
      this.getTableData()
    },
    computed:{
      // roundList() {
      //   return this.$store.state.socket.sockAlarmMsg
      // },
    },
    methods: {
      // 获取一周的时间
      doHandleMonth(month){
        var m = month;
        if(month.toString().length == 1){
          m = "0" + month;
        }
        return m;
      },
      getDay(day){
        var today = new Date();
        var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear+"-"+tMonth+"-"+tDate;
      },
      // 语音播放
      aplayAudio () {
        const audio = document.getElementById('audio')
        audio.play()
      },
      // 获取业务分类
      getConfigBusiness(){
        //let obj = getObjByKey(this.permission.searchConfigType);
        getConfigType('/pm/alarm/config/business', 'get').then(res => {
          if (res.code === 200) {
            this.businessArr = res.data;
          }
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      // 根据业务分类或者告警级别搜索
      alarmSearch() {
        this.getTableData()
      },
      // 根据业务类型编码查询事件名称及事件编码
      getConfigEvent(code){
        roundApi.getConfigEvent(code).then(res=>{
          if(res.code === 200){
            this.eventNameArr = res.data.eventNames
          }else{
            this.$message.info(res.meta.message)
          }
        }).catch(err=>{
          this.$message.error(err)
        })
      },
      // 业务分类
      handleSelectBusiness(e){
        this.getConfigEvent(e)
      },
      // 事件名称
      handleSelectEvent(e){
        if(!this.addData.businessType){
          this.$message.error("请先选择业务分类")
        }else{
          this.addData.eventCode = e
        }
        
      },
      // 点击设备手动告警
      deviceInfo(carmeaInfo){
        console.log(carmeaInfo,"carmeaInfocarmeaInfocarmeaInfo")
        
        this.cameraForm.deviceId = carmeaInfo.deviceId
        if(!carmeaInfo.alarmLevel){
          this.roundPatrolShow = false
          // 手动告警
          this.alarmShow = true
          let temp = this.businessArr.filter(item=>item.deviceType == carmeaInfo.deviceType)
          this.cameraForm.businessType = temp[0].businessType
          this.getConfigEvent(temp[0].businessCode)
        }else{
          this.roundPatrolShow = true
          // 手动告警
          this.alarmShow = false
          this.roundPatrol = carmeaInfo
        }
      },
      // 获取列表内容
      getTableData(){
        this.formSeach.startTime = this.getDay(-6)
        this.formSeach.endTime = this.getDay(0)
        getTableData(this.formSeach).then(res=>{
          if(res.code === 200){
            this.roundList = res.data.data
            this.total = res.data.total
            this.formSeach.pageSize = res.data.pageSize
            this.formSeach.pageNum = res.data.pageNum
          }else{
            this.$message.info(res.meta.message)
          }
        }).catch(err=>{
          this.$message.error(err)
        })
      },
      // 手动告警
      manualClick(){
        this.roundPatrolShow = false
        // 手动告警
        this.alarmShow = true
      },
      // 告警类型
      getConfigBusin(){
        roundApi.getConfigBusin().then(res=>{
          if(res.code === 200){
            this.configBusin = res.data
          }else{
            this.$message.info(res.meta.message)
          }
        }).catch(err=>{
          this.$message.error(err)
        })
      },
      // 获取告警名称
      getRoundAlarmEvent(){
        roundApi.getRoundAlarmEvent().then(res=>{
          if(res.code === 200){
            this.configName = res.data
          }else{
            this.$message.info(res.meta.message)
          }
        }).catch(err=>{
          this.$message.error(err)
        })
      },
      // 图片上传成功
      handleSuccess(res, file, fileList){
        if(res.code === 200){
          this.cameraForm.alermImg.push(res.data)
        }else{
          this.$message.error(res.meta.message)
        }
      },
      // 图片预览
      handlePictureCardPreview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      changeImg(files, fileList){
        this.hideUpload = fileList.length >= this.limitCount;
      },
      // 图片删除
      handleRemove(file, fileList){
        this.hideUpload = fileList.length >= this.limitCount;
        let obj =  this.cameraForm.alermImg.filter(item=>{
          return item.name !== file.name
        })
        this.cameraForm.alermImg = obj
        // document.querySelector('.el-upload--picture-card').style.display='block'
      },
      // 地图初始化
      initmap() {
      },
      
      // 告警
      vedioAlarm(){
        this.alarmShow = true
        this.roundPatrolShow = false
      },
      // 任务下发
      roundPatrolCancel(){
        this.$refs['roundPatalForm'].validate((valid) => {
          if (valid) {
            alarmAssign({alarmCode:this.roundPatrol.code,content:this.roundPatrol.remark,submit:true}).then(res=>{
              if(res.code === 200){
                this.roundPatrolShow = false
                this.$refs.roundPatalForm.resetFields()
                this.$message.success("告警任务下发成功")
                this.getTableData()
              }else{
                this.$message.info(res.meta.message)
              }
            }).catch(err=>{
              this.$message.error(err.meta.message)
            })
          }
        })
      },
      // 关闭告警
      roundPatrolSubmit(){
         this.$refs['roundPatalForm'].validate((valid) => {
          if (valid) {
            alarmClose({alarmCode:this.roundPatrol.code,closeReason:this.roundPatrol.remark}).then(res=>{
              if(res.code === 200){
                this.roundPatrolShow = false
                this.$refs.roundPatalForm.resetFields()
                this.$message.success("关闭告警成功")
                this.getTableData()
                // 删除gis的告警
                this.$refs.gisMap.clearLayer(this.roundPatrol.deviceType,this.roundPatrol.id)
                this.$refs.gisMap.getDevice()
              }else{
                this.$message.info(res.meta.message)
              }
            }).catch(err=>{
              this.$message.error(err.meta.message)
            })
          }
         })
        
      },
      // gis方法
      mapReady(item){
        console.log(item)
      },
      // 切换到第几页了
      handleCurrentChange() {
        this.$refs.gisMap.allClearLayer()
        this.getTableData();
      },
      // 告警上报取消
      onCancel() {
        this.$refs['cameraForm'].resetFields()
        this.alarmShow = false
      },
      // 告警上报提交
      onSubmit1() {
        this.cameraForm.mediaMeta.pictures = this.cameraForm.alermImg
        this.$refs['cameraForm'].validate((valid) => {
          if (valid) {
            manualAralm(this.cameraForm).then(res=>{
              if(res.code === 200){
                this.alarmShow = false
                this.$refs.cameraForm.resetFields();
                this.$message.success("告警上报成功")
              }
            }).catch(err=>{
              this.$message.error(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      // 视频处理
      onChangeVideo(file, fileListVideo) {
        const isLt10M = file.size / 1024 / 1024 < 25
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.raw.type) === -1) {
          this.$message.error(this.videoMessage);
          fileListVideo.pop();
          return false
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过25MB哦!');
          fileListVideo.pop();
          return false
        }
        this.uploadVideoDisabled = true
        let URL = window.URL || window.webkitURL;
        this.showVideoPath = URL.createObjectURL(file.raw);
      },
      onRemoveVideo() {
        this.uploadVideoDisabled = false;
        this.showVideoPath = "";
      },
      handleExceedVideo() {
        this.$message.error("最多上传一个视频");
      },
      //上传成功
      onSuccessVideo(response, file, fileList) {
        if (response.code === 200) {
          this.cameraForm.mediaMeta.videos.push(response.data)
        }
        //获取上传图片地址赋值给视频的src回显
      },
      // 实时监控
      nowVidoe(item) {
        this.roundPatrolShow = true
        // 手动告警
        this.alarmShow = false
        this.roundPatrol = item
        this.alarmWorkOrder = {
          alarmCode: item.code,
          content: "",
          location: item.location,
          priority: item.alarmLevel,
          submit: true,
          title: ""
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
.hide ::v-deep .el-upload {
  display: none !important;
}
::v-deep .el-upload-dragger{
  width:240px
}


.el-form .el-select {
  width: 100%;
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}

// ::v-deep.el-range-editor--small .el-range-separator {
//   line-height: 34px;
// }

::v-deep svg path:first-child {
  stroke: #31364a;
}

.el-cascader--small {
  width: 100%;
}

.manual{
  position: absolute;
  font-size: 12px;
  top: 32px;
  width: 30px;
  height: 60px;
  z-index: 100;
  padding: 10px;
  left: 22%;
  overflow: hidden;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  background-color: rgba(32,34,48,.9);
}
  .tableBoxTitle{
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    span{
      color:#afb9d0;
      cursor: pointer;
    }
  }
.pageStyle{
  height: 50px;
}
  .app-container-gis {
    position: relative;
    .listBox{
      width: 100%;
      height: 500px;
      overflow: hidden;
    }
    .listWrap{
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
    .listArr{
      width:100%;
      background: #313448;
      box-sizing: border-box;
      padding: 10px;
      border-radius: 5px;
      margin-bottom:10px;
      .listTop{
        display: flex;
        justify-content: space-between;
        .listLeft{
          display: flex;
          flex-direction: column;
          font-size: 14px;
          color: #afb9d0;
          div{

            &:first-child{
              font-size: 16px;
              color: #fff;
            }
          }
          
        }
        .listRight{
          display: flex;
          flex-direction: column;
          text-align: center;
          div{
            &:first-child{
              font-size: 14px;
              color: #fff;
            }
          }
        }
      }
      .listBottom{
        border-top:solid 1px #afb9d0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 34px;
        opacity: 0.41;
        div{
          width:50%;
          text-align: center;
          cursor: pointer;
        }
      }
    }
    .cricle{
      width:58px;
      height: 58px;
      border-radius: 50%;
      border:solid 4px #fff;
      text-align: center;
      line-height: 48px;
      font-size: 12px;
      cursor: pointer;
    }
    .handCircle{
      border:solid 4px #206aff
    }
    .doneCircle{
      border:solid 4px #FF0400
    }
    .redCircle{
      border:solid 4px #ff403d
    }

    .vedioPlay{
      height: 195px;
    }
    .videoBtn{
      display: flex;
      height: 25px;
      align-items: center;
      justify-content: space-between;
      div{
        &:first-child{
          margin-left: 10px;
        }
      }
      span{
        margin: 0 10px;
        cursor: pointer;
      }
    }
    #cesiumContainer {
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0px;
      .mainButton {
        position: absolute;
        left: 350px;
        top: 32px;
        z-index: 100;
      }
      .leftBox {
        position: absolute;
        top: 32px;
        width: 395px;
        height: 92%;
        z-index: 100;
        padding: 10px;
        left: 20px;
        //overflow: hidden;
        //background-color: rgba(32, 34, 48, .9);
        .seachBox {
          width: 100%;
          height: 35px;
          display: flex;
          justify-content: space-between;
          padding: 0 5px;
          margin-bottom: 10px;
          button {
            margin-left: 10px;
          }
        }
        .addBox {
          margin: 5px;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px);
          margin-bottom: 20px;
          background-color: rgba(32, 34, 48, 0.9);
          button {
            color: white;
          }
          .deletebutton {
            color: #f05656;
          }
        }
      }

      .cameraBox {
        position: absolute;
        top: 32px;
        right: 27%;
        width: 20%;
        height: 22%;
        z-index: 100;
        padding: 10px;
        padding-top: 30px;
        background-color: rgba(32, 34, 48, .9);
        i {
          position: absolute;
          top: 10px;
          right: 10px;
          color: white;
          cursor: pointer;
        }
      }
      // 布控详情
      .controlDetails,
      .rightBox {
        position: absolute;
        top: 32px;
        right: 20px;
        width: 20%;
        min-width: 350px;
        height: 92%;
        z-index: 100;
        padding: 10px;
        background-color: rgba(32, 34, 48, .9);
        .title {
          color: #206aff;
          i {
            float: right;
            font-size: 18px;
            margin: 10px;
            cursor: pointer;
          }
        }
        span {
          color: white;
        }
        .submitButton {
          width: 100%;
          bottom: 20px;
          display: flex;
          justify-content: center;
          margin-top: 25px
        }
        .tableBox {
          position: relative;
          p {
            color: #f05656;
            font-size: 12px;
            position: absolute;
            left: 80px;
            top: -5px;
          }
        }
      }
    }
    .bigVideo {
      position: absolute;
      width: 300px;
      left: 22%;
      top: 32px;
      min-width: 400px;
      height: 265px;
      z-index: 100;
      padding: 10px;
      background-color: rgba(32, 34, 48, .9);
      .title {
        color: #206aff;
        display: flex;
        justify-content: space-between;
        i {
          margin: 5px;
          font-size: 20px;
          cursor: pointer;
        }
      }
    }

    ::v-deep .el-table__empty-text {
      padding-top: 160px;
      background-size: contain;
    }
  }
   ::v-deep .el-upload--picture-card{
    border: 1px solid #206aff;
    width: 100px;
    height: 100px;
    color: #8c939d;
    background: #294e80;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::v-deep .el-upload-list__item {
    transition: none !important;
  }
  ::v-deep  .el-upload-list--picture-card .el-upload-list__item{
    width: 100px;
    height: 100px;
  }
</style>
<style>
  .amap-marker-label {
    background-color: transparent !important;
    border: none !important;
  }
</style>

