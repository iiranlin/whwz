<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="100" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
          :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <detail-drawer ref="detailRef" />
  </div>
</template>

<script setup name="log-operate">
import { columns, toolbarConfig } from "./tableJson"
import DetailDrawer from "./components/detailDrawer"
import { operateLogPage, operateLogDeleteBatch } from '@/api/base/log'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
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
  operateLogPage(queryParams.value).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

/** 删除（传row为行内删除，否则删除勾选数据） */
function handleDelete(row) {
  const deleteIds = row?.id ? [row.id] : ids.value
  if (!deleteIds.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  const tip = row?.id ? '是否确认删除该条操作日志？' : '是否确认删除选中的操作日志？'
  proxy.$modal.confirm(tip).then(() => {
    return operateLogDeleteBatch({ ids: deleteIds })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

/** 详情 */
function handleDetail(row) {
  proxy.$refs.detailRef.init(row.id)
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    delete: () => handleDelete(row),
    detail: () => handleDetail(row)
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>
