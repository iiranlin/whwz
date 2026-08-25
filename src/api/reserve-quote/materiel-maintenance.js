import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE=import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
//物资高低储维护列表
export function normListPage(params){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/resever/listPage`,
        method:'get',
        params
    })
}
//物资高低储维护新增
export function normListCreateModify(data,type){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/resever/insert`,
        method:'post',
        data
    })
}

//物资高低储维护修改
export function normListEditModify(data,type){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/resever/modify`,
        method:'post',
        data
    })
}

//物资高低储维护批量删除
export function normListDeleteBatch(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/resever/deleteBatch`,
        method:'post',
        data
    })
}

//物资高低储维护导出
export const normListExport = `${VITE_APP_BASE_WAREHOUSE}/resever/export`

//下载模板
export const normListDownloadTemplate = `${VITE_APP_BASE_WAREHOUSE}/resever/downloadTemplate`

//导入
export function normListImport(data,type){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/resever/import`,
        method:'post',
        data,
        headers: { "Content-Type": "multipart/form-data",}
    })
}


// export function getUnitList(params) {
//   return request({
//     url: `${VITE_APP_BASE_SSO_BASE}/sys/unit/getUnitList`,
//     method: 'get',
//     params
//   })
// }


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


//预警  
//列表
export function normListPageWarning(params){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/resever/getWarningPageList`,
        method:'get',
        params
    })
}
//导出
export const normListExportWarning = `${VITE_APP_BASE_WAREHOUSE}/resever/exportWarning`



