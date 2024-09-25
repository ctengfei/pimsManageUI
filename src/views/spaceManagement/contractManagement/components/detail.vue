<template>
  <div class="basicInfo">
    <div style="width: 100%">
      <div class="infoBox">
        <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">基本信息</p>
      </div>
      <el-row>
        <el-form ref="contractForm" :model="contractForm" label-width="80px">
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item
                v-if="showinput"
                label="客户名称"
                prop="company.companyName"
                :rules="[
                  {
                    required: true,
                    message: '请输入客户名称',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
              <el-input
                  v-model="contractForm.company.companyName"
                  :disabled="!iscreate"
                  placeholder="请输入客户名称"
                ></el-input>
              </el-form-item>
              <el-form-item
              v-if="showinputs"
              label="客户名称"
                prop="company.companyName?company.companyName:company.value"
                :rules="[
                  {
                    required: true,
                    message: '请输入客户名称',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
              <el-input
                   v-if="showinputs"
                  v-model="contractForm.company.companyName ? contractForm.company.companyName : contractForm.company.value"
                  :disabled="!iscreate"
                  placeholder="请输入客户名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="合同编号"
                prop="contract.serialNumber"
                :rules="[
                  {
                    required: true,
                    message: '请输入合同编号',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-input
                  v-model="contractForm.contract.serialNumber"
                  placeholder="请输入合同编号"
                  :disabled="!iscreate"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
              <el-form-item
                v-if="showtime"
                label="开始日期"
                prop="contract.time"
                :rules="[
                  {
                    required: true,
                    message: '请选择开始日期',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
              <el-date-picker
              style="width: 100%;"
                v-model="contractForm.contract.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                :disabled="!iscreate"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              </el-form-item> 

                <el-col :span="12" v-if="showtimes">
                   <el-form-item label="开始日期" 
                   prop="contract.startDate"
                   :rules="[
                  {
                    required: true,
                    message: '请选择开始日期',
                    trigger: ['blur', 'change']
                  }
                ]"
                   >
                  <el-date-picker
                  :clearable="false"
                  v-model="contractForm.contract.startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :disabled="!iscreate"
                  :class="[datepicker]"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
              <el-col :span="12" v-if="showtimes">
              <el-form-item
                label="结束日期"
                prop="contract.endDate"
                :rules="[
                  {
                    required: true,
                    message: '请选择结束日期',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-date-picker
                  v-model="contractForm.contract.endDate"
                  type="date"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  :disabled="!iscreate"
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item
                label="租金"
                prop="contract.rent"
                :rules="[
                  {
                    validator: checkNum,
                    trigger: ['blur', 'change']
                  }
                ]"
              >
              <div style="display: flex;justify-content: space-between;">
                    <el-input
                  v-model="contractForm.contract.rent"
                  :disabled="!iscreate"
                >
                <template slot="append">元/月</template>
                </el-input>
                </div> 
                
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="物业费"
                prop="contract.propertyFee"
                :rules="[
                  {
                    validator: checkNum,
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <div style="display: flex;justify-content: space-between;">
                    <el-input
                    v-model="contractForm.contract.propertyFee"
                    :disabled="!iscreate"
                  >
                <template slot="append">元/月</template>
                </el-input>
                </div>

              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item
                  label="免租期"
                  prop="contract.rentFree"
                  :rules="[
                    {
                      validator: checkNums,
                      trigger: ['blur', 'change']
                    }
                  ]"
                >
                <el-input v-model="contractForm.contract.rentFree" :disabled="!iscreate">
                  <template slot="append">月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="支付方式"
                prop="contract.paymentMode"
                v-show="!iscreate"
                :rules="[
                  {
                    required: true,
                    message: '请选择支付方式',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-col style="text-align:center" :span="3"
                  >押</el-col
                >
                <el-col :span="9">
                  <el-select
                    :disabled="!iscreate"
                    v-model="(contractForm.contract.paymentMode || '').split('-')[0]"
                  ></el-select>
                </el-col>
                <el-col style="text-align:center" :span="3"
                  >付
                </el-col>
                <el-col :span="9">
                  <el-select
                    :disabled="!iscreate"
                    v-model="
                      (contractForm.contract.paymentMode || '').split('-')[1]
                    "
                  ></el-select>
                </el-col>
              </el-form-item>
              <el-form-item
                label="支付方式"
                prop="contract"
                v-show="iscreate"
                :rules="[
                  {
                    required: true,
                    validator: this.validatepaypledge,
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-col style="color: #666666;text-align:center" :span="3"
                  >押</el-col
                >
                <el-col :span="9">
                  <el-select
                    @change="testpledge"
                    :disabled="!iscreate"
                    v-model="contractForm.contract.pledge"
                  >
                    <el-option
                      v-for="item in dict.type.paymentmode_status"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
                <el-col style="color: #666666;text-align:center" :span="3"
                  >付&nbsp;
                </el-col>
                <el-col :span="9">
                  <el-select
                    @change="testpledge"
                    :disabled="!iscreate"
                    v-model="contractForm.contract.pay"
                  >
                    <el-option
                      v-for="item in dict.type.pay_status"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item
                label="所属园区"
                prop="zoneLocation"
                v-show="!iscreate"
              >
                <el-input
                  v-model="contractForm.zoneLocation"
                  :disabled="!iscreate"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="所属园区"
                prop="zone"
                v-show="iscreate"
                :rules="[
                  {
                    required: true,
                    message: '请选择所属园区',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-select
                  value-key="id"
                  :disabled="!iscreate"
                  v-model="contractForm.zone"
                  @focus="getAllZoneName"
                  @change="getZoneId"
                  placeholder="请选择所属园区"
                >
                  <el-option
                    v-for="item in zoneName"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属楼宇"
                prop="floorLocation"
                v-show="!iscreate"
              >
                <el-input
                  v-model="contractForm.floorLocation"
                  :disabled="!iscreate"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="所属楼宇"
                prop="building"
                v-show="iscreate"
                :rules="[
                  {
                    required: true,
                    message: '请选择所属楼宇',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-select
                  value-key="id"
                  :disabled="!iscreate"
                  v-model="contractForm.building"
                  @change="getFloorId"
                  placeholder="请选择所属楼宇"
                >
                  <el-option
                    v-for="item in floorName"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="24">
              <el-form-item label="租赁房间" v-show="!iscreate">
                <el-input
                  v-model="contractForm.rentalRoom"
                  :disabled="!iscreate"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="租赁房间"
                prop="roomRented.roomsTreeNodes"
                v-show="iscreate"
                :rules="[
                  {
                    required: true,
                    message: '请选择租赁房间',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-select
                  v-model="contractForm.roomRented.roomsTreeNodes"
                  multiple
                  :disabled="!iscreate"
                  collapse-tags
                  value-key="id"
                  @change="getRoom"
                  placeholder="请选择租赁房间"
                >
                  <el-option
                    v-for="item in roomName"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
              <el-form-item
                label="经办人"
                prop="contract.transactor"
                :rules="[
                  {
                    required: true,
                    message: '请选择经办人',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <div style="display: flex;justify-content: space-between;">
                  <p style="display: inline-block;">{{ contractForm.contract.transactor ? contractForm.contract.transactor :'尚未选择经办人' }}</p>
                <el-button
                  type="primary"
                  @click="addDialog"
                  :disabled="!iscreate"
                  
                  >选择用户</el-button
                >
                </div>

              </el-form-item>
              <el-form-item
                label="类型"
                prop="contract.type"
                style="display: none"
              >
                <el-input
                  v-model="contractForm.contract.type"
                  :disabled="!iscreate"
                ></el-input>
              </el-form-item>
            </el-col>
          <el-col :span="24">
            <el-col :span="24">
              <el-form-item label="备注信息" prop="contract.remark">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="contractForm.contract.remark"
                  v-show="iscreate"
                ></el-input>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="contractForm.contract.remark"
                  v-show="!iscreate"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div :class="{ invoiceInfos: !iscreate, invoiceInfo: iscreate }">
      <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
        开票信息
      </p>
      <el-row>
      <el-col :span="24">
      <el-form
        class="invoiceForm"
        ref="invoiceForm"
        :model="contractForm.invoice"
        label-width="80px"
      >
        <el-form-item
          label="发票类型"
          prop="type"
          :rules="[
            {
              required: true,
              message: '请选择发票类型',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-radio
            v-model="contractForm.invoice.type"
            label="ORDINARY"
            :disabled="!iscreate"
            >普通发票
          </el-radio>
          <el-radio
            v-model="contractForm.invoice.type"
            label="SPECIAL_USE"
            :disabled="!iscreate"
            >专用发票
          </el-radio>
        </el-form-item>
        <el-form-item
          label="发票抬头"
          prop="taxpayer"
          :rules="[
            {
              required: true,
              message: '请输入发票抬头',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-input
            v-model="contractForm.invoice.taxpayer"
            placeholder="请输入发票抬头"
            :disabled="!iscreate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="纳税人识别码"
          prop="taxpayerNumber"
          :rules="[
            {
              required: true,
              message: '请输入纳税人识别码',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-input
            v-model="contractForm.invoice.taxpayerNumber"
            placeholder="请输入纳税人识别码"
            :disabled="!iscreate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="企业电话"
          prop="telephone"
          :rules="[
            {
              required: true,
              validator: this.validatePhoneTwo,
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-input
            v-model="contractForm.invoice.telephone"
            placeholder="请输入企业电话"
            @change="validatephone()"
            :maxlength="11"
            show-word-limit
            :disabled="!iscreate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开户行"
          prop="bank"
          :rules="[
            {
              required: true,
              message: '请输入开户行',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-input
            v-model="contractForm.invoice.bank"
            placeholder="请输入开户行"
            :disabled="!iscreate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开户行账号"
          prop="bankAccount"
          :rules="[
            {
              required: true,
              message: '请输入开户行账号',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-input
            v-model="contractForm.invoice.bankAccount"
            placeholder="请输入开户行账号"
            :disabled="!iscreate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="企业地址"
          prop="address"
          :rules="[
            {
              required: true,
              message: '请输入企业地址',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-input
            v-model="contractForm.invoice.address"
            placeholder="请输入地址"
            :disabled="!iscreate"
          ></el-input>
        </el-form-item>
      </el-form>
      </el-col>
      </el-row>
      
    </div>
    <div :class="{ fujian: iscreate, isfujian: !iscreate }">
      <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
        附件信息
      </p>
      <el-form
        class="attachments"
        label-width="80px"
        :model="contractForm"
        ref="attachmentsForm"
      >
        <el-form-item label=" " prop="attachments" v-show="!iscreate">
          <div class="hetong">
            <p v-for="(item, index) in contractForm.attachments" :key="item.id">
              <span>{{ index + 1 }}.&nbsp;&nbsp;</span
              ><span title="点击下载" @click="download(item)">{{
                item.fileName
              }}</span>
            </p>
          </div>
        </el-form-item>
        <el-form-item
          v-show="iscreate"
          label="上传附件"
          prop="attachments"
          :rules="[
            {
              required: true,
              validator: this.validatefile,
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-upload
            class="upload-demo"
            :action="action"
            :on-change="handlerChange"
            :on-remove="handleRemove"
            :on-success="handlerChangeSuccese"
            :file-list="fileList"
            accept=".doc,.docx,.jpg,.png,.pdf"
            :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
          >
            <el-button icon="el-icon-upload2" type="primary" style="margin-top: 40%;"
              >上传合同
            </el-button>
            <div slot="tip" class="el-upload__tip" style="color: #afb9d0">
              请上传营业执照以及合同等信息
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="iscreate" style="text-align:right;">
      <el-button
        @click="onsubmit()"
        type="primary"
        >确定
      </el-button>
      <el-button
        @click="onBack()"
        >取消
      </el-button>
    </div>
    <div v-show="!iscreate">
      <div class="checkInfo">
        <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
          审核
        </p>
        <el-row>
          <el-form
            class="invoiceForm"
            ref="checkform"
            :model="checkForm"
            label-width="80px"
            :rules="checkrules"
          >
            <el-col :span="24">
              <el-form-item label="审核结果" prop="auditResult">
                <el-select v-model="checkForm.auditResult" :disabled="!ischeck">
                  <el-option
                    v-for="item in checksort"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="审核意见" prop="reason">
                <el-input
                  type="textarea"
                  v-model="checkForm.reason"
                  :disabled="!ischeck"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <div style="text-align:right;" v-show="ischeck">
        <el-button
          @click="oncheck()"
          type="primary"
          >确定
        </el-button>
        <el-button
          @click="onBack()"
          >取消
        </el-button>
      </div>
    </div>
    <!-- 选择负责人 -->
    <!-- z-index="2000" -->
    <el-dialog
      :title="title"
      :visible.sync="sendShow"
      width="850px"
      append-to-body
      :before-close="cancel">
      <el-row :gutter="20">
        <el-col>
          <ComDeptUser ref="comDeptUsers" @selectClick="selectClick" />
        </el-col>
      </el-row>
      <div slot="footer" style="text-align:right;">
        <el-button type="primary" @click="onSubmit1()">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>

  <!--</div>-->
</template>

<script>
import { downloadFile } from "@/utils/index";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import $contract from "@/api/spaceManagement/contractManagement.js";
import {
  getControlTree,
  getControlTree1
} from "@/api/spaceManagement/controlManagement";
import { toArr, queryTree } from "@/utils/index";
import { getAll } from "@/api/system/user";
import jiantou from "@/assets/images/jiantou.png";
import { initData, treeByIdData, unmounted } from "@/api/facility/information";
import { getToken } from "@/utils/auth";
import { getUser1 } from "@/api/system/user";
import ComDeptUser from "@/components/comDeptUser";
export default {
  name: "Detail",
  components: {
    ComDeptUser
  },
  dicts: ["paymentmode_status", "pay_status"],
  props: {
    iscreate: {
      type: Boolean,
      default: false
    },
    ischeck: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: [String, Number, Object],
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      value1:'',
      checkForm: {
        serialNumber: "",
        auditResult: true,
        reason: ""
      },
      checksort: [
        {
          label: "同意",
          value: true
        },
        {
          label: "拒绝",
          value: false
        }
      ],
      showinput:true,
      showinputs:false,
      showtime:true,
      showtimes:false,
      changename: "尚未选择用户",
      addPersonDis: false,
      personId: "",
      sendShow: false,
      title: "添加人员",
      jiantou,
      fileList: [],
      action: process.env.VUE_APP_BASE_API + "/file/pm/fastdfs/upload/file",
      permission: {
        detail: "spaceManagement::contractManagement::detail",
        add: "spaceManagement::contractManagement::add",
        treeAll: "spaceManagement::controlManagement::treeAll",
        // floorList: "spaceManagement::controlManagement::floorList",
        // roomList: "spaceManagement::controlManagement::roomList",
        rendtedRoom: "spaceManagement::contractManagement::rendtedRoom",
        getAlluser: "system::sys::userName",
        // 根据名称查询设备厂商信息(厂商信息下拉搜索按钮)
        // getManufacturer: "facility::information::getManufacturer",
        // 新增公司
        addCompany: "facility::contractManagement::addCompany",
        // search: "spaceManagement::contractManagement::search",
        // 合同上传
        upload: "spaceManagement::contractManagement::upload",
        // 合同下载
        download: "spaceManagement::contractManagement::download"
      },
      defaultZone: {
        label: "name",
        value: "id"
      },
      checkrules: {
        auditResult: [
          {
            required: true,
            message: "请选择审核结果",
            trigger: ["change", "blur"]
          }
        ],
        reason: [
          {
            required: true,
            message: "请输入审核意见",
            trigger: ["change", "blur"]
          }
        ]
      },
      company: {},
      //        基本信息表单contractForm.contract.transactor
      contractForm: {
        attachments: [],
        company: {},
        contract: {
          transactor:'尚未选择用户',
          startDate:'',
          endDate:'',
          time:[]
        },
        invoice: {
          type: "ORDINARY"
        },
        roomRented: {
          buildingName: "",
          roomsTreeNodes: [],
          zoneName: ""
        }
      },
      // 所有的人
      personTableData: [],
      //        发票数据表单
      invoiceForm: {},
      datepicker: "date-picker",
      // 所有园区
      zoneName: [],
      // 所有楼层
      floorName: [],
      // 所有房间
      roomName: [],
      floorNameTemp: [],
      roomNameTemp: [],
      companyArr: [],
      companyList: [],
      companyId: "",
      fileDatas: []
    };
  },
  created() {
    // this.search();
    this.getCompany();
  },
  mounted() {
    if (this.iscreate === false) {
      this.getDetail();
    }
  },
  methods: {
    addDialog() {
      this.sendShow = true;
      this.addPersonDis = false;
      if(this.$refs.comDeptUsers){
        this.$refs.comDeptUsers.init();
      }
    },
    cancel() {
      this.sendShow = false;
      // this.getUserInfo();
      // this.$refs.addForm.resetFields()
    },
    // 获取人员id
    selectClick($e) {
      this.personId = $e[0];
    },
    // 添加人员
    onSubmit1() {
      getUser1(this.personId).then(res => {
        let data = {
          name: res.data.nickName,
          account: res.data.userName,
          groups: res.data.dept.deptName
        };
        this.contractForm.contract.transactor = data.name
        this.sendShow = false;
        this.cancel();
      });
    },
    // 校验数字或小数后两位
    checkNum(rule, value, callback) {
      const num = /^\d+(\.\d{1,2})?$/;
      if (!value) {
        //所以当没有值的时候，我们直接callback，让他不校验直接执行下一步
        return callback();
      } else {
        if (num.test(value)) {
          //验证通过也下一步
          return callback();
        } else {
          callback(new Error("请输入数字或小数后两位")); //验证不通过下一步只是抛出个错误
        }
      }
    },
    // 校验正整数
    checkNums(rule, value, callback) {
      const num = /^[1-9]\d*$/;
      if (!value) {
        //所以当没有值的时候，我们直接callback，让他不校验直接执行下一步
        return callback();
      } else {
        if (num.test(value)) {
          //验证通过也下一步
          return callback();
        } else {
          callback(new Error("请输入数字")); //验证不通过下一步只是抛出个错误
        }
      }
    },
    // 审核
    oncheck() {
      this.$refs.checkform.validate(valid => {
        if (valid) {
          $contract.checkcontract(this.checkForm).then(res => {
            if (res.code === 200) {
              this.$message.success("审核完成");
              this.onBack();
            } else {
              this.$message.error(res.meta.message);
            }
          });
        }
      });
    },
    validatephone() {
      if (this.contractForm.invoice.telephone) {
        this.$refs.invoiceForm.clearValidate("telephone");
      }
    },
    testpledge() {
      if (this.contractForm.contract.pledge && this.contractForm.contract.pay) {
        this.contractForm.contract.paymentMode =this.contractForm.contract.pledge +"-" +this.contractForm.contract.pay;
        this.$refs.contractForm.clearValidate("contract.paymentMode");
      }
    },
    validatepaypledge(rule, value, callback) {
      if (value.paymentMode) {
        callback();
      } else {
        callback(new Error("请选择支付方式"));
      }
    },
    // choosecompany() {
    //   if (this.contractForm.company) {
    //     this.$refs.contractForm.clearValidate("company");
    //   }
    // },
    validatecompany(rule, value, callback) {
      console.log(value,'9999999999999999')
      if (value.id) {
        callback();
      } else {
        callback(new Error("请输入公司"));
      }
    },
    validatefile(rule, value, callback) {
      if (this.fileDatas.length) {
        callback();
      } else {
        callback(new Error("请上传合同附件"));
      }
    },
    // 获取公司
    getCompany() {
      this.companyId = "";
      let url = "/pm/company";
      let method = "GET";
      // let obj = getObjByKey(this.permission.addCompany);
      let parmas = {
        name: this.contractForm.company.name? this.contractForm.company.name: "",
        pageNum: 1,
        pageSize: 100
      };
      getControlTree1(url, method, parmas).then(res => {
        this.companyList = [];
        this.companyArr = [];
        this.companyList = res.data;
        for (const item of this.companyList) {
          this.companyArr.push({
            value: item.name, //这里一定是value: '值'
            name: item.name, //这里一定是value: '值'
            id: item.id
          });
        }
      });
    },
    handlerChange(file, fileList) {
      if (this.fileDatas.length > 0) {
        this.$refs.attachmentsForm.clearValidate("attachments");
      }
    },
    handleRemove(file, fileList) {
      for (var i = 0; i < this.fileDatas.length; i++) {
        if (this.fileDatas[i].uid == file.uid) {
          this.fileDatas.splice(i, 1);
        }
      }
    },
    handlerChangeSuccese(res, file, fileList) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "png";
      const extension3 = testmsg === "doc";
      const extension4 = testmsg === "docx";
      const extension5 = testmsg === "pdf";
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5
      ) {
        fileList.pop();
        this.$message({
          message: "上传文件只能是 pdf、jpg、png、doc、docx格式!",
          type: "warning"
        });
        return false;
      } else {
        this.fileDatas.push({
          uid: file.uid,
          fileName: file.name,
          filePath: res.data.path,
          fileSize: file.size,
          type: "CONTRACT"
        });
        this.contractForm.attachments = this.fileDatas
      }
    },

    querySearchCompany(queryString, cb) {
      var companyArr = this.companyArr;
      cb(companyArr);
    },
    selectCompany(val) {
      this.companyId = val.id;
      this.contractForm.company.name = val.value;
    },
    //  所有树
    initTreedata() {
      let url = "/pm/space/tree/whole";
      let method = "GET";
      // let obj = getObjByKey(this.permission.treeAll);
      let parmas = {
        nodeType: "DIR"
      };
      getControlTree(url, method, parmas).then(res => {
        let arr = toArr(res.data);
        this.zoneName = arr.filter(x => x.type === "ZONE");
        this.floorNameTemp = arr.filter(x => x.type === "BUILDING");
        this.roomNameTemp = arr.filter(x => x.type === "ROOM");
      });
    },
    getAllZoneName() {
      this.initTreedata();
    },
    getZoneId(item) {
      this.floorName = this.floorNameTemp.filter(x => x.pid === item.id);
    },
    getFloorId(val) {
      //
      let url = "/pm/space/tree/lazy/rented/room";
      let method = "GET";
      // let obj = getObjByKey(this.permission.rendtedRoom);
      let params = {
        pid: val.id
      };
      $contract.searchForm(url, method, params).then(res => {
        console.log(res.data,'房屋')
        this.roomName = res.data;
      });
    },
    getRoom(val) {
      console.log(val, "room选中的值");
    },
    //  根据过滤条件搜索人员数据
    search() {
      let obj = getObjByKey(this.permission.getAlluser);
      let parmas = {
        pageNum: 1,
        pageSize: 1000
      };
      getAll(obj.url, obj.method, parmas).then(res => {
        this.personTableData = res.data.data;
      });
    },
    getDetail() {
      let url = "/pm/contract";
      let method = "GET";
      // let data = getObjByKey(this.permission.detail);
      let id = this.rowData;
      $contract.detail(url, method, id).then(res => {
        this.checkForm.serialNumber = res.data.contract.serialNumber;
        this.checkForm.auditResult = res.data.auditResult
          ? res.data.auditResult.auditResult
          : true;
        this.checkForm.reason = res.data.auditResult
          ? res.data.auditResult.reason
          : "";
        this.contractForm.attachments = res.data.attachments;
        this.contractForm.company = JSON.parse(
          JSON.stringify(res.data.company).replace(/name/g, "value")
        );
        console.log(this.contractForm.company,'this.contractForm.company')
        this.contractForm.parkLocation = res.data.contract.address.slice(
          0,
          res.data.contract.address.lastIndexOf("-")
        );
        this.contractForm.rentalRoom = res.data.contract.address.slice(
          res.data.contract.address.lastIndexOf("-") + 1
        );
        this.contractForm.zoneLocation = this.contractForm.parkLocation.split(
          "-"
        )[0];
        this.contractForm.floorLocation = this.contractForm.parkLocation.split(
          "-"
        )[1];
        this.contractForm.createTime = res.data.contract.createTime.split(
          " "
        )[0];
        this.contractForm.contract = res.data.contract;
        this.contractForm.remark = res.data.contract.remark;
        this.contractForm.invoice = res.data.invoice;
        this.contractForm.contract.time = res.data.contract.startDate
        this.contractForm.contract.endDate = res.data.contract.endDate
        // this.contractForm.invoice.type=this.invoicetype
        this.invoiceForm.address = res.data.invoice.address.slice(
          0,
          res.data.invoice.address.lastIndexOf("-")
        );

        //押一付三
        let pledge = res.data.contract.paymentMode.split("-")[0];
        let pay = res.data.contract.paymentMode.split("-")[1];
        this.contractForm.contract.pledge = pledge;
        this.contractForm.contract.pay = pay;
        this.showinput=false
        this.showinputs=true
        this.showtime=false
        this.showtimes=true
      });
    },
    onBack() {
      this.$emit("detailVisibleShow", true);
    },
    onsubmit() {
      const p1 = new Promise((resolve, reject) => {
        this.$refs["contractForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      const p2 = new Promise((resolve, reject) => {
        this.$refs["invoiceForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      const p3 = new Promise((resolve, reject) => {
        this.$refs["attachmentsForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      Promise.all([p1, p2, p3]).then(() => {
          this.contractForm.roomRented.buildingName = this.contractForm.building.name;
          this.contractForm.roomRented.zoneName = this.contractForm.zone.name;
          this.contractForm.contract.type = "RENTED";

          this.contractForm.contract.startDate= this.contractForm.contract.time[0]
          this.contractForm.contract.endDate= this.contractForm.contract.time[1]
          let data = {
            attachments: this.fileDatas,
            companyName: this.contractForm.company.companyName,
            contract: JSON.parse(JSON.stringify(this.contractForm.contract)),
            invoice: this.contractForm.invoice,
            roomRented: {
              buildingName: this.contractForm.roomRented.buildingName,
              roomsTreeNodes: this.contractForm.roomRented.roomsTreeNodes,
              zoneName: this.contractForm.roomRented.zoneName
            }
          };
          delete data.contract.time;
          $contract.addForm('/pm/contract', 'POST', data).then(res => {
            this.$message({
              message: "录入成功,请联系管理员审核",
              type: "success"
            });
            this.$emit("detailVisibleShow", true);
            // this.$parent.onReset();
          });
        })
        .catch(err => {
          // this.$message.error("合同录入失败");
        });
    },
    //     校验手机或固话
    validatePhoneTwo(rule, value, callback) {
      const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
      if (value === "") {
        callback(new Error("请输入电话号码或者固话号码"));
      } else if (!reg.test(value) && value !== "") {
        callback(new Error("请输入正确的电话号码或者固话号码"));
      } else {
        callback();
      }
    },
    download(data) {
      //
      let url = "/pm/fastdfs/download/file";
      let method = "GET";
      // let obj = getObjByKey(this.permission.download);
      let params = {
        filePath: data.filePath
      };
      let suffix = params.filePath.split(".")[1];
      $contract.downloadAll(url, method, params).then(res => {
          downloadFile(res, data.fileName.split(".")[0], suffix);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    formdata() {
      let formdata = new FormData();
      for (let i in this.contractForm) {
        formdata.append(i, this.contractForm[i]);
      }
      formdata.forEach((value, key) => {
        console.log(key, value);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}

.colors {
  color: #206aff;
}

.infoBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  .el-input{
     width: 350px;
   }
}

.gobackCls {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.gobackCls div {
  margin-left: 10px;
  font-size: 12px;
  color: #666666;
}

.info {
  font-weight: 700;
  color: #333;
  font-size: 16px;
  background-position: 0 4px;
  padding-left: 10px;
  background-repeat: no-repeat;
  margin-bottom: 10px;
}

::v-deep.el-select {
  width: 100% !important;
}

.invoiceBox {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.invoiceInfo {
  border-radius: 8px;
  margin-right: 5px;
}
.invoiceInfos {
  // width: 25%;
  // height: calc(100vh - 362px);
  border-radius: 8px;
  //background-color: #f1f1f1;
  margin-top: 10px;
  margin-right: 5px;
  // .el-input {
  //   width: 360px;
  // }
}

.isfujian {
  min-height: 100px;
}

.attachmentInfo {
  margin-left: 5px;
  width: 50%;
  // height: 490px;
  // height: calc(100vh - 445px);
  border-radius: 8px;
  // background-color: #f1f1f1;
  padding: 20px;
  margin-top: 10px;
  .el-button {
    margin-left: 80px;
  }
}

.date-picker {
  width: 100%;
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}

::v-deep .el-form-item--small.el-form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  .el-form-item__content {
    flex: 1;
    margin-left: 0 !important;
  }
}

::v-deep.el-radio .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #206aff;
}

.btnBox {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  height: 85px;
  //background: #f1f1f1;
  margin-top: 10px;
  button {
    height: 42px;
    display: block;
    margin-top: 10px;
  }
}

.upload-demo {
  // margin-left: 50px;
  button {
    margin: 20px 0;
  }
}
.el-button--primary {
    color: #FFFFFF;
    background-color: #409eff;
    border-color: #409eff;
}
.hetong {
  position: relative;
  left: -73px;
  p {
    margin-left: 50px;
    span {
      display: inline-block;
      color: #206aff;
      padding-top: 15px;
      border-bottom: 1px solid #206aff;
      cursor: pointer;
    }
  }
}

.configBtn {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
  margin-left:120px;
}
.checkInfo {
  width: 50%;
  ::v-deep.el-select {
    width: 47% !important;
  }
}
</style>
