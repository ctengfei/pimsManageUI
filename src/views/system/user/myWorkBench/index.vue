<template>
    <div class="app-container">
      <div style="display:flex;align-items: center;justify-content: space-around;height: 150px;">
        <div v-for="(item,index) in allWork" :key="index">
          <el-progress
            color="#206aff"
            type="circle"
            :percentage="setItemProgress(item)"
            :format="setItemText(item)"
            :stroke-width="10"
            :width="80"
          ></el-progress>
          <p style="text-align: center;">{{item.name}}</p>
        </div>
      </div>
      <Tabs @btnclick="btnclick($event)" :btnGroup="btnGroup" :btnChoose="btnChooseIndex" :singleWidth="130" class="mb20" />
     
      <div v-if="btnChooseIndex == '1'">
        <TaskOrder/>
      </div>
      <div v-if="btnChooseIndex == '0'">
        <WorkOrder/>
      </div>
      <div v-if="btnChooseIndex == '2'">
        <NoMess @remark="getTodoCenter"/>
      </div>
     
    </div>
</template>

<script>

import Tabs from '@/components/commonTabsUser'
import NoMess from "./../components/noMessage.vue"
import TaskOrder from "./../components/taskOrder.vue"
import WorkOrder from "./../components/workOrder.vue"
import ComCard from "@/components/comCard"
import messApi from "@/api/needMess"

export default {
  name: 'myWorkBench',
  components:{
    Tabs,
    NoMess,
    TaskOrder,
    WorkOrder,
    ComCard
  },
  data() {
    return {
      btnChooseIndex: 0,
      btnGroup: [
        {
          value: 'DOING',
          label: "处理中工单"
        },
        {
          value: 'DOING',
          label: "处理中任务"
        },
        {
          value: 'DONE',
          label: "未读消息"
        },
      ],
      allWork:[],
      
    }
  },
  computed: {
   
  },
  created() {
   
  },
  mounted() {
    // this.btnChoose = localStorage.getItem("btnChooseIndex") ? localStorage.getItem("btnChooseIndex") : "0"
    this.getTodoCenter()
  },
  methods: {
    getTodoCenter(){
      messApi.getTodoCenter().then(res=>{
        
          this.allWork = res.data
        
      })
    },
    setItemProgress(data) {
      return parseInt(data.value.toFixed(1))
    },
    setItemText(row) {
      if (!row.value) {
          return () => {
            return 0 + "";
          };
        }
        return () => {
          return row.value > 100000 ? (parseInt(row.value/10000) + 'w') : row.value
        }
    },
    btnclick(e) {
      this.btnChooseIndex = e.index
      this.status = e.item.value
    },
    routerClick(e){}
  
  },
}
</script>

<style  lang="scss" scoped>
 ::v-deep.el-progress--circle .el-progress__text, .el-progress--dashboard .el-progress__text {
    font-size: 20px !important;
  }

    ::v-deep.wl-transfer .el-tree {
    background-color: inherit;
  }

  ::v-deep.wl-transfer .transfer-title {
    background-color: inherit;
    color: #fff;
  }
  .color {
    color: #206aff;
  }
</style>
