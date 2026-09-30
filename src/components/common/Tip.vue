<template>
  <el-tooltip :effect="isDark ? 'dark':'light'" :content="content" placement="top-start">
    <div>
      <slot></slot>
      <el-icon style="margin: 0 0px"><Question /></el-icon>
    </div>
  </el-tooltip>
</template>

<script setup name="Tip">
defineProps({
  isDark: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>

</style>
