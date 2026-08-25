import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
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

//查询物资目录列表
export function paramConfignoAuthorizeList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/rmstat/catalog/noAuthorize/list`,
    method: 'get',
    params
  })
}
//查询物资大类列表
export function paramConfignoAuthorizeTree(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/rmstat/matlcate/noAuthorize/getMatlcates`,
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




