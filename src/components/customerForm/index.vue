<template>
  <div class="container-main">
    <el-container class="container-main">
      <!-- 左侧 -->
      <el-aside width="250px" class="main-right">
        <el-header class="header-title">常用组件</el-header>
        <draggable
          :list="CommonUserComponents"
          v-bind="{
            group: {
              name: 'people',
              pull: 'clone',
              put: false,
            },
            sort: false,
            ghostClass: 'ghostClass',
          }"
          :move="onMove"
          class="draggable-container"
        >
          <el-tag
            v-for="(item, index) in CommonUserComponents"
            :key="index"
            effect="dark"
            style="width: 100%"
          >
            <i :class="item.icon"></i> {{ item.name }}
          </el-tag>
        </draggable>
      </el-aside>
      <!-- 中间 -->
      <el-container>
        <el-header class="main-bottom header-padding">
          <!-- 清空按钮 -->
          <el-tag
            effect="plain"
            type="danger"
            class="header-tags"
            @click="clearWidetConfit"
            ><i class="el-icon-delete"></i><span>清空</span>
          </el-tag>
          <!-- 导入json -->
          <el-tag
            effect="plain"
            type=""
            class="header-tags"
            @click="setFormJson"
            ><i class="el-icon-connection"></i><span>导入JSON</span>
          </el-tag>
          <!-- 生成JSON -->
          <el-tag
            type=""
            effect="plain"
            class="header-tags"
            @click="saveWidetConfit"
            ><i class="el-icon-document"></i><span>生成JSON</span>
          </el-tag>
          <!-- 表单预览 -->
          <el-tag effect="plain" type="" class="header-tags" @click="showDialog"
            ><i class="el-icon-help"></i><span>表单预览</span>
          </el-tag>
        </el-header>
        <el-main class="box-padding">
          <div class="widget-form-container">
            <!-- 表单展示组件，传递当亲拖拽的表单信息 -->
            <!-- sync修饰符表示子父组件传递的参数是双向绑定的 -->
            <widgeform
              ref="configFormData"
              :configFormData="configFormData"
              :select.sync="widgetFormSelect"
            ></widgeform>
          </div>
        </el-main>
      </el-container>
      <!-- 右侧 -->
      <el-aside width="250px" class="main-left">
        <el-tabs v-model="activeName" style="margin-top: -4px">
          <el-tab-pane label="组件设置" name="first">
            <widgetconfig :eleItem.sync="widgetFormSelect"></widgetconfig>
          </el-tab-pane>
          <el-tab-pane label="表单属性" name="second">
            <formconfig :formdata="configFormData.config"></formconfig>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
    <!-- 预览弹出框 -->
    <el-dialog
      title="表单预览"
      :visible.sync="dialogVisible"
      width="70%"
      top="5vh"
    >
      <dialogform ref="dialogForm"></dialogform>
      <span slot="footer">
        <el-button type="primary" @click="getDialogForm">获取数据</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 生成json框 -->
    <el-dialog :title="dialogTitle" :visible.sync="jsonDialog" top="5vh">
      <div v-if="!jsonTextareaReadonly">
        JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可
      </div>
      <div style="max-height: 400px; overflow-y: scroll">
        <el-input
          type="textarea"
          autosize
          :readonly="jsonTextareaReadonly"
          v-model="jsonmsg"
        >
        </el-input>
      </div>
      <span slot="footer" v-if="!jsonTextareaReadonly">
        <el-button type="primary" @click="setJsonBtn">确定</el-button>
        <el-button @click="jsonDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import widgeform from "./widgetForm";
import widgetconfig from "./widgetConfig";
import dialogform from "./dialogForm";
import formconfig from "./formConfig";
import { copy as util_Copy } from "@/utils/index";
import { CommonUserComponents } from "./componentsConfig";
export default {
  components: {
    draggable: draggable,
    widgeform: widgeform,
    widgetconfig: widgetconfig,
    dialogform: dialogform,
    formconfig: formconfig,
  },
  data() {
    return {
      // 自定义表单的json数据
      CommonUserComponents,
      // 拖拽展示的数据
      configFormData: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
        },
      },
      widgetFormSelect: {
        key: null,
        options: {
          placeholder: null,
        },
      },
      // 预览弹框是否显示
      dialogVisible: false,
      // 生成json弹框
      jsonDialog: false,
      // 生成的json语句
      jsonmsg: "",
      // 弹框标题
      dialogTitle: "生成JSON",
      // 右侧头部标签栏
      activeName: "first",
      // 弹出文本域是否可编辑,默认不可编辑
      jsonTextareaReadonly: true,
    };
  },
  methods: {
    // 是否可以被拖拽
    onMove() {
      return true;
    },
    // 保存方法
    saveWidetConfit() {
      this.dialogTitle = "生成JSON";
      this.jsonTextareaReadonly = true;
      this.jsonDialog = true;
      this.jsonmsg = JSON.stringify(this.configFormData, null, 1);
    },
    // 清空方法
    clearWidetConfit() {
      this.configFormData = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
        },
      };
      this.widgetFormSelect = {
        key: null,
        options: {
          placeholder: null,
        },
      };
    },
    // 点击预览方法
    showDialog() {
      if (this.configFormData.list.length === 0) {
        this.$message("请先拖拽组件");
        return;
      }
      // 弹出预览框
      this.dialogVisible = true;
      // 异步调用弹框的方法
      setTimeout(() => {
        // 异步调用弹框中的方法传递表单数据
        this.$refs.dialogForm.setFormVal(util_Copy(this.configFormData));
      });
    },
    // 读取预览表单的数据
    getDialogForm() {
      // 读取表单生成器中的getFormVal方法获取表单填写的数据
      this.$refs.dialogForm.getFormVal().then((data) => {
        this.dialogTitle = "表单数据";
        this.jsonTextareaReadonly = true;
        this.jsonDialog = true;
        this.jsonmsg = JSON.stringify(data, null, 1);
      });
    },
    // 导入json方法
    setFormJson() {
      this.dialogTitle = "导入JSON";
      this.jsonTextareaReadonly = false;
      this.jsonDialog = true;
      this.jsonmsg = JSON.stringify(
        {
          list: [],
          config: {
            labelWidth: 100,
            labelPosition: "right",
            size: "small",
          },
        },
        null,
        1
      );
    },
    // 确定导入json
    setJsonBtn() {
      try {       
        this.initJson(this.jsonmsg)
        this.jsonDialog = false;
      } catch (error) {
        this.$message("导入JSON有误");
      }
    },
    // 初始化json，接收表单json数据，根据json数据自动渲染表单页面
    initJson(strJson) {
      this.configFormData = JSON.parse(strJson);
      this.widgetFormSelect = this.configFormData.list[0];
    },
  },
};
</script>
<style>
.container-main {
  height: 100%;
}
aside {
  margin: 0;
  background-color: transparent;
}
.header-title {
  width: 100%;
  height: 35px !important;
  line-height: 25px !important;
  padding: 0px !important;
  border-bottom: 1px solid #999999;
}
.main-right {
  border-right: 1px solid #999;
  padding: 10px;
}
.draggable-container {
  cursor: move;
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 25px;
  gap: 7px;
}

.main-bottom {
  border-bottom: 1px solid #999;
  height: 45px !important;
  line-height: 45px;
}
.main-left {
  border-left: 1px solid #999;
  padding: 10px;
}
.header-padding {
  position: relative;
  padding: 0px !important;
  text-align: right;
}
.box-padding {
  padding: 0px !important;
  position: relative;
  overflow-y: auto;
}
.widget-form-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.ghostClass {
  border: 2px solid #409eff !important;
}
.header-tags {
  margin-right: 10px;
  cursor: pointer;
}
.header-tags:nth-child(1) {
  position: absolute;
  left: 10px;
  top: 12px;
}
</style>