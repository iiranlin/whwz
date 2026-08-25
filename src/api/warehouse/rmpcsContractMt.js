import request from '@/utils/request'
const VITE_APP_BASE_PURCH_MANAGE = import.meta.env.VITE_APP_BASE_PURCH_MANAGE


// 查询合同列表
export function getMtByPage(data) {
  return request({
    url: `${VITE_APP_BASE_PURCH_MANAGE}/rmpcsContractMt/getMtByPage`,
    method: 'post',
    data
  })
}

// 查询合同物资
export function get_contract_detail_by_page(data) {
  return request({
    url: `${VITE_APP_BASE_PURCH_MANAGE}/rmpcsContractMt/get_contract_detail_by_page`,
    method: 'post',
    data
  })
}