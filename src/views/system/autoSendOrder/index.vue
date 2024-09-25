<template>
  <div class="app-container">
    <el-form ref="formSearch" :model="formSearch" :rules="rules" labelWidth="120px">
      <el-form-item prop="enableForWorkTime" label="工作时间">
        <el-switch
          v-model="formSearch.enableForWorkTime"
          active-text="自动派单"
          active-color="#13ce66"
          inactive-text="手动派单"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-form-item>
      <div style="display: flex;" v-for="(item,index) in this.formSearch.assignUserDtos" :key="index">
        <el-form-item :prop="`assignUserDtos.${index}.alarmLevel`" label="告警级别：">
          <div style="display: flex;">
            <p style="color: #303133;margin: 0;margin-right: 120px;">{{item.alarmLevel == 'normal' ? '普通告警' : item.alarmLevel == 'emergency' ? '严重告警' : '紧急告警' }}</p>
          </div>
        </el-form-item>
        <el-form-item :prop="`assignUserDtos.${index}.nameStr`" label="自动接单人：" :rules="rules.nameStr">
            <div style="display: flex;">
              <p :style="[{color:item.nameStr ? '#606266' : '#b4b6bb'}]" style="color: #303133;width: 300px;margin:0 20px 0 0;">
                <span>  
                  {{ item.nameStr ? item.nameStr : '尚未选择自动接单人' }}
                </span>
              </p>
              <el-button type="primary" @click="addDialog(index)" :disabled="addPersonDis">选择接单人</el-button>
            </div>
        </el-form-item>
      </div>
      <el-form-item label="工作时间" style="margin-bottom:10px" required>
        <div v-for="(item,index) in formSearch.time" :key="index">
          <el-form-item :prop="'time.' + index" :rules="rules.time">
              <el-time-picker
                v-model="item.time"
                :clearable="false"
                is-range
                format="HH:mm"
                value-format="HH:mm"
                :maxTime="item.mintime"
                style="width: 240px"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="pickTimes(index,item)"
              ></el-time-picker>
              <el-button v-if="index > 0" type="danger" @click="delTime(item,index)" style="padding:10px 12px">-</el-button>
              <el-button v-else type="primary" @click="addTime" style="padding:10px">+</el-button>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save()">保存</el-button>
      </el-form-item>
    </el-form>
     <!-- 选择负责人 -->
    <el-dialog
      :title="title"
      :visible.sync="sendShow"
      width="850px"
      :before-close="cancel"
    >
        <ComDeptUser v-if="sendShow" ref="comDeptUsers" :isMultipSelect="false" @selectClick="selectClick"/>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit()"
          >确定</el-button
        >
        <el-button plain @click="cancel()"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getsetting, addsetting } from "@/api/system/autosendorder.js";
import { getUser } from "@/api/smartProperty/maintenancePlan.js";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { getUser1 } from "@/api/system/user";
import ComDeptUser from "@/components/comDeptUser"
export default {
  name: "AutoSendOrder",
  components: {
      ComDeptUser
    },
  data() {
    const confirmPass = (rule, value, callback) => {
      if (value) {
        var rules = rule.field
        let index = parseInt(rules.substr(rules.length - 1, 1))
        let temp = this.formSearch.time
        console.log(this.formSearch.time,'this.formSearch.time')
        if(value.time[0]){
          if(!index){
            if(this.timeDifference(value.time[0],value.time[1])) {
              callback();
            } else {
              callback(new Error("开始时间不能大于等于结束时间"));
            }  
          }else{
            if(this.timeDifference(temp[index-1].time[1],value.time[0])) {
              callback();
            } else {
              callback(new Error("该时间段与其他时间段存在重复"));
            }  
          }
        }else{
          callback(new Error("请选择工作时间"));
        }
      }
    }
    return {
      formSearch: {
        assignUserDtos:[
          {
            alarmLevel:"normal",
            nameStr:"",
            assignPersonDtos:[
              {
                userId:"",
                userName:"",
                userPhone:"",
              }
            ]
          },
          {
            alarmLevel:"emergency",
            nameStr:"",
            assignPersonDtos:[
              {
                userId:"",
                userName:"",
                userPhone:"",
              }
            ]
          },
          {
            alarmLevel:"very_emergency",
            nameStr:"",
            assignPersonDtos:[
              {
                userId:"",
                userName:"",
                userPhone:"",
              }
            ]
          }
        ],
        enableForWorkTime: false,
        userId: "",
        workTimes:[],
        name:'',
        time: [{
          id:0,
          time:['','']
        }],
      },
      userInfo: [],
      userInfoList: [],
      addPersonDis:false,
      personId: "",
      sendShow: false,
      title:"选择接单人",
      rules: {
        name: [
          {
            required: true,
            validator: this.confirmPeople,
            trigger: ["blur", "change"],
          },
        ],
        enableForWorkTime: [
          {
            required: true,
            message: "请选择是否开启自动派单",
            trigger: ["blur", "change"],
          },
        ],
        nameStr:[
        {
            required: true,
            message: "请选择自动派单人",
            trigger: ["blur", "change"],
          },
        ],
        time: [
          {
            required: true,
            validator: confirmPass,
            trigger: ["blur", "change"],
          },
        ],
      },
      userName: '',
      assignUserIndex: null,
      userArr: [],
      normalName:''
    };
  },
  created() {
    this.getData();
    // this.getUser();
  },
  methods: {
    addDialog(index){
      this.sendShow = true
      this.addPersonDis = false
      this.assignUserIndex = index
    },
    // 获取人员id
    selectClick($e){
      this.userArr = $e
      console.log($e,"person")
      this.formSearch.assignUserDtos[this.assignUserIndex].assignPersonDtos = $e
      // this.personId = $e
      // this.formSearch.userId = $e[0]
    },
    // 添加人员
      onSubmit() {
        // let self = this
        let temp = this.userArr.map(item=>{
          return item.userName
        })
        // console.log(this.assignUserIndex,"this.assignUserIndex")
        // console.log(this.formSearch.assignUserDtos[this.assignUserIndex],"this.formSearch.assignUserDtos[this.assignUserIndex]")
        this.$nextTick(()=>{
          this.formSearch.assignUserDtos[this.assignUserIndex].nameStr = temp.join(",")
          // this.$set(this.formSearch.assignUserDtos[this.assignUserIndex], 'nameStr', temp.join(","))
        })
        this.sendShow = false
      },
      cancel() {
        
        this.sendShow = false;
        // this.getUserInfo();
        // this.$refs.addForm.resetFields()
      },
    // 删除时间段
    delTime(item,index){
        if(this.formSearch.time.length<=1){//如果只有一个输入框则不可以删除
          return false
        }
        this.formSearch.time.splice(index,1)//删除了数组中对应的数据也就将这个位置的输入框删除
    },
    // 添加时间段
    addTime(item){
      let sum = this.formSearch.time.length
      if(this.formSearch.time.length <9){
        this.formSearch.time.push(//增加就push进数组一个新值
          {
            id:sum ++,
            time:['','']
          }
        )
      }else{
        this.$message.error("最多添加9个")
      }
    },
    confirmPeople(rule, value, callback) {
      if (value) {
        callback();
      } else {
        callback(new Error("请选择自动接单人"));
      }
    },
    
    // 计算时间大小
    timeDifference(startTime,endTime){ 
      var start1=startTime.split(":");
      var startAll=parseInt(start1[0]*60)+parseInt(start1[1]);
      
      var end1=endTime.split(":");
      var endAll=parseInt(end1[0]*60)+parseInt(end1[1]);
      
      // console.log("时间差==="+(endAll-startAll));
      return endAll-startAll > 0
    },
    // 选中时间
    pickTimes(index,date){
      date.mintime = date.time[1]
      // if (this.timeDifference(this.formSearch.time[index-1].time[1],date.time[0])) {
        
      // } else {
      //   this.$message.error("请选择工作时间")
      //   console.log("else")
      // }
    },
    save() {
      this.$refs["formSearch"].validate((valid) => {
        if (valid) {
          this.formSearch.time.map((item,index)=>{
            item.workStartTime = item.time[0]
            item.workEndTime = item.time[1]
          })
          this.formSearch.workTimes = this.formSearch.time
          let data = this.formSearch;
          delete data.workTimes.time;
          addsetting(data).then((res) => {
            this.$message.success("保存成功");
          });
        } else {
          console.log("444");
        }
      });
    },
    getData() {
      getsetting().then((res) => {
        this.formSearch.enableForWorkTime = res.data.enableForWorkTime;
        // 判断是都第一次设置自动派单人员
        if(res.data.assignUserDtos.length){
          this.formSearch.assignUserDtos = res.data.assignUserDtos
          this.formSearch.assignUserDtos.forEach(item=>{
            let name = "";
            item.assignPersonDtos.forEach(items=>{
              if(name){
                name = name + "," + items.userName
              }else{
                name = items.userName
              }
            })
            item.nameStr = name
          })
          console.log(this.formSearch.assignUserDtos,"this.formSearch.assignUserDtos")
        }
        // this.formSearch.userId = res.data.userId;
        // this.formSearch.name = res.data.userNickName;
        let tempWork = res.data.workTimes;
        if(res.data.workTimes.length >0){
          tempWork.map((item,index,arr)=>{
            item.id = index
            item.time = [item.workStartTime,item.workEndTime]
            if(index !== 0){
              item.mintime = arr[index-1].workEndTime
            }else{
              item.mintime = item.workEndTime
            }
            
          })
          this.$set(this.formSearch, "time", tempWork)
        }
        
      });
    },
    getUser() {
      let obj = {
        url: '/sys/user',
        method: 'GET'
      }
      let data = {
        pageNum: 1,
        pageSize: 99999,
      };
      getUser(obj.url, obj.method, data).then((res) => {
        this.userInfo = [];
        this.userInfoList = [];
        this.userInfoList = res.data.data;
        for (const item of this.userInfoList) {
          this.userInfo.push({
            value: item.nickname,
            id: item.id.toString(),
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
}
.savebtn {
  position: absolute;
  left: 120px;
  top:90%;
}
</style>
