import request from '@/utils/request'
// let VUE_APP_BASE_PREFIX = process.env.VUE_APP_BASE_SERVER;
const VUE_APP_BASE_PREFIX = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 查询用户列表
export function userPage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/list`,
    method: 'get',
    params
  })
}

export function userListAll(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/listAll`,
    method: 'get',
    params
  })
}

// 新增用户
export function userCreate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/create`,
    method: 'post',
    data
  })
}

// 用户详情
export function userDetail(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/detail/${id}`,
    method: 'get',
  })
}

// 角色修改
export function userModify(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/modify`,
    method: 'post',
    data
  })
}

// 用户批量删除
export function userDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/deleteBatch`,
    method: 'post',
    data
  })
}
// 用户单个删除
export function userDelete(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/delete/${id}`,
    method: 'post',
  })
}

export function userBindRole(data, id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/bindRole/${id}`,
    method: 'post',
    data
  })
}


// 用户角色树
export function userRoleList(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/roleList/${id}`,
    method: 'get',
  })
}


export function resetPwd(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/resetPwd`,
    method: 'post',
    data
  })
}

/**
 * 解锁用户列表
 * @param {*} params 
 * @returns 
 */
export function lockUserList(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/user/lockUserList`,
        method: 'get',
        params
    })
}

/**
 * 解锁用户
 * @param {*} data 
 * @returns 
 */
export function unlockUser(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/user/unlockUser`,
        method: 'post',
        data
    })
}
