import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE
// 查询参数配置列表
export function paramConfigList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptanceGroup/list`,
    method: 'get',
    params
  })
}
//新增
export function paramConfigAdd(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptanceGroup/create`,
    method: 'post',
    data
  })
}

// 修改
export function paramConfigModify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptanceGroup/modify`,
    method: 'post',
    data
  })
}

//树形数据
export function deptTree(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/tree`,
    method: 'get',
    params
  })
}
//人员
export function deptTreePerson(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/sys/user/list`,
    method: 'get',
    params
  })
}
//保存人员
export function saveGroupUsers(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptanceGroup/saveGroupUsers`,
    method: 'post',
    data
  })
}
//人员回显
export function getGroupUsers(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptanceGroup/getGroupUsers/${id}`,
    method: 'get',
  })
}
//删除
export function getGroupdelete(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/acceptanceGroup/delete/${id}`,
    method: 'get',
  })
}




