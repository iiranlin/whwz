<template>
  <el-dialog class="dialog" :model-value="visible" :width="width" top="5vh" :close-on-click-modal="false" append-to-body draggable :fullscreen="fullscreen">
    <template #header>
      <div @dblclick.stop="handleDblclick"><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</div>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script setup>
const { proxy } = getCurrentInstance()
// 接收参数并指定类型（可选）
const props = defineProps({
  iconTitle: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '新增'
  },
  width: {
    type: String,
    default: '800px'
  },
  visible: {
    type: Boolean,
    default: false
  },
  isFullscreen: {
    type: Boolean,
    default: false
  }
})
const fullscreen = ref(false)
const handleDblclick = () => {
  if(props.isFullscreen){
    fullscreen.value = !fullscreen.value
  }
}
</script>
<style lang="scss" scoped>
</style>