import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 部门列表（分页）
export function deptPage(params) {
  return request({
    url: `${BASE}/dept/list`,
    method: 'get',
    params
  })
}

// 部门列表（不分页）
export function deptListAll(params) {
  return request({
    url: `${BASE}/dept/listAll`,
    method: 'get',
    params
  })
}

// 部门详情
export function deptDetail(id) {
  return request({
    url: `${BASE}/dept/detail/${id}`,
    method: 'get'
  })
}

// 部门树
export function deptTree(params) {
  return request({
    url: `${BASE}/dept/tree`,
    method: 'get',
    params
  })
}

// 部门树（全部）
export function deptTreeAll(params) {
  return request({
    url: `${BASE}/dept/treeAll`,
    method: 'get',
    params
  })
}

// 当前用户部门树
export function getDeptTreeByUser(params) {
  return request({
    url: `${BASE}/dept/getDeptTreeByUser`,
    method: 'get',
    params
  })
}
// 当前用户部门树
export function deptGetTreeByDeptId(params) {
  return request({
    url: `${BASE}/dept/deptGetTreeByDeptId`,
    method: 'get',
    params
  })
}

// 单位树
export function getUnitTree(params) {
  return request({
    url: `${BASE}/dept/getUnitTree`,
    method: 'get',
    params
  })
}

// 新增部门
export function deptCreate(data) {
  return request({
    url: `${BASE}/dept/create`,
    method: 'post',
    data
  })
}

// 修改部门
export function deptModify(data) {
  return request({
    url: `${BASE}/dept/modify`,
    method: 'post',
    data
  })
}

// 批量删除部门
export function deptDeleteBatch(data) {
  return request({
    url: `${BASE}/dept/deleteBatch`,
    method: 'post',
    data
  })
}

// 批量修改部门
export function deptModifyBatch(data) {
  return request({
    url: `${BASE}/dept/modifyBatch`,
    method: 'post',
    data
  })
}

// 未授权流程用户列表
export function unallocatedFlowUserList(data) {
  return request({
    url: `${BASE}/dept/unallocatedFlowUserList`,
    method: 'post',
    data
  })
}

// 已授权流程用户列表
export function allocatedFlowUserList(data) {
  return request({
    url: `${BASE}/dept/allocatedFlowUserList`,
    method: 'post',
    data
  })
}

// 授权流程用户
export function authFlowUser(data) {
  return request({
    url: `${BASE}/dept/authFlowUser`,
    method: 'post',
    data
  })
}

// 取消流程授权
export function cancelAuth(data) {
  return request({
    url: `${BASE}/dept/cancelAuth`,
    method: 'post',
    data
  })
}
