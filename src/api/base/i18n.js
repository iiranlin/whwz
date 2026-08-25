import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// i18n 词条分页列表
export function i18nList(params) {
  return request({
    url: `${BASE}/sys/i18n/list`,
    method: 'get',
    params
  })
}

// 新增 i18n 词条
export function i18nCreate(data) {
  return request({
    url: `${BASE}/sys/i18n/create`,
    method: 'post',
    data
  })
}

// 修改 i18n 词条
export function i18nModify(data) {
  return request({
    url: `${BASE}/sys/i18n/modify`,
    method: 'post',
    data
  })
}

// 删除 i18n 词条
export function i18nDelete(data) {
  return request({
    url: `${BASE}/sys/i18n/delete`,
    method: 'post',
    data
  })
}

// 语言类型列表
export function i18nTypeList(params) {
  return request({
    url: `${BASE}/sys/i18n/optType`,
    method: 'get',
    params
  })
}
