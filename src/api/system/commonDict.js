import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 新增通用字典类型
export function dictMtCreate (data) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/mt/create`,
		method: 'post',
		data
	})
}

// 删除通用字典类型
export function dictMtDeleteBatch (data) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/mt/deleteBatch`,
		method: 'post',
		data
	})
}

// 获取通用字典类型详细信息
export function dictGetMtDetail(dictCode, params) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/mt/detail/${dictCode}`,
		method: 'get',
		params
	})
}

// 查询通用字典类型列表
export function dictGetMtList(params) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/mt/list`,
		method: 'get',
		params
	})
}

// 修改通用字典类型
export function dictMtModify (data) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/mt/modify`,
		method: 'post',
		data
	})
}


// 新增通用字典明细
export function dictCreate (data) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/create`,
		method: 'post',
		data
	})
}


// 删除通用字典明细
export function dictDeleteBatch (data) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/deleteBatch`,
		method: 'post',
		data
	})
}


// 获取通用字典明细详细信息
export function dictDetail (id, params) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/detail/${id}`,
		method: 'get',
		params
	})
}

// 查询通用字典明细列表
export function dictCateList (params) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/list`,
		method: 'get',
		params
	})
}


// 修改通用字典明细
export function dictModify (data) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/modify`,
		method: 'post',
		data
	})
}


// 查询通用字典明细列表
export function dictList (params) {
	return request({
		url: `${VITE_APP_BASE_WAREHOUSE}/sys/common/dict/page`,
		method: 'get',
		params
	})
}
