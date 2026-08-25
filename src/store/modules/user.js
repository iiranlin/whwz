import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi, info as infoApi } from '@/api/base/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import usePermissionStore from '@/store/modules/permission'

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userInfo: {}
  }),
  actions: {
    // 登录
    login(loginForm) {
      return new Promise((resolve, reject) => {
        loginApi({ ...loginForm }).then(res => {
          if (res.code === 0) {
            setToken(res.data.token)
            this.token = res.data.token
          }
          resolve(res)
        }).catch(error => reject(error))
      })
    },
    // 获取当前登录用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        infoApi().then(res => {
          if (res.code === 0) {
            this.userInfo = res.data
          }
          resolve(res)
        }).catch(error => reject(error))
      })
    },
    // 退出登录
    logOut() {
      return new Promise((resolve, reject) => {
        logoutApi().then(() => {
          this.token = ''
          this.userInfo = {}
          removeToken()
          // 清空动态路由，重新登录时强制重新拉取菜单
          usePermissionStore().resetRoutes()
          resolve()
        }).catch(error => reject(error))
      })
    }
  }
})

export default useUserStore
