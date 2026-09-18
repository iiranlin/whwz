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

const data = reactive({
  defaultSearchForm: {
    dateType: '1',
    orderDate: [proxy.parseTime(getDateFirstDayLastDay(dateStr, 'firstDay'), "{y}-{m}-{d}"), proxy.parseTime(getDateFirstDayLastDay(dateStr, 'lastDay'), "{y}-{m}-{d}")],
    has: []
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    dateType: '1',
    orderDate: [proxy.parseTime(getDateFirstDayLastDay(dateStr, 'firstDay'), "{y}-{m}-{d}"), proxy.parseTime(getDateFirstDayLastDay(dateStr, 'lastDay'), "{y}-{m}-{d}")],
    has: []
  },
  plantList: [],
  summaryData: []
})

const { queryParams, summaryData, defaultSearchForm } = toRefs(data)

/** footerConfig：开启原生 footer，method 返回占位空数组 */
const footerConfig = computed(() => ({
  enabled: true,
  method: () => Array(tableJsonList.value.length || 1).fill('')
}))

/** 将 footer 行所有 td 合并成一个 colspan=可见列数 的 td，展示 summaryData */
function applySummaryFooter() {
  nextTick(() => {
    const proTableEl = proTableRef.value?.$el
    if (!proTableEl || !summaryData.value.length) return
    const footerRow = proTableEl.querySelector('.ep-table__footer tr, .el-table__footer tr')
    if (!footerRow) return
    const visibleCols = tableJsonList.value.filter(c => !c.hideInTable).length
    const colSpan = visibleCols || footerRow.children.length
    footerRow.innerHTML = ''
    const td = document.createElement('td')
    td.colSpan = colSpan
    td.className = 'summary-footer-cell'
    td.innerHTML = summaryData.value
      .map(s => `<span class="sf-item"><span class="sf-label">${s.label}</span><span class="sf-value">${s.value}</span></span>`)
      .join('')
    footerRow.appendChild(td)
  })
}

async function init () {
  columnsData.value = await columns()
  tableJsonList.value = columnsData.value.map(a => ({...a}))
}

onMounted(async () => {
  await init()
  getList()
})

// summaryData / 列显隐变化时重新合并 footer 行
watch(summaryData, () => { applySummaryFooter() }, { deep: true })
watch(tableJsonList, () => { applySummaryFooter() }, { deep: true })

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
  queryParams.value = { ...form, ...pageInfo, groupByField: form.groupByField?.join(',') }
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
}
/* footer 合并行样式 */
:deep(.ep-table__footer td.summary-footer-cell) {
  background: #f5f7fa !important;
  padding: 12px 16px !important;
  border-radius: 4px;
}
:deep(.ep-table__footer .sf-item){
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding-right: 24px;
  margin-right: 24px;
  border-right: 1px solid #e2e2e2;

}
:deep(.ep-table__footer .sf-item:last-child) {
  border-right: none;
}
:deep(.ep-table__footer .sf-label) {
  color: #909399;
  font-size: 13px;
}
:deep(.ep-table__footer .sf-value){
  color: #1A191A;
  font-weight: 600;
  font-size: 16px;
}
</style>
