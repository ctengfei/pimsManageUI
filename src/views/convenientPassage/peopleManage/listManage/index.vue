<template>
<div class="app-container-bow people-group">
  <el-row>
    <el-col class="left-area">
      <PersonelVehicleUnit :groupType="groupType" :isType="isType" :jobTitleList="jobTitleList" />
    </el-col>
    <el-col class="right-area">
    <div class="ListManage">
    <el-form ref="formSearch" inline :model="formSearch" class="demo-form-inline">
      <el-form-item prop="userName">
        <el-input v-model="formSearch.userName" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phoneNo">
        <el-input v-model="formSearch.phoneNo"  placeholder="请输入手机号" clearable style="max-width: 207px;" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="onSearch">搜索</el-button>
        <el-button plain icon="el-icon-refresh-left" @click="onReset('formSearch')">重置</el-button>
      </el-form-item>
      <el-form-item style="position: absolute;right:5px;">
        <el-button type="primary"  @click="btnAdd">新增</el-button>
        <el-button :disabled="!checkItemAll.length"  @click="btnDelete">批量删除</el-button>
      </el-form-item>
    </el-form>
    <highlight-square class="highlight-height-table">
      <template v-slot:child>
        <el-table
          height="645"
          v-if="tableShow"
          :data="tableData"
          style="width: 100%"
          @selection-change="selectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column v-for="item in tableColumns" :key="item.param"
            :prop="item.param"
            :label="item.label"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span v-if="item.param === 'gender' || item.param ==='documentType' || item.param ==='jobTitle' ||item.param ==='typeCode'">{{item.render(scope.row)}}</span>
            <span v-else>{{scope.row[item.param]}}</span>
          </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="onEdit(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
              <el-button @click="onDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-else>
          <el-checkbox v-if="tableData.length > 0" :indeterminate="isIndeterminate" v-model="checkAll" :disabled="!tableData.length" style="margin-left:25px;" @change="CheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkItemAll" @change="handleCheckedChange">
            <div class="photoBox" v-if="tableData.length">
              <div v-for="item in tableData" :key="item.id" class="photpItem">
                <img :src="item.photo">
                <div class="content">
                  姓名 : {{item.name}} <br>
                  性别 :
                  <span v-if="item.gender=='1'">女</span>
                  <span v-else>男</span>
                  <el-checkbox class="check" :label="item"></el-checkbox>
                </div>
                <div class="clickButton">
                  <el-button @click="onRecord(item)" type="text" icon="el-icon-position" title="人员轨迹" style="color:white;"></el-button>
                  <el-button @click="onEdit(item)" type="text"  icon="el-icon-edit-outline" title="编辑" style="color:white;"></el-button>
                  <el-button @click="onDelete(item)" type="text"  icon="el-icon-delete" title="删除" style="color:white;"></el-button>
                </div>
              </div>
            </div>
            <div class="photoBoxNo" v-else>
              <span class="el-table__empty-text" style="text-align: center;">暂无数据</span>
            </div>
          </el-checkbox-group>
        </div>
        <!-- 分页 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="formSearch.pageNum"
          :limit.sync="formSearch.pageSize"
          @pagination="getPeopleMessage"
        />
      </template>
    </highlight-square>
    <!-- 新增，编辑组件 -->
    <el-dialog
      :title="dialogVisibleType==='add'?'新增':'编辑'"
      :visible.sync="dialogVisible"
      width="45%"
      close-on-press-escape
      destroy-on-close
      close-on-press-escapex
     
      @close="dialogClose"
       class="dialog-table"
      >
      <el-row>
      <el-form ref="addform" :inline="true" :model="addform" :rules="rules" class="demo-form-inline" label-width="100px" >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addform.name" placeholder="请输入姓名" clearable />
          </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="addform.gender" placeholder="请选择性别" clearable>
                <el-option
                  v-for="item in genderList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="手机号" prop="phoneNo">
          <el-input v-model="addform.phoneNo" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="证件类型" prop="documentType">
          <el-select v-model="addform.documentType" placeholder="请选择证件类型" filterable clearable  @change="handleSelectId">
            <el-option v-for="item in idCardList" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="idNumber">
          <el-input v-model="addform.idNumber" placeholder="请输入证件号码" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="车牌号码" prop="carNo">
          <el-input v-model="addform.carNo" placeholder="请输入车牌，多个以英文;分割"></el-input>
        </el-form-item> -->
         <el-form-item label="人员分组" prop="typeCode">
          <el-select v-model="addform.typeCode" placeholder="请选择人员分组" filterable clearable>
            <el-option v-for="item in newTypeList" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="addform.department" placeholder="请选择所属部门" filterable clearable>
            <el-option v-for="item in departmentList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-col :span='24'>
          <el-form-item>
            <p slot="label" style="margin-top: -13px"><i style="color: #f05656;margin-right:5px;">*</i>上传头像</p>
            <upLoadPhoto :putJpeg="putJpeg" @photoUrl="photoUrl" />
          </el-form-item>
           <p v-show="isShowImg" style="color: #f05656;font-size: 10px;margin-left: 108px;">请上传头像</p>
        </el-col>
         <el-col :span='24'>
            <el-form-item label="备注" prop="remarks" style="width:100%;">
            <el-input type="textarea" v-model="addform.remarks" clearable :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
       </el-row>
      <span slot="footer">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button plain @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
    </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import img from '@/assets/401_images/401.gif'
import upLoadPhoto from '@/components/upLoadPhoto/upLoadPhoto.vue'
import pagination from '@/components/comPagination'
import {getConfigController} from "@/api/trafficManage/carRecords";
import {
  getPeopleManageList,
  getMemberType,
  singleDelete,
  batchDeletion,
  newPersonnelList,
  editEdit,
  getSchor,
  getPersonGroup,
  addPersonGroup,
  editPersonGroup,
  deletePersonGroup,
  getPersonGroupById,
  addPeopleToGroup,
  deletePeopleToGroup,
  getGroupAllMember} from '@/api/peopleManage'
import { getObjByKey} from "@/utils/voice.js";
import {getSmallPhoto} from "@/api/imageMange/snapPhotoWall";
import {deepClone} from '@/utils'
// import ConfirmDialog from '@/components/confirmDialog'
import PersonelVehicleUnit from '@/components/PersonelVehicleUnit'
export default {
    name:'ListManage',
    components:{
      upLoadPhoto,
      pagination,
      // ConfirmDialog,
      PersonelVehicleUnit
    },
    data() {
        return {
          isType: '人员',
          groupType: 'PERSON_GROUP_DICT:71041',
          isAbled:true,
          selectedPeopleList: [],
          groupData: {},
          confirmMemberTitle: '关联人员',
          confirmTitle: '添加人员分组',
          dialogWidth: '45%',
          permission:{
            look:"videoMange::snapPhotoWall:look",
            downloadThumbnail: "videoMange::snapPhotoWall:downloadThumbnail",
            getSearchVideo: 'system::group::search',
            delete: 'people::delete',
            batchDelete: 'people::batchdelete',
            list: 'people::list',
            check: 'people::check',
            add: 'people::add',
            department:"trafficManage::visitorManage::department",
            edit: 'people::edit',
            schor:'people::schor',
            search: 'peoplegroup::search',
            addGroup: 'peoplegroup::add',
            editGroup:'peoplegroup::edit',
            batchDeleteGroup: 'peoplegroup::batchdelete',
            deleteGroup: 'peoplegroup::delete',
            relateGroup:'peoplegroupId::searhbyid',
            addpeople: 'groupaddpeople::add',
            deletePeople: 'groupdeletepeople::delete',
            checkAllGroup: 'peopleGroup::checkmember'
          },
          genderList: [
            {
              label: '女',
              value: '1'
            },
            {
              label: '男',
              value: '2'
            }
          ],
          dialogVisible: false, // 弹框
          dialogVisibleType:'add', // 判断是新增还是修改
          tableShow: true, // 表格的展示
          formSearch: { // 搜索的表单
            userName:'',
            phoneNo:'',
            pageNum: 1,
            pageSize: 10
          },
          relateInfo: { // 搜索的表单
            userName:'',
            pageNum: 1,
            pageSize: 10
          },
          time:[],
          // 获取类型接口参数
          queryList: [
            {
              query: {
                pageNum: 1,
                pageSize: 10,
                dictTypeCode: 'person_list_type'
              },
              id: 'P1',
              list: []
            },
            {
              query: {
                pageNum: 1,
                pageSize: 10,
                dictTypeCode: 'document_type'
              },
              id: 'P2',
              list: []
            },
            {
             query: {
                pageNum: 1,
                pageSize: 10,
                dictTypeCode: 'job_title'
              },
              id: 'P3',
              list: []
            },
            {
             query: {
                pageNum: 1,
                pageSize: 10,
                dictTypeCode: 'job_level'
              },
              id: 'P4',
              list: []
            }
          ],
          // 新增的表单
          addform: {
            name: '',
            gender: '',
            phoneNo: '',
            jobNo: '',
            typeCode: '',
            documentType: '',
            idNumber: '',
            carNo: '',
            file:'',
            department: '',
            jobTitle: '',
            jobLevel: '',
            remarks: '',
            email: ''
          },
          putJpeg: null, // 图片路径
          // 校验
          rules: {
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' }
            ],
            gender: [
              { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
            ],
            phoneNo:[
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: this.checkPwd, trigger: "blur" }
            ],
            email: [
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
            typeCode:[
              { required: true, message: '请选择人员分组', trigger: ['blur', 'change'] }
            ],
          },
          // 表格的数据
          tableData: [],
          // 表格的表头
          tableColumns: [
            {
              label: "姓名",
              param: "name",
              width: "auto",
              isTitle: true,
            },
            {
              label: "性别",
              param: "gender",
              width: "auto",
              isTitle: false,
              render: row => {
                if (row.gender == 2) {
                  return '男'
                } else {
                  return '女'
                }
              }
            },
            {
              label: "手机号",
              param: "phoneNo",
              width: "auto",
              isTitle: true,
            },
            {
              label: "所属分组",
              param: "typeCode",
              width: "auto",
              isTitle: true,
                render: row => {
                  let typeStr;
                  this.typeList.map(x => {
                    if (x.code === row.typeCode) {
                      typeStr =  x.name
                    }
                  })
                  return typeStr
              }
            },
            {
              label: "证件类型",
              param: "documentType",
              width: "auto",
              isTitle: true,
              render: row => {
                let str;
                this.idCardList.map(x => {
                  if (x.code === row.documentType) {
                    str = x.name
                  }
                })
                return str
              }
            },
            {
              label: "证件号码",
              param: "idNumber",
              width: "auto",
              isTitle: true,
              render: row => {
              }
            },
            {
              label: "所在部门",
              param: "departmentName",
              width: "auto",
              isTitle: true,
            },
            {
              label: "创建人",
              param: "creator",
              width: "auto",
              isTitle: true,
            },
            {
              label: "创建时间",
              param: "createTime",
              width: "auto",
              isTitle: true,
            },
          ],
          // 缩略图的全选
          checkAll: false,
          // 全选的状态
          isIndeterminate:true,
          // 勾选每一个
          checkItemAll:[],
          // 总数量
          total: 0,
          typeList: [], //人员类型
          idCardList: [],  //证件类型
          jobTitleList: [],  //职位名称
          jobLevel: [],
          departmentList: [],
        dept:{
          pageSize:'',
          pageNum:'',
          deptName:'',
          groupName:'',
        },
        editId:'',
        photoImg: '',
        isShowImg: false,
        query: {
          name: '',
          pageSize: 10,
          pageNum: 1,
          startTime: '',
          endTime: ''
        },
        form:{
          name: ''
        },
        peopleGroupRules:{
          name: [
            { required: true, message: '组名不能为空', trigger: 'blur' }
          ],
        },
        relateTotal: 0,
        tableRelateData: [],
        peopleGroupList: [],
        tableGroupData: [],

        selectList: [],
        personnelTotal:0,
        personnelData:[],
        currentPage4:1,
      }
    },
    created() {
      this.getMemberTypeList()
    },
    mounted() {
      this.getPeopleMessage()
      this._getdeptList()
      // this.getPersonGroupList()
    },
    computed: {
      newTypeList() {
        let arr = deepClone(this.typeList)
        let newArr = arr.filter(x => x.code !== 'VISITOR_STAFF_DICT:71008')
        return newArr
      }
    },
    methods: {
      // 获取组列表
      // getPersonGroupList() {
      //   getPersonGroup(getObjByKey(this.permission.search), this.query).then(res => {
      //     if (res.meta.status === 200) {
      //        this.peopleGroupList = res.data.data
      //     } else {
      //        this.peopleGroupList = []
      //     }
      //   }).catch(err => {
      //     this.$message.error(err)
      //   })
      // },
      // 添加组
      // onAddGroup() {
      //   this.$refs.peopleGroup.dialogVisible = true
      // },
      // 提交
      // onSaveConfirm() {
      //   this.$refs.form.validate(valid => {
      //     if (valid) {
      //       if (this.confirmTitle === '添加人员分组') {
      //         addPersonGroup(getObjByKey(this.permission.addGroup), this.form).then(res => {
      //           if (res.meta.status === 200) {
      //             this.$message.success('添加分组成功')
      //             this.getPersonGroupList()
      //           } else {
      //             this.$message.error(res.meta.message)
      //           }
      //           this.$refs.peopleGroup.dialogVisible = false
      //           this.$refs.peopleGroup.buttonLoading = false
      //           this.$refs.form.resetFields()
      //         }).catch(err => {
      //           this.$message.error(err)
      //           this.$refs.peopleGroup.buttonLoading = false
      //         })
      //       } else {
      //         editPersonGroup(getObjByKey(this.permission.editGroup), this.form).then(res => {
      //           if (res.meta.status === 200) {
      //             this.$message.success('编辑分组成功')
      //             this.getPersonGroupList()
      //           } else {
      //             this.$message.error(res.meta.message)
      //           }
      //           this.$refs.peopleGroup.dialogVisible = false
      //           this.$refs.peopleGroup.buttonLoading = false
      //           this.$refs.form.resetFields()
      //         }).catch(err => {
      //           this.$message.error(err)
      //           this.$refs.peopleGroup.buttonLoading = false
      //         })
      //       }

      //     } else {
      //       return false
      //     }
      //   })
      // },
      // 选择人员
      // handleSelectionChange(val) {
      //   this.selectList = val
      // },
      // 选择人员移除
      // handleSelectPropleChange(val) {
      //   this.selectedPeopleList = val
      //   if (val.length > 0) {
      //     this.isAbled = false
      //   }
      // },
      // 批量移除
      // batchPeopleRemove() {
      //   let arr= []
      //   this.selectedPeopleList.map(x => {
      //     arr.push({id: x.id})
      //   })
      //   this.deleteGroupPeople(arr)
      // },
      // deleteGroupPeople(list) {
      //   this.$confirm(`确定要删除分组内的人员吗?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     deletePeopleToGroup(getObjByKey(this.permission.deletePeople), {name: this.groupData.name, id: this.groupData.id, personnels: list}).then(res => {
      //       if (res.meta.status === 200) {
      //         this.$message.success('批量移除成功')
      //         this.getPersonGroupByIdList()
      //       } else {
      //         this.$message.err(res.meta.message)
      //       }
      //     }).catch(err => {
      //       this.$message.error(err)
      //     })
      //   }).catch(() => {
      //   })
      // },
      // onDeleteGroupPeople(item) {
      //   let list = [{id: item.id}]
      //   this.deleteGroupPeople(list)
      // },
      // 绑定确认按钮
      // onRelateConfirm() {
      //   addPeopleToGroup(getObjByKey(this.permission.addpeople), {id: this.groupData.id , personnels: this.selectList, name: this.groupData.name}).then(res => {
      //     if (res.meta.status === 200) {
      //       this.getPersonGroupByIdList()
      //     } else {
      //       this.$message.error(res.meta.message)
      //     }
      //     this.$refs.relatePeopleInfo.dialogVisible = false
      //     this.$refs.relatePeopleInfo.buttonLoading = false
      //   }).catch(err => {
      //     this.$message.error(err)
      //     this.$refs.relatePeopleInfo.dialogVisible = false
      //     this.$refs.relatePeopleInfo.buttonLoading = false
      //   })

      // },
      // 编辑组
      // openGroupDialog(item) {
      //   this.confirmTitle = '编辑人员分组'
      //   this.$refs.peopleGroup.dialogVisible = true
      //   this.form.name = item.name
      //   this.form.id = item.id
      // },
      // 删除人员分组
      // delGroup(item) {
      //   this.$confirm(`确定要删除人员分组吗?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     deletePersonGroup(getObjByKey(this.permission.deleteGroup), item.id).then(res => {
      //       if (res.meta.status === 200) {
      //         this.$message.success('删除分组成功')
      //         this.getPersonGroupList()
      //       } else {
      //         this.$message.error(res.meta.message)
      //       }
      //     }).catch(err => {
      //       this.$message.error(err)
      //     })
      //   }).catch(() => {
      //   })
      // },
      // 关联
      // onRealated(item) {
      //   this.groupData = item
      //   this.$refs.groupInfo.dialogVisible = true
      //   this.getPersonGroupByIdList()
      // },
      // 关联得分页  第几页
      // handleCurrentChange(val) {
      //   this.currentPage4 = val
      //   this.tableGroupData = this.personnelData.slice((val-1)*10, val*10)
      // },

      // getPersonGroupByIdList() {
      //   getPersonGroupById(getObjByKey(this.permission.relateGroup), this.groupData.id).then(res => {
      //     if (res.meta.status === 200) {
      //       this.currentPage4 = 1
      //       this.personnelTotal =  res.data.personnels.length
      //       this.personnelData = res.data.personnels
      //       this.tableGroupData = this.personnelData.slice(0,10)
      //     } else {
      //       this.tableGroupData = []
      //     }
      //   }).catch(err => {
      //     this.$message.error(err)
      //   })
      // },
      // 添加人员
      // onAddConfirm() {

      // },
      // 关联人员
      // relatePeople() {
      //   this.getRelatePeopleList()
      //   this.$refs.relatePeopleInfo.dialogVisible = true

      // },
      // 搜索
      // onSearchPeople() {
      //   this.getRelatePeopleList()
      // },
      // async getRelatePeopleList() {
      //   const result = await getGroupAllMember(getObjByKey(this.permission.checkAllGroup), this.relateInfo)
      //   if (result.meta.status === 200) {
      //     this.relateTotal = result.data.total
      //     this.tableRelateData = result.data.data
      //   }
      // },
      validateIDNum (rule, value, callback){
        let idNumReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        let passportReg = /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/
        if (this.addform.documentType === 'ID_CARD_DICT:71002') {
          if (!idNumReg.test(value)) {
            callback(new Error('请输入正确的身份证号码'))
          }else{
            callback()
          }
        } else if (this.addform.documentType === "PASSPORT_DICT:71003") {
          if (!passportReg.test(value)) {
            callback(new Error('请输入正确的护照号码'))
          }else{
            callback()
          }
        } else {
          callback()
        }
      },
       // 部门列表
      _getdeptList() {
        let url = this.$store.getters.btnpremissAll[this.permission.department].url;
        let method = this.$store.getters.btnpremissAll[this.permission.department].method;
        let searchData = {
          url,
          method,
          data: this.dept,
        };
        getConfigController(searchData)
          .then((res) => {
            if (res.meta.status === 200) {
              this.departmentList = res.data;
            } else {
             this.$message.error(res.meta.message)
            }

          })
          .catch((err) => {
            this.$message.error(err);
          });
      },
      // 同步
      btnSynchr() {
        getSchor(getObjByKey(this.permission.schor)).then(res => {
          if (res.meta.status === 200) {
            this.$message.success('人脸同步成功')
          } else {
            this.$message.error(res.meta.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      // 请求人员信息
      async getPeopleMessage() {
        const result = await getPeopleManageList(getObjByKey(this.permission.list), this.formSearch)
        if (result.code === 200) {
          this.total = result.data.total
          this.tableData = result.data.data
          this.tableData.map((item, index) =>{
            item.photoImg = item.photo
            this.setPhoto(item.photo).then(val => {
              let img = `data:img/jpg;base64,${val.data}`
              item.photo = img
            })
          })
        } else {
          this.$message.error(res.meta.message)
        }
      },
      handleSelectId(val) {
        if (val) {
          this.addform.idNumber = ''
        }
      },
      getMemberTypeList() {
        this.queryList.map(x => {
          getMemberType(getObjByKey(this.permission.check), x.query).then(res => {
            if (res.code === 200) {
              x.list = res.data.data
              if(x.query.dictTypeCode === 'person_list_type'){
                this.typeList = x.list
              } else if(x.query.dictTypeCode === 'document_type'){
                this.idCardList = x.list
              }else if(x.query.dictTypeCode === 'job_title'){
                this.jobTitleList = x.list
              }else if(x.query.dictTypeCode === 'job_level'){
                this.jobLevel = x.list
              }
            } else {
              this.$message.error(res.meta.message)
            }
            })
        });
      },
      // 表格的多选
      selectionChange(n) {
        this.checkItemAll = n
      },
      // 表格里的人员轨迹按钮跳转页面
      onRecord(item) {
        this.$router.push({path:'/peopleManage/peopleLocus',query:item})
      },
      // 修改
      onEdit(item) {
        this.dialogVisible = true
        this.dialogVisibleType = 'edit'
        this.putJpeg = item.photo
        this.addform= deepClone(item)
        this.editId = item.id
        this.photoImg = item.photoImg
        // this.addform.department = + (item.department)
        this.addform.department = item.department ? + (item.department) : ''
        if(item.gender == 1){
          this.addform.gender = "女"
        }else{
          this.addform.gender = "男"
        }
      },
      // 单个删除
      onDelete(item) {
        let that = this
        this.$confirm('此操作将永久删除该人员信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          singleDelete(getObjByKey(this.permission.delete), item.id).then(res=>{
            if(res.meta.status ===200){
              this.formSearch.pageNum = 1
              this.getPeopleMessage()
            } else {
              this.$message.error(res.meta.message)
            }
          }).catch(err=>{
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 搜索
      onSearch() {
        this.getPeopleMessage()
        this.checkAll= false
      },
      // 重置
      onReset() {
        this.$refs.formSearch.resetFields()
        this.time = []
        this.getPeopleMessage()
        this.checkAll= false
      },
      // 右上角的新增按钮
      btnAdd() {
        this.dialogVisible = true
        this.dialogVisibleType = 'add'
        this.putJpeg = ''
      },
      // 关闭dialog触发
      dialogClose() {
        Object.keys(this.addform).forEach(x => {
          this.addform[x] = ''
        })
      },
      // 取消
      onCancel() {
        this.dialogVisible = false
        this.isShowImg = false
        this.$refs.addform.resetFields()
      },
      // 校验手机号
      checkPwd (rule, value, callback) {
        let regExp = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
        if(!regExp.test(value)){
          return callback(new Error("请输入正确的手机号"));
        }else {
          callback();
        }
      },
      // 图片上传
      photoUrl(url) {
        this.addform.file = url;
        if(this.addform.file){
          this.isShowImg = false
        }else{
          this.isShowImg = true
        }
      },
      // 点击确认
      onSubmit() {
        this.$refs.addform.validate((valid) => {

          if (valid) {
            if (this.dialogVisibleType === 'add'){
              if(this.addform.file){
                this.isShowImg = false
              }else{
                this.isShowImg = true
              }
              const params = new FormData() //创建FormData
              params.append('carNo', this.addform.carNo)
              params.append('documentType', this.addform.documentType)
              params.append('gender', this.addform.gender)
              params.append('idNumber', this.addform.idNumber)
              params.append('jobLevel', this.addform.jobLevel)
              params.append('jobNo', this.addform.jobNo)
              params.append('phoneNo', this.addform.phoneNo)
              params.append('jobTitle', this.addform.jobTitle)
              params.append('name', this.addform.name)
              params.append('remarks', this.addform.remarks)
              params.append('typeCode', this.addform.typeCode )
              params.append('department', this.addform.department )
              params.append('email', this.addform.email)
              this.addform.file? params.append('file', this.addform.file):''
              newPersonnelList(getObjByKey(this.permission.add),params).then(res=>{
                 if(res.code=== 200){
                  this.getPeopleMessage()
                  this.dialogVisible = false
                  this.$message.success('新增成功')
                 } else {
                   this.$message.error(res.meta.message)
                 }
              }).catch((err) => {
                this.$message.error(err.message);
                this.dialogVisible = false
              });
            }else{
              if (this.isShowImg) return this.photoImg = ''
              if(!this.photoImg && !this.addform.file){
                this.isShowImg = true
                return
              } else {
                this.isShowImg = false
              }
              const params = new FormData() //创建FormData
              params.append('carNo', this.addform.carNo)
              params.append('documentType', this.addform.documentType)
              params.append('idNumber', this.addform.idNumber)
              params.append('jobLevel', this.addform.jobLevel)
              params.append('jobNo', this.addform.jobNo)
              params.append('jobTitle', this.addform.jobTitle)
              params.append('name', this.addform.name)
              params.append('email', this.addform.email)
              params.append('phoneNo', this.addform.phoneNo)
              params.append('remarks', this.addform.remarks)
              params.append('typeCode ', this.addform.typeCode )
              params.append('department', this.addform.department)
              params.append('photo', this.photoImg)
              params.append('id ', this.editId )
              if(this.addform.gender=="男"){
                params.append('gender', '2')
              }else if(this.addform.gender=="女"){
                params.append('gender', '1')
              } else {
                params.append('gender', this.addform.gender)
              }
              this.addform.file? params.append('file', this.addform.file):''
              editEdit(getObjByKey(this.permission.edit),params).then(res=>{
                if(res.code === 200){
                  this.getPeopleMessage()
                  this.dialogVisible = false
                  this.$message.success('编辑成功')
                } else{
                  this.$message.error(res.meta.message)
                }
              }).catch((err) => {
                this.$message.error(err);
                this.dialogVisible = false
              });
            }
          } else {
            return false;
          }
        });
      },
      // 右上角的批量删除按钮
      btnDelete() {
        let arr = []
        this.checkItemAll.map(item=>{
          arr.push(item.id)
        })
        this.$confirm('此操作将永久删除该人员信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDeletion(getObjByKey(this.permission.batchDelete), arr).then(res=>{
            if(res.code ===200){
              this.formSearch.pageNum = 1
              this.getPeopleMessage()
            } else {
              this.$message.error(res.meta.message)
            }
          }).catch(err=>{
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      // 缩略图的全选
      CheckAllChange() {
        if(this.checkAll){
          this.checkItemAll = this.tableData
        }else{
          this.checkItemAll = []
        }
      },
      // 缩略图的多选框
      handleCheckedChange() {
         if(this.checkItemAll.length== this.tableData.length) {
          this.checkAll = true
        }else{
          this.checkAll = false
        }
      },
      // 获取图片
      setPhoto(path){
        let url = this.$store.getters.btnpremissAll[this.permission.downloadThumbnail].url
        let method = this.$store.getters.btnpremissAll[this.permission.downloadThumbnail].method
        let tempObj1 = {
          url,method,
          path
        };
        return new Promise(function (resolve, reject) {
          getSmallPhoto(tempObj1).then((res) => {
            if (res.meta.status === 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        });
      },
    }
}
</script>
<style lang="scss" scoped>
  .photoBox{
    width: 100%;
    height: 670px;
    margin-top: 10px;
    display: flex;
    overflow: auto;
    flex-wrap: wrap;
    .photpItem{
      height: 309px;
      width: 17%;
      padding: 5px;
      color: white;
      border: solid 1px #5e70ec;
      margin:0 1.5% ;
      margin-bottom: 20px;
      position: relative;
      img{
        height: 200px;
        width: 100%;
        border-radius: 3px;
      }
      .content{
        padding: 10px 5px;
        font-size: 14px;
        position: relative;
        .check{
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
        ::v-deep .el-checkbox__label {
          display: none;
        }
      }
      .clickButton{
        width: 95%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        bottom: 0;
        border-top: 1px solid #5e70ec;
        button{
         font-size:20px;
        }
      }
    }
  }
  .pagination-container {
    margin-top: -15px;
  }
  .dialog-table .el-form.el-form--inline {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 48%;
    }
  }
  .ConfirmDialogMy{
    ::v-deep .el-dialog{
      height: 700px;
    }
    .el-pagination {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
</style>
