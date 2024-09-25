<template>
  <div class="app-container-gis">
    <!-- <div class="app-container" style="color:#fff">轮巡计划</div> -->
    <div class="" style="height: 800px">
      <template>
        <div id="cesiumContainer">
          <gis-map ref="gisMap" @mapReady="mapReady"></gis-map>
          <!-- 联动列表 -->
          <div class="leftBox padding-10">
            <template>
              <div class="seachBox">
                <el-select v-model="formSeach.carOwner" style="width: 100%" placeholder="全部任务" :popper-append-to-body="false" clearable @change="onSearch">
                  <el-option v-for="item in selectOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="addBox">
                <div v-if="roundList && roundList.length > 0">
                  <div class="listArr" v-for="(item, index) in roundList" :key="index">
                    <div class="listTop" @click="nowVidoe(item)">
                      <div class="listLeft">
                        <div class="titleHand">【 {{ item.planName }} 】</div>
                        <div class="boxtitle">{{ item.startTime.split(' ')[0] }}~{{ item.endTime.split(' ')[0] }}</div>
                        <div class="boxtitle">{{ item.handler }}</div>
                      </div>
                      <div class="listRight">
                        <div
                          :class="[
                            'cricle',
                            item.executionStatus == 'UNEXECUTE' ? 'notCircle' : item.executionStatus == 'RUNNING' ? 'handCircle' : item.executionStatus == 'PAUSED' ? 'pausedCircle' : 'doneCircle'
                          ]"
                        >
                          {{ item.executionStatus == 'UNEXECUTE' ? '待执行' : item.executionStatus == 'RUNNING' ? '执行中' : item.executionStatus == 'PAUSED' ? '已暂停' : '已完成' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="el-table__empty-block" style="height: 50vh; width: 340px">
                    <span class="el-table__empty-text">暂无数据</span>
                  </div>
                </div>
              </div>
              <div>
                <pagination
                  v-if="roundList && roundList.length > 0"
                  style="margin-top: 0px"
                  small
                  @pagination="handleCurrentChange"
                  :page.sync="pageNum"
                  :pageSizes="[10, 20, 30, 40]"
                  :limit.sync="pageSize"
                  :layout="'total, prev, pager, next'"
                  :total="total"
                />
              </div>
            </template>
          </div>
          <!-- 巡逻报告 -->
          <div class="rightBox padding-10" v-if="roundPatrolShow">
            <template>
              <!-- <i class="el-icon-close" @click="cameraShow = false"></i> -->
              <div style="height: 36px; line-height: 36px; border-radius: 6px; background: #313448; color: #fff; padding-left: 20px">巡逻报告</div>
              <el-form :model="roundPatrol" ref="roundPatalForm" label-width="80px" label-position="top">
                <el-form-item label="计划名称">
                  <el-input v-model="roundPatrol.planName" disabled></el-input>
                </el-form-item>
                <el-form-item label="责任人">
                  <el-input v-model="roundPatrol.handler" disabled></el-input>
                </el-form-item>
                <el-form-item label="计划打卡次数">
                  <el-input v-model="roundPatrol.planClockTimes" disabled></el-input>
                </el-form-item>
                <el-form-item label="实际打卡次数">
                  <el-input v-model="roundPatrol.actualClockTimes" disabled></el-input>
                </el-form-item>
                <el-form-item label="缺少打卡次数">
                  <el-input v-model="roundPatrol.lackClockTimes" disabled></el-input>
                </el-form-item>
                <el-form-item label="报告备注" prop="remark" :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]">
                  <el-input type="textarea" v-model="roundPatrol.remark"></el-input>
                </el-form-item>
              </el-form>
              <div class="submitButton">
                <el-button plain @click="roundPatrolCancel">取消</el-button>
                <el-button type="primary" @click="roundPatrolSubmit">确认</el-button>
              </div>
            </template>
          </div>
          <!-- 告警上报 -->
          <div class="rightBox padding-10" v-if="alarmShow">
            <template>
              <!-- <i class="el-icon-close" @click="cameraShow = false"></i> -->
              <div style="height: 36px; line-height: 36px; border-radius: 6px; background: #313448; color: #fff; padding-left: 20px">告警上报</div>
              <el-form :model="cameraForm" :rules="cameraFormRules" ref="cameraForm" label-width="80px" label-position="top">
                <el-form-item label="告警类型" prop="businessType">
                  <el-select v-model="cameraForm.businessType" placeholder="请选择">
                    <el-option v-for="item in configBusin" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警名称" prop="eventCode">
                  <el-select v-model="cameraForm.eventCode" placeholder="请选择">
                    <el-option v-for="item in configName" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="上传图片" prop="alermImg">
                  <el-upload
                    :action="fileUrl"
                    list-type="picture-card"
                    :limit="limitCount"
                    :on-preview="handlePictureCardPreview"
                    :on-success="handleSuccess"
                    :on-change="changeImg"
                    :on-remove="handleRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="事件描述" prop="content">
                  <el-input type="textarea" v-model="cameraForm.content"></el-input>
                </el-form-item>
              </el-form>
              <div class="submitButton">
                <el-button plain @click="onCancel">取消</el-button>
                <el-button type="primary" @click="onSubmit1()">确认</el-button>
              </div>
            </template>
          </div>

          <!-- 实时视频 -->
          <div class="bigVideo padding-10" v-show="videoShow" id="vedioShow">
            <template>
              <div class="title">
                实时监控
                <span>倒计时：{{ resetTime }}s</span>
                <i class="el-icon-close" @click="vedioClickShow"></i>
              </div>
              <div class="vedioPlay" id="vedioPlay"></div>
              <div class="videoBtn">
                <div>
                  <el-button v-if="playButton" type="text" title="暂停" icon="el-icon-video-pause" :disabled="!mySsrc" @click="playerPlay1" />
                  <el-button v-if="!playButton" type="text" title="播放" icon="el-icon-video-play" :disabled="!mySsrc" @click="playerPlay2" />
                </div>
                <div>
                  <!-- <span @click="vedioSnap">
                    <img :src="vedioSnaps" title="抓拍">
                  </span> -->
                  <span @click="vedioClock">
                    <img :src="vedioClocks" title="打卡" />
                  </span>
                  <span @click="vedioAlarm">
                    <img :src="vedioAlarms" title="告警" />
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import gisMap from '@/components/common/map/gis-map'
import pagination from '@/components/comPagination'
import roundApi from '@/api/roundPatrol'
import UpLoadPhoto from '@/components/upLoadPhoto/upLoadPhoto.vue'
import Moment from 'moment'

var GisMapObj = null,
  viewer = null,
  that = null
export default {
  name: ' ',
  components: {
    pagination,
    gisMap,
    UpLoadPhoto
  },
  data() {
    return {
      hideUpload: false,
      limitCount: 3,
      dialogImageUrl: '',
      dialogVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      formSeach: {
        // 搜索
        carOwner: ''
      },
      pageNum: 1, // 分页
      pageSize: 10, // 每页显示的条数
      total: 0, // 总数量
      selectOption: [
        {
          label: '全部任务',
          value: ''
        },
        {
          label: '已完成',
          value: 'DONE'
        },
        {
          label: '执行中',
          value: 'RUNNING'
        },
        {
          label: '已暂停',
          value: 'PAUSED'
        },
        {
          label: '待执行',
          value: 'UNEXECUTE'
        }
      ],
      cameraShow: false, // 摄像机展示
      cameraForm: {
        businessType: '',
        content: '',
        deviceId: '',
        eventCode: '',
        alermImg: [],
        planId: '',
        from: 'MANUAL_ALARM',
        mediaMeta: {
          pictures: [
            {
              name: '',
              path: ''
            }
          ]
        },
        triggerTime: Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      cameraFormRules: {
        businessType: [
          {
            required: true,
            message: '请选择告警类型',
            trigger: ['blur', 'change']
          }
        ],
        content: [{ required: true, message: '请输入事件描述', trigger: 'blur' }],
        eventCode: [
          {
            required: true,
            message: '请选择告警名称',
            trigger: ['blur', 'change']
          }
        ],
        alermImg: [
          {
            type: 'array',
            required: true,
            message: '请上传图片',
            trigger: ['blur', 'change']
          }
        ]
      },
      roundAlarmPlayAll: [],
      playIndex: 0,
      playLength: 0,
      videoShow: false, // 实时监控展示
      player: {}, // 监控的流路径
      preIcon: '',
      clickIcon: '',
      isClickShow: false,
      markers: [],
      sendShow: false,
      fromData: [],
      defaultfromData: [],
      defaultdata: [],
      toData: [],
      titles: ['人员列表', '选择列表'],
      title: '添加人员',
      sendWork: {
        //        选择人员名单
      },
      num: 1,
      carmeaShow: false,
      ruleForm: {
        numTime: 1,
        seconds: 10
      },
      carmeaNum: [
        { id: 1, value: 1 },
        { id: 2, value: 2 },
        { id: 3, value: 3 },
        { id: 4, value: 4 },
        { id: 5, value: 5 },
        { id: 6, value: 6 }
      ],
      rules: {
        numTime: [
          { required: true, message: '请选择次数', trigger: 'blur' },
          { min: 1, max: 6, message: '次数在 1-6个', trigger: 'blur' }
        ],
        seconds: [{ required: true, message: '请输入轮巡时长', trigger: 'blur' }]
      },
      personCharge: [],
      roundList: [],
      carmeaShowDuration: '',
      addFormType: 'add',
      roundListId: '',
      vedioSnaps: require('@/assets/images/pz.png'),
      vedioClocks: require('@/assets/images/zp.png'),
      vedioAlarms: require('@/assets/images/gjsb.png'),
      widowWidth: document.documentElement.clientWidth,
      widowHeight: document.documentElement.clientHeight,
      clockRecord: {},
      alarmShow: false,
      roundPatrolShow: false,
      alarmLevel: [
        { label: '普通', value: 'normal' },
        { label: '紧急', value: 'emergency' },
        { label: '非常紧急', value: 'veryEmergency' }
      ],
      fileList: [],
      roundPatrol: {
        handler: '',
        planName: '',
        actualClockTimesL: '',
        planClockTimes: '',
        remark: '',
        lackClockTimes: ''
      },
      playButton: true,
      mySsrc: true,
      // 实时轮巡播放
      deviceObj: {
        rtsp: '',
        restTime: '',
        deviceCode: '',
        deviceId: ''
      },
      fileUrl: process.env.VUE_APP_BASE_API + '/file/pm/fastdfs/upload/picture',
      // 告警类型
      configBusin: [{ label: '轮巡告警', value: 'roundRobinAlert' }],
      // 告警名称
      configName: [],
      rtspUrl: '',
      resetTime: '',
      interval: null, // 定时器
      tempIndex: true,
      vedioTop: '',
      vedioLeft: '',
      vedioWidth: '',
      vedioHeight: '',
      deviceZoom: ''
    }
  },
  watch: {
    widowWidth(val) {
      let that = this
      console.log('实时屏幕宽度', val, that.widowWidth)
      that.$nextTick(() => {
        that.windowWidth = val
      })
    },
    widowHeight(val) {
      let that = this
      console.log('实时屏幕高度', val, that.widowHeight)
      that.$nextTick(() => {
        that.windowWidth = val
      })
    },
    vedioTop(val) {
      let that = this
      console.log('播放器X', val, that.vedioTop)
      that.$nextTick(() => {
        that.vedioTop = val
      })
    },
    vedioLeft(val) {
      let that = this
      console.log('播放器Y', val, that.vedioLeft)
      that.$nextTick(() => {
        that.vedioLeft = val
      })
    },
    vedioWidth(val) {
      let that = this
      console.log('播放器高度', val, that.vedioWidth)
      that.$nextTick(() => {
        that.vedioWidth = val
      })
    },
    vedioHeight(val) {
      let that = this
      console.log('播放器高度', val, that.vedioHeight)
      that.$nextTick(() => {
        that.vedioHeight = val
      })
    },
    deviceZoom(val) {
      let that = this
      console.log('放大率', val, that.deviceZoom)
      that.$nextTick(() => {
        that.deviceZoom = val
      })
    }
  },
  updated() {
    const _this = this
    var box = document.getElementById('vedioPlay')
    console.log(box.getBoundingClientRect().width, 'box')
    _this.pageResize()
    window.onresize = () => {}
  },
  destroyed() {
    if (this.interval) {
      window.clearInterval(this.interval)
    }
  },
  //离开页面时一定要销毁不然会出问题
  beforeDestroy() {
    let str = {
      cmd: 'stop_all',
      id: '001',
      time: '2020-08-17 00:00:00.000',
      cmd_id: '001_1'
    }
    this.$store.state.socket.Csock.send(JSON.stringify(str))
    let str1 = `{"cmd":"destroy","id":"001","time":"2020-08-17 00:00:00.000","cmd_id":"001_1 "}`
    this.$store.state.socket.Csock.send(str1)
  },
  created() {
    // this.getCarGroup();
    // this.infoData();
    // this.getConfigBusin()
    this.getRoundAlarmEvent()
  },
  mounted() {
    this.initmap()
    this.getRoundList()
    let _this = this
    _this.deviceZoom = window.devicePixelRatio
    var box = document.document.getElementById('vedioPlay')
    console.log(box.getBoundingClientRect().height, 'mounted')
    _this.vedioTop = box.getBoundingClientRect().top + 252
    _this.vedioLeft = box.getBoundingClientRect().left + 620
    _this.vedioWidth = box.getBoundingClientRect().width + 385
    _this.vedioHeight = box.getBoundingClientRect().height + 200
    window.onresize = () => {
      window.fullHeight = window.screen.height
      window.fullWidth = window.screen.width
      _this.widowHeight = window.fullHeight
      _this.widowWidth = window.fullWidth
    }
  },
  methods: {
    // 告警类型
    getConfigBusin() {
      roundApi
        .getConfigBusin()
        .then(res => {
          this.configBusin = res.data
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 获取告警名称
    getRoundAlarmEvent() {
      roundApi
        .getRoundAlarmEvent()
        .then(res => {
          this.configName = res.data
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 图片上传成功
    handleSuccess(res, file, fileList) {
      this.cameraForm.alermImg.push(res.data)
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    changeImg(files, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    // 图片删除
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
      let obj = this.cameraForm.alermImg.filter(item => {
        return item.name !== file.name
      })
      this.cameraForm.alermImg = obj
      // document.querySelector('.el-upload--picture-card').style.display='block'
    },
    pageResize() {
      const box = document.getElementById('vedioPlay')
      console.log(box.getBoundingClientRect().top, 'updated')
      if (!box) return
      this.vedioTop = 252
      this.vedioLeft = 620
      this.vedioWidth = 385
      this.vedioHeight = 200
      this.$nextTick(_ => {})
    },
    // 地图初始化
    initmap() {},
    // 视频窗口
    vedioClickShow() {
      this.videoShow = false
      let str = {
        cmd: 'destroy',
        id: '001',
        time: '2020-08-17 00:00:00.000',
        cmd_id: '001_1 '
      }
      this.$store.state.socket.Csock.send(JSON.stringify(str))
    },
    // 获取计划列表
    getRoundList() {
      roundApi
        .getRoundList({ pageNum: this.pageNum, pageSize: this.pageSize })
        .then(res => {
          this.roundList = res.data.data
          this.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 抓拍
    vedioSnap() {
      // if(){}
      let str = {
        cmd: 'snap',
        id: '001',
        time: '2020-08-17 00:00:00.000',
        wnd_index: 0,
        camera_id: ''
      }
      this.$store.state.socket.Csock.send(JSON.stringify(str))
    },
    // 打卡
    vedioClock() {
      let mount = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      let obj = {
        clockTime: mount,
        deviceCode: this.deviceObj.deviceCode,
        planId: this.clockRecord.id
      }
      roundApi.getRoundAlarmClock(obj).then(res => {
        this.$message.success('打卡成功')
      })
    },
    // 告警
    vedioAlarm() {
      this.alarmShow = true
      this.roundPatrolShow = false
    },
    // 轮巡报告取消
    roundPatrolCancel() {
      this.roundPatrolShow = false
      this.$refs.roundPatalForm.resetFields()
    },
    // 轮巡报告提交
    roundPatrolSubmit() {
      this.$refs['roundPatalForm'].validate(valid => {
        if (valid) {
          roundApi
            .getRoundReport({
              planId: this.clockRecord.id,
              remark: this.roundPatrol.remark
            })
            .then(res => {
              this.roundPatrolShow = false
              this.$refs.roundPatalForm.resetFields()
              this.$message.success('巡逻报告上报成功')
            })
            .catch(err => {
              this.$message.error(err.meta.message)
            })
        }
      })
    },
    // gis方法
    mapReady(item) {
      console.log(item)
    },
    // 根据计划名称搜索
    onSearch() {
      roundApi
        .getRoundList({
          executionStatus: this.formSeach.carOwner,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        .then(res => {
          this.roundList = res.data.data
          this.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.meta.message)
        })
    },
    // 切换到第几页了
    handleCurrentChange() {
      this.getRoundList()
    },
    // 告警上报取消
    onCancel() {
      this.$refs['cameraForm'].resetFields()
      this.alarmShow = false
    },
    // 告警上报提交
    onSubmit1() {
      this.cameraForm.mediaMeta.pictures = this.cameraForm.alermImg
      this.cameraForm.deviceId = this.deviceObj.deviceId
      this.cameraForm.planId = this.clockRecord.id
      this.$refs['cameraForm'].validate(valid => {
        if (valid) {
          roundApi
            .getRoundAlarm(this.cameraForm)
            .then(res => {
              this.alarmShow = false
              this.$refs.cameraForm.resetFields()
              this.$message.success('告警上报成功')
            })
            .catch(err => {
              this.$message.error(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 定时请求
    setTimePlay() {
      this.interval = setInterval(() => {
        this.resetTime--
        if (this.resetTime == 0) {
          clearInterval(this.interval)
          this.interval = null
          console.log(`output->setTimePlay`, this.clockRecord)
          this.playNowVedio(this.clockRecord)
        }
      }, 1000)
    },
    // 播放暂停
    playerPlay1() {
      if (this.playButton) {
        roundApi
          .getRoundPause(this.clockRecord.id)
          .then(res => {
            let str = {
              cmd: 'pause',
              pause: true,
              wnd_index: 0,
              time: '2020-08-17 00:00:00.000',
              cmd_id: '001_1 ',
              id: '001'
            }
            this.$store.state.socket.Csock.send(JSON.stringify(str))
            this.playButton = false
            clearInterval(this.interval)
            this.getRoundList()
          })
          .catch(err => {
            this.$message.error(err)
          })
      }
    },
    // 播放器的 播放
    playerPlay2() {
      roundApi
        .getRoundAlarmPlay(this.clockRecord.id)
        .then(res => {
          this.rtspUrl = res.data.rtsp
          this.resetTime = res.data.restTime
          this.deviceObj = res.data
          this.playButton = true
          this.setTimePlay()
          let str = {
            cmd: 'play_real',
            id: '001',
            time: '2020-08-17 00:00:00.000',
            camera_id: this.rtspUrl,
            camera_name: '摄像头',
            wnd_index: 0,
            cmd_id: '001_1 '
          }
          this.$store.state.socket.Csock.send(JSON.stringify(str))
          this.getRoundList()
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    playNowVedio(item) {
      console.log(`output->playNowVedio`, JSON.parse(JSON.stringify(item)))
      if (item.executionStatus == 'UNEXECUTE') {
        this.$message.info('计划未开始')
      } else if (item.executionStatus == 'DONE') {
        let str = {
          cmd: 'destroy',
          id: '001',
          time: '2020-08-17 00:00:00.000',
          cmd_id: '001_1 '
        }
        this.$store.state.socket.Csock.send(JSON.stringify(str))
        this.videoShow = false
        this.roundPatrolShow = true
        this.roundPatrol = item
        this.roundPatrol.lackClockTimes = item.planClockTimes - item.actualClockTimes
      } else {
        this.roundPatrolShow = false
        console.log(this.vedioLeft, 'vedioLeft')
        console.log(this.vedioWidth, 'vedioWidth')
        console.log(this.vedioLeft, 'vedioLeft')
        let str0 = {
          cmd: 'create_control',
          html_x: window.screenLeft,
          html_y: window.screenTop,
          html_w: this.widowWidth,
          html_h: this.widowHeight,
          e_type: this.$browser(),
          title: document.title,
          time: '2020-08-17 00:00:00.000',
          cmd_id: '001_1'
        }
        this.$store.state.socket.Csock.send(JSON.stringify(str0))
        let str2 = {
          cmd: 'set_pos',
          x: this.vedioLeft,
          y: this.vedioTop,
          w: this.vedioWidth,
          h: this.vedioHeight,
          id: '001',
          time: '2020-08-17 00:00:00.000',
          cmd_id: '001_1'
        }
        this.$store.state.socket.Csock.send(JSON.stringify(str2))
        let str1 = {
          cmd: 'set_layout',
          id: '001',
          layout: 1,
          time: '2020-08-17 00:00:00.000',
          cmd_id: '001_1'
        }
        this.$store.state.socket.Csock.send(JSON.stringify(str1))
        let str = {
          cmd: 'show',
          id: '001',
          time: '2020-08-17 00:00:00.000',
          cmd_id: '001_1 '
        }
        this.$store.state.socket.Csock.send(JSON.stringify(str))
        this.videoShow = true
        this.playIndex += 1
        roundApi
          .getRoundAlarmPlay(item.id)
          .then(res => {
            if (res.code === 200) {
              console.log(`output->res.data.at(this.playIndex)`, res.data.at(this.playIndex))
              if (!res.data.at(this.playIndex)) this.playIndex = 0

              console.log(`output->this.playIndex = 0`, this.playIndex)
              this.rtspUrl = res.data.at(this.playIndex).rtsp
              this.resetTime = res.data.at(this.playIndex).restTime
              this.deviceObj = res.data.at(this.playIndex)
              this.roundAlarmPlayAll = res.data
              this.playButton = true
              console.log(`output->this.rtspUrl`, this.rtspUrl)
              let str1 = {
                cmd: 'play_real',
                id: '001',
                time: '2020-08-17 00:00:00.000',
                camera_id: this.rtspUrl,
                camera_name: '摄像头',
                wnd_index: 0,
                cmd_id: '001_1 '
              }
              this.$store.state.socket.Csock.send(JSON.stringify(str1))
              this.setTimePlay()
            } else {
              this.videoShow = false
              this.$message.error(res.meta.message)
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      }
    },
    // 实时监控
    nowVidoe(item) {
      if (this.tempIndex) {
        this.clockRecord = item
        this.tempIndex = false
        this.playNowVedio(this.clockRecord)
      } else if (this.clockRecord.id == item.id) {
        clearInterval(this.interval)
        this.playNowVedio(this.clockRecord)
      } else {
        this.clockRecord = item
        clearInterval(this.interval)
        this.playNowVedio(this.clockRecord)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.hide ::v-deep .el-upload {
  display: none !important;
}
::v-deep .cesium-viewer .cesium-viewer-toolbar {
  display: none;
}
::v-deep .cesium-viewer #navigationDiv {
  display: none;
}

::v-deep .el-transfer-panel {
  width: 300px;
  background-color: #202230;
  .el-transfer-panel__header {
    background-color: transparent !important;
    .el-checkbox .el-checkbox__label {
      color: #ffffff !important;
    }
  }
  .el-transfer-panel__body {
    .el-checkbox .el-checkbox__label {
      color: #ffffff !important;
    }
  }
  .el-transfer-panel__filter .el-input__inner {
    width: 90%;
    margin-right: 20px;
  }
}

::v-deep .el-rate {
  padding-top: 5px;
}

::v-deep.el-progress--circle .el-progress__text,
.el-progress--dashboard .el-progress__text {
  font-size: 20px !important;
}

::v-deep.wl-transfer .el-tree {
  background-color: inherit;
}

::v-deep.wl-transfer .transfer-title {
  background-color: inherit;

  font-size: 14px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
}

.el-form .el-select {
  width: 100%;
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}

// ::v-deep.el-range-editor--small .el-range-separator {
//   line-height: 34px;
// }

::v-deep svg path:first-child {
  stroke: #31364a;
}

.el-cascader--small {
  width: 100%;
}

.margintop20 {
  margin-top: 20px;
}

.tableheight {
  height: calc(100vh - 440px);
}

::v-deep .wl-transfer .transfer-left {
  border: 2px solid rgba(255, 255, 255, 0.04);
}

::v-deep .wl-transfer .transfer-right {
  border: 2px solid rgba(255, 255, 255, 0.04);
}
::v-deeep .el-input__inner,
.el-date-editor--daterange {
  width: 280px !important;
}
.up,
.down,
.vedio {
  color: #206aff;
  font-size: 16px;
  padding: 0 5px;
  font-weight: bold;
  cursor: pointer;
}
.app-container-gis {
  position: relative;
  .listArr {
    width: 100%;
    background: #313448;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    .listTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .listLeft {
        font-size: 14px;

        font-weight: bold;
        line-height: 32px;

        // div{
        //   &:first-child{
        //     font-size: 16px;
        //     color: #fff;
        //     line-height: 40px;
        //   }
        .titleHand {
          font-size: 16px;
          color: #fff;
          line-height: 40px;
        }
        .boxtitle {
          color: #ccc;
        }
      }
    }
    .listBottom {
      border-top: solid 1px #afb9d0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 34px;
      opacity: 0.41;
      div {
        width: 50%;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .cricle {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: solid 4px #fff;
    text-align: center;
    line-height: 48px;
    font-size: 14px;
    cursor: pointer;
  }
  .handCircle {
    border: solid 4px #206aff;
  }
  .doneCircle {
    border: solid 4px #00e984;
    color: #ccc;
  }
  .notCircle {
    border: solid 4px #989898;
    color: #ccc;
  }
  .pausedCircle {
    border: solid 4px #efb01d;
  }
  .vedioPlay {
    height: 195px;
  }
  .videoBtn {
    display: flex;
    height: 25px;
    align-items: center;
    justify-content: space-between;
    div {
      &:first-child {
        margin-left: 10px;
      }
    }
    span {
      margin: 0 10px;
      cursor: pointer;
    }
  }
  #cesiumContainer {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    .mainButton {
      position: absolute;
      left: 350px;
      top: 32px;
      z-index: 100;
    }
    .leftBox {
      position: absolute;
      top: 32px;
      width: 375px;
      height: 92%;
      z-index: 100;
      padding: 10px;
      left: 20px;
      overflow: hidden;
      background-color: rgba(32, 34, 48, 0.9);
      .seachBox {
        width: 100%;
        height: 35px;
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
        margin-bottom: 10px;
        button {
          margin-left: 10px;
        }
      }
      .addBox {
        margin: 5px;
        display: flex;
        flex-direction: column;
        overflow: auto;
        height: calc(100vh - 260px);
        margin-bottom: 15px;
        button {
          color: white;
        }
        .deletebutton {
          color: #f05656;
        }
      }
    }

    .cameraBox {
      position: absolute;
      top: 32px;
      right: 27%;
      width: 20%;
      height: 22%;
      z-index: 100;
      padding: 10px;
      padding-top: 30px;
      background-color: rgba(32, 34, 48, 0.9);
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
      top: 32px;
      right: 20px;
      width: 20%;
      min-width: 350px;
      height: 92%;
      z-index: 100;
      padding: 10px;
      background-color: rgba(32, 34, 48, 0.9);
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
        // position: absolute;
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
    left: 412px;
    top: 32px;
    min-width: 400px;
    height: 265px;
    z-index: 100;
    padding: 10px;
    background-color: rgba(32, 34, 48, 0.9);
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
::v-deep .el-upload--picture-card {
  border: 1px solid #206aff;
  width: 100px;
  height: 100px;
  color: #8c939d;
  background: #294e80;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-upload-list__item {
  transition: none !important;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
::v-deep .el-input .el-input__inner {
  border-radius: 6px;
  color: #ccc !important;
  background-color: #313448 !important;
  border: 1px solid #313448 !important;
}
::v-deep .el-textarea.el-input--small .el-textarea__inner {
  background-color: #313448 !important;
  border: 1px solid #313448 !important;
}
// ::v-deep .el-popper.el-cascader__dropdown, .el-popper.el-picker-panel, .el-popper.el-popover, .el-popper.el-select-dropdown, .el-time-panel.el-popper{
//   background-color: #313448!important;
//   border: 1px solid #313448!important;
// }
::v-deep .el-select-dropdown__list {
  border-radius: 0px;
  color: #ccc !important;
  background-color: #313448 !important;
  border: 1px solid #313448 !important;
}
::v-deep .el-pagination .is-background {
  //background-color: transparent !important;
  background-color: rgba(38, 40, 57, 0.3) !important;
}
::v-deep .el-pager li {
  background-color: #313448 !important;
}
::v-deep .el-pagination .btn-prev,
.el-pagination .btn-next {
  background-color: #313448 !important;
}
::v-deep .el-select-dropdown__list {
  border: 1px solid #313448 !important;
}
::v-deep .el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #313448 !important;
  color: #fff;
}
::v-deep .el-pagination .btn-prev,
.el-pagination .btn-next {
  background-color: #313448 !important;
}
::v-deep .el-select-dropdown {
  border-radius: 0px;
  color: #ccc !important;
  background-color: #313448 !important;
  border: 1px solid #313448 !important;
}
::v-deep .el-pagination button:disabled {
  background-color: #313448 !important;
}
::v-deep .is-background .btn-next {
  background-color: #313448 !important;
}
</style>
<style>
.amap-marker-label {
  background-color: transparent !important;
  border: none !important;
}
</style>
