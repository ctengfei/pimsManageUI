<template>
  <div v-if="writeOffShow" style="height: 100%">
    <div class="topInfo topcolor">
      <el-row>
        <!--
          <el-col :span="4">
          <div class="gobackCls" @click="onBack">
            <svg-icon
              icon-class="icon-goback"
              style="height: 60px; width: 16px"
            />
            <div class="icon-name">返回上一页</div>
          </div>
        </el-col>
        -->
        <el-col :span="6"
          ><p>公司名称：{{ rowData.companyName }}</p></el-col
        >
        <el-col :span="6"
          ><p>园区位置：{{ rowData.companyAddress }}</p></el-col
        >
        <el-col :span="8"
          ><p>
            计费周期：{{ rowData.billStart }} ~ {{ rowData.billEnd }}
          </p></el-col
        >
      </el-row>
    </div>
    <div class="middleInfo" style="margin-top: 10px">
      <el-row>
        <div class="color middleleft">
          <el-form inline>
            <span class="totalprice">
              <span>未收合计：{{ arrearsAmountTotal }}</span>
              <span>应收合计：{{ receivableAmountTotal }}</span>
            </span>
          </el-form>
          <div>
            <el-table :data="tableData" height="calc(100vh - 250px)">
              <el-table-column
                type="index"
                label="序号"
                width="80"
              ></el-table-column>
              <el-table-column
                prop="billNo"
                label="账单编号"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="计费周期" prop="billStart,billEnd" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.billStart }} ~ {{ scope.row.billEnd }}
                </template>
              </el-table-column>
              <el-table-column
                prop="feeItemCode"
                label="收费项目"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ filterItem(scope.row.feeItemCode) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="receivableAmount"
                label="应收金额(元)"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="color: #206aff; cursor: pointer">{{
                    scope.row.receivableAmount
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="arrearsAmount"
                label="未收金额(元)"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span style="color: #206aff; cursor: pointer">{{
                    scope.row.arrearsAmount
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="color middleright">
          <div style="position: relative;width:100%;text-align:center">
            <p
              style="
                position: absolute;
                width:100%;
                line-height: 32px;
                
              "
            >
              到账登记
            </p>
            <img src="@/assets/images/arrival.png" alt="" style="width:100%;height:32px"/>
          </div>

          <el-row>
            <el-form
              ref="form"
              label-width="80px"
              label-position="top"
              :rules="rules"
              :model="writeOffForm"
            >
              <el-col>
                <el-form-item label="到账金额" prop="amount">
                  <el-input v-model="writeOffForm.amount"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="到账日期" prop="arrivalTime">
                  <el-date-picker
                    v-model="writeOffForm.arrivalTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="付款单位" prop="companyId">
                  <el-select
                    v-model="writeOffForm.companyId"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in companyArr"
                      :key="index"
                      :label="item.value"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="付款方式" prop="payWays">
                  <el-radio-group
                    v-model="writeOffForm.payWays"
                    v-for="(item, index) in paymentTypes"
                    :key="index"
                  >
                    <el-radio
                      :label="item.label"
                      :value="item.value"
                      style="width: 50%"
                    ></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="凭证号" prop="paymentVoucherNo">
                  <el-input v-model="writeOffForm.paymentVoucherNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="备注信息" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注信息"
                    v-model="writeOffForm.remark"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <div style="text-align: center; margin: 10px 0 0 0" class="btnheight">
            <el-button @click="onSubmit()" type="primary"
              >确认</el-button
            >
            <el-button @click="onBack()" plain
              >取消</el-button
            >
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getControlTree } from "@/api/spaceManagement/controlManagement";
import { initTabData } from "@/api/smartProperty/configure";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { WriteOffData, payData } from "@/api/smartProperty/payment";
export default {
  name: "WriteOff",
  // props: {
  //   rowData: {
  //     type: Object,
  //     default: () => {
  //       return {};
  //     },
  //   },
  // },
  data() {
    return {
      permission: {
        getFee: "smartProperty::configure::getFee",
        addCompany: "facility::contractManagement::addCompany",
      },
      writeOffShow: true,
      tableData: [],
      formSearch: {
        feeProject: "",
        pageNum: 1,
        pageSize: 10,
      },
      feeProjects: [],
      companyArr: [],
      companyList: [],
      total: 0,
      receivableAmountTotal: 0,
      arrearsAmountTotal: 0,
      writeOffForm: {
        amount: "",
        arrivalTime: "",
        payWays: "",
        payWay: "",
        companyId: "",
        paymentVoucherNo: "",
        remark: "",
        billNo: "",
      },
      companys: {
        label: "",
        value: "",
      },
      paymentTypes: [
        {
          label: "转账",
          value: "TRANSFER",
        },
        {
          label: "支票",
          value: "CHECK",
        },
        {
          label: "现金",
          value: "CASH",
        },
        {
          label: "刷卡",
          value: "POS",
        },
      ],
      rules: {
        amount: [
          {
            required: true,
            message: "请输入到账金额",
            trigger: ["blur", "change"],
          },
        ],
        arrivalTime: [
          {
            required: true,
            message: "请选择到账日期",
            trigger: ["blur", "change"],
          },
        ],
        companyId: [
          {
            required: true,
            message: "请选择付款单位",
            trigger: ["blur", "change"],
          },
        ],
        payWays: [
          {
            required: true,
            message: "请选择付款方式",
            trigger: ["blur", "change"],
          },
        ],
        paymentVoucherNo: [
          {
            required: true,
            message: "请输入凭证号",
            trigger: ["blur", "change"],
          },
        ],
      },
      companyList: [],
      rowData:{}
    };
  },
  mounted() {
    this.rowData = JSON.parse(decodeURI(this.$route.query.player))
    this.getSearchData();
    this.getTableData();
    this.getCompany();
  },
  methods: {
    getCompany() {
      let obj = {url: "/pm/company", method: "GET"};
      let parmas = {
        name: this.rowData.companyName,
      };
      getControlTree(obj.url, obj.method, parmas).then((res) => {
        
          this.companyList = [];
          this.companyArr = [];
          this.companyList = res.data;
          for (const item of this.companyList) {
            this.companyArr.push({
              value: item.name, //这里一定是value: '值'
              id: item.id,
            });
          }
          let result = this.companyArr.filter((item) => {
            return item.value == this.rowData.companyName;
          });

          this.writeOffForm.companyId = result[0].id;
        
      });
    },
    filterItem(data) {
      if(data == 'RENT_FEE'){
        return "房租"
      }else{
        let res = this.feeProjects.filter((item) => {
          return item.code == data;
        });
        return res[0].name;
      }
      
    },
    getSearchData() {
      let obj = {url: "/pm/property/feeItem", method: "GET"};
      let url = obj.url;
      let method = obj.method;
      initTabData(url, method)
        .then((res) => {
          
            res.data.map((item) => {
              this.feeProjects.push({
                name: item.name,
                code: item.code,
              });
            });
          
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    getTableData() {
      let data = this.rowData.id;
      WriteOffData(data).then((res) => {
        
          this.arrearsAmountTotal = res.data.arrearsAmountTotal;
          this.receivableAmountTotal = res.data.receivableAmountTotal;
          this.tableData = res.data.list;
        
      });
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.writeOffForm.billNo = this.rowData.id;
          let result = this.paymentTypes.filter((item) => {
            return item.label == this.writeOffForm.payWays;
          });
          this.writeOffForm.payWay = result[0].value;
          let data = this.writeOffForm;
          payData(data).then((res) => {
            
              this.$message.success("核销成功");
              this.onBack();
           
          });
        }
      });
    },
    onBack() {
      // this.$emit("WriteoffVisibleShow", true);
      // 关闭掉当前的页面，页签
      this.$tab.closeOpenPage({ path: '/payment',})
      this.$router.push({
        path: '/payment',
      })
    },
    onSearch() {},
    onReset() {
      this.formSearch = {
        feeProject: "",
        pageNum: 1,
        pageSize: 10,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}

.topcolor {
  // background-color: #202230;
  border-radius: 8px;
  padding: 0 20px;
  p {
    font-weight: 700;
    // color: #fff;
    line-height: 60px;
  }
}

.topInfo {
  height: 60px;
  
  p {
    color: #606266;
  }
}

.color {
  // background-color: #202230;
  border-radius: 8px;
  padding: 20px;
  p {
    font-weight: 900;
    color: #606266;
  }
}

.middleInfo {
  .middleleft {
    width: 75%;
    float: left;
    height: calc(100vh - 60px - 60px - 30px);
  }
  .middleright {
    width: calc(100% - 75% - 10px);
    float: right;
    height: calc(100vh - 60px - 30px - 60px);
    overflow: auto;
    span {
      width: 100%;
      display: block;
      text-align: center;
      background-image: linear-gradient(266deg, #ffffff 0%, #808080 100%);
      opacity: 0.12;
      border-radius: 8px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #ffffff;
    }
  }
}

.totalprice {
  span {
    font-weight: 900;
    
    margin-right: 60px;
    line-height: 36px;
  }
}

.btnheight {
  height: 32px;
}

.el-form .el-input {
  width: 100%;
}

.el-form .el-select {
  width: 100%;
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}
.gobackCls {
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
::v-deep .icon-name {
  line-height: 60px;
}
::v-deep .el-radio-group {
  width: 50%;
}
</style>
