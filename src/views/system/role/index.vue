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
    <user-auth-dialog ref="userAuthRef" />
    <menu-bind-dialog ref="menuBindRef" @createSuccess="getList()" />
  </div>
</template>

<script setup name="system-role">
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import UserAuthDialog from "./components/userAuthDialog"
import MenuBindDialog from "./components/menuBindDialog"
import { rolePage, roleDeleteBatch } from '@/api/base/role'

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
  rolePage(queryParams.value).then(({ data }) => {
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

/** 删除 */
function handleDelete() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除选中的角色？').then(() => {
    return roleDeleteBatch({ ids: ids.value })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    create: () => proxy.$refs.operateRef.init('create'),
    update: () => proxy.$refs.operateRef.init('update', row.id),
    delete: () => handleDelete(),
    authUser: () => proxy.$refs.userAuthRef.init(row),
    bindMenu: () => proxy.$refs.menuBindRef.init(row)
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>
