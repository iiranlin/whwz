<template>
  <el-scrollbar ref="scrollContainer" class="scroll-container" @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const tagAndTagSpacing = 4

const emit = defineEmits(['scroll'])
const scrollContainer = ref(null)
let scrollWrapper = null

function getScrollWrapper() {
  if (!scrollWrapper && scrollContainer.value) {
    // Element Plus el-scrollbar 通过 defineExpose 暴露 wrapRef
    scrollWrapper = scrollContainer.value.wrapRef
  }
  return scrollWrapper
}

function handleScroll(e) {
  const wrap = getScrollWrapper()
  if (!wrap) return
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  wrap.scrollLeft = wrap.scrollLeft + eventDelta / 4
}

function emitScroll() {
  emit('scroll')
}

function moveToTarget(currentTag) {
  const wrap = getScrollWrapper()
  if (!wrap || !scrollContainer.value) return

  const $container = scrollContainer.value.$el
  const $containerWidth = $container.offsetWidth
  const tagList = $container.querySelectorAll('.tags-view-item')

  if (tagList.length === 0) return

  const firstTag = tagList[0]
  const lastTag = tagList[tagList.length - 1]

  if (firstTag === currentTag) {
    wrap.scrollLeft = 0
  } else if (lastTag === currentTag) {
    wrap.scrollLeft = wrap.scrollWidth - $containerWidth
  } else {
    const currentIndex = Array.from(tagList).findIndex(item => item === currentTag)
    if (currentIndex <= 0 || currentIndex >= tagList.length - 1) return

    const prevTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]

    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing

    if (afterNextTagOffsetLeft > wrap.scrollLeft + $containerWidth) {
      wrap.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < wrap.scrollLeft) {
      wrap.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

onMounted(() => {
  try {
    const wrap = getScrollWrapper()
    if (wrap) {
      wrap.addEventListener('scroll', emitScroll, true)
    }
  } catch (e) {
    // 静默失败，避免触发全局 errorHandler 导致页面重载
  }
})

onBeforeUnmount(() => {
  try {
    const wrap = getScrollWrapper()
    if (wrap) {
      wrap.removeEventListener('scroll', emitScroll)
    }
  } catch (e) {
    // 静默失败
  }
})

defineExpose({
  moveToTarget
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>