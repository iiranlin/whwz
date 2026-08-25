<template>
  <el-row :gutter="12" class="container-row">
    <!-- 左侧角色树 -->
    <el-col :span="4" class="container-col">
      <el-card shadow="never" class="tree-card">
        <template #header><span>角色</span></template>
        <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable style="margin-bottom: 8px" />
        <el-tree ref="treeRef" v-loading="roleLoading" :data="roleOptions"
          :props="{ label: 'roleName', children: 'children' }" node-key="id" highlight-current
          :expand-on-click-node="false" :filter-node-method="filterNode" @node-click="handleNodeClick">
          <template #default="{ data }">
            <span class="custom-tree-node">
              <el-icon><User /></el-icon>
              <el-tooltip :content="`${data.roleName}【${data.roleCode}】`" :show-after="300" placement="top" effect="dark">
                <span class="over-ellipsis">{{ data.roleName }}【{{ data.roleCode }}】</span>
              </el-tooltip>
            </span>
          </template>
        </el-tree>
      </el-card>
    </el-col>
    <!-- 右侧已分配用户列表 -->
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

<script setup name="AclQuerysRoleList">
import { rolePage, allocatedUserList } from '@/api/base/role'
import RoleRange from './roleRange'

const treeRef = ref(null)
const roleRangeRef = ref(null)
const loading = ref(false)
const roleLoading = ref(false)
const filterText = ref('')
const roleOptions = ref([])
const currentRoleId = ref('')
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
  getRolePage()
})

/** 树过滤：名称/编码文本匹配 */
function filterNode(value, rowData) {
  if (!value) return true
  return (rowData.roleName || '').includes(value) || (rowData.roleCode || '').indexOf(value) !== -1
}

/** 角色列表 */
function getRolePage() {
  roleLoading.value = true
  rolePage().then(({ data }) => {
    roleOptions.value = data.list || []
    roleLoading.value = false
    if (roleOptions.value.length) {
      currentRoleId.value = roleOptions.value[0].id
      nextTick(() => treeRef.value?.setCurrentKey(currentRoleId.value))
      getList()
    }
  }).catch(() => { roleLoading.value = false })
}

/** 角色节点点击 */
function handleNodeClick(node) {
  currentRoleId.value = node.id
  queryParams.value.pageNum = 1
  if (node.id) getList()
}

/** 查询已分配用户列表 */
function getList() {
  loading.value = true
  allocatedUserList({ ...queryParams.value, roleId: currentRoleId.value }).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total
  }).finally(() => { loading.value = false })
}

/** 搜索 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
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

.custom-tree-node {
  display: flex;
  align-items: center;
  font-size: 14px;

  .el-icon {
    margin-right: 6px;
  }

  .over-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
