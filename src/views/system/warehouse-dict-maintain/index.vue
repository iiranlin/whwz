<template>
  <div class="app-container">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes  default-theme" @resize="resizeSplit">
        <!--部门数据-->
        <pane size="16" class="integrated-manage-pane-tree" v-loading="treeLoading">
          <el-col>
            <el-trees :data="deptAssignList" :propsObj="deptAssigndeptProp" title="仓库" :code="'plantCode'"
              :defaultExpandAll="defaultExpandAll" @handleNodeClick="handleNodeClick">
            </el-trees>
          </el-col>
        </pane>
        <pane size="84" class="integrated-manage-pane-form">
          <el-col class="app-container-col">
            <el-pro-table ref="proTableRef" v-loading="loading" action-width="80" :page-size="30" :data="tableData"
              :total="total" :columns="columns" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
              :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
              @action="onAction" @selection-change="onSelectionChange">
            </el-pro-table>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <add-dialog ref="addDialog" :plantData="plantData" @createSuccess="getList" />

  </div>
</template>

<script setup name="warehouse-dict-maintain">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { columns, toolbarConfig } from "./tableJson"
import { warehouseDictListX, deleteWarehouseDict } from '@/api/warehouse/warehouseDict'
import { plantDictListAll } from '@/api/warehouse/plantDict'
import { unitGetUnitList } from "@/api/system/unit"
import AddDialog from "./components/AddDialog"
import ElTrees from "@/components/elTrees"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const treeLoading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const deptAssignList = ref(undefined)
const resizeSplitData = ref(0)
const defaultExpandAll = ref(false)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  plantList: [],
  deptAssigndeptProp: {
    children: 'children',
    label: 'unitName',
    value: 'id'
  },
  plantData: {
    plantName: '',
    plantId: ''
  }
})

const { queryParams, deptAssigndeptProp, plantData } = toRefs(data)

function onSelectionChange(rows) {
  selectionData.value = rows
  ids.value = rows.map(r => r[idName.value])
}

function onAction(payload) {
  const { code, row, files } = payload
  const eventObj = {
    // 新增
    create: () => {
      if (!queryParams.value.plantId) {
        proxy.$modal.msgWarning('请先选择地区')
        return
      }
      proxy.$refs.addDialog.show('create')
    },
    // 修改
    modify: () => {
      proxy.$refs.addDialog.show('modify', row)
    },
    // 删除
    delete: () => {
      handleDelete()
    },
  }
  eventObj[code] && eventObj[code]()
}

const getPlantDictListAll = async () => {
  treeLoading.value = true
  try {
    // 机构树（公司 → 部门）与用料地区列表并行获取
    const [unitRes, plantRes] = await Promise.all([unitGetUnitList(), plantDictListAll()])
    // 用料地区按所属单位 unitCode 分组
    const plantMap = {}
    ;(plantRes.data || []).forEach(p => {
      (plantMap[p.unitCode] = plantMap[p.unitCode] || []).push({ ...p, isPlant: true, unitName: p.plantName })
    })
    // 机构扁平列表按 parentId 组装树（level=1 根为虚拟节点不展示，树从 level=2 公司开始）
    const unitList = unitRes.data || []
    const map = {}
    unitList.forEach(item => { map[item.id] = { ...item, children: [] } })
    const roots = []
    unitList.forEach(item => {
      const parent = map[item.parentId]
      if (parent) {
        parent.children.push(map[item.id])
      } else {
        roots.push(map[item.id])
      }
    })
    // 把用料地区挂到对应机构/部门节点下（公司直属地区挂公司下，部门地区挂部门下，直属地区排在部门前）
    const attach = (nodes) => {
      nodes.forEach(node => {
        node.children = (plantMap[node.unitCode] || []).concat(node.children)
        if (node.children.length) attach(node.children.filter(c => !c.isPlant))
      })
    }
    attach(roots)
    deptAssignList.value = roots
  } finally {
    treeLoading.value = false
  }
}

/** 查询列表 */
function getList() {
  loading.value = true
  warehouseDictListX(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  queryParams.value.plantId = plantData.value.plantId === '0' ? '' : plantData.value.plantId
  getList()
}

const isIdsFun = () => {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const handleDelete = () => {
  if (isIdsFun()) {
    proxy.$modal.confirm('确定要删除吗？').then(() => {
      return deleteWarehouseDict({ ids: ids.value })
    }).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.plantId = ''
  plantData.value = {}
  if (data && data.isPlant) {
    // 用料地区节点：按地区过滤右侧仓库
    queryParams.value.plantId = data.id
    plantData.value = {
      plantName: data.plantName,
      plantId: data.id
    }
  }
  // 机构节点（公司/部门）：清空过滤看全部
  getList()
}

getPlantDictListAll()
getList()
</script>
<style lang="scss" scoped>
.splitpanes__pane:nth-child(1) {
  width: 16%;
  min-width: 286px;
}
</style>