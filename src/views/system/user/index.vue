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
      <!-- 右侧用户列表 -->
      <el-col :span="18" class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="210" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
          :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <operate ref="operateRef" @createSuccess="getList()" />
    <role-dialog ref="roleRef" />
    <reset-pwd-dialog ref="resetPwdRef" />
  </div>
</template>

<script setup name="system-user">
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import RoleDialog from "./components/roleDialog"
import ResetPwdDialog from "./components/resetPwdDialog"
import { userPage, userDeleteBatch, unlockUser } from '@/api/base/user'
import { deptTree } from '@/api/base/dept'

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

/** 递归过滤树，只保留前2层级 */
function filterTreeDepth(list, depth) {
  if (!list || depth > 2) return []
  return list.map(item => ({
    ...item,
    children: depth < 2 && item.children ? filterTreeDepth(item.children, depth + 1) : []
  }))
}

/** 部门树 */
function getDeptTree() {
  deptTree().then(({ data }) => {
    let treeData = []
    if (data && data[0] && data[0].deptCode === '10000001') {
      treeData = data[0].children || []
    } else {
      treeData = data || []
    }
    deptOptions.value = filterTreeDepth(treeData, 1)
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
    params.deptId = currentDeptId.value
  }
  userPage(params).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total
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

/** 删除 */
function handleDelete() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除选中的用户？').then(() => {
    return userDeleteBatch({ ids: ids.value })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

/** 解锁 */
function handleUnlock(row) {
  proxy.$modal.confirm('确定解锁该用户吗？').then(() => {
    return unlockUser({ id: row.id })
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
    resetPwd: () => proxy.$refs.resetPwdRef.init(row),
    role: () => proxy.$refs.roleRef.init(row),
    unlock: () => handleUnlock(row)
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
