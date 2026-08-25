import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
// 查询参数配置列表
export function getMaintainList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/list`,
    method: 'get',
    params
  })
}

//新增
export function maintainCreate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/saveData`,
    method: 'post',
    data
  })
}

// 修改
export function maintainModify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/updateData`,
    method: 'post',
    data
  })
}

// 删除
export function maintainDelete(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/delete`,
    method:'post',
    data
  })
}

// 详情
export function maintainDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/getDetail/${id}`,
    method:'get'
  })
}

// 打印
export function maintainPrint(data) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/print`,
        method: 'post',
        data
    })
}

// 登卡
export function maintainNote(data) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/toCard`,
        method: 'post',
        data
    })
}

// 撤销登卡
export function maintainCancelNote(data) {
    return request({
        url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/cancelCard`,
        method: 'post',
        data
    })
}

// 导出
export const maintainExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/returnmatl/mt/export`

// 出库单号主表
export function maintainListMtObCode(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/listByObCode`,
    method: 'get',
    params
  })
}

// 出库单号明细列表
export function maintainListByObCode(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/dt/listByObCode`,
    method: 'get',
    params
  })
}

// 退料人列表
export function maintainUserList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/integrated-manage/sys/user/list`,
    method: 'get',
    params
  })
}

// 仓库列表 传unitCode
export function warehouseDict(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/getwarehouseByUserAndPlant?plantId=${data}`,
    method:'get'
  })
}

// 用料地区
export function plantDictList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/selectPlantDict`,
    method: 'get'
  })
}

//仓库分区
export function warehouseplantDictList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/getWarehousePartition`,
    method: 'get',
    params
  })
}

export function generateCode(data) {
  return request({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    data
  })
}