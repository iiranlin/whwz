import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 权限列表（角色×菜单权限矩阵）
export function aclList(params, roleId) {
  return request({
    url: `${BASE}/acl/list/${roleId}`,
    method: 'get',
    params
  })
}

// 分配权限
export function aclAssign(data) {
  return request({
    url: `${BASE}/acl/assign`,
    method: 'post',
    data
  })
}
