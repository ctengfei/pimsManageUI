<template>
  <div class="basicWrap" ref="basicWrap">
    <div class="imgInfo">
      <img :src="fwzpUrl" alt="" />
    </div>
    <div class="otherInfo">
      <div>
        <span class="xm">{{ info.fwdzxz }}</span>
        <p class="sfz">房主姓名：{{ info.fzxm }}</p>
      </div>
      <div class="infoMsg">
        <el-row type="flex" justify="space-between">
          <el-col>
            <div>联系方式：{{ info.fzlxfs }}</div>
            <div>
              房屋类别：<span v-for="item in fwlbLable" :key="item.value">{{
                item.label
              }}</span>
            </div>
            <div>
              房屋用途：<span v-for="item in fwytLabel" :key="item.value">{{
                item.label
              }}</span>
            </div>
          </el-col>
          <el-col>
            <div>
              产权性质：<span v-for="item in fwcqLable" :key="item.value">{{
                item.label
              }}</span>
            </div>
            <div>房屋面积：{{ info.fwmj }}</div>
            <div>产权证号：{{ info.fwcqzh }}</div>
          </el-col>
          <el-col>
            <div>
              隐患类型：<span v-for="item in yhlxLable" :key="item.value">{{
                item.label
              }}</span>
            </div>
            <div>房屋间数：{{ info.fwjs }}</div>
            <div>
              是否出租房：<span v-for="item in yesnoLable" :key="item.value">{{
                item.label
              }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  dicts: ['ga_fwlb', 'ga_fwyt', 'ga_fwcq', 'sys_yes_no', 'gb_yhlx'],
  data() {
    return {
      info: '',
      fwzpUrl: '',
      fwlbDicts: [],
      fwytDicts: [],
      fwcqDicts: [],
      yesnoDicts: [],
      yhlxDicts: []
    }
  },
  computed: {
    fwlbLable: function () {
      return this.fwlbDicts.filter((item) => {
        return item.value == this.info.fwlx
      })
    },
    fwytLabel: function () {
      return this.fwytDicts.filter((item) => {
        return item.value == this.info.fwyt
      })
    },
    fwcqLable: function () {
      return this.fwcqDicts.filter((item) => {
        return item.value == this.info.fwcqxz
      })
    },
    yesnoLable: function () {
      return this.yesnoDicts.filter((item) => {
        return item.value == this.info.sfczfw
      })
    },
    yhlxLable: function () {
      return this.yhlxDicts.filter((item) => {
        return item.value == this.info.yhlx
      })
    }
  },
  mounted() {
    this.info = this.$route.params
    if (this.info.fwzp && this.info.fwzp != null && this.info.fwzp != '') {
      this.fwzpUrl = process.env.VUE_APP_BASE_API + this.info.fwzp
    } else {
      this.fwzpUrl = require('@/assets/images/wutouxiang.svg')
    }
    this.fwlbDicts = this.dict?.type?.ga_fwlb
    this.fwytDicts = this.dict?.type?.ga_fwyt
    this.fwcqDicts = this.dict?.type?.ga_fwcq
    this.yesnoDicts = this.dict?.type?.sys_yes_no
    this.yhlxDicts = this.dict?.type?.gb_yhlx
    let height =this.$refs.basicWrap.clientHeight + 39
    console.log(height)
    this.$store.commit("app/gefwtHeight",height)
  }
}
</script>

<style lang="less" scoped>
.basicWrap {
  margin-bottom: 41px;
  padding: 18px 39px 0 18px;
  display: flex;
  .imgInfo {
    width: 152px;
    height: 194px;
    // background: #d8d8d8;
    // border: 1px solid #e0e4ea;
    margin-right: 19px;
    margin-bottom: 4px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .otherInfo {
    height: 198px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .infoMsg {
      background-color: #fafbfc;
      padding: 13px 22px;
      & > .el-row > .el-col {
        div {
          padding-bottom: 18px;
          font-size: 14px;

          font-weight: 400;
          color: #1f2552;
          &:last-child {
            padding-bottom: 0;
          }
        }
      }
    }
    .xm {
      font-size: 20px;

      font-weight: 600;
      color: #1f2552;
      margin-right: 12px;
    }
    .sfz {
      font-size: 18px;

      font-weight: 400;
      color: #1f2552;
    }
  }
}
</style>
