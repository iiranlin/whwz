import request from '@/utils/request'
const VITE_APP_WORK_FLOW_SERVER = import.meta.env.VITE_APP_WORK_FLOW_SERVER


// 查询表单组
export function getFormGroups(param) {
  return request({
    url: 'admin/form/group',
    method: 'get',
    params: param
  })
}

export function getExpertList(params = {}) {
	return request({
		 url: `${VITE_APP_WORK_FLOW_SERVER}/model/getExpertPage`,
		method: 'GET',
    params
	})
}
// 表单排序
export function groupItemsSort(param) {
  return request({
    url: 'admin/form/group/sort',
    method: 'put',
    data: param
  })
}

// 更新表单组
export function updateGroup(param, method) {
  return request({
    url: 'admin/form/group',
    method: method,
    params: param
  })
}

// 获取表单分组
export function getGroup() {
  return request({
    url: 'admin/form/group/list',
    method: 'get'
  })
}

// 更新表单
export function updateForm(param) {
  return request({
    url: 'admin/form',
    method: 'put',
    params: param
  })
}

export function createForm(param){
  return request({
    url: 'admin/form',
    method: 'post',
    data: param
  })
}

// 查询表单详情
export function getFormDetail(id) {
  return request({
    url: 'admin/form/detail/' + id,
    method: 'get'
  })
}

// 查询设计器详情
export function getFormDetailByModelId(modelId) {
  return request({
    url: `${VITE_APP_WORK_FLOW_SERVER}/model/detail/${modelId}`,
    method: 'get'
  })
}

export function getBranchList(params) {
  return request({
    url: `${VITE_APP_WORK_FLOW_SERVER}/model/getBranchList`,
    method: 'get',
    params: {
      type: 'WZML'
    }
  })
}

// 保存表单详情
export function saveFormDetailByMode(param) {
  return request({
    url: `${VITE_APP_WORK_FLOW_SERVER}/model/saveNew`,
    method: 'post',
    data: param
  })
}


export function getFormDetailV2(templateId) {
  return request({
    url: 'workspace/process/detail',
    method: 'get',
    params: {
      templateId
    }
  })
}

// 更新表单详情
export function updateFormDetail(param) {
  return request({
    url: 'admin/form/detail',
    method: 'put',
    data: param
  })
}


// 发起流程
export function startProcess(param) {
  return request({
    url: 'workspace/process/start',
    method: 'POST',
    data: param
  })
}

// 查询我发起的
export function applyList(data) {
  return request({
    url: 'workspace/process/applyList',
    method: 'POST',
    data
  })
}

// 查看我的待办
export function todoList(data) {
  return request({
    url: 'workspace/process/toDoList',
    method: 'POST',
    data
  })
}

// 查看我的待办
export function doneList(data) {
  return request({
    url: 'workspace/process/doneList',
    method: 'POST',
    data
  })
}
// 查询流程详情
export function getProcessInstanceInfo(processInstanceId, taskId) {
  return request({
    url: 'workspace/process/instanceInfo',
    method: 'POST',
    data: { processInstanceId, taskId }
  })
}


// 同意
export function agree(data) {
  return request({
    url: 'workspace/agree',
    method: 'POST',
    data: data
  })
}
// 退回
export function delegateTask(data) {
  return request({
    url: 'workspace/delegateTask',
    method: 'POST',
    data: data
  })
}
//
export function resolveTask(data) {
  return request({
    url: 'workspace/resolveTask',
    method: 'POST',
    data: data
  })
}

//
export function refuse(data) {
  return request({
    url: 'workspace/refuse',
    method: 'POST',
    data: data
  })
}

//
export function revoke(data) {
  return request({
    url: 'workspace/revoke',
    method: 'POST',
    data: data
  })
}


//
export function assignee(data) {
  return request({
    url: 'workspace/assignee',
    method: 'POST',
    data: data
  })
}

//
export function rollback(data) {
  return request({
    url: 'workspace/rollback',
    method: 'POST',
    data: data
  })
}


//
export function addMulti(data) {
  return request({
    url: 'workspace/addMulti',
    method: 'POST',
    data: data
  })
}


//
export function queryMultiUsersInfo(data) {
  return request({
    url: 'workspace/queryMultiUsersInfo',
    method: 'POST',
    data: data
  })
}
//
export function deleteMulti(data) {
  return request({
    url: 'workspace/deleteMulti',
    method: 'POST',
    data: data
  })
}
//
export function comments(data) {
  return request({
    url: 'workspace/comments',
    method: 'POST',
    data: data
  })
}


