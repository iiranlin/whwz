import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE=import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
//储备定额预警（路局）列表
export function normListPage(data){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/warning`,
        method:'post',
        data
    })
}
//储备定额预警（路局）导出
export const normListExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/ration/mt/warningExport`

//单位
export function getUnitList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/unit/getUnitList`,
    method: 'get',
    params
  })
}
