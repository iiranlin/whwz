import request from '@/utils/request'
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE

// 查询参数配置列表
export function paramConfigList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/paramConfig/list`,
    method: 'get',
    params
  })
}

// 修改并提交
export function paramConfigModify(data) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/paramConfig/modify`,
    method: 'post',
    data
  })
}