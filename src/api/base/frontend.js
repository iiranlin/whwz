import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 前端服务列表
export function serviceList(params) {
  return request({
    url: `${BASE}/frontend/service/list`,
    method: 'get',
    params
  })
}

// 前端服务详情
export function serviceDetail(id) {
  return request({
    url: `${BASE}/frontend/service/detail`,
    method: 'get',
    params: { id }
  })
}

// 保存前端服务
export function serviceSave(data) {
  return request({
    url: `${BASE}/frontend/service/save`,
    method: 'post',
    data
  })
}

// 删除前端服务
export function serviceRemove(data) {
  return request({
    url: `${BASE}/frontend/service/remove`,
    method: 'post',
    data
  })
}

// 服务类型字典
export function serviceDict(params) {
  return request({
    url: `${BASE}/frontend/service/serviceDict`,
    method: 'get',
    params
  })
}
