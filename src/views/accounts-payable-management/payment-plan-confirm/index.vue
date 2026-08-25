<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <form-data ref="formDataRef" :showSearch="showSearch" :formJson="formJson" @handleQuery="handleQuery" @handleSelectChange="handleSelectChange" :formSelectData="formSelectData"
          @resetQuery="resetQuery" labelWidth="140"></form-data>
        <button-top :buttonJson="tableButtonJson" @handleButton="handleButtonClick" :buttonDisable="handleButtonDisable">
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </button-top>
        <!-- 表格数据 -->
        <table-index class="table-index" :loading="loading" :idName="idName" :queryParams="queryParams" :tableJson="tableJsonArr" :tableButtonJson="tableButtonJson"
          :tableData="tableData" @handleSelectionChange="handleSelectionChange" operationWidth="160" :buttonDisable="handleButtonDisable" :tableDataDict="tableDataDict"
          @handleButtonClick="handleButtonClick" @clickLink="handleClickLink">
          <template #remainPayedAmount="{ scope }">
            <span>{{ (scope.row.sumAmount - scope.row.sumPayedAmount).toFixed(2) }}</span>
          </template>
        </table-index>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />

      </el-col>
    </el-row>

    <upload-dialog ref="uploadDialog" @success="getList" />
    <details-dialog ref="detailsDialog"  idName="planMtId" />
    
  </div>
</template>

<script setup name="payment-plan-confirm">
import { formJson } from "./formJson"
import { tableJson, tableButtonJson } from "./tableJson"
import { getLocalStorage } from '@/utils/auth'
import { prePayPlanDtGetPayPlanDts, prePayPlanDtExport, prePayPlanDtReback, prePayPlanDtSubmitAudit, prePayPlanDtConfirm } from '@/api/warehouse/prePayPlanDt'
import UploadDialog from "./components/uploadDialog"
import DetailsDialog from "@/views/accounts-payable-management/wait-payment-plan-generate/components/detailsDialog"

const { proxy } = getCurrentInstance()

const tableJsonArr = ref(JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJson)
const tableData = ref([])
const loading = ref(false)
const showSearch = ref(true)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    pageType: '1'
  },
  formSelectData: {
  },
  tableDataDict: {}
})

const { queryParams, formSelectData, tableDataDict } = toRefs(data)

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data
}

const handleButtonDisable = (code, row) => {
  if(['modify'].includes(code) && row.status != '0'){
    return false
  }
  return true
}

const handleSelectChange = (code, value) => {
  const eventObj = {
  }
  eventObj[code] && eventObj[code]()
}

/** 查询列表 */
function getList() {
  const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
  loading.value = true
  prePayPlanDtGetPayPlanDts(params).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery(data) {
  queryParams.value.pageNum = 1
  queryParams.value = Object.assign({}, queryParams.value, data)
  getList()
}

/** 重置按钮操作 */
function resetQuery(data) {
  handleQuery(data)
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const isIdsFun = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const isStatusFun = (name = '') => {
  let isAudit = selectionData.value.some(a => a.auditStatus == '1' )
  if(isAudit){
    proxy.$modal.msgWarning(`审批状态为审批中，${name}`)
    return false
  }
  isAudit = selectionData.value.some(a => a.auditStatus == '3' )
  if(isAudit){
    proxy.$modal.msgWarning(`审批状态为审批通过，${name}`)
    return false
  }
  return true
}

const handleUploadEnclosure = () => {
  if(isIdsFun() && isStatusFun('不能上传附件')){
    const payBatchNo = selectionData.value[0].payBatchNo
    const allPayBatchNo = selectionData.value.every(item => item.payBatchNo === payBatchNo)
    if(!allPayBatchNo){
      return proxy.$modal.msgWarning(`请选择相同付款批次号，上传附件`)
    }
    proxy.$refs.uploadDialog.show('upload', payBatchNo, selectionData.value)
  }
}

const handleSubmitForApproval = () => {
  if(isIdsFun() && isStatusFun('不能再次提报付款批次单')){
    proxy.$modal.confirm('您确定要报批所选付款批次单吗？').then(() => {
      proxy.$reviewerDialog({
        billType: 'YFK',
        billIdList: ids.value,
        multiple: true,
        success: ({auditUserId}) => {
          const payBatchNos = selectionData.value.map(item => item.payBatchNo)
          prePayPlanDtSubmitAudit({ids: ids.value, payBatchNos, auditUserId}).then(({message}) => {
            proxy.$modal.msgSuccess(message)
            getList()
          })
        }
      })
    })
  }
}

const handlePaymentConfirm = () => {
  if(isIdsFun()){
    const isStatus = selectionData.value.some(a => a.status == '2' )
    if(isStatus){
      return proxy.$modal.msgWarning('付款状态为已支付，不能再次付款')
    }
    const isAuditStatus = selectionData.value.some(a => a.auditStatus != '3' )
    if(isAuditStatus){
      return proxy.$modal.msgWarning('审批状态为待审批、审批中、审批驳回，不能确认付款')
    }
    proxy.$modal.confirm('您确定要付款确认所选付款批次单吗？').then(() => {
      const payBatchNos = selectionData.value.map(item => item.payBatchNo)
      return prePayPlanDtConfirm({ids: ids.value, payBatchNos})
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleBack = () => {
  if(isIdsFun() && isStatusFun('不能回退付款批次单')){
    proxy.$modal.confirm('您确定要回退所选付款批次单吗？').then(() => {
      const payBatchNos = selectionData.value.map(item => item.payBatchNo)
      return prePayPlanDtReback({ids: ids.value, payBatchNos})
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 报批
    submitForApproval: () => {
      handleSubmitForApproval()
    },
    // 付款确认
    paymentConfirm: () => {
      handlePaymentConfirm()
    },
    // 回退
    back: () => {
      handleBack()
    },
    // 导出
    export: () => {
      const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
      proxy.$download.name(prePayPlanDtExport, params)
    },
    // 上传附件
    uploadEnclosure: () => {
      handleUploadEnclosure()
    },
    history: () => {
      proxy.$flow({bid: data.row.payBatchNo})
    },
  }
  eventObj[code] && eventObj[code]()
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 批次详情
    payBatchNo: () => {
      proxy.$refs.uploadDialog.show('details', data?.payBatchNo)
    },
    // 待付款计划单详情
    prePayPlanCode: () => {
      proxy.$refs.detailsDialog.show(data)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>