
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xl="4" :lg="6" :sm="7" :xs="24">
        <div class="video-web-left-box">
          <div class="highlight-height-main padding-20" style="background-color: #f5f7fa;height: 800px;">
              <div class="addGroupBtn">
                <span>报告分析</span>
              </div>
              <div class="group-area" >
                <div v-for="item in groups" :key="item.id" :class="[item.value == form.durationType?'active':'disActive']">
                  <div class="group-item-hover">
                    <div class="group-item" @click="selectGroup(item)">
                      <div class="item-name ">{{ item.modelName }}</div>
                      <div class="controls">
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </el-col>
      <el-col :xl="20" :lg="18" :sm="17" :xs="24" >
          <el-form
            :inline="true"
            ref="serForm"
            :model="form"
            class="demo-form-inline"
          >
            <el-form-item label="报告类型">
              <el-select v-model="form.reportType">
                <el-option
                  v-for="(item, index) in types"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  >{{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="search()" icon="el-icon-search" type="primary"
                >搜索</el-button
              >
              <el-button @click="reset()" icon="el-icon-refresh" plain
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <div class="tableheight">
            <el-table :data="tableData">
              <el-table-column type="index" width="55" label="序号" />
              <el-table-column
                prop="name"
                label="报告名称"
                showOverflowTooltip
                width="260px"
              ></el-table-column>
              <el-table-column
                prop="reportType"
                label="报告类型"
                showOverflowTooltip
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.reportType === "personnelServiceReport"
                      ? "人员服务统计分析"
                      : "安保统计分析"
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                showOverflowTooltip
              ></el-table-column>
              <el-table-column
                prop="startDate"
                label="开始时间"
                showOverflowTooltip
              ></el-table-column>
              <el-table-column
                prop="endDate"
                label="结束时间"
                showOverflowTooltip
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="openDownload(scope.row)"
                    type="text"
                   
                   
                    >导出</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-if="tableData && tableData.length"
              @pagination="handleCurrentChanges"
              :page.sync="form.pageNum"
              :pageSizes="[10, 20, 30, 40]"
              :limit.sync="form.pageSize"
              :total="total"
            />
          </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import sysTree from "@/components/sysTree";
import pagination from "@/components/comPagination";
import OrgizeTree from "@/components/orgnizeTree";
import $analysisReport from "@/api/system/analysisReport.js";
import { downloadFile } from "@/utils/index";
export default {
  name: "AnalysisReport",
  components: { sysTree, pagination, OrgizeTree },
  data() {
    return {
      permission: {
        searchTableList: "system::analysisReport::searchTableList",
        download: "spaceManagement::templateManagement::download"
      },
      total: 0,
      groups: [
        {
          modelName: "年度报告分析",
          value: "year"
        },
        {
          modelName: "季度报告分析",
          value: "season"
        },
        {
          modelName: "月度报告分析",
          value: "month"
        }
      ],
      types: [
        {
          label: "人员服务统计分析",
          value: "personnelServiceReport"
        },
        {
          label: "安保统计分析",
          value: "securityReport"
        }
      ],
      form: {
        durationType: "year",
        reportType: "",
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      downloadname: "",
      downloadUrl2: ""
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleCurrentChanges() {
       this.getTableData();
    },
    /**
     * @description:
     * @param {*}
     * @return {*}
     * @author: HJQ
     */
    getTableData() {
      let obj = {url: "/analysisReport/analysisReport/page", method: "GET"};
      let data = this.form;
      $analysisReport.getReportByPage(obj.url, obj.method, data).then(res => {
        
          this.tableData = res.data.data;
          this.total = res.data.total;
        
      });
    },
    /**
     * @description:
     * @param {*} data
     * @return {*}
     * @author: HJQ
     */

    selectGroup(data) {
      this.form.durationType = data.value;
      this.getTableData();
    },
    openDownload(data) {
      $analysisReport
        .downloads(data.filePath)
        .then(res => {
          if(res.type !== 'application/octet-stream'){
            this.$message.error('文件不存在！');
            return
          }else {
            downloadFile(res, data.name, "docx");
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    search(){
      this.getTableData();
    },
    reset(){
      this.form.reportType = "";
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.active{
  background-color: #edf6ff;
}
.disActive{
  background-color: transparent;
}

.color {
  color: #206aff;
}
::v-deep .el-switch__label {
  position: absolute;
  display: none;
  font-size: 14px !important;
  color: #fff !important;
}

::v-deep .el-switch__label * {
  font-size: 14px !important;
}

/*打开时文字位置设置*/
::v-deep .el-switch__label--right {
  z-index: 1;
  left: 0px; // 这里是重点
  top: 0.5px;
}

/*关闭时文字位置设置*/
::v-deep .el-switch__label--left {
  z-index: 1;
  right: 0px; // 这里是重点
  top: 0.5px;
}

/*显示文字*/
::v-deep .el-switch__label.is-active {
  display: block;
}

::v-deep .el-switch .el-switch__core {
  border-color: #00e984 !important;
  background-color: #00e984 !important;
}

::v-deep .el-switch.is-checked .el-switch__core {
  border-color: #206aff !important;
  background-color: #206aff !important;
}

::v-deep .el-switch__core {
  width: 60px !important;
  height: 22px;
  border: 2px solid #dcdfe6;
  border-radius: 13px;
}

// ::v-deep .el-switch {
//   width: 50%;
// }
::v-deep .el-form-item--small .el-form-item__label {
  line-height: 30px !important;
}

::v-deep .el-form-item--small .el-form-item__content {
  line-height: 30px !important;
}

::v-deep .el-select {
  width: 100%;
}

.video-web-right-box-bottom {
  height: 100%;
  margin-top: 0;
  padding: 20px;
}

::v-deep .el-divider--horizontal {
  opacity: 0.1;
}

.addGroupBtn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    94deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(128, 128, 128, 0.12) 100%
  );
  padding: 0 20px;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  height: 38px;
}

.addGroupBtn span {
  font-size: 14px;
  font-weight: bold;
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}

::v-deep.el-select {
  width: 100%;
}

::v-deep.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 49%;
}
.tableheight {
  height: calc(100% - 100px);
}
::v-deep .el-table.el-table--fit {
  overflow: hidden;
}
</style>
