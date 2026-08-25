import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 查询用户列表（分页）
export function userPage(params) {
  return request({
    url: `${BASE}/user/list`,
    method: 'get',
    params
  })
}

// 查询用户列表（不分页）
export function userListAll(params) {
  return request({
    url: `${BASE}/user/listAll`,
    method: 'get',
    params
  })
}

// 新增用户
export function userCreate(data) {
  return request({
    url: `${BASE}/user/create`,
    method: 'post',
    data
  })
}

// 用户详情
export function userDetail(id) {
  return request({
    url: `${BASE}/user/detail/${id}`,
    method: 'get'
  })
}

// 修改用户
export function userModify(data) {
  return request({
    url: `${BASE}/user/modify`,
    method: 'post',
    data
  })
}

// 批量删除用户
export function userDeleteBatch(data) {
  return request({
    url: `${BASE}/user/deleteBatch`,
    method: 'post',
    data
  })
}

// 用户绑定角色
export function userBindRole(data, id) {
  return request({
    url: `${BASE}/user/bindRole/${id}`,
    method: 'post',
    data
  })
}

// 用户角色列表
export function userRoleList(id) {
  return request({
    url: `${BASE}/user/roleList/${id}`,
    method: 'get'
  })
}

// 重置密码
export function resetPwd(data) {
  return request({
    url: `${BASE}/user/resetPwd`,
    method: 'post',
    data
  })
}

// 锁定用户列表
export function lockUserList(params) {
  return request({
    url: `${BASE}/user/lockUserList`,
    method: 'get',
    params
  })
}

// 解锁用户
export function unlockUser(data) {
  return request({
    url: `${BASE}/user/unlockUser`,
    method: 'post',
    data
  })
}
