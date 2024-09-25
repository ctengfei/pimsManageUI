<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <gis-map ref="gisMap" :type="'peopleControl'"></gis-map>
      <!-- 人员轨迹查询 -->
      <div class="rightBox">
        <div style="padding-top: 10px">
          <div style="margin-bottom: 20px">
            <el-date-picker v-model="time" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-button style="margin-left: 10px" icon="el-icon-search" type="primary" @click="onSearch()">查询</el-button>
          </div>
          <!-- <el-form ref="formSeach" inline> -->
          <!-- <el-form-item label="轨迹时间段"> -->
          <!-- </el-form-item> -->
          <!-- <el-form-item> -->
          <!-- <el-button  icon="el-icon-refresh-left" @click="onReset()">重置</el-button> -->
          <!-- </el-form-item> -->
          <!-- </el-form> -->
        </div>

        <!-- 列表 -->
        <div class="listBox" v-if="roundList && roundList.length > 0">
          <div class="listWrap">
            <div class="listArr" v-for="(item, index) in roundList" :key="index">
              <div class="listTop" @click="nowVidoe(item)">
                <div class="listLeft">
                  <div>[{{ item.businessName }}]{{ item.eventName }}</div>
                  <div>{{ item.deviceName }}</div>
                  <div>{{ item.createTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="el-table__empty-block" style="height: 100%; width: 100%">
            <span class="el-table__empty-text">暂无数据</span>
          </div>
        </div>
        <div class="pageStyle" v-if="roundList && roundList.length > 0">
          <pagination
            :small="false"
            @pagination="handleCurrentChange"
            :page.sync="formSeach.pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :layout="'prev, pager, next'"
            :limit.sync="formSeach.pageSize"
            :total="total"
            :pagerCount="5"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import pointMap from "@/components/common/map/point-map";
import $blockPersonList from '@/api/executeControl/blockPersonList'
import { getAlarmId } from '@/api/alarmCenter/warningRealtime'
import gisMap from '@/components/common/map/gis-map'
export default {
  name: '',
  components: {
    // pointMap,
    gisMap
  },
  data() {
    return {
      time: '',
      pointMapData: [],
      roundList: [
        // {
        //   businessName: "1111",
        //   eventName: "22222",
        //   deviceName: "33333",
        //   createTime: "444",
        // },
        // {
        //   businessName: "1111",
        //   eventName: "22222",
        //   deviceName: "33333",
        //   createTime: "444",
        // },
      ],
      formSeach: {
        pageNum: 1, // 分页
        pageSize: 10,
        endTime: '',
        startTime: ''
      }
    }
  },
  watch: {},
  beforeDestroy() {},
  created() {},
  mounted() {
    // this.getList();
  },
  methods: {
    // 切换到第几页了
    handleCurrentChange() {
      // this.$refs.gisMap.allClearLayer()
    },
    onSearch() {
      let obj = {
        ivsId: this.$route.query.ivsId,
        endTime: this.time[1],
        startTime: this.time[0]
      }
      $blockPersonList.trackId(this.$route.query.ivsId, obj).then(res => {
        if (!res.data.length) return
        this.$refs.gisMap.addLineFeature(res.data)
        this.$refs.gisMap.mapCenter = [res.data[0].longitude, res.data[0].latitude]
        this.getList()
      })
    },
    getList() {
      let endTime = this.time[1]
      let startTime = this.time[0]

      endTime = endTime.split(' ')[0] // 分割时间字符串并取日期部分
      startTime = startTime.split(' ')[0] // 分割时间字符串并取日期部分

      this.formSeach = {
        ivsId: this.$route.query.ivsId,
        endTime: endTime,
        startTime: startTime,
        pageNum: 1,
        pageSize: 10
      }
      $blockPersonList.trackIdList(this.formSeach).then(res => {
        this.roundList = res.data.data
        this.total = res.data.total
        this.formSeach.pageSize = res.data.pageSize
        this.formSeach.pageNum = res.data.pageNum
      })
    },
    // 实时监控
    nowVidoe(item) {
      this.roundPatrolShow = false
      // this.leftBoxShow = false
      this.backShow = false
      // 手动告警
      this.alarmShow = false
      // this.$refs.gisMap.clearDeviceLayer()
      getAlarmId(item.id).then(res => {
        // this.roundPatrol = res.data
        // let tempArr = res.data.captureRecords.map(item=>item.pictureUrl)
        // this.pictureUrlArr = tempArr
        let tempArr = {}
        let deviceArr = []
        if (res.data.monitors.length) {
          deviceArr = res.data.monitors.map(items => {
            return {
              longitude: items.longitude,
              latitude: items.latitude,
              deviceName: items.name,
              cameraType: items.deviceType,
              deviceTypeStr: items.deviceTypeStr,
              deviceAddress: items.address,
              code: items.code,
              deviceCode: items.code,
              beginTime: items.startTime,
              endTime: items.endTime,
              cameraId: items.code,
              name: '关联摄像头'
            }
          })
        }
        if (res.data.alarmRecords.length) {
          tempArr = {
            longitude: item.longitude,
            latitude: item.latitude,
            deviceName: item.deviceName,
            cameraType: item.deviceType,
            deviceTypeStr: item.deviceTypeStr,
            deviceAddress: item.address,
            code: item.deviceCode,
            deviceCode: item.deviceCode,
            beginTime: res.data.alarmRecords[0].startTime,
            endTime: res.data.alarmRecords[0].endTime,
            cameraId: res.data.alarmRecords[0].cameraCode,
            name: '主摄像头'
          }
        }
        deviceArr.push(tempArr)
        console.log(deviceArr, 'deviceArr')
        this.$refs.gisMap.addDeviceInfo(deviceArr)
      })
      // this.roundPatrol = item
      // this.alarmWorkOrder = {
      //   alarmCode: item.code,
      //   content: "",
      //   location: item.location,
      //   priority: item.alarmLevel,
      //   submit: true,
      //   title: ""
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container-gis {
  position: relative;
  .listBox {
    width: 100%;
    height: 500px;
    overflow: hidden;
  }
  .listWrap {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .listdetailWrap {
    width: 100%;
    height: 100px;
    overflow-y: auto;
  }
  .listArr {
    width: 100%;
    background: #313448;
    background: #fff;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    .listTop {
      display: flex;
      justify-content: space-between;
      .listLeft {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #000;
        div {
          &:first-child {
            font-size: 16px;
            color: #000;
          }
        }
      }
    }
  }
  #cesiumContainer {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    .addTitle {
      font-weight: bold;
      font-size: 16px;
    }
    // 布控详情
    .controlDetails,
    .rightBox {
      position: absolute;
      top: 20px;
      left: 20px;
      // min-width: 350px;
      width: 500px;
      height: 700px;
      z-index: 100;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      background-color: #f5f7fa;
    }
  }
}
</style>
