import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询地区->分页列表
export function warehousePartitionList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/warehousePartitionList`,
    method: 'get',
    params
  })
}

// 查询仓库字典-->仓库树列表
export function warehousePartition(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/warehousePartition`,
    method: 'get',
    params
  })
}

// 新增修改仓库分区
export function partitionCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/${type}`,
    method: 'post',
    data
  })
}

// 删除仓库字典
export function partitionDeleteWarehousePartition (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/deleteWarehousePartition`,
    method: 'post',
    data
  })
}

// 根据仓库查询仓库分区
export function partitionListAll(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/listAll`,
    method: 'get',
    params
  })
}

// 根据用户权限、仓库查询仓库分区
export function getWarehousePartition(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/getWarehousePartition`,
    method: 'get',
    params
  })
}