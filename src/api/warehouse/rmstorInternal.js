import request from "@/utils/request";
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;

// 内部调拨单导出
export const rmstorInternalExport = `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/export`

// 查询内部调拨单据列表
export function rmstorInternalList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/list`,
    method: "get",
    params,
  });
}

// 新增修改内部调拨单据
export function rmstorInternalCreateModify(data, type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/${type}`,
    method: "post",
    data,
  });
}

// 内部调拨单据提交
export function rmstorInternalSubmit(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/submit`,
    method: "post",
    data,
  });
}

// 内部调拨单据删除
export function rmstorInternalDeleteBatch(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/deleteBatch`,
    method: "post",
    data,
  });
}

// 获取内部调拨单据明细信息
export function rmstorInternalGetMatls(id) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/getMatls/${id}`,
    method: "get",
  });
}

// 根据前置存货属性获取对应后置存货属性
export function attributeMatchSelectList(params) {
  return request({
    url: `${VITE_APP_BASE_SSO_BASE}/attributeMatch/selectList`,
    method: 'get',
    params
  })
}

// 获取物资卡片接口
export function rmstorMatlSelectPageList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorMatl/selectPageList`,
    method: "get",
    params
  });
}

// 移库单卡片接口
export function rmstorMatlSelectCardsWithYKNoOutNum(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorMatl/selectCardsWithYKNoOutNum`,
    method: "get",
    params
  });
}

// 打印内部调拨单据列表
export function rmstorInternalPrintList(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/printList`,
    method: "post",
    data,
  });
}

// 内部调拨单据回退
export function rmstorInternalRollback(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/rollback`,
    method: "post",
    data,
  });
}

// 内部调拨单据登卡
export function rmstorInternalToCard(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/toCard`,
    method: "post",
    data,
  });
}

// 内部调拨单据撤销登卡
export function rmstorInternalWithDrawCard(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstorInternal/withDrawCard`,
    method: "post",
    data,
  });
}