<template>
  <div v-show="entryShow" style="height: 100%">
    <!--左右两列-->
    <div class="topInfo">
      <div class="">
        <el-row :gutter="20">
          <el-form label-width="80px" class="basicInfos" :rules="basicrules" :model="enteredCompany" ref="basic">
            <el-col :span="12">
              <p class="info">基本信息</p>
            </el-col>
            <!--
              <el-col :span="12">
              <div @click="onCancel" class="backtext">
                <svg aria-hidden="true" class="svg-icon">
                  <use href="#icon-icon-goback"/>
                </svg>
                <span>返回上一页</span>
              </div>
            </el-col>
            -->
            <el-col>
              <el-form-item label="企业名称" prop="companyName">
                <el-input disabled v-model="enteredCompany.companyName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="园区位置" prop="parkLocation">
                <el-input disabled v-model="enteredCompany.parkLocation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业法人" prop="enterpriseLegalPerson">
                <el-input v-model="enteredCompany.enterpriseLegalPerson" placeholder="请输入企业法人" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司电话" prop="telephone">
                <el-input v-model="enteredCompany.telephone" placeholder="请输入公司电话" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业官网">
                <el-input v-model="enteredCompany.officialWebsite" placeholder="请输入企业官网" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司类型" prop="companyType">
                <el-select v-model="enteredCompany.companyType" placeholder="请选择公司类型" :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in company_type"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属行业" prop="industry">
                <el-select v-model="enteredCompany.industry" placeholder="请选择所属行业" :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in industry"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="人员规模" prop="staffScale">
                <el-select v-model="enteredCompany.staffScale" placeholder="请选择人员规模" :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in staff_scale"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成立日期">
                <el-date-picker
                  :append-to-body="false"
                  placeholder="请选择成立日期"
                  v-model="enteredCompany.establishmentDate"
                  type="date"
                   :clearable="false"
                  value-format="yyyy-MM-dd"
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属国家" prop="country">
                <el-select v-model="enteredCompany.country" placeholder="请选择所属国家" :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in companyCountrys"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属区域" prop="area">
                <el-cascader
                  v-if="this.enteredCompany.country==='CHINA'"
                  @change="locationsChange"
                  placeholder="省/市/区"
                  v-model="enteredCompany.area"
                  :props="props"
                ></el-cascader>
                <el-input v-else v-model="enteredCompany.area" placeholder="请输入所属区域" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="备注信息" prop="remark">
                <el-input type="textarea" :row="2" v-model="enteredCompany.remark" placeholder="请输入备注信息"
                          auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <div class="">
        <el-row >
          <el-form label-width="80px" class="basicInfos" :model="enteredCompanyClass" :rules="sortrules"
                   ref="sortrule">
            <el-col>
              <p class="info">分类信息</p>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入驻方式" prop="enterMode">
                <el-select v-model="enteredCompanyClass.enterMode" placeholder="请选择入驻方式" :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in company_enter_mode"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内资/外资" prop="capitalType">
                <el-select v-model="enteredCompanyClass.capitalType" placeholder="请选择投资类型"
                           :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in capital_type"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纳税人规模" prop="taxpayerScale">
                <el-select v-model="enteredCompanyClass.taxpayerScale" placeholder="请选择纳税人规模"
                           :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in taxpayer_scale"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="在园/在孵" prop="stage">
                <el-select v-model="enteredCompanyClass.stage" placeholder="请选择发展阶段" :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in company_stage"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="龙头/明星">
                <el-select v-model="enteredCompanyClass.fame" placeholder="请选择龙头/明星" :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in company_fame"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="落户/未落户">
                <el-select v-model="enteredCompanyClass.settled" placeholder="请选择是否落户" :popper-append-to-body="false">
                  <el-option
                    v-for="(item,index) in settleds"
                    :label="item.name"
                    :value="item.value"
                    :key="index"
                  >{{item.name}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col>
              <el-form-item label="企业标签">
                <el-tag
                  v-model="tags"
                  v-for="(tag,index) in company_tag"
                  :key="index"
                  :value="tag.value"
                  style="cursor: pointer;border-color: transparent"
                  :class="tags.indexOf(index)>-1?'colors':''"
                  @click="choosetag(index)"
                >{{tag.name}}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>

    <div class="middleInfo">
      <div class="">
        <el-row >
          <el-form label-width="80px" class="basicInfos" :model="contractForm">
            <el-col>
              <p class="info">合同信息</p>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号">
                <el-input disabled v-model="contractForm.serialNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式">
                <el-col style="text-align: center" :span="2">押</el-col>
                <el-col :span="10">
                  <el-select disabled v-model="contractForm.pledge" :popper-append-to-body="false"></el-select>
                </el-col>
                <el-col style="text-align: center" :span="2">付</el-col>
                <el-col :span="10" style="padding-right: 0">
                  <el-select disabled v-model="contractForm.pay" :popper-append-to-body="false"></el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="租金"
              >
                <el-input
                  v-model="contractForm.rent"
                  disabled
                ><template slot="append">元/月</template></el-input>
              </el-form-item>
            </el-col>
           <!-- <el-col :span="12" v-if="!contractForm.propertyCost">
              <el-form-item
                label="物业费"
              >
                <el-input
                  v-model="contractForm.propertyFee"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item
                label="免租期"
              >
                <el-input
                  v-model="contractForm.rentFree"
                  disabled
                ><template slot="append">月</template></el-input>
              </el-form-item>
            </el-col>
            <el-col  :span="24">
              <el-form-item
                label="租金包含项"
              >
                <el-checkbox disabled v-model="contractForm.waterCost" :true-label="1" :false-label="0">水费</el-checkbox>
                <el-checkbox disabled v-model="contractForm.electricityCost" :true-label="1" :false-label="0">电费</el-checkbox>
                <el-checkbox disabled v-model="contractForm.propertyCost" :true-label="1" :false-label="0">物业费</el-checkbox>
              </el-form-item>
            </el-col>
           
            <el-col :span="12">
              <el-form-item label="起始日期">
                <el-date-picker
                  v-model="contractForm.startDate"
                  disabled
                  type="date"
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期">
                <el-date-picker
                  v-model="contractForm.endDate"
                  disabled
                  type="date"
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="租赁房间">
                <el-input type="textarea" disabled v-model="contractForm.rentalRoom"></el-input>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
      </div>
      <div class="" style="margin-bottom: 20px;">
        <p class="info">附件信息</p>
        <div>
          <div class="flexbox">
            <el-button type="primary" plain @click="downloadattachments">下载附件<i
              class="el-icon-download el-icon--right"/></el-button>
          </div>
        </div>

      </div>
    </div>
    <div class="bottomInfo">
      <el-row >
        <el-form label-width="80px" class="basicInfos" :model="companyBusinessInfo" :rules="companyBusinessInforules"
                 ref="companyBusiness">
          <el-col>
            <p class="info">工商信息</p>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册资本">
              <el-input v-model="companyBusinessInfo.registeredCapital" placeholder="请输入注册资本" auto-complete="off">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实缴资本">
              <el-input v-model="companyBusinessInfo.contributedCapital" placeholder="请输入实缴资本" auto-complete="off">
              <template slot="append">万元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工商状态">
              <el-select v-model="companyBusinessInfo.status" placeholder="请选择工商状态" :popper-append-to-body="false">
                <el-option
                  v-for="(item,index) in business_status"
                  :label="item.name"
                  :value="item.value"
                  :key="index"
                >{{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务状态">
              <el-select v-model="companyBusinessInfo.taxStatus" placeholder="请选择税务状态" :popper-append-to-body="false">
                <el-option
                  v-for="(item,index) in tax_status"
                  :label="item.name"
                  :value="item.value"
                  :key="index"
                >{{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode">
              <el-input v-model="companyBusinessInfo.unifiedSocialCreditCode" placeholder="请输入统一社会信用代码"
                        auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登记机关">
              <el-input v-model="companyBusinessInfo.registrationAuthority" placeholder="请输入登记机关" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册地址">
              <el-input v-model="companyBusinessInfo.registeredAddress" placeholder="请输入注册地址" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册地邮编">
              <el-input v-model="companyBusinessInfo.registeredPostcode" placeholder="请输入注册地邮编" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业地址">
              <el-input v-model="companyBusinessInfo.companyAddress" placeholder="请输入企业地址" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营地邮编">
              <el-input v-model="companyBusinessInfo.businessPostcode" placeholder="请输入经营地邮编" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="经营范围">
              <el-input type="textarea" :row="2" v-model="companyBusinessInfo.businessScope" placeholder="请输入经营范围"
                        auto-complete="off"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="text-align: right;margin: 10px 0 0 0 ;" class="btnheight">
      <el-button @click="onSubmit()" type="primary">确认</el-button>
      <el-button @click="onBack()" plain>取消</el-button>
    </div>

  </div>
</template>

<script>
  import {
    getcompanyCountry,
    getAdress,
  } from '@/api/smartProperty/dictionaries.js'

  import {downloadFile} from '@/utils/index'
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import {getCompanyDetail, addentered, downloads} from "@/api/smartProperty/notice.js";
  import {get} from "@/api/system/dicttype";

  export default {
    name: 'settlement',
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
          addEnter: 'smartProperty::notice::addEnter',
          downloadfiles: 'smartProperty::notice::downloadfiles',
        },
        entryShow: true,
        datepicker: "date-picker",
        countryrules: {},
        basicrules: {
          companyName: [
            {required: true, message: '请输入企业名称', trigger: ['change']}
          ],
          parkLocation: [
            {required: true, message: '请输入园区位置', trigger: ['change']}
          ],
          telephone: [
            {validator: this.validatePhoneTwo, trigger: ['blur', 'change'], required: true, message: '请输入正确的公司电话'}
          ],
          companyType: [
            {required: true, message: '请选择公司类型', trigger: ['blur', 'change']},
          ],
          industry: [
            {required: true, message: '请选择所属行业', trigger: ['blur', 'change']},
          ],
          staffScale: [
            {required: true, message: '请选择人员规模', trigger: ['blur', 'change']},
          ],
          remark: [
            {required: true, message: '请输入备注信息', trigger: ['blur', 'change']},
          ],
          country: [
            {required: true, message: '请选择所属国家', trigger: ['blur', 'change']},
          ],
          area: [
            {required: true, message: '请输入所选区域', trigger: ['blur', 'change']},
          ],
        },
        sortrules: {
          enterMode: [
            {required: true, message: '请选择入驻方式', trigger: ['blur', 'change']}
          ],
          capitalType: [
            {required: true, message: '请选择内资/外资', trigger: ['blur', 'change']}
          ],
          taxpayerScale: [
            {required: true, message: '请选择纳税人规模', trigger: ['blur', 'change']},
          ],
          stage: [
            {required: true, message: '请选择在园/在孵', trigger: ['blur', 'change']},
          ]
        },
        enteredCompany: {
          companyName: '',
          parkLocation: '',
          enterpriseLegalPerson: '',
          telephone: '',
          officialWebsite: '',
          companyType: '',
          industry: '',
          staffScale: '',
          establishmentDate: '',
          remark: '',
          address: '',
          country: '',
          area: "",
        },
        enteredCompanyClass: {
          companyId: '',
          enterMode: '',
          investment: '',
          taxpayerScale: '',
          gardenOrHatching: '',
          star: '',
          settle: '',
          tags: '',
        },
//        合同信息
        contractForm: {},
//        工商信息
        companyBusinessInfo: {
          businessPostcode: "",
          businessScope: "",
          companyAddress: "",
          contributedCapital: "",
          id: "",
          registeredAddress: "",
          registeredCapital: "",
          registeredPostcode: "",
          registrationAuthority: "",
          status: "",
          taxStatus: "",
          unifiedSocialCreditCode: "",
        },
        companyBusinessInforules: {
          unifiedSocialCreditCode: [
            {required: true, message: '请输入统一社会信用代码', trigger: ['blur', 'change']}
          ],
        },
//        选择的公司标签，用','拼接成字符串传递
        tags: [],
        staff_scale: [],
        company_type: [],
        industry: [],
        company_enter_mode: [],
        capital_type: [],
        taxpayer_scale: [],
        company_stage: [],
        company_fame: [],
        company_tag: [],
        companyCountrys: [],
        business_status: [],
        tax_status: [],
        contractId: '',
        settleds: [
          {
            name: "已落户",
            value: true
          },
          {
            name: "未落户",
            value: false
          }
        ],
        props: {
          lazy: true,
          async lazyLoad(node, resolve) {
            const {level} = node;
            if (level == 0) {
              const data = await getAdress('/pm/region/all', 'GET');
              let nodes = data.data.filter(item => {
                return item.level === 0
              });
              nodes = nodes.map(item => {
                return {
                  value: item.name,
                  label: item.name,
                  id: item.id,
                  leaf: false,
                }
              });
              resolve(nodes);
            } else if (level == 1) {
              const data = await getAdress('/pm/region/all', 'GET');
              let nodes = data.data.filter(item => {
                return item.level === 1 && node.data.id === item.pid
              });
              nodes = nodes.map(item => {
                return {
                  value: item.name,
                  label: item.name,
                  id: item.id,
                  leaf: false,
                }
              });
              nodes.unshift({
                value: 0,
                label: "全部",
                leaf: true,
              });
              resolve(nodes);
            } else if (level == 2) {
              const data = await getAdress('/pm/region/all', 'GET');
              let nodes = data.data.filter(item => {
                return item.level === 2 && node.data.id === item.pid
              });
              nodes = nodes.map(item => {
                return {
                  value: item.name,
                  label: item.name,
                  id: item.id,
                  leaf: true,
                }
              });
              nodes.unshift({
                value: 0,
                label: "全部",
                leaf: true,
              });
              resolve(nodes);
            }
          }
        },

        dictionary: ['staff_scale', 'company_type',
          'industry', 'company_enter_mode', 'capital_type',
          'taxpayer_scale', 'company_stage',
          'business_status', 'tax_status',
          'company_fame', 'company_tag'],
        attachments: [],
      }
    },
    created() {
    },
    watch: {
      'enteredCompany.country'(newValue, oldValue) {
        this.enteredCompany.area = [];
        if (newValue === "CHINA") {
          this.$refs['basic'].clearValidate(['area']);
          this.$set(this.basicrules, 'area', [
            {type: 'array', required: true, message: '请选择所属区域', trigger: ['blur']},
          ]);
        } else if (newValue === "OTHER") {
          this.$refs['basic'].clearValidate(['area']);
          this.enteredCompany.area = "";
          this.$set(this.basicrules, 'area', [
            {required: true, message: '请输入所属区域', trigger: ['blur', 'change']},
          ])
        }
      }
    },
    mounted() {
      this.getDetail();
      this.getdict();
      this.getcompanyCountrys();
    },
    methods: {
//      获取字典
      getdict() {
        this.dictionary.forEach(item => {
          get(item).then(res => {
            this.$set(this, item, [...res.data])
          })
        });
      },

      /* 是否手机号码或者固话*/
      validatePhoneTwo(rule, value, callback) {
        console.log(value, 'fff');
        const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
        if (value === '' || value === undefined || value == null) {
          callback(new Error('请输入正确的电话号码或者固话号码'))
        } else {
          if ((!reg.test(value)) && value !== '') {
            callback(new Error('请输入正确的电话号码或者固话号码'))
          } else {
            callback()
          }
        }
      },
      getDetail() {
        // let data = getObjByKey(this.permission.enteringDetail);
        let url = '/pm/company_enter/entering_company/detail/'
        let method = 'GET'
        let id = this.rowData.noticeId;
        getCompanyDetail(url, method, id).then(res => {
            this.attachments = res.data.attachments;
            this.contractForm.serialNumber = res.data.contract.serialNumber;
            this.contractForm.pledge = res.data.contract.paymentMode.split("-")[0];
            this.contractForm.pay = res.data.contract.paymentMode.split("-")[1];
            this.contractForm.parkLocation = res.data.parkLocation;
            this.contractForm.rentalRoom = res.data.rentalRoom;
            this.contractForm.startDate = res.data.contract.startDate;
            this.contractForm.endDate = res.data.contract.endDate;
            this.contractForm.rentFree = res.data.contract.rentFree;
            this.contractForm.propertyFee = res.data.contract.propertyFee;
            this.contractForm.rent = res.data.contract.rent;
//            this.enteredCompanyClass = res.data.enteredCompanyClass;
            this.enteredCompany.companyId = res.data.contract.companyId;
            this.enteredCompany.companyName = res.data.companyName;
            this.enteredCompany.parkLocation = res.data.parkLocation;
            this.contractId = res.data.contract.id;
        }).catch(err => {
          this.$message.error(err.message);
        })
      },
      onBack() {
        this.$refs.basic.resetFields();
        this.$refs.sortrule.resetFields();
        this.$refs.companyBusiness.resetFields();
        this.$emit('settlementVisibleShow', true)
      },
      choosetag(index) {
        let arrIndex = this.tags.indexOf(index);
        if (arrIndex > -1) {
          this.tags.splice(arrIndex, 1);
        } else {
          this.tags.push(index);
        }
      },
      getcompanyCountrys() {
        getcompanyCountry().then(res => {
          console.log(res,'res99999999999999')
          this.companyCountrys = res.data;
        }).catch(err => {
        })
      },
      onSubmit() {
        let p1 = new Promise((resolve, reject) => {
          this.$refs['basic'].validate(valid => {
            if (valid) {
              resolve()
            }
          })
        });
        let p2 = new Promise((resolve, reject) => {
          this.$refs['sortrule'].validate(valid => {
            if (valid) {
              resolve()
            }
          })
        });
        let p3 = new Promise((resolve, reject) => {
          this.$refs['companyBusiness'].validate(valid => {
            if (valid) {
              resolve()
            }
          })
        });
        Promise.all([p1, p2, p3]).then(() => {
          // let obj = getObjByKey(this.permission.addEnter);
          let url = '/pm/company_enter'
          let method = 'POST'
          let tagarray = [];
          if (this.tags.length != 0) {
            for (let i = 0; i < this.tags.length; i++) {
              tagarray.push(this.company_tag[this.tags[i]].value);
            }
          }
          let tagsStr = tagarray.join(',');
          this.enteredCompanyClass.tags = tagsStr;
          let noticeId = this.rowData.noticeId;
          let company = this.enteredCompany;
          if (company.country === "CHINA") {
            let areastr = company.area.join(',');
            company.address = areastr;
          } else {
            company.address = '其他' + ',' + company.area;
          }
          delete company.locationsData;
          delete company.area;
          delete company.country;
          let data = {
            companyBusinessInfo: this.companyBusinessInfo,
            contractId: this.contractId,
            enteredCompany: company,
            enteredCompanyClass: this.enteredCompanyClass,
            noticeId: noticeId
          };
          addentered(url, method, data).then(res => {
            this.$message.success("添加成功");
            this.onBack();
          }).catch(err => {
            this.$message.error(err.message);
          })
        }).catch(error => {
          this.$message.error("请填写完所有必填项");
          return false
        })
      },
      locationsChange(value) {
        this.locationsData = value;
      },
      downloadattachments() {
        // let data = getObjByKey(this.permission.downloadfiles);
        let url = '/pm/fastdfs/download/file'
        let method = 'GET'
        this.attachments.forEach(item => {
          downloads(url, method, item.filePath).then(res => {
            let type = res.type.split('/')[1];
            downloadFile(res, '附件信息', type);
          }).catch((err) => {
            this.$message.error(err.message);
          });
        })
      },
      onCancel() {
        this.onBack();
      }
    }
  };
</script>

<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .topInfo {
    // height: 470px;
    .left {
      width: 50%;
      height: 100%;
      float: left;
      // background-color: #202230;
      padding: 20px;
      border-radius: 8px;
    }
    .right {
      width: calc(100% - 50% - 10px);
      float: right;
      height: 100%;
      // background-color: #202230;
      padding: 20px;
      border-radius: 8px;
    }
  }

  .middleInfo {
    // height: 420px;
    // margin-top: 10px;
    .left {
      width: 50%;
      height: 100%;
      float: left;
      // background-color: #202230;
      padding: 20px;
      border-radius: 8px;
    }
    .right {
      width: calc(100% - 50% - 10px);
      float: right;
      // background-color: #202230;
      padding: 20px;
      border-radius: 8px;
      position: relative;
      height: inherit;
      .flexbox {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    span {
      color: #fff;
    }
  }

  .bottomInfo {
    // margin-top: 10px;
    // background-color: #202230;
    // padding: 20px 20px 0 20px;
    border-radius: 8px;
  }

  .basicInfos .el-select {
    width: 100%;
  }

  .el-cascader {
    width: 100%;
  }

  .basicInfos .date-picker {
    width: 100%;
  }

  .basicInfo {
    font-weight: 900;
    color: #fff;
    margin: 0 0 10px 5px;
  }

  .info {
    font-weight: 700;
    font-size:16px;
    margin-bottom: 20px;
  }

  .el-tag {
    margin: 5px 5px 5px 0;
    text-align: center;
    // color:#FFFFFF;
    // width: 10%;
    &:hover {
      background-color: #1890ff;
      color:#FFFFFF;
    }
  }

  ::v-deep.el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }

  .btnheight {
    // background-color: #202230;
    border-radius: 8px;
    padding: 20px 0;
    height: auto;
  }

  .colors {
    background-color: #1890ff;
    color: #fff;
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
    float: right;
    
    font-size: 14px;
    cursor: pointer;
  }
</style>
