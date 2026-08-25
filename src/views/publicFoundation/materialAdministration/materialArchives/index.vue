<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="12" class="app-container-row">
      <!-- 左侧分类树 -->
      <el-col :span="6" class="app-container-col">
        <el-card shadow="never" class="tree-card">
          <template #header>
            <span>物料分类</span>
          </template>
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable style="margin-bottom: 8px" />
          <el-tree
            ref="treeRef"
            :data="treeOptions"
            :props="{ label: 'matlClassifyName', children: 'children' }"
            node-key="matlClassifyId"
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <!-- 右侧物料列表 -->
      <el-col :span="18" class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
          :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <operate ref="operateRef" :tree-options="treeOptions" @createSuccess="getList" />
  </div>
</template>

<script setup name="materialArchives">
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import { materialList, materialBatchRemove } from '@/api/base/materialMatl'
import { classifyTree } from '@/api/base/materialClassify'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('matlId')
const ids = ref([])
const total = ref(0)
const treeOptions = ref([])
const filterText = ref('')
const currentClassifyId = ref('')

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  }
})

const { queryParams } = toRefs(data)

/** 分类树 */
function getTree() {
  classifyTree().then(({ data }) => {
    treeOptions.value = data || []
  })
}

/** 过滤树 */
function filterNode(value, data) {
  if (!value) return true
  return data.matlClassifyName.indexOf(value) !== -1 || (data.matlClassifyCode && data.matlClassifyCode.indexOf(value) !== -1)
}

watch(filterText, val => {
  proxy.$refs.treeRef.filter(val)
})

/** 节点点击 */
function handleNodeClick(node) {
  if (currentClassifyId.value === node.matlClassifyId) {
    currentClassifyId.value = ''
    proxy.$refs.treeRef.setCurrentKey(null)
  } else {
    currentClassifyId.value = node.matlClassifyId
  }
  queryParams.value.pageNum = 1
  getList()
}

/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams.value }
  if (currentClassifyId.value) {
    params.matlClassifyId = currentClassifyId.value
  }
  materialList(params).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total || tableData.value.length
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  currentClassifyId.value = ''
  proxy.$refs.treeRef && proxy.$refs.treeRef.setCurrentKey(null)
  getList()
}

/** 多选框选中 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

/** 新增 */
function handleCreate() {
  proxy.$refs.operateRef.init('create', undefined, currentClassifyId.value)
}

/** 修改 */
function handleUpdate(row) {
  proxy.$refs.operateRef.init('update', row.matlId)
}

/** 删除 */
function handleDelete() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除选中的物料？').then(() => {
    return materialBatchRemove({ ids: ids.value })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    create: () => handleCreate(),
    update: () => handleUpdate(row),
    delete: () => handleDelete()
  }
  eventObj[code] && eventObj[code]()
}

getTree()
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
