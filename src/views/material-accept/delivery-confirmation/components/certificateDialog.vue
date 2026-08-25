<template>
  <ep-dialog class="ep-dialog-list" title="技术证书查看" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="app-container" v-loading="loading">
      <!-- 表格数据 -->
      <table-index class="table-index" idName="uid" :selectionShow="false" :tableJson="certificateTableJson" :tableButtonJson="certificateTableButtonJson" :tableData="tableData"
        @handleButtonClick="handleButtonClick" :buttonShow="handleButtonShow" @clickLink="handleClickLink" operationWidth="270">
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
    <PreviewAttachment ref="previewAttachment"></PreviewAttachment>
  </ep-dialog>
</template>

<script setup>
import { selectInvoiceListByPddId } from '@/api/warehouse/prePay'
import { certificateTableJson, certificateTableButtonJson } from "../tableJson"
import { minioDownload } from "@/api/system/minio"
import { uploadTypeArr } from '@/utils/dictionary'
import PreviewAttachment from '@/components/PreviewAttachment'
import { fileListApi } from "@/api/warehouse/acceptanceRecords"
import { generateUUID } from '@/utils'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['success']);

const getFileListApi = (pdbId) => {
  loading.value = true
  fileListApi({pageNum: -1, pageSize: -1, pdbId}).then( ({data}) => {
    const list = (data?.list || []).map(item => {
      return {...item, uid: generateUUID()}
    })
    tableData.value = list
  }).finally( () => {
    loading.value = false
  })
}

// 显示弹框
function show(pdbId) {
  visible.value = true
  tableData.value = []
  getFileListApi(pdbId)
}

const handleButtonShow = (code, row) => {
  return true
}

const handleButtonClick = (code, data) => {
  const row = data?.row
  const eventObj = {
    download: () => {
      proxy.$download.name(minioDownload, {fileName: row.fileFormerName})
    },
    preview: async () => {
      const type = row.fileName.substring(row.fileName.lastIndexOf('.') + 1)
      if(uploadTypeArr.includes(type)){
        const url = await proxy.$download.preview(minioDownload, {fileName: row.fileFormerName})
        proxy.$refs.previewAttachment.show(url, type)
      }else{
        proxy.$download.name(minioDownload, {fileName: row.fileFormerName})
      }
    },
  }
  eventObj[code] && eventObj[code]()
}

const handleClickLink = (code, data) => {
  const eventObj = {
  }
  eventObj[code] && eventObj[code]()
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.app-container-file-upload{
  display: inline-block;
  line-height: normal;
  padding: 0 12px;
  :deep(.upload-file-uploader){
    margin-bottom: 0;
  }
  :deep(.ep-upload){
    display: inline-block;
  }
}
</style>