<template>
  <div class="login">
    <div class="swipers">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in logoBg" :key="item">
          <img class="bgclass" :src="item" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="fixedBlock">
      <div class="logoTop">
        <div class="logoTopLeft">
          <div class="setitle">
            <span class="login-title">{{ title }}</span>
          </div>
          <!-- <h1></h1>
          <div class="setLogin">欢迎登录</div> -->
        </div>
        <!-- <div class="logoTopRig">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click">
            <div slot="reference" class="qrMa">
              <span>园区管理APP</span>
              <svg-icon
                icon-class="erweima"
                class="el-input__icon input-icon"
              />
            </div>
            <div class="APP">
              <p style="color: #000">推荐使用手机浏览器下载</p>
              <img
                src="@/assets/images/app.png"
                alt=""
                style="width: 70%; height: auto"
              />
              <p style="color: #000">安卓</p>
            </div>
          </el-popover>
        </div> -->
      </div>
      <div class="contentWarp">
        <div class="tabMain">
          <div class="tabContent">
            <div v-for="(item, index) in tabListMain" :key="index">
              <div v-show="index == activeIndex">
                <div class="tabTopCont">
                  <svg aria-hidden="true" class="tabImg svg-icon">
                    <use :href="item.img" />
                  </svg>
                  {{ item.content }}
                </div>
                {{ item.des }}
              </div>
            </div>
          </div>
          <div class="tabList">
            <div class="tabItem" v-for="(item, index) in tabList" :key="index" @click="tabClick(index)">
              <div>
                {{ item }}
                <div :class="{ actives: activeIndex == index }"></div>
              </div>
              <span></span>
            </div>
          </div>
        </div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <h3 class="title">智慧园区综合安防系统</h3>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" autocomplete="off" placeholder="账号">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" show-password autocomplete="off" placeholder="密码" @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="captchaEnabled">
            <el-input v-model="loginForm.code" autocomplete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img" />
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
          <el-form-item style="width: 100%">
            <el-button :loading="loading" size="medium" type="primary" style="width: 100%" @click.native.prevent="handleLogin">
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div style="float: right" v-if="register">
              <router-link class="link-type" :to="'/register'">立即注册</router-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span>⋅</span>
      <a href="#" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { getDicts } from '@/api/system/dict/data'
import logobg1 from '@/assets/images/bg-11.png'
import logobg2 from '@/assets/images/bg-22.png'
// import logobg3 from '@/assets/images/bg3.jpg'
// import logobg4 from '@/assets/images/bg4.jpg'
// import logobg5 from '@/assets/images/bg5.jpg'
// import logobg6 from '@/assets/images/bg6.jpg'

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
      // logobg3, logobg4, logobg5, logobg6
      logoBg: [logobg1, logobg2],
      tabListMain: [
        {
          img: '#icon-icon-security',
          content: '综合安防',
          des: '具有全域监测、实时轮巡、业务联动的突出特点'
        },
        // {
        //   img: "#icon-icon-build",
        //   content: "楼宇自控",
        //   des: "设备自动化控制，智慧节能提高能效、减少运营成本",
        // },
        {
          img: '#icon-icon-devie',
          content: '设备设施',
          des: '设备设施智能化，实现远程监控，实时数据采集'
        }
        // {
        //   img: '#icon-icon-space',
        //   content: '空间管理',
        //   des: '实时掌握房源动态，简化租赁流程，优化空间使用率'
        // },
        // {
        //   img: '#icon-icon-property',
        //   content: '物业管理',
        //   des: '全周期、多场景合同管理平台，灵活化配置、全流程精细化管理'
        // },
        // {
        //   img: '#icon-icon-property',
        //   content: '能耗管理',
        //   des: '水、电、气能耗的“电子管家”，实现一体化、多样化、可视化管理'
        // }
      ],
      activeIndex: 0,
      tabList: ['综合安防', '设备设施'],
      // ['综合安防', '楼宇自控', '设备设施', '空间管理', '物业管理', '能耗管理'],
      title: process.env.VUE_APP_TITLE
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  methods: {
    tabClick(index) {
      this.activeIndex = index
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    // 获取地图地址
    getMap() {
      let type = process.env.VUE_APP_MAP_URL_DICT
      getDicts(type).then(res => {
        localStorage.setItem('mapSource', JSON.stringify(res.data))
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30
            })
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.getMap()
              this.$router.push({ path: this.redirect || '/index' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
              if (this.captchaEnabled) {
                this.getCode()
              }
            })
        }
      })
      // webscoket
      let obj = {
        url: process.env.VUE_APP_WS_API,
        token: [encodeURI(this.$store.state.user.token)]
      }
      if (this.websock === null) {
        this.$store.dispatch('socket/WEBSOCKET_INIT', obj)
      }
      if (this.Csock === null) {
        this.$store.dispatch('socket/initCSocket', obj)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@keyframes anima1 {
  from {
    top: 0;
  }
  to {
    top: 56px;
  }
}
@keyframes anima2 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes anima3 {
  from {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
  }
}
::v-deep .el-input__inner {
  background-color: transparent !important;
}
::v-deep .el-input__prefix,
::v-deep .el-input__suffix,
::v-deep .el-input .el-input__clear,
::v-deep .el-checkbox,
::v-deep .el-input__inner {
  color: #fff;
}
::v-deep .el-carousel__arrow {
  font-size: 18px;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.login-title {
  letter-spacing: 9px;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 55px;
  color: #fff;
}
.bgclass {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  animation: anima3 1s;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #ffffff;
}
.fixedBlock {
  position: fixed;
  top: 30px;
  z-index: 99;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  .logoTop {
    display: flex;
    justify-content: center;
    align-content: space-around;
    align-items: center;
    color: #fff;
    width: 100%;
    animation: anima1 1s;
    .logoTopLeft {
      display: flex;
      align-items: center;
      flex: 1;
      h1 {
        display: block;
        width: 2px;
        background: #fff;
        height: 35px;
        margin: 4px 20px 0 20px;
      }
      .setitle {
        display: flex;
        flex-direction: column;
      }
      .setLogin {
        display: flex;
        font-size: 28px;
        line-height: 54px;
        letter-spacing: 6px;
      }
    }
  }
  .contentWarp {
    display: flex;
    margin-top: 18vh;
    animation: anima2 1.5s;
    .tabMain {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .tabList {
        padding-top: 10px;
        display: flex;
        align-items: center;
        color: #fff;
        .tabItem {
          display: flex;
          align-items: center;
          cursor: pointer;
          &:nth-child(1) {
            margin-left: 0px;
          }
          &:last-child span {
            width: 0;
          }
          span {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #fff;
            display: block;
            margin: 0 20px;
          }
        }
      }
      .tabContent {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 30px;
        line-height: 62px;
        letter-spacing: 3px;
        .tabTopCont {
          display: flex;
          align-items: center;
          font-size: 42px;
          letter-spacing: 4px;
          .tabImg {
            width: 45px;
            height: 45px;
            margin-right: 40px;
            fill: #fff;
          }
        }
      }
    }
  }
}
.login-form {
  border-radius: 6px;
  width: 400px;
  padding: 25px 25px 5px 25px;
  border: 1px solid rgba($color: #fff, $alpha: 0.6);
  box-shadow: inset 0px 0px 20px rgba($color: #fff, $alpha: 0.6);
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    width: 14px;
    margin-left: 2px;
  }
}
.login-code {
  width: 33%;
  height: 36px;
  float: right;
  .login-code-img {
    height: 100%;
    cursor: pointer;
  }
}
.qrMa {
  cursor: pointer;
  span {
    margin-right: 4px;
  }
}
.APP {
  p {
    margin: 0;
  }
  padding: 5px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.actives {
  border-bottom: solid 4px #fff;
  padding-top: 4px !important;
}
#el-login-footer {
  animation: anima2 1.5s;
  bottom: 22%;
  color: #ccc;
  opacity: 0.8;
  a {
    color: #ccc;
    opacity: 0.8;
  }
}
.swipers {
  width: 100%;
  height: 100%;
}
</style>

<style rel="stylesheet/scss" lang="scss">
.swipers {
  .el-carousel__container {
    height: 100vh;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
</style>
