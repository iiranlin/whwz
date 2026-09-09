<!-- 选择物资明细（自采供货单新增明细使用） -->
<template>
  <ep-dialog class="ep-dialog-list" title="选择物资明细" iconTitle="form" v-model="visible" width="70vw" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize" :data="tableData"
        :total="total" @search="onSearch" :show-checkbox="true" :grid-options="{ rowId: 'matlCode' }"
        :show-action="false" table-id="self-supply-order-select-matl" v-loading="loading" @selection-change="handleSelectionChange">
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
import { paramConfignoAuthorizeList } from '@/api/materialAccept/acceptMaterial'
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

const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
})

const columnsData = ref([
  { field: 'matlCode', title: '物资编号', minWidth: 140, align: 'center', searchable: true, searchType: 'input' },
  { field: 'matlName', title: '物资名称', minWidth: 160, align: 'left', searchable: true, searchType: 'input' },
  { field: 'matlType', title: '规格型号/材质/图号', minWidth: 220, align: 'left', type: 'slot' },
  { field: 'matlUnit', title: '计量单位', minWidth: 100, align: 'center' },
  { field: 'matlRaw', title: '材质', minWidth: 100, align: 'center' },
  { field: 'matlPcode', title: '图号', minWidth: 120, align: 'center' },
  { field: 'manageRuleName', title: '物资管理权限', minWidth: 130, align: 'center' },
])

/** 查询列表 */
function getList() {
  loading.value = true
  paramConfignoAuthorizeList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
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

/** 打开弹窗（alreadyList 为已存在的明细行） */
function show(alreadyList = []) {
  visible.value = true
  selectionData.value = []
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
