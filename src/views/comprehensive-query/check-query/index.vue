<template>
  <div class="app-container">
    <el-pro-table
      :columns="tableJsonList"
      :request="getList"
      :sort-remote="false"
      :editable="false"
      :default-search-form="defaultSearchForm"
      :show-action="false"
       :toolbar-config="toolbarConfig"
       @action="onAction"
       :before-search-submit="beforeSearchFormat"
      tableId="check-query"
      border
      :grid-options="{ rowId: 'csdId' }"
    />
  </div>

</template>

<script setup>
import { checkQueryList,checkExport } from '@/api/query/integrated-query'

import { columns, toolbarConfig } from "./tableJson";

const { proxy } = getCurrentInstance()
const columnsData = ref([])
const tableJsonList = ref([])
const defaultSearchForm = ref({})
const lastSearchQuery = ref(null)
async function init() {
  columnsData.value = await columns()
  tableJsonList.value = columnsData.value.map(a => ({ ...a }))
}
init()
const beforeSearchFormat = (params) => {
  const nextParams = proxy.addDateRange(params, params.operDate, 'operDate')
  delete nextParams.operDate
  return nextParams
}
const getList = async (params) => {
  lastSearchQuery.value = { ...params }
  const { data:{list, total} } = await checkQueryList(params)
  return {data: list, total: total, success: true}
}

const onAction = (payload) => {
  const { code } = payload
  const eventObj = {
    export: () => {
      if (!lastSearchQuery.value) return
      proxy.$download.name(checkExport, { ...lastSearchQuery.value })
    },
    link: () => {
      // handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

</script>
