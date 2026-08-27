import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 供应商档案分页列表
export function supplierList(params) {
  return request({
    url: `${BASE}/Pu/Su/list`,
    method: 'get',
    params
  })
}

// 供应商档案详情
export function supplierDetail(id) {
  return request({
    url: `${BASE}/Pu/Su/detail/${id}`,
    method: 'get'
  })
}

// 供应商档案新增
export function supplierCreate(data) {
  return request({
    url: `${BASE}/Pu/Su/create`,
    method: 'post',
    data
  })
}

// 供应商档案修改
export function supplierModify(data) {
  return request({
    url: `${BASE}/Pu/Su/modify`,
    method: 'post',
    data
  })
}

// 供应商档案保存并提交
export function supplierSaveSubmit(data) {
  return request({
    url: `${BASE}/Pu/Su/saveSubmit`,
    method: 'post',
    data
  })
}

// 供应商档案批量删除
export function supplierBatchRemove(data) {
  return request({
    url: `${BASE}/Pu/Su/batchRemove`,
    method: 'post',
    data
  })
}

// 供应商档案限制/取消限制合作 type: stop-限制 start-取消
export function supplierDisable(id, type) {
  return request({
    url: `${BASE}/Pu/Su/${type}/${id}`,
    method: 'get'
  })
}

// 供应商档案撤回(撤审)
export function supplierResetStatus(id) {
  return request({
    url: `${BASE}/Pu/Su/resetConTractStatus/${id}`,
    method: 'post'
  })
}

// 供应商档案提交审核（本地，不走工作流）
export function supplierSubmitAudit(id) {
  return request({
    url: `${BASE}/Pu/Su/submitAudit/${id}`,
    method: 'post'
  })
}

// 供应商审核（本地，不走工作流）state: 3-通过 0-驳回
export function supplierAudit(id, state, comment) {
  return request({
    url: `${BASE}/Pu/Su/audit`,
    method: 'post',
    data: { id, state, comment }
  })
}

// 供应商档案批量提交审批
export function supplierSubmitList(data) {
  return request({
    url: `${BASE}/audit/submitList`,
    method: 'post',
    data
  })
}

// 提交时获取下一级审批人
export function commitNextAssignee(data) {
  return request({
    url: `${BASE}/wf/commitNextAssignee`,
    method: 'post',
    data
  })
}

// 标品字典(base 服务)
export function prodmgrDictList(code) {
  return request({
    url: `${BASE}/dict/getListByParentCode/${code}`,
    method: 'get'
  })
}