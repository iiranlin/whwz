import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE=import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
//储备定额维护（路局）列表
export function normListPage(params){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/list`,
        method:'get',
        params
    })
}
//储备定额维护（路局）新增
export function normListCreateModify(data,type){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/create`,
        method:'post',
        data
    })
}

//储备定额维护（路局）修改
export function normListEditModify(data,type){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/modify`,
        method:'post',
        data
    })
}

//储备定额维护（路局）批量删除
export function normListDeleteBatch(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/deleteBatch`,
        method:'post',
        data
    })
}
//储备定额维护（路局）发布
export function normListPublish(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/submitPublish`,
        method:'post',
        data
    })
}
//储备定额维护（路局）撤销发布
export function normListCancelPublish(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/cancelPublish`,
        method:'post',
        data
    })
}
//储备定额维护（路局）导出
export const normListExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/export`


export function getUnitList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/unit/getUnitList`,
    method: 'get',
    params
  })
}
//库存管理目标：
export function sumAmount(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/inventory/mt/inventoryGoal`,
    method:'post',
    data
  })
}