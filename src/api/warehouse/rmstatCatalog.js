import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询物料档案列表
export function rmstatCatalogList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstatCatalog/list`,
    method: 'get',
    params
  })
}

// 查询物料档案详细信息
export function rmstatCatalogDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstatCatalog/detail/${id}`,
    method: 'get'
  })
}

// 新增物料档案
export function rmstatCatalogCreate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstatCatalog/create`,
    method: 'post',
    data
  })
}

// 修改物料档案
export function rmstatCatalogModify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstatCatalog/modify`,
    method: 'post',
    data
  })
}

// 批量删除物料档案
export function rmstatCatalogBatchRemove(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstatCatalog/deleteBatch`,
    method: 'post',
    data
  })
}
