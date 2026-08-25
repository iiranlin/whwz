<template>
  <div class="app-container app-container-splitpanes">
    <el-pro-table ref="proTableRef" v-loading="loading" action-width="240" :page-size="30" :data="tableData"
      :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
      :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
      @selection-change="onSelectionChange">
    </el-pro-table>

    <operate ref="operateRef" @createSuccess="getList" />
  </div>
</template>

<script setup name="supplierArchives">
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import { supplierList, supplierBatchRemove, supplierDisable, supplierResetStatus } from '@/api/base/supplier'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('suId')
const ids = ref([])
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  }
})

const { queryParams } = toRefs(data)

/** 查询列表 */
function getList() {
  loading.value = true
  supplierList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total || 0
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  getList()
}

/** 多选框选中 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

/** 新增 */
function handleCreate() {
  proxy.$refs.operateRef.init('create')
}

/** 修改 */
function handleUpdate(row) {
  proxy.$refs.operateRef.init('update', row.suId)
}

/** 删除（行内单条 / 顶部批量） */
function handleDelete(row) {
  const delIds = row && row.suId ? [row.suId] : ids.value
  if (!delIds.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除选中的供应商？').then(() => {
    return supplierBatchRemove({ ids: delIds })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message || '删除成功')
    getList()
  }).catch(() => {})
}

/** 限制/取消限制合作 */
function handleDisable(row) {
  const isBanned = row.banned === '1'
  const msg = isBanned ? '取消限制合作' : '限制合作'
  proxy.$modal.confirm(`是否${msg}?`).then(() => {
    return supplierDisable(row.suId, isBanned ? 'start' : 'stop')
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message || `${msg}成功`)
    getList()
  }).catch(() => {})
}

/** 撤回（撤审） */
function handleWithdraw(row) {
  proxy.$modal.confirm('是否确认撤回?').then(() => {
    loading.value = true
    return supplierResetStatus(row.suId)
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message || '撤回成功')
    getList()
  }).catch(() => {
  }).finally(() => {
    loading.value = false
  })
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    create: () => handleCreate(),
    update: () => handleUpdate(row),
    delete: () => handleDelete(row),
    disableCooperate: () => handleDisable(row),
    withdraw: () => handleWithdraw(row)
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>
