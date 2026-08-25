import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// ==================== 登录日志 ====================

// 登录日志分页列表
export function loginLogPage(params) {
  return request({
    url: `${BASE}/log/login/list`,
    method: 'get',
    params
  })
}

// 登录日志详情
export function loginLogDetail(id) {
  return request({
    url: `${BASE}/log/login/detail/${id}`,
    method: 'get'
  })
}

// 批量删除登录日志
export function loginLogDeleteBatch(data) {
  return request({
    url: `${BASE}/log/login/deleteBatch`,
    method: 'post',
    data
  })
}

// ==================== 操作日志 ====================

// 操作日志分页列表
export function operateLogPage(params) {
  return request({
    url: `${BASE}/log/operate/list`,
    method: 'get',
    params
  })
}

// 操作日志详情
export function operateLogDetail(id) {
  return request({
    url: `${BASE}/log/operate/detail/${id}`,
    method: 'get'
  })
}

// 批量删除操作日志
export function operateLogDeleteBatch(data) {
  return request({
    url: `${BASE}/log/operate/deleteBatch`,
    method: 'post',
    data
  })
}
