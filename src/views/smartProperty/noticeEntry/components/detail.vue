<template>
  <div>
    <!--
      <div @click="onBack" class="backtext">
      <svg aria-hidden="true" class="svg-icon">
        <use href="#icon-icon-goback"/>
      </svg>
      <span>返回上一页</span>
    </div>
    -->
    <div class="basicInfo">
      <div >
        <!--<img src="@/assets/images/arrow.png" alt="" style="display: inline-block">-->
        <p class="info" style="display: inline-block">基本信息</p>
        <el-row >
          <el-form ref="contractForm" :model="contractForm" label-width="80px">
            <el-col :span="12">
              <el-form-item label="客户名称" prop="companyName">
                <el-input v-model="contractForm.companyName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="园区位置" prop="parkLocation">
                <el-input v-model="contractForm.parkLocation" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号" prop="serialNumber">
                <el-input v-model="contractForm.serialNumber" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="录入日期">
                <el-date-picker
                  v-model="contractForm.createTime"
                  type="date"
                  disabled
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="起始日期">
                <el-date-picker
                  v-model="contractForm.startDate"
                  type="date"
                  disabled
                  :class="[datepicker]"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止日期">
                <el-date-picker
                  v-model="contractForm.endDate"
                  type="date"
                  disabled
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="租金"
              >
                <el-input
                  v-model="contractForm.rent"
                  disabled
                ><template slot="append">月</template></el-input>
              </el-form-item>
            </el-col>
           <!-- <el-col :span="12" v-show="!contractForm.propertyCost">
              <el-form-item
                label="物业费"
              >
                <el-input
                  v-model="contractForm.propertyFee"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
            <el-col  :span="24">
              <el-form-item
                label="租金包含项"
              >
                <el-checkbox disabled v-model="contractForm.waterCost" :true-label="1" :false-label="0">水费</el-checkbox>
                <el-checkbox disabled v-model="contractForm.electricityCost" :true-label="1" :false-label="0">电费</el-checkbox>
                <el-checkbox disabled v-model="contractForm.propertyCost" :true-label="1" :false-label="0">物业费</el-checkbox>
              </el-form-item>
            </el-col>
          </el-col>
           <el-col :span="24">
              <el-form-item
                label="免租期"
              >
                <el-input
                  v-model="contractForm.rentFree"
                  disabled
                ><template slot="append">月</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付方式">
                <el-col style="text-align: center" :span="2">押</el-col>
                <el-col :span="10">
                  <el-select disabled v-model="contractForm.pledge"></el-select>
                </el-col>
                <el-col style="text-align: center" :span="2">付</el-col>
                <el-col :span="10">
                  <el-select disabled v-model="contractForm.pay"></el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经办人">
                <el-select v-model="contractForm.transactor" disabled>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="租赁房间">
                <el-input type="textarea" :rows="1" v-model="contractForm.rentalRoom" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注信息">
                <el-input type="textarea" :rows="2" v-model="contractForm.remark" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>

    </div>
    <div class="invoiceInfo">
      <!--<img src="@/assets/images/arrow.png" alt="" style="display: inline-block;">-->
      <p class="info" style="display: inline-block">开票信息</p>
      <el-row >
      <el-form ref="invoiceForm" :model="invoiceForm" label-width="80px">
      <el-col :span="24">
        <el-form-item label="发票类型" prop="type">
          <el-radio
            v-model="invoiceForm.type"
            v-for="item in invoiceTypes"
            :key="item.value"
            :value="item.value"
            :label="item.value"
            disabled
          >{{item.label}}
          </el-radio>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票抬头" prop="taxpayer">
            <el-input v-model="invoiceForm.taxpayer" placeholder="请输入发票抬头" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人识别码" prop="taxpayerNumber">
            <el-input v-model="invoiceForm.taxpayerNumber" placeholder="请输入纳税人识别码" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业电话" prop="telephone">
            <el-input v-model="invoiceForm.telephone" placeholder="请输入企业电话" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行" prop="bank">
            <el-input v-model="invoiceForm.bank" placeholder="请输入开户行" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="开户行账号" prop="bankAccount">
          <el-input v-model="invoiceForm.bankAccount" placeholder="请输入开户行账号" disabled></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
         <el-form-item label="企业地址" prop="address">
          <el-input v-model="invoiceForm.address" placeholder="请输入地址" disabled></el-input>
        </el-form-item>
        </el-col>
      </el-form>
      </el-row>
    </div>
    <div class="attachmentInfo">
      <img src="@/assets/images/arrow.png" alt="" style="display: inline-block">
      <p class="info" style="margin-bottom: 0;display: inline-block">附件信息</p>
      <el-button type="primary" @click="download()" style="display: block;margin: 18px 0 0 16px ;">下载附件</el-button>
    </div>
    <div style="text-align: right;margin: 10px 0 0 0 ;" class="btnheight">
      <!--<el-button @click="onSubmit()" type="primary">确认</el-button>-->
      <el-button @click="onBack()" plain>取消</el-button>
    </div>
  </div>
</template>

<script>
  import {downloadFile} from '@/utils/index'
  import {getCompanyDetail, downloads} from '@/api/smartProperty/notice'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";

  export default {
    name: 'Detail',
    props: {
      rowData: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        permission: {
          enteringDetail: 'smartProperty::notice::enteringDetail',
          downloadfiles: 'smartProperty::notice::downloadfiles',
        },
        detailShow: true,
//        基本信息表单
        contractForm: {
          companyName: '',
          serialNumber: '',
          parkLocation: '',
          startDate: '',
          endDate: '',
          transactor: 0,
          rentalRoom: '',

        },
//        发票数据表单
        invoiceForm: {},
//        发票类型
        invoiceTypes: [
          {
            value: 'ORDINARY',
            label: '普通发票'
          },
          {
            value: 'SPECIAL_USE',
            label: '专用发票'
          }
        ],
        datepicker: "date-picker",
        detail: [],
      }
    },
    mounted() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        // let data = getObjByKey(this.permission.enteringDetail);
        let url = '/pm/company_enter/entering_company/detail/'
        let method = 'GET'
        let id = this.rowData.noticeId;
        getCompanyDetail(url, method, id).then(res => {
          this.detail = res.data.attachments;
          this.contractForm.companyName = res.data.companyName;
          this.contractForm.parkLocation = res.data.parkLocation;
          this.contractForm.rentalRoom = res.data.rentalRoom;
          this.contractForm.createTime = res.data.contract.createTime.split(' ')[0];
          this.contractForm.serialNumber = res.data.contract.serialNumber;
          this.contractForm.startDate = res.data.contract.startDate;
          this.contractForm.endDate = res.data.contract.endDate;
          this.contractForm.transactor = res.data.contract.transactor;
          this.contractForm.remark = res.data.contract.remark;
          this.contractForm.rentFree = res.data.contract.rentFree;
          this.contractForm.propertyFee = res.data.contract.propertyFee;
          this.contractForm.rent = res.data.contract.rent;
          this.invoiceForm = res.data.invoice;
          this.invoiceForm.address = res.data.invoice.address.slice(0, res.data.invoice.address.lastIndexOf('-'))
          //押一付三
          let pledge = res.data.contract.paymentMode.split("-")[0];
          let pay = res.data.contract.paymentMode.split("-")[1];
          this.contractForm.pledge = pledge;
          this.contractForm.pay = pay;
        })
      },
      onBack() {
        this.$emit('detailVisibleShow', true)
      },
//     校验手机或固话
      validatePhoneTwo(rule, value, callback) {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
        if (value === '' || value === undefined || value == null) {
          callback()
        } else {
          if ((!reg.test(value)) && value !== '') {
            callback(new Error('请输入正确的电话号码或者固话号码'))
          } else {
            callback()
          }
        }
      },
      download() {
        let url = '/pm/fastdfs/download/file'
        let method = 'GET'
        // let data = getObjByKey(this.permission.downloadfiles);
        this.detail.forEach(item => {
          downloads(url, method, item.filePath).then(res => {
            let type = res.type.split('/')[1];
            downloadFile(res, '附件信息', type);
          }).catch((err) => {
            this.$message.error(err.message);
          });
        })
      },
    }
  }
  ;
</script>
<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }
  .contractForms ::v-deep .el-checkbox .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #fff !important;
  }
  .info {
    font-weight: 700;
    font-size:16px;
    margin-bottom: 20px;
  }

  .basicInfo {
    ::v-deep.el-select {
      width: 100% !important;
    }
  }

  .invoiceInfo {
    .el-input {
      // width: 360px;
    }
  }

  .date-picker {
    width: 100%;
  }

  // ::v-deep.el-textarea.el-input--small .el-textarea__inner {
  //   resize: none;
  // }

  // ::v-deep .el-form-item--small .el-form-item__content {
  //   // width: calc(100% - 100px);
  // }

  // ::v-deep.el-radio .el-radio__input.is-disabled.is-checked .el-radio__inner {
  //   background-color: #206aff;
  // }

  // ::v-deep.el-button {
  //   border-radius: 4px !important;
  // }

  .btn {
    text-align: center;
    margin-top: 10px;
    background-color: #202230;
    padding: 20px 0;
    border-radius: 8px;
  }

  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }

  .svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
  }

  .backtext {
    
    font-size: 14px;
    cursor: pointer;
    float: right;
  }
</style>
