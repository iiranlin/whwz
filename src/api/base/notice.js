import request from '@/utils/request'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 公告分页列表
export function noticePage(params) {
  return request({
    url: `${BASE}/notice/list`,
    method: 'get',
    params
  })
}

// 公告详情
export function noticeDetail(id) {
  return request({
    url: `${BASE}/notice/detail/${id}`,
    method: 'get'
  })
}

// 新增公告
export function noticeCreate(data) {
  return request({
    url: `${BASE}/notice/create`,
    method: 'post',
    data
  })
}

// 修改公告
export function noticeModify(data) {
  return request({
    url: `${BASE}/notice/modify`,
    method: 'post',
    data
  })
}

// 删除公告
export function noticeDelete(id) {
  return request({
    url: `${BASE}/notice/delete/${id}`,
    method: 'post'
  })
}

// 批量删除公告
export function noticeDeleteBatch(data) {
  return request({
    url: `${BASE}/notice/deleteBatch`,
    method: 'post',
    data
  })
}

// 发布公告
export function noticePublish(noticeId) {
  return request({
    url: `${BASE}/notice/publish/${noticeId}`,
    method: 'get'
  })
}

// 撤回公告
export function noticeUnPublish(noticeId) {
  return request({
    url: `${BASE}/notice/unPublish/${noticeId}`,
    method: 'get'
  })
}
