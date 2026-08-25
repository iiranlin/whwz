<template>
  <!-- 目录：多级菜单 -->
  <el-sub-menu v-if="visibleChildren.length > 0" :index="fullPath">
    <template #title>
      <svg-icon v-if="validIcon" :icon-class="validIcon" class="menu-icon" />
      <span>{{ item.meta && item.meta.title }}</span>
    </template>
    <SidebarItem
      v-for="child in visibleChildren"
      :key="child.path"
      :item="child"
      :base-path="fullPath"
    />
  </el-sub-menu>

  <!-- 叶子：菜单项 -->
  <el-menu-item v-else :index="fullPath">
    <svg-icon v-if="validIcon" :icon-class="validIcon" class="menu-icon" />
    <template #title>{{ item.meta && item.meta.title }}</template>
  </el-menu-item>
</template>

<script setup>
import { computed } from 'vue'

// 图标白名单：图标库中实际存在的 svg 文件名，菜单配置了不存在的图标时不渲染占位，避免文字被空 svg 顶歪
const iconModules = import.meta.glob('/src/assets/icons/svg/*.svg')
const iconNames = Object.keys(iconModules).map(p => p.split('/').pop().replace('.svg', ''))

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})

// 拼接完整路径，供 el-menu router 模式跳转（menu index 必须是绝对路径）
// 子路由 path 以 / 开头时为绝对路径，直接使用，不再拼父路径
const fullPath = computed(() => {
  const p = props.item.path && props.item.path.startsWith('/')
    ? props.item.path
    : (props.basePath + '/' + (props.item.path || '')).replace(/\/+/g, '/')
  return p
})

// 过滤隐藏的子菜单
const visibleChildren = computed(() => {
  const children = props.item.children || []
  return children.filter(child => !child.hidden)
})

// 仅当菜单配置了图标且图标在图标库中存在时才返回图标名，否则返回空串不渲染占位
const validIcon = computed(() => {
  const icon = props.item.meta && props.item.meta.menuIcon
  return icon && iconNames.includes(icon) ? icon : ''
})
</script>

<style lang="scss" scoped>
.menu-icon {
  margin-right: 8px;
}
</style>
