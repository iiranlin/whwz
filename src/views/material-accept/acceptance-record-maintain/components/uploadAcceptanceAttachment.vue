<template>
  <ep-dialog title="验收附件上传" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item label="温馨提示：" class="form-div-p">
            <p>【文件格式】：文件格式不限制，图片预览支持：jpg、gif、png、bmp、jpeg；</p>
            <p>【文件大小】：单个文件不超过10M；</p>
            <p>【批量上传】：每种证件类型一次最多允许上传5个文件；</p>
          </el-form-item>
          <el-form-item label="证件类型：" prop="status" :rules="[{ required: rowData.acceptanceLevel != '1', message: '请选择证件类型', trigger: ['blur', 'change'] }]">
            <el-radio-group v-model="formData.status" style="margin-right: 20px;" @change="statusChange">
              <el-radio v-for="(item, key) in documentTypeObj" :key="key" :value="key">{{ item }}</el-radio>
            </el-radio-group>
            <!-- <file-upload v-model="formData.fileList" :row="rowData" :isShowTip="false" :isShowUploadFile="false" :drag="false" :fileSize="10" :fileType="[]" :action="minioUpload"/> -->
            <file-upload v-show="formData.status == key" v-for="(item, key) in documentTypeObj" :key="key" v-model="fileData[`fileList${key}`]"
              :row="rowData" :isShowTip="false" :isShowUploadFile="false" :drag="false" :fileSize="10" :fileType="[]" :action="minioUpload"
              :limitPrompt="documentTypeObj[formData.status]"/>
          </el-form-item>
        </div>
      </el-form>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="fileTableJson" :tableButtonJson="fileTableButtonJson"
        :tableData="formData.fileList" @handleButtonClick="handleButtonClick" @clickLink="clickLink">
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
      </div>
    </template>
    <PreviewAttachment ref="previewAttachment"></PreviewAttachment>
  </ep-dialog>
</template>

<script setup>
import { fileTableJson, fileTableButtonJson } from "../tableJson"
import { minioUpload, minioDownload } from "@/api/system/minio"
import { fileBatchCreate, fileListApi } from "@/api/warehouse/acceptanceRecords"
import { documentTypeObj, uploadTypeArr } from '@/utils/dictionary'
import PreviewAttachment from '@/components/PreviewAttachment'
import { generateUUID } from '@/utils'
const { proxy } = getCurrentInstance()

const visible = ref(false)

const rowData = ref({})

const data = reactive({
  formData: {
    status: '1',
    fileList: []
  },
  rules: {
    status: [{ required: true, message: '请选择证件类型', trigger: ['blur', 'change']}],
  },
  fileData: {
    fileList1: [],
    fileList2: [],
    fileList3: [],
    fileList4: [],
  }
})

const { formData, rules, fileData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

watch(fileData, (newVal) => {
  let list = []
  for (const key in newVal) {
    if (!Object.hasOwn(newVal, key)) continue
    const element = newVal[key]
    list.push(...element)
  }
  formData.value.fileList = list
},{deep: true})

const getFileList = (pdbId) => {
  proxy.$modal.loading()
  fileListApi({pageNum: -1, pageSize: -1,pdbId}).then( ({data}) => {
    const list = data?.list || [].map(item => {
      return {...item, uid: generateUUID()}
    })
    formData.value.fileList = list
    list.forEach(a => {
      fileData.value[`fileList${a.type}`].push(a)
    })
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

const statusChange = () => {
  rowData.value = {...rowData.value, type: formData.value.status}
}

// 显示弹框
function show(row = {}) {
  visible.value = true
  formData.value.status = '1'
  formData.value.fileList = []
  rowData.value = {...row, type: formData.value.status}
  fileData.value = {
    fileList1: [],
    fileList2: [],
    fileList3: [],
    fileList4: []
  }
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    getFileList(row.pdbId)
  })

}

const handleButtonClick = (code, data) => {
  const eventObj = {
    delete: () => {
      for (const key in fileData.value) {
        if (!Object.hasOwn(fileData.value, key)) continue
        fileData.value[key].forEach((val, index) => {
          if(val.uid === formData.value.fileList[data.$index].uid){
            fileData.value[key].splice(index, 1)
          }
        })
      }
      formData.value.fileList.splice(data.$index, 1)
    }
  }
  eventObj[code] && eventObj[code]()
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      fileBatchCreate({paramList: formData.value.fileList, pdbId: rowData.value.pdbId}).then( ({message}) => {
          proxy.$modal.msgSuccess(message)
          visible.value = false
          emit('createSuccess')
      }).finally( () => {
        proxy.$modal.closeLoading()
      })
    }
  })
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
.dialog.ep-dialog{
  .sso-front-table-container{
    height: 500px !important;
  }
}
.form-div-p{
  :deep(.ep-form-item__label){
    color: #f56c6c;
  }
  :deep(.ep-form-item__content){
    flex-direction: column;
    align-items: flex-start;
    p{
      margin: 0;
      padding: 0;
      line-height: 20px;
    }
  }
}
</style>