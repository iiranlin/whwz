import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE=import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_BASE_SERVICE = import.meta.env.VITE_APP_BASE_BASE_SERVICE
//储备定额维护（站段）列表
export function normListPage(params){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/list`,
        method:'get',
        params
    })
}
//储备定额维护（站段）新增
export function normListCreateModify(data,type){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/create`,
        method:'post',
        data
    })
}

//储备定额维护（站段）修改
export function normListEditModify(data,type){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/modify`,
        method:'post',
        data
    })
}

//储备定额维护（站段）批量删除
export function normListDeleteBatch(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/deleteBatch`,
        method:'post',
        data
    })
}

//储备定额维护（站段）发布2    撤销发布1
export function normListPublish(flag,data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/publish/${flag}`,
        method:'post',
        data
    })
}
//储备定额维护（站段）撤销发布
// export function normListCancelPublish(data){
//     return request({
//         url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/cancelPublish`,
//         method:'post',
//         data
//     })
// }
//储备定额维护（站段）导出
export const normListExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/export`


export function getUnitList(params) {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/dept/getAllUnit`,
    method: 'get',
    params
  })
}

// 地区列表 
export function plantDictList() {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/listAll`,
    method: 'get'
  })
}
// 仓库列表 
export function warehouseDict(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/listAll`,
    method:'get',
    params
  })
}


//本单位定额：
export function sumAmount(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/sumAmount`,
    method:'get',
    params
  })
}

//预警  
//列表
export function normListPageWarning(params){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/listWarning`,
        method:'get',
        params
    })
}
//导出
export const normListExportWarning = `${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/dt/exportWarning`



