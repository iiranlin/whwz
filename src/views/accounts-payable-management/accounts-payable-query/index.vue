<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <form-data ref="formDataRef" :showSearch="showSearch" :formJson="formJson" @handleQuery="handleQuery" @handleSelectChange="handleSelectChange" :formSelectData="formSelectData"
          @resetQuery="resetQuery" labelWidth="120"></form-data>
        <button-top :buttonJson="tableButtonJson" @handleButton="handleButtonClick" :buttonDisable="handleButtonDisable">
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </button-top>
        <!-- 表格数据 -->
        <table-index class="table-index" :loading="loading" :idName="idName" :queryParams="queryParams" :tableJson="tableJsonArr" :tableButtonJson="tableButtonJson"
          :tableData="tableData" @handleSelectionChange="handleSelectionChange" :buttonDisable="handleButtonDisable" :tableDataDict="tableDataDict"
          @handleButtonClick="handleButtonClick" @clickLink="handleClickLink">
          <template #remainPayedAmount="{ scope }">
            <span>{{ (scope.row.sumAmount - scope.row.sumPayedAmount).toFixed(2) }}</span>
          </template>
        </table-index>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />

      </el-col>
    </el-row>

    <upload-dialog ref="uploadDialog" />
    <details-dialog ref="detailsDialog"  idName="planMtId" />
  </div>
</template>

<script setup name="accounts-payable-query">
import { formJson } from "./formJson"
import { tableJson, tableButtonJson } from "./tableJson"
import { getLocalStorage } from '@/utils/auth'
import { prePayPlanDtGetPayPlanDts, prePayPlanDtExport } from '@/api/warehouse/prePayPlanDt'
import DetailsDialog from "@/views/accounts-payable-management/wait-payment-plan-generate/components/detailsDialog"
import UploadDialog from "@/views/accounts-payable-management/payment-plan-confirm/components/uploadDialog"

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
    pageType: '2'
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
  const params1 = proxy.addDateRange(params, params.confirmDate, 'confirmDate')
  loading.value = true
  prePayPlanDtGetPayPlanDts(params1).then(({ data }) => {
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

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 导出
    export: () => {
      const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
      const params1 = proxy.addDateRange(params, params.confirmDate, 'confirmDate')
      proxy.$download.name(prePayPlanDtExport, params1)
    }
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