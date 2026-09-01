<template>
  <div id="tags-view-container" class="tags-view-container">
    <ScrollPane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        custom
        v-slot="{ navigate, href }"
      >
        <span
          class="tags-view-item"
          :style="activeStyle(tag)"
          :href="href"
          @click="navigate"
          @click.middle="!isAffix(tag) && closeSelectedTag(tag)"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.title }}
          <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
            <el-icon size="10"><Close /></el-icon>
          </span>
        </span>
      </router-link>
    </ScrollPane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <el-icon><RefreshRight /></el-icon> 刷新页面
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <el-icon><Close /></el-icon> 关闭当前
      </li>
      <li @click="closeOthersTags">
        <el-icon><CircleClose /></el-icon> 关闭其他
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <el-icon><Back /></el-icon> 关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <el-icon><Right /></el-icon> 关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <el-icon><CircleClose /></el-icon> 全部关闭
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close, RefreshRight, CircleClose, Back, Right } from '@element-plus/icons-vue'
import ScrollPane from './ScrollPane.vue'
import useTagsViewStore from '@/store/modules/tagsView'
import usePermissionStore from '@/store/modules/permission'
import tab from '@/plugins/tab'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const scrollPane = ref(null)

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})
const affixTags = ref([])

const visitedViews = computed(() => tagsViewStore.visitedViews)

function isActive(routeItem) {
  return routeItem.path === route.path
}

function activeStyle(tag) {
  if (!isActive(tag)) return {}
  return {
    'background-color': '#409EFF',
    'border-color': '#409EFF'
  }
}

function isAffix(tag) {
  return tag.meta && tag.meta.affix
}

function isFirstView() {
  try {
    return selectedTag.value.fullPath === visitedViews.value[1]?.fullPath || selectedTag.value.fullPath === '/dashboard'
  } catch (err) {
    return false
  }
}

function isLastView() {
  try {
    return selectedTag.value.fullPath === visitedViews.value[visitedViews.value.length - 1]?.fullPath
  } catch (err) {
    return false
  }
}

function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach(routeItem => {
    if (routeItem.meta && routeItem.meta.affix) {
      const tagPath = resolvePath(basePath, routeItem.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: routeItem.name,
        meta: { ...routeItem.meta }
      })
    }
    if (routeItem.children) {
      const tempTags = filterAffixTags(routeItem.children, routeItem.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}

function resolvePath(basePath, routePath) {
  // 简单路径拼接
  if (routePath.startsWith('/')) {
    return routePath
  }
  return basePath + '/' + routePath
}

async function initTags() {
  try {
    const permissionStore = usePermissionStore()
    const routes = permissionStore.routes || []
    affixTags.value = filterAffixTags(routes)
    for (const tag of affixTags.value) {
      if (tag.name) {
        tagsViewStore.addVisitedView(tag)
      }
    }
  } catch (e) {
    // 权限 store 可能尚未初始化
  }
}

// 防重入：记录上一次处理的路径，避免同一路径重复触发
let lastAddedPath = ''

function addTags() {
  const { name, path: currentPath } = route
  if (!name) return false
  // 防重入：同一路径不重复添加
  if (lastAddedPath === currentPath) return false
  lastAddedPath = currentPath
  tagsViewStore.addView(route)
  return false
}

function moveToCurrentTag() {
  nextTick(() => {
    // 使用 querySelectorAll 查找当前路由对应的 DOM 元素
    const tagItems = document.querySelectorAll('#tags-view-container .tags-view-item')
    const currentTag = Array.from(tagItems).find(el => {
      // 通过 href 属性匹配路由路径
      const href = el.getAttribute('href')
      return href && href.includes(route.path)
    })
    if (currentTag && scrollPane.value) {
      scrollPane.value.moveToTarget(currentTag)
    }
    // 当 fullPath 不同时更新（例如 query 参数变化）
    const existingTag = visitedViews.value.find(v => v.path === route.path)
    if (existingTag && existingTag.fullPath !== route.fullPath) {
      tagsViewStore.updateVisitedView(route)
    }
  })
}

function refreshSelectedTag(view) {
  // 只刷新当前页面，其他已打开的页面不受影响
  const { name, path, query } = route
  // 重置 lastAddedPath，确保刷新后 addTags 能重新将组件名加入 cachedViews，
  // 这样切换页签回到当前页面时不会再次触发刷新
  lastAddedPath = ''
  tagsViewStore.delCachedView({ name }).then(() => {
    router.replace({
      path: '/redirect' + path,
      query: query
    })
  })
}

function closeSelectedTag(view) {
  tab.closePage(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}

function closeRightTags() {
  tab.closeRightPage(selectedTag.value).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}

function closeLeftTags() {
  tab.closeLeftPage(selectedTag.value).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}

function closeOthersTags() {
  router.push(selectedTag.value).catch(() => {})
  tab.closeOtherPage(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}

function closeAllTags(view) {
  tab.closeAllPage().then(({ visitedViews }) => {
    if (affixTags.value.some(tag => tag.path === route.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}

function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    if (view && view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

function openMenu(tag, e) {
  const menuMinWidth = 105
  const container = document.getElementById('tags-view-container')
  const offsetLeft = container.getBoundingClientRect().left
  const offsetWidth = container.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const menuLeft = e.clientX - offsetLeft + 15

  if (menuLeft > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = menuLeft
  }

  top.value = e.clientY - 50 // 减去 navbar 高度
  visible.value = true
  selectedTag.value = tag
}

function closeMenu() {
  visible.value = false
}

function handleScroll() {
  closeMenu()
}

// 监听路由变化
watch(() => route.path, () => {
  addTags()
  moveToCurrentTag()
})

// 监听 visible 变化，绑定/解绑 body 点击事件
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #409EFF;
        color: #fff;
        border-color: #409EFF;
        // &::before {
        //   content: '';
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
// reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>