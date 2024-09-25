<template>
  <ComDialog ref="presetSetting"
   dialogTitle="预置位设置" 
   dialogWidth="35%"
   @handleDialogClosed="handleDialogClosed"
   >
    <div class="centerBtn">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="addPreset">新增</el-button>
      </div>
    </div>
    <div class="reserve">
    <el-table ref="tableData" height="300" :data="tableData" class="mt" style="overflow: auto;">
      <el-table-column prop="presetIndex" label="序号" width='50' />
      <el-table-column prop="presetName" label="名称"  />
      <!-- <el-table-column prop="presetDefault" label="看守位" >
        <template slot-scope="{row}">
          <span>{{ row.presetDefault === true ? '是' :'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="waitTime" label="等待时间" >
        <template slot-scope="scope">
          <span>{{scope.row.waitTime + 's'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label='操作'>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="设置看守位" placement="top-start">
            <i  style="margin-right:10px;cursor:pointer;color: #01bee5" class="el-icon-setting"  @click="onSetGuardPosition(scope.row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <i  class="el-icon-edit" style="margin-right:10px;cursor:pointer;color: #01bee5" @click="editPrest(scope.row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete" style="cursor:pointer;color:#f05656 " @click="deletePrest(scope.row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 设置看守卫 -->
    <ComDialog
      ref="guardDialog"
      :dialog-title="guarDialogTitle"
      :dialog-width="dialogWidth"
      @handleDialogClosed="handleDialogClosed"
    >
    <div>
      <el-form ref="rulesForm" :rules="rules" :model="guardKey" label-width="90px">
          <el-form-item label="序号" disabled="true">
            <el-input v-model.number="guardKey.guardPosInfo.presetIndex" disabled placeholder="请输入序号" />
          </el-form-item>
          <el-form-item label="等待时间(秒)" prop="guardPosInfo.waitTime">
            <el-input v-model.number="guardKey.guardPosInfo.waitTime" />
          </el-form-item>
        </el-form>
        <div class="el-dialog__footer">
          <div class="dialog-footer">
            <el-button type="primary" :loading="submitLoading" @click="guardonSubmit">保存</el-button>
            <el-button plain @click="guardonCancel">取消</el-button>
          </div>
        </div>
      </div>
    </ComDialog>
    <!-- 添加，编辑预置位-->
    <ComDialog
      ref="comDialog"
      :dialog-title="dialogTitle"
      :dialog-width="dialogWidth"
      @handleDialogClosed="handleDialogClosed"
    >
      <div>
        <el-form ref="ruleForm" :rules="rules" :model="searchKey" label-width="90px">
          <el-form-item label="序号" prop="presetIndex" v-if="this.formType === 'edit'">
            <el-input v-model.number="searchKey.presetIndex" disabled placeholder="请输入序号" />
          </el-form-item>
          <el-form-item label="预置位名称" prop="presetName">
            <el-input v-model="searchKey.presetName"  placeholder="请输入名称" />
          </el-form-item>
        </el-form>
        <div class="el-dialog__footer">
          <div class="dialog-footer">
            <el-button type="primary" :loading="submitLoading" @click="onSubmit">保存</el-button>
            <el-button plain @click="onCancel">取消</el-button>
          </div>
        </div>
      </div>
    </ComDialog>
  </ComDialog>
</template>
<script>
import { onAddPreset, isSetPreset, onDeletePreset, onCallPreset, updatePresetData, getCarInformation, setPreset} from '@/api/monitor/timemonitor'
import ComDialog from '@/components/comDialog'
import Sortable from 'sortablejs'
export default {
  components: {
    ComDialog
  },
  props: {
    playerData: Object,
    deviceObj: Object,
    settingNum: Number
  },
  data() {
    return {
      permission: {
        preset: {url: "/sm/ivs/ptz/preset/position/list", method: "GET"},
        add: {url: "/sm/ivs/ptz/preset/position", method: "POST"},
        // checkpreset: 'monitor::timemonitor::checkpreset',
        setpreset: {url: "/sm/ivs/ptz/guard/position", method: "POST"},
        open: 'monitor::timemonitor::open',
        scan: 'monitor::timemonitor::scan',
        edit: {url: "/sm/ivs/ptz", method: "PUT"},
        delete: {url: "/sm/ivs/ptz/delete/presetPosition", method: "DELETE"}
      },
      submitLoading: false,
      dialogTitle: '新增预置位',
      dialogWidth: '30%',
      searchKey: {
        cameraCode: this.deviceObj.deviceCamera,
        presetName: "",
      },
      selectList: [],
      isDelAbled: true,
      // deviceObj: {},
      rules: {
        presetIndex: [
          { type: 'number', required: true, message: '序号必须小于9' }
        ],
        'guardPosInfo.waitTime': [
          { type: 'number', min:30, max:3600, required: true, message: '时长为30秒～3600秒' }
        ],
      },
      timer: null,
      formType: 'add',
      Id: '',
      guardKey:{
        cameraCode: "",
        guardPosInfo: {
          enableGuardPosition: 1,
          presetIndex: '',
          waitTime: ''
        }
      },
      guarDialogTitle: '设置看守位',
      widowWidth: document.documentElement.clientWidth,
      widowHeight: document.documentElement.clientHeight
      // isEditPreset: false
    }
  },
  computed: {
    isPreset() {
      return this.$store.getters.isPreset
    },
    tableData() {
      let list = this.$store.getters.presetList
      list = list.sort((a, b) => {
        return a.presetIndex - b.presetIndex
      })
      return list
    },
    deviceData() {
      return this.deviceObj
    }
  },
  watch: {
    settingNum(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.timer = setTimeout(_ => {
          this.rowDrop()
        }, 500)
      }
    },
    isShow() {
      if (val) {
        if (this.formType === 'add') {
          this.$nextTick(_ => {
            this.$refs.ruleForm.resetFields()
            this.$refs.ruleForm.clearValidate()
          })
        }
      }
    },
    widowWidth (val) {
      let that = this;
      console.log('实时屏幕宽度', val, that.widowWidth)
    },
    widowHeight (val) {
      let that = this;
      console.log('实时屏幕高度', val, that.widowHeight)
    }
  },
  mounted(){
    this.fetchPresetList()
    this.isShow = this.$refs.presetSetting.dialogVisible
  },
  methods: {
    getCarInformation(){
      getCarInformation().then(res=>{
        console.log(res)
      })
    },
    fetchPresetList() {
      // this.deviceObj = JSON.parse(localStorage.getItem('deviceData'))
      if (this.deviceData === null || this.deviceData.deviceId === '') return
      console.log(this.deviceData.deviceCamera.split("#")[0],'this.deviceData.deviceCamera.split("#")[0]')
      let params = {
        url :this.permission.preset.url,
        method: this.permission.preset.method,
        data: {
          // deviceId: this.player.deviceId
          cameraCode:this.deviceData.deviceCamera.split("#")[0],
          domainCode:this.deviceData.deviceCamera.split("#")[1]
        }
      }
      this.$store.dispatch('time/GetPresetList', params)
      
      // this.$store.dispatch('app/GetPresetList', this.deviceData)
    },
    // 拖拽排序
    rowDrop() {
      // 获取当前表格
      const tbody = this.$refs.tableData.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      const that = this
      // newIndex -- 新下标 oldIndex -- 旧下标
      Sortable.create(tbody, {
        ghostClass: 'sortable-ghost',
        onEnd({ newIndex, oldIndex }) {
          // 移除原来的数据
          const currRow = that.tableData.splice(oldIndex, 1)[0]
          // 移除原来的数据并插入新的数据
          that.tableData.splice(newIndex, 0, currRow)
        }
      })
    },
    // 预设位添加
    addPreset() {
      this.formType = 'add'
      this.dialogTitle = '新增预置位'
      // if (this.tableData.length >= 8) {
      //   this.$message.error('预置位设置只能设置8个')
      //   return
      // }
      // this.searchKey.presetIndex = Math.floor(Math.random()*9)
      // let arr = []
      // this.tableData.map(x => {
      //   arr.push(x.presetIndex)
      // })
      // this.dealNum(arr)
      this.$refs.comDialog.dialogVisible = true
    },
    dealNum(list) {
      if (this.searchKey.presetIndex === 0) {
        this.searchKey.presetIndex = Math.floor(Math.random()*9)
        this.dealNum(list)
      }
      let isTrue = list.some(x => x === this.searchKey.presetIndex)
      if (isTrue) {
        this.searchKey.presetIndex = Math.floor(Math.random()*9)
        this.dealNum(list)
      }
      console.log('this.searchKey.presetNumber--', this.searchKey.presetIndex)
    },
    // 预设位删除
    deletePrest(data) {
      data.cameraCode = this.deviceData.deviceCamera
      let obj={
        cameraCode: this.deviceData.deviceCamera.split("#")[0], 
        domainCode: this.deviceData.deviceCamera.split("#")[1],
        presetIndex: data.presetIndex
      }
      // if (data.presetDefault) return this.$message.error('不能删除当前看守位')
      this.$confirm(`确认删除该条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = this.permission.delete.url
          let method = this.permission.delete.method
          onDeletePreset(url, method,obj).then(res => {
              this.$message.success('删除成功')
              this.fetchPresetList()
            }).catch(err => {
            this.$message.error(err)
          })
        }).catch(() => {
        })
    },
    // 编辑预置位
    editPrest(row) {
      this.formType = 'edit'
      this.dialogTitle = '编辑预置位'
      this.$refs.comDialog.dialogVisible = true
      this.searchKey = row
    },
    // 设置看守位
    onSetGuardPosition(row) {
      this.$refs.guardDialog.dialogVisible = true
      this.guardKey.guardPosInfo.presetIndex = row.presetIndex
      
    },
    _isSetPreset(data) {
      const params = {
        id: data.id || this.Id,
        time: data.resetTime === 0 ? 10 : data.resetTime
      }
      let url = this.$store.getters.btnpremissAll[this.permission.open].url.split('/{')[0]
      let method = this.$store.getters.btnpremissAll[this.permission.open].method
      isSetPreset(url, method, params).then(res => {
        this.$message.success('看守位设置成功')
        this.fetchPresetList()
        this.onCancel()
        this.submitLoading = false
      }).catch(err => {
        console.log('err', err)
        this.$message.error(err)
        this.selectList = []
        this.submitLoading = false
      })
    },
    // 取消
    onCancel() {

      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      this.$refs.comDialog.dialogVisible = false
      
      if(!this.$refs.presetSetting.dialogVisible && !this.$refs.comDialog.dialogVisible){
        let that = this;
        const x = that.widowWidth/2-560, y = that.widowHeight/2-400
        const str0 = { "cmd":"repair_window","x" : x,"y" : y,"w" : 680,"h" : 450,"e_type" : "chrome","time" : "2020-08-17 00:00:00.000","cmd_id" : "001_1 " }
        that.$store.state.socket.Csock.send(JSON.stringify(str0))
      }
      
    },
    // 添加预留位
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // this.deviceObj = JSON.parse(localStorage.getItem('deviceData'))
          if (this.deviceData === null) return
          this.searchKey.cameraCode = this.deviceData.deviceCamera
          // this.submitLoading = true
          if (this.formType === 'add') {
            // this.searchKey.presetDefault = + this.searchKey.presetDefault
            this.onAdd(this.searchKey)
          } else {
            this.onEdit()
          }
        } else {
          return false
        }
      })
    },
    onEdit() {
      let url = this.permission.edit.url
      let method = this.permission.edit.method
      this.submitLoading = true
      let tempData = {
        cameraCode:'',
        ptzPresetInfo: {
          presetIndex: 0,
          presetName: "string",
        }
      }
      tempData.ptzPresetInfo.presetIndex = this.searchKey.presetIndex
      tempData.ptzPresetInfo.presetName = this.searchKey.presetName
      tempData.cameraCode = this.searchKey.cameraCode
      updatePresetData(url, method, tempData).then(res => {
        this.$message.success('编辑成功')
        this.fetchPresetList()
        this.$refs.ruleForm.resetFields()
        this.submitLoading = false
        this.$refs.comDialog.dialogVisible = false
      }).catch(err => {
        this.$message.error(err)
        this.submitLoading = false
        this.$refs.comDialog.dialogVisible = false
      })
    },
    onAdd(data) {
      
      let url = this.permission.add.url
      let method = this.permission.add.method
      this.submitLoading = true
      onAddPreset(url, method, data).then(res => {
        this.$message.success('添加成功')
        this.fetchPresetList()
        this.$refs.ruleForm.resetFields()
        this.submitLoading = false
        this.$refs.comDialog.dialogVisible = false
      }).catch(err => {
        this.$message.error(err)
        this.submitLoading = false
        this.$refs.comDialog.dialogVisible = false
      })
    },
    handleDialogClosed() {
      this.onCancel()
      clearTimeout(this.timer)
      this.timer = null
    },
    guardonCancel(){
      this.$refs.guardDialog.dialogVisible = false
      this.$refs.rulesForm.clearValidate()
      this.$refs.rulesForm.resetFields()

    },
    guardonSubmit(){
      this.guardKey.cameraCode = this.deviceData.deviceCamera
      console.log(this.guardKey," this.guardKey")
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          let url = this.permission.setpreset.url
          let method = this.permission.setpreset.method
          this.submitLoading = true
          setPreset(url, method, this.guardKey).then(res => {
            this.$message.success('添加成功')
            this.fetchPresetList()
            this.$refs.rulesForm.resetFields()
            this.submitLoading = false
            this.$refs.guardDialog.dialogVisible = false
          }).catch(err => {
            this.$message.error(err)
            this.submitLoading = false
            this.$refs.guardDialog.dialogVisible = false
          })
        }
      })
     
    }
  }
}
</script>
