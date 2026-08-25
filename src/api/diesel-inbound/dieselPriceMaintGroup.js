import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
// 查询参数配置列表
export function getDieselForePriceList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/diesel/price/mt/list`,
    method: 'get',
    params
  })
}

// 明细列表
export function getDiseslForePriceDtList(params) {
    return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/diesel/price/dt/list`,
    method: 'get',
    params
  })
}

// 新增
export function dieselForePriceAdd(data) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/diesel/price/mt/create`,
        method:'post',
        data
    })
}

// 删除
export function dieselForePriceDel(data) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/diesel/price/mt/deleteBatch`,
        method:'post',
        data
    })
}

// 详情
export function dieselForePriceDetail(params){
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/diesel/price/dt/detail/${params}`,
        method:'get'
    })
}

// 修改
export function dieselForePriceUpdate(data){
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/diesel/price/dt/modify`,
        method: 'post',
        data
    })
}

// 发布
export function dieselForePricePull(id){
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/diesel/price/mt/publish/${id}`,
        method: 'get',
    })
}
