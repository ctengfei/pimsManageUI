<template>
  <div class="app-container-gis">
    <div id="cesiumContainer">
      <!-- <point-map ref="gisMap"></point-map> -->
      <gis-Map ref="gisMap" :type="'carControl'"></gis-Map>
      <!-- 人员轨迹查询 -->
      <div class="rightBox">
        <div style="padding-top: 10px">
          <el-form ref="formSearch" inline>
            <el-form-item label="轨迹时间段">
              <el-date-picker
                v-model="time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="onSearch()">查询</el-button>
              <!-- <el-button  icon="el-icon-refresh-left" @click="onReset()">重置</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pointMap from '@/components/common/map/point-map'
import gisMap from '@/components/common/map/gis-map'

import $blockPersonList from '@/api/executeControl/blockPersonList'

export default {
  name: '',
  components: {
    pointMap,
    gisMap
  },
  data() {
    return {
      time: '',
      pointMapData: []
    }
  },
  watch: {},
  beforeDestroy() {},
  created() {},
  mounted() {},
  methods: {
    onSearch() {
      let obj = {
        ivsId: this.$route.query.ivsId,
        endTime: this.time[1],
        startTime: this.time[0]
      }
      $blockPersonList.trackId(this.$route.query.ivsId, obj).then(res => {
        console.log(`output->data`, res.data)
        console.log(`output->this.$refs`, this.$refs)
        if (!res.data.length) return
        this.$refs.gisMap.addLineFeature(res.data)
        this.$refs.gisMap.mapCenter = [res.data[0].longitude, res.data[0].latitude]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container-gis {
  position: relative;
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
      width: 50%;
      min-width: 350px;
      height: 85%;
      z-index: 100;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      //background-color:#f5f7fa;;
    }
  }
}
</style>
