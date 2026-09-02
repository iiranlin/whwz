<template>
  <div class="app-container">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes  default-theme" @resize="resizeSplit">
        <!--部门数据（左侧树暂不展示，代码保留，恢复时去掉 v-if 并将右侧 size 改回 84）-->
        <pane size="16" class="integrated-manage-pane-tree" v-loading="treeLoading" v-if="false">
          <el-col>
            <el-trees :data="deptAssignList" :propsObj="deptAssigndeptProp" title="" :filterShow="false" :code="'unitCode'"
                :defaultExpandAll="defaultExpandAll" @handleNodeClick="handleNodeClick">
            </el-trees>
          </el-col>
        </pane>
        <pane size="100" class="integrated-manage-pane-form">
          <el-col class="app-container-col">
            <el-pro-table ref="proTableRef" v-loading="loading" action-width="120" :page-size="30" :data="tableData"
              :total="total" :columns="columns" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
              :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
              @action="onAction" @selection-change="onSelectionChange">
            </el-pro-table>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <add-dialog ref="addDialog" :unitObj="unitData" @createSuccess="getList(); getUnitGetUnitList()"/>
  </div>
</template>

<script setup name="supplier-region-dict">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { columns, toolbarConfig } from "./tableJson"
import AddDialog from "./components/AddDialog"
import ElTrees from "@/components/elTrees"
import { unitGetUnitList } from "@/api/system/unit"
import { plantDictList } from '@/api/warehouse/plantDict'


const { proxy } = getCurrentInstance()


const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const treeLoading = ref(false)
const idName = ref('id')
const ids = ref([])
const total = ref(0)
const dateRange = ref([])
const deptAssignList = ref(undefined)
const resizeSplitData = ref(0)
const defaultExpandAll = ref(false)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  unitData: {},
  deptAssigndeptProp: {
    children: 'children',
    label: 'unitName',
    value: 'id'
  },
})

const { queryParams, unitData, deptAssigndeptProp } = toRefs(data)

const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.unitCode = ''
  unitData.value = {}
  if (data) {
      queryParams.value.unitCode = data.id === '0'?'':data.unitCode
      unitData.value = {
          unitName: data.unitName,
          unitCode: queryParams.value.unitCode,
          sysCode: data.sysCode
      }
  }
  getList()
}

/** 查询角色列表 */
function getList() {
  loading.value = true
  plantDictList(proxy.addDateRange(queryParams.value, dateRange.value)).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

const getUnitGetUnitList = () => {
  treeLoading.value = true
  unitGetUnitList().then(({ data }) => {
    // 接口返回扁平单位列表，按 parentId 组装成"公司 → 部门"树形（level=1 根为虚拟节点不展示）
    const map = {}
    data.forEach(item => { map[item.id] = { ...item, children: [] } })
    const roots = []
    data.forEach(item => {
      const parent = map[item.parentId]
      if (parent) {
        parent.children.push(map[item.id])
      } else {
        roots.push(map[item.id])
      }
    })
    deptAssignList.value = roots
    // 左树隐藏期间，新增默认挂"最大的单位"（顶层公司节点 11000001）下
    if (roots.length > 0) {
      unitData.value = {
        unitName: roots[0].unitName,
        unitCode: roots[0].unitCode,
        sysCode: roots[0].sysCode,
        // 顶层单位即公司/路局节点，railway_code=自身编码（34号文档口径）
        railwayCode: roots[0].unitCode
      }
    }
  }).finally(() => {
    treeLoading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo, unitCode: queryParams.value.unitCode }
  getList()
}

const handleCreate = () => {
  if(!unitData.value.unitCode){
    proxy.$modal.msgWarning('单位数据加载中，请稍后')
    return
  }
  proxy.$refs["addDialog"].show('create')
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

const onAction = (payload) => {
  const { code, row, selectedRows, files } = payload
  const eventObj = {
    // 新增
    create: () => {
      handleCreate()
    },
    // 修改
    modify: () => {
      proxy.$refs["addDialog"].show('modify', row)
    },
  }
  eventObj[code] && eventObj[code]()
}

getUnitGetUnitList()
getList()
</script>
<style lang="scss" scoped>
.splitpanes__pane:nth-child(1){
  width: 16%;
  min-width: 286px;
}
</style>