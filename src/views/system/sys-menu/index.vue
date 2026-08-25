<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="12" class="app-container-row">
      <!-- 左侧菜单树 -->
      <el-col :span="5" class="app-container-col">
        <el-card shadow="never" class="tree-card">
          <template #header>
            <span>菜单树</span>
          </template>
          <el-input v-model="filterText" placeholder="输入关键字过滤" clearable class="tree-filter" />
          <el-tree
            ref="treeRef"
            v-loading="loading"
            :data="tableData"
            :props="{ label: 'menuName', children: 'children' }"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <span class="tree-node">{{ data.menuName }}</span>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <!-- 右侧菜单列表 -->
      <el-col :span="19" class="app-container-col">
        <el-form :model="queryParams" ref="queryRef" inline class="menu-search" @submit.prevent>
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="菜单编码" prop="menuCode">
            <el-input v-model="queryParams.menuCode" placeholder="请输入菜单编码" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 160px">
              <el-option label="启用" :value="0" />
              <el-option label="停用" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="menu-toolbar">
          <el-button type="primary" icon="Plus" @click="handleCreate">新增</el-button>
          <el-button type="danger" icon="Delete" @click="handleDelete()">删除</el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="displayData"
          border
          fit
          row-key="id"
          :tree-props="{ children: 'children' }"
          default-expand-all
          @selection-change="onSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="menuName" label="菜单名称" min-width="180" />
          <el-table-column prop="menuCode" label="菜单编码" min-width="130" />
          <el-table-column prop="parentName" label="上级菜单" min-width="130" />
          <el-table-column prop="menuIcon" label="图标" width="70" align="center">
            <template #default="{ row }">
              <svg-icon v-if="row.menuIcon" :icon-class="row.menuIcon" />
            </template>
          </el-table-column>
          <el-table-column prop="menuUrl" label="菜单URL" min-width="170" show-overflow-tooltip />
          <el-table-column prop="component" label="组件地址" min-width="150" show-overflow-tooltip />
          <el-table-column prop="seq" label="排序" width="70" align="center" />
          <el-table-column prop="menuType" label="菜单类型" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="row.menuType === '2' ? 'warning' : ''">{{ row.menuType === '2' ? '外部' : '内部' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'danger' : 'success'">{{ row.status === 1 ? '停用' : '启用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isHide" label="是否隐藏" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="row.isHide === 1 ? 'warning' : 'info'">{{ row.isHide === 1 ? '隐藏' : '显示' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="230">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleUpdate(row)">修改</el-button>
              <el-button type="primary" link @click="handleAddChild(row)">新增下级</el-button>
              <el-button type="primary" link @click="handleCopy(row)">复制</el-button>
              <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <operate ref="operateRef" @createSuccess="getList()" />
  </div>
</template>

<script setup name="system-menu">
import Operate from "./components/operate"
import { menuTree, menuDeleteBatch } from '@/api/base/menu'

const { proxy } = getCurrentInstance()

const tableData = ref([])
const loading = ref(false)
const ids = ref([])
const queryParams = reactive({
  menuName: '',
  menuCode: '',
  status: undefined
})

// 左侧树：关键字过滤 + 点选节点筛选（再点取消，查全部）
const filterText = ref('')
const treeRef = ref()
const selectedNodeId = ref('')

watch(filterText, val => treeRef.value?.filter(val))

function filterNode(value, data) {
  if (!value) return true
  return (data.menuName || '').includes(value)
}

function handleNodeClick(data) {
  if (data.id === selectedNodeId.value) {
    selectedNodeId.value = ''
    treeRef.value?.setCurrentKey(null)
  } else {
    selectedNodeId.value = data.id
  }
}

/** 查询菜单树 */
function getList() {
  loading.value = true
  menuTree().then(({ data }) => {
    tableData.value = data || []
  }).finally(() => {
    loading.value = false
  })
}

/** 选中节点的子树 */
function findSubtree(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return [node]
    if (node.children?.length) {
      const found = findSubtree(node.children, id)
      if (found.length) return found
    }
  }
  return []
}

/** 表格数据：左侧树选中子树 + 检索条件本地过滤（保留匹配节点的父子路径） */
const displayData = computed(() => {
  let data = tableData.value
  if (selectedNodeId.value) {
    data = findSubtree(data, selectedNodeId.value)
  }
  return filterTree(data)
})

function filterTree(nodes) {
  const name = (queryParams.menuName || '').trim()
  const code = (queryParams.menuCode || '').trim()
  const status = queryParams.status
  return (nodes || []).reduce((acc, node) => {
    const children = node.children?.length ? filterTree(node.children) : []
    const selfMatch = (!name || (node.menuName || '').includes(name))
      && (!code || (node.menuCode || '').includes(code))
      && (status === undefined || status === null || status === '' || node.status === status)
    if (selfMatch || children.length) {
      acc.push({ ...node, children })
    }
    return acc
  }, [])
}

/** 重置查询条件 */
function resetQuery() {
  queryParams.menuName = ''
  queryParams.menuCode = ''
  queryParams.status = undefined
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item.id)
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

/** 复制 */
function handleCopy(row) {
  proxy.$refs.operateRef.init('copy', row.id)
}

/** 删除（传row为行内删除，否则删除勾选数据） */
function handleDelete(row) {
  const deleteIds = row?.id ? [row.id] : ids.value
  if (!deleteIds.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  const tip = row?.id ? '是否确认删除该条菜单及其子菜单？' : '是否确认删除选中的菜单？'
  proxy.$modal.confirm(tip).then(() => {
    return menuDeleteBatch({ ids: deleteIds })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

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

.tree-filter {
  margin-bottom: 8px;
}

.tree-node {
  font-size: 14px;
}

.menu-search {
  margin-bottom: 4px;
}

.menu-toolbar {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
}
</style>
