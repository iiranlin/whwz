<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import usePermissionStore from '@/store/modules/permission'

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

const levelList = ref([])

function getBreadcrumb() {
  // 过滤出带有 meta.title 的匹配路由，形成面包屑层级
  let matched = route.matched.filter(item => item.meta && item.meta.title)

  const first = matched[0]
  if (!isDashboard(first)) {
    // 非首页时，面包屑开头补上首页
    matched = [{ path: '/dashboard', meta: { title: '首页工作台' } }].concat(matched)
  }

  // 从侧边栏路由（保留完整层级）中查找父级菜单，插入面包屑
  // 因为路由已扁平化，route.matched 不包含 ParentView 父级，需手动补齐
  const parentMenus = findParentMenus(route.path)
  if (parentMenus.length > 0) {
    const last = matched.pop()
    matched = [...matched, ...parentMenus, last]
  }

  levelList.value = matched.filter(
    item => item.meta && item.meta.title && item.meta.breadcrumb !== false
  )
}

/**
 * 从侧边栏路由树中查找当前路径的所有父级菜单
 * 侧边栏路由保留了完整的 ParentView 层级，而扁平化路由丢失了这些信息
 */
function findParentMenus(currentPath) {
  const sidebarRouters = permissionStore.sidebarRouters || []
  const parents = []

  function search(routes, targetPath, ancestors) {
    for (const route of routes) {
      if (route.path === targetPath) {
        parents.push(...ancestors)
        return true
      }
      if (route.children && route.children.length > 0) {
        if (search(route.children, targetPath, [...ancestors, route])) {
          return true
        }
      }
    }
    return false
  }

  search(sidebarRouters, currentPath, [])
  return parents.map(p => ({
    path: p.path,
    redirect: p.redirect,
    meta: { title: p.meta.title }
  }))
}

function isDashboard(routeItem) {
  const name = routeItem && routeItem.name
  if (!name) return false
  return name.toString().trim() === 'Dashboard'
}

function handleLink(item) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path).catch(() => {})
}

watch(
  () => route.path,
  (val) => {
    // 重定向页面不更新面包屑
    if (val.startsWith('/redirect/')) return
    getBreadcrumb()
  }
)

onMounted(() => {
  getBreadcrumb()
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>