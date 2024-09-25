<template>
  <!--<div  style="height: 100%;">-->
  <div
    class="basicInfo"
    style="overflow: auto; height: 100%"
    v-show="detailShow"
  >
    <div style="width: 100%">
      <div class="infoBox">
        <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
          原合同信息
        </p>
      </div>
      <el-row>
        <el-form ref="contractForm" label-width="100px">
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="企业名称">
                <el-autocomplete
                  style="width: 100%"
                  v-model="oldContract.companyName"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同编号">
                <el-input
                  v-model="oldContract.serialNumber"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="开始日期">
                <el-date-picker
                  v-model="oldContract.startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  disabled
                  :class="[datepicker]"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束日期">
                <el-date-picker
                  v-model="oldContract.endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  disabled
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="支付方式">
                <el-col style="text-align:center" :span="3"
                  >押</el-col
                >
                <el-col :span="9">
                  <el-select disabled v-model="oldContract.pledge"></el-select>
                </el-col>
                <el-col style="text-align:center" :span="3"
                  >付</el-col
                >
                <el-col :span="9">
                  <el-select disabled v-model="oldContract.pay"></el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="经办人">
                <el-input v-model="oldContract.transactor" disabled></el-input>
                <!-- <el-select value-key="id" v-model="oldContract.transactor" disabled>
                  <el-option
                    v-for="item in personTableData"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.nickname"
                  />
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="所属园区">
                <el-input v-model="oldContract.park" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属楼宇">
                <el-input v-model="oldContract.floor" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="租赁房间">
                <el-input v-model="oldContract.home" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="备注信息">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="oldContract.remark"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="width: 100%">
      <div class="infoBox">
        <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
          新合同信息
        </p>
      </div>
      <el-row>
        <el-form ref="contractForm" label-width="80px">
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="企业名称">
                <el-autocomplete
                  style="width: 100%"
                  :value="newContract.companyName"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同编号">
                <el-input :value="newContract.serialNumber" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="开始日期">
                <el-date-picker
                  v-model="newContract.startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  disabled
                  :class="[datepicker]"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束日期">
                <el-date-picker
                  v-model="newContract.endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  disabled
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item
                label="租金"
              >
                <el-input
                  v-model="newContract.rent"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
           <el-col :span="6">
              <el-form-item
                label="物业费"
              >
                <el-input
                  v-model="newContract.propertyFee"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
           <el-col :span="12">
              <el-form-item
                label="免租期（月）"
              >
                <el-input
                  v-model="newContract.rentFree"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="支付方式">
                <el-col style="text-align:center" :span="3"
                  >押</el-col
                >
                <el-col :span="9">
                  <el-select disabled v-model="newContract.pledge"></el-select>
                </el-col>
                <el-col style="text-align:center" :span="3"
                  >付</el-col
                >
                <el-col :span="9">
                  <el-select disabled v-model="newContract.pay"></el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="经办人">
                <el-input v-model="newContract.transactor" disabled></el-input>
                <!-- <el-select value-key="id" v-model="newContract.transactor" disabled>
                  <el-option
                    v-for="item in personTableData"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.nickname"
                  />
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="所属园区">
                <el-input v-model="newContract.park" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属楼宇">
                <el-input v-model="newContract.floor" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="租赁房间">
                <el-input v-model="newContract.home" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="备注信息">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="newContract.remark"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div>
      <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
        附件信息
      </p>
      <el-form
        class="attachments"
        label-width="100px"
        :model="newContract"
        ref="attachmentsForm"
      >
        <el-form-item>
          <div class="hetong">
            <p v-for="(item, index) in newContract.attachments" :key="item.id">
              <span>{{ index + 1 }}.&nbsp;&nbsp;</span
              ><span title="点击下载" @click="download(item)">{{
                item.fileName
              }}</span>
            </p>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="checkInfo">
      <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
        审核
      </p>
      <el-form
        class="invoiceForm"
        ref="checkform"
        :model="checkForm"
        label-width="120px"
        :rules="checkrules"
      >
        <el-col :span="24">
          <el-form-item label="审核结果" prop="auditResult">
            <el-select v-model="checkForm.auditResult">
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
          <el-form-item
            label="审核意见"
            prop="reason"
          >
           <el-input type="textarea" v-model="checkForm.reason"></el-input>
           </el-form-item>
        </el-col>
      </el-form>
    </div>
    <!-- <div class="configBtn"> -->
      <div slot="footer">
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="oncheck()"
        style="margin-bottom: 15px"
        >确定
      </el-button>
      <el-button
        plain
        icon="el-icon-close"
        @click="onBack()"
        style="margin-bottom: 15px"
        >取消
      </el-button>
    </div>
  </div>

  <!--</div>-->
</template>

<script>
import { downloadFile } from "@/utils/index";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import $contract from "@/api/spaceManagement/contractManagement.js";
import { getControlTree } from "@/api/spaceManagement/controlManagement";
import { toArr, queryTree } from "@/utils/index";
import { getAll } from "@/api/system/user";
import jiantou from "@/assets/images/jiantou.png";

import { searchByNumber } from "@/api/spaceManagement/changeManagement.js";
import { initData, treeByIdData, unmounted } from "@/api/facility/information";
import { getToken } from "@/utils/auth";

export default {
  name: "Check",
  dicts: ["paymentmode_status", "pay_status"],
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  data() {
    return {
      checkForm: {
        auditResult: true,
        serialNumber:"",
        reason:"",
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
      newContract: {},
      oldContract: {},
      jiantou,
      fileList: [],
      action: process.env.VUE_APP_BASE_API + "/file/pm/fastdfs/upload/file",
      permission: {
        detail: "spaceManagement::contractManagement::detail",
        add: "spaceManagement::contractManagement::add",
        treeAll: "spaceManagement::controlManagement::treeAll",
        floorList: "spaceManagement::controlManagement::floorList",
        roomList: "spaceManagement::controlManagement::roomList",
        rendtedRoom: "spaceManagement::contractManagement::rendtedRoom",
        getAlluser: "system::sys::userName",
        // 根据名称查询设备厂商信息(厂商信息下拉搜索按钮)
        getManufacturer: "facility::information::getManufacturer",
        // 新增公司
        addCompany: "facility::contractManagement::addCompany",
        search: "spaceManagement::contractManagement::search",
        // 合同上传
        upload: "spaceManagement::contractManagement::upload",
        // 合同下载
        download: "spaceManagement::contractManagement::download",
        change: "spaceManagement::contractManagement::change",
        renew: "spaceManagement::contractManagement::renew",
        searchDetail: "spaceManagement::changeManagement::searchDetail",
        editDetail: "spaceManagement::changeManagement::edit"
      },
      defaultZone: {
        label: "name",
        value: "id"
      },
      detailShow: true,
      company: {},
      //        基本信息表单
      contractForm: {
        attachments: [],
        company: {},
        contract: {},
        invoice: {
          type: "ORDINARY"
        },
        roomRented: {
          buildingName: "",
          roomsTreeNodes: [],
          zoneName: ""
        }
      },
      pledge: "",
      pay: "",
      zoneLocation: "",
      floorLocation: "",
      rentalRoom: "",
      remark: "",
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
      currentzone: [],
      oldzone: "",
      currentbuilding: [],
      oldendDate: "",
      oldDetail: {},
      fromPath:"",
    };
  },
  created() {},
  mounted() {
    this.getDetails();
    this.getDetail();
  },
  methods: {
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
    getDetail() {
      //let data = getObjByKey(this.permission.searchDetail);
      let serialNumber = this.rowData.newSerialNumber;
      searchByNumber('/pm/contract/serialNumber', 'get', serialNumber).then(res => {
        if (res.code === 200) {
          this.checkForm.serialNumber = res.data.contract.serialNumber;
          this.newContract.companyName = res.data.company.name;
          this.newContract.serialNumber = res.data.contract.serialNumber;
          this.newContract.startDate = res.data.contract.startDate;
          this.newContract.endDate = res.data.contract.endDate;
          this.newContract.pledge = res.data.contract.paymentMode.split("-")[0];
          this.newContract.pay = res.data.contract.paymentMode.split("-")[1];
          this.newContract.park = res.data.contract.address.split("-")[0];
          this.newContract.floor = res.data.contract.address.split("-")[1];
          this.newContract.home = res.data.contract.address.split("-")[2];
          this.newContract.remark = res.data.contract.remark;
          this.newContract.transactor = res.data.contract.transactor;
          this.newContract.attachments = res.data.attachments;
          this.$forceUpdate();
          console.log(this.newContract, "ooo");
        } else {
          this.$message.error(res.data);
        }
      });
    },
    getDetails() {
      //let data = getObjByKey(this.permission.searchDetail);
      let serialNumber = this.rowData.oldSerialNumber;
      searchByNumber('/pm/contract/serialNumber', 'get', serialNumber).then(res => {
        if (res.code === 200) {
          this.oldContract.companyName = res.data.company.name;
          this.oldContract.serialNumber = res.data.contract.serialNumber;
          this.oldContract.startDate = res.data.contract.startDate;
          this.oldContract.endDate = res.data.contract.endDate;
          this.oldContract.pledge = res.data.contract.paymentMode.split("-")[0];
          this.oldContract.pay = res.data.contract.paymentMode.split("-")[1];
          this.oldContract.park = res.data.contract.address.split("-")[0];
          this.oldContract.floor = res.data.contract.address.split("-")[1];
          this.oldContract.home = res.data.contract.address.split("-")[2];
          this.oldContract.remark = res.data.contract.remark;
          this.oldContract.transactor = res.data.contract.transactor;
          this.oldContract.rentFree = res.data.contract.rentFree;
          this.oldContract.propertyFee = res.data.contract.propertyFee;
          this.oldContract.rent = res.data.contract.rent;
          this.$forceUpdate();
        } else {
          this.$message.error(res.data);
        }
      });
    },
    onBack() {
      this.$emit("CheckVisibleShow", true);
    },

    download(data) {
      //let obj = getObjByKey(this.permission.download);
      let params = {
        filePath: data.filePath
      };
      let suffix = params.filePath.split(".")[1];
      $contract
        .downloadAll('/pm/fastdfs/download/file', 'get', params)
        .then(res => {
          downloadFile(res, data.fileName, suffix);
        })
        .catch(err => {
          this.$message.error(err.message);
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
  color: #fff;
}

.info {
  font-weight: 700;
  font-size: 16px;
  background-position: 0 4px;
  padding-left: 10px;
  background-repeat: no-repeat;
  height: 40px;
  line-height: 20px;
  margin-bottom:10px;
}

.basicInfo {
  border-radius: 8px;
  //background-color: #202230;
  // padding: 20px 20px 0 20px;
  height: 100%;
  ::v-deep.el-select {
    width: 100% !important;
  }
}

.invoiceBox {
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  flex: 1;
}

.invoiceInfo {
  width: 50%;
  height: calc(100vh - 517px);
  border-radius: 8px;
  background-color: #202230;
  margin-right: 5px;
  .el-input {
    width: 360px;
  }
}

.invoiceInfos {
  width: 25%;
  // height: calc(100vh - 362px);
  border-radius: 8px;
  background-color: #202230;
  margin-top: 10px;
  margin-right: 5px;
  .el-input {
    width: 360px;
  }
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
  background-color: #202230;
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

::v-deep .el-form-item--small .el-form-item__content {
  width: calc(100% - 100px);
  margin-left: 0 !important;
}

::v-deep .el-form-item--small.el-form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
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
  background: #202230;
  margin-top: 10px;
  button {
    height: 42px;
    display: block;
    margin-top: 10px;
  }
}

.upload-demo {
  margin-left: 50px;
  button {
    margin: 20px 0;
  }
}
.hetong {
  position: relative;
  // left: -73px;
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.checkInfo {
  width: 50%;
  ::v-deep.el-select {
    width: 47% !important;
  }
  display: flow-root;
}
</style>
