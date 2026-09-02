/** 月结转 */
import request from "@/utils/request";
const VITE_APP_BASE_WAREHOUSE = import.meta.env.VITE_APP_BASE_WAREHOUSE;
const VITE_APP_BASE_SSO_BASE = import.meta.env.VITE_APP_BASE_SSO_BASE;
// 获取财务年月（导航栏登录日期展示，返回 nowDate、yearMonth）
export function getCcrecordYear() {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/b/ccrecord/getYear`,
    method: "get",
  });
}
// 查询参数配置列表
export function getMonthCloseList(params) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/b/ccrecord/list`,
    method: "get",
    params,
  });
}

// 登卡操作
export function getStopnoteFlag(data,type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/b/ccrecord/toCard/${type}`,
    method: "post",
    data
  })
}

// 封账操作
export function getCloseFlag(data,type) {
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/b/ccrecord/bill/${type}`,
    method:"post",
    data
  })
}

// 月结转
export function getCarryOver(data){
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/b/ccrecord/carryOver`,
    method: "post",
    data
  })
}

// 采供所-封账操作
export function ccrecordCgsBill(yearMonth, type){
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/b/ccrecord/cgsBill/${yearMonth}/${type}`,
    method: "post",
  })
}

// 采供所-本月结转
export function ccrecordCgsCarryOver(){
  return request({
    url: `${VITE_APP_BASE_WAREHOUSE}/b/ccrecord/cgsCarryOver`,
    method: "post",
  })
}