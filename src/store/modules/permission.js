import { defineStore } from 'pinia'
import ParentView from '@/components/ParentView/index.vue'
import { constantRoutes } from '@/router'
import { getUserMenu } from '@/api/base/menu'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [],
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      // 重置动态路由（退出登录时调用，避免旧菜单缓存导致重登后侧边栏为空）
      resetRoutes() {
        this.routes = []
        this.addRoutes = []
        this.defaultRoutes = []
        this.topbarRouters = []
        this.sidebarRouters = []
      },
      // 从标品 base 拉取当前用户菜单并生成路由树
      generateRoutes() {
        return new Promise((resolve, reject) => {
          getUserMenu().then(res => {
            const menuList = res.data || []
            const accessRoutes = buildAsyncRoutes(menuList)
            // 首页工作台固定路由置顶：路由与侧边栏同步生效，登录后默认进入
            accessRoutes.unshift({
              path: '/dashboard',
              name: 'Dashboard',
              component: () => import('@/views/dashboard/index.vue'),
              meta: { title: '首页工作台', menuIcon: 'dashboard' }
            })
            this.setRoutes(accessRoutes)
            this.setSidebarRouters(accessRoutes)
            resolve(accessRoutes)
          }).catch(error => reject(error))
        })
      }
    }
  })

// 将后端菜单树转换为路由树：目录挂 ParentView，叶子挂对应页面组件
function buildAsyncRoutes(menuList) {
  const res = []
  menuList.forEach(item => {
    const children = item.children || []
    const view = item.menuUrl
    const params = {
      path: view,
      name: view.replace(/\//g, '-'),
      hidden: item.isHide === 1,
      meta: {
        menuUrl: view,
        title: item.menuName,
        menuIcon: item.menuIcon,
        parentId: item.parentId,
        menuId: item.id
      }
    }
    if (children.length > 0) {
      // 目录：ParentView 容器
      params.component = ParentView
      params.redirect = 'noRedirect'
      params.children = buildAsyncRoutes(children)
    } else {
      // 叶子：优先用后端 component 字段（如 system/dept）加载 views 下对应页面，无匹配视图时兜底 404
      // component 为 'ParentView' 属于历史脏数据（应回退用 menuUrl 匹配），不按字符串去 views 下找页面
      const comp = item.component && item.component !== 'ParentView' ? item.component : view
      params.component = loadView(comp) || (() => import('@/views/error/404'))
    }
    res.push(params)
  })
  return res
}

export const loadView = (view) => {
  let res
  // view 形如 system/dept、system/log/login 等，去掉首尾斜杠后匹配 views 下目录
  const target = view.replace(/^\/+|\/+$/g, '')
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === target || dir === target + '/index') {
      res = () => modules[path]()
    }
  }
  return res
}

export default usePermissionStore
