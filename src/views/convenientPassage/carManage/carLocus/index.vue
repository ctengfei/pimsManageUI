<template>
  <div class="app-container-gis">
    <highlight-square class="highlight-height-content">
      <template v-slot:child>
        <!-- <div class="c-map" :id="id" style="width: 100%;height:100%;z-index:100">
        </div> -->
        <div id="cesiumContainer">
          <gis-map ref="gisMap" @mapReady="mapReady"></gis-map>
          <el-button class="mainButton" type="primary" @click="handleClick"
            >车辆轨迹</el-button
          >
          <highlight-square class="highlight padding-10" v-if="contentShow">
            <template v-slot:child>
              <div class="carContent">
                <el-form
                  ref="formSeach"
                  :model="formSeach"
                  label-width="80px"
                  :rules="formSeachrules"
                >
                  <el-form-item label="车牌号码" prop="carNumber">
                    <el-input
                      v-model="formSeach.carNumber"
                      placeholder="请输入车牌号码"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                     :clearable="false"
                      v-model="formSeach.startTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width: 100%"
                      :picker-options="startDatePicker"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                     :clearable="false"
                      v-model="formSeach.endTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width: 100%"
                      :picker-options="endDatePicker"
                      default-time="23:59:59"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      icon="el-icon-search"
                      @click="onSearch"
                      type="primary"
                      >搜索</el-button
                    >
                    <el-button
                      plain
                      icon="el-icon-refresh-left"
                      @click="onReset"
                      >重置</el-button
                    >
                  </el-form-item>
                </el-form>
                <div class="carOwnerBox" v-if="carLocusList.length">
                  <div
                    class="carOwner"
                    v-for="item in carLocusList"
                    :key="item.id"
                  >
                    <img :src="item.carImage" />
                    <div>
                      <span>车牌: {{ item.carNumber }}</span>
                      <span>车主: {{ item.carOwner }}</span>
                      <span
                        >品牌: {{ filterName(carBrand, item.carBrand) }}</span
                      >
                    </div>
                    <el-button
                      type="primary"
                      @click="lookCarContent(item)"
                      >查询车辆轨迹</el-button
                    >
                  </div>
                </div>
                <div v-else class="carOwnerBox" style="display:flex;justify-content:center;align-items: center;">
                  <div style="color: #909399;font-size:18px;">
                    暂无行驶轨迹
                  </div>
                </div>
              </div>
            </template>
          </highlight-square>
          <highlight-square
            class="locusDetails padding-10"
            v-if="locusDetailsShow"
          >
            <template v-slot:child>
              <div class="title">
                <div>车辆轨迹</div>
                <i class="el-icon-close" @click="locusDetailsShow = false"></i>
              </div>
              <div style="color: white">车辆信息</div>
              <div class="carOwner">
                <img :src="locusDetails.carImage" />
                <div>
                  <span>车牌: {{ locusDetails.carNumber }}</span>
                  <span>车主: {{ locusDetails.carOwner }}</span>
                  <span
                    >品牌:
                    {{ filterName(carBrand, locusDetails.carBrand) }}</span
                  >
                </div>
              </div>
              <div style="color: white; margin: 10px 0">行驶轨迹</div>
              <div class="carLocusTime">
                <el-collapse v-model="activeName" accordion>
                  <el-collapse-item
                    v-for="(li, index) in locusDetails.carTrackList"
                    :key="index"
                    :title="li.reportTime"
                    :name="li.reportTime"
                  >
                    <div class="photo">
                      <div class="imgBox">
                        <div v-for="(img,index) in li.imgBox" :key="index">
                          <img :src="img" />
                        </div>
                      </div>
                      <div class="buttonBox">
                        <el-button type="primary" @click="goPhoto(li.imgBox)">查看全景</el-button>
                        <el-button type="primary" @click="goVideo(li.videoPath)">查看录像</el-button>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </template>
          </highlight-square>
          <highlight-square
            class="bigPhoto padding-10"
            v-if="photoShow"
          >
            <template v-slot:child>
              <div class="title">
                查看全景
                <i class="el-icon-close" @click="photoShow = false"></i>
              </div>
              <el-carousel trigger="click">
                <el-carousel-item v-for="(item,index) in photoSrc" :key="index">
                  <img :src="item">
                </el-carousel-item>
              </el-carousel>
            </template>
          </highlight-square>
          <highlight-square
            class="bigVideo padding-10"
            v-if="videoShow"
          >
            <template v-slot:child>
              <div class="title">
                查看录像
                <i class="el-icon-close" @click="videoShow = false"></i>
              </div>
            </template>
          </highlight-square>
        </div>
      </template>
    </highlight-square>
  </div>
</template>

<script>
import gisMap from '@/components/common/map/gis-map';
import { getCarLocus } from "@/api/carManage/carLocus.js";
import { playRecordVideo } from "@/api/videoMange/recordVideo.js";
import {getAllDevice} from '@/api/resource.js'
import { getStringByKey, getObjByKey } from "@/utils/voice.js";
import { getBigPhoto, getSmallPhoto } from "@/api/imageMange/snapPhotoWall";
import { getCarType, getCarBrand } from "@/api/carManage/listManage.js";
import {mapLocation} from "@/utils/map/positionLocation.js";
import { QueryData } from "@/api/configure/argumentsConfigure.js";
import Moment from "moment";
var GisMapObj = null,
  viewer = null,
  that = null;
export default {
  components:{
    gisMap
  },
  data() {
    return {
      deviceList:[],
      preIcon:'',
      clickIcon: '',
      isClickShow: false,
      parameter: {
        pageNum: 1,
        pageSize: 1000,
        deviceName: '',
        deviceId: '',
        type: 'MOUNTED',
        deviceIds:[]
      },
      cameraImg: require('../../../../assets/images/map/camera.png'),
      changeImg: require('../../../../assets/images/map/camera-err.gif'),
      permission: {
        getCarLocus: "carManage::carControl::getCarLocus",
        downloadThumbnail: "videoMange::snapPhotoWall:downloadThumbnail",
        search: "resource::deviceManage:search",
        device: "resource::deviceManage:allSearch",
        searchConfigure: "configure::argumentsConfigure:search",
      },
      contentShow: true,
      carContent: {}, // 从车辆列表跳过来的信息
      carLocusList: [], // 搜索出来的列表
      locusDetails:{}, // 点击其中某一个列表的信息
      locusDetailsShow: false,
      formSeach: {
        carNumber: "",
        startTime: '',
        endTime: '',
      },
      activeName: "1",
      formSeachrules: {
        carNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
      },
      carType: [],
      carBrand: [],
      photoShow: false,
      photoSrc: [],
      videoShow: false,
      videoUrl:'',
      locationObj: {
        lat: 34.25759,
        lng: 108.76754,
      },
      endDatePicker: this.endData(),
      startDatePicker: this.startData(),
    };
  },
  created() {
    let type = {
      url: "/sys/dict/type/nv/car_type",
      method: "get",
    };
    getCarType(type)
      .then((res) => {
        this.carType = res.data;
      })
      .catch((err) => {});
    let brand = {
      url: "/sys/dict/type/nv/car_brand",
      method: "get",
    };
    getCarBrand(brand)
      .then((res) => {
        this.carBrand = res.data;
      })
      .catch((err) => {});
  },
  mounted() {
    console.log(this.$router.history.current.query);
    if (this.$router.history.current.query.carNumber) {
      this.carContent = this.$router.history.current.query;
      this.formSeach.carNumber = this.carContent.carNumber
    }
    this.intoMap();
  },
  methods: {
    // 地图初始化
    intoMap() {
    },
    // 获取设备
    getDeviceList(){
      let url = getStringByKey(this.permission.device, "url");
      let method = getStringByKey(this.permission.device, "method");
      let searchData ={
          url,
          method,
      }
      getAllDevice(searchData).then((res)=>{
        if(res.data){
          this.deviceList = res.data
          this.drawMarker(true, null);
        } else {
          this.deviceList = [];
          this.$message.error(res.meta.message);
        }
      })
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
      if(templist){
        console.log("车辆轨迹 设备数量 ==>" + templist.length);
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
      }
      // let self = this
      // self.preIcon = new AMap.Icon({
      //   image: self.cameraImg,
      //   size: new AMap.Size(80, 80), //图标大小
      //   imageSize: new AMap.Size(80, 80)
      // })
      // self.clickIcon = new AMap.Icon({
      //   image: self.changeImg,
      //   size: new AMap.Size(80, 80), //图标大小
      //   imageSize: new AMap.Size(80, 80) ,
      // })
      // for (let i = 0; i < self.deviceList.length; i++) {
      //     var marker = new AMap.Marker({
      //       position: [Number(self.deviceList[i].longitude), Number(self.deviceList[i].latitude)],
      //       icon: self.preIcon,
      //       // title: self.deviceList[i].name,
      //       data: self.deviceList[i]
      //     })
      //      marker.setLabel({
      //       offset: new AMap.Pixel(0, -10),  //设置文本标注偏移量
      //       content: "<div style='color:#FFE358;font-weight:bold'>"+ self.deviceList[i].name +"</div>", //设置文本标注内容
      //       direction: 'bottom' //设置文本标注方位
      //     });
      //     self.map.add(marker)
      //     self.markers.push(marker)
      //     marker.on('click',(e => {
      //       console.log('e data----', e.target.get('data')) // 获取点击的摄像机的数据
      //       let data = e.target.get('data')
      //       if (this.isClickShow === false) return
      //       for (var i = 0; i < self.markers.length; i++) {
      //         let icon = self.markers[i].getIcon()
      //         if (e.target === self.markers[i]) {
      //             if (icon === self.preIcon) {
      //                 e.target.setIcon(self.clickIcon)
      //                 let isTrue = this.addForm.TableData.some(x => x.id === data.id)
      //                 if (!isTrue) {
      //                   this.addForm.TableData.push(data)
      //                 }
      //             } else {
      //                 e.target.setIcon(self.preIcon)
      //                 this.addForm.TableData = this.addForm.TableData.filter(x => x.id !== data.id)
      //             }
      //         }
      //       }
      //     }))
      // }
    },
    // 判断结束时间
    endData() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.formSeach.startTime) {
            return new Date(self.formSeach.startTime).getTime() > time.getTime() || new Date(self.formSeach.startTime).getTime() < time.getTime() - 1000 * 3600 * 24 * 7;
          }
          return time.getTime() >= Date.now()
        }
      }
    },
    // 判断开始时间
    startData() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.formSeach.endTime) {
            return  new Date(self.formSeach.endTime).getTime() < time.getTime() || time.getTime() < new Date(self.formSeach.endTime).getTime() - 1000 * 3600 * 24 * 7  ;
          }
          return time.getTime() >= Date.now()
        }
      }
    },
    // 车辆轨迹信息
    carLocusContent(data) {
      let dt = {
        url: this.$store.getters.btnpremissAll[this.permission.getCarLocus].url,
        method: this.$store.getters.btnpremissAll[this.permission.getCarLocus].method,
        data,
      };
      getCarLocus(dt).then((res) => {
        if (res.meta.status == 200) {
          this.carLocusList = res.data;
          this.carLocusList.map((item) => {
            this.setPhoto(item.carImage).then(val => {
              let img = `data:img/jpg;base64,${val.data}`
              item.carImage = img
            })
          });
        }
      })
    },
    // 搜索
    onSearch() {
      this.$refs.formSeach.validate((valid) => {
        if (valid) {
          let data = {
            carNumber: this.formSeach.carNumber,
            endTime: Moment(this.formSeach.endTime).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            // pageNum: 1,
            // pageSize: 10,
            startTime: Moment(this.formSeach.startTime).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          };
          this.videoShow = false
          this.photoShow = false
          this.locusDetailsShow = false
          this.carLocusContent(data);
        } else {
          return false;
        }
      });
    },
    // 查询车辆轨迹
    lookCarContent(item) {
      this.locusDetailsShow = true
      this.locusDetails = item
      this.locusDetails.carTrackList.map(item => {
        item.imgBox = item.imagePath.split(',')
        let ar = []
        item.imgBox.map(i=>{
          this.setPhoto(i).then(val => {
            ar.push(`data:img/jpg;base64,${val.data}`)
          })
        })
        item.imgBox = ar

      })
    },
    // 获取图片
    setPhoto(path){
      let url = this.$store.getters.btnpremissAll[this.permission.downloadThumbnail].url
      let method = this.$store.getters.btnpremissAll[this.permission.downloadThumbnail].method
      let tempObj1 = {
        url,method,
        path
      };
      return new Promise(function (resolve, reject) {
        getSmallPhoto(tempObj1).then((res) => {
          resolve(res)
        })
      });
    },
    // 查看全景
    goPhoto(path){
      this.photoShow = true
      this.photoSrc = path
    },
    // 查看录像
    goVideo(path){
      this.videoShow = true
      this.videoUrl = playRecordVideo(path)
    },
    // 重置
    onReset() {
      this.formSeach= {
        carNumber: "",
        startTime: "",
        endTime: ""
      };
      this.carLocusContent(this.formSeach)
    },

    // 切换轨迹信息
    handleClick() {
      this.contentShow = !this.contentShow;
    },
    // 获取name
    filterName(arr, code) {
      if (!code) return "";
      let a = arr.filter((item) => item.value == code);
      if (a[0]) {
        return a[0].name;
      }
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
    .highlight {
      position: absolute;
      top: 70px;
      left: 20px;
      width: 22%;
      min-width: 360px;
      height: 85%;
      z-index: 100;
      padding: 10px;
      background-color: rgba(0, 15, 52, 0.9);

      .carOwnerBox {
        width: 100%;
        height: 450px;
        border-top: solid 1px rgba(8, 229, 242, 0.47);
        overflow: auto;
      }
    }
    .carOwner {
      position: relative;
      border-bottom: solid 1px rgba(8, 229, 242, 0.47);
      display: flex;
      font-size: 13px;
      height: 100px;
      padding: 10px 0;
      img {
        width: 82px;
      }
      div {
        display: flex;
        margin-left: 10px;
        flex-direction: column;
        justify-content: space-between;
        color: white;
      }
    }
    .locusDetails {
      position: absolute;
      top: 70px;
      left: 500px;
      width: 23%;
      min-width: 400px;
      height: 65%;
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
      .carLocusTime {
        width: 100%;
        height: 300px;
        overflow: auto;
        .photo {
          padding: 10px;
          .imgBox{
            display: flex;
            overflow-x: auto;
            img {
              width: 82px;
              height: 82px;
              margin-right: 5px;
              // border: 1px solid #206aff;
            }
          }
          .buttonBox{
            display: flex;
            margin-top: 10px;
          }
        }
      }
    }

    .bigVideo,.bigPhoto{
      position: absolute;
      width: 400px;
      right: 25%;
      min-width: 400px;
      height: 340px;
      z-index: 100;
      padding: 10px;
      background-color: rgba(0, 15, 52, 0.9);
      img{
        width: 100%;
        height: 88%;
      }
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
    .bigPhoto{
      top: 70px;
      // height: 300px;
    }
    .bigVideo{
      top: 450px;
      height: 280px;
    }
  }
  .el-collapse-item__header, .el-collapse-item__wrap {
    color: #f5f7fa !important;
    background-color: transparent !important;
  }
}
</style>
<style>
.amap-marker-label{
  background-color: transparent !important;
  border: none !important;
}
</style>
