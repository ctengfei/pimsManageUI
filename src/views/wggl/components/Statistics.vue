<template>
  <el-row :gutter="10"
          class="xztongjiBox">
    <el-col :xs="24"
            :sm="24"
            :md="24"
            :lg="5"
            :xl="6"
            style="height: 100%">
      <div class="wghTjmain">
        <el-row type="flex"
                align="middle"
                justify="center"
                style="height: 100%; width: 100%">
          <img src="@/assets/images/gridNew.svg"
               style="width: auto; height: auto; max-width: 100%; max-height: 100%" />
          <div>
            <p class="mb-4px w-60px"
               style="white-space: nowrap">网格数量</p>
            <countTo :startVal="0"
                     :endVal="countNum"
                     class="text-size-24px text-blue-500"></countTo>
          </div>
        </el-row>
      </div>
    </el-col>
    <el-col :xs="24"
            :sm="24"
            :md="24"
            :lg="19"
            :xl="18"
            style="height: 100%">
      <div class="wghTjmain">
        <el-row :gutter="20"
                type="flex"
                align="middle"
                justify="center"
                style="height: 100%; width: 100%">
          <el-col :span="6"
                  style="height: 100%">
            <Piechart :wgType="wgldCountNum"
                      :total="countNum"
                      style="height: 100%"></Piechart>
          </el-col>
          <el-col :span="6"
                  style="height: 100%">
            <Piechart :wgType="wgsqCountNum"
                      :total="countNum"
                      style="height: 100%"></Piechart>
          </el-col>
          <el-col :span="6"
                  style="height: 100%">
            <Piechart :wgType="wgzsCountNum"
                      :total="countNum"
                      style="height: 100%"></Piechart>
          </el-col>
          <el-col :span="6"
                  style="height: 100%">
            <Piechart :wgType="wgyhzCountNum"
                      :total="countNum"
                      style="height: 100%"></Piechart>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import Piechart from './PieChart.vue'
export default {
  name: 'wghfCount',
  components: {
    CountTo,
    Piechart
  },
  props: ['countData'],
  data () {
    return {
      countNum: null,
      wgldCountNum: null,
      wgsqCountNum: null,
      wgzsCountNum: null,
      wgyhzCountNum: null
    }
  },
  watch: {
    countData: {
      handler: function (val) {
        this.countNum = val.wgldCountNum + val.wgsqCountNum + val.wgzsCountNum

        this.wgldCountNum = {
          count: val.wgldCountNum,
          title: '联队网格'
        }
        this.wgsqCountNum = {
          count: val.wgsqCountNum,
          title: '社区网格'
        }
        this.wgzsCountNum = {
          count: val.wgzsCountNum,
          title: '专属网格'
        }
        this.wgyhzCountNum = {
          count: val.wgyhzCountNum,
          title: '已绘制网格'
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/xinZengBox.scss';
.wghTjmain {
  background: white;
  width: 100%;
  height: 145px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
