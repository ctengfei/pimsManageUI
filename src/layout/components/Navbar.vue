<template>
  <div class="navbar">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <el-tooltip content="插件下载" effect="dark" placement="bottom">
          <plugin id="plugin" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <el-popover placement="bottom" width="300" trigger="manual" v-model="mesVisible" @show="showMessage">
          <div slot="reference" class="right-menu-item hover-effect">
            <el-badge :value="infoNum" :max="99">
              <svg-icon width="20" height="20" icon-class="icon-xiaoxitixing1" class="xiaoxitixing-svg" @click="mesVisible = !mesVisible" />
            </el-badge>
          </div>
          <div class="message-content">
            <div class="messageInfo" v-for="item in messageList" :key="item.id">
              <p :title="item.msgBody">{{ item.msgBody }}</p>
              <p>{{ item.createTime }}</p>
            </div>
            <el-button type="text" @click="showAllMesage" class="all-message">全部消息</el-button>
          </div>
        </el-popover>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <router-link to="/user/myWorkBench">
            <el-dropdown-item>待办中心</el-dropdown-item>
          </router-link> -->
          <!-- <router-link to="/user/workOrder">
            <el-dropdown-item>我的工单</el-dropdown-item>
          </router-link> -->
          <!-- <router-link to="/user/task">
            <el-dropdown-item>我的任务</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Plugin from '@/components/Plugin'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'

import { getMessageList } from '@/api/system/message'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Screenfull,
    SizeSelect,
    Plugin,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  data() {
    return {
      messageList: [],
      mesVisible: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    },
    infoNum() {
      return this.$store.state.socket.infoNum
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            if (process.env.VUE_APP_ROUTER) {
              location.href = `${'/' + process.env.VUE_APP_ROUTER + '/'}`
            } else {
              location.href = `/`
            }
          })
        })
        .catch(() => {})
    },
    showMessage() {
      const params = {
        pageNum: 1,
        pageSize: 5,
        readed: false
      }
      getMessageList(params).then(res => {
        this.messageList = res.data.data
      })
    },
    showAllMesage() {
      this.$router.push('/system/message')
      this.mesVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-badge__content.is-fixed {
  top: 10px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding-left: 10px;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: middle;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.message-content {
  .messageInfo {
    padding: 6px 0;
    border-bottom: 1px solid #eaeefb;
    p {
      width: 100%;
      margin: 0;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .all-message {
    display: block;
    font-size: 14px;
    margin: 5px auto 0;
    color: #666;
  }
  .xiaoxitixing-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    font-size: 20px;
    vertical-align: middle !important;
  }
}
</style>
