<template>
  <el-dialog class="el-dialog-detailed" title="预览附件" v-model="visible" width="900px" top="5vh" append-to-body>
		<el-scrollbar height="500px">
      <pdf-xml ref="pdfXml" :visible="visible"></pdf-xml>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup>
import PdfXml from "./PdfXml"
const { proxy } = getCurrentInstance()
const visible = ref(false)
// 显示弹框
function show(url, type = 'pdf') {
  visible.value = true
  proxy.$nextTick( () => {
    proxy.$refs.pdfXml && proxy.$refs.pdfXml.show(url, type)
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
:deep(.ep-scrollbar__view){
  height: 100%;

}
</style>