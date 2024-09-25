<!--
 * @Author: renjianwu jwrenx@isstech.com
 * @Date: 2022-10-27 09:33:46
 * @LastEditors: renjianwu jwrenx@isstech.com
 * @LastEditTime: 2022-11-16 16:01:56
 * @FilePath: \pimsManageUI\src\views\smartBuild\energySetting\conditioAlarm\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container-bow">
      <div class="video-web-box">
          <HighlightSquare class="highlight-height-main padding-20">
              <template slot="child">
                  <Tabs @btnclick="btnclick($event)" :btnGroup="btnGroup" :btnChoose="btnChoose" :singleWidth="94"/>
                  <div class="video-content" v-if="!btnChoose">
                      <el-form :inline="true" class="demo-form-inline" ref="serForm" :model="form">
                          <el-form-item label="异常值：">
                              <el-input type="text" v-model="form.temperature"></el-input>
                          </el-form-item>
                          <el-form-item label="报警次数/天：">
                              <el-input type="text" v-model="form.alarmInterval"></el-input>
                          </el-form-item>
                          <el-form-item>
                              <el-button type="primary" >确定</el-button>
                              <el-button >取消</el-button>
                          </el-form-item>
                      </el-form>
                  </div>
                  <div v-else>
                      1
                  </div>
              </template>
          </HighlightSquare>
          
      </div>
  </div>
</template>
<script>
import Tabs from '@/components/commonTabs'
import HighlightSquare from "@/components/HighlightSquare";
import $smartBuild from "@/api/smartBuild";
export default {
  name:'ConditioAlarm',
  components:{
      Tabs,
      HighlightSquare
  },
  data(){
      return {
          btnChoose: 0,
          btnGroup:[
              {
                  label: "阈值",
                  value: "1"
              },
              {
                  label: "温度异常",
                  value: "2"
              }
          ],
          form:{
              temperature: 3,
              alarmInterval: 3
          }
      }
  },
  watch(){},
  mounted(){
      this.getData()
  },
  methods:{
      btnclick(e) {
          this.btnChoose = e.index;
          this.getTableData();
      },
      getData(){
          $smartBuild.getAlarmDifference().then(res=>{
              if(res.code == 200){
                  this.form = res.data
              }else{
                  this.$message.error(res.meta.message)
              }
          })
      }
  },

}
</script>
<style lang="scss" scoped>
.video-content{
  margin-top:30px
}
.video-web-box{
  padding: 20px 20px;
}
</style>