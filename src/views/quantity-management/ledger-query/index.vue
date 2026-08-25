<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :default-search-form="defaultSearchForm" :data="tableData"
          :total="total" :columns="columnsData" :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
          <template #matlTypeSlot="{ row }">
            <span>{{`${row.matlType}${row.matlRaw?'/'+row.matlRaw:''}${row.matlpCode?'/'+row.matlpCode:''}`}}</span>
          </template>
        </el-pro-table>
      </el-col>
    </el-row>

    <details-dialog ref="detailsDialog"/>
  </div>
</template>

<script setup name="ledger-query">
import { columns, toolbarConfig } from "./tableJson"
import { getCookie } from '@/utils/auth'
import { matlcardLedgerList, matlcardLedgerExport } from '@/api/warehouse/matlcard'
import DetailsDialog from "./components/detailsDialog"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const columnsData = ref([])

const warehouseGetYear = getCookie('warehouseGetYear') && JSON.parse(getCookie('warehouseGetYear'))
const data = reactive({
  defaultSearchForm: {
    yearMonth: [warehouseGetYear?.yearMonth, warehouseGetYear?.yearMonth],
    isNotZero: false,
    isNotZeroArr: []
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    yearMonth: [warehouseGetYear?.yearMonth, warehouseGetYear?.yearMonth],
    isNotZero: false,
    isNotZeroArr: []
  },
  plantList: []
})

const { queryParams, defaultSearchForm } = toRefs(data)

async function init () {
  columnsData.value = await columns()
}
init()

/** 查询列表 */
function getList() {
  loading.value = true
  const params =  JSON.parse(JSON.stringify(proxy.addDateRange(queryParams.value, queryParams.value.yearMonth, 'yearMonth')))
  delete params.yearMonth
  params.isNotZero = !!params.isNotZeroArr.length
  delete params.isNotZeroArr
  matlcardLedgerList(params).then(({ data }) => {
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

const onAction = (payload) => {
  const params =  JSON.parse(JSON.stringify(proxy.addDateRange(queryParams.value, queryParams.value.yearMonth, 'yearMonth')))
  delete params.yearMonth
  const { code, row, selectedRows, files } = payload
  const eventObj = {
    // 详情
    details: () => {
      proxy.$refs.detailsDialog.show({...row, yearMonthBegin: params.yearMonthBegin, yearMonthEnd: params.yearMonthEnd})
    },
    // 导出
    export: () => {
      params.isNotZero = !!params.isNotZeroArr.length
      delete params.isNotZeroArr
      proxy.$download.name(matlcardLedgerExport, params)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>