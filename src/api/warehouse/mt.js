import request from '@/utils/request'
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE

//封帐标志、禁止登卡标志；按钮权限
export function mtVerifyButtonStatus(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/rmstor/adjust/price/mt/verifyButtonStatus`,
    method: "get",
    params
  })
}