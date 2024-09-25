<template>
  <div class="app-container-bow">
    <div v-if="workPageShow" style="height: 100%">
      <div class="workInfo">
        <Tabs @btnclick="btnclick($event)" :btnGroup="btnGroup" :btnChoose="btnChoose" :singleWidth="94"/>
        <div style="margin-top:20px">
          <el-form ref="formSearch" inline v-model="formSearch">
            <el-form-item prop="workOrderCode">
              <el-input placeholder="请输入工单编号" clearable v-model="formSearch.workOrderCode"></el-input>
            </el-form-item>
            <el-form-item prop="creatorName">
              <el-input placeholder="请输入提单人姓名" clearable v-model="formSearch.creatorName"></el-input>
            </el-form-item>
            <el-form-item prop="repairWorkOrderType">
              <el-select placeholder="请选择工单类型" clearable v-model="formSearch.repairWorkOrderType">
                <el-option
                  v-for="(item,index) in workType"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                >{{item.label}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="time"
                type="daterange"
                 :clearable="false"
                value-format="yyyy-MM-dd"
                style="width: 240px"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
              <el-button plain icon="el-icon-refresh" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <highlight-square class="highlight-height-table-new">
          <template v-slot:child>
            <el-table :data="tableData" height="588px">
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
              <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                <span v-if="scope.row.status == 'doing'">
                  <el-button @click="onReassignment(scope.row)" type="text">转单</el-button>
                  <el-button @click="onRefuseWork(scope.row)" type="text">拒绝工单</el-button>
                  <el-button @click="onFeedBack(scope.row)" type="text">反馈工单</el-button>
                  <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                </span>
                  <span v-if="scope.row.status == 'done'">
                  <el-button @click="onDetail(scope.row)" type="text">详情</el-button>
                </span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination
              v-show="tableData && tableData.length > 0"
              @pagination="handleCurrentChange"
              :page.sync="formSearch.pageNum"
              :pageSizes="[10, 20, 40]"
              :limit.sync="formSearch.pageSize"
              :total="total"
            />
          </template>
        </highlight-square>
      </div>
    </div>
    <div v-else-if="workDetailShow" style="height: 100%">
      <workdetail ref='workDetail' :rowData='rowData' @workDetailVisibleShow='workDetailVisibleShow'></workdetail>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="sendShow"
      width="40%"
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
                  v-for="(item,index) in type"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                >{{item.name}}
                </el-option>
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
              <tree-transfer :title="titles" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}"
                             @add-btn='add' @remove-btn='remove' :mode='mode' height='320px' filter openAll>
              </tree-transfer>
              <p style="color: #afb9d0">最多指派一个人员</p>
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
      width="40%"
    >
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
                  v-for="(item,index) in type"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                >{{item.name}}
                </el-option>
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
    <div class="feedback">
      <el-dialog
        title="反馈结果"
        :visible.sync="feedbackShow"
        width="40%"
        destroyOnClose
      >
        <el-row>
          <el-form label-width="100px" :model="feedbackform" :rules="feedbackrules" ref="feedback">
            <el-col :span="24">
              <el-form-item label="工单编号" style="width: 50%">
                <el-input v-model="feedbackform.code" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单类型" prop="type">
                <el-select v-model="feedbackform.type" disabled>
                  <el-option
                    v-for="(item,index) in type"
                    :key="index"
                    :value="item.value"
                    :label="item.name"
                  >{{item.name}}
                  </el-option>
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
                <el-input v-model="feedbackform.fees"/>
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
        <div slot="footer" >
          <el-button type="primary" @click="feedback()">确定</el-button>
          <el-button plain @click="cancel()">取消</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import pagination from '@/components/comPagination'
  import workdetail from '../components/workdetail'
  import treeTransfer from 'el-tree-transfer'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
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
  export default {
    components: {
      pagination,
      workdetail,
      treeTransfer,
      Tabs
    },
    data() {
      return {
        pictureUrl: process.env.VUE_APP_BASE_API + '/file/pm/fastdfs/upload/picture',
        pictureVideo: process.env.VUE_APP_BASE_API + '/file/pm/fastdfs/upload/file',
        permission: {
          searchWorkOrder: 'smartProperty::workManagement::searchWorkorder',
          searchWorkOrderNum: 'smartProperty::workManagement::searchWorkorderNum',
          transferWorkOrder: 'smartProperty::workManagement::transferWorkorder',
          refuseWorkOrder: 'smartProperty::workManagement::refuseWorkOrder',
          assignWorkOrder: 'smartProperty::workManagement::assignWorkOrder',
          evaluteWorkOrder: 'smartProperty::workManagement::evaluteWorkOrder',
          downloadWorkOrder: 'smartProperty::workManagement::downloadWorkOrder',
          searchUserInfo: 'alarmCenter::warningeventConfig::searchUserInfo',
          getuserall: 'system::user::getuser',
          feedbackWorkOrder: 'smartProperty::workManagement::feedbackWorkOrder',
        },

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
        btnGroup: [
          {
            value: 'ALL',
            label: "全部"
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
        btnChoose: "全部",
        workType: [
          {
            value: "ENTERPRISE",
            label: "企业报修"
          },
          {
            value: "PUBLIC",
            label: "公共报修"
          }
        ],
        formSearch: {
          creatorName: "",
          workOrderCode: "",
          processor: "",
          repairWorkOrderType: "",
          startTime: "",
          endTime: "",
          status: "",
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
        oldtodata: [],
        defaultfromData: [],
        defaultdata: [],
        toData: [],
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
        dictionary: ['repair_work_order_type'],
        type: [],
      }
    },

    mounted() {
      this.getTableData();
      this.username = this.$store.state.user.name;
      this.formSearch.processor = this.$store.state.user.name;
      this.getUserInfo();
      this.getdict();
    },
    methods: {
      //      获取字典
      getdict() {
        this.dictionary.forEach(item => {
          get(item).then(res => {
            this.$set(this, 'type', [...res.data]);
            let data = res.data.map(result => {
              return {
                value: result.value.toUpperCase(),
                name: result.name
              };
            });
            this.$set(this, 'workType', [...data]);
          })
        });
      },
      getUserInfo() {
        let data = {pageNum: 1, pageSize: 100};
        getUserinfos(data).then(res => {
          this.defaultdata = res.data.data;
          this.fromData = redefineTransfer(res.data.data);
          this.defaultfromData = redefineTransfer(res.data.data);
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
      btnclick(e) {
        this.value = e.index;
        this.btnChoose = e.item.label;
        this.formSearch.status = e.item.value;
        this.getTableData();
      },

      getTableData() {
        let obj = getObjByKey(this.permission.searchWorkOrder);
        if (this.time.length) {
          this.formSearch.startTime = this.time[0];
          this.formSearch.endTime = this.time[1];
        }
        if (this.formSearch.status === "ALL") {
          this.formSearch.status = "";
        }
        let data = this.formSearch;
        initTabData(obj.url, obj.method, data).then(res => {
          console.log(res, 'res');
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
        this.sendWork = data;
      },
//      提交派单和转单
      onSubmit() {
        if (this.toData.length != 0) {
          if (this.toData[0].children.length == 1) {
            let chooseusername = this.toData[0].children[0];
            let data = {
              id: this.sendWork.id,
              username: chooseusername.username
            };
            let obj = {};
            if (this.title == "派单") {
              obj = getObjByKey(this.permission.assignWorkOrder);

            } else if (this.title == "转单") {
              obj = getObjByKey(this.permission.transferWorkOrder);
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
            this.$message.error("最多指定一个人");
          }
        }
        else {
          this.$message.error("至少指定一个人");
        }
      },
      onRefuseWork(data) {
        this.title = "拒绝工单";
        this.refuseShow = true;
        this.refuseWork.workNum = data.workNum;
        this.refuseWork = data;
      },
      onRefuse() {
        let obj = getObjByKey(this.permission.refuseWorkOrder);
        let data = {
          reason: this.refuseWork.reason,
          orderCode: this.refuseWork.code,
        };
        this.$refs.refuseWork.validate((valid) => {
          if (valid) {
            refuseWorkOrder(obj.url, obj.method, data).then(res => {
              this.$message.success("拒绝成功");
              this.refuseShow = false;
              this.getTableData();
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
        this.rowData.toData = this.toData;
      },
//      反馈
      onFeedBack(data) {
        this.feedbackShow = true;
        this.feedbackform = data;
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
        console.log(this.feedbackform.result, '124124');
        let data = {
          fees: this.feedbackform.fees,
          orderCode: datas.code,
          result: this.feedbackform.result != undefined ? this.feedbackform.result : '',
          mediaMeta: this.mediaMeta,
        };
        this.$refs.feedback.validate((valid) => {
          if (valid) {
            let obj = getObjByKey(this.permission.feedbackWorkOrder);
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
        this.getUserInfo()
        this.toData = [];
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
          processor: this.username,
          repairWorkOrderType: "",
          startTime: "",
          endTime: "",
          status: "",
          pageNum: 1,
          pageSize: 10,
        };
        this.time = [];
        this.btnChoose = "全部";
        this.getTableData();
      },
      workDetailVisibleShow(data) {
        this.workPageShow = data;
        this.createWorkShow = !data;
        this.workDetailShow = !data;
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
        console.log(fileListVideo, 'fileListVideo');
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
  .transparent {
    background-color: transparent;
    padding: 0;
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

  .el-form .el-select {
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
    height: auto;
  }

  ::v-deep .feedback > .el-dialog__wrapper .el-dialog .el-dialog__body {
    height: 60vh !important;
    overflow: auto !important;
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
</style>
