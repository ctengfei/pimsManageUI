<template>
  <div class="app-container">
    <!-- <div id="cesiumContainer">
      <gis-map ref="gisMap" @mapReady="mapReady" @deviceInfo="deviceInfo"></gis-map> -->
    <!-- 联动列表 -->
    <!-- <div class="leftBox padding-10" v-if="contentShow">
        <div class="seachBox">
          <el-form>
            <el-input
            v-model="formSeach.searchKey"
            placeholder="请输入名称"
            clearable
          ></el-input>
          <el-button icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
          </el-form>
        </div>
        <div class="addBox"> -->
    <div style="padding-top: 10px">
      <el-form ref="formSeach" inline v-model="formSeach" v-if="showSearch">
        <el-form-item prop="searchKey" label="规则名称">
          <el-input
            placeholder="请输入规则名称"
            clearable
            v-model="formSeach.searchKey"
          ></el-input>
        </el-form-item>
        <el-form-item prop="ruleStatus" label="规则状态">
          <el-select v-model="formSeach.ruleStatus">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onSearch"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh-left" @click="onReset()"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            :disabled="!multipleSelection.length"
            plain
            @click="onSatrt"
            >批量启用</el-button
          >
          <el-button
            type="primary"
            :disabled="!multipleSelection.length"
            plain
            @click="onDisabled"
            >批量禁用</el-button
          >
          <el-button
            type="danger"
            :disabled="!multipleSelection.length"
            plain
            @click="onDelete"
            >批量删除</el-button
          >
          <el-button type="primary" plain @click="onAdd">新增规则</el-button>
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getRoundList"
        ></right-toolbar>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="roundList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column label="规则名称" prop="ruleName"> </el-table-column>
        <el-table-column prop="ruleStatus" label="规则状态">
          <template slot-scope="scope">
            {{ scope.row.ruleStatus ? "启用" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="alarmEventStr"
          label="报警类型"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="handler"
          label="操作"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              @click="editCrea(scope.row.id)"
              type="text"
              icon="el-icon-edit"
            >
              编辑</el-button
            >
            <el-button
              type="text"
              @click="delCrea(scope.row.id)"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="roundList && roundList.length > 0"
        @pagination="handleCurrentChange"
        :page.sync="pageNum"
        :pageSizes="[10, 20, 30, 40]"
        :limit.sync="pageSize"
        :total="total"
      />
      <!-- </div> -->
    </div>
    <!-- <div v-else>
            <div class="el-table__empty-block" style="height: 50vh; width: auto"><span class="el-table__empty-text">暂无数据</span></div>
          </div>
        </div>
        <div>
        </div> 
      </div>-->
    <!-- 新增规则 v-if="addFormShow"-->
    <el-dialog :visible.sync="addFormShow" width="520px" :title="addFromTitle">
      <div class="rightBox padding-10">
        <!-- <div style="line-height:36px;">{{addFromTitle}}</div> -->
        <div style="margin-top: 15px">
          <el-form :model="cameraForm" ref="addForm" label-width="80px">
            <el-form-item
              label="规则名称"
              prop="ruleName"
              :rules="[
                { required: true, message: '请输入名称', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="cameraForm.ruleName"
                maxlength="30"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="规则说明" prop="description">
              <el-input
                v-model="cameraForm.description"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="业务类型" prop="alarmType" :rules="[{required: true, message: '请选择', trigger: '[blur,change]'}]">
              <el-select v-model="cameraForm.alarmType" @change="handleSelectBusiness" placeholder="业务类型" clearable>
                <el-option
                  v-for="item in businessArr"
                  :key="item.businessCode"
                  :label="item.businessType"
                  :value="item.businessCode">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item
              label="告警事件"
              prop="alarmEvent"
              :rules="[
                { required: true, message: '请选择', trigger: '[blur,change]' },
              ]"
            >
              <!-- <el-input v-model="cameraForm.position"></el-input> -->
              <el-select
                v-model="cameraForm.alarmEvent"
                placeholder="告警事件"
                clearable
              >
                <el-option
                  v-for="item in eventNameArr"
                  :key="item.eventCode"
                  :label="item.eventName"
                  :value="item.eventCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="tableBox">
          <div class="tableBoxTitle">
            <span>设备列表</span>
            <span class="addCarmea" @click="addCarmea"
              ><i class="el-icon-plus"></i>添加</span
            >
          </div>
          <el-table height="200" :data="deviceTableData" style="width: 100%">
            <el-table-column label="序号" width="60">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="设备名称" show-overflow-tooltip prop="name">
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
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tableBox">
          <div class="tableBoxTitle">
            <span>联动规则</span>
            <span class="addCarmea" @click="addCarmeas"
              ><i class="el-icon-plus"></i>添加</span
            >
          </div>
          <el-table height="200" :data="linkageRule" style="width: 100%">
            <el-table-column label="序号" width="60">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              label="设备名称"
              show-overflow-tooltip
              prop="deviceName"
            />
            <el-table-column
              label="执行动作"
              show-overflow-tooltip
              prop="actionStr"
              width="100"
            />
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
      </div>
      <div slot="footer" style="text-align: right" class="submitButton">
        <el-button plain @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit1">确认</el-button>
      </div>
    </el-dialog>
    <!-- 摄像机详情 -->
    <div class="cameraBox padding-10" v-if="cameraShow">
      <i class="el-icon-close" @click="cameraShow = false"></i>
      <el-form :model="cameraForm" label-width="100px">
        <el-form-item label="设备类型">
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
    <div class="bigVideo padding-10" v-if="videoShow">
      <div class="title">
        实时监控
        <i class="el-icon-close" @click="videoShow = false"></i>
      </div>
      <videoPlayer :player="player" />
    </div>
    <!-- </div> -->
    <!-- 摄像机选择 -->
    <el-dialog
      title="设置"
      :visible.sync="carmeaShow"
      width="20%"
      :before-close="carmeCancel"
    >
      <el-row :gutter="20">
        <el-form
          label-width="80px"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <el-col>
            <el-form-item label="执行动作" prop="action">
              <el-select
                clearable
                v-model="ruleForm.action"
                @change="ruleChange"
                style="width: 100%"
              >
                <el-option
                  v-for="item in ruleActive"
                  :key="item.deviceAction"
                  :label="item.deviceActionStr"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="carmeSubmit()">确定</el-button>
        <el-button plain @click="carmeCancel()">取消</el-button>
      </div>
    </el-dialog>
    <!-- 选择设备 -->
    <el-dialog :visible.sync="addDeviceShow" width="820px" title="设备列表">
      <el-form ref="deviceSeach" inline :model="deviceSeach">
        <el-form-item prop="name">
          <el-input
            placeholder="请输入设备名称"
            clearable
            v-model="deviceSeach.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="deviceSeach.type" style="width: 150px">
            <el-option
              v-for="item in deviceType"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="deviceSeach.status" style="width: 150px">
            <el-option
              v-for="item in deviceStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="deviceSearch"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh-left" @click="deviceReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        ref="deviceTable"
        :data="getDeviceLists"
        tooltip-effect="dark"
        height="600"
        style="width: 100%"
        @selection-change="deviceSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column label="设备名称" prop="name"> </el-table-column>
        <el-table-column prop="code" label="设备编号"> </el-table-column>
        <el-table-column prop="address" label="所在位置" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color: #18dca7"
              >在线</span
            >
            <span v-else style="color: #f05656">离线</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="getDeviceLists && getDeviceLists.length > 0"
        style="margin-top: 0px"
        small
        @pagination="handleCurrentChange"
        :page.sync="pageNum"
        :pageSizes="[10, 20, 30, 40]"
        :limit.sync="pageSize"
        :layout="'total, prev, pager, next'"
        :total="total"
      />
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="addDevice">添加</el-button>
      </div>
    </el-dialog>
    <!-- 添加规则 -->
    <el-dialog :visible.sync="addRuleShow" width="820px" title="联动规则">
      <el-form ref="deviceSeach" inline :model="deviceSeach">
        <el-form-item prop="name">
          <el-input
            placeholder="请输入设备名称"
            clearable
            v-model="deviceSeach.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="deviceSeach.type" style="width: 150px">
            <el-option
              v-for="item in deviceType"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="deviceSeach.status" style="width: 150px">
            <el-option
              v-for="item in deviceStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="deviceSearch"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh-left" @click="deviceReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form
        label-width="80px"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="执行动作" prop="action">
          <el-select clearable v-model="ruleForm.action" @change="ruleChange">
            <el-option
              v-for="item in ruleActive"
              :key="item.deviceAction"
              :label="item.deviceActionStr"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        class="ruleTable"
        ref="deviceRuleTable"
        :data="getDeviceLists"
        tooltip-effect="dark"
        height="600"
        style="width: 100%"
        @select="deviceRuleChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column label="设备名称" prop="name"> </el-table-column>
        <el-table-column prop="code" label="设备编号"> </el-table-column>
        <el-table-column prop="address" label="所在位置" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color: #18dca7"
              >在线</span
            >
            <span v-else style="color: #f05656">离线</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="getDeviceLists && getDeviceLists.length > 0"
        style="margin-top: 0px"
        small
        @pagination="handleCurrentChange"
        :page.sync="pageNum"
        :pageSizes="[10, 20, 30, 40]"
        :limit.sync="pageSize"
        :layout="'total, prev, pager, next'"
        :total="total"
      />

      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="addDeviceRule">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gisMap from "@/components/common/map/gis-map";
import pagination from "@/components/comPagination";
import videoPlayer from "@/components/videoPlayer/index.vue";
import {
  getConfigType,
  getTableData,
  editId,
  add,
  edit,
  Delete,
  mulDelete,
  Start,
  Disabled,
  linkageRoleActive,
  getConfigEvent,
} from "@/api/alarmCenter/warningConfiguration";
import roundApi from "@/api/roundPatrol";
import { getDeviceCriteria } from "@/api/system/organization";
import { initData } from "@/api/facility/information";

var GisMapObj = null,
  viewer = null,
  that = null;
export default {
  name: "WarningConfiguration",
  components: {
    videoPlayer,
    pagination,
    gisMap,
  },
  data() {
    return {
      EntityManage: {},
      contentShow: true, // leftBox的切换
      addFormShow: false, // 新增布控的表单
      addActive: false,
      addActives: false,
      addActiveClick: false,
      formSeach: {
        // 搜索
        searchKey: "",
        ruleStatus: "",
      },
      pageNum: 1, // 分页
      pageSize: 10, // 每页显示的条数
      total: 0, // 总数量
      // 新增表单数据
      deviceTableData: [],
      cameraShow: false, // 摄像机展示
      // 摄像机详情
      cameraForm: {
        TableData: [],
        description: "",
        alarmType: "",
        alarmEvent: "",
        alarmLinkageActions: [
          {
            action: {},
            deviceId: {},
          },
        ],
        deviceIds: [],
        ruleStatus: true,
        ruleName: "",
      },
      videoShow: false, // 实时监控展示
      player: {}, // 监控的流路径
      // 布控详情
      deviceList: [],
      preIcon: "",
      clickIcon: "",
      isClickShow: false,
      markers: [],
      //tab1: require("../../../../assets/images/tab1.png"),
      sendShow: false,
      num: 1,
      carmeaShow: false,
      ruleForm: {
        action: "",
      },
      rules: {
        action: [{ required: true, message: "请选择动作", trigger: "change" }],
      },
      linkageRule: [],
      roundList: [],
      showSearch: true,
      status: [
        {
          value: "true",
          label: "启用",
        },
        {
          value: "false",
          label: "禁用",
        },
      ],
      carmeaShowDuration: "",
      addFormType: "add",
      addFromTitle: "创建计划",
      roundListId: "",
      multipleSelection: [],
      eventNameArr: [],
      businessArr: [], //业务分类
      ruleActive: [],
      businessType: [],
      linkageRuleAction: "add",
      ruleAction: {
        deviceId: "",
        deviceName: "",
        deviceType: "",
        action: "",
        actionStr: "",
      },
      getDeviceLists: [],
      addDeviceShow: false,
      deviceType: [],
      deviceSeach: {
        mounted: true,
        blurryType: "DEVICE_TREE",
        status: "",
        type: "camera",
        name: "",
      },
      deviceStatus: [
        {
          value: "true",
          label: "在线",
        },
        {
          value: "false",
          label: "离线",
        },
      ],
      deviceTableDatas: [],
      deviceRuleData: [],
      addRuleShow: false,
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
    this.getRoundList();
    this.getConfigEvent();
    this.getTableDatas();
    //this.getConfigBusiness()
  },
  methods: {
    // 地图初始化
    initmap() {},
    // 业务分类
    // handleSelectBusiness(e){
    //   console.log(e)
    //   this.getConfigEvent(e)
    //   this.businessType = this.businessArr.filter(item=>item.businessCode == e)
    //   console.log(this.businessType)
    // },
    // 获取设备类型
    getTableDatas() {
      let parmas = {
        nodeType: "DIR",
      };
      initData("/pm/tree/type", "GET", parmas).then((res) => {
        let temp = res.data.map((item) => {
          return { value: item.type, name: item.name };
        });
        console.log(temp, "temp");
        this.deviceType = temp;
      });
    },
    // 事件名称
    handleSelectEvent(e) {
      if (!this.addData.businessType) {
        this.$message.error("请先选择业务分类");
      } else {
        this.addData.eventCode = e;
      }
    },
    getConfigEvent() {
      getConfigEvent()
        .then((res) => {
          this.eventNameArr = res.data.eventNames;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 根据业务类型编码查询事件名称及事件编码
    // getConfigEvent(code){
    //   roundApi.getConfigEvent(code).then(res=>{
    //     if(res.code === 200){

    //       this.eventNameArr = res.data.eventNames
    //     }else{
    //       this.$message.info(res.meta.message)
    //     }
    //   }).catch(err=>{
    //     this.$message.error(err)
    //   })
    // },
    // getConfigBusiness(){
    //   //let obj = getObjByKey(this.permission.searchConfigType);
    //   getConfigType('/pm/alarm/config/business', 'get').then(res => {
    //     console.log(res, 'res');
    //     if (res.code === 200) {
    //       this.businessArr = res.data;
    //     }
    //   }).catch(err => {
    //     this.$message.error(err.message);
    //   })
    // },
    // 批量删除
    handleSelectionChange(val) {
      this.multipleSelection = val.map((item) => {
        return item.id;
      });
    },
    onReset() {
      this.formSeach = {
        searchKey: "",
        ruleStatus: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getRoundList();
    },
    // 获取设备列表
    getDeviceList() {
      let obj = {
        url: "/pm/device/criteria",
        method: "GET",
      };
      getDeviceCriteria(obj.url, obj.method, this.deviceSeach).then((res) => {
        this.total = res.data.total;
        this.getDeviceLists = res.data.data;
      });
    },
    // 添加设备
    addDevice() {
      this.addDeviceShow = false;
      this.deviceTableData = this.deviceTableDatas;
    },
    // 搜索 设备信息
    deviceSearch() {
      this.getDeviceList();
      if (this.addRuleShow) {
        this.addRules();
      }
    },
    // 重置 设备信息
    deviceReset() {
      this.$refs.deviceSeach.resetFields();
      this.getDeviceList();
    },
    // 获取选中的设备信息
    deviceSelectionChange(val) {
      this.deviceTableDatas = val.map((item) => {
        return { id: item.id, name: item.name, deviceType: item.type };
      });
    },
    // 启用
    onSatrt() {
      Start(this.multipleSelection)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("启用成功");
            this.getRoundList();
          } else {
            this.$message.info(res.meta.message);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 禁用
    onDisabled() {
      Disabled(this.multipleSelection)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("禁用成功");
            this.getRoundList();
          } else {
            this.$message.info(res.meta.message);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 删除
    onDelete() {
      if (!this.multipleSelection.length) {
        this.$message.error("请选择删除的规则");
        return;
      }
      mulDelete(this.multipleSelection)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getRoundList();
          } else {
            this.$message.info(res.meta.message);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 获取计划列表
    getRoundList() {
      getTableData({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchKey: this.formSeach.searchKey,
        ruleStatus: this.formSeach.ruleStatus,
      })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.roundList = res.data.data;
            this.total = res.data.total;
          } else {
            this.$message.info(res.meta.message);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 添加摄像头
    addCarmea() {
      this.addActive = !this.addActive;
      this.addDeviceShow = true;
      this.getDeviceList();
    },
    // 添加规则
    addCarmeas() {
      this.addRuleShow = true;
      this.getDeviceList();
      this.addRules();
    },
    // 添加设备动作
    addDeviceRule() {
      if (this.ruleAction.deviceId && this.ruleAction.action) {
        this.addRuleShow = false;
        this.linkageRule.push(this.ruleAction);
        this.ruleAction = {
          deviceId: "",
          deviceName: "",
          deviceType: "",
          action: "",
          actionStr: "",
        };
        this.$refs.ruleForm.resetFields();
      } else {
        this.$message.info("请选择设备和执行动作");
      }
    },
    // 选择设备添加动作
    deviceRuleChange(val, row) {
      if (val.length > 1) {
        this.$refs.deviceRuleTable.clearSelection();
        this.$refs.deviceRuleTable.toggleRowSelection(val.pop());
      } else {
        if (val.length) {
          this.ruleAction.deviceId = row.id;
          this.ruleAction.deviceName = row.name;
          this.ruleAction.deviceType = row.type;
        }
      }
    },
    // 根据设备类型添加执行动作
    addRules() {
      linkageRoleActive({ deviceType: this.deviceSeach.type }).then((res) => {
        this.ruleActive = res.data;
      });
    },
    // 选择设备动作
    ruleChange(e) {
      this.ruleAction.action = e.deviceAction;
      this.ruleAction.actionStr = e.deviceActionStr;
      this.ruleForm.action = e.deviceActionStr;
    },
    // 添加设备信息
    // deviceInfo(carmeaInfo) {
    //   // console.log(carmeaInfo, "carmeaInfocarmeaInfocarmeaInfo");
    //   if (this.addActive) {
    //     // if(carmeaInfo.deviceType == this.businessType[0].deviceType){
    //     if(carmeaInfo.deviceType == "camera"){
    //       if (this.deviceTableData.length>0 && this.deviceTableData.length <= 50) {
    //         let flag = false;
    //         this.deviceTableData.filter((item) => {
    //           if (item.id == carmeaInfo.deviceId) {
    //             flag = true;
    //             this.$message.info("此设备已添加");
    //           }
    //         });
    //         if (!flag) {
    //           this.deviceTableData = []
    //           const temp = {id:carmeaInfo.deviceId, name:carmeaInfo.deviceName, deviceType:carmeaInfo.deviceType,}
    //           this.deviceTableData.push(temp);
    //         }
    //       } else {
    //         this.deviceTableData = []
    //         const temp = {id:carmeaInfo.deviceId, name:carmeaInfo.deviceName, deviceType:carmeaInfo.deviceType,}
    //         this.deviceTableData.push(temp);
    //       }
    //     }else{
    //       this.$message.error("请选择摄像头设备")
    //     }
    //   }
    //   if (this.addActives) {
    //     if (this.linkageRule.length>0 && this.linkageRule.length <= 50) {
    //       let flag = false;
    //       this.linkageRule.filter((item) => {
    //         if (item.deviceId == carmeaInfo.deviceId) {
    //           flag = true;
    //           this.$message.info("此设备已添加");
    //         }
    //       });
    //       if (!flag) {
    //         this.carmeaShow = true
    //         // 根据设备类型添加执行动作
    //         linkageRoleActive({deviceType:carmeaInfo.deviceType}).then(res=>{
    //           if(res.code === 200){
    //             this.ruleActive = res.data
    //           }else{
    //             this.$message.error(res.meta.message)
    //           }
    //         }).catch(err=>{
    //           this.$message.error(err.message)
    //         })
    //         this.ruleAction.deviceId=carmeaInfo.deviceId;
    //         this.ruleAction.deviceName=carmeaInfo.deviceName;
    //         this.ruleAction.deviceType=carmeaInfo.deviceType;
    //       }
    //     } else {
    //       this.carmeaShow = true
    //       // 根据设备类型添加执行动作
    //       linkageRoleActive({deviceType:carmeaInfo.deviceType}).then(res=>{
    //         if(res.code === 200){
    //           this.ruleActive = res.data
    //         }else{
    //           this.$message.error(res.meta.message)
    //         }
    //       }).catch(err=>{
    //         this.$message.error(err.message)
    //       })
    //       this.ruleAction.deviceId=carmeaInfo.deviceId;
    //       this.ruleAction.deviceName=carmeaInfo.deviceName;
    //       this.ruleAction.deviceType=carmeaInfo.deviceType;
    //     }
    //   }
    // },
    // 摄像头
    vedioDial() {
      this.videoShow = true;
    },
    // 设置弹窗取消按钮
    carmeCancel() {
      this.carmeaShow = false;
      this.$refs.ruleForm.resetFields();
    },
    // 设置弹窗确认按钮
    carmeSubmit() {
      this.carmeaShow = false;
      this.linkageRule.push(this.ruleAction);
      this.ruleAction = {
        deviceId: "",
        deviceName: "",
        deviceType: "",
        action: "",
        actionStr: "",
      };
      this.$refs.ruleForm.resetFields();
    },
    // 编辑轮训计划
    editCrea(id) {
      this.addFormShow = true;
      this.addFormType = "edit";
      this.linkageRuleAction = "edit";
      this.addFromTitle = "编辑规则";
      this.addActive = false;
      this.linkageRule = [];
      editId(id).then((res) => {
        if (res.code === 200) {
          this.linkageRule = res.data.alarmLinkageActions;
          this.deviceTableData = res.data.deviceList;
          this.cameraForm = res.data;
          this.getConfigEvent(res.data.alarmType);
        } else {
          this.$message.error(res.meta.message);
        }
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
      this.$confirm("此操作将启用当前计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          roundApi
            .startRound({ activeStatus: activeStatus, planId: item.id })
            .then((res) => {
              if (res.code === 200) {
                this.getRoundList();
                this.$message({
                  type: "success",
                  message: "成功!",
                });
              } else {
                this.$message.error(res.meta.message);
              }
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
      this.$confirm("此操作将删除该联动配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Delete(id).then((res) => {
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

    cancel() {
      this.sendShow = false;
      this.getUserInfo();
      // this.$refs.addForm.resetFields()
    },
    // 创建布控
    onAdd() {
      this.addFormType = "add";
      this.linkageRuleAction = "add";
      this.addFromTitle = "新增规则";
      this.addFormShow = true;
      this.cameraShow = false;
      this.videoShow = false;
      this.addActive = false;
      this.linkageRule = [];
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields();
      }
      this.deviceTableData = [];
    },
    // 根据计划名称搜索
    onSearch() {
      this.getRoundList();
      // roundApi.getRoundList({planName:this.formSeach.carOwner,pageNum:this.pageNum,pageSize:this.pageSize}).then(res=>{
      //   console.log(res)
      //   if(res.code === 200){
      //     this.roundList = res.data.data
      //     this.total = res.data.total
      //   }else{
      //     this.$message.info(res.meta.message)
      //   }
      // }).catch(err=>{
      //   this.$message.error(err.meta.message)
      // })
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
    deletePerson(index, item) {
      this.linkageRule.splice(index, 1);
    },
    // 删除摄像机
    deleteCamera(index, item) {
      this.deviceTableData.splice(index, 1);
      // that.EntityManage.removeById(item.deviceId);
      // that.EntityManage.removeById("point_label" + item.deviceId);
      // that.drawMarker(true, item);
    },
    // 取消
    onCancel() {
      this.$refs.addForm.resetFields();
      this.addFormShow = false;
      this.addActive = false;
    },
    // add新增确认
    onSubmit1() {
      // console.log(this.cameraForm)
      // console.log(this.linkageRule,"this.linkageRule")
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if (!this.deviceTableData.length) {
            this.$message.info("请添加设备");
            return;
          }
          if (!this.linkageRule.length) {
            this.$message.info("请选择规则");
            return;
          } else {
            this.cameraForm.alarmLinkageActions = this.linkageRule;
            let deviceIds = this.deviceTableData.map((item) => item.id);
            this.cameraForm.deviceIds = deviceIds;
            console.log(
              deviceIds,
              "this.deviceTableData.filter(item=> item.deviceId)"
            );
            // this.cameraForm.alarmLinkageActions = this.linkageRule
            if (this.addFormType == "add") {
              add(this.cameraForm)
                .then((res) => {
                  if (res.code === 200) {
                    this.addFormShow = false;
                    this.$refs.addForm.resetFields();
                    this.getRoundList();
                    this.$message.success("添加计划成功");
                  } else {
                    this.$message.error(res.meta.message);
                  }
                })
                .catch((err) => {
                  this.$message.error(err);
                });
            } else {
              edit(this.cameraForm.id, this.cameraForm)
                .then((res) => {
                  if (res.code === 200) {
                    this.addFormShow = false;
                    this.$refs.addForm.resetFields();
                    this.getRoundList();
                    this.$message.success("修改计划成功");
                  } else {
                    this.$message.error(res.meta.message);
                  }
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
.tableBoxTitle {
  display: flex;
  justify-content: space-between;
  .addCarmea {
    cursor: pointer;
  }
}
.actives {
  color: #206aff;
}
::v-deep .el-table__empty-block {
  width: 100% !important;
  padding: 0 25% !important;
}
.app-container-gis ::v-deep .el-table__empty-text {
  padding-top: 90px !important;
  font-size: 16px;
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

::v-deep .el-tree-node {
  color: #afb9d0;
}
::v-deeep .el-input__inner,
.el-date-editor--daterange {
  width: 280px !important;
}
.color {
  color: #206aff;
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
::v-deep .el-dialog__body {
  padding-top: 0px !important;
}
.ruleTable ::v-deep .el-table__header-wrapper .el-checkbox {
  display: none !important;
}
.ruleTable ::v-deep.el-table .disabledCheck .cell::before {
  content: "";
  text-align: center;
  line-height: 37px;
}
</style>

