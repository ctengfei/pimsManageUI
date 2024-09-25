<template>
  <div class="app-container-gis">
    <div style="height: calc(100vh - 86px)">
      <div id="cesiumContainer">
        <gis-map
          ref="gisMap"
          @mapReady="mapReady"
          @deviceInfo="deviceInfo"
        ></gis-map>
        <el-button type="primary" class="mainButton" @click="onAdd"
          >创建计划</el-button
        >
        <!-- 联动列表 -->
        <div class="leftBox" v-if="contentShow">
          <div class="seachBox">
            <el-input
              v-model="formSeach.carOwner"
              placeholder="请输入名称"
              clearable
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="onSearch"
              >搜索</el-button
            >
          </div>
          <div class="addBox">
            <div v-if="roundList && roundList.length > 0">
              <div
                class="listArr"
                v-for="(item, index) in roundList"
                :key="index"
              >
                <div class="listTop">
                  <div class="listLeft">
                    <div class="titleHand">【 {{ item.planName }} 】</div>
                    <div class="boxtitle">
                      {{ item.startTime.split(" ")[0] }}~{{
                        item.endTime.split(" ")[0]
                      }}
                    </div>
                    <div class="boxtitle">{{ item.handler }}</div>
                  </div>
                  <div class="listRight">
                    <div
                      :class="[
                        'cricle',
                        !item.activeStatus ? 'greenCircle' : 'redCircle',
                      ]"
                      @click="startStatus(item)"
                    >
                      {{ !item.activeStatus ? "启用" : "停用" }}
                    </div>
                  </div>
                </div>
                <div class="listBottom">
                  <div class="editCrea" @click="editCrea(item.id)">
                    <i class="el-icon-edit-outline"></i>
                  </div>
                  <div @click="delCrea(item.id)">
                    <i class="el-icon-delete"></i>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div
                class="el-table__empty-block"
                style="height: 50vh; width: 340px"
              >
                <span class="el-table__empty-text">暂无数据</span>
              </div>
            </div>
          </div>
          <div>
            <pagination
              v-if="roundList && roundList.length > 0"
              style="margin-top: 0px"
              small
              @pagination="handleCurrentChange"
              :page.sync="pageNum"
              :pageSizes="[10, 20, 30, 40]"
              :limit.sync="pageSize"
              :layout="'total, prev, pager, next'"
              :total="total"
            />
          </div>
        </div>
        <!-- 新增规则 -->
        <div class="rightBox" v-if="addFormShow" style="overflow-y: scroll">
          <div
            style="
              height: 36px;
              line-height: 36px;
              border-radius: 6px;
              background: #313448;
              color: #fff;
              padding-left: 20px;
              margin-bottom: 10px;
            "
          >
            {{ addFromTitle }}
          </div>
          <el-form :model="cameraForm" ref="addForm" label-width="80px">
            <el-form-item
              label="计划名称"
              prop="planName"
              :rules="[
                { required: true, message: '请输入名称', trigger: 'blur' },
              ]"
            >
              <el-input v-model="cameraForm.planName"></el-input>
            </el-form-item>
            <el-form-item
              label="巡更时间"
              prop="position"
              :rules="[
                { required: true, message: '请选择时间', trigger: 'blur' },
              ]"
            >
              <!-- <el-input v-model="cameraForm.position"></el-input> -->
              <el-date-picker
                style="width: 100%"
                v-model="cameraForm.position"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                start-placeholder="开始时间"
                :picker-options="pickerOptions"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div class="tableBox">
            <div class="tableBoxTitle">
              <span>选择摄像机</span>
              <div>
                <span
                  class="addCarmea"
                  :class="addActive ? 'carActives' : ''"
                  @click="addCarmea"
                  ><i class="el-icon-plus"></i>添加</span
                >
                <span @click="setClock"
                  ><i class="el-icon-s-tools"></i>设置</span
                >
              </div>
            </div>
            <el-table
              height="250"
              :data="addForm.TableData"
              style="width: 100%"
            >
              <el-table-column class="tablecol" label="序号" width="50">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                label="摄像机"
                show-overflow-tooltip
                prop="deviceName"
                width="100"
              >
              </el-table-column>
              <el-table-column
                label="巡逻时间"
                show-overflow-tooltip
                prop="duration"
                width="140"
              >
                <template slot-scope="scope">
                  <!-- <div>{{scope.row.number}}</div> -->
                  <el-input-number
                    v-model="scope.row.duration"
                    controls-position="right"
                    @change="handleChange(scope.row)"
                    :min="10"
                    :max="600"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="tableOperation">
                    <el-button
                      type="text"
                      @click="deleteCamera(scope.$index, scope.row)"
                      style="color: #f05656"
                      >删除</el-button
                    >
                    <!-- <div class="vedio" @click="vedioDial"> -->
                    <div class="vedio">
                      <img alt="" style="width: 12px" />
                    </div>
                    <div
                      class="up"
                      @click.prevent="riseDays(scope.$index, scope.row)"
                      v-if="scope.$index !== 0"
                    >
                      ↑
                    </div>
                    <div
                      class="down"
                      @click.prevent="dropDays(scope.$index, scope.row)"
                      v-if="scope.$index !== addForm.TableData.length - 1"
                    >
                      ↓
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="tableBox">
            <div class="tableBoxTitle">
              <span>选择负责人</span>
              <span @click="addDialog" :disabled="addPersonDis"
                ><i class="el-icon-plus"></i>添加</span
              >
            </div>
            <el-table height="250" :data="personCharge" style="width: 100%">
              <el-table-column label="序号" width="60">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="姓名" show-overflow-tooltip prop="name">
              </el-table-column>
              <el-table-column
                label="账号"
                show-overflow-tooltip
                prop="account"
              >
              </el-table-column>
              <el-table-column
                label="工作组"
                show-overflow-tooltip
                prop="groups"
              >
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="tableOperation">
                    <el-button
                      type="text"
                      @click="deletePerson(scope.$index, scope.row)"
                      style="color: #f05656"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="submitButton">
            <el-button plain @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit1">确认</el-button>
          </div>
        </div>
        <!-- 摄像机详情 -->
        <div class="cameraBox" v-if="cameraShow">
          <i class="el-icon-close" @click="cameraShow = false"></i>
          <el-form :model="cameraForm" label-width="100px">
            <el-form-item label="摄像机名称">
              <el-input v-model="cameraForm.planName" disabled></el-input>
            </el-form-item>
            <el-form-item label="位置">
              <el-input v-model="cameraForm.position" disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="nowVidoe">实时视频</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 实时视频 -->
        <div class="bigVideo" v-if="videoShow">
          <template>
            <div class="title">
              实时监控
              <i class="el-icon-close" @click="videoShow = false"></i>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 选择负责人 -->
    <el-dialog
      :title="title"
      :visible.sync="sendShow"
      width="850px"
      append-to-body
      class="clearColor"
      :before-close="cancel"
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

          <ComDeptUser ref="comDeptUsers" @selectClick="selectClick" />
        </el-col>
      </el-row>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="onSubmit()">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
    <!-- 摄像机选择 -->
    <el-dialog
      title="设置"
      :visible.sync="carmeaShow"
      width="400px"
      :before-close="carmeCancel"
    >
      <el-row :gutter="20">
        <el-form
          label-width="180px"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <el-col>
            <el-form-item label="打卡次数（次）" prop="numTime">
              <el-select v-model="ruleForm.numTime" placeholder="请选择">
                <el-option
                  v-for="item in carmeaNum"
                  :key="item.value"
                  :label="item.id"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批量设置巡航时间（秒）" prop="seconds">
              <el-input-number
                v-model="ruleForm.seconds"
                controls-position="right"
                @change="handleChanges"
                :min="10"
                :max="600"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="carmeSubmit()">确定</el-button>
        <el-button plain @click="carmeCancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gisMap from "@/components/common/map/gis-map";
import pagination from "@/components/comPagination";
import treeTransfer from "el-tree-transfer";
import { getUserinfos } from "@/api/smartProperty/workManagement";
import { redefineTransfer } from "@/utils/index";
import roundApi from "@/api/roundPatrol";
import $temaTree from "@/api/temaTree";
import ComDeptUser from "@/components/comDeptUser";
import { getUser } from "@/api/system/user";
var GisMapObj = null,
  viewer = null,
  that = null;
export default {
  name: "PatrolPlan",
  components: {
    pagination,
    gisMap,
    treeTransfer,
    ComDeptUser,
  },
  data() {
    return {
      locationObj: {
        lat: 34.25759,
        lng: 108.76754,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      carGroup: [], // 布控对象
      levelArr: [1, 2, 3, 4, 5], // 优先级
      distList: [
        { id: 1, name: "事件类" },
        { id: 2, name: "设备类" },
      ],
      analysisType: [
        {
          name: "车辆黑名单",
          value: "car_analysis_DICT:71024",
        },
        {
          name: "能耗告警",
          value: "car_analysis_DICT:71024",
        },
        {
          name: "设备告警",
          value: "car_analysis_DICT:71024",
        },
      ], // 识别类型
      EntityManage: {},
      contentShow: true, // leftBox的切换
      addFormShow: false, // 新增布控的表单
      addActive: false,
      addActiveClick: false,
      formSeach: {
        // 搜索
        carOwner: "",
      },
      // 布控左侧表格数据
      controlTableData: [],
      checkedData: [], // 多选框
      pageNum: 1, // 分页
      pageSize: 10, // 每页显示的条数
      total: 0, // 总数量
      // 新增表单数据
      addForm: {
        name: "",
        object: "",
        TableData: [],
      },
      cameraShow: false, // 摄像机展示
      // 摄像机详情
      cameraForm: {
        planName: "",
        position: "",
      },
      videoShow: false, // 实时监控展示
      player: {}, // 监控的流路径
      // 布控详情
      controlDetailsShow: false, // 详情展示
      deviceList: [],
      preIcon: "",
      clickIcon: "",
      isClickShow: false,
      markers: [],
      sendShow: false,
      mode: "transfer", // transfer addressList
      fromData: [],
      defaultfromData: [],
      defaultdata: [],
      toData: [],
      titles: ["人员列表", "选择列表"],
      title: "添加人员",
      sendWork: {
        //        选择人员名单
      },
      num: 1,
      carmeaShow: false,
      ruleForm: {
        numTime: 1,
        seconds: 10,
      },
      carmeaNum: [
        { id: 1, value: 1 },
        { id: 2, value: 2 },
        { id: 3, value: 3 },
        { id: 4, value: 4 },
        { id: 5, value: 5 },
        { id: 6, value: 6 },
      ],
      rules: {
        numTime: [
          { required: true, message: "请选择次数", trigger: "blur" },
          { min: 1, max: 6, message: "次数在 1-6个", trigger: "blur" },
        ],
        seconds: [
          { required: true, message: "请输入轮巡时长", trigger: "blur" },
        ],
      },
      personCharge: [],
      roundList: [],
      carmeaShowDuration: "",
      addFormType: "add",
      addFromTitle: "创建计划",
      roundListId: "",
      addPersonDis: false,
      personId: "",
    };
  },
  watch: {
    addFormShow(n) {
      if (!n) {
        this.markers.map((x) => {
          x.setIcon(this.preIcon);
        });
        this.addForm.TableData = [];
        this.isClickShow = false;
      }
    },
  },
  created() {
    // this.getCarGroup();
    // this.infoData();
  },
  mounted() {
    this.initmap();
    // this.getUserInfo();
    this.getRoundList();
  },
  methods: {
    // 地图初始化
    initmap() {},
    // 获取人员id
    selectClick($e) {
      this.personId = $e[0];
    },
    // 获取计划列表
    getRoundList() {
      roundApi
        .getRoundList({ pageNum: this.pageNum, pageSize: this.pageSize })
        .then((res) => {
          this.roundList = res.data.data;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 升序
    riseDays(indexs, item) {
      var index;
      index = this.addForm.TableData.indexOf(item);
      if (index !== -1) {
        this.addForm.TableData[indexs].sort = indexs;
        this.addForm.TableData[indexs - 1].sort = indexs + 1;
        this.addForm.TableData.splice(index, 1);
        this.addForm.TableData.splice(index - 1, 0, item);
      }
    },
    //章节降序
    dropDays(indexs, item) {
      var index;
      index = this.addForm.TableData.indexOf(item);
      if (index !== -1) {
        this.addForm.TableData[indexs].sort = indexs + 2;
        this.addForm.TableData[indexs + 1].sort = indexs + 1;
        this.addForm.TableData.splice(index, 1);
        this.addForm.TableData.splice(index + 1, 0, item);
      }
    },
    // gis方法
    mapReady(item) {
      console.log(item);
    },
    addDialog() {
      if (!this.personCharge.length) {
        this.sendShow = true;
        this.$refs.comDeptUsers.init();
        this.addPersonDis = false;
      } else {
        this.$message.info("只能添加一人");
      }
    },
    // 设置打卡次数
    setClock() {
      if (this.addForm.TableData.length) {
        this.carmeaShow = true;
      } else {
        this.$message.info("请添加设备");
      }
    },
    // 添加摄像头
    addCarmea() {
      console.log(`output->`, this.$refs.gisMap);
      this.addActive = !this.addActive;

      // this.addForm.TableData = [
      //   ...this.addForm.TableData,
      //   {
      //     deviceCode: this.$refs.gisMap.deviceCode,
      //     deviceName: this.$refs.gisMap.deviceName,
      //     duration: 10,
      //     sort: 1,
      //   },
      // ];

      // this.addForm.TableData = [
      //   {
      //     deviceCode: "09254914188069670101#bcb800bfc42147a5b40c45494faf7177",
      //     duration: 11,
      //     sort: 1,
      //   },
      //   {
      //     deviceCode: "07086362377387200101#7646beefa4484ef2907965d22f6b3934",
      //     duration: 11,
      //     sort: 1,
      //   },
      //   {
      //     deviceCode: "07086362377102050101#7646beefa4484ef2907965d22f6b3934",
      //     duration: 11,
      //     sort: 1,
      //   },
      //   {
      //     deviceCode: "07086362372597340101#7646beefa4484ef2907965d22f6b3934",
      //     duration: 11,
      //     sort: 1,
      //   },
      //   {
      //     deviceCode: "07086362374538100101#7646beefa4484ef2907965d22f6b3934",
      //     duration: 11,
      //     sort: 1,
      //   },
      // ];
    },

    // 添加设备信息
    deviceInfo(carmeaInfo) {
      console.log(carmeaInfo, "carmeaInfocarmeaInfocarmeaInfo");
      if (this.addActive) {
        if (carmeaInfo.deviceType == "camera") {
          if (
            this.addForm.TableData.length > 0 &&
            this.addForm.TableData.length <= 50
          ) {
            let flag = false;
            this.addForm.TableData.filter((item) => {
              if (item.deviceCode == carmeaInfo.deviceCode) {
                flag = true;
                this.$message.info("此设备已添加");
              }
            });
            if (!flag) {
              const temp = {
                deviceName: carmeaInfo.deviceName,
                deviceCode: carmeaInfo.deviceCode,
                duration: 10,
                sort: this.addForm.TableData.length,
              };
              this.addForm.TableData.push(temp);
            }
          } else {
            const temp = {
              deviceName: carmeaInfo.deviceName,
              deviceCode: carmeaInfo.deviceCode,
              duration: 10,
              sort: this.addForm.TableData.length,
            };
            this.addForm.TableData.push(temp);
          }
        } else {
          this.$message.error("请选择摄像头设备");
        }
      }
    },
    // 摄像头
    vedioDial() {
      this.videoShow = true;
    },
    // 表格中次数
    handleChange(item) {
      console.log(item);
      // this.carmeaShowDuration = value
    },
    // 设置中次数
    handleChanges(value) {
      this.addForm.TableData.map((item) => {
        return (item.duration = value);
      });
      // this.carmeaShowDuration = value
    },
    disabledFn(data, node) {
      return data.disabled;
    },
    // 设置弹窗取消按钮
    carmeCancel() {
      this.carmeaShow = false;
      this.$refs.ruleForm.resetFields();
    },
    // 设置弹窗确认按钮
    carmeSubmit() {
      this.carmeaShow = false;
      // this.addForm.TableData.map(item=>{
      //   return item.duration = this.carmeaShowDuration
      // })
      this.$refs.ruleForm.resetFields();
    },
    // 编辑轮训计划
    editCrea(id) {
      this.addFormShow = true;
      this.addFormType = "edit";
      this.addFromTitle = "编辑计划";
      this.addActive = false;
      this.personCharge = [];
      let data = {
        name: "",
        account: "",
        groups: "",
      };
      roundApi.searchRound(id).then((res) => {
        this.addForm.TableData = res.data.robinRoutes;
        this.cameraForm.planName = res.data.planName;
        this.cameraForm.position = [res.data.startTime, res.data.endTime];
        data.name = res.data.userNickName;
        data.account = res.data.handler;
        data.groups = res.data.teamName;
        this.roundListId = res.data.id;
        this.personCharge.push(data);
      });
    },
    // 启用或停用
    startStatus(item) {
      var activeStatus;
      if (item.activeStatus) {
        activeStatus = false;
      } else {
        activeStatus = true;
      }
      let temp = activeStatus ? "启用" : "停用";
      this.$confirm(`此操作将${temp}当前计划, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          roundApi
            .startRound({ activeStatus: activeStatus, planId: item.id })
            .then((res) => {
              this.getRoundList();
              this.$message({
                type: "success",
                message: `${temp}成功!`,
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除视频轮训
    delCrea(id) {
      this.$confirm("此操作将永久删除该轮巡计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          roundApi.delRound(id).then((res) => {
            this.pageNum = 1;
            this.getRoundList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 添加人员
    onSubmit() {
      console.log(`output->this.personId`, this.personId);
      if (this.personCharge.length > 0) {
        this.$message.error("列表中已有负责人，请勿添加");
      } else {
        getUser(this.personId).then((res) => {
          let data = {
            name: res.data.nickName,
            account: res.data.userName,
            groups: res.data.dept.deptName,
          };
          this.personCharge.push(data);
          this.sendShow = false;
          this.cancel();
        });
      }
    },
    cancel() {
      this.sendShow = false;
      // this.getUserInfo();
      // this.$refs.addForm.resetFields()
    },
    // 创建布控
    onAdd() {
      this.addFormShow = true;
      this.cameraShow = false;
      this.videoShow = false;
      this.addActive = false;
      this.addFormType = "add";
      this.addFromTitle = "创建计划";
      this.addForm.planName = "";
      this.addForm.position = "";
      this.personCharge = [];
      if (this.$refs.addForm !== undefined) {
        this.$refs.addForm.resetFields();
      }
      this.addForm.TableData = [];
    },
    // 根据计划名称搜索
    onSearch() {
      roundApi
        .getRoundList({
          planName: this.formSeach.carOwner,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.roundList = res.data.data;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.$message.error(err.meta.message);
        });
    },
    // 切换到第几页了
    handleCurrentChange(n) {
      this.pageNum = n.page;
      this.getRoundList();
    },

    // 点击布控配置切换
    handleClick() {
      this.contentShow = !this.contentShow;
    },
    // 删除人员
    deletePerson() {
      this.personCharge = [];
    },
    // 删除摄像机
    deleteCamera(index, item) {
      this.addForm.TableData.splice(index, 1);
    },
    // 取消
    onCancel() {
      this.$refs.addForm.resetFields();
      this.addFormShow = false;
      this.addActive = false;
    },
    // add新增确认
    onSubmit1() {
      console.log(this.addForm.TableData);
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if (!this.addForm.TableData.length) {
            this.$message.info("请添加设备");
            return false;
          }
          if (!this.personCharge.length) {
            this.$message.info("请选择人员");
            return false;
          } else {
            let obj = {
              id: this.roundListId,
              endTime: this.cameraForm.position[1],
              handler: this.personCharge[0].account,
              planClockTimes: this.ruleForm.numTime,
              planName: this.cameraForm.planName,
              robinRoutes: [
                {
                  deviceId: "",
                  duration: 0,
                  sort: 0,
                },
              ],
              startTime: this.cameraForm.position[0],
            };

            obj.robinRoutes = this.addForm.TableData;
            if (this.addFormType == "add") {
              delete obj.id;
              roundApi
                .addRound(obj)
                .then((res) => {
                  this.addFormShow = false;
                  this.$refs.addForm.resetFields();
                  this.getRoundList();
                  this.$message.success("添加计划成功");
                })
                .catch((err) => {
                  this.$message.error(err);
                });
            } else {
              roundApi
                .editRound(obj)
                .then((res) => {
                  this.addFormShow = false;
                  this.$refs.addForm.resetFields();
                  this.getRoundList();
                  this.$message.success("修改计划成功");
                })
                .catch((err) => {
                  this.$message.error(err);
                });
            }
          }
        }
      });
    },
    // 实时监控
    nowVidoe() {
      this.videoShow = true;
      this.player = {
        deviceId: this.cameraForm.deviceId,
        protocol: this.cameraForm.protocol,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-table__empty-block {
  width: 100% !important;
  padding: 0 25% !important;
}
::v-deep .cesium-viewer .cesium-viewer-toolbar {
  display: none;
}
::v-deep .cesium-viewer #navigationDiv {
  display: none;
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

::v-deep.el-progress--circle .el-progress__text,
.el-progress--dashboard .el-progress__text {
  font-size: 20px !important;
}

::v-deep.wl-transfer .el-tree {
  background-color: inherit;
}

::v-deep.wl-transfer .transfer-title {
  background-color: inherit;

  font-size: 14px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
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

.margintop20 {
  margin-top: 20px;
}

.tableheight {
  height: calc(100vh - 440px);
}

::v-deep .wl-transfer .transfer-left {
  border: 2px solid rgba(255, 255, 255, 0.04);
}

::v-deep .wl-transfer .transfer-right {
  border: 2px solid rgba(255, 255, 255, 0.04);
}
::v-deeep .el-input__inner,
.el-date-editor--daterange {
  width: 280px !important;
}
.up,
.down,
.vedio {
  color: #206aff;
  font-size: 16px;
  padding: 0 5px;
  font-weight: bold;
  cursor: pointer;
}
.app-container-gis {
  position: relative;
  .listArr {
    width: 100%;
    background: #313448;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    padding-bottom: 0px;
    .listTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 10px 0px;
      .listLeft {
        font-size: 14px;

        font-weight: bold;
        line-height: 32px;
        .titleHand {
          font-size: 16px;
          color: #fff;
          line-height: 40px;
        }
        .boxtitle {
          color: #ccc;
        }
      }
    }
    .listBottom {
      border-top: solid 1px #afb9d0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 34px;
      opacity: 0.41;
      div {
        width: 50%;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .cricle {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: solid 4px #fff;
    text-align: center;
    line-height: 48px;
    font-size: 14px;
    cursor: pointer;
  }
  .redCircle {
    border: solid 4px #ff403d;
    color: #ccc;
  }
  .greenCircle {
    border: solid 4px #00e984;
    color: #ccc;
  }
  #cesiumContainer {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    .mainButton {
      position: absolute;
      left: 405px;
      top: 42px;
      z-index: 100;
    }
    .leftBox {
      position: absolute;
      top: 32px;
      width: 375px;
      height: 92%;
      z-index: 100;
      padding: 10px;
      left: 20px;
      overflow: hidden;
      border-radius: 10px;
      background-color: rgba(32, 34, 48, 0.9);
      .seachBox {
        width: 100%;
        height: 35px;
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
        button {
          margin-left: 10px;
        }
      }
      .addBox {
        margin: 5px;
        display: flex;
        flex-direction: column;
        overflow: auto;
        height: calc(100vh - 260px);
        margin-bottom: 15px;
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
      background-color: rgba(32, 34, 48, 0.9);
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
      width: 25%;
      min-width: 350px;
      height: 92%;
      z-index: 100;
      padding: 10px;
      overflow: hidden;
      background-color: rgba(32, 34, 48, 0.9);
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
        margin-top: 5px;
        display: flex;
        justify-content: center;
      }
      .tableBox {
        position: relative;
        background: #313448;
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
          .carActives {
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
  .bigVideo {
    position: absolute;
    width: 300px;
    left: 27%;
    top: 32px;
    min-width: 400px;
    height: 265px;
    z-index: 100;
    padding: 10px;
    background-color: rgba(32, 34, 48, 0.9);
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
  .tableOperation {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  ::v-deep .el-table__empty-text {
    // padding-top: 160px;
    background-size: contain;
  }
}
::v-deep .hidden-columns {
  background-color: #313448 !important;
}
::v-deep .el-picker-panel__body {
  background-color: #313448 !important;
  border: 1px solid #313448 !important;
}
::v-deep .el-range-input {
  background-color: #313448 !important;
  border: 1px solid #313448 !important;
}
::v-deep .el-range-editor.el-input__inner {
  background-color: #313448 !important;
  border: 1px solid #313448 !important;
}
// ::v-deep .el-input .el-input__inner {
//   border-radius: 6px;
//   color: #ccc !important;
//   background-color: #313448 !important;
//   border: 1px solid #313448 !important;
//  }
::v-deep.el-table.el-table--fit {
  overflow: hidden;
}
::v-deep .el-table__header-wrapper,
.el-table__footer-wrapper {
  background-color: transparent !important;
}
::v-deep .el-table,
::v-deep .el-table tr,
::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background-color: transparent !important;
}
::v-deep .el-table {
  color: #afb9d0;
}
::v-deep .el-table th.el-table__cell.is-leaf,
::v-deep .el-table td.el-table__cell {
  border: none;
}
::v-deep .el-table::before {
  height: 0;
}
::v-deep .el-table.el-table--fit tr th {
  background-color: rgba(38, 40, 57, 0.3) !important;
}
::v-deep .el-input--small .el-input__inner {
  background-color: #313448 !important;
  border: 1px solid #313448 !important;
  color: #ccc !important;
}
::v-deep .el-pager li {
  background-color: #313448 !important;
}
::v-deep .is-background .btn-next {
  background-color: #313448 !important;
}
::v-deep .el-pagination .btn-prev,
.el-pagination .btn-next {
  background-color: #313448 !important;
}
</style>
<style lang="scss">
.clearColor {
  .el-input--small .el-input__inner {
    background-color: #fff !important;
    border-color: #dcdfe6 !important;
  }
  .el-table {
    color: #606266 !important;
  }

  .el-table .el-table__header-wrapper th,
  .el-table .el-table__fixed-header-wrapper th,
  .el-table.el-table--fit tr th {
    background-color: #f8f8f9 !important;
  }
  .el-pager li {
    background-color: #f4f4f5 !important;
    color: #606266 !important;
  }
  .el-pagination .btn-prev,
  .el-pagination .btn-next {
    background-color: #f4f4f5 !important;
  }
  .el-table th.el-table__cell.is-leaf,
  .el-table td.el-table__cell {
    border-bottom: 1px solid #dfe6ec !important;
  }
}
</style>
