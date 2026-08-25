import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 付款列表导出
export const prePayPlanDtExport = `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/export`

// 查询付款列表
export function prePayPlanDtGetPayPlanDts(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/getPayPlanDts`,
    method: 'get',
    params
  })
}

// 保存付款草稿
export function prePayPlanDtDraftPayAmount(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/draftPayAmount`,
    method: 'post',
    data
  })
}

// 付款提交确认
export function prePayPlanDtSubmitPayAmount(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/submitPayAmount`,
    method: 'post',
    data
  })
}

// 获取付款明细详细信息(已付款)
export function prePayPlanDtDetail(planMtId) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/detail/${planMtId}`,
    method: 'get',
  })
}

// 付款报批
export function prePayPlanDtSubmitAudit(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/submitAudit`,
    method: 'post',
    data
  })
}

// 付款审批
export function prePayPlanDtReview(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/review`,
    method: 'post',
    data
  })
}

// 付款确认
export function prePayPlanDtConfirm(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/confirm`,
    method: 'post',
    data
  })
}

// 付款回退
export function prePayPlanDtReback(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/reback`,
    method: 'post',
    data
  })
}

// 付款批次详情
export function getDtsByBatchNo(payBatchNo) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/getDtsByBatchNo/${payBatchNo}`,
    method: 'get',
  })
}

// 上传附件
export function prePayPlanDtUploadFile(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/uploadFile`,
    method: 'post',
    data
  })
}

// 删除附件
export function prePayPlanDtDeleteFile(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayPlanDt/deleteFile/${id}`,
    method: 'get',
  })
}