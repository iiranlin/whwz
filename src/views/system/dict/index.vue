<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="12" class="app-container-row">
      <!-- 左侧字典树 -->
      <el-col :span="6" class="app-container-col">
        <el-card shadow="never" class="tree-card">
          <template #header>
            <span>字典树</span>
          </template>
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <span class="tree-node">
                <span>{{ data.name }}</span>
              </span>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <!-- 右侧字典列表 -->
      <el-col :span="18" class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="120" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
          :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <operate ref="operateRef" :dept-options="treeData" @createSuccess="getList()" />
  </div>
</template>

<script setup name="system-dict">
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import { dictPage, dictDeleteBatch, dictTree, refreshCache } from '@/api/base/dict'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const total = ref(0)
const treeData = ref([])
const currentParentId = ref(undefined)

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
  const params = { ...queryParams.value }
  if (currentParentId.value) {
    params.parentId = currentParentId.value
  }
  dictPage(params).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 字典树 */
function getTree() {
  dictTree().then(({ data }) => {
    treeData.value = data || []
  })
}

/** 节点点击 */
function handleNodeClick(node) {
  currentParentId.value = node.id
  queryParams.value.pageNum = 1
  getList()
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

/** 新增/修改 */
function handleOperate(type, row) {
  proxy.$refs.operateRef.init(type, row ? row.id : undefined, currentParentId.value)
}

/** 删除 */
function handleDelete() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除选中的字典？').then(() => {
    return dictDeleteBatch({ ids: ids.value })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
    getTree()
  }).catch(() => {})
}

/** 刷新缓存 */
function handleRefresh() {
  proxy.$modal.confirm('确定刷新字典缓存吗？').then(() => {
    return refreshCache()
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
  }).catch(() => {})
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    create: () => handleOperate('create'),
    update: () => handleOperate('update', row),
    delete: () => handleDelete(),
    refresh: () => handleRefresh()
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

.tree-node {
  font-size: 14px;
}
</style>
