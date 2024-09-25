import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";
// 查询生成表数据
export function listTable(query) {
  return request({
    url: '/zhzz/wggl/wgygl/wgyList',
    method: 'get',
    params: query
  })
}

// 获取统计数据 /zhzz/wggl/wgygl/selectWgyCount
export function selectWgyCount(deptId) {
  return new Promise(resolve=>{
    request({
      url: '/zhzz/wggl/wgygl/selectWgyCount',
      method: 'get',
      params: deptId
    }).then(res => {
        resolve(res);
    }).catch(err => {
      resolve(false)
    })
  })
}
// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}
// 根据deptLevel获取角色
export function getRole(level) {
  return request({
    url: '/system/user/roles/' + level,
    method: 'get'
  })
}
// 获取用户详细信息
export function getInfo() {
  return new Promise(resolve=>{
    request({
      url: '/getInfo',
      method: 'get'
    }).then(res=>{
      resolve(res);
    }).catch(err=>{
      resolve(false)
    })
  })
}
// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}
// 获取网格员总数数据
export function getRoleCount(data={}) {
  return new Promise(resolve=>{
     request({
      url: '/zhzz/wggl/common/getRoleCount',
      method: 'get',
      params: data
    }).then(res=>{
      resolve(res);
    }).catch(err=>{
      resolve(false);
    })
  })
}
// 查询网格长
export function getAdminForDept(data) {
  return request({
    url: '/zhzz/wggl/wghf/queryWgzByDeptId',
    method: 'get',
    params: data
  })
}

// 查询角色数量
export function getRoleCountByUserId(deptId) {
  return request({
    url: '/zhzz/wggl/common/getRoleCountByUserId',
    method: 'get',
    params: deptId
  })
}