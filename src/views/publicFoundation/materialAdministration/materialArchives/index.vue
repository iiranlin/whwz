<template>
  <div class="app-container app-container-splitpanes">
   <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes default-theme" @resize="resizeSplit">
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
      <!-- 右侧物料列表 -->
      <pane size="84" class="integrated-manage-pane-form">
          <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox :toolbar-config="toolbarConfig"
          :default-search-form="{ enableState: '1' }"
          :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
          @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
      </pane>
    </splitpanes>
    </el-row>
    <operate ref="operateRef" :tree-options="treeOptions" @createSuccess="getList" />
  </div>
</template>

<script setup name="materialArchives">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { columns, toolbarConfig } from "./tableJson"
import Operate from "./components/operate"
import { rmstatCatalogList, rmstatCatalogBatchRemove, rmstatCatalogDownloadTemplate, rmstatCatalogImport } from '@/api/warehouse/rmstatCatalog'
import { rmstatMatlcateTree } from '@/api/warehouse/rmstatMatlcate'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('matlCode')
const ids = ref([])
const total = ref(0)
const treeOptions = ref([])
const filterText = ref('')
const currentClassifyCode = ref('')
const resizeSplitData = ref(0)
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    // 默认只显示启用状态数据
    enableState: '1'
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
  if (currentClassifyCode.value === node.matlCateCode) {
    currentClassifyCode.value = ''
    proxy.$refs.treeRef.setCurrentKey(null)
  } else {
    currentClassifyCode.value = node.matlCateCode
  }
  queryParams.value.pageNum = 1
  getList()
}

/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams.value }
  if (currentClassifyCode.value) {
    params.supMatlCode = currentClassifyCode.value
  }
  rmstatCatalogList(params).then(({ data }) => {
    tableData.value = data.list || data.records || []
    total.value = data.total || tableData.value.length
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  currentClassifyCode.value = ''
  proxy.$refs.treeRef && proxy.$refs.treeRef.setCurrentKey(null)
  getList()
}

/** 多选框选中 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

/** 新增 */
function handleCreate() {
  proxy.$refs.operateRef.init('create', undefined, currentClassifyCode.value)
}

/** 修改 */
function handleUpdate(row) {
  proxy.$refs.operateRef.init('update', row.matlCode)
}

/** 删除 */
function handleDelete() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('是否确认删除选中的物资？').then(() => {
    return rmstatCatalogBatchRemove({ ids: ids.value })
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).catch(() => {})
}

const onAction = (payload) => {
  const { code, row, files } = payload
  const eventObj = {
    create: () => handleCreate(),
    update: () => handleUpdate(row),
    delete: () => handleDelete(),
    // 下载模板
    download: () => {
      proxy.$download.name(rmstatCatalogDownloadTemplate)
    },
    // 模板导入
    upload: () => {
      rmstatCatalogImport(files[0]).then(({ data }) => {
        proxy.$modal.msgSuccess(`成功导入${data}条！`)
        // 回到第一页刷新，确保新导入数据展示在列表最前
        queryParams.value.pageNum = 1
        getList()
      })
    }
  }
  eventObj[code] && eventObj[code]()
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
