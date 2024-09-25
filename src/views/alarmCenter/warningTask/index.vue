<template>
  <div class="app-container">
    <div v-if="workPageShow">
      <div class="topinfo">
        <div v-for="(item,index) in allWork" :key="index">
          <el-progress
            color="#206aff"
            type="circle"
            :percentage="setItemProgress(item) || 0"
            :format="setItemText(item)"
            :stroke-width="10"
            :width="80"
          ></el-progress>
          <p style="text-align: center;color: #666666">{{item.label}}</p>
        </div>
      </div>
      <!-- <div class="workInfo"> -->
        <!-- <div class="btnGroups">
          <div>
            <Tabs
              @btnclick="btnclick($event)"
              :btnGroup="btnGroup"
              :btnChoose="btnChoose"
              :singleWidth="94"
            />
          </div>
          <div
            class="btn"
            v-for="(item,index) in btnGroup"
            :key="index"
            :class="btnChoose == item.label ? 'divActive' : ''"
            @click="btnClick(item)"
          >{{item.label}}
          </div>
        </div> -->
        <div style="padding-top:10px">
          <el-form ref="formSearch" inline v-model="formSearch" v-if="showSearch">
            <!-- <el-form-item prop="workNumber" label="任务名称">
              <el-input placeholder="请输入任务名称" clearable v-model="formSearch.title"></el-input>
            </el-form-item> -->
            <el-form-item label="任务创建时间">
              <el-date-picker
                v-model="time"
                type="daterange"
                value-format="yyyy-MM-dd"
                style="width: 240px"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="businessCode" label="告警级别">
              <el-select v-model="formSearch.level" placeholder="请选择告警级别" clearable>
                <el-option
                  v-for="item in levelArr"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status" label="任务状态">
              <el-select v-model="formSearch.status">
                <el-option
                  v-for="item in btnGroup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button  icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
              <el-button  icon="el-icon-refresh" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              @click="sendWorkSetting"
            >自动派单</el-button>
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              @click="exportWork"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getTableData"></right-toolbar>
        </el-row>
        <div style="height:calc(100% - 165px)">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" showOverflowTooltip></el-table-column>
          <!-- <el-table-column prop="title" label="任务名称" showOverflowTooltip></el-table-column> -->
          <el-table-column prop="alarmCode" label="任务编号" showOverflowTooltip></el-table-column>
          <el-table-column prop="alarmEventString" label="告警事件" showOverflowTooltip></el-table-column>
          <el-table-column prop="priority" label="告警级别" showOverflowTooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.priority == 'NORMAL'">普通告警</span>
              <span v-else-if="scope.row.priority == 'EMERGENCY'">严重告警</span>
              <span v-else-if="scope.row.priority == 'VERY_EMERGENCY'">紧急告警</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="任务指派时间" showOverflowTooltip></el-table-column>
          <el-table-column prop="acceptTime" label="任务处理时间" showOverflowTooltip></el-table-column>
          <el-table-column prop="processorName" label="任务处理人" showOverflowTooltip></el-table-column>
          <el-table-column prop="processorPhone" label="联系电话" showOverflowTooltip></el-table-column>
          <el-table-column prop="statusStr" label="任务处理状态"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button  @click="onDetail(scope.row)" type="text">详情</el-button>
              <el-button  @click="onSend(scope.row)" v-if="scope.row.status !== 'done'" type="text">指派</el-button>
              <!-- <el-button v-if="scope.row.status == 'doing'" @click="onReassignment(scope.row)" type="text">转派</el-button>
              <el-button v-if="scope.row.status == 'done'" v-show="$store.getters.user.username === 'admin'" @click="onAppraise(scope.row)" type="text">评价</el-button> -->
              
              <!-- <span v-if="scope.row.status == 'todo'">
                <el-button @click="onSend(scope.row)" type="text">指派</el-button>
                <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
              </span>
              <span v-else-if="scope.row.status == 'cancel'">
                <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
              </span>
              <span v-else-if="scope.row.status == 'doing'">
                <el-button @click="onReassignment(scope.row)" type="text">转派</el-button>
                <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
              </span>
              <span v-else-if="scope.row.status == 'done'">
                <el-button v-show="$store.getters.user.username === 'admin'" @click="onAppraise(scope.row)" type="text">评价</el-button>
                <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
              </span> -->
            </template>
          </el-table-column>
        </el-table>
       
        <pagination
          v-show="tableData && tableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="formSearch.pageNum"
          :pageSizes="[10, 20, 40]"
          :limit.sync="formSearch.pageSize"
          :total="total"
        />
      </div>
      <!-- </div> -->
    </div>
    <!-- <div v-else-if="createWorkShow" style="height: 100%">
      <creatework ref='createWork' :rowData="rowData" @createWorkVisibleShow='createWorkVisibleShow'
                  @bgshow="bgshow"></creatework>
    </div> -->
    <div v-if="workDetailShow">
      <el-dialog
        title="详情"
        :visible.sync="allClosemessage"
        width="600px"
        :before-close="handleClose"
      >
       <workdetail ref='workDetail' :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow'></workdetail>
       <div slot="footer">
        <el-button  @click="canceltask()">关闭</el-button>
      </div>
      </el-dialog>
    </div>
    <!--转派，派单dialog-->
    <div class="heights">
    <el-dialog
      :title="title"
      :visible.sync="sendShow"
      width="600px"
    >
      <el-row>
         <el-form label-width="80px">
          <el-col :span="24">
            <el-form-item label="任务名称">
              <el-input v-model="sendWork.title" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务编号">
              <el-input v-model="sendWork.alarmCode" disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态">
              <el-input :value="sendWork.status == 'todo' ? '待分派' : sendWork.status == 'doing' ? '处理中' : '已完成'" disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-input :value="sendWork.priority == 'NORMAL' ? '普通' : sendWork.priority == 'EMERGENCY' ? '紧急' : '非常紧急' " disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间">
              <el-input v-model="sendWork.acceptTime" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置信息">
              <el-input v-model="sendWork.location" disabled/>
            </el-form-item>
          </el-col>
          <el-col v-if="refuseshow?'':'display:none'">
            <el-form-item label="执行人员">
              <div style="display: flex;justify-content: space-between;">
                  <p :style="[{color:userName ? '#606266' : '#b4b6bb'},{margin: 0}]">{{ userName ? userName:'尚未选择用户'}}</p>
                  <el-button type="primary" @click="addDialog" :disabled="addPersonDis">选择用户</el-button>
                </div>
              <!-- <tree-transfer :title="titles" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}"
                             @add-btn='add' @left-check-change="leftChange" @remove-btn='remove' :mode='mode' height='320px' filter openAll>
              </tree-transfer> -->
             
            </el-form-item>
          </el-col>
          <el-col v-else>
            <el-form-item label="拒绝理由">
              <el-input type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button  @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
</div>
    <!--评价dialog-->
    <el-dialog
      title="任务评价"
      :visible.sync="appraiseShow"
      width="30%"
     
      :before-close="cancel"
    >
      <el-row>
        <el-form 
          :model="appraise"
          labelWidth="80px"
          :rules="appraiserules"
          ref="appraise">
          <el-col :span="12">
            <el-form-item label="任务编号">
              <el-input v-model="appraise.workOrderCode" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="评价星级" prop="stars">
              <el-rate v-model="appraise.stars" @change="changerate($event)"></el-rate>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="评价内容" prop="content">
              <el-input type="textarea" :rows="3" v-model.trim="appraise.content" placeholder="请输入评价内容"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary"  @click="submitAppraise">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>

      <!-- 选择负责人 -->
      <el-dialog
      :title="title1"
      :visible.sync="sendialogShow"
      width="850px"
      :before-close="cancel1"
    >
      <el-row :gutter="20">
          <el-col>
              <!-- <tree-transfer
                :title="titles"
                :from_data="fromData"
                :to_data="toData"
                :defaultProps="{ label: 'label', disabled: disabledFn }"
                @add-btn="add"
                @remove-btn="remove"
                @left-check-change="leftChange"
                :mode="mode"
                height="320px"
                filter
                openAll
              >
              </tree-transfer> -->
              
              <ComDeptUser v-if="sendialogShow" ref="comDeptUsers" :isMultipSelect="false" @selectClick="selectClick"/>
          </el-col>
      </el-row>
      <div slot="footer" style="text-align:right;">
        <el-button type="primary"  @click="onSubmit1()">确定</el-button>
        <el-button plain @click="cancel1()">取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import pagination from '@/components/comPagination'
  import creatework from '../components/creatework'
  import workdetail from '../components/workdetail'
  import treeTransfer from 'el-tree-transfer'
  import {getTableData, getAllWarning, download, alarmOrderAssign, alarmOrderEvaluate} from '@/api/alarmCenter/warningTask'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import {redefineTransfer} from '@/utils/index';
  import { downloadFile } from "@/utils/index";
  import Tabs from "@/components/commonTabs";
  import {
    getUserinfos,
    assignOrder,
  } from '@/api/smartProperty/workManagement'
  import messApi from "@/api/needMess"
  import { getUser1 } from "@/api/system/user";
import ComDeptUser from "@/components/comDeptUser"
  export default {
    name:'WarningTask',
    components: {
      pagination,
      creatework,
      workdetail,
      treeTransfer,
      Tabs,
      ComDeptUser
    },
    data() {
      return {
        // permission: {
        //   download: 'alarmCenter::warningTask::download',
        //   searchAllCount: 'alarmCenter::warningTask::searchAllCount',
        //   searchTable:'alarmCenter::warningTask::searchTable',
        // },
//        转单派单拒绝dialog
        sendShow: false,
        allClosemessage:false,
//        评价dialog
        appraiseShow: false,
//        主页展示
        workPageShow: true,
//        创建工单组件展示
        createWorkShow: false,
//        查看详情组件展示
        workDetailShow: false,
        allWork: [],
        showSearch:true,
        multipleArr:[],
        btnGroup: [
          {
            value: "ALL",
            label: "全部"
          },
          {
            value: 'TODO',
            label: "待处理"
          },
          {
            value: 'DOING',
            label: "处理中"
          },
          {
            value: 'DONE',
            label: "已完成"
          },
        ],
        levelArr: [{id: 'NORMAL', value: '普通告警'},{id:'EMERGENCY',value:'严重告警'},{id:'VERY_EMERGENCY',value:'紧急告警'}],
        btnChoose: 0,
        time:[],
        formSearch: {
          title: "",
          endTime: "",
          startTime: "",
          status: '',
          pageNum: 1,
          pageSize: 10,
        },
        total: 0,
        tableData: [],
//        转单or派单
        title: "",
        sendWork: {
//        选择人员名单
          workPeople: [],
          workNum: ''
        },
        appraise: {
          workOrderCode: '',
          stars: 0,
          content: '',
          creatorName: "",
        },
        appraiserules: {
          stars: [
            { required: true, validator: this.validaterate, trigger: "change" },
          ],
          content: [
            { required: true, message: "请输入评价内容", trigger: "blur" },
          ],
        },
        // tableData每个row的值
        rowData: {},
        titles: ["源列表", "目标列表"],
        mode: "transfer", // transfer addressList
        fromData: [],
        toData: [],
        pictureUrl:process.env.VUE_APP_BASE_API + "/file/pm/fastdfs/upload/picture",
        addtype: "add",
        refuseshow: false,
        fileDatas: [],
        addForm: {
          repairType: "",
          type: "",
          creator: null,
          creatorPhone: "",
          creatorName: "",
          location: "",
          content: "",
          submit: true,
          mediaMeta: {
            pictures: [],
            videos: [],
          },
          id: "",
        },
        addFormRules: {
          type: [
            { required: true, message: "请选择工单类型", trigger: "change" },
          ],
          repairType: [
            {
              required: true,
              validator: this.validatetype,
              trigger: ["blur", "change"],
            },
          ],
          creatorName: [
            {
              required: true,
              message: "请输入姓名",
              trigger: ["blur", "change"],
            },
          ],
          creatorPhone: [
            {
              required: true,
              message: "请输入联系电话",
              trigger: ["blur", "change"],
            },
            { validator: this.validatePhoneTwo, trigger: ["blur", "change"] },
          ],
          location: [
            {
              required: true,
              message: "请输入位置信息",
              trigger: ["blur", "change"],
            },
          ],
        },
        createShow: false,
        personId:"",
        userId:"",
        addPersonDis:false,
        sendialogShow:false,
        title1:"添加用户",
        userName:"",
        selectedOptions: [],
        userArr: []
      }
    },
    mounted() {
      this.getAllWork()
      this.getTableData()
      //this.getUserInfo()
      if(this.$route.query.id){
        this.btnChoose = this.$route.query.value;
        this.formSearch.status = this.$route.query.id
        this.onSearch()
      }
    },
    methods: {
      addDialog(){
      this.sendialogShow = true
        // this.$refs.comDeptUsers.init()
        this.addPersonDis = false
    },
    // 获取人员id
    selectClick($e){
      this.userArr = $e
      console.log($e,'$e')
      // this.personId = $e[0]
      // this.userId = $e[0]
    },
    // 添加人员
    onSubmit1() {
      let temp = this.userArr.map(item=>{
        return item.userName
      })
      console.log(temp,"temp")
        this.userName = temp.join(",");
        this.sendialogShow = false
        // getUser1(this.personId).then(res => {
        //     let data = {
        //       name: res.data.userName,
        //       account: res.data.userName,
        //       groups: res.data.dept.deptName
        //     };
        //     console.log(data,'data')
        //     // this.personCharge.push(data)
        //     this.userName = res.data.userName
        //     this.sendialogShow = false
        //     // this.cancel();
        //   });
      },
      cancel1() {
        this.sendialogShow = false;
        // this.getUserInfo();
        // this.$refs.addForm.resetFields()
      },
      changerate(e) {
        if (e > 0) {
          this.$refs.appraise.clearValidate("stars");
        }
      },
      // table多选
      multipleChange(val){
        let temp = val.map(item=>{
          return {alarmCode:item.code,closeReason:""}
        })
        this.multipleArr = temp
      },
      validaterate(rule, value, callback) {
        if (value < 1) {
          callback(new Error("请打出评分(至少一星)"));
        } else {
          callback();
        }
      },
      setItemProgress(data) {
        return parseInt((data.num / this.allWork[0].num).toFixed(2) * 100)
      },
      setItemText(row) {
      if (!row.num) {
        return () => {
          return 0 + "";
        };
      }
      return () => {
        return row.num > 100000 ? (parseInt(row.num/10000) + 'w') : row.num
      };
    },
      // 统计信息
      getAllWork() {
        getAllWarning().then(res=>{
          if(res.code === 200){
            // this.allWork = res.data;
            let obj = res.data
            let temp = []
            for(let key in obj){
              if(key === "totalAmount"){
                temp.push({label:"全部任务", num:obj[key]})
              }else if(key === "todoAmount"){
                temp.push({label:"待处理", num:obj[key]})
              }else if(key === "dongingAmount"){
                temp.push({label:"处理中", num:obj[key]})
              }else if(key === "doneAmount"){
                temp.push({label:"已完成", num:obj[key]})
              }
            }
            this.allWork = temp;
          }else{
            this.$message.info(res.meta.message)
          }
        }).catch(err=>{
          this.$message.error(err.message)
        })
      },
      // btnClick(item) {
      //   //debugger
      //   this.btnChoose = item.label;
      //   this.formSearch.status = this.switchStatus(item.value)
      //   this.getTableData()
      // },
    //   btnclick(item, index) {
    //   this.formSearch.pageNum = 1;
    //   this.btnChoose = item.index;
    //   //this.formSearch.status = item.item.value;
    //   this.getTableData()
    // },
      // switchStatus(value){
      //   switch(value){
      //     case 1: return ""
      //     case 2: return "TODO"
      //     case 3: return "DOING"
      //     case 4: return "DONE"
      //   }
      // },
      // 导出数据
      exportWork(){
        
        if (this.time.length) {
          this.formSearch.startTime = this.time[0]+' 00:00:00';
          this.formSearch.endTime = this.time[1]+' 23:59:59';
        }else {
          this.formSearch.startTime = '';
 	        this.formSearch.endTime = '';
        }

        let data = JSON.parse(JSON.stringify(this.formSearch));
        data.status = data.status === "ALL" ? '' : data.status
        if (data.startTime == "" || data.endTime == "") {
          this.$message.error("请选择需要导出工单的时间段");
        } else {
          download(data)
            .then((res) => {
              this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      },
      getTableData() {
       
        if(this.time.length > 0){
          this.formSearch.startTime = this.time[0]+' 00:00:00';
          this.formSearch.endTime = this.time[1]+' 23:59:59';
        }else {
          this.formSearch.startTime = '';
 	        this.formSearch.endTime = '';
        }
        let data = JSON.parse(JSON.stringify(this.formSearch));
        data.status = data.status === "ALL" ? '' : data.status
        //let obj = getObjByKey(this.permission.searchTable);
        getTableData('/pm/alarm/order/query/criteria', 'get', data).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.total;
            console.log(this.tableData,'11111111111111111111')
          }
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
//      指派
      onSend(data) {
        this.title = "指派";
        this.sendShow = true;
        this.sendWork = data;
        this.userName = ""
        this.userArr = []
      },
//      转派
      onReassignment(data) {
        this.title = "转派";
        this.sendShow = true;
        this.sendWork = data;
      },
//      评价
      onAppraise(data) {
        this.appraiseShow = true;
        this.appraise.workOrderCode = data.code;
        this.appraise.creatorName = data.creatorName;
      },
//      拒绝工单
      onRemove(data) {
        this.title = "拒绝工单";
        this.sendShow = true;
        this.sendWork.workNum = data.workNum;
        this.refuseshow = true;
      },
//      详情
      onDetail(data) {
          this.workPageShow = true;
          this.createWorkShow = false;
          this.workDetailShow = true;
          this.rowData = data;
          this.rowData.toData = this.toData;
          this.allClosemessage = true
      },
      canceltask(){
        this.handleClose();
      },
      // 批量关闭弹窗
      handleClose(){
        this.allClosemessage = false
        this.workPageShow = true;
        this.createWorkShow = true;
        this.workDetailShow = false;
      },
//      编辑
      // onEdit(data) {
      //   this.workPageShow = false;
      //   this.createWorkShow = true;
      //   this.rowData = data;
      //   this.rowData.toData = this.toData;
      // },
      handleCurrentChange() {
        this.getTableData()
      },
//      搜索
      onSearch() {
        this.formSearch.pageNum = 1
        this.getTableData()
      },
//      创建工单
      createWork() {
        this.createShow = true;
        this.rowData = {};
      },
      onReset() {
        this.formSearch = {
          title: "",
          endTime: "",
          startTime: "",
          status: 'ALL',
          pageNum: 1,
          pageSize: 10,
        }
        this.time = []
        this.getTableData();
      },
      workDetailVisibleShow(data) {
        this.workPageShow = data;
        this.createWorkShow = !data;
        this.workDetailShow = !data;
      },
      cancel() {
        this.refuseShow = false;
        this.sendShow = false;
        this.appraiseShow = false;
        this.appraise.stars = 0;
        this.appraise.content = "";
        //this.getUserInfo();
        this.toData = [];
        this.getAllWork();
      },
      handlerChange(file, fileList) {},
      handleRemove(file, fileList) {
        for (var i = 0; i < this.fileDatas.length; i++) {
          if (this.fileDatas[i].uid == file.uid) {
            this.fileDatas.splice(i, 1);
          }
        }
      },
      handlerChangeSuccese(res, file, fileList) {
        if (res.code === 200) {
          this.fileDatas.push({
            uid: file.uid,
            name: file.name,
            path: res.data.path,
          });
        }
      },
      // 转派和指派
      onSubmit() {

        if(this.userArr.length){
          alarmOrderAssign(this.sendWork.id, this.userArr).then(res=>{
              this.$message.success("指派成功");
              this.sendShow = false;
              this.getAllWork();
              this.getTableData();
            
          })
        }else {
          this.$message.error("至少指定一个人");
        }
        // if (this.toData.length == 0) {
        //   // if (this.toData[0].children.length == 1) {
        //     //let chooseusername = this.toData[0].children[0];
        //     let data = {
        //       id: this.sendWork.id,
        //       username:this.userName
        //       //userName : chooseusername.username
        //     };

        //     if (this.title == "指派") {
              
        //     } else if (this.title == "转派") {
        //       messApi.transferOrder(data).then(res => {
        //         if(res.code === 200) {
        //           this.$message.success("转派成功");
        //           this.sendShow = false;
        //            this.getAllWork();
        //           this.getTableData();
        //           //this.cancel();
                 
        //         }
        //       })
        //     }
            
        //   // }
        //   else {
        //     this.$message.error("最多指定一个人");
        //   }
        // }
        // else {
        //   this.$message.error("至少指定一个人");
        // }
      },
      // 评价
      submitAppraise(){
        let data = this.appraise;
        this.$refs.appraise.validate((valid) => {
          if (valid) {
            alarmOrderEvaluate(data).then(res=>{
              if (res.code === 200) {
                this.$message.success("评价成功");
                this.appraiseShow = false;
                this.getTableData();
                this.onCancel();
              } else {
                this.$message.error(res.meta.message);
              }
            })
          }
        })
      },
      // 获取人员信息
      getUserInfo() {
        let data = { pageNum: 1, pageSize: 100, code:"ALARM" };
        getUserinfos(data).then(res => {
            if (res.code === 200) {
                res.data.data.map(item => {
                item.userInfos.map(users => {
                    if (users.username == this.$store.state.user.name) {
                    this.$set(users, "disabled", true);
                    } else {
                    this.$set(users, "disabled", false);
                    }
                });
                });
                this.defaultdata = res.data.data;
                this.fromData = redefineTransfer(res.data.data);
                this.defaultfromData = redefineTransfer(res.data.data);
            }
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      //data 所有的树形数据  selData 已选择的树形数据
      handlerTree(data, selData) {
        for (let i = data.length - 1; i >= 0; i--) {
          for (let j = selData.length - 1; j >= 0; j--) {
            if (data[i] && (data[i].id === selData[j].id)) {
              // 当id相等可以删除的情况 即：没有子级可以删除；
              if (!data[i].children && !selData[j].children) {
                data.splice(i, 1)
              } else {
                this.handlerTree(data[i].children, selData[j].children)
              }
            }
          }
        }
      },
      // 监听穿梭框组件添加
      add(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        if (obj.nodes.length > 1 && toData[0].children.length > 1) {
          this.$message.error("最多指派一个人");
          this.toData = [];
        }
        if (this.toData.length && this.toData[0].children.length > 1) {
          this.toData = this.oldtodata;
          this.$message.error("最多指派一个人");
        } else {
          this.toData = toData;
          this.oldtodata = toData;
        }
        this.handlerTree(fromData, toData)
        if (toData.length) {
          this.toData = toData.filter(item => {
            return item.children.length != 0;
          });
        }
      },
      // 监听左侧选中
      leftChange(nodeObj, treeObj, checkAll){
        if(treeObj.halfCheckedKeys.length){
          treeObj.halfCheckedNodes[0].children.filter(id=>{
            if(id.username !== nodeObj.username){
              this.$set(id, "disabled", true);
            }
          })
        }else{
          this.fromData[0].children.map(users=>{
            if (users.username == this.$store.state.user.name) {
              this.$set(users, "disabled", true);
            } else {
              this.$set(users, "disabled", false);
            }
          })
          // this.fromData = this.fromData
        }
      },
      // 监听穿梭框组件移除
      remove(fromData, toData, obj) {
        if (!toData.length) {
          this.getUserInfo();
        }
        if (toData.length && toData[0].children.length == 0) {
          toData = [];
          this.getUserInfo();
        }
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        this.toData = toData;
      },
      onCancel() {
        this.createShow = false
        this.fileDatas = [];
      },
      //      保存草稿
    saveDraft() {
      this.onSubmitcreate(false);
    },
    sendWorkSetting(){
      this.$router.push('/system/autoSendOrder')
    },
    //     创建工单
    onSubmitcreate(bool) {
      this.addForm.mediaMeta = {
        pictures:null,
        videos:null,
      }
      this.addForm.submit = bool;
      this.addForm.repairType = this.selectedOptions.join("/");
      let obj = {};
      // if (this.addForm.id == "") {
      //   obj = getObjByKey(this.permission.addWorkOrder);
      // } else {
      //   obj = getObjByKey(this.permission.updateWorkOrder);
      // }

      let data = this.addForm;
      data.mediaMeta.pictures = this.fileDatas;

      if (data.mediaMeta) {
        if (data.mediaMeta.pictures && !data.mediaMeta.pictures.length) {
          data.mediaMeta.pictures = null;
        }
        if (data.mediaMeta.videos && !data.mediaMeta.videos.length) {
          data.mediaMeta.videos = null;
        }
        if (!data.mediaMeta.pictures && !data.mediaMeta.videos) {
          data.mediaMeta = null;
        }
      }
      this.$refs.createform.validate((valid) => {
        if (valid) {
          addWorkOrders(obj.url, obj.method, data)
            .then((res) => {
              if (res.code === 200) {
                if (this.addtype == "edit") {
                  this.$message.success("编辑成功");
                } else if (bool) {
                  this.$message.success("添加成功");
                } else {
                  this.$message.success("保存草稿成功");
                }
                this.onCancel();
                this.getTableData();
                this.submit = true;
                this.addtype = "add";
              } else {
                this.$message.error(res.meta.message);
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
    }


  }
</script>


<style lang="scss" scoped>
  .transparent {
    background-color: transparent;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .topinfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 130px;
    //background-color: #202230;
    border-radius: 8px;
    padding: 0 150px 20px;
    p {
      text-align: center;
      color: #666666;
    }
    div {
      display: inline-block;
    }
  }

  .workInfo {
    //background-color: #202230;
    border-radius: 8px;
    padding: 20px;
    margin-top: 10px;
    height: calc(100% - 145px);
    .btnGroups {
      cursor: pointer;
      //background-color: #313448;
      background-color:#f5f7fa;
      border-radius: 30px;
      width: 376px;
      height: 42px;
      text-align: center;
      display: flex;
      justify-content: space-around;
      align-items: center;
      & > div {
        display: inline-block;
      }
      .btn {
        width: 94px;
        height: 42px;
        border-radius: 30px;
        line-height: 42px;
        color: #fff;
      }
      .divActive {
        background-color: #1890ff;
      }
    }

  }

  .color {
    color: #206aff;
  }

  ::v-deep .el-transfer-panel {
    width: 300px;
    //background-color: #202230;
    .el-transfer-panel__header {
      background-color: transparent !important;
      .el-checkbox .el-checkbox__label {
        color: #ffffff !important;
      }
    }
    .el-transfer-panel__body {
      .el-checkbox .el-checkbox__label {
        color: #ffffff !important;
      }
    }
    .el-transfer-panel__filter .el-input__inner {
      width: 90%;
      margin-right: 20px;
    }
  }

  ::v-deep .el-rate {
    padding-top: 5px;
  }

  ::v-deep.el-progress--circle .el-progress__text, .el-progress--dashboard .el-progress__text {
    font-size: 20px !important;
  }

  ::v-deep.wl-transfer .el-tree {
    background-color: inherit;
  }

  ::v-deep.wl-transfer .transfer-title {
    background-color: inherit;
    color: #fff;
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
    stroke: rgb(229, 233, 242);
  }
  ::v-deep .el-table.el-table--fit{
  overflow: hidden;
}
::v-deep .wl-transfer .transfer-left {
  border: 2px solid rgba(255, 255, 255, 0.04);
}

::v-deep .wl-transfer .transfer-right {
  border: 2px solid rgba(255, 255, 255, 0.04);
}
 ::v-deep .heights > .el-dialog__wrapper .el-dialog .el-dialog__body {
    //height: 60vh !important;
    overflow: auto !important;
    margin-bottom:20px;
  }
  ::v-deep.wl-transfer .transfer-title {
  background-color: inherit;
  
  font-size: 14px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
}
</style>
