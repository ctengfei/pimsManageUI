<!--
 * @version: 1.0.0
 * @Author: sscaij
 * @Date: 2021-10-19 16:40:30
 * @LastEditTime: 2023-03-03 11:45:42
 * @LastEditors: renjianwu jwrenx@isstech.com
-->
<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <point-map ref="gisMap" @map-location="mapLocation"></point-map>
      <!-- 布控列表 -->
      <div class="leftBox padding-10">
        <div class="seachBox">
          <el-select
            v-model="parameter.type"
            clearable
            placeholder="设备类型"
            style="margin-right: 10px;"
            @change="selectType"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in deviceTypeArr"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
          <el-input v-model="parameter.name" placeholder="请输入设备名称" style="width:70%" clearable></el-input>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        </div>
        <div class="addBox"></div>
        <div class="tableBox">
          <el-table height="560" :data="controlTableData" style="width: 100%">
            <el-table-column label="序号" type="index" width="48" align="center">
              <template slot-scope="scope">
                <span>
                  {{
                  (parameter.pageNum - 1) *
                  parameter.pageSize +
                  scope.$index +
                  1
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="设备类型" show-overflow-tooltip prop="belongSubsystem" width="80"></el-table-column>
            <el-table-column label="设备名称" show-overflow-tooltip prop="name" width="80"></el-table-column>
            <el-table-column label="经度" show-overflow-tooltip prop="longitude" width="70"></el-table-column>
            <el-table-column label="纬度" show-overflow-tooltip prop="latitude" width="70"></el-table-column>
            <el-table-column width="50" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="
											lookContent(
													scope.$index,
													scope.row
											)
									"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="controlTableData && controlTableData.length > 0"
            :total="total"
            :page.sync="parameter.pageNum"
            :limit.sync="pageSize"
            @pagination="handleCurrentChange"
						:pagerCount="5"
						layout="total, prev, pager, next"
          />
        </div>
      </div>
      <!-- 坐标编辑详情弹框 -->
      <div class="cameraBox padding-10" v-if="cameraShow">
        <div class="saveHead">
          <span>保存</span>
          <i class="el-icon-close" @click="cameraShow = false"></i>
        </div>
        <el-form :model="cameraForm" label-width="68px">
          <el-form-item label="设备类型" prop="belongSubsystem">
            <el-input v-model="cameraForm.belongSubsystem" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="cameraForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <label slot="label">经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度</label>
            <el-input v-model="cameraForm.longitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <label slot="label">纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度</label>
            <el-input v-model="cameraForm.latitude" disabled></el-input>
          </el-form-item>
          <div style="text-align: center;">
            <el-button type="primary" @click="confirmUpdateDevice">确定</el-button>
            <el-button @click="cancelAddDevice" plain>取消</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import pointMap from "@/components/common/map/point-map";
import { getStringByKey, getObjByKey } from "@/utils/voice.js";
import { updateDeviceByid, getAllDevicePoint } from "@/api/resource.js";
import { initData } from "@/api/facility/information";

export default {
  name: "PointPosition",
  components: {
    pointMap
  },
  data() {
    return {
      deviceTypeArr: [],
      carGroup: [], // 布控对象
      EntityManage: {},
      contentShow: true, // leftBox的切换
      formSeach: {
        // 搜索
        carOwner: ""
      },
      // 布控左侧表格数据
      controlTableData: [],
      checkedData: [], // 多选框
      pageSize: 10, // 每页显示的条数
      total: 0, // 总数量

      // 新增表单数据
      addForm: {
        name: "",
        object: "",
        type: "car_analysis_DICT:71024",
        TableData: [],
        desc: ""
      },
      // 校验
      addRules: {
        name: {
          required: true,
          message: "请输入布控名称",
          trigger: "blur"
        },
        object: {
          required: true,
          message: "请选择布控对象",
          trigger: "blur"
        },
        type: {
          required: true,
          message: "请选择分析类型",
          trigger: "blur"
        }
      },
      cameraShow: false, // 摄像机展示
      // 摄像机详情
      cameraForm: {
        type: "",
        name: "",
        longitude: "",
        latitude: ""
      },
      videoShow: false, // 实时监控展示
      player: {}, // 监控的流路径
      // 布控详情
      controlDetailsShow: false, // 详情展示
      controlDetailsForm: {
        name: "",
        object: "",
        type: "",
        TableData: [],
        desc: ""
      },
      deviceList: [],
      preIcon: "",
      clickIcon: "",
      isClickShow: false,
      parameter: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        // deviceId: "",
        type: ""
      },
      markers: [],
      cameraImg: require("../../../assets/images/map/camera.png"),
      changeImg: require("../../../assets/images/map/camera-erry.png")
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getTableData();
    this.getDeviceList();
  },
  methods: {
    selectType() {
      this.parameter.pageNum = 1;
    },
    // 获取地图点位信息
    mapLocation(e) {
      if (this.cameraShow) {
        this.cameraForm.longitude = e[0];
        this.cameraForm.latitude = e[1];
        this.$refs.gisMap.clearLayer();
        const arr = [
          {
            src: require("@/assets/images/mapImg/position.png"),
            coord: [e[0], e[1]]
          }
        ];
        this.$refs.gisMap.addMarket(arr, "position");
      }
    },
    // 获取设备类型
    getTableData() {
      let parmas = {
        nodeType: "DIR"
      };
      initData("/pm/tree/type", "GET", parmas).then(res => {
        this.deviceTypeArr = res.data;
      });
    },
    /**
     * @name: 分页获取设备
     * @Author: sscaij
     * @msg:
     * @param {*}
     * @return {*}
     */
    getDeviceList() {
      getAllDevicePoint(this.parameter).then(res => {
        if (res.data) {
          this.total = res.data.total;
          this.controlTableData = res.data.data;
        } else {
          this.total = 0;
          this.controlTableData = [];
          this.$message.error(res.meta.message);
        }
      });
    },
    /**
     * @name: 更新经纬度
     * @Author: sscaij
     * @msg:
     * @param {*}
     * @return {*}
     */
    confirmUpdateDevice() {
      let url = "/pm/device/point";
      let method = "put";
      let params = {
        url,
        method
      };
      updateDeviceByid(params, {
        id: this.cameraForm.id,
        latitude: this.cameraForm.latitude,
        longitude: this.cameraForm.longitude
      }).then(res => {
        this.cancelAddDevice();
        this.getDeviceList();
        this.$message({
          type: "success",
          message: "保存成功!"
        });
      });
    },
    /**
     * @name: 关闭弹框
     * @Author: sscaij
     * @msg:
     * @param {*}
     * @return {*}
     */
    cancelAddDevice() {
      this.cameraForm = {};
      this.cameraShow = false;
      this.$refs.gisMap.clearLayer();
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

    /**
     * @name: 根据编码获取到name
     * @Author: sscaij
     * @msg:
     * @param {*} code
     * @return {*}
     */
    filterItemCode(code) {
      let a = this.carGroup.filter(item => item.value == code.trim());
      if (a[0]) {
        return a[0].name;
      }
    },
    /**
     * @name: 经纬度弹框
     * @Author: sscaij
     * @msg:
     * @param {*} index
     * @param {*} item
     * @return {*}
     */
    lookContent(index, item) {
      this.cameraShow = true;
      this.cameraForm = {
        name: item.name,
        belongSubsystem: item.belongSubsystem,
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude
      };
      if (item.latitude && item.longitude) {
        this.$refs.gisMap.clearLayer();
        const arr = [
          {
            src: require("@/assets/images/mapImg/position.png"),
            coord: [+item.longitude, +item.latitude]
          }
        ];
        this.$refs.gisMap.addMarket(arr, "position");
      }
    },
    // 根据车主搜索
    onSearch() {
      this.parameter.pageNum = 1;
      this.getDeviceList();
    },
    // 切换到第几页了
    handleCurrentChange(n) {
      this.parameter.pageNum = n.page;
      this.getDeviceList();
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
::v-deep .el-pagination {
  text-align: left;
}
::v-deep .el-select-dropdown .el-popper {
    background: #313448 !important;
    border:1px solid #313448;
}
::v-deep .el-popper{
  border: 1px solid #313448;
}

  ::v-deep .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    color:#fff;
    background-color: #313448 !important;
  }
  ::v-deep .el-pagination .is-background .el-pagination--small{
    background-color: #313448 !important;
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
      width: 420px;
      z-index: 100;
      padding: 10px;
      left: 20px;
      background: rgba(32, 34, 48, 0.9);
      .seachBox {
        width: 100%;
        display: flex;
        justify-content: space-between;
        // padding: 0 5px;
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
      .pagination-container {
				height: 32px;
				position: static;
				background-color: transparent;
      }
    }

    .cameraBox {
      position: absolute;
      top: 70px;
      right: 2%;
      width: 18%;
      height: 38%;
      z-index: 100;
      padding: 20px;
      color: #fff;
      background: rgba(32, 34, 48, 0.9);
      .saveHead {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
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
      .submitButton {
        width: 100%;
        position: absolute;
        bottom: 20px;
        display: flex;
        justify-content: center;
      }
      .tableBox {
        position: relative;
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
  ::v-deep .el-input .el-input__inner {
    border-radius: 6px;
    color: #ccc !important;
    background-color: #313448 !important;
    border: 1px solid #313448 !important;
   }
   ::v-deep .el-table thead{
    color: #ccc !important;
    background-color: #313448 !important;
  }
  ::v-deep.el-table.el-table--fit{
  overflow: hidden;
  }
  ::v-deep .el-table__header-wrapper, .el-table__footer-wrapper{
    background-color: transparent !important;
  }
  ::v-deep .el-table, ::v-deep .el-table tr, ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: transparent !important;
  }
  ::v-deep .el-table .cell {
    color: #afb9d0;
  }
  ::v-deep .el-table th.el-table__cell.is-leaf, ::v-deep .el-table td.el-table__cell {
    border: none;
  }
  ::v-deep .el-table::before {
    height: 0;
  }
  ::v-deep .el-table.el-table--fit tr th {
    background-color: rgba(38, 40, 57, 0.3) !important;
   }
   ::v-deep .el-pagination--small span:not([class*=suffix]), .el-pagination--small button{
    background-color: transparent !important;
  }
  ::v-deep .el-select-dropdown__list{
    border-radius: 0px;
    color: #ccc !important;
    background-color: #313448 !important;
    border: 1px solid #313448 !important;
  }
  ::v-deep .el-pagination .is-background{
    //background-color: transparent !important;
    background-color: rgba(38, 40, 57, 0.3) !important;
  }
  ::v-deep .el-pager li{
    background-color: #313448 !important;
  }
  ::v-deep .el-pagination .btn-prev, .el-pagination .btn-next{
    background-color: #313448 !important;
  }
  ::v-deep .el-pagination .btn-prev, .el-pagination .btn-next{
    background-color: #313448 !important;
  }
  ::v-deep .el-pagination button:disabled{
    background-color: #313448 !important;
  }
  ::v-deep .el-pagination .btn-prev, .el-pagination .btn-next{
    background-color: #313448 !important;
  }
  ::v-deep .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next {
    background-color: transparent !important;
  }
  ::v-deep .is-background .btn-next{
    background-color: #313448 !important;
  }
}
</style>
<style>
.amap-marker-label {
  background-color: transparent !important;
  border: none !important;
}
</style>
