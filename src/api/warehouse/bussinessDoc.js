import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 3.1根据调单号查询明细数据
export function v1GetAdjDtList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/ws/bussinessDoc/v1/getAdjDtList`,
    method: 'post',
    data
  })
}

// 校验供应商处罚验证
export function v1GetAdjList (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/ws/bussinessDoc/v1/getAdjList`,
    method: 'post',
    data
  })
}