<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="180" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
          :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <operate ref="operateRef" @createSuccess="getList()" />
    <notice-message ref="noticeMessageRef" />
  </div>
</template>

<script setup name="system-notice">
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import NoticeMessage from "./components/noticeMessage"
import { noticePage, noticeDeleteBatch, noticePublish, noticeUnPublish } from '@/api/base/notice'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
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
  noticePage(queryParams.value).then(({ data }) => {
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
  selectionData.value = rows
  ids.value = rows.map(item => item[idName.value])
}

/** 新增 */
function handleCreate() {
  proxy.$refs.operateRef.init('create')
}

/** 修改 */
function handleUpdate(row) {
  proxy.$refs.operateRef.init('update', row.id)
}

/** 删除 */
function handleDelete() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除通知？').then(() => {
    return noticeDeleteBatch({ ids: ids.value })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

/** 发布 */
function handlePublish(row) {
  proxy.$modal.confirm('确定发布该通知吗？').then(() => {
    return noticePublish(row.id)
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

/** 撤回 */
function handleUnPublish(row) {
  proxy.$modal.confirm('确定撤回该通知吗？').then(() => {
    return noticeUnPublish(row.id)
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

/** 查看内容 */
function handleView(row) {
  proxy.$refs.noticeMessageRef.init(row.noticeMessage)
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    create: () => handleCreate(),
    update: () => handleUpdate(row),
    delete: () => handleDelete(),
    publish: () => handlePublish(row),
    unPublish: () => handleUnPublish(row),
    view: () => handleView(row)
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>
