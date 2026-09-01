import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 字典类型/数据分页列表
export function dictPage(params) {
  return request({
    url: `${BASE}/dict/list`,
    method: 'get',
    params
  })
}

// 字典详情
export function dictDetail(id) {
  return request({
    url: `${BASE}/dict/detail/${id}`,
    method: 'get'
  })
}

// 字典树
export function dictTree(params) {
  return request({
    url: `${BASE}/dict/tree`,
    method: 'get',
    params
  })
}

// 根据父级id查子级
export function getChildListByParentId(id) {
  return request({
    url: `${BASE}/dict/getChildListByParentId/${id}`,
    method: 'get'
  })
}

// 根据父级编码查子级
export function getListByParentCode(code) {
  return request({
    url: `${BASE}/dict/getListByParentCode/${code}`,
    method: 'get'
  })
}

// 获取最大排序号
export function getMaxSeqByParentId(params) {
  return request({
    url: `${BASE}/dict/getMaxSeqByParentId`,
    method: 'get',
    params
  })
}

// 刷新缓存
export function refreshCache() {
  return request({
    url: `${BASE}/dict/refreshCache`,
    method: 'get'
  })
}

// 新增字典
export function dictCreate(data) {
  return request({
    url: `${BASE}/dict/create`,
    method: 'post',
    data
  })
}

// 修改字典
export function dictModify(data) {
  return request({
    url: `${BASE}/dict/modify`,
    method: 'post',
    data
  })
}

// 批量删除字典
export function dictDeleteBatch(data) {
  return request({
    url: `${BASE}/dict/deleteBatch`,
    method: 'post',
    data
  })
}
