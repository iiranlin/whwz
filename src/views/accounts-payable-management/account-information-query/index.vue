<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :show-action="false" :data="tableData"
          :total="total" :columns="columns" :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
          <template #matlTypeSlot="{ row }">
            <span>{{`${row.matlType}${row.matlRaw?'/'+row.matlRaw:''}${row.matlpCode?'/'+row.matlpCode:''}`}}</span>
          </template>
          <template #onlyTaxAmount="{ row }">
            <span>{{ (row.taxAmount - row.noTaxAmount).toFixed(2) }}</span>
          </template>
        </el-pro-table>
      </el-col>
    </el-row>

    <back-dialog ref="backDialog" mtId="mtId" />
  </div>
</template>

<script setup name="account-information-query">
import { columns, toolbarConfig } from "./tableJson"
import { prePayGetShareNoDts, prePayExportShareNoDts } from '@/api/warehouse/prePay'
import BackDialog from "@/views/liquidation-management/wait-liquidation-material-check/components/backDialog"

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
})

const { queryParams } = toRefs(data)

/** 查询列表 */
function getList() {
  const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
  loading.value = true
  prePayGetShareNoDts(params).then(({ data }) => {
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

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    prePayNo: () => {
      proxy.$refs.backDialog.show('details', data, 'checkStatus')
    }
  }
  eventObj[code] && eventObj[code]()
}

const onAction = (payload) => {
  const { name, code, row, files } = payload
  const eventObj = {
    // 导出
    export: () => {
      const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
      proxy.$download.name(prePayExportShareNoDts, params)
    },
    link: () => {
      handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>