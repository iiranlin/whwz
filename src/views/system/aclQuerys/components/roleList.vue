<template>
<div class="el-tabs-main">
  <el-row :gutter="20" class="app-container-row">
    <splitpanes class="app-container-splitpanes default-theme" @resize="resizeSplit">
      <pane size="16" class="integrated-manage-pane-tree">
      <el-col>
        <div class="integrated-manage-tree-divs">
          <h1 class="supplier-region-dict-h1">角色</h1>
          <div class="head-container-input">
            <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable suffix-icon="Search" />
          </div>
          <el-scrollbar class="head-container-tree">
        <el-tree ref="treeRef" class="drawer-tree" v-loading="roleLoading" :data="roleOptions"
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
       </el-scrollbar>
        </div>
      </el-col>
     </pane>
    <!-- 右侧已分配用户列表 -->
    <pane size="84" class="integrated-manage-pane-form">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" :data="tableData" :total="total" :columns="columns"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: 'id' }" @search="onSearch" @action="onAction">
        </el-pro-table>
    </el-col>

    <role-range ref="roleRangeRef" />
  </pane>
  </splitpanes>
</el-row>
</div>
</template>

<script setup name="AclQuerysRoleList">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
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
const resizeSplitData = ref(0)
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
const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}
</script>

<style lang="scss" scoped>
.el-tabs-main {
  height: 100%;
}
.splitpanes__pane:nth-child(1) {
  width: 16%;
  min-width: 286px;
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
