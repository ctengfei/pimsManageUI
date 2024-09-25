<template>
  <div v-show="portraitShow" class="infos">
    <div style="text-align: center">
      <!--
        <div @click="onBack" class="backtext">
        <svg aria-hidden="true" class="svg-icon">
          <use href="#icon-icon-goback" />
        </svg>
        <span>返回上一页</span>
      </div>
      
      -->

      <div class="flexboxs">
        <span class="video-web-content-title"
          >企业名称: {{ rowData.companyName }}</span
        >
        <span class="video-web-content-title" style="margin-left: 20px"
          >园区位置:
          {{
            rowData.address &&
              rowData.address.slice(0, rowData.address.lastIndexOf("-"))
          }}</span
        >
      </div>
    </div>
    <div class="topInfo color">
      <Tabs
        @btnclick="btnclick($event)"
        :btnGroup="infogroups"
        :btnChoose="infoChoose"
        :singleWidth="94"
      />
      <div class="basicInfo">
        <div style="width: 55%" v-show="infoChoose === 0">
          <el-row>
            <el-form
              ref="basicForm"
              label-width="100px"
              :model="enteredCompany"
            >
              <el-col :span="12">
                <el-form-item label="企业官网" prop="companyName">
                  <el-input
                    disabled
                    class="input"
                    v-model="enteredCompany.officialWebsite"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业电话" prop="telephone">
                  <el-input
                    disabled
                    class="input"
                    v-model="enteredCompany.telephone"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业法人" prop="enterpriseLegalPerson">
                  <el-input
                    disabled
                    class="input"
                    v-model="enteredCompany.enterpriseLegalPerson"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成立日期" prop="establishmentDate">
                  <el-date-picker
                    v-model="enteredCompany.establishmentDate"
                    type="date"
                    disabled
                    :class="[datepicker]"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="人员规模" prop="staffScale">
                  <el-select disabled v-model="enteredCompany.staffScale">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司类型" prop="companyType">
                  <el-select disabled v-model="enteredCompany.companyType">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属行业" prop="industry">
                  <el-select disabled v-model="enteredCompany.industry">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属国家">
                  <el-input
                    disabled
                    v-model="enteredCompany.address"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属区域">
                  <el-input disabled v-model="enteredCompany.area"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注信息" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="2"
                    disabled
                    v-model="enteredCompany.remark"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>

        <div style="width: 55%" v-show="infoChoose === 1">
          <el-row>
            <el-form ref="contractForm" label-width="100px" :model="contract">
              <el-col :span="12">
                <el-form-item label="合同编号" prop="serialNumber">
                  <el-input
                    disabled
                    class="input"
                    v-model="contract.serialNumber"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签订日期" prop="createTime">
                  <el-date-picker
                    v-model="contract.createTime"
                    type="date"
                    disabled
                    :class="[datepicker]"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="起始日期" prop="startDate">
                  <el-date-picker
                    v-model="contract.startDate"
                    type="date"
                    disabled
                    :class="[datepicker]"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截止日期" prop="endDate">
                  <el-date-picker
                    v-model="contract.endDate"
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
                  v-model="contract.rent"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
           <!-- <el-col :span="12">
              <el-form-item
                label="物业费"
              >
                <el-input
                  v-model="contract.propertyFee"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-col  :span="12">
                <el-form-item
                  label="租金包含项"
                  class="contractForms"
                >
                  <el-checkbox :disabled="!iscreate" v-model="contract.waterCost" :true-label="1" :false-label="0">水费</el-checkbox>
                  <el-checkbox :disabled="!iscreate" v-model="contract.electricityCost" :true-label="1" :false-label="0">电费</el-checkbox>
                  <el-checkbox :disabled="!iscreate" v-model="contract.propertyCost" :true-label="1" :false-label="0">物业费</el-checkbox>
                </el-form-item>
              </el-col>
            </el-col>
           <el-col :span="24">
              <el-form-item
                label="免租期（月）"
              >
                <el-input
                  v-model="contract.rentFree"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12">
                <el-form-item label="支付方式">
                  <el-col style=" text-align: center" :span="2"
                    >押
                  </el-col>
                  <el-col :span="10">
                    <el-select
                      disabled
                      v-model="contract.paymentModepledge"
                    ></el-select>
                  </el-col>
                  <el-col style=" text-align: center" :span="2"
                    >付
                  </el-col>
                  <el-col :span="10">
                    <el-select
                      disabled
                      v-model="contract.paymentModepay"
                    ></el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经办人" prop="transactor">
                  <el-select disabled v-model="contract.transactor">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属园区" prop="addresspark">
                  <el-select disabled v-model="contract.addresspark">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属楼宇" prop="addressbuilding">
                  <el-select disabled v-model="contract.addressbuilding">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="租赁房间" prop="addressrentroom">
                  <el-input disabled v-model="contract.addressrentroom" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注信息" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="2"
                    disabled
                    v-model="contract.remark"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <div style="width: 55%" v-show="infoChoose === 2">
          <el-row>
            <el-form
              ref="basicForm"
              label-width="100px"
              :model="enteredCompanyClass"
            >
              <el-col :span="12">
                <el-form-item label="入驻方式">
                  <el-select disabled v-model="enteredCompanyClass.enterMode">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内资/外资" prop="capitalType">
                  <el-select disabled v-model="enteredCompanyClass.capitalType">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纳税人规模" prop="taxpayerScale">
                  <el-select
                    disabled
                    v-model="enteredCompanyClass.taxpayerScale"
                  >
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="在园/在孵" prop="stage">
                  <el-select disabled v-model="enteredCompanyClass.stage">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="龙头/明星" prop="fame">
                  <el-select disabled v-model="enteredCompanyClass.fame">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="落户/未落户" prop="settled">
                  <el-select disabled v-model="enteredCompanyClass.settled">
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="企业标签" prop="tags">
                  <el-tag
                    v-for="(item, index) in tages"
                    disabled
                    style="background-color: #206aff; border-color: transparent; margin-right: 10px;"
                    :key="index"
                    >{{ item }}
                  </el-tag>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <div style="width: 55%" v-show="infoChoose === 3">
          <el-row>
            <el-form
              ref="basicForm"
              label-width="160px"
              :model="companyBusinessInfo"
            >
              <el-col :span="12">
                <el-form-item
                  label="注册资本"
                  prop="registeredCapital"
                  label-width="80px"
                >
                  <el-col :span="24" style="position: relative">
                    <el-input
                      disabled
                      v-model="companyBusinessInfo.registeredCapital"
                    />
                  </el-col>
                  <el-col style="position: absolute; left: calc(100% + 5px)">
                    <span style="color: #afb9d0">万元</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="实缴资本"
                  prop="contributedCapital"
                  label-width="160px"
                >
                  <el-col :span="24" style="position: relative">
                    <el-input
                      disabled
                      v-model="companyBusinessInfo.contributedCapital"
                    />
                  </el-col>
                  <el-col style="position: absolute; left: calc(100% + 5px)">
                    <span style="color: #afb9d0">万元</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工商状态" label-width="80px" prop="status">
                  <el-select
                    disabled
                    v-model="companyBusinessInfo.status"
                  ></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="税务状态"
                  label-width="160px"
                  prop="taxStatus"
                >
                  <el-select
                    disabled
                    v-model="companyBusinessInfo.taxStatus"
                  ></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="登记机关"
                  label-width="80px"
                  prop="registrationAuthority"
                >
                  <el-input
                    disabled
                    v-model="companyBusinessInfo.registrationAuthority"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="统一社会信用代码"
                  prop="unifiedSocialCreditCode"
                >
                  <el-input
                    disabled
                    v-model="companyBusinessInfo.unifiedSocialCreditCode"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="注册地址"
                  label-width="80px"
                  prop="registeredAddress"
                >
                  <el-input
                    disabled
                    v-model="companyBusinessInfo.registeredAddress"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="企业地址"
                  label-width="80px"
                  prop="companyAddress"
                >
                  <el-input
                    disabled
                    v-model="companyBusinessInfo.companyAddress"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="经营范围"
                  label-width="80px"
                  prop="businessScope"
                >
                  <el-input
                    type="textarea"
                    :rows="3"
                    disabled
                    v-model="companyBusinessInfo.businessScope"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <div style="width: 30%" v-show="infoChoose === 4">
          <el-row>
            <el-form ref="contractForm" label-width="100px" :model="invoice">
              <el-col>
                <el-form-item label="发票类型" prop="type">
                  <el-radio
                    disabled
                    v-model="invoice.type"
                    v-for="(item, index) in invoiceTypes"
                    :key="index"
                    :value="item.value"
                    :label="item.value"
                    >{{ item.label }}
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="发票抬头" prop="taxpayer">
                  <el-input
                    placeholder="请输入发票抬头"
                    disabled
                    v-model="invoice.taxpayer"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="纳税人识别码" prop="taxpayerNumber">
                  <el-input
                    placeholder="请输入纳税人识别码"
                    disabled
                    v-model="invoice.taxpayerNumber"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="单位电话" prop="telephone">
                  <el-input
                    placeholder="请输入单位电话"
                    disabled
                    v-model="invoice.telephone"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="开户行" prop="bank">
                  <el-input
                    placeholder="请输入开户行"
                    disabled
                    v-model="invoice.bank"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="开户行账号" prop="bankAccount">
                  <el-input
                    placeholder="请输入开户行账号"
                    disabled
                    v-model="invoice.bankAccount"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="地址" prop="address">
                  <el-input
                    placeholder="请输入地址"
                    disabled
                    v-model="invoice.address"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </div>
    </div>
    <div class="tableInfo color">
      <Tabs
        @btnclick="recordClick($event)"
        :btnGroup="recordGroups"
        :btnChoose="recordChoose"
        :singleWidth="94"
      />
      <div class="tableheight">
        <!-- 续租记录 -->
        <el-table
          :data="tableData"
          height="85%"
          v-show="recordChoose === 0"
        >
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="applyDate" label="申请日期"></el-table-column>
          <el-table-column
            prop="oldSerialNumber"
            label="合同编号(旧)"
          ></el-table-column>
          <el-table-column
            prop="newSerialNumber"
            label="合同编号(新)"
          ></el-table-column>
          <el-table-column
            prop="companyName"
            label="公司名称"
          ></el-table-column>
          <el-table-column prop="operator" label="操作人员"></el-table-column>
        </el-table>

        <!-- 退租 -->
        <el-table
          :data="tableData"
          height="85%"
          v-show="recordChoose === 1"
        >
          <el-table-column
            type="index"
            label="序号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="申请日期"
            prop="createTime"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="合同编号"
            prop="contractSn"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="退租类型"
            prop="giveupAll"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.giveupAll ? "整体退租" : "部分退租" }}</span>
            </template></el-table-column
          >
          <el-table-column
            label="是否提前退租"
            prop="giveupAhead"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.giveupAhead ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作人员"
            prop="creatorName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="操作时间"
            prop="createTime"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>

        <el-table
          :data="tableData"
          height="85%"
          v-show="recordChoose === 2"
        >
          <el-table-column
            label="序号"
            type="index"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="账单编号"
            prop="id"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column
            label="费用项目"
            prop="feeItemCode"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ filterItem(scope.row.feeItemCode) }}
            </template>
          </el-table-column> -->
          <el-table-column
            label="计费周期"
            prop="billStart"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.billStart }} ~ {{ scope.row.billEnd }}
            </template>
          </el-table-column>
          <el-table-column
            label="应收金额(元)"
            prop="receivableAmount"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="实收金额(元)"
            prop="actualAmount"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="账单创建时间"
            prop="billEnd"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <pagination
          v-show="tableData && tableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="pageNum"
          :pageSizes="[5, 10, 20]"
          :limit.sync="pageSize"
          :total="total"
        />
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/comPagination";
import { initTabData } from "@/api/smartProperty/rentrelase";
import { searchChange } from "@/api/spaceManagement/changeManagement.js";
import {
  initportraitTabData,
  getdetails,
  getdetail
} from "@/api/smartProperty/notice";
import { initTabDatas } from "@/api/smartProperty/configure";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { get } from "@/api/system/dicttype";
import Tabs from "@/components/commonTabs";

export default {
  components: { pagination, Tabs },
  name: "Portraits",
  // props: {
  //   rowData: {
  //     type: Object,
  //     default: () => {
  //       return {};
  //     }
  //   }
  // },
  data() {
    return {
      permission: {
        entered: "smartProperty::settled::portrait",
        getFee: "smartProperty::configure::getFee",
        search: "spaceManagement::changeManagement::search"
      },
      portraitShow: true,
      iscreate: true,
      infogroups: [
        {
          value: 1,
          label: "入驻信息"
        },
        {
          value: 2,
          label: "合同信息"
        },
        {
          value: 3,
          label: "分类信息"
        },
        {
          value: 4,
          label: "工商信息"
        },
        {
          value: 5,
          label: "开票信息"
        }
      ],
      infoChoose: 0,
      recordGroups: [
        {
          value: 1,
          label: "续租记录"
        },
        {
          value: 2,
          label: "退租记录"
        },
        {
          value: 3,
          label: "费用缴纳"
        }
      ],
      recordChoose: 0,
      datepicker: "date-picker",
      //        发票类型
      invoiceTypes: [
        {
          value: "ORDINARY",
          label: "普通发票"
        },
        {
          value: "SPECIAL_USE",
          label: "专用发票"
        }
      ],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      tableData: [],
      enteredCompany: {},
      contract: {},
      companyBusinessInfo: {},
      enteredCompanyClass: {},
      invoice: {},
      staff_scale: [],
      company_type: [],
      industry: [],
      company_enter_mode: [],
      capital_type: [],
      taxpayer_scale: [],
      company_stage: [],
      company_fame: [],
      company_tag: [],
      business_status: [],
      tax_status: [],
      tags: [],
      tages: [],
      dictionary: [
        "staff_scale",
        "company_type",
        "industry",
        "company_enter_mode",
        "capital_type",
        "taxpayer_scale",
        "company_stage",
        "business_status",
        "tax_status",
        "company_fame",
        "company_tag"
      ],
      feeProjects: [],
      formSearch: {
        serialNumber: "",
        companyName: "",
        operateType: "RENEW",
        endTime: "",
        startTime: "",
        pageNum: 0,
        pageSize: 0
      },
      rowData:{}
    };
  },
  mounted() {
    this.getSearchData();
    this.getdict();
    // this.getTableData();
    this.getRecordData();
    console.log(this.$route.query.player,'this.$route.query.player')
    this.rowData = JSON.parse(decodeURI(this.$route.query.player))
    console.log(this.rowData,'this.rowData')
  },
  methods: {
    //      获取字典
    getdict() {
      this.dictionary.forEach(item => {
        get(item).then(res => {
          this.$set(this, item, [...res.data]);
        });
      });
    },
    getSearchData() {
      // let obj = getObjByKey(this.permission.getFee);
      let url = '/pm/property/feeItem'
      let method = 'GET'
      initTabDatas(url, method)
        .then(res => {
          res.data.map(item => {
            this.feeProjects.push({
              name: item.name,
              code: item.code
            });
          });
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    filterItem(data) {
      let res = this.feeProjects.filter(item => {
        return item.code == data;
      });
      return res[0].name;
    },
    getTableData() {
      // let obj = getObjByKey(this.permission.entered);
      let url = '/pm/company_enter/entered_company/detail/'
      let method = 'GET'
      initportraitTabData(
        url,
        method,
        this.rowData.enteredCompanyId
      ).then(res => {
        // 入住信息
          if (res.data.enteredCompany) {
            this.enteredCompany = res.data.enteredCompany;
            let objentered = res.data.enteredCompany;
            for (let key in objentered) {
              if (key == "companyType") {
                if (objentered[key] != "") {
                  let newarr = this.company_type.filter(item => {
                    return item.value == objentered[key];
                  });
                  this.enteredCompany.companyType = newarr[0].name;
                }
              } else if (key == "industry") {
                if (objentered[key] != "") {
                  let newarr = this.industry.filter(item => {
                    return item.value == objentered[key];
                  });
                  this.enteredCompany.industry = newarr[0].name;
                }
              } else if (key == "staffScale") {
                if (objentered[key] != "") {
                  let newarr = this.staff_scale.filter(item => {
                    return item.value == objentered[key];
                  });
                  this.enteredCompany.staffScale = newarr[0].name;
                }
              } else if (key == "address") {
                if (objentered[key].indexOf("其他") != -1) {
                  this.enteredCompany.area = objentered[key].split(",")[1];
                  this.enteredCompany.address = objentered[key].split(",")[0];
                } else {
                  this.enteredCompany.area = objentered[key];
                  this.enteredCompany.address = "中国";
                }
              }
            }
          }
          // 合同
          if (res.data.contract) {
            this.contract = res.data.contract;
            this.contract.paymentModepledge = res.data.contract.paymentMode.split(
              "-"
            )[0];
            this.contract.paymentModepay = res.data.contract.paymentMode.split(
              "-"
            )[1];

            let address = res.data.contract.address.split("-");
            this.contract.addresspark = address[0];
            this.contract.addressbuilding = address[1];
            //            楼层
            //            this.contract.addressfloor = address[2];
            this.contract.addressrentroom = address[2];
          } else {
            this.contract.serialNumber = "";
          }
          // 工商
          if (res.data.companyBusinessInfo) {
            this.companyBusinessInfo = res.data.companyBusinessInfo;
            let objBusiness = res.data.companyBusinessInfo;
            if (objBusiness) {
              for (let key in objBusiness) {
                if (key == "status") {
                  if (objBusiness[key] != "") {
                    let newarr = this.business_status.filter(item => {
                      return item.value == objBusiness[key];
                    });
                    this.companyBusinessInfo.status = newarr[0].name;
                  }
                } else if (key == "taxStatus") {
                  if (objBusiness[key] != "") {
                    let newarr = this.tax_status.filter(item => {
                      return item.value == objBusiness[key];
                    });
                    this.companyBusinessInfo.taxStatus = newarr[0].name;
                  }
                }
              }
            }
          }

          // 分类
          if (res.data.enteredCompanyClass) {
            this.enteredCompanyClass = res.data.enteredCompanyClass;
            let objClass = res.data.enteredCompanyClass;
            this.tags = objClass.tags.split(",");
            for (let key in objClass) {
              if (key == "enterMode") {
                if (objClass[key] != "") {
                  let newarr = this.company_enter_mode.filter(item => {
                    return item.value == objClass[key];
                  });
                  this.enteredCompanyClass.enterMode = newarr[0].name;
                }
              } else if (key == "capitalType") {
                if (objClass[key] != "") {
                  let newarr = this.capital_type.filter(item => {
                    return item.value == objClass[key];
                  });
                  this.enteredCompanyClass.capitalType = newarr[0].name;
                }
              } else if (key == "taxpayerScale") {
                if (objClass[key] != "") {
                  let newarr = this.taxpayer_scale.filter(item => {
                    return item.value == objClass[key];
                  });
                  this.enteredCompanyClass.taxpayerScale = newarr[0].name;
                }
              } else if (key == "stage") {
                if (objClass[key] != "") {
                  let newarr = this.company_stage.filter(item => {
                    return item.value == objClass[key];
                  });
                  this.enteredCompanyClass.stage = newarr[0].name;
                }
              } else if (key == "settled") {
                if (objClass[key]) {
                  this.enteredCompanyClass.settled = "已入驻";
                } else {
                  this.enteredCompanyClass.settled = "未入驻";
                }
              } else if (key == "tags") {
                if (objClass[key] != "") {
                  let spans = objClass[key].split(",");
                  for (let i = 0; i < spans.length; i++) {
                    let newarr = this.company_tag.filter(item => {
                      return item.value == spans[i];
                    });
                    this.tages.push(newarr[0].name);
                    this.tages = [...new Set(this.tages)];
                  }
                }
              } else if (key == "fame") {
                if (objClass[key]) {
                  let newarr = this.company_fame.filter(item => {
                    return item.value == objClass[key];
                  });
                  this.enteredCompanyClass.fame = newarr[0].name;
                }
              }
            }
          }
          // 开票
          if (res.data.invoice) {
            this.invoice = res.data.invoice;
          }
      });
    },
    onBack() {
      this.$emit("portraitShowVisibleShow", true);
    },
    btnclick(e) {
      this.infoChoose = e.index;
      this.getTableData();
    },

    recordClick(e) {
      this.pageNum= 1;
      this.recordChoose = e.index;
      this.getRecordData();
    },

    handleCurrentChange() {
      this.getRecordData();
    },
    getRecordData() {
      if (this.recordChoose == 0) {
        let data = this.formSearch;
        data = {
          companyId: this.rowData.companyId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          operateType:'RENEW'
        };

        // let obj = getObjByKey(this.permission.search); iscreate
        let url = '/pm/contract/operate/record'
        let method = 'GET'
        searchChange(url, method, data).then(res => {
          this.tableData = res.data.data;
          this.total = res.data.total;
        });
      } else if (this.recordChoose == 1) {
        let data = {
          companyId: this.rowData.companyId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        initTabData(data).then(res => {
          this.tableData = res.data.data;
          this.total = res.data.total;
        });
      } else if (this.recordChoose == 2) {
        let data = {
          companyName: this.rowData.companyName,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        getdetails(data).then(res => {
          this.tableData = res.data.data;
          this.total = res.data.total;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.infos {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
}

.infogroups {
  cursor: pointer;
  background-color: #313448;
  border-radius: 30px;
  width: 480px;
  height: 42px;
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
  & > div {
    display: inline-block;
  }
  .btn {
    width: 94px;
    height: 42px;
    border-radius: 30px;
    line-height: 42px;
    
    font-size: 14px;
  }
  .divActive {
    background-color: #206aff;
    color: #fff;
  }
}

.recordgroups {
  margin-bottom: 20px;
  cursor: pointer;
  background-color: #313448;
  border-radius: 30px;
  width: 282px;
  height: 42px;
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
  & > div {
    display: inline-block;
  }
  .btn {
    width: 94px;
    height: 42px;
    border-radius: 30px;
    line-height: 42px;
    
    font-size: 14px;
  }
  .divActive {
    background-color: #206aff;
    color: #fff;
  }
}

.color {
  // background-color: #202230;
  border-radius: 8px;
  padding: 20px 20px 0 20px;
}

.topInfo {
  /*height: 470px;*/
  height: auto;
  // margin-top: 10px;
}

.tableInfo {
  margin-top: 10px;
  flex: 1;
  padding-bottom: 10px;
  height: calc(100%);
  /*background-color: red;*/
}

.date-picker {
  width: 100%;
}

.basicInfo {
  border-radius: 8px;
  margin-top: 20px;
  ::v-deep.el-select {
    width: 100% !important;
  }
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}

.flexbox {
  display: flex;
  align-items: center;
  justify-content: space-around;
  span {
    margin-left: 5px;
  }
}

::v-deep.el-radio .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #206aff;
}

.flexboxs {
  display: flex;
  align-items: center;
  justify-content: center;
      margin-top: 15px;
  span {
    font-size: 16px;
    
  }
}

.backtext {
  
  font-size: 14px;
  cursor: pointer;
  float: left;
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

.tableheight {
  height: 370px;
  margin-top: 20px;
}
::v-deep .el-table__empty-text {
  padding-top: 210px;
}
::v-deep.el-table.el-table--fit {
  overflow: hidden;
}
</style>
