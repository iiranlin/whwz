import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
// 查询参数配置列表
export function getPreCarryBillAuditList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/matl/billCheck`,
    method: 'get',
    params
  })
}