<template>
  <div class="app-container app-container-splitpanes">
    <el-pro-table ref="proTableRef" v-loading="loading" :columns="columns" :data="tableData" :params="queryParams"
      :page-size="queryParams.pageSize" :total="totalRow" :footer-config="footerConfig" :sort-remote="false"
      :default-search-form="defaultSearchForm" :editable="false" :show-action="false" row-key="adjust-query" border
      @search="onSearch" @action="onAction" :grid-options="{ rowId: 'id', rowStyle: handleRowStyle }">
      <template #matlTypeSlot="{ row }">
        <span>{{ `${row.matlType}${row.matlRaw ? '/' + row.matlRaw : ''}${row.matlpCode ? '/' + row.matlpCode : ''}`
        }}</span>
      </template>
    </el-pro-table>
    <create-dialog ref="createDialog" @createSuccess="getList" />
  </div>
</template>
<script setup name="adjust-query">
import { adjustQueryList } from '@/api/query/integrated-query'
import CreateDialog from "@/views/rmstor/adjust/adjustment-order/components/createDialogQuery"
import { getCookie } from '@/utils/auth'
const { proxy } = getCurrentInstance()
const proTableRef = shallowRef(null)
const tableData = ref([])
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,

})
const loading = ref(false)
const totalRow = ref(0)
const summaryData = ref()

/** footerConfig：开启原生 footer，method 返回占位空数组 */
const footerConfig = computed(() => ({
  enabled: true,
  method: () => Array(columns.value.length || 1).fill('')
}))

/** 将 footer 行所有 td 合并成一个 colspan=可见列数 的 td，展示 summaryData */
function applySummaryFooter() {
  nextTick(() => {
    const proTableEl = proTableRef.value?.$el
    if (!proTableEl || !summaryData.value.length) return
    const footerRow = proTableEl.querySelector('.ep-table__footer tr, .el-table__footer tr')
    if (!footerRow) return
    const visibleCols = columns.value.filter(c => !c.hideInTable).length
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
const initDate = () => {
  const date = new Date(getCookie("warehouseYearMonth"));
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return [formatDate(firstDay), formatDate(lastDay)]
}
const defaultSearchForm = {
  orderDate: initDate()
};
const onAction = ({ code, row, selectedRows }) => {
  const eventObj = {
    //详情
    link: () => {
      proxy.$refs.createDialog.show('details', row)
    }
  }
  eventObj[code] && eventObj[code]()
}

const tableColumns = [
  {
    field: 'adjustCode',
    title: '调整单号',
    type: 'link',
    searchable: true,
    searchType: 'input',
    minWidth: 160,
  },
  {
    field: 'flag',
    title: '状态',
    type: 'dict',
    searchable: true,
    searchType: 'select',
    searchProps: {
      options: [
        { label: '未提交', value: '0' },
        { label: '未登卡', value: '1' },
        { label: '已登卡', value: '2' },
      ],
    },
  },
  {
    field: 'orderDate',
    title: '制单日期',
    type: 'date',
    searchable: true,
    searchType: 'dateRange',
  },
  {
    field: 'subDate',
    title: '提交日期',
    type: 'date',
  },
  {
    field: 'noteDate',
    title: '登卡日期',
    type: 'date',
  },
  {
    field: 'permDate',
    title: '审核日期',
    type: 'date',
  },
  {
    field: 'permName',
    title: '审核人',
  },
  {
    field: 'bmName',
    title: '制单人',
  },
  {
    field: 'plantName',
    title: '用料地区',
  },
  {
    field: 'depotName',
    title: '仓库',
  },
  {
    field: 'partitionName',
    title: '仓库分区',
  },
  {
    field: 'matlCode',
    title: '物资编码',
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'matlName',
    title: '物资名称',
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'matlType',
    title: '规格型号/材质/图号',
  },
  {
    field: 'matlUnit',
    title: '计量单位',
  },
  {
    field: 'batchNo',
    title: '批次号',
  },
  {
    field: 'produceDate',
    title: '生产日期',
  },
  {
    field: 'validityPeriod',
    title: '有效期',
  },
  {
    field: 'validityPeriodUnit',
    title: '有效期单位',
  },
  {
    field: 'expirationDate',
    title: '到期日期',
  },
  {
    field: 'cardPrice',
    title: '库存单价（元）',
    type: 'amount',
  },
  {
    field: 'prNum',
    title: '调整前数量',
    type: 'amount',
  },
  {
    field: 'ptNum',
    title: '调整后数量',
    type: 'amount',
  },
  {
    field: 'prAmount',
    title: '调整前金额（元）',
    type: 'amount',
  },
  {
    field: 'ptAmount',
    title: '调整后金额（元）',
    type: 'amount',
  },
  {
    field: 'profitAmount',
    title: '盈亏金额（元）',
    type: 'amount',
  },
  {
    field: 'isPush',
    title: '报账状态',
    type: 'dict',
    searchProps: {
      options: [
        { label: '未报账', value: '0' },
        { label: '已报账', value: '1' },
      ],
    },
  },
]
const columns = ref(tableColumns)
const getList = async () => {
  loading.value = true
  try {
    const form = proTableRef.value?.getSearchForm?.()
    const paramsObj = proxy.addDateRange(queryParams.value, form.orderDate, 'orderDate')
    delete queryParams.value.orderDate

    const { data: { dataList: { list, total }, totalProfitAmount } } = await adjustQueryList(paramsObj)
    loading.value = false
    tableData.value = list
    totalRow.value = total
    summaryData.value = [{ label: '盈亏金额合计：', value: totalProfitAmount + '元' }]
  } catch (error) {
    loading.value = false
  }

}
const onSearch = (params, pageConfig) => {
  const form = proTableRef.value?.getSearchForm?.()
  const paramsObj = proxy.addDateRange({ ...params, ...pageConfig }, form?.orderDate, 'orderDate')
  queryParams.value = paramsObj
  getList()
}
const handleRowStyle = ({ row }) => {
  if (row.backFlag == "1") {
    return { color: "red" }
  }
  return {}
}
onMounted(async () => {
  await nextTick()
  getList()
})

// summaryData 变化时重新合并 footer 行
watch(summaryData, () => { applySummaryFooter() }, { deep: true })
</script>
<style lang="scss" scoped>
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
