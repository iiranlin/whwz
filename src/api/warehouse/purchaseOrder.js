import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 采购订单--分页
export function purchaseOrderList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/list`,
    method: 'get',
    params
  })
}

// 采购订单确认
export function purchaseOrderConfirm(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/confirm`,
    method: 'post',
    data
  })
}

// 采购订单撤回
export function purchaseOrderRevoke(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/revoke`,
    method: 'post',
    data
  })
}

// 检查供应商是否黑名单/处罚期
export function purchaseOrderCheckSupplier(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/check-supplier`,
    method: 'post',
    data
  })
}

// 采购明细项标记完成
export function markComplete(data = {}) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/mark-complete`,
    method: 'post',
    data
  })
} 

// 采购明细项撤销标记完成
export function revokeMarkComplete(data = {}) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/revoke-mark-complete`,
    method: 'post',
    data
  })
}

// 通知补货
export function restockAlert(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/restock-alert`,
    method: 'post',
    data
  })
}