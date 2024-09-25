<!--
 * @LastEditors: HJQ
 * 暖风空调
-->
<template>
  <div class="app-container-bow">
    <div class="video-web-left-box">
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
              :draggable="draggable"
               @treeId="treeId"
              :nodeType='nodeType'
              @getTableData="getTableData"/>
          </div>
        </template>
      </HighlightSquare>

    </div>
    <div class="video-web-right-box-top">

      <comCard class="card-wrap" :spanList='spanList'></comCard>

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
            placeholder="请输入电梯名称"
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
          </el-button
          >
          <el-button
            icon="el-icon-refresh-left"
            @click="reset()"
            plain
          >重置
          </el-button
          >
        </el-form-item>
        <el-form-item style="float: right;margin-right:0px;">

          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="refreshs"
          >一键刷新</el-button
          >
        </el-form-item>
      </el-form>
      <!-- end -->
      <!-- 表格 -->
      <el-card>
        <HighlightSquare>
          <template v-slot:child>
            <div class="photoBox" v-if="tableData && tableData.length">
              <el-row :gutter="15" style="height: calc(100vh - 340px);overflow:auto">
                <el-col :span="6" v-for="(item,index) in tableData" :key="index">
                  <div class="groups">
                    <div class="imgTitle">
                      <div class="info">
                        <span>{{item.deviceName}}</span>
                      </div>
                      <div class="status">
                        <span>运行状态</span>
                        <div v-for="items in item.pointRunDataList" :style="{'display':items.pointType == 'elevator_run'? 'inline-block':'none'}">
                          <span class="status_time" v-if="items.pointType == 'elevator_run'"   >
                             {{items.dataValue == 'true' ? '运行' : '停止'}}
                          </span>
                        </div>
                        <span>故障报警</span>
                        <div v-for="items in item.pointRunDataList" :style="{'display':items.pointType == 'elevator_fault'? 'inline-block':'none !important'}" >
                          <span class="status_time"
                           v-if="items.pointType == 'elevator_fault'"
                            :class="items.dataValue !== 'true' ? 'greencolors':'redcolors'"
                               >
                             {{items.dataValue !== 'true' ? '正常' : '故障'}}
                          </span>
                        </div>
                      </div>
                      <div class="imgs">
                        <div class="left">
                          <img :src="require(`@/assets/images/smartBuild/evelatordoor.png`)"/>
                        </div>
                        <div class="right">
                          <div class="runningState">
                            <div class="floor">
                              <span v-for="(items,index) in item.pointRunDataList" :key="index">
                              <span v-show="items.pointType == 'elevator_fault' && items.dataValue == 'false' ">
                                <span v-for="(itemss,index) in item.pointRunDataList" :key="index">
                                <span
                                  v-if="itemss.pointType=='elevator_layerDisplay'">{{itemss.dataValue}}{{'F'}}</span>
                                </span>
                              </span>
                              <span v-show="items.pointType == 'elevator_fault' && items.dataValue == 'true' "
                                    style="color: #ff403d">检修</span>
                              </span>
                            </div>
                            <div class="upperOrDown">
                              <div v-for="(items,index) in item.pointRunDataList" :key="index">
                                <div v-show="items.pointType == 'elevator_upordown'">
                                  <div class="toptriangle" :class="items.dataValue == '2'?'bluecolor':''"></div>
                                  <div class="bottomtriangle" :class="items.dataValue == '3'?'bluecolors':''"></div>
                                </div>
                              </div>
                            </div>

                          </div>
                          <div class="setting">
                            <img v-if="item.monitorVos" class=""  :src="require(`@/assets/images/smartBuild/carema.png`)" @click="oncamera(item.monitorVos)"/>
                            <el-divider direction="vertical"></el-divider>
                            <img class="" :src="require(`@/assets/images/smartBuild/warning.png`)"/>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </el-col>
              </el-row>
              <div class="content-bottom" v-if="tableData.length && tableData">
                <pagination
                  @pagination="handleCurrentChange"
                  :page.sync="form.pageNum"
                  :pageSizes="[8, 16, 32, 64]"
                  :limit.sync="form.pageSize"
                  :total="total"
                />
              </div>
            </div>
            <div v-else style="text-align:center">
              <div class="el-table__empty-text"  style="margin:0 auto;color:white;font-size:20px;">暂无数据</div>
            </div>
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
  import pagination from '@/components/comPagination'
  import OrgizeTree from '@/components/orgnizeTree'
  import {treeData, getDeviceInfoById, getIvsPlayer, getDeviceCriteria} from '@/api/system/organization'
  import comCard from "@/components/comCard"
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import $smartBuild from "@/api/smartBuild"

  export default {
    components: {sysTree, HighlightSquare, pagination, OrgizeTree, comCard},
    data() {
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          age: '',
          switch: true
        },
        permission: {
          deviceTree: 'monitor::splitscreen::deviceTree',
          deviceCriteria: 'monitor::splitscreen::deviceCriteria',
          treeCheck: 'tree::check',
          collectDevice: 'collectTag::device',
          collectDelete: 'collectTag::delete',
          collectCheck: 'collecttag::check',
          searchDevice: 'smartBuild::intellectCondite::searchDevice',
          statistics: 'smartBuild::elevator::searchnum'
        },
        dominList: [],
        draggable: true,
        districtList: [],
        tagNode: {},
        isCheck: '',
        nodeType: 'elevator',
        isShow: true,
        dominShow: true,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        total: 0,
        form: {
          name: "",
          type: 'ELEVATOR',
          pageNum: 1,
          pageSize: 8,
        },
        TypeArr: [
          {value: 0, label: "不限"},
          {value: 1, label: "名称"},
        ],
        tableData: [],
        selectedIds: [],
        spanList: [
          {
            type: "total",
            num: null,
            name: "电梯总数",
            path: require(`@/assets/images/smartBuild/dt1.png`),
          },
          {
            type: "off-line",
            num: null,
            name: "电梯正常",
            path: require(`@/assets/images/smartBuild/dt2.png`),
          },
          {
            type: "off-line",
            num: null,
            name: "电梯故障",
            path: require(`@/assets/images/smartBuild/dt3.png`),
          },
          {
            type: "normal",
            num: null,
            name: "电梯检修",
            path: require(`@/assets/images/smartBuild/dt4.png`),
          },
          {
            type: "normal",
            num: null,
            name: "电梯报警",
            path: require(`@/assets/images/smartBuild/dt5.png`),
          }
        ],
        airSpanList: [],
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
      // 获取设备统计
      getStatistics() {
        let obj = getObjByKey(this.permission.statistics)
        let data = {
          type: 'ELEVATOR'
        };
        $smartBuild.getStatistics(obj, data).then(res => {
          if (res.meta.status === 200) {
            this.spanList[0].num = res.data.deviceNum
            this.spanList[1].num = res.data.deviceNormalNum
            this.spanList[2].num = res.data.deviceFaultNum
            this.spanList[3].num = res.data.deviceRepairNum
            this.spanList[4].num = res.data.deviceAlarmNum
          }
        })
      },
      // 获取设备状态
      getDeviceStatus(data) {
        let obj = getObjByKey(this.permission.searchDevice)
        $smartBuild.getDeviceStatus(obj, data).then(res => {
          if (res.meta.status === 200) {
            this.tableData = res.data.data;
            this.total = res.data.total;
          } else {
            this.$message.error(res.meta.message)
          }
        })
      },
      //  获取设备信息
      getDeviceData(data) {
        if (!data.children) {
          if (!data.code) {
            if (this.isType === 'click') {
              let tempObj = [{
                deviceId: data.id,
                deviceName: data.name
              }]
              this.handleleftClick(tempObj)
            } else if (this.isType === 'dbClick') {
              const player = {
                deviceId: data.deviceId,
                deviceName: data.name
              }
              this.goVideoControl(player)
            }
            return
          }
          getDeviceInfoById(data.code)
            .then(res => {
              if (res.meta.status === 200) {
                if (this.isType === 'click') {
                  this.handleleftClick(res.data)
                } else if (this.isType === 'dbClick') {
                  if (res.data[0]) {
                    const player = {
                      deviceId: res.data[0].deviceId,
                      // channelId: res.data[0].channelId,
                      deviceName: res.data[0].name,
                      protocol: res.data[0].protocol
                    }
                    this.goVideoControl(player)
                  }
                } else if (this.isType === 'drag') {
                  this.players[this.dragIndex].deviceId = res.data[0].deviceId
                  this.players[this.dragIndex].deviceName = res.data[0].name
                  this.players[this.dragIndex].protocol = res.data[0].protocol
                } else {
                  this.$message.error('获取设备信息失败')
                }
              }
            })
            .catch(err => {
              console.log(err, 'err')
            })
        }
      },
      // 左侧设备树双击
      handleNodeDblclick(data) {
        this.isType = 'dbClick'
        this.getDeviceData(data)
      },

      //  点击左侧通道树
      handleleftClick(data) {
        const res = data[0]
        if (res) {
          let obj = getObjByKey(this.permission.deviceCriteria)
          let params = {
            mounted: true,
            blurryType: 'DEVICE_TREE',
            nodeId: data.deviceId,
            type: this.nodeType
          }
          getDeviceCriteria(obj.url, obj.method, params).then(rs => {
            if (rs.meta.status === 200) {
              console.log("rs====", rs)
              //            this.tableData=rs.data.data
              this.getIvsPlayer(rs.data.data[0].code)
            } else {
              this.$message({
                message: res.meta.message,
                type: 'error'
              })
            }
          })
        }
      },
      // 通道列表点击选择通道
      handleClickChannel(data, index) {
        const player = this.players[index]
        player.deviceId = data.deviceId
        player.deviceName = data.name
        player.protocol = data.protocol
        this.workspaceDeviceCounts++
      },
      // 获取树组件数据
      async getTreeData() {
        if (this.domainCode != "") {
          let url = this.$store.getters.btnpremissAll[this.permission.deviceTree].url
          let method = this.$store.getters.btnpremissAll[this.permission.deviceTree].method
          getDeviceTree(url, method, this.domainCode)
            .then(res => {
              this.dominList = res.data
            })
            .catch(err => {
              this.$message.error(err)
            })
        } else {
          let url = this.$store.getters.btnpremissAll[this.permissionData.treeCheck].url
          let method = this.$store.getters.btnpremissAll[this.permissionData.treeCheck].method
          const res = await treeData(url, method, [])
          if (res.meta.status === 200) {
            this.districtList = res.data
            this.dominList = res.data
          } else {
            this.$message.error('获取区域数据失败')
          }
        }
      },
      getTableData(data, activeName) {

        this.tagNode = data
        this.isType = 'click'
//        if ('type' in data === false) {
//          let obj = {...data, type: 'IPC', code: data.deviceId}
//          this.getDeviceData(obj)
//        }
        this.form.nodeId = data.id;
        this.getDeviceStatus(this.form);
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
        this.$refs['serForm'].resetFields();
        this.getDeviceStatus(this.form);
      },
      // 刷新
      refreshs() {
        window.location.reload()
      }
    },
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
    border: 2px solid #DCDFE6;
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
    text-align: center
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
    color: #000
  }

  .el-form-item
  .app-container {
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
    height: calc(100vh - 265px);
    padding: 0 20px;
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
    overflow: auto;
    display: flex;
    justify-content: space-between;
    height: auto;
    padding: 10px 20px 15px 20px;
    background-color: #272937;
    border-radius: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
   
    .imgTitle {
      color: #afb9d0;
      width: 100%;
      .info {
        text-align: center;
        border-bottom: 1px solid rgba(98, 103, 133, .21);
        span {
          display: block;
          margin: 0 0 20px 0;
        }
      }
      .status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0;
        flex-wrap:wrap;
        border-bottom: 1px solid rgba(98, 103, 133, .21);
        .status_time {
          // span {
          //   display: inline-block;
          // }
          background-color: #206aff;
          color: #fff;
          padding: 3px 12px;
          font-size: 12px;
          border-radius: 8px;
        }
        .greencolors {
          background-color: #00e984;
        }
        .redcolors {
          background-color: #ff403d;
        }
      }
      .imgs {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          width: 40%;
          img {
            width: 100%;
            height: auto;
          }
        }
        .right {
          width:60%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 160px;
          .runningState {
            display: inline-block;
            margin-top: -5px;
            width: 50px;
            height: 70px;
            background-color: #535771;
            .floor {
              width: 40px;
              height: 30px;
              margin: 5px;
              background-color: #000;
              text-align: center;
              span {
                line-height: 30px;
              }
            }
            .upperOrDown {
              .toptriangle {
                width: 0px;
                height: 0px;
                border-bottom: 8px solid #fff;
                border-left: 8px solid transparent; /*transparent 表示透明*/
                border-right: 8px solid transparent;
                margin: 5px auto;
              }
              .bottomtriangle {
                width: 0px;
                height: 0px;
                border-top: 8px solid #fff;
                border-left: 8px solid transparent; /*transparent 表示透明*/
                border-right: 8px solid transparent;
                margin: 0 auto;
              }
              .bluecolor{
                border-bottom: 8px solid #206aff;
              }
              .bluecolors{
                border-top: 8px solid #206aff;
              }
            }
          }
          .setting {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 40px;
            background-color: #535771;
            border-radius: 8px;
            padding: 8px 4px;
          }
        }
      }
    }
  }

  .forms {
    padding: 20px 20px 0 20px
  }

  ::v-deep .el-divider--vertical {
    opacity: 0.4;
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
