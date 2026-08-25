<template>
  <ep-dialog class="ep-dialog-list" :title="dialogType != 'viewInvoice'?'发票附件补传':'查看发票附件'" iconTitle="form" v-model="visible" width="900px" top="5vh" append-to-body>
    <div class="app-container">
      <button-top :buttonJson="invoiceTableButtonJson" @handleButton="handleButtonClick" v-if="dialogType != 'viewInvoice'"></button-top>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="invoiceTableJson" :tableButtonJson="dialogType != 'viewInvoice'?invoiceTableButtonJson:[]" :tableData="tableData"
        @handleButtonClick="handleButtonClick" :buttonShow="handleButtonShow" @clickLink="handleClickLink" operationWidth="270">
        <template #invoiceCode="{ scope }">
          <el-input v-if="dialogType != 'viewInvoice'" v-model="scope.row.invoiceCode" clearable />
          <span v-else>{{ scope.row.invoiceCode }}</span>
        </template>
        <template #upload="{ scope }" v-if="dialogType != 'viewInvoice'">
          <file-upload buttonName="点击上传附件" :isShowTip="false" :isShowUploadFile="false" :drag="false" :fileSize="10" buttonType="text"
            :action="resPoolMinioUpload+'/prePay'" @uploadSuccess="(res, file) => handleUploadSuccess(res, file, scope)" class="app-container-file-upload"/>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button v-if="dialogType != 'viewInvoice'" type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
      </div>
    </template>
    <PreviewAttachment ref="previewAttachment"></PreviewAttachment>
  </ep-dialog>
</template>

<script setup>
import { saveInvoiceFilesByPrePay, selectInvoiceListByPddId } from '@/api/warehouse/prePay'
import { invoiceTableJson, invoiceTableButtonJson } from "../tableJson"
import { resPoolMinioUpload, resPoolMinioDownload } from "@/api/system/minio"
import { uploadTypeArr } from '@/utils/dictionary'
import PreviewAttachment from '@/components/PreviewAttachment'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const dialogType = ref('invoiceUpload')
const tableData = ref([])
const pddIds = ref([])

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['success']);

const getSelectInvoiceListByPddId = (pddId) => {
  proxy.$modal.loading()
  selectInvoiceListByPddId({pddId}).then( ({data}) => {
    tableData.value = data || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(type = 'invoiceUpload', ids) {
  visible.value = true
  dialogType.value = type
  pddIds.value = ids
  tableData.value = []
  if(type == 'viewInvoice'){
    getSelectInvoiceListByPddId(ids[0])
  }
}

const handleButtonShow = (code, row) => {
  return true
}

const handleButtonClick = (code, scope) => {
  const eventObj = {
    // 新增发票附件补传列表行
    create: () => {
      tableData.value.push({invoiceCode: '', originFileName: '', fileId: '', fileName: '', fileType: '', fileUrl: '', fileSeq: '', source: '1'})
    },
    delete: () => {
      tableData.value.splice(scope.$index, 1)
    },
  }
  eventObj[code] && eventObj[code]()
}

const handleClickLink = (code, data) => {
  const eventObj = {
    originFileName: async () => {
      const type = data.fileName.substring(data.fileName.lastIndexOf('.') + 1)
      if(uploadTypeArr.includes(type)){
        const url = await proxy.$download.preview(resPoolMinioDownload, {fileName: data.fileName})
        proxy.$refs.previewAttachment.show(url, type)
      }else{
        proxy.$download.name(resPoolMinioDownload, {fileName: data.fileName})
      }
    }
  }
  eventObj[code] && eventObj[code]()
}

const handleUploadSuccess = (res, file, scope) => {
  scope.row.originFileName = res.data.originFileName
  scope.row.fileName = res.data.fileName
  scope.row.fileType = res.data.fileType
  scope.row.fileUrl = res.data.fileUrl
  scope.row.fileSeq = scope.$index+1
}

const saveBtn = () => {
  if(!tableData.value.length){
    proxy.$modal.msgWarning('请上传附件')
    return
  }
  proxy.$modal.loading()
  saveInvoiceFilesByPrePay({pddIds: pddIds.value, files: tableData.value}).then( ({message}) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    emit('success')
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
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