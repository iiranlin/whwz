<template>
  <ep-dialog class="ep-dialog-list" title="付款记录" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="app-container">
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="payedDetailsTableJson" :tableData="tableData" operationWidth="200">
        <template #matlType="{ scope }">
          <span>{{`${scope.row.matlType}${scope.row.matlRaw?'/'+scope.row.matlRaw:''}${scope.row.matlpCode?'/'+scope.row.matlpCode:''}`}}</span>
        </template>
        <template #onlyTaxAmount="{ scope }">
          <span>{{ (scope.row.taxAmount - scope.row.noTaxAmount).toFixed(2) }}</span>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
    <saveInvoiceFiles ref="saveInvoiceFiles" />
  </ep-dialog>
</template>

<script setup>
import { prePayPlanDtDetail } from '@/api/warehouse/prePayPlanDt'
import { payedDetailsTableJson } from "../tableJson"
import SaveInvoiceFiles from "@/views/liquidation-management/wait-liquidation-material-check/components/saveInvoiceFiles"
const { proxy } = getCurrentInstance()

const visible = ref(false)
const tableData = ref([])

const data = reactive({
  rowData: {}
})

const { rowData} = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['success']);

const getList = () => {
  proxy.$modal.loading()
  prePayPlanDtDetail(rowData.value.planMtId).then(({data}) => {
    tableData.value = data || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(row = {}) {
  visible.value = true
  tableData.value = []
  rowData.value = row
  getList()
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
</style>