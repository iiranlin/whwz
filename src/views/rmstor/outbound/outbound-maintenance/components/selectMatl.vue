<!-- 选择物资明细（自采供货单新增明细使用） -->
<template>
  <ep-dialog class="ep-dialog-list" title="选择出库单明细信息" iconTitle="form" v-model="visible" width="85vw" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize" :data="tableData"
        :total="total" @search="onSearch" :show-checkbox="true" :grid-options="{ rowId: 'cardId' }" :search-collapse-threshold="5"
        :show-action="false" table-id="outbound-select-matl" :key="tableKey" v-loading="loading" @selection-change="handleSelectionChange">
        <template #matlType="{ row }">
          <span>{{ `${row.matlType}${row.matlRaw ? '/' + row.matlRaw : ''}${row.matlPcode ? '/' + row.matlPcode : ''}` }}</span>
        </template>
      </el-pro-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveClick"><svg-icon
            icon-class="determine" />&nbsp;保存</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup name="self-supply-order-select-matl">
import { paramMaltList } from '@/api/rmstor/outbound-maintenance'
const { proxy } = getCurrentInstance()

const emit = defineEmits(['saveSelect'])

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectionData = ref([])
// 已存在明细的物资编码，避免重复添加
const alreadyCodes = ref([])
const mode = ref('addDetail')
// 仓库过滤参数（用料地区、仓库、仓库分区）
const maltParams = ref({})
// 每次打开递增，强制 el-pro-table 重建内部搜索表单，避免 isNotZeroArr 勾选残留
const tableKey = ref(0)

const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
})

const columnsData = ref([
  { field: 'matlCode', title: '物资编号', minWidth: 120, align: 'center', searchable: true, searchType: 'input' },
  { field: 'matlName', title: '物资名称', minWidth: 120, align: 'left', searchable: true, searchType: 'input' },
  { field: 'matlType', title: '规格型号', minWidth: 120, align: 'left', searchable: true, searchType: 'input', hideInTable: true },
  { field: "isNotZeroArr", title: "库存", minWidth: 160, hideInTable: true, searchable: true, searchType: 'checkbox', searchDefaultValue: [], searchProps: { options: [{ label: '库存不为0', value: '1' }] } },
  { field: 'matlType', title: '规格型号', minWidth: 160, align: 'left', type: 'slot' },
  { field: 'matlRaw', title: '材质', minWidth: 100, align: 'center' },
  { field: 'matlPicCode', title: '图号', minWidth: 120, align: 'center' },
  { field: 'matlUnit', title: '计量单位', minWidth: 100, align: 'center' },
  { field: 'nowNum', title: '库存数量', minWidth: 120, align: 'right', formatter: (row, column, cellValue) => cellValue != null ? Number(cellValue).toFixed(4) : '' },
  { field: 'cardPrice', title: '库存单价', minWidth: 120, align: 'right', formatter: (row, column, cellValue) => cellValue != null ? Number(cellValue).toFixed(2) : '' },
  { field: 'batchNo', title: '批次号', minWidth: 120, align: 'center' },
  { field: 'expirationDate', title: '到期日期', minWidth: 120, align: 'center' },
])

/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams.value, ...maltParams.value }
  params.isNotZero = !!params.isNotZeroArr?.length
  delete params.isNotZeroArr
  paramMaltList(params).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total || 0
  }).finally(() => {
    loading.value = false
  })
}

function onSearch(params, pageConfig) {
  queryParams.value = { ...params, ...pageConfig }
  getList()
}

function handleSelectionChange(rows) {
  selectionData.value = rows
}

/** 打开弹窗（alreadyList 为已存在的明细行，params 为仓库过滤参数） */
function show(alreadyList = [], params = {}) {
  visible.value = true
  selectionData.value = []
  queryParams.value = { pageNum: 1, pageSize: 30, isNotZeroArr: [] }
  maltParams.value = { ...params }
  alreadyCodes.value = (alreadyList || []).map(item => item.matlCode || item.smatlCode)
  tableKey.value++  // 强制 el-pro-table 重建，内部 searchForm 回到 searchDefaultValue
  proxy.$nextTick(() => {
    getList()
  })
}

function saveClick() {
  if (!selectionData.value.length) {
    proxy.$modal.msgWarning('请选择要添加的物资明细')
    return
  }
  const duplicate = selectionData.value.filter(item => alreadyCodes.value.includes(item.matlCode))
  if (duplicate.length) {
    proxy.$modal.msgWarning('以下物资已存在: ' + duplicate.map(item => item.matlCode).join(','))
    return
  }
  // 保存选择的物资明细
  selectionData.value.forEach(item => {
    item.price = item.cardPrice
  })
  emit('saveSelect', selectionData.value, mode.value)
  visible.value = false
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
:deep(.ep-pro-table__search-area .ep-form .ep-row .ep-col:last-child .ep-form-item .ep-form-item__label) {
  display: none !important;
}
</style>
