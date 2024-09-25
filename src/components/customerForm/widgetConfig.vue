<template>
  <div>
    <div v-if="eleItem && eleItem.key">
      <el-form size="mini" label-position="top">
        <!-- 表单名称 -->
        <el-form-item label="标题" class="form-borderbottom">
          <el-input
            v-model="eleItem.name"
            :disabled="eleItem.options.nameDisabled"
          ></el-input>
        </el-form-item>
        <!-- 表单绑定的model -->
        <el-form-item label="数据绑定字段" class="form-borderbottom">
          <el-input v-model="eleItem.model"></el-input>
        </el-form-item>
        <!-- 设置表单宽度 -->
        <template v-if="eleItem.options.hasOwnProperty('width')">
          <el-form-item label="表单宽度" class="form-borderbottom">
            <el-input v-model="eleItem.options.width"></el-input>
          </el-form-item>
        </template>

        <!-- 表单提示语句 -->
        <template v-if="eleItem.options.placeholder">
          <el-form-item label="提示语句" class="form-borderbottom">
            <el-input v-model="eleItem.options.placeholder"></el-input>
          </el-form-item>
        </template>
        <!-- 多行文本 -->
        <template v-if="eleItem.type === 'textarea'">
          <el-form-item label="行数" class="form-borderbottom">
            <el-input
              type="number"
              min="1"
              v-model="eleItem.options.rows"
            ></el-input>
          </el-form-item>
        </template>
        <!-- 输入框 -->
        <template v-if="eleItem.type === 'input'">
          <!-- 是否是密码 -->
          <el-form-item label="密码框" class="form-borderbottom">
            <el-switch
              v-model="eleItem.options.password"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
        </template>
        <!-- 多选框组 -->
        <template v-if="eleItem.type === 'checkbox'">
          <!-- 最大选择个数 -->
          <el-form-item label="最大选择个数" class="form-borderbottom">
            <el-input
              v-model="eleItem.options.max"
              placeholder="请输入最大选择个数"
              type="number"
            >
            </el-input>
          </el-form-item>
        </template>
        <!-- 计数器 -->
        <template v-if="eleItem.type === 'inputNumber'">
          <!-- 最小值 -->
          <el-form-item label="最小值" class="form-borderbottom">
            <el-input
              v-model.number="eleItem.options.min"
              placeholder="请输入最小值"
              type="number"
            >
            </el-input>
          </el-form-item>
          <!-- 最大值 -->
          <el-form-item label="最大值" class="form-borderbottom">
            <el-input
              v-model.number="eleItem.options.max"
              placeholder="请输入最大值"
              type="number"
            >
            </el-input>
          </el-form-item>
          <!-- 控制按钮位置 -->
          <el-form-item label="控制按钮位置" class="form-borderbottom">
            <el-radio-group v-model="eleItem.options.position">
              <el-radio label="">默认</el-radio>
              <el-radio label="right">右侧</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <!-- 下拉框 -->
        <template v-if="eleItem.type === 'select'">
          <!-- 是否可多选 -->
          <el-form-item label="是否可多选" class="form-borderbottom">
            <el-switch
              v-model="eleItem.options.multiple"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
        </template>
        <!-- 滑块 -->
        <template v-if="eleItem.type === 'slider'">
          <!-- 默认值 -->
          <el-form-item label="默认值" class="form-borderbottom">
            <el-input
              v-model.number="eleItem.options.defaultValue"
              type="number"
              placeholder="请输入默认值"
            >
            </el-input>
          </el-form-item>
          <!-- 最小值 -->
          <el-form-item label="最小值" class="form-borderbottom">
            <el-input
              v-model.number="eleItem.options.min"
              placeholder="请输入最小值"
              type="number"
            >
            </el-input>
          </el-form-item>
          <!-- 最大值 -->
          <el-form-item label="最大值" class="form-borderbottom">
            <el-input
              v-model.number="eleItem.options.max"
              placeholder="请输入最大值"
              type="number"
            >
            </el-input>
          </el-form-item>
        </template>

        <!-- 评分 -->
        <template v-if="eleItem.type === 'rate'">
          <!-- 默认值 -->
          <el-form-item label="默认值" class="form-borderbottom">
            <el-input
              v-model.number="eleItem.options.defaultValue"
              type="number"
              placeholder="请输入默认值"
            >
            </el-input>
          </el-form-item>
          <!-- 最大值 -->
          <el-form-item label="最大值" class="form-borderbottom">
            <el-input
              v-model.number="eleItem.options.max"
              placeholder="请输入最大值"
              type="number"
            >
            </el-input>
          </el-form-item>
          <!-- 辅助文字 -->
          <el-form-item label="辅助文字" class="form-borderbottom">
            <el-switch
              v-model="eleItem.options.text"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
        </template>

        <!-- 日期选择器 -->
        <template v-if="eleItem.type === 'datePicker'">
          <!-- 可选时间 -->
          <el-form-item label="时间类型" class="form-borderbottom">
            <el-radio-group
              @change="changeDateType"
              v-model="eleItem.options.type"
              class="date-type-group"
            >
              <el-radio label="date">只选择日期</el-radio>
              <el-radio label="datetime">选择日期和时间</el-radio>
              <el-radio label="daterange">选择日期范围</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <!-- 文字 -->
        <template v-if="eleItem.type === 'text'">
          <!-- 编辑文字 -->
          <el-form-item label="编辑文字" class="form-borderbottom">
            <el-input
              v-model="eleItem.options.defaultValue"
              placeholder="请输入文字"
              type="textarea"
              autosize
            >
            </el-input>
          </el-form-item>
          <!-- 位置 -->
          <el-form-item label="位置" class="form-borderbottom">
            <el-radio-group v-model="eleItem.options.position">
              <el-radio label="">靠左对齐</el-radio>
              <el-radio label="center">居中对齐</el-radio>
              <el-radio label="end" style="margin-top: 10px">靠右对齐</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 字体颜色 -->
          <el-form-item label="字体颜色" class="form-borderbottom">
            <el-color-picker
              @active-change="changeTextColor"
              v-model="eleItem.options.color"
            ></el-color-picker>
          </el-form-item>
          <!-- 字体大小 -->
          <el-form-item label="字体大小" class="form-borderbottom">
            <el-input-number
              v-model="eleItem.options.size"
              :min="1"
              label="字体大小"
            ></el-input-number>
          </el-form-item>
          <!-- 字体粗细 -->
          <el-form-item label="字体粗细" class="form-borderbottom">
            <el-radio-group v-model="eleItem.options.weight">
              <el-radio label="">默认</el-radio>
              <el-radio label="700">加粗</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 字体倾斜 -->
          <el-form-item label="字体倾斜" class="form-borderbottom">
            <el-radio-group v-model="eleItem.options.style">
              <el-radio label="">默认</el-radio>
              <el-radio label="italic">倾斜</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 首行缩进 -->
          <el-form-item label="首行缩进" class="form-borderbottom">
            <el-input-number
              :min="0"
              v-model="eleItem.options.indent"
              label="首行缩进"
            ></el-input-number>
          </el-form-item>
          <!-- 字体缩进 -->
          <el-form-item label="字体缩进" class="form-borderbottom">
            <el-input-number
              :min="0"
              v-model="eleItem.options.leftPadding"
              label="字体缩进"
            ></el-input-number>
          </el-form-item>
          <!-- 字体行间距 -->
          <el-form-item label="字体行间距" class="form-borderbottom">
            <el-input-number
              :min="0"
              v-model="eleItem.options.lineHeight"
              label="字体行间距"
            ></el-input-number>
          </el-form-item>
        </template>
        <!-- 分割线 -->
        <template v-if="eleItem.type === 'divider'">
          <!-- 分割线文案 -->
          <el-form-item label="分割线文案" class="form-borderbottom">
            <el-input
              v-model="eleItem.options.defaultValue"
              placeholder="分割线文案"
            ></el-input>
          </el-form-item>
          <!-- 文案位置 -->
          <el-form-item
            label="文案位置"
            class="form-borderbottom"
            v-if="eleItem.options.defaultValue"
          >
            <el-radio-group v-model="eleItem.options.position">
              <el-radio label="left">靠左对齐</el-radio>
              <el-radio label="center">居中对齐</el-radio>
              <el-radio label="right" style="margin-top: 10px"
                >靠右对齐</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </template>

        <!-- 多组件共享配置：单选框和多选框和下拉框 -->
        <template
          v-if="
            eleItem.type === 'radio' ||
            eleItem.type === 'checkbox' ||
            eleItem.type === 'select'
          "
        >
          <el-form-item label="是否显示标签" class="form-borderbottom">
            <el-switch
              v-model="eleItem.options.isTag"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="选项组" class="form-borderbottom">
            <draggable
              v-model="eleItem.options.valueData"
              animation="300"
              class="dragg-ui"
              handle=".i-success"
              ghostClass="ghost"
            >
              <li
                v-for="(item, index) in eleItem.options.valueData"
                :key="index"
              >
                <div class="value-label-input">
                  <!-- 设置显示的值 -->
                  <el-input
                    v-model="item.value"
                    :class="{ value_input: !eleItem.options.isTag }"
                  ></el-input>
                  <!-- 设置绑定的值 -->
                  <el-input
                    v-if="eleItem.options.isTag"
                    v-model="item.label"
                  ></el-input>
                </div>
                <i class="el-icon-rank i-success"></i>
                <i
                  class="el-icon-delete i-danger"
                  @click="removeEleItemValueData(index)"
                ></i>
              </li>
            </draggable>
            <el-button type="text config-addbtn" @click="addEleItemValueData"
              >添加选项</el-button
            >
            <el-button type="text config-addbtn" @click="addMultipleValueData"
              >批量添加</el-button
            >
          </el-form-item>
        </template>

        <!-- 组件共享配置 ： 是否添加边框 -->
        <template
          v-if="eleItem.type === 'radio' || eleItem.type === 'checkbox'"
        >
          <!-- 布局方法 -->
          <el-form-item label="布局方法" class="form-borderbottom">
            <el-radio-group v-model="eleItem.options.inline">
              <el-radio label="inline-block">行内</el-radio>
              <el-radio label="block">块级</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <!-- 组件公共配置项目 ： 最大输入长度 -->
        <template v-if="eleItem.options.hasOwnProperty('maxlength')">
          <el-form-item label="最大输入长度" class="form-borderbottom">
            <el-input
              type="number"
              placeholder="请输入最大输入长度"
              v-model="eleItem.options.maxlength"
            >
            </el-input>
          </el-form-item>
        </template>
        <!-- 组件公共配置项目 ：是否必填 -->
        <template v-if="eleItem.options.hasOwnProperty('required')">
          <el-form-item label="是否必填" class="form-borderbottom">
            <el-switch
              v-model="eleItem.options.required"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
          <!-- 错误提示语句 -->
          <el-form-item
            v-if="eleItem.options.required"
            label="自定义错误提示语句"
            class="form-borderbottom"
          >
            <el-input
              v-model="eleItem.options.requiredMsg"
              placeholder="自定义错误提示语句"
            >
            </el-input>
          </el-form-item>
        </template>
        <!-- 组件公共配置项目 ： 是否禁用 -->
        <el-form-item
          label="是否禁用"
          class="form-borderbottom"
          v-if="eleItem.type !== 'text' && eleItem.type !== 'divider'"
        >
          <el-switch
            v-model="eleItem.options.disabled"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </el-form-item>
        <!-- 组件公共配置项目 ： 是否可清空 -->
        <template v-if="eleItem.options.hasOwnProperty('clearable')">
          <el-form-item label="是否可清空" class="form-borderbottom">
            <el-switch
              v-model="eleItem.options.clearable"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
        </template>
      </el-form>
    </div>

    <!-- 批量添加选项弹框 -->
    <el-dialog title="批量添加选项" :visible.sync="addMultipleStatus" top="5vh">
      <div class="addHeaderTitle">
        每行代表一个选项，可以添加多个选项<span>(已自动过滤重复项)</span>。
      </div>
      <el-input
        type="textarea"
        autosize
        :autosize="{ minRows: 3, maxRows: 17 }"
        placeholder="请输入内容"
        v-model="eleItemValueData"
      >
      </el-input>
      <span slot="footer">
        <el-button type="primary" @click="saveAddMultiple">确定</el-button>
        <el-button @click="addMultipleStatus = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable: draggable,
  },
  props: ["eleItem"],
  data() {
    return {
      // 批量添加弹框
      addMultipleStatus: false,
      eleItemValueData: "",
    };
  },
  methods: {
    // 删除选项
    removeEleItemValueData(index) {
      this.eleItem.options.valueData.splice(index, 1);
    },
    // 添加选项
    addEleItemValueData() {
      // 随机生成4位数防止报key重复错误
      let random = Math.floor(Math.random() * 9999);
      this.eleItem.options.valueData.push({
        value: "新选项" + random,
        label: "新选项" + random,
      });
    },
    // 弹出批量添加选项框方法
    addMultipleValueData() {
      this.addMultipleStatus = true;
      this.eleItemValueData = "";
    },
    // 确认批量添加选项方法
    saveAddMultiple() {
      if (!this.eleItemValueData) {
        this.$message({
          message: "请输入内容",
          type: "warning",
        });
        return;
      }
      let reg = /(\s*)(.+)(\s*)/g;
      let values = [];
      this.eleItemValueData.replace(reg, (...args) => {
        values.push(args[2]);
      });
      values = [...new Set(values)];
      values.forEach((item) => {
        this.eleItem.options.valueData.push({
          value: item,
          label: item,
        });
      });
      this.addMultipleStatus = false;
    },
    // 改变日期选择器的类型触发
    changeDateType(e) {
      this.eleItem.options.valueFormat =
        e === "datetime" ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd";
    },
    // 改变文字颜色是实时改变页面中的文字颜色
    changeTextColor(e) {
      this.eleItem.options.color = e;
    },
  },
  watch: {
    eleItem: {
      handler(data) {
        // 不需要展示标题的组件集合
        let noShowNameData = ["text", "divider"];        
        if (noShowNameData.some((item) => item === data.type)) {
          data.name = "";
        }
        this.$emit("update:eleItem", data);
      },
    },
  },
};
</script>

<style scoped>
.date-type-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.value-label-input {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}
.value_input {
  grid-column-start: span 2;
}
.el-form-item--mini > .el-form-item__label {
  padding: 0px !important;
}
.form-borderbottom {
  margin-bottom: 15px !important;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1e1e1;
}
form-item--mini .el-form-item__label {
  margin-bottom: -10px !important;
  line-height: 28px !important;
}

li {
  list-style-type: none;
}
.dragg-ui {
  display: grid;
  grid-auto-columns: 1fr;
  gap: 5px;
}
.dragg-ui > li {
  display: grid;
  grid-template-columns: 5fr 1fr 1fr;
  justify-items: right;
  align-items: center;
}
.i-success {
  padding: 4px;
  border-radius: 50%;
  color: rgb(255, 255, 255);
  background-color: rgb(64, 158, 255);
  border-color: rgb(64, 158, 255);
}
.i-danger {
  padding: 4px;
  border-radius: 50%;
  color: rgb(255, 255, 255);
  background-color: rgb(245, 108, 108);
  border-color: rgb(245, 108, 108);
}
.ghost {
  height: 28px;
  border: 1px dashed #0f79e2;
  background-color: #add3f8;
}
.ghost > * {
  display: none !important;
}
.config-addbtn {
  text-align: left !important;
}

.config-title {
  width: 100%;
  height: 35px !important;
  line-height: 25px !important;
  padding: 0px !important;
  border-bottom: 1px solid #999999;
}
.addHeaderTitle {
  margin-bottom: 10px;
}
.addHeaderTitle > span {
  color: #999999;
  font-size: 10px;
}
</style>