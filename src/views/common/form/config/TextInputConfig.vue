<template>
  <el-form-item label="提示文字">
    <el-input size="small" v-model="value.placeholder" placeholder="请设置提示语"/>
  </el-form-item>
</template>

<script setup name="TextInput">
defineProps({
  value: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>

<style scoped>

</style>
