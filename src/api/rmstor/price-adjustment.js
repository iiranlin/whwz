import request from "@/utils/request";
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;

// 导出
// export const rmstorInternalExport = `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/export`

// 查询内部调拨单据列表
export function rmstorInternalList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/list`,
    method: "get",
    params,
  });
}
// 报批
export function rmstorInternalSubmit(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/submitApproval`,
    method: "post",
    data,
  });
}
// 审批
export function rmstorInternalReview(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/review`,
    method: "post",
    data,
  });
}
//登卡
export function rmstorInternaltoCard(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/submitNote`,
    method: "post",
    data,
  });
}
//撤销登卡
export function rmstorInternalwithDrawCard(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/withdrawNote`,
    method: "post",
    data,
  });
}
//删除
export function rmstorInternaldeleteBatch(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/deleteBatch`,
    method: "post",
    data,
  });
}
//打印
export function rmstorInternalprintList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/printList`,
    method: "post",
    data,
  });
}
//详情
export function rmstorInternalListdetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/detail/${id}`,
    method: "get",
  });
}
//新增
export function rmstorInternalcreate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/create`,
    method: "post",
    data,
  });
}

//修改
export function rmstorInternalmodify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/modify`,
    method: "post",
    data,
  });
}

// 地区列表 
export function plantDictList() {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/selectPlantDict`,
    method: 'get'
  })
}
// 仓库列表 
export function warehouseDict(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/getwarehouseByUserAndPlant`,
    method:'get',
    params
  })
}
//仓库分区
export function warehouseplantDictList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/getWarehousePartition`,
    method: 'get',
    params
  })
}
//按钮权限
export function rmsverifyButtonStatus(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/verifyButtonStatus`,
    method: "get",
    params,
  });
}

export function rmstorMatlSelectPageList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorMatl/selectPageList`,
    method: "get",
    params
  });
}
export function generateCode(data) {
  return request({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    data
  })
}