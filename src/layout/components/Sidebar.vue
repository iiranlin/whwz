<template>
  <el-menu
    :default-active="activeMenu"
    background-color="transparent"
    text-color="rgba(255, 255, 255, 0.75)"
    active-text-color="#14418c"
    router
    unique-opened
    class="sidebar-menu"
  >
    <SidebarItem
      v-for="route in sidebarRouters"
      :key="route.path"
      :item="route"
    />
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarItem from './SidebarItem.vue'
import usePermissionStore from '@/store/modules/permission'

const route = useRoute()
const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.sidebarRouters)
const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.sidebar-menu {
  border-right: none;
  width: 100%;
}
</style>
