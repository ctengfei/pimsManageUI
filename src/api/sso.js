import request from '@/utils/request1'

// sso nginx 代理
export function doLogin(data) {
  return request({
    url: '/sso/SysUserAcc/doLogin',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function captcha(data) {
  return request({
    url: '/sso/SysUserAcc/captcha',
    method: 'get',
    data
  })
}

export function doLoginByTicket(ticket) {
  return request({
    url: `/auth/sso/doLoginByTicket?ticket=${ticket}`,
    method: 'get'
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 获取系统配置
export function getSystemConfig() {
  return request({
    url: '/api/system/SysConfig',
    method: 'GET'
  })
}

//获取登录配置
export function getLoginConfig() {
  return request({
    url: `/auth/getLoginConfig`,
    method: 'get'
  })
}
