import request from '@/utils/request'
import { encrypt } from '@/utils/sm2'
import constant from '@/utils/constant'

const VITE_APP_BASE_BASE_SERVICE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 登录（请求体 SM2 加密，对应后端 @EncryptData）
export function login(data) {
  data = { data: encrypt(data, constant.API_PUBLIC_KEY) }
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/login`,
    method: 'post',
    data
  })
}

// 获取当前登录用户信息
export function info() {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/info`,
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/logout`,
    method: 'get'
  })
}

// 获取图形验证码（key 为前端生成的随机 UUID）
export function getVerificationCode(randomKey) {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/randomImage/` + randomKey,
    method: 'get'
  })
}

// 修改密码（请求体 SM2 加密）
export function changePassword(data) {
  data = { data: encrypt(data, constant.API_PUBLIC_KEY) }
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/changePassword`,
    method: 'post',
    data
  })
}

// 生成跳转第三方系统的一次性票据
export function getSnapTicket() {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/getSnapTicket`,
    method: 'get'
  })
}

// 票据登录（第三方系统免密跳入）
export function loginByTicket(snapTicket) {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/loginByTicket/${snapTicket}`,
    method: 'get'
  })
}

// 统一认证中心 id_token 登录
export function loginByRails(data) {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/loginByRails`,
    method: 'post',
    data
  })
}

// token 续期
export function refreshToken() {
  return request({
    url: `${VITE_APP_BASE_BASE_SERVICE}/auth/refreshToken`,
    method: 'get'
  })
}
