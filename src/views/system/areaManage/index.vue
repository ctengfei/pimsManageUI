<template>
  <div class="app-container">
    <el-button  type="primary" plain icon='el-icon-plus'  @click="btnAdd" style="margin-bottom:10px">新增</el-button>
    <!--表单组件-->
      <el-dialog class="dialog-table" append-to-body :before-close="cancelCU" :visible.sync="isshow" :title="titleName" width="600px">
        <el-form ref="form" :model="addForm" :inline="true" :rules="rules" label-width="80px">
          <el-form-item label="上级名称" prop="pid">
            <el-cascader ref='myCascader'  placeholder="请选择上级名称" v-if="dialogVisibleType==='add'" :options="parentName" v-model="addForm.pid" style="width: 100%" :props="defaultName" @change='changeProjectForm'></el-cascader>
            <el-cascader ref='myCascader' placeholder="请选择上级名称" v-else :options="selectData" v-model="addForm.pid" style="width: 100%" :props="defaultName" @change='changeProjectForm' ></el-cascader>
          </el-form-item>
          <el-form-item label="节点名称" prop="name">
            <el-input v-model="addForm.name" placeholder="请输入节点名称"/>
          </el-form-item>
          <el-form-item label="业务类型" prop="treeTypeSet" :rules="[ { required: true, message: '请选择业务类型', trigger: ['blur', 'change'] } ]">
            <el-select
              v-if="dialogVisibleType==='edit'"
              v-model="treeTypeSetData"
              multiple
              value-key="id"
              collapse-tags
              @change="getTypeAdd"
              :props='defaultNameType'
              @visible-change='selectParentType'
              placeholder="请选择业务类型">
              <el-option
                v-for="item in serviceData"
                :key="item.type"
                :label="item.type"
                :value="item.type">
              </el-option>
            </el-select>
            <el-select
              v-else
              v-model="treeTypeSetData"
              multiple
              collapse-tags
              value-key="id"
              :props='defaultNameType'
              @change="getTypeAdd"
              @visible-change='selectParentType'
              placeholder="请选择业务类型">
              <el-option
                v-for="item in serviceData"
                :key="item.type"
                :label="item.type"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="节点编号" prop="code">
            <el-input v-model="addForm.code" placeholder="请输入节点编号"/>
          </el-form-item>
          <el-form-item label="楼层编号" prop="gisLayerCode">
            <el-input v-model="addForm.gisLayerCode" placeholder="楼栋-楼层，如：1-1"/>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="addForm.longitude" placeholder="请选择经度" @focus="ChooseDialog"/>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="addForm.latitude" placeholder="请选择纬度" @focus="ChooseDialog"/>
          </el-form-item>
        </el-form>
        <div slot="footer">
           <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button plain @click="cancelCU">取消</el-button>
        </div>
    </el-dialog>
     <div style="height:calc(100vh - 200px)">
        <el-table
              :data="tableData"
              row-key="id"
              ref="tableRef"
              highlight-current-row
              :tree-props="{children: 'children'}"
              :expand-row-keys="['1']"
              >
              <el-table-column
                prop="name"
                show-overflow-tooltip
                label="节点名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="业务类型">
                <template slot-scope="scope">
                  {{scope.row.treeTypeSet.toString()}}
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建日期">
              </el-table-column>
              <el-table-column
                prop="updateTime"
                label="修改日期">
              </el-table-column>
              <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-edit" @click="onEdit(scope.row)">编辑</el-button>
                  <el-button type="text" icon="el-icon-delete" @click="onDel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
        </el-table>
      </div>
      <el-dialog
      width="90%"
     
      title="选择经纬度"
      :visible.sync="ChooseDialogShow"
    >
      <point-map
        ref="gisMap"
        @map-location="maplocation"
      ></point-map>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" @click="mapadd">添加</el-button>
        <el-button @click="mapcancel" plain>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treeData , areaAll , areaAllType } from '@/api/system/areaManage'
import {toArr,queryTree} from '@/utils/index'
import { setTimeout } from 'timers';
import pointMap from "@/components/common/map/point-map";
export default {
    name:'',
    components:{ pointMap },
    data() {
        return {
          // 上级名称
          parentName:[],
          isshow:false,
          titleName:'新增',
          dialogVisibleType : 'add',
          // tableData每个row的值
          //表格数据
          tableData:[],
           // 校验
            rules: {
              name: [
                { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
              ],
              code: [
                { required: true, message: '请输入节点编号', trigger: ['blur', 'change'] }
              ],
              longitude: [
                { required: true, message: '请选择经度', trigger: ['blur', 'change'] }
              ],
              latitude: [
                { required: true, message: '请选择纬度', trigger: ['blur', 'change'] }
              ],
            },
          addForm:{
            name:'',
            id:'',
            pid:'',
            code: '',
            gisLayerCode: '',
            longitude: '',
            latitude: '',
            treeTypeSet:[]
          },
          defaultName:{
            label:'name',
            value:'id',
            children:'children',
            checkStrictly: true
          },
          defaultNameType:{
            label:'name',
            value:'type',
          },
          selectData:[],
          // 业务类型数据
          serviceData:[],
          // 获得的业务类型名称
          treeTypeSetData:[],
          treeTypeGetData:[],
          // 业务类型的编号
          treeType:[],
          // 获取上级名称的某个数据
          severparentType:[],
          severparentName:[],
          childType:[],
          queryName: '',
        ChooseDialogShow: false,
        latitudearr: []
      }
    },
    mounted(){
      this.initData();
      this.getTypeData()
    },
    methods:{
      getType(row){
        this.treeTypeSetData=row
      },
      getTypeAdd(row){
        this.addForm.treeTypeSet=this.transOptionType(row)
      },
      initData(){
       this.treeData()
      },
      treeData(){
        let obj = {
          url: '/pm/tree/node',
          method: 'GET'
        };
        let parmas  = {
          nodeType:'DIR',
        }
        treeData(obj.url,obj.method,parmas).then(res=>{
          this.tableData=res.data
          this.parentName =this.dealData(res.data)
        })
      },
      dealData(arr){
        let newVal = []
        newVal = arr.map(item => {
          if(item.children.length){
            this.dealData(item.children)
          }else {
            delete item.children
          }
          return item
        })
        return newVal
      },
      search() {
        if (this.queryName) {

        }
      },
      reset(){
        this.queryName = ''
        this.treeData()
      },
      //name转type
      transOptionType(data){
        let arr = []
        this.serviceData.forEach(item=>{
          for(let i = 0; i < data.length; i++){
            if(item.type == data[i]){
              arr.push(item.name)
            }
          }
        })
        return arr
      },
      //转换option值
      transOptionData(data){
        let arr = [];
        data.forEach(item=>{
          let obj = {};
          obj.type = item.name;
          obj.name = item.type;
          arr.push(obj)
        });
        return arr
      },
      // 过滤平级数组中和val相同的对象及val子集
      filterChildren(val,newArr){
        var arrNew=[];
        newArr.forEach(item=>{
          if(item.pid!==val.id&&item.id!==val.id){
            arrNew.push(item)
          }
        })
        return arrNew
      },
      changeProjectForm(){
        let n=this.$refs.myCascader.getCheckedNodes()[0].data
        this.addForm.pid=n.id
        this.treeTypeSetData=[]
        this.severparentType=this.$refs.myCascader.getCheckedNodes()[0].data.treeType.split(',')
        this.severparentName=this.$refs.myCascader.getCheckedNodes()[0].data.treeTypeSet

        this.getTypeData()
        if(this.severparentType.length===this.serviceData.length){
          this.getTypeData()
        }else{
          setTimeout(()=>{
            let result = [];
            for(let index in this.severparentName){
                result.push({type: this.severparentName[index], name: this.severparentType[index]});
            }
            this.serviceData=result
          },500)

        }

      },
      selectParentType(data){
        if(data===true){
          this.array=[]
          let n=toArr(this.selectData)
          n.forEach(item=>{
            if(this.addForm.pid===item.id){
              this.severparentType=item.treeType.split(',')
              this.severparentName=item.treeTypeSet
              for(var index in this.severparentName){
                let data = this.serviceData.filter(res=>{
                  return res.type == this.severparentName[index]
                });
                this.array.push(data[0]);
              }
              for(let j=0;j<this.array.length;j++){
                let num = this.array[j].name;
                this.array[j].name = this.array[j].type;
                this.array[j].type = num;
              }
              let datas = this.transOptionData(this.array)
              this.serviceData = datas;

            }
          })
          if(this.addForm.pid===0){
            this.getTypeData()
          }
        }
      },
      btnAdd(){
        this.dialogVisibleType='add'
        this.titleName='新增'
        this.isshow = true
        this.addForm.id=''
        this.getTypeData()
      },
      onEdit(data){
        this.getTypeData()
         this.isshow = true
         this.selectData=JSON.parse(JSON.stringify(this.parentName))
         let n=toArr(this.selectData)
         let newArr=this.filterChildren(data,n)
         this.selectData=queryTree(newArr)
         this.dialogVisibleType='edit'
         this.titleName='编辑'
         this.currentId=data.id
         this.$nextTick(() => {
          this.addForm.pid=data.pid
          this.addForm.name=data.name
          this.addForm.code = data.code
          this.addForm.gisLayerCode = data.gisLayerCode
          this.addForm.longitude = data.longitude
          this.addForm.latitude = data.latitude
          this.addForm.treeTypeSet=data.treeType ? data.treeType.split(',') : ''
          this.treeType=data.treeType ? data.treeType.split(',') : ''
          this.treeTypeSetData= data.treeTypeSet.length ? data.treeTypeSet.filter(Boolean) : []
         })
      },
      ChooseDialog(){
        this.ChooseDialogShow = true
        this.$nextTick(() => {
          if(this.addForm.longitude && this.addForm.latitude){
            this.$refs.gisMap.clearLayer();
            const arr = [
                {
                    src: require("@/assets/images/mapImg/position.png"),
                    coord: [+this.addForm.longitude,+this.addForm.latitude],
                },
            ];
            this.$refs.gisMap.addMarket(arr, "position");
          }
        })
      },
      onDel(id){
        this.$confirm(`确定要删除该区域吗?`, '提示', {
         confirmButtonText: '确定',
        confirmButtonClass:'el-icon-check',
        cancelButtonText: '取消',
        cancelButtonClass:'el-icon-close',
        type: 'warning'
      }).then(() => {
        let obj = {
          url: '/pm/tree/node',
          method: 'DELETE'
        };
        let ids={
          id:id
        }
        treeData(obj.url,obj.method,ids).then(res=>{
          this.$message({
          message: '删除成功',
          type: 'success'
          })
          this.initData()
        }).catch(err => {
            this.$message.error(err)
          })
        }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      },
      getTypeData(){
        let obj = {
          url: '/pm/tree/type',
          method: 'GET'
        };
        areaAllType(obj.url,obj.method).then(res=>{
          this.serviceData = this.transOptionData(res.data)
        })
      },
      onSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.dialogVisibleType === 'add'){
              let obj = {
                url: '/pm/tree/node',
                method: 'POST'
              };
              let data  = {
                pid: this.addForm.pid,
                name:this.addForm.name,
                type:'DIR',
                sort:0,
                treeTypeSet:this.addForm.pid===0?this.serviceData:this.transOptionType(this.treeTypeSetData),
                code: this.addForm.code,
                gisLayerCode: this.addForm.gisLayerCode,
                longitude: this.addForm.longitude,
                latitude: this.addForm.latitude
              }
              areaAll(obj.url,obj.method,data).then(res=>{
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.initData()
                this.cancelCU()
              })
            }else{
              let obj = {
                url: '/pm/tree/node',
                method: 'PUT'
              };
              let data  = {
                pid: this.addForm.pid>0?this.addForm.pid:0,
                id:this.currentId,
                name:this.addForm.name,
                type:'DIR',
                sort:0,
                code: this.addForm.code,
                gisLayerCode: this.addForm.gisLayerCode,
                longitude: this.addForm.longitude,
                latitude: this.addForm.latitude,
                treeTypeSet:this.transOptionType(this.treeTypeSetData)
              }
              areaAll(obj.url,obj.method,data).then(res=>{
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.initData()
                this.cancelCU()
                this.isshow = false
              })
            }
          }
        })
      },
      cancelCU() {
        this.isshow = false
        this.$refs.form.resetFields()
        this.treeTypeSetData=[]
      },
      maplocation(e) {
        this.latitudearr=e;
        this.$refs.gisMap.clearLayer();
        const arr = [
            {
                src: require("@/assets/images/mapImg/position.png"),
                coord: [e[0],e[1]],
            },
        ];
        this.$refs.gisMap.addMarket(arr, "position");
      },
      mapadd(){
        this.addForm.longitude = this.latitudearr[0]
        this.addForm.latitude = this.latitudearr[1]
        this.mapcancel()
      },
      mapcancel(){
        this.ChooseDialogShow = false;
      }
    },
}
</script>

<style lang="scss" scoped>
::v-deep .current-row{
  /* color:#fff; */
  background:#474b6b !important;
}
::v-deep.el-table.el-table--fit {
  overflow: hidden;
}

::v-deep .el-form-item--small.el-form-item {
  width: 100%;
  display: flex;
  .el-form-item__content {
    flex: 1;
    .el-select {
      width: 100%;
    }
  }
}

#iGisMap {
  height: calc(100vh - 300px);
}
</style>
