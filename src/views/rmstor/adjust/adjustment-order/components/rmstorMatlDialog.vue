<template>
  <ep-dialog class="ep-dialog-list" title="选择物资" iconTitle="form" v-model="visible" width="85vw" top="5vh"
    append-to-body>
    <div class="sso-front-table-container app-container">
      <el-pro-table ref="proTableRef" :columns="rmstorMatlTableJson" :page-size="queryParams.pageSize"
        :search-collapse-threshold="5" :data="tableData" :total="total" @search="onSearch" :show-checkbox="true"
        selection-mode="multiple" :grid-options="{ rowId: 'cardId' }" :default-search-form="defaultSearchForm"
        @selection-change="handleSelectionChange" :show-action="false" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon
            icon-class="determine" />&nbsp;保存</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { rmstorMatlTableJson } from "../tableJson"
import { rmstorMatlSelectPageList } from '@/api/rmstor/price-adjustment'
import { generateUUID } from '@/utils'
const { proxy } = getCurrentInstance()
const visible = ref(false)
const loading = ref(false)
const tableData = ref([])

const selectionData = ref([])
const total = ref(0)
const defaultSearchForm = {
  isRepertory: '0',
};
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
  isRepertory: defaultSearchForm.isRepertory,
  partitionCode: '',
  depotCode: ""
})

const proTableRef = shallowRef(null)
const emit = defineEmits(['selectChange']);
// 已添加物料key列表（打开弹窗时勾选回显用，key=物资编码+批次号）
const selectedKeys = ref([])
const keyOf = r => r.matlCode + '|' + (r.batchNo || '')

// 显示弹框（selectedRows：调用方已添加的明细行，按物资编码+批次号回显勾选）
const show = async ({ partitionCode, depotCode }, selectedRows = []) => {
  visible.value = true
  queryParams.value.partitionCode = partitionCode
  queryParams.value.depotCode = depotCode
  selectedKeys.value = selectedRows.map(keyOf)
  selectionData.value = []
  proTableRef.value?.reset?.()
  getList()
}

/** 查询列表 */
function getList() {
  loading.value = true
  rmstorMatlSelectPageList(queryParams.value).then(({ data }) => {
    tableData.value = (data.list || []).map(a => { return { ...a, uid: generateUUID() } })
    total.value = data.total
    // 勾选回显已添加的物料（按物资编码+批次号匹配，setSelectedRows 内部会先清空上次勾选）
    nextTick(() => {
      proTableRef.value?.clearSelection?.()
      const rows = selectedKeys.value.length
        ? tableData.value.filter(r => selectedKeys.value.includes(keyOf(r)))
        : []
      if (rows.length) proTableRef.value?.setSelectedRows?.(rows)
    })
  }).finally(() => {
    loading.value = false
  })
}
const onSearch = (params, pageConfig) => {
  queryParams.value = Object.assign({},
    { ...params, ...pageConfig },
    {
      partitionCode: queryParams.value.partitionCode,
      depotCode: queryParams.value.depotCode
    })
  getList()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection
}
const saveBtn = () => {
  if (!selectionData.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  emit('selectChange', selectionData.value)
  visible.value = false
}
defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
