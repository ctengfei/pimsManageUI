<template>
  <div class="flex flex-col app-container">
    <el-row :span="24" class="xzBox">
      <el-col class="xztongji">
        <el-row :gutter="10" class="xztongjiBox">
          <el-col :span="4">
            <Statistics class="xzmain" :optionList="optionList"></Statistics>
          </el-col>
          <!-- 入住率 -->
          <el-col :span="5">
            <Dasheachart class="xzmain" :optionList="optionList"></Dasheachart>
          </el-col>
          <!--  -->
          <el-col :span="10">
            <Guildclassify
              class="xzmain"
              :optionList="optionList"
            ></Guildclassify>
          </el-col>
          <el-col :span="5">
            <Housenumber
              class="xzmainwei"
              :optionList="optionList"
            ></Housenumber>
          </el-col>
        </el-row>
      </el-col>
      <el-row
        class="xzysBox"
        style="
          overflow: hidden;
          height: 100%;
          background: white;
          box-sizing: border-box;
          padding: 0px;
          display: flex;
          flex-direction: column;
        "
      >
        <el-col
          :span="24"
          class="xzgdBox"
          style="height: 100%; overflow: hidden"
        >
          <VTableNew
            ref="table"
            class="xzgdBox"
            style="height: 100%; overflow: hidden"
            :data="tableData"
            :columns="columns"
            label-width="80px"
            label-position="left"
            :showIndex="true"
            :selection="false"
            @on-search="$refs.table.refresh()"
            @on-reset="onReset"
          >
            <template #search>
              <VTableSearchItem label="房屋地址">
                <el-input
                  v-model="queryParams.address"
                  size="small"
                  placeholder="请输入房屋地址"
                />
              </VTableSearchItem>
              <!-- <VTableSearchItem label="房主电话">
                <el-input
                  size="small"
                  v-model="queryParams.fzlxfs"
                  placeholder="请输入房主联系方式"
                />
              </VTableSearchItem> -->
              <VTableSearchItem label="房屋类别">
                <el-select
                  v-model="queryParams.sourceType"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in sourceType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </VTableSearchItem>
              <VTableSearchItem label="房屋用途">
                <el-select
                  v-model="queryParams.houseUse"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in houseUse"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </VTableSearchItem>
              <VTableSearchItem label="房间状态">
                <el-select
                  v-model="queryParams.usageMode"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in usageMode"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </VTableSearchItem>
              <!-- <VTableSearchItem
                label="是否出租"
                label-width="100px"
                label-position="left"
              >
                <el-select
                  v-model="queryParams.sfczfw"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="dict in dict.type.sys_yes_no"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </VTableSearchItem> -->
            </template>
            <!-- <template #advanced>
              
            </template>
            <template #operate>
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="onAdd"
                >新增</el-button
              >
            </template> -->
          </VTableNew>
        </el-col>
      </el-row>
    </el-row>
    <!-- 新增弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      @close="beforeClose"
      size="40%"
      width="600px"
      append-to-body
      custom-class="dialog-style"
      style="font-size: 24px"
    >
      <div style="width: 100%; padding: 20px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row :gutter="20" v-if="form.sfczfw === 'Y'">
            <el-col
              class="white-space-nowrap"
              :span="column.label == '房屋地址' ? 24 : 12"
              v-for="(column, index) in addColumns"
              :key="index"
            >
              <el-form-item
                v-if="column.dict"
                :label="column.label"
                :prop="column.prop"
              >
                <!-- @change="czrzjdmChange(form[column.prop])" -->
                <el-select
                  v-if="column.label == '承租人证件类型'"
                  v-model="form[column.prop]"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in dict.type[column.dict]"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
                <el-select
                  v-else
                  v-model="form[column.prop]"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in dict.type[column.dict]"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else :label="column.label" :prop="column.prop">
                <el-input
                  v-if="column.prop == 'fwmj' || column.prop == 'fwjs'"
                  v-model="form[column.prop]"
                  placeholder="请输入"
                  maxlength="100"
                  show-word-limit
                  min="1"
                  max="10000"
                  ><i v-if="column.prop == 'fwmj'" slot="suffix"
                    >㎡</i
                  ></el-input
                >
                <el-select
                  v-else-if="column.prop == 'czrxm'"
                  @change="czrxmChange()"
                  filterable
                  remote
                  allow-create
                  :remote-method="remoteMethod"
                  v-model="form[column.prop]"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in peopleList"
                    :key="item.id"
                    :label="item.xm"
                    :value="`${item.xm},${item.sfzhm},${item.lxfs}`"
                  ></el-option>
                </el-select>
                <el-input
                  v-else
                  v-model="form[column.prop]"
                  placeholder="请输入"
                  maxlength="100"
                  show-word-limit
                  :readonly="column.prop == 'address'"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-else>
            <el-col
              class="white-space-nowrap"
              :span="column.label == '房屋地址' ? 24 : 12"
              v-for="(column, index) in noRentColumns"
              :key="index"
            >
              <el-form-item
                v-if="column.dict"
                :label="column.label"
                :prop="column.prop"
              >
                <el-select v-model="form[column.prop]" placeholder="请选择">
                  <el-option
                    v-for="dict in dict.type[column.dict]"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else :label="column.label" :prop="column.prop">
                <el-input
                  v-if="column.prop == 'fwmj' || column.prop == 'fwjs'"
                  v-model="form[column.prop]"
                  placeholder="请输入"
                  min="1"
                  max="10000"
                  maxlength="100"
                  show-word-limit
                  ><i v-if="column.prop == 'fwmj'" slot="suffix"
                    >㎡</i
                  ></el-input
                >
                <el-input
                  v-else
                  v-model="form[column.prop]"
                  placeholder="请输入"
                  maxlength="100"
                  show-word-limit
                  :readonly="column.prop == 'address'"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="房屋图片">
              <ImageUpload v-model="form.fwzp" v-if="!isLook" />
              <div v-else>
                <el-image
                  style="width: 150px; height: 150px; margin: 3px"
                  v-for="(item, index) in form.fwzp"
                  :key="index"
                  :src="item"
                  :preview-src-list="form.fwzp"
                  alt=""
                />
              </div>
              <!-- <el-upload ref="upload"
                         :headers="uploadHeaders"
                         :limit="3"
                         :on-change="handlePicChange"
                         :on-exceed="handleExceed"
                         :file-list="fileList"
                         :action="uploadUrl"
                         list-type="picture-card"
                         :auto-upload="true"
                         :before-upload="beforeAvatarUpload"
                         accept=".gif,.jpg,.jpeg,.png">
                <i slot="default"
                   class="el-icon-plus"></i>
                <div slot="file"
                     slot-scope="{ file }"
                     style="width: 100%; height: 100%">
                  <img class="el-upload-list__item-thumbnail"
                       :src="file.url"
                       alt=""
                       style="width: 100%; height: 100%" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete"
                          @click="handleRemove(file, fileList)">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload> -->
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
 
<script>
import Statistics from "./components/Statistics";
import Dasheachart from "./components/Dasheachart";
import Guildclassify from "./components/Guildclassify";
import Housenumber from "./components/Housenumber";
import { getPeopleList } from "@/api/wggl/xcrz";
import {
  query,
  add,
  edit,
  deleteList,
  selectfwCount,
  getStatistics,
  TableList,
} from "@/api/jcyw/syfw/fwgl";
import { formatDate, formatPhone } from "@/utils";
import { getToken } from "@/utils/auth";
import ImageUpload from "@/components/ImgUploadArr";
export default {
  name: "Fwgl",
  components: {
    Statistics,
    Dasheachart,
    Guildclassify,
    Housenumber,
    ImageUpload,
  },
  dicts: ["ga_fwyt", "ga_fwcq", "ga_fwlb", "sys_yes_no", "gb_czyt", "ga_zjzl"],
  data() {
    const checkFwmj = (rule, value, callback) => {
      const regMobile = /^[]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (value) {
        if (regMobile.test(value) && value >= 1) {
          return callback();
        } else {
          callback(new Error("请输入大于1的合法数字"));
        }
      } else {
        return callback();
      }
    };
    return {
      optionList: null,
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [],
      imgurl: "",
      isLook: false,
      // uploadSite: process.env.VUE_APP_BASE_API + '/common/upload', // 上传的图片服务器地址
      timer: "",
      timeout: null,
      peopleList: [],
      uploadUrl: process.env.VUE_APP_BASE_API + "/file/file/upload", // 上传的图片服务器地址,
      uploadHeaders: {
        Authorization: "Bearer " + getToken(),
        "Client-Type": "manageWeb",
      },
      sourceType: [
        {
          value: "BUSINESS",
          label: "商业空间",
        },
        {
          value: "OFFICIAL",
          label: "办公空间",
        },
        {
          value: "APARTMENT",
          label: "人才公寓",
        },
        {
          value: "PARKINGLOT",
          label: "车位",
        },
        {
          value: "SHOPS",
          label: "商铺",
        },
      ], //房屋类别
      houseUse: [{
          value: "SPECIAL",
          label: "特殊用途",
        },
        {
          value: "DORMITORY",
          label: "员工宿舍",
        },
        {
          value: "LEASE",
          label: "租赁用房",
        },], //房屋用途
      usageMode: [
        {
          value: "RENTABLE",
          label: "可出租",
        },
        {
          value: "UNDER",
          label: "维护中",
        },
        {
          value: "CHECKED",
          label: "已入住",
        },
        {
          value: "UNCHECKED",
          label: "未入住",
        },
        {
          value: "RESERVED",
          label: "已预订",
        },
        {
          value: "DUE",
          label: "即将到期",
        },{
          value: "RENEWAL",
          label: "续约",
        },{
          value: "UNRENEWAL",
          label: "不续约",
        },{
          value: "LOCKED",
          label: "已锁定",
        },
      ], //房间状态
      queryParams: {
        address: undefined,
        accruedArea: undefined,
        sourceType: undefined,
        fzlxfs: undefined,
        houseUse: undefined,
        sfczfw: undefined,
        usageMode: undefined,
      },
      deleteParams: {},
      editParams: {},
      addParams: {},
      columns: [
        {
          label: "房屋地址",
          prop: "address",
          minWidth: "250px",
          "show-overflow-tooltip": true,
          render: (h, { row }) => {
            return (
              <el-link
                // style="white-space: nowrap;"
                type="primary"
                // onClick={() => this.getHouseInfo(row)}
              >
                {row.address}
              </el-link>
            );
          },
        },
        {
          label: "房屋类别",
          prop: "roomSourceTypeStr",
          minWidth: "150px",
          "show-overflow-tooltip": true,
          // render: (h, { row, column, index }) => {
          //   const val = this.dict?.type?.ga_fwlb;
          //   return <dict-tag options={val} value={row.roomSourceTypeStr} />;
          // },
          // dict: "ga_fwlb",
        },
        {
          label: "房屋用途",
          prop: "houseUseStr",
          // dict: "ga_fwyt",
          minWidth: "150px",
          "show-overflow-tooltip": true,
          // render: (h, { row, column, index }) => {
          //   const val = this.dict?.type?.ga_fwyt;
          //   return <dict-tag options={val} value={row.houseUseStr} />;
          // },
        },
        {
          label: "房屋面积",
          prop: "fwmj",
          minWidth: "80px",
          show: false,
        },
        {
          label: "房屋间数",
          prop: "fwjs",
          minWidth: "80px",
          show: false,
        },
        {
          label: "产权性质",
          prop: "fwcqxz",
          dict: "ga_fwcq",
          minWidth: "150px",
          show: false,
          "show-overflow-tooltip": true,
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.ga_fwcq;
            return (
              <dict-tag
                style="white-space: nowrap;"
                options={val}
                value={row.fwcqxz}
              />
            );
          },
        },
        {
          label: "产权证号",
          prop: "fwcqzh",
          show: false,
          minWidth: "100px",
          "show-overflow-tooltip": true,
        },
        {
          label: "房主姓名",
          prop: "accruedArea",
          show: false,
          minWidth: "100px",
          "show-overflow-tooltip": true,
        },
        {
          label: "建筑面积",
          prop: "accruedArea",
          minWidth: "100px",
          "show-overflow-tooltip": true,
        },
        {
          label: "房间状态",
          prop: "usageModeStr",
          minWidth: "100px",
          "show-overflow-tooltip": true,
        },
        {
          label: "房主电话",
          prop: "fzlxfs",
          minWidth: "120px",
          show: false,
          "show-overflow-tooltip": true,
          render: (h, { row }) => {
            const val = formatPhone(row.fzlxfs);
            return <span>{val}</span>;
          },
        },
        {
          label: "房主住址",
          prop: "fzxjxz",
          minWidth: "220px",
          show: false,
        },
        {
          label: "是否出租",
          prop: "sfczfw",
          dict: "sys_yes_no",
          align: "center",
          show: false,
          minWidth: "110px",
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.sys_yes_no;
            return <dict-tag options={val} value={row.sfczfw} />;
          },
        },
        {
          label: "出租用途",
          prop: "czyt",
          dict: "gb_czyt",
          minWidth: "160px",
          show: false,
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.gb_czyt;
            return <dict-tag options={val} value={row.czyt} />;
          },
        },
        {
          label: "承租人姓名",
          prop: "czrxm",
          show: false,
          minWidth: "100px",
          "show-overflow-tooltip": true,
        },
        {
          label: "承租人证件类型",
          prop: "czrzjdm",
          dict: "ga_zjzl",
          minWidth: "160px",
          show: false,
          render: (h, { row, column, index }) => {
            const val = this.dict?.type?.ga_zjzl;
            return <dict-tag options={val} value={row.czrzjdm} />;
          },
        },
        {
          label: "承租人证件号码",
          prop: "czrzjhm",
          show: false,
          minWidth: "110px",
          "show-overflow-tooltip": true,
        },
        {
          label: "承租人联系方式",
          prop: "czrlxfs",
          show: false,
          minWidth: "110px",
          "show-overflow-tooltip": true,
        },
        {
          label: "创建时间",
          prop: "createTime",
          align: "center",
          minWidth: "160px",
          render: (h, { row }) => {
            const val = formatDate(row.createTime);
            return <span>{val}</span>;
          },
        },
        {
          label: "操作",
          prop: "action",
          align: "center",
          fixed: "right",
          width: "200px",
          render: (h, { row, column, index }) => {
            return (
              <span>
                <VTableCell
                  type="档案"
                  // icon="el-icon-document"
                  // title={row.xm}
                  promiseStr="jcyw:syfw.fwgl:dangan"
                  onClick={() => this.getHouseInfo(row)}
                />
                <VTableCell
                  type="修改"
                  // icon="el-icon-edit"
                  promiseStr="jcyw:syfw.fwgl:edit"
                  onClick={() => this.onEdit(row)}
                />
                <VTableCell
                  type="删除"
                  // icon="el-icon-delete"
                  // title={row.address}
                  promiseStr="jcyw:syfw.fwgl:remove"
                  onClick={() => this.onDel(row)}
                />
              </span>
            );
          },
        },
      ],
      tableData: (parameter) => {
        return TableList({ ...parameter, ...this.queryParams });
        // return query({ ...parameter, ...this.queryParams });
      },
      // tableData:undefined,
      title: "",
      open: false,
      form: {
        accruedArea: "",
        fzlxfs: "",
        fzxjxz: "",
        houseUseStr: "",
        fwmj: "",
        roomSourceTypeStr: "",
        fwjs: "",
        address: "",
        fwdzid: "",
        fwcqxz: "",
        fwcqzh: "",
        id: "",
        sfczfw: "",
        czyt: "",
        czrxm: "",
        czrzjdm: "",
        czrzjhm: "",
        czrlxfs: "",
        fwzp: [],
      },
      // 表单校验
      rules: {
        address: [
          { required: true, message: "房屋地址详址不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "房屋地址详址长度必须介于 1 和 50 之间",
            trigger: "blur",
          },
        ],
        fwdzid: [
          { required: true, message: "房屋地址ID不能为空", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "房屋地址ID长度必须介于 1 和 20 之间",
            trigger: "blur",
          },
        ],
        accruedArea: [
          { required: false, message: "请输入", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "输入长度介于1到10个字符之间",
            trigger: "blur",
          },
        ],
        fzlxfs: [
          {
            required: false,
            pattern:
              /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
          {
            min: 1,
            max: 11,
            message: "输入长度介于1到11个字符之间",
            trigger: "blur",
          },
        ],
        czrlxfs: [
          {
            required: false,
            pattern:
              /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
          {
            min: 1,
            max: 11,
            message: "输入长度介于1到11个字符之间",
            trigger: "blur",
          },
        ],
        czrzjhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的承租人证件号码",
            trigger: "blur",
          },
        ],
        fzxjxz: [
          { required: false, message: "请输入", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "输入长度介于1到50个字符之间",
            trigger: "blur",
          },
        ],
        fwmj: [
          { required: false, message: "内容不能为空", trigger: "change" },
          { validator: checkFwmj, trigger: "change" },
          {
            min: 1,
            max: 10,
            message: "输入长度介于1到10个字符之间",
            trigger: "change",
          },
        ],
        fwjs: [
          { required: false, message: "内容不能为空", trigger: "change" },
          // { validator: checkFwmj, trigger: 'change' },
          {
            min: 1,
            max: 10,
            message: "输入长度介于1到10个字符之间",
            trigger: "change",
          },
          {
            pattern: /^[0-9][0-9]*$/,
            message: "只允许输入数字",
            trigger: "change",
          },
        ],
        fwcqzh: [
          { required: false, message: "请输入", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "输入长度介于1到50个字符之间",
            trigger: "blur",
          },
        ],
        sfczfw: [
          { required: true, message: "是否出租房屋为必填项", trigger: "blur" },
        ],
        roomSourceTypeStr: [
          { required: true, message: "房屋类别为必填项", trigger: "change" },
        ],
        houseUseStr: [
          { required: true, message: "房屋用途为必填项", trigger: "change" },
        ],
        czyt: [
          { required: true, message: "出租用途用途为必填项", trigger: "blur" },
        ],
        czrzjdm: [
          {
            required: true,
            message: "承租人证件类型为必填项",
            trigger: "blur",
          },
        ],
        czrxm: [
          { required: true, message: "承租人姓名为必填项", trigger: "blur" },
        ],
      },
      houseData: null,
    };
  },
  watch: {
    // 'form.sfczfw': (val) => {
    //   if (val == 'Y') {
    //     this.form.czrzjdm = '111'
    //   } else {
    //     this.form.czrzjdm = ''
    //   }
    // }
  },
  mounted() {
    this.initHouseData();
    this.getStatistics();
    this.queryPeopleList();
    // this.getTableData()
  },
  computed: {
    addColumns() {
      return this.columns.slice(0, this.columns.length - 1).filter((item) => {
        return item.label != "创建时间";
      });
    },
    noRentColumns() {
      return this.columns.slice(0, this.columns.length - 7);
    },
  },
  methods: {
    getTableData(parameter) {
      TableList({ ...parameter, ...this.queryParams }).then((res) => {
        console.log(res);
        // this.tableData = res.data;
        // console.log(this.tableData);
      });
    },
    getStatistics() {
      getStatistics().then((res) => {
        //console.log(res)
        if (res.code == 200) {
          this.optionList = res.data;
        }
      });
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      if (!isJPG) {
        this.$message.error("只能上传图片");
      }
      return isJPG;
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
      // this.$emit('previewImg', file.url, true)
    },
    handleExceed() {
      this.$message.warning(`最多上传三张图片`);
    },
    handlePicChange(file, fileList) {
      this.fileList = fileList;
    },
    czrxmChange() {
      this.form.czrzjhm = this.form.czrxm.split(",")[1];
      this.form.czrlxfs = this.form.czrxm.split(",")[2];
      this.form.czrxm = this.form.czrxm.split(",")[0];
      // console.log(this.form.czrzjhm, this.form.czrxm, this.form.czrlxfs)
    },
    remoteMethod(value) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.queryPeopleList(value);
      }, 1000);
    },
    queryPeopleList(value) {
      getPeopleList({
        pageNum: 1,
        pageSize: 10,
        xm: value,
      }).then((res) => {
        // console.log(res)
        this.peopleList = res.rows;
      });
    },
    handleRemove(file, fileList) {
      // console.log(fileList,this.fileList)
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].uid == file.uid) {
          this.fileList.splice(i, 1);
        }
      }
    },
    // 获取房屋统计数据
    async initHouseData() {
      // console.log(1111111111)
      let houseTotalNum = await selectfwCount();
      let rentHouseNum = await selectfwCount({ sfczfw: "Y" });
      let selfHouseNum = await selectfwCount({ houseUseStr: 10 });
      let officeHouseNum = await selectfwCount({ houseUseStr: 60 });
      let selfBuildHouseNum = await selectfwCount({ roomSourceTypeStr: 40 });
      this.houseData = {
        houseTotalNum: houseTotalNum.data,
        rentHouseNum: rentHouseNum.data,
        selfHouseNum: selfHouseNum.data,
        officeHouseNum: officeHouseNum.data,
        selfBuildHouseNum: selfBuildHouseNum.data,
      };
      // console.log(this.houseData)
    },
    // 重置
    onReset() {
      this.queryParams = {};
      this.$refs.table.refresh();
    },
    // 新增
    async onAdd() {
      this.open = true;
      this.isLook = true;
      this.title = "新增";
    },
    // 修改
    onEdit(row) {
      // console.log(row)
      for (let k in this.form) {
        this.form[k] = row[k];
      }
      // if (row.fwzp) {
      //   let arr = row.fwzp.split(',')
      //   for (let i = 0; i < arr.length; i++) {
      //     this.fileList.push({
      //       // name: `buzhidao${i}`,
      //       url: process.env.VUE_APP_BASE_FILE_VIEW + arr[i],
      //       response: {
      //         url: arr[i]
      //       }
      //     })
      //   }
      // }

      // if (this.form.fwzp != '' && this.form.fwzp != null) {
      //   this.fileList = []
      //   this.fileList.push({
      //     url: process.env.VUE_APP_BASE_FILE_VIEW + this.form.fwzp,
      //     response: {
      //       url: process.env.VUE_APP_BASE_FILE_VIEW + this.form.fwzp
      //     }
      //   })
      // } else {
      //   this.fileList = []
      // }
      if (row.czrzjdm == null) {
        this.form.czrzjdm = "111";
      }
      if (row.sfczfw == null) {
        this.form.sfczfw = "N";
      }
      this.open = true;
      this.isLook = false;
      this.title = "修改房屋信息";
    },
    // 删除
    onDel(row) {
      this.$confirm("是否继续删除该数据?.", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          if (!row.id && !row.fwdzid) return;
          let interfaceRes = await deleteList(row.id, row.fwdzid);
          if (!interfaceRes) return;
          this.$modal.msgSuccess("删除成功");
          this.$nextTick(() => {
            // alert(111)
            this.getStatistics();
          });

          this.$refs.table.refresh();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getHouseInfo(row) {
      // localStorage.setItem("fwbqqxzf", JSON.stringify(["jcyw:syfw.fwgl:fwbq"]));
      // this.$router.push({
      //   name: "Fwda",
      //   params: row,
      // });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.isLook = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        accruedArea: "",
        fzlxfs: "",
        fzxjxz: "",
        houseUseStr: "",
        fwmj: "",
        roomSourceTypeStr: "",
        fwjs: "",
        address: "",
        fwdzid: "",
        fwcqxz: "",
        fwcqzh: "",
        id: "",
        sfczfw: "",
        czyt: "",
        czrxm: "",
        czrzjdm: "",
        czrzjhm: "",
        czrlxfs: "",
        fwzp: [],
      };
      this.fileList = [];
    },

    /** 提交按钮 */
    async submitForm() {
      let validateRes = await this.valiteForm();
      if (!validateRes) return;
      // if (this.fileList.length) {
      //   let fwzp = []
      //   this.fileList.forEach(async (item) => {
      //     // if (item.name.indexOf('.mp4') != -1) {
      //     //   sjsps.push(item.response.url)
      //     // } else {
      //     fwzp.push(item.response.url)
      //     // }
      //   })
      //   this.form.fwzp = fwzp.toString()
      //   // this.form.fwzp = this.fileList[0].response.fileName
      // } else {
      //   this.form.fwzp = ''
      // }
      this.open = false;
      this.isLook = true;
      if (this.title == "新增") {
        let interfaceRes = await add(this.form);
        if (!interfaceRes) return;
        this.$modal.msgSuccess("新增成功");
        this.$refs.table.refresh();
      } else {
        let interfaceRes = await edit(this.form);
        if (!interfaceRes) return;
        this.$modal.msgSuccess("修改成功");
        await this.initHouseData();
        this.timer = new Date().getTime();
        this.$refs.table.refresh();
      }
      this.reset();
    },
    valiteForm() {
      return new Promise((resolve) => {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    // 关闭弹框
    beforeClose() {
      this.reset();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/xinZengBox.scss";
::v-deep .el-form.mb-6px .el-form-item__label {
  text-align: left;
}
.xzmainwei {
  width: 100%;
  height: 164px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.white-space-nowrap {
  white-space: nowrap;
}
.el-select {
  width: 100%;
}
.padding-10 {
  box-sizing: border-box;
  padding: 10px;
}
.uploadImgContainer {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;

  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  position: relative;
  img {
    margin: 0;
    height: 100%;
    width: 100%;
  }
  .el-icon-close {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
<style>
.position-br {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
/* 滚动条样式 */
div::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
div::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
div::-webkit-scrollbar-thumb {
  background: #d8d8d8;
  border-radius: 5px;
}
</style>
