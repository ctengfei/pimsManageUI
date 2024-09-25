<template>
  <div class="app-container">
    <el-row :gutter="20" v-if='deviceDrawVisible'>
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
        <OrgizeTreeEne
          :isCheck="isCheck"
          :permissionData="{}"
          :hasDevice='hasDevice'
          :deviceType='deviceType'
          @getTableData="getTableData"
          :nodeType='nodeType'
          ref="OrgizeTreeEne" />
      </el-col>
      <el-col :xl="20" :lg="18" :sm="17" :xs="24">
        <!-- 搜索 -->
        <el-form :inline="true" ref="parameter" :model="parameter" v-show="showSearch">
          <el-form-item label="设备区域" prop="address">
            <el-select v-model="parameter.address" clearable placeholder="设备区域" style="width:100PX" @keyup.native.enter="search">
              <el-option
                v-for="item in addresss"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="parameter.name" clearable placeholder="设备名称" style="width:100PX" @keyup.native.enter="search"></el-input>
          </el-form-item>
          <el-form-item label="所属公司" prop="company">
            <el-select filterable v-model="parameter.company" clearable placeholder="所属公司" style="width:100PX" @keyup.native.enter="search">
              <el-option
                  v-for="item in companyDataList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="parameter.deviceType" clearable placeholder="设备类型" style="width:100PX" @keyup.native.enter="search">
              <el-option
                  v-for="item in deviceTypess"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否节能表" prop="saving">
            <el-select v-model="parameter.saving" clearable placeholder="是否节能表" style="width:115PX" @keyup.native.enter="search">
              <el-option
                  v-for="item in savings"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button  @click="search()" type="primary" icon="el-icon-search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button @click="btnRateLook()" type="primary" plain>频率监测</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button @click="exportEXC()" type="warning" plain>导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="initTreeData"></right-toolbar>
        </el-row>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          >
          <el-table-column label="序号" type="index" align="left" />
          <el-table-column prop="name" label="设备名称" align="left" ></el-table-column>
          <el-table-column label="所在区域" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.address == 0" >公共区域</span>
              <span v-else>租户区域</span>
            </template>
          </el-table-column>
          <el-table-column prop="company" label="所属公司" align="left"/>
          <el-table-column label="是否为节能表" align="left" >
            <template slot-scope="scope">
              <span v-if="scope.row.saving == 1" style="color:#18dca7;">是</span>
              <span v-else-if="scope.row.saving == 0" style="color:#f05656;">否</span>
              <span v-else style="color:#f05656;">空</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceId" label="设备编号" align="left" />
          <el-table-column label="状态" align="left" width="70px">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" style="color:#18dca7;">离线</span>
              <span v-else style="color:#f05656;">在线</span>
            </template>
          </el-table-column>
          <el-table-column label="设备类型" align="left" >
            <template slot-scope="scope">
              <span v-if="scope.row.deviceType == 1" style="color:#18dca7;">电</span>
              <span v-else-if="scope.row.deviceType == 0" style="color:#f05656;">水</span>
              <span v-else style="color:#f05656;">空</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="165px">
            <template slot-scope="scope">
                <el-button type="text" @click="onEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" @click="openDialog(scope.row)">手动预警</el-button>
                <el-button type="text" @click="modalHistory(scope.row)">历史数据</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-bottom">
          <pagination
            v-show="tableData && tableData.length > 0"
            :page.sync="parameter.pageNum"
            :total="total"
            :limit.sync="parameter.pageSize"
            :pageSizes="[10, 50, 100]"
            @pagination="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog title="监测频率"
        :visible.sync="isRateLook"
        width="320px">
        <el-radio v-model="radio" label="15">15分钟</el-radio>
        <el-radio v-model="radio" label="30">30分钟</el-radio>
        <el-radio v-model="radio" label="60">1小时</el-radio>
        <span slot="footer">
            <el-button type="primary" @click="sureRateLook(radio)">确定</el-button>
            <el-button plain @click="rateLookDie">取消</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="手动预警"
      width="600px"
      :visible.sync="maintenancePlanShow">
      <el-row>
        <el-form labelWidth="80px" v-model="addFormWarning" ref="addFormWarning">
          <el-form-item label="异常名称" prop="deviceName">
            <el-col>
              <el-input v-model="addFormWarning.title"></el-input>
            </el-col>
          </el-form-item>
          <!-- 必填 -->
          <el-form-item label="设备编号" prop="deviceNum">
            <el-col>
              <el-input v-model="addFormWarning.tagId" disabled></el-input>
            </el-col>
          </el-form-item>
          <!-- 必填 -->
          <el-form-item label="触发位置" prop="deviceNum">
            <el-col>
              <el-input v-model="addFormWarning.location"></el-input>
            </el-col>
          </el-form-item>
          <!-- 必填 -->
          <el-form-item label="告警类型" prop="deviceNum">
            <el-col>
              <el-select v-model="addFormWarning.eventName" style="width:100%">
                <el-option
                  v-for="item in eventNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="告警级别" prop="level">
            <el-col>
              <el-select v-model="addFormWarning.level" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <!-- 必填 -->
          <el-form-item label="触发时间" prop="cycle">
            <el-col>
              <el-date-picker
                style="width:100%"
                v-model="addFormWarning.triggerTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="onHandleTo(addFormWarning)">确定</el-button>
        <el-button plain @click="cancelWarning()">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="historyVisible" title="数值曲线" @ok="()=>{}" width="600px">
        <el-form :inline="true" style="padding-left:50px;" v-model="searchCurveNum" ref="searchCurveNum">
            <el-form-item label="选择时间">
                <el-date-picker
                  v-model="value1"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="onRangePickerChange"
                  :defaultValue="defaultPickerValue"
                  align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="类型">
                <el-select placeholder="请选择类型" style="width: 200px" v-model="searchCurveNum.value">
                    <el-option
                      v-for="item in canTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getHistoryChartData(searchCurveNum)">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <div class="my_Chart">
            <div id="ChartLine" class="my_Chart_item"></div>
        </div>
    </el-dialog>
    <!-- 新增编辑 -->
    <div  v-if='isaddAndEdit' class="addAndEditContainer">
      <addAndEditEnergy ref='addAndEditEnergy' :rowData='rowData' :sysChildType='sysChildType' :deviceinforId='deviceinforId' :dialogVisibleType='dialogVisibleType'  @addAndEditShow="addAndEditShow"></addAndEditEnergy>
    </div>

    <!-- 设备画像组件 -->
    <div  v-if='isdeviceDraw' class="deviceDrawContainer">
      <deviceDraw ref='deviceDraw' :rowData='rowData' :dialogVisibleType='dialogVisibleType' @deviceDrawShow='deviceDrawShow'/>
    </div>
  </div>
</template>
<script>
import { downloadFile } from '@/utils/index'
import moment from "moment";
import echarts from "echarts";
import {handleWarningTo,initLineDataNew,download} from '@/api/smartEnergyAdmin/energyWarning'
import { getDeviceListByTree, getDeviceList} from '@/api/monitor/timemonitor'
import {treeByIdData} from '@/api/facility/information'
import {initData,initCompanyData,rateLookData,rateLookBackView} from '@/api/facility/crameEnergyList'
import {getObjByKey, getStringByKey} from "@/utils/voice.js"
import {location} from "@/utils/map/positionLocation.js"
import OrgizeTree from '@/components/orgnizeTree'
import OrgizeTreeEne from '@/components/orgnizeTreeEne'
import {deepClone} from '@/utils'
import addAndEditEnergy from'./addAndEditEnergy'
import {
  editAbility,
  Delete,
  Administrative,
  UrbanDistrict,
  Area,
  EqNumber,
  MountTree,
  getDataListByType,
  getAddDevice,
  getScan,
  QueryDevice,
  ConfigVideoAnalytic,
  } from '@/api/resource.js'
import pagination from '@/components/comPagination'
var geolocation = null
let colors = ["#7EC0EE",'#66b679',"#12e78c","#FF9F7F", "#FFD700", "#E066FF", "#C0FF3E","#01C2F9","#fe8104","#dd3ee5","#4962FC","#F4CB29","#FD9E06","#C9C9C9"];
export default {
  name: 'Crameenergylist',
   // 设置数据字典
  dicts: ['device_type'],
  components: {
  OrgizeTree,
  OrgizeTreeEne,
  pagination,
  addAndEditEnergy
  },
  props:['sysChildType'],
  data() {
    let startTime = moment().subtract(1, 'day');
    let endTime = moment();
    let defaultPickerValue = [startTime, endTime];
    const self = this;
    return {
      detectionFrequency: '',
      moment,
      startTime: startTime.format('yyyy-MM-DD HH:mm:ss'),
      endTime: endTime.format('yyyy-MM-DD HH:mm:ss'),
      defaultPickerValue: defaultPickerValue,
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      currentId:{},
      value1: '',
      // 数值曲线
      searchCurveNum: {
        startTime: '',
        endTime: '',
        // value1: '',
        value: '1',
        tagId: '',
        // eventName: '',
        // level: '',
        // triggerTime: '',
      },
      timeList: [],
      lineList: [],
      filterSelectType: "Water",
      changeType: "1",
      canTypes: [{
        value: '1',
        label: '按监测频率'
      },{
        value: '2',
        label: '按天'
      }, {
        value: '3',
        label: '按月'
      }, {
        value: '4',
        label: '按年'
      }],
      value1:"",
      historyVisible : false,
      companyDataList:[],
      deviceTypess: [{
        value: '0',
        label: '水'
      }, {
        value: '1',
        label: '电'
      }],
      savings: [{
        value: '0',
        label: '否'
      }, {
        value: '1',
        label: '是'
      }],
      addresss: [{
        value: '0',
        label: '公共区域'
      }, {
        value: '1',
        label: '租户区域'
      }],
      // 告警类型
      eventNames: [{
        value: 'wmConnBroken',
        label: '水表通讯中断'
      }, {
        value: 'emConnBroken',
        label: ' 电表通讯中断'
      }, {
        value: 'wmAbnormal',
        label: ' 水表数据异常'
      }, {
        value: 'emAbnormal',
        label: ' 电表数据异常'
      }],
      // 告警级别
      options: [{
        value: 'normal',
        label: '普通'
      }, {
        value: 'emergency',
        label: '严重'
      }, {
        value: 'veryEmergency',
        label: '非常严重'
      },],
      value: '',
      // 手动预警
      addFormWarning: {
        title: '',
        tagId: '',
        location: '',
        eventName: '',
        level: '',
        triggerTime: '',
      },
      maintenancePlanShow: false,
      //检测频率
      isRateLook:false,
      // tableData每个row的值
      rowData:{},
      // 设备画像是否显示
      deviceDrawVisible: true,
      isaddAndEdit:false,
      isdeviceDraw:false,
      analysisData:{},
      radio: '15',
      record:'',
      photo:'',
      input: '10',
      number:'1',
      intervalTime:'',
      options1:[
        { value: "5", label: "5s" },
        { value: "10", label: "10s" },
        { value: "20", label: "20s" },
        { value: "50", label: "50s" },
        { value: "80", label: "80s" },
        { value: "120", label: "120s"},
      ],
      type:[],
      location: '',
      positionShow:true,
      makerPosition:[],
      stringaddress:"陕西省西安市长安区王寺街道协同创新港",
      position:[108.767817, 34.256492],
      dialogVisible:false,
      equipment:['全部','未挂载','已挂载'],
      equipmentButton :'全部',
      // 新树
      dialogTitle: '收藏夹',
      dialogWidth: '30%',
      districtList: [],
      tagOptions: [],
      allTagsOptions: [], // 收藏tabs的数据
      nodekey: 'id', // 树节点标识
      collectCascaderOptions: [], // 搜索部分级联选择数据
      favouriteList: [],
      tagNode: {},
      timer: null,
      deviceTypeArr:[
        { value: "IPC", label: "IPC" },
        { value: "NVR", label: "NVR" },
      ],
      confirmTitle: '',
      // tabs
      tabList: [
        { label: '组织树', name: 'first' },
        { label: '收藏', name: 'second' }
      ],
      prop: {
        // 树组件相关属性
        children: 'children',
        label: 'name',
        value: 'id',
      },
      isCheck: '',
      isShow: true,
      treeValue: {
        id: '',
        pid: '',
        name: '',
        pname: '',
        PId: ''
      },
      hasDevice:true,
      deviceType:'',
      type: '',
      treeNode: '',
      showCode:true,
      tableData: [],
      ruleForm: {
        regionValue: '',
        industryValue: '',
        identificationValue: '',
        typeValue: '',
        GeneratingCode: '',
        Eqname: '',
        deviceName:'',
        deviceId:'',
        id:'',
        address:'',
        longitude:'',
        latitude:'',
        model:'',
        manufacturer:''
      },
      // 判断是新增还是修改
      dialogVisibleType: "add",
      addRules: {
        identificationValue: [
          { required: true, message: '请选择网络标识', trigger: ['blur', 'change'] }
        ],
        typeValue: [
          { required: true, message: '请选择类型', trigger: ['blur', 'change'] }
        ],
        GeneratingCode: [
          { required: true, message: '请输入设备编码', trigger: ['blur', 'change'] }
        ],
        Eqname: [
          { required: true, message: '请输入链接', trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '请输入设备IP', trigger: 'blur' }
        ]
      },
      editrules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'change' }
        ]
      },
      // 搜索属性
      inputCode: '',
      inputName: '',
      inputType:'',
      Mountstatus: '',
      // options: [],
      // 行政区域
      AreaCode: '',
      // 新增弹框属性
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      cascaderKey: 1,
      // 分页
      total:0,
      pagination: 0,
      TreeData: '',
      deviceData: [],
      parameter: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        // deviceId: '',
        // code:'',
        // type: 'UNMOUNTED',
        // mounted:true,
        address: '',
        company:'',
        deviceType: '',
        saving: '',
        floor: '',
      },
      editdialogVisible:false,
      editRuleForm: {
        id:"",
        deviceId:"",
        name:"",
      },
      queryData: {
        id: '',
        name: '',
        state: '',
        deviceIds: null,
        treeNodes: null
      },
      defaultExpandedKeys: [],
      permissionDataList:[
        {id:1,floorNumber:'一号楼',
         children:[
           {
            id:2,floorNumber:'一层',
            children:[
              {id:3,floorNumber:'IPC-CHENGGKI-4001'}
            ]
           },
           {
            id:4,floorNumber:'二层',
            children:[
              {id:5,floorNumber:'IPC-CHENGGKI-4002'}
            ]
           }
          ]
        },
        {id:6,floorNumber:'二号楼',
         children:[
           {
            id:7,floorNumber:'一层',
            children:[
              {id:8,floorNumber:'IPC-CHENGGKI-4001'}
            ]
           },
           {
            id:9,floorNumber:'二层',
            children:[
              {id:10,floorNumber:'IPC-CHENGGKI-4002'}
            ]
           }
          ]
        },
      ],
      // videoAnalyticDailogShow: false,
      videoAnalyticTypes: [
        {
          value: '',
          name: ''
        },
      ],
      isCrameShow:true,
      deviceParams:[],
      deviceTypes:'',
      deviceIds:[],
      deviceinforId:0,
      nodeType:'',
      showSearch: true
    }
  },
  created() {
    //未挂载
    this.nodeType=this.sysChildType
    this.deviceType=this.sysChildType
    this.isCheck = ''
  },
  computed: {
    editRules() {
      let rules =  {
        ... this.addRules
      }
      return rules
    }
  },
  watch: {
   // 新增编辑校验监听
   dialogAddFormVisible(val) {
      if (val) {
        if (this.dialogVisibleType === 'add') {
          this.$nextTick(_ => {
            this.$refs.ruleForm.clearValidate()
          })
        }
      }
    },
    dialogFormVisible(v){
      if(v === true){
        this.$nextTick(_ => {
            this.$refs.ruleForm.resetFields()
          })
      }
    }
  },
  mounted(){
      // 树数据
    this.Mountstatus='0'
    this.getRateLookBackView(),
    this.initTreeData(),
    this.getInitCompanyData()
  },
  methods: {
    getRateLookBackView(){
      rateLookBackView().then(res=>{
        if(res.data){
          this.radio=res.data.detectionFrequency
        }
      })
    },
    onRangePickerChange(dates, dateStrings) {
      if (dates[1]) {
          this.startTime = dates[0];
          this.endTime = dates[1];
      }
    },
    getHistoryChartData(paw) {
      this.searchCurveNum.tagId = this.currentId.deviceId
      this.searchCurveNum.startTime = this.startTime
      this.searchCurveNum.endTime = this.endTime
      let params = this.searchCurveNum
      initLineDataNew(params).then((res) => {
        this.handleChartData(res.data)
      });  
    },
    // 处理数据
            handleChartData(data) {
                let _this = this;
                let timeList = [];
                let dataList = [];

                data = data || [];
                for (let val of data) {
                  timeList.push(val.payMouth);
                  dataList.push(val.sumValue);
                }
                _this.timeList = timeList;
                _this.lineList = [{
                    name:'',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 8,
                    data: dataList
                }];
                _this.$nextTick(() => {
                    this.ChartLine()
                })
            },
    ChartLine() {
      const self = this;
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("ChartLine"));
      // 指定图表的配置项和数据
      let option = {
          title: {
              left :'center',
              top:'20',
              textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                  fontSize: 16,
                  color: "#333"
              },
          },
          tooltip: {
              trigger: 'axis',
              axisPointer: {    // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
              },
          },
          legend: {
              top:17
          },
          grid: {
              left: '9%',
              right: '11%',
              bottom: '45px',
              containLabel: true
          },
          color: colors,
          borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
          xAxis: {
              type: 'category',
              color: 'red',
              boundaryGap: false,
              data: self.timeList
          },
          yAxis: {
              type: 'value',
              data:self.lineList,
          },
          series: [{
            data:self.lineList[0].data,
            type: 'line'
          }]
      };
      myChart.resize();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    getInitCompanyData(){
      initCompanyData().then(res=>{
        this.companyDataList=res.data
      })
    },
    // 编辑
    onEdit(data){
      this.rowData=data
      this.deviceinforId=data.id
      this.isaddAndEdit=true
      this.isdeviceDraw=false
      this.deviceDrawVisible=false;
      this.dialogVisibleType = 'edit'
    },
    // 手动预警确定
    onHandleTo(addFormWarning) {
      handleWarningTo(addFormWarning).then (res => {
        this.$message.success("添加成功");
        this.maintenancePlanShow = false;
      })
    },
    // 手动预警取消
    cancelWarning() {
      this.maintenancePlanShow = false;
      this.addFormWarning = {
        title: '',
        tagId: '',
        location: '',
        eventName: '',
        level: '',
        triggerTime: '',
      };
    },
    // 手动预警
    openDialog(data) {
      if (data) {
        this.addFormWarning.tagId = data.deviceId;
        this.addFormWarning.location = data.location;
      }
      this.maintenancePlanShow = true;
    },
    //历史数据
    modalHistory(data) {
      this.currentId=data;
      this.historyVisible = true;
      this.getHistoryChartData(data);
    },
    deviceDrawShow(data){
      this.deviceDrawVisible=data[0]
      this.isdeviceDraw=data[1]
    },
    addAndEditShow(data){
      this.deviceDrawVisible=data[0]
      this.isaddAndEdit=data[1]
      this.initTreeData()
    },
    // 返回
    onback(){
      this.deviceDrawVisible=true;
      this.$emit('isCrameEnergyShowBtn',true)
    },
     btnCrameShow(){
       this.$emit('btnCrameShow',true)
    },
    // 监测频率
    btnRateLook(){
       this.isRateLook=true
    },
    rateLookDie(){
       this.isRateLook=false
    },
    sureRateLook(radio){
      let params = {
        frequency : radio
      }
      rateLookData(params) .then(res => {
        this.$message.success("设置成功");
        this.isRateLook=false
      })
      this.getRateLookBackView()
    },
    // 全部挂载与未挂载数据
    initTreeData(){
      let data = this.parameter;
      initData(data).then(res=>{
        this.tableData=res.data.data
        this.total=res.data.total
      })
    },
   // 树节点的点击
    getTableData(data, activeName) {
      if (activeName === 'first') {
        this.parameter.floor = data.id
        let pae = this.parameter
        initData(pae).then(res=>{
          this.tableData=res.data.data
          this.total=res.data.total
        })
      }else{
        // 右侧收藏数数据（待填充）
      }
    },
    // 搜索查询
    search() {
      this.parameter.pageNum = 1
      this.initTreeData()
    },
    resetQuery(){
      this.resetForm('parameter')
      this.search()
    },
    exportEXC(){
      let url = '/pm/hydropower/download'
        let method = "get"
        download(url, method).then(res => {
          this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
        }).catch(err => {
          console.log(err)
        })
    },
    handleChange(value) {
      if (value.length === 1) {
        const data = {
          code: [value[0][0], 1, value[0][2]],
          pageNum: 1,
          pageSize: 200
        }
      }
    },
    // 取消新增
    cancel(ruleForm) {
      this.$refs[ruleForm].resetFields();
      this.dialogFormVisible = false
    },
    // 确定新增
    NewConfirmation() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          open(this.ruleForm.Eqname)
          this.dialogFormVisible = false
        } else {
          return false;
        }
      })
    },
    //确认按钮
    editConfirmation(){
      this.$refs.editRuleForm.validate((valid) => {
        if (valid) {
           if(this.editRuleForm.name != ""){
             if(this.position[0] != "" && this.position[1] != ""){
                this.editRuleForm.longitude = this.position[0]+""
                this.editRuleForm.latitude = this.position[1]+""
                this.editRuleForm.address = this.stringaddress
                this.editdialogVisible = false
             }else{
                this.$message.warning('请输入必填项')
             }
          }else{
              this.$message.warning('请输入必填项')
          }
        } else {
          return false;
        }
      })
    },
    onBlur(obj){
      if(obj.name.trim() != ""){
        let tempObj = {
          id:obj.id,
          deviceId:obj.deviceId,
          name:obj.name
        }
      }else{
          this.$message.warning('请输入设备名称')
      }
    },
    // 获取点击分页页码
    handleCurrentChange(val) {
      this.initTreeData();
    },
  }
}
</script>
<style lang="scss" scoped>
.pagination-container{
  margin-top: 0px;
}
.selfStyle{
  background-color: #d4be35 !important;
}
.equipmentButton{
  width: 270px;
  height: 42px;
  border-radius: 30px;
  background:#313448;
  display: flex;
  cursor: pointer;
   div{
      width: 94px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #afb9d0;
      font-size: 12px;
    }
    .divActive{
      color: #fff;
      border-radius: 30px;
      background: #206aff;
    }
  }
  .videoAnalysis{
    .el-input{
      width:90%;
      padding-left: 10px;
    }
    span{
      color: aqua;
      font-size:14px;
      padding-left: 2px;
    }
    .el-select{
      width:90%;
      padding-left: 10px;
    }
  }
// ::v-deep .app-container-bow{
//     height: calc(100vh - 60px - 10px - 10px);
// }
.goBackBtn{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  clear: both;
  height:80px;
  position: relative;
  top: 10px;
  left: 0;
}
.gobackCls{
  height:27px;
  position: relative;
  top: 0px;
  cursor: pointer;
}
.gobackCls div{
  margin-left:10px;
  font-size: 12px;
}
.video-web-right-box {
  height:100%;
}
// .padding{
//   padding:0 20px;
// }
 .video-web-box {
    margin: 10px;
    height: 100%;
  }
  .table-padding{
    padding:0px 20px 0px 20px;
    height: calc(100vh - 152px);
    display: flex;
    flex-direction: column;
  }
  .photoBox {
    width: 100%;
    height: calc(100vh - 280px);
    display: flex;
    overflow: auto;
    flex-direction: column;
  }
  ::v-deep  .el-table--small .el-table__cell{
    padding: 12px 0;
  }
  ::v-deep  .el-table--small{
      font-size: 12px;
  }
  ::v-deep  .el-pagination {
    // margin-top: 96px;
    margin: 56px 0px 40px 0px;
  }
  .my_Chart {
    width: 100%;
    overflow: auto;
    margin-left: 0;
  }

  .my_Chart_item {
    min-height: 450px;
    color: #fff;
    background-color: rgb(236, 231, 231) !important;
  }
</style>
