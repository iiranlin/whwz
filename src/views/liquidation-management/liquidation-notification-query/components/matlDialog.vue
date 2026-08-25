<template>
  <ep-dialog class="ep-dialog-list" title="物资明细" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="app-container">
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="matlDetailsTableJson" :tableButtonJson="matlDetailstableButtonJson" :tableData="tableData"
        @handleButtonClick="handleButtonClick">
        <template #matlType="{ scope }">
          <span>{{`${scope.row.matlType}${scope.row.matlRaw?'/'+scope.row.matlRaw:''}${scope.row.matlpCode?'/'+scope.row.matlpCode:''}`}}</span>
        </template>
        <template #onlyTaxAmount="{ scope }">
          <span>{{ (scope.row.taxAmount - scope.row.noTaxAmount).toFixed(2) }}</span>
        </template>
      </table-index>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
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
import { getNoticeMatls } from '@/api/warehouse/prePay'
import { matlDetailsTableJson, matlDetailstableButtonJson } from "../tableJson"
import SaveInvoiceFiles from "@/views/liquidation-management/wait-liquidation-material-check/components/saveInvoiceFiles"
const { proxy } = getCurrentInstance()

const visible = ref(false)
const tableData = ref([])
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  rowData: {}
})

const { queryParams, rowData} = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['success']);

const getList = () => {
  proxy.$modal.loading()
  getNoticeMatls({...queryParams.value, dtId: rowData.value.id}).then(({data}) => {
    tableData.value = data.list || []
    total.value = data.total || 0
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

const handleButtonClick = (code, data) => {
  const eventObj = {
    viewInvoice: () => {
      proxy.$refs.saveInvoiceFiles.show('viewInvoice', [data?.row.pddId])
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