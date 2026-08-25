// 物资批次管理
import request from '@/utils/request';
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const base_url = VITE_APP_BASE_WAREHOUSE + '/matl/batch';
const base_url2 = VITE_APP_BASE_WAREHOUSE + '/conversion/basis';

// 添加物资批次
export function matlBatchAdd(data = []) {
  return request({
    method: "post",
    url:`${base_url}/add`,
    data,
  })
}

// 删除物资批次
export function matlBatchDel(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/delete`,
    data,
  })
}

// 物资批次详情
export function getMatlBatchInfo(params = {}) {
  return request({
    method: "get",
    url: `${base_url}/info`,
    params,
  })
}

// 获取物资信息列表
export function getMatlList(params = {}) {
  return request({
    method: "get",
    url: `${base_url}/matl-list`, 
    params,
  })
}

// 物资批次分页数据
export function getMatlBatchPageData(params = {}) {
  return request({
    method: "get",
    url: `${base_url}/page`,
    params,
  })
}

// 物资批次编辑
export function matlBatchUpate(data = {}) {
  return request({
    method: "post",
    url: `${base_url}/update`,
    data
  })
}

// 批次管理状态关闭前库存校验
export function batchMangeCheckStore(params = {}) {
  return request({
    method: "get",
    url: `${base_url}/check-store`,
    params,
  })
}

// --------------------------------------------------------换算依据--------------------------------

// 添加换算依据
export function addConversion(data = {}) {
  return request({
    method: "post",
    url: `${base_url2}/add`,
    data,
  })
} 

// 删除换算依据
export function delConversion(data = {}) {
  return request({
    method: "post",
    url: `${base_url2}/delete`,
    data,
  })
}

// 换算依据分页查询
export function getConversionPage(params = {}) {
  return request({
    method: "get",
    url: `${base_url2}/page`,
    params,
  })
}

