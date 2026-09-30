import request from '@/utils/request'
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE

export function roleListAll(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/supply/account/v1/railwayList`,
    method: 'get',
    params
  })
}