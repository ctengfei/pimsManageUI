<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <gis-map ref="gisMap"></gis-map>
      <!-- 新增布控 -->
      <div class="rightBox" v-if="addFormShow">
        <div class="addTitle">
          {{ addOrEditTitle }}布控任务
        </div>
        <el-divider></el-divider>
        <div style="margin-top: 15px;">
          <el-form
            :model="addForm"
            :rules="addRules"
            ref="addForm"
            label-width="120px"
          >
            <el-form-item label="布控地块" prop="area">
                <el-select
                  v-model="addForm.area"
                  placeholder="请选择布控地块"
                  style="width: 100%"
                  :disabled="addOredit"
                >
                  <el-option
                    v-for="item in carGroup"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务名称" prop="name">
              <el-input
                v-model="addForm.name"
                placeholder="请输入任务名称"
                clearable
                maxlength="30"
                show-word-limit
                :disabled="addOredit"
              ></el-input>
            </el-form-item>
            <el-form-item label="布控日期" prop="creatTime">
              <el-date-picker
                :disabled="addOredit"
                v-model="addForm.creatTime"
                style="width:100%"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="告警级别" prop="alarmLevel">
              <el-select
                  v-model="addForm.alarmLevel"
                  placeholder="请选择告警级别"
                  style="width: 100%"
                  :disabled="addOredit"
                >
                  <el-option
                    v-for="item in alarmLevelList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆名单组" prop="groupId">
              <el-select
                  :disabled="addOredit"
                  v-model="addForm.groupId"
                  placeholder="请选择车辆名单组"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in groupArrList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务创建时间" prop="createTime" v-if="addOredit">
              <el-input
                v-model="addForm.createTime"
                :disabled="addOredit"
              ></el-input>
            </el-form-item>
            <el-form-item label="任务状态" prop="statusStr" v-if="addOredit">
              <el-input
                v-model="addForm.statusStr"
                :disabled="addOredit"
              ></el-input>
            </el-form-item>
            <div class="tableBox">
              <div class="tableBoxTitle">
                <div>
                  <span style="color: #f05656">*</span>
                  <span style="color: #606266">布控摄像机</span>
                  <span
                    style="color: #f05656;font-size:12px"
                    v-show="!flag"
                    >请添加布控摄像头</span
                  >
                </div>
                <el-button
                  style="height: 30px"
                  :class="
                    addActive ? 'video-web-main-btn' : 'video-web-plain-btn'
                  "
                  @click="addCarmea"
                  v-if="!addOredit"
                  ><i class="el-icon-circle-plus-outline"></i>添加</el-button
                >
              </div>
              <div>
                <el-table
                  :data="addForm.cameraList"
                  style="width: 100%"
                  height="200px"
                >
                  <el-table-column
                    label="序号"
                    width="60"
                    type="index"
                  ></el-table-column>
                  <el-table-column
                    label="摄像机名称"
                    show-overflow-tooltip
                    prop="name"
                  >
                  </el-table-column>
                  <el-table-column label="操作" width="80" v-if="!addOredit">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click="deleteCamera(scope.$index, scope.row)"
                        style="color: #f05656"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <el-form-item label="布控描述" prop="description">
              <el-input
                :disabled="addOredit"
                type="textarea"
                :rows="2"
                maxlength="100"
                show-word-limit
                v-model="addForm.description"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="submitButton">
            <el-button class="video-web-plain-btn" @click="goBack"
              >取消</el-button
            >
            <el-button
              v-if="addOrEditType !== 'look' || !addOredit"
              class="video-web-main-btn"
              type="primary"
              @click="onSubmit"
              >确认</el-button
            >
          </div>
        </div>
      </div>
      <el-dialog
          :close-on-click-modal="false"
          :title="cartitle"
          :visible.sync="addSortDialogShow"
          :before-close="carDialogClose"
          width="35%"
        >
      <!-- <div class="rightBox" v-if="!addFormShow"> -->
        <OrgizeTree 
          v-if="addSortDialogShow"
          :isCheck="isCheck"
          :dominShow="dominShow"
          :deviceType="nodeType"
          :draggable="draggable"
          :nodeType='nodeType'
          @getTableData="getTableData"
        />
        <!-- <div class="submitButton">
            <el-button class="video-web-plain-btn" @click="onCancel"
              >取消</el-button
            >
            <el-button
              class="video-web-main-btn"
              @click="onSubmit"
              v-show="!addOredit"
              >确认</el-button
            >
          </div> -->

      <!-- </div> -->
      <div slot="footer" style="text-align:right;">
          <el-button @click="onSubmit1()" type="primary" class="video-web-main-btn"
            >确定</el-button
          >
          <!-- <el-button @click="cancel()" class="video-web-plain-btn"
            >取消</el-button
          > -->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import gisMap from "@/components/common/map/gis-map";
import pagination from "@/components/comPagination";
import OrgizeTree from '@/components/orgnizeTree'
import $executeControl from "@/api/executeControl"
import * as $carParkingSet from "@/api/carManage/carParkingSet";
import { formatData, uniqueArray } from "@/utils/index";

export default {
  name:'',
  components: {
    OrgizeTree,
    pagination,
    gisMap
  },
  data() {
    return {
      // 树参数
      currentNodeKey:"",
      dominList:[],
      isCheck: 'isCheck',
      dominShow: true,
      nodeType:'camera',
      draggable: true,
      alarmLevelList:[
        {
          name: "紧急",
          value: "VERY_EMERGENCY"
        },
        {
          name: "严重",
          value: "EMERGENCY"
        },
        {
          name: "普通",
          value: "NORMAL"
        },
      ],
      // 新增布控
      addForm:{
        creatTime:"",
        alarmLevel: "",
        area: "",
        cameraList: [],
        description: "",
        groupId: "",
        monitorEndDate: "",
        monitorStartDate: "",
        name: "",
        type: "CAR"
      },
      carGroup: [
        
      ],
      addFormShow: true, // 新增布控的表单
      groupArrList:[],
      groupArr:{
        type: "car",
        name: "",
      },
      // 校验
      addRules: {
        area: [{
          required: true,
          message: "请选择布控地块",
          trigger: ["blur", "change"]
        }],
        groupId: [{
          required: true,
          message: "请选择名单组",
          trigger: ["blur", "change"]
        }],
        name: [{
          required: true,
          message: "请输入任务名称",
          trigger: ["blur", "change"]
        }],
        creatTime: [{
          required: true,
          message: "请选择布控日期",
          trigger: ["blur", "change"]
        }],
        alarmLevel: [{
          required: true,
          message: "请选择告警级别",
          trigger: ["blur", "change"]
        }],
        description: [{
          required: true,
          message: "请输入描述信息",
          trigger: ["blur", "change"]
        }],
      },
      cameraShow: false, // 摄像机展示
      // 布控详情
      controlDetailsShow: false, // 详情展示
      controlDetailsForm: {
        name: "",
        object: "",
        type: "",
        cameraList: [],
        desc: ""
      },
      addActive: false,
      addOredit: false,
      flag: true,
      addOrEditType:'',
      addOrEditTitle:'创建',
      cartitle:"选择布控摄像机",
      addSortDialogShow: false,
      tempList:[]
    };
  },
  watch: {
    
  },
  beforeDestroy() {
  },
  created() {
  },
  mounted() {
    this.init()
    if(this.$route.query.type == "edit"){
      this.addOrEditTitle = "修改"
      this.addOrEditType = "edit"
      this.addOredit = false
      this.getDetail(this.$route.query.id)
    }else if(this.$route.query.type == "look"){
      this.addOrEditTitle = "查看"
      this.addOrEditType = "look"
      this.addOredit = true
      this.getDetail(this.$route.query.id)
    }else{
      this.addOrEditTitle = "创建"
      this.addOrEditType = "add"
      this.addOredit = false
      this.$refs.addForm.resetFields()
    }
  },
  methods: {
    onSubmit1(){
      if(this.tempList.length <= 12){
        this.addSortDialogShow = false
        if(this.addOrEditType == "edit"){
          let temp = this.addForm.cameraList.concat(this.tempList)
          let list = uniqueArray(temp,"code");
          this.addForm.cameraList = list
        }else{
          this.addForm.cameraList = this.tempList
        }
      }else{
        this.$message.error("摄像头最多添加12个")
      }
        // this.addSortDialogShow = false
        // if(this.addOrEditType == "edit"){
        //   let temp = this.addForm.cameraList.concat(this.tempList)
        //   let list = uniqueArray(temp,"code");
        //   this.addForm.cameraList = list
        // }else{
        //   this.addForm.cameraList = this.tempList
        // }
    },
    // 初始化数据
    init(){
      this.getGroupList()
      this.getParkCode()
    },
     // 获取园区
    getParkCode(){
        $carParkingSet.getCarParkingCode()
        .then((res) => {
            this.carGroup = formatData(res.data);
        })
        .catch((err) => {
            this.$message.error(err.message);
        });
    },
    // 获取树选中摄像头id
    getTableData(node,arr){
      console.log(arr,"nodearr")
      // this.addForm.cameraList = arr.treeNodes
      this.tempList = arr.treeNodes
    },
    // 编辑   布控获取详情
    getDetail(id){
      $executeControl.getDetail(id).then(res=>{
        this.addForm = res.data;
        this.addForm.creatTime = [res.data.monitorStartDate,res.data.monitorEndDate]
        // this.addForm.monitorEndDate = res.data.monitorEndDate;
        // this.addForm.monitorStartDate = res.data.monitorStartDate;
      })
    },
    // 获取人脸布控黑名单组
    getGroupList(){
      $executeControl.blockArrSearch(this.groupArr).then(res=>{
        this.groupArrList = []
        this.groupArrList = res.data
      })
    },
    // 移除摄像摄像头列表
    addCarmea() {
      this.addActive = !this.addActive;
      this.addSortDialogShow = true
    },
    carDialogClose() {
        this.addSortDialogShow = false;
      },
    // 下一步
    onNext(){
      console.log(this.addForm,"onNext")
      this.$refs.addForm.validate(valid => {
          if (valid) {
            this.addForm.monitorStartDate = this.addForm.creatTime[0]
            this.addForm.monitorEndDate = this.addForm.creatTime[1]
            this.addFormShow = false
          }else{
            return false;
          }
      })
    },
    // 取消创建
    goBack(){
      this.$router.push({name:"CarControl"})
    },
    // 删除摄像机
    deleteCamera(index, item) {
      this.addForm.cameraList.splice(index, 1);
    },
    // 取消
    onCancel() {
      this.addActive = false;
      this.addFormShow = true;
    },
    // add新增确认
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addForm.monitorStartDate = this.addForm.creatTime[0]
          this.addForm.monitorEndDate = this.addForm.creatTime[1]
          if(this.addForm.cameraList.length){
            if(this.addOrEditType == "add"){
              $executeControl.createTask(this.addForm).then(res=>{
                this.addActive = false;
                this.addForm.cameraList = [];
                this.$refs.addForm.resetFields();
                this.$router.push({name:"CarControl"})
              })
            }else{
              $executeControl.updateTask(this.addForm).then(res=>{
                this.addActive = false;
                this.addForm.cameraList = [];
                this.$refs.addForm.resetFields();
                this.$router.push({name:"CarControl"})
              })
            }
          }else{
            this.$message.error("请选择布控摄像头")
          }
        }else{
          return false;
        }
      })
    },
  }
};
</script>
<style lang="scss" scoped>

.app-container-gis {
  position: relative;
  #cesiumContainer {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    .addTitle{
      font-weight: bold;
      font-size: 16px;
    }
    // 布控详情
    .controlDetails,
    .rightBox {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 26%;
      min-width: 350px;
      height: 85%;
      z-index: 100;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      background-color:#f5f7fa;;
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
        // position: absolute;
        // bottom: 20px;
        display: flex;
        justify-content: center;
      }
      .tableBox {
        height: calc(100% - 170px);
        position: relative;
        .tableBoxTitle {
          font-size: 14px;
          height: 30px;
          display: flex;
          justify-content: space-between;
          span {
            color: #afb9d0;
            cursor: pointer;
          }
          .addCarmea {
            margin-right: 20px;
          }
          .actives {
            color: #37f;
          }
        }
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
}
</style>
