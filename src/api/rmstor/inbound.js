import request from '@/utils/request';
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;
const base_url = VITE_APP_BASE_WAREHOUSE + '/rmstore/inbound';
const base_url_outsale = VITE_APP_BASE_WAREHOUSE + '/rmstor/outsale';
import { minioDownload } from '@/api/system/minio';

// 查询入库单列表
export function getInboundList(params = {}) {
  return request({
    method: "get",
    url: `${base_url}/list`,
    params,
  });
};

// 新增入库单
export function createInbound(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/create`,
    data,
  })
}

// 生成入库单号
export function createInBoundCode(data = {}) {
  return request({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    data
  })
}
// 查询采购订单 getPurchaseList
export function getPurchaseList(params = {}) {
  return request({
    method: "get",
    url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/list-mt-for-inbound`,
    params,
  })
}
// 查询采购订单详细列表 getDetailList
export function getDetailList(params ={}) {
  return request({
    method: "get",
     url: `${VITE_APP_BASE_WAREHOUSE}/purchaseOrder/list-dt-for-inbound`,
    params,
  })
}

// 红冲
export function writeBack(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/write-back`,
    data,
  });
}

// 删除
export function inboundDelete(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/delete`,
    data,
  })
}

// 编辑
export function inboundUpdate(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/update`,
    data,
  });
}

// 某入库单详情
export function inboundDetail(params = {}) {
  return request({
    method: "get",
    url: `${base_url}/detail`,
    params,
  })
}


// 最新入库单详情
export function inboundLatestDetail(params = {}) {
  return request({
    method: "get",
    url: `${base_url}/latest-detail`,
  })
}

// 入库单登卡
export function inboundCreateCard(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/create-card`,
    data,
  })
}

// 撤销入库单登卡
export function inboundDeleteCard(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/delete-card`,
    data,
  })
}

// 导出
export function exportInbound(params = {}) {
  return request({
    method: "get",
    url: `${base_url}/export`,
    params,
    responseType: 'blob',
  })
}

// // 获取调拨单
export function getOutsaleList(params = {}) {
  return request({
    method: "get",
    url: `${base_url_outsale}/main/not/reference`,
    params,
  })
}

// // 获取调拨单子列表
export function getOutsaleDetailList(params = {}) {
  return request({
    method: "get",
    url: `${base_url_outsale}/detail/list`,
    params,
  })
}

// 检查旧品价格
export function checkOldProductPrice(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/check-old-product-price`,
    data,
  })
}

// 批量获取入库单
export function batchGetInbound(data = []) {
  return request({
    method: "post",
    url: `${base_url}/batch-get-detail`,
    data,
  })
}

export function getFile(params = {}) {
  return request({
    method: "get",
    url: minioDownload,
    params,
    responseType: 'blob',
  })
}

// 查询对应物资是否开启了效期管理
export function getMatlPeriodManage(data = []) {
  return request ({
    method: "post",
    url: `${VITE_APP_BASE_WAREHOUSE}/matl/batch/matl-config-list`,
    data,
  })
}