import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询物资大类树
export function rmstatMatlcateTree(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/matlcate/tree`,
    method: 'get',
    params
  })
}

// 查询物资大类列表
export function rmstatMatlcateList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/matlcate/list`,
    method: 'get',
    params
  })
}

// 查询物资大类详细信息
export function rmstatMatlcateDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/matlcate/detail/${id}`,
    method: 'get'
  })
}

// 新增物资大类
export function rmstatMatlcateCreate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/matlcate/create`,
    method: 'post',
    data
  })
}

// 修改物资大类
export function rmstatMatlcateModify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/matlcate/modify`,
    method: 'post',
    data
  })
}

// 批量删除物资大类
export function rmstatMatlcateBatchRemove(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/matlcate/deleteBatch`,
    method: 'post',
    data
  })
}
