<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange" :default-search-form="defaultSearchForm">
        </el-pro-table>
      </el-col>
    </el-row>

    <back-dialog ref="backDialog" @success="getList" />
    <print-dialog ref="printDialog" :apiUrl="printPrePayMtWithDt" />
    
  </div>
</template>

<script setup name="wait-liquidation-material-check">
import { columns, toolbarConfig } from "./tableJson"
import { prePayList, prePayBack, prePaySubmitToNotice, printPrePayMtWithDt } from '@/api/warehouse/prePay'
import BackDialog from "./components/backDialog"
import PrintDialog from "./components/printDialog"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)

const data = reactive({
  defaultSearchForm: {
    pageType: '1'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    pageType: '1'
  },
})

const { queryParams, defaultSearchForm } = toRefs(data)

/** 查询列表 */
function getList() {
  const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
  loading.value = true
  prePayList(params).then(({ data }) => {
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
function onSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
}

const isIdsFun = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const isCheckStatusFun = (code = '', name = '') => {
  const isFlag = selectionData.value.some(a => a.checkStatus != code)
  if(isFlag){
    proxy.$modal.msgWarning(name)
    return false
  }
  return true
}

const isStatusFun = (code = '', name = '') => {
  const isFlag = selectionData.value.some(a => a.status == code)
  if(isFlag){
    proxy.$modal.msgWarning(name)
    return false
  }
  return true
}

const handleBack = () => {
  if(isIdsFun() && isStatusFun('2', '单据状态为已提交，不能回退') && isCheckStatusFun('0', '核对状态为已核对或者部分核对，不能回退')){
    proxy.$modal.confirm('确定要回退吗？').then(()=>{
      return prePayBack({ids: ids.value})
    }).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleSubmit = () => {
  if(isIdsFun() && isStatusFun('2', '单据状态为已提交，不能提交')){
    proxy.$modal.confirm('确定要提交吗？').then(()=>{
      return prePaySubmitToNotice({ids: ids.value})
    }).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    prePayNo: () => {
      proxy.$refs.backDialog.show('details', data)
    }
  }
  eventObj[code] && eventObj[code]()
}

const onAction = (payload) => {
  const { name, code, row, files } = payload
  const eventObj = {
    back: () => {
      handleBack()
    },
    printMtWithDt: () => {
      if(isIdsFun()){
        proxy.$refs.printDialog.show(ids.value)
      }
    },
    check: () => {
      proxy.$refs.backDialog.show('back', row)
    },
    submit: () => {
      handleSubmit()
    },
    link: () => {
      handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>