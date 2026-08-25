import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 模板下载
export const locationDownloadTemplate = `${VITE_APP_BASE_WAREHOUSE}/warehouse/location/downloadTemplate`
// 模板导入
export const locationImport = `${VITE_APP_BASE_WAREHOUSE}/warehouse/location/import`

// 模板导入
export function warehouseLocationImport (data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/location/import`,
    method: 'post',
    headers: {'Content-Type': undefined},
    data: formData
  })
}

// 查询仓库四号定位列表
export function locationList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/location/list`,
    method: 'get',
    params
  })
}

// 新增修改仓库四号定位
export function locationCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/location/${type}`,
    method: 'post',
    data
  })
}

// 删除仓库四号定位
export function locationDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/location/deleteBatch`,
    method: 'post',
    data
  })
}

// 新增四号定位物资分配
export function warehouseLocationMatlCreate (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseLocationMatl/create`,
    method: 'post',
    data
  })
}

// 删除四号定位物资分配
export function warehouseLocationMatlDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseLocationMatl/deleteBatch`,
    method: 'post',
    data
  })
}

// 查询四号定位物资分配列表
export function warehouseLocationMatlListAll(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseLocationMatl/listAll`,
    method: 'get',
    params
  })
}

// 查询四号定位物资分配列表-->分页
export function warehouseLocationMatlList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseLocationMatl/list`,
    method: 'get',
    params
  })
}

// 四号定位物资打印
export function warehouseLocationMatlListWithLocation(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseLocationMatl/listWithLocation`,
    method: 'post',
    data
  })
}