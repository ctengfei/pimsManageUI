<template>
    <div class="app-container">
      <el-form inline :model="tableForm" ref="tableForm" v-show="showSearch">
        <el-form-item label="设备类型" prop="deviceType">
            <el-select style="width:20vh" placeholder="请选择设备类型" v-model="tableForm.deviceType" clearable>
              <el-option
                v-for="item in deviceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-select filterable placeholder="请选择公司名称" v-model="tableForm.companyName" clearable>
            <el-option
              v-for="item in companyDataList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间类型" prop="value">
          <el-select style="width:20vh" placeholder="请选择时间类型" v-model="tableForm.value" clearable>
            <el-option
              v-for="item in timeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker
            v-model="tableForm.startTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            v-model="tableForm.endTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" @click="exportReport()">导出企业数据</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getTableDataNext"></right-toolbar>
      </el-row>
      <div class="photoBox">
        <el-table :data="tableDataList">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="tagId" label="设备编号"></el-table-column>
          <el-table-column prop="deviceType" label="设备类型">
            <template slot-scope="scope">
              <span v-if="scope.row.deviceType == 1" style="color:#18dca7;">电</span>
              <span v-else-if="scope.row.deviceType == 0" style="color:#f05656;">水</span>
              <span v-else style="color:#f05656;">空</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
          <el-table-column prop="deviceValue" label="用量">
            <template slot-scope="scope">
              <span v-if="scope.row.deviceType == 1" style="color:#18dca7;">{{scope.row.deviceValue}}(度)</span>
              <span v-else-if="scope.row.deviceType == 0" style="color:#f05656;">{{scope.row.deviceValue}}(吨)</span>
              <span v-else style="color:#f05656;">空</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称"></el-table-column>
          <el-table-column prop="carbonEmission" label="碳排放量(kg)"></el-table-column>
          <el-table-column prop="grew" label="同比"></el-table-column>
        </el-table>
        <pagination
          v-show="tableDataList && tableDataList.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="tableForm.pageNum"
          :pageSizes="[10, 20, 40]"
          :limit.sync="tableForm.pageSize"
          :total="total"
        />
      </div>
      <el-dialog
        title="手动预警"
        width="600px"
        :visible.sync="maintenancePlanShow">
        <el-row>
          <el-form labelWidth="80px" v-model="addFormWarning" ref="addFormWarning">
            <el-form-item label="异常名称" prop="deviceName">
              <el-col>
                <el-input v-model="addFormWarning.title"></el-input>
              </el-col>
            </el-form-item>
            <!-- 必填 -->
            <el-form-item label="设备编号" prop="deviceNum">
              <el-col>
                <el-input v-model="addFormWarning.tagId"></el-input>
              </el-col>
            </el-form-item>
            <!-- 必填 -->
            <el-form-item label="触发位置" prop="deviceNum">
              <el-col>
                <el-input v-model="addFormWarning.location"></el-input>
              </el-col>
            </el-form-item>
            <!-- 必填 -->
            <el-form-item label="告警类型" prop="deviceNum">
              <el-col>
                <el-select v-model="addFormWarning.eventName">
                  <el-option
                    v-for="item in eventNames"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="告警级别" prop="level">
              <el-col>
                <el-select v-model="addFormWarning.level">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <!-- 必填 -->
            <el-form-item label="触发时间" prop="cycle">
              <el-col>
                <el-date-picker
                  v-model="addFormWarning.triggerTime"
                  type="datetime"
                  value-format="yyyy-MM-dd"
                  
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </el-row>
        <div slot="footer">
          <el-button type="primary" @click="onHandleTo(addFormWarning)">确定</el-button>
          <el-button plain @click="cancel()">取消</el-button>
        </div>
      </el-dialog>
  
      <el-dialog
        title="详情"
        width="600px"
        :visible.sync="detailPlanShow">
        <el-row>
          <el-form labelWidth="80px" v-model="detailFormWarning" ref="detailFormWarning">
            <el-form-item label="异常名称" prop="deviceName">
              <el-col>
                <el-input v-model="detailFormWarning.title"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="设备编号" prop="deviceNum">
              <el-col>
                <el-input v-model="detailFormWarning.tagId"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="区域" prop="deviceNum">
              <el-col>
                <el-input v-model="detailFormWarning.location"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="告警类型" prop="deviceNum">
              <el-col>
                <el-input v-model="detailFormWarning.eventName"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="告警级别" prop="deviceNum">
              <el-col>
                <el-input v-model="detailFormWarning.level"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="触发时间" prop="cycle">
              <el-col>
                <el-date-picker
                  v-model="detailFormWarning.triggerTime"
                  type="datetime"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </el-row>
        <div slot="footer">
          <el-button plain @click="cancelDetail()">取消</el-button>
        </div>
      </el-dialog>
  
      <el-dialog
        title="阈值监测"
        width="25%"
        :visible.sync="thresholdLookShow">
        <el-row>
          <el-form labelWidth="80px" v-model="thresholdForm" ref="thresholdForm">
            <div class="el-descriptions__title mb20">日用量异常报警</div>
            <el-form-item label="阈值" prop="thresholdDay">
              <el-col>
                <el-radio v-model="thresholdForm.thresholdDay" label="0">启用</el-radio>
                <el-radio v-model="thresholdForm.thresholdDay" label="1">停用</el-radio>
              </el-col>
            </el-form-item>
            <el-form-item label="浮动百分比阈值" prop="dayNumber">
              <el-col>
                <el-input v-model="thresholdForm.dayNumber"></el-input>
              </el-col>
            </el-form-item>
            <div class="el-descriptions__title mb20">月用量异常报警</div>
            <el-form-item label="阈值" prop="thresholdMouth">
              <el-col>
                <el-radio v-model="thresholdForm.thresholdMouth" label="0">启用</el-radio>
                <el-radio v-model="thresholdForm.thresholdMouth" label="1">停用</el-radio>
              </el-col>
            </el-form-item>
            <el-form-item label="浮动百分比阈值" prop="mouthNumber">
              <el-col>
                <el-input v-model="thresholdForm.mouthNumber"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-row>
        <div slot="footer">
          <el-button type="primary" @click="onSure(thresholdForm)">确定</el-button>
          <el-button plain @click="cancel()">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
    import {initCompanyData} from '@/api/facility/crameEnergyList'
    import { downloadFile } from '@/utils/index'
    import pagination from '@/components/comPagination'
    import {initTabDataList,toWarningNext,handleWarningTo,thresholdWarning,download} from '@/api/smartEnergyAdmin/energyWarning'
    import {initCompanyTableData} from '@/api/smartEnergyAdmin/energyAnalyse'
  import { Message } from 'element-ui'
  
    export default {
      name: 'Componyanalyse',
      components: {
        pagination,
      },
      data() {
        return {
          companyDataList:[],
          showSearch: true,
          tableForm: {
              deviceType: '',
              companyName: '',
              value: '',
              startTime: '',
              endTime: '',
              pageNum:1, 
              pageSize:10,
          },
          deviceTypes: [{
            value: '0',
            label: '水'
          }, {
            value: '1',
            label: ' 电'
          }],
          timeTypes: [{
            value: '1',
            label: '日'
          }, {
            value: '3',
            label: '月'
          }, {
            value: '5',
            label: '年'
          }],
          // 告警类型
          eventNames: [{
            value: 'wmConnBroken',
            label: '水表通讯中断'
          }, {
            value: 'emConnBroken',
            label: ' 电表通讯中断'
          }],
          options: [{
            value: 'normal',
            label: '普通'
          }, {
            value: 'emergency',
            label: '严重'
          }, {
            value: 'veryEmergency',
            label: '非常严重'
          },],
          value: '',
          formSearch: {
            pageNum: 1,
            pageSize: 10,
          },
          tableDataList: [],
          total: 15,
          maintenancePlanShow: false,
          thresholdLookShow: false,
          detailPlanShow: false,
          tags: [
            {label: '新风机', value: '1'},
            {label: '送排风机', value: '2'},
            {label: '排气扇', value: '3'},
            {label: '排气扇', value: '4'},
            {label: '排气扇', value: '5'},
          ],
          frequencies: [
            {label: '每周', value: '1'},
            {label: '每月', value: '2'},
            {label: '每季度', value: '3'},
            {label: '每年', value: '4'},
          ],
          addForm: {
            title: '',
            tagId: '',
            location: '',
            eventName: '',
            level: '',
            triggerTime: '',
          },
          addFormWarning: {
            title: '',
            tagId: '',
            location: '',
            eventName: '',
            level: '',
            triggerTime: '',
          },
          detailFormWarning: {
            title: '',
            tagId: '',
            location: '',
            eventName: '',
            level: '',
            triggerTime: '',
          },
          formSearchWarning: {
            title: '',
            level: '',
            startTime: '',
            endTime: '',
          },
          thresholdForm: {
            thresholdDay: '0',
            thresholdMouth: '0',
            dayNumber: '',
            mouthNumber: '',
          },
          spanIndex: [],
        }
      },
      mounted() {
        this.getTableDataNext();
        this.getInitCompanyData();
      },
      methods: {
          // 导出企业数据
          exportReport() {
            let url = '/pm/hydropower/point/download'
            let method = "get"
            let params = this.tableForm
            download(url, method, params).then(res => {
              this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
            }).catch(err => {
              console.log(err)
            })
          },
          getInitCompanyData(){
              initCompanyData().then(res=>{
                this.companyDataList=res.data
              })
          },
          //列表
          getTableDataNext() {
              initCompanyTableData(this.tableForm).then((res) => {
                this.tableDataList=res.data.data
                this.total = res.data.total
              })
          },
          // 搜索
          search(){
            this.tableForm.pageNum = 1
            this.getTableDataNext()
          },
          resetQuery(){
            this.resetForm('tableForm')
            this.search()
          },
        // 详情
        openDialogDetail(data) {
          if (data) {
            this.detailFormWarning.title = data.title;
            this.detailFormWarning.tagId = data.tagId;
            this.detailFormWarning.location = data.location;
            if (data.eventName == "wmConnBroken") {
              this.detailFormWarning.eventName = "水表通讯中断";
            } else {
              this.detailFormWarning.eventName = "电表通讯中断";
            }
            if (data.level == "normal") {
              this.detailFormWarning.level = "普通";
            } else if (data.level == "emergency")  {
              this.detailFormWarning.level = "严重";
            } else {
              this.detailFormWarning.level = "非常严重";
            }
            this.detailFormWarning.triggerTime = data.triggerTime;
          }
          this.detailPlanShow = true
        },
        // 详情的取消关闭
        cancelDetail() {
          this.detailPlanShow = false
        },
        // 手动预警
        onHandleTo(addForm) {
          handleWarningTo(addForm) (res => {
            this.$message.success("添加成功");
          })
        },
        // 阈值监测
        onSure(thresholdForm) {
          thresholdWarning(thresholdForm) (res => {
            this.$message.success("设置成功");
            setTimeout(() => {
              this.thresholdLookShow = false;
            }, 500);
          })
        },
        handleCurrentChange() {
            this.getTableDataNext();
        },
        onTrue(res) {
          let params = {
            id : res.id
          }
          toWarningNext(params).then(resp => {
            this.$message.success("预警成功");
          })
  
        },
  
        // 新增或编辑
        openDialog(data = false) {
          this.title = !data ? '新增' : '编辑';
          if (data) {
            this.addForm.deviceName = data.deviceName;
            this.addForm.deviceNum = data.deviceNum;
            this.addForm.cycle = data.cycle;
            this.addForm.content = data.content;
            this.addForm.frequency = data.frequency;
          }
          this.maintenancePlanShow = true;
        },
        // 阈值监测
        openDialogThreshold(data = false) {
          this.title = !data ? '新增' : '编辑';
          if (data) {
            this.addForm.deviceName = data.deviceName;
            this.addForm.deviceNum = data.deviceNum;
            this.addForm.cycle = data.cycle;
            this.addForm.content = data.content;
            this.addForm.frequency = data.frequency;
          }
          this.thresholdLookShow = true;
        },
        //  重置新增/编辑表单
        resetForm(formName) {
          this.maintenancePlanShow = false;
          this.thresholdLookShow = false;
          this.$refs[formName].resetFields()
          this.addForm = {
            deviceName: '',
            deviceNum: '',
            cycle: '',
            content: '',
            frequency: ''
          };
        },
        cancel() {
          this.resetForm('addForm');
        },
  
        choosetag(index) {
          let arrIndex = this.spanIndex.indexOf(index);
          if (arrIndex > -1) {
            this.spanIndex.splice(arrIndex, 1);
          } else {
            this.spanIndex.push(index)
          }
        }
      }
    }
  </script>
  
  <style lang="scss" scoped>
    .el-form .el-select {
      width: 100%;
    }
  
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  
    .colors {
      background-color: #206aff;
    }
    .photoBox {
      width: 100%;
      height: calc(100vh - 160px);
      display: flex;
      overflow: auto;
      flex-direction: column;
    }
  </style>