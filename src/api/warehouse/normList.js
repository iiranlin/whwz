import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE=import.meta.env.VITE_APP_BASE_WAREHOUSE
//储备定额维护（路局）列表
export function normListPage(params){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/normList/page`,
        method:'get',
        params
    })
}
//储备定额维护（路局）新增/编辑
export function normListCreateModify(data,type){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/normList/${type}`,
        method:'post',
        data
    })
}
//储备定额维护（路局）批量删除
export function normListDeleteBatch(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/normList/publish`,
        method:'post',
        data
    })
}
//储备定额维护（路局）发布
export function normListPublish(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/normList/publish`,
        method:'post',
        data
    })
}
//储备定额维护（路局）撤销发布
export function normListCancelPublish(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/normList/cancelPublish`,
        method:'post',
        data
    })
}
//储备定额维护（路局）导出
export const normListExport='/normList/export'