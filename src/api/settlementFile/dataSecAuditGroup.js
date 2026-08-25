import request from "@/utils/request";
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;
// 查询参数配置列表
export function getDataSecAuditList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/matl/check`,
    method: "get",
    params,
  });
}

// 校验规则
export function getChecked(params,a,b,c,d) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/matl/checkData/${params}?yearMonth=${a}&depotCode=${b}&plantCode=${c}&partitionCode=${d}`,
    method: "get"
  })
}

// 更正卡片数据
export function updateCardChange(params,a,b,c,d) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/matl/corrData/${params}?yearMonth=${a}&depotCode=${b}&plantCode=${c}&partitionCode=${d}`,
    method: "get"
  });
}

// 仓库列表 传unitCode
export function warehouseDict(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouseDict/getwarehouseByUserAndPlant?plantId=${data}`,
    method:'get'
  })
}

// 用料地区
export function plantDictList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/plantDict/selectPlantDict`,
    method: 'get'
  })
}

// 仓库分区
export function partation(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/warehouse/partition/getWarehousePartition?whId=${data}`,
    method: 'get'
  })
}