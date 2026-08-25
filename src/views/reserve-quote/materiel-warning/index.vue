<!-- 物资高低储预警  -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize" 
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch"  table-id="materiel-warning" :show-checkbox="true"
            :grid-options="{ rowId: 'mtId' }"  :show-action="false"/>
        <add-dialog v-model="visible" :rowData="rowData" @createSuccess="createSuccess" />
    </div>
</template>

<script setup name="materiel-warning">
import { normListPageWarning, plantDictList, warehouseDict, normListExportWarning } from '@/api/reserve-quote/materiel-maintenance'
import { columns } from './tableJson'
const columnsData = ref([])
const { proxy } = getCurrentInstance()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)

const queryParams = ref({
    pageNum: 1,
    pageSize: 30
})

const proTableRef = shallowRef(null)

const toolbarConfig = {
    buttons: [
        {
            code: 'export',
            name: '导出',
            type: 'primary',
            showInTop: true,
        },

    ]
}
const getList = async () => {
    loading.value = true
    normListPageWarning(queryParams.value).then(({ data }) => {
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
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        export: () => {
            const form = proTableRef.value?.getSearchForm?.()
            const params = proxy.addDateRange(Object.assign({}, form, { mtId: selectedRows.map(item => item.hrId)?.join(',') }))
            proxy.$download.name(normListExportWarning, params)
        },
    }
    eventObj[code] && eventObj[code]()
}
const init = async () => {
    columnsData.value = await columns
}
onMounted(() => {
    init()
    getList()
})

</script>
<style lang="scss" scoped></style>