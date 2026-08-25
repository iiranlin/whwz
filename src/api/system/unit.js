import request from '@/utils/request'
const VITE_APP_BASE_BASE_SERVICE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

export function unitGetUnitList(params) {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/dept/getAllUnit`,
    method: 'get',
    params
  })
}