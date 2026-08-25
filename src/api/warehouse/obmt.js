import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

//导出
export const obmtExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obmt/export`

// 查询数量管理入库单主列表
export function obmtList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obmt/list`,
    method: 'get',
    params
  })
}

// 新增修改数量管理入库单主
export function obmtCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obmt/${type}`,
    method: 'post',
    data
  })
}

// 删除数量管理入库单主
export function obmtDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obmt/deleteBatch`,
    method: 'post',
    data
  })
}

// 登卡数量管理入库单主
export function obmtToCard (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obmt/toCard`,
    method: 'post',
    data
  })
}

// 撤销登卡数量管理入库单主
export function obmtCancelCard (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obmt/cancelCard`,
    method: 'post',
    data
  })
}

// 详情数量管理入库单主
export function obmtGetDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/obmt/getDetail/${id}`,
    method: 'get'
  })
}
