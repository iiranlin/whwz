import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询供应区域字典
export function supplyAreaList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/supplyArea/list`,
    method: 'get',
    params
  })
}

// 新增修改供应区域字典
export function supplyAreaCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/supplyArea/${type}`,
    method: 'post',
    data
  })
}

// 查询供应区域字典-不分页列表
export function supplyAreaListAll(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/supplyArea/listAll`,
    method: 'get',
    params
  })
}