import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE
const VITE_APP_BASE_WORKFLOE_NEW = import.meta.env.VITE_APP_BASE_WORKFLOE_NEW

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
