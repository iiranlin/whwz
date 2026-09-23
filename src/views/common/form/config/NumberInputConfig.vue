<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置提示语"/>
    </el-form-item>
  </div>
</template>

<script setup name="NumberInput">
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
