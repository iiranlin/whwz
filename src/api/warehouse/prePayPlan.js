import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 待付款计划生成导出
export const prePayPlanExport = `${VITE_APP_BASE_WAREHOUSE}/prePayPlan/export`

// 查询待付款计划主列表
export function prePayPlanList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlan/list`,
    method: 'get',
    params
  })
}

// 新增待付款计划主
export function prePayPlanCreate(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlan/create`,
    method: 'get',
    params
  })
}

// 新增修改待付款计划主
export function prePayPlanCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlan/${type}`,
    method: 'post',
    data
  })
}

// 删除待付款计划主
export function prePayPlanDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlan/deleteBatch`,
    method: 'post',
    data
  })
}

// 获取待付款计划发票pddId列表
export function prePayPlanGetPddIds (id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlan/getPddIds/${id}`,
    method: 'get',
  })
}

// 待付款计划生成提交
export function prePayPlanSubmit (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlan/submit`,
    method: 'post',
    data
  })
}