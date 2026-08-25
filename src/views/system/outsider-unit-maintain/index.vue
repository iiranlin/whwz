<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="80" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <add-dialog ref="addDialog" @createSuccess="getList" />
    
  </div>
</template>

<script setup name="outsider-unit-maintain">
import { columns, toolbarConfig } from "./tableJson"
import { outSideUnitList, deleteOutSideUnit, updateOutSideUnitStatus } from '@/api/warehouse/warehouseDict'
import AddDialog from "./components/AddDialog"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  plantList: []
})

const { queryParams } = toRefs(data)

/** 查询列表 */
function getList() {
  loading.value = true
  const params =  proxy.addDateRange(queryParams.value, queryParams.value.orderDate, 'orderDate')
  delete params.orderDate
  outSideUnitList(params).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}


/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  selectionData.value = rows
  ids.value = rows.map(item => item[idName.value])
}

const isIdsFun = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const isPermFlagFun = (code = '0', name = '停用') => {
  const isSaleFlag = selectionData.value.some(a => a.flag != code)
  if(isSaleFlag){
  proxy.$modal.msgWarning(`请选择${name}的数据`)
  return false
  }
  return true
}

const handleDelete = () => {
  if(isIdsFun()){
    proxy.$modal.confirm('确定要删除吗？').then(()=>{
      deleteOutSideUnit({ids: ids.value}).then( ({message}) => {
        proxy.$modal.msgSuccess(message)
        getList()
      })
    })
  }
}

const handleEnableDisable = (flag) => {
  const code = flag == '1'?'0':'1'
  const name = flag == '1'?'停用':'启用'
  if(isIdsFun() && isPermFlagFun(code, name)){
    proxy.$modal.confirm(`确定要${flag == '1'?'启用':'停用'}吗？`).then(()=>{
      updateOutSideUnitStatus({ids: ids.value, flag}).then( ({message}) => {
        proxy.$modal.msgSuccess(message)
        getList()
      })
    })
  }
}

const onAction = (payload) => {
  const { code, row, files } = payload
  const eventObj = {
    // 新增
    create: () => {
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
    enable: () => {
      handleEnableDisable('1')
    },
    disable: () => {
      handleEnableDisable('0')
    },
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>