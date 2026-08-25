import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询验收退换货列表
export function exchangeList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/acceptance/return/exchange/list`,
    method: 'get',
    params
  })
}

// 补录发货批次
export function exchangeReplenishBatch(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/acceptance/return/exchange/replenishBatch`,
    method: 'post',
    data
  })
}

// 校验是否已换货
export function exchangeIsExchange (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/acceptance/return/exchange/isExchange`,
    method: 'post',
    data
  })
}

// 校验是否已退货
export function exchangeIsReturn (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmpl/acceptance/return/exchange/isReturn`,
    method: 'post',
    data
  })
}