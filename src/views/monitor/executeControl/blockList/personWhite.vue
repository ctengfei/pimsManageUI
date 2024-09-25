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
                  <span>人员白名单组</span>
                  <el-button
                      type="text"
                      @click="groupCreate"
                  >创建</el-button>
              </div>
              <div class="btnList" style="display: flex;justify-content: space-between;">
                  <el-input
                      v-model="groupArr.name"
                      placeholder="请输入人员白名单组名称"
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
              ref="personForm"
              :model="personForm"
              class="demo-form-inline"
            >
              <el-form-item prop="nameOrCredentialNumber" label="姓名或证件号码">
                <el-input
                  v-model="personForm.nameOrCredentialNumber"
                  placeholder="请输入人员姓名或证件号码"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="gender" label="性别">
                <el-select v-model="personForm.gender" clearable placeholder="请选择性别">
                    <el-option
                    v-for="item in sexList"
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
                  @click="personSearch()"
                  >搜索
                </el-button>
                <el-button
                  icon="el-icon-refresh-left"
                  @click="personReset()"
                  >重置
                </el-button>
              </el-form-item>
              <el-form-item style="float: right;margin-right:0px;">
                <el-button @click="personAdd" type="primary"
                  >添加人员
                </el-button>
              </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <el-row :gutter="10">
              <el-col :span="4" v-for="(item,index) in contentList" :key="index">
                <el-card shadow="hover" class="cardMBottom">
                  <img style="width:100%;height:100px;object-fit: contain;" :src="item.pictureUrl" alt="">
                  <div>
                    <div class="perName">
                      姓名：{{item.name}}
                    </div>
                    <div>
                      性别：{{item.genderStr}}
                    </div>
                    <div>
                      更新时间：{{item.createTime}}
                    </div>
                  </div>
                  <el-button
                    type="text"
                    @click="personDel(item)"
                    >移除</el-button>
                  <el-button
                    type="text"
                    @click="personEdit(item)"
                    >修改</el-button>
                  <!-- <el-button
                    type="text"
                    @click="personTrack(item)"
                    >轨迹</el-button> -->
                </el-card>
              </el-col>
            </el-row>
            <div v-if="contentList && contentList.length">
              <pagination
                @pagination="handleCurrentChanges"
                :page.sync="personForm.pageNum"
                :pageSizes="[10, 20, 30, 40]"
                :limit.sync="personForm.pageSize"
                :total="personForm.totals"
              />
            </div>
            <div v-else>
              <el-empty :image-size="200"></el-empty>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 添加人员弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="personTitle"
        :visible.sync="addSortDialogShow"
        :before-close="personDialogClose"
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
              <el-form-item prop="groupId" label="人员白名单组"
                :rules="[
                  { required: true, message: '请选择白名单组', trigger: ['blur','change'] }
                ]">
                <el-select
                  v-model="addForm.groupId"
                  style="width:100%"
                  placeholder="请选择白名单组"
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
              <el-form-item prop="name" label="姓名"
                :rules="[
                  { required: true, message: '请输入姓名', trigger: ['blur','change'] }
                ]">
                <el-input
                  v-model.trim="addForm.name"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="gender" label="性别"
                :rules="[
                  { required: true, message: '请选择性别', trigger: ['blur','change'] }
                ]">
                <el-select
                  v-model="addForm.gender"
                  style="width:100%"
                  placeholder="请选择性别"
                >
                  <el-option
                    v-for="(item, index) in sexList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期" prop="bornDate">
                <el-date-picker
                  style="width: 100%"
                  v-model="addForm.bornDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="出生日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="credentialNumber" label="证件号码">
                <el-input
                  v-model.trim="addForm.credentialNumber"
                  placeholder="请输入证件号码"
                ></el-input>
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
              <el-form-item prop="pictureUrl" label="" ref="addFormPicture" :rules="[
                  { required: true, message: '请上传照片', trigger: ['blur','change'] }
                ]">
                <ImageUpload v-model="addForm.pictureUrl" :limit="1"/>
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
            ref="groupForm"
            :model="groupForm"
            class="demo-form-inline"
            labelWidth="120px"
          >
            <el-col>
              <el-form-item prop="name" label="人员白名单组"
                :rules="[
                  { required: true, message: '请输入人员白名单组名称', trigger: ['blur','change'] }
                ]">
                <el-input
                  v-model.trim="groupForm.name"
                  placeholder="请输入人员白名单组名称"
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
          groupType: "TARGET_WHITE",
          name: "",
          pageNum: 1,
          pageSize: 10,
          totals: 0
        },
        groupForm:{
          groupType: "TARGET_WHITE",
          name: "",
          description: ""
        },
        sexList:[
        {
                name:"男",
                value:"0"
            },
            {
                name:"女",
                value:"1"
            },
            {
                name:"未知",
                value:"-1"
            },
        ],
        tempImg:require('@/assets/images/bg1.jpg'),
        contentList:[],
        personForm:{
          nameOrCredentialNumber: "",
          groupId:"",
          gender: "",
          pageNum: 1,
          pageSize: 10,
          totals: 0
        },
        addGroupShow: false,
        groupTitle: "",
        groupType: "",
        personTitle: "",
        personType: "",
        addSortDialogShow: false,
        addForm: {
          credentialNumber: "",
          bornDate:"",
          gender: "",
          groupId: "",
          name: "",
          pictureUrl: "",
          remark: ""
        },
      };
    },
    watch:{
      'addForm.pictureUrl':{
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
        // 人员查询
        setTimeout(() => {
          this.personSearch();
        }, 500);
      },
      // 获取黑名单组列表
      getGroupList(){
        $executeControl.blockArrSearch(this.groupArr).then(res=>{
          this.tabLists = []
          this.tabLists = res.data
          this.personForm.groupId = res.data[0].id
        })
      },
      // 左侧tab
      tabClick(item,index){
        this.activeIndex = index
        this.groupName = item.name
        this.personForm.groupId = item.id
        this.personSearch()
      },
      // 搜索黑名单组
      groupSearch(){
        this.getGroupList()
      },
      // 创建黑名单组
      groupCreate(){
        this.groupType = 'add'
        this.addGroupShow = true
        this.groupTitle = "创建人员白名单组"
        if(this.$refs.groupForm !== undefined){
          this.$refs.groupForm.resetFields()
        }
      },
      // 修改黑名单组
      groupEdit(item){
        this.groupType = 'edit'
        this.addGroupShow = true
        this.groupTitle = "修改人员白名单组"
        this.$nextTick(()=>{
          this.groupForm = Object.assign({}, item)
        })
        
      },
      // 提交黑名单组表单 （创建和修改）
      onAddGroup(){
        this.$refs.groupForm.validate(valid => {
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
        if(this.$refs.groupForm !== undefined){
          this.$refs.groupForm.resetFields()
        }
        this.addGroupShow = false
      },
      // 删除黑名单组
      groupDel(item){
        this.$confirm(`确认删除${item.name}这条白名单组吗吗?`, "提示", {
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
      
      // 搜索人员
      personSearch(){
        $blockPersonList.getPersonList(this.personForm).then(res=>{
          this.contentList = []
          this.contentList = res.data.data
          this.personForm.pageNum = res.data.pageNum
          this.personForm.pageSize = res.data.pageSize
          this.personForm.totals = res.data.total
        })
      },
      // 重置人员搜索
      personReset(){
        if(this.$refs['personForm'] !== undefined){
          this.$refs['personForm'].resetFields()
        }
        this.personForm.pageNum = 1
        this.personSearch()
      },
      // 添加人员
      personAdd(){
        this.personTitle = "添加人员";
        this.personType = "add";
        this.addSortDialogShow = true
      },
      // 删除人员
      personDel(item){
        this.$confirm(`确认删除${item.name}人员吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          $blockPersonList.deletePerson(item.id).then(res=>{
            this.$message.success("删除成功");
            this.personSearch()
          })
        });
      },
      // 修改人员
      personEdit(item){
        this.personTitle = "修改人员信息";
        this.personType = "edit";
        this.addSortDialogShow = true
        this.$nextTick(()=>{
          this.addForm = Object.assign({}, item)
        })
      },
      // 人员轨迹
      personTrack(item){
        this.$router.push({name:"PeopleControl",query:{ivsId:item.ivsId}})
      },
      cancel() {
        if(this.$refs['addForm'] !== undefined){
          this.$refs['addForm'].resetFields()
        }
        this.addSortDialogShow = false;
      },
      // 关闭添加人员或修改弹窗
      personDialogClose(){
        this.cancel()
      },
      // 提交添加或修改人员
      onSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let data = this.addForm;
            if (this.personType == "add") {
              delete data.id;
              $blockPersonList.createPerson(data).then(res=>{
                this.$message.success("添加成功");
                this.personSearch();
                this.cancel();
              })
            }else{
              $blockPersonList.updatePerson(data.id,data).then(res=>{
                this.$message.success("编辑成功");
                this.personSearch();
                this.cancel();
              })
            }
          }
        });
      },
      handleCurrentChanges() {
        this.personSearch()
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
  