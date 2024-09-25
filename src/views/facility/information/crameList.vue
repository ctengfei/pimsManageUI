<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
        <OrgizeTree
          :isCheck="isCheck"
          :hasDevice="hasDevice"
          :deviceType="deviceType"
          @getTableData="getTableData"
          :nodeType="nodeType"
          ref="orgizeTree"
        />
      </el-col>
      <el-col :xl="20" :lg="18" :sm="17" :xs="24">
          <el-form inline>
            <el-form-item label="设备编号">
              <el-input
                v-model="parameter.code"
                clearable
                placeholder="设备编号"
                @keyup.native.enter="search"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input
                v-model="parameter.name"
                clearable
                placeholder="设备名称"
                @keyup.native.enter="search"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态" v-if="$route.params.deviceType=='nightlighting' || $route.params.deviceType =='camera'">
              <el-select
                v-model="parameter.status"
                clearable
                placeholder="请选择"
                @keyup.native.enter="search"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="挂载状态">
              <el-select
                v-model="Mountstatus"
                >
                <el-option
                  v-for="item in equipment"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="search()" type="primary" icon="el-icon-search">搜索</el-button>
              <el-button @click="reset()" plain icon="el-icon-refresh">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="mb8">
            <!-- <el-button @click="newlyAdded()" icon="el-icon-plus" plain type="primary">新增</el-button> -->
            <el-button @click="btnCrameShow" type="primary" plain icon="el-icon-refresh">同步数据</el-button>
            <el-button
              v-show="Mountstatus== '1'"
              @click="mount()"
              type="primary"
              plain
            >挂载</el-button>
            <el-button
              type="primary"
              plain
              v-show="Mountstatus== '2'"
              @click="unMount()"
            >取消挂载</el-button>
            <el-button @click="exportEXC()" plain type="warning" icon="el-icon-download">导出</el-button>
          </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="left" />
          <el-table-column prop="name" label="设备名称" align="left" show-overflow-tooltip />
          <!-- <el-table-column prop="address" label="所在区域" align="left" show-overflow-tooltip /> -->
          <el-table-column
            prop="code"
            label="设备编号"
            width="100px"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="$route.params.deviceType === 'camera' || $route.params.deviceType === 'nightlighting'"
            label="设备状态"
            align="left"
            width="50px"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" style="color:#18dca7;">在线</span>
              <span v-else style="color:#f05656;">离线</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="type" label="接入类型" align="left" show-overflow-tooltip /> -->
          <el-table-column prop="address" label="安装位置" width="200px" align="left" show-overflow-tooltip />
          <el-table-column prop="deviceManufacturer.name" label="设备厂商" width="200px" align="left" show-overflow-tooltip />
          <el-table-column
            prop="updater"
            label="同步人员"
            align="left"
            width="100px"
            show-overflow-tooltip
          />
          <el-table-column prop="updateTime" label="同步时间" align="left" show-overflow-tooltip />

          <el-table-column label="操作" align="left" width="180px">
            <template slot-scope="scope">
              <el-button
                @click="onDeviceDraw(scope.row)"
                type="text"
              >设备画像</el-button>
              <el-button
                type="text"
                @click="onEdit(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="tableData && tableData.length > 0"
          :total="pagination"
          :page.sync="parameter.pageNum"
          :limit.sync="parameter.pageSize"
          @pagination="handleCurrentChange"
        />
      </el-col>
    </el-row>
    <!-- 新增编辑 -->
    <el-dialog
      :title="editTitle"
      :visible.sync="isaddAndEdit"
     
      width="800px">
      <addAndEdit
        v-if="isaddAndEdit"
        ref="addAndEdit"
        :rowData="rowData"
        :treeData="treeData"
        :deviceinforId="deviceinforId"
        :dialogVisibleType="dialogVisibleType"
        @addAndEditShow="addAndEditShow"
      ></addAndEdit>
      <span slot="footer">
        <el-button type="primary" @click="$refs.addAndEdit.onSubmit()">确 定</el-button>
        <el-button plain @click="$refs.addAndEdit.onCancel()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getDeviceListByTree, getDeviceList } from "@/api/monitor/timemonitor";
import {
  initData,
  treeByIdData,
  unmounted,
  deviceSync,
  download
} from "@/api/facility/information";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { location } from "@/utils/map/positionLocation.js";
import OrgizeTree from "@/components/orgnizeTree";
import { deepClone } from "@/utils";
import addAndEdit from "./addAndEdit";
import { downloadFile } from "@/utils/index";
import {
  editAbility,
  Delete,
  Administrative,
  UrbanDistrict,
  Area,
  EqNumber,
  MountTree,
  Unmount,
  getDataListByType,
  getAddDevice,
  getScan,
  QueryDevice,
  ConfigVideoAnalytic
} from "@/api/resource.js";
var geolocation = null;
export default {
  name: "DeviceData",
  // 设置数据字典
  dicts: ["device_type"],
  components: {
    OrgizeTree,
    addAndEdit
  },
  data() {
    const self = this;
    return {
      // tableData每个row的值
      rowData: {},
      // 设备画像是否显示
      editTitle: '',
      isaddAndEdit: false,
      isdeviceDraw: false,
      analysisData: {},
      radio: "0",
      record: "",
      photo: "",
      input: "10",
      number: "1",
      intervalTime: "",
      options1: [
        { value: "5", label: "5s" },
        { value: "10", label: "10s" },
        { value: "20", label: "20s" },
        { value: "50", label: "50s" },
        { value: "80", label: "80s" },
        { value: "120", label: "120s" }
      ],
      type: [],
      location: "",
      positionShow: true,
      makerPosition: [],
      stringaddress: "陕西省西安市长安区王寺街道协同创新港",
      position: [108.767817, 34.256492],
      dialogVisible: false,
      equipment: [
        {value: '1', label: '未挂载'},
        {value: '2', label: '已挂载'}
      ],
      // 新树
      dialogTitle: "收藏夹",
      dialogWidth: "30%",
      districtList: [],
      tagOptions: [],
      allTagsOptions: [], // 收藏tabs的数据
      nodekey: "id", // 树节点标识
      collectCascaderOptions: [], // 搜索部分级联选择数据
      favouriteList: [],
      tagNode: {},
      timer: null,
      deviceTypeArr: [
        { value: "IPC", label: "IPC" },
        { value: "NVR", label: "NVR" }
      ],
      confirmTitle: "",
      // tabs
      tabList: [
        { label: "组织树", name: "first" },
        { label: "收藏", name: "second" }
      ],
      prop: {
        // 树组件相关属性
        children: "children",
        label: "name",
        value: "id"
      },
      isCheck: "",
      isShow: true,
      treeValue: {
        id: "",
        pid: "",
        name: "",
        pname: "",
        PId: ""
      },
      hasDevice: true,
      deviceType: "",
      type: "",
      treeNode: "",
      showCode: true,
      tableData: [],
      ruleForm: {
        regionValue: "",
        industryValue: "",
        identificationValue: "",
        typeValue: "",
        GeneratingCode: "",
        Eqname: "",
        deviceName: "",
        deviceId: "",
        id: "",
        address: "",
        longitude: "",
        latitude: "",
        model: "",
        manufacturer: ""
      },
      // 判断是新增还是修改
      dialogVisibleType: "add",
      addRules: {
        identificationValue: [
          {
            required: true,
            message: "请选择网络标识",
            trigger: ["blur", "change"]
          }
        ],
        typeValue: [
          { required: true, message: "请选择类型", trigger: ["blur", "change"] }
        ],
        GeneratingCode: [
          {
            required: true,
            message: "请输入设备编码",
            trigger: ["blur", "change"]
          }
        ],
        Eqname: [{ required: true, message: "请输入链接", trigger: "blur" }],
        deviceId: [{ required: true, message: "请输入设备IP", trigger: "blur" }]
      },
      editrules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "change" }]
      },
      // 搜索属性
      inputCode: "",
      inputName: "",
      inputType: "",
      Mountstatus: "2",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: true,
          label: "在线"
        },
        {
          value: false,
          label: "离线"
        }
      ],
      // 行政区域
      AreaCode: "",
      // 新增弹框属性
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      cascaderKey: 1,
      // 分页
      pagination: 0,
      TreeData: "",
      deviceData: [],
      parameter: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        deviceId: "",
        code: "",
        type: "UNMOUNTED",
        mounted: true,
        status: ""
      },
      editdialogVisible: false,
      editRuleForm: {
        id: "",
        deviceId: "",
        name: ""
      },
      queryData: {
        id: "",
        name: "",
        state: "",
        deviceIds: null,
        treeNodes: null
      },
      defaultExpandedKeys: [],
      permissionDataList: [
        {
          id: 1,
          floorNumber: "一号楼",
          children: [
            {
              id: 2,
              floorNumber: "一层",
              children: [{ id: 3, floorNumber: "IPC-CHENGGKI-4001" }]
            },
            {
              id: 4,
              floorNumber: "二层",
              children: [{ id: 5, floorNumber: "IPC-CHENGGKI-4002" }]
            }
          ]
        },
        {
          id: 6,
          floorNumber: "二号楼",
          children: [
            {
              id: 7,
              floorNumber: "一层",
              children: [{ id: 8, floorNumber: "IPC-CHENGGKI-4001" }]
            },
            {
              id: 9,
              floorNumber: "二层",
              children: [{ id: 10, floorNumber: "IPC-CHENGGKI-4002" }]
            }
          ]
        }
      ],
      videoAnalyticTypes: [
        {
          value: "",
          name: ""
        }
      ],
      isCrameShow: true,
      deviceParams: [],
      deviceTypes: "",
      deviceIds: [],
      deviceinforId: 0,
      nodeType: "",
      treeData: []
    };
  },
  created() {
    //未挂载
    this.nodeType = this.$route.params.deviceType;
    this.deviceType = this.$route.params.deviceType;
    this.isCheck = "";
  },
  computed: {
    editRules() {
      let rules = {
        ...this.addRules
      };
      return rules;
    }
  },
  watch: {
    // 新增编辑校验监听
    dialogAddFormVisible(val) {
      if (val) {
        if (this.dialogVisibleType === "add") {
          this.$nextTick(_ => {
            this.$refs.ruleForm.clearValidate();
          });
        }
      }
    },
    dialogFormVisible(v) {
      if (v === true) {
        this.$nextTick(_ => {
          this.$refs.ruleForm.resetFields();
        });
      }
    }
  },
  mounted() {
    // 树数据
    this.search();
  },
  methods: {
    // 设备画像
    onDeviceDraw(data) {
      this.$router.push('/information/deviceDraw/index/' + data.id)
    },
    // 编辑
    onEdit(data) {
      this.isaddAndEdit = true;
      this.editTitle = '编辑设备'
      this.rowData = data;
      this.deviceinforId = data.id;
      this.isdeviceDraw = false;
      this.dialogVisibleType = "edit";
      this.treeData = this.$refs.orgizeTree.arrData;
    },
    addAndEditShow(data) {
      this.deviceDrawVisible = data[0];
      this.isaddAndEdit = data[1];
      this.initTreeData();
    },
    btnCrameShow(e) {
      this.$confirm("确定同步设备数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deviceSync([this.$route.params.deviceType]).then(res => {
            this.$message.success("同步成功！");
            this.initTreeData();
            let target = e.target;
            if (target.nodeName == "I" || target.nodeName == "SPAN") {
              target = e.target.parentNode;
            }
            target.blur();
          });
        })
        .catch(action => {});
    },
    // 全部挂在与未挂载数据
    initTreeData(data) {
      let nodeIds = ''
      if (this.Mountstatus === "1") {
        this.parameter.type = "UNMOUNTED";
        this.parameter.mounted = false;
        nodeIds = ''
      } else if (this.Mountstatus === "2") {
        this.parameter.type = "MOUNTED";
        this.parameter.mounted = true;
        nodeIds = this.treeNode.id
      }
      let params = {
        pageNum: this.parameter.pageNum,
        pageSize: this.parameter.pageSize,
        type: this.$route.params.deviceType,
        mounted: this.parameter.mounted,
        blurryType: "DEVICE_TREE",
        status: this.parameter.status,
        nodeId: nodeIds
      };
      if (data) {
        params.name = data.name;
        params.code = data.code;
      }
      initData("/pm/device/criteria/origin", "GET", params).then(res => {
        this.tableData = res.data.data;
        this.parameter.pageSize = res.data.pageSize;
        this.parameter.pageNum = res.data.pageNum;
        this.pagination = res.data.total;
      });
    },
    // 树节点的点击
    getTableData(data, activeName) {
      let nodeIds = ''
      if (this.treeNode.id !== data.id) {
        this.parameter.pageNum = 1;
        this.parameter.pageSize = 10;
      }
      if (this.Mountstatus === "1") {
        this.parameter.type = "UNMOUNTED";
        this.parameter.mounted = false;
        nodeIds = ''
      } else if (this.Mountstatus === "2") {
        this.parameter.type = "MOUNTED";
        this.parameter.mounted = true;
        nodeIds = data.id
      }
      this.treeNode = data;
      if (activeName === "first") {
        let obj = {
          url: '/pm/device/criteria/origin',
          method: 'GET'
        };
        let params = {
          pageNum: this.parameter.pageNum,
          pageSize: this.parameter.pageSize,
          mounted: this.parameter.mounted,
          name: this.parameter.name,
          blurryType: "DEVICE_TREE",
          nodeId: nodeIds,
          type: this.$route.params.deviceType,
          status: this.parameter.status
        };
        initData(obj.url, obj.method, params).then(res => {
          this.tableData = res.data.data;
          this.pagination = res.data.total;
        });
      } else {
        // 右侧收藏数数据（待填充）
      }
    },
    //  点击表格复选框 获取数据
    handleSelectionChange(val) {
      this.deviceData = [];
      this.deviceParams = [];
      this.deviceIds = [];
      val.map(item => {
        this.deviceParams.push({ deviceId: item.id, deviceName: item.name });
        this.deviceIds.push(item.id);
        this.deviceTypes = item.type;
      });
    },
    // 搜索查询
    search() {
      if (this.Mountstatus === "1") {
        this.parameter.type = "UNMOUNTED";
        this.parameter.mounted = false;
      } else if (this.Mountstatus === "2") {
        this.parameter.type = "MOUNTED";
        this.parameter.mounted = true;
      }
      this.parameter.pageNum = 1;
      let data = {
        name: this.parameter.name,
        code: this.parameter.code
      };
      this.initTreeData(data);
    },
    // 重置
    reset() {
      this.parameter.code = "";
      this.parameter.name = "";
      this.parameter.status = "";
      this.Mountstatus = "2"
      this.parameter.type = "MOUNTED";
      this.parameter.mounted = true;
      this.treeNode = ""
      this.parameter.pageNum = 1;
      let params = {
        pageNum: this.parameter.pageNum,
        pageSize: this.parameter.pageSize,
        type: this.$route.params.deviceType,
        mounted: this.parameter.mounted,
        blurryType: "DEVICE_TREE",
      };
      initData("/pm/device/criteria/origin", "GET", params).then(res => {
        this.tableData = res.data.data;
        this.parameter.pageSize = res.data.pageSize;
        this.parameter.pageNum = res.data.pageNum;
        this.pagination = res.data.total;
      });
    },
    exportEXC() {
      const params = {
        pageNum: this.parameter.pageNum,
        pageSize: this.parameter.pageSize,
        type: this.$route.params.deviceType,
        mounted: this.parameter.mounted,
        blurryType: "DEVICE_TREE",
        name: this.parameter.name,
        code: this.parameter.code
      };
      if (this.treeNode.id) {
        params.nodeId = this.treeNode.id;
      }
      download(params)
        .then(res => {
          // downloadFile(res, "设备列表", "xlsx");
          this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 挂载到树
    mount() {
      // 传递的树id
      if (!this.treeNode) {
        //左侧树任何节点都不选择场景
        this.$message.warning("请先选择需要挂载的树节点");
        return;
      }
      if (this.treeNode.id === "") {
        this.$message.warning("请先选择需要挂载的树节点");
        return;
      } else if (this.deviceParams.length === 0) {
        this.$message.warning("请先选择需要挂载的设备");
        return;
      } else {
        const data = {
          deviceParams: this.deviceParams,
          deviceType: this.deviceTypes,
          nodeId: this.treeNode.id
        };
        treeByIdData("/pm/tree/node/mount", "POST", data)
          .then(res => {
            this.$message.success("挂载成功");
            this.$refs.orgizeTree.getTreeData();
            this.reset();
          })
          // .catch(err => {
          //   this.$message.error(err);
          // });
      }
    },
    // 取消挂载
    unMount() {
      if (!this.deviceIds.length) {
        this.$message.warning("请选择设备！");
        return;
      }
      const data = this.deviceIds;
      const params = this.deviceTypes;
      unmounted("/pm/tree/node/unmount", "DELETE", params, data)
        .then(res => {
          this.$message.success("已取消挂载");
          this.$refs.orgizeTree.getTreeData();
          this.reset();
        })
        // .catch(err => {
        //   this.$message.error(err);
        // });
    },
    // 新增按钮
    newlyAdded() {
      this.editTitle = '新增设备'
      this.isaddAndEdit = true;
      this.isdeviceDraw = false;
      this.deviceDrawVisible = false;
      this.dialogVisibleType = "add";
      Object.keys(this.ruleForm).forEach(x => {
        this.ruleForm[x] = "";
      });
    },
    // 新增取消
    addCancel(ruleForm) {
      this.$refs[ruleForm].resetFields();
      this.dialogAddFormVisible = false;
      Object.keys(this.ruleForm).forEach(x => {
        this.ruleForm[x] = "";
      });
    },
    // 新增确定
    addNewConfirm(ruleForm) {
      if (this.dialogVisibleType === "add") {
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            const data = {
              address: this.stringaddress,
              altitude: "",
              deviceId: this.ruleForm.GeneratingCode,
              ip: this.ruleForm.deviceId,
              latitude: this.position[1],
              longitude: this.position[0],
              manufacturer: this.ruleForm.manufacturer,
              model: this.ruleForm.model,
              name: this.ruleForm.deviceName,
              port: "80",
              transport: "TCP"
            };
          }
        });
      } else {
      }
    },
    // 生成设备编号
    deviceNum() {
      this.dialogFormVisible = true;
      Object.keys(this.ruleForm).forEach(x => {
        this.ruleForm[x] = "";
      });
    },
    handleChange(value) {
      if (value.length === 1) {
        const data = {
          code: [value[0][0], 1, value[0][2]],
          pageNum: 1,
          pageSize: 200
        };
      }
    },
    // 取消新增
    cancel(ruleForm) {
      this.$refs[ruleForm].resetFields();
      this.dialogFormVisible = false;
    },
    // 确定新增
    NewConfirmation() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          open(this.ruleForm.Eqname);
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    //确认按钮
    editConfirmation() {
      this.$refs.editRuleForm.validate(valid => {
        if (valid) {
          if (this.editRuleForm.name != "") {
            if (this.position[0] != "" && this.position[1] != "") {
              this.editRuleForm.longitude = this.position[0] + "";
              this.editRuleForm.latitude = this.position[1] + "";
              this.editRuleForm.address = this.stringaddress;
              // this.editSubmit(this.editRuleForm)
              this.editdialogVisible = false;
            } else {
              this.$message.warning("请输入必填项");
            }
          } else {
            this.$message.warning("请输入必填项");
          }
        } else {
          return false;
        }
      });
    },
    onBlur(obj) {
      if (obj.name.trim() != "") {
        let tempObj = {
          id: obj.id,
          deviceId: obj.deviceId,
          name: obj.name
        };
        // this.editSubmit(tempObj)
      } else {
        this.$message.warning("请输入设备名称");
      }
    },
    // 获取点击分页页码
    handleCurrentChange(val) {
      if (this.treeNode) {
        this.getTableData(this.treeNode, "first");
      } else {
        if (this.Mountstatus === "1") {
          this.parameter.type = "MOUNTED";
          this.parameter.mounted = true;
          this.initTreeData(this.parameter);
        } else {
          this.parameter.type = "UNMOUNTED";
          this.parameter.mounted = false;
          this.initTreeData(this.parameter);
        }
      }
    },
    handleSizeChange(val) {
      this.parameter.pageSize = val.limit;
      if (this.Mountstatus === "1") {
        this.parameter.type = "MOUNTED";
        this.parameter.mounted = true;
        this.initTreeData(this.parameter);
      } else {
        this.parameter.type = "UNMOUNTED";
        this.parameter.mounted = false;
        this.initTreeData(this.parameter);
      }
    }
  }
};
</script>
