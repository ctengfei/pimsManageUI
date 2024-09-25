<template>
  <div>
    <div style="margin-top:20px">
      <el-form ref="formSearch" inline v-model="formSearch">
        <el-form-item prop="workOrderCode" label="工单编号">
          <el-input placeholder="请输入工单编号" clearable v-model="formSearch.workOrderCode"></el-input>
        </el-form-item>
        <el-form-item prop="creatorName" label="提单人姓名">
          <el-input placeholder="请输入提单人姓名" clearable v-model="formSearch.creatorName"></el-input>
        </el-form-item>
        <el-form-item prop="repairWorkOrderType" label="工单类型">
          <el-select placeholder="请选择工单类型" clearable v-model="formSearch.repairWorkOrderType">
            <el-option
              v-for="item in dict.type.repair_work_order_type"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
          <el-button plain icon="el-icon-refresh" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
      <div style="height:calc(100vh - 465px)">
        <el-table :data="tableData">
          <el-table-column prop="code" label="工单编号" showOverflowTooltip></el-table-column>
          <el-table-column prop="type" label="工单类型" showOverflowTooltip>
            <template slot-scope="scope">
              {{scope.row.type == 'public' ? "公共报修" : "企业报修"}}
            </template>
          </el-table-column>
          <el-table-column prop="content" label="描述信息" showOverflowTooltip></el-table-column>
          <el-table-column prop="location" label="位置信息" showOverflowTooltip></el-table-column>
          <el-table-column prop="creatorName" label="提单人" showOverflowTooltip></el-table-column>
          <el-table-column prop="creatorPhone" label="联系电话" showOverflowTooltip></el-table-column>
          <el-table-column prop="submitTime" label="提交时间" showOverflowTooltip>
          </el-table-column>
          <el-table-column prop="status" label="工单状态" showOverflowTooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'draft'">草稿</span>
              <span v-if="scope.row.status == 'todo'">待接单</span>
              <span v-if="scope.row.status == 'doing'">处理中</span>
              <span v-if="scope.row.status == 'done'">已完成</span>
              <span v-if="scope.row.status == 'not_evaluation'">待评价</span>
              <span v-if="scope.row.status == 'cancel'">已取消</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" class-name="small-padding fixed-width">
            <template slot-scope="scope">
            <span v-if="scope.row.status == 'doing'">
              <el-button @click="onReassignment(scope.row)" type="text">转单</el-button>
              <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
              <el-dropdown @command="(command) => handleCommand(command, scope.row)">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="onRefuseWork">拒绝工单</el-dropdown-item>
                  <el-dropdown-item command="onFeedBack">反馈工单</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
            </span>
              <span v-if="scope.row.status == 'done'">
              <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
            </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          style="margin-top:0"
          v-show="tableData && tableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="formSearch.pageNum"
          :pageSizes="[10, 20, 40]"
          :limit.sync="formSearch.pageSize"
          :total="total"
        />
      </div>
    <!-- <div v-else-if="workDetailShow" style="height: 100%;overflow:auto">
      <workdetail ref='workDetail' :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow'></workdetail>
    </div> -->
    <el-dialog title="工单详情" :visible.sync="workDetailShow" width="600px">
      <workdetail ref='workDetail' v-if="workDetailShow" :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow'></workdetail>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="sendShow"
      width="600px"
    >
      <el-row>
        <el-form label-width="80px">
          <el-col :span="24">
            <el-form-item label="工单编号" style="width: 50%">
              <el-input v-model="sendWork.code" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单类型">
              <el-select v-model="sendWork.type" disabled>
                <el-option
                  v-for="item in dict.type.repair_work_order_type"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修分类">
              <el-select v-model="sendWork.repairType" disabled>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提单人">
              <el-input v-model="sendWork.creatorName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="sendWork.creatorPhone" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="title=='转单'">
            <el-form-item label="接单人员">
              <el-input v-model="sendWork.processor" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="title=='转单'">
            <el-form-item label="师傅电话">
              <el-input v-model="sendWork.processorPhone" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置信息">
              <el-input v-model="sendWork.location" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="分配人员">
              <div style="display: flex;justify-content: space-between;">
                <p style="margin: 0;">{{ username?username:'尚未选择用户'}}</p>
                <el-button type="primary" @click="addDialog" :disabled="addPersonDis">选择用户</el-button>
              </div>
              <!-- <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/> -->
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <div slot="footer">
        <el-button type="primary" @click="onSubmit()">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
    <!--拒绝-->
    <el-dialog
      title="拒绝工单"
      :visible.sync="refuseShow"
      width="600px">
      <el-row>
        <el-form label-width="80px" :model="refuseWork" ref="refuseWork" :rules="refuseWorkrules">
          <el-col :span="24">
            <el-form-item label="工单编号" style="width: 50%">
              <el-input v-model="refuseWork.code" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单类型">
              <el-select v-model="refuseWork.type" disabled>
                <el-option
                  v-for="item in dict.type.repair_work_order_type"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修分类">
              <el-select v-model="refuseWork.repairType" disabled>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提单人">
              <el-input v-model="refuseWork.creatorName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="refuseWork.creatorPhone" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置信息">
              <el-input v-model="refuseWork.location" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="拒绝理由" prop="reason">
              <el-input type="textarea" :rows="2" v-model="refuseWork.reason"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="onRefuse()">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
    <!--反馈-->
      <el-dialog
        title="反馈结果"
        :visible.sync="feedbackShow"
        width="600px"
        destroyOnClose>
        <el-row>
          <el-form label-width="80px" :model="feedbackform" :rules="feedbackrules" ref="feedback">
            <el-col :span="24">
              <el-form-item label="工单编号" style="width: 50%">
                <el-input v-model="feedbackform.code" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单类型" prop="type">
                <el-select v-model="feedbackform.type" disabled>
                  <el-option
                    v-for="item in dict.type.repair_work_order_type"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报修分类" prop="repairType">
                <el-select v-model="feedbackform.repairType" disabled>
                  <el-option
                    v-for="(item,index) in repairWorkOrderType"
                    :label="item.label"
                    :key="index"
                    :value="index"
                  >{{item.label}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业主名称" prop="creatorName">
                <el-input v-model="feedbackform.creatorName" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="creatorPhone">
                <el-input v-model="feedbackform.creatorPhone" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接单人员">
                <el-input v-model="feedbackform.processor" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="师傅电话" prop="processorPhone">
                <el-input v-model="feedbackform.processorPhone" disabled/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="位置信息" prop="location">
                <el-input v-model="feedbackform.location" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维修费用" prop="fees">
                <!-- <el-input v-model="feedbackform.fees"/> -->
                <el-input-number v-model="feedbackform.fees" :min="0" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="上传图片" prop="picture">
                <el-upload
                  ref="uploadimg"
                  :action="pictureUrl"
                  :file-list="fileListImg"
                  :on-change="onChangeImg"
                  :on-remove="onRemoveImg"
                  :on-success="onSuccessImg"
                  list-type="picture-card"
                  :on-exceed="handleExceedImg"
                  :limit="3"
                >
                  <div slot="tip" class="el-upload__tip">
                    {{imgMessage}}
                  </div>
                  <i slot="default" class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="上传视频">
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
            </el-col>
            <el-col>
              <el-form-item label="维修结果描述">
                <el-input type="textarea" :rows="2" v-model="feedbackform.result"/>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer">
          <el-button type="primary" @click="feedback()">确定</el-button>
          <el-button plain @click="cancel()">取消</el-button>
        </div>
      </el-dialog>
    <el-dialog
      title="选择用户"
      :visible.sync="sendialogShow"
      width="850px"
      :before-close="cancel1"
    >
      <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/>
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
  import workdetail from './workdetail'
  import {
    initTabData,
    refuseWorkOrder,
    getNumData,
    appraiseWorkOrder,
    getUserinfos,
    assignOrder,
    transferOrder,
    feedback,
    downloadworkOrder
  } from '@/api/smartProperty/workManagement'
  import {redefineTransfer} from '@/utils/index';
  import {get} from "@/api/system/dicttype";
  import Tabs from '@/components/commonTabs'
  import ComDeptUser from "@/components/comDeptUser"
  import { getUser } from "@/api/system/user";
  export default {
    components: {
      pagination,
      workdetail,
      ComDeptUser,
      Tabs
    },
    dicts: ['repair_work_order_type'],
    props:["progess"],
    data() {
      return {
        pictureUrl: process.env.VUE_APP_BASE_API + '/file/pm/fastdfs/upload/picture',
        pictureVideo: process.env.VUE_APP_BASE_API + '/file/pm/fastdfs/upload/file',
        videoFlag: false,
        //是否显示进度条
        videoUploadPercent: "",
        //进度条的进度，
        isShowUploadVideo: false,
        //显示上传按钮
        showVideoPath: "",
        feedbackShow: false,
//        转单派单拒绝dialog
        sendShow: false,
//        主页展示
        workPageShow: true,
//        查看详情组件展示
        workDetailShow: false,
        formSearch: {
          creatorName: "",
          workOrderCode: "",
          processor: "",
          repairWorkOrderType: "",
          startTime: "",
          endTime: "",
          status: "DOING",
          pageNum: 1,
          pageSize: 10,
        },
        total: 0,
        tableData: [],
//        转单or派单
        title: "",
//        全部人员名单
        people: [],
        sendWork: {
//        选择人员名单
          workPeople: [],
          workNum: ''
        },
        // tableData每个row的值
        rowData: {},
        titles: ["人员列表", "选择列表"],
        mode: "transfer", // transfer addressList
        fromData: [],
        // oldtodata: [],
        defaultfromData: [],
        defaultdata: [],
        // toData: [],
        refuseShow: false,
        withParameters: false,
        fileListImg: [],
        fileListVideo: [],
        imgMessage: '上传图片只能是 jpg/png格式!',
        videoMessage: '上传视频只能是mp4,ogg,flv,avi,wmv,rmvb格式!',
        feedbackform: {
          fees: '',
          orderCode: '',
          result: '',
        },
        mediaMeta: {
          pictures: [],
          videos: []
        },
        imgUrl: [],
        uploadUrl: "",
        videoUrl: "",
        editDisabled: false,
        uploadVideoDisabled: false,
        repairTypes: [],
        time: [],
        username: '',
        addPersonDis:false,
        repairWorkOrderType: [],
        refuseWork: {},
        refuseWorkrules: {
          reason: [
            {required: true, message: '请输入拒绝理由', trigger: 'blur'},
          ],
        },
        feedbackrules: {
          code: [
            {required: true},
          ],
          type: [
            {required: true},
          ],
          repairType: [
            {required: true},
          ],
          creatorName: [
            {required: true},
          ],
          creatorPhone: [
            {required: true}
          ],
          processorPhone: [
            {required: true}
          ],
          location: [
            {required: true}
          ],
          fees: [
            {required: true, message: '请输入维修费用', trigger: 'blur'},
          ],
        },
        sendialogShow:false,
      }
    },

    mounted() {
        // this.username = this.$store.state.user.name;
        this.formSearch.processor = this.$store.state.user.name;
        this.getTableData();
    },
    methods: {
      addDialog(){
        this.sendialogShow = true
        this.$refs.comDeptUsers.init()
        this.addPersonDis = false
      },
    // 添加人员
    onSubmit1() {
        getUser(this.personId).then(res => {
            this.username = res.data.userName
            this.cancel1()
          });
      },
      cancel1() {
        this.sendialogShow = false;
      },
      // 更多操作触发
      handleCommand(command, row) {
        switch (command) {
          case "onRefuseWork":
            this.onRefuseWork(row);
            break;
          case "onFeedBack":
            this.onFeedBack(row);
            break;
          default:
            break;
        }
      },
        //树节点 disabled 设置已加入清单的为禁用状态  addSyncData为已经加入清单的数据
      disabledFn(data, node) {
        return data.disabled;
      },
      selectClick($e){
        this.personId = $e[0]
        this.userId = $e[0]
      },
      getTableData() {
        let obj = {url: "/pm/repair/order/query/criteria", method: "GET"};
        if (this.time.length) {
          this.formSearch.startTime = this.time[0];
          this.formSearch.endTime = this.time[1];
        }
        if (this.formSearch.status === "ALL") {
          this.formSearch.status = "";
        }
        let data = this.formSearch;
        initTabData(obj.url, obj.method, data).then(res => {
            this.tableData = res.data.data;
            this.total = res.data.total;
          
        }).catch(err => {
          this.$message.error(err.message);
        });
      },
      //      转派
      onReassignment(data) {
        this.title = "转单";
        this.sendShow = true;
        this.sendWork = JSON.parse(JSON.stringify(data));
        this.sendWork.type = this.sendWork.type.toUpperCase()
        this.$refs.comDeptUsers.init()
      },
//      提交派单和转单
      onSubmit() {
        if (this.username) {
          let data = {
            id: this.sendWork.id,
            username: this.username
          };
          let obj = {};
          if (this.title == "派单") {
            obj = {url: "/pm/repair/order/assign", method: "POST"};

          } else if (this.title == "转单") {
            obj = {url: "/pm/repair/order/transfer", method: "POST"};
          }
          assignOrder(obj.url, obj.method, data).then(res => {
            
              if (this.title == "派单") {
                this.$message.success("派单成功");
              } else if (this.title == "转单") {
                this.$message.success("转派成功");
              }
              this.sendShow = false;
              this.cancel();
              this.getTableData();
          })
        }
        else {
          this.$message.error("至少指定一个人");
        }
      },
      onRefuseWork(data) {
        this.title = "拒绝工单";
        this.refuseShow = true;
        this.refuseWork.workNum = data.workNum;
        this.refuseWork = JSON.parse(JSON.stringify(data));
        this.refuseWork.type = this.refuseWork.type.toUpperCase()
      },
      onRefuse() {
        let obj = {url: "/pm/repair/order/refuse", method: "POST"};
        let data = {
          reason: this.refuseWork.reason,
          orderCode: this.refuseWork.code,
        };
        this.$refs.refuseWork.validate((valid) => {
          if (valid) {
            refuseWorkOrder(obj.url, obj.method, data).then(res => {
              if (res.code === 200) {
                this.$message.success("拒绝成功");
                this.refuseShow = false;
                this.getTableData();
              } else {
                this.$message.error("拒绝失败");
              }
            })
          } else {
            this.$message.warning("请填写拒绝理由")
          }
        })
      },
//      详情
      onDetail(data) {
        this.workPageShow = false;
        this.workDetailShow = true;
        this.rowData = data;
        // this.rowData.toData = this.toData;
        // this.$emit('update:progess', false)
      },
//      反馈
      onFeedBack(data) {
        this.feedbackShow = true;
        this.feedbackform = JSON.parse(JSON.stringify(data));
        this.feedbackform.type = this.feedbackform.type.toUpperCase()
      },

      feedback() {
        let datas = this.feedbackform;
        if (!this.mediaMeta || (this.mediaMeta.pictures.length == 0 && this.mediaMeta.videos.length == 0)) {
          this.mediaMeta = null;
        } else if (this.mediaMeta.pictures.length == 0) {
          this.mediaMeta.pictures = null;
        } else if (this.mediaMeta.videos.length == 0) {
          this.mediaMeta.videos = null;
        }
        let data = {
          fees: this.feedbackform.fees,
          orderCode: datas.code,
          result: this.feedbackform.result != undefined ? this.feedbackform.result : '',
          mediaMeta: this.mediaMeta,
        };
        this.$refs.feedback.validate((valid) => {
          if (valid) {
            let obj = {url: "/pm/repair/order/feedback", method: "POST"};
            feedback(obj.url, obj.method, data).then(res => {
              
                this.$message.success("反馈成功");
                this.feedbackShow = false;
                this.getTableData();
            })
          }
        })
      },
//      dialog取消
      cancel() {
        this.refuseShow = false;
        this.sendShow = false;
        this.appraiseShow = false;
        this.feedbackShow = false;
        this.getTableData();
        this.refuseWork.reason = "";
        // this.toData = [];
        this.username = ''
      },

      handleCurrentChange() {
        this.getTableData();
      },
      //      搜索
      onSearch() {
        this.getTableData();
      },
      onReset() {
        this.formSearch = {
          creatorName: "",
          workOrderCode: "",
          processor: this.$store.state.user.name,
          repairWorkOrderType: "",
          startTime: "",
          endTime: "",
          status: "DOING",
          pageNum: 1,
          pageSize: 10,
        };
        this.time = [];
        this.getTableData();
      },
      workDetailVisibleShow(data) {
        this.workPageShow = data;
        this.createWorkShow = !data;
        this.workDetailShow = !data;
        // this.$emit('update:progess', data)
      },
      onChangeImg(file, fileListImg) {
//        文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        const isJPG = file.raw.type === "image/jpeg" || file.raw.type === "image/png";
        const isLt5M = file.raw.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error(this.imgMessage);
          fileListImg.pop();
          return false;
        }
        if (!isLt5M) {
          this.$message.error("上传图片大小不能超过 5MB!");
          fileListImg.pop();
          return false;
        }
        return isJPG && isLt5M;
      },
      onRemoveImg(file, fileListImg) {
//        file是被删除的文件,fileListImg是剩下的文件列表
      },

      onSuccessImg(response, file, fileList) {
        
          this.mediaMeta.pictures.push(response.data)
        
      },

//
//      onSuccessImg(file) {
//        console.log(file);
////        this.ruleForm.dialogImageUrl.push(file);
////        this.dialogVisible = false;
//      },
      handleExceedImg() {
        this.$message.error("最多上传三张图片");
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
        
          this.mediaMeta.videos.push(response.data)
        
        //获取上传图片地址赋值给视频的src回显
      }
    }


  }
</script>


<style lang="scss" scoped>
::v-deep .el-input-number--small {
  width: 100%;
}
  .transparent {
    background-color: transparent;
    padding: 0;
    overflow-y: hidden;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .workInfo {
    background-color: #202230;
    border-radius: 8px;
    padding: 20px;
    margin-top: 10px;
    height: 100%;
    .btnGroups {
      cursor: pointer;
      background-color: #313448;
      border-radius: 30px;
      width: 282px;
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
        
        font-size: 14px;
      }
      .divActive {
        background-color: #206aff;
        color: #fff;
      }
    }

  }

  .color {
    color: #206aff;
  }

  ::v-deep .el-transfer-panel {
    width: 300px;
    background-color: #202230;
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
    font-size: 30px !important;
  }

  ::v-deep.wl-transfer .el-tree {
    background-color: inherit;
  }

  ::v-deep.wl-transfer .transfer-title {
    background-color: inherit;
    color: #fff;
  }

  .el-form .el-select  {
    width: 100%;
  }

  ::v-deep.el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }

  // ::v-deep.el-range-editor--small .el-range-separator {
  //   line-height: 34px;
  // }

  .video-avatar {
    width: inherit;
    height: inherit;
  }

  ::v-deep .wl-transfer .transfer-left {
    border: 2px solid rgba(255, 255, 255, .04);
  }

  ::v-deep .wl-transfer .transfer-right {
    border: 2px solid rgba(255, 255, 255, .04);
  }

  ::v-deep.wl-transfer .transfer-title {
    background-color: inherit;
    
    font-size: 14px;
    border-bottom: 2px solid rgba(255, 255, 255, .04);
  }

   ::v-deep .heights > .el-dialog__wrapper .el-dialog .el-dialog__body {
    height: 60vh !important;
    overflow: auto !important;
    margin-bottom:20px;
  }
  
</style>
