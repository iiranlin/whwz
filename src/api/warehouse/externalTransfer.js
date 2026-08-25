import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

export const mainExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/export`

// 查询对外调拨单主列表
export function mainList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/list`,
    method: 'get',
    params
  })
}

// 新增修改对外调拨单主
export function mainCreateModify(data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/${type}`,
    method: 'post',
    data
  })
}

// 删除对外调拨主单
export function mainDelete(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/delete`,
    method: 'post',
    data
  })
}

// 获取对外调拨单主详细信息
export function mainDetail(mtId) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/detail/${mtId}`,
    method: 'get'
  })
}

// 对外调拨主单报批
export function mainSign(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/sign`,
    method: 'post',
    data
  })
}

// 对外调拨主单登卡
export function mainNote(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/note`,
    method: 'post',
    data
  })
}

// 对外调拨主单撤销登卡
export function mainCancelNote(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/cancel/note`,
    method: 'post',
    data
  })
}

// 对外调拨单打印
export function mainPrint(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/print`,
    method: 'post',
    data
  })
}

// 获取收货单位
export function mainReceiverUnit(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/receiver/unit`,
    method: 'get',
    params
  })
}

// 对外调拨主单审核
export function mainReview(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/review`,
    method: 'post',
    data
  })
}