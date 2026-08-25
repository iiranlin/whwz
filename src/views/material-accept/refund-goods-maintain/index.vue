<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="180" :page-size="30" :data="tableData" :default-search-form="defaultSearchForm"
          :total="total" :columns="columns" :table-alert-render="false"
          :toolbar-config="toolbarConfigData" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <history-dialog ref="historyDialog" />

    <exchange-dialog ref="exchangeDialog" @createSuccess="getList" />

    <replenish-batch-dialog ref="replenishBatchDialog" @createSuccess="getList" />
  </div>
</template>

<script setup name="refund-goods-maintain">
import { columns, toolbarConfig } from "./tableJson"
import { exchangeList } from '@/api/warehouse/exchange'
import HistoryDialog from "@/views/material-accept/components/historyDialog"
import ExchangeDialog from "./components/exchangeDialog"
import ReplenishBatchDialog from "./components/replenishBatchDialog"


const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('pdbId')
const ids = ref([])
const total = ref(0)
const toolbarConfigData = ref(toolbarConfig)

const data = reactive({
  defaultSearchForm: {
    operationType: 'exchange'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    operationType: 'exchange'
  },
})

const { defaultSearchForm, queryParams } = toRefs(data)


/** 查询角色列表 */
function getList() {
  loading.value = true
  exchangeList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  toolbarConfigData.value.buttons = toolbarConfig.buttons.map( a => {
    if(['exchange', 'return'].includes(a.code)){
      if(queryParams.value.operationType === 'replenish'){
        a.showInRow = false
      }else{
        a.showInRow = true
      }
    }
    if(['replenishBatch'].includes(a.code)){
      if(queryParams.value.operationType === 'exchange'){
        a.showInRow = false
      }else{
        a.showInRow = true
      }
    }
    return a
  })
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

const onAction = (payload) => {
  const { code, row, files } = payload
  const eventObj = {
    // 换货
    exchange: () => {
      proxy.$refs.exchangeDialog.show('exchange', row)
    },
    // 退货
    return: () => {
      proxy.$refs.exchangeDialog.show('return', row)
    },
    replenishBatch: () => {
      proxy.$refs.replenishBatchDialog.show(row)
    },
    // 验收历史
    history: () => {
      proxy.$refs.historyDialog.show(row.pdbId)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>