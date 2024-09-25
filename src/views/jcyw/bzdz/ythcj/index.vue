<!--
 * @Author: renjianwu jwrenx@isstech.com
 * @Date: 2023-02-23 16:26:34
 * @LastEditors: renjianwu jwrenx@isstech.com
 * @LastEditTime: 2023-03-29 15:33:35
 * @FilePath: \pimsManageUI\src\views\jcyw\bzdz\ythcj\index.vue
 * @Description: 
-->
<template>
  <div class="ythcj app-container">
    <div
      id="popMenu"
      class="popMenu"
      v-show="menuVisible"
      @mouseleave="menuVisible = !menuVisible"
    >
      <el-card class="box-cards">
        <div
          class="text-item"
          v-for="(item, index) in addInfoOptions"
          @click="selectMenu(index)"
          v-hasPermi="item.permiKey"
          :key="index"
        >
          <el-link :icon="item.icon" :underline="false">{{
            item.label
          }}</el-link>
        </div>
      </el-card>
    </div>
    <el-row
      type="flex"
      justify="space-between"
      style="height: 100%; overflow: hidden"
    >
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4" class="treeBox">
        <!-- <el-input v-model="filterText"
                  placeholder="请输入地址名称"
                  clearable
                  size="small"
                  prefix-icon="el-icon-search"
                  style="margin-bottom: 5px; padding: 8px; box-sizing: border-box" /> -->
        <!-- tree上面增加元素的要去改变树的padding第一个值为0  然后新增元素的padding-top=10px   作用为距离顶部的距离 -->
        <el-tree
          :props="props"
          :load="loadNode"
          lazy
          node-key="id"
          v-if="treeSelectId"
          :default-expand-all="true"
          :default-expanded-keys="deptTreeExpanded"
          @node-click="handleNodeClick"
          @node-contextmenu="rightClick"
          :filter-node-method="filterNode"
          ref="tree"
          class="tree"
        >
          <!-- lazy -->
          <!-- :load="deptTreeLoad" -->
        </el-tree>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="20"
        :lg="20"
        :xl="20"
        style="
          padding: 10px;
          margin: 0px;
          box-sizing: border-box;
          background-color: white;
        "
      >
        <el-row style="width: 100%; overflow: hidden">
          <el-col :span="24">
            <div
              id="map"
              ref="rootmap"
              class="map-container"
              style="width: calc(100vh + 580px); height: calc(100vh - 150px)"
              @contextmenu="doNothing()"
            >
              <switch-layers
                class="layers-box"
                @getChecking="getChecking"
              ></switch-layers>
              <div class="measure-button">
                <div class="measure-box">
                  <div @click="addZoom" class="icons">
                    <i class="el-icon-plus"></i>
                  </div>
                  <el-divider></el-divider>
                  <div @click="setMapCenter">
                    <img src="@/assets/images/juzhong.svg" alt="light" />
                  </div>
                  <el-divider></el-divider>
                  <div @click="reduceZoom" class="icons">
                    <i class="el-icon-minus"></i>
                  </div>
                </div>
                <div class="measure-box">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="面积测量"
                    placement="right-end"
                  >
                    <div @click="measuredArea">
                      <img src="@/assets/images/cemianji.svg" alt="light" />
                    </div>
                  </el-tooltip>
                  <el-divider></el-divider>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="距离测量"
                    placement="right-end"
                  >
                    <div @click="measuredDistance">
                      <img src="@/assets/images/ceju.svg" alt="light" />
                    </div>
                  </el-tooltip>
                </div>
              </div>

              <div class="search-detail-box">
                <!-- <div class="search-control">
                  <el-autocomplete
                    v-model="searchText"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入地点"
                    clearable
                    @select="handleSelect"
                  >
                    <el-button
                      slot="append"
                      type="primary"
                      icon="el-icon-search"
                      @click="searchAll"
                    ></el-button>
                    <template slot-scope="{ item }">
                      <div class="search-poi-list">
                        <div class="mr-10px">
                          <i class="el-icon-search"></i>
                        </div>
                        <div class="mr-12px poi-name">
                          {{ item.values_.NAMEC }}
                        </div>
                        <div class="mr-10px poi-addr">
                          {{ item.values_.ADDRESS2 }}
                        </div>
                      </div>
                    </template>
                  </el-autocomplete>
                </div> -->
                <div class="detail-button" v-if="isShowBtn">
                  <div @click="startDrawing">
                    <i class="el-icon-full-screen"></i>
                    <el-button type="text">绘制</el-button>
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div @click="delDrawing">
                    <i class="el-icon-delete"></i>
                    <el-button type="text">删除</el-button>
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div @click="editDrawing" v-if="showEdit">
                    <i class="el-icon-edit"></i>
                    <el-button type="text">修改</el-button>
                  </div>
                  <el-divider direction="vertical" v-if="showEdit"></el-divider>
                  <div @click="submitPoints">
                    <i class="el-icon-check"></i>
                    <el-button type="text">保存</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      :title="drawerTitle"
      :visible.sync="addCell"
      :wrapperClosable="true"
      size="40%"
      width="600px"
      direction="rtl"
    >
      <el-form
        :model="addCellForm"
        :rules="addCellRules"
        ref="addCellForm"
        style="height: 90%; display: flex; flex-direction: column"
        label-width="110px"
        class="add-drawer"
      >
        <el-form-item label="上级名称：">
          {{ addCellForm.dizhiqian }}
        </el-form-item>
        <el-form-item
          label="门楼牌号："
          prop="dzysBmmc"
          class="menloupai"
          v-if="isselectMlph"
        >
          <el-input
            placeholder="请填写门楼牌号"
            maxlength="5"
            show-word-limit
            type="number"
            v-model="addCellForm.dzysBmmc"
          >
            <el-select
              v-model="addCellForm.dzysBmqz"
              slot="prepend"
              placeholder="请选择前缀"
              clearable
              @change="formatterBmqzLabel"
            >
              <el-option
                v-for="item in bmqzOptiongs"
                :label="item.label"
                :key="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="addCellForm.dzysBmhz"
              slot="append"
              placeholder="请选择后缀"
              @change="formatterBmhzLabel"
            >
              <el-option
                v-for="item in bmhzOptiongs"
                :label="item.label"
                :key="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="dzysmcLable"
          prop="dzysmc"
          v-if="isRequired && dzysmcLable != '建筑物名称：'"
          :rules="{
            required: true,
            message:
              dzysmcLable.substring(0, dzysmcLable.length - 1) + '不能为空',
            trigger: ['blur', 'change'],
          }"
        >
          <el-input v-model="addCellForm.dzysmc" clearable></el-input>
        </el-form-item>
        <el-form-item
          :label="dzysmcLable"
          prop="dzysmc"
          v-if="!isRequired && dzysmcLable != '建筑物名称：'"
          :rules="{
            required: true,
            message:
              dzysmcLable.substring(0, dzysmcLable.length - 1) + '不能为空',
            trigger: ['blur', 'change'],
          }"
        >
          <el-input v-model="addCellForm.dzysmc" clearable></el-input>
        </el-form-item>
        <el-form-item
          :label="dzysmcLable"
          prop="dzysmc"
          v-if="isRequired && dzysmcLable == '建筑物名称：'"
        >
          <el-input v-model="addCellForm.dzysmc" clearable></el-input>
        </el-form-item>
        <el-form-item
          :label="dzysmcLable"
          v-if="!isRequired && dzysmcLable == '建筑物名称：'"
        >
          <el-input v-model="addCellForm.dzysmc" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属网格："
                      v-if="suoShuWangGe"
                      style="flex: 1;overflow-y: scroll;"
                      prop="sswgbm">
          <el-tree :data="wangGeOptions"
                   show-checkbox
                   node-key="id"
                   ref="wangGeTree"
                   :default-expanded-keys="mrzkOptions"
                   :default-checked-keys="mrxzwangGeOptions"
                   highlight-current
                   :props="depprops"
                   @check-change="wangGeHandleChange">
          </el-tree>
        </el-form-item> -->
        <el-form-item label="所属网格：" v-if="suoShuWangGe" prop="sswgbm">
          <treeselect
            v-model="addCellForm.sswgbm"
            :options="wangGeOptions"
            :show-count="true"
            :disable-branch-nodes="true"
            @input="getRulesWangGe"
            placeholder="请选择所属网格"
          />
        </el-form-item>
        <el-form-item label="地址全称：">
          {{
            `${this.addCellForm.dizhiqian}${
              this.bmqzLabel ? this.bmqzLabel : ""
            }${this.addCellForm.dzysBmmc ? this.addCellForm.dzysBmmc : ""}${
              this.bmhzLabel ? this.bmhzLabel : ""
            }${this.addCellForm.dzysmc ? this.addCellForm.dzysmc : ""}`
          }}
        </el-form-item>

        <!-- <el-alert
          title="温馨提示"
          type="info"
          v-if="dzysmcLable != '街路巷名称：'"
          show-icon
        >
          <slot name="right">
            <div>门楼牌号为必填项；门楼牌号后缀为必填项；</div>
            <div v-if="suoShuWangGe">所属网格为必填项；</div>
          </slot>
        </el-alert> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCell = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑层户结构"
      :visible.sync="addFloor"
      :wrapperClosable="true"
      size="80%"
      width="600px"
      custom-class="elDrawer"
      direction="rtl"
      v-loading="true"
    >
      <!-- selectMenu -->
      <!-- <add-floor v-if="addFloor && !lookFloor"
                 style="padding: 20px; box-sizing: border-box"
                 :floorId="floorData"
                 @getDsdys="getDsdys"
                 @getDslcs="getDslcs"
                 @getDsdchs="getDsdchs"
                 @getMlflcs="getMlflcs"
                 @getMlfdyhs="getMlfdyhs"
                 @getDxdys="getDxdys"
                 @getDxlcs="getDxlcs"
                 @getDxdchs="getDxdchs"
                 @getDrawerFloorTitle="getDrawerFloorTitle"></add-floor>
      <look-floor v-if="addFloor && lookFloor"
                  :floorId="floorData"
                  :chuanList="chuanList"
                  class="lookflor"></look-floor> -->
      <edit-floor
        v-if="addFloor"
        :floorObj="floorObj"
        @getDsList="getDsList"
        @getSpList="getSpList"
        @getDxList="getDxList"
        @getDelList="getDelList"
      ></edit-floor>
      <div
        slot="footer"
        class="dialog-footer"
        v-if="!hasFloor"
        ref="drawerFooter"
      >
        <el-button
          type="primary"
          @click="submitFloor"
          icon="el-icon-circle-check"
          v-loading.fullscreen.lock="fullscreenLoading"
          >确 定</el-button
        >
        <el-button @click="addFloor = false" icon="el-icon-circle-close"
          >取 消</el-button
        >
      </div>
      <div class="drawer__footer" v-if="hasFloor">
        <el-button @click="addFloor = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";
import Feature from "ol/Feature";
import { Point, LineString, Polygon } from "ol/geom";
import { Style, Fill, Stroke, Text, Icon } from "ol/style";
import { getCenter, boundingExtent } from "ol/extent";
import { ImageStatic, Vector as VectorSource } from "ol/source";
import mapconfig from "../../../wggl/mapconfig";
import { getArea, getLength } from "ol/sphere";
import { defaults } from "ol/control";
import TileLayer from "ol/layer/Tile";
import { TileSuperMapRest } from "@supermap/iclient-ol";
import "@supermap/iclient-ol/dist/iclient-openlayers.min.css";
import XYZ from "ol/source/XYZ";
import Select from "ol/interaction/Select";
import Modify from "ol/interaction/Modify";
import { unByKey } from "ol/Observable";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {
  getTreeSelect,
  getTreeSelectId,
  getYthcj,
  addYthcj,
  delYthcjById,
  delYthcj,
  updateYthcj,
  updateYthcjTree,
  updateYthcjPoint,
  updateYthcjName,
  batchAddFloor,
  batchBuilding,
  listYthcj,
  getZhzzJcywBzdzYthcjTreeById,
  batchEdit,
} from "@/api/jcyw/bzdz/ythcj";
import { getBoundaryPoint } from "@/api/wggl/wgzl";
import AddFloor from "./components/AddFloor";
import EditFloor from "./components/EditFloor";
import switchLayers from "../../../wggl/components/switchLayers.vue";
import { treeselect } from "@/api/system/dept";
import { mapState } from "vuex";
import {
  GetFeaturesBySQLParameters,
  FeatureService,
} from "@supermap/iclient-ol";
import GeoJSON from "ol/format/GeoJSON";
import { getDicts } from "@/api/system/dict/data";

export default {
  name: "Ythcj",
  dicts: ["df_dzyshz", "df_dzysqz", "gb_dzyslx"],
  components: {
    Treeselect,
    AddFloor,
    EditFloor,
    switchLayers,
    LookFloor: () => import("./components/LookFloor.vue"),
  },
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      treeSelectId: true,
      map: null,
      vector: null,
      draw: null,
      polyonSource: null,
      polyonLayer: null,
      pointSource: null,
      pointLayer: null,
      measureSource: null,
      measureLayer: null,
      lineLayer: null, //线图层
      lineSource: null, //线数据源
      defaultSource: null,
      defaultLayer: null,
      treeData: [],
      props: {
        children: "children",
        label: "label",
        isLeaf: (data, node) => {
          if (node.level >= 2) {
            if (node.data.filed3 != "50") {
              return false;
            } else {
              return true;
            }
          }
        },
      },
      depprops: {
        children: "children",
        label: "label",
        disabled: (data, node) => {
          if (data.level != 4) {
            return true;
          } else {
            return false;
          }
        },
      },
      filterText: "",
      deptTreeExpanded: [],
      // overlayer: null,
      treeClickData: null,
      treeClickNode: null,
      show: false,
      addCell: false,
      addCellForm: {
        dzysqc: "",
        dzysBmqz: "",
        dzysBmmc: "",
        dzysBmhz: "01",
        sswgbm: null,
      },
      addCellRules: {
        dzysBmmc: [
          {
            required: true,
            message: "不能为空",
            trigger: ["blur", "change"],
          },
        ],
        // sswgbm: [
        //   {
        //     required: true,
        //     message: '所属网格不能为空',
        //     trigger: 'input'
        //   }
        // ]
        // dzysmc: [
        //   {
        //     required: true,
        //     message: '不能为空',
        //     trigger: ['blur', 'change']
        //   }
        // ]
      },
      bmqzOptiongs: [],
      bmhzOptiongs: [],
      dzysmcLable: "",
      drawerTitle: "",
      addInfoOptions: [],
      bmqzLabel: "",
      bmhzLabel: "",
      isselectMlph: false,
      isDraw: true,
      isShowBtn: false,
      isSavePoints: false,
      pointsArr: [],
      isDrawPoint: false,
      drawingType: "Polygon",
      isRequired: true,
      isAdd: true,
      addFloor: false,
      dsdys: null,
      dslcs: null,
      dsdchs: null,
      mlflcs: null,
      mlfdyhs: null,
      dxdys: null,
      dxlcs: null,
      dxdchs: null,
      fullscreenLoading: false,
      floorInfo: {
        jd: null,
        wd: null,
        deptId: null,
      },
      hasFloor: false,
      floorObj: {
        id: null,
        name: null,
      },
      chuanList: null,
      mapView: null,
      mapOptions: [],
      mapLayerArr: [],
      menuVisible: false,
      delAll: null,
      drawerFloorTitle: "",
      oldName: "",
      measuring: false, // 是否测量绘制中
      redPoint: false,
      previousPoint: [],
      level3Id: "",
      drawingNewPolyon: true,
      mapClick: null,
      sketch: null,
      select_f: null,
      modify_f: null,
      showEdit: true,
      lookFloor: false,
      mapEditSelectClick: null,
      routeQuery: null,
      currentNodeKey: "",
      xiuGaiList: [],
      xinZengList: [],
      wangGeOptions: null,
      mrzkOptions: [],
      wangGeTaskList: [],
      mrxzwangGeOptions: [],
      suoShuWangGe: false,
      // wangGeOptionsProps: {
      //   multiple: true,
      // },
      editFloorList: [],
      editFloorObj: {
        dsList: [],
        spList: [],
        dxList: [],
        delList: "",
      },
      searchText: "",
      mapDataSource: "",
      poiQueryResult: [],
      querySource: null,
      queryLayer: null,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    addCell(val) {
      if (val) {
        this.show = false;
      } else {
        this.addCellForm = {
          dzysqc: "",
          dzysBmhz: "",
          dzysBmmc: "",
          dzysBmqz: "",
          sswgbm: null,
        };
        this.$refs["addCellForm"].resetFields();
      }
    },
  },
  methods: {
    getRulesWangGe() {
      this.$refs["addCellForm"].validateField("sswgbm");
    },
    getWangGe() {
      treeselect().then((response) => {
        this.wangGeOptions = response.data;
      });
      console.log(this.wangGeOptions, "网格数据");
    },
    startDrawing() {
      let that = this;
      this.lineSource.clear();
      that.draw = new Draw({
        source:
          that.drawingType == "Point"
            ? that.pointSource
            : that.drawingType == "Polygon"
            ? that.polyonSource
            : that.lineSource,
        type: that.drawingType,
      });
      that.map.addInteraction(that.draw);
      that.draw.on("drawend", function (evt) {
        that.drawingEnd(evt);
        setTimeout(function () {
          that.endDrawing();
        }, 500);
      });
    },
    endDrawing() {
      let that = this;
      if (this.drawingType == "Point") {
        that.map.removeInteraction(that.draw);
        let feature = that.pointSource.getFeatures();
        feature.forEach((item) => {
          var id = item.getProperties().id;
          if (id == that.treeClickData.id) {
            this.pointsArr = item.getGeometry().flatCoordinates;
          }
        });
      } else if (this.drawingType == "Polygon") {
        that.map.removeInteraction(that.draw);
        that.map.removeInteraction(that.select_f);
        that.map.removeInteraction(that.modify_f);
        let feature = that.polyonSource.getFeatures();
        let featureArr = [];
        feature.forEach((item) => {
          let flatCoordinates = item.getGeometry().flatCoordinates;
          let newArr = that.formatPoint(flatCoordinates);
          featureArr.push(newArr);
        });
        this.pointsArr = featureArr;
      } else {
        that.map.removeInteraction(that.draw);
        that.map.removeInteraction(that.select_f);
        that.map.removeInteraction(that.modify_f);
        let feature = that.lineSource.getFeatures();
        let featureArr = [];
        feature.forEach((item) => {
          let flatCoordinates = item.getGeometry().flatCoordinates;
          let newArr = that.formatPoint(flatCoordinates);
          featureArr.push(newArr);
        });
        this.pointsArr = featureArr;
      }
    },
    drawingEnd(evt) {
      let styles;
      if (this.drawingType == "Point") {
        let feature = this.pointSource.getFeatures();
        for (let i = 0; i < feature.length; i++) {
          if (feature[i].getProperties().id == this.treeClickData.id) {
            this.pointLayer.getSource().removeFeature(feature[i]);
          }
        }
        evt.feature.setProperties({
          id: this.treeClickData.id,
          title: this.treeClickData.label,
        });
        styles = [
          new Style({
            image: new Icon({
              // anchor: [0.2, 0.9],
              crossOrigin: "anonymous",
              src: require("@/assets/images/zuobiao2.png"),
              // scale: 0.7
            }),
            text: new Text({
              font: "18px Microsoft YaHei",
              text: this.treeClickData.label,
              fill: new Fill({
                color: "#dc0a0a",
              }),
              offsetX: 5,
              offsetY: -30,
            }),
          }),
        ];
        this.pointsArr = evt.feature.getGeometry().flatCoordinates;
      } else if (this.drawingType == "Polygon") {
        evt.feature.setProperties({ title: this.treeClickData.label });
        styles = [
          new Style({
            stroke: new Stroke({
              color: "#1485f9ab",
              width: 3,
            }),
            fill: new Fill({
              color: "#e9477485",
            }),
            text: new Text({
              font: "18px Microsoft YaHei",
              text: this.treeClickData.label,
              fill: new Fill({
                color: "#dc0a0a",
              }),
            }),
          }),
        ];
      } else {
      }

      evt.feature.setStyle(styles);
    },
    editDrawing() {
      let that = this;
      that.$message({
        showClose: true,
        message: "已进入修改模式，请点击需要修改的小区。",
        type: "warning",
      });
      that.addMapEditSelectClick();
      that.select_f = new Select({
        multi: false, //取消多选
      });
      that.map.addInteraction(that.select_f);
      that.modify_f = new Modify({
        features: that.select_f.getFeatures(), //将选中的要素添加修改功能
      });
      that.select_f.on("select", function (evt) {
        if (evt.selected.length == 1) {
          that.map.addInteraction(that.modify_f);
          that.sketch = evt.selected[0];
        }
      });
      //监听要素修改时
      that.modify_f.on("modifyend", function (evt) {
        let new_feature = evt.features.item(0);
        if (new_feature) {
          let feature = that.polyonSource.getFeatures();
          let featureArr = [];
          feature.forEach((item) => {
            let flatCoordinates = item.getGeometry().flatCoordinates;
            let newArr = that.formatPoint(flatCoordinates);
            featureArr.push(newArr);
          });
          this.pointsArr = featureArr;
          that.sketch = new_feature;
        }
      });
    },
    // 编辑状态下的地图点击事件
    addMapEditSelectClick() {
      let that = this;
      that.mapEditSelectClick = that.map.on(
        "click",
        function (e) {
          var pixel = that.map.getEventPixel(e.originalEvent); //获取鼠标当前像素点
          var hit = that.map.hasFeatureAtPixel(pixel); //通过像素点判断当前鼠标上是否有图形
          if (!hit) {
            unByKey(that.mapEditSelectClick); // 移除编辑的点击事件
            that.endDrawing();
          }
        }.bind(that)
      );
    },
    formatPoint(val) {
      let arr1 = val.filter((item, index) => index % 2 === 0);
      let arr2 = val.filter((item, index) => index % 2 != 0);
      let arr = [];
      for (let i = 0; i < arr1.length; i++) {
        arr.push([arr1[i], arr2[i]]);
      }
      return arr;
    },
    // 判断点击是否在网格上
    addClick() {
      let that = this;
      that.mapClick = that.map.on(
        "click",
        function (e) {
          var pixel = that.map.getEventPixel(e.originalEvent); //获取鼠标当前像素点
          var hit = that.map.hasFeatureAtPixel(pixel); //通过像素点判断当前鼠标上是否有图形
          let feature = that.map.forEachFeatureAtPixel(
            e.pixel,
            (feature) => feature
          );
          if (hit) {
            let name = feature.getProperties().title;
            if (name == that.treeClickData.label) {
              that
                .$confirm("确定删除?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                .then(() => {
                  that.polyonLayer.getSource().removeFeature(feature);
                  that.endDrawing();
                  that.drawingNewPolyon = true;
                })
                .catch(() => {});
            }
          } else {
            that.endDrawing();
          }
        }.bind(this)
      );
    },
    getDrawerFloorTitle(val) {
      this.$nextTick(() => {
        this.drawerFloorTitle = val;
      });
    },

    // filterNode (value, data, node) {
    //   if (!value) return true
    //   return data.label.indexOf(value) !== -1
    // },
    filterNode(value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true;
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true;
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node);
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode(value, data, node) {
      const level = node.level;
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false;
      }
      // 先取当前节点的父节点
      let parentData = node.parent;
      // 遍历当前节点的父节点
      let index = 0;
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true;
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent;
        index++;
      }
      // 没匹配到返回false
      return false;
    },
    // getReturnNode (node, _array, value) {
    //   let isPass =
    //     node.data &&
    //     node.data.agentName &&
    //     node.data.agentName.indexOf(value) !== -1;
    //   isPass ? _array.push(isPass) : "";
    //   if (!isPass && node.level != 1 && node.parent) {
    //     this.getReturnNode(node.parent, _array, value);
    //   }
    // },

    clearPolygon() {
      this.pointSource.clear();
    },
    initMap() {
      this.pointSource = new VectorSource({
        wrapX: false,
        features: [],
      });
      this.polyonSource = new VectorSource({
        wrapX: false,
        features: [],
      });
      this.polyonLayer = new VectorLayer({
        source: this.polyonSource,
      });
      this.measureSource = new VectorSource({
        wrapX: false,
        features: [],
      });
      this.measureLayer = new VectorLayer({
        source: this.measureSource,
      });
      this.lineSource = new VectorSource({
        wrapX: false,
        features: [],
      });
      this.lineLayer = new VectorLayer({
        source: this.lineSource,
        style: [
          new Style({
            stroke: new Stroke({
              color: "#0099ff",
              width: 5,
            }),
          }),
        ],
      });
      this.pointLayer = new VectorLayer({
        source: this.pointSource,
        style: [
          new Style({
            stroke: new Stroke({
              color: "#0099ff",
              width: 5,
            }),
            fill: new Fill({
              color: "rgba(255,0,0,0.4)",
            }),
            image: new Icon({
              // anchor: [0.2, 0.9],
              crossOrigin: "anonymous",
              src: require("@/assets/images/zuobiao.png"),
              // scale: 0.7
            }),
          }),
        ],
      });
      this.defaultSource = new VectorSource({
        wrapX: false,
        features: [],
      });
      this.defaultLayer = new VectorLayer({
        source: this.defaultSource,
      });
      this.querySource = new VectorSource({
        wrapX: false,
        features: [],
      });
      this.queryLayer = new VectorLayer({
        source: this.querySource,
        style: [
          new Style({
            stroke: new Stroke({
              color: "#0099ff",
              width: 5,
            }),
            fill: new Fill({
              color: "rgba(255,0,0,0.4)",
            }),
            image: new Icon({
              crossOrigin: "anonymous",
              src: require("@/assets/images/zuobiao2.png"),
            }),
          }),
        ],
      });
      this.mapLayerArr = [];
      for (let i = 0; i < this.mapOptions.length; i++) {
        if (this.mapOptions[i].dictValue == 6) {
          this.mapLayerArr.push(
            new TileLayer({
              source: new XYZ({
                url: this.mapOptions[i].remark,
                wrapX: true,
              }),
              visible: false,
            })
          );
        } else {
          this.mapLayerArr.push(
            new TileLayer({
              source: new TileSuperMapRest({
                url: this.mapOptions[i].remark,
                wrapX: true,
              }),
              visible: false,
            })
          );
        }
      }
      this.mapLayerArr.push(this.defaultLayer);
      this.mapLayerArr.push(this.polyonLayer);
      this.mapLayerArr.push(this.pointLayer);
      this.mapLayerArr.push(this.measureLayer);
      this.mapLayerArr.push(this.lineLayer);
      this.mapLayerArr.push(this.queryLayer);
      var mapcontainer = this.$refs.rootmap;
      this.map = new Map({
        target: mapcontainer,
        layers: this.mapLayerArr,
        view: new View({
          projection: "EPSG:4326", //使用这个坐标系
          center: [mapconfig.x, mapconfig.y],
          zoom: mapconfig.zoom,
          maxZoom: mapconfig.maxZoom,
        }),
        controls: defaults({
          zoom: false,
          rotate: false,
          attribution: false,
        }),
      });
      if (this.$store.state.user.deptId != 3212000000000) {
        //this.currentDept()
      } else {
        this.setMapCenter();
      }
    },
    // 构建多边形结束
    measureDrawingEnd(evt) {
      const geo = evt.feature.getGeometry();
      const area = getArea(geo, {
        projection: "EPSG:4326",
      });
      var output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + " " + "平方千米";
      } else {
        output = Math.round(area * 100) / 100 + " " + "平方米";
      }
      this.map.removeInteraction(this.draw); // 移除绘制
      this.$modal.msgSuccess(output);
      this.measuring = false;
    },
    // 测面积
    measuredArea() {
      let that = this;
      if (that.measuring) {
        this.$message({
          message: "请先完成当前测量绘制",
          type: "warning",
        });
      } else {
        that.measuring = true;
        that.measureSource.clear();
        that.draw = new Draw({
          source: that.measureSource,
          type: "Polygon",
        });
        that.map.addInteraction(that.draw);
        that.draw.on("drawend", function (evt) {
          that.measureDrawingEnd(evt);
        });
      }
    },
    // 测距离
    measuredDistance() {
      let that = this;
      if (that.measuring) {
        that.$message({
          message: "请先完成当前测量绘制",
          type: "warning",
        });
      } else {
        that.measuring = true;
        that.measureSource.clear();
        // that.overlayer.setPosition(undefined)
        that.draw = new Draw({
          source: that.measureSource,
          type: "LineString",
        });
        that.map.addInteraction(that.draw);
        that.draw.on("drawend", function (evt) {
          const geo = evt.feature.getGeometry();
          const line = getLength(geo, {
            projection: "EPSG:4326",
          });
          var output;
          if (length > 100) {
            output = Math.round((line / 1000) * 100) / 100 + " " + "km";
          } else {
            output = Math.round(line * 100) / 100 + " " + "m";
          }
          that.map.removeInteraction(that.draw); // 移除绘制
          that.$modal.msgSuccess(output);
          that.measuring = false;
        });
      }
    },
    // 放大
    addZoom() {
      this.map.getView().animate({ zoom: this.map.getView().getZoom() + 1 }); // 有动画
    },
    // 居中
    setMapCenter() {
      this.map
        .getView()
        .animate(
          { zoom: this.map.getView().setZoom(10) },
          { center: [mapconfig.x, mapconfig.y] }
        ); // 有动画
    },
    // 缩小
    reduceZoom() {
      this.map.getView().animate({ zoom: this.map.getView().getZoom() - 1 }); // 有动画
    },
    // 获取组织列表树形结构数据
    getTreeSelect(openId) {
      return new Promise((reslove, reject) => {
        getTreeSelect().then((response) => {
          this.treeData = response.data;
          this.deptTreeExpanded = [openId ? openId : this.treeData[0].id];
          this.recoveryNode();
          reslove(response.data);
          // relove(this.treeData)
        });
      });
    },
    getTreeSelectId(id) {
      return new Promise((reslove, reject) => {
        getTreeSelectId(id).then((res) => {
          let data = {};
          if (res.code == 200) {
            data.list = res.data;
            data.msg = "成功";
            reslove(data);
          } else {
            data.msg = "请求失败，请刷新页面";
          }
          reslove(data);
        });
      });
    },
    async loadNode(node, relove) {
      if (node.level === 0) {
        let data = await this.getTreeSelect();
        relove(data);
      } else if (node.level > 0 && node.level <= 2) {
        relove(node.data.children);
      } else if (node.level > 2) {
        let data = await this.getTreeSelectId(node.data.id);
        if (data.msg == "成功") {
          relove(data.list);
        } else {
          this.msgWarning(data.msg);
          relove([]);
        }
      }
    },
    recoveryNode() {
      if (this.routeQuery) {
        this.deptTreeExpanded = [this.routeQuery];
        this.currentNodeKey = this.routeQuery;
        this.$nextTick(() => {
          this.$refs["tree"].setCurrentKey(this.routeQuery);
          let node = this.$refs["tree"].getNode(this.routeQuery);
          this.handleNodeClick(node.parent.data, node.parent.node);
          this.handleNodeClick(node.data, node);
        });
      }
    },
    handleNodeClick(data, node) {
      console.log(data.label);
      console.log(data);
      console.log(node);
      this.menuVisible = false;
      this.isShowBtn = false;
      this.isRequired = true;
      this.treeClickData = data;
      this.treeClickNode = node;
      this.measureSource.clear();
      let jwdzb, dzysmc, jd, wd, deptId;
      if (data.filed3 == 42) {
        this.polyonSource.clear();
        this.pointSource.clear();
        this.lineSource.clear();
        this.level3Id = this.treeClickData.id;
        this.drawingAll(this.level3Id);
      } else if (data.filed3 == 50) {
        this.lineSource.clear();
        // this.level3Id = this.treeClickData.id
        this.redPoint = true;
        getYthcj(data.id).then((res) => {
          if (res.data.jd) {
            jd = res.data.jd;
            wd = res.data.wd;
            deptId = res.data.deptId;
            this.floorInfo = {
              jd: jd,
              wd: wd,
              deptId: deptId,
            };
            let feature = this.pointSource.getFeatures();
            for (let i = 0; i < feature.length; i++) {
              if (feature[i].getProperties().id == this.treeClickData.id) {
                this.pointLayer.getSource().removeFeature(feature[i]);
              } else {
                feature[i].setStyle([
                  new Style({
                    image: new Icon({
                      // anchor: [0.2, 0.9],
                      crossOrigin: "anonymous",
                      src: require("@/assets/images/zuobiao.png"),
                      // scale: 0.7
                    }),
                    text: new Text({
                      font: "18px Microsoft YaHei",
                      text: feature[i].getProperties().title,
                      fill: new Fill({
                        color: "#1296db",
                      }),
                      offsetX: 5,
                      offsetY: -30,
                    }),
                  }),
                ]);
              }
            }
            let feature1 = new Feature({
              geometry: new Point([jd, wd]),
            });
            let styles = [
              new Style({
                image: new Icon({
                  // anchor: [0.2, 0.9],
                  crossOrigin: "anonymous",
                  src: require("@/assets/images/zuobiao2.png"),
                  // scale: 0.7
                }),
                text: new Text({
                  font: "18px Microsoft YaHei",
                  text: this.treeClickData.label,
                  fill: new Fill({
                    color: "red",
                  }),
                  offsetX: 5,
                  offsetY: -30,
                }),
              }),
            ];
            feature1.setStyle(styles);
            feature1.setProperties({
              id: this.treeClickData.id,
              title: this.treeClickData.label,
              qc: this.treeClickData.filed2,
            });
            this.pointLayer.getSource().addFeature(feature1);

            this.map.getView().animate(
              { zoom: this.map.getView().setZoom(17) },
              {
                center: [jd, wd], // 中心点
                duration: 300, // 缩放持续时间，默认不须要设置
              }
            );
          } else {
            this.floorInfo = {
              jd: null,
              wd: null,
              deptId: deptId,
            };
            this.polyonSource.clear();
            this.pointSource.clear();
          }
        });
        this.addPointClick();
      } else if (data.filed3 == 41) {
        if (data.label.includes("中关村温泉科技园")) {
          // console.log(33333, "中关村温泉科技园");
          this.polyonSource.clear();
          this.pointSource.clear();
          this.lineSource.clear();
          if (this.treeClickData.jwdzb) {
            // let center = JSON.parse(this.treeClickData.jwdzb[0]);
            // this.map.getView().setCenter(center);
            this.map
              .getView()
              .setCenter([116.20205903119307, 40.05093197542407]);
          }
          if (this.treeClickData.level) {
            this.map.getView().setZoom(this.treeClickData.level);
            // this.map.getView().setZoom("17");
          }
          //
        } else {
          // console.log(data.label);
          this.polyonSource.clear();
          this.pointSource.clear();
          this.lineSource.clear();
          if (this.treeClickData.jwdzb) {
            let featureLine = new Feature({
              geometry: new LineString(JSON.parse(this.treeClickData.jwdzb)[0]),
              type: "lineString",
            });
            let styles = [
              new Style({
                stroke: new Stroke({
                  color: "#0099ff",
                  width: 5,
                }),
                text: new Text({
                  font: "18px Microsoft YaHei",
                  text: this.treeClickData.label,
                  fill: new Fill({
                    color: "red",
                  }),
                  offsetY: -15,
                }),
              }),
            ];
            featureLine.setStyle(styles);
            this.lineLayer.getSource().addFeature(featureLine);
            let point = JSON.parse(this.treeClickData.jwdzb)[0];
            let extent = new boundingExtent(point);
            let center = new getCenter(extent);
            this.map.getView().setCenter(center);
          }
          if (this.treeClickData.level) {
            this.map.getView().setZoom(this.treeClickData.level);
          }
        }
      } else {
        if (this.treeClickData.jwdzb) {
          let center = JSON.parse(this.treeClickData.jwdzb);
          this.map.getView().setCenter(center);
        }
        if (this.treeClickData.level) {
          this.map.getView().setZoom(this.treeClickData.level);
        }
      }
    },
    drawingAll(id) {
      let jwdzb, dzysmc;
      getYthcj(id).then((res) => {
        if (res.data.jwdzb === null) {
          jwdzb = "";
          dzysmc = "";
        } else {
          jwdzb = res.data.jwdzb;
          dzysmc = res.data.dzysmc;
        }
        if (jwdzb) {
          this.drawing(jwdzb, dzysmc);
        } else {
          this.polyonSource.clear();
          this.pointSource.clear();
          this.lineSource.clear();
        }

        listYthcj({ sjdzysid: id }).then((res) => {
          this.redPoint = false;
          if (res.rows) {
            for (let i = 0; i < res.rows.length; i++) {
              if (res.rows[i].jd) {
                this.drawingPoint(
                  res.rows[i].jd,
                  res.rows[i].wd,
                  res.rows[i].id,
                  res.rows[i].dzysBmqc,
                  res.rows[i].dzysqc
                );
              }
            }
          } else {
            this.polyonSource.clear();
            this.pointSource.clear();
            this.lineSource.clear();
          }
        });
      });
    },
    initAddQz() {
      this.bmqzOptiongs = this.dict.type.df_dzysqz;
      this.bmhzOptiongs = this.dict.type.df_dzyshz;
    },
    formatterBmqzLabel(val) {
      this.bmqzOptiongs.forEach((item) => {
        if (item.value == val) {
          this.bmqzLabel = item.label;
        }
      });
    },
    formatterBmhzLabel(val) {
      this.bmhzOptiongs.forEach((item) => {
        if (item.value == val) {
          this.bmhzLabel = item.label;
        }
      });
    },
    //新增和修改的确定
    submitForm() {
      let that = this;
      this.addCellForm.dzysqc = `${this.addCellForm.dizhiqian}${
        this.bmqzLabel ? this.bmqzLabel : ""
      }${this.addCellForm.dzysBmmc ? this.addCellForm.dzysBmmc : ""}${
        this.bmhzLabel
      }${this.addCellForm.dzysmc ? this.addCellForm.dzysmc : ""}`;
      this.addCellForm.dzysBmqc = `${this.bmqzLabel}${
        this.addCellForm.dzysBmmc
      }${this.bmhzLabel ? this.bmhzLabel : ""}`;
      // 所属网格的数据分拆开始
      // this.addCellForm.sswgbm = wangGeTask.toString()

      if (this.addCellForm.dzysBmqz == "08") {
        this.addCellForm.dzysBmqz = "";
      }
      // 判断数据是否为空
      this.$refs["addCellForm"].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            addYthcj(this.addCellForm).then((res) => {
              this.$modal.msgSuccess("新增成功");
              this.treeSelectId = false;
              this.$nextTick(() => {
                this.treeSelectId = true;
              });
              // this.getTreeSelect(this.treeClickData.id)
            });
          } else {
            // 所属网格的数据分拆结束
            let taskObj = {};
            taskObj.dzysqc = that.addCellForm.dzysqc;
            taskObj.id = that.addCellForm.id;
            taskObj.dzysmc = that.addCellForm.dzysmc;
            if (that.addCellForm.dzysBmhz != "") {
              taskObj.dzysBmhz = that.addCellForm.dzysBmhz;
            }
            if (that.addCellForm.dzysBmmc != null) {
              taskObj.dzysBmmc = that.addCellForm.dzysBmmc;
            }
            if (that.addCellForm.dzysBmqc != "null") {
              taskObj.dzysBmqc = that.addCellForm.dzysBmqc;
            }
            if (that.addCellForm.dzysBmqz != "") {
              taskObj.dzysBmqz = that.addCellForm.dzysBmqz;
            }
            taskObj.sswgbm = that.addCellForm.sswgbm;
            // if (this.addCellForm.dzyslx == 50) {
            //   taskObj.sswgbm = wangGeTask.toString()
            // } else {
            //   taskObj.sswgbm = ''
            // }
            updateYthcjTree(taskObj).then((res) => {
              if (res.code == 200) {
                this.$modal.msgSuccess("修改成功");
                this.treeSelectId = false;
                this.$nextTick(() => {
                  this.treeSelectId = true;
                });
                // this.getTreeSelect(this.treeClickData.id)
              }
            });
            // if()
            // updateYthcj({
            //   id: that.addCellForm.id,
            //   dzysmc: that.addCellForm.dzysmc,
            //   dzysqc: that.addCellForm.dzysqc
            // }).then((res) => {
            //   this.$modal.msgSuccess('修改成功')
            //   this.getTreeSelect(this.treeClickData.id)
            //   updateYthcjName(params).then((res) => { })
            // })
          }
          this.addCell = false;
        } else {
          return false;
        }
      });
    },
    submitPoints() {
      unByKey(this.mapClick);
      let params;
      if (this.drawingType == "Point") {
        params = {
          id: this.addCellForm.sjdzysid,
          jd: this.pointsArr[0],
          wd: this.pointsArr[1],
          dzyslx: this.treeClickData.filed3,
          field1: ~~this.map.getView().getZoom(),
          jwdzb: JSON.stringify(this.pointsArr),
        };
      } else {
        this.endDrawing();
        params = {
          id: this.addCellForm.sjdzysid,
          jwdzb: JSON.stringify(this.pointsArr),
          dzyslx: this.treeClickData.filed3,
          field1: ~~this.map.getView().getZoom(),
        };
      }
      updateYthcjPoint(params).then((res) => {
        this.$modal.msgSuccess("保存成功");
        this.isShowBtn = false;
        // this.polyonSource.clear()
        // this.pointSource.clear()
        if (
          this.treeClickData.filed3 == 42 ||
          this.treeClickData.filed3 == 50
        ) {
          // this.drawingAll(this.level3Id)
        } else {
          this.treeSelectId = false;
          this.$nextTick(() => {
            this.treeSelectId = true;
          });
        }
      });
    },
    drawing(jwdzb, dzysmc) {
      this.polyonSource.clear();
      this.pointSource.clear();
      let points = jwdzb;
      let name = dzysmc;
      let arrParse = JSON.parse(points);
      for (let i = 0; i < arrParse.length; i++) {
        let arr = arrParse[i];
        this.generateGrid([arr], name);
      }
      if (arrParse && arrParse.length) {
        let point = JSON.parse(jwdzb)[0];
        let extent = new boundingExtent(point);
        let center = new getCenter(extent); //获取边界区域的中心位置
        this.map.getView().setCenter(center); //设置当前地图的显示中心位置
        this.map.getView().fit(extent, { padding: [200, 200, 200, 200] });

        this.map.getView().animate({
          center: center, // 中心点
          duration: 1000, // 缩放持续时间，默认不须要设置
        });
      }
    },
    generateGrid(pointArr, name) {
      let feature = new Feature({
        geometry: new Polygon(pointArr),
      });
      let styles = [
        new Style({
          stroke: new Stroke({
            // color: '#53c4ff',
            color: "#6afb09",
            width: 2,
            lineDash: [10, 10, 10, 10], // 虚线样式
          }),
          fill: new Fill({
            color: "#00000000", // 透明填充
          }),
          text: new Text({
            font: "18px Microsoft YaHei",
            text: name,
            fill: new Fill({
              color: "#dc0a0a",
            }),
          }),
        }),
      ];
      feature.setStyle(styles);
      feature.setProperties({ title: name });
      this.polyonLayer.getSource().addFeature(feature);
    },
    getDsdys(val) {
      this.dsdys = val;
    },
    getDslcs(val) {
      this.dslcs = val;
    },
    getDsdchs(val) {
      this.dsdchs = val;
    },
    getMlflcs(val) {
      this.mlflcs = val;
    },
    getMlfdyhs(val) {
      this.mlfdyhs = val;
    },
    getDxdys(val) {
      this.dxdys = val;
    },
    getDxlcs(val) {
      this.dxlcs = val;
    },
    getDxdchs(val) {
      this.dxdchs = val;
    },
    async submitFloor() {
      this.editFloorList = [
        ...this.editFloorObj.dsList,
        ...this.editFloorObj.dxList,
        ...this.editFloorObj.spList,
      ];
      let list = [];
      this.editFloorList.forEach((dan, danIndex) => {
        let danObj = {
          dzysqc: dan.filed2,
          dzyslx: dan.filed3,
          sjdzysid: dan.sjdzysid,
          id: dan.id,
          dzysBmqc: dan.filed1,
          dzysBmqz: dan.filed4,
          dzysBmhz: dan.filed6,
          shxh: dan.filed7,
          dzysBmmc: dan.label,
          dzysmc: dan.label,
          children: [],
        };
        list[danIndex] = danObj;
        dan.children.forEach((ceng, cengIndex) => {
          let cengObj = {
            dzysqc: ceng.filed2,
            dzyslx: ceng.filed3,
            sjdzysid: ceng.sjdzysid,
            id: ceng.id,
            dzysBmqc: ceng.filed1,
            dzysBmqz: ceng.filed4,
            dzysBmhz: ceng.filed6,
            shxh: ceng.filed7,
            dzysBmmc: ceng.label,
            dzysmc: ceng.label,
            children: [],
          };
          list[danIndex].children[cengIndex] = cengObj;
          ceng.children.forEach((hu, huIndex) => {
            let huObj = {
              dzysqc: hu.filed2,
              dzyslx: hu.filed3,
              sjdzysid: hu.sjdzysid,
              id: hu.id,
              dzysBmqc: hu.filed1,
              dzysBmqz: hu.filed4,
              dzysBmhz: hu.filed6,
              shxh: hu.filed7,
              dzysBmmc: hu.label,
              dzysmc: hu.label,
            };
            list[danIndex].children[cengIndex].children[huIndex] = huObj;
          });
        });
      });
      // return
      let taskList = {
        zhzzJcywBzdzYthcjs: [],
        ids: null,
      };
      taskList.zhzzJcywBzdzYthcjs = list;
      taskList.ids = this.editFloorObj.delList;
      // return
      batchBuilding(taskList).then((res) => {
        if (res.code == 200) {
          this.$modal.msgSuccess("操作成功");
        }
      });
      this.addFloor = false;
    },
    getDsList(val) {
      this.editFloorObj.dsList = val;
    },
    getSpList(val) {
      this.editFloorObj.spList = val;
    },
    getDxList(val) {
      this.editFloorObj.dxList = val;
    },
    getDelList(val) {
      this.editFloorObj.delList = val.toString();
    },
    getXiuGaiList() {
      this.xiuGaiList.forEach((item, itemIndex) => {
        item.children = item.children.filter((item) => item.id != undefined);
        item.children.forEach((ceng, cengIndex) => {
          ceng.children = ceng.children.filter((item) => item.id != undefined);
        });
      });
      batchEdit(this.xiuGaiList).then((res) => {});
    },

    getXinZengList() {
      this.xinZengList.forEach((item, itemIndex) => {
        item.children.forEach((ceng, cengIndex) => {
          ceng.children = ceng.children.filter((item) => item.id == undefined);
        });
      });
      this.xinZengList.forEach((item, itemIndex) => {
        item.children = item.children.filter(
          (item) => item.children.length > 0
        );
      });
      batchAddFloor(this.xinZengList).then((res) => {});
    },
    submitDsFloor() {
      let that = this;
      let arr = [];
      for (let n = 1; n <= that.dsdys; n++) {
        let params = {
          dzyslx: 61,
          dzysBmmc: n,
          dzysBmqc: `${n}单元`,
          sjdzysid: that.addCellForm.sjdzysid,
          sjdzysqc: that.addCellForm.sjdzysqc,
          sjid: that.addCellForm.sjid,
          dzysqc: that.addCellForm.sjdzysqc + n + "单元",
          jd: that.floorInfo.jd,
          wd: that.floorInfo.wd,
          sswgbm: that.floorInfo.deptId,
          children: [],
        };
        arr[n - 1] = params;
        for (let i = 0; i < that.dslcs; i++) {
          let params1 = {
            dzyslx: 63,
            dzysBmmc: i + that.mlflcs + 1,
            dzysBmqc: `${i + that.mlflcs + 1}层`,
            sjdzysqc: that.addCellForm.sjdzysqc,
            dzysqc: `${that.addCellForm.sjdzysqc}${n}单元${
              i + that.mlflcs + 1
            }层`,
            jd: that.floorInfo.jd,
            wd: that.floorInfo.wd,
            sswgbm: that.floorInfo.deptId,
            children: [],
          };
          arr[n - 1].children[i] = params1;
          for (let j = 0; j < that.dsdchs; j++) {
            let params2 = {
              dzyslx: 62,
              dzysBmmc: `${i + that.mlflcs + 1}0${j + 1}`,
              dzysBmqc: `${i + that.mlflcs + 1}0${j + 1}室`,
              sjdzysqc: that.addCellForm.sjdzysqc,
              dzysqc: `${that.addCellForm.sjdzysqc}${n}单元${
                i + that.mlflcs + 1
              }0${j + 1}室`,
              jd: that.floorInfo.jd,
              wd: that.floorInfo.wd,
              sswgbm: that.floorInfo.deptId,
            };
            arr[n - 1].children[i].children[j] = params2;
          }
        }
      }
      return arr;
    },
    submitMlfFloor() {
      let that = this;
      let arr = [];
      let params = {
        dzyslx: 61,
        dzysBmmc: "",
        dzysBmqc: "",
        sjdzysid: that.addCellForm.sjdzysid,
        sjdzysqc: that.addCellForm.sjdzysqc,
        sjid: that.addCellForm.sjid,
        dzysqc: that.addCellForm.sjdzysqc,
        jd: that.floorInfo.jd,
        wd: that.floorInfo.wd,
        sswgbm: that.floorInfo.deptId,
        children: [],
      };
      arr[0] = params;
      for (let i = 0; i < that.mlflcs; i++) {
        let params1 = {
          dzyslx: 63,
          dzysBmmc: i + 1,
          dzysBmqc: `${i + 1}层`,
          sjdzysqc: that.addCellForm.sjdzysqc,
          dzysqc: `${that.addCellForm.sjdzysqc}${i + 1}层`,
          jd: that.floorInfo.jd,
          wd: that.floorInfo.wd,
          sswgbm: that.floorInfo.deptId,
          children: [],
        };
        arr[0].children[i] = params1;
        for (let j = 0; j < that.mlfdyhs; j++) {
          let params2 = {
            dzyslx: 62,
            dzysBmmc: `${i + 1}0${j + 1}`,
            dzysBmqc: `${i + 1}0${j + 1}室`,
            sjdzysqc: that.addCellForm.sjdzysqc,
            dzysqc: `${that.addCellForm.sjdzysqc}${i + 1}层${i + 1}0${j + 1}室`,
            jd: that.floorInfo.jd,
            wd: that.floorInfo.wd,
            sswgbm: that.floorInfo.deptId,
            children: [],
          };
          arr[0].children[i].children[j] = params2;
        }
      }
      return arr;
    },
    submitDxFloor() {
      let that = this;
      let arr = [];
      for (let n = 1; n <= that.dxdys; n++) {
        let params = {
          dzyslx: 61,
          dzysBmmc: n,
          dzysBmqc: `B${n}单元`,
          dzysBmqz: "B",
          sjdzysid: that.addCellForm.sjdzysid,
          sjdzysqc: that.addCellForm.sjdzysqc,
          sjid: that.addCellForm.sjid,
          dzysqc: that.addCellForm.sjdzysqc + "B" + n + "单元",
          jd: that.floorInfo.jd,
          wd: that.floorInfo.wd,
          sswgbm: that.floorInfo.deptId,
          children: [],
        };
        arr[n - 1] = params;
        for (let i = 0; i < that.dxlcs; i++) {
          let params1 = {
            dzyslx: 63,
            dzysBmmc: i + 1,
            dzysBmqc: `B${i + 1}层`,
            dzysBmqz: "B",
            sjdzysqc: that.addCellForm.sjdzysqc,
            dzysqc: `${that.addCellForm.sjdzysqc}B${n}单元B${i + 1}层`,
            jd: that.floorInfo.jd,
            wd: that.floorInfo.wd,
            sswgbm: that.floorInfo.deptId,
            children: [],
          };
          arr[n - 1].children[i] = params1;
          for (let j = 0; j < that.dxdchs; j++) {
            let params2 = {
              dzyslx: 62,
              dzysBmmc: `${i + 1}0${j + 1}`,
              dzysBmqc: `B${i + 1}0${j + 1}室`,
              dzysBmqz: "B",
              sjdzysqc: that.addCellForm.sjdzysqc,
              dzysqc: `${that.addCellForm.sjdzysqc}B${n}单元B${i + 1}0${
                j + 1
              }室`,
              jd: that.floorInfo.jd,
              wd: that.floorInfo.wd,
              sswgbm: that.floorInfo.deptId,
              children: [],
            };
            arr[n - 1].children[i].children[j] = params2;
          }
        }
      }
      return arr;
    },
    drawingPoint(jd, wd, id, name, pointQc) {
      let feature = new Feature({
        geometry: new Point([jd, wd]),
      });
      let styles = [
        new Style({
          image: new Icon({
            // anchor: [0.2, 0.9],
            crossOrigin: "anonymous",
            src: require("@/assets/images/zuobiao.png"),
            // scale: 0.7
          }),
          text: new Text({
            font: "18px Microsoft YaHei",
            text: name,
            fill: new Fill({
              color: "#1296db",
            }),
            offsetX: 5,
            offsetY: -30,
          }),
        }),
      ];
      feature.setStyle(styles);
      feature.setProperties({ id: id, title: name, qc: pointQc });
      this.pointLayer.getSource().addFeature(feature);
      this.addPointClick();
    },
    remove(node, data) {
      delYthcjById(data.id).then((res) => {
        if (res.code == 200) {
          this.$modal.msgSuccess("删除成功");
          // this.getTreeSelect(this.treeClickNode.parent.data.id)
          this.treeSelectId = false;
          this.$nextTick(() => {
            this.treeSelectId = true;
          });
        } else {
          this.$modal.msgSuccess("删除失败");
        }
      });
    },
    rightClick(event, data, node) {
      this.treeClickData = data;
      this.treeClickNode = node;
      this.measureSource.clear();
      let posX = event.pageX;
      let posY = event.pageY;
      this.$nextTick(() => {
        document.getElementById("popMenu").style.top = posY - 60 + "px";
        document.getElementById("popMenu").style.left = posX - 170 + "px";
        this.menuVisible = true;
      });
      this.isShowBtn = false;
      this.isRequired = true;
      //
      if (data.filed3 == 12) {
        this.addInfoOptions = [
          {
            key: 4,
            label: "采集中心点位",
            icon: "el-icon-star-on",
            permiKey: ["jcyw:bzdz:ythcj:cjszxdwz"],
          },
        ];
        this.show = true;
        this.drawingType = "Point";
      } else if (data.filed3 == 13) {
        this.addInfoOptions = [
          {
            key: 1,
            label: "添加街路巷",
            dzyslx: 41,
            dzysmcLable: "街路巷名称：",
            dzysBmhz: "",
            icon: "el-icon-place",
            permiKey: ["jcyw:bzdz:ythcj:add:jlx"],
          },
          {
            key: 6,
            label: "修改区",
            dzyslx: 13,
            dzysmcLable: "区名称：",
            dzysBmhz: "",
            icon: "el-icon-edit",
            permiKey: ["jcyw:bzdz:ythcj:edit:qu"],
          },
          {
            key: 8,
            label: "删除",
            icon: "el-icon-delete",
            permiKey: ["jcyw:bzdz:ythcj:remove:qu"],
          },
          {
            key: 4,
            label: "采集中心点位",
            icon: "el-icon-star-on",
            permiKey: ["jcyw:bzdz:ythcj:cjqzxdwz"],
          },
        ];
        this.isselectMlph = false;
        this.show = true;
        this.drawingType = "Point";
      } else if (data.filed3 == 41) {
        this.addInfoOptions = [
          {
            key: 1,
            label: "添加小区",
            dzyslx: 42,
            dzysmcLable: "小区名称：",
            dzysBmhz: "01",
            dzysBmqz: "",
            icon: "el-icon-s-home",
            permiKey: ["jcyw:bzdz:ythcj:add:xiaoqu"],
          },
          /* {
            key: 2,
            label: '添加单位(住宅)院',
            dzyslx: 43,
            dzysmcLable: '单位(住宅)院名称：',
            dzysBmhz: '01',
            icon: 'el-icon-school'
          }, */
          {
            key: 3,
            label: "添加建筑物",
            dzyslx: 50,
            dzysmcLable: "建筑物名称：",
            dzysBmhz: "01",
            icon: "el-icon-office-building",
            permiKey: ["jcyw:bzdz:ythcj:add:jzw"],
          },
          {
            key: 6,
            label: "修改街路巷",
            dzyslx: 41,
            dzysmcLable: "街路巷名称：",
            dzysBmhz: "",
            icon: "el-icon-edit",
            permiKey: ["jcyw:bzdz:ythcj:edit:jlx"],
          },
          {
            key: 4,
            label: "绘制街路巷",
            icon: "el-icon-star-on",
            permiKey: ["jcyw:bzdz:ythcj:draw:jlx"],
          },
          {
            key: 8,
            label: "删除",
            icon: "el-icon-delete",
            permiKey: ["jcyw:bzdz:ythcj:remove:jlx"],
          },
        ];
        this.isselectMlph = true;
        this.show = true;
        this.drawingType = "LineString";
      } else if (data.filed3 == 42) {
        this.level3Id = this.treeClickData.id;
        this.addInfoOptions = [
          {
            key: 1,
            label: "添加建筑物",
            dzyslx: 50,
            dzysmcLable: "建筑物名称：",
            dzysBmhz: "05",
            icon: "el-icon-office-building",
            permiKey: ["jcyw:bzdz:ythcj:add:jzw"],
          },
          {
            key: 4,
            label: "绘制边界",
            dzyslx: 50,
            dzysmcLable: "",
            icon: "el-icon-edit-outline",
            permiKey: ["jcyw:bzdz:ythcj:draw:border"],
          },
          {
            key: 6,
            label: "修改小区",
            dzyslx: 42,
            dzysmcLable: "小区名称：",
            icon: "el-icon-edit",
            permiKey: ["jcyw:bzdz:ythcj:edit:xiaoqu"],
          },
          {
            key: 8,
            label: "删除",
            icon: "el-icon-delete",
            permiKey: ["jcyw:bzdz:ythcj:remove:xiaoqu"],
          },
        ];
        this.isselectMlph = true;
        this.drawingType = "Polygon";
        this.isRequired = false;
        this.show = true;
      } else if (data.filed3 == 50) {
        this.floorObj.id = this.treeClickData.id;
        this.floorObj.name = this.treeClickData.filed2;
        this.addInfoOptions = [
          {
            key: 4,
            label: "标记楼栋",
            dzyslx: "",
            dzysmcLable: "",
            icon: "el-icon-star-on",
            permiKey: ["jcyw:bzdz:ythcj:sign:loudong"],
          },
          {
            key: 7,
            label: "层户结构",
            dzyslx: "",
            icon: "el-icon-s-grid",
            permiKey: ["jcyw:bzdz:ythcj:chjg"],
          },
          {
            key: 6,
            label: "修改建筑物",
            dzyslx: "50",
            dzysmcLable: "建筑物名称：",
            dzysBmhz: "",
            icon: "el-icon-edit",
            permiKey: ["jcyw:bzdz:ythcj:edit:jzw"],
          },
          {
            key: 8,
            label: "删除",
            icon: "el-icon-delete",
            permiKey: ["jcyw:bzdz:ythcj:remove:jzw"],
          },
        ];
        this.show = true;
        this.drawingType = "Point";
        this.isselectMlph = true;
      } else {
        this.show = false;
        this.menuVisible = false;
      }
    },
    getInformation(id) {
      return new Promise((resLove, reject) => {
        getYthcj(id).then((res) => {
          if (res.code == 200) {
            resLove(res.data);
          }
        });
      });
    },
    async selectMenu(index) {
      this.bmqzLabel = "";
      this.bmhzLabel = "";
      // this.mrxzwangGeOptions = []
      // // wangGeTree

      document.getElementById("popMenu").style.display = "none";
      let data = this.addInfoOptions[index];
      this.addCellForm.sjdzysqc = this.treeClickData.filed2;
      this.addCellForm.sjdzysid = this.treeClickData.id;
      let bcsj = await getTreeSelectId(this.treeClickData.id);
      if (data.dzyslx == 50) {
        this.suoShuWangGe = true;
        this.getWangGe();
      } else {
        this.suoShuWangGe = false;
      }
      if (data.key == 1 || data.key == 2 || data.key == 3) {
        this.$nextTick(() => {
          // let labelLength = this.treeClickData.label.length
          // let strLength = this.treeClickData.filed2.length
          this.addCellForm.dizhiqian = this.treeClickData.filed2;
          this.dzysmcLable = data.dzysmcLable;
          this.drawerTitle = data.label;
          this.addCellForm.dzyslx = data.dzyslx;
          this.addCellForm.dzysBmhz = data.dzysBmhz;
          this.addCellForm.dzysBmmc = null;
          this.formatterBmhzLabel(data.dzysBmhz);
          this.formatterBmqzLabel(data.dzysBmqz);
          // if (data.dzyslx == 50) {
          //   this.$refs.wangGeTree.setCheckedKeys(this.mrxzwangGeOptions)
          // }
          if (data.dzyslx == 41) {
            this.addCellForm.dzysBmhz = "";
          }
        });
        this.isAdd = true;
        this.addCell = true;
        this.isShowBtn = false;
      } else if (data.key == 6) {
        let shangObj = await this.getInformation(this.treeClickData.sjdzysid);
        // 此处为修改的数据  这里要获取  所属网格要默认选中的数据
        // 修改
        getYthcj(this.treeClickData.id).then(async (res) => {
          let str, str2;
          this.dzysmcLable = data.dzysmcLable;
          this.drawerTitle = data.label;
          this.addCellForm.dzyslx = data.dzyslx;
          let sswgList = [];
          let sswgListNum = [];
          // str = this.treeClickData.filed2
          // str2 = str.replace(this.treeClickData.label, '')
          if (data.dzyslx == 41) {
            this.isselectMlph = false;
          }
          // if (data.dzyslx == 50) {
          //   sswgList = res.data.sswgbm.split(",")
          //   sswgList.forEach(item => {
          //     sswgListNum.push(item * 1)
          //   })
          // } else {
          //   this.addCellForm.dzysBmqz = ''
          // }
          this.$nextTick(() => {
            this.$set(this.addCellForm, "dzysmc", res.data.dzysmc);
            this.$set(this.addCellForm, "dzysBmmc", res.data.dzysBmmc);
            this.$set(this.addCellForm, "id", this.treeClickData.id);
            this.$set(
              this.addCellForm,
              "sjdzysid",
              this.treeClickData.sjdzysid
            );
            this.$set(this.addCellForm, "dzysBmhz", res.data.dzysBmhz);
            this.$set(this.addCellForm, "sjdzysqc", str2);
            this.$set(this.addCellForm, "dzysBmqz", res.data.dzysBmqz);
            if (data.dzyslx == 50) {
              if (res.data.sswgbm == "") {
                this.$set(this.addCellForm, "sswgbm", null);
              } else {
                this.$set(this.addCellForm, "sswgbm", res.data.sswgbm);
              }
            }
            this.formatterBmhzLabel(this.addCellForm.dzysBmhz);
            this.formatterBmqzLabel(this.addCellForm.dzysBmqz);
            this.oldName = res.data.dzysmc;
            this.addCellForm.dizhiqian = shangObj.dzysqc;
          });
          this.isAdd = false;
          this.addCell = true;
          this.isShowBtn = false;
        });
      } else if (data.key == 7) {
        // let data = await this.getZhzzJcywBzdzYthcjTreeById(
        //   this.treeClickData.id
        // )
        this.editFloorList = [];
        this.editFloorObj = {
          dsList: [],
          spList: [],
          dxList: [],
        };
        this.addFloor = true;
        this.show = false;
        // if (data.length > 0) {
        //   this.chuanList = data
        //   this.lookFloor = true
        //   this.drawerFloorTitle = '查看层户结构'
        // } else {
        //   this.lookFloor = false
        // }
        // 切换show
      } else if (data.key == 8) {
        if (bcsj.data.length) {
          this.$modal.msgWarning("存在下级数据，不能删除");
          return;
        }
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (this.treeClickData.children) {
              delYthcjById(this.treeClickData.id).then((res) => {
                if (res.code == 200) {
                  this.delYthcj();
                } else {
                  this.$modal.msgSuccess("删除失败");
                }
              });
            } else {
              this.delYthcj();
            }
          })
          .catch(() => {});
      } else {
        if (this.treeClickData.filed3 == 42) {
          // 绘制边界
          this.isAdd = true;
          this.show = false;
          this.showEdit = true;
          let feature = this.polyonSource.getFeatures();
          if (feature.length != 0) {
            this.drawingNewPolyon = false;
          } else {
            this.drawingNewPolyon = true;
          }
          this.isShowBtn = true;
          this.addClick();
        } else {
          // 绘制点
          this.isAdd = true;
          this.show = false;
          this.showEdit = false;
          this.drawingNewPolyon = true;
          this.isShowBtn = true;
        }
      }
    },
    getZhzzJcywBzdzYthcjTreeById(id) {
      return new Promise((relove, reject) => {
        getZhzzJcywBzdzYthcjTreeById(id).then((res) => {
          if (res.code == 200) {
            relove(res.data);
          }
        });
      });
    },
    // 切换图层单选框
    checkMapView(val) {
      for (let i = 1; i <= this.mapOptions.length; i++) {
        if (val == i) {
          this.map
            .getLayers()
            .item(i - 1)
            .setVisible(true);
        } else {
          this.map
            .getLayers()
            .item(i - 1)
            .setVisible(false);
        }
      }
    },
    doNothing() {
      window.event.returnValue = false;
      return false;
    },
    delYthcj() {
      delYthcj(this.treeClickData.id).then((res) => {
        if (res.code == 200) {
          this.$modal.msgSuccess("删除成功");
          // this.getTreeSelect(this.treeClickNode.parent.data.id)
          this.treeSelectId = false;
          this.$nextTick(() => {
            this.treeSelectId = true;
          });
        } else {
          this.$modal.msgSuccess("删除失败");
        }
      });
    },
    getChecking(val) {
      this.checkMapView(val);
    },
    // 点击楼栋跳转页面
    addPointClick() {
      let that = this;
      that.mapClick = that.map.on(
        "click",
        function (e) {
          var pixel = that.map.getEventPixel(e.originalEvent);
          var hit = that.map.hasFeatureAtPixel(pixel);
          let feature = that.map.forEachFeatureAtPixel(
            e.pixel,
            (feature) => feature
          );
          if (hit) {
            let id = feature.getProperties().id;
            if (id) {
              // that.getZhzzJcywBzdzYthcjTreeById(
              //   that.treeClickData.id
              // ).then((res)=>{
              //   if (data.length > 0) {
              that.$router.push({
                name: "Sygl",
                params: {
                  id: id,
                  title: feature.getProperties().qc,
                },
              });
              //   }
              // })
            }
          }
        }.bind(this)
      );
    },
    // 删除点或边界
    delDrawing() {
      if (this.drawingType == "Point") {
        let feature = this.pointSource.getFeatures();
        for (let i = 0; i < feature.length; i++) {
          if (feature[i].getProperties().id == this.treeClickData.id) {
            this.pointLayer.getSource().removeFeature(feature[i]);
          }
        }
      } else if (this.drawingType == "Polygon") {
        this.polyonSource.clear();
      } else {
        this.lineSource.clear();
      }
      this.pointsArr = "";
    },
    // currentDept() {
    //   let point, center
    //   let that = this
    //   getBoundaryPoint({ deptId: this.$store.state.user.deptId }).then(
    //     (res) => {
    //       if (res.rows && res.rows.length) {
    //         point = JSON.parse(res.rows[0].jwdzb)
    //         center = JSON.parse(res.rows[0].zxdzb)
    //         let feature = new Feature({
    //           geometry: new Polygon(point)
    //         })
    //         let styles = [
    //           new Style({
    //             stroke: new Stroke({
    //               color: '#ff4040a1',
    //               width: 3
    //             })
    //           })
    //         ]
    //         feature.setStyle(styles)
    //         that.defaultLayer.getSource().addFeature(feature)
    //         that.map.getView().setCenter(center)
    //         if (res.rows[0].field1) {
    //           that.map.getView().setZoom(res.rows[0].field1)
    //         } else {
    //           let extent = new boundingExtent(point[0])
    //           that.map.getView().fit(extent, { padding: [100, 100, 100, 100] })
    //         }
    //       }
    //     }
    //   )
    // },
    handleSelect(item) {
      this.searchText = item.values_.NAMEC;
      this.querySource.clear();
      this.querySource.addFeatures([item]);
      this.map
        .getView()
        .animate(
          { zoom: this.map.getView().setZoom(12) },
          { center: item.values_.geometry.flatCoordinates }
        );
    },
    async querySearchAsync(queryString, callback) {
      this.getFeaturesByPoiName(queryString);
      this.poiQueryResult = await this.getFeaturesByPoiName(queryString);
      callback(this.poiQueryResult);
    },
    getMapDataSourceUrl() {
      let type = process.env.VUE_APP_MAP_URL_DICT + "_zy";
      getDicts(type).then((res) => {
        this.mapDataSource = res.data[0].remark;
      });
      console.log(
        type,
        "11111111111111111111111111111111111111111111111111111111111111"
      );
    },
    getFeaturesByPoiName(queryString) {
      return new Promise((relove, reject) => {
        let that = this;
        var featureService = new FeatureService(that.mapDataSource);
        var sqlParam = new GetFeaturesBySQLParameters({
          queryParameter: {
            attributeFilter: `NAMEC like '%${queryString}%'`,
          },
          datasetNames: ["shiliang20220701:Poi"],
        });
        featureService.getFeaturesBySQL(sqlParam, function (serviceResult) {
          var features = new GeoJSON().readFeatures(
            serviceResult.result.features
          );
          relove(features);
        });
      });
    },
    searchAll() {
      let that = this;
      var featureService = new FeatureService(that.mapDataSource);
      var sqlParam = new GetFeaturesBySQLParameters({
        queryParameter: {
          attributeFilter: `NAMEC like '%${that.searchText}%'`,
        },
        datasetNames: ["shiliang20220701:Poi"],
      });
      featureService.getFeaturesBySQL(sqlParam, function (serviceResult) {
        var features = new GeoJSON().readFeatures(
          serviceResult.result.features
        );
        that.querySource.clear();
        that.querySource.addFeatures(features);
      });
    },
  },
  mounted() {
    this.routeQuery = this.$route.query.id || null;
    this.mapOptions =
      mapconfig.url || JSON.parse(localStorage.getItem("mapSource"));
    this.initMap();
    for (let i = 0; i < this.mapOptions.length; i++) {
      if (this.mapOptions[i].dictValue === "2") {
        this.mapView = this.mapOptions[i].dictValue;
        this.checkMapView(this.mapOptions[i].dictValue);
      }
    }
    this.initAddQz();
    this.getMapDataSourceUrl();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
@import "~@/assets/styles/xinZengBox.scss";
@import "~@/assets/styles/mapCommonStyle.scss";
.menloupai {
  ::v-deep .el-input-group__prepend {
    padding: 0 !important;
    border: 1px solid #dcdfe6 !important;
    background: #fff !important;
  }
  ::v-deep .el-select--medium {
    width: 100% !important;
    margin: -10px 0 !important;
  }
  ::v-deep .el-input-group__append {
    padding: 0 !important;
    border: 1px solid #dcdfe6 !important;
    background: #fff !important;
  }
}
.ythcj {
  width: 100%;
  flex: 1;
  overflow: hidden;
  // background-color: #eef2fb;
  .treeBox {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    margin-right: 10px;
    .tree {
      box-sizing: border-box;
      background-color: #f5f7fa;
      flex: 1;
      // tree上面增加元素 改变第一个数值为0   设置新增的元素  padding-top=10px
      padding: 10px 10px 10px 10px;
    }
  }
  .treeBox::-webkit-scrollbar {
    display: none;
  }
}
.gong_drawer__footer {
  display: block;
  text-align: right;
  box-sizing: border-box;
  padding-right: 4%;
}
.search-tree {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 0px 15px 0px;
  .el-input--medium {
    width: 100%;
  }
}
// 滚动条样式
div::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
div::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
div::-webkit-scrollbar-thumb {
  background: #d8d8d8;
  border-radius: 5px;
}
.add-drawer {
  padding: 20px;
}
.icons {
  color: white;
  text-align: center;
  font-size: 14px;
  i {
    cursor: pointer;
  }
}
.el-divider--horizontal {
  margin: 5px 0;
}
.popMenu {
  width: 160px;
  position: absolute;
  z-index: 99;
}
.layers-box {
  position: absolute;
  z-index: 50;
  right: 20px;
  bottom: 20px;
}
</style>
<style lang="less">
.el-input-group__append,
.el-input-group__prepend {
  width: 33%;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.box-cards .el-card__body {
  padding: 0px;
  .text-item {
    height: 35px;
    line-height: 35px;
    padding-left: 10px;
    font-size: 18px;
  }
  .text-item:hover {
    background-color: #f3f7ff;
  }
}
.tree .el-tree-node__content {
  background-color: #f5f7fa;
  height: 35px;
}
.tree .el-tree-node__content {
  &:hover {
    color: #1890ff;
  }
}
.tree .el-tree-node.is-current > .el-tree-node__content {
  background-color: #f3f7ff !important;
}
</style>
<style lang="less" scoped>
.tree {
  /deep/.el-tree-node__children {
    overflow: initial;
  }
}
.btn {
  position: absolute;
  z-index: 50;
  right: 10px;
  top: 10px;
  background: #202124;
  border-radius: 3px;
  opacity: 0.81;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 42px;
  box-sizing: border-box;
  padding: 0 8px;
  div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 60px;
  }
  img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  i {
    font-size: 16px;

    font-weight: 400;
    color: #ffffff;
    cursor: pointer;
  }
  .el-button {
    font-size: 16px;

    font-weight: 400;
    color: #ffffff;
  }
  .el-divider--vertical {
    width: 1px;
    height: 33px;
    background: #474748;
  }
}
</style>
