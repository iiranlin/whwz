import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 物料分类分页列表
export function classifyList(params) {
  return request({
    url: `${BASE}/matl/class/list`,
    method: 'get',
    params
  })
}

// 物料分类树
export function classifyTree() {
  return request({
    url: `${BASE}/matl/class/tree`,
    method: 'get'
  })
}

// 物料分类详情
export function classifyDetail(id) {
  return request({
    url: `${BASE}/matl/class/detail/${id}`,
    method: 'get'
  })
}

// 新增物料分类
export function classifyCreate(data) {
  return request({
    url: `${BASE}/matl/class/create`,
    method: 'post',
    data
  })
}

// 修改物料分类
export function classifyModify(data) {
  return request({
    url: `${BASE}/matl/class/modify`,
    method: 'post',
    data
  })
}

// 批量删除物料分类
export function classifyBatchRemove(data) {
  return request({
    url: `${BASE}/matl/class/batchRemove`,
    method: 'post',
    data
  })
}
