<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :default-search-form="defaultSearchForm" :data="tableData"
          :total="total" :columns="columnsData" show-checkbox click-row-to-toggle-selection :table-alert-render="false" :show-action="false"
          :toolbar-config="toolbarConfigData" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>

      </el-col>
    </el-row>

    <create-dialog ref="createDialog" :tableJson="matlTableJson" @createSuccess="getList" />
    
    <print-dialog ref="printDialog" />

  </div>
</template>

<script setup name="internal-transferEnter-maintain">
import { columns, toolbarConfig, matlTableJson } from "./tableJson"
import { rmstorInternalList, rmstorInternalRollback, rmstorInternalExport, rmstorInternalToCard, rmstorInternalWithDrawCard } from '@/api/warehouse/rmstorInternal'
import CreateDialog from "../internal-transfer-maintain/components/createDialog"
import PrintDialog from "../internal-transfer-maintain/components/PrintDialog"

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
    pageType: '1'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    pageType: '1'
  },
  plantList: []
})

const { queryParams, defaultSearchForm } = toRefs(data)

async function init () {
  const { columnsArr } = await columns()
  columnsData.value = columnsArr
  toolbarConfigData.value = await toolbarConfig()
}
init()

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

const isIdsFun = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const isFlagFun = (flag = '1',name = '移入未登卡') => {
  const isFlag = selectionData.value.some(a => a.flag != flag)
  if(isFlag){
    proxy.$modal.msgWarning(`请选择${name}的数据`)
    return false
  }
  return true
}

const handleDenka = () => {
  if(isIdsFun() && isFlagFun('1', '移入未登卡')){
    proxy.$modal.confirm('您确定要登卡所选移库单吗？').then(() => {
      return rmstorInternalToCard(ids.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleRevokeDenka = () => {
  if(isIdsFun() && isFlagFun('4', '移入已登卡')){
    proxy.$modal.confirm('您确定要撤销登卡所选移库单吗？').then(() => {
      return rmstorInternalWithDrawCard(ids.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleRollback = () => {
  if(isIdsFun() && isFlagFun()){
    proxy.$modal.confirm('您确定要回退所选订单吗？').then(() => {
      return rmstorInternalRollback(ids.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handlePrint = () => {
  if(isIdsFun()){
    proxy.$refs.printDialog.show(ids.value)
  }
}

const onAction = (payload) => {
  const { code, name, row, files } = payload
  const eventObj = {
    // 登卡
    denka: () => {
      handleDenka()
    },
    // 撤销登卡
    revokeDenka: () => {
      handleRevokeDenka()
    },
    // 回退
    rollback: () => {
      handleRollback()
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

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    billCode: () => {
      proxy.$refs.createDialog.show('details', data)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>