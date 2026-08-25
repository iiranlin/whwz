import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

//导出
export const gtOrderExport = `${VITE_APP_BASE_WAREHOUSE}/gtOrder/export`

// 国铁商城妥投订单--分页
export function gtOrderList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/gtOrder/list`,
    method: 'get',
    params
  })
}

// 国铁商城妥投订单确认
export function gtOrderConfirm(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/gtOrder/confirm`,
    method: 'post',
    data
  })
}

// 国铁商城妥投订单停用
export function gtOrderDisable(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/gtOrder/disable`,
    method: 'post',
    data
  })
}

// 停用原因列表
export function gtOrderDisableReason(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/gtOrder/disable-reason`,
    method: 'get',
    params
  })
}

// 检查商城订单是否黑名单/处罚期
export function gtOrderCheckSupplier(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/gtOrder/check-supplier`,
    method: 'post',
    data
  })
}