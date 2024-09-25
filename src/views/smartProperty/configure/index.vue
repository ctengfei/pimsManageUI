<template>
  <div class="app-container">
    <div>
      <el-form inline>
        <el-form-item label="费用名称">
          <el-input v-model="formSearch.name" placeholder="请输入费用名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
          <el-button plain icon="el-icon-refresh" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
           @click="openDialog()"
          >新增</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" height="640">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="费用名称"></el-table-column>
        <el-table-column prop="code" label="费用编码"></el-table-column>
        <el-table-column prop="unitPrice" label="单价"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="description" label="费用描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="openDialog(scope.row)" type="text">编辑</el-button>
            <el-button @click="onDelete(scope.row)" type="text" style="color: #ff403d">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <el-dialog
      :title="title"
      :visible.sync="feeDialog"
      width="320px"
     
    >
      <el-row>
        <el-form labelWidth="80px" :model="addFee" :rules="rules" ref="addFees">
        <!--<el-col>
            <el-form-item label="费用名称" prop="name">
              <el-input v-model="addFee.name"></el-input>
            </el-form-item>
          </el-col>-->
          
          <el-col>
            <el-form-item label="费用类型" prop="code">
              <!--<el-input v-model="addFee.code"></el-input>-->
              <el-select v-model="addFee.code" placeholder="请选择费用类型" style="width: 100% ">
                <el-option v-for="item in ExpenseType" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="费用单价" prop="unitPrice">
              <el-input v-model="addFee.unitPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="费用单位" prop="unit">
              <el-input v-model="addFee.unit"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="费用描述" prop="description">
              <el-input type="textarea" :rows="3" v-model="addFee.description"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" style="text-align: right">
        <el-button type="primary" @click="submit()">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {initTabData, searchByName, addFee, deleteFee, editFee} from '@/api/smartProperty/configure'

  export default {
    name: "/configure",
    data() {
      return {
        ExpenseType:[
          {
            value: 'PROPERTY_SERVICE_FEE',
            label: '物业费'
          },
          {
            value: 'WATER_FEE',
            label: '水费'
          },
          {
            value: 'GAS_FEE',
            label: '燃气费'
          },
          {
            value: 'ELECTRICITY_BILL',
            label: '电费'
          },
          {
            value: 'RENT_FEE',
            label: '房租'
          },
        ],
        formSearch: {
          name: ''
        },
        tableData: [],
        title: '',
        feeDialog: false,
        addFee: {
          name: '',
          code: '',
          unitPrice: '',
          unit: '',
          description: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入费用名称', trigger: ['blur', 'change']}
          ],
          code: [
            {required: true, message: '请选择费用类型', trigger: ['blur', 'change']}
          ],
          unitPrice: [
            {required: true, message: '请输入费用单价', trigger: ['blur', 'change']},
          ],
          unit: [
            {required: true, message: '请输入费用单位', trigger: ['blur', 'change']},
          ],
        },
      }
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      getTableData() {
        let obj = {url: "/pm/property/feeItem", method: "GET"};
        let url = obj.url;
        let method = obj.method;
        initTabData(url, method).then(res => {
          
            this.tableData = res.data;
          
        }).catch(err => {
          this.$message.error(err);
        })
      },
      // 新增或编辑
      openDialog(data = false) {
        this.title = !data ? '新增' : '编辑';
        if (data) {
          this.addFee.name = data.name;
          this.addFee.code = data.code;
          this.addFee.unitPrice = data.unitPrice;
          this.addFee.unit = data.unit;
          this.addFee.description = data.description;
          this.addFee.id = data.id;
        }
        this.feeDialog = true;
      },

      //  重置新增/编辑表单
      resetForm(formName) {
        this.feeDialog = false;
        this.$refs[formName].resetFields()
        this.addFee = {
          name: '',
          code: '',
          unitPrice: '',
          unit: '',
          description: ''
        };
      },
      onSearch() {
        let name = this.formSearch.name;
        let obj = {url: "/pm/property/feeItem/query/name", method: "GET"};
        let url = obj.url;
        let method = obj.method;
        searchByName(url, method, name).then(res => {
          
            this.tableData = res.data;
          
        }).catch(err => {
          this.$message.error(err);
        });
      },
      onDelete(data) {
        let id = data.id;
        let obj = {url: "/pm/property/feeItem/delete/{id}", method: "DELETE"};
        this.$confirm(`您确定删除该条数据? 删除后将无法恢复！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFee(obj.url, obj.method, id).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.getTableData();
            } else {
              this.$message.error("删除失败")
            }
          }).catch(err => {
            this.$message.error(err.message)
          })
        })
      },
      submit() {
        this.$refs.addFees.validate((valid) => {
          if (valid) {
            if (this.title == "新增") {
              let obj = {url: "/pm/property/feeItem/add", method: "POST"};
              addFee(obj.url, obj.method, this.addFee).then(res => {
                if (res.code === 200) {
                  this.$message.success('添加成功');
                  this.feeDialog = false;
                  this.getTableData();
                } else {
                  this.$message.error("添加失败")
                }
              }).catch(err => {
                this.$message.error(err.message)
              })
            } else if (this.title === "编辑") {
              let obj = {url: "/pm/property/feeItem/update", method: "PUT"};
              editFee(obj.url, obj.method, this.addFee).then(res => {
                if (res.code === 200) {
                  this.$message.success('编辑成功');
                  this.feeDialog = false;
                  this.getTableData();
                } else {
                  this.$message.error("编辑失败")
                }
              }).catch(err => {
                this.$message.error(err.message)
              })
            }

          }
        })

      },
      cancel() {
        this.resetForm('addFees');
      },

      onReset() {
        this.formSearch = {
          name: '',
        };
        this.getTableData();
      },

    }
  }
</script>

<style lang="scss" scoped>

  ::v-deep.el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }
</style>
