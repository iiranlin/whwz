<!-- 验收记录查询 -->
<template>
    <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" :columns="columns" :page-size="queryParams.pageSize" action-width="150"
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch"  table-id="inspection-record" :show-checkbox="false"
            :grid-options="{ rowId: 'acId' }" />
        </el-col>
    </el-row>
        <DetailDialog v-model="historyVisible" :rowData="rowData" />
    </div>
</template>
<script setup name="inspection-record">
import DetailDialog from "./components/DetailDialog.vue"
import { paramConfigList, orderListExport } from '@/api/materialAccept/inspectionRecord'
import { columns } from './tableJson'
const { proxy } = getCurrentInstance()
const tableData = ref([])   
const loading = ref(false)
const total = ref(0)
const proTableRef = shallowRef(null)

const queryParams = ref({
    pageNum: 1,
    pageSize: 30
})


//按钮配置项
const toolbarConfig = {
    buttons: [
        {
            code: 'export',
            name: '导出',
            type: 'primary',
            showInTop: true,

        },
        {
            code: 'detail',
            name: '查看验收历史',
            type: 'primary',
            showInTop: false,
            showInRow: true,
        },
    ]
}

/** 查询角色列表 */
const getList = async () => {
    loading.value = true
    paramConfigList(queryParams.value).then(({ data }) => {
        tableData.value = data.list || []
        total.value = data.total
    }).finally(() => {
        loading.value = false
    })
}
const onSearch = (params, pageConfig) => {
    queryParams.value = { ...params, ...pageConfig }
    getList()
}
const historyVisible = ref(false)
const rowData = ref({})
// status 是否有效（1有效，0无效）
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        export: () => {
            const form = proTableRef.value?.getSearchForm?.()
            const params = proxy.addDateRange(Object.assign({}, form, { ids: selectedRows.map(item => item.acId)?.join(',') }))
            proxy.$download.name(orderListExport, params)
        },
        detail: () => {
            historyVisible.value = true
            rowData.value = row
        },
    }
    eventObj[code] && eventObj[code]()
}
onMounted(() => {
    getList()
})

</script>
<style lang="scss"></style>