import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_WORKFLOE_NEW = import.meta.env.VITE_APP_BASE_WORKFLOE_NEW
const VITE_APP_WORKFLOW_API = import.meta.env.VITE_APP_WORKFLOW_API
// 提交时查询下级审批人
export function workflowUserList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/workflow/commit/audit/user/list`,
    method: 'post',
    data
  })
}

// 审批历史
export function workflowHistoryList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/workflow/audit/history/list`,
    method: 'get',
    params
  })
}

// 审批时查询下级审批人
export function taskNextFlowNode(params) {
  return request({
    url: `${VITE_APP_BASE_WORKFLOE_NEW}/task/nextFlowNode`,
    method: 'get',
    params
  })
}

export function getDepartCoursedById (data) {
	return request({
		url: `${VITE_APP_WORKFLOW_API}/api/activity-share-base-platform/service/getDepartCoursedById`,
        method: 'post',
		data
	})
}

export function getAllUserTask (data) {
	return request({
		url: `${VITE_APP_WORKFLOW_API}/api/activity-share-base-platform/service/getAllUserTask`,
        method: 'post',
		data
	})
}
// 获取已审批节点
export function getHistoryNode (data) {
	return request({
		url: `${VITE_APP_WORKFLOW_API}/api/activity-share-base-platform/service/getHistoryNode`,
        method: 'post',
		data
	})
}

//卡控历史list
export function getWarnMsgByIdAPI(params) {
	return request({
		url: 'res-pool/warnMsg/getWarnMsgById',
		method: 'get',
		params
	})
}
