<template>
  <div class="dialog-main">
    <vue-pdf-embed v-if="rowType == 'pdf'" :source="{url: rowUrl, cMapUrl: '/assets/cmaps/', cMapPacked: true}" style="width: 100%;"></vue-pdf-embed>
    <VueOfficeExcel v-else-if="rowType == 'xlsx'" :src="rowUrl" style="height: 100%;" />
    <VueOfficeDocx v-else-if="rowType == 'docx'" :src="rowUrl" />
    <el-image v-else-if="['png', 'jpg', 'gif', 'bmp', 'jpeg'].includes(rowType)" :src="rowUrl" style="width: 100%;"></el-image>
    <iframe v-else :src="rowUrl" :style="{width: '100%', height: rowH}"></iframe>
  </div>
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const rowUrl = ref('')
const rowType = ref('')
const rowH = ref('')

watch(() => props.visible, val => {
  if(!val){
    rowUrl.value = ''
  }
})

// 显示弹框
function show(url, type = 'pdf', iframeH = '400px') {
  rowH.value = iframeH
  rowUrl.value = url
  rowType.value = type
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.dialog-main{
  height: 100%;
}
</style>