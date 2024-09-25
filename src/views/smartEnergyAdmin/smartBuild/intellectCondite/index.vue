<!--
 * @LastEditors: HJQ
 * 暖风空调
-->
<template>
  <div class="app-container-bow">
    <div class="video-web-left-box">
      <!-- <highlight-square class="highlight-height-main padding-20">
          <template v-slot:child>
               <el-tree
                  ref="baseTree"
                  v-loading="loading"
                  :data="treeData"
                  node-key="id"
                  class="video-web-tree"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick"
                  >
          </el-tree>
          </template>
      </highlight-square> -->
      <HighlightSquare class="highlight-height-main padding-20">
        <template v-slot:child>
          <div class="video-web-left-tree-outer">
            <!--左侧树-->
            <!-- 多维树组件 -->
            <OrgizeTree
              :districtList="dominList"
              :isCheck="isCheck"
              :dominShow="dominShow"
              :permissionData="permission"
              @handleNodeDblclick="handleNodeDblclick"
              @DragEnd="DragEnd"
              :draggable="draggable"
              :nodeType="nodeType"
              @getTableData="getTableData"
              @treeId="treeId"
            />
          </div>
        </template>
      </HighlightSquare>
    </div>
    <div class="video-web-right-box-top">
      <comCard
        class="f"
        :spanList="spanList"
        @routerClick="routerClick($event)"
      ></comCard>
    </div>
    <div class="video-web-right-box-bottom">
      <!-- 搜索 -->
      <el-form
        :inline="true"
        ref="serForm"
        :model="form"
        class="demo-form-inline forms"
      >
        <el-form-item prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入空调机组名称"
            style="width: 200px"
            clearable
            @keyup.native.enter="search"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            @click="search()"
            type="primary"
          >搜索
          </el-button>
          <el-button
            icon="el-icon-refresh-left"
            @click="reset()"
            plain
          >重置
          </el-button>
        </el-form-item>
        <el-form-item style="float: right;margin-right:0px;">
          <el-button @click="batchStart()" type="primary"
          >一键启动
          </el-button>
          <el-button @click="batchClose()" plain
          >一键关闭
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="refreshs"
          ></el-button>
        </el-form-item>
      </el-form>
 
      <!-- 表格 -->
      <el-card class="box-card table-padding">
        <HighlightSquare>
          <template v-slot:child>
            <div class="photoBox" v-if="tableData && tableData.length">
              <div
                class="groups"
                v-for="(item, index) in tableData"
                :key="index"
              >
                <div class="imgTitle">
                  <h4>{{ item.deviceName }}</h4>
                  <div class="gifs">
                    <img
                      class=""
                      :src="require(`@/assets/images/smartBuild/nf.gif`)"
                      alt="item.type"
                    />
                  </div>
                </div>
                <div class="infomation">
                  <h4 style="text-align:center;">设备运行状态</h4>
                  <div
                    v-for="(items, index) in item.pointRunDataList"
                    :key="index"
                  >
                    <div v-if="items.pointName === '手自动'">
                      <span class="pointName">{{ items.pointName }}</span>
                      <el-switch
                        v-model="items.dataValue"
                        active-text="手动"
                        active-color="#13ce66"
                        inactive-text="自动"
                        inactive-color="#ff4949"
                        active-value="true"
                        inactive-value="false"
                      >
                      </el-switch>
                    </div>
                    <div v-else>
                      <span v-show="items.pointType == 'airConditioning_run'">
                        <span class="pointName">{{ items.pointName }}</span>
                        <span class="bgCond bgSucc">{{
                          items.dataValue == "true" ? "开机" : "关机"
                          }}</span>
                      </span>
                      <span v-show="items.pointType == 'airConditioning_fault'">
                        <span class="pointName">{{ items.pointName }}</span>
                        <span
                          class="bgCond"
                          :style="{
                            'background-color':
                              items.dataValue !== 'true' ? '#00e984' : '#ff403d'
                          }"
                        >{{
                          items.dataValue !== "true" ? "正常" : "故障"
                          }}</span
                        >
                      </span>
                      <span
                        v-show="
                          items.pointType == 'airConditioning_temperature'
                        "
                      >
                        <span class="pointName">{{ items.pointName }}</span>
                        <span class="bgCond bgSucc"
                        >{{ items.dataValue }}{{ "℃" }}</span
                        >
                      </span>
                    </div>
                  </div>
                  <span v-if="item.monitorVos && item.monitorVos.length">
                    <span class="pointName">附近摄像头</span>
                    <span class="bgCond" v-for="(child,index) in item.monitorVos" :key="index">
                      <img
                        class=""
                        :src="require(`@/assets/images/smartBuild/sxt.png`)"
                        @click="oncamera(child)"
                      /></span>
                  </span>
                  <div class="margin0" style="margin-left:20px;margin-top:10px">
                    <span
                      v-for="(items, index) in item.pointRunDataList"
                      :key="index"
                    >
                      <span v-if="items.pointType == 'airConditioning_contr'">
                        <el-button
                          type="primary"
                          @click="submitForm(item)"
                          :disabled="items.dataValue == 'true'"
                        >启动</el-button
                        >
                        <el-button
                          plain
                          @click="resetForm(item)"
                          :disabled="items.dataValue !== 'true'"
                        >关闭</el-button
                        >
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else style="text-align:center">
              <div
                class="el-table__empty-text"
                style="margin:0 auto;color:white;font-size:20px;"
              >
                暂无数据
              </div>
            </div>

            <!--分页 -->
            <div class="content-bottom" v-if="tableData.length && tableData">
              <pagination
                @pagination="handleCurrentChange"
                :page.sync="form.pageNum"
                :pageSizes="[2, 4, 6, 8]"
                :limit.sync="form.pageSize"
                :total="total"
              />
            </div>
            <!-- end -->
          </template>
        </HighlightSquare>
      </el-card>
    </div>
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
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import $smartBuild from "@/api/smartBuild";

  export default {
    components: {sysTree, HighlightSquare, pagination, OrgizeTree, comCard},
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
          collectDevice: 'collectTag::device',
          collectDelete: 'collectTag::delete',
          collectCheck: 'collecttag::check',
          searchDevice: "smartBuild::intellectCondite::searchDevice",
          statistics: "smartBuild::elevator::searchnum",
          deviceControl: "smartBuild::intellectCondite::deviceControl"
        },
        dominList: [],
        draggable: true,
        districtList: [],
        tagNode: {},
        isCheck: "",
        nodeType: "airConditioning",
        isShow: true,
        dominShow: true,
        treeData: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        total: 0,
        form: {
          name: "",
          type: "AIR_CONDITIONING",
          pageNum: 1,
          pageSize: 2
        },
        TypeArr: [{value: 0, label: "不限"}, {value: 1, label: "名称"}],
        tableData: [],
        selectedIds: [],
        spanList: [
          {
            type: "total",
            num: 0,
            name: "设备总数",
            path: require(`@/assets/images/smartBuild/kt1.png`)
          },
          {
            type: "off-line",
            num: 0,
            name: "设备开机",
            path: require(`@/assets/images/smartBuild/kt2.png`)
          },
          {
            type: "off-line",
            num: 0,
            name: "设备关机",
            path: require(`@/assets/images/smartBuild/kt3.png`)
          },
          {
            type: "exception",
            num: 0,
            name: "设备异常",
            path: require(`@/assets/images/smartBuild/kt4.png`)
          },
          // {
          //   type: "exception",
          //   num: 0,
          //   name: "离线设备",
          //   path: require(`@/assets/images/smartBuild/kt5.png`)
          // }
        ],
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
      // this.getDeviceStatus(this.form);
      this.getStatistics();
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
            "cameraCode": item.code,
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
            if(res.meta.status == 200){
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
        this.getDeviceStatus(this.form);
      },
      submitForm(data) {
        let tagid = "";
        data.pointRunDataList.forEach(item => {
          if (item.pointType == "airConditioning_contr") {
            tagid = item.tagId;
          }
        });
        let obj = getObjByKey(this.permission.deviceControl);

        let datas = [];
        datas.push({
          id: tagid,
          systemType: "AIRCONDITIONING",
          type: 0,
          value: true
        });
        $smartBuild.getDeviceControl(obj, datas).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("开启成功");
          } else {
            this.$message.error("开启失败");
          }
        });
      },
      resetForm(data) {
        let tagid = "";
        data.pointRunDataList.forEach(item => {
          if (item.pointType == "airConditioning_contr") {
            tagid = item.tagId;
          }
        });
        let obj = getObjByKey(this.permission.deviceControl);
        let datas = [];
        datas.push({
          id: tagid,
          systemType: "AIRCONDITIONING",
          type: 0,
          value: false
        });
        $smartBuild.getDeviceControl(obj, datas).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("关闭成功");
          } else {
            this.$message.error("关闭失败");
          }
        });
      },
      getStatistics() {
        let obj = getObjByKey(this.permission.statistics);
        let data = {
          type: "AIR_CONDITIONING"
        };
        $smartBuild.getStatistics(obj, data).then(res => {
          if (res.meta.status === 200) {
            this.spanList[0].num = res.data.deviceNum;
            this.spanList[1].num = res.data.deviceOpenNum;
            this.spanList[2].num = res.data.deviceCloseNum;
            this.spanList[3].num = res.data.deviceFaultNum;
            this.spanList[4].num = res.data.deviceOffLineNum;
          }
        });
      },
      /**
       * @name: 初始化函数--暖通空调
       * @Author: sscaij
       * @msg:
       * @param {*}
       * @return {*}
       */
      initPageIntell() {
      },
      // card事件 routerClick
      routerClick(item) {
        console.log(item);
      },
      // 获取设备状态
      getDeviceStatus(data) {
        let obj = getObjByKey(this.permission.searchDevice);
        $smartBuild.getDeviceStatus(obj, data).then(res => {
          if (res.meta.status === 200) {
            this.tableData = res.data.data;
            this.total = res.data.total;
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
              if (res.meta.status === 200) {
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
          let obj = getObjByKey(this.permission.deviceCriteria);
          let params = {
            mounted: true,
            blurryType: "DEVICE_TREE",
            nodeId: data.deviceId,
            type: this.nodeType
          };
          getDeviceCriteria(obj.url, obj.method, params).then(rs => {
            if (rs.meta.status === 200) {
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
          if (res.meta.status === 200) {
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
//        if ("type" in data === false) {
//          let obj = {...data, type: "IPC", code: data.deviceId};
//          this.getDeviceData(obj);
//        }
          this.form.nodeId = data.id;
        this.getDeviceStatus(this.form);
//        this.getDeviceData(data);
      },
      batchStart() {
        let data = {
          state: true,
          systemType: 'AIRCONDITIONING'
        };
        $smartBuild.getBatchControl(data).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("开启成功");
          } else {
            this.$message.error(res.meta.message);
          }
        });
      },
      batchClose() {
        let data = {
          state: false,
          systemType: 'AIRCONDITIONING'
        };
        $smartBuild.getBatchControl(data).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("关闭成功");
          } else {
            this.$message.error(res.meta.message);
          }
        });
      },
      // 开启
      openDialog() {
      },
      // 关闭
      closeDia() {
      },
      handleCurrentChange() {
        this.getDeviceStatus(this.form);
      },
      // 搜索
      search() {
        this.getDeviceStatus(this.form);
      },
      // 重置
      reset() {
        this.$refs["serForm"].resetFields();
        this.getDeviceStatus(this.form);
      },
      // 刷新
      refreshs() {
        window.location.reload();
      }
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

  .bgCond {
    display: inline-block;
    width: 70px;
    height: 27px;
    border-radius: 5px;
    background: #313448;
    // cursor: pointer;
    img {
      margin-top:4px;
      width: 20px;
      height: 20px;
    }
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

  .table-padding {
    padding: 0px 20px 0px 20px;
  }

  .photoBox {
    width: 100%;
    height: calc(100vh - 330px);
    display: flex;
    overflow: auto;
    justify-content: space-between;
    flex-wrap: wrap;
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
    h4 {
      margin-top: 10px;
    }
    display: flex;
    height: auto;
    padding: 10px 30px 10px 10px;
    width: 100%;
    background-color: #272937;
    border-radius: 8px;
    flex-wrap: wrap;
    margin-bottom: 15px;
    &:nth-last-child(1){
      margin-bottom:0
    }
    .imgTitle {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80%;
      .gifs {
        display: flex;
        width: 100%;
        height: auto;
        img {
          width: 80%;
          margin: 0 auto;
        }
      }
    }
    .infomation {
      width: 20%;
      display: flex;
      flex-direction: column;
      text-align: right;
    }
  }

  .forms {
    padding: 20px 20px 0 20px;
  }

  .pointName {
    float: left;
    line-height: 32px;
  }

  .bgCond {
    display: inline-block;
    width: 70px;
    height: 27px;
    border-radius: 5px;
    background-color: #313448;
    // cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    line-height: 27px;
    text-align: center;
    color: #000;
    img {
      margin-top:5px;
      width: 25px;
      height: 20px;
    }
  }

  .bgSucc {
    background-color: #00e984 !important;
    color: #000;
    margin-bottom: 5px;
    margin-left: 10px;
  }

  .pagination-container {
    margin-top: 0;
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
