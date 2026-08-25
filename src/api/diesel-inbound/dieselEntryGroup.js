import request from "@/utils/request";
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;
const base_url = VITE_APP_BASE_WAREHOUSE + '/rmstore/inbound';
const base_url_outsale = VITE_APP_BASE_WAREHOUSE + '/rmstor/outsale'
// 导出
export const rmstorInternalExport = `${VITE_APP_BASE_WAREHOUSE}/rmstore/inbound/export`

// 查询入库单列表
export function getInboundList(params) {
  return request({
    url: `${base_url}/list`,
    method: "get",
    params,
  });
}
//登卡
export function inboundCreateCard(data) {
  return request({
    url: `${base_url}/create-card`,
    method: "post",
    data,
  });
}
//撤销登卡
export function inboundDeleteCard(data) {
  return request({
    url: `${base_url}/delete-card`,
    method: "post",
    data,
  });
}

export function inboundMessage(data) {
  return request({
    url: `${base_url}/reminder`,
    method:"post",
    data,
  })
}

//删除
export function inboundDelete(data) {
  return request({
    url: `${base_url}/delete`,
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
export function createInbound(data) {
  return request({
    url: `${base_url}/create`,
    method: "post",
    data,
  });
}
//修改
export function inboundUpdate(data) {
  return request({
    url: `${base_url}/update`,
    method: "post",
    data,
  });
}
//红冲
export function rmstorwriteBack(data) {
  return request({
    url: `${base_url}/write-back`,
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

// 获取物资
export function getCheckList(params) {
  return request({
    method:"get",
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstat/catalog/list`,
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


// 根据柴油获取库存单价
export function getPublishList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/diesel/pre/mt/getPublish`,
    method:'get',
    params
  })
}

export function generateCode(data) {
  return request({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    data
  })
}



