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
            <form-data :showSearch="showSearch" :formJson="formJson" :resizeSplitData="resizeSplitData" @handleQuery="handleQuery"
              :formSelectData="formSelectData" @resetQuery="resetQuery"></form-data>
            <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
              <el-col :span="1.5">
                <el-button type="primary" class="tableButton" @click="handleAdd"><svg-icon icon-class="form"/>&nbsp;新增</el-button>
                <el-button class="tableButton" type="primary" @click="deleteClick">删除</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
            </el-row>
            <!-- 表格数据 -->
            <table-index class="table-index" :loading="loading" :queryParams="queryParams" :tableJson="tableJsonArr" :tableButtonJson="tableButtonJson"
              :tableData="tableData" @handleSelectionChange="handleSelectionChange" operationWidth="150" :tableDataDict="tableDataDict"
              @handleButtonClick="handleButtonClick">
            </table-index>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize" @pagination="getList" />

          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <add-dialog ref="addDialog" :plantData="plantData" @createSuccess="getList()" :formSelectData="formSelectData"/>

    <allocate-dialog ref="allocateDialog" />
  </div>
</template>

<script setup name="warehouse-dict">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { formJson } from "./formJson"
import { tableJson, tableButtonJson } from "./tableJson"
import AddDialog from "./components/AddDialog"
import AllocateDialog from "./components/allocateDialog"
import ElTrees from "@/components/elTrees"
import { getCookie, getLocalStorage } from '@/utils/auth'
import { warehouseDictList, warehouseDictDeleteBatch } from '@/api/warehouse/warehouseDict'
import { plantDictListAll } from '@/api/warehouse/plantDict'
import { useDict } from "@/utils/Dict"



const { proxy } = getCurrentInstance()


const tableJsonArr = ref(JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJson)
const tableData = ref([])
const loading = ref(false)
const treeLoading = ref(false)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
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
  unitObj:{
    plantName: getCookie('unitName'),
    plantCode: getCookie('unitCode'),
    id: '0'
  },
  deptAssigndeptProp: {
    children: 'children',
    label: 'plantName',
    value: 'id',
    isLeaf: true
  },
  formSelectData: {
    stockattr: []
  },
  tableDataDict: {
    stockattr: {}
  },
  plantData: {
    plantName: '',
    plantCode: '',
    plantId: ''
  }
})

const { queryParams, deptAssigndeptProp, formSelectData, tableDataDict, plantData, unitObj } = toRefs(data)

const {dictList, dictMap} = useDict('stock_attr')
formSelectData.value.stockattr = dictList
tableDataDict.value.stockattr = dictMap

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data
}

const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.plantId = ''
  plantData.value = {}
  if (data) {
    queryParams.value.plantId = data.id === '0'?'':data.id
    plantData.value = {
      plantName: data.plantName,
      plantCode: data.plantCode,
      plantId: data.id
    }
  }
  handleQuery()
}

/** 查询角色列表 */
function getList() {
  loading.value = true
  warehouseDictList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}


const getPlantDictListAll = () => {
  treeLoading.value = true
  plantDictListAll().then( ({data}) => {
    deptAssignList.value = [{...unitObj.value, children: data}]
  }).finally(() => {
    treeLoading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery(data) {
  queryParams.value.pageNum = 1
  queryParams.value = Object.assign({}, queryParams.value, data)
  getList()
}

/** 重置按钮操作 */
function resetQuery(data) {
  handleQuery(data)
}

const handleAdd = () => {
  if(!queryParams.value.plantId){
    proxy.$modal.msgWarning('请先选择地区')
    return
  }
  proxy.$refs["addDialog"].show('create')
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const deleteClick = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('确定要删除吗？').then(()=>{
    treeLoading.value = true
    warehouseDictDeleteBatch({ids: ids.value}).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    }).finally(() => {
      treeLoading.value = false
    })
  })
}

const handleButtonClick = (code, { row }) => {
  const eventObj = {
    modify: () => {
      proxy.$refs["addDialog"].show('modify', row)
    },
    allocate: () => {
      proxy.$refs["allocateDialog"].show(row)
    }
  }
  eventObj[code] && eventObj[code]()
}

getPlantDictListAll()
getList()
</script>
<style lang="scss" scoped>
.splitpanes__pane:nth-child(1){
  width: 16%;
  min-width: 286px;
}
</style>