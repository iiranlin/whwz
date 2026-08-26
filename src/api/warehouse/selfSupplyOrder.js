import request from '@/utils/request'

const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 供货单主列表查询（分页，入参 query）
export function getPurchaseOrderMtList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/list`,
    method: 'get',
    params
  })
}

// 供货单查询（若后端提供）
export function getPurchaseOrderMtQuery(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/query`,
    method: 'get',
    params
  })
}

// 供货单审批列表（分页）
export function getAuditOrderMtList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/audit/list`,
    method: 'get',
    params
  })
}

// 供货单详情（含 details 明细）
export function getOrderMtDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/detail/${id}`,
    method: 'get'
  })
}

// 新增供货单
export function createPurchaseOrderMt(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/create`,
    method: 'post',
    data
  })
}

// 修改供货单
export function modifyPurchaseOrderMt(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/modify`,
    method: 'post',
    data
  })
}

// 删除供货单（body：数组 pdmIds）
export function deletePurchaseOrderMt(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/deleteBatch`,
    method: 'post',
    data
  })
}

// 提交审批（body 含 businessIds、auditUserId、auditType、processKey 等）
export function submitAudit(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/submit`,
    method: 'post',
    data
  })
}

// 审批（body 含 businessIds、status、message、auditUserId、workflowData 等）
export function auditPurchaseOrder(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/audit`,
    method: 'post',
    data
  })
}

// 撤回（body 含 businessIds）
export function withdrawPurchaseOrder(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/withdraw`,
    method: 'post',
    data
  })
}

// 终止（body：数组 pdmIds）
export function stopPurchaseOrder(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/stop`,
    method: 'post',
    data
  })
}

// 推送（body：数组 pdmIds）
export function pushPurchaseOrder(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/push`,
    method: 'post',
    data
  })
}

// 拆单校验
export function mtSplitCheck(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/splitCheck`,
    method: 'post',
    data
  })
}

// 拆单（body：数组 pddIds）
export function mtSplit(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/split`,
    method: 'post',
    data
  })
}

// 供货单明细列表（分页）
export function getPurchaseOrderDtList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderDt/list`,
    method: 'get',
    params
  })
}

// 供货单明细详情
export function getPurchaseOrderDtDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderDt/detail/${id}`,
    method: 'get'
  })
}

// 供货单明细模板下载地址
export const downloadOrderTemplate = `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderDt/downloadTemplate`

// 供货单明细导入地址
export const uploadOrderDetail = `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderDt/import`

// 供货单审批记录
export function getAuditLogList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/audit/log/list`,
    method: 'get',
    params
  })
}

// 供货单追踪（订单日志，原系统 mallLog/listByOrderId）
export function getOrderTrackList(orderId) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/track/${orderId}`,
    method: 'get'
  })
}

// 验收历史（跨系统能力，网关若代理 data-exchange 则可调用，否则后端配合代理）
export function getAcceptanceHistory(data) {
  return request({
    url: `/data-exchange/app/getAcceptanceHistory`,
    method: 'post',
    data
  })
}

// 验收图片
export const getFtpPic = `${VITE_APP_BASE_WAREHOUSE}/purchaseOrderMt/v1/getFtpPic`
