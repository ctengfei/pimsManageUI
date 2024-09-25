<template>
  <div style="margin-top:20px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="设备检修记录" name="service">
        <el-table height="250" :data="serviceData">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="alarm.businessName" label="维修类型" />
          <el-table-column prop="alarm.eventName" label="维修分类" />
          <el-table-column prop="content" label="维修内容" />
          <el-table-column prop="alarm.address" label="维修位置" />
          <el-table-column prop="submitTime" label="维修时间" />
          <el-table-column prop="statusStr" label="状态" />
          <el-table-column prop="processorName" label="责任人" />
          <el-table-column prop="processorPhone" label="联系电话" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="设备运行记录" name="run">
        <el-table height="250" :data="runData">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="collectTime" label="采集时间" />
          <el-table-column prop="statusStr" label="设备状态" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="设备告警记录" name="alarm">
        <el-table height="250" :data="alarmData">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="alarmName" label="告警名称" />
          <el-table-column prop="triggerTime" label="告警时间" />
          <el-table-column prop="location" label="告警地点" />
          <el-table-column prop="alarmLevelStr" label="告警级别" />
          <el-table-column prop="processer" label="处理人员" />
          <el-table-column prop="processerPhone" label="手机号" />
          <el-table-column prop="content" label="备注信息" />
          <el-table-column prop="processStatusStr" label="处理结果" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="设备维保记录" name="ensure">
        <el-table height="250" :data="ensureData">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="maintenanceDay" label="日期" />
          <el-table-column show-overflow-tooltip prop="deviceCode" label="设备编号" />
          <el-table-column prop="deviceTypeStr" label="设备名称" />
          <el-table-column prop="content" label="维修内容" />
          <el-table-column prop="maintenanceContacter" label="维修责任人" />
          <el-table-column prop="maintenanceContacterPhone" label="手机号" />
          <el-table-column prop="maintenanceResult" label="维修结果" />
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="设备操作记录" name="operation">
        <el-table height="290" :data="operationData">
              <el-table-column prop="operator" label="用户名" />
              <el-table-column prop="clientIp" label="IP" />
              <el-table-column prop="description" label="操作描述" />
              <el-table-column prop="browser" label="浏览器" />
              <el-table-column prop="createTime" label="操作时间" />
            </el-table>
      </el-tab-pane> -->
      <el-tab-pane label="巡检记录" name="operation">
        <el-table height="250" :data="operationData">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="operator" label="巡检时间" />
          <el-table-column prop="clientIp" label="巡检内容" />
          <el-table-column prop="description" label="巡检结果" />
          <el-table-column prop="browser" label="巡检描述" />
          <el-table-column prop="createTime" label="巡检位置" />
          <el-table-column prop="createTime" label="巡检责任人" />
          <el-table-column prop="createTime" label="联系电话" />
          <el-table-column prop="createTime" label="巡检照片" />
          <el-table-column prop="createTime" label="巡检视频" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="formSearch.pageNum"
      :limit.sync="formSearch.pageSize"
      @pagination="handleCurrentChange"
    />
  </div>
</template>

<script>
import tableTabApi from '@/api/facility/tableTab'
import {initData,unmounted} from '@/api/facility/information'
export default {
  components:{
    },
    props:['rowDataId'],
  data() {
      return {
         // tableData每个row的值
          rowData:{},
         // 总数量
          total: 0,
          formSearch: { // 搜索的表单
            deviceId:this.rowDataId,
            deviceCode:'',
            pageNum: 1,
            pageSize: 5
          },
        activeName: 'service',
        serviceData: [// 设备检修记录
         
        ], 
        runData: [// 设备运行记录
          
        ], 
        alarmData: [// 设备告警记录
         
        ], 
        ensureData: [// 设备维保记录
         
        ], 
         operationData: [// 设备操作记录
         
        ], 
        tabIndex:0
      }
    },
    created(){
      let params={
        id:this.$route.params.deviceId
      }
      initData('/pm/device','GET',params).then(res=>{
          // this.descriptions=res.data
          this.formSearch.deviceCode = res.data.code
          this.queryAlarmOrderBy(this.formSearch)
      })
      
    },
    methods: {
      handleCurrentChange(){
        // this.getDeviceInsp(this.formSearch)
        if(this.tabIndex == 0){
          // this.formSearch.deviceCode = this.rowCode
          this.queryAlarmOrderBy(this.formSearch)
        }else if(this.tabIndex == 1){
          this.getDeviceRunHistory(this.formSearch)
        }else if(this.tabIndex == 2){
          this.getDeviceAlarm(this.formSearch)
        }else if(this.tabIndex == 3){
          this.getDeviceRecode(this.formSearch)
        }else{
          this.getDeviceDeviceOperate(this.formSearch)
        }
      },
      handleClick(tab, event) {
        if(tab.index == 0){
          this.tabIndex = 0
          this.queryAlarmOrderBy(this.formSearch)
        }else if(tab.index == 1){
          this.tabIndex = 1
          this.getDeviceRunHistory(this.formSearch)
        }else if(tab.index == 2){
          this.tabIndex = 2
          this.getDeviceAlarm(this.formSearch)
        }else if(tab.index == 3){
          this.tabIndex = 3
          this.getDeviceRecode(this.formSearch)
        }else{
          this.tabIndex = 4
          this.getDeviceDeviceOperate(this.formSearch)
        }
        
      },
      // 维修记录
      queryAlarmOrderBy(item){
        tableTabApi.queryAlarmOrderBy(item).then(res=>{
          this.serviceData = res.data.data
          this.total = res.data.total
        })
      },
      // 检修画像
      getDeviceInsp(item){
        tableTabApi.getDeviceInsp(item).then(res=>{
          this.serviceData = res.data.data
          this.total = res.data.total
        })
      },
      // 设备运行
      getDeviceRunHistory(item){
        tableTabApi.getDeviceRunHistory(item).then(res=>{
          this.runData = res.data.data
          this.total = res.data.total
        })
      },
      // 告警画像
      getDeviceAlarm(item){
        tableTabApi.getDeviceAlarm(item).then(res=>{
          this.alarmData = res.data.data
          this.total = res.data.total
        })
      },
      // 维保画像
      getDeviceRecode(item){
        item.isDone=true
        tableTabApi.getDeviceRecode(item).then(res=>{
          this.ensureData = res.data.data
          this.total = res.data.total
        })
      },
      // 操作记录
      getDeviceDeviceOperate(item){
        tableTabApi.getDeviceDeviceOperate(item).then(res=>{
          this.operationData = res.data.data
          this.total = res.data.total
        })
      }
    }
 }
</script>

<style scoped>
::v-deep .el-pagination {
    margin-top: 64px;
}
</style>