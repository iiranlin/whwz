import request from '@/utils/request'
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE

// 查询通用字典明细列表
export function dictCateList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/common/dict/list`,
    method: 'get',
    params
  })
}

// 部门用户树
export function treeWithUser(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/treeWithUser`,
    method: 'get',
    params
  })
}

// 查询物资目录列表
export function noAuthorizeList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/rmstat/catalog/noAuthorize/list`,
    method: 'get',
    params
  })
}

// 部门树
export function deptTree(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/tree`,
    method: 'get',
    params
  })
}

// 班组
export function deptList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/list`,
    method: 'get',
    params
  })
}

// 用料单位
export function unitList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/unit/list`,
    method: 'get',
    params
  })
}

// 供应商接口
export function supplierBaseinfoList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/rmspl/supplier/baseinfo/list`,
    method:'get',
    params
  })
}