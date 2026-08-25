import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询供应地区与用料地区的对应关系列表
export function useplantSupplyareaList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/useplant/supplyarea/list`,
    method: 'get',
    params
  })
}

// 新增修改供应地区与用料地区的对应关系列表
export function useplantSupplyareaCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/useplant/supplyarea/${type}`,
    method: 'post',
    data
  })
}

// 删除供应地区与用料地区的对应关系列表
export function useplantSupplyareaDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/useplant/supplyarea/deleteBatch`,
    method: 'post',
    data
  })
}