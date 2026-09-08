<!-- 选择物资明细（自采供货单新增明细使用） -->
<template>
  <ep-dialog class="ep-dialog-list" title="选择出库单明细信息" iconTitle="form" v-model="visible" width="85vw" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize" :data="tableData"
        :total="total" @search="onSearch" :show-checkbox="true" :grid-options="{ rowId: 'matlCode' }" :search-collapse-threshold="5"
        :show-action="false" table-id="self-supply-order-select-matl" @selection-change="handleSelectionChange">
        <template #matlType="{ row }">
          <span>{{ `${row.matlType}${row.matlRaw ? '/' + row.matlRaw : ''}${row.matlPcode ? '/' + row.matlPcode : ''}` }}</span>
        </template>
        <template #tableExtra>
          <el-checkbox v-model="isNotZero" @change="handleIsNotZeroChange">库存不为0</el-checkbox>
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
const isNotZero = ref(false)

const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
})

const columnsData = ref([
  { field: 'matlCode', title: '物资编号', minWidth: 120, align: 'center', searchable: true, searchType: 'input' },
  { field: 'matlName', title: '物资名称', minWidth: 120, align: 'left', searchable: true, searchType: 'input' },
  { field: 'matlType', title: '规格型号', minWidth: 120, align: 'left', searchable: true, searchType: 'input', hideInTable: true },
  // 库存不为0   isNotZero
  { field: "isNotZeroArr", title: " ", minWidth: 120, hideInTable: true },
  { field: 'matlType', title: '规格型号', minWidth: 160, align: 'left', type: 'slot' },
  { field: 'matlRaw', title: '材质', minWidth: 100, align: 'center' },
  { field: 'matlPcode', title: '图号', minWidth: 120, align: 'center' },
  { field: 'matlUnit', title: '计量单位', minWidth: 100, align: 'center' },
  { field: 'nowNum', title: '库存数量', minWidth: 120, align: 'right', formatter: (row, column, cellValue) => cellValue != null ? Number(cellValue).toFixed(4) : '' },
  { field: 'price', title: '库存单价', minWidth: 120, align: 'right', formatter: (row, column, cellValue) => cellValue != null ? Number(cellValue).toFixed(2) : '' },
  { field: 'batchNo', title: '批次号', minWidth: 120, align: 'center' },
  { field: 'expirationDate', title: '到期日期', minWidth: 120, align: 'center' },
])

/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams.value, isNotZeroArr: isNotZero.value ? 1 : 0 }
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

function handleIsNotZeroChange() {
  queryParams.value = { ...queryParams.value, pageNum: 1 }
  getList()
}

function handleSelectionChange(rows) {
  selectionData.value = rows
}

/** 打开弹窗（alreadyList 为已存在的明细行） */
function show(alreadyList = []) {
  visible.value = true
  selectionData.value = []
  isNotZero.value = false
  alreadyCodes.value = (alreadyList || []).map(item => item.matlCode || item.smatlCode)
  getList()
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
  emit('saveSelect', selectionData.value, mode.value)
  visible.value = false
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
