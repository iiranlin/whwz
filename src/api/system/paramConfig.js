import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

// 查询参数配置列表（仓储化：原 /integrated-manage/sys/paramConfig/list，已迁移至仓储后端）
export function paramConfigList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/sys/paramConfig/list`,
    method: 'get',
    params
  })
}

// 修改并提交（仓储化：原 /integrated-manage/sys/paramConfig/modify，已迁移至仓储后端）
export function paramConfigModify(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/sys/paramConfig/modify`,
    method: 'post',
    data
  })
}