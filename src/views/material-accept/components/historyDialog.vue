<template>
  <div>
  <ep-dialog title="验收历史" iconTitle="form" v-model="visible" width="1000px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="historyTableJson" :tableData="tableData">
        <template #acceptanceLevel="{ scope }">
          <span>{{ scope.row.acceptanceLevel == '1'?'一级验收':'多级验收' }}</span>
        </template>
        <template #acceptanceNumber="{ scope }">
          <span>{{ scope.row.acceptanceNumber != null ? Number(scope.row.acceptanceNumber).toFixed(4) : '' }}</span>
        </template>
        <template #viewAttachment="{ scope }">
          <el-link type="primary" @click.stop="viewAttachmentClick(scope)">查看</el-link>
        </template>
      </table-index>
      <!-- 分页 -->
      <div class="ep-pro-table__pagination">
        <el-pagination
          v-show="total > 0"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
     <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
          <el-button type="primary" class="determine-btn" @click="visible = false"><svg-icon
            icon-class="determine" />&nbsp;确定</el-button>
        </div>
      </template>
    
  </ep-dialog>
  <ep-dialog title="验收附件上传" iconTitle="form" v-model="visiblelist" width="800px" top="5vh" append-to-body>
      <div class="sso-front-table-container app-container">
        <!-- 表格数据 -->
        <table-index class="table-index" :selectionShow="false" :tableJson="fileTableJson"
          :tableData="fileList" @clickLink="clickLink">
        </table-index>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visiblelist = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        </div>
      </template>
      <PreviewAttachment ref="previewAttachment"></PreviewAttachment>
    </ep-dialog>
  </div>
</template>

<script setup>
import { historyTableJson, fileTableJson } from "../acceptance-record-maintain/tableJson"
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
const pageNum = ref(1)
const pageSize = ref(30)
const total = ref(0)
const currentPdbId = ref('')

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getRecordList = () => {
  proxy.$modal.loading()
  recordList({ pdbId: currentPdbId.value, pageNum: pageNum.value, pageSize: pageSize.value }).then(({ data }) => {
    tableData.value = data?.list || []
    total.value = data?.total || 0
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(pdbId = '') {
  currentPdbId.value = pdbId
  pageNum.value = 1
  pageSize.value = 30
  visible.value = true
  getRecordList()
}

function handleSizeChange(size) {
  pageSize.value = size
  pageNum.value = 1
  getRecordList()
}

function handleCurrentChange(current) {
  pageNum.value = current
  getRecordList()
}

const getFileList = () => {
  proxy.$modal.loading()
  fileListApi({pageNum: -1, pageSize: -1,pdbId: pdbIdVal.value}).then( ({data}) => {
    fileList.value = data?.list || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

const viewAttachmentClick = (scope) => {
  pdbIdVal.value = scope.row.pdbId
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

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.ep-pro-table__pagination {
  display: flex;
  justify-content: center;
  margin-top: 6px;
  :deep(.ep-pagination__total) {
    font-size: 13px !important;
    color: #909399 !important;
  }
}
</style>