<!--
 * @LastEditors: renjianwu jwrenx@isstech.com
 * 车辆道闸
-->
<template>
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="4" :xs="24">
          <div class="highlight-height-main padding-20">
              <div class="addGroupBtn">
                  <span>车辆黑名单组</span>
                  <el-button
                      type="text"
                      @click="groupCreate"
                  >创建</el-button>
              </div>
              <div class="btnList" style="display: flex;justify-content: space-between;">
                  <el-input
                      v-model="groupArr.name"
                      placeholder="请输入车辆黑名单组名称"
                      style="width: 75%"
                      clearable
                      @clear="groupSearch"
                  ></el-input>
                  <el-button type="primary" style="width: 20%" @click="groupSearch">搜索</el-button>
              </div>
              <div class="btnList">
                  <div class="tabList" v-if="tabLists.length">
                      <div v-for="(item,index) in tabLists" :key="index" class="contentList">
                          <div :class="activeIndex != index ? 'defStyle': 'actives'" @click="tabClick(item,index)">
                            {{item.name}}
                          </div>
                          <div class="btnRight">
                            <el-button
                              type="text"
                                @click="groupDel(item)"
                            >删除</el-button>
                            <el-button
                              type="text"
                                @click="groupEdit(item)"
                            >修改</el-button>
                          </div>
                      </div>
                  </div>
                  <div v-else>
                    <el-empty :image-size="100"></el-empty>
                  </div>
              </div>
          </div>
          </el-col>
        <el-col  :span="20" :xs="24">
          <div class="video-web-right-box-bottom">
            <el-form
              :inline="true"
              ref="carForm"
              :model="carForm"
              class="demo-form-inline"
            >
              <el-form-item prop="carPlateOrOwnerName" label="车主姓名或车牌号">
                <el-input
                  v-model="carForm.carPlateOrOwnerName"
                  placeholder="请输入车主姓名或车牌号"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="carType" label="车辆类型">
                <el-select v-model="carForm.carType" clearable placeholder="请选择车辆类型">
                    <el-option
                    v-for="item in carTypes"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="plateType" label="车牌类型">
                <el-select v-model="carForm.plateType" clearable placeholder="请选择车牌类型">
                    <el-option
                    v-for="item in plateTypes"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="carSearch()"
                  >搜索
                </el-button>
                <el-button
                  icon="el-icon-refresh-left"
                  @click="carReset()"
                  >重置
                </el-button>
              </el-form-item>
              <el-form-item style="float: right;margin-right:0px;">
                <el-button @click="carAdd" type="primary"
                  >添加车辆
                </el-button>
              </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <el-row :gutter="10">
              <el-col :span="4" v-for="(item,index) in contentList" :key="index">
                <el-card shadow="hover" class="cardMBottom">
                  <img style="width:100%;height:100px;object-fit: contain;" :src="item.carImg" alt="">
                  <div>
                    <div>
                      车牌号：{{item.carPlate}}
                    </div>
                    <div class="perName">
                      车主姓名：{{item.ownerName}}
                    </div>
                    <div>
                      更新时间：{{item.createTime}}
                    </div>
                  </div>
                  <el-button
                    type="text"
                    @click="carDel(item)"
                    >移除</el-button>
                  <el-button
                    type="text"
                    @click="carEdit(item)"
                    >修改</el-button>
                  <el-button
                    type="text"
                    @click="carTrack(item)"
                    >轨迹</el-button>
                </el-card>
              </el-col>
            </el-row>
            <div v-if="contentList && contentList.length">
              <pagination
                @pagination="handleCurrentChanges"
                :page.sync="carForm.pageNum"
                :pageSizes="[10, 20, 30, 40]"
                :limit.sync="carForm.pageSize"
                :total="carForm.totals"
              />
            </div>
            <div v-else>
              <el-empty :image-size="200"></el-empty>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 添加车辆弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="carTitle"
        :visible.sync="addSortDialogShow"
        :before-close="carDialogClose"
        width="35%"
      >
        <el-row>
          <el-form
            ref="addForm"
            :model="addForm"
            class="demo-form-inline"
            labelWidth="120px"
          >
            <el-col>
              <el-form-item prop="groupId" label="车辆黑名单组"
                :rules="[
                  { required: true, message: '请选择车辆黑名单组', trigger: ['blur','change'] }
                ]">
                <el-select
                  v-model="addForm.groupId"
                  style="width:100%"
                  placeholder="请选择车辆黑名单组"
                >
                  <el-option
                    v-for="(item, index) in tabLists"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="carPlate" label="车牌号"
                :rules="[
                  { required: true, message: '请输入车牌号', trigger: ['blur','change'] }
                ]">
                <el-input
                  v-model.trim="addForm.carPlate"
                  placeholder="请输入车牌号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="ownerName" label="车主姓名"
                :rules="[
                  { required: true, message: '请输入车主姓名', trigger: ['blur','change'] }
                ]">
                <el-input
                  v-model.trim="addForm.ownerName"
                  placeholder="请输入车主姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="ownerPhone" label="车主手机号">
                <el-input
                  v-model.trim="addForm.ownerPhone"
                  placeholder="请输入车主手机号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="plateType" label="车牌类型">
                <el-select
                  v-model="addForm.plateType"
                  style="width:100%"
                  placeholder="请选择车牌类型"
                >
                  <el-option
                    v-for="(item, index) in plateTypes"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="plateColor" label="车牌颜色">
                <el-select
                  v-model="addForm.plateColor"
                  style="width:100%"
                  placeholder="请选择车牌颜色"
                >
                  <el-option
                    v-for="(item, index) in plateColors"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="carType" label="车辆类型">
                <el-select
                  v-model="addForm.carType"
                  style="width:100%"
                  placeholder="请选择车辆类型"
                >
                  <el-option
                    v-for="(item, index) in carTypes"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="vehicleColor" label="车身颜色">
                <el-select
                  v-model="addForm.vehicleColor"
                  style="width:100%"
                  placeholder="请选择车身颜色"
                >
                  <el-option
                    v-for="(item, index) in vehicleColors"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="carBrand" label="车辆品牌">
                <el-select
                  v-model="addForm.carBrand"
                  style="width:100%"
                  placeholder="请选择车辆品牌"
                >
                  <el-option
                    v-for="(item, index) in carBrands"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item prop="remark" label="备注">
                <el-input
                  v-model.trim="addForm.remark"
                  placeholder="请输入描述信息"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item prop="carImg" label="" ref="addFormPicture" :rules="[
                  { required: true, message: '请上传照片', trigger: ['blur','change'] }
                ]">
                <ImageUpload v-model="addForm.carImg" :limit="1"/>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer" style="text-align:center;">
          <el-button @click="onSubmit()" type="primary" class="video-web-main-btn"
            >确定</el-button
          >
          <el-button @click="cancel()" class="video-web-plain-btn"
            >取消</el-button
          >
        </div>
      </el-dialog>
      <!-- 黑名单组弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="groupTitle"
        :visible.sync="addGroupShow"
        width="35%"
        :before-close="groupDoaligeClose"
      >
        <el-row>
          <el-form
            v-if="addGroupShow"
            ref="groupForms"
            :model="groupForm"
            class="demo-form-inline"
            labelWidth="120px"
          >
            <el-col>
              <el-form-item prop="name" label="车辆黑名单组"
                :rules="[
                  { required: true, message: '请输入车辆黑名单组名称', trigger: ['blur','change'] }
                ]">
                <el-input
                  v-model.trim="groupForm.name"
                  placeholder="请输入车辆黑名单组名称"
                  maxlength="30"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item prop="description" label="备注">
                <el-input
                  v-model.trim="groupForm.description"
                  placeholder="请输入详细信息"
                  maxlength="100"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer" style="text-align:center;">
          <el-button @click="onAddGroup()" type="primary" class="video-web-main-btn"
            >确定</el-button
          >
          <el-button @click="onCancelGroup()" class="video-web-plain-btn"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
  </template>
  <script>
  import pagination from "@/components/comPagination";
  import ImageUpload from "@/components/ImageUpload"
  import $executeControl from "@/api/executeControl"
  import $blockPersonList from "@/api/executeControl/blockPersonList"
  import { carType, plateColor, plateType, vehicleColor } from "./carTypeColor"
  
  export default {
    name:'',
    components: { 
      pagination,
      ImageUpload
    },
    data() {
      return {
        tabLists:[],
        activeIndex:0,
        groupName:"",
        groupArr:{
          groupType: "CAR_BLACK",
          name: "",
          pageNum: 1,
          pageSize: 10,
          totals: 0
        },
        groupForm:{
          groupType: "CAR_BLACK",
          name: "",
          description: ""
        },
        carTypes: carType,
        plateTypes: plateType,
        plateColors: plateColor,
        vehicleColors: vehicleColor,
        carBrands:[
          {
            name:"byd",
            value: "byd"
          }
        ],
        contentList:[],
        carForm:{
          carPlateOrOwnerName: "",
          groupId:"",
          carType: "",
          plateType: "",
          pageNum: 1,
          pageSize: 10,
          totals: 0
        },
        addGroupShow: false,
        groupTitle: "",
        groupType: "",
        carTitle: "",
        carType: "",
        addSortDialogShow: false,
        addForm: {
          carBrand: "",
          carImg: "",
          carPlate: "",
          carType: "",
          groupId: "",
          ownerName: "",
          ownerPhone: "",
          plateColor: "",
          plateType: "",
          type: "",
          vehicleColor: "",
          remark: "",
        },
      };
    },
    watch:{
      'addForm.carImg':{
        handler(val){
          if(val){
            this.$refs.addFormPicture.$emit('el.form.change')
          }
        }
      }
    },
    created() {
      this.inits()
    },
    mounted() {
    },
    methods: {
      // 初始化数据
      inits(){
        // 黑名单组查询
        this.getGroupList();
        // 车辆查询
        setTimeout(() => {
          this.carSearch();
        }, 500);
      },
      // 获取黑名单组列表
      getGroupList(){
        $executeControl.blockArrSearch(this.groupArr).then(res=>{
          this.tabLists = []
          this.tabLists = res.data
          this.carForm.groupId = res.data[0].id
        })
      },
      // 左侧tab
      tabClick(item,index){
        this.activeIndex = index
        this.groupName = item.name
        this.carForm.groupId = item.id
        this.carSearch()
      },
      // 搜索黑名单组
      groupSearch(){
        this.getGroupList()
      },
      // 创建黑名单组
      groupCreate(){
        this.groupType = 'add'
        this.addGroupShow = true
        this.groupTitle = "创建车辆黑名单组"
      },
      // 修改黑名单组
      groupEdit(item){
        this.groupType = 'edit'
        this.addGroupShow = true
        this.groupTitle = "修改车辆黑名单组"
        this.$nextTick(() => {
            // 注意看这里
          this.groupForm = Object.assign(this.groupForm, item)
        })
        
      },
      // 提交黑名单组表单 （创建和修改）
      onAddGroup(){
        this.$refs.groupForms.validate(valid => {
          if (valid) {
            if(this.groupType == "add"){
              // 创建
              $executeControl.blockArrCreate(this.groupForm).then(res=>{
                this.$message.success('创建成功')
                this.onCancelGroup()
                this.getGroupList()
              })
            }else{
              // 修改
              $executeControl.blockArrUpdate(this.groupForm).then(res=>{
                this.$message.success('修改成功')
                this.onCancelGroup()
                this.getGroupList()
              })
            }
          }
        })
                
      },
      // 关闭黑名单组弹窗
      groupDoaligeClose(){
        this.onCancelGroup()
      },
      // 取消黑名单组表单
      onCancelGroup(){
        this.addGroupShow = false
        if(this.$refs['groupForms']){
          this.$refs['groupForms'].resetFields()
        }
        
      },
      // 删除黑名单组
      groupDel(item){
        this.$confirm(`确认删除${item.name}这条黑名单组吗吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          $executeControl.blockArrDelete(item.id).then(res=>{
            this.$message.success("删除成功！")
            this.getGroupList()
          })
        });
      },
      
      // 搜索车辆
      carSearch(){
        $blockPersonList.getCarList(this.carForm).then(res=>{
          this.contentList = []
          this.contentList = res.data.data
          this.carForm.pageNum = res.data.pageNum
          this.carForm.pageSize = res.data.pageSize
          this.carForm.totals = res.data.total
        })
      },
      // 重置车辆搜索
      carReset(){
        if(this.$refs['carForm'] !== undefined){
          this.$refs['carForm'].resetFields()
        }
        this.carForm.pageNum = 1
        this.carSearch()
      },
      // 添加车辆
      carAdd(){
        this.addSortDialogShow = true
        this.carTitle = "添加车辆";
        this.carType = "add";
      },
      // 删除车辆
      carDel(item){
        this.$confirm(`确认删除${item.ownerName}人员吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          $blockPersonList.deleteCar(item.id).then(res=>{
            this.$message.success("删除成功");
            this.carSearch()
          })
        });
      },
      // 修改车辆
      carEdit(item){
        this.addSortDialogShow = true
        this.carTitle = "修改车辆信息";
        this.carType = "edit";
        this.$nextTick(() => {
          this.addForm = Object.assign({}, item)
        })
      },
      // 车辆轨迹
      carTrack(item){
        this.$router.push({name:"CarControlrute",query:{ivsId:item.ivsId}})
      },
      cancel() {
        if(this.$refs['addForm'].resetFields() !== undefined){
          this.$refs['addForm'].resetFields()
        }
        this.addSortDialogShow = false;
      },
      // 关闭车辆 添加或修改弹窗
      carDialogClose(){
        this.cancel()
      },
      // 提交添加或修改  车辆
      onSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let data = this.addForm;
            if (this.carType == "add") {
              delete data.id;
              $blockPersonList.createCar(data).then(res=>{
                this.$message.success("添加成功");
                this.carSearch();
                this.cancel();
              })
            }else{
              $blockPersonList.updateCar(data.id,data).then(res=>{
                this.$message.success("编辑成功");
                this.carSearch();
                this.cancel();
              })
            }
          }
        });
      },
      handleCurrentChanges() {
        this.carSearch()
      },
    }
  };
  </script>
  
  <style lang="scss" scoped>
  
  .cardMBottom{
    margin-bottom: 10px;
    .perName{
      white-space: nowrap;
    }
  }
  .addGroupBtn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-image: linear-gradient(
      94deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(128, 128, 128, 0.12) 100%
    );
    padding: 0 20px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    height: 38px;
  }
  
  .addGroupBtn span {
    font-size: 14px;
    font-weight: bold;
    color: #666;
  }
  .btnList{
    padding-top:10px;
    &:last-child{
      height: 100%;
      overflow: hidden;
      width: 100%;
      .tabList{
        width: 100%;
        height: 700px;
        overflow: auto;
      }
    }
    .tabList{
      .contentList{
        height: 32px;
        line-height: 32px;
      }
        .defStyle{
            width: 70%;
            cursor: pointer;
            border-radius: 5px;
            padding:0 5px;
            display: inline-block;
            float: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
        }
        .actives{
            background: rgb(64, 158, 255);
            cursor: pointer;
            color: #fff;
            width: 70%;
            padding:0 5px;
            border-radius: 5px;
            float: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
        }
        .btnRight{
          float: right;
        }
    }
  }
  
  </style>
  