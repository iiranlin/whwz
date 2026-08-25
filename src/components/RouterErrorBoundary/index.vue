<template>
  <slot v-if="!hasError" />
  <div v-else class="router-error-boundary">
    <div class="error-card">
      <div class="error-icon">!</div>
      <h3>页面加载失败</h3>
      <p class="error-msg">错误信息：{{ errorMsg }}</p>
      <p>当前页面渲染出现异常，请点击其他菜单继续操作，或刷新页面重试。</p>
      <el-button type="primary" @click="reload">刷新页面</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onErrorCaptured } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hasError = ref(false)
const errorMsg = ref('')

// 捕获子组件（router-view 渲染的页面）的渲染错误
// 返回 false 阻止错误继续向上传播，避免破坏上层组件树导致后续页面全部无法渲染
onErrorCaptured((err) => {
  hasError.value = true
  errorMsg.value = (err && err.message) ? err.message : String(err)
  return false
})

// 路由切换时自动复位错误状态，确保新页面能正常渲染
watch(
  () => route.path,
  () => {
    hasError.value = false
    errorMsg.value = ''
  }
)

const reload = () => {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.router-error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;

  .error-card {
    padding: 40px 48px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    text-align: center;

    .error-icon {
      width: 48px;
      height: 48px;
      line-height: 48px;
      margin: 0 auto 12px;
      border-radius: 50%;
      background: #f56c6c;
      color: #fff;
      font-size: 26px;
      font-weight: 700;
    }

    h3 {
      margin: 0 0 8px;
      color: #303133;
    }

    .error-msg {
      color: #909399;
      font-size: 12px;
      word-break: break-all;
    }
  }
}
</style>
