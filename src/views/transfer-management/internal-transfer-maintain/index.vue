<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :default-search-form="defaultSearchForm" :data="tableData"
          :total="total" :columns="columnsData" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfigData" :grid-options="{ rowId: idName, rowStyle: handleRowStyle }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <create-dialog ref="createDialog" :plantDictData="formSelectData.prePlantCode" @createSuccess="getList" />
    
    <print-dialog ref="printDialog" />

    <delete-dialog ref="deleteDialog" @deleteSuccess="getList"/>

  </div>
</template>

<script setup name="internal-transfer-maintain">
import { columns, toolbarConfig } from "./tableJson"
import { rmstorInternalList, rmstorInternalSubmit, rmstorInternalExport } from '@/api/warehouse/rmstorInternal'
import CreateDialog from "./components/createDialog"
import PrintDialog from "./components/PrintDialog"
import DeleteDialog from "./components/deleteDialog"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const columnsData = ref([])
const toolbarConfigData = ref({})

const data = reactive({
  defaultSearchForm: {
    pageType: '0'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    pageType: '0'
  },
  formSelectData: {
    prePlantCode: [],
  },
  plantList: []
})

const { queryParams, formSelectData, defaultSearchForm } = toRefs(data)

async function init () {
  const { columnsArr, plantArr } = await columns()
  formSelectData.value.prePlantCode = plantArr
  columnsData.value = columnsArr
  toolbarConfigData.value = await toolbarConfig()
}
init()

const handleRowStyle = ({row}) => {
  if (row.backFlag == "1") {
    return { color: "red" }
  }
  return {}
}

/** 查询列表 */
function getList() {
  loading.value = true
  const params =  proxy.addDateRange(queryParams.value, queryParams.value.makeDate, 'makeDate')
  delete params.makeDate
  rmstorInternalList(params).then(({ data }) => {
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

const isFlagFun = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  const isFlag = selectionData.value.some(a => a.flag != '0')
  if(isFlag){
    proxy.$modal.msgWarning('请选择移出未提交的数据')
    return false
  }
  return true
}

const handlePrint = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  proxy.$refs.printDialog.show(ids.value)
}

const handleDelete = () => {
  if(isFlagFun()){
    proxy.$refs.deleteDialog.show(ids.value)
  }
}

const handleSubmit = () => {
  if(isFlagFun()){
    proxy.$modal.confirm('您确定要提交所选订单吗？').then(() => {
      return rmstorInternalSubmit(ids.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    billCode: () => {
      proxy.$refs.createDialog.show('details', data)
    }
  }
  eventObj[code] && eventObj[code]()
}

const onAction = (payload) => {
  const { code, name, row, files } = payload
  const eventObj = {
    // 新增
    create: () => {
      proxy.$refs.createDialog.show()
    },
    // 修改
    modify: () => {
      if(row.ibmtId){
        proxy.$modal.msgWarning('该单据为一收一移库，无法修改')
        return
      }
      proxy.$refs.createDialog.show('modify', row)
    },
    // 删除
    delete: () => {
      handleDelete()
    },
    // 提交
    submit: () => {
      handleSubmit()
    },
    // 打印
    print: () => {
      handlePrint()
    },
    // 导出
    export: () => {
      const params =  proxy.addDateRange(queryParams.value, queryParams.value.makeDate, 'makeDate')
      delete params.makeDate
      proxy.$download.name(rmstorInternalExport, params)
    },
    link: () => {
      handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>