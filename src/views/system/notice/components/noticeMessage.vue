<template>
  <ep-dialog title="通知内容" v-model="visible" width="600px" top="8vh" append-to-body>
    <div class="notice-message" v-html="content"></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="visible = false">关 闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
const visible = ref(false)
const content = ref('')

function init(data = '') {
  content.value = data
  visible.value = true
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.notice-message {
  max-height: 400px;
  overflow-y: auto;
  word-break: break-all;
}
</style>
