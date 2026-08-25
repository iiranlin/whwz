<template>
  <div class="app-container">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes  default-theme" @resize="resizeSplit">
        <!--部门数据-->
        <pane size="16" class="integrated-manage-pane-tree" v-loading="treeLoading">
          <el-col>
            <el-trees :data="plantDictListData" :propsObj="deptAssigndeptProp" isSolt title="供应区域" :filterShow="false" :code="'plantCode'"
                :defaultExpandAll="defaultExpandAll" @handleNodeClick="handleNodeClick">
                <template #default="{data}">
                  <span>
                    <svg-icon v-if="!data.plantDicts || (data.plantDicts && !data.plantDicts.length)" icon-class="Icon-Department"/>
                    [{{ data['unitCode'] }}]{{ data['unitName'] }}
                    <span v-if="data.plantDicts && data.plantDicts.length > 0" class="el-aside-h-span-icon"></span>
                  </span>
                </template>
            </el-trees>
          </el-col>
        </pane>
        <pane size="84" class="integrated-manage-pane-form">
          <el-col class="app-container-col">
            <el-pro-table ref="proTableRef" v-loading="loading" action-width="120" :page-size="30" :data="tableData"
              :total="total" :columns="columns" :table-alert-render="false"
              :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
              @action="onAction" @selection-change="onSelectionChange">
            </el-pro-table>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <add-dialog ref="addDialog" :plantData="plantData" @createSuccess="getList()"/>
  </div>
</template>

<script setup name="supply-area">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { columns, toolbarConfig } from "./tableJson"
import AddDialog from "./components/AddDialog"
import ElTrees from "@/components/elTrees"
import { plantDictListAllGroupByUnitName } from '@/api/warehouse/plantDict'
import { supplyAreaList } from '@/api/warehouse/supplyArea'
import { generateUUID } from '@/utils'


const { proxy } = getCurrentInstance()


const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const treeLoading = ref(false)
const idName = ref('id')
const ids = ref([])
const total = ref(0)
const dateRange = ref([])
const plantDictListData = ref(undefined)
const resizeSplitData = ref(0)
const defaultExpandAll = ref(false)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  plantData: {},
  deptAssigndeptProp: {
    children: 'plantDicts',
    label: 'plantName',
    value: 'id',
    isLeaf: true
  },
})

const { queryParams, plantData, deptAssigndeptProp } = toRefs(data)

const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.unitCode = ''
  queryParams.value.plantId = ''
  plantData.value = {}
  if (data) {
    if(data.plantCode){
      queryParams.value.plantId = data.id
      plantData.value = {
        plantName: data.plantName,
        plantCode: data.plantCode,
        plantId: data.id,
        unitCode: data.unitCode,
        unitName: data.unitName
      }
    }else{
      queryParams.value.unitCode = data.unitCode
    }
  }
  getList()
}

/** 查询角色列表 */
function getList() {
  loading.value = true
  supplyAreaList(proxy.addDateRange(queryParams.value, dateRange.value)).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

const getPlantDictListAllGroupByUnitName = () => {
  treeLoading.value = true
  plantDictListAllGroupByUnitName().then(({ data }) => {
    plantDictListData.value = data.map(item => {
      return {...item, id: generateUUID()}
    })
  }).finally(() => {
    treeLoading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo, plantId: queryParams.value.plantId, unitCode: queryParams.value.unitCode }
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

const handleCreate = () => {
  if(!plantData.value.plantCode){
    proxy.$modal.msgWarning('请先选择供应地区')
    return
  }
  proxy.$refs["addDialog"].show('create')
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

getPlantDictListAllGroupByUnitName()
getList()
</script>
<style lang="scss" scoped>
.splitpanes__pane:nth-child(1){
  width: 16%;
  min-width: 286px;
}
</style>