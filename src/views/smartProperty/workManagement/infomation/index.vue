<template>
  <div class="app-container">
    <div  style="height: 100%">
      <div class="topinfo">
        <div v-for="(item, index) in allWork" :key="index">
          <el-progress
            stroke-linecap="square"
            color="#206aff"
            type="circle"
            :percentage="setItemProgress(item)"
            :format="setItemText(item)"
            :stroke-width="10"
            :width="80"
          ></el-progress>
          <p>{{ item.label }}</p>
        </div>
      </div>
      <div class="workInfo">
      <!--
          <div>
          <Tabs
            @btnclick="btnclick($event)"
            :btnGroup="btnGroup"
            :btnChoose="btnChoose"
            :singleWidth="94"
          />
        </div>
      -->
        
        <div class="margintop20">
          <el-form ref="formSearch" inline v-model="formSearch" v-show="showSearch">
            <el-form-item label="工单编号" prop="workOrderCode">
              <el-input
                placeholder="请输入工单编号"
                clearable
                v-model="formSearch.workOrderCode"
              ></el-input>
            </el-form-item>
            <el-form-item label="提单人姓名" prop="creatorName">
              <el-input
                placeholder="请输入提单人姓名"
                clearable
                v-model="formSearch.creatorName"
              ></el-input>
            </el-form-item>
            <el-form-item label="工单类型" prop="repairWorkOrderType">
              <el-select
                placeholder="请选择工单类型"
                clearable
                v-model="formSearch.repairWorkOrderType"
              >
                <el-option
                  v-for="(item, index) in workType"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                  >{{ item.name }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期选择">
              <el-date-picker
                v-model="time"
                @change="timeChange()"
                type="daterange"
                value-format="yyyy-MM-dd"
                style="width: 240px"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="工单状态" prop="status">
              <el-select
                placeholder="请选择工单状态"
                clearable
                v-model="formSearch.status"
              >
                <el-option
                  v-for="(item, index) in btnGroup"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  >{{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="onSearch()"
                >搜索
              </el-button>
              <el-button
                plain
                icon="el-icon-refresh"
                @click="onReset()"
                >重置
              </el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              @click="onEdit()"
            >创建工单</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              @click="download()"
            >导出</el-button>
          </el-col>
          <!--<right-toolbar :showSearch.sync="showSearch" @queryTable="getTableData" :columns="columns"></right-toolbar>-->
        </el-row>
        </div>
        <div class="tableheight">
          <el-table :data="tableData" height="430">
            <el-table-column
              type="index"
              label="序号"
              showOverflowTooltip
            ></el-table-column>
            <el-table-column
              prop="code"
              label="工单编号"
              showOverflowTooltip
            ></el-table-column>
            <el-table-column prop="type" label="工单类型" showOverflowTooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.type!==null">
                  {{scope.row.type == "public" ? "公共报修" : "企业报修" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="描述信息"
              showOverflowTooltip
            ></el-table-column>
            <el-table-column
              prop="location"
              label="位置信息"
              showOverflowTooltip
            ></el-table-column>
            <el-table-column
              prop="creatorName"
              label="提单人"
              showOverflowTooltip
            ></el-table-column>
            <el-table-column
              prop="creatorPhone"
              label="联系电话"
              showOverflowTooltip
            ></el-table-column>
            <el-table-column
              prop="submitTime"
              label="提交时间"
              showOverflowTooltip
            >
            </el-table-column>
            <el-table-column prop="status" label="工单状态" showOverflowTooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'draft'">草稿</span>
                <span v-if="scope.row.status == 'todo'">待分派</span>
                <span v-if="scope.row.status == 'doing'">处理中</span>
                <span v-if="scope.row.status == 'done'">已完成</span>
                <span v-if="scope.row.status == 'not_evaluation'">待评价</span>
                <span v-if="scope.row.status == 'cancel'">已取消</span>
                <span v-if="scope.row.status == 'hang'">已挂起</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="evaluationStatus"
              label="评价状态"
              showOverflowTooltip
            >
              <template slot-scope="scope">
                <span>
                  {{
                    scope.row.status == "done"? scope.row.evaluationStatus == "Evaluated"? "已评价": "未评价": ""
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'draft'">
                  <el-button
                    @click="onEdit(scope.row)"
                    type="text"
                    >编辑</el-button
                  >
                  <el-button
                    @click="onDetail(scope.row)"
                    type="text"
                    >详情</el-button
                  >
                  <el-button
                    @click="onDelete(scope.row)"
                    type="text"
                    style="color: #ff403d"
                    >删除</el-button>
                </span>
                <span v-if="scope.row.status == 'todo'">
                  <el-button
                    @click="onSend(scope.row)"
                    type="text"
                    >派单</el-button
                  >
                  <el-button
                    @click="onRefuseWork(scope.row)"
                    type="text"
                    >拒绝工单</el-button
                  >
                  <el-button
                    @click="onDetail(scope.row)"
                    type="text"
                    >详情</el-button
                  >
                </span>
                <span v-if="scope.row.status == 'doing'">
                  <el-button
                    @click="onReassignment(scope.row)"
                    type="text"
                    >转单</el-button
                  >
                  <el-button
                    @click="hangUps(scope.row)"
                    type="text"
                    >挂起</el-button
                  >
                  <el-button
                    @click="onDetail(scope.row)"
                    type="text"
                    >详情</el-button
                  >
                </span>
                <span v-if="scope.row.status == 'done'">
                  <el-button
                    v-if="isAdmin"
                    @click="onAppraise(scope.row)"
                    type="text"
                    >评价</el-button
                  >
                  <el-button
                    @click="onDetail(scope.row)"
                    type="text"
                    >详情</el-button
                  >
                </span>
                <span v-if="scope.row.status == 'hang'">
                  <el-button
                    @click="onReassignment(scope.row)"
                    type="text"
                    >转单</el-button
                  >
                  <el-button
                    @click="onDetail(scope.row)"
                    type="text"
                    >详情</el-button
                  >
                </span>
                <span v-if="scope.row.status == 'not_evaluation'">
                  <el-button
                    @click="onDetail(scope.row)"
                    type="text"
                    >详情</el-button
                  >
                </span>
                <span v-if="scope.row.status == 'cancel'">
                  <el-button
                    @click="onDetail(scope.row)"
                    type="text"
                    >详情</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            v-show="tableData && tableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="formSearch.pageNum"
            :pageSizes="[10, 20, 40]"
            :limit.sync="formSearch.pageSize"
            :total="total"
          />
        </div>
      </div>
    </div>

    <div style="height: 100%">
      <el-dialog
        title="工单详情"
        :visible.sync="allClosemessage"
        width="600px"
        :before-close="handleClosemessage"
        :append-to-body="true"
        >
      <workdetail
      v-if="allClosemessage"
        ref="workdetail"
        :rowData="rowData"
        @workDetailVisibleShow="workDetailVisibleShow"
      ></workdetail>
      <div slot="footer">
        <el-button @click="allClosemessage = false">关闭</el-button>
      </div>
      </el-dialog>
    </div>

    <!--转派，派单dialog-->
    <div class="heights">
  
    <el-dialog
      :title="title"
      :visible.sync="sendShow"
      width="600px"
     
      :before-close="cancel"
    >
      <el-row >
        <el-form label-width="80px">
          <el-col :span="24">
            <el-form-item label="工单编号">
              <el-input v-model="sendWork.code" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单类型">
            <!--
                <el-select v-model="sendWork.type" disabled>
                  <el-option
                    v-for="(item, index) in type"
                    :key="index"
                    :value="item.value"
                    :label="item.name"
                    >{{ item.name }}
                  </el-option>
                </el-select>
            -->
              
              <el-input v-if="sendWork.type == 'public' " v-model="public" disabled />
              <el-input v-if="sendWork.type == 'enterprise' " v-model="enterprise" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修分类">
              <el-select v-model="sendWork.repairType" disabled></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提单人">
              <el-input v-model="sendWork.creatorName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="sendWork.creatorPhone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="title == '转单'">
            <el-form-item label="接单人员">
              <el-input v-model="sendWork.processor" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="title == '转单'">
            <el-form-item label="师傅电话">
              <el-input v-model="sendWork.processorPhone" disabled />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置信息">
              <el-input v-model="sendWork.location" disabled />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="分配人员" prop="people">
              <!-- <tree-transfer
                :title="titles"
                :from_data="fromData"
                :to_data="toData"
                :defaultProps="{ label: 'label', disabled: disabledFn }"
                @add-btn="add"
                @remove-btn="remove"
                :mode="mode"
                @left-check-change="leftChange"
                height="320px"
                filter
                openAll
              >
              </tree-transfer> -->
              <!-- <div style="border:1px solid #313448;border-radius:5px;height:200px;overflow-y: auto;padding:5px">
                <el-tree
                  ref="tree"
                  :data="fromData"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :check-on-click-node="false"
                  :check-strictly="true"
                  :props="defaultnewProps"
                  @node-click="handleNodeClick"
                  @check-change='getCurrentNode'>
                </el-tree>
              </div> -->
             
              <!-- <p style="height: 32px;"> {{userName}}</p>
              <ComDeptUser ref="comDeptUsers" @selectClick="selectClick"/> -->
              <div style="display: flex;justify-content: space-between;">
                  <p :style="[{color:userName ? '#b4b6bb' : '#606266'},{margin: 0}]">{{ userName?userName:'尚未选择用户'}}</p>
                  <el-button type="primary" @click="addDialog" :disabled="addPersonDis">选择人员</el-button>
                </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="onSubmit()"
          >确定
        </el-button>
        <el-button plain @click="cancel()"
          >取消
        </el-button>
      </div>
    </el-dialog>
    </div>
    <!--拒绝dialog-->
    <el-dialog
      title="拒绝工单"
      :visible.sync="refuseShow"
      width="600px"
      :before-close="cancel"
     
    >
      <el-row >
        <el-form
          label-width="80px"
          :model="refuseWork"
          ref="refuseWork"
          :rules="refuseWorkrules"
        >
          <el-col :span="24">
            <el-form-item label="工单编号">
              <el-input v-model="refuseWork.code" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单类型">
              <el-select v-model="refuseWork.type" disabled>
                <el-option
                  v-for="(item, index) in type"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                  >{{ item.name }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修分类">
              <el-select v-model="refuseWork.repairType" disabled></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提单人">
              <el-input v-model="refuseWork.creatorName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="refuseWork.creatorPhone" disabled />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置信息">
              <el-input v-model="refuseWork.location" disabled />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="拒绝理由" prop="reason">
              <el-input
                type="textarea"
                :rows="2"
                v-model="refuseWork.reason"
                placeholder="请输入拒绝理由"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="onRefuse()"
          >确定
        </el-button>
        <el-button plain @click="cancel()"
          >取消
        </el-button>
      </div>
    </el-dialog>
    <div class="guaqi">
    <!--挂起dialog-->
    <el-dialog
      title="挂起"
      :visible.sync="hangShow"
      width="600px"
      :before-close="cancel"
     
    >
      <el-row >
        <el-form
          label-width="80px"
          :model="hangUp"
          ref="hangUp"
          :rules="hangUpRules"
          style="width: 100%;"
        >
          <el-col>
            <el-form-item label="挂起理由" prop="hangReason">
              <el-input
                type="textarea"
                :rows="2"
                v-model="hangUp.hangReason"
                placeholder="请输入挂起理由"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="hangUpClick()"
          >确定
        </el-button>
        <el-button plain @click="cancel()"
          >取消
        </el-button>
      </div>
    </el-dialog>
    </div>
    <!--评价dialog-->
    <el-dialog
      title="评价"
      :visible.sync="appraiseShow"
      width="600px"
      :before-close="cancel"
    >
      <el-row>
        <el-form
          :model="appraise"
          labelWidth="80px"
          :rules="appraiserules"
          ref="appraise"
        >
          <el-col :span="24">
            <el-form-item label="工单编号">
              <el-input v-model="appraise.workOrderCode" disabled />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="评价星级" prop="stars">
              <el-rate
                v-model="appraise.stars"
                @change="changerate($event)"
              ></el-rate>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="评价内容" prop="content">
              <el-input
                type="textarea"
                :rows="3"
                v-model.trim="appraise.content"
                placeholder="请输入评价内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="submitAppraise()"
          >确定
        </el-button>
        <el-button plain @click="cancel()"
          >取消
        </el-button>
      </div>
    </el-dialog>
    <!--创建工单dialog-->
    <el-dialog
      :title="title"
      :visible.sync="createShow"
      width="600px"
      :beforeClose="onCancel"
      :show-close="true"
    >
      <el-row>
        <el-form
          label-width="80px"
          :model="addForm"
          :rules="addFormRules"
          ref="createform"
        >
          <el-col :span="12">
            <el-form-item label="工单类型" prop="type">
              <el-select v-model="addForm.type" placeholder="请选择工单类型">
                <el-option
                  v-for="(item, index) in type"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                  >{{ item.name }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修分类" prop="repairType">
              <el-cascader
                placeholder="请选择报修分类"
                change-on-select="trues"
                :options="options"
                :props="typeProps"
                v-model="selectedOptions"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="creatorName">
              <el-input
                v-model="addForm.creatorName"
                placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="creatorPhone">
              <el-input
                v-model="addForm.creatorPhone"
                placeholder="请输入联系方式"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="位置信息" prop="location">
              <el-input
                type="textarea"
                v-model="addForm.location"
                :rows="2"
                placeholder="请输入位置信息"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述信息" prop="content">
              <el-input
                type="textarea"
                v-model="addForm.content"
                :rows="2"
                placeholder="请输入描述信息"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件信息">
              <el-upload
                :file-list="fileDatas"
                class="upload-demo"
                :action="pictureUrl"
                :on-change="handlerChange"
                :on-success="handlerChangeSuccese"
                :on-remove="handleRemove"
                :headers="{'Client-Type': 'manageWeb', 'Authorization': 'Bearer ' + $store.state.user.token}"
                accept=".jpg,.jpeg,.png"
              >
                <el-button type="primary">点击上传</el-button>
                <!--<i slot="default" class="el-icon-plus"></i>-->
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/jpeg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <div style="height: 32px">
              <el-col style="text-align: right; margin: 20px 0">
                <el-button type="primary" @click="saveDraft()"
                  >保存草稿
                </el-button>
                <el-button
                  type="primary"
                  @click="onSubmitcreate(true)"
                  >确认
                </el-button>
                <el-button plain @click="onCancel()"
                  >取消
                </el-button>
              </el-col>
            </div>
          </el-col> -->
        </el-form>
      </el-row>
      <div slot="footer">
          <el-button type="primary" @click="saveDraft()"
            >保存草稿
          </el-button>
          <el-button
            type="primary"
            @click="onSubmitcreate(true)"
            >确认
          </el-button>
          <el-button plain @click="onCancel()"
            >取消
          </el-button>
      </div>
    </el-dialog>
    <!-- 选择负责人 -->
    <el-dialog
      :title="title1"
      :visible.sync="sendialogShow"
      width="850px"
     
      :before-close="cancel1"
    >
      <el-row >
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
</template>

<script>
import pagination from "@/components/comPagination";
import Tabs from "@/components/commonTabs";
import workdetail from "../components/workdetail";
import treeTransfer from "el-tree-transfer";
import { getcategory } from "@/api/smartProperty/dictionaries";
import {
  initTabData,
  refuseWorkOrder,
  getNumData,
  appraiseWorkOrder,
  getUserinfos,
  assignOrder,
  transferOrder,
  downloadworkOrder,
  addWorkOrders,
  delWork,
  hangUp
} from "@/api/smartProperty/workManagement";
import { getUser1 } from "@/api/system/user";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { redefineTransfer, redefineTree } from "@/utils/index";
import { downloadFile } from "@/utils/index";
import { downloads } from "@/api/smartProperty/notice";
import { get } from "@/api/system/dicttype";
import { getUser } from "@/api/system/user";
import Cookies from "js-cookie";
import ComDeptUser from "@/components/comDeptUser"
export default {
  name: "Infomation",
  components: {
    pagination,
    workdetail,
    treeTransfer,
    Tabs,
    ComDeptUser,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      defaultnewProps:{
        label: 'label',
        id:'id',
      },
      showSearch:true,
      multipleArr:[],
      permission: {
        searchWorkOrder: "smartProperty::workManagement::searchWorkorder",
        searchWorkOrderNum: "smartProperty::workManagement::searchWorkorderNum",
        transferWorkOrder: "smartProperty::workManagement::transferWorkorder",
        refuseWorkOrder: "smartProperty::workManagement::refuseWorkOrder",
        assignWorkOrder: "smartProperty::workManagement::assignWorkOrder",
        evaluteWorkOrder: "smartProperty::workManagement::evaluteWorkOrder",
        downloadWorkOrder: "smartProperty::workManagement::downloadWorkOrder",
        addWorkOrder: "smartProperty::workManagement::addWorkOrder",
        delWorkOrder: "smartProperty::workManagement::delWorkOrder",
        updateWorkOrder: "smartProperty::workManagement::updateWorkOrder",
        searchcategorytree: "smartProperty::workCategory::searchcategorytree",
      },
      //        转单派单拒绝dialog
      refuseShow: false,
      sendShow: false,
      allClosemessage:false,
      //        评价dialog
      appraiseShow: false,
      //        主页展示
      workPageShow: true,
      //        创建工单组件展示
      createWorkShow: false,
      //        查看详情组件展示
      workDetailShow: false,
      allWork: [],
      btnGroup: [
        {
          value: "ALL",
          label: "全部",
        },
        {
          value: "DRAFT",
          label: "草稿",
        },
        {
          value: "TODO",
          label: "待分派",
        },
        {
          value: "DOING",
          label: "处理中",
        },
        {
          value: "HANG",
          label: "已挂起",
        },
        {
          value: "DONE",
          label: "已完成",
        },
        {
          value: "CANCEL",
          label: "已取消",
        },
      ],
      btnChoose: 0,
      workType: [
        // {
        //   value: "enterprise",
        //   name: "企业报修",
        // },
        // {
        //   value: "PUBLIC",
        //   name: "公共报修",
        // },
      ],
      public:'公共报修',
      enterprise:'企业报修',
      type: [],
      formSearch: {
        creatorName: "",
        workOrderCode: "",
        processor: "",
        repairWorkOrderType: "",
        startTime: "",
        endTime: "",
        status: "",
        pageNum: 1,
        pageSize: 10,
      },
      fileDatas: [],
      time: [],
      total: 0,
      tableData: [],
      //        转单or派单
      title: "",
      //        全部人员名单
      people: [],
      sendWork: {
        //        选择人员名单
      },
      refuseWork: {},
      appraise: {
        stars: -1,
        content: "",
        creatorName: "",
        workOrderCode: "",
      },
      // tableData每个row的值
      rowData: {},
      titles: ["人员列表", "选择列表"],
      mode: "transfer", // transfer addressList
      fromData: [],
      oldtodata: [],
      defaultfromData: [],
      defaultdata: [],
      toData: [],
      withParameters: false,
      repairWorkOrderType: [],
      selectedIds: [],
      disableds: false,
      createShow: false,
      addForm: {
        repairType: "",
        type: "",
        creator: null,
        creatorPhone: "",
        creatorName: "",
        location: "",
        content: "",
        submit: true,
        mediaMeta: {
          pictures: [],
          videos: [],
        },
        id: "",
      },
      addFormRules: {
        type: [
          { required: true, message: "请选择工单类型", trigger: "change" },
        ],
        repairType: [
          {
            required: true,
            validator: this.validatetype,
            trigger: ["blur", "change"],
          },
        ],
        creatorName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: ["blur", "change"],
          },
        ],
        creatorPhone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: ["blur", "change"],
          },
          { validator: this.validatePhoneTwo, trigger: ["blur", "change"] },
        ],
        location: [
          {
            required: true,
            message: "请输入位置信息",
            trigger: ["blur", "change"],
          },
        ],
      },
      hangShow:false,
      hangUp:{
        hangReason:'',
        id:''
      },
      hangUpRules:{
        hangReason:[
          { required: true, message: "请输入挂起理由", trigger: "blur" },
        ],
      },
      refuseWorkrules: {
        reason: [
          { required: true, message: "请输入拒绝理由", trigger: "blur" },
        ],
      },
      appraiserules: {
        stars: [
          { required: true, validator: this.validaterate, trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入评价内容", trigger: "blur" },
        ],
      },
      selectedOptions: [],
      typeProps: {
        value: "name",
        label: "name",
        children: "children",
      },
      fileList: [],
      title: "",
      options: [],
      pictureUrl:
        process.env.VUE_APP_BASE_API + "/file/pm/fastdfs/upload/file",
      dictionary: ["repair_work_order_type"],
      addtype: "add",
      value: "0",
      isAdmin:false,
      currentstatus:"",
      title1:"添加人员",
      personId: "",
      userId:"",
      addPersonDis:false,
      sendialogShow:false,
      userName:"",
      account:''
    };
  },
  mounted() {
    // this.isAdmin = this.$store.state.user.user.admin;
    this.getAllWork();
    this.getTableData();
    this.getcategorys();
    this.getUserInfo();
    this.getcategorytrees();
    this.getdict();
    if(this.$route.query.id){
      this.btnChoose = 2;
      this.formSearch.status = this.$route.query.id
      this.onSearch()
    }
  },
  methods: {
    addDialog(){
      this.sendialogShow = true
        this.$refs.comDeptUsers.init()
        this.addPersonDis = false
    },
    // 获取人员id
    selectClick($e){
      this.personId = $e[0]
      this.userId = $e[0]
    },
    // 添加人员
    onSubmit1() {
        getUser1(this.personId).then(res => {
            let data = {
              name: res.data.nickName,
              account: res.data.userName,
              groups: res.data.dept.deptName
            };
            this.userName = res.data.nickName
            this.account = res.data.userName
          });
          this.sendialogShow = false
      },
      cancel1() {
        this.sendialogShow = false;
        // this.getUserInfo();
        // this.$refs.addForm.resetFields()
      },
    // selectClick($e){
    //     getUser($e[0]).then(res => {
    //       // this.toData = [res.data]
    //       this.userName = res.data.nickName
    //     });
    //   },
    // 获取选中节点
    // handleNodeClick(item,node,self){ 
    //   //自己定义的editCheckId，防止单选出现混乱 
    //   this.userName = item.username
    //   // this.$refs.tree.setCheckedKeys([item.id]) 
    // }, 
    // getCurrentNode(item,node,self){ 
    //   if (node == true) { 
    //     this.userName = item.username
    //     // this.$refs.tree.setCheckedKeys([item.id]) 
    //     this.uniqueValue =  this.$refs.tree.getCheckedKeys().toString();
    //   }else { 
    //     this.uniqueValue =  this.$refs.tree.getCheckedKeys().toString();
    //     if(this.uniqueValue.length == 0){
    //       this.uniqueValue = '' 
    //     }
    //     // if (this.editCheckId == item.id) { 
    //     //   this.$refs.tree.setCheckedKeys([item.id]) 
    //     // } 
    //   } 
    // },
    //树节点 disabled 设置已加入清单的为禁用状态  addSyncData为已经加入清单的数据
    disabledFn(data, node) {
      return data.disabled;
    },
    changerate(e) {
      if (e > 0) {
        this.$refs.appraise.clearValidate("stars");
      }
    },
    //      获取字典percentage
    getdict() {
      this.dictionary.forEach((item) => {
        get(item).then((res) => {
          this.$set(this, "type", [...res.data]);
          let data = res.data.map((result) => {
            return {
              value: result.value,
              name: result.name,
            };
          });
          this.$set(this, "workType", [...data]);
        });
      });
    },

    resetForm(formName) {
      this.createShow = false;
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      if (formName == "createform") {
        this.addForm.id = "";
      }
      this.selectedOptions = [];
      this.getTableData();
      this.getAllWork();
    },
  timeChange() {
      if (!this.time) {
        this.time = [];
         this.formSearch.startTime = "";
        this.formSearch.endTime = "";
         this.getTableData();
      }
    },
    getcategorytrees() {
      // let obj = getObjByKey(this.permission.searchcategorytree);
      let url = '/pm/repair/category/query/tree'
      let method = 'GET'
      getcategory(url, method)
        .then((res) => {
          this.options = res.data;
        })
        .catch((err) => {});
    },
    /* 是否手机号码或者固话*/
    validatePhoneTwo(rule, value, callback) {
      const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
      if (value === "" || value === undefined || value == null) {
        callback();
      } else {
        if (!reg.test(value) && value !== "") {
          callback(new Error("请输入正确的电话号码或者固话号码"));
        } else {
          callback();
        }
      }
    },
    validaterate(rule, value, callback) {
      if (value < 1) {
        callback(new Error("请打出评分(至少一星)"));
      } else {
        callback();
      }
    },
    validatetype(rule, value, callback) {
      if (this.selectedOptions && this.selectedOptions.length > 0) {
        callback();
      } else {
        callback(new Error("请选择报修分类"));
      }
    },
    //      编辑
    onEdit(data = false) {
      this.title = !data ? "创建工单" : "编辑";
      this.createShow = true;
      if (data) {
        this.fileDatas = [];
        this.selectedOptions = data.repairType.split("/");
        if (data.mediaMeta && data.mediaMeta.pictures != null) {
          for (let i = 0; i < data.mediaMeta.pictures.length; i++)
            this.fileDatas.push(data.mediaMeta.pictures[i]);
        }
        this.$nextTick(() => {
          this.addForm.type = data.type;
          this.addForm.repairType = data.repairType;
          this.addForm.creatorName = data.creatorName;
          this.addForm.creatorPhone = data.creatorPhone;
          this.addForm.location = data.location;
          this.addForm.content = data.content;
          this.addForm.id = data.id;
          this.addtype = "edit";
        });
      } else {
        this.fileDatas = [];
        this.$nextTick(() => {
          this.addForm.creatorName = this.$store.state.user.name;
          // this.addForm.creatorPhone = this.$store.state.user.user.phone;
          this.addtype = "add";
        });
      }
    },
    // 挂起弹窗
    hangUps(item){
      this.hangUp.id=item.id
      this.hangShow = true
    },
    // 挂起请求
    hangUpClick(){
      this.$refs.hangUp.validate((valid) => {
        if (valid) {
          hangUp(this.hangUp).then(res=>{
            this.$message.success("挂起成功");
            this.hangShow = false;
            this.getAllWork();
            this.getTableData();
          })
        } else {
          this.$message.warning("请填写挂起理由");
        }
      });
      
    },
    //      保存草稿
    saveDraft() {
      this.onSubmitcreate(false);
    },
    //     创建工单
    onSubmitcreate(bool) {
      this.addForm.mediaMeta = {
        pictures:null,
        videos:null,
      }
      this.addForm.submit = bool;
      this.addForm.repairType = this.selectedOptions.join("/");
      let obj = {};
      if (this.addForm.id == "") {
        // obj = getObjByKey(this.permission.addWorkOrder);
        obj = {
          url : '/pm/repair/order/add',
          method:'POST'
        }
      } else {
        // obj = getObjByKey(this.permission.updateWorkOrder);
        obj = {
          url : '/pm/repair/order/update',
          method:'PUT'
        }
      }

      let data = this.addForm;
      data.mediaMeta.pictures = this.fileDatas;

      if (data.mediaMeta) {
        if (data.mediaMeta.pictures && !data.mediaMeta.pictures.length) {
          data.mediaMeta.pictures = null;
        }
        if (data.mediaMeta.videos && !data.mediaMeta.videos.length) {
          data.mediaMeta.videos = null;
        }
        if (!data.mediaMeta.pictures && !data.mediaMeta.videos) {
          data.mediaMeta = null;
        }
      }
      this.$refs.createform.validate((valid) => {
        if (valid) {
          addWorkOrders(obj.url, obj.method, data)
            .then((res) => {
              if (!bool) {
                this.$message.success("保存草稿成功");
              } else if (this.addtype == "edit") {
                this.$message.success("编辑成功");
              } else  {
                this.$message.success("创建成功");
              }
              this.onCancel();
              this.getTableData();
              this.getAllWork();
              this.submit = true;
              this.addtype = "add";
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },

    onCancel() {
      this.fileDatas = [];
      this.getAllWork();
      this.resetForm("createform");
      this.resetForm("appraise");
    },
    // // 监听左侧选中
    // leftChange(nodeObj, treeObj, checkAll) {
    //   if (treeObj.halfCheckedKeys.length) {
    //     treeObj.halfCheckedNodes[0].children.filter((id) => {
    //       if (id.username !== nodeObj.username) {
    //         this.$set(id, "disabled", true);
    //       }
    //     });
    //   } else {
    //     this.fromData[0].children.map((users) => {
    //       if (users.username == this.$store.state.user.name) {
    //         this.$set(users, "disabled", true);
    //       } else {
    //         this.$set(users, "disabled", false);
    //       }
    //     });
    //     // this.fromData = this.fromData
    //   }
    // },
    getUserInfo() {
    //  let data = { pageNum: 1, pageSize: 1000, code:"ORDER_HANDLE" };
    //   getUserinfos(data)
    //     .then((res) => {
    //       console.log(res,'666');
    //       res.data.data.map((item) => {
    //         item.userInfos.map((users) => {
    //           if (users.username == this.$store.state.user.name) {
    //             this.$set(users, "disabled", true);
    //           } else {
    //             this.$set(users, "disabled", false);
    //           }
    //         });
    //       });
    //       this.defaultdata = res.data.data;
    //       this.fromData = redefineTree(res.data.data[0].userInfos);
    //       this.defaultfromData = redefineTransfer(res.data.data);
    //     })
    //     .catch((err) => {
    //       this.$message.error(err.message);
    //     });
    // toUpperCase
    },
    //data 所有的树形数据  selData 已选择的树形数据
    handlerTree(data, selData) {
      for (let i = data.length - 1; i >= 0; i--) {
        for (let j = selData.length - 1; j >= 0; j--) {
          if (data[i] && data[i].id === selData[j].id) {
            // 当id相等可以删除的情况 即：没有子级可以删除；
            if (!data[i].children && !selData[j].children) {
              data.splice(i, 1);
            } else {
              this.handlerTree(data[i].children, selData[j].children);
            }
          }
        }
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      if (obj.nodes.length > 1 && toData[0].children.length > 1) {
        this.$message.error("最多指派一个人");
        this.toData = [];
      }
      if (this.toData.length && this.toData[0].children.length > 1) {
        this.toData = this.oldtodata;
        this.$message.error("最多指派一个人");
      } else {
        this.toData = toData;
        this.oldtodata = toData;
      }
      // this.handlerTree(fromData, toData);
      if (toData.length) {
        this.toData = toData.filter((item) => {
          return item.children.length != 0;
        });
      }
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      if (!toData.length) {
        this.getUserInfo();
      }
      if (toData.length && toData[0].children.length == 0) {
        toData = [];
        this.getUserInfo();
      }
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      this.toData = toData;
    },

    getTableData() {
      // let obj = getObjByKey(this.permission.searchWorkOrder);
      let url = '/pm/repair/order/query/criteria'
      let method = 'GET'
      if (this.time.length) {
        this.formSearch.startTime = this.time[0];
        this.formSearch.endTime = this.time[1];
      }
      if (this.formSearch.status === "ALL") {
        this.formSearch.status = "";
      }
      let data = this.formSearch;
      initTabData(url, method, data)
        .then((res) => {
          this.tableData = res.data.data;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    getcategorys() {
      // let obj = getObjByKey(this.permission.searchcategorytree);
      let url = '/pm/repair/category/query/tree'
      let method = 'GET'
      getcategory(url, method)
        .then((res) => {
          this.repairWorkOrderType = res.data;
        })
        .catch((err) => {});
    },

    setItemProgress(data) {
      // 分母不能为0
      if(this.allWork[0].num >0){
        return parseInt((data.num / this.allWork[0].num).toFixed(2) * 100);
      }
    },

    setItemText(row) {
      if (!row.num) {
        return () => {
          return 0 + "";
        };
      }
      return () => {
        return row.num;
      };
    },
    // 数组对象排序
    compare (property){
      return function(a,b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2
      }
    },
    //      获取上方工单数量统计
    getAllWork() {
      let work = [];
      // let obj = getObjByKey(this.permission.searchWorkOrderNum);
      let url = '/pm/repair/order/query/statistics'
      let method = 'GET'
      getNumData(url, method).then((res) => {
        let result = res.data;
          for (let key in result) {
            if (key == "totalAmount") {
              work.push({
                num: result[key],
                label: "全部工单",
                id:1
              });
            }
            if (key == "todoAmount") {
              work.push({
                num: result[key],
                label: "待分派",
                id:2
              });
            }
            if (key == "dongingAmount") {
              work.push({
                num: result[key],
                label: "处理中",
                id:3
              });
            }
            if (key == "hangAmount") {
              work.push({
                num: result[key],
                label: "已挂起",
                id:4
              });
            }
            if (key == "doneAmount") {
              work.push({
                num: result[key],
                label: "已完成",
                id:5
              });
            }
            if (key == "cancelAmount") {
              work.push({
                num: result[key],
                label: "已取消",
                id:6
              });
            }
            if (key == "evaluatedAmount") {
              work.push({
                num: result[key],
                label: "已评价",
                id:7
              });
            }
            if (key == "unevaluatedAmount") {
              work.push({
                num: result[key],
                label: "未评价",
                id:8
              });
            }
          }
          
          work.sort(this.compare("id"))
          this.allWork = work;
      });
    },

    //      btnclick(item, index) {
    //        this.value = index;
    //        this.btnChoose = item.label;
    //        this.formSearch.status = item.value;
    //        this.getTableData();
    //      },
    btnclick(e) {
      this.value = e.index;
      this.btnChoose = e.index;
      this.formSearch.status = e.item.value;
      this.currentstatus = e.item.value;
      this.getTableData();
      this.formSearch.pageNum= 1;
    },
    //      派单
    onSend(data) {
      this.title = "派单";
      this.sendShow = true;
      this.sendWork = data;
      this.userName = data.processorName
      this.account = data.processor
      this.$refs.comDeptUsers.init()
    },
    //      转派
    onReassignment(data) {
      this.title = "转单";
      this.sendShow = true;
      this.sendWork = data;
      console.log(data,'data')
      this.userName = data.processorName
      this.account = data.processor
      this.$refs.comDeptUsers.init()
    },
    //      评价
    onAppraise(data) {
      this.appraiseShow = true;
      this.appraise.workOrderCode = data.code;
      this.appraise.creatorName = this.$store.state.user.user.nickname;
    },
    submitAppraise() {
      // let obj = getObjByKey(this.permission.evaluteWorkOrder);
      let url = '/pm/repair/order/evaluate'
      let method = 'POST'
      let data = this.appraise;
      this.$refs.appraise.validate((valid) => {
        if (valid) {
          appraiseWorkOrder(url, method, data).then((res) => {
            this.$message.success("评价成功");
            this.appraiseShow = false;
            this.getTableData();
            this.onCancel();
          });
        }
      });
    },
    //      拒绝工单
    onRefuseWork(data) {
      this.title = "拒绝工单";
      this.refuseShow = true;
      this.refuseWork.workNum = data.workNum;
      this.refuseWork = data;
    },
    onRefuse() {
      // let obj = getObjByKey(this.permission.refuseWorkOrder);
      let url = '/pm/company_enter/entered/page'
      let method = 'GET'
      let data = {
        reason: this.refuseWork.reason,
        orderCode: this.refuseWork.code,
      };
      this.$refs.refuseWork.validate((valid) => {
        if (valid) {
          refuseWorkOrder(url, method, data).then((res) => {
            this.$message.success("拒绝成功");
            this.getAllWork();
            this.refuseShow = false;
            this.getTableData();
          });
        } else {
          this.$message.warning("请填写拒绝理由");
        }
      });
    },
    //      详情
    onDetail(row) {
      console.log(row,'详情')
          this.workPageShow = false;
          this.createWorkShow = false;
          this.workDetailShow = true;
          this.rowData = row;
          this.rowData.toData = this.toData;
          this.allClosemessage = true
    },
    handleClosemessage(){
      this.workPageShow = true;
      this.createWorkShow = true;
      this.workDetailShow = true;
      this.allClosemessage = false
    },
    handleCurrentChange() {
      this.getTableData();
    },
    // 勾选工单表格复选框
    handleSelectionChange(data) {
      this.selectedIds = [];
      data.forEach((item) => {
        this.selectedIds.push(item);
      });
    },
    download() {
      // let obj = getObjByKey(this.permission.downloadWorkOrder);
      let url = '/pm/repair/order/download'
      let method = 'GET'
      if (this.time.length) {
        this.formSearch.startTime = this.time[0];
        this.formSearch.endTime = this.time[1];
      }

      let data = this.formSearch;
      if (data.startTime == "" || data.endTime == "") {
        this.$message.error("请选择需要导出工单的时间段");
      } else {
        downloadworkOrder(url, method, data)
          .then((res) => {
            this.$message.success('数据正在导出，请稍后到消息中心查看下载！')
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      }
    },
    //      搜索
    onSearch() {
      this.getTableData();
    },
    onReset() {
      this.formSearch = {
        creatorName: "",
        workOrderCode: "",
        processor: "",
        repairWorkOrderType: "",
        startTime: "",
        endTime: "",
        status: this.currentstatus,
        pageNum: 1,
        pageSize: 10,
      };
      this.time = [];
      // this.btnChoose = 0;
      this.getTableData();
    },
    //      提交派单和转单
    onSubmit() {
      // if (this.toData.length != 0) {
      //   if (this.toData[0].children.length == 1) {
      //     let chooseusername = this.toData[0].children[0];
          let data = {
            id: this.sendWork.id,
            username: this.account,
          };
          let obj = {};
          if (this.title == "派单") {
            // obj = getObjByKey(this.permission.assignWorkOrder);
            obj = {
              url : '/pm/repair/order/assign',
              method:'POST'
            }
          } else if (this.title == "转单") {
            // obj = getObjByKey(this.permission.transferWorkOrder);
            obj = {
              url : '/pm/repair/order/transfer',
              method:'POST'
            }
          }
          assignOrder(obj.url, obj.method, data).then((res) => {
            if (this.title == "派单") {
              this.$message.success("派单成功");
            } else if (this.title == "转单") {
              this.$message.success("转派成功");
            }
            this.sendShow = false;
            this.cancel();
            this.getAllWork();
            this.getTableData();
          });
      //   } else {
      //     this.$message.error("最多指定一个人");
      //   }
      // } else {
      //   this.$message.error("至少指定一个人");
      // }
    },
    workDetailVisibleShow(data) {
      this.workPageShow = data;
      this.createWorkShow = !data;
      this.workDetailShow = !data;
    },
    cancel() {
      this.$nextTick(()=>{
        // this.$refs.tree.setCheckedKeys([])
      })
      this.refuseShow = false;
      this.hangShow = false
      this.sendShow = false;
      this.appraiseShow = false;
      this.appraise.stars = 0;
      this.appraise.content = "";
      this.refuseWork.reason = "";
      this.hangUp.hangReason = "";
      this.getUserInfo();
      this.toData = [];
    this.getAllWork();
    },
    handlerChange(file, fileList) {},
    handleRemove(file, fileList) {
      for (var i = 0; i < this.fileDatas.length; i++) {
        if (this.fileDatas[i].uid == file.uid) {
          this.fileDatas.splice(i, 1);
        }
      }
    },
    handlerChangeSuccese(res, file, fileList) {
      if (res.code === 200) {
        var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
        const extension = testmsg === "jpg";
        const extension2 = testmsg === "png";
        const extension5 = testmsg === "jpeg";
        if (
          !extension &&
          !extension2 &&
          !extension5
        ) {
          fileList.pop();
          this.$message({
            message: "上传文件只能是 jpeg、jpg、png格式!",
            type: "warning",
          });
          return false;
        } else {
          this.fileDatas.push({
          uid: file.uid,
          name: file.name,
          path: res.data.path,
        });
        }
      }
    },
    onDelete(data) {
      // let obj = getObjByKey(this.permission.delWorkOrder);   percentage
      let url = '/pm/repair/order/delete/'
      let method = 'DELETE'
      this.$confirm(`确定要删除编号为${data.code}的草稿吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delWork(url, method, data.id).then((res) => {
          this.$message.success("删除成功");
          this.getTableData();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container{
  overflow: hidden;
}
::v-deep .el-upload-list__item-name{
  white-space: inherit;
}
.el-tree{
  //background: #202230;
  border-radius: 5px;
  
}
.el-tree-node{ 
    .is-leaf + .el-checkbox .el-checkbox__inner{ 
        display: inline-block;
    }
    .el-checkbox .el-checkbox__inner{ 
        display: none;
    }
}
::v-deep .el-table.el-table--fit{
  overflow: hidden;
}
.transparent {
  background-color: transparent;
  padding: 0;
}

p {
  margin: 0;
  padding: 0;
}

.topinfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 130px;
  // background-color: #202230;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
  border-radius: 8px;
  padding: 20px;
  p {
    text-align: center;
    color: #666;
  }
  div {
    display: inline-block;
  }
}

.workInfo {
  // background-color: #202230;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
  // height: calc(100vh - 90px - 130px);
}

.color {
  color: #206aff;
}

::v-deep .el-transfer-panel {
  width: 300px;
  //background-color: #202230;
  .el-transfer-panel__header {
    background-color: transparent !important;
    .el-checkbox .el-checkbox__label {
      color: #ffffff !important;
    }
  }
  .el-transfer-panel__body {
    .el-checkbox .el-checkbox__label {
      color: #ffffff !important;
    }
  }
  .el-transfer-panel__filter .el-input__inner {
    width: 90%;
    margin-right: 20px;
  }
}

::v-deep .el-rate {
  padding-top: 5px;
}

::v-deep.el-progress--circle .el-progress__text,
.el-progress--dashboard .el-progress__text {
  font-size: 20px !important;
}

::v-deep.wl-transfer .el-tree {
  background-color: inherit;
}

::v-deep.wl-transfer .transfer-title {
  background-color: inherit;
  
  font-size: 14px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
}

.el-form .el-select {
  width: 100%;
}

::v-deep.el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}

// ::v-deep.el-range-editor--small .el-range-separator {
//   line-height: 34px;
// }

::v-deep svg path:first-child {
  stroke: #e5e9f2;
}

.el-cascader--small {
  width: 100%;
}

.tableheight {
  height: calc(100% - 220px);
}

::v-deep .wl-transfer .transfer-left {
  border: 2px solid rgba(255, 255, 255, 0.04);
}

::v-deep .wl-transfer .transfer-right {
  border: 2px solid rgba(255, 255, 255, 0.04);
}

 ::v-deep .heights > .el-dialog__wrapper .el-dialog .el-dialog__body {
    //height: 60vh !important;
    overflow: auto !important;
    margin-bottom:20px;
    
  }
  ::v-deep .guaqi>.el-dialog__wrapper .el-dialog .el-dialog__body{
    padding: 30px 10px !important;
  }
</style>
