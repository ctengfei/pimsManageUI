<template>
  <div class="app-container-gis">
    <highlight-square class="highlight-height-content">
      <template v-slot:child>
         <!-- <div class="c-map" :id="id" style="width: 100%;height:100%;z-index:100"></div> -->
        <div id="cesiumContainer">
          <gis-map ref="gisMap" @mapReady="mapReady"></gis-map>
          <el-button class="mainButton" type="primary" @click="handleClick"
            >人员轨迹</el-button
          >
          <highlight-square class="highlight padding-10" v-if="contentShow">
            <template v-slot:child>
              <div class="carContent">
                <el-form
                  ref="formSearch"
                  :model="formSearch"
                  label-width="80px"
                  :rules="formSearchrules"
                >
                  <el-form-item>
                    <!-- <span style="color:#f05656;position: absolute;left: -78px;">*</span> -->
                    <p slot="label" style="margin-top: 35px"><i style="color: #f05656;margin-right:5px;">*</i>人员头像</p>
                    <upLoadPhoto :putJpeg="putJpeg" @photoUrl="photoUrl"/>
                    <p v-show="photoText" style="color:#f05656;font-size:12px;position: absolute;top:90%;">请上传头像</p>
                  </el-form-item>
                  <el-form-item label="阈值" prop="value1">
                    <el-slider v-model="formSearch.value1" :max="maxs" />
                  </el-form-item>
                  <el-form-item label="姓名">
                    <el-input v-model="formSearch.personnelName" placeholder="请输入姓名" style="width:100%" />
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="formSearch.personnelPhone" placeholder="请输入手机号" style="width:100%" />
                  </el-form-item>
                  <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                     :clearable="false"
                      v-model="formSearch.startTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width:100%"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="startDatePicker"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                     :clearable="false"
                      v-model="formSearch.endTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width:100%"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="endDatePicker"
                      default-time="23:59:59"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      icon="el-icon-search"
                      type="primary"
                      @click="onSearch"
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
                <div class="carOwnerBox" v-if="peopleLocusList.length">
                  <div
                    class="carOwner"
                    v-for="item in peopleLocusList"
                    :key="item.id"
                  >
                    <img :src="item.personPhoto" />
                    <div>
                      <span>姓名: {{ item.name }}</span>
                      <span>手机: {{ item.phone }}</span>
                      <span>名单组: {{filterName(item.personType) }}</span>
                    </div>
                    <el-button
                      type="primary"
                      @click="lookCarContent(item)"
                      >查询人员轨迹</el-button
                    >
                  </div>
                </div>
                <div v-else class="carOwnerBox" style="display:flex;justify-content:center;align-items: center;">
                  <div style="color: #909399;font-size:18px;">
                    暂无人员轨迹
                  </div>
                </div>
              </div>
            </template>
          </highlight-square>
          <highlight-square
            class="locusDetails padding-10"
            v-show="locusDetailsShow"
          >
            <template v-slot:child>
              <div class="title">
                <div>人员轨迹</div>
                <i class="el-icon-close" @click="locusDetailsShow = false"></i>
              </div>
              <div style="color: white">人员信息</div>
              <div class="carOwner">
                <img :src="locusDetails.personPhoto" />
                <div>
                  <span>姓名: {{ locusDetails.name }}</span>
                  <span>手机: {{ locusDetails.phone }}</span>
                   <span v-if="locusDetails.personType">名单组: {{filterName(locusDetails.personType)}}</span>
                </div>
              </div>
              <div style="color: white; margin: 10px 0">行走轨迹</div>
              <div class="carLocusTime">
                <el-collapse v-model="activeName" accordion>
                  <el-collapse-item
                    v-for="(li, index) in locusDetails.personTracks"
                    :key="index"
                    :title="li.reportTime"
                    :name="li.reportTime"
                    @click.native="lookImgDate(index,li)"
                  >
                    <div class="photo" @click.stop="pseudFun">
                      <div class="imgBox">
                        <div v-for="(img,index) in li.imgList" :key="index">
                          <img :src="img" />
                        </div>
                      </div>
                      <div class="buttonBox">
                        <el-button type="primary" @click.stop="checkBigImg(li.imgList)">查看全景</el-button>
                        <el-button type="primary" @click.stop="checkVideo(li.videoPath)">查看录像</el-button>
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
import {mapLocation} from "@/utils/map/positionLocation.js";
// import { getCarLocus } from "@/api/carManage/carLocus.js";
import {getPeopleLocus, getMemberType, getPhoto} from '@/api/peopleManage'
import { getBigPhoto, getSmallPhoto } from "@/api/imageMange/snapPhotoWall";
import { getCarType, getCarBrand } from "@/api/carManage/listManage.js";
import { playRecordVideo } from '@/api/videoMange/recordVideo.js'
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import Moment from "moment";
import {getAllDevice} from '@/api/resource.js'
import upLoadPhoto from "@/components/upLoadPhoto/upLoadPhoto.vue";
import { QueryData } from "@/api/configure/argumentsConfigure.js";
var GisMapObj = null,
  viewer = null,
  that = null;
export default {
  components: {
    upLoadPhoto,
    gisMap
  },
  data() {
    return {
      putJpeg:"",
      photoText:false,
      maxs: 15,
      id: "map-container",
      permission: {
        // getCarLocus: "carManage::carControl::getCarLocus",
        downloadThumbnail: "videoMange::snapPhotoWall:downloadThumbnail",
        check: 'peoplelocus::check',
        checkType: 'people::check',
        search: "resource::deviceManage:search",
        device: "resource::deviceManage:allSearch",
        searchConfigure: "configure::argumentsConfigure:search",
      },
      photoShow: false,
      videoShow: false,
      contentShow: true,
      carContent: {}, // 从车辆列表跳过来的信息
      peopleLocusList: [], // 搜索出来的列表
      locusDetails:{}, // 点击其中某一个列表的信息
      locusDetailsShow: false,
      formSearch: {
        value1:4,
        personnelName: "",
        personnelPhone: '',
        startTime: '',
        endTime: '',
      },
      activeName: "1",
      formSearchrules: {
        value1: [
          { required: true, message: "请选择阈值", trigger: "blur" },
        ],
        // personnelName: [
        //   { required: true, message: "请输入姓名", trigger: "blur" },
        // ],
        // personnelPhone: [
        //   { required: true, message: "请输入手机号", trigger: "blur" },
        // ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
      },
      carType: [],
      carBrand: [],
      typeList: [],
      deviceList: [],
      typeQuery: {
        pageNum: 1,
        pageSize: 10,
        dictTypeCode: 'person_list_type'
      },
      photoSrc: [],
      videoSrc: '',
      locationObj: {
        lat: 34.25759,
        lng: 108.76754,
      },
      EntityManage: {},
      markers: [],
      cameraImg: require('../../../../assets/images/map/camera.png'),
      changeImg: require('../../../../assets/images/map/camera-erry.png'),
      parameter: {
        pageNum: 1,
        pageSize: 1000,
        deviceName: '',
        deviceId: '',
        type: 'MOUNTED',
        deviceIds:[]
      },
      defaultMapOption: {
        center: [],
        zoom: 18,       // 默认：比例尺显示100m
        resizeEnable: true, //是否监控地图容器尺寸变化
        rotateEnable: true,
        mapStyle: 'amap://styles/blue'
      },
    };
  },
  computed: {
      startDatePicker(){
        const self = this;
        return {
          disabledDate(time) {
            if (self.formSearch.endTime) {
              return  new Date(self.formSearch.endTime).getTime() <= time.getTime() || time.getTime() <= new Date(self.formSearch.endTime).getTime() - 1000 * 3600 * 24 * 7 ;
            }
            return time.getTime() >= Date.now()
          }
        }
      },
      endDatePicker(){
        const self = this;
        return {
          disabledDate(time) {
            if (self.formSearch.startTime) {
              return new Date(self.formSearch.startTime).getTime() > time.getTime() || time.getTime() > Date.now() || time.getTime() > new Date(self.formSearch.startTime).getTime() + 1000 * 3600 * 24 * 7;
            }
            return time.getTime() >= Date.now()//包含当前
          }
        }
      },
  },
  created() {
    // 名单组
    this.getMemberTypeList()
  },
  mounted() {
    console.log("this.locationObj.lat=" + this.locationObj.lat);
    console.log("this.locationObj.lng=" + this.locationObj.lng);
    this.$nextTick(() => {
      this.intoMap();
    });
    if (this.$router.history.current.query.name) {
      this.carContent = this.$router.history.current.query;
      this.formSearch.personnelName = this.carContent.name
      this.formSearch.personnelPhone = this.carContent.phoneNo
    }
  },
  methods: {
   // 初始地图
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
//                    let isTrue = that.addForm.TableData.some(
//                      (x) => x.deviceId === entity.id.id
//                    );
//                    if (!isTrue) {
//                      var objnul = that.deviceList.filter(
//                        (x) => x.deviceId == entity.id.id
//                      )[0];
//                      that.EntityManage.removeById(objnul.deviceId);
//                      that.EntityManage.removeById(
//                        "point_label" + objnul.deviceId
//                      );
//                      that.drawMarker(false, objnul);
//                      that.addForm.TableData.push(objnul);
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

//      this.map = new AMap.Map(this.id, this.defaultMapOption);

    },
    // 获取设备
    getDeviceList(){
      let url = getStringByKey(this.permission.device, "url");
      let method = getStringByKey(this.permission.device, "method");
      let searchData = {
        url,
        method,
      };
      getAllDevice(searchData).then((res)=>{
        if(res.meta.status === 200){
          this.deviceList = res.data
          this.drawMarker(true, null);
        } else {
          this.$message.error(res.meta.message)
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
      console.log("人员轨迹 设备数量 ==>" + templist.length);
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
    // 上传图片的file
    photoUrl(url) {
      console.log('url ', url)
    },
    beginDate(){
      const self = this;
      return {
        disabledDate(time) {
          if (self.formSearch.endTime) {
            return  new Date(self.formSearch.endTime).getTime() < time.getTime() || time.getTime() < new Date(self.formSearch.endTime).getTime() - 1000 * 3600 * 24 * 7  ;
          }
          return time.getTime() >= Date.now()
        }
      }
    },
    filterName(type) {
      if(!type) return ''
      let str;
      this.typeList.map(x => {
        if (x.code === type) {
          str = x.name
        }
      })
      return str
    },
    // 获取人员类型接口
    getMemberTypeList() {
      getMemberType(getObjByKey(this.permission.checkType), this.typeQuery).then(res => {
        if (res.meta.status === 200) {
          this.typeList = res.data.data
          console.log('this.typeList --', this.typeList)
        } else {
          this.typeList = []
        }
      })
    },
    // 人员轨迹信息
    peopleLocusContent() {
      getPeopleLocus(getObjByKey(this.permission.check), this.formSearch).then((res) => {
        if (res.meta.status == 200) {
          this.peopleLocusList = res.data
          this.peopleLocusList.map((item) => {
            if(item.personPhoto){
              getPhoto(getObjByKey(this.permission.downloadThumbnail), {filePath: item.personPhoto}).then((res) => {
                if(res.meta.status === 200) {
                  item.personPhoto =  `data:img/jpg;base64,${res.data}`
                } else{
                  this.$message.error(res.meta.message)
                }
              })
            }
          });
      }
    })
  },
    // 搜索
    onSearch() {
      this.$refs.formSearch.validate((valid) => {
        if (valid) {
          this.peopleLocusContent();
          this.locusDetailsShow = false
          this.photoShow = false
          this.videoShow = false
        } else {
          return false;
        }
      });
    },
    // 查询人员轨迹
    lookCarContent(item) {
      this.locusDetailsShow = true
      this.locusDetails = item
      this.locusDetails.personTracks = this.locusDetails.personTracks.map(item => {
        item.imgBox = item.imagePath.split(',')
        return item
      })
    },
    //查看人员轨迹图片
    lookImgDate(index,li) {
      let imgList = []
      this.locusDetails.personTracks[index].imgBox.map((v, vIndex) => {
        return new Promise((resolve, reject) => {
          if (v.indexOf('data:img/jpg;base64') === -1) {
            this.setPhoto(v).then(res => {
              let img = `data:img/jpg;base64,${res.data}`
              imgList.push(img)
              this.$set(this.locusDetails.personTracks[index], 'imgList', imgList)
            })
          }
        })
      })
    },

    async setPhoto(path){
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
    // 重置
    onReset() {
       this.$refs.formSearch.resetFields()
       this.peopleLocusContent()
    },

    // 切换轨迹信息
    handleClick() {
      this.contentShow = !this.contentShow
    },
    checkBigImg(item){
      this.photoSrc = item
      this.photoShow = true
    },
    checkVideo(path){
      this.videoShow = true
      this.videoSrc = playRecordVideo(path)
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
    // height: 100%;
    // position: relative;
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
      min-width: 400px;
      height: 85%;
      z-index: 100;
      padding: 10px;
      background-color: rgba(0, 15, 52, 0.8);

      .carOwnerBox {
        width: 100%;
        height: 188px;
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
        justify-content: space-between;
        margin-left: 10px;
        flex-direction: column;
        color: white;
      }
    }
    .locusDetails {
      position: absolute;
      top: 70px;
      left: 500px;
      // width: 23%;
      // min-width: 400px;
      // height: 65%;
      width: 20%;
      height: fit-content;
      bottom: 50px;
      z-index: 100;
      padding: 10px;
      background-color: rgba(0, 15, 52, 0.8);
      .title {
        color: #206aff;
        display: flex;
        justify-content: space-between;
        i {
          margin: 10px;
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
      background-color: rgba(0, 15, 52, 0.8);
      img{
        width: 100%;
        height: 82%;
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
    }
    .bigVideo{
      top: 450px;
      height: 280px;
    }
  }
}
</style>
<style lang="less" scoed>
.carLocusTime {
  .el-collapse, .el-collapse-item__header, .el-collapse-item__wrap {
    border-color: rgba(8,229,242,.47) !important;
  }
  .el-collapse-item__header, .el-collapse-item__wrap {
    color: #fff !important;
    background-color: transparent !important;
  }
}
.carContent{
  .el-upload--picture-card {
  width: 100px;
  height: 100px;
  }
  .el-upload__tip{
    display: none;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width: 100px;
    height: 100px;
    margin: 0 -4px -4px 0;
  }
  .el-icon-plus{
      position: absolute;
      top: 37px;
      left: 36px;
  }
}
</style>
<style>
.amap-marker-label{
  background-color: transparent !important;
  border: none !important;
}
</style>
