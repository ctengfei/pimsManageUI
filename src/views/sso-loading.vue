<template>
  <div class="xxxxx" v-loading="loading"></div>
</template>

<script>
import { doLoginByTicket, getSystemConfig } from '@/api/sso'
import { getDicts } from '@/api/system/dict/data'

export default {
  components: {},
  data() {
    return {
      loading: true,
      back: this.getParam('back') || this.$router.currentRoute.query.back,
      ticket: this.getParam('ticket') || this.$router.currentRoute.query.ticket
    }
  },
  created() {
    if (this.ticket) {
      this.doLoginByTicket(this.ticket)
    } else {
      this.goSsoAuthUrl()
    }
  },
  methods: {
    // 重定向至认证中心
    goSsoAuthUrl() {
      location.href = `https://menhu.gzmky.cn/sso/auth?client=af-client&redirect=${location.href}`
    },
    // 根据ticket值登录
    doLoginByTicket(ticket) {
      doLoginByTicket(ticket).then(res => {
        if ((res.code = 200)) {
          this.ticketLogin(res)
        }
      })
    },
    ticketLogin(data) {
      let ticketPm = new Promise(resolve => {
        return resolve(data)
      })
      this.$store
        .dispatch('Login', ticketPm)
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
    },
    getMap() {
      let type = process.env.VUE_APP_MAP_URL_DICT
      getDicts(type).then(res => {
        localStorage.setItem('mapSource', JSON.stringify(res.data))
      })
    },
    getParam(name, defaultValue) {
      var query = window.location.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == name) {
          return pair[1]
        }
      }
      return defaultValue == undefined ? null : defaultValue
    }
  }
}
</script>

<style lang="scss" scoped>
.xxxxx {
  width: 100vw;
  height: 100vh;
}
</style>
