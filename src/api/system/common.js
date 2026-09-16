import request from '@/utils/request'
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
const VITE_APP_BASE_BASE_SERVICE = import.meta.env.VITE_APP_BASE_BASE_SERVICE
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询通用字典明细列表（改用 base 字典接口：按父字典编码查子项）
export function dictCateList(params) {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/dict/getChildsByParentCode`,
    method: 'get',
    params
  })
}

// 部门用户树（改用 base：部门节点下挂用户）
export function treeWithUser(params) {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/dept/treeWithUser`,
    method: 'get',
    params
  })
}

// 查询物资目录列表（仓储化：切换至仓储后端 /rmstatCatalog/list）
// 选物资弹框场景，未显式传 enableState 时默认只查启用状态物料（ENABLE_STATE='1'）
export function noAuthorizeList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstatCatalog/list`,
    method: 'get',
    params: { ...params, enableState: params?.enableState ?? '1' }
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

// 查询通用字典明细列表
export function dictCateListQuery(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/common/dict/list`,
    method: 'get',
    params
  })
}

// 部门用户树
export function treeWithUserQuery(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/treeWithUser`,
    method: 'get',
    params
  })
}

// 查询物资目录列表
export function noAuthorizeListQuery(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/rmstat/catalog/noAuthorize/list`,
    method: 'get',
    params
  })
}