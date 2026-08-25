import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

//导出
export const ibmtExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibmt/export`

// 查询数量管理入库单主列表
export function ibmtList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibmt/list`,
    method: 'get',
    params
  })
}

// 新增修改数量管理入库单主
export function ibmtCreateModify (data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibmt/${type}`,
    method: 'post',
    data
  })
}

// 删除数量管理入库单主
export function ibmtDeleteBatch (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibmt/deleteBatch`,
    method: 'post',
    data
  })
}

// 登卡数量管理入库单主
export function ibmtToCard (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibmt/toCard`,
    method: 'post',
    data
  })
}

// 撤销登卡数量管理入库单主
export function ibmtCancelCard (data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibmt/cancelCard`,
    method: 'post',
    data
  })
}

// 详情数量管理入库单主
export function ibmtGetDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/quantity/ibmt/getDetail/${id}`,
    method: 'get'
  })
}
