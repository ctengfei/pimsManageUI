<template>
  <div class="app-container-bow">
    <el-row :gutter="20">
    <el-col :xl="4" :lg="6" :sm="7" :xs="24">
    <div class="video-web-left-box">
      <div>
        <div class="video-web-left-area">
          <div class="video-web-flex">
            <div class="addGroupBtn" @click="openGroupDialog()">
              <span>车辆分组</span>
            </div>
          </div>

          <div class="group-area">
            <el-tree
              class="treeitems"
              :data="groups"
              node-key="id"
              :props="defaultProps"
              lazy
              highlight-current
              :current-node-key="currentnodekey"
              :default-expanded-keys="expandList"
              @node-click="handleNodeClick"
              ref="tree"
              @node-expand="nodeExpand"
              @node-collapse="nodeCollapse"
            >
              <span
                class="custom-tree-node"
                slot-scope="{ node, data }"
                style="width: 100%; color: #afb9d0"
              >
                <span>{{ node.label }}</span>
                <span style="float: right">
                  <!-- 根节点不需要删除和重命名  return item.code == "White" || item.code == "Black";-->
                  <i
                    v-if="data.code == 'White' || data.code == 'Black'"
                    @click="() => addGroupDialog(node, data)"
                    class="el-icon-plus"
                  ></i>
                  <span v-else>
                    <i
                      @click="() => deleteGroupDialog(node, data)"
                      class="el-icon-delete"
                    ></i
                    ><!--删除分组-->
                    <i
                      v-if="data.code != 'White' || data.code != 'Black'"
                      @click="() => editGroupDialog(node, data)"
                      class="el-icon-edit"
                    ></i
                    ><!--重命名分组-->
                  </span>
                </span>
              </span>
            </el-tree>
           
          </div>
        </div>

        <!--分组添加车辆dialog-->
        <el-dialog
          :title="groupDialogTitle"
         
          :visible.sync="groupDialogShow"
          width="25%"
        >
          <el-form
            label-width="80px"
            ref="groupRuleForm"
            :model="groupRuleForm"
            :rules="groupRules"
            v-if="showSearch"
          >
            <el-form-item label="车辆分组" prop="name">
              <el-input
                v-model="groupRuleForm.name"
                placeholder="请输入车辆分组名"
              ></el-input>
            </el-form-item>
            <el-form-item label="分组编码" prop="code">
              <el-input
                :disabled="groupDialogTitle == '编辑'"
                v-model="groupRuleForm.code"
                placeholder="请输入分组编码"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" style="text-align: center">
            <el-button
              icon="el-icon-check"
              @click="saveGroup(groupRuleForm)"
              >保存
            </el-button>
            <el-button
              icon="el-icon-close"
              @click="onReset('groupRuleForm')"
              >取消
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </el-col>
    <el-col :xl="20" :lg="18" :sm="17" :xs="24">
    <div class="video-web-right-box padding-20" style="padding: 10px 10px;">
      <el-form
        ref="formSeach"
        :inline="true"
        :model="formSeach"
        class="demo-form-inline"
      >
        <el-form-item prop="ownerName" label="车主姓名">
          <el-input
            v-model="formSeach.ownerName"
            placeholder="请输入车主姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="carPlate" label="车牌">
          <el-input
            v-model="formSeach.carPlate"
            placeholder="请输入车牌"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="onSearch"
            >搜索
          </el-button>
          <el-button
            icon="el-icon-refresh-left"
            @click="onReset('formSeach')"
            >重置
          </el-button>
        </el-form-item>
        <!-- <el-form-item style="float: right; margin-right: 0">
          <el-button plain icon="el-icon-plus" type="primary"  @click="btnAdd">添加</el-button>
          <el-button
            plain
            :disabled="!checkItemAll.length"
            @click="btnDelete"
            >批量移除
          </el-button>
        </el-form-item> -->
      </el-form>
      <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
          <el-button  
              icon="el-icon-plus" 
              plain 
              type="primary" 
              @click="btnAdd()"
            >添加</el-button>
            <el-button
            plain
            type="danger"
            icon="el-icon-delete"
            :disabled="!checkItemAll.length"
            @click="btnDelete"
            >批量移除
          </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="init"></right-toolbar>
        </el-row>
      <div style="height: calc(100% - 150px)">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="车牌号码"
            prop="carPlate"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="车主姓名"
            prop="ownerName"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="车主手机号"
            prop="ownerPhone"
          >
          </el-table-column>
          <el-table-column
            label="所属分组"
            show-overflow-tooltip
            prop="groupCode"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作人" prop="creator">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="操作时间"
            prop="createTime"
          >
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                @click="onDelete(scope.row)"
                type="text"
               
                style="color: #f05656"
                >移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <pagination
            v-show="tableData && tableData.length > 0"
            @pagination="handleCurrentChange"
            :page.sync="pageNum"
            :pageSizes="[10, 20, 30, 40]"
            :limit.sync="pageSize"
            :total="total"
          />
        </div>
      </div>
    </div>
  </el-col>
    </el-row>
    <!--分组添加车dialog-->
    <el-dialog
      title="添加"
      :visible.sync="addCarDialogShow"
      :before-close="closeAddPersonDialog"
      width="50%"
      :show-close="false"
    >
      <div class="peopleSearch">
        <!-- 搜索 -->
        <el-row>
          <el-form inline :model="formSearch" ref="formSearch">
            <el-form-item prop="carNumber">
              <el-input
                v-model="formSearch.carNumber"
                clearable
                placeholder="请输入车牌号"
              ></el-input>
            </el-form-item>
            <el-form-item prop="carOwner">
              <el-input
                v-model="formSearch.carOwner"
                clearable
                placeholder="请输入车主姓名"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                @click="search()"
                type="primary"
                >搜索</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-refresh-left"
                @click="reset('formSearch')"
                plain
                >重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <el-table
        :data="carData"
        @selection-change="handlecarSelectionChange"
        maxHeight="450"
      >
        <el-table-column type="selection" width="50" align="left" />
        <el-table-column prop="carPlate" label="车牌号" />
        <el-table-column prop="ownerName" width="100" label="车主姓名" />
        <el-table-column prop="ownerPhone" label="车主手机号" />
        <el-table-column prop="synchronizeTime" label="更新时间" />
      </el-table>
      <!-- 分页 -->
      <div class="content-bottom">
        <pagination
          v-show="carData && carData.length > 0"
          :page.sync="formSearch.pageNum"
          :total="total"
          :limit.sync="formSearch.pageSize"
          :pageSizes="[10, 20, 30]"
          @pagination="handleCurrentChanges"
          @size-change="handleSizeChange"
        />
      </div>
      <div slot="footer" style="text-align: center">
        <el-button @click="onSubmit()" type="primary"
          >添加</el-button
        >
        <el-button @click="cancel()" plain
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PersonelVehicleUnit from "@/components/PersonelVehicleUnit";
import {
  getCarGroup,
  getQueryByPage,
  getCarByPage,
  deleteCarContent,
  deleteCar,
  getAddCarList,
} from "@/api/carManage/listManage.js";
import pagination from "@/components/comPagination";
import { getObjByKey, getStringByKey } from "@/utils/voice.js";
import { getcarInfo } from "@/api/carManage/carInfo";
import { getDicts, add, del } from "@/api/system/dict";

export default {
  name: "ListManage",
  components: {
    PersonelVehicleUnit,
    pagination,
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "leaf",
      },
      isType: "车辆",
      groupType: "CAR_GROUP_DICT:71042",
      jobTitleList: [],
      permission: {
        getCarGroup: "carManage::listManage::getCarGroup",
        delCarGroup: "carManage::listManage::delCarGroup",
        //          添加车辆分组
        addCarGroup: "carManage::listManage::addCarGroup",
        //          分组添加车
        addCar: "carManage::listManage::addCar",
        getQueryByPage: "carManage::listManage::getQueryByPage",
        searchInfo: "carManage::carInfo::searchInfo",
        search: "system::dict::searchpage",
        getByTypeCode: "system::dict::tablerow",
        add: "carManage::listManage::addgroups",//修改
        edit: "carManage::listManage::edit",//修改
        del: "carManage::listManage::del",//修改
        searchCar: "carManage::listManage::search",
        addcarlist: "carManage::listManage::add",
        deleteCarContent: "carManage::listManage::deleteCarContent",
      },
      formSeach: {
        // 搜索的表单
        carPlate: "",
        groupCode: "",
        ownerName: "",
        pageNum: 1,
        pageSize: 10,
        type: "",
      },
      formSearch: {
        carNumber: "",
        carOwner: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 新增的表单
      addform: {
        carNumber: "", // 车牌
        carOwner: "", // 车主
        carGroup: "", // 分组
      },
      confirmTitle: "添加车辆分组",
      form: {
        name: "",
      },
      // 表格的数据
      tableData: [],
      // 缩略图的全选
      checkAll: false,
      // 全选的状态
      isIndeterminate: true,
      // 勾选每一个
      showSearch:true,
      multipleArr:[],
      checkItemAll: [],
      checkCarAll: [],
      // 分页
      pageNum: 1,
      pageNums: 1,
      // 每页显示的条数
      pageSize: 10,
      pageSizes: 10,
      // 总数量
      total: 0,
      // 车辆的所有信息
      carData: [],
      addCarDialogShow: false,
      groups: [],

      groupDialogTitle: "",
      groupDialogShow: false,
      groupRuleForm: {
        name: "",
        code: "",
      },
      groupRules: {
        name: [{ required: true, message: "组名不能为空", trigger: "blur" }],
        code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
      },
      show: false,
      isShow: 999,
      searchData: {
        pageNum: 1,
        pageSize: 1000,
      },
      currentCode: "",
      currentType: "White",
      first: true,
      expandList: [],
      currentnodekey: ""
    };
  },

  created() {
    this.init()
  },
  mounted() {
    //this.init();
  },

  methods: {
    // table多选
    multipleChange(val){
        let temp = val.map(item=>{
          return {alarmCode:item.code,closeReason:""}
        })
        this.multipleArr = temp
      },
    //懒加载
    nodeExpand(data) {
      this.expandList.push(data.id);
    },
    nodeCollapse(data) {
      this.expandList.splice(this.expandList.indexOf(data.id), 1);
    },
    handleNodeClick(v) {
      this.currentCode = v.code;
      if (v.code == "White" || v.code == "Black") {
        this.currentType = v.code;
      }
      this.infoData();
    },

    init() {
      getDicts('/sys/dict/type/page', 'get', this.searchData).then((res) => {
        if (res.code === 200) {
          let datas = res.data.data.filter((item) => {
            return item.code == "White" || item.code == "Black";
          });
          for (let i in datas) {
            datas[i].children = [];
            datas[i].level = 1;
          }
          this.groups = datas;
          this.getCarGroupList();
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
    showIndex(index) {
      if (!this.first) {
        if (this.isShow == index) {
          this.isShow = null;
          this.show = !this.show;
        } else {
          this.isShow = index;
        }
      } else {
        this.isShow = null;
        this.first = false;
      }
    },
    // 获取左侧组列表，树结构
    getCarGroupList() {
      for (let i = 0; i < this.groups.length; i++) {
        let data = {
          pageNum: 1,
          pageSize: 100,
          dictTypeCode: this.groups[i].code,
        };
        getDicts('/sys/dict', 'get', data)
          .then((res) => {
            if (res.code === 200) {
              for (let j in res.data.data) {
                // leaf
                res.data.data[j].leaf = true;
                res.data.data[j].level = 2;
                this.groups[i].children.push(res.data.data[j]);
                if (this.first) {
                  this.infoData();
                }
              }
            } else {
              this.groups = [];
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      }
      // this.showIndex(this.isShow);
    },
    // 请求主页车辆信息
    infoData() {
      if (this.first) {
        this.formSeach.type = this.groups[0].code;
        this.$nextTick(() => {
          this.currentnodekey = this.groups[0].id;
          this.$refs.tree.setCurrentKey(this.currentnodekey);
          this.expandList.push(this.currentnodekey);
        });
        this.first = false;
      }
      //let obj = getObjByKey(this.permission.searchCar);
      let data = {
        url: "/sm/car/blackwhite/pageQuery",
        method: "get",
        data: this.formSeach,
      };
      data.data.groupCode =
        this.currentCode == "White" || this.currentCode == "Black"
          ? ""
          : this.currentCode;
      data.data.type = this.currentType;
      getCarByPage(data)
        .then((res) => {
          if (res.code == 200) {
            this.total = res.data.total;
            this.tableData = res.data.data;
          } else {
            this.$message.error(res.meta.message);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 表格的多选
    selectionChange(row) {
      this.checkItemAll = row.map((item) => item.id);
    },
    // 表格里的车辆轨迹按钮跳转页面
    //      onRecord(item) {
    //        this.$router.push({path: '/carManage/carLocus', query: item})
    //      },
    // 修改
    // 单个删除
    onDelete(item) {
      this.$confirm("此操作将从分组中移除该车辆信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [item.id];
        //let obj = getObjByKey(this.permission.deleteCarContent);
        deleteCar('/sm/car/blackwhite/deleteBatch', 'delete', ids)
          .then((res) => {
            if (res.code === 200) {
              this.infoData();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      });
    },
    // 搜索
    onSearch() {
      this.infoData();
    },
    // 重置
    onReset(formName) {
      this.$refs[formName].resetFields();
      this.groupDialogShow = false;
      this.infoData();
    },
    // 右上角的新增按钮
    btnAdd() {
      if(this.currentCode == ""){
        this.$message.warning("请选择子级分组");
      }else {
        this.addCarDialogShow = true;
        this.getcarData();
      }
    },
    // 添加按钮的确认
    onSubmit() {
      if (
        (this.currentType == "White" || this.currentType == "Black") &&
        this.currentCode == ""
      ) {
        this.$message.warning("请选择正确的子级分组");
      } else if (!this.checkCarAll.length) {
        this.$message.warning("请选择车辆加入分组");
      } else {
        //let obj = getObjByKey(this.permission.addcarlist);
        let data = {
          carList: this.checkCarAll,
          groupCode: this.currentCode,
          type: this.currentType,
        };
        getAddCarList('/sm/car/blackwhite/add', 'get', data).then((res) => {
          if (res.code === 200) {
            this.$message("添加成功");
            this.addCarDialogShow = false;
            this.infoData();
          } else {
            this.$message.error(res.meta.message);
          }
        });
      }
    },
    // 添加按钮的取消
    cancel() {
      this.addCarDialogShow = false;
      this.reset("addform");
    },
    // 右上角的批量删除按钮
    btnDelete() {
      this.$confirm("此操作将从分组中移除该车辆信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = this.checkItemAll;
        //let obj = getObjByKey(this.permission.deleteCarContent);
        deleteCar('/sm/car/blackwhite/deleteBatch', 'delete', ids)
          .then((res) => {
            if (res.code === 200) {
              this.infoData();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      });
    },
    // 分页 每页显示的数量
    handleSizeChange(n) {
      this.pageSize = n;
      this.infoData();
    },

    // 切换到第几页了
    handleCurrentChange(n) {
      // this.pageNum = n
      this.infoData();
    },
    handleCurrentChanges(n) {
      // this.pageNum = n
      // this.infoData();
      this.getcarData();
    },
    handlecarSelectionChange(val) {
      this.checkCarAll = val;
    },
    closeAddPersonDialog() {},
    closeGroupDialog() {},
    //  切换当前工作组
    selectGroup(data) {
      if (data.hasOwnProperty("typeCode")) {
        this.currentCode = data.code;
        this.currentType = data.typeCode;
      } else {
        this.currentType = data.code;
        this.currentCode = "";
      }
      //        拿到data里面的分组标识去执行查询方法，需要给表单赋值
      this.infoData();
    },
    addGroupDialog(node, data) {
      this.groupDialogShow = true;
      this.groupDialogTitle = "添加";
      this.currentCode = data.code;
    },
    editGroupDialog(node, data) {
      console.log(data, "dd");
      this.groupDialogShow = true;
      this.groupDialogTitle = "编辑";
      this.$nextTick(() => {
        this.currentCode = data.typeCode;
        this.groupRuleForm.name = data.name;
        this.groupRuleForm.code = data.code;
        this.groupRuleForm.id = data.id;
      });
    },
    deleteGroupDialog(node, data) {
      let obj = getObjByKey(this.permission.del);
      let id = [];
      id.push(data.id);
      this.$confirm("此操作将删除选中车辆分组信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(obj.url, obj.method, id)
          .then((res) => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.init();
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      });
    },
    getcarData() {
      //let obj = getObjByKey(this.permission.searchInfo);
      let data = this.formSearch;
      getcarInfo(data).then((res) => {
        if (res.code === 200) {
          this.carData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    search() {
      this.getcarData();
    },
    reset(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.getcarData();
    },

    saveGroup() {
      let obj =
        this.groupDialogTitle == "添加"
          ? getObjByKey(this.permission.add)
          : getObjByKey(this.permission.edit);
      let data = this.groupRuleForm;
      console.log(this.currentCode, "66");
      data.typeCode = this.currentType;

      if (this.groupDialogTitle == "添加") {
        delete data.id;
      }
      console.log(data, "88");
      add(obj.url, obj.method, data).then((res) => {
        if (res.meta.status === 200) {
          if (this.groupDialogTitle == "添加") {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
          } else {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          }

          this.groupDialogShow = false;
          this.init();
          this.onReset("groupRuleForm");
        } else {
          this.$message.error(res.meta.message);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
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
.video-web-left-box{
 padding: 10px 10px;
}
.addGroupBtn span {
  font-size: 14px;
  font-weight: bold;
  color: #666;
}

.video-web-left-area {
  float: left;
  width: 100%;
  margin-right: 20px;
  height: calc(100vh - 80px);
}

.show {
  display: none;
}
.isShows {
  background-color: #313448;
}
::v-deep.el-tree {
  background: transparent;
}
</style>
