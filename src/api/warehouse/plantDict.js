import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询供应用料地区字典列表
export function plantDictList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/list`,
    method: 'get',
    params
  })
}

// 新增修改供应用料地区字典
export function plantDictCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/${type}`,
    method: 'post',
    data
  })
}

// 查询供应用料地区字典列表
export function plantDictListAll(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/listAll`,
    method: 'get',
    params
  })
}

// 查询当前用户下的供应用料地区字典列表
export function selectPlantDict(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/selectPlantDict`,
    method: 'get',
    params
  })
}

// 查询站段-->供应用料地区字典列表
export function plantDictListAllGroupByUnitName(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/listAllGroupByUnitName`,
    method: 'get',
    params
  })
}