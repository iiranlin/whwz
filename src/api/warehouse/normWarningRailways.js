import request from '@utils/request'
const VITE_APP_BASE_WAREHOUSE=import.meta.env.VITE_APP_BASE_WAREHOUSE
export function normWarningRailwayPage(params){
    return request({
        url:`${VITE_APP_BASE_WAREHOUSE}/normWarningRailway/page`,
        method:'get',
        params
    })
}
export const normWarningRailwayExport='/normWarningRailway/export'