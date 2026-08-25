import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 数量管理出库综合查询列表导出
export const obdtLedgerListExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obdt/ledgerListExport`

// 数量管理出库综合查询列表
export function obdtLedgerList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obdt/ledgerList`,
    method: 'get',
    params
  })
}