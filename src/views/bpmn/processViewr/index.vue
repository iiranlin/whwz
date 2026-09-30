<template>
  <div class="process-viewr-container">
    <process-viewer ref="processViewerRef" :xml="xmlData" :finishedInfo="finishedInfo" :allCommentList="allCommentList" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProcessViewer from '@/components/ProcessViewer'
import { categoryBpmnXmlModel } from '@/api/workflow/category'

const route = useRoute()
const processViewerRef = ref(null)

const xmlData = ref('')
const finishedInfo = ref(null)
const allCommentList = ref([])

const loadProcessViewer = async () => {
  const modelId = route.query.mid
  if (modelId) {
    try {
      const res = await categoryBpmnXmlModel(modelId)
      if (res?.code === 0) {
        xmlData.value = res?.data || ''
      }
    } catch (e) {
      console.error('加载流程图失败:', e)
    }
  }
}

onMounted(() => {
  loadProcessViewer()
})
</script>

<style lang="scss" scoped>
.process-viewr-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
