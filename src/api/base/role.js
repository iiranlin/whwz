import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 查询角色列表（分页）
export function rolePage(params) {
  return request({
    url: `${BASE}/role/list`,
    method: 'get',
    params
  })
}

// 查询角色列表（不分页）
export function roleListAll(params) {
  return request({
    url: `${BASE}/role/listAll`,
    method: 'get',
    params
  })
}

// 角色详情
export function roleDetail(id) {
  return request({
    url: `${BASE}/role/detail/${id}`,
    method: 'get'
  })
}

// 新增角色
export function roleCreate(data) {
  return request({
    url: `${BASE}/role/create`,
    method: 'post',
    data
  })
}

// 修改角色
export function roleModify(data) {
  return request({
    url: `${BASE}/role/modify`,
    method: 'post',
    data
  })
}

// 批量删除角色
export function roleDeleteBatch(data) {
  return request({
    url: `${BASE}/role/deleteBatch`,
    method: 'post',
    data
  })
}

// 角色菜单列表
export function roleMenuList(id) {
  return request({
    url: `${BASE}/role/menuList/${id}`,
    method: 'get'
  })
}

// 角色菜单树
export function roleMenuTree(id) {
  return request({
    url: `${BASE}/role/menuTree/${id}`,
    method: 'get'
  })
}

// 角色绑定菜单
export function roleBindMenu(data, id) {
  return request({
    url: `${BASE}/role/bindMenu/${id}`,
    method: 'post',
    data
  })
}

// 角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: `${BASE}/role/authUser/allocatedList`,
    method: 'get',
    params: query
  })
}

// 角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: `${BASE}/role/authUser/unallocatedList`,
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(roleId, data) {
  return request({
    url: `${BASE}/role/${roleId}/authUser/cancel`,
    method: 'post',
    data
  })
}

// 授权用户选择
export function authUser(roleId, data) {
  return request({
    url: `${BASE}/role/${roleId}/authUser`,
    method: 'post',
    data
  })
}
