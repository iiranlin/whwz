import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 菜单列表（分页）
export function menuPage(params) {
  return request({
    url: `${BASE}/menu/list`,
    method: 'get',
    params
  })
}

// 菜单详情
export function menuDetail(id) {
  return request({
    url: `${BASE}/menu/detail/${id}`,
    method: 'get'
  })
}

// 菜单树
export function menuTree(params) {
  return request({
    url: `${BASE}/menu/tree`,
    method: 'get',
    params
  })
}

// 当前登录用户菜单树（独立运行动态路由来源）
export function getUserMenu() {
  return request({
    url: `${BASE}/user/menu`,
    method: 'get'
  })
}

// 页面属性（字段/按钮/字典配置，低代码页面驱动核心）
export function menuProperty(menuId) {
  return request({
    url: `${BASE}/menu/property/${menuId}`,
    method: 'get'
  })
}

// 获取最大排序号
export function getMaxSeqByParentId(params) {
  return request({
    url: `${BASE}/menu/getMaxSeqByParentId`,
    method: 'get',
    params
  })
}

// 新增菜单
export function menuCreate(data) {
  return request({
    url: `${BASE}/menu/create`,
    method: 'post',
    data
  })
}

// 修改菜单
export function menuModify(data) {
  return request({
    url: `${BASE}/menu/modify`,
    method: 'post',
    data
  })
}

// 删除菜单
export function menuDelete(id) {
  return request({
    url: `${BASE}/menu/delete/${id}`,
    method: 'post'
  })
}

// 批量删除菜单
export function menuDeleteBatch(data) {
  return request({
    url: `${BASE}/menu/deleteBatch`,
    method: 'post',
    data
  })
}
