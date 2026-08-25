
import request from "@/utils/request";
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;

// 生成业务编码
export function ruleGenerate(data) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/receipt/rule/generate`,
    method: "post",
    data
  })
}