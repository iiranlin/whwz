import request from "@/utils/request";
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;

// 导出
export const rmstorInternalExport = `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/export`

// 查询内部调拨单据列表
export function rmstorInternalList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/list`,
    method: "get",
    params,
  });
}
//登卡
export function rmstorInternaltoCard(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/toCard`,
    method: "post",
    data,
  });
}
//撤销登卡
export function rmstorInternalwithDrawCard(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/obCancelCard`,
    method: "post",
    data,
  });
}
//删除
export function rmstorInternaldeleteBatch(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/deleteBatch`,
    method: "post",
    data,
  });
}
//打印
export function rmstorInternalprintList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/printList`,
    method: "post",
    data,
  });
}
//详情
export function rmstorInternalListdetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/detail/${id}`,
    method: "get",
  });
}
//新增
export function rmstorInternalcreate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/create`,
    method: "post",
    data,
  });
}

//修改
export function rmstorInternalmodify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/modify`,
    method: "post",
    data,
  });
}

//按钮权限
export function rmsverifyButtonStatus(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/verifyButtonStatus`,
    method: "get",
    params,
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

//获取请领单号
export function rmstorgetApplyRecvListCodes(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/getApplyRecvListCodes`,
    method: "post",
    data,
  });
}
// 根据请领单号获取请领单列表
export function rmstorgetRecvMatlList(planCode,yearMonth) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/getRecvMatlList?planCode=${planCode}&yearMonth=${yearMonth}`,
    method: "get",

  });
}
//提交所选的请领单列表数据
export function rmstorsubmitRecvMatlList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/submitRecvMatlList`,
    method: "post",
    data,
  });
}
//红冲
export function rmstorwriteBack(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/out/mt/writeBack`,
    method: "post",
    data,
  });
}
//设备部件
export function equipPartList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipPart/list`,
    method: 'get',
    params
  })
}
//单台设备
export function equipPartListAll() {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/equipDict/listAll`,
    method: 'get'
  })
}
export function generateCode(data) {
  return request({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    data
  })
}