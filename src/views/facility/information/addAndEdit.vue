<template>
  <div>
    <span class="clearfixsTitle">基本信息</span>
    <el-form
      ref="deviceForm"
      :model="submitFormData"
      :rules="devicerule"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备类型" prop="belongSubsystem">
            <el-input
              v-model="submitFormData.belongSubsystem"
              disabled
              placeholder="请输入设备类型"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="name">
            <el-input
              v-model="submitFormData.name"
              placeholder="请输入设备名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备编码" prop="code">
            <el-input
              v-model="submitFormData.code"
              placeholder="请输入设备编码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备IP" prop="ip">
            <el-input
              v-model="submitFormData.ip"
              placeholder="请输入设备IP"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格型号" prop="model">
            <el-input
              v-model="submitFormData.model"
              placeholder="请输入规格型号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属园区" prop="area">
            <el-select
              v-model="submitFormData.area"
              placeholder="请选择园区"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in carGroup"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="submitFormData.type === 'camera'">
          <el-form-item label="所在区域" prop="region">
            <el-select
              v-model="submitFormData.region"
              placeholder="请选择所在区域"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in regionArr"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <el-input v-model="submitFormData.region" placeholder="请选择所在区域" clearable/> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装位置" prop="address">
            <el-input
              v-model="submitFormData.address"
              placeholder="请输入安装位置"
              clearable
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="设备型号" prop="model">
            <el-input v-model="submitFormData.model" placeholder="请输入设备型号" clearable/>
          </el-form-item>
        </el-col> -->
        <el-col
          :span="12"
          v-if="
            submitFormData.type === 'boiler' ||
            submitFormData.type === 'barrierGate' ||
            submitFormData.type === 'elevator' ||
            submitFormData.type === 'airConditioning' ||
            submitFormData.type === 'freshAirSystem' ||
            submitFormData.type === 'camera'
          "
        >
          <el-form-item label="附近摄像头" prop="monitorStr">
            <el-input
              v-model="submitFormData.monitorStr"
              placeholder="请输入附近摄像头"
              @focus="showCameraFn"
              @clear="clearCarmera"
              clearable
              :title="submitFormData.monitorStr"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经纬度" prop="latitudes">
            <el-input
              v-model="submitFormData.latitudes"
              placeholder="请选择经纬度"
              @focus="latitudeChoose()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理责任人" prop="head">
            <el-input
              v-model="submitFormData.head"
              placeholder="请输入管理责任人"
            />
          </el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item label="CAD图纸命名" prop="cadName">
            <el-input
              v-model="submitFormData.cadName"
              placeholder="请输入CAD图纸命名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备描述" prop="description">
            <el-input
              type="textarea"
              placeholder="请输入设备描述"
              v-model="submitFormData.description"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="submitFormData.type === 'camera'">
          <el-form-item label="设备标签" prop="description">
            <div class="radioBtn">
              <el-radio-group v-model="submitFormData.tag" size="small">
                <el-radio-button
                  :label="item.value"
                  v-for="(item, index) in tageArr"
                  :key="index"
                  >{{ item.name }}</el-radio-button
                >
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="设备照片" prop="picture">
            <div>只能上传jpg/png文件</div>
            <el-upload
              class="avatar-uploader"
              :action="action"
              :headers="{
                'Client-Type': 'manageWeb',
                Authorization: 'Bearer ' + $store.state.user.token,
              }"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="parkImgUrl"
                :src="NET.BASE_URL + parkImgUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span class="clearfixsTitle">设备厂商信息</span>
    <!-- <span class='colors' @click='changshang'>【选择厂商信息】</span> -->
    <el-form
      ref="manufacturerForm"
      :model="deviceManufacturer"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="设备厂商"
            prop="name"
            :rules="[
              {
                required: true,
                message: '请输入设备厂商名称',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceManufacturer.name"
              placeholder="请输入设备厂商名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="联系人"
            prop="contacter"
            :rules="[
              {
                required: true,
                message: '请输入厂商联系人',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceManufacturer.contacter"
              placeholder="请输入厂商联系人"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="联系电话"
            prop="phone"
            :rules="[
              {
                required: true,
                message: '请输入联系电话',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceManufacturer.phone"
              placeholder="请输入联系电话"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="地址"
            prop="address"
            :rules="[
              {
                required: true,
                message: '请输入厂商地址',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceManufacturer.address"
              placeholder="请输入厂商地址"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span class="clearfixsTitle">维保单位信息</span>
    <!-- <span class='colors' @click='maintenance'>【选择维保信息】</span> -->
    <el-form
      ref="maintenanceForm"
      :model="deviceMaintenance"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="维保单位"
            prop="maintenanceCompany"
            :rules="[
              {
                required: true,
                message: '请输入维保单位名称',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceMaintenance.maintenanceCompany"
              placeholder="请输入维保单位名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="责任人"
            prop="maintenanceContacter"
            :rules="[
              {
                required: true,
                message: '请输入维保单位责任人',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceMaintenance.maintenanceContacter"
              placeholder="请输入维保单位责任人"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="联系电话"
            prop="phone"
            :rules="[
              {
                required: true,
                message: '请输入联系电话',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceMaintenance.phone"
              placeholder="请输入联系电话"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="地址"
            prop="address"
            :rules="[
              {
                required: true,
                message: '请输入维保单位地址',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceMaintenance.address"
              placeholder="请输入维保单位地址"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="维保年限"
            prop="maintenanceLife"
            :rules="[
              {
                required: true,
                message: '请输入维保年限',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceMaintenance.maintenanceLife"
              placeholder="请输入维保年限"
              clearable
            />
          </el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item
            label="维保截止日期"
            prop="maintenanceDeadline"
            :rules="[
              {
                required: true,
                message: '请输入维保截止日期',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-date-picker
              style="width: 100%"
              v-model="deviceMaintenance.maintenanceDeadline"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="维保倒计时"
            prop="maintenanceCountdown"
            :rules="[
              {
                required: true,
                message: '请输入维保倒计时',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              v-model="deviceMaintenance.maintenanceCountdown"
              placeholder="请输入维保倒计时"
              clearable
              :disabled="true"
            />
          </el-form-item> </el-col
        >
      </el-row>
    </el-form>
    <!-- <div style="text-align: right;">
      <el-button type="primary" icon='el-icon-check' @click="onSubmit()">确定</el-button>
      <el-button plain icon='el-icon-close' @click="onCancel">取消</el-button>
    </div> -->
    <el-dialog
      title="设备厂商"
      :visible.sync="addPersonDialogShow"
      :modal="false"
      :before-close="closeAddPersonDialog"
      width="800px"
    >
      <div class="mb20">
        <!-- 搜索 -->
        <el-input
          v-model="blurry"
          clearable
          style="width: 210px; margin-right: 10px"
          placeholder=" 请输入厂商名称 "
        />
        <el-button icon="el-icon-search" @click="search()" type="primary"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="reset()" plain
          >重置</el-button
        >
      </div>
      <el-table
        ref="manufacturer"
        height="530"
        element-loading-text="加载中"
        :data="manufacturerInforData"
        @row-click="selectChange"
        @select="selectChanges"
      >
        <el-table-column type="selection" width="50">
          <!-- <template slot-scope="scope">
            <el-radio v-model="radios" :label="scope.row.id">&nbsp;</el-radio>
          </template> -->
        </el-table-column>
        <el-table-column prop="name" label="设备厂商名称" />
        <el-table-column prop="phone" width="120" label="设备厂商电话" />
        <el-table-column prop="contacter" label="设备厂商联系人" />
        <el-table-column prop="address" label="设备厂商地址" />
      </el-table>
      <span slot="footer">
        <el-button
          type="primary"
          @click="confirmAddPerson"
          :disabled="JSON.stringify(selectedPersonIds) === '{}'"
          >添加</el-button
        >
        <el-button plain @click="cancelAddPerson">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设备维保"
      :visible.sync="addmaintenanceDialogShow"
      :modal="false"
      :before-close="closemaintenanceDialog"
      width="800px"
    >
      <div>
        <div class="mb20">
          <!-- 搜索 -->
          <el-input
            v-model="blurrys"
            clearable
            style="width: 210px; margin-right: 10px"
            placeholder=" 请输入维保单位名称 "
          />
          <el-button
            icon="el-icon-search"
            @click="searchmaintenance()"
            type="primary"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetmaintenance()" plain
            >重置</el-button
          >
        </div>
      </div>
      <el-table
        height="530"
        element-loading-text="加载中"
        :data="maintenanceInforData"
        @row-click="selectChangemaintenance"
        @select="selectionChanges"
      >
        <el-table-column type="selection" width="50">
          <!-- <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.id">&nbsp;</el-radio>
          </template> -->
        </el-table-column>
        <el-table-column prop="maintenanceCompany" label="维保单位" />
        <el-table-column prop="phone" width="100" label="维保单位电话" />
        <el-table-column
          prop="maintenanceContacter"
          width="00"
          label="维保单位联系人"
        />
        <el-table-column prop="address" label="维保单位地址" />
      </el-table>
      <div slot="footer">
        <el-button
          type="primary"
          @click="confirmmaintenance"
          :disabled="JSON.stringify(maintenanceIds) === '{}'"
          >添加</el-button
        >
        <el-button plain @click="cancelmaintenance">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择经纬度"
      :visible.sync="ChooseDialogShow"
      :modal="false"
      width="900px"
    >
      <div style="height: 700px">
        <point-map
          ref="gisMap"
          style="height: 700px"
          :pointVal.sync = 'latitudearr'
        ></point-map>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="mapadd">添加</el-button>
        <el-button plain @click="mapcancel">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="设备列表"
      :visible.sync="deviceDialogShow"
      :modal="false"
      :before-close="closeAddPersonDialog"
      width="800px"
    >
      <el-table
        height="530"
        element-loading-text="加载中"
        :data="manufacturerInforData"
        @row-click="selectChange"
      >
        <el-table-column width="50" align="left">
          <!-- <template slot-scope="scope">
            <el-radio v-model="radios" :label="scope.row.id">&nbsp;</el-radio>
          </template> -->
        </el-table-column>
        <el-table-column prop="name" label="设备厂商名称" />
        <el-table-column prop="phone" width="120" label="设备厂商电话" />
        <el-table-column prop="contacter" label="设备厂商联系人" />
        <el-table-column prop="address" label="设备厂商地址" />
      </el-table>
      <span slot="footer">
        <el-button
          type="primary"
          @click="confirmAddPerson"
          :disabled="JSON.stringify(selectedPersonIds) === '{}'"
          >添加</el-button
        >
        <el-button @click="cancelAddPerson" plain>取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="附近摄像头"
      :visible.sync="cameraShow"
      :modal="false"
      :before-close="onDialogCancel"
      width="800px"
    >
      <div>
        <div class="mb20">
          <!-- 搜索 -->
          <el-input
            v-model="dialogPage.name"
            style="width: 215px"
            placeholder="设备名称"
          />
          <el-input
            v-model="dialogPage.code"
            style="width: 215px"
            placeholder="设备编号"
          />
          <el-button
            icon="el-icon-search"
            @click="dialogSearch()"
            type="primary"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" @click="dialogReset()" plain
            >重置</el-button
          >
        </div>
      </div>
      <div style="margin-bottom: 20px">
        <el-table
          ref="multipleTable"
          :data="cameraTableData"
          @selection-change="handlePersonsSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column prop="name" label="设备名称" show-overflow-tooltip />
          <el-table-column
            prop="address"
            label="所在区域"
            show-overflow-tooltip
          />
          <el-table-column prop="code" label="设备编号" show-overflow-tooltip />
          <el-table-column label="状态" align="left" width="50px">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" style="color: #18dca7"
                >在线</span
              >
              <span v-else style="color: #f05656">离线</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="content-bottom">
          <pagination
            v-show="cameraTableData.length"
            :total="dialogPage.total"
            :page.sync="dialogPage.pageNum"
            :limit.sync="dialogPage.pageSize"
            @pagination="handleCurrentChange"
          />
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="onDialogConfirm">确定</el-button>
        <el-button @click="onDialogCancel" plain>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  initData,
  treeByIdData,
  unmounted,
  getDetailById,
  getTage,
  getRegion,
} from "@/api/facility/information";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import pointMap from "@/components/common/map/point-map";
import * as $carParkingSet from "@/api/carManage/carParkingSet";
import { formatData, uniqueArray } from "@/utils/index";

export default {
  name: "AddAndEdit",
  components: {
    pointMap,
  },
  data() {
    return {
      manufacturerInforData: [],
      addPersonDialogShow: false,
      personFilter: {},
      selectedPersonIds: {},
      radio: "",
      blurry: "",
      manufacturerData: [],
      maintenanceInforData: [],
      addmaintenanceDialogShow: false,
      // personFilter:{},
      maintenanceIds: {},
      radios: "",
      blurrys: "",
      maintenanceData: [],
      // 设备类型数据
      serviceData: [],
      //   接入协议的名称
      agreementData: [],
      // 获得的设备类型名称
      treeTypeSetData: [],
      //   获得接入协议的名称
      treeAgreementData: [],
      // 设备类型的编号
      treeType: [],
      defaultNameType: {
        label: "name",
        value: "type",
      },
      defaultNameAgreement: {
        label: "name",
        value: "type",
      },
      // children: 'children',
      // label: 'name',
      // value: 'id',
      defaultProp: {
        children: "children",
        label: "name",
      },
      loading: false,
      // addAndEditShow:true,
      // deviceDrawVisible: true,
      // 新增的表单
      submitFormData: {
        belongSubsystem: "摄像头",
      },
      deviceMaintenance: {},
      deviceManufacturer: {},
      deviceAreaCheck: "",
      deviceImgUrl: "",
      dialogVisible: false,
      ChooseDialogShow: false,
      parkImgUrl: "",
      action: "",
      // 校验
      devicerule: {
        code: [{ required: true, message: "请输入设备编码", trigger: "blur" }],
        name: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: ["blur", "change"],
          },
        ],
        area: [
          {
            required: true,
            message: "请选择归属园区",
            trigger: ["blur", "change"],
          },
        ],
        region: [
          {
            required: true,
            message: "请选择所在区域",
            trigger: ["blur", "change"],
          },
        ],
        type: [{ required: true, message: "请输入设备类型", trigger: "blur" }],
        latitudes: [
          {
            required: true,
            validator: this.validatelatitudes,
            trigger: ["blur", "change"],
          },
        ],
      },
      manufacturerrule: {
        name: [
          {
            required: true,
            message: "请输入设备厂商名称",
            trigger: ["blur", "change"],
          },
        ],
      },
      maintenancerule: {
        name: [
          {
            required: true,
            message: "请输入维保单位名称",
            trigger: ["blur", "change"],
          },
        ],
      },
      latitudearr: [],
      deviceDialogShow: false,
      area: "",
      dialogPage: {
        pageNum: 1,
        total: 0,
        pageSize: 10,
        name: "",
        code: "",
      },
      cameraShow: false,
      cameraTableData: [],
      mutiCamera: [],
      dynamicTags: ["标签一", "标签二", "标签三"],
      carGroup: [],
      tageArr: [],
      regionArr: [],
    };
  },
  props: ["dialogVisibleType", "rowData", "deviceinforId", "treeData"],
  mounted() {
    this.submitFormData.type = this.rowData.type;
    if (this.dialogVisibleType === "edit") {
      getDetailById({ id: this.deviceinforId }).then((res) => {
        this.submitFormData = res.data;
        this.submitFormData.area = res.data.area ? res.data.area : undefined;
        this.area = res.data.area || "";
        let strArr = [];
        res.data.monitorDevices.forEach((item) => {
          strArr.push(item.name);
        });
        this.mutiCamera = res.data.monitorDevices;
        this.submitFormData.monitorStr = strArr.join(",");
        this.submitFormData.latitudes =
          res.data.longitude + "," + res.data.latitude;
        // this.submitFormData.tag="SOUND_RECORDING"
        this.parkImgUrl = res.data.picture;
        this.deviceManufacturer = res.data.deviceManufacturer || {};
        this.deviceMaintenance = res.data.deviceMaintenance || {};
      });
    }
    this.getParkCode();
    this.action =
      process.env.VUE_APP_BASE_API + "/file/pm/fastdfs/upload/picture";
    this.getTage();
    this.getRegion();
  },
  methods: {
    // 获取摄像头标签
    getTage() {
      getTage().then((res) => {
        this.tageArr = formatData(res.data);
      });
    },
    // 获取所在区域
    getRegion() {
      getRegion().then((res) => {
        this.regionArr = formatData(res.data);
      });
    },

    // 获取园区
    getParkCode() {
      $carParkingSet
        .getCarParkingCode()
        .then((res) => {
          this.carGroup = formatData(res.data);
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    handleNodeClick(data) {
      this.submitFormData.area = data.name || "";
      this.area = data.name || "";
    },
    handleClear() {
      this.submitFormData.area = "";
      this.area = "";
    },
    validatelatitudes(rule, value, callback) {
      if (this.submitFormData.latitudes) {
        callback();
      } else {
        callback("请选择经纬度");
      }
    },
    mapadd() {
      this.submitFormData.latitudes = this.latitudearr.join(",");
      this.ChooseDialogShow = false;
    },
    mapcancel() {
      this.ChooseDialogShow = false;
    },
    maplocation(e) {
      this.latitudearr = e;
      this.$refs.gisMap.clearLayer();
      const arr = [
        {
          src: require("@/assets/images/mapImg/position.png"),
          coord: [e[0], e[1]],
        },
      ];
      this.$refs.gisMap.addMarket(arr, "position");
    },
    latitudeChoose() {
      this.ChooseDialogShow = true;
    //   this.$nextTick(() => {
    //     const latitudesArr = this.submitFormData.latitudes.split(",");
    //     if (latitudesArr.length) {
    //       this.$refs.gisMap.clearLayer();
    //       const arr = [
    //         {
    //           src: require("@/assets/images/mapImg/position.png"),
    //           coord: [+latitudesArr[0], +latitudesArr[1]],
    //         },
    //       ];
    //       this.$refs.gisMap.addMarket(arr, "position");
    //     }
    //   });
    },
    // 上传前格式和图片大小限制
    beforeAvatarUpload(file) {
      const type = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!type) {
        this.$message.error("图片格式不正确!(只能包含jpg，pngJPEG)");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return type && isLt2M;
    },
    handleAvatarSuccess(res, file, fileList) {
      this.parkImgUrl = res.data.path;
    },
    // 勾选厂商
    selectChange(row) {
      this.selectedPersonIds = row;
    },
    selectChanges(selection, row) {
      if (selection.length > 1) {
        this.$refs.manufacturer.clearSelection();
        this.$refs.manufacturer.toggleRowSelection(selection.pop());
      } else {
        if (selection.length) {
          this.selectedPersonIds = row;
        }
      }
    },
    // 勾选维保
    selectChangemaintenance(row) {
      this.maintenanceIds = row;
    },
    selectionChanges(selection, row) {
      // this.maintenanceIds = row
      if (selection.length > 1) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(selection.pop());
      } else {
        if (selection.length) {
          this.maintenanceIds = row;
        }
      }
    },
    // 选择维保
    confirmmaintenance() {
      let data = this.maintenanceIds;
      this.deviceMaintenance = data;
      this.closemaintenanceDialog();
    },
    // 选择厂商
    confirmAddPerson() {
      let data = this.selectedPersonIds;
      this.deviceManufacturer = data;
      this.closeAddPersonDialog();
    },
    cancelAddPerson() {
      this.closeAddPersonDialog();
      //   this.$message.info('取消添加人员')
    },
    // 关闭添加维保窗口
    closeAddPersonDialog() {
      this.addPersonDialogShow = false;
      this.maintenanceIds = {};
      this.radios = "";
    },
    cancelmaintenance() {
      this.closemaintenanceDialog();
    },
    // 关闭添加维保窗口
    closemaintenanceDialog() {
      this.addmaintenanceDialogShow = false;
      this.maintenanceIds = {};
    },
    search() {
      let params = {
        manufacturerName: this.blurry,
      };
      initData("/pm/device/manufacturer", "GET", params).then((res) => {
        this.manufacturerInforData = res.data;
      });
    },
    // 获取维保信息
    searchmaintenance() {
      let params = {
        companyName: this.blurrys,
      };
      initData("/pm/device/maintenance", "GET", params).then((res) => {
        this.maintenanceInforData = res.data;
      });
    },
    reset() {
      this.blurry = "";
      this.search();
    },
    resetmaintenance() {
      this.blurrys = "";
      this.searchmaintenance();
    },
    maintenance() {
      this.addmaintenanceDialogShow = true;
      let obj = {
        url: "/pm/device/maintenance",
        method: "GET",
      };
      initData(obj.url, obj.method).then((res) => {
        this.maintenanceInforData = res.data;
      });
    },
    changshang() {
      this.addPersonDialogShow = true;
      initData("/pm/device/manufacturer", "GET").then((res) => {
        this.manufacturerInforData = res.data;
      });
    },
    onSubmit() {
      const p1 = new Promise((resolve, reject) => {
        this.$refs["deviceForm"].validate((valid) => {
          if (valid) resolve();
        });
      });

      const p2 = new Promise((resolve, reject) => {
        this.$refs["manufacturerForm"].validate((valid) => {
          if (valid) resolve();
        });
      });

      const p3 = new Promise((resolve, reject) => {
        this.$refs["maintenanceForm"].validate((valid) => {
          if (valid) resolve();
        });
      });
      Promise.all([p1, p2, p3]).then(() => {
        this.submitFormData.longitude =
          this.submitFormData.latitudes.split(",")[0];
        this.submitFormData.latitude =
          this.submitFormData.latitudes.split(",")[1];
        // delete this.submitFormData.latitudes
        delete this.submitFormData.monitorStr;
        this.submitFormData.picture = this.parkImgUrl;
        this.submitFormData.deviceMaintenance = this.deviceMaintenance;
        this.submitFormData.deviceManufacturer = this.deviceManufacturer;
        if (this.dialogVisibleType === "add") {
          treeByIdData("/pm/device", "POST", this.submitFormData).then(
            (res) => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.$emit("addAndEditShow", [true, false]);
            }
          );
        } else if (this.dialogVisibleType === "edit") {
          treeByIdData("/pm/device", "PUT", this.submitFormData).then((res) => {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
            this.$emit("addAndEditShow", [true, false]);
          });
        }
      });
    },
    // 取消
    onCancel() {
      this.$refs["manufacturerForm"].resetFields();
      this.$refs["maintenanceForm"].resetFields();
      this.$refs["deviceForm"].resetFields();
      this.$emit("addAndEditShow", [true, false]);
    },
    showCameraFn() {
      this.dialogReset();
      this.cameraShow = true;
    },
    clearCarmera() {
      this.dialogReset();
      this.submitFormData.monitorStr = "";
      this.submitFormData.monitors = [];
    },
    dialogSearch() {
      this.dialogPage.pageNum = 1;
      this.initTreeData();
    },
    dialogReset() {
      this.dialogPage.name = "";
      this.dialogPage.code = "";
      this.dialogSearch();
    },
    initTreeData() {
      let params = {
        pageNum: this.dialogPage.pageNum,
        pageSize: this.dialogPage.pageSize,
        type: "camera",
        mounted: "",
        blurryType: "DEVICE_TREE",
        name: this.dialogPage.name,
        code: this.dialogPage.code,
      };
      initData("/pm/device/criteria/origin", "GET", params)
        .then((res) => {
          this.cameraTableData = res.data.data;
          this.dialogPage.total = res.data.total;
        })
        .then(() => {
          if (this.submitFormData.monitors.length) {
            this.$nextTick(() => {
              this.submitFormData.monitorDevices.forEach((row) => {
                this.$refs.multipleTable.toggleRowSelection(
                  this.cameraTableData.find((i) => i.id == row.id),
                  true
                );
              });
            });
          }
        });
    },
    //  点击分页
    handleCurrentChange(val) {
      this.dialogPage.pageNum = val.page;
      this.initTreeData();
    },
    //  更改每页显示数量
    handleSizeChange(val) {
      this.dialogPage.pageSize = val.limit;
      this.initTreeData();
    },
    // 勾选人员表格复选框
    handlePersonsSelectionChange(data) {
      this.mutiCamera = data;
    },
    // 添加人员
    onDialogConfirm() {
      if (!this.mutiCamera.length) {
        this.$message.warning("请选择摄像头");
        return false;
      }
      if (
        (this.submitFormData.type === "barrierGate" ||
          this.submitFormData.type === "elevator") &&
        this.mutiCamera.length > 1
      ) {
        this.$message.warning("最多关联1个附近摄像头");
        return false;
      } else if (this.mutiCamera.length > 5) {
        this.$message.warning("最多关联5个附近摄像头");
        return false;
      }
      this.submitFormData.monitors = [];
      let strArr = [];
      this.mutiCamera.forEach((item) => {
        this.submitFormData.monitors.push(item.id);
        strArr.push(item.name);
      });
      this.submitFormData.monitorStr = strArr.join(",");
      this.onDialogCancel();
    },
    onDialogCancel() {
      this.$refs.multipleTable.clearSelection();
      this.cameraShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.radioBtn .el-radio-button {
  margin: 0 5px;
}
::v-deep .radioBtn .el-radio-button__inner {
  border-left: 1px solid #dcdfe6;
}
::v-deep .radioBtn .el-radio-button .el-radio-button__inner {
  border-radius: 4px !important;
}
::v-deep
  .radioBtn
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  box-shadow: 0 0 0 0 #2d6dff;
}
.button-new-tag {
  margin-left: 10px;
  height: 27px;
  line-height: 25px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.colors {
  color: #206aff;
  cursor: pointer;
}

.clearfixsTitle {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
