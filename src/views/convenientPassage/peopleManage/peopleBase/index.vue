<template>
  <div class="app-container">
    <div v-if="homepage" style="height: 100%">
      <div>
        <el-form ref="formSearch" inline :model="visitorManage" v-if="showSearch">
          <el-form-item prop="personName" label="人员姓名">
            <el-input
              placeholder="请输入人员姓名"
              clearable
              v-model="visitorManage.personName"
            ></el-input>
          </el-form-item>
          <el-form-item prop="userDoorNum" label="卡号">
            <el-input
              placeholder="请输入卡号"
              clearable
              v-model="visitorManage.userDoorNum"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item prop="idNumber" label="身份证号">
            <el-input
              placeholder="请输入身份证号"
              clearable
              v-model="visitorManage.idNumber"
            ></el-input>
          </el-form-item>
          <el-form-item prop="personPhone" label="手机号">
            <el-input
              placeholder="请输入手机号"
              clearable
              v-model="visitorManage.personPhone"
            ></el-input>
          </el-form-item> -->
          <el-form-item prop="type" label="人员类型">
            <el-select v-model="visitorManage.type">
              <el-option
                v-for="item in btnGroup"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="doorAuthorized" label="授权门禁">
            <el-input
              placeholder="请输入授权门禁"
              clearable
              v-model="visitorManage.doorAuthorized"
            ></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSearch()"
              >搜索</el-button
            >
            <el-button
              icon="el-icon-refresh-left"
              @click="onReset()"
              >重置</el-button
            >
          </el-form-item>
          <el-form-item style="float: right;margin-right: 0">
            <!-- <el-button plain type="primary" :disabled="multipleArr.length == 0" @click="onExport()">导出</el-button> -->
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <!-- <el-col :span="1.5">
            <el-button  
              icon="el-icon-plus" 
              plain 
              type="primary" 
              @click="onAwait()"
            >同步</el-button>
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
        </el-row>
      </div>
      <!-- 表格数据 -->
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="multipleChange"
        >
          <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <!-- <el-table-column prop="idNumber" label="身份证号"></el-table-column> -->
          <el-table-column prop="phone" label="手机号码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="personTypeName" label="人员类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userDoorNum" label="卡号" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="doorAuthorized" label="门禁（授权门禁）" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="validBeginTime" label="有效起日" show-overflow-tooltip></el-table-column>
          <el-table-column prop="validEndTime" label="有效止日" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="state" label="当前状态" show-overflow-tooltip></el-table-column> -->
          <!-- <el-table-column prop="syncDate" label="更新时间" show-overflow-tooltip></el-table-column> -->
          <!-- <el-table-column prop="personImg" label="人员照片" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-image 
                style="width: 100px; height: 100px"
                :src="scope.row.personImg" 
                :preview-src-list="[scope.row.personImg]">
              </el-image>
            </template>
          </el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="lookDetail(scope.row)" type="text">人员详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="tableData && tableData.length > 0"
          @pagination="handleCurrentChange"
          :page.sync="visitorManage.pageNum"
          :pageSizes="[10, 20, 30, 40]"
          :limit.sync="visitorManage.pageSize"
          :total="pagination"
        />
      </div>
      <!-- 分页 -->
    </div>
    <div v-else>
      <Authority
        ref="authority"
        @authorityShow="authorityShow"
        :rowData="rowData"
      ></Authority>
    </div>
    <!-- 查看人员详情 -->
    <el-dialog
            :close-on-click-modal="false"
            title="人员详情"
            :visible.sync="dialogShow"
            :before-close="dialogClose"
            width="35%"
        >
            <el-row>
                <el-col :span="6">
                  <el-image
                    style="width: 90%; height: 200px"
                    :src="detailData.personImg"
                    >
                  </el-image>
                </el-col>
                <el-col :span="18">
                    <el-descriptions :column="2" label-class-name="labelClass" content-class-name="contentClass">
                        <el-descriptions-item label="姓名">{{ detailData.name }}</el-descriptions-item>
                        <el-descriptions-item label="房屋联系人">{{ detailData.houseContacts }}</el-descriptions-item>
                        <el-descriptions-item label="身份证号码">{{ detailData.idNumber }}</el-descriptions-item>
                        <el-descriptions-item label="联系人电话">{{ detailData.contactsPhone }}</el-descriptions-item>
                        <el-descriptions-item label="性别">{{ detailData.sex }}</el-descriptions-item>
                        <el-descriptions-item label="车牌号码">{{ detailData.licensePlateNumber }}</el-descriptions-item>
                        <el-descriptions-item label="民族">{{ detailData.nation }}</el-descriptions-item>
                        <el-descriptions-item label="工作单位">{{ detailData.enterpriseName }}</el-descriptions-item>
                        <el-descriptions-item label="国籍">{{ detailData.nationality }}</el-descriptions-item>
                        <el-descriptions-item label="卡号">{{ detailData.userDoorNum }}</el-descriptions-item>
                        <el-descriptions-item label="户籍所在地">{{ detailData.registered }}</el-descriptions-item>
                        <el-descriptions-item label="门名称">{{ detailData.doorAuthorized }}</el-descriptions-item>
                        <el-descriptions-item label="户籍地址">{{ detailData.address }}</el-descriptions-item>
                        <el-descriptions-item label="权限类型">{{ detailData.permissionTypeName }}</el-descriptions-item>
                        <el-descriptions-item label="手机号码">{{ detailData.phone }}</el-descriptions-item>
                        <el-descriptions-item label="起始日期">{{ detailData.validEndTime }}</el-descriptions-item>
                        <el-descriptions-item label="人员类型">{{ detailData.personTypeName }}</el-descriptions-item>
                        <el-descriptions-item label="截止日期">{{ detailData.validBeginTime }}</el-descriptions-item>
                        <el-descriptions-item label="关联房屋">{{ detailData.house }}</el-descriptions-item>
                    </el-descriptions>
                </el-col>
            </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getVisitor, getAwait, exportPersonInfo, getPersonType } from "@/api/peopleManage";

import { getAccessControl } from "@/api/peopleManage/index.js";
import pagination from "@/components/comPagination";
import Authority from "../components/authority";
import { downloadFile, formatData } from "@/utils/index";

export default {
  name:'PeopleBase',
  components: {
    pagination,
    Authority,
  },
  data() {
    return {
      permission: {
        searchPeople: "peopleManage::peopleBase::searchPeople",
        searchAuthority: "peopleManage::peopleBase::searchAuthority",
        awaitAuthority: "peopleManage::peopleBase::awaitAuthority",
      },
      visitorManage: {
        pageSize: 10,
        pageNum: 1,
        personName: "",
        personPhone: "",
        type: "",
        doorAuthorized:"",
        idNumber:"",
        userDoorNum:""
      },
      options: [{ value: "", name: "" }],
      btnChoose: "企业人员信息",
      btnGroup: [],
      homepage: true,
      pagination: 10,
      tableData: [],
      showSearch:true,
      multipleArr:[],
      rowData: {},
      dialogShow: false,
      detailData:{}
    };
  },
  mounted() {
    this.getPersonTypes();
    this._getVisitorData();
    if(this.$route.query.id){
        this.btnChoose = "访客人员信息";
        this.visitorManage.type = this.$route.query.id
        this.onSearch()
      }
  },
  methods: {
    // 获取人员类型
    getPersonTypes(){
      getPersonType().then(res=>{
        this.btnGroup = formatData(res.data)
      })
    },
    // 导出
    onExport(){
      exportPersonInfo(this.multipleArr).then(res=>{
        downloadFile(res, '人员信息', "xlsx");
        this.$message.success("导出成功")
      })
    },
    // table多选
    multipleChange(val){
        let temp = val.map(item=>item.id)
        this.multipleArr = temp
    },
    btnClick(item, index) {
      this.btnChoose = item.label;
      this.visitorManage.type = item.value;
      this._getVisitorData();
    },
    // 查看人员详情
    lookDetail(row){
      this.detailData = Object.assign({},row)
      this.dialogShow = true
    },
    // 关闭详情弹窗
    dialogClose(){
      this.dialogShow = false
    },
    _getVisitorData() {
      //let obj = getObjByKey(this.permission.searchPeople);
      let searchData = {
        url: '/pm/traffic/person/all',
        method: 'get',
        data: this.visitorManage,
      };
      if (searchData.data.personName == "") {
        delete searchData.data.personName;
      }
      if (searchData.data.personPhone == "") {
        delete searchData.data.personPhone;
      }
      getVisitor(searchData)
        .then((res) => {
          this.tableData = res.data.data;
          this.pagination = res.data.total;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /* 是否手机号码*/
    validatePhone(rule, value, callback) {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value === "" || value === undefined || value == null) {
        callback();
      } else {
        if (!reg.test(value) && value !== "") {
          callback(new Error("请输入正确的电话号码"));
        } else {
          callback();
        }
      }
    },
    // 搜索
    onSearch() {
      this._getVisitorData();
    },
    // 重置
    onReset() {
      // this.visitorManage.personName = "";
      // this.visitorManage.personPhone = "";
      this.$refs.formSearch.resetFields()
      Object.keys(this.visitorManage).forEach((x) => {
        if (x === "pageNum") {
          this.visitorManage[x] = 1;
        } else if (x === "pageSize") {
          this.visitorManage[x] = 10;
        }
      });
      this._getVisitorData();
    },
    handleSizeChange(val) {
      this.visitorManage.pageSize = val;
      this._getVisitorData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this._getVisitorData();
      console.log(`当前页: ${val}`);
    },
    authorityShow(data) {
      this.homepage = data;
    },
    onAwait() {
      let d = new Date();
      let data = {
        date: `${d.getFullYear()}-${
          d.getMonth() + 1 > 10 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)
        }-${d.getDate() > 10 ? d.getDate() : "0" + d.getDate()}`,
      };
      //let obj = getObjByKey(this.permission.awaitAuthority);
      getAwait(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("同步人员成功");
          this._getVisitorData();
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>

::v-deep .labelClass,::v-deep .contentClass{
  font-size: 14px !important;
}
.btnGroups {
  cursor: pointer;
  background-color: #f5f7fa;
  border-radius: 30px;
  width: 240px;
  height: 42px;
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
  & > div {
    display: inline-block;
  }
  .btn {
    width: 120px;
    height: 42px;
    border-radius: 30px;
    line-height: 42px;
    color: #afb9d0;
    font-size: 14px;
  }
  .divActive {
    background-color: #206aff;
    color: #fff;
  }
}

.color {
  color: #206aff;
}
  ::v-deep.el-table.el-table--fit{
  overflow: hidden;
}
</style>
