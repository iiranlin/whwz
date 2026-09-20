<template>
  <div class="app-container">
    <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :default-search-form="defaultSearchForm" :data="tableData"
      :total="total" :columns="tableJsonList" :table-alert-render="false" :show-action="false" @field-click="handleFieldClick"
      :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
      @action="onAction" @selection-change="onSelectionChange" :footer-config="footerConfig">
      <template #matlTypeSlot="{ row }">
        <span>{{`${row.matlType}${row.matlRaw?'/'+row.matlRaw:''}${row.matlpCode?'/'+row.matlpCode:''}`}}</span>
      </template>
    </el-pro-table>
    <detail-dialog @dialogClose="detailDialogClose" title="入库单详情" :visible="detailVisible" :currentData="currentData" width="90%" />
  </div>
</template>

<script setup name="inbound-query">
import { columns, toolbarConfig } from "./tableJson"
import { getCookie } from '@/utils/auth'
import { inboundComprehensiveSearch, exportComprehensiveSearch, inboundComprehensiveSearchStat } from '@/api/rmstor/steel-inbound'
import { obdtHasArr } from '@/utils/dictionary'
import { getDateFirstDayLastDay } from '@/utils'
// import detailDialog from "@/views/rmstor/warehouse-receipt/maintain/components/newDetailQuery.vue";  // 将仓储系统中的newDetail重命名了
import detailDialog from "@/views/rmstor/warehouse-receipt/maintain/components/newDetail";  
import { useTableSummaryFooter } from '@/composables/useTableSummaryFooter'

const { proxy } = getCurrentInstance()
const proTableRef = ref()
const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const columnsData = ref([])
const tableJsonList = ref([])
const detailVisible = ref(false)
const currentData = ref({})

const dateStr = getCookie("warehouseYearMonth")

const dateRangeInitial = [
  proxy.parseTime(getDateFirstDayLastDay(dateStr, 'firstDay'), "{y}-{m}-{d}"),
  proxy.parseTime(getDateFirstDayLastDay(dateStr, 'lastDay'), "{y}-{m}-{d}"),
]

// 从复合控件值中提取 dateType 和 dateRange
function extractOrderDate(composite) {
  if (!composite) return { dateType: '1', dateRange: dateRangeInitial }
  if (Array.isArray(composite)) return { dateType: '1', dateRange: composite }
  return {
    dateType: composite.dateType ?? '1',
    dateRange: composite.dateRange ?? dateRangeInitial,
  }
}

const data = reactive({
  defaultSearchForm: {
    orderDate: { dateType: '1', dateRange: dateRangeInitial },
    has: []
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    dateType: '1',
    orderDate: dateRangeInitial,
    has: []
  },
  plantList: [],
  summaryData: []
})

const { queryParams, summaryData, defaultSearchForm } = toRefs(data)

const { footerConfig } = useTableSummaryFooter({
  summaryData,
  columns: tableJsonList,
  proTableRef,
})

async function init () {
  columnsData.value = await columns()
  tableJsonList.value = columnsData.value.map(a => ({...a}))
}

onMounted(async () => {
  await init()
  getList()
})

/** 查询列表 */
function getList() {
  loading.value = true
  const params = {...proxy.addDateRange(queryParams.value, queryParams.value.orderDate, 'orderDate')}
  delete params.orderDate
  inboundComprehensiveSearch(params).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
  inboundComprehensiveSearchStat(params).then(({ data }) => {
    summaryData.value = [
      {label: '合计 数量：', value: data?.totalPuNum || 0},
      {label: '购入金额：', value: data?.totalStkAmount || 0},
      {label: '入库金额：', value: data?.totalStandardAmount || 0},
      // {label: '料差合计：', value: data?.totalCurrentOutNum || 0},
    ]
  })
}

const groupByFieldObj = {
  'SUP_UNIT_CODE': ['supUnitName', 'ibSource', 'paNum', 'stkAmount', 'standardAmount'],
  'PLANT_CODE': ['plantName', 'paNum', 'stkAmount', 'standardAmount'],
  'DEPOT_CODE': ['depotName', 'paNum', 'stkAmount', 'standardAmount'],
  'IB_BILL_CODE': ['ibBillCode', 'invoiceCode', 'refBillCode', 'paNum', 'stkAmount', 'standardAmount'],
  'MATL_CODE': ['matlCode', 'matlName', 'matlTypeSlot', 'matlUnit', 'paNum', 'stkAmount', 'standardAmount'],
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  const { dateType, dateRange } = extractOrderDate(form.orderDate)
  queryParams.value = {
    ...form,
    ...pageInfo,
    dateType,
    orderDate: dateRange,
    groupByField: form.groupByField?.join(',')
  }
  tableJsonList.value = columnsData.value.map(a => ({...a}))
  const groupByFieldList = form.groupByField || []
  if(groupByFieldList.length){
    let isTrue = true
    groupByFieldList.forEach( (val) => {
      if(isTrue){
        tableJsonList.value.map(item => {
          item.hideInTable = true
          return item
        })
        isTrue = false
      }
      tableJsonList.value.map( item => {
        if(groupByFieldObj[val].includes(item.field)){
          item.hideInTable = false
        }
        return item
      })
    })
  }
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
}

const onAction = (payload) => {
  const { name, code, row, selectedRows, files } = payload
  const eventObj = {
    // 导出
    export: () => {
      const params = {...proxy.addDateRange(queryParams.value, queryParams.value.orderDate, 'orderDate')}
      delete params.orderDate
      proxy.$download.name(exportComprehensiveSearch, params)
    },
    link: () => {
      if(name === 'ibBillCode'){
        currentData.value = row
        detailVisible.value = true
      }
    }
  }
  eventObj[code] && eventObj[code]()
}

const handleFieldClick = (payload) => {
  const {fieldName} = payload
  const eventObj = {
    deptName: () => {

    }
  }
  eventObj[fieldName] && eventObj[fieldName]()
}

const detailDialogClose = () => {
  currentData.value = {}
  detailVisible.value = false
}
</script>
<style lang="scss" scoped>
/* 覆盖 el-pro-table search-form 中 checkbox 字段的宽度：
   el-pro-table search-form 硬编码 span=6 (25%)，
   用 :has() 定位 checkbox-group 所在 el-col，改成 span=18 (75%) */
:deep(.ep-pro-table .ep-col-6:has(.ep-checkbox-group)) {
  flex: 0 0 75% !important;
  max-width: 75% !important;
  // min-width: max-content;
  padding-top: 10px;
}
:deep(.ep-pro-table .ep-input-number) {
  width: 100%;
}
</style>
