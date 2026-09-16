<template>
  <div class="app-container">
    <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :data="tableData"
      :total="total" :columns="columnsData" :toolbar-config="toolbarConfig" :table-alert-render="false"
      :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" :show-action="false"
      @action="onAction" @selection-change="onSelectionChange">
      <template #matlTypeSlot="{ row }">
        <span>{{`${row.matlType}${row.matlRaw?'/'+row.matlRaw:''}${row.matlpCode?'/'+row.matlpCode:''}`}}</span>
      </template>
      <template #acceptanceFlag="{ row, column }">
        <span>{{!['5', '7'].includes(row.acceptanceFlag)?'正常' : column.dict[row.acceptanceFlag]}}</span>
      </template>
      <template #slotCheck="{ row, column }">
        <el-link type="primary" @click.stop="handleClickLink('slotCheck', row, column)">查看</el-link>
      </template>
    </el-pro-table>
    
    <history-dialog ref="historyDialog" />
  </div>
</template>

<script setup name="acceptance-query">
import { columns, toolbarConfig } from "./tableJson"
import { recordComprehensiveSearch, exportComprehensiveSearch } from '@/api/warehouse/acceptanceRecords'
import HistoryDialog from "@/views/material-accept/components/historyDialogQuery"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('pdbId')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const columnsData = ref([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
  },
  plantList: []
})

const { queryParams } = toRefs(data)

async function init () {
  const {columnsArr} = await columns()
  columnsData.value = columnsArr
}
init()

/** 查询列表 */
function getList() {
  loading.value = true
  const params = {...proxy.addDateRange(queryParams.value, queryParams.value.deliverDate, 'deliverDate')}
  delete params.deliverDate
  recordComprehensiveSearch(params).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo,deliverNumNeAcceptanceNum: form.deliverNumNeAcceptanceNum && form.deliverNumNeAcceptanceNum[0]?form.deliverNumNeAcceptanceNum[0] : '' }
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  selectionData.value = rows
  ids.value = rows.map(item => item[idName.value])
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 验收记录查看
    slotCheck: () => {
      proxy.$refs.historyDialog.show(data.pdbId)
    },
  }
  eventObj[code] && eventObj[code]()
}

const onAction = (payload) => {
  const { name, code, row, files } = payload
  const eventObj = {
    // 导出
    export: () => {
      const params = {...proxy.addDateRange(queryParams.value, queryParams.value.deliverDate, 'deliverDate')}
      delete params.deliverDate
      proxy.$download.name(exportComprehensiveSearch, params)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>
<style lang="scss" scoped>
:deep(.ep-pro-table__search-area .ep-form .ep-row .ep-col:last-child .ep-form-item .ep-form-item__label) {
  display: none !important;
}
</style>