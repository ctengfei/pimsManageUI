<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <gis-map ref="gisMap" @deviceInfo="deviceInfo"></gis-map>
      <el-button class="mainButton" type="primary" @click="handleClick"
        >布控配置</el-button
      >
      <!-- 布控列表 -->
      <div class="leftBox padding-10" v-if="contentShow">
        <div class="seachBox">
          <el-input
            v-model="formSeach.carOwner"
            placeholder="请输入布控名称"
            clearable
          ></el-input>
          <el-button
            icon="el-icon-search"
            @click="onSearch"
            type="primary"
            >搜索</el-button
          >
        </div>
        <div class="addBox">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="onAdd"
            >创建布控</el-button
          >
          <el-button
            type="warning"
            plain
            icon="el-icon-video-play"
            @click="onStartAll"
            :disabled="!checkedData.length"
            >启用布控</el-button
          >
          <el-button
            plain
            icon="el-icon-circle-close"
            @click="onDisableAll"
            :disabled="!checkedData.length"
            >禁用布控</el-button
          >
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            class="deletebutton"
            :disabled="!checkedData.length"
            @click="onDeleteAll"
            >删除</el-button
          >
        </div>
        <div class="tableBox">
          <el-table
            height="100%"
            :data="controlTableData"
            style="width: 100%"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" width="30"> </el-table-column>
            <el-table-column label="布控名称" show-overflow-tooltip prop="name">
            </el-table-column>
            <el-table-column label="布控状态" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.status == "ENABLE" ? "启用" : "禁用" }}
              </template>
            </el-table-column>
            <el-table-column label="布控对象" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.type == "White" ? "白名单" : "黑名单" }}
              </template>
            </el-table-column>

            <el-table-column width="50" label="操作">
              <template slot-scope="scope">
                <el-button
                 
                  type="text"
                  icon="el-icon-edit"
                  title="编辑"
                  @click="editContent(scope.$index, scope.row)"
                  style="color: white"
                ></el-button>
                <el-button
                 
                  type="text"
                  icon="el-icon-view"
                  title="查看"
                  @click="lookContent(scope.$index, scope.row)"
                  style="color: white"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            style="margin-top: 0px"
            v-show="controlTableData && controlTableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="pageSize"
            :layout="'total, sizes, prev, pager, next'"
            :total="total"
          />
        </div>
      </div>

      <!-- 新增布控 -->
      <div class="rightBox padding-10" v-if="addFormShow">
        <div class="title" v-show="addtype == 'create'">
          创建布控
        </div>
        <div class="title" v-show="addtype == 'look'">
          查看布控
        </div>
        <div class="title" v-show="addtype == 'edit'">
          编辑布控
        </div>
        <div style="margin-top: 15px;">
          <el-form
            :model="addForm"
            :rules="addRules"
            ref="addForm"
            style="height:100%"
            label-width="80px"
          >
            <el-form-item label="布控名称" prop="name">
              <el-input
                v-model="addForm.name"
                clearable
                :disabled="addOredit"
              ></el-input>
            </el-form-item>
            <el-form-item label="布控对象" prop="monitorObject">
              <el-cascader
                :disabled="addOredit"
                v-model="addForm.monitorObject"
                :options="groups"
                :props="{
                  expandTrigger: 'hover',
                  value: 'code',
                  label: 'name'
                }"
              ></el-cascader>
            </el-form-item>

            <div class="tableBox mb20">
              <div class="tableBoxTitle">
                <div>
                  <span style="color: #f05656">*</span>
                  <span>布控对象</span>
                  <span
                    style="color: #f05656;font-size:12px"
                    v-show="!flag"
                    >请添加布控摄像头</span
                  >
                </div>
                <el-button
                  style="height: 30px"
                  :plain="addActive ? false : true"
                  type="primary"
                  @click="addCarmea"
                  :disabled="addOredit"
                  ><i class="el-icon-circle-plus-outline"></i>添加</el-button
                >
              </div>

                <el-table :data="addForm.cameraList">
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
                  <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                      <el-button
                       
                        type="text"
                        :disabled="addOredit"
                        @click="deleteCamera(scope.$index, scope.row)"
                        style="color: #f05656"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
            </div>
            <el-form-item label="布控描述" prop="description">
              <el-input
                :disabled="addOredit"
                type="textarea"
                :rows="2"
                v-model="addForm.description"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="submitButton mt20">
            <el-button plain @click="onCancel"
              >取消</el-button
            >
            <el-button
              type="primary"
              @click="onSubmit"
              v-show="!addOredit"
              >确认</el-button
            >
          </div>
        </div>
      </div>
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
      <!-- 实时视频 -->
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
      <highlight-square
        class="controlDetails padding-10"
        v-if="controlDetailsShow"
      >
        <template v-slot:child>
          <div class="box">
            <div class="title">
              布控详情
              <i class="el-icon-close" @click="controlDetailsShow = false"></i>
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
                <el-form-item label="布控对象">
                  <el-select
                    v-model="controlDetailsForm.object"
                    placeholder="请选择布控对象"
                    disabled
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in carGroup"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分析类型" prop="type">
                  <el-select
                    v-model="controlDetailsForm.type"
                    placeholder="请选择分析类型"
                    style="width: 100%"
                    disabled
                  >
                    <el-option
                      v-for="item in analysisType"
                      :key="item.name"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div class="tableBox">
                  <span>摄像机</span>
                  <el-table
                    height="300"
                    :data="controlDetailsForm.cameraList"
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
                    :rows="4"
                    v-model="controlDetailsForm.desc"
                    disabled
                    style="background-color: transparent"
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
      <div v-show="crameShow" class="crameShowMask">
        <div class="close">
          <svg-icon
            icon-class="icon-guanbi"
            style="height: 30px;width: 16px;"
            @click="onclose"
          />
          <div class="icon-name"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gisMap from "@/components/common/map/gis-map";
import { getStringByKey, getObjByKey } from "@/utils/voice.js";
import pagination from "@/components/comPagination";
import videoPlayer from "@/components/videoPlayer/index.vue";
import { getAllDevice } from "@/api/resource.js";
import {
  getCarMonitorTask,
  postCarContent,
  getStopTask,
  getStartTask,
  deleteCarContent,
  getCarControl
} from "@/api/carManage/carControl";
import { getDicts, add, del } from "@/api/system/dict";
import { QueryData } from "@/api/configure/argumentsConfigure.js";

import { getCarInformation } from "@/api/monitor/timemonitor";
import { getIvsPlayer } from "@/api/system/organization";
var GisMapObj = null,
  viewer = null,
  that = null;
export default {
  name:'CarControl',
  components: {
    videoPlayer,
    pagination,
    gisMap
  },
  data() {
    return {
      locationObj: {
        lat: 34.25759,
        lng: 108.76754
      },
      groupType: "CAR_GROUP_DICT:71042",
      carGroup: [
        {
          name: "外来车辆",
          value: "EXTERNAL"
        },
        {
          name: "可疑车辆",
          value: "SUSPICIOUS"
        }
      ], // 布控对象
      analysisType: [
        {
          name: "车辆分析",
          value: "car_analysis_DICT:71024"
        }
      ], // 识别类型
      EntityManage: {},
      contentShow: true, // leftBox的切换
      addFormShow: false, // 新增布控的表单
      formSeach: {
        // 搜索
        carOwner: ""
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
        monitorObject: "",
        cameraList: [],
        description: ""
      },
      // 校验
      addRules: {
        name: {
          required: true,
          message: "请输入布控名称",
          trigger: ["blur", "change"]
        },
        monitorObject: {
          required: true,
          message: "请选择布控对象",
          trigger: ["blur", "change"]
        },
        type: {
          required: true,
          message: "请选择分析类型",
          trigger: ["blur", "change"]
        }
      },
      cameraShow: false, // 摄像机展示
      // 摄像机详情
      cameraForm: {
        name: "",
        position: ""
      },
      videoShow: false, // 实时监控展示
      player: {}, // 监控的流路径
      // 布控详情
      controlDetailsShow: false, // 详情展示
      controlDetailsForm: {
        name: "",
        object: "",
        type: "",
        cameraList: [],
        desc: ""
      },
      permission: {
        carControlType: "carManage::carControl::carControlType",
        getCarMonitorTask: "carManage::carControl::getCarMonitorTask",
        cardevice: "carManage::carControl::cardevice",
        postCarContent: "carManage::carControl::postCarContent",
        getStopTask: "carManage::carControl::getStopTask",
        getStartTask: "carManage::carControl::getStartTask",
        deleteCarContent: "carManage::carControl::deleteCarContent",
        search: "resource::deviceManage:search",
        getByTypeCode: "system::dict::tablerow",
        device: "resource::deviceManage:allSearch",
        searchs: "system::dict::searchpage",
        searchConfigure: "configure::argumentsConfigure:search",
        updatecarControl: "carManage::carControl::updatecarControl"
      },
      deviceList: [],
      preIcon: "",
      clickIcon: "",
      addtype: "",
      isClickShow: false,
      parameter: {
        pageNum: 1,
        pageSize: 1000,
        deviceName: "",
        deviceId: "",
        type: "MOUNTED",
        deviceIds: []
      },
      searchData: {
        pageNum: 1,
        pageSize: 1000
      },
      markers: [],
      cameraImg: require("../../../../assets/images/map/camera.png"),
      changeImg: require("../../../../assets/images/map/camera-erry.png"),
      addActive: false,
      addOredit: false,
      isedit: true,
      groups: [],
      crameShow: false,
      rtspUrl: "",
      devicecode: "",
      widowWidth: document.documentElement.clientWidth,
      widowHeight: document.documentElement.clientHeight,
      flag: true,
    };
  },
  watch: {
    addFormShow(n) {
      if (!n) {
        this.markers.map(x => {
          x.setIcon(this.preIcon);
        });
        this.addForm.cameraList = [];
        this.isClickShow = false;
      }
    },
     widowWidth (val) {
        let that = this;
        console.log('实时屏幕宽度', val, that.widowWidth)
      },
      widowHeight (val) {
        let that = this;
        console.log('实时屏幕高度', val, that.widowHeight)
      },
  },
  beforeDestroy() {
    this.onclose()
  },
  created() {
    // this.getCarGroup();
    // this.infoData();
  },
  mounted() {
    this.infoData();
    this.init();

  },
  methods: {
    handlechangse() {
      console.log(this.addForm.monitorObject, "0");
    },
    init() {
      getDicts('/sys/dict/type/page', 'get', this.searchData).then(res => {
        if (res.code === 200) {
          let datas = res.data.data.filter(item => {
            return item.code == "White" || item.code == "Black";
          });
          for (let i in datas) {
            datas[i].children = [];
            datas[i].level = 1;
          }
          this.groups = datas;
          this.getCarGroupList();
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    // 获取左侧组列表，树结构
    getCarGroupList() {
      //let obj = getObjByKey(this.permission.getByTypeCode);
      for (let i = 0; i < this.groups.length; i++) {
        let data = {
          pageNum: 1,
          pageSize: 100,
          dictTypeCode: this.groups[i].code
        };
        getDicts('/sys/dict', 'get', data)
          .then(res => {
            if (res.code === 200) {
              for (let j in res.data.data) {
                // leaf
                res.data.data[j].leaf = true;
                res.data.data[j].level = 2;
                this.groups[i].children.push(res.data.data[j]);
              }
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
      console.log(this.groups);
    },
    addCarmea() {
      console.log(this.$refs.gisMap);
      this.addActive = !this.addActive;
    },
    onclose() {
      this.crameShow = false;
      let str1 = `{"cmd":"destroy","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`;
      this.$store.state.socket.Csock.send(str1);
      let str = {
        cmd: "stop_all",
        id: "001",
        time: "2020-08-17 00:00:00.000",
        cmd_id: "001_1"
      };
      this.$store.state.socket.Csock.send(JSON.stringify(str));
    },
    deviceInfo(carmeaInfo) {
      console.log(carmeaInfo, "carmeaInfocarmeaInfocarmeaInfo");
      this.devicecode = carmeaInfo.deviceCode;
      if (this.addActive) {
        if (carmeaInfo.deviceType == "camera") {
          if (this.addForm.cameraList.length > 0) {
            let flag = false;
            this.addForm.cameraList.filter(item => {
              if (item.id == carmeaInfo.id) {
                flag = true;
                this.$message.info("此设备已添加");
              }
            });
            if (!flag) {
              const temp = {
                id: carmeaInfo.id,
                code: carmeaInfo.code,
                name: carmeaInfo.deviceName
              };
              this.addForm.cameraList.push(temp);
              this.flag = true;
            }
          } else {
            const temp = {
              id: carmeaInfo.id,
              code: carmeaInfo.code,
              name: carmeaInfo.deviceName
            };
            this.addForm.cameraList.push(temp);
            this.flag = true;
          }
        } else {
          this.$message.error("请选择摄像头设备");
        }
      }
    },
    // 地图初始化
    initmap() {
      // that = this;
      // let obj = getObjByKey(that.permission.searchConfigure);
      // obj.pageNum = 1;
      // obj.pageSize = 10;
      // obj.name = "离线地图";
      // QueryData(obj)
      //   .then((res) => {
      //     res.data.data.map((item) => {
      //       if (item.code === "MAP_ONLINE_OFFLINE") {
      //         loadMap(GisMapObj, item.defaultValue).then((res) => {
      //           GisMapObj = res;
      //           //设置鹰眼控件
      //           viewer = GisMapObj.viewer;
      //           viewer.scene.globe.depthTestAgainstTerrain = true;
      //           viewer.scene.screenSpaceCameraController.enableZoom = false; //禁止缩放
      //           viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      //             ISGis.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      //           );
      //           that.EntityManage = new ISGis.Entities.EntityManage(GisMapObj);
      //           //相机飞向某个经纬度坐标
      //           GisMapObj.cameraFlyTo({
      //             isPoint: true, // 是否需要坐标点
      //             lon: Number(that.locationObj.lng),
      //             lat: Number(that.locationObj.lat),
      //             height: 1000,
      //             time: 2, //飞行时间（秒）
      //             // heading: 0, //// 指向
      //             pitch: -30, //倾角
      //             callback: () => {
      //               that.getDeviceList();
      //             },
      //           });
      //           //添加地图上的点击事件
      //           GisMapObj.addEventListener(
      //             "click",
      //             "MYCLICK",
      //             function (entity, position) {
      //               if (that.isClickShow === false) return;
      //               let isTrue = that.addForm.cameraList	.some(
      //                 (x) => x.deviceId === entity.id.id
      //               );
      //               if (!isTrue) {
      //                 var objnul = that.deviceList.filter(
      //                   (x) => x.deviceId == entity.id.id
      //                 )[0];
      //                 that.EntityManage.removeById(objnul.deviceId);
      //                 that.EntityManage.removeById(
      //                   "point_label" + objnul.deviceId
      //                 );
      //                 that.drawMarker(false, objnul);
      //                 that.addForm.cameraList	.push(objnul);
      //               }
      //             }
      //           );
      //         });
      //       }
      //     });
      //   })
      //   .catch((err) => {
      //     that.$message.error(err);
      //   });
    },
    // 获取设备
    getDeviceList() {
      let url = getStringByKey(this.permission.device, "url");
      let method = getStringByKey(this.permission.device, "method");
      let searchData = {
        url,
        method
      };
      getAllDevice(searchData).then(res => {
        if (res.data) {
          this.deviceList = res.data;
          this.drawMarker(true, null);
        } else {
          this.deviceList = [];
          this.$message.error(res.meta.message);
        }
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
      console.log("车辆布控 设备数量 ==>" + templist.length);
      for (let i = 0; i < templist.length; i++) {
        let element = [
          Number(templist[i].longitude),
          Number(templist[i].latitude)
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
            properties: element
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
            position: element
          }
        ]);
      }
    },
    getCarGroup() {
      let obj = getObjByKey(this.permission.search);
      let url = this.$store.getters.btnpremissAll[
        this.permission.carControlType
      ].url;
      let method = this.$store.getters.btnpremissAll[
        this.permission.carControlType
      ].method;
      let group = {
        url: `${url}?groupType=${this.groupType}`,
        method: method
      };
      getCarControl(obj, group).then(res => {
        if (res.meta.status === 200) {
          this.carGroup = res.data;
        } else {
          this.carGroup = [];
        }
      });
    },
    // 初始化车辆布控数据
    infoData() {
      let group = {
        name: this.formSeach.carOwner,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getCarMonitorTask(group).then(res => {
        if (res.code === 200) {
          this.total = res.data.total;
          this.controlTableData = res.data.data;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            totalPage === this.pageNum &&
            this.controlTableData.length === 1
          ) {
            this.pageNum--;
          }
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    // 处理table的devcid
    filterDevices(data) {
      let devArr = [];
      data.map(i => {
        devArr.push(i.name);
      });
      return devArr.join(",");
    },
    // 处理table的carGroups
    filterCarGroups(data) {
      let groupArr = [];
      data.map(i => {
        groupArr.push(i.name);
      });
      return groupArr.join(",");
    },
    // 根据编码获取到name
    filterItemCode(code) {
      let a = this.carGroup.filter(item => item.value == code.trim());
      if (a[0]) {
        return a[0].name;
      }
    },
    // 创建布控
    onAdd() {
      this.addForm = {
        name: "",
        monitorObject: "",
        cameraList: [],
        description: ""
      };
      this.isedit = false;
      this.addOredit = false;
      this.addFormShow = true;
      this.isClickShow = true;
      this.controlDetailsShow = false;
      this.cameraShow = false;
      this.videoShow = false;
      this.addtype = 'create';
    },
    // 批量启用布控
    onStartAll() {
      this.checkedData.map(item => {});
      let isTrue = this.checkedData.some(x => x.status == "ENABLE");
      if (isTrue) {
        this.$message.error("请选择禁用的布控");
        return;
      }
      let obj = getObjByKey(this.permission.getStartTask);
      let dt = {
        ids: this.getCheckedId(this.checkedData),
        status: "ENABLE"
      };
      this.$confirm("此操作将启用选中的布控信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getStartTask(obj, dt).then(res => {
            if (res.meta.status === 200) {
              this.infoData();
              this.$message({
                type: "success",
                message: "启用成功!"
              });
            } else {
              this.$message.error(res.meta.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用"
          });
        });
    },
    // 批量禁用布控
    onDisableAll() {
      let isTrue = this.checkedData.some(x => x.status == "DISABLED");
      if (isTrue) {
        this.$message.error("请选择启用的布控");
        return;
      }
      let obj = getObjByKey(this.permission.getStopTask);
      let dt = {
        ids: this.getCheckedId(this.checkedData),
        status: "DISABLED"
      };
      this.$confirm("此操作将禁用选中的布控信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getStopTask(obj, dt).then(res => {
            if (res.meta.status === 200) {
              this.infoData();
              this.$message({
                type: "success",
                message: "禁用成功!"
              });
            } else {
              this.$message.error(res.meta.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消禁用"
          });
        });
    },

    onDeleteAll() {
      let obj = getObjByKey(this.permission.deleteCarContent);
      let dt = this.getCheckedId(this.checkedData);

      this.$confirm("此操作将删除选中的布控信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCarContent(obj, dt).then(res => {
            if (res.meta.status === 200) {
              this.pageNum = 1;
              this.infoData();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message.error(res.meta.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getCheckedId(checkedData) {
      let ids = [];
      checkedData.map(item => {
        ids.push(item.id);
      });
      return ids;
    },
    // 布控详情

    editContent(index, item) {
      this.isedit = true;
      this.addOredit = false;
      this.$nextTick(() => {
        let copy = Object.assign({}, item);
        this.addForm = copy;
        this.addForm.monitorObject = [];
        this.addForm.monitorObject = [
          this.addForm.type,
          this.addForm.groupCode
        ];
      });
      this.addtype = 'edit';
      this.addFormShow = true;
    },
    lookContent(index, item) {
      this.addOredit = true;
      this.$nextTick(() => {
        let copy = Object.assign({}, item);
        this.addForm = copy;
        this.addForm.monitorObject = [];
        this.addForm.monitorObject = [
          this.addForm.type,
          this.addForm.groupCode
        ];
      });
      this.addtype = 'look';
      this.addFormShow = true;
    },
    // 根据车主搜索
    onSearch() {
      this.infoData();
    },
    // 多选框的实时赋值
    selectionChange(n) {
      this.checkedData = n;
    },
    // 分页每页的数量
    handleSizeChange(n) {
      this.pageSize = n;
      this.infoData();
    },
    // 切换到第几页了
    handleCurrentChange(n) {
      // this.pageNum = n
      this.infoData();
    },
    // 点击布控配置切换
    handleClick() {
      this.contentShow = !this.contentShow;
    },

    // add布控
    // 查看摄像机
    lookCamera(index, item) {
      console.log("item ====", item);
      console.log("this.device----", this.deviceList);
      console.log(this.devicecode, "9");
      this.crameShow = true;
      let _this = this;
      let str = {
        cmd: "show",
        id: "001",
        time: "2020-08-17 00:00:00.000",
        cmd_id: "001_1 "
      };
      _this.$store.state.socket.Csock.send(JSON.stringify(str));
      let data = {
        cameraCode: this.devicecode,
        mediaURLParam: {
          broadCastType: 0,
          packProtocolType: 1,
          protocolType: 2,
          serviceType: 1,
          streamType: 2,
          transMode: 0
        }
      };
      getIvsPlayer("/sm/ivs/player/play", "POST", data)
        .then(res => {
          if (res.meta.status == 200) {
            _this.rtspUrl = res.data.rtspURL;
            // this.referenceIdArr.
            if (res.data.description == "成功") {
              let str3 = {
                cmd: "play_real",
                id: "001",
                time: "2020-08-17 00:00:00.000",
                camera_id: _this.rtspUrl,
                camera_name: "摄像头",
                wnd_index: 1,
                cmd_id: "001_1 "
              };
              _this.$store.state.socket.Csock.send(JSON.stringify(str3));
            } else {
              this.$message.info(res.data.description);
              let str3 = {
                cmd: "stop_real",
                id: "001",
                time: "2020-08-17 00:00:00.000",
                wnd_index: 1,
                cmd_id: "001_1 "
              };
              _this.$store.state.socket.Csock.send(JSON.stringify(str3));
            }
          }
        })
        // .catch(err => {
        //   this.$message.error(err);
        // });
      // this.cameraShow = true;
      // this.videoShow = false;
      // this.cameraForm = item;
      // this.cameraForm.position = `lat:${item.latitude};lng${item.longitude}`;
    },
    // 删除摄像机
    deleteCamera(index, item) {
      this.addForm.cameraList.splice(index, 1);
    },
    // 取消
    onCancel() {
      this.$refs.addForm.resetFields();
      this.addActive = false;
      this.addForm.cameraList = [];
      this.addFormShow = false;
    },
    // add新增确认
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let obj = this.isedit
            ? getObjByKey(this.permission.updatecarControl)
            : getObjByKey(this.permission.postCarContent);

          let data = {
            name: this.addForm.name,
            type: this.addForm.monitorObject[0],
            groupCode: this.addForm.monitorObject[1],
            cameraList: this.addForm.cameraList,
            description: this.addForm.description
          };
          if (this.isedit) {
            data.id = this.addForm.id;
          }
          postCarContent(data)
            .then(res => {
              if (res.code === 200) {
                this.addFormShow = false;
                this.isedit
                  ? this.$message.success("修改成功")
                  : this.$message.success("创建成功");
                this.infoData();
                this.addActive = false;
                this.addForm.cameraList = [];
                this.$refs.addForm.resetFields();
              } else {
                this.$message.error(res.meta.message);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          debugger
          if(!this.addForm.cameraList.length){
            this.flag = false;
          }
          return false;
        }
      });
    },
    // 实时监控
    nowVidoe() {
      this.videoShow = true;
      this.player = {
        deviceId: this.cameraForm.deviceId,
        protocol: this.cameraForm.protocol
      };
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .cesium-viewer .cesium-viewer-toolbar {
  display: none;
}
::v-deep .cesium-viewer #navigationDiv {
  display: none;
}
.app-container-gis {
  position: relative;
  #cesiumContainer {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    .mainButton {
      position: absolute;
      left: 50px;
      top: 10px;
      z-index: 100;
    }
    .leftBox {
      position: absolute;
      top: 70px;
      width: fit-content;
      height: 86%;
      z-index: 100;
      padding: 20px;
      left: 20px;
      background-color: rgba(32, 34, 48, .9);
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
        // button {
        //   color: white;
        // }
        // .deletebutton {
        //   color: #f05656;
        // }
      }
    }

    .cameraBox {
      position: absolute;
      top: 70px;
      right: 27%;
      width: 20%;
      height: 22%;
      z-index: 100;
      padding: 10px;
      padding-top: 30px;
      background-color: rgba(32, 34, 48, 1);
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
      width: 22%;
      min-width: 350px;
      height: 80%;
      z-index: 100;
      overflow-y: auto;
      padding: 20px;
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
      .submitButton {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .tableBox {
        position: relative;
        .tableBoxTitle {
          font-size: 14px;
          height: 30px;
          display: flex;
          justify-content: space-between;
          span {
            // color: #afb9d0;
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

  ::v-deep .el-table__empty-text {
    padding-top: 160px;
    background-size: contain;
  }
}
::v-deep .el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}
::v-deep.el-table.el-table--fit {
  overflow: hidden;
}
::v-deep.el-cascader--small {
  width: 100%;
}
.crameShowMask {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.close {
  position: fixed;
  right: 31px;
  top: 16px;
}
</style>
<style>
.amap-marker-label {
  background-color: transparent !important;
  border: none !important;
}
</style>
