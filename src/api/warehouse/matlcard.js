import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 数量管理台账查询导出
export const matlcardLedgerExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/matlcard/ledgerExport`

// 数量管理台账查询详情导出
export const matlcardDetailListExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/matlcard/detailListExport`

// 查询数量管理物资卡片列表
export function matlcardList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/matlcard/list`,
    method: 'get',
    params
  })
}

// 数量管理台账查询列表
export function matlcardLedgerList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/matlcard/ledgerList`,
    method: 'get',
    params
  })
}

// 数量管理物资台账详情列表
export function matlcardDetailList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/matlcard/detailList`,
    method: 'get',
    params
  })
}