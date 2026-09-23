const VITE_APP_BASE_WORKFLOE_NEW = import.meta.env.VITE_APP_BASE_WORKFLOE_NEW
import request from '@/utils/request'

// 查询流程分类列表
export function listCategory(query) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/list`,
    method: 'get',
    params: query
  })
}

export function detailCategory(id) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/detail/${id}`,
    method: 'get'
  })
}

// 查询流程分类列表
export function listAllCategory(query) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/listAll`,
    method: 'get',
    params: query
  })
}

// 查询流程分类详细
export function getCategory(categoryId) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/` + categoryId,
    method: 'get'
  })
}

// 新增流程分类
export function addCategory(data) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/create`,
    method: 'post',
    data: data
  })
}

// 修改流程分类
export function updateCategory(data) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/modify`,
    method: 'post',
    data: data
  })
}

// 删除流程分类
export function delCategory(data) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/delete`,
    method: 'post',
    data
  })
}


// 获得部门树
export function getOrgTree(query) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/getOrgTree`,
    method: 'get',
    params: query
  })
}

// 获得关联业务
export function getBusinessType(query) {
  return request({
    url: `${VUE_APP_BASE_SERVER}/business-type/list`,
    method: 'get',
    params: query
  })
}

//获取版本信息
export function getVersionRecord(query) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/selectVersionPage`,
    method: 'get',
    params: query
  })
}

export function deptTreeAll(query) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/getOrgTree`,
    method: 'get',
    params: query
  })
}

//实例启用/停用
export function changeStatus(data) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/changeStatus`,
    method: 'post',
    data: data
  })
}

//获取审批条件
export function categoryCondition(id) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/condition/${id}`,
    method: 'get'
  })
}

//查询流程表单详细信息
export function categoryBpmnXmlModel(modelId) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/model/bpmnXml/${modelId}`,
    method: 'get'
  })
}

export function workFlowProcessViewer(billId) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/process/getFlowViewerNew/${billId}`,
    method: 'get'
  })
}

//查询历史流程表单详细信息
export function categoryBpmnXmlVersion(deploymentId) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/category/bpmnXml/${deploymentId}`,
    method: 'get'
  })
}

export const getFiledByType = (params) => {
  // /manageCallback/getFiledsByType
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/model/getBranchList`,
    method: 'get',
    params
  })
}

export const getFunctionByType = (params) => {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/manageCallback/getFunctionByType`,
    method: 'get',
    params
  })
}

export function historyList(params) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/process/historyList`,
    method: 'get',
    params
  })
}

export function taskComplete(data) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/task/complete`,
    method: 'post',
    data
  })
}


export function taskReject(data) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/task/reject`,
    method: 'post',
    data
  })
}


export const getDictByCode = (code) => {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/model/getDictByCode`,
    method: 'get',
    params: {
      code
    }
  })
}
