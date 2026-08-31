<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes default-theme" @resize="resizeSplit">
        <!-- 左侧部门树 -->
        <pane size="16" class="integrated-manage-pane-tree">
          <el-col>
            <div class="integrated-manage-tree-divs">
              <h1 class="supplier-region-dict-h1">物资分类</h1>
              <div class="head-container-input">
                <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable suffix-icon="Search" />
              </div>
              <el-scrollbar class="head-container-tree">
          <el-tree
            ref="treeRef"
            class="drawer-tree"
            :data="treeOptions"
            :props="{ label: 'matlCateName', children: 'children' }"
            node-key="matlCateCode"
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
          </el-scrollbar>
          </div>
        </el-col>
      </pane>
      <!-- 右侧分类列表 -->
      <pane size="84" class="integrated-manage-pane-form">
        <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="180" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
          :default-search-form="{ effectFlag: '0' }"
          :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
        </el-pro-table>
        </el-col>
      </pane>
    </splitpanes>
    </el-row>

    <operate ref="operateRef" :tree-options="treeOptions" @createSuccess="onOperateSuccess" />
  </div>
</template>

<script setup name="materialClassification">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import { rmstatMatlcateList, rmstatMatlcateTree, rmstatMatlcateBatchRemove } from '@/api/warehouse/rmstatMatlcate'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('matlCateCode')
const ids = ref([])
const total = ref(0)
const treeOptions = ref([])
const filterText = ref('')
const currentParentCode = ref('')
const resizeSplitData = ref(0)
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    // 默认只显示启用状态数据（启用=0，停用=1）
    effectFlag: '0'
  }
})

const { queryParams } = toRefs(data)

/** 分类树 */
function getTree() {
  rmstatMatlcateTree().then(({ data }) => {
    treeOptions.value = data || []
  })
}

/** 过滤树 */
function filterNode(value, data) {
  if (!value) return true
  return data.matlCateName.indexOf(value) !== -1 || (data.matlCateCode && data.matlCateCode.indexOf(value) !== -1)
}

watch(filterText, val => {
  proxy.$refs.treeRef.filter(val)
})

/** 节点点击 */
function handleNodeClick(node) {
  if (currentParentCode.value === node.matlCateCode) {
    currentParentCode.value = ''
    proxy.$refs.treeRef.setCurrentKey(null)
  } else {
    currentParentCode.value = node.matlCateCode
  }
  queryParams.value.pageNum = 1
  getList()
}

/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams.value }
  if (currentParentCode.value) {
    params.supCateCode = currentParentCode.value
  }
  rmstatMatlcateList(params).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total || tableData.value.length
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  currentParentCode.value = ''
  proxy.$refs.treeRef && proxy.$refs.treeRef.setCurrentKey(null)
  getList()
}

/** 多选框选中 */
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
  proxy.$refs.operateRef.init('update', row.matlCateCode)
}

/** 删除 */
function handleDelete() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除选中的物资分类？').then(() => {
    return rmstatMatlcateBatchRemove({ ids: ids.value })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
    getTree()
  }).catch(() => {})
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    create: () => handleCreate(),
    addChild: () => handleAddChild(row),
    update: () => handleUpdate(row),
    delete: () => handleDelete()
  }
  eventObj[code] && eventObj[code]()
}

/** 新增/修改成功后刷新列表和树 */
function onOperateSuccess() {
  getList()
  getTree()
}
const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}
getTree()
getList()
</script>

<style lang="scss" scoped>
.splitpanes__pane:nth-child(1) {
  width: 16%;
  min-width: 286px;
}
</style>
