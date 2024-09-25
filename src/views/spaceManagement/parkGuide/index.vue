<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <point-map
        ref="gisMap"
        @map-location="maplocation"
      ></point-map>
      <!-- 布控列表 -->
      <div class="leftBox padding-10" v-if="contentShow">
        <div class="seachBox">
          <el-input
            v-model="parameter.name"
            placeholder="请输入区域名称"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="onSearch"
            >搜索
          </el-button>
          <el-button
            icon="el-icon-refresh"
            @click="onReset"
            >重置
          </el-button>
        </div>
        <div class="addBox"></div>
        <div class="tableBox">
          <el-table
            @row-click="lookContents"
            height="560"
            :data="controlTableData"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column
              label="区域名称"
              show-overflow-tooltip
              prop="name"
            >
            </el-table-column>
            <el-table-column
              label="经度"
              show-overflow-tooltip
              prop="longitude"
            >
            </el-table-column>
            <el-table-column
              label="纬度"
              show-overflow-tooltip
              prop="latitude"
            >
            </el-table-column>
            <!-- <el-table-column label="二维码">
              <template slot-scope="scope">
                <svg-icon icon-class="erweima" style="font-size: 16px;cursor: pointer;" @click.stop="showQrcode(scope.row)" />
              </template>
            </el-table-column> -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="lookContent(scope.row)"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  type="text"
                  @click="onDelete(scope.row)"
                  icon="el-icon-delete"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            style="margin-top: 0px"
            v-show="controlTableData && controlTableData.length > 0"
            small
            @pagination="handleCurrentChange"
            :page.sync="pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="pageSize"
            layout="total, prev, pager, next"
            :total="total"
          />
        </div>
      </div>
      <!-- 坐标编辑详情弹框 -->
      <div class="cameraBox padding-10" v-show="cameraShow">
        <span class="info">保存</span>
        <el-form :model="cameraForm" label-width="80px">
          <el-form-item label="区域名称">
            <el-input v-model="cameraForm.name"></el-input>
          </el-form-item>
          <el-form-item label="经度">
            <label slot="label"
              >经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度</label
            >
            <el-input v-model="cameraForm.longitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="纬度">
            <label slot="label"
              >纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度</label
            >
            <el-input v-model="cameraForm.latitude" disabled></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align:center;margin-left: 25px;"> 
          <el-button
              type="primary"
              @click="confirmUpdateDevice()"
              >确定
            </el-button>
            <el-button
              @click="cancelAddDevice"
              >取消
            </el-button>

        </div>
      </div>
    </div>
    <el-dialog
      title="点位信息"
     
      :visible.sync="showQrcodeDialog"
      :show-close="false"
      width="15%"
      >
      <div id="qrcode" ref="qrcode" class="qrcode" align="center"></div>
      <div slot="footer" style="text-align: center; margin-top: 20px">
        <el-button type="primary" @click="cancleDialog()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pointMap from "@/components/common/map/point-map";
import { getStringByKey, getObjByKey } from "@/utils/voice.js";
import pagination from "@/components/comPagination";
import { getAllDevice, updateDeviceByid } from "@/api/resource.js";
import HighlightSquare from '@/components/HighlightSquare'
import {
  initTabData,
  addGuide,
  deleteGuide,
  editGuide,
} from "@/api/spaceManagement/parkGuide.js";

import QRCode from "qrcodejs2";

export default {
  name:'ParkGuide',
  components: {
    pagination,
    pointMap,
    HighlightSquare
  },
  data() {
    return {
      showQrcodeDialog: false,
      deviceTypeArr: [],
      carGroup: [], // 布控对象
      EntityManage: {},
      contentShow: true, // leftBox的切换
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
        type: "car_analysis_DICT:71024",
        TableData: [],
        desc: "",
      },
      // 校验
      addRules: {
        name: {
          required: true,
          message: "请输入布控名称",
          trigger: "blur",
        },
        object: {
          required: true,
          message: "请选择布控对象",
          trigger: "blur",
        },
        type: {
          required: true,
          message: "请选择分析类型",
          trigger: "blur",
        },
      },
      cameraShow: false, // 摄像机展示
      // 摄像机详情
      cameraForm: {
        name: "",
        latitude: "",
        longitude: "",
        position: "",
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
        desc: "",
      },
      permission: {
        add: {url: '/parkView/parkView', method: 'POST'},
        edit: {url: '/parkView/parkView/', method: 'PUT'},
      },
      deviceList: [],
      preIcon: "",
      clickIcon: "",
      isClickShow: false,
      parameter: {
        pageNum: 1,
        pageSize: 10,
        name: "",
      },
      markers: [],
      addType: "",
      cameraImg: require("../../../assets/images/map/camera.png"),
      changeImg: require("../../../assets/images/map/camera-erry.png"),
      currentQrcodeInfo: "",
      address: "http://103.82.227.24:22001/parkview/",
    };
  },
  watch: {},
  created() {},
  mounted() {
    //       this.getDeviceList();
    this.getTableData();
  },
  methods: {
    cancleDialog() {
      this.showQrcodeDialog = false;
      this.$refs.qrcode.innerHTML = "";
    },
    showQrcode(data) {
      this.currentQrcodeInfo = this.address+'?longitude='+ data.longitude+'&latitude='+data.latitude;
      this.showQrcodeDialog = true;
      this.qrcode();
    },
    qrcode() {
      this.$nextTick(() => {
        let qrcode = new QRCode("qrcode", {
          width: 150,
          height: 150,
          text: this.currentQrcodeInfo, //内容，二维码地址
          colorDark: "#000", //前景色
          colorLight: "#fff", //背景色
        });
      });
    },

    getTableData() {
      initTabData('/parkView/parkView/page', 'get', this.parameter).then((res) => {
        if (res.code === 200) {
          this.controlTableData = res.data.data;
          this.total = res.data.total;
          this.parameter.pageNum = res.data.pageNum;
          this.parameter.pageSize = res.data.pageSize;
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            totalPage === this.parameter.pageNum &&
            this.controlTableData.length === 1
          ) {
            this.parameter.pageNum--;
          }
        }
      });
    },
    onReset() {
      this.parameter = {
        pageNum: 1,
        pageSize: 10,
        type: "position",
        name: "",
      };
      this.getTableData();
    },
    /**
     * @name: 地图初始化
     * @Author: sscaij
     * @msg: 获取地图上的信息数据
     * @param {*}
     * @return {*}
     */
    initmap() {
      //
    },
    // /**
    //  * @name: 分页获取设备
    //  * @Author: sscaij
    //  * @msg:
    //  * @param {*}
    //  * @return {*}
    //  */
    getDeviceList() {
      let url = "/pm/device/criteria";
      let method = "get";
      let searchData = {
        url,
        method,
        params: this.parameter,
      };
      getAllDevice(searchData).then((res) => {
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
    clickPoint(e) {
      console.log(e, "22222");
    },
    maplocation(e) {
      this.cameraForm.latitude = e[1];
      this.cameraForm.longitude = e[0];
      this.addType = this.addType ? this.addType : 'add'
      if(this.addType === 'add'){
        this.cameraShow = true;
      }
      this.$refs.gisMap.clearLayer();
      const arr = [
          {
              src: require("@/assets/images/mapImg/position.png"),
              coord: [e[0],e[1]],
          },
      ];
      this.$refs.gisMap.addMarket(arr, "position");
    },
    getMouseLOcation(e) {
      console.log(e, "44");
      // this.cameraForm.latitude = e[0];
      // this.cameraForm.longitude = e[1];
    },
    /**
     * @name: 更新经纬度
     * @Author: sscaij
     * @msg:
     * @param {*}
     * @return {*}
     */
    confirmUpdateDevice() {
      let ids = this.cameraForm.id;
      let obj =
        this.addType === "edit"
          ? this.permission.edit
          : this.permission.add;
      let url =
        this.addType === "edit"
          ? `${obj.url}${ids}`
          : obj.url;
      let data = this.cameraForm;
      editGuide(url, obj.method, data).then((res) => {
        if (res.code === 200) {
          if (this.addType === "edit") {
            this.$message.success("修改成功");
          } else {
            this.$message.success("添加成功");
          }
          this.getTableData();
          this.cancelAddDevice()
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    //   let url = "/pm/device";
    //   let method = "put";
    //   let params = {
    //     url,
    //     method
    //   };
    //   updateDeviceByid(params, {
    //     id: this.cameraForm.id,
    //     latitude: this.cameraForm.latitude,
    //     longitude: this.cameraForm.longitude
    //   }).then(res => {
    //     if (res.meta.status == 200) {
    //       this.cancelAddDevice();
    //       this.parameter.pageNum = 1;
    //       this.getDeviceList();
    //       this.$message({
    //         type: "success",
    //         message: "保存成功!"
    //       });
    // let outdoorCameras = [{
    // 	id: item.deviceId,
    // 	label: item.deviceName,
    // 	anchor: [29, 29],
    // 	coord: [this.cameraForm.latitude * 1, this.cameraForm.longitude * 1],
    // 	src: item.controlTaskCode > 0 ? '/images/map/camera/camera-trol.png' : (item.status + '' === '1' ? '/images/theme/dark/map/camera.png' : '/images/theme/dark/map/camera-offline.png'),
    // 	options: {
    // 		areaName: item.areaName,
    // 		area: item.area,
    // 		deviceName: item.deviceName,
    // 		thirdId: item.thirdDeviceId,
    // 		imesDeviceId: item.imesDeviceId,
    // 		deviceId: item.deviceId,
    // 		status: item.status,
    // 		coord: [item.longitude * 1, item.latitude * 1],
    // 		isIndoor: item.isIndoor,
    // 		floorId: item.floorId,
    // 		floorName: item.floorName,
    // 		buildName: item.buildName,
    // 		buildingId: item.buildingId
    // 	}
    // }]

    /**
     * @name: 关闭弹框
     * @Author: sscaij
     * @msg:
     * @param {*}
     * @return {*}
     */
    cancelAddDevice() {
      this.cameraShow = false;
      this.cameraForm.id = "";
      this.addType = ''
      this.cameraForm.name = ''
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

    filterItemCode(code) {
      let a = this.carGroup.filter((item) => item.value == code.trim());
      if (a[0]) {
        return a[0].name;
      }
    },
    lookContents(row, event, column) {
      this.lookContent(row);
    },
    lookContent(item) {
      this.addType = "edit";
      this.cameraShow = true;
      this.cameraForm.position = `lat:${item.latitude}、lng${item.longitude}`;
      this.cameraForm = {
        name: item.name,
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude,
      };
      this.$refs.gisMap.clearLayer();
      if (item.latitude && item.longitude) {
        this.$refs.gisMap.addMarket(
          [
            {
              src: "/map/position.png",
              coord: [+item.longitude,+item.latitude],
            },
          ],
          "position"
        );
      }
    },
    onDelete(data) {
      this.$confirm("确定要删除此点位信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteGuide('/parkView/parkView/{id}', 'delete', data.id).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getTableData();
          } else {
            this.$message.error(res.meta.message);
          }
        });
      });
    },

    // 根据车主搜索
    onSearch() {
      this.getTableData();
    },
    // 切换到第几页了
    handleCurrentChange(n) {
      this.parameter.pageNum = n.page;
      this.getTableData();
    },
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

::v-deep .el-pagination {
  text-align: left;
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
        button {
          color: white;
        }
        .deletebutton {
          color: #f05656;
        }
      }
      .pagination-container {
        width: 400px;
      }
    }

    .cameraBox {
      position: absolute;
      top: 70px;
      right: 2%;
      width: 16%;
      height: 29%;
      z-index: 100;
      padding: 10px;
      padding-top: 40px;
      background-color: rgba(32, 34, 48, 0.9);
      .info {
        position: absolute;
        top: 10px;
        left: 10px;
        color: white;
        cursor: pointer;
      }
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
  ::v-deep.el-table.el-table--fit{
  overflow: hidden;
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
  ::v-deep .el-input .el-input__inner {
    border-radius: 6px;
    color: #ccc !important;
    background-color: #313448 !important;
    border: 1px solid #313448 !important;
   }
  ::v-deep .el-table.el-table--fit tr th {
    background-color: rgba(38, 40, 57, 0.3) !important;
   }
   ::v-deep .el-pagination--small span:not([class*=suffix]), .el-pagination--small button{
     background-color: transparent !important;
   }
   ::v-deep .el-pager li{
    background-color: #313448 !important;
  }
  ::v-deep .el-pagination .btn-prev, .el-pagination .btn-next{
    background-color: #313448 !important;
  }
  ::v-deep .el-pagination button:disabled{
    background-color: #313448 !important;
  }
  /*.qrcode {*/
  /*img {*/
  /*margin: 0 auto;*/
  /*}*/
  /*}*/
}
</style>
<style>
.amap-marker-label {
  background-color: transparent !important;
  border: none !important;
}
</style>
