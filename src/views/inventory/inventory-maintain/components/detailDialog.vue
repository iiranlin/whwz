<template>
  <el-dialog class="dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" destroy-on-close>
    <template #header>
      <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
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
  }
});

const emit = defineEmits(['detailDialogClose']);

const dialogClose = () => {
  emit('detailDialogClose');
}
</script>
<style lang="scss" scoped>
</style>