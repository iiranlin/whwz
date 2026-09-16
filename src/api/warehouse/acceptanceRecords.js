import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 验收记录综合查询-导出
export const exportComprehensiveSearch = `${VITE_APP_BASE_WAREHOUSE}/rmpl/acceptance/record/export-comprehensive-search`

// 查询验收记录维护列表
export function acceptanceRecordsList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/purchase/acceptanceRecords/list`,
    method: 'get',
    params
  })
}

// 校验供应商处罚验证
export function acceptanceRecordsCheckSupplier (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/purchase/acceptanceRecords/checkSupplier`,
    method: 'post',
    data
  })
}

// 保存验收记录
export function acceptanceRecordsSave (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/purchase/acceptanceRecords/save`,
    method: 'post',
    data
  })
}

// 批量新增验收记录附件
export function fileBatchCreate (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpcs/acceptance/file/batchCreate`,
    method: 'post',
    data
  })
}

// 查询验收记录图片列表
export function fileListApi (params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpcs/acceptance/file/list`,
    method: 'get',
    params
  })
}

// 根据订单明细id获取国铁商城订单调整详情
export function getGtOrderDetail (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/purchase/acceptanceRecords/getGtOrderDetail`,
    method: 'post',
    data
  })
}

// 国铁商城订单调整提交
export function updateGtOrderDetail (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/purchase/acceptanceRecords/updateGtOrderDetail`,
    method: 'post',
    data
  })
}

// 查询采购验收记录列表
export function recordList (params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/acceptance/record/list`,
    method: 'get',
    params
  })
}

// 校验供应商是否更换
export function checkSupplierChange (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/purchase/acceptanceRecords/checkSupplierChange`,
    method: 'post',
    data
  })
}

// 校验物资价格幅度
export function checkPriceRange (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/purchase/acceptanceRecords/checkPriceRange`,
    method: 'post',
    data
  })
}

// 验收记录综合查询
export function recordComprehensiveSearch (params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/acceptance/record/comprehensive-search`,
    method: 'get',
    params
  })
}