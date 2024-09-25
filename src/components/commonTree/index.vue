<!--
 * @version:
 * @Author: dongwangs
 * @explain: 轮巡左侧树组件
 * @Date: 2021-01-22 16:17:36
 * @LastEditTime: 2022-02-14 14:52:32
 * @LastEditors: HJQ
-->
<template>
  <div>
    <div class="search" v-show="dominShow">
      <el-input
        v-if="tabData[0].name == activeName"
        placeholder="请输入设备关键字"
        v-model="searchValue"
        class="searchValue"
      >
      </el-input>
    </div>
    <div v-if="dominShow" class="tabs">
      <el-tabs
        v-model="activeName"
        :type="type"
        :closable="closeable"
        :tab-position="tabPosition"
        :before-leave="beforeLeave"
        @tab-click="switchTab"
        @tab-remove="tabRemove"
        stretch
      >
        <el-tab-pane
          v-for="(item, index) in tabData"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <div v-if="favourite">
            <div
              class="favourites"
              v-if="tabData[0].name == activeName"
              @click="collection"
            >
              一键收藏
            </div>
            <div v-else>
              <el-row
                ><el-button class="favourites" @click="createFile"
                  >创建文件夹</el-button
                >
                <el-button type="primary" class="favourites" @click="delFile"
                  >删除文件夹</el-button
                ></el-row
              >
            </div>
          </div>

          <div class="wrapTree" v-if="tabData[0].name == activeName">
            <el-tree
              ref="treeRef"
              :data="datas"
              :props="props"
              :highlight-current="highlightCurrent"
              :expand-on-click-node="expandOnClickNode"
              :default-expanded-keys="filterExpandedKeys"
              :filter-node-method="filterNode"
              :node-key="nodeKey"
              :draggable="draggable"
              :auto-expand-parent="true"
              :show-checkbox="isCheckBox"
              :default-expand-all="defaultExpandAll"
              :default-checked-keys="defaultCheckedKeys"
              :current-node-key="currentNodeKey"
              @node-click="nodeClick"
              @check="(data, checkinfo) => nodeCheck(data, checkinfo)"
              @check-change="checkChange"
              @node-expand="handleNodeExpand"
              @node-collapse="handleNodeCollapse"
              @node-contextmenu="nodeContextmenu"
              @node-drag-end="nodeDragEnd"
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              style="background-color: #f5f7fa;"
            >
              <div
                class="video-web-flex"
                slot-scope="{ node, data }"
                @mouseenter="mouseenter"
                @mouseleave="mouseleave"
              >
                <span
                  style="
                    width: 80%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                >
                  <span>{{ data.name }}</span>
                  <span style="margin-left: 5px" v-if="data.type == 'DIR'"
                    >({{ data.deviceCount }})</span
                  >
                </span>
                <!-- tabs为区域 -->
                <div v-if="item.label === '组织树'">
                  <!-- <span class="video-tree-edit" v-if="isShow">
                  <el-button
                    v-if="!node.data.favorite && node.data.type !== 'DIR'"
                    icon="el-icon-star-off"
                    circle
                    @click.stop="() => updateFavourites(node,data)">
                  </el-button>
                  <el-button
                    v-if="node.data.favorite && node.data.type !== 'DIR'"
                    icon="el-icon-star-on"
                    circle
                    @click.stop="() => onFavouriteRemove(node,data)">
                  </el-button>
                  </span> -->
                </div>

                <!-- tabs为收藏 -->
                <div v-if="item.label === '收藏'">
                  <span class="video-tree-edit">
                    <el-button
                      v-if="node.data.deviceId === null && node.level < 3"
                      icon="el-icon-circle-plus-outline"
                      circle
                      type="text"
                      @click.native="() => onFavouriteAdd(data)"
                    >
                    </el-button>
                    <el-button
                      v-if="node.data.deviceId === null"
                      type="text"
                      icon="el-icon-delete"
                      circle
                      @click.stop="() => onFavouriteRemove(node, data)"
                    >
                    </el-button>
                    <el-button
                      v-if="node.data.deviceId === null"
                      icon="el-icon-edit"
                      circle
                      type="text"
                      @click.stop="() => onFavouriteEdit(node, data)"
                    >
                    </el-button>
                    <el-button
                      v-if="!node.data.favorite && node.data.favorite !== null"
                      icon="el-icon-star-on"
                      circle
                      type="text"
                      @click.stop="() => onFavouriteCancel(node, data)"
                    >
                    </el-button>
                  </span>
                </div>
              </div>
            </el-tree>
          </div>
          <div class="wrapTree" v-else>
            <!-- 收藏列表 -->
            <div>
              <el-collapse accordion @change="fileFolder">
                <el-collapse-item
                  v-for="(items, indexs) in datas"
                  :title="items.folderName"
                  :key="indexs"
                  :name="items.id"
                  style="background-color: #f5f7fa;"
                >
                  <el-tree
                    v-if="items.childrens"
                    :ref="'treeRef' + indexs"
                    :data="items.childrens"
                    :props="props"
                    :highlight-current="highlightCurrent"
                    :expand-on-click-node="expandOnClickNode"
                    :default-expanded-keys="filterExpandedKeys"
                    :filter-node-method="filterNode"
                    :node-key="nodeKey"
                    :draggable="draggable"
                    :auto-expand-parent="true"
                    :show-checkbox="isCheckBox"
                    :default-expand-all="defaultExpandAll"
                    :default-checked-keys="defaultCheckedKeys"
                    :current-node-key="currentNodeKey"
                    @node-click="nodeClick"
                    @check="
                      (data, checkinfo) => nodeChecks(data, checkinfo, indexs)
                    "
                    @check-change="checkChange"
                    @node-expand="handleNodeExpand"
                    @node-collapse="handleNodeCollapse"
                    @node-contextmenu="nodeContextmenu"
                    @node-drag-end="nodeDragEnd"
                    :allow-drop="allowDrop"
                    :allow-drag="allowDrag"
                    style="background-color: #f5f7fa;"
                  >
                    <div
                      class="video-web-flex"
                      slot-scope="{ node, data }"
                      @mouseenter="mouseenter"
                      @mouseleave="mouseleave"
                    >
                      <span
                        style="
                          width: 80%;
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                        "
                      >
                        <span>{{ data.name }}</span>
                      </span>
                      <!-- tabs为区域 -->
                      <div v-if="item.label === '组织树'">
                        <span class="video-tree-edit" v-if="isShow">
                          <el-button
                            v-if="
                              !node.data.favorite && node.data.type !== 'DIR'
                            "
                            icon="el-icon-star-off"
                            circle
                            @click.stop="() => updateFavourites(node, data)"
                          >
                          </el-button>
                          <el-button
                            v-if="
                              node.data.favorite && node.data.type !== 'DIR'
                            "
                            icon="el-icon-star-on"
                            circle
                            @click.stop="() => onFavouriteRemove(node, data)"
                          >
                          </el-button>
                        </span>
                      </div>

                      <!-- tabs为收藏 -->
                      <div v-if="item.label === '收藏'">
                        <span class="video-tree-edit">
                          <!-- <el-button
                            v-if="!node.data.favorite && node.data.type !== 'DIR'"
                            icon="el-icon-circle-plus-outline"
                            circle
                            type="text"
                          
                            @click.native="() => onFavouriteAdd(data)">
                            </el-button>
                            <el-button
                              v-if="node.data.favorite && node.data.type == 'DIR'"
                              type="text"
                              icon="el-icon-delete"
                              circle
                              @click.stop="() => onFavouriteRemove(node, data)">

                            </el-button>
                            <el-button
                              v-if="node.data.deviceId === null"
                              icon="el-icon-edit"
                              circle
                              type="text"
                              @click.stop="() => onFavouriteEdit(node,data)">
                            </el-button> -->
                          <el-button
                            v-if="
                              node.data.favorite && node.data.favorite !== 'DIR'
                            "
                            icon="el-icon-star-on"
                            type="text"
                            circle
                            @click.stop="
                              () => onFavouriteCancel(node, data, items.id)
                            "
                          >
                          </el-button>
                        </span>
                      </div>
                    </div>
                  </el-tree>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="domaincss">
      <el-tree
        ref="treeRef"
        :data="datas"
        :props="props"
        :highlight-current="highlightCurrent"
        :expand-on-click-node="expandOnClickNode"
        :default-expanded-keys="filterExpandedKeys"
        :filter-node-method="filterNode"
        :node-key="nodeKey"
        :draggable="draggable"
        :auto-expand-parent="true"
        :show-checkbox="isCheckBox"
        :default-expand-all="defaultExpandAll"
        :default-checked-keys="defaultCheckedKeys"
        :current-node-key="currentNodeKey"
        @node-click="nodeClick"
        @check="nodeCheck"
        @check-change="checkChange"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
        @node-contextmenu="nodeContextmenu"
        @node-drag-end="nodeDragEnd"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
      >
        <span
          slot-scope="{ node, data }"
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
          :class="{ 'custom-tree-node': true, 'node-click': flag == data.code }"
          style="width: 100%"
        >
          <span>
            <i
              v-if="node.data.deviceId === null"
              style="color: #ffcf5c"
              class="iconfont iconwenjianjia"
            />
            <span
              style="
                width: 80%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
              >{{ data.name }}</span
            >
          </span>
          <!-- tabs为区域 -->
          <span>
            <span
              class="video-tree-edit"
              v-if="node.data.type === 'FIXED_DEVICE' && isShow"
            >
              <!-- 标签 -->
              <el-button
                icon="el-icon-collection-tag"
                circle
                @click="() => updateMark(data)"
              >
              </el-button>
              <!-- 收藏 -->
              <el-button
                icon="el-icon-star-on"
                circle
                @click="() => updateFavourites(node, data, 1)"
              >
              </el-button>
            </span>
          </span>
        </span>
      </el-tree>
    </div>
    <div
      v-if="isShowContextMenu && !isShow"
      ref="contextMenuRef"
      class="contextmenu"
      @mouseleave="leaveEvent"
    >
      <ul>
        <li @click="addCollect">添加收藏</li>
        <li @click="addMark">添加标签</li>
        <li v-show="isShowDeleteTag" @click="deleteMark">删除标签</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getDeviceInfoById } from "@/api/system/organization";
import { reAllTagsInDevice } from "@/api/mutiTree";
import { Message } from "element-ui";

export default {
  props: {
    districtList: Array,
    favouriteList: Array,
    props: {
      // 配置选项
      type: Object,
      require: true,
      default() {
        return {};
      },
    },
    treeRef: {
      // 操作DOM用。
      type: String,
      require: false,
      default: "tree",
    },
    expandOnClickNode: {
      // 是否在点击节点的时候展开或者收缩节点
      type: Boolean,
      require: false,
      default: false,
    },
    highlightCurrent: {
      // 高亮当前选中节点，默认值是 true。
      type: Boolean,
      require: false,
      default: true,
    },
    defaultExpandedKeys: {
      // 默认展开的节点
      type: Array,
      require: false,
      default() {
        return [];
      },
    },

    defaultCheckedKeys: {
      // 默认勾选的节点的
      type: Array,
      require: false,
      default() {
        return [];
      },
    },
    nodeKey: {
      // 树唯一标识
      type: String,
      require: true,
      default: "",
    },
    defaultExpandAll: {
      // 默认展开所有节点
      type: Boolean,
      require: false,
      default: false,
    },
    isShow: {
      type: Boolean,
      require: false,
      default: false,
    },
    tabData: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
    },
    closeable: {
      type: Boolean,
      default: false,
    },
    addable: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    tabPosition: {
      type: String,
      default: "top",
    },
    stretch: {
      type: Boolean,
      default: false,
    },
    beforeLeave: {
      type: Function,
    },
    // searchValue: {
    //   type: String,
    // },
    allTagsOptions: {
      type: Array,
      default: function () {
        return [];
      },
    },
    collectCascaderOptions: {
      type: Array,
      default: function () {
        return [];
      },
    },
    isShowContextmenu: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    dominShow: {
      type: Boolean,
      default: true,
    },
    isCheck: {
      type: String,
      default: "",
    },
    currentNodeKey: {
      type: String,
      default: "",
    },
    // 收藏夹按钮
    favourite: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rightNav: false, // 控制右键菜单显示与隐藏
      id: 999,
      treeValue: "",
      num: 0, // 每次只能添加一个，或者编辑一个，多个则为bug
      treeClickCount: 0,
      draggableData: [],
      activeName: this.tabData[0].name,
      tableData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      isShowContextMenu: false, //是否开启右键点击功能
      isShowDeleteNode: false, // 默认不展示收藏树节点上的删除按钮
      isShowDeleteTag: false, // 默认不展示删除标签按钮
      searchValue: "", // 搜索的值
      cascaderProps: {
        value: "id",
        label: "name",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false,
      },
      defaultShowNodes: [],
      filterExpandedKeys: [],
      activeNames: "",
      checkChangeArr: [],
      checkNodeObj: {},
      // isCheckBox: this.showCheckBox
    };
  },
  created() {},
  mounted() {
    this.getTreeRef();
    // window.addEventListener('click', this.handleClickEvent)
  },
  computed: {
    isCheckBox() {
      if (this.isCheck === "") {
        return false;
      } else {
        if (this.activeName === "first") {
          return true;
        } else {
          return true;
        }
      }
    },
    datas() {
      if (this.activeName === "first") {
        return this.districtList;
      } else {
        return this.favouriteList;
      }
    },
  },
  watch: {
    currentNodeKey(val) {
      if (this.dominShow) {
        this.$nextTick(() => {
          this.$refs.treeRef[0].setCurrentKey(this.currentNodeKey);
        });
        this.filterExpandedKeys = [this.currentNodeKey];
      } else {
        this.$nextTick(() => {
          this.$refs.treeRef.setCurrentKey(this.currentNodeKey);
        });
        this.filterExpandedKeys = [this.currentNodeKey];
      }
    },
    searchValue(val) {
      if (this.activeName === "first") {
        console.log("this.$refs.treeRef", this.$refs.treeRef);
        this.$refs.treeRef[0].filter(val);
      } else if (this.activeName === "second") {
        console.log("this.$refs.treeRef", this.$refs.treeRef);
        this.$refs.treeRef[1].filter(val);
      }
    },
    defaultExpandedKeys(newVal, oldVal) {
      this.filterExpandedKeys = newVal;
    },
  },
  methods: {
    // 一键收藏
    collection() {
      this.$emit("collection");
    },
    // 创建文件夹
    createFile() {
      this.$emit("createFile");
    },
    //删除文件夹
    delFile() {
      this.$emit("delFile");
    },
    // 根据收藏夹请求收藏树
    fileFolder(e) {
      this.$emit("fileFolder", e);
    },
    /* 点击节点 */
    nodeClick(data, node, tree) {
      if (!this.nodeKey) return;
      // 记录点击次数
      this.treeClickCount++;
      // 单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
      if (this.treeClickCount >= 2) {
        return;
      }
      // 计时器,计算200毫秒为单位,可自行修改
      this.timer = window.setTimeout(() => {
        if (this.treeClickCount === 1) {
          //  把次数归零
          this.treeClickCount = 0;
          //  单击事件
          this.$emit("handleNodeClick", data, this.activeName);
        } else if (this.treeClickCount > 1) {
          //  把次数归零
          this.treeClickCount = 0;
          //  双击事件
          this.$emit("handleNodeDblclick", data, node, tree);
        }
      }, 500);
    },
    // 节点拖拽
    nodeDragEnd(node, prenode, pis, evt) {
      this.$emit("handleNodeDragEnd", node, prenode, pis, evt);
    },
    // 节点选中便哈
    checkChange(data, node, childNode) {
      // console.log('data ==33==', data)
      // console.log('node ===333=', node)
      // console.log('childNode ===33=', childNode)
    },
    /* 对树节点过滤 */
    filterNode(value, data, node) {
      if (!value) {
        this.filterExpandedKeys = [];
        this.defaultExpandAll = false;
        return true;
      }
      return data[this.props.label].includes(value);
    },

    /* 把树的ref传给父组件 */
    getTreeRef() {
      this.$emit("getTreeRef", this.$refs[this.treeRef]);
    },

    /* 点击复选框 */
    nodeCheck(node, obj) {
      if (this.activeName === "first") {
        let nodeIds = this.$refs["treeRef"][0].getNode(node.id);
        this.$emit("nodeCheck", node, obj, nodeIds);
        // this.$emit('nodeCheck', node, obj)
      } else {
        this.$emit("nodeCheck", node, obj);
      }
      // 父组件事件名:check
    },
    // 收藏列表复选框
    nodeChecks(node, obj, index) {
      let temp = {
        [`treeRef${index}`]: obj.checkedNodes,
      };
      this.checkNodeObj = Object.assign({}, this.checkNodeObj, temp);
      let objArr = [];
      Object.keys(this.checkNodeObj).map((key, item) => {
        objArr = objArr.concat(this.checkNodeObj[key]);
      });
      let objs = {};
      let set = objArr.reduce((cur, next) => {
        objs[next.id] ? "" : (objs[next.id] = true && cur.push(next));
        return cur;
      }, []);
      //这里演示的是：如果有相同id，就去掉
      this.$emit("nodeChecks", node, obj, set);
    },
    // 默认展开的节点
    handleNodeExpand(data) {
      let flag = false;
      this.filterExpandedKeys.some((item) => {
        if (item === data.id) {
          // 判断当前节点是否存在， 存在不做处理
          flag = true;
          return true;
        }
      });
      if (!flag) {
        // 不存在则存到数组里
        // this.filterExpandedKeys.push(data.id);
      }
      console.log("ss66666", this.filterExpandedKeys);
    },
    handleNodeCollapse(data) {
      // 删除当前关闭的节点
      this.filterExpandedKeys.some((item, i) => {
        if (item === data.id) {
          this.filterExpandedKeys.splice(i, 1);
        }
      });
    },
    /* 节点鼠标右键 */
    async nodeContextmenu(event, obj, node, self) {
      // 如果没有多选框 或 禁用右键菜单
      // if (!this.showCheckbox || this.props.disabledRightMenu) {
      //   return // 右键不显示菜单。
      // }
      this.$emit("nodeContextmenu", event, obj, node, self); // 右键时触发父组件事件@right-menu-data，获取值
      this.nodeContextmenuObj = obj;
      // console.log(obj, 'obj11')
      // console.log(event.pageX, event.pageY, obj.type, node, self)
      // 右击设备查询设备标签
      if (obj.type === "DEVICE" && this.isShowContextmenu === true) {
        const res = await reAllTagsInDevice(obj.id);
        if (!res.data) {
          this.isShowDeleteTag = false;
        } else {
          this.isShowDeleteTag = true;
        }
        this.isShowContextMenu = true;
        this.$nextTick(() => {
          this.$refs.contextMenuRef.style.left = event.pageX - 10 + "px";
          this.$refs.contextMenuRef.style.top = event.pageY - 10 + "px";
        });
      }
    },
    // 右键勾选递归
    getTreeCheck(dataAll, data, childrenName, code) {
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (this.checkedKeys.indexOf(data[i][code]) === -1) {
            this.checkedKeys.push(data[i][code]);
          }
          if (data[i][childrenName] && data[i][childrenName].length > 0) {
            this.getTreeCheck(
              dataAll,
              data[i][childrenName],
              childrenName,
              code
            );
          }
          this.$refs[this.treeRef].setCheckedKeys(this.checkedKeys);
        }
      }
    },
    updateMark(data) {
      this.$emit("updateMark", data);
    },
    updateFavourites(node, data) {
      this.$emit("updateFavourites", data);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      this.$emit("removeNode", node, data);
    },
    // edit(node, data) {
    //   this.num++
    //   if (this.num > 1) return
    //   node.data.flag = false
    // },
    datadragEnd(evt) {
      // console.log('evt ---', evt)
      this.$emit("treeDrag", evt);
    },
    datadragMove(evt) {},
    // 收藏设备
    addCollect() {
      // console.log('收藏设备')
      this.$emit("addCollect");
    },
    // 取消收藏
    deleteCollect() {
      // console.log('取消收藏')
      this.$emit("deleteCollect");
    },
    // 触发添加标签
    addMark() {
      this.$emit("addMark");
    },
    // 触发删除标签
    deleteMark() {
      this.$emit("deleteTag");
    },
    // 切换tab
    switchTab(tab, event) {
      this.activeName = tab.name;
      // if (this.isCheck === '') {
      //   this.isCheckBox = false
      // } else {

      // }
      // 切换tab, 置空搜索框的值
      this.searchValue = "";
      this.$emit("switchTab", tab, event);
    },
    tabRemove(name) {
      // console.log(name, 'name')
      this.$emit("tabRemove", name);
    },
    leaveEvent() {
      this.isShowContextMenu = false;
    },
    showOperateBtn(e) {
      e.target.children[1].style.display = "inline-block";
    },
    hiddenOperateBtn(e) {
      e.target.children[1].style.display = "none";
    },
    // 在收藏树下, 鼠标进入节点,显示删除按钮
    mouseenter(e) {
      if (this.activeName === "first") {
        return;
      }
      // e.target.children[1].style.display = 'inline-block'
    },
    mouseleave(e) {
      if (this.activeName === "first") {
        return;
      }
      // e.target.children[1].style.display = 'none'
    },
    // 触发收藏树下删除事件
    deleteColloctNode(data) {
      // console.log(data, 'data')
      this.$emit("deleteColloctNode", data);
    },
    // 改变下拉选择的值
    changeSelect(value) {
      this.$emit("changeSelect", value);
    },
    // 触发父组件中通过标签搜索设备事件
    //      searchDeviceByTag() {
    //        if (this.activeName === 'first') {
    //          this.filterExpandedKeys = []
    //          // console.log('执行通过标签搜索设备')
    //          this.$emit('searchDeviceByTag', this.searchValue)
    //        } else {
    //          // console.log('执行通过收藏夹搜索设备')
    //          if (this.searchValue === null) {
    //            this.searchValue = ''
    //          }
    //          this.$emit('searchDeviceByCollect', this.searchValue)
    //        }
    //      },
    handleVisibleChange(flag) {
      if (flag && this.$refs.cascaderRef.getCheckedNodes().length === 0) {
        // 重置激活路径，级联下拉框恢复默认，收起展开节点路径面板
        this.$refs.cascaderRef.panel.activePath = [];
        this.$refs.cascaderRef.panel.syncActivePath();
      }
    },
    //  拖拽后不改变层级结构
    allowDrop() {
      return false;
    },
    allowDrag(draggingNode) {
      return !draggingNode.data.children;
    },
    // async getDeviceInfoByIdFun(id) {
    //   getDeviceInfoById(id)
    // },
    // async getTreeData() {
    //   const res = await treeData(true)
    //   this.tableData = res.data[0].children
    // },

    // 以下为收藏树的节点的功能
    onFavouriteAdd(node, data) {
      this.$emit("onFavouriteAdd", data);
    },
    onFavouriteEdit(node) {
      this.$emit("onFavouriteEdit", node);
    },
    onFavouriteCancel(node, data, id) {
      this.$emit("onFavouriteCancel", node, "cancel", id);
    },
    onFavouriteRemove(node) {
      this.$emit("onFavouriteRemove", node);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/element-variables.scss";
// .domaincss {
//   overflow: auto;
//   font-size: 14px;
//   .el-tree {
//     background: transparent;
//   }
//   .el-tree-node__content:hover {
//     background-color: #F5F7FA !important;
//   }
//   .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
//     background-color: #edf6ff !important;
//   }
// }
::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-tree-node.is-expanded > .el-tree-node__children {
  font-size: 14px !important;
}
::v-deep .el-collapse-item__header{
  background-color: #f5f7fa;
}
.favourites {
  cursor: pointer;
  margin: 10px 20px;
}
::v-deep .el-tabs__item {
  padding: 0 !important;
}
::v-deep .el-tabs__item.is-active {
  background: $--color-primary;
  color: #fff;
}
.wrapTree {
  padding: 10px;
  // background: #fff;
  background-color: #f5f7fa;
}
</style>
