<template>
  <ep-dialog class="ep-dialog-list" title="上传附件" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="app-container">
      <!-- <el-form class="form-wrapper" ref="elForm" label-width="100px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="prePayNoticeNo" label="选择生成日期：">
                <span></span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form> -->
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="detailsTableJson" :tableButtonJson="detailsTableButtonJson" :tableData="tableData"
        @clickLink="handleClickLink" @handleButtonClick="handleButtonClick" operationWidth="110">
      </table-index>
      <file-upload v-model="fileList" buttonName="添加附件" :disabled="dialogType == 'details'" :isShowTip="false" :drag="false" :fileSize="10" :limit="10"
        :action="minioUpload" @uploadSuccess="handleUploadSuccess" @deleteSuccess="handleDeleteSuccess" class="app-container-file-upload"/>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button v-if="tableData[0]?.auditStatus == '1'" type="primary" class="determine-btn" @click="handleApprove('1')">审批</el-button>
        <el-button v-if="tableData[0]?.auditStatus == '1'" type="primary" class="determine-btn" @click="handleApprove('2')">驳回</el-button>
      </div>
    </template>
    <saveInvoiceFiles ref="saveInvoiceFiles" />
  </ep-dialog>
</template>

<script setup>
import { getDtsByBatchNo, prePayPlanDtUploadFile, prePayPlanDtDeleteFile, prePayPlanDtReview } from '@/api/warehouse/prePayPlanDt'
import { detailsTableJson, detailsTableButtonJson } from "../tableJson"
import { minioUpload } from "@/api/system/minio"
import SaveInvoiceFiles from "@/views/liquidation-management/wait-liquidation-material-check/components/saveInvoiceFiles"
import { prePayPlanGetPddIds } from '@/api/warehouse/prePayPlan'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const dialogType = ref('')
const tableData = ref([])
const payBatchNo = ref('')
const fileList = ref([])

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['success']);

const getList = () => {
  proxy.$modal.loading()
  getDtsByBatchNo(payBatchNo.value).then(({data}) => {
    tableData.value = data.dts || []
    fileList.value = data.files || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

const getPrePayPlanGetPddIds = async (planMtId) => {
  try {
    const res = await prePayPlanGetPddIds(planMtId)
    const pddIds = res.data || []
    proxy.$refs.saveInvoiceFiles.show('viewInvoice', pddIds)
  } catch (error) {
    console.error(error)
  }
}

// 显示弹框
function show(type, batchNo) {
  visible.value = true
  dialogType.value = type
  payBatchNo.value = batchNo
  getList()
}

const handleClickLink = (code, data) => {
  const eventObj = {
  }
  eventObj[code] && eventObj[code]()
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 查看发票附件
    viewInvoice: () => {
      getPrePayPlanGetPddIds(data?.row.planMtId)
    },
  }
  eventObj[code] && eventObj[code]()
}

const setPrePayPlanDtUploadFile = (files) => {
  prePayPlanDtUploadFile({files, payBatchNos: [payBatchNo.value]}).then( ({message}) => {
    proxy.$modal.msgSuccess(message)
    getList()
  })
}

const handleUploadSuccess = (res, file) => {
  const files = fileList.value.filter(item => !item.fileId)
  if(files.length){
    setPrePayPlanDtUploadFile(files)
  }
}

const handleDeleteSuccess = (file) => {
  prePayPlanDtDeleteFile(file.fileId).then( ({message}) => {
    proxy.$modal.msgSuccess(message)
    getList()
  })
}


const setPrePayPlanDtReview = (isApproved, comment) => {
  prePayPlanDtReview({billType: 'YFK', comment, payBatchNos: [payBatchNo.value], state: isApproved}).then(({message}) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    emit('success')
  })
}

const handleApprove = (isApproved) => {
  if(isApproved === '1'){
    // 无工作流：直接审批通过，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId
    // proxy.$reviewerDialog({
    //   billId: payBatchNo.value,
    //   multiple: true,
    //   urlType: false,
    //   success: ({auditUserId, comment}) => {
    //     setPrePayPlanDtReview(isApproved, auditUserId, comment)
    //   }
    // })
    setPrePayPlanDtReview(isApproved, '')
  }else{
    proxy.$modal.prompt('驳回原因', {
      inputValidator: (val) => {
        if(!val.trim()) return '驳回原因不能为空'
        return true
      },
      inputErrorMessage: '请输入驳回原因'
    }).then( (data) => {
      setPrePayPlanDtReview(isApproved, data.value)
    })
  }
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
  :deep(.ep-button){
    line-height: 1.15;
    height: 30px;
  }
  :deep(.upload-file-list){
    display: flex;
    flex-wrap: wrap;
    .el-upload-list__item{
      width: 270px;
      border: none;
      margin-right: 22px;
      background: none;
      .ep-link--default{
        .el-icon-document{
          display: inline-block;
          width: 212px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>