import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
// 查询参数配置列表
export function getMaterialList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorImmt/list`,
    method: 'get',
    params
  })
}
// 查询采购单接口http://127.0.0.1:8084/rmstorImmt/selectPurchaseOrderMtList?spdCode=CG202507GD020097&suName=&matlCode=&matlName=
export function getMaterialCode(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorImmt/selectPurchaseOrderMtList`,
    method: 'get',
    params
  })
}

// 查询采购单明细接口 http://127.0.0.1:8084/rmstorImmt/selectPurchaseOrderPageListBySpdCode?spdCode=
export function getMaterialCodePage(id){
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorImmt/selectPurchaseOrderPageListBySpdCode?spdCode=${id}`,
    method: 'get'
  })
}

//新增
export function materialCreate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorImmt/create`,
    method: 'post',
    data
  })
}

// 修改
export function materialModify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorImmt/modify`,
    method: 'post',
    data
  })
}

// 删除
export function materialDelete(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorImmt/deleteBatch`,
    method:'post',
    data
  })
}

// 详情
export function materialDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorImmt/detail/${id}`,
    method:'get'
  })
}

// 供应商接口
export function supplierList(data) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/rmspl/supplier/baseinfo/list`,
    method:'get'
  })
}

// 仓库列表 传unitCode
export function warehouseDict(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/getwarehouseByUserAndPlant?plantId=${data}`,
    method:'get'
  })
}

// 用料地区
export function plantDictList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/selectPlantDict`,
    method: 'get'
  })
}

export function generateCode(data) {
  return request({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    data
  })
}
