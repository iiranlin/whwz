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

    <create-dialog ref="createDialog" @createSuccess="getList" />
    
  </div>
</template>

<script setup name="wait-liquidation-material-generate">
import { columns, toolbarConfig } from "./tableJson"
import { prePayList, prePayDeleteBatch, prePaySubmit, prePayExport } from '@/api/warehouse/prePay'
import CreateDialog from "./components/createDialog"

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
    pageType: '0'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    pageType: '0'
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

const isStatusFun = (code = '', name = '') => {
  const isFlag = selectionData.value.some(a => a.status != code)
  if(isFlag){
    proxy.$modal.msgWarning(name)
    return false
  }
  return true
}

const handleDelete = () => {
  if(isIdsFun() && isStatusFun('0', '单据状态为已提交，不允许删除')){
    proxy.$modal.confirm('确定要删除吗？').then(()=>{
      return prePayDeleteBatch({ids: ids.value})
    }).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleSubmit = () => {
  if(isIdsFun() && isStatusFun('0', '单据状态为已提交，不允许提交')){
    proxy.$modal.confirm('您确定要提交所选订单吗？').then(() => {
      return prePaySubmit({ids: ids.value})
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    prePayNo: () => {
      proxy.$refs.createDialog.show('details', data)
    }
  }
  eventObj[code] && eventObj[code]()
}

const onAction = (payload) => {
  const { name, code, row, files } = payload
  const eventObj = {
    // 新增
    create: () => {
      proxy.$refs.createDialog.show()
    },
    // 修改
    modify: () => {
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
    // 导出
    export: () => {
      const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
      proxy.$download.name(prePayExport, params)
    },
    link: () => {
      handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>