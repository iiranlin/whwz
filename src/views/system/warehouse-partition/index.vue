<template>
  <div class="app-container">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes  default-theme" @resize="resizeSplit">
        <!--部门数据-->
        <pane size="16" class="integrated-manage-pane-tree" v-loading="treeLoading">
          <el-col>
            <el-trees filterShow :data="deptAssignList" :propsObj="deptAssigndeptProp" code="plantCode" title="仓库"
              isSolt :filterData="handleFilterData" :defaultExpandAll="defaultExpandAll"
              @handleNodeClick="handleNodeClick">
              <template #default="{ data }">
                <span :title="`[${data.whCode}]${data.whName}`">
                  <svg-icon v-if="!data.children || (data.children && !data.children.length)"
                    icon-class="Icon-Department" />
                  [{{ data.whCode }}]{{ data.whName }}
                  <span v-if="data.children && data.children.length > 0" class="el-aside-h-span-icon"></span>
                </span>
              </template>
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

<script setup name="warehouse-partition">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { columns, toolbarConfig } from "./tableJson"
import AddDialog from "./components/AddDialog"
import ElTrees from "@/components/elTrees"
import { getCookie } from '@/utils/auth'
import { warehousePartitionList, partitionDeleteWarehousePartition } from '@/api/warehouse/partition'
import { plantWarehouseList } from '@/api/warehouse/warehouseDict'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const treeLoading = ref(false)
const idName = ref('rangeId')
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
  deptAssigndeptProp: {
    children: 'warehouses',
    label: 'plantName',
    value: 'id',
    isLeaf: true
  },
  plantData: {
    whName: '',
    whCode: '',
    whId: ''
  }
})

const { queryParams, deptAssigndeptProp, plantData } = toRefs(data)

const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}

const handleFilterData = (val, data) => {
  const label = data.whName
  const code = data.whCode
  if (!val) return true
  if (label && code) {
    return label.indexOf(val) !== -1 || code.indexOf(val) !== -1
  }
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.whId = ''
  queryParams.value.plantId = ''
  plantData.value = {}
  if (data) {
    if (data.whCode) {
      queryParams.value.whId = data.id
      plantData.value = {
        whName: data.whName,
        whCode: data.whCode,
        whId: data.id
      }
    } else {
      queryParams.value.plantId = data.id
    }
  }
  getList()
}

/** 查询角色列表 */
function getList() {
  loading.value = true
  warehousePartitionList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}


const getPlantWarehouseList = () => {
  treeLoading.value = true
  plantWarehouseList().then(({ data }) => {
    deptAssignList.value = data
  }).finally(() => {
    treeLoading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo, plantId: queryParams.value.plantId, whId: queryParams.value.whId }
  getList()
}

const handleAdd = () => {
  if (!queryParams.value.whId) {
    proxy.$modal.msgWarning('请先选择仓库')
    return
  }
  proxy.$refs["addDialog"].show('create')
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  selectionData.value = rows
  ids.value = rows.map(r => r['id'])
}

const deleteClick = () => {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('确定要删除吗？').then(() => {
    partitionDeleteWarehousePartition({ ids: ids.value }).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  })
}

const onAction = (payload) => {
  const { code, row, files } = payload
  const eventObj = {
    create: () => {
      handleAdd()
    },
    modify: () => {
      proxy.$refs["addDialog"].show('modify', row)
    },
    delete: () => {
      deleteClick()
    }
  }
  eventObj[code] && eventObj[code]()
}

getPlantWarehouseList()
getList()
</script>
<style lang="scss" scoped>
.splitpanes__pane:nth-child(1) {
  width: 16%;
  min-width: 286px;
}
</style>