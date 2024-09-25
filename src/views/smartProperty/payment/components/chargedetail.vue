<template>
  <div v-if="ChargedetailShow">
    <div style="    padding: 20px;">
      <!--
        <el-form inline>
        <el-form-item style="float: right">
          <div @click="onBack" class="backtext">
            <svg aria-hidden="true" class="svg-icon">
              <use href="#icon-icon-goback" />
            </svg>
            <span>返回上一页</span>
          </div>
        </el-form-item>
      </el-form>
      -->

      <div>
        <el-table :data="tableData" height="calc(100vh - 250px)">
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column label="企业名称">
            <template slot-scope>
              {{ rowData.companyName }}
            </template>
          </el-table-column>
          <el-table-column label="园区位置">
            <template slot-scope>
              {{ rowData.companyAddress }}
            </template>
          </el-table-column>
          <el-table-column
            prop="billNo"
            label="账单编号"
            show-overflow-tooltip
          ></el-table-column>
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
            label="实收金额(元)"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span style="color: #206aff; cursor: pointer">{{
                scope.row.arrearsAmount
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="计费周期" prop="billStart,billEnd" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.billStart }} ~ {{ scope.row.billEnd }}
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
  </div>
</template>

<script>
import { WriteOffData, payData } from "@/api/smartProperty/payment";
import pagination from "@/components/comPagination";
import { initTabData } from "@/api/smartProperty/configure";
export default {
  components: {
    pagination,
  },
  name: "Chargedetail",
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
      ChargedetailShow: true,
      feeProjects: [],
      tableData: [],
      formSearch: {
        years: "",
        quarter: "",
        time: "",
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      permission: {
        getFee: "smartProperty::configure::getFee",
      },
      rowData:{}
    };
  },
  mounted() {
    this.rowData = JSON.parse(decodeURI(this.$route.query.player))
    this.getSearchData();
    this.getTableData();
  },
  methods: {
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
    filterItem(data) {
      if(data == 'RENT_FEE'){
        return "房租"
      }else{
        let res = this.feeProjects.filter((item) => {
          return item.code == data;
        });
        return res[0].name;
      }
      let res = this.feeProjects.filter((item) => {
        return item.code == data;
      });
      return res[0].name;
    },
    onBack() {
      this.$emit("ChargedetailVisibleShow", true);
    },
    onSearch() {},
    onReset() {
      this.formSearch = {
        years: "",
        quarter: "",
        time: "",
        pageNum: 1,
        pageSize: 10,
      };
    },
    handleCurrentChange() {
      this.getTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
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
  display: inline-block;
  margin-left: 10px;
  span {
    
    font-size: 14px;
  }
  cursor: pointer;
}
</style>
