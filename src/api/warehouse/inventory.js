// 盘点单
import request from '@/utils/request';
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;
const base_url = VITE_APP_BASE_WAREHOUSE + '/rmstor/check';

// 查询盘点数据统计
export function selectStockCount(params = {}) {
  return request({
    url: `${base_url}/selectStockCount`,
    method: 'get',
    params,
  })
}

// 查询待盘点数据列表
export function selectUncountedStockList(data = {}) {
  return request({
    url: `${base_url}/selectUncountedStockList`,
    method: 'post',
    data,
  })
}

// 生成盘点单
export function create(data = {}) {
  return request({
    url: `${base_url}/create`,
    method: 'post',
    data,
  })
}

// 导出待盘点数据
export function exportUncountedStockList(data = {}) {
  return request({
    url: `${base_url}/exportUncountedStockList`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 重新盘点
export function resetStockFlag(data = {}) {
  return request({
    url: `${base_url}/resetStockFlag`,
    method: 'post',
    data,
  })
}

//-----------------------------------盘点单维护、审核----------------------------------

// 查询盘点单列表
export function getInventoryList(params = {}, otherUrl = "") {
  if (!!otherUrl) {
    return request({
      url: `${base_url}/list?${otherUrl}`,
      method: 'get',
    })
  } else {
    return request({
      url: `${base_url}/list`,
      method: 'get',
      params,
    })
  }
}

// 盘点单表格批量删除
export function deleteBatch(data = {}) {
  return request({
    url: `${base_url}/deleteBatch`,
    method: 'post',
    data,
  })
}

// 查询盘点单内盘点数据 {csCode: x, pageNum: 1, pageSize: 1}
export function getDetailList(params = {}) {
  return request({
    url: `${base_url}/dt/list`,
    method: 'get',
    params,
  })
}

// 盘点单内（维护盘点单）- 保存、提交盘点单（permFlag: 0-保存，1-提交）
export function saveOrUpdate(data ={}) {
  return request({
    url: `${base_url}/modifyBatch`,
    method: 'post',
    data,
  })
}

// 盘点单提交
export function toSubmitBatch(data = {}) {
  return request({
    url: `${base_url}/toSumbitBatch`,
    method: 'post',
    data,
  })
}

// 导出盘点单内列表
export function exportStockDetail(data = {}) {
  return request({
    url: `${base_url}/exportStockDetail`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 审核
export function toAudit(data = {}) {
  return request({
    url: `${base_url}/toAudit`,
    method: 'post',
    data,
  })
}

// 撤销审核
export function revokeAudit(data ={}) {
  return request({
    url: `${base_url}/revokeAudit`,
    method: 'post',
    data,
  })
}

// 回退
export function rollBack(data = {}) {
  return request({
    url: `${base_url}/rollBack`,
    method: 'post',
    data,
  })
}

// ----------------------------------生成调整单---------------------------
/**
 * @description 查询存在差异的盘点单
 */
export function diffStockOrderList(data = {}) {
  return request({
    url: `${base_url}/diffStockOrderList`,
    method: "post",
    data,
  })
}

/**
 * @description 生成调整单
 */

export function createModifyOrder(data = {}) {
  return request({
    url: `${base_url}/createModifyOrder`,
    method: "post",
    data,
  })
}

//-------------------------||--------------------------------

// 物资分类树
export function matlcateNoAuthorizeTree(params = {}) {
  return request({
    method: "get",
    url: `${VITE_APP_BASE_SSO_BASE}/rmstat/matlcate/noAuthorize/tree`,
    params,
  })
}

export function inventorySign(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/sign`,
    data,
  })
}

// 审批流审核
export function checkReview(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/review`,
    data,
  })
}

// 生成单号
export function createCode(data = {}) {
  return request({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    data
  })
}