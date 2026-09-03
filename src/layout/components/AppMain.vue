<template>
  <section class="app-main">
    <router-view />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - 94px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>