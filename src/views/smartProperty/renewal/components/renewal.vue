<template>
  <div v-show="renewalShow" style="height: 100%;overflow: auto;">
    <div @click="onBack" class="backtext">
      <svg aria-hidden="true" class="svg-icon">
        <use href="#icon-icon-goback"/>
      </svg>
      <span>返回上一页</span>
    </div>
    <div style="width: 60%">
      <div>
        <el-row style="margin-bottom: 10px">
          <img src="@/assets/images/arrow.png" alt="">
          <p>原始合同信息</p>
        </el-row>
        <el-row>
          <el-form ref="contractForm" label-width="100px" :model="contract">
            <el-col :span="12">
              <el-form-item label="合同编号" prop="serialNumber">
                <el-input disabled class="input" v-model="contract.serialNumber"/>
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
              <el-form-item label="支付方式">
                <el-col style="color: #fff;text-align: center" :span="2">押</el-col>
                <el-col :span="10">
                  <el-select disabled v-model="contract.paymentModepledge"></el-select>
                </el-col>
                <el-col style="color: #fff;text-align: center" :span="2">付</el-col>
                <el-col :span="10">
                  <el-select disabled v-model="contract.paymentModepay"></el-select>
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
            <el-col :span="12">
              <el-form-item label="所属楼层" prop="addressfloor">
                <el-select disabled v-model="contract.addressfloor">
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁房间" prop="addressrentroom">
                <el-input disabled v-model="contract.addressrentroom"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注信息" prop="remark">
                <el-input type="textarea" :rows="2" disabled v-model="contract.remark"/>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <div>
              <el-row style="margin-bottom: 10px">
                <img src="@/assets/images/arrow.png" alt="">
                <p>新合同信息</p>
              </el-row>
              <el-row>
                <el-form ref="contractForm" label-width="100px" :model="contract">
                  <el-col :span="12">
                    <el-form-item label="合同编号" prop="serialNumber">
                      <el-input disabled class="input" v-model="contract.serialNumber"/>
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
                    <el-form-item label="支付方式">
                      <el-col style="color: #fff;text-align: center" :span="2">押</el-col>
                      <el-col :span="10">
                        <el-select disabled v-model="contract.paymentModepledge"></el-select>
                      </el-col>
                      <el-col style="color: #fff;text-align: center" :span="2">付</el-col>
                      <el-col :span="10">
                        <el-select disabled v-model="contract.paymentModepay"></el-select>
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
                  <el-col :span="12">
                    <el-form-item label="所属楼层" prop="addressfloor">
                      <el-select disabled v-model="contract.addressfloor">
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="租赁房间" prop="addressrentroom">
                      <el-input disabled v-model="contract.addressrentroom"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注信息" prop="remark">
                      <el-input type="textarea" :rows="2" disabled v-model="contract.remark"/>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </div>
          </el-col>

        </el-row>

      </div>
        <div>
          <img src="@/assets/images/arrow.png" alt="">
          <p>附件信息</p>
          <el-upload action style="margin:20px 0 0 100px">
            <el-button type="primary">合同附件</el-button>
          </el-upload>
      </div>

    </div>
    <div style="text-align: center;margin: 10px 0 0 0 ;">
      <el-button @click="onSubmit()" type="primary">确认</el-button>
      <el-button @click="onBack()" plain>取消</el-button>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'Renewal',
    data() {
      return {
        renewalShow: true,
        datepicker: "date-picker",
        invoiceTypes: [
          {
            label: '0',
            value: '普通发票'
          },
          {
            label: '1',
            value: '专用发票'
          }
        ],
        contract: {},

      }
    },
    created() {

    },
    methods: {
      onBack() {
        this.$emit('renewalVisibleShow', true);
      },
    }
  };
</script>

<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .el-form .el-select {
    width: 100%;
  }

  .date-picker {
    width: 100%;
  }

  .color {
    border-radius: 8px;
    p {
      font-weight: 900;
      
      margin-bottom: 10px;
      display: inline;
    }
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
  ::v-deep .el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }
</style>
