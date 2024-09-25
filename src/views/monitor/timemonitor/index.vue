<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 实时监控视频左半部分 -->
      <el-col>
        <div class="videoArea" id="vedioShow">
          <div class="title">
            <el-button
              class="float-left"
              type="text"
              @click="goBack()"
              ><img src="@/assets/images/back.png" alt="返回" class="backImage" />
            </el-button>
            <span class="video-web-content-title">{{ player.deviceName }}</span>
          </div>
          <div id="vedioShow" class="padding-sty">
              <div style="width: 85vw; height: 75vh">
                  <VideoPlayerGroup 
                      ref="videoPlayerGroup"
                  />
              </div>
            </div>
            <div class="monitor-area">
              <div class="monitor-menu" style="margin-top: 10px;">
                <div class="left">
                  <el-button
                    class="historyBtn"
                    plain
                    @click="historyVideo()"
                  >
                    <i class="el-icon-video-camera"></i> 历史回看
                  </el-button>
                  <el-button
                    class="historyBtn"
                    plain
                    @click="historyImage()"
                  >
                    <i class="el-icon-camera"></i> 历史图片
                  </el-button>
                </div>
                <div class="right">
                  <el-form :model="takeVideoForm" style="width:200px;">
                    <el-form-item label="录屏时间">
                      <div class="interval-timer" style="color:#fff;display: flex;
      align-items: center;
      justify-content: center">
                        <el-input-number
                          v-model="takeVideoForm.hour"
                          :max="4"
                          :min="0"
                        
                          :controls="false"
                        />:
                        <el-input-number
                          v-model="takeVideoForm.min"
                          :max="59"
                          :min="0"
                          :controls="false"
                        />:
                        <el-input-number
                          v-model="takeVideoForm.sec"
                          :max="59"
                          :min="0"
                        
                          :controls="false"
                        />
                      </div>
                    </el-form-item>
                  </el-form>
                  
                  <el-button
                    v-show="!isTabeVideoOn"
                    plain
                    @click="takeVideo()"
                    style="font-size:14px;"
                  >开始录像</el-button>
                  <el-button
                    plain
                    v-show="isTabeVideoOn"
                    @click="stopTakeVideo()"
                    >停止录像</el-button
                  >
                  <el-button
                    plain
                    @click="snapShotRest"
                    ><i class="el-icon-camera"></i> 服务器抓拍</el-button
                  >
                </div>
              </div>
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 放大需要用的框体的dom元素
const localStorage = window.localStorage;

import {
  getInformation, //查询设备信息
  getCarInformation,
} from "@/api/monitor/timemonitor";
import {
  postSnapPhoto // 平台抓拍
} from "@/api/videoMange/historyVideo";
import {
  startRecord,
  stopRecord
  // hasUuid
} from "@/api/videoMange/recordVideo";
import PlayVideo from "../../videoMange/recordVideo/playVideo";
import {
  getIvsPlayer,
} from "@/api/system/organization";

export default {
  // name: "Timemonitor",
  components: {
    PlayVideo
  },
  data() {
    return {
      mobileDevice: "", //设备信息字段
      player: {
        deviceId: "",
        deviceName: "",
        referenceId: "3414",
        deviceCamera: ""
      },
      startScan: false,
      dominShow: true,
      domainCode: "",
      players: [],
      takeVideoVisible: false,
      isTabeVideoOn: false,
      takeVideoForm: {
        hour: 0,
        min: 5,
        sec: 0,
        validTime: 90,
        uuid: ""
      },
      takeVideoUuid: "",
      playerLength: 1,
      deviceCamera: "",
    };
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.query.type === 1) {
          this.isBack = true;
        } else {
          this.isBack = false;
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    /* 抓拍、流切换、连拍、录像等视频正在播放时的操作的禁用限制
         无通道时禁用所有上述操作，选择通道后方可解除
      */
    isSsrcPlayerActionDisabled() {
      // return !this.player || !this.player.deviceId || !this.$refs.videoPlayer || !this.$refs.videoPlayer.ssrc
      return !this.player || !this.player.deviceId;
    },
    btnList() {
      return this.$store.getters.presetList;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== "/timemonitor") {
      localStorage.removeItem("deviceData");
      this.isBack = false;
      this.$store.commit("app/SET_CRUISE_STATUS", {
        showCruiseBtn: false,
        id: ""
      });
    }
    if (to.path === "/splitscreen") {
      localStorage.setItem(
        "timemonitorData",
        JSON.stringify({ len: this.playerLength, players: [...this.players] })
      );
    } else {
      localStorage.removeItem("timemonitorData");
    }
    next();
  },
  created() {
    // this.getConfigInfo();
  },
  updated() {
  },
  mounted() {
    this.dominShow = this.$route.query.dominShow;
    this.domainCode = this.$route.query.domainCode;
    this.player.deviceId = this.$route.query.player.deviceId;
    this.player.deviceName = this.$route.query.player.deviceName;
    this.player.referenceId = this.$route.query.player.referenceId;
    localStorage.setItem("deviceData", JSON.stringify(this.player));
    // if (this.$route.query.player.deviceId) {
    //   console.log("this.$route.query", this.$route.query);
      
    // } else if (localStorage.getItem("deviceData")) {
    //   let data = JSON.parse(localStorage.getItem("deviceData"));
    //   this.player.deviceId = data.deviceId;
    //   this.player.deviceName = data.deviceName;
    // }
    setTimeout(()=>{
      this.getIvsPlayer(this.$route.query.referenceId);
    },500)
  },
  beforeDestroy() {
    this.cruiseNum = 0;
    this.tracgitoryNum = 0;
    this.recordNum = 0;
   
  },
  destroyed() {
  },
  methods: {
    // 视频播放
    getIvsPlayer(code) {
      getCarInformation(code).then(res=>{
          if(res.code === 200){
            let cameraInfo = {
                id: res.data.code,
                label: res.data.name,
                isPTZControlVisible: res.data.cameraType == '球机' ? true : false,
            }
            this.$refs['videoPlayerGroup'].playRealVideo(cameraInfo)
          }
      })
    },
    // 录像方法
    takeVideo() {
      let interval = 0;
      if (this.takeVideoForm.hour) {
        interval += this.takeVideoForm.hour * 60 * 60;
      }
      if (this.takeVideoForm.min) {
        interval += this.takeVideoForm.min * 60;
      }
      if (this.takeVideoForm.sec) {
        interval += this.takeVideoForm.sec;
      }
      if (!this.takeVideoForm.validTime > 0) {
        this.$message.warning("录像有效期必须大于0");
        return;
      }
      if (interval < 300) {
        this.$message.warning("录像时长必须大于等于5分钟");
        return;
      }
      this.takeVideoVisible = true;
      let url = "/sm/ivs/record/platform/start";
      let method = "POST";
      let obj = {
        cameraCode: this.domainCode.split("#")[0],
        domainCode: this.domainCode.split("#")[1],
        deviceName: this.player.deviceName,
        recordTime: interval
      };
      startRecord(
        url,
        method,
        obj
      )
        .then(res => {
          setTimeout(() => {
            this.isTabeVideoOn = false;
          }, interval * 1000);
          this.takeVideoUuid = res.data.uuid;
          localStorage.setItem(
            "takeVideoUuid",
            JSON.stringify(this.takeVideoForm.uuid)
          );
          this.isTabeVideoOn = true;
          this.$message.success("已开始录制");
          
        })
        .catch(err => {
          this.$message.error("录制失败", err);
        });
    },
    // 停止录像方法
    stopTakeVideo() {
      let url = "/sm/ivs/record/platform/stop";
      let method = "get";
      stopRecord(url, method, {
        cameraCode: this.domainCode.split("#")[0],
        domainCode: this.domainCode.split("#")[1],
        uuid: this.takeVideoUuid
      })
        .then(res => {
          
            this.isTabeVideoOn = false;
            this.$message.success("已停止录制");
            localStorage.removeItem(
              "takeVideoUuid",
              JSON.stringify(this.takeVideoUuid)
            );
          
        })
        .catch(err => {
          this.$message.error("结束录制请求失败", err);
        });
    },
    // 平台抓拍
    snapShotRest() {
      postSnapPhoto('/sm/ivs/snapshot/platform', 'get', {
        cameraCode: this.domainCode.split("#")[0],
        domainCode: this.domainCode.split("#")[1]
      }).then(res => {
        if(res.code==200){
          this.$message.success("抓拍成功");
        }else{
          this.$message.error(res.msg);
        }
        
      });
    },
    historyVideo() {
      this.$router.push({
        name: "HistoryVideo",
        query: {
          player: this.player,
          type: 1
        }
      });
    },
    historyImage() {
      this.$router.push({
        name: "SnapPhotoWall",
        query: {
          player: this.player,
          type: 1
        }
      });
    },
    goBack() {
      this.$router.back();
    },
    // 查询设备及子设备的信息
    _getDevInformation() {
      let url = "/pm/device/camera";
      let method = "GET";
      let devData = {
        url: `${url}/${this.domainCode}`,
        method
      };
      getInformation(devData)
        .then(res => {
          if (res.code === 200) {
            this.mobileDevice = res.data.type;
            if (res.data.type !== "球机") {
              // this.$message.info("非球机无法操作");
            }
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/variables";
  ::v-deep .el-button{
    vertical-align: middle !important;
  }
.video-area {
  text-align: center;
}
$video-width: 1350px;

// }
.monitor-area {
  text-align: center;
  width: 100%;

  .monitor-menu {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      margin-left: -10px;
      .historyBtn {
        background-color: #206aff;
        color: #ffffff;
      }
    }
    .right {
      display: flex;
      margin-right: 10px;
      & > .el-button {
        margin-left: 10px;
        color: #ffffff;
        background-color: #206aff;
      }
    }
  }
}
.backImage {
  width: 25px;
  height: 11px;
  margin-left: 30px;
}
.rightBox {
  cursor: not-allowed;
  pointer-events: none;
  height: inherit;
  opacity: 0.2;
}
.videoArea{
  // height: calc(100vh - 130px) !important;
}
</style>
