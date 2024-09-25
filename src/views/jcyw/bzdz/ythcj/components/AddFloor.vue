<template>
  <el-row
    style="
      margin-left: 0px;
      margin-right: 0px;
      width: 100%;
      height: 94%;
      display: flex;
      flex-direction: column;
    "
    ref="box"
  >
    <el-col
      :span="24"
      style="
        background: #fafbfc;
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 20px;
      "
      v-if="!hasFloor"
    >
      <el-col :span="3" style="display: flex">
        <div style="margin-right: 5px">
          <img src="@/assets/images/loushang.svg" alt="light" />
        </div>
        <div>地上</div>
      </el-col>
      <el-col :span="7">
        单元数
        <el-input-number
          v-model="dsdys"
          size="mini"
          :min="0"
          :max="20"
          label="描述文字"
        ></el-input-number>
      </el-col>
      <el-col :span="7">
        楼层数
        <el-input-number
          v-model="dslcs"
          size="mini"
          :min="0"
          :max="50"
          label="描述文字"
        ></el-input-number>
      </el-col>
      <el-col :span="7">
        单层户数
        <el-input-number
          v-model="dsdchs"
          size="mini"
          :min="0"
          :max="50"
          label="描述文字"
        ></el-input-number>
      </el-col>
    </el-col>

    <el-col
      :span="24"
      style="
        background: #fafbfc;
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 20px;
      "
      v-if="!hasFloor"
    >
      <el-col :span="3" style="display: flex">
        <div style="margin-right: 5px">
          <img src="@/assets/images/loushang.svg" alt="light" />
        </div>
        <div>商铺</div>
      </el-col>
      <el-col :span="7">
        单元户
        <el-input-number
          v-model="mlfdyhs"
          size="mini"
          :min="0"
          :max="50"
          label="描述文字"
        ></el-input-number>
      </el-col>
      <el-col :span="7">
        楼层数
        <el-input-number
          v-model="mlflcs"
          size="mini"
          :min="0"
          :max="10"
          label="描述文字"
        ></el-input-number>
      </el-col>
    </el-col>

    <el-col
      :span="24"
      style="
        background: #fafbfc;
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 20px;
      "
      v-if="!hasFloor"
    >
      <el-col :span="3" style="display: flex">
        <div style="margin-right: 5px">
          <img src="@/assets/images/loushang.svg" alt="light" />
        </div>
        <div>地下</div>
      </el-col>
      <el-col :span="7">
        单元数
        <el-input-number
          v-model="dxdys"
          size="mini"
          :min="0"
          :max="20"
          label="描述文字"
        ></el-input-number>
      </el-col>
      <el-col :span="7">
        楼层数
        <el-input-number
          v-model="dxlcs"
          size="mini"
          :min="0"
          :max="20"
          label="描述文字"
        ></el-input-number>
      </el-col>
      <el-col :span="7">
        单层户数
        <el-input-number
          v-model="dxdchs"
          size="mini"
          :min="0"
          :max="50"
          label="描述文字"
        ></el-input-number>
      </el-col>
    </el-col>
    <el-col
      :span="24"
      :class="!hasFloor ? 'floor-box height-s' : 'floor-box height-l'"
    >
      <el-row :span="24">
        <!-- 地上 -->
        <el-col
          :span="24"
          style="display: flex; justify-content: space-between"
        >
          <div class="danyuan-box" v-for="item in this.dsdys" :key="item.index">
            <div class="danyuan-title">{{ item }}单元</div>
            <div class="dayuan-line"></div>
            <div class="table-box">
              <table class="contain"></table>
            </div>
          </div>
        </el-col>
        <!-- 门脸房 -->
        <el-col :span="24" v-if="mlflcs" style="margin-top: 10px" id="test">
          <el-row :span="24" style="height: 15px; overflow: hidden">
            <div v-for="item in boxNum" :key="item">
              <div style="float: left">
                <div
                  style="
                    width: 21px;
                    height: 8px;
                    background: #4ca9ff;
                    position: relative;
                    z-index: 10;
                    border-radius: 0 0 3px 3px;
                  "
                ></div>
                <div
                  style="
                    width: 21px;
                    height: 10px;
                    background: #1890ff;
                    position: relative;
                    z-index: 5;
                    top: -5px;
                    border-radius: 0px 0px 10px 10px;
                  "
                ></div>
              </div>
              <div style="float: left">
                <div
                  style="
                    width: 21px;
                    height: 8px;
                    background: #a2d2ff;
                    position: relative;
                    z-index: 10;
                    border-radius: 0 0 3px 3px;
                  "
                ></div>
                <div
                  style="
                    width: 21px;
                    height: 10px;
                    background: #5ea2e1;
                    position: relative;
                    z-index: 5;
                    top: -5px;
                    border-radius: 0px 0px 10px 10px;
                  "
                ></div>
              </div>
            </div>
          </el-row>
          <el-row :span="24" style="display: flex">
            <div
              style="border: 2px solid #1890ff; width: 99%; margin-top: 10px"
            >
              <table
                class="contain-mlf"
                cellspacing="9"
                cellpadding="12"
                border="1"
              ></table>
            </div>
          </el-row>
        </el-col>
        <!-- 地下 -->
        <el-col
          :span="24"
          v-if="dxdys"
          style="
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          "
        >
          <div class="danyuan-box" v-for="item in this.dxdys" :key="item.index">
            <div class="table-box">
              <div class="dayuan-line"></div>
              <div class="danyuan-title">地下{{ item }}单元</div>
              <table class="contain-dx"></table>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { getZhzzJcywBzdzYthcjTreeById } from "@/api/jcyw/bzdz/ythcj";
export default {
  props: {
    floorId: "",
  },
  data() {
    return {
      dsdys: 0,
      dslcs: 0,
      dsdchs: 0,
      mlflcs: 0,
      mlfdyhs: 0,
      dxdys: 0,
      dxlcs: 0,
      dxdchs: 0,
      floorData: [],
      hasFloor: null,
      boxNum: null,
    };
  },
  watch: {
    dsdys(val) {
      this.$emit("getDsdys", val);
      this.$nextTick(() => {
        if (this.dslcs == 0) {
          this.dslcs = 1;
        }
        if (this.dsdchs == 0) {
          this.dsdchs = 1;
        }
        this.createFloor();
        this.addBoxNum();
      });
    },
    dslcs(val) {
      if (this.dsdys == 0) {
        this.dsdys = 1;
      }
      if (this.dsdchs == 0) {
        this.dsdchs = 1;
      }
      this.$emit("getDslcs", val);
      this.createFloor();
    },
    dsdchs(val) {
      if (this.dsdys == 0) {
        this.dsdys = 1;
      }
      if (this.dslcs == 0) {
        this.dslcs = 1;
      }
      this.$emit("getDsdchs", val);
      this.createFloor();
      this.addBoxNum();
    },
    mlflcs(val) {
      this.$emit("getMlflcs", val);
      this.$nextTick(() => {
        if (this.mlfdyhs == 0) {
          this.mlfdyhs = 1;
        }
        this.createFloor();
      });
    },
    mlfdyhs(val) {
      this.$emit("getMlfdyhs", val);
      this.$nextTick(() => {
        if (this.mlflcs == 0) {
          this.mlflcs = 1;
        }
        this.createFloor();
        this.addBoxNum();
      });
    },
    dxdys(val) {
      this.$emit("getDxdys", val);
      this.$nextTick(() => {
        if (this.dxlcs == 0) {
          this.dxlcs = 1;
        }
        if (this.dxdchs == 0) {
          this.dxdchs = 1;
        }
        this.createFloor();
        this.addBoxNum();
      });
    },
    dxlcs(val) {
      if (this.dxdys == 0) {
        this.dxdys = 1;
      }
      if (this.dxdchs == 0) {
        this.dxdchs = 1;
      }
      this.$emit("getDxlcs", val);
      this.createFloor();
      this.addBoxNum();
    },
    dxdchs(val) {
      if (this.dxdys == 0) {
        this.dxdys = 1;
      }
      if (this.dxlcs == 0) {
        this.dxlcs = 1;
      }
      this.$emit("getDxdchs", val);
      this.createFloor();
      this.addBoxNum();
    },
  },
  methods: {
    setHeight() {
      let box = this.$refs.box.offsetHeight;
      console.log(box);
    },
    createFloor() {
      if (this.dsdys) {
        this.createDsFloor();
      }
      if (this.mlflcs) {
        this.createMlfFloor();
      }
      if (this.dxdys) {
        this.createDxFloor();
      }
    },
    createDsFloor() {
      let doms = document.querySelectorAll(".contain");
      let arr = [];
      for (let i = 0; i < this.dslcs; i++) {
        arr[i] = [];
        for (let j = 0; j < this.dsdchs; j++) {
          arr[i][j] = `${i + 1 + this.mlflcs}0${j + 1}室`;
        }
      }
      for (let n = 0; n < doms.length; n++) {
        let str = "";
        for (let i = arr.length + this.mlflcs; i > this.mlflcs; i--) {
          str += "<tr>";
          str += `<td>${i}层</td>`;
          for (let j = 0; j < arr[i - 1 - this.mlflcs].length; j++) {
            str += `<td><input type="text" value='${
              arr[i - 1 - this.mlflcs][j]
            }' style='width: 50px;text-align: center;'></td>`;
          }
          str += "</tr>";
        }
        doms[n].innerHTML = str;
      }
    },
    createMlfFloor() {
      let arr = [];
      for (let i = 0; i < this.mlflcs; i++) {
        arr[i] = [];
        for (let j = 0; j < this.mlfdyhs; j++) {
          arr[i][j] = `${i + 1}0${j + 1}室`;
        }
      }
      let str = "";
      for (let i = arr.length - 1; i >= 0; i--) {
        str += "<tr>";
        str += `<td>${i + 1}层</td>`;
        for (let j = 0; j <= arr[i].length - 1; j++) {
          str += `<td><input type="text" value='${arr[i][j]}' style='width: 50px;text-align: center;'></td>`;
        }
        str += "</tr>";
      }
      document.querySelector(".contain-mlf").innerHTML = str;
    },
    createDxFloor() {
      let doms = document.querySelectorAll(".contain-dx");
      let arr = [];
      for (let i = 0; i < this.dxlcs; i++) {
        arr[i] = [];
        for (let j = 0; j < this.dxdchs; j++) {
          arr[i][j] = `B${i + 1}0${j + 1}室`;
        }
      }
      for (let n = 0; n < doms.length; n++) {
        let str = "";
        for (let i = 1; i <= arr.length; i++) {
          str += "<tr>";
          str += `<td>B${i}层</td>`;
          for (let j = 0; j <= arr[i - 1].length - 1; j++) {
            str += `<td><input type="text" value='${
              arr[i - 1][j]
            }' style='width: 50px;text-align: center;'></td>`;
          }
          str += "</tr>";
        }
        doms[n].innerHTML = str;
      }
    },
    getZhzzJcywBzdzYthcjTreeById(id) {
      getZhzzJcywBzdzYthcjTreeById(id).then((res) => {
        if (res.data && res.data.length) {
          this.hasFloor = true;
          this.$emit("getDrawerFloorTitle", "查看层户结构");
          this.floorData = res.data;
          this.formatNum();
          this.$nextTick(() => {
            this.createFloor();
          });
        } else {
          this.hasFloor = false;
          this.$emit("getDrawerFloorTitle", "创建层户结构");
        }
      });
    },
    formatNum() {
      for (let n = 0; n < this.floorData.length; n++) {
        if (this.floorData[n].label.includes("B")) {
          this.dxdys++;
          if (this.floorData[n].children && this.floorData[n].children.length) {
            this.dxlcs = this.floorData[n].children.length;
            this.dxdchs = this.floorData[n].children[0].children.length;
          }
        } else if (this.floorData[n].label.length == 0) {
          if (this.floorData[n].children && this.floorData[n].children.length) {
            this.mlflcs = this.floorData[n].children.length;
            this.mlfdyhs = this.floorData[n].children[0].children.length;
          }
        } else {
          this.dsdys++;
          if (this.floorData[n].children && this.floorData[n].children.length) {
            this.dslcs = this.floorData[n].children.length;
            this.dsdchs = this.floorData[n].children[0].children.length;
          }
        }
      }
    },
    addBoxNum() {
      if (this.mlflcs) {
        this.$nextTick(() => {
          let wid = document.getElementById("test").offsetWidth;
          this.boxNum = Math.ceil(wid / 42);
        });
      }
    },
  },
  mounted() {
    this.getZhzzJcywBzdzYthcjTreeById(this.floorId);
    this.setHeight();
  },
};
</script>
<style lang="less" scoped>
.el-input-number--mini {
  margin-left: 10px;
}
table {
  margin: 10px 5px;
}
// 滚动条样式
div::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
div::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
div::-webkit-scrollbar-thumb {
  background: #d8d8d8;
  border-radius: 5px;
}
.danyuan-box {
  margin-right: 15px;
}
.table-box {
  border-left: 2px solid #1890ff;
  border-right: 2px solid #1890ff;
  border-bottom: 2px solid #1890ff;
  border-top: 15px solid #1890ff;
}
.danyuan-title {
  width: 40%;
  height: 26px;
  margin: 0 auto;
  text-align: center;
  background: #e0e7ef;
  font-size: 16px;
  line-height: 26px;

  font-weight: 500;
  color: #388cff;
}
.dayuan-line {
  width: 30%;
  height: 10px;
  margin: 0 auto;
  border-left: 15px solid #e0e7ef;
  border-right: 15px solid #e0e7ef;
}
.floor-box {
  background: #fafbfc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: auto;
  display: flex;
}
.height-s {
  // height: 370px;
  flex: 1;
}
.height-l {
  height: 700px;
}
</style>
<style lang="less" >
.contain,
.contain-mlf,
.contain-dx {
  td,
  th {
    padding: 8px;
    border: 1px solid;
    font-size: 12px;
  }
}
.contain td,
.contain-mlf td,
.contain-dx td,
.contain th,
.contain-mlf th,
.contain-dx th {
  padding: 8px;
  border: 0px;
  font-size: 12px;
  line-height: 14px;
  width: 50px;
  white-space: nowrap;
  input,
  button {
    color: #1890ff;
    border: 1px solid;
  }
}
.contain tr,
.contain-mlf tr,
.contain-dx tr,
.contain tr,
.contain-mlf tr,
.contain-dx tr {
  background: #f7f7f7;
  border: 5px solid white;
  box-sizing: border-box;
}
</style>
