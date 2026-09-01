<template>
<div class="el-tabs-main">
  <el-row :gutter="20" class="app-container-row">
    <splitpanes class="app-container-splitpanes default-theme" @resize="resizeSplit">
      <pane size="16" class="integrated-manage-pane-tree">
      <el-col>
        <div class="integrated-manage-tree-divs">
          <h1 class="supplier-region-dict-h1">部门</h1>
          <div class="head-container-input">
            <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable suffix-icon="Search" />
          </div>
          <el-scrollbar class="head-container-tree">
        <el-tree ref="treeRef" class="drawer-tree"v-loading="deptLoading" :data="deptOptions"
          :props="{ label: 'deptName', children: 'children' }" node-key="id" highlight-current
          :expand-on-click-node="false" :filter-node-method="filterNode" @node-click="handleNodeClick" />
      </el-scrollbar>
      </div>
      </el-col>
    </pane>
    <!-- 右侧用户列表 -->
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

<script setup name="AclQuerysUserList">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
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
</style>
