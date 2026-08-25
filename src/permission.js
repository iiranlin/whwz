import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, setToken, removeToken, setCookie } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'
import Layout from '@/layout/index.vue'
import { loginByTicket } from '@/api/base/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // snapTicket 票据免密登录（第三方系统跳入）
  const snapTicket = to.query.snapTicket
  if (snapTicket) {
    try {
      const res = await loginByTicket(snapTicket)
      if (res.code === 0) {
        const userStore = useUserStore()
        userStore.token = res.data.token
        setToken(res.data.token)
        next(to.path)
        return
      }
    } catch (error) {
      // 票据登录失败则走正常登录流程
    }
  }

  const hasToken = getToken()
  if (hasToken) {
    try {
      const userStore = useUserStore()
      const permissionStore = usePermissionStore()

      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
        return
      }

      // 路由是否已加载
      const routesLoaded = permissionStore.routes && permissionStore.routes.length > 0
      if (routesLoaded) {
        next()
      } else {
        // 获取用户信息 + 从标品 base 拉取菜单生成动态路由（工作台路由已在 store 内置顶）
        await userStore.getInfo()
        // 登录后写入业务 cookie，供页面 getCookie('unitCode') 等读取（登录迁移后曾缺失导致接口传 null 报 1111）
        const u = userStore.userInfo || {}
        if (u.unitCode) setCookie('unitCode', u.unitCode)
        if (u.unitName) setCookie('unitName', u.unitName)
        if (u.unitLevel) setCookie('unitLevel', u.unitLevel)
        setCookie('railwayCode', u.railwayCode || u.unitCode || '')
        setCookie('railwayName', u.railwayName || u.unitName || '')
        setCookie('userCode', u.userCode || u.username || '')
        setCookie('userName', u.userName || u.nickName || '')
        const accessRoutes = await permissionStore.generateRoutes()
        router.addRoute({
          path: '/',
          component: Layout,
          redirect: '/dashboard',
          children: accessRoutes
        })
        next({ ...to, replace: true })
      }
    } catch (error) {
      // 用户信息/菜单获取失败：清除登录态跳登录页
      console.error('路由初始化失败', error)
      useUserStore().token = ''
      removeToken()
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
})

router.afterEach((to) => {
  NProgress.done()
})
// 路由错误兜底（安全网）：页面渲染等路由错误时记录，配合错误边界与全局 errorHandler 恢复
router.onError(err => console.error('路由错误', err))
