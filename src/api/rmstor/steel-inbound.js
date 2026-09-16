import request from "@/utils/request";
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;

// 导出
export const rmstorInternalExport = `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/export`
// 入库单综合查询-导出
export const exportComprehensiveSearch = `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/export-comprehensive-search`

// 查询内部调拨单据列表
export function rmstorInternalList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/list`,
    method: "get",
    params,
  });
}
//登卡
export function rmstorInternaltoCard(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/create-card`,
    method: "post",
    data,
  });
}
//撤销登卡
export function rmstorInternalwithDrawCard(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/delete-card`,
    method: "post",
    data,
  });
}
//删除
export function rmstorInternaldeleteBatch(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/delete`,
    method: "post",
    data,
  });
}
//打印
export function rmstorInternalprintList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/batch-get-detail`,
    method: "post",
    data,
  });
}
//详情
export function rmstorInternalListdetail(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/detail?ibmtId=${id}`,
    method: "get",
  });
}
//新增
export function rmstorInternalcreate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/create`,
    method: "post",
    data,
  });
}
//修改
export function rmstorInternalmodify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/update`,
    method: "post",
    data,
  });
}
//红冲
export function rmstorwriteBack(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/write-back`,
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
export function plantDictList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/selectPlantDict`,
    method: 'get',
    params
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

// 获取调拨单
export function getOutsaleList(params) {
  return request({
    method: "get",
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/not/reference`,
    params,
  })
}

// 获取调拨单子列表
export function getOutsaleDetailList(params) {
  return request({
    method: "get",
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/detail/list`,
    params,
  })
}
// 生成入库单号
export function createInBoundCode(data) {
  return request({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    data
  })
}
// 获取收货单位
export function mainReceiverUnit(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/outsale/main/receiver/unit`,
    method: 'get',
    params
  })
}

//物资
export function getCheckList(params) {
  return request({
    method:"get",
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstat/catalog/list`,
    params
  })
}
// 入库单综合查询
export function inboundComprehensiveSearch(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/comprehensive-search`,
    method: "get",
    params,
  });
}
// 入库单综合查询统计
export function inboundComprehensiveSearchStat(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/comprehensive-search-stat`,
    method: "get",
    params,
  });
}

