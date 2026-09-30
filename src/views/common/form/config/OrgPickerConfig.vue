<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置提示语"/>
    </el-form-item>
    <el-form-item label="是否多选">
      <el-switch v-model="value.multiple"></el-switch>
    </el-form-item>
  </div>

</template>

<script setup name="OrgPicker">
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
