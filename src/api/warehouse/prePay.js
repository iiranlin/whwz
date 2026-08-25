import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_POOL_BASE = import.meta.env.VITE_APP_BASE_POOL_BASE

// 待清算物资主列表导出
export const prePayExport = `${VITE_APP_BASE_WAREHOUSE}/prePay/export`

// 报账信息导出
export const prePayExportShareNoDts = `${VITE_APP_BASE_WAREHOUSE}/prePay/exportShareNoDts`

// 发票信息导出
export const prePayExportInvoiceMsg = `${VITE_APP_BASE_WAREHOUSE}/prePay/exportInvoiceMsg`

// 查询待清算物资主列表
export function prePayList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/list`,
    method: 'get',
    params
  })
}

// 新增修改待清算物资主
export function prePayCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/${type}`,
    method: 'post',
    data
  })
}

// 删除待清算物资主
export function prePayDeleteBatch(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/deleteBatch`,
    method: 'post',
    data
  })
}

// 获取待清算物资主详细信息
export function prePayDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/detail/${id}`,
    method: 'get',
  })
}

// 新增待清算物资时选择入库单列表
export function prePayGetInBoundMts(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/getInBoundMts`,
    method: 'post',
    data
  })
}

// 根据入库单id组装待清算物资明细数据
export function prePayGetPrePayDtByInBoundMtId(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/getPrePayDtByInBoundMtId`,
    method: 'post',
    data
  })
}

// 已提交至核对页
export function prePaySubmit(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/submit`,
    method: 'post',
    data
  })
}

// 提交至通知书生成页
export function prePaySubmitToNotice(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/submitToNotice`,
    method: 'post',
    data
  })
}

// 回退至清算物资生成页
export function prePayBack(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/back`,
    method: 'post',
    data
  })
}

// 回退至清算物资核对页
export function prePayBackToCheck(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/backToCheck`,
    method: 'post',
    data
  })
}

// 获取待清算物资明细信息
export function prePayDtWithInvoice(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/getPrePayDtWithInvoice`,
    method: 'post',
    data
  })
}

// 确认核对
export function prePayCheck(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/check`,
    method: 'post',
    data
  })
}

// 打印结算明细表
export function printPrePayMtWithDt(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/printPrePayMtWithDt`,
    method: 'post',
    data
  })
}

// 上传发票附件-清算核对
export function saveInvoiceFilesByPrePay(data) {
  return request({
    url: `${VITE_APP_BASE_POOL_BASE}/RmpcsPurchaseOrderDt/saveInvoiceFilesByPrePay`,
    method: 'post',
    data
  })
}

// 查询发票信息web
export function selectInvoiceListByPddId(data) {
  return request({
    url: `${VITE_APP_BASE_POOL_BASE}/RmpcsPurchaseOrderDt/selectInvoiceListByPddId`,
    method: 'post',
    data
  })
}

// 根据勾选待清算物资生成清算通知书
export function prePayNoticeCreate(data, yearMonth) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/create/${yearMonth}`,
    method: 'post',
    data
  })
}

// 所有未生成通知书的待清算物资 生成清算通知书
export function prePayNoticeCreateAll(params, yearMonth) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/createAll/${yearMonth}`,
    method: 'get',
    params
  })
}

// 删除清算通知书主
export function prePayNoticeDeleteBatch(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/deleteBatch`,
    method: 'post',
    data
  })
}

// 查询清算通知书主列表
export function prePayNoticeList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/list`,
    method: 'get',
    params
  })
}

// 获取清算通知书子表信息
export function getNoticeDts(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/getNoticeDts`,
    method: 'get',
    params
  })
}

// 获取清算通知书物资明细信息
export function getNoticeMatls(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/getNoticeMatls`,
    method: 'get',
    params
  })
}

// 待清算物资生成页主列表查询
export function payMtToNoticeList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/payMtToNoticeList`,
    method: 'get',
    params
  })
}

// 查询清算通知书 主单+明细 列表
export function getNoticeDtWithInvoice(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/getNoticeDtWithInvoice`,
    method: 'get',
    params
  })
}

// 打印清算明细表
export function printNoticeMtWithDt(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePayNotice/printNoticeMtWithDt`,
    method: 'post',
    data
  })
}

// 报账信息查询
export function prePayGetShareNoDts(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/getShareNoDts`,
    method: 'get',
    params
  })
}

// 发票查询
export function prePayGetInvoiceMsg(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/prePay/getInvoiceMsg`,
    method: 'get',
    params
  })
}