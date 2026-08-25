import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 物料基础信息分页列表
export function materialList(params) {
  return request({
    url: `${BASE}/matl/matl/list`,
    method: 'get',
    params
  })
}

// 物料详情
export function materialDetail(id) {
  return request({
    url: `${BASE}/matl/matl/detail/${id}`,
    method: 'get'
  })
}

// 新增物料
export function materialCreate(data) {
  return request({
    url: `${BASE}/matl/matl/create`,
    method: 'post',
    data
  })
}

// 修改物料
export function materialModify(data) {
  return request({
    url: `${BASE}/matl/matl/modify`,
    method: 'post',
    data
  })
}

// 批量删除物料
export function materialBatchRemove(data) {
  return request({
    url: `${BASE}/matl/matl/batchRemove`,
    method: 'post',
    data
  })
}
