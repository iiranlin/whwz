<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes default-theme" @resize="resizeSplit">
        <pane size="16" class="integrated-manage-pane-tree">
        <el-col>
          <div class="integrated-manage-tree-divs">
            <h1 class="supplier-region-dict-h1">菜单树</h1>
            <div class="head-container-input">
              <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable suffix-icon="Search" />
            </div>
            <el-scrollbar class="head-container-tree">
          <el-tree
            ref="treeRef"
            class="drawer-tree"
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
        </el-scrollbar>
        </div>
      </el-col>
      </pane>
      <!-- 右侧菜单列表 -->
      <pane size="84" class="integrated-manage-pane-form">
        <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="200"
          :columns="columns" :toolbar-config="toolbarConfig"
          :data="displayData" :total="total"
          :tree-config="{ children: 'children' }" row-key="id"
          :default-expand-all="true"
          :show-pagination="false" :show-checkbox="true"
          :grid-options="{ rowId: 'id' }" table-id="sys-menu"
          @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
          <!-- 列 slot -->
          <template #menuIcon="{ row }">
            <svg-icon v-if="row.menuIcon" :icon-class="row.menuIcon" />
          </template>
          <template #menuType="{ row }">
            <el-tag :type="row.menuType === '2' ? 'warning' : ''">{{ row.menuType === '2' ? '外部' : '内部' }}</el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === 1 ? 'danger' : 'success'">{{ row.status === 1 ? '停用' : '启用' }}</el-tag>
          </template>
          <template #isHide="{ row }">
            <el-tag :type="row.isHide === 1 ? 'warning' : 'info'">{{ row.isHide === 1 ? '隐藏' : '显示' }}</el-tag>
          </template>
        </el-pro-table>
      </el-col>
    </pane>
    </splitpanes>
    </el-row>

    <operate ref="operateRef" @createSuccess="getList()" />
  </div>
</template>

<script setup name="system-menu">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import Operate from "./components/operate"
import { columns, toolbarConfig } from "./tableJson"
import { menuTree, menuDeleteBatch } from '@/api/base/menu'

const { proxy } = getCurrentInstance()

const tableData = ref([])
const loading = ref(false)
const total = ref(0)
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
const resizeSplitData = ref(0)
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
const onSearch = (params) => {
  queryParams.menuName = ''
  queryParams.menuCode = ''
  queryParams.status = undefined
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item.id)
}

/** ProTable 工具栏 + 行内按钮回调 */
const onAction = ({ code, row, selectedRows }) => {
  const eventObj = {
    // 顶部工具栏
    create: () => handleCreate(),
    delete: () => handleDelete(),
    // 行内按钮
    update: () => handleUpdate(row),
    addChild: () => handleAddChild(row),
    copy: () => handleCopy(row),
    deleteRow: () => handleDelete(row),
  }
  eventObj[code] && eventObj[code]()
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
const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}
getList()
</script>

<style lang="scss" scoped>
.splitpanes__pane:nth-child(1) {
  width: 16%;
  min-width: 286px;
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
