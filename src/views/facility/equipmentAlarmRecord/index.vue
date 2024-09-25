<template>
  <div class="app-container">
    <el-row :gutter="20" style="height:100%">
      <el-col>
        <div class="ListManage" v-if="deviceDrawVisible" style="height:100%">
          <el-form
            ref="formSearch"
            inline
            :model="formSearch"
            class="demo-form-inline"
            v-show="showSearch"
          >
            <el-form-item prop="deviceType" label="设备类型">
              <el-select
                v-model="formSearch.deviceType"
                placeholder="请选择设备类型"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="(item, index) in deviceTypes"
                  :label="item.name"
                  :value="item.type"
                  :key="index"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="deviceCode" label="设备编码">
              <el-input
                v-model="formSearch.deviceCode"
                placeholder="请输入设备编码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="deviceName" label="设备名称">
              <el-input
                v-model="formSearch.deviceName"
                placeholder="请输入设备名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="onSearch"
              >搜索
              </el-button
              >
              <el-button
                icon="el-icon-refresh"
                @click="onReset('formSearch')"
              >重置
              </el-button
              >
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              @click="btnExport"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getTableData"></right-toolbar>
        </el-row>
           <div>
              <el-table :data="tableData"  style="width: 100%">
                <el-table-column
                  width="80"
                  type="index"
                  label="序号"
                  showOverflowTooltip
                />
                <el-table-column
                  prop="alarmName"
                  label="告警名称"
                  showOverflowTooltip
                />
                <el-table-column
                  prop="deviceCode"
                  label="设备编码"
                  showOverflowTooltip
                />
                <el-table-column
                  prop="triggerTime"
                  label="告警时间"
                  showOverflowTooltip
                />
                <el-table-column
                  prop="location"
                  label="告警地点"
                  showOverflowTooltip
                />
                <el-table-column
                  prop="alarmLevel"
                  label="告警级别"
                  showOverflowTooltip
                >
                <template slot-scope="scope">
                  {{scope.row.alarmLevel == 'normal' ? '普通' : scope.row.alarmLevel == 'emergency' ? '紧急' : '非常紧急'}}
                </template>
                </el-table-column>
                <el-table-column
                  prop="processer"
                  label="处理人员"
                  showOverflowTooltip
                />
                <el-table-column
                  prop="processerPhone"
                  label="手机号"
                  showOverflowTooltip
                />
                <el-table-column
                  prop="content"
                  label="备注信息"
                  showOverflowTooltip
                />
                <el-table-column
                  prop="processStatusStr"
                  label="处理结果"
                  showOverflowTooltip
                />

              </el-table>
              <!-- 分页 -->
              <pagination
                style="margin-bottom: 16px"
                v-show="tableData && tableData.length > 0"
                @pagination="handleCurrentChange"
                :page.sync="formSearch.pageNum"
                :pageSizes="[10, 20, 40]"
                :limit.sync="formSearch.pageSize"
                :total="total"
              />
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import img from "@/assets/401_images/401.gif";
  import pagination from "@/components/comPagination";
  import {getObjByKey, getStringByKey} from "@/utils/voice.js";
  import {initData, treeByIdData} from "@/api/facility/information";
  import {initTabData, download} from "@/api/facility/protectionRecord";
  import {downloadworkOrder} from "@/api/smartProperty/workManagement";
  import {downloadFile} from "@/utils/index";

  export default {
    name: "EquipmentAlarmRecord",
    components: {
      pagination
    },
    data() {
      return {
        // permission: {
        //   search: "facility::alarmRecord::search",
        //   download: "facility::alarmRecord::download",
        //   sysChild: "facility::information::childSystem"
        // },
        // tableData每个row的值
        rowData: {},
        // 总数量
        total: 0,
        formSearch: {
          // 搜索的表单
          deviceCode: "",
          deviceType: "",
          deviceName: "",
          pageNum: 1,
          pageSize: 10,
        },
        showSearch:true,
        deviceTypes: [],
        // 搜索条件子系统集合
        deviceNames: [],
        // 搜索条件楼层集合
        devicePositionList: [],
        // 表格的数据
        tableData: [],
        tableShow: true, // 表格的展示
        deviceDrawVisible: true // 是否跳转到设备画像页面
      };
    },
    mounted() {
      this.getTableData();
      this.getType();
    },
    methods: {
      deviceDrawShow(data) {
        this.deviceDrawVisible = data;
      },
      getType() {
        let parmas = {
          nodeType: "DIR"
        };
        initData('/pm/tree/type', 'get', parmas).then(res => {
          
          if (res.code === 200) {
            this.deviceTypes = res.data;
          } else {
            this.$message({
              message: res.meta.message,
              type: "error"
            });
          }
        });
      },
      getTableData() {
       
        let data = this.formSearch;
        if (!data.deviceCode) {
          delete data.deviceCode
        }
        if (!data.deviceType) {
          delete data.deviceType
        }
        if (!data.deviceName) {
          delete data.deviceName
        }
        initTabData('/pm/alarm/deviceAlarm/page', 'get', data).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.total
          }
        });
      },
      onSearch() {
        this.formSearch.pageNum = 1
        this.getTableData();
      },
      onReset() {
        this.$refs.formSearch.resetFields();
        this.onSearch()
      },
      btnExport() {
        let data = this.formSearch;
        downloadworkOrder('/pm/alarm/deviceAlarm/page/export', 'get', data)
          .then(res => {
            this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      },

      onDeviceDraw(data) {
        this.rowData = data;
        this.deviceDrawVisible = false;
      },
      handleCurrentChange(){
        this.getTableData();
      }
    }
  };
</script>

<style lang="scss" scoped>
 ::v-deep.el-table.el-table--fit{
  overflow: hidden;
}</style>