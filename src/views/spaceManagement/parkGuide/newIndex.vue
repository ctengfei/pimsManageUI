<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="区域名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入区域名称"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      :data="controlTableData">
      <el-table-column type="selection" width="55" />
      <el-table-column label="区域名称" show-overflow-tooltip prop="name" />
      <el-table-column label="经度" show-overflow-tooltip prop="longitude" />
      <el-table-column label="纬度" show-overflow-tooltip prop="latitude" />
      <el-table-column label="二维码">
        <template slot-scope="scope">
          <svg-icon icon-class="erweima" style="font-size: 16px;cursor: pointer;" @click.stop="showQrcode(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="handler" label="操作">
        <template slot-scope="scope">
          <el-button @click.stop="handleUpdate(scope.row)" type="text" icon="el-icon-edit"> 编辑</el-button>
          <el-button type="text" @click.stop="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
          <el-button type="text" @click.stop="locationChoose(scope.row)">查看位置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改区域对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="320px" append-to-body :before-close="cancel">
      <el-form :model="cameraForm" label-width="70px" ref="form">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="cameraForm.name" placeholder="请输入区域名称"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="cameraForm.longitude" placeholder="请选择经度" @focus="locationChoose"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="cameraForm.latitude" placeholder="请选择经度" @focus="locationChoose"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <!-- 选择经纬度 -->
    <el-dialog title="选择经纬度" :visible.sync="openDataScope" append-to-body width="1200px">
      <point-map ref="gisMap" @map-location="maplocation"></point-map>
      <div slot="footer">
        <el-button type="primary" @click="submitDataScope">确定</el-button>
        <el-button plain @click="cancelDataScope">取消</el-button>
      </div>
    </el-dialog>
    
    <el-dialog
      title="点位信息"
      :visible.sync="showQrcodeDialog"
      :show-close="false"
      width="320px"
      >
      <div id="qrcode" ref="qrcode" align="center"></div>
      <div slot="footer">
        <el-button type="primary" @click="cancleDialog()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initTabData, addGuide, deleteGuide, editGuide } from "@/api/spaceManagement/parkGuide.js";
import pointMap from "@/components/common/map/point-map";
import QRCode from "qrcodejs2";
export default {
  name: "WarningConfig",
  components: { pointMap },
  data() {
    return {
      // 遮罩层 
      loading: true,
      // 查看二维码
      showQrcodeDialog: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: ''
      },
      // 显示搜索条件
      showSearch: true,
      // 导览数据
      controlTableData: [],
      // 总数量
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false ,
      // 区域详情
      cameraForm: {
        name: "",
        latitude: "",
        longitude: "",
        position: "",
      },
      // 操作类型
      addFormType: '',
      // 经纬度暂存
      locations: [],
      permission: {
        add: {url: '/parkView/parkView', method: 'POST'},
        edit: {url: '/parkView/parkView/', method: 'PUT'},
      },
      address: "http://103.82.227.24:22001/parkview/",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      initTabData('/parkView/parkView/page', 'get', this.queryParams).then(response => {
          this.controlTableData = response.data.data;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.title = "新增区域"
      this.addFormType = 'add'
    },
    /** 修改按钮操作 */
    handleUpdate(item) {
      this.open = true
      this.title = '修改区域'
      this.addFormType = 'edit'
      this.$nextTick(() => {
        this.cameraForm.position = `lat:${item.latitude}、lng${item.longitude}`;
        this.cameraForm = {
          name: item.name,
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
        };
      })
    },
    locationChoose(row){
      this.openDataScope = true
      this.$nextTick(() => {
        if(this.addFormType === 'edit'){
          this.maplocation([+this.cameraForm.longitude,+this.cameraForm.latitude])
        }else if(row.id){
          this.maplocation([+row.longitude,+row.latitude])
        }else {
          if(!this.locations.length){
            this.$refs.gisMap.clearLayer(); 
          }
        }
      })
    },
    maplocation(e) {
      this.locations = e
      this.$refs.gisMap.clearLayer();
      const arr = [
          {
              src: require("@/assets/images/mapImg/position.png"),
              coord: [e[0],e[1]],
          },
      ];
      this.$refs.gisMap.addMarket(arr, "position");
    },
    // 选择经纬度弹窗
    submitDataScope(){
      this.openDataScope = false
      this.cameraForm.latitude = this.locations[1]
      this.cameraForm.longitude = this.locations[0]
    },
    cancelDataScope(){
      this.openDataScope = false
      this.locations = []
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.locations = []
      if(this.$refs.gisMap){
        this.$refs.gisMap.clearLayer();
      }
    },
    // 查看二维码
    cancleDialog() {
      this.showQrcodeDialog = false;
      this.$refs.qrcode.innerHTML = "";
    },
    showQrcode(data) {
      this.currentQrcodeInfo = this.address+'?longitude='+ data.longitude+'&latitude='+data.latitude;
      this.showQrcodeDialog = true;
      this.qrcode();
    },
    qrcode() {
      this.$nextTick(() => {
        let qrcode = new QRCode("qrcode", {
          width: 150,
          height: 150,
          text: this.currentQrcodeInfo, //内容，二维码地址
          colorDark: "#000", //前景色
          colorLight: "#fff", //背景色
        });
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let obj =
          this.addFormType === "edit"
            ? JSON.parse(JSON.stringify(this.permission.edit)) 
            : this.permission.add;
        obj.url =
          this.addFormType === "edit"
            ? obj.url.split("{")[0] + this.cameraForm.id
            : obj.url;
        editGuide(obj.url, obj.method, this.cameraForm).then((res) => {
          if (res.code === 200) {
            if (this.addFormType === "edit") {
              this.$message.success("编辑成功");
            } else {
              this.$message.success("添加成功");
            }
            this.getList();
            this.cancel()
          } else {
            this.$message.error(res.meta.message);
          }
        });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('确定要删除此点位信息吗？').then(() => {
        deleteGuide('/parkView/parkView/{id}', 'delete', row.id).then((res) => {
          if (res.code === 200) {
            this.getList()
            this.$modal.msgSuccess("删除成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      })
    },
  }
};
</script>
<style lang="scss" scoped>
#iGisMap {
  height: calc(100vh - 260px);
}
</style>