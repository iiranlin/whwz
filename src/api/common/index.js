
import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = import.meta.env.VUE_APP_BASE_SERVER;
const VUE_APP_VMI_SERVER = import.meta.env.VUE_APP_VMI_SERVER;
let VUE_APP_STORAGE_SERVER = import.meta.env.VUE_APP_STORAGE_SERVER;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE 
// 弹出框 选择人员 查询接口
export function getUserListAllByDept(params = {}) {
	return request({
		 url: `${VITE_APP_BASE_SSO_BASE}/user/list`,
		method: 'GET',
    params
	})
}

/**
 * @name commonQueryExportcommon
 * @desc 公共 查询导出列表
 * @method GET
 */
export function commonQueryExportcommon (params = {}) {
  return request({
    url: `${VUE_APP_VMI_SERVER}/export/queryExport`,
    method: "GET",
    params: params,
  });
}

/**
 * @name getWbsCodeListPage
 * @desc  分页查询本地同步的款源信息
 * @method GET
 */
export function getWbsCodeListPage (params = {}) {
  return request({
    url: `${VUE_APP_VMI_SERVER}/order/wbsCodeResult/listPage`,
    method: "GET",
    params: params,
  });
}

// 上传文件
// export function commonUpload (params = {}) {
//   const url = path.bacthUploadFileNew.replace('/api', '')
//   return request({
//     url,
//     method: "POST",
//     data: params,
//     // 防止数据重复提交的参数 headers 设置 repeatSubmit 为false
//     headers: {
//       repeatSubmit: false,
//     },
//   });
// }

/**
 * @name getSelectData
 * @desc 公共搜索下拉框数据
 * @method GET
 */
export function getSelectData (params = {}) {
  return request({
    url: `${VUE_APP_STORAGE_SERVER}/stock/card/getSelectData`,
    method: "GET",
    params: params,
  });
}


/**
 * @name
 * @desc 我负责的项目
 * @method GET
 */
export function getInchargeList(params = {}) {
  return request({
    url: `${VUE_APP_VMI_SERVER}/project/approval/projectPage?pageNum=1&pageSize=5&isAsc=&orderByColumn=&projectManagerName=&status=2&queryType=1&projectManagerName=${params.projectManagerName}&projectManager=${params.projectManager}`,
    method: "GET",
  });
}

/**
 * @name
 * @desc 我收藏的项目
 * @method GET
 */
export function getInterestedList(params = {}) {
  return request({
    url: `${VUE_APP_VMI_SERVER}/project/approval/projectPage?pageNum=1&pageSize=5&isAsc=&orderByColumn=&projectManagerName=&status=2&queryType=1&favorites=1`,
    method: "GET",
  });
}

/**
 * @name
 * @desc 获取签名图片地址 ?signatureUser=504898
 * @method GET
 */
export function getSignature(params = {}) {
  return request({
    url: `${VUE_APP_VMI_SERVER}/printSignature/getSignatureUrl`,
    method: "GET",
    params,
  });
}
