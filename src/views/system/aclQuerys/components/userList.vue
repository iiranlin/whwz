<template>
  <el-row :gutter="12" class="container-row">
    <!-- 左侧部门树 -->
    <el-col :span="4" class="container-col">
      <el-card shadow="never" class="tree-card">
        <template #header><span>部门</span></template>
        <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable style="margin-bottom: 8px" />
        <el-tree ref="treeRef" v-loading="deptLoading" :data="deptOptions"
          :props="{ label: 'deptName', children: 'children' }" node-key="id" highlight-current
          :expand-on-click-node="false" :filter-node-method="filterNode" @node-click="handleNodeClick" />
      </el-card>
    </el-col>
    <!-- 右侧用户列表 -->
    <el-col :span="20" class="container-col">
      <el-card shadow="never" class="table-card">
        <el-pro-table ref="proTableRef" v-loading="loading" :data="tableData" :total="total" :columns="columns"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: 'id' }" @search="onSearch" @action="onAction">
        </el-pro-table>
      </el-card>
    </el-col>

    <role-range ref="roleRangeRef" />
  </el-row>
</template>

<script setup name="AclQuerysUserList">
import { userPage } from '@/api/base/user'
import { deptTree } from '@/api/base/dept'
import RoleRange from './roleRange'

const { proxy } = getCurrentInstance()

const treeRef = ref(null)
const roleRangeRef = ref(null)
const loading = ref(false)
const deptLoading = ref(false)
const filterText = ref('')
const deptOptions = ref([])
const currentDeptId = ref('')
const tableData = ref([])
const total = ref(0)

const data = reactive({
  queryParams: { pageNum: 1, pageSize: 30 }
})
const { queryParams } = toRefs(data)

const columns = [
  { field: 'username', title: '用户账号', minWidth: 140, searchable: true, searchType: 'input' },
  { field: 'nickName', title: '用户姓名', minWidth: 140, searchable: true, searchType: 'input' },
  { field: 'deptName', title: '所属部门', minWidth: 160 },
  { field: 'roleName', title: '所属角色', minWidth: 200 }
]

const toolbarConfig = {
  buttons: [
    { code: 'detail', name: '详情', showInTop: false, showInRow: true }
  ]
}

watch(filterText, val => treeRef.value?.filter(val))

onMounted(() => {
  getDeptTree()
  getList()
})

/** 部门树 */
function getDeptTree() {
  deptLoading.value = true
  deptTree().then(({ data }) => {
    if (data && data[0] && data[0].deptCode === '10000001') {
      deptOptions.value = data[0].children || []
    } else {
      deptOptions.value = data || []
    }
  }).finally(() => { deptLoading.value = false })
}

/** 树过滤：名称/编码文本匹配 */
function filterNode(value, rowData) {
  if (!value) return true
  return (rowData.deptName || '').includes(value) || (rowData.deptCode || '').indexOf(value) !== -1
}

/** 部门节点点击（再次点击取消选择） */
function handleNodeClick(node) {
  if (currentDeptId.value === node.id) {
    currentDeptId.value = ''
    treeRef.value?.setCurrentKey(null)
  } else {
    currentDeptId.value = node.id
  }
  queryParams.value.pageNum = 1
  getList()
}

/** 查询用户列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams.value }
  if (currentDeptId.value) params.deptId = currentDeptId.value
  userPage(params).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total
  }).finally(() => { loading.value = false })
}

/** 搜索 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  currentDeptId.value = ''
  treeRef.value?.setCurrentKey(null)
  getList()
}

/** 行按钮 */
function onAction({ code, row }) {
  if (code === 'detail') roleRangeRef.value.init(row)
}
</script>

<style lang="scss" scoped>
.container-row {
  height: 100%;
}

.container-col {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.el-card) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .el-card__body {
      flex: 1;
      overflow: auto;
    }
  }
}

.table-card {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    padding: 10px;

    .el-pro-table {
      flex: 1;
    }
  }
}
</style>
