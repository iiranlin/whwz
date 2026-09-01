import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
// 查询参数配置列表
export function paramConfigList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptance/matl/list`,
    method: 'get',
    params
  })
}
//新增
export function paramConfigAdd(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptance/matl/create`,
    method: 'post',
    data
  })
}

// 修改
export function paramConfigModify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptance/matl/modify`,
    method: 'post',
    data
  })
}

// 删除
export function paramConfigDelete(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptance/matl/deleteBatch`,
    method: 'post',
    data
  })
}

//查询物资目录列表（仓储化：切换至仓储后端 /rmstatCatalog/list）
// 选物资弹框场景，未显式传 enableState 时默认只查启用状态物料（ENABLE_STATE='1'）
export function paramConfignoAuthorizeList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstatCatalog/list`,
    method: 'get',
    params: { ...params, enableState: params?.enableState ?? '1' }
  })
}
//查询物资大类列表（仓储化：切换至仓储后端 /matlcate/list 分页列表）
export function paramConfignoAuthorizeTree(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/matlcate/list`,
    method: 'get',
    params
  })
}

//根据验收级别分组展示
export function selectListMap(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptanceGroup/selectListMap`,
    method: 'get',
    params
  })
}
//分组回显
export function selectListMapDetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptanceGroup/getGroupUsers/${id}`,
    method: 'get',
  })
}




