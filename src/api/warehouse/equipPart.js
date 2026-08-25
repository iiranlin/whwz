import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询设备部件字典列表
export function equipPartList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipPart/list`,
    method: 'get',
    params
  })
}

// 新增修改设备部件字典
export function equipPartCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipPart/${type}`,
    method: 'post',
    data
  })
}

// 删除设备部件字典
export function equipPartDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipPart/deleteBatch`,
    method: 'post',
    data
  })
}