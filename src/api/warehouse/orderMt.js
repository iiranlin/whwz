import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询国铁商城订单明细列表
export function mtOrderData(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/gt/order/mt/orderData`,
    method: 'get',
    params
  })
}

// 修改国铁商城订单明细
export function mtUpdate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/gt/order/mt/update`,
    method: 'post',
    data
  })
}

// 查询国铁商城订单明细列表
export function dtList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/gt/order/dt/list`,
    method: 'get',
    params
  })
}
