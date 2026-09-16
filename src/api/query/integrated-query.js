import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE=import.meta.env.VITE_APP_BASE_WAREHOUSE

//调整单查询
export function adjustQueryList(params) {
    return request({
      url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/one/stop/list`,
      method: 'get',
      params
    })
  }

//调价单查询
export function adjustPriceQueryList(params) {
    return request({
      url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/one/stop/list`,
      method: 'get',
      params
    })
  }

//盘点单查询
export function checkQueryList(params) {
    return request({
      url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/check/one/stop/list`,
      method: 'get',
      params
    })
  }

  //盘点单导出
export const checkExport =  `${VITE_APP_BASE_WAREHOUSE}/rmstor/check/one/stop/export`

//退料单查询
export function comprehensiveList(params) {
    return request({
      url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/comprehensive-search`,
      method: 'get',
      params
    })
  }
//退料单导出
export const comprehensiveExport =  `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/export-comprehensive-search`
//统计
export function comprehensivestatList(params) {
    return request({
      url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/comprehensive-search-stat`,
      method: 'get',
      params
    })
  }
// 对外调拨单查询 
export function outsaleList(params) {
    return request({
      url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/one/stop/list`,
      method: 'get',
      params
    })
  }
// 对外调拨单导出
export const outsaleExport =  `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/one/stop/export`