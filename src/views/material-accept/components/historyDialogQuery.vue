<template>
  <ep-dialog title="验收历史" iconTitle="form" v-model="visible" width="1000px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <!-- 表格数据 -->
      <el-pro-table ref="proTableRef" :data="tableData" :pagination="false" :show-action="false" :options="false"
        :columns="historyTableJson" :table-alert-render="false" :show-refresh="false" :show-setting="false">
        <template #acceptanceLevel="{ row }">
          <span>{{ row.acceptanceLevel == '1'?'一级验收':'多级验收' }}</span>
        </template>
        <template #viewAttachment="{ row }">
          <el-link type="primary" @click.stop="viewAttachmentClick(row)">查看</el-link>
        </template>
      </el-pro-table>
    </div>
    <ep-dialog title="验收附件" iconTitle="form" v-model="visiblelist" width="800px" top="5vh" append-to-body>
      <div class="sso-front-table-container app-container">
        <!-- 表格数据 -->
        <el-pro-table ref="proTableRef" :data="fileList" :pagination="false" :columns="fileTableJson" :show-action="false"
          :table-alert-render="false" :show-refresh="false" :show-setting="false" :options="false" @action="onAction">
        </el-pro-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visiblelist = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        </div>
      </template>
      <PreviewAttachment ref="previewAttachment"></PreviewAttachment>
    </ep-dialog>
  </ep-dialog>
</template>

<script setup>
import { historyTableJson, fileTableJson } from "../acceptance-record-maintain/tableJsonQuery"
import { recordList, fileListApi } from '@/api/warehouse/acceptanceRecords'
import { minioDownload } from "@/api/system/minio"
import PreviewAttachment from '@/components/PreviewAttachment'
import { uploadTypeArr } from '@/utils/dictionary'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const visiblelist = ref(false)
const tableData = ref([])
const fileList = ref([])
const pdbIdVal = ref('')

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getRecordList = (pdbId) => {
  proxy.$modal.loading()
  recordList({pdbId, pageSize: -1}).then( ({data}) => {
    tableData.value = data?.list || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })

}

// 显示弹框
function show(pdbId = '') {
  visible.value = true
  getRecordList(pdbId)
}

const getFileList = () => {
  proxy.$modal.loading()
  fileListApi({pageNum: -1, pageSize: -1,pdbId: pdbIdVal.value}).then( ({data}) => {
    fileList.value = data?.list || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

const viewAttachmentClick = (row) => {
  pdbIdVal.value = row.pdbId
  visiblelist.value = true
  getFileList()
}

const clickLink = async (code, data) => {
  if(code === 'fileName'){
    const type = data.fileName.substring(data.fileName.lastIndexOf('.') + 1)
    if(uploadTypeArr.includes(type)){
      const url = await proxy.$download.preview(minioDownload, {fileName: data.fileFormerName})
      proxy.$refs.previewAttachment.show(url, type)
    }else{
      proxy.$download.name(minioDownload, {fileName: data.fileFormerName})
    }
  }
}

const onAction = (payload) => {
  const { name, code, row, selectedRows, files } = payload
  const eventObj = {
    link: () => {
      clickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
</style>