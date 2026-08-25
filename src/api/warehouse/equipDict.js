import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询设备字典列表
export function equipDictList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipDict/list`,
    method: 'get',
    params
  })
}

// 新增修改设备字典
export function equipDictCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipDict/${type}`,
    method: 'post',
    data
  })
}

// 删除设备字典
export function equipDictDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipDict/deleteBatch`,
    method: 'post',
    data
  })
}

// 查询设备字典列表不分页
export function equipDictListAll(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipDict/listAll`,
    method: 'get',
    params
  })
}