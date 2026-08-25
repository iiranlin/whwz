import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
// 查询参数配置列表
export function paramConfigList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/orderAndBatch/getAcceptanceRecords`,
    method: 'get',
    params
  })
}

//导出
export const orderListExport = `${VITE_APP_BASE_WAREHOUSE}/orderAndBatch/exportAcceptanceRecords`
//查看验收历史
export function getAcceptanceHistory(pdbId) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/orderAndBatch/getAcceptanceHistory/${pdbId}`,
    method: 'get',
  })
}
//查看验收附件
export function getAcceptanceFiles(acId) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/orderAndBatch/getAcceptanceFiles/${acId}`,
    method: 'get',
  })
}
//下载
export const downloadFile = `${VITE_APP_BASE_WAREHOUSE}/minio/download`




