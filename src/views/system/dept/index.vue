<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="12" class="app-container-row">
      <!-- 左侧部门树 -->
      <el-col :span="6" class="app-container-col">
        <el-card shadow="never" class="tree-card">
          <template #header>
            <span>部门</span>
          </template>
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable style="margin-bottom: 8px" />
          <el-tree
            ref="treeRef"
            :data="deptOptions"
            :props="{ label: 'deptName', children: 'children' }"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <!-- 右侧部门列表 -->
      <el-col :span="18" class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="180" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
          :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <operate ref="operateRef" @createSuccess="getList()" />
  </div>
</template>

<script setup name="system-dept">
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import { deptListAll, deptDeleteBatch, deptTree } from '@/api/base/dept'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const total = ref(0)
const deptOptions = ref([])
const filterText = ref('')
const currentDeptId = ref('')

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  }
})

const { queryParams } = toRefs(data)

/** 部门树 */
function getDeptTree() {
  deptTree().then(({ data }) => {
    if (data && data[0] && data[0].deptCode === '10000001') {
      deptOptions.value = data[0].children || []
    } else {
      deptOptions.value = data || []
    }
  })
}

/** 过滤树 */
function filterNode(value, data) {
  if (!value) return true
  return data.deptName.indexOf(value) !== -1 || (data.deptCode && data.deptCode.indexOf(value) !== -1)
}

watch(filterText, val => {
  proxy.$refs.treeRef.filter(val)
})

/** 节点点击 */
function handleNodeClick(node) {
  if (currentDeptId.value === node.id) {
    currentDeptId.value = ''
    proxy.$refs.treeRef.setCurrentKey(null)
  } else {
    currentDeptId.value = node.id
  }
  queryParams.value.pageNum = 1
  getList()
}

/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams.value }
  if (currentDeptId.value) {
    params.parentId = currentDeptId.value
  }
  deptListAll(params).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total || tableData.value.length
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  currentDeptId.value = ''
  proxy.$refs.treeRef && proxy.$refs.treeRef.setCurrentKey(null)
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

/** 新增 */
function handleCreate() {
  proxy.$refs.operateRef.init('create')
}

/** 新增下级 */
function handleAddChild(row) {
  proxy.$refs.operateRef.init('create', undefined, row)
}

/** 修改 */
function handleUpdate(row) {
  proxy.$refs.operateRef.init('update', row.id)
}

/** 批量修改 */
function handleBatchModify() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择要修改的部门')
    return
  }
  proxy.$refs.operateRef.init('batch', undefined, undefined, ids.value)
}

/** 删除 */
function handleDelete() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除选中的部门？').then(() => {
    return deptDeleteBatch({ ids: ids.value })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    create: () => handleCreate(),
    addChild: () => handleAddChild(row),
    update: () => handleUpdate(row),
    batchModify: () => handleBatchModify(),
    delete: () => handleDelete()
  }
  eventObj[code] && eventObj[code]()
}

getDeptTree()
getList()
</script>

<style lang="scss" scoped>
.tree-card {
  height: 100%;

  :deep(.el-card__body) {
    max-height: calc(100vh - 200px);
    overflow: auto;
  }
}
</style>
