import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
//储备定额维护（路局）列表
export function normListPage(params) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/inventory/mt/list`,
        method: 'get',
        params
    })
}
//储备定额维护（路局）新增
export function normListCreateModify(data, type) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/inventory/mt/create`,
        method: 'post',
        data
    })
}
//储备定额维护（路局）修改
export function normListEditModify(data, type) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/inventory/mt/modify`,
        method: 'post',
        data
    })
}
//变更
export function normListEditChange(data, type) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/inventory/mt/change`,
        method: 'post',
        data
    })
}
//储备定额维护（路局）发布
export function normListPublish(params) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/inventory/mt/publish`,
        method: 'get',
        params
    })
}
//详情
export function normListDetail(id) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/inventory/mt/detail/${id}`,
        method: 'get',
    })
}
//弹框列表
export function normLgetUnitListWithout(params) {
    return request({
        url: `${VITE_APP_BASE_SSO_BASE}/sys/unit/getUnitListWithoutLogin`,
        method: 'get',
        params
    })
}