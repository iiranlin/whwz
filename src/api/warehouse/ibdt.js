import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

//导出
export const ibdtLedgerListExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibdt/ledgerListExport`

// 数量管理入库综合查询列表
export function ibdtLedgerList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibdt/ledgerList`,
    method: 'get',
    params
  })
}