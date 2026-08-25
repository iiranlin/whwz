import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询地区->仓库树列表
export function plantWarehouseTree(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/plantWarehouseTree`,
    method: 'get',
    params
  })
}

// 查询仓库字典-->分页列表
export function warehouseDictList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/list`,
    method: 'get',
    params
  })
}

// 新增修改仓库字典
export function warehouseDictCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/${type}`,
    method: 'post',
    data
  })
}

// 查询仓库树列表
export function warehouseDictTree(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/warehouseTree`,
    method: 'get',
    params
  })
}

// 删除仓库字典
export function warehouseDictDeleteBatch (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/deleteBatch`,
    method: 'post',
    data
  })
}

// 查询仓库字典列表
export function warehouseDictListAll(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/listAll`,
    method: 'get',
    params
  })
}

// 根据用户和是区查询仓库
export function getwarehouseByUserAndPlant(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/getwarehouseByUserAndPlant`,
    method: 'get',
    params
  })
}

// 新查询仓库字典列表
export function warehouseDictListX(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/warehouseDictList`,
    method: 'get',
    params
  })
}

// 新删除仓库字典
export function deleteWarehouseDict (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/deleteWarehouseDict`,
    method: 'post',
    data
  })
}

// 查询局外单位
export function outSideUnitList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/outSideUnit/outSideUnitList`,
    method: 'get',
    params
  })
}

// 新增修改局外单位
export function addUpdateOutSideUnit(data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/outSideUnit/${type}`,
    method: 'post',
    data
  })
}

// 删除局外单位
export function deleteOutSideUnit(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/outSideUnit/deleteOutSideUnit`,
    method: 'post',
    data
  })
}

// 修改局外单位状态
export function updateOutSideUnitStatus(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/outSideUnit/updateOutSideUnitStatus`,
    method: 'post',
    data
  })
}

// 查询仓库树列表
export function warehouseList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/warehouseList`,
    method: 'get',
    params
  })
}

// 查询地区-仓库树
export function plantWarehouseList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/plantWarehouseList`,
    method: 'get',
    params
  })
}