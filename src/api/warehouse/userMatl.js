import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询人员管理物资范围列表
export function userMatlList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/userMatl/list`,
    method: 'get',
    params
  })
}

// 新增修改仓库字典
export function userMatlCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/userMatl/${type}`,
    method: 'post',
    data
  })
}

// 删除仓库字典
export function userMatlDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/userMatl/deleteBatch`,
    method: 'post',
    data
  })
}