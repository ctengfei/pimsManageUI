<template>
  <div class="app-container">
    <!-- 添加分组 -->
    <highlight-square class="highlight-height-table6">
      <template v-slot:child>
        <div id="cesiumContainer">
          <el-button class="mainButton" type="primary" @click="handleClick">布控配置</el-button>
          <!-- 布控列表 -->
          <highlight-square class="leftBox padding-10" v-if="contentShow">
            <template v-slot:child>
              <div class="seachBox">
                <el-input
                  v-model="queryParams.name"
                  placeholder="请输入布控名称"
                  clearable
                />
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="onSearch"
                  >搜索</el-button
                >
              </div>
              <div class="addBox">
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="onAdd"
                  >创建布控</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-video-play"
                  @click="onStartAll"
                  :disabled="!checkedData.length"
                  >启用布控</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-circle-close"
                  @click="onDisableAll"
                  :disabled="!checkedData.length"
                  >禁用布控</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="deletebutton"
                  :disabled="!checkedData.length"
                  @click="onDeleteAll"
                  >删除</el-button
                >
              </div>
              <div class="tableBox">
                <el-table
                  height="550"
                  :data="controlTableData"
                  style="overflow: auto"
                  @selection-change="selectionChange"
                >
                  <el-table-column type="selection" width="30">
                  </el-table-column>
                  <el-table-column
                    label="布控名称"
                    show-overflow-tooltip
                    prop="name"
                    width="80px"
                  >
                  </el-table-column>
                  <el-table-column
                    label="布控状态"
                    prop="monitorState"
                    width="75px"
                  >
                    <template slot-scope="scope">
                      <span>{{
                        scope.row.defenceState === "1" ? "启用" : "禁用"
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="布控对象"
                    show-overflow-tooltip
                    width="80px"
                  >
                    <template slot-scope="scope">
                      {{ filterGroups(scope.row.personGroups) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="摄像机"
                    show-overflow-tooltip
                    width="90px"
                  >
                    <template slot-scope="scope">
                      <span>{{ filterDevices(scope.row.devices) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="50" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        icon="el-icon-view"
                        title="详情"
                        @click="lookContent(scope.$index, scope.row)"
                        style="color: white"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination
                  v-show="controlTableData && controlTableData.length > 0"
                  @pagination="handleCurrentChange"
                  :page.sync="queryParams.pageNum"
                  :pageSizes="[10, 20, 30, 40]"
                  :limit.sync="queryParams.pageSize"
                  :total="total"
                />
              </div>
            </template>
          </highlight-square>
          <!-- 新增布控 -->
          <highlight-square class="rightBox padding-10" v-if="addFormShow">
            <template v-slot:child>
              <div class="title">
                创建布控
                <i class="el-icon-close" @click="addFormShow = false"></i>
              </div>
              <div style="margin-top: 15px">
                <el-form
                  :model="addForm"
                  :rules="addRules"
                  ref="addForm"
                  label-width="80px"
                >
                  <el-form-item label="布控名称" prop="monitorName">
                    <el-input v-model="addForm.monitorName"></el-input>
                  </el-form-item>
                  <el-form-item label="布控对象" prop="monitorGroupIds">
                    <el-select
                      v-model="addForm.monitorGroupIds"
                      placeholder="请选择布控对象"
                      multiple
                      clearable
                      collapse-tags
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="布控类型" prop="hitType">
                    <el-select
                      v-model="addForm.hitType"
                      placeholder="请选择布控类型"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in hitList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分析类型" prop="defenceType">
                    <el-select
                      v-model="addForm.defenceType"
                      placeholder="请选择分析类型"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in memberAnalysisList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <div class="tableBox">
                    <div style="display: flex; justify-content: space-between">
                      <span style="color: #fff; font-size: 14px">摄像机</span>
                      <p v-if="!deviceTableData.length">请添加设备</p>
                    </div>
                    <el-table
                      height="280"
                      :data="deviceTableData"
                      style="width: 100%"
                    >
                      <el-table-column label="序号" width="60">
                        <template slot-scope="scope">
                          {{ scope.$index + 1 }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="摄像机名称"
                        show-overflow-tooltip
                        prop="name"
                      >
                      </el-table-column>
                      <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                          <el-button
                           
                            type="text"
                            @click="lookCamera(scope.$index, scope.row)"
                            style="color: #206aff"
                            >查看</el-button
                          >
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
                  <el-form-item label="布控描述" prop="monitorDesc">
                    <el-input
                      type="textarea"
                      :rows="3"
                      v-model="addForm.monitorDesc"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <div class="submitButton">
                  <el-button plain @click="onCancel"
                    >取消</el-button
                  >
                  <el-button type="primary" @click="onSubmit"
                    >确认</el-button
                  >
                </div>
              </div>
            </template>
          </highlight-square>
          <!-- 摄像机详情 -->
          <highlight-square class="cameraBox padding-10" v-if="cameraShow">
            <template v-slot:child>
              <i class="el-icon-close" @click="cameraShow = false"></i>
              <el-form :model="cameraForm" label-width="100px">
                <el-form-item label="摄像机名称">
                  <el-input v-model="cameraForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="位置">
                  <el-input v-model="cameraForm.position" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="nowVidoe"
                    >实时视频</el-button
                  >
                </el-form-item>
              </el-form>
            </template>
          </highlight-square>
          <highlight-square class="bigVideo padding-10" v-if="videoShow">
            <template v-slot:child>
              <div class="title">
                实时监控
                <i class="el-icon-close" @click="videoShow = false"></i>
              </div>
              <videoPlayer :player="player" />
            </template>
          </highlight-square>
          <!-- 布控详情 -->
          <highlight-square class="controlDetails padding-10" v-if="controlDetailsShow">
            <template v-slot:child>
              <div class="box">
                <div class="title">
                  布控详情
                  <i
                    class="el-icon-close"
                    @click="controlDetailsShow = false"
                  ></i>
                </div>
                <div style="margin-top: 15px">
                  <el-form
                    :model="controlDetailsForm"
                    ref="controlDetailsForm"
                    label-width="80px"
                  >
                    <el-form-item label="布控名称">
                      <el-input
                        v-model="controlDetailsForm.name"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="布控状态">
                      <el-input
                        v-model="controlDetailsForm.defenceState"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="布控类型">
                      <el-input
                        v-model="controlDetailsForm.hitType"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="布控对象">
                      <el-select
                        v-model="controlDetailsForm.personGroups"
                        placeholder="请选择布控对象"
                        multiple
                        disabled
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in typeList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="分析类型">
                      <el-select
                        v-model="controlDetailsForm.defenceType"
                        placeholder="请选择分析类型"
                        disabled
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in memberAnalysisList"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <div class="tableBox">
                      <el-table
                        height="250"
                        :data="controlDetailsForm.devices"
                        style="width: 100%"
                      >
                        <el-table-column label="序号" width="60">
                          <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="摄像机名称"
                          show-overflow-tooltip
                          prop="name"
                        >
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                          <template slot-scope="scope">
                            <el-button
                             
                              type="text"
                              @click="lookCamera(scope.$index, scope.row)"
                              style="color: #206aff"
                              >查看</el-button
                            >
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <el-form-item label="布控描述">
                      <el-input
                        type="textarea"
                        :rows="3"
                        v-model="controlDetailsForm.defenceDesc"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        style="margin: 0 100px"
                        @click="controlDetailsShow = false"
                        >关闭</el-button
                      >
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </template>
          </highlight-square>
        </div>
      </template>
    </highlight-square>
  </div>
</template>

<script>
//import { loadMap } from "@/utils/map/mapCom.js";
import {
  getPeopleControl,
  getMemberType,
  deleteControl,
  batchDeleteControl,
  startControl,
  addControl,
  stopControl,
  getControlDevice,
} from "@/api/peopleManage";
import pagination from "@/components/comPagination";
import { getVideoanAlysis } from "@/api/resource.js";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { mapLocation } from "@/utils/map/positionLocation.js";
import { getDataListByType } from "@/api/resource.js";
import videoPlayer from "@/components/videoPlayer/index.vue";
import { deepClone } from "@/utils";
import { getAllDevice } from "@/api/resource.js";
import { QueryData } from "@/api/configure/argumentsConfigure.js";
var GisMapObj = null,
  viewer = null,
  that = null;
export default {
  components: {
    pagination,
    videoPlayer,
  },
  data() {
    return {
      groupType: "PERSON_GROUP_DICT:71041",
      id: "map-container",
      videoShow: false,
      permission: {
        add: "peoplecontrol::add",
        batchdelete: "peoplecontrol::batchdelete",
        check: "peoplecontrol::check",
        delete: "peoplecontrol::delete",
        list: "peoplecontrol::list",
        start: "peoplecontrol::start",
        stop: "peoplecontrol::stop",
        edit: "peoplecontrol::edit",
        peoplecontrolType: "peoplecontrol::type",
        device: "peoplecontrol::device",
        search: "resource::deviceManage:search",
        membertype: "resource::deviceManage:getVideoanAlysis",
        device: "resource::deviceManage:allSearch",
        searchConfigure: "configure::argumentsConfigure:search",
      },
      queryParams: {
        name: "",
        pageSize: 10,
        pageNum: 1,
      },
      cameraImg: require("../../../../assets/images/map/camera.png"),
      changeImg: require("../../../../assets/images/map/camera-erry.png"),
      carGroup: [], // 布控对象
      contentShow: true, // leftBox的切换
      addFormShow: false, // 新增布控的表单
      // 布控左侧表格数据
      controlTableData: [],
      checkedData: [], // 多选框
      // pageNum: 1,// 分页
      // pageSize: 10, // 每页显示的条数
      total: 0, // 总数量
      // 新增表单数据
      addForm: {
        defenceType: "",
        monitorName: "", // 布控名称
        monitorGroupIds: [], // 布控对象
        monitorType: "2", // 布控类型
        monitorState: "1", //布控状态
        monitorDesc: "", //布控描述
        hitType: "", // 命中类型
        deviceIds: "", // 摄像头
      },
      deviceTableData: [],
      hitList: [
        {
          name: "命中布控",
          value: "1",
        },
        {
          name: "非命中布控",
          value: "2",
        },
      ],
      // 校验
      addRules: {
        monitorName: {
          required: true,
          message: "请输入布控名称",
          trigger: "blur",
        },
        monitorGroupIds: {
          required: true,
          message: "请选择布控对象",
          trigger: "blur",
        },
        hitType: { required: true, message: "请输入布控类型", trigger: "blur" },
        defenceType: {
          required: true,
          message: "请输入分析类型",
          trigger: "blur",
        },
      },
      cameraShow: false, // 摄像机展示
      // 摄像机详情
      cameraForm: {
        name: "",
        position: "",
      },
      // 布控详情
      controlDetailsShow: false, // 详情展示
      controlDetailsForm: {},
      typeList: [],
      locationObj: {
        lat: "",
        lng: "",
      },
      parameter: {
        pageNum: 1,
        pageSize: 1000,
        deviceName: "",
        deviceId: "",
        type: "MOUNTED",
        deviceIds: [],
      },
      deviceList: [],
      cameraList: [],
      map: null,
      locationObj: {
        lat: 34.25759,
        lng: 108.76754,
      },
      EntityManage: {},
      // defaultMapOption: {
      //   center: [],
      //   zoom: 20,       // 默认：比例尺显示100m
      //   resizeEnable: true, //是否监控地图容器尺寸变化
      //   rotateEnable: true,
      //   mapStyle: 'amap://styles/blue'
      // },
      clickIcon: "",
      markers: [],
      preIcon: "",
      clickIcon: "",
      isClickShow: false,
      iconData: {},
      memberTypeList: [],
      memberAnalysisList: [],
    };
  },
  created() {
    this.getMemberTypeList();
    this.getMemberAnalysisList();
    this.infoData();
  },
  mounted() {
    // AMap.event.addListener(
    //   mapLocation.initMap("map-container"),
    //   "complete",
    //   (result) => {
    this.$nextTick(() => {
      this.intoMap();
    });
    // }
    // );
  },
  watch: {
    addFormShow(val) {
      if (val === false) {
        this.markers.map((x) => {
          x.setIcon(this.preIcon);
        });
        this.deviceTableData = [];
        this.isClickShow = false;
      }
    },
  },
  methods: {
    // 地图初始化
    intoMap() {
      that = this;
      let obj = getObjByKey(that.permission.searchConfigure);
      obj.pageNum = 1;
      obj.pageSize = 10;
      obj.name = "离线地图";
      QueryData(obj)
        .then((res) => {
          res.data.data.map((item) => {
            if (item.code === "MAP_ONLINE_OFFLINE") {
//              loadMap(GisMapObj, item.defaultValue).then((res) => {
//                GisMapObj = res;
//                //设置鹰眼控件
//                viewer = GisMapObj.viewer;
//                viewer.scene.globe.depthTestAgainstTerrain = true;
//                viewer.scene.screenSpaceCameraController.enableZoom = false; //禁止缩放
//                viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
//                  ISGis.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
//                );
//                that.EntityManage = new ISGis.Entities.EntityManage(GisMapObj);
//                //相机飞向某个经纬度坐标
//                GisMapObj.cameraFlyTo({
//                  isPoint: true, // 是否需要坐标点
//                  lon: Number(that.locationObj.lng),
//                  lat: Number(that.locationObj.lat),
//                  height: 1000,
//                  time: 2, //飞行时间（秒）
//                  // heading: 0, //// 指向
//                  pitch: -30, //倾角
//                  callback: () => {
//                    that.getDeviceList();
//                  },
//                });
//                //添加地图上的点击事件
//                GisMapObj.addEventListener(
//                  "click",
//                  "MYCLICK",
//                  function (entity, position) {
//                    if (that.isClickShow === false) return;
//                    let isTrue = that.deviceTableData.some(
//                      (x) => x.deviceId === entity.id.id
//                    );
//                    if (!isTrue && entity.id.id) {
//                      var objnul = that.deviceList.filter(
//                        (x) => x.deviceId == entity.id.id
//                      )[0];
//                      that.EntityManage.removeById(objnul.deviceId);
//                      that.EntityManage.removeById(
//                        "point_label" + objnul.deviceId
//                      );
//                      that.drawMarker(false, objnul);
//                      that.deviceTableData.push(objnul);
//                    }
//                  }
//                );
//              });
            }
          });
        })
        .catch((err) => {
          that.$message.error(err);
        });
      // this.map = new AMap.Map(this.id, this.defaultMapOption);
    },
    // 人员类型分析
    getMemberAnalysisList() {
      getVideoanAlysis(
        getObjByKey(this.permission.membertype),
        "video_analysis"
      )
        .then((res) => {
          if (res.meta.status === 200) {
            this.memberAnalysisList = res.data;
            this.memberAnalysisList.pop();
            this.tableData = res.data;
          } else {
            this.$message.error(res.meta.message);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 添加marker点
    drawMarker(type, obj) {
      viewer.scene.globe.depthTestAgainstTerrain = false;
      let templist = [];
      if (type) {
        if (obj) {
          templist.push(obj);
        } else {
          templist = that.deviceList;
        }
      } else {
        templist.push(obj);
      }
      console.log("人员布控 设备数量 ==>" + templist.length);
      for (let i = 0; i < templist.length; i++) {
        let element = [
          Number(templist[i].longitude),
          Number(templist[i].latitude),
        ];
        let id = templist[i].deviceId;
        let name = templist[i].name;
        let protocol = templist[i].protocol;
        that.EntityManage.addEntities([
          {
            type: "billboard",
            id: id,
            name: name,
            nameType: protocol,
            scale: 0.8,
            image: type == true ? that.cameraImg : that.changeImg,
            position: element,
            VerticalOrigin: ISGis.Entities.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            properties: element,
          },
          {
            type: "label",
            id: "point_label" + id,
            name: "point_label" + i,
            text: name,
            style: ISGis.Entities.LabelStyle.FILL,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            pixelOffset: [0, 20],
            font: "20px sans-serif",
            fillColor: "#67c23a",
            position: element,
          },
        ]);
      }
    },
    // handleClickDevice() {
    //   this.isClickShow = true
    // },
    async getDeviceList() {
      let url = getStringByKey(this.permission.device, "url");
      let method = getStringByKey(this.permission.device, "method");
      let searchData = {
        url,
        method,
      };
      getAllDevice(searchData).then((res) => {
        if (res.meta.status === 200) {
          this.deviceList = res.data;
          this.drawMarker(true, null);
        } else {
          this.deviceList = [];
          this.$message.error(res.meta.message);
        }
      });
    },
    // 处理table的Group
    filterGroups(data) {
      let groupArr = [];
      data.map((i) => {
        groupArr.push(i.name);
      });
      return groupArr.join(",");
    },
    // 处理table的devcid
    filterDevices(data) {
      let devArr = [];
      data.map((i) => {
        devArr.push(i.name);
      });
      return devArr.join(",");
    },
    // 初始化车辆布控数据
    infoData() {
      getPeopleControl(
        getObjByKey(this.permission.list),
        this.queryParams
      ).then((res) => {
        if (res.meta.status === 200) {
          this.total = res.data.total;
          this.controlTableData = res.data.data;
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    // 创建布控
    onAdd() {
      this.addFormShow = true;
      this.isClickShow = true;
      this.controlDetailsShow = false;
      // this.getMemberTypeList()
    },
    // 获取布控对象接口
    getMemberTypeList() {
      getMemberType(getObjByKey(this.permission.peoplecontrolType), {
        groupType: this.groupType,
      }).then((res) => {
        if (res.meta.status === 200) {
          this.typeList = res.data;
        } else {
          this.typeList = [];
          this.$message.error(res.meta.message);
        }
      });
    },
    // 启用布控
    onStart(index, item) {
      this.$confirm("此操作将启用该人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          startControl(getObjByKey(this.permission.start), [item.id]).then(
            (res) => {
              if (res.meta.status === 200) {
                this.infoData();
                this.$message({
                  type: "success",
                  message: "启用成功!",
                });
              } else {
                this.$message.error(res.meta.message);
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消禁用",
          });
        });
    },
    onStartAll() {
      let isTrue = this.checkedData.some((x) => x.defenceState == "1");
      if (isTrue) {
        this.$message.error("请选择禁用的布控");
        return;
      }
      this.$confirm("此操作将启用该布控, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          startControl(
            getObjByKey(this.permission.start),
            this.getCheckedId(this.checkedData)
          ).then((res) => {
            if (res.meta.status === 200) {
              this.infoData();
              this.$message({
                type: "success",
                message: "启用成功!",
              });
            } else {
              this.$message.error(res.meta.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消禁用",
          });
        });
    },
    onDisableAll() {
      let isTrue = this.checkedData.some((x) => x.defenceState == "2");
      if (isTrue) {
        this.$message.error("请选择启用的布控");
        return;
      }
      this.$confirm("此操作将禁用该布控, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          stopControl(
            getObjByKey(this.permission.stop),
            this.getCheckedId(this.checkedData)
          ).then((res) => {
            if (res.meta.status === 200) {
              this.infoData();
              this.$message({
                type: "success",
                message: "禁用成功!",
              });
            } else {
              this.$message.error(res.meta.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消禁用",
          });
        });
    },
    // 禁用布控
    onDisable(index, item) {
      this.$confirm("此操作将禁用该人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          stopControl(getObjByKey(this.permission.stop), [item.id]).then(
            (res) => {
              if (res.meta.status === 200) {
                this.infoData();
                this.$message({
                  type: "success",
                  message: "禁用成功!",
                });
              } else {
                this.$message.error(res.meta.message);
              }
            }
          );
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: "已取消禁用",
          });
        });
    },
    onDeleteAll() {
      this.$confirm("此操作将删除选中的布控信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          batchDeleteControl(
            getObjByKey(this.permission.batchdelete),
            this.getCheckedId(this.checkedData)
          ).then((res) => {
            if (res.meta.status === 200) {
              this.queryParams.pageNum = 1;
              this.infoData();
              this.$message({
                type: "success",
                message: "批量删除成功!",
              });
            } else {
              this.$message.error(res.meta.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getCheckedId(checkedData) {
      let ids = [];
      checkedData.map((item) => {
        ids.push(item.id);
      });
      return ids;
    },
    // 删除布控
    onDelete(item) {
      this.$confirm("此操作将永久删除该人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteControl(getObjByKey(this.permission.delete), item.id)
            .then((res) => {
              if (res.meta.status === 200) {
                this.queryParams.pageNum = 1;
                this.infoData();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                this.$message.error(res.meta.message);
              }
            })
            .catch((err) => {
              this.$message.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 布控详情
    lookContent(index, item) {
      this.controlDetailsForm = deepClone(item);
      this.controlDetailsForm.personGroups =
        this.controlDetailsForm.personGroups.map((v) => v.id);
      this.controlDetailsForm.defenceState =
        this.controlDetailsForm.defenceState == 1 ? "启用" : "禁用";
      this.controlDetailsForm.hitType =
        this.controlDetailsForm.hitType == 1 ? "命中布控" : "非命中布控";
      this.controlDetailsShow = true;
      this.addFormShow = false;
    },
    // 根据车主搜索
    onSearch() {
      this.infoData();
    },
    selectionChange(n) {
      this.checkedData = n;
    },
    // 点击布控配置切换
    handleClick() {
      this.contentShow = !this.contentShow;
    },
    // 分页每页的数量
    handleSizeChange(n) {
      this.queryParams.pageSize = n;
      this.infoData();
    },
    // 切换到第几页了
    handleCurrentChange(n) {
      // this.queryParams.pageNum = n
      this.infoData();
    },
    // add布控
    // 查看摄像机
    lookCamera(index, item) {
      console.log("item ----", item);
      this.cameraShow = true;
      this.cameraForm = item;
      this.cameraForm.position = `lat:${item.latitude};lng${item.longitude}`;
    },
    // 删除摄像机
    deleteCamera(index, item) {
      this.deviceTableData.splice(index, 1);
      that.EntityManage.removeById(item.deviceId);
      that.EntityManage.removeById("point_label" + item.deviceId);
      that.drawMarker(true, item);
    },
    // 取消
    onCancel() {
      this.$refs.addForm.resetFields();
      that.EntityManage.removeAll();
      this.drawMarker(true, null);
      this.addFormShow = false;
    },
    // add确认
    onSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.deviceTableData.length === 0) {
            return this.$message.error("请添加设备");
          }
          this.addForm.devices = this.deviceTableData;
          let ids = [];
          this.addForm.devices.map((item) => {
            ids.push({ deviceId: item.deviceId });
          });
          let group = [];
          this.addForm.monitorGroupIds.map((i) => {
            group.push({ id: i });
          });
          let data = {
            devices: ids,
            personGroups: group,
            hitType: this.addForm.hitType,
            defenceDesc: this.addForm.monitorDesc,
            name: this.addForm.monitorName,
            defenceState: "1",
            defenceType: this.addForm.defenceType,
          };
          addControl(getObjByKey(this.permission.add), data).then((res) => {
            if (res.meta.status === 200) {
              this.infoData();
              this.$refs.addForm.resetFields();
              this.addFormShow = false;
            } else {
              this.$message.error(res.meta.message);
            }
          });
        } else {
          return false;
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
  destroyed() {
    this.map && this.map.destroy();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .cesium-viewer .cesium-viewer-toolbar {
  display: none;
}
::v-deep .cesium-viewer #navigationDiv {
  display: none;
}
.app-container {
  position: relative;
  #cesiumContainer {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    .mainButton {
      position: absolute;
      left: 20px;
      top: 10px;
      z-index: 100;
    }
    .leftBox {
      position: absolute;
      top: 60px;
      left: 20px;
      // width: 22%;
      width: fit-content;
      height: fit-content;
      bottom: 50px;
      // min-width: 350px;
      // height: 85%;
      z-index: 100;
      padding: 10px;
      background-color: rgba(0, 15, 52, 0.9);
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
        button {
          color: white;
        }
        .deletebutton {
          color: #f05656;
        }
      }
    }
    .rightBox {
      .submitButton {
        width: 100%;
        // position: absolute;
        // bottom: 20px;
        display: flex;
        justify-content: center;
      }
    }

    .cameraBox {
      position: absolute;
      top: 70px;
      right: 27%;
      width: 20%;
      z-index: 100;
      padding: 10px;
      padding-top: 30px;
      background-color: rgba(0, 15, 52, 0.9);
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
      top: 70px;
      right: 20px;
      width: 20%;
      min-width: 350px;
      height: 85%;
      z-index: 100;
      padding: 10px;
      background-color: rgba(0, 15, 52, 0.9);
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
      .tableBox {
        position: relative;
        p {
          color: #f05656;
          font-size: 12px;
          position: absolute;
          left: 80px;
          top: -10px;
        }
      }
    }

    .bigVideo {
      position: absolute;
      width: 300px;
      left: 27%;
      top: 70px;
      min-width: 400px;
      height: 265px;
      z-index: 100;
      padding: 10px;
      background-color: rgba(0, 15, 52, 0.9);
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
  }
  ::v-deep .el-table__empty-text {
    padding-top: 160px;
    background-size: contain;
  }
}
</style>
<style>
.amap-marker-label {
  background-color: transparent !important;
  border: none !important;
}
</style>
