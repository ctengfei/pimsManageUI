<template>
  <el-dialog :title="titleText" width="28%" :visible.sync="dialogFormVisible">
    <el-form :model="ruleForm" :rules="type === 'add'? addRules: editRules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
       <el-form-item label="设备名称" prop="name" >
          <el-select
            style="width: 100%; max-width: 405px;"
              v-model="ruleForm.name"
              filterable
              remote
              reserve-keyword
              placeholder="请输入设备名称"
              :remote-method="getMounteds"
              :disabled="type !== 'add'"
              :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
<!--
          <el-select v-model="ruleForm.name" filterable placeholder="请选择" @change="changeSelect" style="width: 100%; max-width: 405px;">
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select> -->
          <!-- <el-input v-if="type === 'add'" v-model="ruleForm.name" />
          <el-input v-else v-model="ruleForm.name" disabled /> -->
      </el-form-item>
      <el-form-item label="设备编号" prop="deviceId">
          <!-- <el-input v-if="type === 'add'" v-model="ruleForm.deviceId" disabled />  v-else-->
          <el-input  v-model="ruleForm.deviceId" disabled />
      </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-if="type === 'add'"
              style="width:100%"
              v-model="ruleForm.startTime"
              type="datetime"
               is-range
              placeholder="选择日期时间"
              class="time"
              :picker-options="type === 'add' ? pickerOptionsStart : ''"
            />
            <el-date-picker
              v-else
              style="width:100%"
              v-model="ruleForm.startTime"
              type="datetime"
              placeholder="选择日期时间"
              class="time"
              :disabled="editStatus === -1 ? false : true"
            />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
             is-range
            style="width:100%"
            v-model="ruleForm.endTime"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="type === 'add' ? pickerOptionsEnd : ''"
            />
        </el-form-item>
      <el-form-item label="分辨率" prop="resolution">
        <el-select v-if="type === 'add'" v-model="ruleForm.resolution" style="width:100%" placeholder="请选择分辨率">
            <el-option
              v-for="item in resolvingList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
              />
          </el-select>
        <el-input v-else v-model="ruleForm.resolution" :disabled="editStatus === -1 ? false : true" />
      </el-form-item>
      <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onCancel">取消</el-button>
       <el-button plain @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Moment from 'moment'
import { NewPlan, Modify} from '@/api/planningVideo/index.js'
import { getObjByKey,getStringByKey } from "@/utils/voice.js";
import {
  getDataListByType,
  } from '@/api/resource.js'
export default {
  props: {
    titleText:String,
    equimentCode: Object,
  },
  data() {
    return {
      dialogFormVisible: false,
      ruleForm: {
        name:'',
        deviceId: '',
        startTime: '',
        endTime: '',
        resolution: '',
        description: ''
      },

      resolvingList: [
        {
          value: '0',
          label: '标清'
        },{
          value: '1',
          label: '高清'
        }
      ],
      editStatus: '',
      type: '',
      parameter: {
        pageNum: 1,
        pageSize: 10,
        type: 'MOUNTED',
        deviceName: '',
        deviceId: '',
      },
      permission: {
        search:'resource::deviceManage:search',
        edit: "videoMange::planningVideo:edit",
        add: "videoMange::planningVideo:add",
      },
       loading: false,
      options:[]
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val) {
        if (this.type === 'add') {
          this.$nextTick(_ => {
            this.$refs.ruleForm.clearValidate()
          })
        }
      }
    },
    'ruleForm.name'() {
      if (this.options.length > 0) {
        this.$nextTick(() => {
           this.options.forEach(element => {
              if(this.ruleForm.name == element.name){
                this.ruleForm.deviceId =  element.deviceId
              }
            });
        })
      }
    }
  },
  computed: {
      pickerOptionsStart(){
        let hour = new Date().getHours();
        let min = new Date().getMinutes();
         return {
            // 日期选择限制
            disabledDate: time => {
               return time.getTime() < Date.now() - 8.64e7
            },
            // 时间选择限制
            selectableRange: (new Date().toDateString() == new Date(this.ruleForm.startTime).toDateString()) ? hour + ':' + min + ':00 - 23:59:00' : '00:00:00 - 23:59:00'
          };
      },
      pickerOptionsEnd(){
        let that = this;
        let hour = that.ruleForm.startTime ? new Date(that.ruleForm.startTime).getHours() : '00';
        let endhour = that.ruleForm.startTime ? new Date(that.ruleForm.startTime).getHours()+2 : '00';
        let min = that.ruleForm.startTime ? new Date(that.ruleForm.startTime).getMinutes() : '00';
        let seconds = that.ruleForm.startTime ? new Date(that.ruleForm.startTime).getSeconds() : '00';
        let startsseconds = that.ruleForm.startTime ? new Date(that.ruleForm.startTime).getSeconds()+15 : '00';
         return {
            // 日期选择限制
            disabledDate: time => {
               if (that.ruleForm.startTime) {
                 return time.getTime() < new Date(that.ruleForm.startTime).getTime()-(24*60*60*1000)+(15*1000)//禁用开始日期之前的日期
                }
               return time.getTime() < Date.now() - 8.64e7
            },
            // 时间选择限制
            selectableRange: `${new Date(that.ruleForm.startTime).toDateString() == new Date(that.ruleForm.startTime).toDateString() ? hour + ':' + min + ':' + startsseconds + '':'00:00:00'} - ${new Date(that.ruleForm.startTime).toDateString() == new Date(that.ruleForm.startTime).toDateString() ? endhour + ':' + min + ':' + seconds + '':'00:00:00'}`
          };
      },
    addRules() {
      let rules =  {
        name:[
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
        deviceId: [
          { required: true, message: '请选择设备', trigger: 'blur' },
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'blur'},
        ],
        endTime: [
          { required: true, message: '请选择结束日期', trigger: 'blur'},
        ],
        resolution: [
          { required: true, message: '请选择分辨率', trigger: 'blur' }
        ],
        // description: [
        //   { required: true, message: '请填写备注', trigger: 'blur' }
        // ]
      }
      return rules
    },
    editRules() {
      let rules =  {
        ... this.addRules
        //  name:[
        //   { required: true, message: '请输入设备名称', trigger: 'blur' },
        // ],
        // deviceId: [
        //   { required: true, message: '请选择设备', trigger: 'blur' },
        // ],
        // startTime: [
        //   { required: true, message: '请选择开始日期', trigger: 'blur'},
        // ],
        // endTime: [
        //   { required: true, message: '请选择结束日期', trigger: 'blur'},
        // ],
        // resolution: [
        //   { required: true, message: '请选择分辨率', trigger: 'blur' }
        // ],
        // description: [
        //   { required: true, message: '请填写备注', trigger: 'blur' }
        // ]
      }
      return rules
    }
  },
  mounted() {
    this.options = [];
  },
  methods: {
    getMounteds(query){
       if (query !== '' && query.length > 2) {
          this.loading = true;
          this.parameter.deviceName = query
          this.parameter.type ='MOUNTED'
          let url =getStringByKey(this.permission.search,'url')
          let method = getStringByKey(this.permission.search,'method')
          let searchData ={
                url,
                method,
                data:this.parameter
            }
           setTimeout(() => {
            this.loading = false;
              getDataListByType(searchData).then((res)=>{
                if(res.data){
                  this.options = res.data.data
                }
              })
            }, 300);
       }else {
          this.options = [];
        }
    },
    changeSelect(){
      this.options.forEach(element => {
        if(this.ruleForm.name == element.name){
          this.ruleForm.deviceId =  element.deviceId
        }
      });
    },
    updateData(type, data) {
      this.type = type
      if (this.type === 'add') {
        this.ruleForm = {
          name: this.equimentCode.name,
          deviceId: this.equimentCode.code,
          startTime:  new Date() ,
          endTime: '',
          resolution: '',
          description: ''
        }
      } else {
        this.ruleForm = {
          id: '',
          ...this.ruleForm
        }
        this.editStatus = data.status
        for (let key in this.ruleForm) {
          this.ruleForm[key] = data[key]
        }
        this.ruleForm.name = data.deviceName
      }
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
           if(!this.dateSe()){
            this.ruleForm.startTime = ""
            this.ruleForm.endTime = ""
            this.$message.error('结束时间应大于开始时间15秒,并且开始时间应小于结束时间2小时')
            return false
          }
          if (this.type === 'add') {
            // 新增计划录像
            this.onAddPlan()
          } else {
            // 编辑计划录像
            this.onEditPlan()
          }
        } else {
          return false
        }
      })
    },
    dateSe(){
      //时间类比较
      let startTime= new Date(Date.parse(this.ruleForm.startTime)).getTime();
      let endTime=endTime=new Date(Date.parse(this.ruleForm.endTime)).getTime();
      let temptime1 = startTime+(15*1000)
       let temptime2 = startTime+(2*60*60*1000)
        //进行比较
      return  temptime2 >= endTime && endTime >= temptime1
    },
    onAddPlan() {
      this.ruleForm.startTime =  Moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm:ss')
      this.ruleForm.endTime =  Moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm:ss')
      let url = getStringByKey(this.permission.add,'url')
      let method = getStringByKey(this.permission.add,'method')
      NewPlan(url,method,this.ruleForm).then(res => {
        if (res.meta.status === 200) {
          this.$message.success('新增计划录像成功')
          this.$parent.getPagaData()
        } else {
          this.$message.error(res.meta.message)
        }
        this.dialogFormVisible = false
        this.$emit('children',this.dialogFormVisible)
      }).catch(err => {
        this.$message.error(err)
        this.dialogFormVisible = false
      })
    },
    onEditPlan() {
      this.ruleForm.startTime =  Moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm:ss')
      this.ruleForm.endTime =  Moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm:ss')
      let url = getStringByKey(this.permission.edit,'url')
      let method = getStringByKey(this.permission.edit,'method')
      Modify(url,method,this.ruleForm).then(res => {
        if (res.meta.status === 200) {
          this.$message.success('编辑计划录像成功')
          this.$parent.getPagaData()
        } else {
          this.$message.error(res.meta.message)
        }
        this.dialogFormVisible = false
      }).catch(err => {
        this.$message.error(err)
        this.dialogFormVisible = false
      })
    },
    onCancel() {
      this.dialogFormVisible = false
      this.$refs.ruleForm.clearValidate()
      this.$emit('children',this.dialogFormVisible)
    },
  }
}
</script>
<style>
</style>
