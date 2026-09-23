<template>
  <el-tooltip :effect="isDark ? 'dark':'light'" :content="content" placement="top-start">
    <div>
      <slot></slot>
      <i class="el-icon-question" style="margin: 0 0px"></i>
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
