<template>
  <div :style="{'color': color}">
    <el-icon><Warning /></el-icon>
    <span> {{placeholder}}</span>
  </div>

</template>

<script setup name="Description">
defineProps({
  color: {
    type: String,
    default: '#868686'
  },
  placeholder: {
    type: String,
    default: '只是一段说明文字'
  },
  mode: {
    type: String,
    default: 'DESIGN'
  },
  required: {
    type: Boolean,
    default: false
  },
})
</script>

<style scoped>

</style>
