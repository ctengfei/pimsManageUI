<template>
  <div class="app-container">
    <el-row :gutter="20" style="overflow-y:hidden;">
      <el-col style="height:inherit">
        <div class="ListManage" style="height:100%">
          <el-form
            ref="formSearch"
            inline
            :model="formSearch"
            class="demo-form-inline"
          >
            <el-form-item prop="meetingName" label="议室名称">
              <el-input
                v-model="formSearch.meetingName"
                placeholder="请输入会议室名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="是否对外开放" prop="foreignState">
              <el-select
                v-model="formSearch.foreignState"
                placeholder="请选择是否对外开放"
                clearable
              >
                <el-option
                  v-for="item in foreignStates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="onSearch"
                >搜索</el-button
              >
              <el-button
                icon="el-icon-refresh-left"
                @click="onReset('formSearch')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <!-- <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                @click='onAdd'
              >新增</el-button>
            </el-col> -->
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="meetingName" label="会议室名称" />
        <el-table-column prop="meetingAddress" label="会议室地址" />
        <el-table-column prop="meetingCapacity" label="可容纳人数" />
        <el-table-column prop="meetingArea" label="使用面积（㎡）" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="foreignStateName" label="是否对外开放" />
        <el-table-column prop="meetingPicture" label="会议室照片">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.meetingPicture"
              :preview-src-list="[scope.row.meetingPicture]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="onInfo(scope.row)"
              >查看预约状态</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
     
      <!-- 分页 -->
      <pagination
        v-show="formSearch.total > 0"
        :total="formSearch.total"
        :page.sync="formSearch.pageNum"
        :limit.sync="formSearch.pageSize"
        @pagination="tableCurrentChange"
      />
    <!-- 新增和编辑 -->
    <el-dialog
      :title="'当前会议室：'+ meetingObj.meetingName"
      :visible.sync="addFormStatus"
      :before-close="addFormStatusDialog"
      width="900px"
    >
    <div style="height:80vh;overflow-y: scroll;">
      <div>
        会议室容量：{{ meetingObj.meetingCapacity }}
        会议室设备：{{ meetingObj.deviceDesp }}
      </div>
      <MeetRoom :meetingId="meetingId"/>
    </div>
    </el-dialog>
    <!-- <MeetRoom /> -->
  </div>
</template>

<script>
import { getMeetingList, lookStatus, searchStatus } from "@/api/spaceManagement/meeting";
import pagination from "@/components/comPagination";
import MeetRoom from "../components/meetRoom";
export default {
  name: "Meeting",
  components: {
    pagination,
    MeetRoom
  },
  dicts: ["enableState"],
  data() {
    const today =  new Date().getFullYear() + "-" + ((new Date().getMonth() + 1 + '').padStart(2, '0')) + "-" + ((new Date().getDate() + '' ).padStart(2, '0'))
    return {
      // tableData每个row的值
      rowData: {},
      preStatus: false,
      // 总数量
      total: 5,
      formSearch: {
        // 搜索的表单
        foreignState: "",
        meetingName: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      foreignStates:[
        {
          label: "开放",
          value: "1"
        },
        {
          label: "不开放",
          value: "0"
        },
      ],
      // 表格的数据
      tableData: [],
      meetingId: "",
      nowStarTime: today,
      nowEndTime: today,
      addFormStatus:false,
      meetingId:"",
      meetingObj:{}
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    onInfo(data) {
      this.meetingObj = data
      this.meetingId = data.id
      this.addFormStatus = true;
    },
    // 新增会议室弹窗
    onAdd(){
      this.addFormStatus = true;
    },
    // 新增会议室表单
    addFormStatusDialog(){
      this.addFormStatus = false;
    },
    // 取消
    onCancel(form){
      if(this.$refs[form] !== undefined){
        this.$refs[form].resetFields();
      }
      this.addFormStatus = false
    },
    //  获取列表信息
    getTableData() {
      getMeetingList(this.formSearch).then(res => {
          this.tableData = res.data.data;
          this.formSearch.pageNum = res.data.pageNum;
          this.formSearch.pageSize = res.data.pageSize;
          this.formSearch.total = res.data.total;
      });
    },
    // 搜索列表信息
    onSearch() {
      this.getTableData();
    },
    onReset() {
      this.formSearch.pageNum = 1,
      this.formSearch.pageSize = 10
      this.$refs.formSearch.resetFields()
      this.getTableData();
    },
    // table分页
    tableCurrentChange(val){
        this.formSearch.pageNum = val.page;
        this.getTableData(this.formSearch);
    },
  }
};
</script>

<style scoped>
.content-bottom {
  margin-bottom: 20px;
}
 ::v-deep.el-table.el-table--fit{
  overflow: hidden;
}
::v-deep .el-dialog__body{
  padding-top:10px;
}
.btnBox{
    display: block;
    margin: 20px 0;
    text-align: right;
  }
</style>
