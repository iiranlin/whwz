<template>
  <ep-dialog title="操作日志详情" v-model="visible" width="650px" top="8vh" append-to-body v-loading="loading">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="操作人">{{ form.username }}</el-descriptions-item>
      <el-descriptions-item label="执行模块">{{ form.module }}</el-descriptions-item>
      <el-descriptions-item label="执行方法" :span="2">{{ form.method }}</el-descriptions-item>
      <el-descriptions-item label="IP地址">{{ form.clientIp }}</el-descriptions-item>
      <el-descriptions-item label="执行描述">{{ flagText }}</el-descriptions-item>
      <el-descriptions-item label="请求地址" :span="2">{{ form.requestUrl }}</el-descriptions-item>
      <el-descriptions-item label="创建时间" :span="2">{{ form.createDate }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="visible = false">关 闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { operateLogDetail } from '@/api/base/log'

const visible = ref(false)
const loading = ref(false)
const form = ref({})

// 执行描述转换：0-执行成功 1-执行失败 2-系统异常
const flagText = computed(() => ({ 0: '执行成功', 1: '执行失败', 2: '系统异常' })[form.value.flag] ?? form.value.flag)

function init(id) {
  visible.value = true
  loading.value = true
  operateLogDetail(id).then(({ data }) => {
    form.value = data || {}
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  init
})
</script>
