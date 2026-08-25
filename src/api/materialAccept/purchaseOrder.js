import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
const VITE_APP_BASE_BASE_SERVICE = import.meta.env.VITE_APP_BASE_BASE_SERVICE
// 查询参数配置列表
export function paramConfigList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/orderAndBatch/selectOrderForBatchQuery`,
    method: 'get',
    params
  })
}


//导出
export const orderListExport = `${VITE_APP_BASE_WAREHOUSE}/orderAndBatch/exportOrderForBatchQuery`
//查看验收历史
export function getAcceptanceHistory(pdbId) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/orderAndBatch/getOrderBatches/${pdbId}`,
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

export const downloadFile ='/minio/download'


//申请单位列表接口
export function getUnitList(params) {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/dept/getAllUnit`,
    method: 'get',
    params
  })
}


//用料地区接口GET:api/warehouse/plantDict/selectListWithoutLogin?unitCode=传选中单位的unitCode
export function selectListWithoutLogin(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/selectListWithoutLogin`,
    method: 'get',
    params
  })
}


