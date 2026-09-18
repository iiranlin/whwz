<template>
  <div class="app-container">
    <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30"
      :default-search-form="defaultSearchForm" :data="tableData" :total="total" :columns="tableJsonList"
      :table-alert-render="false" :show-action="false" @field-click="handleFieldClick" :toolbar-config="toolbarConfig"
      :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch" @action="onAction"
      @selection-change="onSelectionChange" :footer-config="footerConfig">
      <template #matlTypeSlot="{ row }">
        <span>{{ `${row.matlType}${row.matlRaw ? '/' + row.matlRaw : ''}${row.matlpCode ? '/' + row.matlpCode : ''}`
        }}</span>
      </template>
    </el-pro-table>
    <create-dialog ref="createDialog" @createSuccess="getList" />
    <user-dialog ref="userDialog" @selectChange="userSelectChange" />
    <user-dialog ref="userDialog2" @selectChange="userSelectChange2" />
  </div>
</template>

<script setup name="outbound-query">
import { columns, toolbarConfig } from "./tableJson"
import { getCookie } from '@/utils/auth'
import { getDateFirstDayLastDay } from '@/utils'
import { rmsList, rmstorInternalExportList } from '@/api/rmstor/outbound-maintenance'
const { proxy } = getCurrentInstance()
// import CreateDialog from "@/views/rmstor/outbound/outbound-maintenance-query/components/createDialog"
import CreateDialog from "@/views/rmstor/outbound/outbound-maintenance/components/createDialog"
import UserDialog from "@/views/components/userDialogQuery"
import { useTableSummaryFooter } from '@/composables/useTableSummaryFooter'
const proTableRef = ref()

import { onMounted } from "vue"
const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const columnsData = ref([])
const tableJsonList = ref([])


const dateStr = getCookie("warehouseYearMonth")
const data = reactive({
  defaultSearchForm: {
    dateType: '1',
    orderDate: [proxy.parseTime(getDateFirstDayLastDay(dateStr, 'firstDay'), "{y}-{m}-{d}"), proxy.parseTime(getDateFirstDayLastDay(dateStr, 'lastDay'), "{y}-{m}-{d}")],
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    dateType: '1',
    orderDate: [proxy.parseTime(getDateFirstDayLastDay(dateStr, 'firstDay'), "{y}-{m}-{d}"), proxy.parseTime(getDateFirstDayLastDay(dateStr, 'lastDay'), "{y}-{m}-{d}")],
  },
  plantList: [],
  summaryData: []
})

const { queryParams, summaryData, defaultSearchForm } = toRefs(data)

const { footerConfig } = useTableSummaryFooter({
  summaryData,
  columns: tableJsonList,
  proTableRef,
})

async function init() {
  columnsData.value = await columns()
  tableJsonList.value = columnsData.value.map(a => ({ ...a }))
}


/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...proxy.addDateRange(queryParams.value, queryParams.value.orderDate, 'orderDate') }
  delete params.orderDate
  rmsList(params).then(({ data }) => {
    tableData.value = data.defaultDataList || []
    total.value = data.total
    summaryData.value = [
      { label: '总金额：', value: data?.totalAmount || 0 },
      { label: '总数量', value: data?.totalNum || 0 },
    ]
  }).finally(() => {
    loading.value = false
  })

}

const groupByFieldObj = {
  'outBoundPlant': ['plantName', 'outNum', 'amount'],
  'outBoundDepot': ['depotName', 'outNum', 'amount'],
  'outBoundDept': ['deptName', 'outNum', 'amount'],
  'outBoundTeam': ['teamName', 'outNum', 'amount'],
  'matl': ['matlName', 'outNum', 'amount'],
  'outBoundCode': ['obCode', 'outNum', 'amount'],
  'outBoundIds': ['idsCode', , 'outNum', 'amount'],
  'outBoundIdd': ['iddCode', 'outNum', 'amount'],
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = {
    ...form, ...pageInfo, measures: [
      {
        "agg": "SUM",
        "field": "outBoundAmount"
      },
      {
        "agg": "SUM",
        "field": "outBoundNum"
      }
    ]
  }
  tableJsonList.value = columnsData.value.map(a => ({ ...a }))
  const groupByFieldList = form.groupBy || []

  if (groupByFieldList.length) {
    let isTrue = true
    groupByFieldList.forEach((val) => {
      if (isTrue) {
        tableJsonList.value.map(item => {
          item.hideInTable = true
          return item
        })
        isTrue = false
      }
      tableJsonList.value.map(item => {
        if (groupByFieldObj[val].includes(item.field)) {
          item.hideInTable = false
        }
        return item
      })
    })
  }
  getList()
}


/** 多选框选中数据 */
function onSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
}

const onAction = (payload) => {
  const { name, code, row, selectedRows, files } = payload
  const eventObj = {
    // 导出
    export: async () => {
      const params = { ...proxy.addDateRange(queryParams.value, queryParams.value.orderDate, 'orderDate') }
      delete params.orderDate
      const res = await rmstorInternalExportList({
        ...params,
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `出库单综合查询.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    link: () => {
      proxy.$refs.createDialog.show('details', row)
    }
  }
  eventObj[code] && eventObj[code]()
}

const handleFieldClick = (payload) => {
  const { fieldName } = payload
  const eventObj = {
    makerName: () => {
      proxy.$refs.userDialog.show()
    },
    noteName: () => {
      proxy.$refs.userDialog2.show()
    },

  }
  eventObj[fieldName] && eventObj[fieldName]()
}

const userSelectChange = (data) => {
  proTableRef.value?.setSearchForm({
    makerName: data[0].userName,
  })
}
const userSelectChange2 = (data) => {
  proTableRef.value?.setSearchForm({
    noteName: data[0].userName,
  })
}





onMounted(async () => {
  await init()
  getList()
})


</script>

<style lang="scss" scoped>
:deep(.ep-pro-table .ep-col-6:has(.ep-checkbox-group)) {
  flex: 0 0 75% !important;
  max-width: 75% !important;
}
// /* 隐藏 checkbox col 紧邻的后两个兄弟 col */
:deep(.ep-pro-table .ep-col-6:has(.ep-checkbox-group) + .ep-col-6),
:deep(.ep-pro-table .ep-col-6:has(.ep-checkbox-group) + .ep-col-6 + .ep-col-6) {
  display: none !important;
}

</style>