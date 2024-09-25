<!--
 * @LastEditors: renjianwu jwrenx@isstech.com
 * 车辆道闸
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
        <OrgizeTree
          :districtList="dominList"
          :isCheck="isCheck"
          :dominShow="dominShow"
          :permissionData="permission"
          @handleNodeDblclick="handleNodeDblclick"
          @DragEnd="DragEnd"
          :draggable="draggable"
          :nodeType="nodeType"
          @treeId="treeId"
          @getTableData="getTableData"
        />
    </el-col>
    <el-col :xl="20" :lg="18" :sm="17" :xs="24">
    <div class="video-web-right-box-bottom">
      <!-- <div class="leftcorner">
        <img src="@/assets/images/arrow.png" alt="" />
        <span>东南门出入口</span>
      </div> -->

      <div class="table-padding">
        <div class="photoBox">
          <div
            class="groups"
            v-for="(item, index) in carInfos"
            :key="index">
            <div class="imgTitle">
              <h4>实时车辆信息</h4>
              <div class="left">
                <div class="gifs">
                  <img v-if="item.infos" :src="item.infos.imagePath" />
                  <img src="#" v-else alt="暂无车辆通过" />
                </div>
                <div class="infos">
                  <span
                    >车牌号：{{
                      item.infos ? item.infos.carCode : "暂无数据"
                    }}</span
                  >
                  <span
                    >车场名称：{{
                      item.infos ? item.infos.parkId : "暂无数据"
                    }}</span
                  >
                  <span
                    >车道名称：{{
                      item.infos ? item.infos.channelName : "暂无数据"
                    }}</span
                  >
                  <span
                    >车牌类型：{{
                      item.infos ? item.infos.carCode : "暂无数据"
                    }}</span
                  >
                  <span
                    >车辆类型：{{
                      item.infos ? item.infos.carCode : "暂无数据"
                    }}</span
                  >
                  <span
                    >入场时间：{{
                      item.infos ? item.infos.inTime : "暂无数据"
                    }}</span
                  >
                  <span
                    >出场时间：{{
                      item.infos ? item.infos.carCode : "暂无数据"
                    }}</span
                  >
                  <span>识别类型：自动识别</span>
                </div>
              </div>
            </div>
            <div class="infomation">
              <h4 style="cursor: pointer;" @click="toDeviceDraw(item)">{{ item.channelName }}</h4>
              <div class="rightInfo">
                <img
                  class=""
                  :src="
                    item.inOrOut == '0'
                      ? require(`@/assets/images/smartBuild/carpositive.png`)
                      : require(`@/assets/images/smartBuild/carback.png`)
                  "
                />
                <p>{{ item.inOrOut == "0" ? "入口检测" : "出口检测" }}</p>
                <div class="buttonGroups">
                  <el-button
                    type="primary"
                    @click="controldevice(item)"
                    >遥控开</el-button
                  >
                  <el-button
                    plain
                    @click="passrecord(item)"
                    >通行记录</el-button
                  >
                  <el-button plain v-if="item.monitorVos.length" @click="oncamera(item.monitorVos)"
                    >实时预览</el-button
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="content-bottom" v-if="tableData.length>0 && tableData">
            <pagination
              @pagination="handleCurrentChange"
              :page.sync="form.pageNum"
              :pageSizes="[10, 20, 30, 40]"
              :limit.sync="form.pageSize"
              :total="total"
            />
          </div> -->
        </div>
      </div>
    </div>
    </el-col>
    </el-row>
    <div v-show="crameShow" class="crameShow">
    </div>
    <div v-show="crameShow" class="crameShowMask">
        <div class="close">
            <svg-icon icon-class="icon-guanbi" style="height: 30px;width: 16px;"  @click="onclose"/>
            <div class="icon-name"></div>
        </div>
        <div class="vedioShow">
          <div id="vedioShow"></div>
        </div>
    </div>
    <el-dialog title="通行记录" :visible.sync="dialogVisible" width="800px">
      <el-table
        ref="multipleTable"
        :data="carTableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column
          prop="carCode"
          label="车牌号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="inOrOut" label="进出场标识">
          <template slot-scope="scope">
            {{Number(scope.row.inOrOut) ? '出场' : '进场'}}
          </template>
        </el-table-column>
        <el-table-column prop="parkId" label="车场名称"></el-table-column>
        <el-table-column prop="passTime" label="过场时间"></el-table-column>
        <el-table-column prop="channelName" label="通道名称"></el-table-column>
        <el-table-column prop="imagePath" label="车辆图片">
          <template slot-scope="scope">
            <a :href="scope.row.imagePath" target="_blank">
              <img :src="scope.row.imagePath"  style="width:60px;height:60px" alt="" />
            </a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="carTableData && carTableData.length > 0"
        @pagination="passrecord"
        :page.sync="formSearch.pageNum"
        :pageSizes="[10, 20, 30, 40]"
        :limit.sync="formSearch.pageSize"
        :total="total"
      />
      <div slot="footer" style="text-align: center">
        <el-button plain @click="cancel">关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import HighlightSquare from "@/components/HighlightSquare";
import sysTree from "@/components/sysTree";
import pagination from "@/components/comPagination";
import OrgizeTree from "@/components/orgnizeTree";
import {
  treeData,
  getDeviceInfoById,
  getIvsPlayer,
  getDeviceCriteria
} from "@/api/system/organization";
import comCard from "@/components/comCard";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import $smartBuild from "@/api/smartBuild";

export default {
  name:'CardControl',
  components: { sysTree, HighlightSquare, pagination, OrgizeTree, comCard },
  data() {
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        age: "",
        switch: true
      },
      permission: {
        deviceTree: "monitor::splitscreen::deviceTree",
        deviceCriteria: "monitor::splitscreen::deviceCriteria",
        treeCheck: "tree::check",
        collectDevice: "collectTag::device",
        collectDelete: "collectTag::delete",
        collectCheck: "collecttag::check",
      },
      dominList: [],
      draggable: true,
      districtList: [],
      tagNode: {},
      isCheck: "",
      nodeType: "barrierGate",
      isShow: true,
      dominShow: true,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      total: 0,
      form: {
        barrierGateName: "",
        pageNum: 1,
        pageSize: 99
      },
      formSearch: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      selectedIds: [],
      carInfos: [],
      carTableData: [],
      dialogVisible: false,
      crameShow:false,
      rtspUrl:'',
      widowWidth: window.screen.width,
      widowHeight: window.screen.width,
      vedioTop:'',
      vedioLeft:'',
      vedioWidth:'',
      vedioHeight:'',
      deviceZoom:''
    };
  },
  watch: {
      widowWidth (val) {
        let that = this;
        console.log('实时屏幕宽度', val, that.widowWidth)
        that.$nextTick(()=>{
            that.windowWidth = val
        })
        
        },
        widowHeight (val) {
        let that = this;
        console.log('实时屏幕高度', val, that.widowHeight)
        that.$nextTick(()=>{
            that.windowWidth = val
        })
        },
        vedioTop (val) {
        let that = this;
        console.log('播放器X', val, that.vedioTop)
        that.$nextTick(()=>{
            that.vedioTop = val
        })
        },
        vedioLeft (val) {
        let that = this;
        console.log('播放器Y', val, that.vedioLeft)
        that.$nextTick(()=>{
            that.vedioLeft = val
        })
        },
        vedioWidth (val) {
        let that = this;
        console.log('播放器高度', val, that.vedioWidth)
        that.$nextTick(()=>{
            that.vedioWidth = val
        })
        },
        vedioHeight (val) {
        let that = this;
        console.log('播放器高度', val, that.vedioHeight)
        that.$nextTick(()=>{
            that.vedioHeight = val
        })
        },
        deviceZoom(val){
        let that = this;
        console.log('放大率', val, that.deviceZoom)
        that.$nextTick(()=>{
            that.deviceZoom = val
            
        })
        }
    },
  mounted() {
    // this.getCarData();
    let _this = this;
    _this.deviceZoom = window.devicePixelRatio
    
    window.onresize = ()=>{
      window.fullHeight = window.screen.height;
      window.fullWidth = window.screen.width;
      _this.widowHeight = window.fullHeight;
      _this.widowWidth = window.fullWidth;
    }
  },
  methods: {
      toDeviceDraw(item){
        item.deviceId = item.id
        this.$router.push({name:"deviceDraw",query:item})
      },
    // 播放视频
      oncamera(item){
        console.log(item)
        let _this = this
        _this.crameShow=true
        var box=document.getElementById('vedioShow'); 
        _this.vedioTop = box.getBoundingClientRect().top + 110;
        _this.vedioLeft = box.getBoundingClientRect().left + 60;
        _this.vedioWidth = box.getBoundingClientRect().width - 50;
        _this.vedioHeight = box.getBoundingClientRect().height - 60;
        let str0 = {"cmd":"create_control","html_x": window.screenLeft,"html_y": window.screenTop,"html_w":_this.widowWidth,"html_h":_this.widowHeight,"e_type":"Chrome","title":document.title,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
        _this.$store.state.socket.Csock.send(JSON.stringify(str0))
        let str2 = {"cmd":"set_pos","x": window.screen.width / 3.5,"y": window.screen.height / 3.5,"w": 750,"h": 450,"id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
        _this.$store.state.socket.Csock.send(JSON.stringify(str2))
        let str1 = {"cmd":"set_layout","id":"001","layout":1,"time":"2020-08-17 00:00:00.000","cmd_id":"001_1"}
        _this.$store.state.socket.Csock.send(JSON.stringify(str1))
        let str = {"cmd":"show","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}
        _this.$store.state.socket.Csock.send(JSON.stringify(str))
        let data = {
            "cameraCode": item[0].code,
            "mediaURLParam": {
                "broadCastType": 0,
                "packProtocolType": 1,
                "protocolType": 2,
                "serviceType": 1,
                "streamType": 2,
                "transMode": 0
            }
        }
        getIvsPlayer('/sm/ivs/player/play','POST',data).then(res => {
            if(res.code == 200){
                _this.rtspUrl = res.data.rtspURL
                // this.referenceIdArr.
                if(res.data.description == "成功"){
                    let str3 = {"cmd":"play_real","id":"001","time":"2020-08-17 00:00:00.000","camera_id": _this.rtspUrl,"camera_name":"摄像头","wnd_index":0,"cmd_id":"001_1 "}
                    _this.$store.state.socket.Csock.send(JSON.stringify(str3))
                }else{
                    this.$message.info(res.data.description)
                }
            }
        })
        // .catch(err => {
        //     this.$message.error(err)
        // })
      },
      // 关闭视频播放
      onclose(){
          this.crameShow=false
          let str1 = `{"cmd":"destroy","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
          this.$store.state.socket.Csock.send(str1)
      },
    treeId(data) {
      this.form.nodeId = data;
      this.getCarData();
    },
    cancel() {
      this.dialogVisible = false;
    },
    passrecord(item) {
      this.dialogVisible = true;
      let data = {
        channelId: item.id,
        inOrOut: item.inOrOut,
        pageNum: this.formSearch.pageNum,
        pageSize: this.formSearch.pageSize
      };
      $smartBuild.getCarbarrierGatePass(data).then(res => {
        if (res.code === 200) {
          this.carTableData = res.data.data;
          this.total = res.data.total;
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    controldevice(data) {
      let datas = {
        channelId: data.channelId,
        controlType: "3"
      };
      $smartBuild.getDeviceControls(datas).then(res => {
        if (res.code === 200) {
          this.getCarData();
          this.$message.success("抬杆成功");
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    getCarData() {
      $smartBuild.getCarbarrierGate(this.form).then(res => {
        if (res.code === 200) {
          this.carInfos = res.data.data;
          this.getCarDataPass();
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    getCarDataPass() {
      let data = this.carInfos;
      data.forEach(item => {
        let data = {
          channelId: item.id,
          inOrOut: item.inOrOut,
          pageNum: 1,
          pageSize: 99
        };
        $smartBuild.getCarbarrierGatePass(data).then(res => {
          if (res.code === 200) {
            this.$set(item, "infos", res.data.data[0]);
          } else {
            this.$message.error(res.meta.message);
          }
        });
      });
    },
    initPageIntell() {},
    // card事件 routerClick
    routerClick(item) {
      console.log(item);
    },
    // 获取设备状态
    getDeviceStatus(data) {
      let obj = {
        url: '/pm/ibms/criteria',
        method: 'GET'
      }
      $smartBuild.getDeviceStatus(obj, data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    //  获取设备信息
    getDeviceData(data) {
      if (!data.children) {
        if (!data.code) {
          if (this.isType === "click") {
            let tempObj = [
              {
                deviceId: data.id,
                deviceName: data.name
              }
            ];
            this.handleleftClick(tempObj);
          } else if (this.isType === "dbClick") {
            const player = {
              deviceId: data.deviceId,
              deviceName: data.name
            };
            this.goVideoControl(player);
          }
          return;
        }
        getDeviceInfoById(data.code)
          .then(res => {
            if (res.code === 200) {
              if (this.isType === "click") {
                this.handleleftClick(res.data);
              } else if (this.isType === "dbClick") {
                if (res.data[0]) {
                  const player = {
                    deviceId: res.data[0].deviceId,
                    // channelId: res.data[0].channelId,
                    deviceName: res.data[0].name,
                    protocol: res.data[0].protocol
                  };
                  this.goVideoControl(player);
                }
              } else if (this.isType === "drag") {
                this.players[this.dragIndex].deviceId = res.data[0].deviceId;
                this.players[this.dragIndex].deviceName = res.data[0].name;
                this.players[this.dragIndex].protocol = res.data[0].protocol;
              } else {
                this.$message.error("获取设备信息失败");
              }
            }
          })
          .catch(err => {
            console.log(err, "err");
          });
      }
    },
    // 左侧设备树双击
    handleNodeDblclick(data) {
      this.isType = "dbClick";
      this.getDeviceData(data);
    },
    // 左侧设备树拖拽
    DragEnd(node, prenode, pis, evt) {
      this.clientX = evt.clientX;
      this.clientY = evt.clientY;
      this.isType = "drag";
      for (let i = 0; i < this.distance.length; i++) {
        if (
          this.clientX > this.distance[i].toLeft &&
          this.clientX < this.distance[i].toRight &&
          (this.clientY + this.scrollTop > this.distance[i].toTop &&
            this.clientY + this.scrollTop < this.distance[i].toBottom)
        ) {
          // 调用接口获取视频流
          this.dragIndex = i;
          this.getDeviceData(node.data);
        }
      }
    },
    //  点击左侧通道树
    handleleftClick(data) {
      const res = data[0];
      if (res) {
        //let obj = getObjByKey(this.permission.deviceCriteria);
        let params = {
          mounted: true,
          blurryType: "DEVICE_TREE",
          nodeId: data.deviceId,
          type: this.nodeType
        };
        getDeviceCriteria('/pm/device/criteria', 'get', params).then(rs => {
          if (rs.code === 200) {
            console.log("rs====", rs);
            //            this.tableData=rs.data.data
            this.getIvsPlayer(rs.data.data[0].code);
          } else {
            this.$message({
              message: res.meta.message,
              type: "error"
            });
          }
        });
        //        const player = this.players[this.playerIdx]
        //        player.deviceId = res.deviceId
        //        player.protocol = res.protocol
        //        if(res.name){
        //          player.deviceName = res.name
        //        }else{
        //          player.deviceName = res.deviceName
        //        }
        //        this.setPlayerIdx(this.playerIdx + 1)
      }
    },
    // 通道列表点击选择通道
    handleClickChannel(data, index) {
      const player = this.players[index];
      player.deviceId = data.deviceId;
      player.deviceName = data.name;
      player.protocol = data.protocol;
      this.workspaceDeviceCounts++;
    },
    // 获取树组件数据
    async getTreeData() {
      if (this.domainCode != "") {
        let url = this.$store.getters.btnpremissAll[this.permission.deviceTree]
          .url;
        let method = this.$store.getters.btnpremissAll[
          this.permission.deviceTree
        ].method;
        getDeviceTree(url, method, this.domainCode)
          .then(res => {
            this.dominList = res.data;
          })
          .catch(err => {
            this.$message.error(err);
          });
      } else {
        let url = this.$store.getters.btnpremissAll[
          this.permissionData.treeCheck
        ].url;
        let method = this.$store.getters.btnpremissAll[
          this.permissionData.treeCheck
        ].method;
        const res = await treeData(url, method, []);
        if (res.code === 200) {
          this.districtList = res.data;
          this.dominList = res.data;
        } else {
          this.$message.error("获取区域数据失败");
        }
      }
    },
    getTableData(data, activeName) {
      this.tagNode = data;
      this.isType = "click";
      // if ("type" in data === false) {
      //   let obj = { ...data, type: "IPC", code: data.deviceId };
      //   this.getDeviceData(obj);
      // }
      this.form.nodeId = data.id;
      this.getCarData()
    },
    handleCurrentChange() {},
    // 开启
    openDialog() {},
    // 关闭
    closeDia() {},
    // 搜索
    search() {
      this.getDeviceStatus(this.form);
    },
    // 重置
    reset() {
      this.$refs["serForm"].resetFields();
    },
    // 刷新
    refreshs() {}
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-switch__label {
  position: absolute;
  display: none;
  font-size: 14px !important;
  color: #fff !important;
}

::v-deep .el-switch__label * {
  font-size: 14px !important;
}

/*打开时文字位置设置*/
::v-deep .el-switch__label--right {
  z-index: 1;
  left: 0px; // 这里是重点
  top: 0.5px;
}

/*关闭时文字位置设置*/
::v-deep .el-switch__label--left {
  z-index: 1;
  right: 0px; // 这里是重点
  top: 0.5px;
}

/*显示文字*/
::v-deep .el-switch__label.is-active {
  display: block;
}

::v-deep .el-switch .el-switch__core {
  border-color: #00e984 !important;
  background-color: #00e984 !important;
}

::v-deep .el-switch.is-checked .el-switch__core {
  border-color: #206aff !important;
  background-color: #206aff !important;
}

::v-deep .el-switch__core {
  width: 60px !important;
  height: 22px;
  border: 2px solid #dcdfe6;
  border-radius: 13px;
}

// ::v-deep .el-switch {
//   width: 50%;
// }
::v-deep .el-form-item--small .el-form-item__label {
  line-height: 30px !important;
}

::v-deep .el-form-item--small .el-form-item__content {
  line-height: 30px !important;
}

.margin0 {
  margin-bottom: 5px;
  text-align: center;
}
.video-web-left-tree-outer{
  padding: 10px 10px;
  height: 750px;
}
.bgCond {
  display: inline-block;
  width: 70px;
  height: 27px;
  border-radius: 5px;
  background: #313448;
  cursor: pointer;
}

.bgSucc {
  background: #00e984;
  color: #000;
}

.el-form-item .app-container {
  background-color: transparent;
}

.top-card {
  width: 100%;
  display: flex;
  align-items: center;
  margin-left: 0px !important;
  justify-content: space-between;
  .total {
    border-radius: 5px;
    background-color: #202230;
    margin-right: 6%;
    height: 100px;
  }
  .off-line {
    border-radius: 5px;
    background-color: #202230;
    margin-right: 6%;
    height: 100px;
  }
  .normal {
    border-radius: 5px;
    background-color: #202230;
    margin-right: 6%;
    height: 100px;
  }
  .exception {
    border-radius: 5px;
    background-color: #202230;
    margin-right: 0%;
    height: 100px;
  }
}

// .table-padding {
//   padding: 0 20px 20px 20px;
// }

.photoBox {
  width: 100%;
  // height: calc(100vh - 155px);
  display: flex;
  overflow: auto;
  flex-direction: column;
  .photpItem {
    text-align: center;
    width: 12%;
    height: 230px;
    background-color: #313448;
    border-radius: 10px;
    padding: 10px;
    color: white;
    margin-right: 4.6%;
    margin-bottom: 20px;
    position: relative;
    img {
      border-radius: 3px;
    }
    .content {
      padding: 10px 5px;
      font-size: 14px;
      position: relative;
      .check {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
      ::v-deep .el-checkbox__label {
        display: none;
      }
    }
    .clickButton {
      width: 95%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #5e70ec;
      button {
        font-size: 20px;
      }
    }
  }
}

.content-Text {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  float: left;
}

.rightSpan {
  float: right;
  margin-top: 16px;
  width: 40%;
  height: 75px;
  color: rgba(0, 0, 0, 0.16);
  opacity: 0.8;
}

.groups {
  display: flex;
  justify-content: space-around;
  padding: 10px 5px 10px 15px;
  width: 100%;
  //background-color: #272937;
  border-radius: 8px;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
  .imgTitle {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    border-right: solid 1px #363845;
    .left {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .infos {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        width: 45%;
        margin-left: 30px;
      }
    }
    .gifs {
      // display:flex;
      width: 76%;
      height: auto;
      img {
        width: 100%;
        margin: 0 auto;
      }
    }
  }
  .infomation {
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .rightInfo {
      p {
        display: block;
        text-align: center;
        color: #afb9d0;
      }
      img {
        display: block;
        margin: 0 auto;
      }
      .buttonGroups {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }
}

.forms {
  padding: 20px 20px 0 20px;
}

.video-web-right-box-bottom {
  height: 100%;
  margin-top: 0;
}

.leftcorner {
  margin: 20px 0px -10px 20px;
}
 .vedioShow{
    margin:0 auto;
    width: 750px;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    
}
#vedioShow{
    width: 750px;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.crameShow{
    position:absolute;
    left:0;
    top:0;
    z-index:99999;
    left: 30%;
    top: 30%;
}
.crameShowMask{
    position:fixed;
    left:0;
    top:0;
    background:rgba(0,0,0,.9);
    width:100vw;
    height:100vh;
    z-index:9999;
}
.close{
    position: fixed;
    right: 31px;
    top: 16px;
    cursor: pointer;
}
</style>
