<template>
  <el-row :gutter="20">
    <!--部门数据-->
    <el-col :span="6">
      <div class="head-container">
        <el-input
          v-model="deptName"
          placeholder="请输入部门名称"
          clearable
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
      </div>
      <div class="head-container" style="height: 550px; overflow-y: scroll">
        <el-tree
          :data="deptOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="tree"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </div>
    </el-col>
    <!--用户数据-->
    <el-col :span="18">
      <!-- <el-form :model="queryParams" ref="queryForm" :row-key="(row) => { return row.userId }" :inline="true" v-show="showSearch" label-width="68px" style="display: flex;">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名"
            clearable
            style="width: 140px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            style="width: 140px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form> -->

      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="userList"
        @select="handleSelectionChange"
        height="600"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          label="用户名"
          align="center"
          key="name"
          prop="name"
          v-if="columns[1].visible"
          width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="昵称"
          align="center"
          key="nickName"
          prop="nickName"
          v-if="columns[2].visible"
          width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="部门"
          align="center"
          key="userName"
          prop="userName"
          v-if="columns[3].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="手机号码"
          align="center"
          key="phonenumber"
          prop="phonenumber"
          v-if="columns[4].visible"
          width="100"
        />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-col>
  </el-row>
</template>

<script>
import {
  listUser,
  deptTreeSelect,
  getRoleList,
  getUserList,
} from "@/api/system/user";

export default {
  name: "comDeptUser",
  dicts: ["sys_normal_disable", "sys_user_sex"],
  props: {
    // 是否单选
    isMultipSelect: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "name",
        id: "roleId",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
        enum_user_role: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名`, visible: true },
        { key: 2, label: `昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
      tempDeptUser: [],
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    // this.getList();
    // this.getDeptTree();
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化数据
    init() {
      this.getDeptTree();
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getUserList(this.queryParams).then((response) => {
        this.userList = response.rows;
        // this.total = response.total;
        this.loading = false;
        if (this.tempDeptUser.length) {
          var rowids = this.tempDeptUser.map((item) => item.userId);
          this.$nextTick(() => {
            this.userList.forEach((item) => {
              if (rowids.includes(item.userId)) {
                this.$refs.multipleTable.toggleRowSelection(item);
              }
            });
          });
        }
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      getRoleList({}).then((response) => {
        let temp = [{ children: response.data, id: "1", name: "民科园" }];
        // this.deptOptions = response.data;
        this.deptOptions = temp;
        this.getList();
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.enum_user_role = data.roleId;
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: [],
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection, row) {
      if (!this.isMultipSelect) {
        if (selection.length) {
          this.ids = selection.map((item) => {
            return {
              name: item.name,
              userName: item.name,
              userId: item.userId,
              phoneNum: item.phoneNum,
              userPhone: item.phoneNum,
            };
          });
          this.tempDeptUser = this.filterArr([
            ...this.tempDeptUser,
            ...this.ids,
          ]);
        } else {
          this.tempDeptUser = this.tempDeptUser.filter(
            (item) => item.userId !== row.userId
          );
        }
      } else {
        if (selection.length > 1) {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(selection.pop());
        } else {
          if (selection.length) {
            this.ids = [row.userId];
            this.tempDeptUser = [row.userId];
          }
        }
      }
      this.$emit("selectClick", this.tempDeptUser);
      // this.bill_id = row.id;
      //  // 清除 所有勾选项
      //  this.$refs.multipleTable.clearSelection()
      //  // 当表格数据都没有被勾选的时候 就返回
      //  // 主要用于将当前勾选的表格状态清除
      //  if(selection.length == 0) return
      //  this.$refs.multipleTable.toggleRowSelection(row, true);
    },
    filterArr(arr) {
      var obj = {};
      arr = arr.reduce(function (a, b) {
        obj[b.userId] ? "" : (obj[b.userId] = true && a.push(b));
        return a;
      }, []);
      return arr;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-form-item--small.el-form-item {
  display: flex;
}
::v-deep .el-table__header-wrapper {
  .el-checkbox__inner {
    display: none;
  }
}
</style>
