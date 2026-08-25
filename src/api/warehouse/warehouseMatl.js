import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询仓库物资管理范围列表-->不分页
export function warehouseMatlListAll(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseMatl/listAll`,
    method: 'get',
    params
  })
}

// 新增仓库物资管理范围
export function warehouseMatlCreate (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseMatl/create`,
    method: 'post',
    data
  })
}

// 删除仓库物资管理范围
export function warehouseMatlDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseMatl/deleteBatch`,
    method: 'post',
    data
  })
}
