<template>
  <!--<div  style="height: 100%;">-->
  <div
    class="basicInfo"
    style="overflow: auto; height: 100%"
    v-show="detailShow"
  >
    <div >
      <div class="infoBox">
        <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
          原合同信息
        </p>
        <!--
          <div class="gobackCls" @click="onBack()">
          <svg-icon
            icon-class="icon-goback"
            style="height: 30px; width: 16px"
          />
          <div class="icon-name">返回上一页</div>
        </div>
        -->
      </div>
      <el-row>
        <el-form ref="contractForm" label-width="80px">
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="企业名称">
                <el-autocomplete
                  style="width: 100%"
                  v-model="rowData.companyName"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号">
                <el-input v-model="rowData.serialNumber" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="开始日期">
                <el-date-picker
                  v-model="rowData.startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  disabled
                  :class="[datepicker]"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期">
                <el-date-picker
                  v-model="rowData.endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  disabled
                  :class="[datepicker]"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="租金">
                <el-input v-model="rowData.rent" disabled>
                  <template slot="append">元/月</template>
                </el-input>
              </el-form-item>
            </el-col>
           <el-col :span="12">
              <el-form-item
                label="物业费"
              >
                <el-input
                  v-model="rowData.propertyFee"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
           <el-col :span="12">
              <el-form-item label="免租期">
                <el-input v-model="rowData.rentFree" disabled>
                  <template slot="append">月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付方式">
                <el-col style="text-align:center " :span="3">押</el-col>
                <el-col :span="9">
                  <el-select disabled v-model="pledge"></el-select>
                </el-col>
                <el-col style=" text-align:center" :span="3"
                  >付</el-col
                >
                <el-col :span="9">
                  <el-select disabled v-model="pay"></el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            
            <el-col :span="12">
              <el-form-item label="经办人">
                <el-select value-key="id" v-model="rowData.transactor" disabled>
                  <el-option
                    v-for="item in personTableData"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.nickname"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁房间">
                <el-input v-model="rentalRoom" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="所属园区">
                <el-input v-model="zoneLocation" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属楼宇">
                <el-input v-model="floorLocation" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="24">
              <el-form-item label="备注信息">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="remark"
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
        <el-form ref="contractForm" :model="contractForm" label-width="80px">
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="企业名称" prop="company.name">
                <el-autocomplete
                  style="width: 100%"
                  v-model="contractForm.company.name"
                  disabled
                />
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
                    trigger: ['blur']
                  }
                ]"
              >
                <el-input
                  v-model="contractForm.contract.serialNumber"
                ></el-input>
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
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <el-input v-model="contractForm.contract.rent">
                  <template slot="append">元/月</template>
                </el-input>
              </el-form-item>
            </el-col>
           <el-col :span="12">
              <el-form-item
                label="物业费"
                prop="contract.propertyFee"
                :rules="[
                  {
                    validator: checkNum,
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <el-input v-model="contractForm.contract.propertyFee">
                  <template slot="append">元/月</template>
                </el-input>
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
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <el-input v-model="contractForm.contract.rentFree">
                  <template slot="append">月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="支付方式"
                prop="contract"
                :rules="[
                  {
                    required: true,
                    message: '请选择支付方式',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-col style="text-align:center" :span="3">押</el-col>
                <el-col :span="9">
                  <el-select v-model="contractForm.contract.pledge">
                    <el-option
                      v-for="item in dict.type.paymentmode_status"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
               <el-col style="text-align:center" :span="3">付</el-col
                >
                <el-col :span="9">
                  <el-select v-model="contractForm.contract.pay">
                    <el-option
                      v-for="item in dict.type.pay_status"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="开始日期"
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
                v-model="contractForm.contract.startDate"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                :class="[datepicker]"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
                value-format="yyyy-MM-dd"
                :class="[datepicker]"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            
            <el-col :span="12">
              <el-form-item
                ref="transactor"
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
                <!--
                  <el-select
                  value-key="id"
                  v-model="contractForm.contract.transactor"
                >
                  <el-option
                    v-for="item in personTableData"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.nickname"
                  />
                </el-select>
                -->
                <div style="display: flex;justify-content: space-between;">
                  <p :style="[{color:contractForm.contract.transactor ? '#606266' : '#b4b6bb'},{margin: 0}]">{{ contractForm.contract.transactor ?contractForm.contract.transactor:'尚未选择负责人' }}</p>
                  <el-button type="primary" @click="addDialog" :disabled="addPersonDis">选择用户</el-button>
                </div>
              </el-form-item>
              <el-form-item
                label="类型"
                prop="contract.type"
                style="display: none"
              >
                <el-input v-model="contractForm.contract.type"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁房间" prop="rentalRoom" v-show="renew">
                <el-input v-model="rentalRoom" disabled></el-input>
              </el-form-item>
              <el-form-item
                v-show="!renew"
                label="租赁房间"
                prop="roomRented.roomsTreeNodes"
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
                  :disabled="renew"
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
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item
                label="所属园区"
                prop="roomRented.zoneName"
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
                  v-model="contractForm.roomRented.zoneName"
                  @focus="getAllZoneName"
                  @change="getZoneId"
                  :disabled="renew"
                >
                  <el-option
                    v-for="item in zoneName"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属楼宇"
                prop="roomRented.buildingName"
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
                  v-model="contractForm.roomRented.buildingName"
                  @change="getFloorId"
                  :disabled="renew"
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
            
          </el-col>
          <el-col :span="24">
            <el-col :span="24">
              <el-form-item label="备注信息" prop="contract.remark">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="contractForm.contract.remark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <div :class="{ fujian: renew, isfujian: !renew }">
      <p class="info" :style="{ backgroundImage: 'url(' + jiantou + ')' }">
        附件信息
      </p>
      <el-form
        class="attachments"
        label-width="80px"
        :model="contractForm"
        ref="attachmentsForm"
      >
        <el-form-item
          label="上传合同"
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
            :on-success="handlerChangeSuccese"
            :on-remove="handleRemove"
            :file-list="fileList"
             accept=".doc,.docx,.jpg,.pdf,png"
          :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="configBtn"> -->
      <div slot="footer" style="text-align: right;">
      <el-button
        type="primary"
        @click="onsubmit()"
        style="margin-bottom: 15px"
        >确定
      </el-button>
      <el-button
        plain
        @click="onBack()"
        style="margin-bottom: 15px"
        >取消
      </el-button>
    </div>
     <!-- 选择负责人 -->
    <el-dialog
      :title="title1"
      :visible.sync="sendShow"
      width="850px"
     :append-to-body="true"
      :before-close="cancel1"
    >
      <el-row :gutter="20">
          <el-col>
              <!-- <tree-transfer
                :title="titles"
                :from_data="fromData"
                :to_data="toData"
                :defaultProps="{ label: 'label', disabled: disabledFn }"
                @add-btn="add"
                @remove-btn="remove"
                @left-check-change="leftChange"
                :mode="mode"
                height="320px"
                filter
                openAll
              >
              </tree-transfer> -->
              
              <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/>
          </el-col>
      </el-row>
      <div slot="footer" style="text-align:right;">
        <el-button type="primary"  @click="onSubmit1()">确定</el-button>
        <el-button plain @click="cancel1()">取消</el-button
        >
      </div>
    </el-dialog>
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
import { initData, treeByIdData, unmounted } from "@/api/facility/information";
import { getToken } from "@/utils/auth";
import { getUser1 } from "@/api/system/user";
import ComDeptUser from "@/components/comDeptUser"
export default {
  name: "Renew",
  dicts: ["paymentmode_status", "pay_status"],
  props: {
    renew: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    ComDeptUser
  },
  data() {
    return {
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
        renew: "spaceManagement::contractManagement::renew"
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
      fileDatas: [],
      oldendDate: "",
      parentId: "",
      addPersonDis:false,
      personId: "",
      sendShow: false,
      title1:"添加人员",
    };
  },
  watch:{
    'contractForm.contract.transactor':{
      handler(val){
        if(val){
          this.$refs.transactor.$emit('el.form.change')
        }
      }
    }
  },
  created() {
    // this.search();
  },
  mounted() {
    this.getDetail();
    this.zoneLocation = this.rowData.address.split("-")[0];
    this.floorLocation = this.rowData.address.split("-")[1];
    this.rentalRoom = this.rowData.address.split("-")[2];
    console.log(this.contractForm.contract.transactor,'this.contractForm.contract.transactor')
  },
  methods: {
    addDialog(){
      this.sendShow = true
        this.$refs.comDeptUsers.init()
        this.addPersonDis = false
    },
    // 获取人员id
    selectClick($e){
      console.log($e,'$e')
      this.personId = $e[0]
      this.contractForm.headerUserId = $e[0]
    },
    // 添加人员
    onSubmit1() {
        console.log('6666666666666666')
        // if(this.personCharge.length>0){
        //   this.$message.error("列表中已有负责人，请勿添加");
        // }else{
        //   getUser(this.personId).then(res => {
        //     let data = {
        //       name: res.data.nickName,
        //       account: res.data.userName,
        //       groups: res.data.dept.deptName
        //     };
        //     this.personCharge.push(data)
        //     this.sendShow = false
        //     this.cancel();
        //   });
        // }
        getUser1(this.personId).then(res => {
            let data = {
              name: res.data.nickName,
              account: res.data.userName,
              groups: res.data.dept.deptName
            };
            console.log(data,'data')
            // this.personCharge.push(data)
            this.contractForm.contract.transactor = res.data.nickName
            this.sendShow = false
            // this.cancel();
          });
      },
      cancel1() {
        
        this.sendShow = false;
        // this.getUserInfo();
        // this.$refs.contractForm.resetFields()
      },
    // 校验数字或小数后两位
    checkNum(rule, value, callback){
      const num = /^\d+(\.\d{1,2})?$/;
      if (!value) { //所以当没有值的时候，我们直接callback，让他不校验直接执行下一步
        return callback()
      }else{
        if (num.test(value)) {  //验证通过也下一步
            return callback();
        }else{
          callback(new Error("请输入数字或小数后两位")); //验证不通过下一步只是抛出个错误
        }
      }
    },
    // 校验正整数
    checkNums(rule, value, callback){
      const num = /^[1-9]\d*$/;
      if (!value) { //所以当没有值的时候，我们直接callback，让他不校验直接执行下一步
        return callback()
      }else{
        if (num.test(value)) {  //验证通过也下一步
            return callback();
        }else{
          callback(new Error("请输入数字")); //验证不通过下一步只是抛出个错误
        }
      }
    },
    validatefile(rule, value, callback) {
      if (this.fileDatas.length) {
        callback();
      } else {
        callback(new Error("请上传合同附件"));
      }
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
            type: "warning",
          });
          return false;
        } else {
          this.fileDatas.push({
            uid: file.uid,
            fileName: file.name,
            filePath: res.data.path,
            fileSize: file.size,
            type: "CONTRACT",
          });
        }
    },
      getCompany() {
      this.companyId = "";
      // let obj = getObjByKey('/pm/company');
      let url = "/pm/company";
      let method = "POST";
      let parmas = {
        name: this.contractForm.company.name
          ? this.contractForm.company.name
          : "",
      };
      getControlTree(url, method, parmas).then((res) => {
        this.companyList = [];
          this.companyArr = [];
          this.companyList = res.data;
          for (const item of this.companyList) {
            this.companyArr.push({
              value: item.name, //这里一定是value: '值'
              name: item.name, //这里一定是value: '值'
              id: item.id,
            });
          }
      });
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
      // let obj = getObjByKey(this.permission.treeAll);
      let parmas = {
        nodeType: "DIR"
      };
      getControlTree('/pm/space/tree/whole','get', parmas).then(res => {
        let arr = toArr(res.data);
        this.zoneName = arr.filter(x => x.type === "ZONE");
        this.floorNameTemp = arr.filter(x => x.type === "BUILDING");
        this.roomNameTemp = arr.filter(x => x.type === "ROOM");
        this.currentzone = this.zoneName.filter(x => {
          return x.name == this.contractForm.roomRented.zoneName;
        });
        this.getzone();
      });
    },
    getAllZoneName() {
      this.initTreedata();
    },
    getzone() {
      this.getZoneId(this.currentzone[0]);
    },
    getZoneId(item) {
      this.floorName = this.floorNameTemp.filter(x => x.pid === item.id);
      this.currentbuilding = this.floorName.filter(
        x => x.name === this.contractForm.roomRented.buildingName
      );
      let roomarr = this.contractForm.roomRented.roomsTreeNodes.split(";");
      let data = [];
      roomarr.map(item => {
        console.log(item);
        data.push(
          this.roomNameTemp.filter(
            x => x.name == item && x.pid == this.currentbuilding[0].id
          )[0]
        );
      });
      this.contractForm.roomRented.roomsTreeNodes = data;
      this.getFloorId(this.currentbuilding[0]);
    },

    getFloorId(item) {
      let url = "/pm/space/tree/lazy/rented/room";
      let method = "GET";
      // let obj = getObjByKey(this.permission.rendtedRoom);
      let params = {
        pid: item.id
      };
      $contract.searchForm(url, method, params).then(res => {
        this.roomName = res.data;
        this.roomName.push(...this.contractForm.roomRented.roomsTreeNodes);
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
    getNewDay(dateTemp, days) {
      var dateTemp = dateTemp.split("-");
      var nDate = new Date(dateTemp[1] + "-" + dateTemp[2] + "-" + dateTemp[0]); //转换为MM-DD-YYYY格式
      var millSeconds = Math.abs(nDate) + days * 24 * 60 * 60 * 1000;
      var rDate = new Date(millSeconds);
      var year = rDate.getFullYear();
      var month = rDate.getMonth() + 1;
      if (month < 10) month = "0" + month;
      var date = rDate.getDate();
      if (date < 10) date = "0" + date;
      return year + "-" + month + "-" + date;
    },
    getDetail() {
      let url = "/pm/contract";
      let method = "GET";
      // let data = getObjByKey(this.permission.detail);
      let id = this.rowData.id;
      this.parentId = id;
      $contract.detail(url, method, id).then(res => {
        this.pledge = res.data.contract.paymentMode.split("-")[0];
          this.pay = res.data.contract.paymentMode.split("-")[1];
          this.remark = res.data.contract.remark;
          this.contractForm.company = res.data.company;
          this.contractForm.parkLocation = res.data.contract.address.slice(
            0,
            res.data.contract.address.lastIndexOf("-")
          );
          this.contractForm.roomRented.roomsTreeNodes = res.data.contract.address.slice(
            res.data.contract.address.lastIndexOf("-") + 1
          );
          console.log(this.contractForm.roomRented.roomsTreeNodes,'this.contractForm.roomRented.roomsTreeNodes')
          this.contractForm.roomRented.zoneName = this.contractForm.parkLocation.split(
            "-"
          )[0];
          this.contractForm.roomRented.buildingName = this.contractForm.parkLocation.split(
            "-"
          )[1];
          this.contractForm.createTime = res.data.contract.createTime.split(
            " "
          )[0];
          this.contractForm.contract = res.data.contract;
          this.contractForm.contract.transactor = ''
          this.contractForm.contract.serialNumber = "";
          this.contractForm.contract.startDate = this.getNewDay(
            res.data.contract.endDate,
            1
          );
          this.contractForm.contract.endDate = this.getNewDay(
            res.data.contract.endDate,
            2
          );
          this.contractForm.remark = res.data.contract.remark;
          this.contractForm.invoice = res.data.invoice;
          this.invoiceForm.address = res.data.invoice.address.slice(
            0,
            res.data.invoice.address.lastIndexOf("-")
          );
          //押一付三
          let pledge = res.data.contract.paymentMode.split("-")[0];
          let pay = res.data.contract.paymentMode.split("-")[1];
          this.contractForm.contract.pledge = pledge;
          this.contractForm.contract.pay = pay;
          this.initTreedata();
      });
    },
    onBack() {
      this.$emit("RenewVisibleShow", true);
      this.contractForm.contract.transactor = ''
    },
    onsubmit() {
      // /pm/contract/renew
      // let obj = this.renew? getObjByKey('/pm/contract/renew'): getObjByKey();
      let url = this.renew ? '/pm/contract/renew' : '/pm/contract/change';
      let method = this.renew ? "POST" : "PUT";
      this.contractForm.contract.paymentMode =
        this.contractForm.contract.pledge +
        "-" +
        this.contractForm.contract.pay;
      this.contractForm.contract.type = "RENTED";
      const p1 = new Promise((resolve, reject) => {
        this.$refs["contractForm"].validate(valid => {
          if (valid) resolve();
        });
      });

      const p3 = new Promise((resolve, reject) => {
        this.$refs["attachmentsForm"].validate(valid => {
          if (valid) resolve();
        });
      });
      Promise.all([p1, p3])
        .then(() => {
          let data = {};
          if (!this.renew) {
            data = {
              attachments: this.fileDatas,
              contract: this.contractForm.contract,
              roomRented: {
                buildingName: this.contractForm.roomRented.buildingName.name,
                roomsTreeNodes: this.contractForm.roomRented.roomsTreeNodes,
                zoneName: this.contractForm.roomRented.zoneName.name
              },
              company: this.contractForm.company
            };
          } else {
            data = {
              attachments: this.fileDatas,
              contract: this.contractForm.contract,
              company: this.contractForm.company
            };
          }
          if (!this.renew) {
            data.roomRented = this.contractForm.roomRented;
          }
          data.contract.pid = this.parentId;
          delete data.contract.id;
          delete data.contract.createTime;
          delete data.contract.updateTime;
          delete data.contract.creator;
          delete data.contract.updater;
          $contract.addForm(url, method, data).then(res => {
            if (this.renew) {
                this.$message({
                  message: "续签成功,请联系管理员审核",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "变更成功,请联系管理员审核",
                  type: "success"
                });
              }
              this.$emit("RenewVisibleShow", true);
              this.$parent.onReset();
              thi.onBack();
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    //     校验手机或固话
    validatePhoneTwo(rule, value, callback) {
      const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
      if (value === "" || value === undefined || value == null) {
        callback(new Error("请输入电话号码或者固话号码"));
      } else {
        if (!reg.test(value) && value !== "") {
          callback(new Error("请输入正确的电话号码或者固话号码"));
        } else {
          callback();
        }
      }
    },
    download(data) {
      let url = "/pm/fastdfs/download/file";
      let method = "POST";
      // let obj = getObjByKey('/pm/fastdfs/download/file');
      let params = {
        filePath: data.filePath
      };
      let suffix = params.filePath.split(".")[1];
      $contract
        .downloadAll(url, method, params)
        .then(res => {
          downloadFile(res, data.fileName, suffix);
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
  margin-bottom: 18px;
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
  // padding-left: 24px;
  background-repeat: no-repeat;
  margin-left: 10px;
  margin-bottom: 10px;
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

// ::v-deep.el-textarea.el-input--small .el-textarea__inner {
//   resize: none;
// }

// ::v-deep .el-form-item--small .el-form-item__content {
//   width: calc(100% - 100px);
//   margin-left: 0 !important;
// }

// ::v-deep .el-form-item--small.el-form-item {
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: flex-start;
//   width: 100%;
// }

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
  // margin-left: 50px;
  button {
    margin: 20px 0;
  }
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
