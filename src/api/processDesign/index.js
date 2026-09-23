import request from '@/utils/request'
const VITE_APP_BASE_SSO_BASE = process.env.VITE_APP_BASE_SSO_BASE

export function frontList() {
	const arr = [{
		id: '1',
		billCode: 'bomCode',
		billName: 'bomName',
		billType: 'MM_BOM',
		createDate: Date.now(),
		createUser: 'D',
		createUserName: '管理',
		enableStatus: '0',
		processName: '测试机',
		useOrgName: '中国铁路广州局集团有限公司',
		updateUserName: '测试人',
		updateDate: Date.now(),
		version: '1'
	}]
	return new Promise((resolve) => {
		resolve({data: {list: arr, total: arr.length}})
	})
} 

export function deptTree (params) {
	return request({
		url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/tree`,
		method: 'get',
        params
	})
}

export function deptList (params) {
	return request({
		url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/list`,
		method: 'get',
		params
	})
}

export function deptCreate(data, type) {
	return request({
		url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/${type}`,
		method: 'post',
		data
	})
}

export function deptDeleteBatch(id) {
	return request({
		url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/${id}`,
		method: 'DELETE',
	})
}

export function updateSysDeptStatus(data) {
	return request({
		url: `${VITE_APP_BASE_SSO_BASE}/sys/dept/updateSysDeptStatus`,
		method: 'post',
		data
	})
}